import http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.API_PORT || 3002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your API route handler
const apiRoutePath = path.join(__dirname, 'api', 'chat.js');

const server = http.createServer(async (req, res) => {
  console.log(`[Server] Received request: ${req.method} ${req.url}`);

  // Only handle POST requests to /api/chat
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });

    req.on('end', async () => {
      try {
        // Convert the file path to a file URL
        const apiRouteFileURL = pathToFileURL(apiRoutePath).href;

        // Dynamically import the handler function using the file URL
        // Adding a timestamp to bypass potential caching issues during dev
        const modulePathWithTimestamp = `${apiRouteFileURL}?t=${Date.now()}`;
        const { default: handler } = await import(modulePathWithTimestamp);

        // Prepare mock Vercel-like request and response objects
        const mockRequest = {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: JSON.parse(body || '{}'), // Vercel parses body, so we do too
        };

        let statusCode = 200;
        let responseBody = {};
        const headers = { 'Content-Type': 'application/json' };

        const mockResponse = {
          status: (code) => {
            statusCode = code;
            return mockResponse; // Allow chaining
          },
          json: (data) => {
            responseBody = data;
            // End the actual response when .json() is called
            res.writeHead(statusCode, headers);
            res.end(JSON.stringify(responseBody));
          },
          setHeader: (key, value) => {
            headers[key] = value;
          },
          end: (message) => {
             // Handle cases where handler uses .end() directly
            if (!res.writableEnded) {
                 if (typeof message === 'string' && !headers['Content-Type']) {
                     headers['Content-Type'] = 'text/plain';
                 }
                 res.writeHead(statusCode, headers);
                 res.end(message);
             }
          },
        };

        // Call the handler
        await handler(mockRequest, mockResponse);

      } catch (error) {
        console.error('[Server] Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error handling API request.' }));
      }
    });

  } else {
    // Handle other routes or methods if necessary, or return 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`[Server] API server listening on http://localhost:${PORT}`);
}); 