/* ============================================
   FSDV.EU — motion layer for the v3 pages
   (home, CV, publications, hobbies, contact).
   Smooth scroll, cover parallax, cursor ring.
   Header state and reveal live in components.js.
   Everything degrades to a plain page.
   ============================================ */

(function () {
  'use strict';

  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---- smooth scroll (Lenis, if the CDN script arrived) ---------------
  if (!reduceMotion && typeof window.Lenis === 'function') {
    var lenis = new window.Lenis({ duration: 1.15 });
    window.siteLenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64 });
    });
  }

  // ---- cover parallax ---------------------------------------------------
  // uses the standalone `translate` property so it never fights the
  // entrance zoom, which lives on `transform`
  var coverImg = document.querySelector('.cover-img, .page-cover-img');
  if (coverImg && !reduceMotion) {
    var cover = coverImg.parentElement;
    var ticking = false;
    var update = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y < cover.offsetHeight) coverImg.style.translate = '0 ' + (y * 0.28).toFixed(1) + 'px';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ---- cursor ring --------------------------------------------------------
  if (finePointer && !reduceMotion) {
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    body.appendChild(ring);

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      ring.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { ring.classList.remove('is-visible'); });
    document.addEventListener('mouseover', function (e) {
      ring.classList.toggle('is-hot', !!e.target.closest('a, button'));
    });

    (function follow() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(follow);
    })();
  }
})();
