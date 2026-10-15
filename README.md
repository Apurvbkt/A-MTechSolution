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

The deployable output is written to `dist/`. Local builds use the preview URL for canonical metadata. The GitHub Pages workflow supplies the real Pages URL and repository base path automatically.

## Deploy with GitHub Pages

The included `.github/workflows/deploy-pages.yml` workflow verifies, builds, and deploys the site whenever `main` is pushed. It reads the Pages URL and repository base path from GitHub automatically, so both `username.github.io` repositories and ordinary project repositories are supported.

1. Create or connect the GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions** if it is not selected automatically.
4. Open the workflow run and wait for the `deploy` job to complete.

For a custom domain, configure the domain in GitHub Pages first, then set a repository variable or adjust the build environment so `SITE_URL` matches that verified domain. Do not add a `CNAME` file until the domain is confirmed.

## Contact delivery

The contact interface validates inputs, includes a honeypot and minimum-completion-time check, handles loading and server failures, and never reports success without a successful server response.

Set `contactEndpoint` in `site-config.js` to a secure HTTPS endpoint that:

- accepts JSON `POST` requests;
- validates and sanitizes all fields again on the server;
- applies rate limiting and spam protection;
- stores or delivers the enquiry before returning a 2xx response;
- does not expose provider secrets to the browser;
- returns a non-2xx status on delivery failure.

For a stricter production configuration, inject `site-config.js` during deployment rather than editing it manually. Content Security Policy and HSTS should be added by the production host after the verified form, font, and hosting origins are known.

## Content and routes

- Company configuration: `src/content.js` and `site-config.js`
- Presentation and routing: `src/app.js`
- Design system: `src/styles.css`
- Route-specific build metadata and sitemap: `scripts/build.mjs`
- Visual assets: `public/`

Routes include the home page, services overview, eight service details, solutions, work directory and case-study template, products directory and product concept page, about, contact, and six legal documents.

## Required before public launch

1. If a custom production domain is connected, rebuild with its verified `SITE_URL`.
2. Add verified contact details and a secure form endpoint.
3. Have all legal drafts reviewed for the actual entity, jurisdiction, operations, providers, commercial terms, and contact details.
4. Replace portfolio placeholders only with approved, verifiable project content.
5. Re-audit privacy and cookies after hosting, analytics, forms, embeds, authentication, or billing tools are selected.
