import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Get OpenAI client and Assistant ID
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const assistantId = process.env.OPENAI_ASSISTANT_ID; // Read Assistant ID from .env

// Helper function to read context files safely (REMOVED - Context is now in Assistant Instructions)
/*
const readContextFile = (relativeApiPath) => { ... };
*/

// Helper function for polling Run status
const waitForRunCompletion = async (threadId, runId) => {
  let currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
  const startTime = Date.now();
  const timeout = 60000; // 60 seconds timeout for the run

  while (currentRun.status === 'queued' || currentRun.status === 'in_progress') {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Assistant Run timed out after ${timeout / 1000} seconds.`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1 second
    currentRun = await openai.beta.threads.runs.retrieve(threadId, runId);
    console.log(`[Run ${runId}] Status: ${currentRun.status}`);
  }

  if (currentRun.status !== 'completed') {
    console.error(`[Run ${runId}] Failed. Details:`, currentRun.last_error);
    throw new Error(`Assistant Run failed with status: ${currentRun.status}. Error: ${currentRun.last_error?.message || 'Unknown error'}`);
  }
  console.log(`[Run ${runId}] Completed successfully.`);
  return currentRun;
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    response.statusCode = 405;
    response.end(`Method ${request.method} Not Allowed`);
    return;
  }

  // Check if Assistant ID is configured
  if (!assistantId) {
     console.error("OPENAI_ASSISTANT_ID environment variable not set.");
     response.statusCode = 500;
     response.setHeader('Content-Type', 'application/json');
     response.end(JSON.stringify({ error: 'Assistant configuration missing.' }));
     return;
  }

  // --- REMOVE SSE Headers --- 
  // response.setHeader('Content-Type', 'text/event-stream'); 
  // ... other SSE headers ...

  // --- Set Standard JSON Header --- 
  response.setHeader('Content-Type', 'application/json');
  // Allow CORS if needed for development
  response.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production!

  let threadId = null; // Initialize threadId

  try {
    // --- Get message and threadId from request body (Remove history) --- 
    const { message, threadId: clientThreadId } = request.body;

    if (!message) {
       response.statusCode = 400;
       response.setHeader('Content-Type', 'application/json');
       response.end(JSON.stringify({ error: 'Message is required' }));
       return;
    }

    // --- Manage Thread --- 
    if (clientThreadId && typeof clientThreadId === 'string') {
        console.log(`Using existing thread ID: ${clientThreadId}`);
        threadId = clientThreadId;
        // Optional: Validate thread exists? Could add openai.beta.threads.retrieve(threadId)
    } else {
        console.log("No thread ID provided, creating new thread.");
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        console.log(`Created new thread ID: ${threadId}`);
    }

    // --- Add User Message to Thread --- 
    console.log(`Adding message to thread ${threadId}:`, message);
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });

    // --- Create and Run Assistant --- 
    console.log(`Creating run for thread ${threadId} with assistant ${assistantId}`);
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      // Instructions are now part of the Assistant definition,
      // but can be overridden here if needed:
      // instructions: "Override instructions for this run..."
    });
    console.log(`Run created with ID: ${run.id}, Status: ${run.status}`);

    // --- Wait for Run Completion --- 
    await waitForRunCompletion(threadId, run.id);

    // --- Retrieve Latest Assistant Message --- 
    console.log(`Retrieving messages for thread ${threadId} after run ${run.id}`);
    const threadMessages = await openai.beta.threads.messages.list(threadId, {
        order: 'desc', // Get latest messages first
        limit: 1 // We only need the very latest message
    });
    
    // The latest message should be the assistant's response
    const latestMessage = threadMessages.data[0];
    let rawAiReply = "";
    if (latestMessage && latestMessage.role === 'assistant' && latestMessage.content[0]?.type === 'text') {
        rawAiReply = latestMessage.content[0].text.value;
        console.log("Received Assistant reply:", rawAiReply);
    } else {
        console.error("Could not find a valid assistant text response.", threadMessages.data);
        // Consider if threadMessages.data might contain other useful info like errors
        throw new Error("Assistant did not return a valid text response.");
    }

    // --- Post-process Accumulated AI Response (Same logic as before, adjusted parsing) --- 
    let textToSend = rawAiReply;
    let signalToSend = null;
    let suggestions = [];
    let processedReply = rawAiReply; // Use temp var for parsing

    const signals = {
      "[[SHOW_SKILLS]]": { signal: "SKILLS", intro: "Here's an overview of my key skills:" },
      "[[SHOW_EXPERIENCE]]": { signal: "EXPERIENCE", intro: "Here's a summary of my experience:" },
      "[[SHOW_SERVICES]]": { signal: "SERVICES", intro: "Here are the services I offer:" },
    };

    // 1. Check for Signals and potentially set initial textToSend
    for (const key in signals) {
        if (rawAiReply.startsWith(key)) { 
            signalToSend = signals[key].signal;
            textToSend = signals[key].intro; // Set the final text to the intro
            processedReply = rawAiReply.substring(key.length).trim(); // Remove signal for suggestion parsing
            break; 
        }
    }

    // 2. Check for Suggestions Separator in the potentially modified 'processedReply'
    const suggestionSeparator = "\n\n---\n\nSuggestions:";
    
    // Use processedReply here which might have had the signal tag removed
    const separatorIndex = processedReply.indexOf(suggestionSeparator);

    if (separatorIndex !== -1) {
        // Suggestions found, parse them
        const suggestionsText = processedReply.substring(separatorIndex + suggestionSeparator.length).trim();
        suggestions = suggestionsText.split('\n')
                                   .map(line => line.replace(/^\d+\.\s*/, '').trim())
                                   .filter(line => line.length > 0);
                                   
        // CRITICAL CHANGE: Always update textToSend to exclude the suggestions block,
        // regardless of whether a signal was present.
        if (!signalToSend) {
             textToSend = processedReply.substring(0, separatorIndex).trim(); 
        }
        
    } else if (!signalToSend) {
        // No separator AND no signal, textToSend remains the full raw AI reply
        textToSend = rawAiReply;
    }
    // If a signal WAS found but NO separator, textToSend remains the generic intro set earlier.
    // If suggestions were parsed, textToSend was correctly handled above.

    // --- Send Final JSON Response (including threadId) --- 
    const finalPayload = { 
        text: textToSend, 
        signal: signalToSend, 
        suggestions: suggestions, 
        threadId: threadId
    };
    // ADD DEBUG LOGGING
    console.log("\n--- Debug: Final Payload --- ");
    console.log("Text to Send:", JSON.stringify(textToSend));
    console.log("Suggestions Array:", JSON.stringify(suggestions));
    console.log("---------------------------\n");
    
    response.end(JSON.stringify(finalPayload));
    return;

  } catch (error) {
    console.error("Error in /api/chat (Assistant API):", error);
    const errorPayload = { 
        error: error.message || "An error occurred processing your chat request.",
        threadId: threadId
    };
    // Avoid sending headers/status twice if already sent (e.g., if error happens after starting response)
    if (!response.headersSent) {
        response.statusCode = error.status || 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(errorPayload));
    } else if (!response.writableEnded) {
        console.error("Headers already sent, attempting to end response after error.");
        response.end();
    }
  }
} 