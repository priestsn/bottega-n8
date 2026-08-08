// Split-text avanzato con anime.js v4 (TextSplitter + stagger).
// Sostituisce il fallback GSAP split per i titoli [data-split]:
// split in CARATTERI con animazione mask + stagger elastic, molto più espressivo.
import { animate, stagger } from 'animejs';
import { TextSplitter } from 'animejs/text';

// Evita doppia gestione: GSAP non deve più toccare i [data-split] (rimosso da lenis-gsap.js)
export function initAnimeSplit() {
  const reduced = window.__reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    document.querySelectorAll('[data-split]').forEach((el) => { el.style.opacity = '1'; });
    return;
  }

  document.querySelectorAll('[data-split]').forEach((el) => {
    if (el.dataset.animeSplitHandled) return;
    el.dataset.animeSplitHandled = 'true';

    try {
      // split in caratteri (words disabilitato per non duplicare)
      const splitter = new TextSplitter(el, { chars: true, words: false, includeSpaces: true });
      const chars = splitter.chars;
      if (!chars || !chars.length) { el.style.opacity = '1'; return; }

      // stato iniziale nascosto
      el.style.opacity = '1';
      chars.forEach((c) => {
        c.style.display = 'inline-block';
        c.style.opacity = '0';
        c.style.transform = 'translateY(110%) rotate(4deg)';
        c.style.transformOrigin = '50% 100%';
        c.style.willChange = 'transform, opacity';
      });

      // animazione stagger elastic su scroll (IntersectionObserver)
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            obs.disconnect();
            animate(chars, {
              opacity: 1,
              translateY: ['110%', '0%'],
              rotate: ['4deg', '0deg'],
              delay: stagger(0.028, { start: 0.05 }),
              duration: 900,
              ease: 'outExpo',
            });
          }
        });
      }, { threshold: 0.3 });
      io.observe(el);
    } catch (e) {
      // fallback: rendi visibile
      el.style.opacity = '1';
    }
  });
}
