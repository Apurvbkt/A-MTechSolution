import { company, services, solutions, process, productCategories, legalPages, navItems } from "./content.js";

const app = document.querySelector("#app");
const siteLoader = document.querySelector("#site-loader");
const loaderPercent = document.querySelector("[data-loader-percent]");
const loaderStatus = document.querySelector("[data-loader-status]");
const routeCurtain = document.querySelector("#route-curtain");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const config = window.AM_SITE_CONFIG || {};
const basePath = config.basePath && config.basePath !== "/" ? `/${String(config.basePath).replace(/^\/+|\/+$/g, "")}` : "";

const serviceBySlug = Object.fromEntries(services.map((service) => [service.slug, service]));
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
            <p class="verified-note">Contact details will appear here once verified and added to the central site configuration.</p>
          </div>
          <nav class="footer-nav" aria-label="Footer navigation">
            <div class="footer-col"><h3>Build</h3>${link("/services/", "Services")}${link("/solutions/", "Solutions")}${link("/work/", "Work")}${link("/products/", "Products")}</div>
            <div class="footer-col"><h3>Company</h3>${link("/about/", "About")}${link("/contact/", "Contact")}${link("/contact/", "Start a project")}</div>
            <div class="footer-col"><h3>Policies</h3>${link("/legal/terms-and-conditions/", "Terms")}${link("/legal/privacy-policy/", "Privacy")}${link("/legal/refund-cancellation-policy/", "Refunds & cancellations")}${link("/legal/cookie-policy/", "Cookies")}</div>
            <div class="footer-col"><h3>Product terms</h3>${link("/legal/free-trial-terms/", "Free trial terms")}${link("/legal/saas-subscription-terms/", "SaaS terms")}<span>No public trials are active</span></div>
          </nav>
        </div>
        <div class="footer-bottom"><span>© ${year} ${company.name}. All rights reserved.</span><span>Built for clarity, utility, and forward motion.</span></div>
      </div>
    </footer>`;
}

function layout(content, path) {
  return `${header(path)}<main id="main-content" tabindex="-1">${content}</main>${footer()}`;
}

function interfaceVisual() {
  return `
    <div class="interface-stage" aria-label="Illustrative business operations interface">
      <div class="stage-grid"></div>
      <div class="dashboard" aria-hidden="true">
        <div class="dash-top"><div class="dash-dots"><i></i><i></i><i></i></div><span class="dash-status">Operations / Live view</span></div>
        <div class="dash-body">
          <div class="dash-rail"><i></i><i></i><i></i><i></i></div>
          <div class="dash-content">
            <span class="dash-label">Morning overview</span>
            <h2 class="dash-heading">Work in motion.</h2>
            <div class="dash-stats"><div class="dash-stat"><b>18</b><span>Active jobs</span></div><div class="dash-stat"><b>07</b><span>Approvals</span></div><div class="dash-stat"><b>04</b><span>Alerts</span></div></div>
            <div class="dash-flow"><div class="dash-chart"><span class="dash-label">Weekly flow</span><div class="bars"><i></i><i></i><i></i><i></i><i></i></div></div><div class="dash-list"><span class="dash-label">Priority</span><i></i><i></i><i></i></div></div>
          </div>
        </div>
      </div>
      <div class="stage-note">Interface illustration<br />Not a released product</div>
    </div>`;
}

function homePage() {
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
        <div class="reveal">
          ${eyebrow("Digital products / Business systems")}
          <h1>Software that works as hard as <em>your business.</em></h1>
          <p class="hero-copy">Websites, business systems, and custom software built around the way you work. From a new digital presence to the tools that power your operations, we help you move forward.</p>
          <div class="button-row">${button("/contact/", "Start a Project")}${button("/services/", "Explore Our Services", "button-ghost")}</div>
          <p class="availability"><span class="availability-dot"></span>${company.availability}</p>
        </div>
        <div class="reveal">${interfaceVisual()}</div>
      </div>
    </section>
    <section class="section section-dark">
      <div class="shell manifesto-line reveal">
        <span class="page-code">What we believe</span>
        <p>Technology should remove friction, reveal what matters, and make the next move <span>easier to see.</span></p>
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
        <div class="section-heading-row reveal"><div>${eyebrow("Featured work")}<h2 class="section-title small">Real work will live here.</h2></div><p class="section-lede">No invented client logos, outcomes, or screenshots. The portfolio is ready for verified case studies as they become publishable.</p></div>
        <div class="work-placeholder reveal">
          <div class="work-visual"><div class="work-frame"><div class="work-frame-inner">VERIFIED SCREENSHOT</div></div></div>
          <div class="work-copy"><div><span class="status-chip">Content placeholder</span><h3>Project case study template</h3><p>Structured for the business problem, solution, technologies, screenshots, and verified project details.</p></div><div><p class="verified-note">This is intentionally presented as a placeholder—not a client project.</p>${link("/work/", "Open the work directory", "text-link")}</div></div>
        </div>
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
  return `${pageHero({ label: "Work", title: "Evidence, not theatre.", intro: "This directory is intentionally honest. Verified project stories will be published when the client, screenshots, technologies, and outcomes are approved for public use." })}
    <section class="section section-soft"><div class="shell"><div class="work-placeholder"><div class="work-visual"><div class="work-frame"><div class="work-frame-inner">REAL PROJECT MEDIA</div></div></div><div class="work-copy"><div><span class="status-chip">Template / not a client claim</span><h2>Case study structure</h2><p>Every project page supports a business category, problem statement, solution, verified technologies, screenshots, and additional project details.</p></div><div><p class="verified-note">Replace this record in the centralized content model only after project publication is approved.</p>${link("/work/project-template/", "Inspect the case study template", "text-link")}</div></div></div></div></section>${finalCta()}`;
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
    <section class="section"><div class="shell contact-layout"><aside class="contact-aside"><div><h2>A useful first message.</h2><p>Share the workflow, audience, urgency, and constraints you already know. You do not need to have the technology figured out.</p></div><div class="contact-status"><span class="availability-dot"></span> ${company.availability}<br />Verified direct contact details: pending configuration</div></aside>
      <form id="project-form" novalidate>
        <div class="form-grid">
          ${formField("name", "Name", "text", true, "Your name")}
          ${formField("email", "Business email", "email", true, "you@business.com")}
          ${formField("company", "Company name", "text", false, "Optional")}
          <div class="field"><label for="service">Service required <span aria-hidden="true">*</span></label><select id="service" name="service" required><option value="">Select a service</option>${services.map((service) => `<option value="${service.slug}">${service.title}</option>`).join("")}<option value="not-sure">Not sure yet</option></select><p class="field-error" id="service-error"></p></div>
          <div class="field"><label for="budget">Project budget range</label><select id="budget" name="budget"><option value="">Prefer not to say</option><option>Exploring / not set</option><option>Under ₹1 lakh</option><option>₹1–3 lakh</option><option>₹3–8 lakh</option><option>₹8 lakh+</option></select><p class="field-error"></p></div>
          <div class="field"><label for="contactMethod">Preferred contact method</label><select id="contactMethod" name="contactMethod"><option>Email</option><option>Phone / video call (details arranged by email)</option></select><p class="field-error"></p></div>
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
  if (path === "/work/") return { page: workPage(), title: "Work — A&M Tech Solutions", description: "A verified portfolio structure for A&M Tech Solutions projects and case studies." };
  if (path === "/work/project-template/") return { page: workTemplatePage(), title: "Project Case Study Template — A&M Tech Solutions", description: "The project detail template for future verified case studies." };
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

  const form = document.querySelector("#project-form");
  if (form) setupProjectForm(form);
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

  let seenThisSession = false;
  try { seenThisSession = sessionStorage.getItem("am-intro-seen") === "true"; } catch { /* storage may be unavailable */ }
  const minimumDuration = prefersReducedMotion ? 40 : seenThisSession ? 480 : 1180;
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
  await new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion ? 10 : 140));

  siteLoader.classList.add("is-exiting");
  document.body.classList.remove("loader-active");
  try { sessionStorage.setItem("am-intro-seen", "true"); } catch { /* storage may be unavailable */ }

  window.setTimeout(() => {
    siteLoader.classList.add("is-hidden");
    siteLoader.setAttribute("aria-hidden", "true");
  }, prefersReducedMotion ? 20 : 680);
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
      const response = await fetch(config.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ ...data, formStartedAt: undefined, website: undefined }) });
      if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
      form.reset();
      showStatus("Your inquiry was received. Thank you—we'll follow up using the details you provided.", "success");
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

window.addEventListener("popstate", () => render());
document.body.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#primary-navigation");
    if (toggle?.getAttribute("aria-expanded") === "true") { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); nav?.classList.remove("open"); document.body.classList.remove("menu-open"); toggle.focus(); }
  }
});

render();
playInitialLoader();
