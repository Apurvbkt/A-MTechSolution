import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".json": "application/json; charset=utf-8" };

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const requestPath = decodeURIComponent(url.pathname);
    let file = resolve(root, `.${requestPath}`);
    if (!file.startsWith(`${root}${sep}`) && file !== root) throw new Error("Invalid path");
    try { if ((await stat(file)).isDirectory()) file = resolve(file, "index.html"); } catch { /* use SPA fallback */ }
    let body;
    try { body = await readFile(file); } catch { file = resolve(root, "index.html"); body = await readFile(file); }
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" });
    response.end(body);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
  }
});

server.listen(port, host, () => console.log(`A&M Tech Solutions dev server: http://${host}:${port}`));
