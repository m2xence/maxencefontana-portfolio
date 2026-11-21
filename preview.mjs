import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const directory = new URL('./public/', import.meta.url);
const types = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', webp: 'image/webp', avif: 'image/avif', jpg: 'image/jpeg', png: 'image/png' };

createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  const name = path === '/' ? 'index.html' : path.slice(1);
  const extension = name.split('.').at(-1);
  try {
    if (!/^(?:images\/)?[\w.-]+$/.test(name) || !Object.hasOwn(types, extension)) throw new Error('Unknown route');
    const file = await readFile(new URL(name, directory));
    response.writeHead(200, { 'Content-Type': types[extension] }).end(file);
  } catch {
    const fallback = await readFile(new URL('404.html', directory));
    response.writeHead(404, { 'Content-Type': types.html }).end(fallback);
  }
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
