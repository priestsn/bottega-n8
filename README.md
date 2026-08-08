# Bottega N.8 — Scroll World

Sito one-page scrollytelling per Bottega N.8, ristorante e take away a Bergamo.

## Stack
- **Astro 5** (static output)
- **Tailwind CSS 4** (via @tailwindcss/vite)
- **GSAP + ScrollTrigger** (animazioni scroll-driven)
- **Lenis** (smooth scroll, sincronizzato via gsap.ticker)
- **Fontsource** (Anton + Poppins self-hosted)

## Struttura (8 sezioni)
1. **Hero** — Gradiente scuro + vapore animato (canvas), logo SVG, coperchio cestello che si apre al primo scroll (clip-path animata)
2. **Storia** — Split crema/antracite, reveal riga per riga
3. **Filosofia** — Manifesto tipografico, 4 parole chiave animate (equilibrio, autenticità, armonia, creatività)
4. **Menu** — Galleria orizzontale pinned (scroll verticale → orizzontale), 4 piatti
5. **Tavolo o Take Away** — Due CTA: tel:035297334 + link Deliveroo/Glovo
6. **Dove Siamo** — Mappa stilizzata brand, Via Clara Maffei 8, 24121 Bergamo, orari placeholder
7. **Chiusura** — Loop ∞ animato, payoff, CTA finali, footer essenziale

## Palette (design token Tailwind)
- Crema: `#F8EADB`
- Antracite: `#222228`
- Nero: `#000000`
- Ambra: `#DB934A` (solo accenti)
- Bianco: `#FFFFFF`

## Immagini — **DA SOSTITUIRE**
Tutte le foto piatti/hero sono **placeholder SVG/gradient generati con i colori brand**.
- `public/logo.png` — logo ritagliato dal flyer (bassa risoluzione, serve vettoriale)
- `public/og-image.svg` — Open Graph image generata
- Hero: canvas vapore + SVG logo + gradiente
- Card piatti: illustrazioni SVG con palette brand (non foto reali)

**Azione richiesta:** Sostituire con foto professionali ad alta risoluzione (min 2000px lato lungo) e logo vettoriale (SVG/AI/EPS) prima del lancio produzione.

## Deploy
```bash
cd /root/bottega-n8/site
npm run build
npx http-server dist -p 8777 --host 0.0.0.0
```
- Build statico in `dist/`
- Servito su porta 8777
- Firewall: `iptables -A INPUT -p tcp --dport 8777 -j ACCEPT`
- URL pubblico: `http://161.97.185.38:8777` (verificare security group VPS Contabo)

## SEO
- Schema.org `Restaurant` JSON-LD in `<head>`
- Meta Open Graph + Twitter Card
- Alt text descrittivi su tutte le immagini
- Lazy loading nativo (eccetto hero)
- `prefers-reduced-motion` supportato (animazioni disattivate)

## Motion Rules (dal brief)
- Lenis smooth scroll (durata 1.2s, easing custom)
- Pin solo Hero + Menu
- Parallasse 10-15% (data-parallax attribute)
- Easing morbido (power3.out, back.out)
- Mobile: parallasse ridotto, no pin lunghi
- `prefers-reduced-motion`: transizioni istantanee

## Comandi
```bash
npm run dev      # Dev server
npm run build    # Build produzione
npm run preview  # Preview build locale
```