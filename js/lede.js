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

  /* partner band: double the row so the -50% loop is seamless */
  var mq = document.getElementById('mq');
  if (mq) mq.innerHTML += mq.innerHTML.replace(/<span/g, '<span aria-hidden="true"');

  /* ------------------------------------------------------------------
     FEATURE CAROUSEL (home). One card centred, its neighbours peeking
     in at both edges, exactly as the Figma frame. A clone at each end
     makes it wrap: the first card's left peek is the last card.
     Dots, arrow keys, swipe, and a click on either peek all move it.
     ------------------------------------------------------------------ */
  var car = document.querySelector('[data-carousel]');
  if (car) {
    var view = car.querySelector('.fcar-view'), track = car.querySelector('.fcar-track');
    var cards = [].slice.call(track.children), n = cards.length;
    var head = cards[n - 1].cloneNode(true), tail = cards[0].cloneNode(true);
    [head, tail].forEach(function (c) { c.classList.add('clone'); c.removeAttribute('id'); });
    track.insertBefore(head, cards[0]); track.appendChild(tail);
    var all = [].slice.call(track.children), i = 1;

    var dots = car.querySelector('.fc-dots');
    cards.forEach(function (c, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show ' + (c.querySelector('h3') || {}).textContent);
      b.addEventListener('click', function () { go(k + 1); });
      dots.appendChild(b);
    });

    function place(anim) {
      var cw = all[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var x = (view.clientWidth - cw) / 2 - i * (cw + gap);
      track.classList.toggle('no-anim', !anim || reduce);
      track.style.transform = 'translateX(' + x + 'px)';
      var active = (i - 1 + n) % n;
      [].forEach.call(dots.children, function (d, k) { d.setAttribute('aria-current', k === active ? 'true' : 'false'); });
      all.forEach(function (c, k) {
        var on = k === i;
        c.setAttribute('aria-hidden', on ? 'false' : 'true');
        c.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
      });
    }
    function go(k) { i = k; place(true); if (reduce) settle(); }
    function settle() {
      if (i === 0) { i = n; place(false); }
      else if (i === n + 1) { i = 1; place(false); }
    }
    track.addEventListener('transitionend', function (e) { if (e.target === track) settle(); });

    /* a click on a peeking card brings it in instead of following its link */
    all.forEach(function (c, k) {
      c.addEventListener('click', function (e) { if (k !== i) { e.preventDefault(); go(k); } });
    });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    });
    var x0 = null, swiped = false;
    view.addEventListener('pointerdown', function (e) { x0 = e.clientX; swiped = false; });
    view.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { swiped = true; go(i + (dx < 0 ? 1 : -1)); }
    });
    /* a swipe ends in a click on whatever is under the finger — swallow it */
    view.addEventListener('click', function (e) { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);
    window.addEventListener('resize', function () { place(false); });
    place(false);
  }

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
