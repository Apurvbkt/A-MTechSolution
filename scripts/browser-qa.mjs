import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const qaUrl = new URL(process.env.QA_URL || "http://127.0.0.1:4173");
const baseUrl = qaUrl.href.replace(/\/$/, "");
const deploymentBasePath = qaUrl.pathname.replace(/\/$/, "");
const enforceLoaderTiming = qaUrl.hostname === "127.0.0.1" || qaUrl.hostname === "localhost";
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
  "/", "/services/", "/services/website-development/", "/services/web-application-development/", "/services/crm-development/", "/services/erp-business-systems/", "/services/saas-product-development/", "/services/custom-software-automation/", "/services/ui-ux-product-design/", "/services/maintenance-support/", "/solutions/", "/work/", "/work/costarica-labourtrack/", "/work/paytrack/", "/work/buildestimate-ai/", "/work/onsite-teams-replica/", "/work/inventory-management-system/", "/work/project-template/", "/downloads/", "/downloads/costarica-labourtrack/", "/downloads/paytrack/", "/downloads/buildestimate-ai/", "/downloads/onsite-teams-replica/", "/downloads/inventory-management-system/", "/products/", "/products/operations-hub/", "/about/", "/contact/", "/legal/terms-and-conditions/", "/legal/privacy-policy/", "/legal/free-trial-terms/", "/legal/refund-cancellation-policy/", "/legal/saas-subscription-terms/", "/legal/cookie-policy/"
];

function urlForRoute(route) {
  return `${baseUrl}${route}`;
}

function expectedPathForRoute(route) {
  return `${deploymentBasePath}${route}`.replace(/\/{2,}/g, "/") || "/";
}

const routeResults = await Promise.all(routes.map(async (route) => {
  const response = await fetch(urlForRoute(route));
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
const networkFailures = [];
const requestUrls = new Map();
const loaderDurations = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) { const { accept, reject } = pending.get(message.id); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : accept(message.result); }
  if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text || "Uncaught browser exception");
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") browserErrors.push("Console error");
  if (message.method === "Network.requestWillBeSent") requestUrls.set(message.params.requestId, message.params.request.url);
  if (message.method === "Network.responseReceived") {
    const { response } = message.params;
    if (response.url.startsWith(baseUrl) && response.status >= 400) networkFailures.push(`${response.status} ${response.url}`);
  }
  if (message.method === "Network.loadingFailed") {
    const url = requestUrls.get(message.params.requestId) || "unknown request";
    if (!message.params.canceled && url.startsWith(baseUrl)) networkFailures.push(`${message.params.errorText}: ${url}`);
  }
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
  const expectedPath = expectedPathForRoute(path);
  await cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700, screenWidth: width, screenHeight: height });
  await cdp("Page.navigate", { url: urlForRoute(path) });
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    ready = await evaluate(`location.pathname === ${JSON.stringify(expectedPath)} && document.readyState === "complete" && Boolean(document.querySelector("#app > *"))`);
    if (ready) break;
    await delay(100);
  }
  if (!ready) {
    const state = await evaluate(`({ href: location.href, title: document.title, ready: document.readyState, appLength: document.querySelector("#app")?.innerHTML.length || 0 })`);
    throw new Error(`Browser page did not become ready: ${JSON.stringify(state)}; errors: ${browserErrors.join(", ")}`);
  }
  await delay(120);
  const loaderState = await evaluate(`(() => { const loader = document.querySelector("#site-loader"); return { present: Boolean(loader), visible: Boolean(loader && !loader.classList.contains("is-hidden")) }; })()`);
  if (!loaderState.present) throw new Error("The global site loader is missing.");
  if (!loaderState.visible) throw new Error("The global site loader was not visible during page startup.");
  if (path === "/" && (width === 390 || width === 1440)) {
    const loaderShot = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
    await writeFile(resolve(artifacts, width === 390 ? "loader-mobile.png" : "loader-desktop.png"), Buffer.from(loaderShot.data, "base64"));
  }
  let loaderFinished = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    loaderFinished = await evaluate(`document.querySelector("#site-loader")?.classList.contains("is-hidden") === true`);
    if (loaderFinished) break;
    await delay(100);
  }
  if (!loaderFinished) throw new Error("The global site loader did not finish and release the page.");
  const loaderElapsed = await evaluate(`performance.now()`);
  if (path === "/") {
    loaderDurations.push({ width, milliseconds: Math.round(loaderElapsed) });
    if (enforceLoaderTiming && (loaderElapsed < 750 || loaderElapsed > 1350)) throw new Error(`Loader duration was outside the intended ~1 second window: ${Math.round(loaderElapsed)}ms at ${width}px.`);
  }
  await delay(100);
}

try {
  await cdp("Page.enable");
  await cdp("Runtime.enable");
  await cdp("Network.enable");
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
  const desktop = await evaluate(`({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, menuHidden: getComputedStyle(document.querySelector(".menu-toggle")).display === "none", instrumentFont: document.fonts.check('16px "Instrument Sans"'), monoFont: document.fonts.check('12px "IBM Plex Mono"'), premiumStage: Boolean(document.querySelector("[data-hero-art]")), premiumCards: document.querySelectorAll(".premium-card").length, premiumImageLoaded: document.querySelector(".premium-screen img")?.naturalWidth > 0, featuredProject: document.querySelector(".project-grid-home .project-card h3")?.textContent.trim() })`);
  if (desktop.scrollWidth > desktop.width) throw new Error(`Desktop overflow: viewport ${desktop.width}px, document ${desktop.scrollWidth}px.`);
  if (!desktop.menuHidden) throw new Error("Desktop navigation did not replace the mobile control.");
  if (!desktop.instrumentFont || !desktop.monoFont || !desktop.premiumStage || desktop.premiumCards !== 2 || !desktop.premiumImageLoaded || desktop.featuredProject !== "Onsite Teams Replica") throw new Error(`Premium visual system failed QA: ${JSON.stringify(desktop)}`);
  const desktopShot = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(resolve(artifacts, "home-desktop.png"), Buffer.from(desktopShot.data, "base64"));
  const smoothScrollRuntime = await evaluate(`({ plugin: Boolean(window.ScrollToPlugin), enabled: document.documentElement.classList.contains("gsap-smooth-scroll"), y: scrollY })`);
  if (!smoothScrollRuntime.plugin || !smoothScrollRuntime.enabled) throw new Error(`GSAP smooth scrolling did not initialise: ${JSON.stringify(smoothScrollRuntime)}`);
  await cdp("Input.dispatchMouseEvent", { type: "mouseWheel", x: 720, y: 500, deltaX: 0, deltaY: 700 });
  await delay(90);
  const smoothScrollMid = await evaluate(`scrollY`);
  await delay(1000);
  const smoothScrollEnd = await evaluate(`scrollY`);
  if (smoothScrollMid < 20 || smoothScrollEnd < smoothScrollMid + 100 || smoothScrollEnd > 900) throw new Error(`GSAP wheel smoothing failed: ${JSON.stringify({ smoothScrollMid, smoothScrollEnd })}`);
  await evaluate(`(() => { scrollTo(0, 0); window.ScrollTrigger?.refresh(); window.ScrollTrigger?.update(); })()`);
  await delay(650);
  const manifestoInitial = await evaluate(`(() => { const items = [...document.querySelectorAll(".manifesto-word")]; const brightness = (item) => getComputedStyle(item).color.match(/\\d+/g).slice(0, 3).reduce((sum, value) => sum + Number(value), 0) / 3; const trigger = window.ScrollTrigger?.getAll()[0]; return { gsap: Boolean(window.gsap && window.ScrollTrigger), triggers: window.ScrollTrigger?.getAll().length || 0, words: items.length, first: brightness(items[0]), last: brightness(items.at(-1)), firstInline: items[0]?.style.color, lastInline: items.at(-1)?.style.color, scrollY, trigger: trigger ? { start: trigger.start, end: trigger.end, progress: trigger.progress, animation: trigger.animation?.progress() } : null }; })()`);
  if (!manifestoInitial.gsap || manifestoInitial.words < 10 || manifestoInitial.first > 70 || manifestoInitial.last > 70) throw new Error(`GSAP manifesto did not initialise: ${JSON.stringify(manifestoInitial)}`);
  await evaluate(`(() => { const section = document.querySelector("[data-manifesto]"); scrollTo(0, section.offsetTop - innerHeight * 0.52); })()`);
  await delay(500);
  const manifestoMid = await evaluate(`(() => { const items = [...document.querySelectorAll(".manifesto-word")]; const brightness = (item) => getComputedStyle(item).color.match(/\\d+/g).slice(0, 3).reduce((sum, value) => sum + Number(value), 0) / 3; return { first: brightness(items[0]), last: brightness(items.at(-1)) }; })()`);
  if (manifestoMid.first < 220 || manifestoMid.last > 120) throw new Error(`GSAP manifesto did not reveal progressively: ${JSON.stringify(manifestoMid)}`);
  await evaluate(`(() => { const section = document.querySelector("[data-manifesto]"); scrollTo(0, section.offsetTop + innerHeight * 0.06); })()`);
  await delay(650);
  const manifestoComplete = await evaluate(`(() => { const items = [...document.querySelectorAll(".manifesto-word")]; const brightness = (item) => getComputedStyle(item).color.match(/\\d+/g).slice(0, 3).reduce((sum, value) => sum + Number(value), 0) / 3; return { first: brightness(items[0]), last: brightness(items.at(-1)) }; })()`);
  if (manifestoComplete.first < 240 || manifestoComplete.last < 240) throw new Error(`GSAP manifesto did not complete with scroll: ${JSON.stringify(manifestoComplete)}`);
  const routeTransitionStarted = await evaluate(`(() => { const link = [...document.querySelectorAll("[data-link]")].find(a => new URL(a.href).pathname.endsWith("/services/")); link?.click(); return document.querySelector("#route-curtain")?.classList.contains("is-active") === true; })()`);
  if (!routeTransitionStarted) throw new Error("The internal route curtain did not start.");
  await delay(380);
  const routeTransitionPage = await evaluate(`({ path: location.pathname, heading: document.querySelector("h1")?.textContent.trim() })`);
  if (!routeTransitionPage.path.endsWith("/services/") || routeTransitionPage.heading !== "Technology shaped around the work.") throw new Error(`Route transition did not commit the destination: ${JSON.stringify(routeTransitionPage)}`);
  await delay(450);
  const routeTransitionFinished = await evaluate(`document.querySelector("#route-curtain")?.classList.contains("is-active") === false`);
  if (!routeTransitionFinished) throw new Error("The internal route curtain did not finish.");

  await navigate("/contact/", 390, 844);
  const contact = await evaluate(`(async () => {
    const form = document.querySelector("#project-form");
    const endpoint = window.AM_SITE_CONFIG?.contactEndpoint;
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => String(url) === endpoint
      ? new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } })
      : originalFetch(url, options);
    form.elements.name.value = "Test User";
    form.elements.email.value = "test@example.com";
    form.elements.service.value = "website-development";
    form.elements.description.value = "This is a browser QA inquiry that is long enough for validation.";
    form.elements.formStartedAt.value = String(Date.now() - 5000);
    form.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 150));
    window.fetch = originalFetch;
    return { endpoint, status: document.querySelector("#form-status").textContent.trim(), success: document.querySelector("#form-status").classList.contains("success"), overflow: document.documentElement.scrollWidth > innerWidth };
  })()`);
  if (!contact.endpoint?.startsWith("https://formspree.io/f/") || !contact.success || !contact.status.includes("received")) throw new Error(`The configured contact form failed QA: ${JSON.stringify(contact)}`);
  if (contact.overflow) throw new Error("Contact page overflows at 390px.");

  await navigate("/services/crm-development/", 390, 844);
  const service = await evaluate(`({ title: document.title, heading: document.querySelector("h1")?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth, faqCount: document.querySelectorAll(".faq-item").length })`);
  if (service.heading !== "CRM Development" || service.faqCount < 3 || service.overflow) throw new Error(`CRM service route failed QA: ${JSON.stringify(service)}`);
  await navigate("/work/paytrack/", 390, 844);
  const project = await evaluate(`({ title: document.title, heading: document.querySelector("h1")?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth, highlights: document.querySelectorAll(".project-highlight").length, imageFailures: [...document.images].filter(image => image.complete && image.naturalWidth === 0).length, demoHref: [...document.querySelectorAll("a")].find(anchor => anchor.textContent.includes("Open Live Demo"))?.href, accessHref: [...document.querySelectorAll("a")].find(anchor => anchor.textContent.includes("Download / Access"))?.href })`);
  if (project.heading !== "PayTrack" || project.highlights < 3 || project.overflow || project.imageFailures || project.demoHref !== "https://paytrack.paytrack-apurv.workers.dev/" || !project.accessHref?.endsWith("/downloads/paytrack/")) throw new Error(`PayTrack project route failed QA: ${JSON.stringify(project)}`);
  await navigate("/work/onsite-teams-replica/", 390, 844);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await evaluate(`document.querySelector(".project-detail-visual img")?.naturalWidth > 0`)) break;
    await delay(100);
  }
  const onsite = await evaluate(`({ heading: document.querySelector("h1")?.textContent.trim(), imageLoaded: document.querySelector(".project-detail-visual img")?.naturalWidth > 0, disclaimer: document.querySelector(".project-note")?.textContent.trim(), overflow: document.documentElement.scrollWidth > innerWidth })`);
  if (onsite.heading !== "Onsite Teams Replica" || !onsite.imageLoaded || !onsite.disclaimer?.includes("not affiliated") || onsite.overflow) throw new Error(`Onsite replica project route failed QA: ${JSON.stringify(onsite)}`);

  await navigate("/downloads/paytrack/", 390, 844);
  const access = await evaluate(`(async () => {
    const form = document.querySelector("#access-request-form");
    const endpoint = window.AM_SITE_CONFIG?.accessEndpoint || window.AM_SITE_CONFIG?.contactEndpoint;
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => String(url) === endpoint
      ? new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } })
      : originalFetch(url, options);
    const forbiddenDownloads = [...document.querySelectorAll("a")].filter(anchor => anchor.hasAttribute("download") || /\\.(apk|exe|dmg|zip)(?:$|\\?)/i.test(anchor.href)).length;
    form.elements.name.value = "Demo User";
    form.elements.phone.value = "+91 98765 43210";
    form.elements.email.value = "demo@example.com";
    form.elements.interest.value = "Demo and download access";
    form.elements.consent.checked = true;
    form.elements.formStartedAt.value = String(Date.now() - 5000);
    form.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 150));
    window.fetch = originalFetch;
    return { endpoint, heading: document.querySelector("h1")?.textContent.trim(), forbiddenDownloads, status: document.querySelector("#access-form-status")?.textContent.trim(), success: document.querySelector("#access-form-status")?.classList.contains("success"), overflow: document.documentElement.scrollWidth > innerWidth };
  })()`);
  if (!access.endpoint?.startsWith("https://formspree.io/f/") || access.heading !== "PayTrack" || access.forbiddenDownloads || !access.success || !access.status?.includes("received") || access.overflow) throw new Error(`PayTrack access gate failed QA: ${JSON.stringify(access)}`);
  if (browserErrors.length) throw new Error(`Browser errors detected: ${browserErrors.join(", ")}`);
  if (networkFailures.length) throw new Error(`Network failures detected: ${networkFailures.join(", ")}`);

  console.log(JSON.stringify({ qaBaseUrl: baseUrl, deploymentBasePath: deploymentBasePath || "/", routes: routeResults.length, mobile, desktop, loaderVerified: true, loaderDurations, premiumVisualVerified: true, smoothScrollVerified: true, manifestoScrollVerified: true, routeTransitionVerified: true, contactStatusVerified: true, accessGateVerified: true, crmServiceVerified: true, projectRoutesVerified: 2, browserErrors: 0, networkFailures: 0, screenshots: [resolve(artifacts, "loader-mobile.png"), resolve(artifacts, "loader-desktop.png"), resolve(artifacts, "home-mobile.png"), resolve(artifacts, "home-desktop.png")] }, null, 2));
} finally {
  socket.close();
  browser.kill();
  await delay(200);
  await rm(userDataDir, { recursive: true, force: true });
}
