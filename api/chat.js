import OpenAI from 'openai';
import { buildPortfolioContext } from './portfolio-context.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const assistantId = process.env.OPENAI_ASSISTANT_ID;

// Extract signal and suggestions from raw AI text
function parseSignalsAndSuggestions(rawText) {
  let textToSend = rawText;
  let signalToSend = null;
  let suggestions = [];
  let processedReply = rawText;

  const signals = {
    "[[SHOW_SKILLS]]": { signal: "SKILLS", intro: "Here's an overview of my key skills:" },
    "[[SHOW_EXPERIENCE]]": { signal: "EXPERIENCE", intro: "Here's a summary of my experience:" },
    "[[SHOW_SERVICES]]": { signal: "SERVICES", intro: "Here are the services I offer:" },
  };

  // 1. Check for signals
  for (const key in signals) {
    if (rawText.startsWith(key)) {
      signalToSend = signals[key].signal;
      textToSend = signals[key].intro;
      processedReply = rawText.substring(key.length).trim();
      break;
    }
  }

  // 2. Check for suggestions separator
  const suggestionSeparator = "\n\n---\n\nSuggestions:";
  const separatorIndex = processedReply.indexOf(suggestionSeparator);

  if (separatorIndex !== -1) {
    const suggestionsText = processedReply.substring(separatorIndex + suggestionSeparator.length).trim();
    suggestions = suggestionsText.split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);

    if (!signalToSend) {
      textToSend = processedReply.substring(0, separatorIndex).trim();
    }
  } else if (!signalToSend) {
    textToSend = rawText;
  }

  return { textToSend, signalToSend, suggestions };
}

export default async function handler(request, response) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST', 'OPTIONS']);
    response.statusCode = 405;
    response.end(`Method ${request.method} Not Allowed`);
    return;
  }

  if (!assistantId) {
    console.error("OPENAI_ASSISTANT_ID environment variable not set.");
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Assistant configuration missing.' }));
    return;
  }

  let threadId = null;

  try {
    const { message, threadId: clientThreadId } = request.body;

    if (!message) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'Message is required' }));
      return;
    }

    // Manage thread
    if (clientThreadId && typeof clientThreadId === 'string') {
      console.log(`Using existing thread ID: ${clientThreadId}`);
      threadId = clientThreadId;
    } else {
      console.log("No thread ID provided, creating new thread.");
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      console.log(`Created new thread ID: ${threadId}`);
    }

    // Add user message to thread
    console.log(`Adding message to thread ${threadId}:`, message);
    try {
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });
    } catch (err) {
      // Thread expired or not found — create a new one and retry
      if (err.status === 404 || err.code === 'thread_not_found') {
        console.log("Thread not found, creating new thread.");
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        await openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: message,
        });
      } else {
        throw err;
      }
    }

    // Set SSE headers
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.statusCode = 200;

    // Handle client disconnect
    let clientDisconnected = false;
    request.on?.('close', () => {
      clientDisconnected = true;
    });

    // Keep-alive interval during streaming
    const keepAlive = setInterval(() => {
      if (!clientDisconnected && !response.writableEnded) {
        response.write(':\n\n');
      }
    }, 5000);

    // Stream using openai.beta.threads.runs.stream()
    console.log(`Creating streaming run for thread ${threadId} with assistant ${assistantId}`);
    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      additional_instructions: buildPortfolioContext(),
    });

    let fullText = '';

    stream.on('textDelta', (delta) => {
      if (clientDisconnected) return;
      const chunk = delta.value || '';
      fullText += chunk;
      response.write(`event: token\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
    });

    stream.on('textDone', () => {
      clearInterval(keepAlive);
      if (clientDisconnected || response.writableEnded) return;

      // Handle empty response
      if (!fullText.trim()) {
        fullText = "I'm sorry, I couldn't generate a response. Please try again.";
      }

      const { textToSend, signalToSend, suggestions } = parseSignalsAndSuggestions(fullText);

      console.log("\n--- Debug: Stream Complete ---");
      console.log("Full Text:", JSON.stringify(fullText));
      console.log("Text to Send:", JSON.stringify(textToSend));
      console.log("Signal:", signalToSend);
      console.log("Suggestions:", JSON.stringify(suggestions));
      console.log("-----------------------------\n");

      response.write(`event: done\ndata: ${JSON.stringify({
        fullText: textToSend,
        signal: signalToSend ? signalToSend.toLowerCase() : null,
        suggestions,
        threadId,
      })}\n\n`);
      response.end();
    });

    stream.on('error', (error) => {
      clearInterval(keepAlive);
      console.error("Stream error:", error);
      if (clientDisconnected || response.writableEnded) return;
      response.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
      response.end();
    });

  } catch (error) {
    console.error("Error in /api/chat (Streaming):", error);
    if (!response.headersSent) {
      response.statusCode = error.status || 500;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({
        error: error.message || "An error occurred processing your chat request.",
        threadId: threadId,
      }));
    } else if (!response.writableEnded) {
      response.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
      response.end();
    }
  }
}
