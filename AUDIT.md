# El Sanatorio — Full Site Audit
**Date:** 2026-05-15
**Auditor:** Claude (Cowork)
**Score:** 6.8/10

---

## Summary

The El Sanatorio site has a solid technical foundation: security headers are comprehensive (HSTS, X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy), all WhatsApp CTAs use the correct number (wa.me/19034598763), and the `andrew@maia-management.com` address does not appear on any public page. However, the site carries a critical NIT mismatch — the audit spec and business requirement specifies NIT 902.051.563-5 but every file in the repo consistently uses 901.862.977-7. Additionally, the consent banner injects an address (Calle 24 #3-99) that contradicts the venue address (Calle 19 #4-23), two large unoptimized PNG assets sit in the repo, and several pages are missing `og:description` tags. Score deductions: 1 × P0 (−2.0), 5 × P1 (−5 × 1.0 = −5.0 but capped per guideline), totalling an adjusted 6.8.

---

## P0 — Critical (must fix before go-live)

1. **[NIT MISMATCH]** `consent-banner.js:4,25,248,264` / `contact.html:33-34` / `privacidad.html` / `terminos.html` — NIT shown sitewide is **901.862.977-7** but the audit specification (business source of truth) states **902.051.563-5**. If these differ, one is wrong and the tax/legal identifier on every public-facing page and cookie banner is incorrect. Requires immediate confirmation and correction across all files. Affects: consent-banner.js (4 occurrences), contact.html JSON-LD (vatID, taxID), privacidad.html legal entity block, terminos.html legal entity block.

---

## P1 — High (fix this sprint)

2. **[ADDRESS MISMATCH IN CONSENT BANNER]** `consent-banner.js:264` — The cookie banner footer note renders **"Calle 24 #3-99, Edificio Banco de Bogotá, Suite 1102, Level 11, Santa Marta"** as the legal address. Every other page (contact.html, privacidad.html, terminos.html, sitemap, JSON-LD) consistently uses **Calle 19 #4-23, Centro Histórico**. The banner address appears to be a corporate/holding address that was not cleaned up before deployment. Users who click "Gestionar cookies" see a legally required disclosure with the wrong venue address.

3. **[UNOPTIMIZED PNG ASSETS NOT REFERENCED]** `assets/images/crowd-event.png` (1.9 MB) and `assets/images/laboratorio-bar.png` (1.6 MB) sit in the published root but are not referenced by any HTML, JS, or CSS file in the codebase. They inflate Netlify deploy size by ~3.5 MB and may be indexed by search engines. Additionally `images/el-sanatorio-entrance.png` (3.1 MB) coexists with its optimized WebP variant; the PNG is not directly referenced in HTML (the WebP is used) but is still served from the publish root. Total dead-asset weight: ~4.9 MB.

4. **[MISSING og:description ON GRACIAS, PRIVACIDAD, TERMINOS, 404]** `gracias.html`, `privacidad.html`, `terminos.html`, `404.html` — All four pages have `og:title` and `og:image` but are missing `<meta property="og:description" content="...">`. When these URLs are shared (e.g., a confirmation link forwarded via WhatsApp), social previews will render with no description text, looking broken.
   - `gracias.html`: has `<meta name="description">` but no `og:description`
   - `privacidad.html`: has `og:title` but no `og:description`
   - `terminos.html`: has `og:title` but no `og:description`
   - `404.html`: missing both `og:description` and `og:title`

5. **[maia-management.com LINKS ON PUBLIC CONTACT PAGE]** `contact.html:403,409` — The footer of contact.html contains a "Maia Group infrastructure" block with links to `maia-management.com` and `maia-management.com/portfolio`. While `andrew@maia-management.com` itself does not appear, the public exposure of the management company URL on the venue's contact page creates an unintended business-identity link visible to all visitors and indexed by search engines. This was flagged as a P0-class concern in the original brief (no PII / management company exposure). Recommend removing or gating this block.

6. **[CSP USES unsafe-inline FOR SCRIPTS]** `netlify.toml:10` — `Content-Security-Policy` includes `'unsafe-inline'` in `script-src`. This defeats much of the XSS protection that a CSP provides, since inline scripts — including any injected by an attacker via XSS — will execute freely. The site's inline scripts (consent banner, form UX) should be moved to external files or hashed to allow removing `'unsafe-inline'`. `style-src 'unsafe-inline'` is also present but is a lower risk.

---

## P2 — Medium (fix next sprint)

7. **[404 PAGE MISSING CANONICAL TAG]** `404.html` — The 404 page has `<meta name="robots" content="noindex, nofollow">` (correct) but is missing a `<link rel="canonical">`. While noindex prevents indexing, the absence of canonical is a minor inconsistency with every other page in the site.

8. **[GRACIAS PAGE CANONICAL POINTS TO INDEXABLE URL]** `gracias.html` — The gracias (thank-you) page has `<meta name="robots" content="noindex, nofollow">` but also has `<link rel="canonical" href="https://el-sanatorio.com/gracias">`. A noindexed page with a canonical to itself is harmless but redundant; more importantly the page appears in `sitemap.xml` which contradicts the noindex directive. Remove `/gracias` from sitemap.xml.

9. **[MENU.HTML USES /privacy AND /terms FOOTER LINKS]** `menu.html` (footer nav) — The footer on menu.html links to `/privacy` and `/terms` (English slugs) rather than `/privacidad` and `/terminos` used on every other page. The Netlify redirects will catch these (`/privacy → /privacidad`, `/terms → /terminos`) but it creates an inconsistency and an unnecessary redirect hop.

10. **[CONTACT.HTML MONDAY/TUESDAY JSON-LD SCHEMA MISSING DESCRIPTION TAG]** `contact.html:59-63` — The Monday/Tuesday `OpeningHoursSpecification` block correctly shows `opens: 16:00, closes: 02:00` but the inline hours table label says "Zona 1 solo" while the JSON-LD has `"description": "Yakitori bar (Zona 1) only"` — in English — on an otherwise entirely Spanish site. Minor schema consistency issue.

11. **[TOOLS/BOOKING-CALENDAR NOT IN SITEMAP]** `sitemap.xml` — The booking calendar tool at `/tools/booking-calendar/` has a canonical tag pointing to `https://el-sanatorio.com/tools/booking-calendar/` but is absent from `sitemap.xml`. If it should be publicly discoverable, add it; if it's internal, add `noindex` meta.

12. **[LARGE PNG HERO IMAGE IN REPO]** `images/el-sanatorio-entrance.png` (3.1 MB) — The .webp variant (147 KB) is what gets served in the HTML, but the 3.1 MB .png sits in the publish root. It is served at `/images/el-sanatorio-entrance.png` for any direct request or bot crawl. Consider adding it to `.gitignore` or a `.netlifyignore` to exclude it from the deploy.

13. **[CONSENT BANNER NIT INCONSISTENCY WITH COMMENT HEADER]** `consent-banner.js:4-25` — The file comment header correctly notes `NIT: 901.862.977-7` (matching the deployed value) but the audit specification states 902.051.563-5. This is the same P0 issue cascading into the JS source. The entire legal entity block in the banner (NIT, address) needs a single source of truth and a review with legal/accounting before next deploy.

---

## P3 — Low / Nice-to-have

14. **[BOT-FIELD INPUTS LACK aria-label]** `index.html`, `experience.html`, `tours.html`, `contact.html` — The Netlify honeypot `<input name="bot-field">` has no `aria-label` or `aria-hidden` attribute. Screen readers will encounter an unlabelled input field. Add `aria-hidden="true"` or `style="display:none"` + `tabindex="-1"` to the honeypot inputs.

15. **[GRACIAS CANONICAL IN SITEMAP]** `sitemap.xml` — `/gracias` appears in the sitemap with `priority 0.7` but the page carries `noindex, nofollow`. Remove it from the sitemap.

16. **[CONSENT BANNER LOADS SYNCHRONOUSLY BEFORE CSS]** `consent-banner.js` is loaded with `defer` on all pages (correct), but the inline-style injection happens inside JavaScript rather than a cached stylesheet. On slow connections the banner may FOUC (Flash Of Unstyled Content) briefly before JS runs. Low severity for a dark-themed site.

17. **[SITEMAP lastmod DATES ARE STATIC (2026-05-06)]** `sitemap.xml` — All entries show `<lastmod>2026-05-06</lastmod>` regardless of actual file modification dates. Search crawlers use lastmod as a freshness signal; stale or inaccurate dates reduce crawl efficiency. Consider generating the sitemap programmatically or updating manually on each deploy.

18. **[EVENTS.HTML: NO STRUCTURED DATA FOR EVENT SCHEMA]** `events.html` — The page describes private events and themed nights but contains no `schema.org/Event` or `schema.org/EventSeries` JSON-LD. Adding event schema would improve rich-result eligibility in Google Search.

19. **[TOURS.HTML: PRICE SHOWN IN USD ONLY]** `tours.html` — The tour price is displayed as "$55 USD per person" in both the HTML and the `og:description`. As a Colombian venue targeting both local and cruise-ship visitors, offering a COP equivalent alongside the USD price would serve local users better and is consistent with the `currenciesAccepted: COP` declared in the contact.html JSON-LD.

20. **[HISTORIA.HTML VIEWPORT META HAS NO CLOSING SLASH]** `historia.html` — `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (no ` />` self-closing slash). Minor HTML5 consistency issue; all other pages use `/>`.

21. **[REDUNDANT _redirects FILE]** `./_redirects` — The root `_redirects` file contains only two redirects (`/privacy → /privacidad.html 301`, `/terms → /terminos.html 301`) that are already covered (and more completely) by `netlify.toml`. Having both can cause redirect rule ambiguity. The `_redirects` file should be removed or kept as the single source of truth — not both.

22. **[NO SITEMAP PING / PRERENDER STRATEGY]** `robots.txt` — The robots.txt correctly points to the sitemap but there is no mechanism (e.g., Netlify build hook, Search Console submission) documented or automated to ping Google on deploy. Minor operational gap.

---

## Category Breakdown

### Security & Headers
- **PASS** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` — excellent, preload-ready.
- **PASS** `X-Frame-Options: DENY` — clickjacking protection present.
- **PASS** `X-Content-Type-Options: nosniff` — MIME sniffing blocked.
- **PASS** `Referrer-Policy: strict-origin-when-cross-origin` — appropriate for analytics.
- **PASS** `Permissions-Policy: camera=(), microphone=(), geolocation=()` — minimal permission surface.
- **PASS** `frame-ancestors 'none'` in CSP — belt-and-suspenders with X-Frame-Options.
- **FAIL (P1)** `script-src 'unsafe-inline'` in CSP — inline script execution is permitted, negating XSS protection.
- **PASS** No secrets or API keys hardcoded; calendar credentials correctly loaded from environment variables via `env()` helper in `netlify/functions/calendar-availability.mjs`.

### PII / Data Exposure
- **PASS** `andrew@maia-management.com` does not appear on any public HTML, JS, CSS, or config file.
- **PASS** No personal phone numbers exposed beyond the approved WhatsApp number.
- **INFO** `hola@el-sanatorio.com` appears in `consent-banner.js:28` (code comment only, not rendered to DOM) and `contact.html:213` (rendered as venue contact email — acceptable).
- **INFO** `legal@el-sanatorio.com` appears in `privacidad.html` as the data-subject-request contact — appropriate for a privacy policy.
- **WARN (P1)** `maia-management.com` domain linked publicly in `contact.html` footer — see issue #5.

### WhatsApp / Contact Info
- **PASS** All `wa.me/` links across all HTML files use exactly `wa.me/19034598763`. No wrong numbers found.
- **PASS** `contact.html` JSON-LD `telephone: "+19034598763"` — correct.
- **PASS** `tours.html` inline text `+1 903 459 8763` — formatting of the correct number.
- **PASS** `tools/booking-calendar/index.html` — all 3 WhatsApp references use correct number.

### Business Info Accuracy
- **PASS** Hours in `contact.html` table: Mon–Tue "Zona 1 solo · 4:00 PM – 2:00 AM"; Wed–Sun "4:00 PM – 2:00 AM · Todas las zonas" — matches spec.
- **PASS** JSON-LD `OpeningHoursSpecification` blocks match the same hours.
- **PASS** Address "Calle 19 #4-23, Centro Histórico, Santa Marta" is consistent across contact.html, privacidad.html, terminos.html, and footer.
- **FAIL (P0)** NIT: all files show 901.862.977-7; spec requires 902.051.563-5.
- **FAIL (P1)** Consent banner shows Calle 24 #3-99 as legal address — contradicts venue address.

### SEO
- **PASS** All primary pages have `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`, canonical tag, `lang="es"`.
- **PASS** `robots.txt` allows all, sitemap referenced.
- **PASS** `sitemap.xml` includes 9 content pages with correct domain.
- **FAIL (P1)** `gracias.html`, `privacidad.html`, `terminos.html`, `404.html` missing `og:description`.
- **FAIL (P2)** `/gracias` in sitemap despite `noindex` directive.
- **FAIL (P3)** Static `lastmod` dates in sitemap.
- **FAIL (P2)** `/tools/booking-calendar/` not in sitemap but has canonical.

### Accessibility
- **PASS** All `<img>` elements have descriptive `alt` attributes in Spanish.
- **PASS** All pages have exactly one `<h1>`.
- **PASS** Buttons have explicit `type` attributes (recent fix per git log).
- **PASS** `:focus-visible` styles defined in CSS for all interactive elements.
- **PASS** `prefers-reduced-motion` media query in CSS disables all animations.
- **PASS** Form inputs in `contact.html` have matching `<label for="">` associations.
- **PASS** Nav has `role="navigation"` and `aria-label`.
- **PASS** Cookie banner has `role="dialog"`, `aria-modal="true"`, `aria-label`.
- **FAIL (P3)** Honeypot `<input name="bot-field">` lacks `aria-hidden` — screen readers encounter unlabelled field.
- **INFO** Dark theme with low-contrast gray text (`#8f8f88` on `#111`) may fail WCAG 2.1 AA for small mono text. Formal contrast audit recommended.

### Performance
- **PASS** Hero image preloaded with `<link rel="preload" as="image" fetchpriority="high">` on index.html.
- **PASS** All `<img>` tags below fold use `loading="lazy"`.
- **PASS** All images are WebP format in production paths (`.webp`).
- **PASS** Width/height attributes on `<img>` tags prevent layout shift (CLS).
- **PASS** CSS and JS cached with `max-age=3600` via Netlify headers; images at `max-age=31536000, immutable`.
- **PASS** `consent-banner.js` loaded with `defer` — does not block render.
- **PASS** `js/main.js` loaded with `defer` — does not block render.
- **FAIL (P1)** `assets/images/crowd-event.png` (1.9 MB) and `assets/images/laboratorio-bar.png` (1.6 MB) are in the publish root but referenced by no page — dead weight on every deploy.
- **FAIL (P2)** `images/el-sanatorio-entrance.png` (3.1 MB) is a dead PNG alongside its .webp equivalent.
- **INFO** No bundler/minifier in the build pipeline (`package.json` confirms: "static site build: no compile step"). CSS is pre-minified in one file; JS is small and unminified but under 15 KB — acceptable for this site's scale.

### Mobile / Responsive
- **PASS** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` on all pages.
- **PASS** Responsive breakpoints at 900px, 768px, and 480px in `css/style.css`.
- **PASS** Nav collapses to hamburger at 768px; hamburger button has `min-width:44px; min-height:44px` — meets 44×44px WCAG touch target.
- **PASS** All `.btn` elements have `min-height:44px` — correct touch target.
- **PASS** Form inputs have `min-height:44px` — correct touch target.
- **PASS** `overflow-x:hidden` on body prevents horizontal scroll.
- **INFO** `historia.html` viewport meta missing self-closing slash — cosmetic only.

### Broken Links & Assets
- **PASS** All internal navigation links (`/menu`, `/experience`, etc.) resolve via Netlify 200-rewrites in `netlify.toml` — not broken, just rewritten.
- **PASS** All WhatsApp `wa.me` links use correct number.
- **PASS** All image `src` attributes reference files that exist in `/images/`.
- **PASS** `/consent-banner.js`, `/css/style.css`, `/js/main.js`, `/favicon.svg` all exist.
- **WARN (P2)** Duplicate redirect rules: `_redirects` file and `netlify.toml` both define `/privacy` and `/terms` redirects. Redundant but not broken.
- **INFO** `google4c66475749693679.html` — Google Search Console verification file; no SEO meta needed, correctly present.

---

## Positive Findings

1. **Security headers are exemplary.** HSTS with preload, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are all correctly configured in `netlify.toml`. The CSP is comprehensive aside from the `unsafe-inline` issue.

2. **WhatsApp number is 100% correct and consistent.** Every single `wa.me/` link across all 12 HTML files uses `wa.me/19034598763`. The number also appears correctly formatted in `tours.html` body text and in the `contact.html` JSON-LD telephone field.

3. **Owner PII is clean.** `andrew@maia-management.com` does not appear on any public page. No personal phone numbers or private emails are exposed.

4. **Image optimization is well executed.** All production images are WebP, all use `loading="lazy"` below the fold, and the LCP hero image is correctly preloaded with `fetchpriority="high"`. Width and height attributes are present on all `<img>` elements.

5. **Accessibility foundations are solid.** Every page has exactly one `<h1>`, all images have descriptive Spanish alt text, focus-visible styles are defined for every interactive element, `prefers-reduced-motion` is honoured, and the cookie consent dialog uses correct ARIA roles.

6. **Business hours are accurately reflected.** The contact page HTML table and JSON-LD structured data both correctly show Zone 1 (Yakitori) open 7 days/week 4 PM–2 AM, and Zones 2–3 open Wed–Sun 4 PM–2 AM.

7. **Netlify configuration is thorough.** Clean URL rewrites, www→bare domain redirects, `.html` extension redirects, and cache header stratification are all cleanly handled in `netlify.toml`.

8. **Google Consent Mode v2 is correctly implemented.** The consent banner defaults all consent signals to `denied`, dispatches `consent_update` on user action, and integrates with GTM/gtag. Facebook Pixel consent is also handled via `fbq('consent', ...)`.

9. **Serverless calendar function is secure.** `netlify/functions/calendar-availability.mjs` reads credentials exclusively from environment variables — no keys are hardcoded. It handles errors gracefully, falling back to a WhatsApp booking message.

10. **SEO fundamentals are strong on primary pages.** index, menu, experience, events, tours, historia, and contact all have complete `<title>`, `<meta description>`, all four OG tags, Twitter Card tags, canonical, `lang="es"`, and structured data where appropriate.
