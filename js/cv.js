/* ============================================
   FSDV.EU — CV descent: depth gauge + star drift
   Each <section data-from data-to data-zone> in
   .descent maps its own scroll span to a depth
   range (km, negative = altitude). The gauge
   reads the depth at the middle of the viewport.
   ============================================ */

(function () {
  'use strict';

  var descent = document.querySelector('.descent');
  var gauge = document.querySelector('.gauge');
  if (!descent || !gauge) return;

  var sections = Array.prototype.slice.call(descent.querySelectorAll('[data-from]'));
  var kindEl = gauge.querySelector('.gauge-kind');
  var valEl = gauge.querySelector('.gauge-val');
  var zoneEl = gauge.querySelector('.gauge-zone');
  var starsFar = document.querySelector('.stars-far');
  var starsNear = document.querySelector('.stars-near');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var spans = [];   // [{top, bottom, from, to, zone}] in page coordinates
  var dTop = 0, dHeight = 1;

  function pageTop(el) {
    return el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
  }

  function colourOf(sec) {
    if (sec.classList.contains('sky')) return '#4a63b5';
    var cs = getComputedStyle(sec);
    return (cs.getPropertyValue('--st-bg') || '').trim() || cs.backgroundColor;
  }

  function measure() {
    dTop = pageTop(descent);
    dHeight = descent.offsetHeight || 1;
    spans = sections.map(function (sec) {
      var top = pageTop(sec);
      return {
        top: top,
        bottom: top + sec.offsetHeight,
        from: parseFloat(sec.getAttribute('data-from')),
        to: parseFloat(sec.getAttribute('data-to')),
        zone: sec.getAttribute('data-zone')
      };
    });
    // the probe sits mid-viewport; start the first span at the probe's
    // position at scroll 0, so the page opens on the full 400 km
    spans[0].top += window.innerHeight * 0.5;

    // paint the gauge scale with hard stops at each section's share of the page
    var stops = spans.map(function (s, i) {
      var a = ((s.top - dTop) / dHeight * 100).toFixed(2);
      var b = ((s.bottom - dTop) / dHeight * 100).toFixed(2);
      var c = colourOf(sections[i]);
      return c + ' ' + a + '% ' + b + '%';
    });
    gauge.style.setProperty('--gauge-scale', 'linear-gradient(180deg,' + stops.join(',') + ')');
  }

  function fmt(km) {
    var a = Math.abs(km);
    if (a < 0.1) return Math.round(a * 1000) + ' m';
    if (a < 1) return (Math.round(a * 100) * 10).toLocaleString('en-US') + ' m';
    return a.toLocaleString('en-US', { maximumFractionDigits: a < 100 ? 1 : 0 }) + ' km';
  }

  var ticking = false;
  function update() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var probe = y + window.innerHeight * 0.5;

    var s = spans[0];
    for (var i = 0; i < spans.length; i++) {
      if (probe >= spans[i].top) s = spans[i];
    }
    var t = Math.min(1, Math.max(0, (probe - s.top) / (s.bottom - s.top)));
    var depth = s.from + (s.to - s.from) * t;

    var zone = s.zone;
    if (depth < 0) zone = depth < -100 ? 'Low Earth orbit' : 'Atmosphere';
    else if (s.from < 0) zone = 'Surface';

    kindEl.textContent = depth < 0 ? 'Altitude' : 'Depth';
    valEl.textContent = fmt(depth);
    zoneEl.textContent = zone;

    var p = Math.min(1, Math.max(0, (probe - dTop) / dHeight));
    gauge.style.setProperty('--p', (p * 100).toFixed(2) + '%');

    if (!reduceMotion && y < window.innerHeight * 1.5) {
      if (starsFar) starsFar.style.translate = '0 ' + (y * 0.12).toFixed(1) + 'px';
      if (starsNear) starsNear.style.translate = '0 ' + (y * 0.3).toFixed(1) + 'px';
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); update(); });
  // fonts and images change the layout after first paint
  window.addEventListener('load', function () { measure(); update(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); update(); });
})();
