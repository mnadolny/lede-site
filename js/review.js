/* Design review options — review.html only. State lives in the query string
   (?o=line&p=hatch) so a link opens with the same options switched on. */
(function () {
  var root = document.documentElement;
  var rv = document.getElementById('rv');
  if (!rv) return;
  var toggles = rv.querySelectorAll('[data-opt]');
  var pats = rv.querySelectorAll('input[name="rv-pat"]');
  var head = document.querySelector('.praise-head');
  var support = document.getElementById('support');
  var pill = support.querySelector('.pill');

  /* ---- the connecting line: an overlay drawn from real element positions ---- */
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'rv-line');
  svg.setAttribute('aria-hidden', 'true');
  var stroke = document.createElementNS(NS, 'path');
  var tip = document.createElementNS(NS, 'path');
  svg.appendChild(stroke); svg.appendChild(tip);
  document.body.appendChild(svg);

  function textBox(el) {                 // the h2 is a block; measure its glyphs
    var r = document.createRange();
    r.selectNodeContents(el);
    return r.getBoundingClientRect();
  }
  function f(n) { return Math.round(n * 10) / 10; }

  function draw() {
    if (!root.classList.contains('opt-line')) return;
    var sx = window.scrollX, sy = window.scrollY, W = document.documentElement.clientWidth;
    var p = pill.getBoundingClientRect();
    var h = textBox(head.querySelector('.h2'));
    var d, t;
    if (W >= 860) {
      // out of the pill's right end, swing right, one loop, back in to the heading
      var x1 = p.right + 14 + sx, y1 = p.top + p.height / 2 + sy;
      var x2 = h.right + 22 + sx, y2 = h.top + h.height * 0.5 + sy;
      var xr = Math.min(x1 + 160, sx + W - 70);
      var ym = (y1 + y2) / 2;
      d = 'M' + f(x1) + ' ' + f(y1) +
          ' C' + f(x1 + 70) + ' ' + f(y1 - 12) + ' ' + f(xr + 12) + ' ' + f(y1 + 6) + ' ' + f(xr) + ' ' + f(ym - 44) +
          ' C' + f(xr - 4) + ' ' + f(ym + 8) + ' ' + f(xr - 62) + ' ' + f(ym + 20) + ' ' + f(xr - 60) + ' ' + f(ym - 8) +
          ' C' + f(xr - 58) + ' ' + f(ym - 38) + ' ' + f(xr + 4) + ' ' + f(ym - 30) + ' ' + f(xr - 6) + ' ' + f(ym + 30) +
          ' C' + f(xr - 14) + ' ' + f(y2 - 6) + ' ' + f(x2 + 60) + ' ' + f(y2 + 3) + ' ' + f(x2) + ' ' + f(y2);
      t = 'M' + f(x2 + 13) + ' ' + f(y2 - 10) + ' Q' + f(x2 + 5) + ' ' + f(y2 - 3) + ' ' + f(x2) + ' ' + f(y2) +
          ' Q' + f(x2 + 6) + ' ' + f(y2 + 5) + ' ' + f(x2 + 12) + ' ' + f(y2 + 11);
    } else {
      // phone: a short squiggle straight down from the pill to the heading
      var cx = p.left + p.width / 2 + sx, top = p.bottom + 12 + sy;
      var hx = h.left + Math.min(h.width / 2, 60) + sx, bot = h.top - 12 + sy;
      var k = (bot - top) / 4;
      d = 'M' + f(cx) + ' ' + f(top) +
          ' C' + f(cx + 26) + ' ' + f(top + k) + ' ' + f(cx - 26) + ' ' + f(top + 2 * k) + ' ' + f((cx + hx) / 2) + ' ' + f(top + 2.4 * k) +
          ' C' + f(hx + 24) + ' ' + f(top + 3 * k) + ' ' + f(hx - 10) + ' ' + f(bot - 20) + ' ' + f(hx) + ' ' + f(bot);
      t = 'M' + f(hx - 9) + ' ' + f(bot - 12) + ' Q' + f(hx - 3) + ' ' + f(bot - 4) + ' ' + f(hx) + ' ' + f(bot) +
          ' Q' + f(hx + 4) + ' ' + f(bot - 5) + ' ' + f(hx + 10) + ' ' + f(bot - 11);
    }
    stroke.setAttribute('d', d);
    tip.setAttribute('d', t);
  }
  var queued = false;
  function redraw() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; draw(); });
  }

  /* ---- apply state ---- */
  function apply(push) {
    var on = [];
    toggles.forEach(function (c) {
      root.classList.toggle('opt-' + c.dataset.opt, c.checked);
      if (c.checked) on.push(c.dataset.opt);
    });
    var pat = rv.querySelector('input[name="rv-pat"]:checked').value;
    root.classList.toggle('opt-hatch', pat === 'hatch');
    root.classList.toggle('opt-nopat', pat === 'nopat');

    if (push) {
      var q = [];
      if (on.length) q.push('o=' + on.join(','));
      if (pat) q.push('p=' + pat);
      history.replaceState(null, '', location.pathname + (q.length ? '?' + q.join('&') : '') + location.hash);
    }
    redraw();
  }

  var params = new URLSearchParams(location.search);
  var want = (params.get('o') || '').split(',');
  toggles.forEach(function (c) { c.checked = want.indexOf(c.dataset.opt) > -1; });
  pats.forEach(function (r) { r.checked = r.value === (params.get('p') || ''); });
  apply(false);

  rv.addEventListener('change', function () { apply(true); });
  window.addEventListener('resize', redraw);
  window.addEventListener('scroll', redraw, { passive: true });   // reveals shift things as they land
  window.addEventListener('load', redraw);
  if (document.fonts) document.fonts.ready.then(redraw);
  document.addEventListener('transitionend', redraw);

  /* ---- panel open/closed (starts closed on phones) ---- */
  var btn = rv.querySelector('.rv-toggle'), body = document.getElementById('rv-body');
  function setOpen(open) { btn.setAttribute('aria-expanded', open); body.hidden = !open; }
  setOpen(window.matchMedia('(min-width:861px)').matches);
  btn.addEventListener('click', function () { setOpen(body.hidden); });
})();
