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
     GT injects an iframe.skiptranslate banner al traducir y empuja
     body con style="top: 40px". Combinamos CSS inline (head) + JS
     defensivo para esconder el banner SIN romper la traducción. */
  const killGtBanner = () => {
    // Forzar el iframe del banner a desaparecer (sin removerlo: GT lo recrea)
    document.querySelectorAll(
      '.goog-te-banner-frame, iframe.goog-te-banner-frame'
    ).forEach(el => {
      el.style.cssText =
        'display:none!important;visibility:hidden!important;height:0!important;' +
        'opacity:0!important;pointer-events:none!important;' +
        'position:absolute!important;top:-10000px!important;left:-10000px!important;';
    });
    // Reset inline top que GT pone en body para hacer hueco al banner
    if (document.body) {
      if (document.body.style.top) document.body.style.top = '';
      if (document.body.style.position === 'relative') document.body.style.position = '';
    }
    if (document.documentElement && document.documentElement.style.top) {
      document.documentElement.style.top = '';
    }
  };

  // Observer permanente sobre body: pilla añadidos, eliminados Y cambios de
  // estilo en iframes que GT modifica
  const gtObserver = new MutationObserver(killGtBanner);
  const startGtObserver = () => {
    if (!document.body) return;
    gtObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGtObserver);
  } else {
    startGtObserver();
  }

  // Polling permanente cada 200ms (coste despreciable, atrapa cualquier caso raro)
  setInterval(killGtBanner, 200);

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

  /* ============== HERO VIDEO → FADE A IMAGEN ============== */
  const heroVideo = $('#heroVideo');
  const heroFallback = $('.hero__img-fallback');
  if (heroVideo) {
    const switchToImage = () => {
      heroVideo.classList.add('is-ended');
      if (heroFallback) heroFallback.classList.add('is-visible');
    };
    heroVideo.addEventListener('ended', switchToImage);
    // Si el video falla, mostramos la imagen inmediatamente
    heroVideo.addEventListener('error', () => {
      if (heroFallback) {
        heroFallback.style.transitionDuration = '0s';
        heroFallback.classList.add('is-visible');
      }
    });
    // Fallback temporizado por si el evento 'ended' no salta
    heroVideo.addEventListener('loadedmetadata', () => {
      const dur = heroVideo.duration;
      if (isFinite(dur) && dur > 0) {
        setTimeout(switchToImage, (dur + 0.5) * 1000);
      }
    });
  }

  /* ============== BACK TO TOP ============== */
  const backToTop = $('#backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleBackToTop();
  }

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

  // Trigger Google Translate IN-PLACE via su <select> oculto (sin recargar)
  const doTranslate = (code) => {
    const sel = document.querySelector('.goog-te-combo');
    if (!sel) return false;
    sel.value = code;
    sel.dispatchEvent(new Event('change'));
    return true;
  };

  const setLang = (code) => {
    const host = location.hostname;

    // Limpiar cookie googtrans en todas las variantes de dominio
    const clearCookie = (extra) => {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
        (extra ? '; ' + extra : '');
    };
    clearCookie('');
    if (host) {
      clearCookie('domain=.' + host);
      clearCookie('domain=' + host);
    }

    // Reset a español: GT no puede deshacer una traducción sin recargar
    if (!code || code === 'es') {
      setLangLabel('es');
      location.reload();
      return;
    }

    // Persistir cookie para próxima visita (formato /source/target)
    const value = '/es/' + code;
    document.cookie = 'googtrans=' + value + '; path=/';
    if (host) {
      document.cookie = 'googtrans=' + value + '; path=/; domain=' + host;
      document.cookie = 'googtrans=' + value + '; path=/; domain=.' + host;
    }

    // Sincronizar atributos del <html> para que Chrome no ofrezca traducir
    document.documentElement.lang = code;
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';

    setLangLabel(code);

    // Intento 1: traducir in-place inmediato
    let translated = doTranslate(code);

    // Polling 1.5s: reintentar por si GT aún no ha creado el combo
    let attempts = 0;
    const poll = setInterval(() => {
      if (translated || doTranslate(code)) {
        translated = true;
        clearInterval(poll);
      } else if (++attempts > 6) {
        // Fallback: si en 1.5s no traduce, recargamos. La cookie está
        // ya fijada → al recargar GT traduce automáticamente y nuestro
        // CSS+JS mata el banner. Igual que dynamo.
        clearInterval(poll);
        if (!translated) location.reload();
      }
    }, 250);

    // Verificación: si in-place "funcionó" pero <html> no recibe la clase
    // translated-ltr en 1.5s, GT realmente no tradujo → recargar
    setTimeout(() => {
      if (!document.documentElement.classList.contains('translated-ltr') &&
          !document.documentElement.classList.contains('translated-rtl')) {
        location.reload();
      }
    }, 1500);
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
