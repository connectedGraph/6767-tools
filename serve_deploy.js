// Clean-URL static server for deploy/. Usage: node serve_deploy.js [port] [dir]
// Maps /route -> /route.html, / -> index.html, mirroring the original site's server.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.argv[2] || 8080);
const ROOT = path.resolve(process.argv[3] || __dirname);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json', '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8',
};

function resolveFile(urlPath) {
  // strip query/hash, decode
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p += 'index.html';   // '/' -> '/index.html', '/brain/' -> '/brain/index.html'
  if (p === '/index.html' || p === 'index.html') return 'pages/index.html';
  if (!path.extname(p)) {
    // clean URL: try pages/<p>.html, then pages/<p>/index.html
    if (fs.existsSync(path.join(ROOT, 'pages', p + '.html'))) return 'pages/' + p + '.html';
    if (fs.existsSync(path.join(ROOT, 'pages', p, 'index.html'))) return 'pages/' + p + '/index.html';
  }
  return p;   // 有扩展名（/js/... /lib/... /favicon.ico）直接从 ROOT 读
}

const server = http.createServer((req, res) => {
  const rel = resolveFile(req.url);
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(`404: ${rel}`);
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => console.log(`deploy server on http://localhost:${PORT}/  (root ${ROOT})`));
