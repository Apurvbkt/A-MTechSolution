import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { routes } from "./routes.mjs";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist-github");
const targetUrl = (process.env.TARGET_URL || "https://amteches.in").replace(/\/$/, "");
const repositoryPath = String(process.env.BASE_PATH || "/A-MTechSolution").replace(/\/$/, "");

function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function redirectHtml(target) {
  const safeTarget = escapeAttribute(target);
  const serializedTarget = JSON.stringify(target).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="refresh" content="0; url=${safeTarget}" />
    <meta name="application-name" content="A&amp;M Tech Solutions IND" />
    <meta property="og:site_name" content="A&amp;M Tech Solutions IND" />
    <link rel="canonical" href="${safeTarget}" />
    <title>A&amp;M Tech Solutions — Moved to amteches.in</title>
    <script>location.replace(${serializedTarget});</script>
  </head>
  <body>
    <p>A&amp;M Tech Solutions has moved to <a href="${safeTarget}">${safeTarget}</a>.</p>
  </body>
</html>
`;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const [route] of routes) {
  const directory = route === "/" ? output : resolve(output, route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), redirectHtml(`${targetUrl}${route}`));
}

const fallbackTarget = `${targetUrl}/`;
const fallback = redirectHtml(fallbackTarget).replace(
  `<script>location.replace(${JSON.stringify(fallbackTarget)});</script>`,
  `<script>
      const repositoryPath = ${JSON.stringify(repositoryPath)};
      const path = location.pathname.startsWith(repositoryPath)
        ? location.pathname.slice(repositoryPath.length) || "/"
        : "/";
      location.replace(${JSON.stringify(targetUrl)} + path + location.search + location.hash);
    </script>`
);
await writeFile(resolve(output, "404.html"), fallback);
await writeFile(resolve(output, "robots.txt"), "User-agent: *\nAllow: /\n");

console.log(`Built ${routes.length} GitHub Pages redirects in ${output}`);
console.log(`Redirect target: ${targetUrl}`);
