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
      const isTitle = el.matches('h1, h2, h3') || el.closest('h1, h2, h3');
      const blur = !reduced && isTitle ? 8 : 0;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40, filter: blur ? 'blur(8px)' : 'none' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
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

// --- Immagini con clip-path reveal (tenda che si apre su scroll).
// Pattern premium: le foto si rivelano aprendo il clip-path da giù verso l'alto.
function initClipReveal() {
  const els = document.querySelectorAll('[data-clip-reveal]');
  if (!els.length) return;
  if (reduced) {
    gsap.set(els, { clipPath: 'inset(0 0 0% 0)' });
    return;
  }
  els.forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.3,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// --- Magnetic buttons: il bottone si sposta leggermente verso il mouse.
// Solo su device con mouse reale; disattivato con reduced-motion.
function initMagnetic() {
  if (reduced) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.35');
    const inner = el.querySelector('.magnetic-inner');
    let tx = 0, ty = 0, cxt = 0, cyt = 0, raf = null;

    const apply = () => {
      cxt += (tx - cxt) * 0.18;
      cyt += (ty - cyt) * 0.18;
      gsap.set(el, { x: cxt, y: cyt });
      if (inner) gsap.set(inner, { x: cxt * -0.35, y: cyt * -0.35 });
      raf = requestAnimationFrame(apply);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
    };
    const onLeave = () => {
      tx = 0; ty = 0;
    };
    const onEnter = () => {
      if (!raf) apply();
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    // Rimuove il listener RAF quando il bottone esce dal DOM (one-page: non accade)
  });
}

// --- Transizione vapore Hero→Storia: il passaggio chiave.
// Una coltre di vapore che sale dal fondo, satura lo schermo e si dirada
// rivelando la sezione successiva nitida. Scrub-driven sul blocco 100vh.
function initVaporTransition() {
  const vt = document.querySelector('[data-vapor-transition]');
  if (!vt) return;
  if (reduced) {
    gsap.set(vt, { opacity: 0 });
    return;
  }
  const targetId = vt.dataset.target;
  const target = targetId ? document.getElementById(targetId) : null;
  if (!target) return;

  const layer = vt.querySelector('.vapor-transition-layer');
  const gradient = vt.querySelector('.vapor-transition-gradient');
  const blobs = vt.querySelectorAll('.vapor-transition-blob');

  // Trigger sul blocco di transizione (100vh): il vapore sale per tutta la
  // durata del passaggio, poi si dirada rivelando la sezione sotto.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: vt,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // 1) La nebbia sale dal basso e satura lo schermo
  tl.fromTo(layer, { opacity: 0, yPercent: 70 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: 'power2.inOut' })
    // 2) Il gradient crema copre l'intero blocco (protagonista: nebbia uniforme)
    .fromTo(gradient, { opacity: 0, scale: 0.95, yPercent: 70 }, { opacity: 1, scale: 1.15, yPercent: 0, duration: 0.5, ease: 'power2.inOut' }, 0)
    // 3) I blob si disperdono leggermente (accenti molto sfumati)
    .fromTo(blobs, { opacity: 0.2, yPercent: 50 }, { opacity: 0.55, yPercent: -15, duration: 0.5, ease: 'power1.inOut' }, 0)
    // 4) La sezione successiva emerge nitida sotto il velo che si dirada
    .fromTo(target, { filter: 'blur(14px)', opacity: 0.8 }, { filter: 'blur(0px)', opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.4)
    // 5) La nebbia si dirada rivelando tutto
    .to([layer, gradient], { opacity: 0, scale: 1.25, yPercent: -45, duration: 0.45, ease: 'power1.in' });
}

// --- Zoom cinematografico Hero su scroll.
// La foto della hero scala dolcemente (1 → 1.18) e si sfuma mentre
// esci dal viewport: il classico effetto "Ken Burns" da site premium.
function initHeroCinematic() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const img = hero.querySelector('[data-parallax]');
  if (!img) return;
  if (reduced) return;

  gsap.fromTo(
    img,
    { scale: 1 },
    {
      scale: 1.18,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    }
  );
  // Il contenuto si allontana leggermente verso l'alto e sfuma
  const content = hero.querySelector('.relative.z-10');
  if (content) {
    gsap.fromTo(
      content,
      { opacity: 1, y: 0 },
      {
        opacity: 0, y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom 30%',
          scrub: 1,
        },
      }
    );
  }
}

function runAll() {
  initReveals();
  initParallax();
  initHeroCinematic();
  initClipReveal();
  initMagnetic();
  initVaporTransition();
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
