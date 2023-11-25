const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const quackApi = require('./db'); // Assuming this is your custom module for database operations

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/quacks' && req.method === 'GET') {
    // Handle GET request for '/quacks'
    try {
      const quacks = await quackApi.getAllQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(quacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/quacks' && req.method === 'POST') {
    // Handle POST request for '/quacks'
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const quackData = JSON.parse(body);
        const newQuack = await quackApi.addNewQuack(quackData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newQuack));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else if (pathname === '/top-quacks' && req.method === 'GET') {
    // Handle GET request for '/top-quacks'
    try {
      const topQuacks = await quackApi.getTopFiveQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(topQuacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/delete-quack' && req.method === 'DELETE') {
    // Handle DELETE request for '/delete-quack'
    const quackId = parsedUrl.query.id;
    try {
      await quackApi.deletePost(quackId);
      const quacks = await quackApi.getAllQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(quacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/increment-likes' && req.method === 'POST') {
    // Handle POST request for '/increment-likes'
    const quackId = parsedUrl.query.id;
    try {
      const updatedQuack = await quackApi.incrementLikes(quackId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedQuack));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/add-comment' && req.method === 'POST') {
    // Handle POST request for '/add-comment'
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { quackId, comment } = JSON.parse(body);
        const updatedQuack = await quackApi.addComment(quackId, comment);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedQuack));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    // Serve static files
    let filePath = path.join(__dirname, 'src', pathname === '/' ? 'index.html' : pathname);
    const ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      // Add more cases for other file types if needed
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code == 'ENOENT') {
          // Page not found
          res.writeHead(404);
          res.end('Page not found');
        } else {
          // Some server error
          res.writeHead(500);
          res.end('Server error');
        }
      } else {
        // Success
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
