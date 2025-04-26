// api/test-cron.js

// Vercel Serverless Function handler (Node.js runtime)
export default function handler(request, response) {
  const currentTime = new Date().toISOString();
  console.log(`[Test Cron] Job executed at: ${currentTime}`);

  // You could add calls to external APIs or databases here if needed

  response.status(200).send(`Test Cron Job executed successfully at ${currentTime}`);
} 