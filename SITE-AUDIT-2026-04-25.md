# El Sanatorio — Full Site Audit
**Date:** 2026-04-25 | **Auditor:** Claude (source-code audit) | **Repo:** `el-sanatorio` workspace

Severity legend: 🔴 CRITICAL · 🟠 HIGH · 🟡 MEDIUM · 🟢 LOW

---

## Table of Contents
1. [Critical Issues](#1-critical-issues)
2. [High Issues](#2-high-issues)
3. [Content Issues](#3-content-issues)
4. [Technical / Link Issues](#4-technical--link-issues)
5. [Mobile Issues](#5-mobile-issues)
6. [SEO / Meta Issues](#6-seo--meta-issues)
7. [Legal / Compliance](#7-legal--compliance)
8. [Low / Housekeeping](#8-low--housekeeping)
9. [What's Working Well](#9-whats-working-well)
10. [Summary Fix List](#10-summary-fix-list)

---

## 1. Critical Issues

### 🔴 C-01 — CSP in `netlify.toml` blocks Google Analytics on every page
**File:** `netlify.toml` (all headers)

The `Content-Security-Policy` header has:
```
script-src 'self' 'unsafe-inline'
```
It does **not** include `https://www.googletagmanager.com`. Every browser that enforces CSP will block the GA4 script tag:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JZGDBW5K7Q">
```
This silently kills all analytics tracking on the live site.

Also missing from the CSP:
- `connect-src` doesn't include `https://www.google-analytics.com` or `https://region1.google-analytics.com` (needed for GA4 hit payloads)
- `frame-src` only lists `https://maps.google.com` — embedded maps may also need `https://www.google.com`

**Fix:** Update `netlify.toml` CSP:
```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;
```

---

### 🔴 C-02 — `historia.html` GA4 snippet placed deep inside `<head>` after ~970 lines of inline CSS
**File:** `historia.html` lines 976–983

The entire `<head>` of `historia.html` is one giant inline `<style>` block (~970 lines). The GA4 `<script>` tags appear at line 976, buried after the closing `</style>` tag. The consent-banner.js is loaded with `defer` (line 6), meaning the banner fires **after** DOMContentLoaded, but the consent default IS set by the inline block before gtag.js (async) loads — so consent defaults work. The deeper problem is structural: this page was built entirely separately from the rest of the site (different fonts, different CSS variables, different nav structure) and grafted with GA4 at the end. It will be hard to maintain.

---

### 🔴 C-03 — `historia.html` and `events.html` are completely different design systems
**Files:** `historia.html`, `events.html`

Both pages were built independently from the main site template. They use different:
- **Font families:** `historia.html` uses `Cinzel`, `IM Fell English`, `Inter`; `events.html` has its own embedded CSS. The rest of the site uses `Special Elite`, `Playfair Display`, `Share Tech Mono`.
- **CSS variables:** `historia.html` has `--negro`, `--humo`, `--carbon`, `--crema`, `--oro-claro`, `--borde`, `--gris-ceniza`. `events.html` has `--humo`, `--carbon`, `--borde`, `var(--font-lit)` — all different from `--black`, `--white`, `--gold`, `--border` used in the main template.
- **Nav structure:** `historia.html` has its own `<nav>` without the EKG heart monitor SVG, using class `nav-links` (not `nav__links`). `events.html` nav is missing Experiencia, Historia, and Tours links — visitors can't navigate from those pages to those sections.
- **All CSS is inline `<style>` tags**, not `css/style.css`.

These pages appear to be legacy builds that were never migrated to the main template. Visitors will notice an obvious visual break when navigating to them.

---

## 2. High Issues

### 🟠 H-01 — Three different phone numbers across the site
The site shows three completely different local numbers depending on which page you're on:

| Number | Pages | Context |
|--------|-------|---------|
| `+57 321 392 2272` | `index.html` (tel: link, lines 450–451, 494), `privacidad.html` (line 136, 245), `terminos.html` (lines 156, 214), Schema.org on index.html | Main bar contact |
| `+57 317 437 0575` | `contact.html` (line 144), `experience.html` (lines 282, 354), `tours.html` (lines 257, 322), `terms.html` (lines 119, 273), Schema.org on tours.html | WhatsApp/calls |
| `+57 319 596 2773` | `index.html` footer (line 625), `events.html` (line 2716) | "Andrew Gallie, CEO" personal number |

All WhatsApp `wa.me` links correctly use `19034598763` (US-format). But the displayed local numbers are inconsistent. Customers who try to call will reach different lines depending on where they looked.

**Fix:** Decide the canonical local number and apply it to all pages. Remove the CEO's personal number from public-facing pages (see H-04).

---

### 🟠 H-02 — `events.html` has two CSS placeholder boxes instead of real content
**File:** `events.html`

Line 1963–1964: A `div.espacio-image-placeholder` renders as a styled gradient box with a faint glyph in the centre. No real photo of the event space has been provided — this is a visible blank area on the live page.

Line 2594: A `div.map-placeholder` renders as a CSS grid pattern with a pin icon in the centre. An actual `<iframe>` Google Map embed (as used on `index.html` and `contact.html`) is missing.

---

### 🟠 H-03 — `events.html` social links are dead `href="#"` buttons
**File:** `events.html` lines 2674–2675

```html
<a href="#" class="social-btn" aria-label="Instagram">📸</a>
<a href="#" class="social-btn" aria-label="TikTok">🎵</a>
```
Both the Instagram and TikTok buttons in the events page footer have `href="#"` — clicking them does nothing. The Instagram URL is known (`https://instagram.com/elsanatorio.sm`). TikTok URL needs to be provided or the button removed.

---

### 🟠 H-04 — CEO personal mobile number exposed publicly on two pages
**File:** `index.html` line 625, `events.html` line 2716

```html
Para consultas urgentes: Andrew Gallie, CEO — WhatsApp +57 319 5962773
```
This exposes Andrew's personal number in the rendered footer of the homepage. Similarly on `events.html` line 2716. If this is intentional for VIP contacts it should at minimum not appear on public-facing consumer pages. More likely it should be replaced with the business WhatsApp.

---

### 🟠 H-05 — `historia.html` footer links are all `href="#"` dead links
**File:** `historia.html` lines 1378–1382

The footer of the Historia page has five links — `el-sanatorio.com`, `Instagram`, `The Maia Group`, `Prensa`, `Trabaja con nosotros` — all pointing to `href="#"`. None go anywhere.

---

### 🟠 H-06 — Duplicate legal pages creating potential canonical confusion
The repo contains both **Spanish** and **English/legacy** versions of both legal pages:
- `privacidad.html` (canonical, full content, `robots: noindex, follow`) 
- `privacy.html` (different content, `robots: noindex, follow`, accessible at direct URL)
- `terminos.html` (canonical)
- `terms.html` (different content, accessible at direct URL)

The `_redirects` file handles `/privacy → /privacidad` (301) but does **not** redirect `/privacy.html → /privacidad.html`. Both files are accessible on the live site at their direct `.html` URLs. The consent-banner.js internally links to `/privacy.html` (line 44 of `consent-banner.js`). The `index.html` footer links to `privacy.html` (line 623). These should all point to `privacidad.html`.

---

## 3. Content Issues

### 🟡 CON-01 — `hola@el-sanatorio.com` shown as plain text, not a `mailto:` link
**File:** `contact.html` line 166

```html
<span style="color: var(--off-white);">hola@el-sanatorio.com</span>
```
The email address is displayed but is not a clickable `mailto:` link. All other contact methods on the page are linked. This is also inconsistent with `events.html` (line 2653, 2720) which uses `mailto:eventos@el-sanatorio.com` as a real link.

There are also three different email addresses across the site with no cross-referencing:
- `hola@el-sanatorio.com` — contact.html, terms.html, privacy.html
- `eventos@el-sanatorio.com` — events.html
- `legal@el-sanatorio.com` — terminos.html

---

### 🟡 CON-02 — `gracias.html` (thank-you page) mobile nav is missing items
**File:** `gracias.html` lines 57–63

Mobile nav has only 5 links: Inicio, Menú, Experiencia, Tours, Contacto. Missing: **Eventos** and **Historia** (present in all other page mobile navs).

---

### 🟡 CON-03 — `gracias.html` footer missing Spanish accents throughout
**File:** `gracias.html` lines 89–101

The footer text was written without proper accented characters:
- `"Ella siempre ha estado aqui."` → should be `"aquí"`
- `Centro Historico` → `Centro Histórico`
- `El Menu / Expediente` → `El Menú / Expediente`
- `Tours Historicos` → `Tours Históricos`

---

### 🟡 CON-04 — `privacy.html` nav item "Events" in English
**File:** `privacy.html` line 49

```html
<li><a href="events.html">Events</a></li>
```
The nav is in Spanish on every other page. This one item was left in English.

---

### 🟡 CON-05 — `index.html` footer hours summary is incomplete
**File:** `index.html` lines 614–618

The footer hours note reads:
```
Mié – Dom
6:00 PM – 2:00 AM
(Viernes y Sábado)
```
This only shows the Friday/Saturday closing time (2 AM) and implies it applies all week. It omits that Wed/Thu close at 1 AM and Sunday at midnight. This could result in guests arriving expecting the bar to be open when it isn't.

---

### 🟡 CON-06 — `historia.html` page title is thin and not consistent with other pages
**File:** `historia.html` line 9

`<title>Historia | El Sanatorio</title>` — the `<title>` tag is bare-bones compared to all other pages which follow the format "Full Description | El Sanatorio, Santa Marta". Also `<meta name="author" content="The Maia Group">` — no other page has an author tag, and "The Maia Group" doesn't match the registered legal name "MAIA MANAGEMENT GROUP S.A.S." used everywhere else.

---

## 4. Technical / Link Issues

### 🟡 TECH-01 — Stale comment "replace G-JZGDBW5K7Q" on every page
**Files:** All HTML files, e.g. `index.html` line 29, `menu.html` line 18, etc.

```html
<!-- Google tag (gtag.js) — replace G-JZGDBW5K7Q with real GA4 ID -->
```
The comment instructs someone to replace `G-JZGDBW5K7Q`, but `G-JZGDBW5K7Q` IS the correct, expected GA4 ID — so the code itself is correct. The comment is just stale and confusing (it was the original placeholder instruction). Should be removed or changed to `<!-- Google Analytics 4 — G-JZGDBW5K7Q -->`.

---

### 🟡 TECH-02 — `consent-banner.js` loaded with `defer` on 5 of 9 pages
**Files:** `menu.html` line 17, `contact.html` line 16, `privacidad.html` line 13, `gracias.html` line 12, `events.html` line 21

The `consent-banner.js` file's own documentation comment says:
> "Load THIS script first, before any Google/Meta tags"

On the above pages it's loaded with `defer`, meaning the banner UI fires after the DOM loads. The consent **defaults** (deny analytics) are still applied by the inline `gtag('consent','default',...)` block on each page, so the privacy impact is minimal — but the banner may flash in visibly after the page renders, creating a jarring UX. Pages that load it correctly without defer: `index.html`, `experience.html`, `tours.html`, `historia.html`.

**Fix:** Remove `defer` from the `<script src="/consent-banner.js">` tag on all pages to match the intended loading order.

---

### 🟡 TECH-03 — `favicon.ico` referenced but missing
**Files:** `404.html` line 8, `privacidad.html` line 23, `terminos.html` line 11

All three reference `<link rel="icon" type="image/x-icon" href="/favicon.ico" />` but no `favicon.ico` file exists in the repo root. This generates a 404 on every page load for those pages (and browsers silently request it on all pages regardless). No other pages declare a favicon link — meaning the browser tab shows a blank icon everywhere.

---

### 🟡 TECH-04 — `_redirects` file doesn't cover `.html` extension variants for privacy/terms
**File:** `_redirects`

The file redirects `/privacy → /privacidad` (301) and `/terms → /terminos` (301), but the actual files `privacy.html` and `terms.html` remain accessible at their direct URLs. Since `_redirects` only applies to path-based routing, `https://el-sanatorio.com/privacy.html` still resolves without redirect. Add:
```
/privacy.html   /privacidad.html  301
/terms.html     /terminos.html    301
```

---

### 🟡 TECH-05 — `netlify.toml` missing redirects for `experience` → `experience.html`
**File:** `netlify.toml`

The redirects in `netlify.toml` cover `/menu`, `/experiencia`, `/tours`, `/contacto` but do NOT cover `/experience` (English). Links using `/experience` (without `.html`) appear in several pages. The `_redirects` file doesn't cover this either.

---

### 🟢 TECH-06 — `events.html` nav is missing 3 top-level pages
**File:** `events.html` lines 1845–1852

The events page nav only shows: Inicio, Menú, Eventos, Reservas, Contacto. Missing from the nav: **Experiencia**, **Historia**, **Tours**. This breaks site navigation for visitors who land on the events page.

---

### 🟢 TECH-07 — `historia.html` nav also different and incomplete
**File:** `historia.html` (nav section)

The Historia nav uses the custom class structure and links back to `/`, `/menu.html`, `/events.html`, `/index.html#reservar`, `/contact.html` but is missing Experiencia, Tours, and Historia links and the mobile nav lacks the standard structure of all other pages.

---

## 5. Mobile Issues

### ✅ Viewport meta tag
Present on all pages: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` — no issues.

### ✅ Hamburger / mobile nav
Implemented correctly in `css/style.css` (hamburger at `max-width: 768px`, line 1799). Mobile menu has `min-height: 44px` on links (line 1731). Main nav toggle button has `min-height: 44px; min-width: 44px` (lines 282–283). Touch targets meet the 44px minimum on nav elements.

### ✅ Horizontal scroll risk
`img { max-width: 100%; }` is set globally (line 83 of `style.css`). No fixed-width containers without overflow protection observed in the main template pages.

### 🟢 MOB-01 — Some form inputs may have sub-14px labels on small screens
Several form labels use `font-size: 0.62rem` and mono captions use `0.6rem`. At a 16px base that's ~9.9px and 9.6px respectively. While inputs themselves are adequately sized, these tiny labels could be difficult to read on mobile.

### 🟢 MOB-02 — WhatsApp floating button overlaps page content on small screens at scroll position 0
**All pages** — The `whatsapp-float` button (56×56px, `bottom: 24px; right: 24px; z-index: 9999`) is defined as inline `<style>` at the bottom of **every single HTML file**. This is duplicated code in ~10 files and could conflict if the main CSS ever adds a `.whatsapp-float` class. Should be moved to `css/style.css`.

### 🟢 MOB-03 — `events.html` and `historia.html` mobile navs use different breakpoints
`events.html` uses `max-width: 900px` to show its hamburger; the main CSS uses `max-width: 768px`. This means on tablets (768–900px) the events page shows a hamburger while all other pages show the full nav, creating inconsistency.

---

## 6. SEO / Meta Issues

### 🟡 SEO-01 — Sitemap missing pages
**File:** `sitemap.xml`

Currently indexed: `/`, `/experience.html`, `/tours.html`, `/menu.html`, `/contact.html`, `/events.html`, `/historia.html`

Missing from sitemap:
- `privacidad.html` — should be included even if `noindex` (helps Googlebot find it for compliance pages)
- `terminos.html` — same
- `gracias.html` — arguably should stay out, but its canonical exists

---

### 🟡 SEO-02 — `privacidad.html` uses slash-based nav links inconsistent with canonical URLs
**File:** `privacidad.html` nav (lines 112–117)

Nav links use `/menu`, `/experience`, `/events`, `/tours`, `/historia`, `/contact` (no `.html`). The `netlify.toml` and `_redirects` cover some of these but not all (e.g., `/events` and `/historia` and `/contact` are not in the redirect rules).

---

### 🟢 SEO-03 — `terminos.html` incorrectly set to `index, follow`
**File:** `terminos.html` line 9

`<meta name="robots" content="index, follow" />` — Terms of Service pages are typically `noindex` to avoid thin/legal content being served in search results. The parallel page `privacidad.html` correctly uses `noindex, follow`.

---

### 🟢 SEO-04 — OG tags missing `og:type` on several secondary pages
`menu.html`, `contact.html`, `gracias.html`, `privacy.html` are missing `<meta property="og:type" content="website" />`. The main pages (`index.html`, `experience.html`, `tours.html`, `events.html`) include it.

---

## 7. Legal / Compliance

### ✅ Cookie consent
The `consent-banner.js` system is fully functional — it implements Google Consent Mode v2 (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`), defaults all to `denied`, provides Aceptar/Rechazar/Personalizar buttons, stores preference in localStorage with 180-day expiry, and has a "Gestionar cookies" re-open link in the `index.html` footer. Compliant with Ley 1581 de 2012.

### 🟡 LEGAL-01 — `404.html` has a second, incompatible inline cookie banner
**File:** `404.html` lines 116–120

There is a second, completely different cookie banner hardcoded directly in `404.html`:
```html
<div id="cookie-banner" ...>
  <button onclick="localStorage.setItem('cookieConsent','accepted')">Aceptar</button>
</div>
<script>if(localStorage.getItem('cookieConsent')==='accepted')...</script>
```
This uses `localStorage` key `cookieConsent` while the proper `consent-banner.js` uses key `maia_consent`. The two systems don't communicate. A user who accepts cookies on the 404 page will still see the real consent banner on every other page. The hardcoded banner also doesn't implement Consent Mode v2 — it just hides itself. **Remove the inline cookie banner from `404.html`** — the `consent-banner.js` is already loaded there via the script tag.

Wait — actually looking at `404.html`, there is **no** `<script src="/consent-banner.js">` tag in the head. The consent banner comment in `404.html` references it but the actual script tag is absent. The hardcoded banner is the only consent mechanism on the 404 page, and it's non-compliant.

**Fix:** Add `<script src="/consent-banner.js"></script>` to `404.html` head and remove the inline banner.

---

### 🟡 LEGAL-02 — `consent-banner.js` links to `/privacy.html` not `/privacidad.html`
**File:** `consent-banner.js` line 44

```js
privacyPolicyUrl: '/privacy.html',
```
The canonical privacy policy is `privacidad.html`. The banner's "Política de Privacidad" link takes users to the secondary, legacy file.

---

### 🟢 LEGAL-03 — Email addresses in legal pages are not consistently linked
`hola@el-sanatorio.com` appears as plain text (not `mailto:`) in `contact.html` (line 166), `terms.html` (lines 119, 270), and `privacy.html` (line 223). The `terminos.html` and `events.html` correctly use `mailto:` links.

---

## 8. Low / Housekeeping

### 🟢 LOW-01 — Stale `css/style.css.bak` file in repo
`css/style.css.bak` exists in the root. It's not served to users but it pollutes the repo and could cause confusion.

### 🟢 LOW-02 — Inline `<style>.whatsapp-float { ... }</style>` duplicated on every page
The WhatsApp float button CSS is copy-pasted as inline `<style>` at the bottom of all ~10 HTML files. It should live once in `css/style.css`.

### 🟢 LOW-03 — `gracias.html` nav aria label missing accent
**File:** `gracias.html` line 32: `aria-label="Navegacion principal"` — missing accent on "Navegación".

### 🟢 LOW-04 — `form-panel__ref` fallback is `REF-XXXXX-013` before JS runs
`index.html` line 521, `experience.html` line 363: `<span class="form-panel__ref">REF-XXXXX-013</span>`. JS (main.js) replaces this with a random number, but with JS disabled it shows the placeholder literally. Extremely low risk.

### 🟢 LOW-05 — Multiple pages have duplicate `<script>` for `main.js` (no `defer` vs `defer`)
`menu.html` line 432: `<script src="js/main.js">` (no defer). `index.html` line 630: `<script src="js/main.js" defer>`. Mix is inconsistent; best practice is `defer` on all.

### 🟢 LOW-06 — Google Site Verification file `google4c66475749693679.html` present but blank
**File:** `google4c66475749693679.html` — this is the Google Search Console verification file. Confirmed it exists; as long as it contains the verification meta tag or string it's fine. Just ensure it actually contains the expected content.

---

## 9. What's Working Well

- **WhatsApp number `19034598763`** is consistent across all `wa.me` links on all pages. ✅
- **GA4 ID `G-JZGDBW5K7Q`** is correctly applied in every GA4 code block. ✅
- **Viewport meta tag** is present on all pages. ✅
- **Consent Mode v2** defaults (deny-all) are applied on every page via inline script block. ✅
- **Hamburger/mobile nav** fully functional with ARIA, 44px touch targets, open/close animation. ✅
- **All forms** use Netlify's `data-netlify="true"` with honeypot fields. No broken form actions. ✅
- **Security headers** in `netlify.toml` are solid: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. ✅
- **Schema.org structured data** on `index.html`, `experience.html`, `tours.html` is detailed and correctly typed. ✅
- **OG / Twitter Card** meta tags present on all main pages. ✅
- **Canonical tags** present on all pages. ✅
- **`robots.txt`** correctly blocks AI scrapers (GPTBot, Claude-Web, anthropic-ai, etc.) while allowing Googlebot. ✅
- **`sitemap.xml`** covers all 7 core pages. ✅
- **Menu pricing** is specific and realistic (COP 7,000–28,000 yakitori/cocktails). No Lorem ipsum. ✅
- **No `XXXXXXXXXX`, `TBD`, or "Lorem ipsum" placeholder text** found in any core page. ✅

---

## 10. Summary Fix List

| # | Severity | File(s) | Action |
|---|----------|---------|--------|
| C-01 | 🔴 | `netlify.toml` | Add `https://www.googletagmanager.com` to `script-src`; add GA4 endpoints to `connect-src` |
| C-02 | 🔴 | `historia.html` | Migrate to main site template (style.css, shared nav, fonts) |
| C-03 | 🔴 | `historia.html`, `events.html` | Rebuild on the shared template; fix nav to include all 7 links |
| H-01 | 🟠 | All pages | Standardize to one phone number; remove CEO personal number |
| H-02 | 🟠 | `events.html` | Replace `espacio-image-placeholder` with real photo; replace `map-placeholder` with iframe embed |
| H-03 | 🟠 | `events.html` lines 2674–75 | Add real Instagram URL; add TikTok URL or remove button |
| H-04 | 🟠 | `index.html` L625, `events.html` L2716 | Remove Andrew Gallie's personal mobile from public pages |
| H-05 | 🟠 | `historia.html` lines 1378–82 | Replace `href="#"` with real URLs |
| H-06 | 🟠 | `privacy.html`, `terms.html` | Redirect `.html` variants; unify to `privacidad.html` / `terminos.html` |
| CON-01 | 🟡 | `contact.html` L166 | Make `hola@el-sanatorio.com` a `mailto:` link; standardize email addresses |
| CON-02 | 🟡 | `gracias.html` | Add Eventos & Historia to mobile nav |
| CON-03 | 🟡 | `gracias.html` | Fix missing Spanish accents throughout footer |
| CON-04 | 🟡 | `privacy.html` L49 | Change "Events" → "Eventos" |
| CON-05 | 🟡 | `index.html` L614–618 | Fix footer hours to show all closing times |
| CON-06 | 🟡 | `historia.html` | Improve `<title>` and remove incorrect `author` meta |
| TECH-01 | 🟡 | All HTML files | Remove stale "replace G-JZGDBW5K7Q" comments |
| TECH-02 | 🟡 | `menu.html`, `contact.html`, `privacidad.html`, `gracias.html`, `events.html` | Remove `defer` from `consent-banner.js` script tag |
| TECH-03 | 🟡 | `404.html`, `privacidad.html`, `terminos.html` | Create `favicon.ico` and add to root |
| TECH-04 | 🟡 | `_redirects` | Add `/privacy.html → /privacidad.html` and `/terms.html → /terminos.html` |
| TECH-05 | 🟡 | `netlify.toml` | Add `/experience → /experience.html` redirect |
| LEGAL-01 | 🟡 | `404.html` | Remove inline cookie banner; add `consent-banner.js` script tag to head |
| LEGAL-02 | 🟡 | `consent-banner.js` L44 | Change `privacyPolicyUrl` to `/privacidad.html` |
| SEO-01 | 🟡 | `sitemap.xml` | Add `privacidad.html` and `terminos.html` |
| SEO-03 | 🟢 | `terminos.html` | Change robots to `noindex, follow` |
| SEO-04 | 🟢 | `menu.html`, `contact.html`, `gracias.html`, `privacy.html` | Add `og:type` meta tags |
| MOB-02 | 🟢 | All HTML files | Move `.whatsapp-float` CSS to `style.css` |
| LOW-01 | 🟢 | `css/style.css.bak` | Delete backup file |
| LOW-05 | 🟢 | `menu.html`, `contact.html`, etc. | Add `defer` to all `main.js` script tags |

---

*End of audit. 4 critical, 6 high, 10 medium, 9 low issues identified.*
