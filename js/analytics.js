/* Miso — analytics layer
 * -------------------------------------------------------------------------
 * Provider-agnostic. It sends the same events to whichever tools are loaded:
 *   - Vercel Web Analytics  (window.va)      — enable in the Vercel dashboard
 *   - GA4                   (window.gtag)
 *   - Plausible / Fathom    (window.plausible / window.fathom)
 *   - Microsoft Clarity     (window.clarity) — heatmaps + session replay
 * With none of them present it logs to the console, so you can watch events
 * fire locally before you connect anything.
 *
 * CONFIG: set CLARITY_ID / GA4_ID below to switch those on. Vercel Analytics
 * needs no key — turn it on in the project's Analytics tab and Vercel injects
 * its own script on the deployed domain.
 * ---------------------------------------------------------------------- */
(function () {
  var CLARITY_ID = '';   // e.g. 'abcd1234' — Microsoft Clarity, free, heatmaps + replays
  var GA4_ID     = '';   // e.g. 'G-XXXXXXXXXX' — only if you want GA4 as well
  var DEBUG      = /localhost|127\.0\.0\.1|^file:/.test(location.origin) || location.search.indexOf('debug=1') > -1;

  /* ---------- optional third-party loaders ---------- */
  if (CLARITY_ID) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var c = document.createElement('script');
    c.async = true; c.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    document.head.appendChild(c);
  }
  if (GA4_ID) {
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, { anonymize_ip: true });
  }

  /* ---------- one function, every provider ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  function track(name, props) {
    props = props || {};
    props.page = page;
    if (window.va) window.va('event', { name: name, data: props });
    if (window.gtag) window.gtag('event', name, props);
    if (window.plausible) window.plausible(name, { props: props });
    if (window.fathom && window.fathom.trackEvent) window.fathom.trackEvent(name);
    if (window.clarity) window.clarity('event', name);
    if (DEBUG) console.log('[miso.track]', name, props);
  }
  window.misoTrack = track;

  function label(el) {
    var title = el.querySelector('.row__t, h3, .h3');           // rows and cards carry their own title
    var t = (el.getAttribute('data-track') || (title ? title.textContent : el.textContent) || '')
      .trim().replace(/\s+/g, ' ');
    return t.slice(0, 60);
  }
  function sectionOf(el) {
    var s = el.closest('section');
    if (!s) return 'unknown';
    if (s.classList.contains('hero') || s.classList.contains('phero')) return 'hero';
    if (s.classList.contains('cta-band')) return 'closing-cta';
    if (s.id) return s.id;
    var h = s.querySelector('h2, h3');
    return h ? h.textContent.trim().slice(0, 40) : 'section';
  }

  /* ---------- 1. what they click ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a, button');
    if (!a) return;
    var href = a.getAttribute('href') || '';

    if (/^tel:/.test(href))    return track('call_click',  { section: sectionOf(a) });
    if (/^mailto:/.test(href)) return track('email_click', { section: sectionOf(a) });

    // booking intent — the conversion that matters
    if (href.indexOf('consultation') > -1 || /book|reserve|consult/i.test(label(a))) {
      return track('booking_cta_click', { label: label(a), section: sectionOf(a) });
    }
    // treatment interest
    if (a.classList.contains('row') || a.classList.contains('txt-link') || a.closest('.card')) {
      return track('treatment_click', { label: label(a), destination: href, section: sectionOf(a) });
    }
    if (a.classList.contains('burger') || a.closest('.drawer')) {
      return track('nav_mobile', { label: label(a) });
    }
    if (a.closest('.site-head')) return track('nav_click',  { label: label(a) });
    if (a.closest('.site-foot')) return track('footer_click', { label: label(a) });
    if (a.classList.contains('btn')) return track('button_click', { label: label(a), section: sectionOf(a) });
  }, true);

  /* ---------- 2. which questions they open (the most useful signal here) ---------- */
  document.querySelectorAll('.faq__item').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      var q = d.querySelector('summary span');
      track('faq_open', { question: (q ? q.textContent : '').trim().slice(0, 90) });
    });
  });

  /* ---------- 3. where they stop: scroll depth ---------- */
  var marks = [25, 50, 75, 90], hit = {};
  function depth() {
    var h = document.documentElement;
    var pct = (h.scrollTop + window.innerHeight) / h.scrollHeight * 100;
    marks.forEach(function (m) {
      if (pct >= m && !hit[m]) { hit[m] = true; track('scroll_depth', { depth: m + '%' }); }
    });
  }
  addEventListener('scroll', depth, { passive: true });
  depth();

  /* ---------- 4. which sections they actually reach, and for how long ---------- */
  if ('IntersectionObserver' in window) {
    var seen = {};
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var name = sectionOf(en.target);
        if (en.isIntersecting) {
          en.target._t0 = Date.now();
          if (!seen[name]) { seen[name] = true; track('section_view', { section: name }); }
        } else if (en.target._t0) {
          var secs = Math.round((Date.now() - en.target._t0) / 1000);
          en.target._t0 = null;
          if (secs >= 3) track('section_dwell', { section: name, seconds: secs });
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('main > section').forEach(function (s) { so.observe(s); });
  }

  /* ---------- 5. engaged time + exit point (the "where do they drop" answer) ---------- */
  var start = Date.now(), reported = false;
  function bail() {
    if (reported) return; reported = true;
    var secs = Math.round((Date.now() - start) / 1000);
    var last = 'top';
    document.querySelectorAll('main > section').forEach(function (s) {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.6) last = sectionOf(s);
    });
    track('page_exit', { seconds: secs, last_section: last, max_depth: Math.max.apply(null, Object.keys(hit).map(Number).concat([0])) + '%' });
  }
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') bail(); });
  addEventListener('pagehide', bail);
})();
