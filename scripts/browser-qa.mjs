import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = process.env.QA_URL || "http://127.0.0.1:4173";
const edgeCandidates = [
  process.env.EDGE_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/microsoft-edge",
  "/usr/bin/google-chrome"
].filter(Boolean);
const { existsSync } = await import("node:fs");
const edgePath = edgeCandidates.find(existsSync);
if (!edgePath) throw new Error("No supported Edge or Chrome executable was found. Set EDGE_PATH to run rendered QA.");

const routes = [
  "/", "/services/", "/services/website-development/", "/services/web-application-development/", "/services/crm-development/", "/services/erp-business-systems/", "/services/saas-product-development/", "/services/custom-software-automation/", "/services/ui-ux-product-design/", "/services/maintenance-support/", "/solutions/", "/work/", "/work/project-template/", "/products/", "/products/operations-hub/", "/about/", "/contact/", "/legal/terms-and-conditions/", "/legal/privacy-policy/", "/legal/free-trial-terms/", "/legal/refund-cancellation-policy/", "/legal/saas-subscription-terms/", "/legal/cookie-policy/"
];

const routeResults = await Promise.all(routes.map(async (route) => {
  const response = await fetch(`${baseUrl}${route}`);
  return { route, ok: response.ok, status: response.status };
}));
const failedRoutes = routeResults.filter((item) => !item.ok);
if (failedRoutes.length) throw new Error(`Route checks failed: ${JSON.stringify(failedRoutes)}`);

const userDataDir = await mkdtemp(resolve(tmpdir(), "am-edge-"));
const artifacts = resolve(root, "qa-artifacts");
await mkdir(artifacts, { recursive: true });
const port = 9324 + Math.floor(Math.random() * 400);
const browser = spawn(edgePath, ["--headless", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, "about:blank"], { stdio: "ignore", windowsHide: true });

function delay(ms) { return new Promise((accept) => setTimeout(accept, ms)); }

let pages;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try { pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json()); if (pages.length) break; } catch { /* browser is starting */ }
  await delay(100);
}
if (!pages?.length) throw new Error("Could not connect to the browser debugging endpoint.");
const pageTarget = pages.find((page) => page.type === "page" && page.url.startsWith("about:")) || pages.find((page) => page.type === "page");
if (!pageTarget) throw new Error(`Could not find a browser page target: ${JSON.stringify(pages.map(({ type, url }) => ({ type, url })))}`);

const socket = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((accept, reject) => { socket.addEventListener("open", accept, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let messageId = 0;
const pending = new Map();
const browserErrors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) { const { accept, reject } = pending.get(message.id); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : accept(message.result); }
  if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text || "Uncaught browser exception");
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") browserErrors.push("Console error");
});

function cdp(method, params = {}) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((accept, reject) => pending.set(id, { accept, reject }));
}

async function evaluate(expression) {
  const result = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Browser evaluation failed");
  return result.result.value;
}

async function navigate(path, width, height) {
  await cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700, screenWidth: width, screenHeight: height });
  await cdp("Page.navigate", { url: `${baseUrl}${path}` });
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    ready = await evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState === "complete" && Boolean(document.querySelector("#app > *"))`);
    if (ready) break;
    await delay(100);
  }
  if (!ready) {
    const state = await evaluate(`({ href: location.href, title: document.title, ready: document.readyState, appLength: document.querySelector("#app")?.innerHTML.length || 0 })`);
    throw new Error(`Browser page did not become ready: ${JSON.stringify(state)}; errors: ${browserErrors.join(", ")}`);
  }
  await delay(250);
}

try {
  await cdp("Page.enable");
  await cdp("Runtime.enable");
  await navigate("/", 390, 844);
  const mobile = await evaluate(`(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    title: document.title,
    heading: document.querySelector("h1")?.textContent.trim(),
    menuVisible: getComputedStyle(document.querySelector(".menu-toggle")).display !== "none",
    blankLinks: [...document.querySelectorAll("a")].filter(a => !a.getAttribute("href") || a.getAttribute("href") === "#").length
  }))()`);
  if (mobile.scrollWidth > mobile.width) throw new Error(`Mobile overflow: viewport ${mobile.width}px, document ${mobile.scrollWidth}px.`);
  if (!mobile.menuVisible) throw new Error("Mobile menu control is not visible at 390px.");
  if (mobile.blankLinks) throw new Error(`${mobile.blankLinks} empty or placeholder links found.`);
  const menu = await evaluate(`(() => { const button = document.querySelector(".menu-toggle"); button.click(); return { expanded: button.getAttribute("aria-expanded"), open: document.querySelector("#primary-navigation").classList.contains("open") }; })()`);
  if (menu.expanded !== "true" || !menu.open) throw new Error("Mobile menu did not open correctly.");
  const mobileShot = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(resolve(artifacts, "home-mobile.png"), Buffer.from(mobileShot.data, "base64"));

  await navigate("/", 1440, 1000);
  const desktop = await evaluate(`({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, menuHidden: getComputedStyle(document.querySelector(".menu-toggle")).display === "none" })`);
  if (desktop.scrollWidth > desktop.width) throw new Error(`Desktop overflow: viewport ${desktop.width}px, document ${desktop.scrollWidth}px.`);
  if (!desktop.menuHidden) throw new Error("Desktop navigation did not replace the mobile control.");
  const desktopShot = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(resolve(artifacts, "home-desktop.png"), Buffer.from(desktopShot.data, "base64"));

  await navigate("/contact/", 390, 844);
  const contact = await evaluate(`(async () => {
    const form = document.querySelector("#project-form");
    form.elements.name.value = "Test User";
    form.elements.email.value = "test@example.com";
    form.elements.service.value = "website-development";
    form.elements.description.value = "This is a browser QA inquiry that is long enough for validation.";
    form.elements.formStartedAt.value = String(Date.now() - 5000);
    form.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 100));
    return { status: document.querySelector("#form-status").textContent.trim(), success: document.querySelector("#form-status").classList.contains("success"), overflow: document.documentElement.scrollWidth > innerWidth };
  })()`);
  if (contact.success || !contact.status.includes("No message was sent")) throw new Error("The unconfigured form did not show the required honest failure state.");
  if (contact.overflow) throw new Error("Contact page overflows at 390px.");

  await navigate("/services/crm-development/", 390, 844);
  const service = await evaluate(`({ title: document.title, heading: document.querySelector("h1")?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth, faqCount: document.querySelectorAll(".faq-item").length })`);
  if (service.heading !== "CRM Development" || service.faqCount < 3 || service.overflow) throw new Error(`CRM service route failed QA: ${JSON.stringify(service)}`);
  if (browserErrors.length) throw new Error(`Browser errors detected: ${browserErrors.join(", ")}`);

  console.log(JSON.stringify({ routes: routeResults.length, mobile, desktop, contactStatusVerified: true, crmServiceVerified: true, browserErrors: 0, screenshots: [resolve(artifacts, "home-mobile.png"), resolve(artifacts, "home-desktop.png")] }, null, 2));
} finally {
  socket.close();
  browser.kill();
  await delay(200);
  await rm(userDataDir, { recursive: true, force: true });
}
