import OpenAI from 'openai';

// IMPORTANT: Store your API key securely in Vercel Environment Variables
// DO NOT hardcode it here.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  try {
    // Get user message and optional chat history from request body
    // Vercel automatically parses JSON bodies
    const { message, history = [] } = request.body;

    if (!message) {
      return response.status(400).json({ error: 'Message is required in the request body.' });
    }

    // --- Construct the prompt for OpenAI --- 
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant representing Jadamal Mahendra on his portfolio website. 
                 Your goal is to answer questions about Jadamal's skills, experience, projects, and potentially schedule meetings or provide contact info, based on the context of his portfolio. 
                 Be friendly, professional, and concise. Do not invent information not present in typical portfolio content.
                 Key skills include: React, Node.js, Web3 (Solidity, DApps), React Native, JavaScript, TypeScript.
                 Key experience: Lead Software Developer roles (mention companies if known from context).`
                 // TODO: Consider dynamically adding more specific portfolio context here if needed.
    };

    // Combine system prompt, history, and new user message
    // Ensure history is formatted correctly (array of { role: 'user'/'assistant', content: '...' })
    const messages = [
      systemMessage,
      ...history, // Spread previous valid messages
      { role: 'user', content: message }
    ];

    // --- Call OpenAI API --- 
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or gpt-4 if preferred/available
      messages: messages,
      // Optional parameters:
      // temperature: 0.7, // Controls randomness (0=deterministic, 1=more random)
      // max_tokens: 150, // Limit response length
    });

    const aiReply = chatCompletion.choices[0]?.message?.content;

    if (!aiReply) {
        console.error("OpenAI response missing content:", chatCompletion);
        throw new Error("AI response was empty.");
    }

    // --- Send response back to frontend --- 
    return response.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    // Provide a generic error message to the frontend for security
    const errorMessage = error.response?.data?.error?.message || error.message || "An error occurred processing your chat request.";
    const statusCode = error.response?.status || 500;
    return response.status(statusCode).json({ error: `Sorry, I encountered an error. ${error.status === 429 ? 'Please try again later.' : ''}` }); // Give specific feedback for rate limits if possible
  }
} 