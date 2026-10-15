export const company = {
  name: "A&M Tech Solutions",
  shortName: "A&M",
  positioning: "We build digital products that move businesses forward.",
  description: "From your first website to the systems that run your business, we turn complex ideas into practical digital products.",
  availability: "Project enquiries open",
  contactEmail: ""
};

export const services = [
  {
    slug: "website-development",
    number: "01",
    title: "Website Development",
    short: "Fast, distinctive websites that make the business clear and the next step obvious.",
    intro: "We design and build digital storefronts that earn attention, explain your value, and give visitors a confident path to action.",
    problems: ["An outdated or unclear digital presence", "A site that looks fine but produces poor enquiries", "Slow pages and awkward mobile experiences", "Content that is difficult to maintain"],
    capabilities: ["Business and marketing websites", "Landing pages and campaign sites", "Portfolio and editorial experiences", "E-commerce foundations", "Content architecture and CMS-ready builds", "Performance, accessibility, and SEO fundamentals"],
    useCases: ["Launching a new business", "Repositioning an established company", "Replacing a template that no longer fits", "Turning a complex offer into a clear visitor journey"],
    approach: "We start with the decisions your visitors need to make, then shape the content, interface, and technology around that journey. The result is deliberate—not a theme with your logo added.",
    technology: "The stack is selected for the content model, editing needs, integrations, and hosting constraints. We prefer standards-based, maintainable solutions over unnecessary complexity.",
    faqs: [
      ["Can you work with our existing website?", "Yes. We first review its structure, technology, content, and performance, then recommend whether focused improvements or a rebuild is the more sensible investment."],
      ["Will we be able to update content?", "That can be part of the scope. We can connect an appropriate content system or structure the site so routine updates remain straightforward."],
      ["Do you guarantee search rankings?", "No responsible team can guarantee rankings. We build a strong technical and content foundation and can define further SEO work separately."]
    ],
    related: ["ui-ux-product-design", "maintenance-support", "web-application-development"]
  },
  {
    slug: "web-application-development",
    number: "02",
    title: "Web Application Development",
    short: "Purpose-built portals, internal tools, and workflow applications for real operational needs.",
    intro: "When spreadsheets, inboxes, and disconnected tools start slowing the business down, a focused web application can turn the workflow into one dependable system.",
    problems: ["The same data is re-entered across multiple tools", "Customers or teams lack a clear self-service portal", "Critical workflows depend on fragile spreadsheets", "Off-the-shelf software forces the wrong process"],
    capabilities: ["Custom web applications", "Customer and partner portals", "Internal operations tools", "Workflow and approval systems", "Role-based experiences", "API and third-party integrations"],
    useCases: ["Digitising a manual service", "Giving customers secure access to information", "Coordinating multi-step internal work", "Connecting fragmented systems"],
    approach: "We model the workflow before the interface. Key roles, states, permissions, exceptions, and reporting needs are made explicit, then delivered in useful, testable increments.",
    technology: "Architecture depends on data sensitivity, scale, integrations, and ownership. Authentication, authorization, validation, and audit needs are treated as system concerns—not visual add-ons.",
    faqs: [
      ["Can you replace a spreadsheet process?", "Often, yes—but the right first step is mapping what the spreadsheet actually controls, including exceptions and informal workarounds."],
      ["Can the application connect to our existing tools?", "Where stable APIs or supported integration paths exist, they can be assessed and scoped as part of the solution."],
      ["How is access controlled?", "Access rules are designed around user roles and enforced on the server. Exact identity and security choices depend on the agreed architecture."]
    ],
    related: ["custom-software-automation", "crm-development", "ui-ux-product-design"]
  },
  {
    slug: "crm-development",
    number: "03",
    title: "CRM Development",
    short: "Customer and sales systems shaped around the way your team actually follows up.",
    intro: "A useful CRM should help the team act, not create more administration. We design the pipeline, customer history, and follow-up workflow around your sales process.",
    problems: ["Leads disappear between inboxes and spreadsheets", "No shared view of customer conversations", "Follow-ups depend on individual memory", "Generic CRM stages do not match the sales process"],
    capabilities: ["Lead capture and qualification", "Custom sales pipelines", "Customer and activity history", "Tasks and follow-up workflows", "Permission-aware dashboards", "Reporting and supported integrations"],
    useCases: ["Service businesses managing enquiries", "Teams moving beyond spreadsheets", "Businesses with a non-standard sales cycle", "Operations that need sales and delivery context connected"],
    approach: "We document how a lead enters, moves, stalls, converts, and hands over. The initial release focuses on the smallest workflow that gives the whole team a trustworthy source of truth.",
    technology: "A CRM may be a custom application, an extension of an existing platform, or an integration layer. We recommend the practical option after understanding the process and ownership requirements.",
    faqs: [
      ["Should we build or configure an existing CRM?", "That decision depends on how distinctive your workflow is, which integrations matter, and the total cost of ownership. We assess both options honestly."],
      ["Can follow-up be automated?", "Supported reminders and communications can be automated where useful, with clear rules and appropriate consent."],
      ["Can existing data be migrated?", "Migration can be scoped after reviewing its structure, quality, ownership, and required history."]
    ],
    related: ["web-application-development", "custom-software-automation", "maintenance-support"]
  },
  {
    slug: "erp-business-systems",
    number: "04",
    title: "ERP & Business Systems",
    short: "Connected inventory, procurement, operations, and reporting without forcing the wrong workflow.",
    intro: "We help growing businesses replace fragmented operational records with a system that reflects how stock, work, and decisions move through the company.",
    problems: ["Inventory records disagree across locations", "Purchases and approvals are hard to trace", "Operational reporting arrives too late", "Teams rely on isolated documents and manual reconciliation"],
    capabilities: ["Inventory and stock movement", "Procurement workflows", "Operations and job tracking", "Role-based approvals", "Management reporting", "Supported accounting or commerce integrations"],
    useCases: ["Construction and project operations", "Retail and distribution workflows", "Multi-location stock control", "Growing businesses formalising operations"],
    approach: "ERP work begins with process boundaries and data ownership. We prioritise the operational core, define controls and exceptions, and avoid turning every wish into an oversized first release.",
    technology: "Data integrity, permissions, auditability, backups, and integration reliability shape the architecture. Infrastructure and deployment choices follow the agreed operational risk.",
    faqs: [
      ["Is a custom ERP always the right choice?", "No. Established platforms can be better when the business fits them. Custom work is most useful where the workflow creates real advantage or cannot be supported sensibly elsewhere."],
      ["Can modules be delivered in stages?", "Yes. A staged rollout often reduces risk and lets the team validate one operational area before expanding."],
      ["Will it include accounting?", "Accounting features or integrations must be scoped carefully. We do not imply regulated or compliance-critical capability without verified requirements and review."]
    ],
    related: ["custom-software-automation", "web-application-development", "maintenance-support"]
  },
  {
    slug: "saas-product-development",
    number: "05",
    title: "SaaS Product Development",
    short: "A structured path from product idea to a secure, usable subscription software foundation.",
    intro: "We help shape and build software products with a clear audience, focused first release, and architecture that can grow without pretending every feature belongs in version one.",
    problems: ["A strong idea lacks a focused first release", "Product scope keeps growing before validation", "Billing, identity, and tenancy decisions are unclear", "The interface does not make the product easy to adopt"],
    capabilities: ["Product discovery and release planning", "Multi-tenant application foundations", "Authentication and account flows", "Subscription and billing integration", "Product dashboards", "Trial and entitlement architecture"],
    useCases: ["Validating a B2B software concept", "Turning an internal tool into a product", "Rebuilding an early prototype", "Launching a focused paid workflow"],
    approach: "We define who the product is for, what job it performs, and which evidence the first release should produce. Product, design, engineering, and operational requirements move together.",
    technology: "Trials, subscriptions, and entitlements require server-side enforcement. Billing and authentication use established providers where appropriate; provider choice and compliance scope are confirmed before implementation.",
    faqs: [
      ["Can you build a minimum viable product?", "Yes, when 'minimum' still means coherent, secure, and useful. We define the smallest release that can test the product's key assumption."],
      ["Can a free trial be added?", "Yes, once a real product backend and billing model exist. Trial dates and access must be enforced server-side, with clear renewal disclosures."],
      ["Do you provide product strategy?", "We can support product framing and delivery decisions within the agreed engagement, while business ownership and market validation remain collaborative responsibilities."]
    ],
    related: ["ui-ux-product-design", "web-application-development", "maintenance-support"]
  },
  {
    slug: "custom-software-automation",
    number: "06",
    title: "Custom Software & Automation",
    short: "Practical systems and integrations that remove repetitive work and connect the tools you keep.",
    intro: "Not every problem needs a giant platform. Sometimes the highest-value move is one reliable tool, integration, or automation that gives the team time and visibility back.",
    problems: ["Teams repeat the same transfer or reporting work", "Important systems do not exchange data", "A specialist workflow has no suitable off-the-shelf tool", "Manual processes introduce delays and errors"],
    capabilities: ["Business-specific software", "API integrations", "Process automation", "Reporting and data workflows", "Third-party service connections", "Operational utilities"],
    useCases: ["Generating recurring operational reports", "Synchronising supported systems", "Replacing repetitive administrative steps", "Building a focused specialist tool"],
    approach: "We quantify the friction, map failure cases, and identify which decisions need human oversight. Automation is designed to be observable and recoverable—not an invisible chain nobody can support.",
    technology: "Integration feasibility depends on supported APIs, rate limits, authentication, and data responsibilities. We verify these constraints before promising an automated path.",
    faqs: [
      ["Can any manual process be automated?", "No. Some processes are too variable, too risky, or depend on unavailable systems. We identify where automation is reliable and where human review remains important."],
      ["Will the automation be monitored?", "Monitoring, alerts, logs, and maintenance expectations can be included according to the operational importance of the workflow."],
      ["Can you integrate with a specific platform?", "We first verify that platform's supported API, account access, limits, and terms before confirming scope."]
    ],
    related: ["web-application-development", "erp-business-systems", "maintenance-support"]
  },
  {
    slug: "ui-ux-product-design",
    number: "07",
    title: "UI/UX & Product Design",
    short: "Clear interfaces and resilient design systems for products people need to use every day.",
    intro: "We turn dense requirements into understandable journeys, then build an interface language that stays consistent as the product grows.",
    problems: ["Users struggle to understand the next action", "A product has grown without a coherent interface system", "Mobile and desktop experiences feel disconnected", "Requirements have not been tested through realistic flows"],
    capabilities: ["Product and workflow mapping", "Wireframes and interactive prototypes", "Dashboard and interface design", "Responsive experience design", "Component and design systems", "Accessibility-aware interaction design"],
    useCases: ["Designing a new application before build", "Improving a complex workflow", "Unifying an inconsistent product", "Preparing a product team to scale delivery"],
    approach: "We work from real tasks and information, not isolated screens. Prototypes make assumptions visible early; the design system captures the decisions that should stay consistent.",
    technology: "Design outputs are created with implementation in mind. Component states, responsive behavior, accessibility, and data edge cases are specified at the level the engagement requires.",
    faqs: [
      ["Can you design without developing the product?", "Yes. A design-only scope can be defined with appropriate handoff, though close collaboration with the implementation team is recommended."],
      ["Do you create design systems?", "Yes, at a scale appropriate to the product. A small, useful system is often more valuable than a large catalogue that does not match real screens."],
      ["How do you handle accessibility?", "We account for semantic structure, keyboard use, focus, contrast, motion preferences, and understandable interaction states, then validate in implementation when included."]
    ],
    related: ["website-development", "web-application-development", "saas-product-development"]
  },
  {
    slug: "maintenance-support",
    number: "08",
    title: "Maintenance & Technical Support",
    short: "Agreed support for the fixes, improvements, and operational care a live product needs.",
    intro: "Launch is the start of real usage. We offer clearly scoped support arrangements that keep software dependable and create a practical path for improvement.",
    problems: ["Small issues accumulate without clear ownership", "Dependencies and integrations need planned attention", "Performance declines as content or usage grows", "The team needs a reliable path for enhancements"],
    capabilities: ["Bug investigation and fixes", "Planned product improvements", "Performance optimisation", "Dependency and compatibility work", "Operational support", "Technical review and recommendations"],
    useCases: ["Supporting a newly launched product", "Stabilising an existing application", "Managing an improvement backlog", "Providing technical continuity for a small team"],
    approach: "Support starts with a defined system boundary, response expectations, access model, and priority framework. Work is tracked transparently; emergency coverage is only included when explicitly agreed.",
    technology: "Effective support requires appropriate repository, hosting, monitoring, and provider access. We review the system before confirming service levels or responsibility.",
    faqs: [
      ["Do you offer 24/7 support?", "Not by default. Coverage and response times must be agreed in writing for each support arrangement."],
      ["Can you maintain software built by another team?", "Potentially. We first conduct a technical review to understand its condition, dependencies, deployment process, and risks."],
      ["Is maintenance included after launch?", "Only the support and warranty terms stated in the project agreement apply. Ongoing improvements are scoped separately or covered by an agreed plan."]
    ],
    related: ["website-development", "web-application-development", "custom-software-automation"]
  }
];

export const solutions = [
  { icon: "↗", title: "Startups", problem: "A promising idea needs a credible first release without carrying every future feature.", solution: "Shape the core journey, test assumptions early, and build a focused foundation that is ready to learn from real use." },
  { icon: "⌁", title: "Small businesses", problem: "Spreadsheets, messages, and memory are doing the work of a system.", solution: "Map the operational friction and replace the most expensive manual steps with one practical, shared workflow." },
  { icon: "▤", title: "Construction & operations", problem: "Stock, procurement, jobs, and approvals are difficult to see in one place.", solution: "Create an operational view around the business's actual handoffs, roles, and reporting needs." },
  { icon: "◇", title: "Retailers", problem: "Product, stock, order, and customer information becomes fragmented as channels grow.", solution: "Connect the right records and tools so the team can make faster, more reliable decisions." },
  { icon: "◎", title: "Service businesses", problem: "Enquiries and follow-ups slip between inboxes while delivery context stays scattered.", solution: "Design a clear path from lead to customer to ongoing work, with the right information visible at each stage." },
  { icon: "＋", title: "Growing companies", problem: "Independent tools no longer provide a trustworthy picture of the business.", solution: "Build or integrate the systems that need to share context—without replacing useful tools just for the sake of it." }
];

export const process = [
  ["01", "Discover", "Understand the business, the people involved, and the problem worth solving."],
  ["02", "Plan", "Define scope, workflows, priorities, constraints, and a delivery roadmap."],
  ["03", "Design", "Make the experience tangible before committing to implementation detail."],
  ["04", "Build", "Develop, integrate, and test the agreed product in useful increments."],
  ["05", "Launch", "Deploy carefully and verify the production experience and critical paths."],
  ["06", "Improve", "Support agreed fixes, learning, and the next high-value improvements."]
];

export const productCategories = [
  { slug: "operations-hub", status: "Concept / coming soon", name: "Operations Hub", category: "Business operations", description: "A configurable workspace concept for coordinating stock, work, approvals, and reporting. No public release or trial is currently available.", audience: "Growing operational teams exploring a more connected way to work.", features: ["Configurable workflows", "Role-aware workspaces", "Operational records", "Reporting views"], trial: false },
  { status: "Future category", name: "CRM", category: "Customer management", description: "Lead, customer, pipeline, and follow-up tools may be introduced as verified products become available." },
  { status: "Future category", name: "Inventory", category: "Stock management", description: "Inventory and stock-control products will only be listed once a supported release exists." },
  { status: "Future category", name: "Workforce", category: "People operations", description: "Future workforce software may support practical scheduling and people workflows." },
  { status: "Future category", name: "Project tools", category: "Delivery operations", description: "Focused project and service-delivery tools are part of the future product direction." },
  { status: "Future category", name: "Automation", category: "Connected workflows", description: "Reusable automation products may be introduced after the workflows are validated." }
];

export const legalPages = {
  "terms-and-conditions": {
    title: "Terms & Conditions",
    intro: "A working draft for the use of this website and future service engagements. Project-specific terms must be set out in a signed proposal or agreement.",
    sections: [
      ["1. Status of this draft", "These terms are a publication-ready structure, not confirmed legal advice. Company registration details, governing law, addresses, payment rules, and acceptance procedures must be reviewed and completed before publication."],
      ["2. Website use and eligibility", "Use the website lawfully and do not attempt to disrupt, probe, scrape abusively, or gain unauthorised access to any system. If a future service requires an account, additional eligibility and account terms may apply."],
      ["3. Enquiries, proposals, and scope", "An enquiry does not create a client relationship. Services, deliverables, responsibilities, timelines, assumptions, acceptance criteria, fees, taxes, and change control are binding only when recorded in an agreed project document."],
      ["4. User and client responsibilities", "Clients may be required to provide accurate requirements, content, approvals, access, licences, and feedback on time. Delays or incorrect information can affect delivery and cost."],
      ["5. Intellectual property", "Ownership and licensing of deliverables, pre-existing materials, open-source software, tools, and third-party assets must be defined in the applicable agreement. Website content may not be copied or misrepresented without permission."],
      ["6. Third-party services", "Projects and this website may rely on hosting, domains, analytics, payment, email, identity, or other providers. Their own terms, availability, pricing, and data practices may apply."],
      ["7. Payments and taxes", "Payment schedules, accepted methods, late-payment terms, currency, and applicable taxes must be confirmed in the relevant agreement. No unstated refund or payment commitment is made by this draft."],
      ["8. Availability and warranties", "The public website is provided on an as-available basis. Service warranties, defect periods, support coverage, and service levels apply only where expressly agreed."],
      ["9. Liability", "Any exclusions, caps, and exceptions must be reviewed for the confirmed jurisdiction and included in the final legal terms. Nothing in this draft is intended to exclude liability that cannot lawfully be excluded."],
      ["10. Termination and disputes", "Project termination rights, fees due, handover obligations, governing law, venue, and dispute procedure must be confirmed in the signed agreement and final published terms."],
      ["11. Contact", "Insert the verified legal entity name, registered contact details, and legal notice email before publication."]
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    intro: "This draft reflects the current marketing website: it does not intentionally use advertising trackers, create user accounts, or accept payments. It must be updated when real hosting, analytics, forms, or products are configured.",
    sections: [
      ["1. Controller details", "Insert the verified legal entity, business address, jurisdiction, and privacy contact before publication."],
      ["2. Information submitted by you", "The planned project enquiry form may collect name, business email, company, service interest, budget range, project description, and contact preference. In this source version, no submission endpoint is configured and the interface does not claim to deliver entries."],
      ["3. Technical information", "The production host may process IP address, device, browser, request, and security log information to deliver and protect the site. Confirm the actual provider and retention period before publication."],
      ["4. Purposes and legal basis", "Enquiry information should be used to respond to requested business communications, assess potential work, prevent abuse, and maintain necessary records. The applicable legal bases depend on the confirmed jurisdiction and operations."],
      ["5. Sharing and processors", "Information should only be shared with necessary service providers and authorised personnel. List actual hosting, form, email, analytics, CRM, and other processors once selected."],
      ["6. International transfers", "Document any cross-border processing safeguards used by actual providers. Do not publish a generic transfer claim without confirming the data path."],
      ["7. Retention", "Define enquiry, client, security log, and account retention periods according to operational and legal needs. Keep personal information only as long as necessary."],
      ["8. Your rights", "Depending on location, individuals may have rights to access, correct, delete, restrict, object, or request portability of personal information and to complain to an authority."],
      ["9. Security", "Use access controls, encrypted transport, provider safeguards, input validation, and limited data collection. No system can promise absolute security."],
      ["10. Changes and contact", "Add a verified effective date, explain material updates, and provide the confirmed privacy contact before publication."]
    ]
  },
  "free-trial-terms": {
    title: "Free Trial Terms",
    intro: "A future-facing draft only. A&M Tech Solutions does not currently advertise an active public product trial on this website.",
    sections: [
      ["1. Availability", "Trials may be offered only for specifically identified products, plans, regions, and eligible users. Displayed eligibility, duration, included features, and expiry behavior must match the implemented product."],
      ["2. Eligibility", "A future product may limit one trial per person, organisation, account, or payment method and may exclude previous subscribers or abuse. Exact rules must be disclosed at sign-up."],
      ["3. Start and expiry", "The trial should start and expire according to server-recorded times. A browser countdown is informational only and must never control entitlement."],
      ["4. Payment and renewal", "Whether payment details are required, the post-trial price, billing period, taxes, renewal date, and cancellation deadline must be shown clearly before consent. No payment method should be collected unless the implemented flow requires it."],
      ["5. Use and limits", "Acceptable-use, account-security, data, support, and fair-use limits for the actual product must be incorporated or linked during sign-up."],
      ["6. Cancellation and data", "Explain how to cancel before renewal, what access remains, and how trial data is exported or deleted. These statements must match the implemented product."],
      ["7. Changes and termination", "Trial changes, suspension, abuse handling, and termination rights must be lawful, clear, and specific to the available offer."],
      ["8. Confirmation required", "Complete the product name, trial length, eligibility, billing provider, pricing, renewal, jurisdiction, and contact details before any trial goes live."]
    ]
  },
  "refund-cancellation-policy": {
    title: "Refund & Cancellation Policy",
    intro: "This draft separates custom project work from future software subscriptions. Actual commitments must be confirmed in signed agreements and product checkout terms.",
    sections: [
      ["1. Custom services", "Deposits, milestone payments, cancellation fees, completed work, committed third-party costs, and handover obligations must be defined in each project agreement. This page does not promise refunds for bespoke work."],
      ["2. Change or cancellation by a client", "A client should give written notice through the agreed channel. Charges may apply for completed work, reserved capacity, and non-cancellable costs, subject to the signed agreement and applicable law."],
      ["3. Cancellation by the provider", "Any right to suspend or end work, together with notice, payment, and handover consequences, must be stated in the relevant agreement."],
      ["4. Future subscriptions", "Product cancellation timing, access through the billing period, renewal prevention, data export, and deletion must match the implemented billing system and checkout disclosure."],
      ["5. Refund eligibility", "If a product offers refunds, state the exact window, exclusions, request method, processing time, and treatment of taxes and usage. Do not publish an unconditional commitment unless approved."],
      ["6. Statutory rights", "Nothing in the final policy should remove mandatory consumer or other rights that apply in the confirmed jurisdiction."],
      ["7. Contact and review", "Insert the verified billing contact, entity details, jurisdiction, and approved policy rules before publication."]
    ]
  },
  "saas-subscription-terms": {
    title: "SaaS Subscription Terms",
    intro: "A modular legal draft for future hosted software. No current product, price, uptime commitment, or subscription is represented by this page.",
    sections: [
      ["1. Product and account", "Identify the product, contracting entity, eligible account holder, authorised users, account security duties, and applicable order or plan."],
      ["2. Subscription licence", "Define the limited, non-exclusive right to use the service during the paid term, including plan, user, usage, territorial, and fair-use limits."],
      ["3. Fees, taxes, and renewal", "Show price, currency, billing frequency, taxes, renewal mechanism, price-change notice, and payment-failure consequences before purchase."],
      ["4. Trials and promotions", "State eligibility, duration, included access, expiry, conversion, and cancellation in terms consistent with the actual server-side entitlement and billing flow."],
      ["5. Customer data", "Define ownership, permitted processing, instructions, export, deletion, retention, backups, and any data-processing agreement relevant to the actual product."],
      ["6. Acceptable use", "Prohibit unlawful, abusive, infringing, harmful, unauthorised, or security-disrupting activity and define proportionate enforcement."],
      ["7. Availability and support", "State only verified availability targets, planned maintenance, exclusions, support channels, and service credits. Do not imply a service level that is not operationally supported."],
      ["8. Security and third parties", "Describe the actual shared-responsibility model, provider dependencies, and material security practices without promising absolute protection."],
      ["9. Intellectual property", "Clarify service ownership, customer materials, feedback, third-party components, and the licence needed to operate the service."],
      ["10. Suspension, termination, and liability", "Confirm triggers, notice, cure, post-termination access, liability caps, exclusions, governing law, and dispute process with legal review."]
    ]
  },
  "cookie-policy": {
    title: "Cookie Policy",
    intro: "The current source does not intentionally set advertising or analytics cookies. Production hosting or future integrations may introduce essential or optional storage and must be audited before this policy is published.",
    sections: [
      ["1. What cookies are", "Cookies and similar storage allow a website to remember information or support functions across requests or visits."],
      ["2. Current use", "This source version does not include analytics, advertising pixels, user accounts, or a consent platform. The deployed host may use strictly necessary security or routing technologies; confirm this with the selected provider."],
      ["3. Future categories", "If introduced, describe essential, preference, analytics, and marketing technologies separately, naming providers, purposes, duration, and access."],
      ["4. Consent", "Do not load non-essential technologies until any consent required by the visitor's jurisdiction has been obtained. Rejecting optional cookies should be as straightforward as accepting them."],
      ["5. Managing storage", "Visitors can use browser controls to inspect or remove stored data. Blocking essential storage may affect functions that genuinely depend on it."],
      ["6. Audit before launch", "Review the production host, embedded media, forms, analytics, chat, payment, and account tools. Replace this draft with an accurate inventory, verified contact, and effective date."]
    ]
  }
};

export const navItems = [
  ["Services", "/services/"],
  ["Solutions", "/solutions/"],
  ["Products", "/products/"],
  ["About", "/about/"],
  ["Contact", "/contact/"]
];
