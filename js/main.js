/* ============================================================
   MONTES BLANCO — main.js
   - Navbar scroll state + mobile toggle
   - Reveal-on-scroll (IntersectionObserver)
   - Custom language switcher wired to Google Translate cookie
   - Year stamp + social link placeholders
   ============================================================ */

(() => {
  'use strict';

  const SOCIAL = {
    facebook: 'https://www.facebook.com/p/Montes-Blanco-Real-Estate-61575004358296/',
    instagram: 'https://www.instagram.com/montesblancorealestate/'
  };

  const LANGS = {
    es: {flag: '🇪🇸', code: 'ES'},
    en: {flag: '🇬🇧', code: 'EN'},
    fr: {flag: '🇫🇷', code: 'FR'},
    de: {flag: '🇩🇪', code: 'DE'},
    pt: {flag: '🇵🇹', code: 'PT'},
    it: {flag: '🇮🇹', code: 'IT'},
    ru: {flag: '🇷🇺', code: 'RU'},
    ar: {flag: '🇸🇦', code: 'AR'},
    'zh-CN': {flag: '🇨🇳', code: 'ZH'},
    ja: {flag: '🇯🇵', code: 'JA'}
  };

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ============== KILL GOOGLE TRANSLATE BANNER ==============
     GT injects an iframe.skiptranslate banner al traducir y mueve
     body con style="top: 40px". El CSS solo a veces lo atrapa,
     así que también lo limpiamos vía JS con un MutationObserver. */
  const killGtBanner = () => {
    // Solo escondemos el banner — NO lo eliminamos (Google a veces lo recrea
    // y, peor, si tocamos otros iframes con .skiptranslate, rompemos la
    // traducción). Hide + reset body.top es suficiente.
    document.querySelectorAll('.goog-te-banner-frame').forEach(el => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.height = '0';
    });
    // Reset inline top que GT pone en <body> para hacer hueco al banner
    if (document.body && document.body.style.top) document.body.style.top = '';
  };

  // Observer permanente: si el banner reaparece, lo quitamos
  const gtObserver = new MutationObserver(killGtBanner);
  const startGtObserver = () => {
    if (document.body) gtObserver.observe(document.body, { childList: true, subtree: false });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGtObserver);
  } else {
    startGtObserver();
  }

  // Polling defensivo durante los primeros 4s (por si GT carga muy tarde)
  let gtTicks = 0;
  const gtInterval = setInterval(() => {
    killGtBanner();
    if (++gtTicks > 80) clearInterval(gtInterval);
  }, 50);

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

  /* ============== LANGUAGE SWITCHER (Google Translate cookie) ============== */
  const gtTrigger = $('#gtTrigger');
  const gtMenu = $('#gtMenu');
  const gtSwitch = $('#gtSwitch');

  const getActiveLang = () => {
    const m = document.cookie.match(/googtrans=\/[^/]+\/([a-zA-Z-]+)/);
    return m && LANGS[m[1]] ? m[1] : 'es';
  };

  const setLangLabel = (code) => {
    if (!gtTrigger) return;
    const data = LANGS[code] || LANGS.es;
    const flagEl = gtTrigger.querySelector('.gt-flag');
    const codeEl = gtTrigger.querySelector('.gt-code');
    if (flagEl) flagEl.textContent = data.flag;
    if (codeEl) codeEl.textContent = data.code;
    if (gtMenu) {
      $$('button[data-lang]', gtMenu).forEach(b => {
        b.classList.toggle('is-current', b.dataset.lang === code);
      });
    }
  };

  const setLang = (code) => {
    const host = location.hostname;
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    if (host) {
      document.cookie = 'googtrans=; path=/; domain=.' + host + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'googtrans=; path=/; domain=' + host + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    if (code && code !== 'es') {
      document.cookie = 'googtrans=/auto/' + code + ';path=/';
      if (host) {
        document.cookie = 'googtrans=/auto/' + code + ';path=/;domain=.' + host;
      }
    }
    location.reload();
  };

  if (gtTrigger && gtMenu && gtSwitch) {
    setLangLabel(getActiveLang());

    gtTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = gtSwitch.classList.toggle('is-open');
      gtTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!gtSwitch.contains(e.target)) {
        gtSwitch.classList.remove('is-open');
        gtTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    $$('button[data-lang]', gtMenu).forEach(b => {
      b.addEventListener('click', () => setLang(b.dataset.lang));
    });
  }

})();
