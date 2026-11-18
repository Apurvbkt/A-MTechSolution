# A&M Tech Solutions website

A production-oriented, dependency-free website for A&M Tech Solutions. It uses semantic HTML, modular JavaScript, centralized content, responsive CSS, and a small Node build pipeline. No framework runtime or third-party component library is shipped to visitors.

## Run locally

Requires Node.js 20 or later.

```powershell
npm run dev
```

Open `http://127.0.0.1:4173`.

## Verify and build

```powershell
npm run check
npm run build
```

The Netlify deployable output is written to `dist/`. Production builds use `https://amteches.in` for canonical metadata through `netlify.toml`.

## Production hosting and GitHub redirect

Netlify is the production host for `https://amteches.in`. The included `.github/workflows/deploy-pages.yml` workflow intentionally publishes redirect-only pages at the former GitHub Pages URL so visitors and search engines move to the matching route on the production domain.

Do not configure `amteches.in` as a GitHub Pages custom domain; its DNS belongs to Netlify. Keep GitHub Pages set to **GitHub Actions** only for the legacy redirect deployment.

## Contact delivery

The contact and software-access interfaces validate inputs, include a honeypot and minimum-completion-time check, handle loading and server failures, and never report success without a successful server response. Access pages do not contain direct application, APK, archive, or installer links.

Set `contactEndpoint` in `site-config.js` to a secure HTTPS endpoint that:

- accepts JSON `POST` requests;
- validates and sanitizes all fields again on the server;
- applies rate limiting and spam protection;
- stores or delivers the enquiry before returning a 2xx response;
- does not expose provider secrets to the browser;
- returns a non-2xx status on delivery failure.

Set `accessEndpoint` for demo/download requests. If it is empty, the access form falls back to `contactEndpoint`. The endpoint payload includes `formType: "software-access"`, project, name, phone, email, company, requested access type, consent, and message. The receiving service must deliver the request to the verified administrator email before it returns success.

For a stricter production configuration, inject `site-config.js` during deployment rather than editing it manually. Content Security Policy and HSTS should be added by the production host after the verified form, font, and hosting origins are known.

## Analytics and consent

`analyticsId` in `site-config.js` configures Google Analytics 4. The Google tag is not requested until a visitor selects **Accept analytics**. Declining keeps analytics disabled, and the footer's **Cookie settings** control lets visitors revisit the choice. The integration records consented page views, CTA/contact clicks, and successful form events without intentionally sending form field values.

## Content and routes

- Company configuration: `src/content.js` and `site-config.js`
- Presentation and routing: `src/app.js`
- Design system: `src/styles.css`
- Route-specific build metadata and sitemap: `scripts/build.mjs`
- Visual assets: `public/`

Routes include the home page, services overview, eight service details, solutions, work directory and case studies, a controlled software-access directory with five project request pages, products, about, contact, and six legal documents.

## Required before public launch

1. If a custom production domain is connected, rebuild with its verified `SITE_URL`.
2. Add verified contact details and a secure form endpoint.
3. Have all legal drafts reviewed for the actual entity, jurisdiction, operations, providers, commercial terms, and contact details.
4. Replace portfolio placeholders only with approved, verifiable project content.
5. Re-audit privacy and cookies after hosting, analytics, forms, embeds, authentication, or billing tools are selected.
