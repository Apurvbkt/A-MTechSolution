import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { routes } from "./routes.mjs";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
const siteUrl = (process.env.SITE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const basePath = process.env.BASE_PATH && process.env.BASE_PATH !== "/" ? `/${process.env.BASE_PATH.replace(/^\/+|\/+$/g, "")}` : "";
const assetVersion = String(process.env.ASSET_VERSION || process.env.COMMIT_REF || process.env.GITHUB_SHA || "").trim().slice(0, 12);
const assetSuffix = assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : "";

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "src"), resolve(output, "src"), { recursive: true });
await cp(resolve(root, "public"), output, { recursive: true });
await mkdir(resolve(output, "vendor"), { recursive: true });
await cp(resolve(root, "node_modules", "gsap", "dist", "gsap.min.js"), resolve(output, "vendor", "gsap.min.js"));
await cp(resolve(root, "node_modules", "gsap", "dist", "ScrollToPlugin.min.js"), resolve(output, "vendor", "ScrollToPlugin.min.js"));
await cp(resolve(root, "node_modules", "gsap", "dist", "ScrollTrigger.min.js"), resolve(output, "vendor", "ScrollTrigger.min.js"));
await mkdir(resolve(output, "fonts"), { recursive: true });
await cp(resolve(root, "node_modules", "@fontsource-variable", "instrument-sans", "files", "instrument-sans-latin-wght-normal.woff2"), resolve(output, "fonts", "instrument-sans-latin-wght-normal.woff2"));
for (const weight of [400, 500, 600]) {
  await cp(resolve(root, "node_modules", "@fontsource", "ibm-plex-mono", "files", `ibm-plex-mono-latin-${weight}-normal.woff2`), resolve(output, "fonts", `ibm-plex-mono-latin-${weight}-normal.woff2`));
}
if (assetSuffix) {
  const builtAppPath = resolve(output, "src", "app.js");
  const builtApp = (await readFile(builtAppPath, "utf8")).replace('from "./content.js"', `from "./content.js${assetSuffix}"`);
  await writeFile(builtAppPath, builtApp);
}
const siteConfig = (await readFile(resolve(root, "site-config.js"), "utf8")).replace('basePath: ""', `basePath: "${basePath}"`);
await writeFile(resolve(output, "site-config.js"), siteConfig);

const sourceHtml = await readFile(resolve(root, "index.html"), "utf8");
globalThis.AM_SITE_CONFIG = { basePath };
const { renderStaticApp } = await import("../src/app.js");
delete globalThis.AM_SITE_CONFIG;

function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function structuredDataForRoute(route, title, description) {
  const organizationId = `${siteUrl}/#organization`;
  const graph = [{
    "@type": "Organization",
    "@id": organizationId,
    name: "A&M Tech Solutions",
    alternateName: ["A&M Tech Solutions India", "amteches.in"],
    url: `${siteUrl}/`,
    logo: `${siteUrl}/brand-card.svg${assetSuffix}`,
    email: "hello.amtechsolutions@outlook.com",
    telephone: "+91 70043 75813",
    description: "A creative technology studio in Jamshedpur, Jharkhand building websites, web applications, business systems, and custom software.",
    areaServed: [
      { "@type": "City", name: "Jamshedpur" },
      { "@type": "AdministrativeArea", name: "Jharkhand" },
      { "@type": "Country", name: "India" }
    ],
    knowsAbout: ["Website development", "Web application development", "Custom software development", "Business management systems", "UI and UX design"]
  }];

  if (route === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "A&M Tech Solutions",
      alternateName: ["A&M Tech Solutions India", "amteches.in"],
      publisher: { "@id": organizationId },
      inLanguage: "en-IN"
    });
  }

  if (/^\/services\/[^/]+\/$/.test(route)) {
    graph.push({
      "@type": "Service",
      "@id": `${siteUrl}${route}#service`,
      name: title.split(" — ")[0],
      description,
      url: `${siteUrl}${route}`,
      provider: { "@id": organizationId },
      areaServed: [
        { "@type": "City", name: "Jamshedpur" },
        { "@type": "AdministrativeArea", name: "Jharkhand" },
        { "@type": "Country", name: "India" }
      ]
    });
  }

  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;
}

function htmlForRoute(route, title, description) {
  const url = `${siteUrl}${route}`;
  const staticApp = renderStaticApp(route);
  return sourceHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeAttribute(description)}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeAttribute(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeAttribute(description)}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeAttribute(title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeAttribute(description)}" />`)
    .replace('<meta property="og:image" content="/social-card.png" />', `<meta property="og:image" content="${siteUrl}/social-card.png${assetSuffix}" />`)
    .replace('<meta name="twitter:image" content="/social-card.png" />', `<meta name="twitter:image" content="${siteUrl}/social-card.png${assetSuffix}" />`)
    .replace('href="/favicon.svg"', `href="${basePath}/favicon.svg${assetSuffix}"`)
    .replace('href="/src/styles.css?v=dev-6"', `href="${basePath}/src/styles.css${assetSuffix}"`)
    .replace('src="/vendor/gsap.min.js"', `src="${basePath}/vendor/gsap.min.js${assetSuffix}"`)
    .replace('src="/vendor/ScrollToPlugin.min.js"', `src="${basePath}/vendor/ScrollToPlugin.min.js${assetSuffix}"`)
    .replace('src="/vendor/ScrollTrigger.min.js"', `src="${basePath}/vendor/ScrollTrigger.min.js${assetSuffix}"`)
    .replace('src="/site-config.js?v=dev-6"', `src="${basePath}/site-config.js${assetSuffix}"`)
    .replace('src="/src/app.js?v=dev-6"', `src="${basePath}/src/app.js${assetSuffix}"`)
    .replace('<div id="app"></div>', `<div id="app">${staticApp}</div>`)
    .replace("<link rel=\"icon\"", `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n    <link rel="icon"`)
    .replace("</head>", `    ${structuredDataForRoute(route, title, description)}\n  </head>`);
}

for (const [route, title, description] of routes) {
  const directory = route === "/" ? output : resolve(output, route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), htmlForRoute(route, title, description));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(([route]) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(output, "sitemap.xml"), sitemap);
await writeFile(resolve(output, "sitemap.txt"), `${routes.map(([route]) => `${siteUrl}${route}`).join("\n")}\n`);
await writeFile(resolve(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\nSitemap: ${siteUrl}/sitemap.txt\n`);
await writeFile(resolve(output, "404.html"), htmlForRoute("/404/", "Page Not Found — A&M Tech Solutions", "The requested page could not be found."));

console.log(`Built ${routes.length} routes in ${output}`);
console.log(`Canonical site URL: ${siteUrl}`);
console.log(`Deployment base path: ${basePath || "/"}`);
console.log(`Asset version: ${assetVersion || "unversioned"}`);
