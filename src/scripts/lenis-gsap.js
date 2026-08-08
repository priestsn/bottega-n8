// Lenis + GSAP ScrollTrigger — configurato per performance
// Principi: POCHI trigger, niente canvas perpetuo, mobile disattivo parallasse/pin.
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initAnimeSplit } from './anime-split';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

let lenis = null;

if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.2,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

window.lenis = lenis;
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.__reduced = reduced;
window.__isMobile = isMobile;

// --- Reveal: UN trigger per sezione, non per elemento.
// Ogni elemento [data-reveal] ha un delay via CSS var; la sezione [data-st-scroll]
// è il singolo trigger che gioca la timeline dei suoi figli.
function initReveals() {
  if (reduced) {
    gsap.set('[data-reveal]', { opacity: 1, clearProps: 'all' });
    return;
  }

  document.querySelectorAll('[data-st-section]').forEach((section) => {
    const items = section.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    gsap.utils.toArray(items).forEach((el) => {
      const delay = parseFloat(el.dataset.delay || '0');
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });
  });
}

// --- Parallasse: solo su desktop, con data-parallax-speed
function initParallax() {
  if (reduced || isMobile) return;
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.15');
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      }
    );
  });
}

// --- Progress: gestito dal componente ScrollEight (motivo 8/infinito).

// --- Split text: gestito da anime.js v4 (TextSplitter) in anime-split.js
// Qui NON tocchiamo più i [data-split] per evitare doppia animazione.

function runAll() {
  initReveals();
  initParallax();
  initAnimeSplit();
  // Smooth-scroll per tutti gli anchor interni
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (lenis) {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      });
    }
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

// I moduli ES girano dopo il parsing del DOM: esegui subito.
// Fallback su DOMContentLoaded e astro:page-load per compatibilità.
runAll();
window.addEventListener('astro:page-load', runAll);
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', runAll);
// Custom event per gli script is:inline delle sezioni (affidabile anche su build statica)
window.dispatchEvent(new CustomEvent('site:ready', { detail: { gsap, ScrollTrigger } }));

window.addEventListener('load', () => ScrollTrigger.refresh());
if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
