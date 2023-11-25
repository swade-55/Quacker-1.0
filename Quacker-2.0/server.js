const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const quackApi = require('./db'); // Replace with the correct path to your db module

const port = process.env.PORT || 3000;

const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API endpoint logic
  if (pathname === '/quacks' && req.method === 'GET') {
    try {
      const quacks = await quackApi.getAllQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(quacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/top-quacks' && req.method === 'GET') {
    try {
      const topQuacks = await quackApi.getTopFiveQuacks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(topQuacks));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/quacks' && req.method === 'POST') {
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
  } else if (pathname === '/delete-quack' && req.method === 'DELETE') {
    const quackId = parsedUrl.query.id;
    if (!quackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Missing quackId query parameter" }));
      return;
    }
    try {
      await quackApi.deletePost(quackId);
      res.writeHead(204);
      res.end();
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    } 
  } else if (pathname === '/increment-likes' && req.method === 'POST') {
    const quackId = parsedUrl.query.id;
    if (!quackId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Missing quackId query parameter" }));
      return;
    }
    try {
      const updatedQuack = await quackApi.incrementLikes(quackId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedQuack));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (pathname === '/add-comment' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { quackId, comment } = JSON.parse(body);
        if (!quackId || !comment) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Missing quackId or comment" }));
          return;
        }
        const result = await quackApi.addComment(quackId, comment);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    // Static file serving logic
fs.exists(path.join(__dirname, pathname), function (exist) {
  // path.join(__dirname, pathname) will resolve to the full absolute path
  if (!exist) {
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
    return;
  }

  let fullPath = pathname;

  // If is a directory, then look for index.html
  if (fs.statSync(path.join(__dirname, pathname)).isDirectory()) {
    fullPath = path.join(fullPath, 'index.html');
  }

  // Read file from file system
  fs.readFile(path.join(__dirname, fullPath), function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      // Based on the URL path, extract the file extension. e.g. .js, .doc, ...
      const ext = path.parse(fullPath).ext;
      // If the file is found, set Content-type and send data
      res.setHeader('Content-Type', mimeType[ext] || 'text/plain');
      res.end(data);
    }
  });
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
