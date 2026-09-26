/* LEDE — v13 · shared behaviour. Loaded with `defer` on every page.
   Page-specific code stays out of here. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* footer year */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* header: .stuck once the page scrolls. On the home page (body.home)
     the CSS keeps the small wordmark hidden until then, because the
     hero carries the big logo. Other pages show it from the top. */
  var nav = document.getElementById('nav'), pending = false;
  function onScroll() {
    if (pending || !nav) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      nav.classList.toggle('stuck', window.pageYOffset > 24);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* scroll reveals */
  if (!('IntersectionObserver' in window) || reduce) {
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });
  }

  /* contact form — PLACEHOLDER ONLY, not wired to a backend.
     Submitting shows the thank-you panel. */
  var form = document.getElementById('claimForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    document.getElementById('formView').hidden = true;
    var ok = document.getElementById('successView');
    ok.classList.add('show');
    var h = ok.querySelector('h3'), msg = h.textContent;
    h.textContent = ''; h.textContent = msg;
    h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
    ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
})();
