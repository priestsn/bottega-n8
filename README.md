# Bottega N.8 — Scroll World

Sito one-page scrollytelling per Bottega N.8, ristorante e take away a Bergamo.

## Stack
- **Astro** (static output)
- **Tailwind CSS 4** (via @tailwindcss/vite)
- **GSAP + ScrollTrigger** (animazioni scroll-driven)
- **Lenis** (smooth scroll, sincronizzato via gsap.ticker)
- **Fontsource** (Anton + Poppins self-hosted)

## Struttura (sezioni)
1. **Hero** — Foto reale di xiaolongbao, gradiente scuro, logo, pay-off "Un viaggio di gusto"
2. **Storia** — Split crema/antracite, foto reale ravioli xiaolongbao, reveal
3. **Marquee** — Banda scorrimento infinito parole chiave
4. **Filosofia** — Manifesto tipografico, 4 parole chiave animate
5. **Menu** — Galleria orizzontale pinned (scroll verticale → orizzontale), 4 piatti con foto reali
6. **Galleria** — **Marquee di foto reali con effetto lente-zoom sull'hover** (pattern Magic UI Lens, vanilla JS/GSAP)
7. **Tavolo o Take Away** — Due CTA: tel + link Deliveroo/Glovo
8. **Stampa** — Rassegna stampa (Italia a Tavola, QUI Bergamo)
9. **Dove Siamo** — Mappa, Via Clara Maffei 8, 24121 Bergamo
10. **Chiusura** — Loop ∞, payoff, CTA finali, footer

## Feature premium
- **Foto reali del ristorante** (estratte da Google Maps via browser-harness cloud): ramen, xiaolongbao, dim sum — niente più stock
- **Custom cursor** (desktop): dot + ring + 3 trail, `mix-blend-mode:difference`
- **Preloader a gauge circolare** brandizzato con contatore %
- **404 page** brandizzata con motivo 8/∞
- **Galleria Lens**: marquee orizzontale con zoom-lente sul dettaglio del piatto
- `prefers-reduced-motion` rispettato ovunque, mobile-first

## Palette (design token Tailwind)
- Crema: `#F8EADB`
- Antracite: `#222228`
- Nero: `#000000`
- Ambra: `#DB934A` (solo accenti)
- Bianco: `#FFFFFF`

## Dev
```bash
npm install
npm run dev        # modalità sviluppo
npm run build      # build statica in dist/
npm run preview    # preview locale
```

## Deploy
- Build statica (`output: static`) servibile con qualsiasi server statico (nginx, http-server).
- In produzione: dominio + HTTPS (niente IP:porta grezzi esposti pubblicamente).
