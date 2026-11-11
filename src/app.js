import { company, services, solutions, process, projects, productCategories, legalPages, navItems } from "./content.js";

const app = document.querySelector("#app");
const siteLoader = document.querySelector("#site-loader");
const loaderPercent = document.querySelector("[data-loader-percent]");
const loaderStatus = document.querySelector("[data-loader-status]");
const routeCurtain = document.querySelector("#route-curtain");
const scrollIndicator = document.querySelector("#scroll-indicator");
const scrollIndicatorTrack = scrollIndicator?.querySelector(".scroll-indicator-track");
const scrollIndicatorThumb = scrollIndicator?.querySelector(".scroll-indicator-thumb");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const config = window.AM_SITE_CONFIG || {};
const basePath = config.basePath && config.basePath !== "/" ? `/${String(config.basePath).replace(/^\/+|\/+$/g, "")}` : "";
const contactEmail = config.contactEmail || company.contactEmail;
const contactPhone = config.contactPhone || company.contactPhone;
const contactPhoneHref = String(contactPhone).replace(/[^+\d]/g, "");
const whatsappPhone = String(contactPhone).replace(/\D/g, "");
const analyticsId = /^G-[A-Z0-9]+$/.test(String(config.analyticsId || "")) ? String(config.analyticsId) : "";
const analyticsConsentKey = "am-analytics-consent-v1";
let manifestoAnimationContext = null;
let premiumMotionContext = null;
let smoothScrollTween = null;
let smoothScrollTarget = window.scrollY;
let scrollIndicatorHideTimer = null;
let analyticsLoaded = false;
let analyticsEventsBound = false;

const serviceBySlug = Object.fromEntries(services.map((service) => [service.slug, service]));
const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]));
const legalBySlug = legalPages;

const icons = {
  arrow: "↗",
  check: "✓"
};

function normalizePath(pathname) {
  const withoutBase = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`)) ? pathname.slice(basePath.length) || "/" : pathname;
  const clean = withoutBase.replace(/\/{2,}/g, "/").replace(/index\.html$/, "");
  return clean === "/" ? "/" : `${clean.replace(/\/$/, "")}/`;
}

function sitePath(path) {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}` || "/";
}

function link(href, label, className = "") {
  return `<a class="${className}" href="${sitePath(href)}" data-link>${label}</a>`;
}

function button(href, label, variant = "") {
  return link(href, label, `button ${variant}`.trim());
}

function externalButton(href, label, variant = "") {
  return `<a class="button ${variant}" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function eyebrow(text) {
  return `<p class="eyebrow">${text}</p>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((item, index) => item.href ? `${link(item.href, item.label)}${index < items.length - 1 ? " <span>/</span> " : ""}` : `<span aria-current="page">${item.label}</span>`).join("")}</nav>`;
}

function header(path) {
  return `
    <header class="site-header">
      <div class="nav-wrap">
        ${link("/", `<span class="brand-mark" aria-hidden="true">A&M</span><span class="brand-text">A&M Tech Solutions</span>`, "brand")}
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu"><span></span></button>
        <nav id="primary-navigation" class="nav-links" aria-label="Primary navigation">
          ${navItems.map(([label, href]) => `<a class="nav-link" href="${sitePath(href)}" data-link ${path.startsWith(href) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          ${button("/contact/", "Start a Project", "nav-cta")}
        </nav>
      </div>
    </header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="shell">
        <div class="footer-top">
          <div class="footer-brand">
            ${link("/", `<span class="brand-mark" aria-hidden="true">A&M</span><span class="brand-text">A&M Tech Solutions</span>`, "brand")}
            <p>${company.description}</p>
            <p class="verified-note">Email: <a href="mailto:${contactEmail}">${contactEmail}</a><br />Phone: <a href="tel:${contactPhoneHref}">${contactPhone}</a> · <a href="https://wa.me/${whatsappPhone}" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
            <div class="footer-socials" aria-label="Social profiles coming soon">
              <span class="social-placeholder" role="img" aria-label="LinkedIn profile link coming soon" title="LinkedIn — link coming soon">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.2 7.7A2.2 2.2 0 1 0 5.2 3.3a2.2 2.2 0 0 0 0 4.4ZM3.4 20.7H7V9.2H3.4v11.5ZM9.2 9.2h3.4v1.6h.1c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8v6.1h-3.6v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.5H9.7V9.2h-.5Z" /></svg>
              </span>
              <span class="social-placeholder" role="img" aria-label="Instagram profile link coming soon" title="Instagram — link coming soon">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" /><circle cx="12" cy="12" r="4.1" /><circle cx="17.45" cy="6.65" r="1" class="social-icon-dot" /></svg>
              </span>
            </div>
          </div>
          <nav class="footer-nav" aria-label="Footer navigation">
            <div class="footer-col"><h3>Build</h3>${link("/services/", "Services")}${link("/solutions/", "Solutions")}${link("/work/", "Work")}${link("/products/", "Products")}${link("/downloads/", "Software access")}</div>
            <div class="footer-col"><h3>Company</h3>${link("/about/", "About")}${link("/contact/", "Contact")}${link("/contact/", "Start a project")}</div>
            <div class="footer-col"><h3>Policies</h3>${link("/legal/terms-and-conditions/", "Terms")}${link("/legal/privacy-policy/", "Privacy")}${link("/legal/refund-cancellation-policy/", "Refunds & cancellations")}${link("/legal/cookie-policy/", "Cookies")}<button class="footer-cookie-settings" type="button" data-cookie-settings>Cookie settings</button></div>
            <div class="footer-col"><h3>Product terms</h3>${link("/legal/free-trial-terms/", "Free trial terms")}${link("/legal/saas-subscription-terms/", "SaaS terms")}<span>No public trials are active</span></div>
          </nav>
        </div>
        <div class="footer-bottom">
          <span>© ${year} ${company.name}. All rights reserved.</span>
          <div class="footer-bottom-actions">
            <span>Built for clarity, utility, and forward motion.</span>
            <button class="back-to-top" type="button" data-back-to-top aria-label="Scroll back to the top">
              <span>Back to top</span>
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 13V3M4.25 6.75 8 3l3.75 3.75" /></svg>
            </button>
          </div>
        </div>
      </div>
    </footer>`;
}

function cookieConsentPanel() {
  return `
    <aside class="cookie-consent" data-cookie-consent role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-copy" hidden>
      <div class="cookie-consent-copy">
        <span class="page-code">Privacy / Analytics</span>
        <h2 id="cookie-consent-title">Help us understand what works.</h2>
        <p id="cookie-consent-copy">With your permission, Google Analytics measures visits and useful interactions. We do not use advertising cookies. You can change this choice anytime.</p>
        ${link("/legal/cookie-policy/", "Read cookie policy", "cookie-policy-link")}
      </div>
      <div class="cookie-consent-actions">
        <button class="button button-light" type="button" data-consent-accept>Accept analytics</button>
        <button class="button cookie-reject" type="button" data-consent-reject>Reject optional</button>
      </div>
    </aside>`;
}

function layout(content, path) {
  return `${header(path)}<main id="main-content" tabindex="-1">${content}</main>${footer()}${cookieConsentPanel()}`;
}

function readAnalyticsConsent() {
  try { return localStorage.getItem(analyticsConsentKey); }
  catch { return null; }
}

function writeAnalyticsConsent(value) {
  try { localStorage.setItem(analyticsConsentKey, value); }
  catch { /* Analytics remains controlled for the current page. */ }
}

function analyticsConsentGranted() {
  return readAnalyticsConsent() === "accepted";
}

function loadAnalytics() {
  if (!analyticsId || analyticsLoaded || !analyticsConsentGranted()) return;
  window[`ga-disable-${analyticsId}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  window.gtag("js", new Date());
  window.gtag("config", analyticsId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true
  });
  const script = document.createElement("script");
  script.id = "am-google-analytics";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
  document.head.append(script);
  analyticsLoaded = true;
}

function disableAnalytics() {
  if (!analyticsId) return;
  window[`ga-disable-${analyticsId}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  document.cookie.split(";").map((item) => item.split("=")[0].trim()).filter((name) => name === "_ga" || name.startsWith("_ga_")).forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  });
}

function trackAnalyticsEvent(name, parameters = {}) {
  if (!analyticsConsentGranted() || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

function trackPageView() {
  trackAnalyticsEvent("page_view", {
    page_title: document.title,
    page_location: location.href,
    page_path: `${location.pathname}${location.search}`
  });
}

function setupAnalyticsConsent() {
  const panel = document.querySelector("[data-cookie-consent]");
  const settingsButton = document.querySelector("[data-cookie-settings]");
  if (!panel || !analyticsId) return;

  const showPanel = () => {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-visible"));
  };
  const hidePanel = () => {
    panel.classList.remove("is-visible");
    window.setTimeout(() => { panel.hidden = true; }, prefersReducedMotion ? 0 : 220);
  };

  if (analyticsConsentGranted()) loadAnalytics();
  if (!readAnalyticsConsent()) showPanel();

  panel.querySelector("[data-consent-accept]")?.addEventListener("click", () => {
    writeAnalyticsConsent("accepted");
    loadAnalytics();
    trackPageView();
    hidePanel();
  });
  panel.querySelector("[data-consent-reject]")?.addEventListener("click", () => {
    writeAnalyticsConsent("declined");
    disableAnalytics();
    hidePanel();
  });
  settingsButton?.addEventListener("click", () => {
    showPanel();
    panel.querySelector("[data-consent-accept]")?.focus({ preventScroll: true });
  });

  if (!analyticsEventsBound) {
    analyticsEventsBound = true;
    document.addEventListener("click", (event) => {
      const target = event.target.closest("a.button, .contact-method");
      if (!target) return;
      const href = target instanceof HTMLAnchorElement ? target.href : "";
      trackAnalyticsEvent(target.classList.contains("contact-method") ? "contact_click" : "cta_click", {
        link_text: target.textContent.trim().replace(/\s+/g, " ").slice(0, 100),
        link_url: href
      });
    });
  }
}

function interfaceVisual() {
  return `
    <div class="premium-stage" data-hero-art aria-label="A&M project interface composition">
      <div class="premium-stage-grid" aria-hidden="true"></div>
      <div class="premium-stage-index" data-hero-layer data-depth="1"><span>Selected systems</span><span>01—03 / 2026</span></div>
      <div class="premium-screen" data-hero-layer data-depth="2">
        <div class="premium-browser-bar"><span><i></i><i></i><i></i></span><b>Custom inventory / independent product study</b></div>
        <img src="${sitePath("/projects/onsite-replica-login.png")}" alt="Custom Inventory System login interface preview" loading="eager" fetchpriority="high" />
      </div>
      <div class="premium-card premium-card-paytrack" data-hero-layer data-depth="3" aria-label="PayTrack project summary">
        <div><span>PAY / 02</span><i>Production PWA</i></div>
        <strong>Payments,<br />kept visible.</strong>
        <small>PayTrack / Browser + mobile</small>
      </div>
      <div class="premium-card premium-card-labour" data-hero-layer data-depth="4" aria-label="Costarica LabourTrack project summary">
        <div><span>ATT / 01</span><i>Active project</i></div>
        <strong>Field records.<br />Clear settlements.</strong>
        <small>LabourTrack / Site operations</small>
      </div>
      <p class="premium-stage-caption" data-hero-layer data-depth="1">Real project media + verified interface summaries</p>
    </div>`;
}

function projectVisual(project, detail = false) {
  if (project.media) {
    return `<div class="project-art project-art-image project-art-${project.visual}"><img src="${sitePath(project.media)}" alt="${project.name} interface preview" loading="${detail ? "eager" : "lazy"}" /><span>Demonstration interface</span></div>`;
  }
  return `<div class="project-art project-art-${project.visual}" aria-label="Illustrative visual for ${project.name}">
    <div class="project-art-top"><span>A&amp;M / ${project.category}</span><i></i></div>
    <div class="project-art-main"><small>${project.status}</small><strong>${project.visualCode}</strong><p>${project.visualLine}</p></div>
    <div class="project-art-ui" aria-hidden="true"><span></span><span></span><span></span><b></b></div>
  </div>`;
}

function projectCard(project, index = 0, featured = false) {
  const technologies = project.technologies.slice(0, 3);
  return `<a class="project-card ${featured ? "project-card-featured" : ""} reveal" href="${sitePath(`/work/${project.slug}/`)}" data-link>
    <div class="project-card-media">${projectVisual(project)}</div>
    <div class="project-card-copy">
      <div><div class="project-meta"><span>${String(index + 1).padStart(2, "0")}</span><span>${project.category}</span></div><span class="project-status">${project.status}</span><h3>${project.name}</h3><p>${project.short}</p></div>
      <div class="project-card-bottom"><div class="project-tags">${technologies.length ? technologies.map((technology) => `<span>${technology}</span>`).join("") : "<span>Details pending</span>"}</div><span class="project-open" aria-hidden="true">Open case study ↗</span></div>
    </div>
  </a>`;
}

function homePage() {
  const manifesto = "Technology should remove friction, reveal what matters, and make the next move easier to see.";
  const manifestoWords = manifesto.split(" ").map((word) => `<span class="manifesto-word">${[...word].map((character) => `<span class="manifesto-char">${character}</span>`).join("")}</span>`).join(" ");
  const homeProjects = [projectBySlug["onsite-teams-replica"], projectBySlug.paytrack, projectBySlug["costarica-labourtrack"]].filter(Boolean);
  const principles = [
    ["01", "Built around the workflow", "We begin with how the business actually operates—not with a list of fashionable features."],
    ["02", "Clean, maintainable software", "Structure and clarity matter after launch, when real people need to understand and improve the product."],
    ["03", "Mobile is a real context", "Responsive experiences are designed for the decisions people make away from a large screen."],
    ["04", "Scope you can see", "Priorities, assumptions, boundaries, and change are made explicit so delivery stays grounded."],
    ["05", "Practical technology", "We choose tools for the problem, ownership, and operating reality—not for novelty."],
    ["06", "A path beyond launch", "Support and improvement are agreed clearly, with no vague promises or hidden expectations."]
  ];

  return `
    <section class="hero">
      <div class="shell hero-grid">
        <div class="hero-intro" data-hero-intro>
          <div data-hero-eyebrow>${eyebrow("Digital products / Business systems")}</div>
          <h1 class="hero-title" aria-label="Software that works as hard as your business.">
            <span class="hero-title-line" aria-hidden="true"><span class="hero-title-line-inner">Software that works</span></span>
            <span class="hero-title-line" aria-hidden="true"><span class="hero-title-line-inner">as hard as</span></span>
            <span class="hero-title-line" aria-hidden="true"><span class="hero-title-line-inner"><em>your business.</em></span></span>
          </h1>
          <p class="hero-copy" data-hero-support>Websites, business systems, and custom software built around the way you work. From a new digital presence to the tools that power your operations, we help you move forward.</p>
          <div class="button-row" data-hero-support>${button("/contact/", "Start a Project")}${button("/services/", "Explore Our Services", "button-ghost")}</div>
          <p class="availability" data-hero-support><span class="availability-dot"></span>${company.availability}</p>
          <div class="hero-disciplines" data-hero-support aria-label="A&M delivery disciplines"><span>Discover</span><span>Design</span><span>Build</span><span>Support</span></div>
        </div>
        <div>${interfaceVisual()}</div>
      </div>
    </section>
    <section class="section section-dark manifesto-section" data-manifesto>
      <div class="shell manifesto-line">
        <span class="page-code reveal">What we believe</span>
        <p class="manifesto-copy" aria-label="${manifesto}"><span class="manifesto-words" aria-hidden="true">${manifestoWords}</span></p>
      </div>
    </section>
    <section class="section" id="services">
      <div class="shell">
        <div class="section-heading-row reveal"><div>${eyebrow("What we build")}<h2 class="section-title">From first presence to operational core.</h2></div><div><p class="section-lede">Focused digital work for businesses at different stages—designed around the job the technology needs to do.</p>${link("/services/", "View all services", "text-link")}</div></div>
        <div class="service-list">${services.map((service) => `<a class="service-row reveal" href="/services/${service.slug}/" data-link><span class="service-number">${service.number}</span><h3>${service.title}</h3><p>${service.short}</p><span class="service-arrow" aria-hidden="true">↗</span></a>`).join("")}</div>
      </div>
    </section>
    <section class="section section-dark">
      <div class="shell">
        <div class="section-heading-row reveal"><div>${eyebrow("Solutions by business type")}<h2 class="section-title">Different businesses. Different friction.</h2></div><p class="section-lede">We start with the problem and the workflow. The software follows.</p></div>
        <div class="solutions-grid">${solutions.map((item) => `<article class="solution reveal"><div class="solution-icon" aria-hidden="true">${item.icon}</div><h3>${item.title}</h3><p><strong>The friction</strong><br />${item.problem}</p><p><strong>The direction</strong><br />${item.solution}</p></article>`).join("")}</div>
        <div class="button-row">${button("/solutions/", "Explore Solutions", "button-light")}</div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-heading-row reveal"><div>${eyebrow("How we work")}<h2 class="section-title">A clear path from problem to progress.</h2></div><p class="section-lede">Enough structure to reduce risk. Enough flexibility to respond to what we learn.</p></div>
        <div class="process-list">${process.map(([number, title, copy]) => `<div class="process-item reveal"><span class="process-num">${number}</span><h3>${title}</h3><p>${copy}</p></div>`).join("")}</div>
      </div>
    </section>
    <section class="section section-soft">
      <div class="shell">
        <div class="section-heading-row reveal"><div>${eyebrow("Selected work")}<h2 class="section-title small">Products shaped around real workflows.</h2></div><div><p class="section-lede">A growing archive of operational systems, mobile products, and construction software—documented without invented outcomes or client claims.</p>${link("/work/", "View all projects", "text-link")}</div></div>
        <div class="project-grid project-grid-home">${homeProjects.map((project, index) => projectCard(project, index, index === 0)).join("")}</div>
      </div>
    </section>
    <section class="section section-dark">
      <div class="shell">
        <div class="section-heading-row reveal"><div>${eyebrow("Products & software")}<h2 class="section-title">Useful tools, only when they're ready.</h2></div><p class="section-lede">The architecture is ready for product pages and future trials. The website does not pretend that unreleased software is available today.</p></div>
        <div class="product-preview-grid">
          <article class="product-feature reveal"><div><span class="status-chip">Concept / coming soon</span><h3>Operations Hub</h3><p>A product direction for growing teams that need stock, work, approvals, and reporting to live in a more connected workspace.</p>${link("/products/operations-hub/", "View concept details", "text-link")}</div><div class="product-categories"><span>Operations</span><span>Inventory</span><span>Approvals</span><span>Reporting</span></div></article>
          <article class="product-feature reveal"><div><span class="status-chip">Product directory</span><h3>Future software</h3><p>CRM, inventory, workforce, project, and automation categories—clearly labelled until a verified release exists.</p></div>${link("/products/", "Browse product direction", "text-link")}</article>
          <article class="product-feature reveal"><div><span class="status-chip">Trials</span><h3>No pretend signup.</h3><p>Trial and subscription flows will only be enabled with real server-side identity, entitlement, billing, and disclosure.</p></div>${link("/legal/free-trial-terms/", "Read the trial draft", "text-link")}</article>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-heading-row reveal"><div>${eyebrow("Why A&M")}<h2 class="section-title">Serious about what software must do.</h2></div><p class="section-lede">Not vague transformation. Not technology for its own sake. Practical decisions that respect the business behind the brief.</p></div>
        <div class="principles">${principles.map(([number, title, copy]) => `<article class="principle reveal"><span class="principle-index">${number}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>
      </div>
    </section>
    ${finalCta()}`;
}

function pageHero({ label, title, intro, code = "A&M / 2026", crumbs = [] }) {
  return `<section class="page-hero"><div class="shell">${crumbs.length ? breadcrumbs(crumbs) : ""}<div class="page-hero-grid reveal"><div>${eyebrow(label)}<h1>${title}</h1></div><div class="page-hero-side"><p>${intro}</p><span class="page-code">${code}</span></div></div></div></section>`;
}

function servicesPage() {
  return `${pageHero({ label: "Services", title: "Technology shaped around the work.", intro: "From a public-facing website to the systems behind daily operations, each engagement begins with the business problem—not a preselected stack." })}
    <section class="section"><div class="shell"><div class="service-list">${services.map((service) => `<a class="service-row reveal" href="/services/${service.slug}/" data-link><span class="service-number">${service.number}</span><h2>${service.title}</h2><p>${service.short}</p><span class="service-arrow">↗</span></a>`).join("")}</div></div></section>
    <section class="section section-dark"><div class="shell two-col"><div>${eyebrow("Choosing the right path")}<h2 class="section-title small">Build, connect, or improve?</h2></div><div class="prose"><p>A custom build is not automatically the answer. Existing platforms may solve a standard need well. Integration may create more value than replacement. A focused redesign may be enough.</p><p>Discovery is how we establish the sensible path, surface constraints, and avoid paying for complexity the business does not need.</p>${button("/contact/", "Discuss the problem", "button-light")}</div></div></section>${finalCta()}`;
}

function serviceDetailPage(service) {
  const related = service.related.map((slug) => serviceBySlug[slug]).filter(Boolean);
  return `${pageHero({ label: `Service ${service.number}`, title: service.title, intro: service.intro, code: "Service / Custom scope", crumbs: [{ label: "Services", href: "/services/" }, { label: service.title }] })}
    <section class="section"><div class="shell two-col"><div class="sticky-label">${eyebrow("The problems")}
      <h2 class="section-title small">When the current way of working gets in the way.</h2></div><div class="problem-list">${service.problems.map((problem) => `<div class="problem reveal"><p>${problem}</p></div>`).join("")}</div></div></section>
    <section class="section section-soft"><div class="shell"><div class="section-heading-row"><div>${eyebrow("Capabilities")}<h2 class="section-title small">What the engagement can cover.</h2></div><p class="section-lede">Final scope is defined after the requirements, constraints, and ownership model are understood.</p></div><div class="capability-grid">${service.capabilities.map((capability, index) => `<article class="capability reveal"><b>${String(index + 1).padStart(2, "0")}</b><h3>${capability}</h3></article>`).join("")}</div></div></section>
    <section class="section section-dark"><div class="shell"><div class="section-heading-row"><div>${eyebrow("Recommended use cases")}<h2 class="section-title small">A good fit when…</h2></div><p class="section-lede">The exact solution may be a build, an integration, or a staged improvement plan.</p></div><div class="use-case-grid">${service.useCases.map((item) => `<div class="use-case reveal">${item}</div>`).join("")}</div></div></section>
    <section class="section"><div class="shell two-col"><div>${eyebrow("Approach")}<h2 class="section-title small">Decisions before decoration.</h2></div><div class="prose"><p>${service.approach}</p><h3>Technology, where it matters</h3><p>${service.technology}</p></div></div></section>
    <section class="section section-soft"><div class="shell">${eyebrow("Frequently asked questions")}<h2 class="section-title small">Useful answers before we talk.</h2><div class="faq-list">${service.faqs.map(([question, answer], index) => `<div class="faq-item"><h3><button class="faq-question" type="button" aria-expanded="${index === 0}" aria-controls="faq-${index}">${question}</button></h3><div class="faq-answer" id="faq-${index}"><div><p>${answer}</p></div></div></div>`).join("")}</div></div></section>
    <section class="section"><div class="shell">${eyebrow("Related services")}<h2 class="section-title small">The connected work.</h2><div class="related-links">${related.map((item) => `<a class="related-link reveal" href="/services/${item.slug}/" data-link><span>${item.number} / Service</span><strong>${item.title} ↗</strong></a>`).join("")}</div></div></section>${finalCta()}`;
}

function solutionsPage() {
  return `${pageHero({ label: "Solutions", title: "Start with the business friction.", intro: "The same category of software can mean very different things in different companies. We make the workflow, constraints, and desired change concrete first." })}
    <section class="section section-dark"><div class="shell"><div class="solutions-grid">${solutions.map((item) => `<article class="solution reveal"><div class="solution-icon">${item.icon}</div><h2>${item.title}</h2><p><strong>What tends to hurt</strong><br />${item.problem}</p><p><strong>A useful direction</strong><br />${item.solution}</p></article>`).join("")}</div></div></section>
    <section class="section"><div class="shell two-col"><div>${eyebrow("What happens next")}<h2 class="section-title small">One problem. A practical first move.</h2></div><div class="prose"><p>You do not need a perfect specification to begin. A useful conversation can identify the key actors, records, decisions, bottlenecks, and operating constraints.</p><p>From there, we can recommend a discovery phase, a focused build, an integration, or a smaller improvement than you originally expected.</p>${button("/contact/", "Describe your workflow")}</div></div></section>${finalCta()}`;
}

function workPage() {
  return `${pageHero({ label: "Selected work", title: "Software with an operating context.", intro: "Five A&M projects across payments, workforce operations, construction, inventory, and business systems. Each record distinguishes verified detail from information still being prepared." })}
    <section class="section section-soft"><div class="shell"><div class="project-index-head reveal"><span>05 projects</span><p>Full-stack systems, mobile products, and focused prototypes.</p></div><div class="project-grid">${projects.map((project, index) => projectCard(project, index, index === 0)).join("")}</div></div></section>${finalCta()}`;
}

function projectDetailPage(project) {
  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 2);
  const technologies = project.technologies.length
    ? `<div class="project-tech">${project.technologies.map((technology) => `<span>${technology}</span>`).join("")}</div>`
    : `<p class="verified-note">Technology details are pending source verification and have not been guessed.</p>`;
  const demoAction = project.demoUrl
    ? externalButton(project.demoUrl, "Open Live Demo")
    : button(`/downloads/${project.slug}/`, "Request Demo");
  return `${pageHero({ label: project.category, title: project.name, intro: project.short, code: project.status, crumbs: [{ label: "Work", href: "/work/" }, { label: project.name }] })}
    <section class="section project-overview"><div class="shell"><div class="project-detail-visual reveal">${projectVisual(project, true)}</div><div class="project-detail-meta"><span>${project.category}</span><span>${project.status}</span></div></div></section>
    <section class="section section-accent project-access"><div class="shell access-strip"><div><span class="page-code">Demo / controlled access</span><h2>See the product. Request the right release.</h2><p>${project.demoStatus}. Software files are never exposed as anonymous public downloads.</p></div><div class="button-row">${demoAction}${button(`/downloads/${project.slug}/`, "Download / Access", "button-ghost")}</div></div></section>
    <section class="section"><div class="shell project-story"><div>${eyebrow("The operating problem")}<h2 class="section-title small">Why this project needed to exist.</h2></div><div class="prose"><p>${project.problem}</p></div><div>${eyebrow("The product direction")}<h2 class="section-title small">What was built.</h2></div><div class="prose"><p>${project.solution}</p></div></div></section>
    <section class="section section-dark"><div class="shell"><div class="section-heading-row"><div>${eyebrow("Verified scope")}<h2 class="section-title small">The work, at a glance.</h2></div><p class="section-lede">Only capabilities confirmed by the project source or supplied project record are included.</p></div><div class="project-highlight-list">${project.highlights.map((highlight, index) => `<div class="project-highlight reveal"><span>${String(index + 1).padStart(2, "0")}</span><strong>${highlight}</strong></div>`).join("")}</div></div></section>
    <section class="section"><div class="shell two-col"><div>${eyebrow("Technology")}<h2 class="section-title small">Tools matched to the product.</h2></div><div>${technologies}<p class="project-note">${project.note}</p></div></div></section>
    <section class="section section-soft"><div class="shell"><div class="section-heading-row"><div>${eyebrow("More work")}<h2 class="section-title small">Continue through the archive.</h2></div>${link("/work/", "View all projects", "text-link")}</div><div class="project-related">${related.map((item, index) => projectCard(item, index)).join("")}</div></div></section>${finalCta()}`;
}

function downloadsPage() {
  return `${pageHero({ label: "Software access", title: "Downloads begin with a real conversation.", intro: "Explore available demos and request the correct software release. No application file is exposed as an anonymous public download." })}
    <section class="section section-soft"><div class="shell"><div class="project-index-head reveal"><span>05 access records</span><p>Demo, install, and evaluation requests are reviewed by the administrator.</p></div><div class="access-directory">${projects.map((project, index) => `<article class="access-card reveal"><div><span class="access-index">${String(index + 1).padStart(2, "0")} / ${project.demoStatus}</span><h2>${project.name}</h2><p>${project.downloadSummary}</p></div><div class="access-card-actions">${project.demoUrl ? externalButton(project.demoUrl, "Live Demo", "button-ghost") : ""}${button(`/downloads/${project.slug}/`, "Request Access")}</div></article>`).join("")}</div></div></section>${finalCta()}`;
}

function accessRequestPage(project) {
  const publicDemo = project.demoUrl
    ? `<div class="access-public-demo"><span class="availability-dot"></span><div><strong>Public web demo available</strong><p>You can explore the browser demo now. Download and private access still require approval.</p></div>${externalButton(project.demoUrl, "Open Demo", "button-ghost")}</div>`
    : `<div class="access-public-demo"><span class="access-lock" aria-hidden="true">↗</span><div><strong>Guided access only</strong><p>The administrator will review your details before arranging a demo or sharing any release.</p></div></div>`;
  return `${pageHero({ label: "Demo & download access", title: project.name, intro: project.downloadSummary, code: "Admin approval required", crumbs: [{ label: "Software access", href: "/downloads/" }, { label: project.name }] })}
    <section class="section"><div class="shell access-layout"><aside class="access-aside"><div><span class="status-chip">No automatic download</span><h2>Contact the administrator.</h2><p>Tell us who you are and what you need. This request does not start a download or create a product account.</p></div>${publicDemo}</aside>
      <form id="access-request-form" data-project="${project.slug}" novalidate>
        <div class="form-grid">
          ${formField("name", "Name", "text", true, "Your full name")}
          <div class="field"><label for="phone">Phone number <span aria-hidden="true">*</span></label><input id="phone" name="phone" type="tel" required minlength="7" maxlength="24" autocomplete="tel" inputmode="tel" placeholder="Your contact number" /><p class="field-error" id="phone-error"></p></div>
          ${formField("email", "Email", "email", true, "you@example.com")}
          ${formField("company", "Company name", "text", false, "Optional")}
          <div class="field field-full"><label for="interest">What do you need? <span aria-hidden="true">*</span></label><select id="interest" name="interest" required><option value="">Select an option</option><option>Live demo</option><option>Installation / download access</option><option>Demo and download access</option><option>Commercial enquiry</option></select><p class="field-error" id="interest-error"></p></div>
          <div class="field field-full"><label for="message">Message</label><textarea id="message" name="message" maxlength="2000" placeholder="Tell the administrator how you plan to use ${project.name}."></textarea><small>Do not include passwords, OTPs, credentials, or sensitive information.</small><p class="field-error"></p></div>
          <div class="field field-full consent-field"><label><input name="consent" type="checkbox" required /> <span>I agree that A&amp;M Tech Solutions may use these details to respond to this access request.</span></label><p class="field-error" id="consent-error"></p></div>
          <div class="hp-field" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off" /></div>
        </div>
        <input type="hidden" name="project" value="${project.name}" />
        <input type="hidden" name="projectSlug" value="${project.slug}" />
        <input type="hidden" name="formType" value="software-access" />
        <input type="hidden" name="formStartedAt" value="${Date.now()}" />
        <div class="form-actions"><button class="button" type="submit">Contact Admin</button><button class="button button-ghost" type="button" id="copy-access-request">Copy Request</button></div>
        <p class="form-note">No software will download automatically. The administrator must approve and respond to the request.</p>
        <div id="access-form-status" class="form-status" role="status" aria-live="polite"></div>
      </form>
    </div></section>`;
}

function workTemplatePage() {
  return `${pageHero({ label: "Project template", title: "Verified project name goes here.", intro: "This route demonstrates the project-detail structure. It is not presented as completed work for a real client.", crumbs: [{ label: "Work", href: "/work/" }, { label: "Template" }] })}
    <section class="section"><div class="shell two-col"><div>${eyebrow("Business category")}<h2 class="section-title small">The problem, in business terms.</h2></div><div class="prose"><p>Describe the verified operating context, who was affected, why the existing approach was limiting the business, and the boundaries of the engagement.</p><p class="verified-note">Placeholder guidance. Replace with approved project facts.</p></div></div></section>
    <section class="section section-dark"><div class="shell two-col"><div>${eyebrow("The solution")}<h2 class="section-title small">What changed and why.</h2></div><div class="prose"><p>Explain the delivered workflow, key design and engineering decisions, and any supported integrations. Name technologies only when they are verified for the project.</p><div class="product-categories"><span>Verified technology</span><span>Verified technology</span></div></div></div></section>
    <section class="section section-soft"><div class="shell"><div class="work-visual"><div class="work-frame"><div class="work-frame-inner">PROJECT SCREENSHOT 01</div></div></div></div></section>${finalCta()}`;
}

function productsPage() {
  return `${pageHero({ label: "Products", title: "Software, when it's ready to work.", intro: "A directory for ready-to-use products and future product categories. No product is marked available until the service, support, account, and commercial experience actually exist." })}
    <section class="section"><div class="shell"><div class="directory-grid">${productCategories.map((product, index) => `<article class="directory-card ${index === 0 ? "primary" : ""} reveal"><div><span class="status-chip">${product.status}</span><h${index === 0 ? "2" : "3"}>${product.name}</h${index === 0 ? "2" : "3"}><p>${product.description}</p></div>${product.slug ? link(`/products/${product.slug}/`, "View concept details", "text-link") : `<span class="page-code">Not currently available</span>`}</article>`).join("")}</div></div></section>
    <section class="section section-soft"><div class="shell two-col"><div>${eyebrow("Future subscriptions")}<h2 class="section-title small">Architecture before promotion.</h2></div><div class="prose"><p>When an eligible product is ready, its trial and subscription model should define eligibility, server-enforced entitlements, verification, billing, cancellation, notifications, renewal, and data handling as one coherent experience.</p><p>Until then, the useful action is a product conversation or an honest early-access request—not a simulated checkout.</p>${link("/legal/saas-subscription-terms/", "Review the subscription draft", "text-link")}</div></div></section>${finalCta()}`;
}

function productDetailPage(product) {
  return `${pageHero({ label: product.status, title: product.name, intro: product.description, code: "Product concept / No public release", crumbs: [{ label: "Products", href: "/products/" }, { label: product.name }] })}
    <section class="section"><div class="shell two-col"><div>${eyebrow("Intended audience")}<h2 class="section-title small">Designed for a specific operational moment.</h2></div><div class="prose"><p>${product.audience}</p><p class="verified-note">This is a product direction, not an available or contracted feature set.</p></div></div></section>
    <section class="section section-dark"><div class="shell"><div class="section-heading-row"><div>${eyebrow("Concept capabilities")}<h2 class="section-title small">The working hypothesis.</h2></div><p class="section-lede">These areas indicate the problem space. Final capabilities depend on validation and release decisions.</p></div><div class="use-case-grid">${product.features.map((feature) => `<div class="use-case">${feature}</div>`).join("")}</div></div></section>
    <section class="section"><div class="shell two-col"><div>${eyebrow("Availability")}<h2 class="section-title small">No public trial yet.</h2></div><div class="prose"><p>Pricing, plans, screenshots, account creation, email verification, trial duration, billing, and support details have not been finalized. The site does not collect payment information or create product accounts.</p>${button("/contact/", "Request an early conversation")}</div></div></section>
    <section class="section section-soft"><div class="shell">${eyebrow("Product FAQ")}<h2 class="section-title small">What is available today?</h2><div class="faq-list"><div class="faq-item"><h3><button class="faq-question" aria-expanded="true">Can I start a free trial?</button></h3><div class="faq-answer"><div><p>No. This product is not currently offered as a public trial.</p></div></div></div><div class="faq-item"><h3><button class="faq-question" aria-expanded="false">Is pricing available?</button></h3><div class="faq-answer"><div><p>No pricing is published because the product and commercial offer are not finalized.</p></div></div></div><div class="faq-item"><h3><button class="faq-question" aria-expanded="false">Can I discuss the workflow?</button></h3><div class="faq-answer"><div><p>Yes. You can describe your operational needs through the project enquiry form. This is a conversation, not a product signup.</p></div></div></div></div></div></section>${finalCta()}`;
}

function aboutPage() {
  const values = [
    ["01", "Understand before prescribing", "Good software begins with the decisions, people, constraints, and exceptions behind the request."],
    ["02", "Keep the system legible", "Clear interfaces and maintainable code help the product remain useful after the first release."],
    ["03", "Tell the truth about readiness", "A concept, prototype, integration, and production system are different things—and should be described that way."],
    ["04", "Make progress observable", "Explicit scope, visible trade-offs, and testable increments create better working relationships."],
    ["05", "Respect operational reality", "A technically elegant answer still fails if it ignores the people and conditions around the workflow."],
    ["06", "Build toward ownership", "Documentation, structure, and sensible technology choices reduce unnecessary dependence."]
  ];
  return `${pageHero({ label: "About A&M", title: "Business thinking, expressed through software.", intro: "A&M Tech Solutions builds websites, applications, and operational systems for teams that need technology to do a real job." })}
    <section class="section"><div class="shell about-statement"><div>${eyebrow("What we do")}</div><p>We turn complex business needs into digital products that are clear enough to use, strong enough to rely on, and sensible enough to maintain.</p></div></section>
    <section class="section section-dark"><div class="shell two-col"><div>${eyebrow("Who we serve")}<h2 class="section-title small">From a first serious presence to connected operations.</h2></div><div class="prose"><p>We work toward solutions for startups, small businesses, growing companies, and established organisations. Some need a website that explains the business properly. Others need a customer portal, a CRM shaped around their sales process, or an operational system that replaces fragmented records.</p><p>The common thread is not company size. It is a meaningful business problem and a willingness to make the workflow clearer.</p></div></div></section>
    <section class="section"><div class="shell"><div class="section-heading-row"><div>${eyebrow("Principles")}<h2 class="section-title small">How we think about reliable work.</h2></div><p class="section-lede">A practical foundation for design, engineering, communication, and long-term product decisions.</p></div><div class="principles">${values.map(([number, title, copy]) => `<article class="principle reveal"><span class="principle-index">${number}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div></div></section>
    <section class="section section-accent"><div class="shell vision-line"><div>${eyebrow("Long-term direction")}<p>Founder and team profiles can be added here when verified details are ready for publication.</p></div><blockquote>Build a company known for useful software and straightforward partnerships.</blockquote></div></section>${finalCta()}`;
}

function contactPage() {
  return `${pageHero({ label: "Start a project", title: "Tell us what needs to move.", intro: "You can arrive with a detailed specification or a stubborn business problem. Start with what is happening now and what a better outcome would change." })}
    <section class="section"><div class="shell contact-layout"><aside class="contact-aside"><div><h2>A useful first message.</h2><p>Share the workflow, audience, urgency, and constraints you already know. You do not need to have the technology figured out.</p></div><div class="contact-status">
        <div class="contact-status-head"><span class="availability-dot" aria-hidden="true"></span><span>${company.availability}</span></div>
        <div class="contact-methods">
          <a class="contact-method" href="mailto:${contactEmail}" aria-label="Email A&M Tech Solutions at ${contactEmail}">
            <span class="contact-method-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></span>
            <span class="contact-method-copy"><small>Email</small><strong>${contactEmail}</strong></span><span class="contact-method-arrow" aria-hidden="true">↗</span>
          </a>
          <a class="contact-method" href="tel:${contactPhoneHref}" aria-label="Call A&M Tech Solutions at ${contactPhone}">
            <span class="contact-method-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.5 10 7.1 8.3 9.3c1.2 2.4 3.1 4.3 5.5 5.5l2.2-1.7 3.6 2.9-.6 3c-.2 1-1.1 1.7-2.1 1.6C9.7 19.8 4.1 14.2 3.3 7c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z" /></svg></span>
            <span class="contact-method-copy"><small>Call</small><strong>${contactPhone}</strong></span><span class="contact-method-arrow" aria-hidden="true">↗</span>
          </a>
          <a class="contact-method contact-method-whatsapp" href="https://wa.me/${whatsappPhone}" target="_blank" rel="noopener noreferrer" aria-label="Message A&M Tech Solutions on WhatsApp at ${contactPhone}">
            <span class="contact-method-icon"><svg class="icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2.2 22l5.2-1.4A9.9 9.9 0 1 0 12 2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A7.9 7.9 0 1 1 12 19.8Zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.4 7.4 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.7.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.2-.1-.4-.2-.6-.3Z" /></svg></span>
            <span class="contact-method-copy"><small>WhatsApp</small><strong>${contactPhone}</strong></span><span class="contact-method-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div></aside>
      <form id="project-form" novalidate>
        <div class="form-grid">
          ${formField("name", "Name", "text", true, "Your name")}
          ${formField("email", "Business email", "email", true, "you@business.com")}
          ${formField("company", "Company name", "text", false, "Optional")}
          <div class="field"><label for="service">Service required <span aria-hidden="true">*</span></label><select id="service" name="service" required><option value="">Select a service</option>${services.map((service) => `<option value="${service.slug}">${service.title}</option>`).join("")}<option value="not-sure">Not sure yet</option></select><p class="field-error" id="service-error"></p></div>
          <div class="field"><label for="budget">Project budget range</label><select id="budget" name="budget"><option value="">Prefer not to say</option><option>Exploring / not set</option><option>Under ₹1 lakh</option><option>₹1–3 lakh</option><option>₹3–8 lakh</option><option>₹8 lakh+</option></select><p class="field-error"></p></div>
          <div class="field"><label for="contactMethod">Preferred contact method</label><select id="contactMethod" name="contactMethod"><option>Email</option><option>Phone call</option><option>WhatsApp</option><option>Video call (details arranged by email)</option></select><p class="field-error"></p></div>
          <div class="field field-full"><label for="description">Project description <span aria-hidden="true">*</span></label><textarea id="description" name="description" required minlength="30" maxlength="4000" placeholder="What is happening now, who is affected, and what would a useful result look like?"></textarea><small>30–4,000 characters. Do not include passwords, credentials, or sensitive personal information.</small><p class="field-error" id="description-error"></p></div>
          <div class="hp-field" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off" /></div>
        </div>
        <input type="hidden" name="formStartedAt" value="${Date.now()}" />
        <div class="form-actions"><button class="button" type="submit">Send project inquiry</button><button class="button button-ghost" type="button" id="copy-inquiry">Copy inquiry</button></div>
        <p class="form-note">The form validates locally. Production delivery remains disabled until a secure server endpoint is configured; the interface will never report a false success.</p>
        <div id="form-status" class="form-status" role="status" aria-live="polite"></div>
      </form>
    </div></section>`;
}

function formField(name, label, type, required, placeholder) {
  return `<div class="field"><label for="${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ""}</label><input id="${name}" name="${name}" type="${type}" ${required ? "required" : ""} maxlength="180" placeholder="${placeholder}" autocomplete="${name === "name" ? "name" : name === "email" ? "email" : "organization"}" /><p class="field-error" id="${name}-error"></p></div>`;
}

function legalPage(slug, page) {
  const effective = config.effectiveDate || "Effective date to be confirmed";
  return `${pageHero({ label: "Legal draft", title: page.title, intro: page.intro, code: effective, crumbs: [{ label: "Legal" }, { label: page.title }] })}
    <section class="section"><div class="shell legal-layout"><aside class="legal-toc"><h2>On this page</h2>${page.sections.map(([title], index) => `<a href="#section-${index + 1}">${title}</a>`).join("")}</aside><article><div class="draft-banner">Draft requiring legal review. Company identity, jurisdiction, contact information, and commercial commitments have not been confirmed.</div>${page.sections.map(([title, copy], index) => `<section class="legal-section" id="section-${index + 1}"><h2>${title}</h2><p>${copy}</p></section>`).join("")}</article></div></section>`;
}

function finalCta() {
  return `<section class="section section-accent"><div class="shell cta-panel reveal"><div><h2>Have a business problem worth solving?</h2><p>Tell us what you're trying to build. We'll help you work out the right next step.</p></div><div class="button-row">${button("/contact/", "Let's Talk")}${button("/services/", "Explore Services", "button-ghost")}</div></div></section>`;
}

function notFoundPage() {
  return `<section class="not-found"><div class="shell"><p class="page-code">Page not found</p><h1>404</h1><p>The route may have moved, or it may not exist yet.</p>${button("/", "Return home")}</div></section>`;
}

function resolveRoute(path) {
  if (path === "/") return { page: homePage(), title: "A&M Tech Solutions — Digital products that move business forward", description: company.description };
  if (path === "/services/") return { page: servicesPage(), title: "Services — A&M Tech Solutions", description: "Website, web application, CRM, ERP, SaaS, automation, product design, and support services." };
  const serviceMatch = path.match(/^\/services\/([^/]+)\/$/);
  if (serviceMatch && serviceBySlug[serviceMatch[1]]) { const service = serviceBySlug[serviceMatch[1]]; return { page: serviceDetailPage(service), title: `${service.title} — A&M Tech Solutions`, description: service.short }; }
  if (path === "/solutions/") return { page: solutionsPage(), title: "Business Solutions — A&M Tech Solutions", description: "Practical software directions for startups, small businesses, operations, retail, services, and growing companies." };
  if (path === "/work/") return { page: workPage(), title: "Work — A&M Tech Solutions", description: "A&M Tech Solutions projects across payments, attendance, construction, inventory, and business operations." };
  const projectMatch = path.match(/^\/work\/([^/]+)\/$/);
  if (projectMatch && projectBySlug[projectMatch[1]]) { const project = projectBySlug[projectMatch[1]]; return { page: projectDetailPage(project), title: `${project.name} — A&M Tech Solutions`, description: project.short }; }
  if (path === "/work/project-template/") return { page: workTemplatePage(), title: "Project Case Study Template — A&M Tech Solutions", description: "The project detail template for future verified case studies." };
  if (path === "/downloads/") return { page: downloadsPage(), title: "Software Access — A&M Tech Solutions", description: "Request approved demo, installation, or download access for A&M Tech Solutions software projects." };
  const accessMatch = path.match(/^\/downloads\/([^/]+)\/$/);
  if (accessMatch && projectBySlug[accessMatch[1]]) { const project = projectBySlug[accessMatch[1]]; return { page: accessRequestPage(project), title: `${project.name} Access — A&M Tech Solutions`, description: `Request administrator-approved demo or download access for ${project.name}.` }; }
  if (path === "/products/") return { page: productsPage(), title: "Products — A&M Tech Solutions", description: "Current product concepts and future software categories from A&M Tech Solutions." };
  const productMatch = path.match(/^\/products\/([^/]+)\/$/);
  const product = productMatch ? productCategories.find((item) => item.slug === productMatch[1]) : undefined;
  if (product) return { page: productDetailPage(product), title: `${product.name} — A&M Tech Solutions`, description: product.description };
  if (path === "/about/") return { page: aboutPage(), title: "About — A&M Tech Solutions", description: "A&M Tech Solutions turns complex business needs into clear, maintainable digital products." };
  if (path === "/contact/") return { page: contactPage(), title: "Start a Project — A&M Tech Solutions", description: "Tell A&M Tech Solutions about the business problem, website, application, or system you need to build." };
  const legalMatch = path.match(/^\/legal\/([^/]+)\/$/);
  if (legalMatch && legalBySlug[legalMatch[1]]) { const page = legalBySlug[legalMatch[1]]; return { page: legalPage(legalMatch[1], page), title: `${page.title} — A&M Tech Solutions`, description: `Draft ${page.title.toLowerCase()} for A&M Tech Solutions, requiring review before publication.` }; }
  return { page: notFoundPage(), title: "Page Not Found — A&M Tech Solutions", description: "The requested page could not be found.", notFound: true };
}

function updateMeta(route) {
  document.title = route.title;
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (description) description.content = route.description;
  if (ogTitle) ogTitle.content = route.title;
  if (ogDescription) ogDescription.content = route.description;
}

function navigate(path, { replace = false } = {}) {
  cancelSmoothScroll();
  const normalized = normalizePath(path);
  const route = resolveRoute(normalized);
  const commitNavigation = () => {
    const browserPath = sitePath(normalized);
    if (replace) history.replaceState({}, "", browserPath); else history.pushState({}, "", browserPath);
    render(normalized, route);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => document.querySelector("#main-content")?.focus({ preventScroll: true }));
  };

  if (prefersReducedMotion || !routeCurtain) {
    commitNavigation();
    return;
  }

  routeCurtain.classList.remove("is-active");
  void routeCurtain.offsetWidth;
  routeCurtain.classList.add("is-active");
  window.setTimeout(commitNavigation, 300);
  window.setTimeout(() => routeCurtain.classList.remove("is-active"), 780);
}

function render(path = normalizePath(location.pathname), route = resolveRoute(path)) {
  app.innerHTML = layout(route.page, path);
  updateMeta(route);
  bindInteractions();
  observeReveals();
  setupManifestoAnimation();
  setupPremiumMotion();
  trackPageView();
  requestAnimationFrame(() => updateScrollIndicator(false));
}

function updateScrollIndicator(show = true) {
  if (!scrollIndicator || !scrollIndicatorTrack || !scrollIndicatorThumb) return;
  const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const travel = Math.max(0, scrollIndicatorTrack.clientHeight - scrollIndicatorThumb.offsetHeight);
  const progress = maximumScroll ? Math.min(1, Math.max(0, window.scrollY / maximumScroll)) : 0;
  const surfaceAtIndicator = document.elementFromPoint(Math.max(0, window.innerWidth - 24), window.innerHeight / 2);
  const isDarkSurface = Boolean(surfaceAtIndicator?.closest(".section-dark, .site-footer"));
  scrollIndicator.style.setProperty("--scroll-thumb-y", `${progress * travel}px`);
  scrollIndicator.classList.toggle("on-dark", isDarkSurface);
  scrollIndicator.hidden = maximumScroll === 0;
  if (!show || maximumScroll === 0 || document.body.classList.contains("loader-active")) return;
  scrollIndicator.classList.add("is-active");
  window.clearTimeout(scrollIndicatorHideTimer);
  scrollIndicatorHideTimer = window.setTimeout(() => scrollIndicator.classList.remove("is-active"), 720);
}

function setupScrollIndicator() {
  if (!scrollIndicator) return;
  updateScrollIndicator(false);
  window.addEventListener("scroll", () => updateScrollIndicator(true), { passive: true });
  window.addEventListener("resize", () => updateScrollIndicator(false), { passive: true });
}

function bindInteractions() {
  document.querySelectorAll("[data-link]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === "_blank") return;
      const url = new URL(anchor.href, location.origin);
      if (url.origin !== location.origin) return;
      event.preventDefault();
      navigate(normalizePath(url.pathname));
    });
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-navigation");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    nav?.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => question.setAttribute("aria-expanded", String(question.getAttribute("aria-expanded") !== "true")));
  });

  document.querySelector("[data-back-to-top]")?.addEventListener("click", () => {
    cancelSmoothScroll();
    const finish = () => document.querySelector(".site-header .brand")?.focus({ preventScroll: true });
    if (prefersReducedMotion || !window.gsap || !window.ScrollToPlugin) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "instant" : "smooth" });
      window.setTimeout(finish, prefersReducedMotion ? 0 : 500);
      return;
    }
    window.gsap.registerPlugin(window.ScrollToPlugin);
    smoothScrollTarget = 0;
    smoothScrollTween = window.gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0.85,
      ease: "power3.inOut",
      onUpdate: () => window.ScrollTrigger?.update(),
      onComplete: () => { smoothScrollTween = null; finish(); }
    });
  });

  const form = document.querySelector("#project-form");
  if (form) setupProjectForm(form);
  const accessForm = document.querySelector("#access-request-form");
  if (accessForm) setupAccessForm(accessForm);
  setupAnalyticsConsent();
}

function observeReveals() {
  const items = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -35px" });
  items.forEach((item) => observer.observe(item));
}

function nestedScrollerCanMove(target, deltaY) {
  let element = target instanceof Element ? target : null;
  while (element && element !== document.body) {
    const { overflowY } = getComputedStyle(element);
    if (/(auto|scroll)/.test(overflowY) && element.scrollHeight > element.clientHeight + 1) {
      const canMoveUp = deltaY < 0 && element.scrollTop > 0;
      const canMoveDown = deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1;
      if (canMoveUp || canMoveDown) return true;
    }
    element = element.parentElement;
  }
  return false;
}

function cancelSmoothScroll() {
  smoothScrollTween?.kill();
  smoothScrollTween = null;
  smoothScrollTarget = window.scrollY;
}

function setupSmoothScroll() {
  const gsap = window.gsap;
  const ScrollToPlugin = window.ScrollToPlugin;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  if (prefersReducedMotion || coarsePointer || !gsap || !ScrollToPlugin) return;

  gsap.registerPlugin(ScrollToPlugin);
  document.documentElement.classList.add("gsap-smooth-scroll");

  const onWheel = (event) => {
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      document.body.classList.contains("loader-active") ||
      document.body.classList.contains("menu-open") ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
      Math.abs(event.deltaY) < 0.01 ||
      nestedScrollerCanMove(event.target, event.deltaY)
    ) return;

    event.preventDefault();
    const deltaScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 28 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const delta = event.deltaY * deltaScale * 1.08;
    smoothScrollTarget = gsap.utils.clamp(0, maxScroll, smoothScrollTarget + delta);
    const distance = Math.abs(smoothScrollTarget - window.scrollY);
    const duration = gsap.utils.clamp(0.48, 0.92, 0.48 + distance / 1800);

    smoothScrollTween?.kill();
    smoothScrollTween = gsap.to(window, {
      scrollTo: { y: smoothScrollTarget, autoKill: false },
      duration,
      ease: "power3.out",
      onUpdate: () => window.ScrollTrigger?.update(),
      onComplete: () => {
        smoothScrollTarget = window.scrollY;
        smoothScrollTween = null;
      }
    });
  };

  const syncScrollTarget = () => {
    if (!smoothScrollTween) smoothScrollTarget = window.scrollY;
  };
  const cancelForKeyboard = (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) cancelSmoothScroll();
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", syncScrollTarget, { passive: true });
  window.addEventListener("pointerdown", cancelSmoothScroll, { passive: true });
  window.addEventListener("resize", cancelSmoothScroll, { passive: true });
  document.addEventListener("keydown", cancelForKeyboard);
}

function setupManifestoAnimation() {
  manifestoAnimationContext?.revert();
  manifestoAnimationContext = null;

  const section = document.querySelector("[data-manifesto]");
  const characters = section ? [...section.querySelectorAll(".manifesto-char")] : [];
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!section || !characters.length || prefersReducedMotion || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  manifestoAnimationContext = gsap.context(() => {
    const activeColor = getComputedStyle(section).getPropertyValue("--white").trim() || "#fafaf6";
    const orbitRadius = Math.min(210, Math.max(76, window.innerWidth * 0.14));
    gsap.set(characters, {
      opacity: 0,
      color: activeColor,
      x: (index) => Math.cos(index * 0.76 - Math.PI / 2) * orbitRadius * (0.72 + (index % 5) * 0.07),
      y: (index) => Math.sin(index * 0.76 - Math.PI / 2) * orbitRadius * 0.62,
      scale: (index) => 1.9 + (index % 4) * 0.18,
      rotation: (index) => ((index * 47) % 260) - 130,
      transformOrigin: "50% 50%",
      force3D: true
    });
    const hold = { value: 0 };
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "manifesto-orbit",
        trigger: section,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * (window.innerWidth < 700 ? 1.25 : 1.75))}`,
        scrub: 0.55,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    timeline.to(characters, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.34,
      stagger: 0.018,
      ease: "power3.out"
    });
    timeline.to(hold, { value: 1, duration: 0.22, ease: "none" });
  }, section);
}

function setupPremiumMotion() {
  premiumMotionContext?.revert();
  premiumMotionContext = null;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (prefersReducedMotion || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  premiumMotionContext = gsap.context(() => {
    const header = document.querySelector(".site-header");
    if (header) {
      let previousScroll = window.scrollY;
      ScrollTrigger.create({
        start: 48,
        end: "max",
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          const delta = currentScroll - previousScroll;
          const mustStayVisible = currentScroll < 80 || document.body.classList.contains("menu-open") || header.contains(document.activeElement);
          header.classList.toggle("is-compact", currentScroll >= 48);
          if (mustStayVisible) header.classList.remove("is-hidden");
          else if (Math.abs(delta) > 3) header.classList.toggle("is-hidden", delta > 0);
          previousScroll = currentScroll;
        },
        onRefresh: (self) => {
          previousScroll = self.scroll();
          header.classList.toggle("is-compact", previousScroll >= 48);
          if (previousScroll < 80) header.classList.remove("is-hidden");
        }
      });
    }

    const stage = document.querySelector("[data-hero-art]");
    const layers = stage ? [...stage.querySelectorAll("[data-hero-layer]")] : [];
    const heroIntro = document.querySelector("[data-hero-intro]");
    const titleLines = heroIntro ? [...heroIntro.querySelectorAll(".hero-title-line-inner")] : [];
    const heroEyebrow = heroIntro?.querySelector("[data-hero-eyebrow]");
    const heroSupport = heroIntro ? [...heroIntro.querySelectorAll("[data-hero-support]")] : [];

    if (heroIntro && titleLines.length) {
      gsap.set(titleLines, { yPercent: 112, rotation: 1.5, transformOrigin: "0 100%" });
      gsap.set(heroEyebrow, { y: 10, opacity: 0 });
      gsap.set(heroSupport, { y: 18, opacity: 0 });
      gsap.set(layers, { y: 30, opacity: 0 });

      const introTimeline = gsap.timeline({ paused: true });
      introTimeline
        .to(heroEyebrow, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" })
        .to(titleLines, { yPercent: 0, rotation: 0, duration: 0.86, stagger: 0.1, ease: "power4.out" }, "-=0.12")
        .to(heroSupport, { y: 0, opacity: 1, duration: 0.58, stagger: 0.07, ease: "power3.out" }, "-=0.48")
        .to(layers, { y: 0, opacity: 1, duration: 0.92, stagger: 0.07, ease: "power3.out" }, "-=0.72");

      const playHeroIntro = () => introTimeline.play(0);
      if (siteLoader?.classList.contains("is-hidden")) playHeroIntro();
      else window.addEventListener("am:loader-complete", playHeroIntro, { once: true });
    }

    if (!stage || !layers.length) return;

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 1);
      gsap.to(layer, {
        yPercent: depth * -3.5,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top 82%",
          end: "bottom top",
          scrub: 0.8
        }
      });
    });
  }, app);
}

function setLoaderProgress(value) {
  const progress = Math.max(0, Math.min(100, Math.round(value)));
  siteLoader?.style.setProperty("--loader-progress", `${progress}%`);
  if (loaderPercent) loaderPercent.textContent = String(progress).padStart(2, "0");
  if (loaderStatus) {
    loaderStatus.textContent = progress < 34 ? "Initializing systems" : progress < 72 ? "Assembling interface" : progress < 100 ? "Preparing launch" : "Ready to move";
  }
}

async function playInitialLoader() {
  if (!siteLoader) return;
  document.body.classList.add("loader-active");

  const minimumDuration = prefersReducedMotion ? 40 : 600;
  const startedAt = performance.now();

  const pageReady = document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
  const fontsReady = document.fonts?.ready || Promise.resolve();
  const minimumElapsed = new Promise((resolve) => window.setTimeout(resolve, minimumDuration));

  setLoaderProgress(4);
  const progressTimer = window.setInterval(() => {
    const elapsed = performance.now() - startedAt;
    setLoaderProgress(Math.min(96, 4 + (elapsed / minimumDuration) * 92));
  }, 40);

  await Promise.all([pageReady, fontsReady, minimumElapsed]);
  window.clearInterval(progressTimer);
  setLoaderProgress(100);
  await new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion ? 10 : 60));

  siteLoader.classList.add("is-exiting");
  document.body.classList.remove("loader-active");
  window.setTimeout(() => {
    siteLoader.classList.add("is-hidden");
    siteLoader.setAttribute("aria-hidden", "true");
    window.dispatchEvent(new CustomEvent("am:loader-complete"));
  }, prefersReducedMotion ? 20 : 220);
}

function setupProjectForm(form) {
  const status = form.querySelector("#form-status");
  const submit = form.querySelector('button[type="submit"]');
  const fields = ["name", "email", "service", "description"];

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `form-status visible ${type}`;
  }

  function validate() {
    let valid = true;
    fields.forEach((name) => {
      const field = form.elements[name];
      const error = form.querySelector(`#${name}-error`);
      let message = "";
      if (!String(field.value).trim()) message = "This field is required.";
      else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = "Enter a valid business email.";
      else if (name === "description" && String(field.value).trim().length < 30) message = "Add at least 30 characters so we can understand the request.";
      field.setAttribute("aria-invalid", String(Boolean(message)));
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    return valid;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    if (!validate()) { showStatus("Please review the highlighted fields.", "error"); form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return;
    const elapsed = Date.now() - Number(data.formStartedAt || 0);
    if (elapsed < 2500) { showStatus("Please take a moment to review your message and try again.", "error"); return; }
    if (!config.contactEndpoint) {
      showStatus("This form is ready but delivery is not configured yet. No message was sent. Use “Copy inquiry” to keep your details while the secure endpoint is being connected.", "error");
      return;
    }
    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const response = await fetch(config.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ formType: "Project inquiry", ...data, formStartedAt: undefined, website: undefined }) });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
      form.reset();
      showStatus("Your inquiry was received. Thank you—we'll follow up using the details you provided.", "success");
      trackAnalyticsEvent("generate_lead", { form_type: "project_inquiry" });
    } catch (error) {
      console.error("Inquiry delivery failed", error);
      showStatus("We couldn't deliver your inquiry. Your message is still in the form; please try again or use “Copy inquiry.”", "error");
    } finally {
      submit.disabled = false;
      submit.textContent = "Send project inquiry";
    }
  });

  form.querySelector("#copy-inquiry")?.addEventListener("click", async () => {
    if (!validate()) { showStatus("Complete the required fields before copying the inquiry.", "error"); return; }
    const data = Object.fromEntries(new FormData(form));
    const text = `Project inquiry for A&M Tech Solutions\n\nName: ${data.name}\nBusiness email: ${data.email}\nCompany: ${data.company || "Not provided"}\nService: ${data.service}\nBudget: ${data.budget || "Not provided"}\nPreferred contact: ${data.contactMethod || "Email"}\n\nProject description:\n${data.description}`;
    try { await navigator.clipboard.writeText(text); showStatus("Inquiry copied to your clipboard. No message was sent.", "success"); }
    catch { showStatus("Clipboard access was unavailable. Select and copy the details from the form manually.", "error"); }
  });
}

function setupAccessForm(form) {
  const status = form.querySelector("#access-form-status");
  const submit = form.querySelector('button[type="submit"]');
  const fields = ["name", "phone", "email", "interest", "consent"];

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `form-status visible ${type}`;
  }

  function validate() {
    let valid = true;
    fields.forEach((name) => {
      const field = form.elements[name];
      const error = form.querySelector(`#${name}-error`);
      let message = "";
      if (name === "consent" && !field.checked) message = "Consent is required so we can respond to your request.";
      else if (name !== "consent" && !String(field.value).trim()) message = "This field is required.";
      else if (name === "name" && String(field.value).trim().length < 2) message = "Enter your full name.";
      else if (name === "phone" && !/^[+()\-\s0-9]{7,24}$/.test(String(field.value).trim())) message = "Enter a valid phone number.";
      else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = "Enter a valid email address.";
      field.setAttribute("aria-invalid", String(Boolean(message)));
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    return valid;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    if (!validate()) { showStatus("Please review the highlighted fields.", "error"); form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return;
    const elapsed = Date.now() - Number(data.formStartedAt || 0);
    if (elapsed < 2500) { showStatus("Please take a moment to review your request and try again.", "error"); return; }
    const endpoint = config.accessEndpoint || config.contactEndpoint;
    if (!endpoint) {
      showStatus("Email delivery is not configured yet, so no request was sent. Use “Copy Request” to keep your details and contact the site administrator.", "error");
      return;
    }
    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ formType: "Software access request", ...data, consent: Boolean(data.consent), formStartedAt: undefined, website: undefined }) });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
      form.reset();
      showStatus("Your access request was received. No file was downloaded; the administrator will contact you using the details provided.", "success");
      trackAnalyticsEvent("generate_lead", { form_type: "software_access_request" });
    } catch (error) {
      console.error("Software access request delivery failed", error);
      showStatus("We couldn't deliver your request. Your details remain in the form; please try again or use “Copy Request.”", "error");
    } finally {
      submit.disabled = false;
      submit.textContent = "Contact Admin";
    }
  });

  form.querySelector("#copy-access-request")?.addEventListener("click", async () => {
    if (!validate()) { showStatus("Complete the required fields before copying the request.", "error"); return; }
    const data = Object.fromEntries(new FormData(form));
    const text = `Software access request for A&M Tech Solutions\n\nProject: ${data.project}\nRequest: ${data.interest}\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nCompany: ${data.company || "Not provided"}\n\nMessage:\n${data.message || "Not provided"}`;
    try { await navigator.clipboard.writeText(text); showStatus("Request copied to your clipboard. No message was sent and no file was downloaded.", "success"); }
    catch { showStatus("Clipboard access was unavailable. Select and copy the details from the form manually.", "error"); }
  });
}

window.addEventListener("popstate", () => render());
document.body.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#primary-navigation");
    if (toggle?.getAttribute("aria-expanded") === "true") { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); nav?.classList.remove("open"); document.body.classList.remove("menu-open"); toggle.focus(); }
  }
});

setupSmoothScroll();
setupScrollIndicator();
render();
playInitialLoader();
