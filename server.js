const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
  filePath = path.join(__dirname, filePath);
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.txt': 'text/plain'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(content);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
