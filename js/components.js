/* ============================================
   FSDV.EU — Site Components & Navigation
   Single source of truth for header + footer.
   ============================================ */

(function () {
  'use strict';

  // --- Detect base path from this script's src ---
  // Pages at root: src="js/components.js" → base = ""
  // Pages in subdir: src="../js/components.js" → base = "../"
  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var src = thisScript.getAttribute('src') || '';
  var BASE = src.replace('js/components.js', '');

  // --- Detect current page for active state ---
  var path = window.location.pathname;
  var page = '';
  if (path.match(/index\.html$/) || path.endsWith('/')) page = 'home';
  else if (path.includes('cv.html')) page = 'cv';
  else if (path.includes('publications.html') || path.includes('/articles/')) page = 'publications';
  else if (path.includes('hobbies') || path.includes('/posts/')) page = 'hobbies';
  else if (path.includes('contact.html')) page = 'contact';

  // ===== HEADER HTML =====
  var headerHTML = ''
    + '<header class="site-header">'
    + '  <div class="container">'
    + '    <a href="' + BASE + 'index.html" class="site-logo">F. Santoro <span>De Vico</span></a>'
    + '    <nav class="main-nav" id="main-nav">'
    + '      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">'
    + '        <span></span><span></span><span></span>'
    + '      </button>'
    + '      <ul id="nav-list">'
    + '        <li><a href="' + BASE + 'index.html" data-page="home">Home</a></li>'
    + '        <li><a href="' + BASE + 'cv.html" data-page="cv">Curriculum</a></li>'
    + '        <li><a href="' + BASE + 'publications.html" data-page="publications">Publications</a></li>'
    + '        <li class="dropdown" id="hobbies-dropdown">'
    + '          <a href="' + BASE + 'hobbies.html" data-page="hobbies">Hobbies &amp; Blog</a>'
    + '          <ul class="dropdown-menu">'
    + '            <li><a href="' + BASE + 'hobbies/photography.html">Photography</a></li>'
    + '            <li><a href="' + BASE + 'hobbies/outdoor.html">Outdoor &amp; Sport</a></li>'
    + '            <li><a href="' + BASE + 'hobbies/music.html">Music</a></li>'
    + '            <li><a href="' + BASE + 'hobbies/geology.html">Geology &amp; Science</a></li>'
    + '            <li><a href="' + BASE + 'hobbies/other.html">Other</a></li>'
    + '          </ul>'
    + '        </li>'
    + '        <li><a href="' + BASE + 'contact.html" data-page="contact">Contact</a></li>'
    + '      </ul>'
    + '    </nav>'
    + '  </div>'
    + '</header>';

  // ===== FOOTER HTML =====
  var footerHTML = ''
    + '<footer class="site-footer">'
    + '  <div class="container">'
    + '    <div class="footer-content">'
    + '      <p>&copy; 2026 Francesco Santoro De Vico. All rights reserved.</p>'
    + '      <ul class="footer-links">'
    + '        <li><a href="https://www.linkedin.com/in/francesco-santoro-geo/" target="_blank" rel="noopener">LinkedIn</a></li>'
    + '        <li><a href="https://github.com/PacoSanto" target="_blank" rel="noopener">GitHub</a></li>'
    + '        <li><a href="https://scholar.google.com/citations?user=eUcDzHIAAAAJ&hl=en" target="_blank" rel="noopener">Scholar</a></li>'
    + '        <li><a href="https://www.researchgate.net/profile/Francesco-Santoro-De-Vico" target="_blank" rel="noopener">ResearchGate</a></li>'
    + '        <li><a href="https://orcid.org/my-orcid?orcid=0000-0002-8429-0345" target="_blank" rel="noopener">ORCID</a></li>'
    + '        <li><a href="https://www.juzaphoto.com/me.php?l=it&p=232357" target="_blank" rel="noopener">JuzaPhoto</a></li>'
    + '      </ul>'
    + '    </div>'
    + '  </div>'
    + '</footer>';

  // ===== INJECT =====
  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  // ===== ACTIVE PAGE HIGHLIGHT =====
  var navLinks = document.querySelectorAll('#nav-list > li > a[data-page]');
  for (var i = 0; i < navLinks.length; i++) {
    if (navLinks[i].getAttribute('data-page') === page) {
      navLinks[i].classList.add('active');
    }
  }

  // ===== MOBILE HAMBURGER TOGGLE =====
  var toggle = document.getElementById('nav-toggle');
  var navList = document.getElementById('nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navList.classList.toggle('open');
      toggle.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.main-nav')) {
        navList.classList.remove('open');
        toggle.classList.remove('open');
      }
    });
  }

  // ===== DROPDOWN — works on both desktop (hover) and mobile (click) =====
  var dropdown = document.getElementById('hobbies-dropdown');
  if (dropdown) {
    var dropdownLink = dropdown.querySelector(':scope > a');
    var dropdownMenu = dropdown.querySelector('.dropdown-menu');

    // On mobile: tap toggles the submenu, second tap navigates
    dropdownLink.addEventListener('click', function (e) {
      // Only intercept on mobile (when hamburger is visible)
      if (window.innerWidth <= 640) {
        if (!dropdownMenu.classList.contains('show')) {
          e.preventDefault();
          dropdownMenu.classList.toggle('show');
        }
        // If already showing, let the click navigate to hobbies.html
      }
    });
  }

})();
