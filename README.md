# El Sanatorio

**Spookers-style 3-Zone Horror Entertainment Complex — Yakitori Bar, Cocktail Bar & Paciente 013 Horror Maze**
Calle 19 #4-23, Centro Histórico, Santa Marta, Colombia
NIT 902.051.563-5

> *"Ella siempre ha estado aquí."*

---

## About

El Sanatorio is a 3-zone immersive horror and hospitality venue built inside a restored colonial building in the heart of Santa Marta's historic district. It is **not a hostel** and offers **no accommodation** — it is a night-out destination only.

- **Zone 1 — Yakitori Bar (street-front patio)** — Open-front yakitori bar on Calle 19. Walk-in, no reservations required. Where the night begins.
- **Zone 2 — Cocktail Bar (interior)** — Asylum-themed cocktail bar with medical/hospital iconography and Be Vida spirits. Autopsy-table bar, giant syringe beer taps, X-ray lightbox menus, medicine cabinet bottle display. *"We don't sell cocktails — we prescribe doses."*
- **Zone 3 — Paciente 013 (horror maze)** — Immersive horror experience inspired by **Spookers NZ**. Live actors, cinematic scenes, a 1950s sanatorium narrative. Groups of 4–8. 45–70 minute experience.

---

## Site Structure

```
el-sanatorio/
├── index.html          # Landing page
├── menu.html           # "Expediente del Paciente" — full menu
├── experience.html     # Horror maze — info, rules, pricing, booking
├── tours.html          # Historical walking tour — info & booking
├── contact.html        # Map, hours, contact, WhatsApp
├── css/
│   └── style.css       # Full design system — Tropical Noir
├── js/
│   └── main.js         # Nav, animations, EKG, scroll effects
├── netlify.toml        # Netlify publish config + redirects
└── README.md
```

---

## Tech Stack

- **Static HTML/CSS/JS** — no frameworks, no build step
- **Netlify Forms** — all four forms use `data-netlify="true"` for zero-backend submissions
- **Google Fonts** — Special Elite (typewriter), Playfair Display (serif), Share Tech Mono, IM Fell English
- **Netlify Hosting** — `netlify.toml` sets `publish = "."`

---

## Design System — Tropical Noir

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0a` | Page background |
| `--crimson` | `#DC143C` | Neon red, accents, CTAs |
| `--blood` | `#8B0000` | Deep red glows |
| `--gold` | `#c9a84c` | Premium accents, prices |
| `--off-white` | `#f5f5f0` | Body text |
| `--font-type` | Special Elite | Headers, titles |
| `--font-serif` | Playfair Display | Body, quotes |
| `--font-mono` | Share Tech Mono | Labels, UI, nav |

**Key effects:** neon glow with flicker animation, animated EKG heartbeat line in nav, scanline overlay, parallax hero, scroll-triggered fade-ins, glitch text on hover, CSS vignette.

---

## Netlify Forms

Four forms are configured with `data-netlify="true"`:

| Form Name | Page | Purpose |
|---|---|---|
| `reserva-bar` | `index.html` | Table reservations |
| `reserva-experiencia` | `experience.html` | Horror maze booking |
| `reserva-tour` | `tours.html` | Walking tour booking |
| `contacto-general` | `contact.html` | General contact |

All forms include honeypot spam protection (`netlify-honeypot="bot-field"`).

---

## Deploy to Netlify

### Option 1 — Netlify Drop
Drag the `el-sanatorio/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

### Option 2 — Git Deploy
1. Push this repo to GitHub
2. Connect to Netlify → New site from Git
3. Build command: *(leave blank)*
4. Publish directory: `.`

### Option 3 — Netlify CLI
```bash
npm install -g netlify-cli
cd el-sanatorio
netlify deploy --prod
```

---

## Easter Eggs

- **WiFi password** — hover over `[ TABLERO DE ANUNCIOS — PERSONAL INTERNO ]` on `index.html` and `contact.html`
  - Network: `HospitalDelTorax_Pacientes`
  - Password: `013desconocida`
- **Browser console** — open DevTools → Console for a classified patient file
- **Redacted patient file** — Patient 013's diagnosis and family fields are visually redacted on the landing page

---

## Brand Voice

- Never explains the story directly
- Clinical humor, never ridiculous
- The menu is a medical chart. The bartender is the Doctor on duty.
- *"We don't sell cocktails — we prescribe doses."*
- Patient 013 / Trece: a child left behind when the sanatorium closed in 1969. She's still here. She sings. She smiles. The horror is in understanding what happened to her.

---

## Contact

- **WhatsApp:** [+57 317 437 0575](https://wa.me/573174370575)
- **Instagram:** [@elsanatorio.sm](https://instagram.com/elsanatorio.sm)
- **Email:** hola@el-sanatorio.com

---

*© 2025 El Sanatorio — Santa Marta, Colombia*
