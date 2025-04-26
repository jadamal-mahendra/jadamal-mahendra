import http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.API_PORT || 3002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths to API route handlers
const chatApiRoutePath = path.join(__dirname, 'api', 'chat.js');
const sendLogApiRoutePath = path.join(__dirname, 'api', 'send-log.js'); // Path for new handler

const server = http.createServer(async (req, res) => {
  console.log(`[Server] Received request: ${req.method} ${req.url}`);

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      let handlerPath;
      // Determine which handler to use based on URL
      if (req.method === 'POST' && req.url === '/api/chat') {
        handlerPath = chatApiRoutePath;
      } else if (req.method === 'POST' && req.url === '/api/send-log') { // Route for sending log
        handlerPath = sendLogApiRoutePath;
      } else {
        // Handle other routes or methods if necessary, or return 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return; // Stop processing if route not found
      }

      const handlerFileURL = pathToFileURL(handlerPath).href;
      const modulePathWithTimestamp = `${handlerFileURL}?t=${Date.now()}`;
      const { default: handler } = await import(modulePathWithTimestamp);

      // Prepare mock request object (body parsing needed for both handlers)
      const mockRequest = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: JSON.parse(body || '{}'), 
      };
      
      // Pass the REAL response object directly to the chosen handler
      await handler(mockRequest, res);

    } catch (error) {
      console.error('[Server] Error processing request:', error);
      if (!res.writableEnded) { 
          try {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal Server Error handling API request.' }));
          } catch (e) {
              console.error('[Server] Error sending 500 response:', e);
          }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Server] API server listening on http://localhost:${PORT}`);
}); 