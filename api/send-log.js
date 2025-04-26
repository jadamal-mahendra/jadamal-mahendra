import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// --- EmailJS Configuration ---
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
// Use the specific template ID for chat logs
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID_CHATLOG; 
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; 
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY; // Keep public key for template context if needed

// Template parameter names (should match your EmailJS template)
const EMAILJS_TEMPLATE_PARAM_CONVERSATION = 'conversation'; 
const EMAILJS_TEMPLATE_PARAM_THREAD_ID = 'thread_id'; 

export default async function handler(request, response) {
  // 1. Check Method
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    response.statusCode = 405;
    response.end(`Method ${request.method} Not Allowed`);
    return;
  }

  // 2. Basic Configuration Check
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PRIVATE_KEY) {
      console.error("EmailJS backend configuration missing (Service ID, Template ID, or Private Key).");
      response.statusCode = 500;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ success: false, error: 'Email configuration missing on server.' }));
      return;
  }

  // Allow CORS if needed for development
  response.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production!
  response.setHeader('Content-Type', 'application/json'); // Set response type

  try {
    // 3. Get data from request body
    const { fullHistory = [], threadId = 'N/A' } = request.body;

    if (!Array.isArray(fullHistory) || fullHistory.length === 0) {
       response.statusCode = 400;
       response.end(JSON.stringify({ success: false, error: 'Chat history is required.' }));
       return;
    }

    // 4. Format the chat log
    const formattedMessages = fullHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n------------------------------\n'); // Make separator clearer

    // 5. Prepare EmailJS template parameters
    const templateParams = {
      [EMAILJS_TEMPLATE_PARAM_CONVERSATION]: formattedMessages,
      [EMAILJS_TEMPLATE_PARAM_THREAD_ID]: threadId,
      // Add any other static parameters needed by your template
      // e.g., to_email: 'your_actual_email@example.com'
    };

    console.log(`Sending email via EmailJS Service: ${EMAILJS_SERVICE_ID}, Template: ${EMAILJS_TEMPLATE_ID}`);
    
    // 6. Send Email using Node.js SDK
    await emailjs.send( 
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams, 
        {
            publicKey: EMAILJS_PUBLIC_KEY, // Public key still needed here
            privateKey: EMAILJS_PRIVATE_KEY, // Provide the private key
        }
    );

    console.log('EmailJS send successful.');
    response.statusCode = 200;
    response.end(JSON.stringify({ success: true, message: 'Transcript sent successfully.' }));

  } catch (error) {
    console.error("Error sending email via EmailJS:", error);
    response.statusCode = error.status || 500;
    response.end(JSON.stringify({ 
        success: false, 
        error: `Failed to send transcript: ${error.text || error.message || 'Unknown error'}` 
    }));
  }
} 