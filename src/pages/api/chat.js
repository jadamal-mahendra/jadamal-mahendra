import OpenAI from 'openai';

// Initialize OpenAI client with the API key from environment variables
// Make sure OPENAI_API_KEY is set in your Vercel project environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

// Define the API route handler for POST requests
export const POST = async ({ request }) => {
  // Check if the OPENAI_API_KEY is available
  if (!import.meta.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({
      error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the request body
    const { message, history } = await request.json();

    // Basic validation
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct the messages array for the OpenAI API call
    // Start with a system message (optional, but often helpful)
    const messages = [
      {
        role: 'system',
        content: 'You are Jadamal Mahendra, a helpful assistant specialized in providing information about the Jain community, their culture, history, and philosophy. Respond concisely and accurately.'
      },
      // Add the history messages (ensure they are in the correct format)
      ...(history || []).map(msg => ({ role: msg.role, content: msg.content })),
      // Add the current user message
      { role: 'user', content: message },
    ];

    // Make the API call to OpenAI
    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo', // Or whichever model you prefer
        // max_tokens: 150, // Optional: Limit response length
        // temperature: 0.7, // Optional: Control randomness (0.1 to 1.0)
    });

    // Extract the reply from the response
    const reply = chatCompletion.choices[0]?.message?.content;

    if (!reply) {
        throw new Error("No reply content received from OpenAI.");
    }

    // Send the reply back to the client
    return new Response(JSON.stringify({ reply: reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Log the error for debugging
    console.error('Error calling OpenAI API:', error);

    // Determine the status code
    let statusCode = 500;
    if (error.response) {
        // Error from OpenAI API itself (e.g., rate limits, invalid request)
        statusCode = error.response.status;
    } else if (error instanceof SyntaxError) {
        // JSON parsing error
        statusCode = 400;
    }

    // Send a generic error response back to the client
    return new Response(JSON.stringify({
      error: `Failed to process chat message. ${error.message || 'Unknown error'}`
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 