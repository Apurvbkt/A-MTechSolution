import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicRoot = resolve(root, "public");
const gsapRoot = resolve(root, "node_modules", "gsap", "dist");
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".json": "application/json; charset=utf-8" };

async function readFrom(base, requestPath) {
  let file = resolve(base, `.${requestPath}`);
  if (!file.startsWith(`${base}${sep}`) && file !== base) throw new Error("Invalid path");
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    return { file, body: await readFile(file) };
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const requestPath = decodeURIComponent(url.pathname);
    const vendorMatch = requestPath.startsWith("/vendor/") ? await readFrom(gsapRoot, requestPath.slice("/vendor".length)) : null;
    const match = vendorMatch || await readFrom(root, requestPath) || await readFrom(publicRoot, requestPath);
    const file = match?.file || resolve(root, "index.html");
    const body = match?.body || await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" });
    response.end(body);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
  }
});

server.listen(port, host, () => console.log(`A&M Tech Solutions dev server: http://${host}:${port}`));
