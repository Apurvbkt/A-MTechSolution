import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
const siteUrl = (process.env.SITE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const basePath = process.env.BASE_PATH && process.env.BASE_PATH !== "/" ? `/${process.env.BASE_PATH.replace(/^\/+|\/+$/g, "")}` : "";

const routes = [
  ["/", "A&M Tech Solutions — Digital products that move business forward", "Websites, business systems, and custom software built around the way you work."],
  ["/services/", "Services — A&M Tech Solutions", "Website, web application, CRM, ERP, SaaS, automation, product design, and support services."],
  ["/services/website-development/", "Website Development — A&M Tech Solutions", "Fast, distinctive websites that make the business clear and the next step obvious."],
  ["/services/web-application-development/", "Web Application Development — A&M Tech Solutions", "Purpose-built portals, internal tools, and workflow applications for real operational needs."],
  ["/services/crm-development/", "CRM Development — A&M Tech Solutions", "Customer and sales systems shaped around the way your team actually follows up."],
  ["/services/erp-business-systems/", "ERP & Business Systems — A&M Tech Solutions", "Connected inventory, procurement, operations, and reporting built around real workflows."],
  ["/services/saas-product-development/", "SaaS Product Development — A&M Tech Solutions", "A structured path from product idea to a secure, usable subscription software foundation."],
  ["/services/custom-software-automation/", "Custom Software & Automation — A&M Tech Solutions", "Practical systems and integrations that remove repetitive work and connect useful tools."],
  ["/services/ui-ux-product-design/", "UI/UX & Product Design — A&M Tech Solutions", "Clear interfaces and resilient design systems for products people use every day."],
  ["/services/maintenance-support/", "Maintenance & Technical Support — A&M Tech Solutions", "Agreed support for the fixes, improvements, and operational care a live product needs."],
  ["/solutions/", "Business Solutions — A&M Tech Solutions", "Practical software directions for startups, small businesses, operations, retail, services, and growing companies."],
  ["/work/", "Work — A&M Tech Solutions", "A verified portfolio structure for A&M Tech Solutions projects and case studies."],
  ["/work/project-template/", "Project Case Study Template — A&M Tech Solutions", "The project detail template for future verified case studies."],
  ["/products/", "Products — A&M Tech Solutions", "Current product concepts and future software categories from A&M Tech Solutions."],
  ["/products/operations-hub/", "Operations Hub — A&M Tech Solutions", "A coming-soon operations workspace concept. No public release or trial is currently available."],
  ["/about/", "About — A&M Tech Solutions", "A&M Tech Solutions turns complex business needs into clear, maintainable digital products."],
  ["/contact/", "Start a Project — A&M Tech Solutions", "Tell A&M Tech Solutions about the business problem, website, application, or system you need to build."],
  ["/legal/terms-and-conditions/", "Terms & Conditions — A&M Tech Solutions", "Draft terms requiring legal review before publication."],
  ["/legal/privacy-policy/", "Privacy Policy — A&M Tech Solutions", "Draft privacy policy reflecting the current marketing website."],
  ["/legal/free-trial-terms/", "Free Trial Terms — A&M Tech Solutions", "Draft future product trial terms. No public product trial is currently active."],
  ["/legal/refund-cancellation-policy/", "Refund & Cancellation Policy — A&M Tech Solutions", "Draft refund and cancellation structure requiring legal review."],
  ["/legal/saas-subscription-terms/", "SaaS Subscription Terms — A&M Tech Solutions", "Draft future software subscription terms. No subscription product is currently represented."],
  ["/legal/cookie-policy/", "Cookie Policy — A&M Tech Solutions", "Draft cookie policy reflecting a website without intentional advertising or analytics cookies."]
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "src"), resolve(output, "src"), { recursive: true });
await cp(resolve(root, "public"), output, { recursive: true });
const siteConfig = (await readFile(resolve(root, "site-config.js"), "utf8")).replace('basePath: ""', `basePath: "${basePath}"`);
await writeFile(resolve(output, "site-config.js"), siteConfig);

const sourceHtml = await readFile(resolve(root, "index.html"), "utf8");

function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function htmlForRoute(route, title, description) {
  const url = `${siteUrl}${route}`;
  return sourceHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeAttribute(description)}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeAttribute(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeAttribute(description)}" />`)
    .replace('content="/brand-card.svg"', `content="${siteUrl}/brand-card.svg"`)
    .replace('href="/favicon.svg"', `href="${basePath}/favicon.svg"`)
    .replace('href="/src/styles.css"', `href="${basePath}/src/styles.css"`)
    .replace('src="/site-config.js"', `src="${basePath}/site-config.js"`)
    .replace('src="/src/app.js"', `src="${basePath}/src/app.js"`)
    .replace("<link rel=\"icon\"", `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n    <link rel="icon"`);
}

for (const [route, title, description] of routes) {
  const directory = route === "/" ? output : resolve(output, route.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, "index.html"), htmlForRoute(route, title, description));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(([route]) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(output, "sitemap.xml"), sitemap);
await writeFile(resolve(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
await writeFile(resolve(output, "404.html"), htmlForRoute("/404/", "Page Not Found — A&M Tech Solutions", "The requested page could not be found."));

console.log(`Built ${routes.length} routes in ${output}`);
console.log(`Canonical site URL: ${siteUrl}`);
console.log(`Deployment base path: ${basePath || "/"}`);
