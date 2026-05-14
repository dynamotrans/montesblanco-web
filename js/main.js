/* ============================================================
   MONTES BLANCO — main.js
   - Navbar scroll state + mobile toggle
   - Smooth in-page navigation
   - Reveal-on-scroll (IntersectionObserver)
   - Year stamp + social link placeholders
   (Idiomas: gestionados por Google Translate, ver index.html)
   ============================================================ */

(() => {
  'use strict';

  const SOCIAL = {
    facebook: 'https://www.facebook.com/p/Montes-Blanco-Real-Estate-61575004358296/',
    instagram: 'https://www.instagram.com/montesblancorealestate/'
  };

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ============== NAVBAR ============== */
  const nav = $('#nav');
  const navToggle = $('#navToggle');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
  }

  $$('#navMenu a').forEach(a => {
    a.addEventListener('click', () => {
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle && navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ============== REVEAL ON SCROLL ============== */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ============== YEAR + SOCIAL LINKS ============== */
  const yearEl = $('#copyright');
  if (yearEl && yearEl.textContent.includes('{year}')) {
    yearEl.textContent = yearEl.textContent.replace('{year}', new Date().getFullYear());
  }

  if (SOCIAL.facebook) $('#fbLink')?.setAttribute('href', SOCIAL.facebook);
  else $('#fbLink')?.style.setProperty('display', 'none');

  if (SOCIAL.instagram) $('#igLink')?.setAttribute('href', SOCIAL.instagram);
  else $('#igLink')?.style.setProperty('display', 'none');

})();
