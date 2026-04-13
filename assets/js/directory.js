/**
 * Template Master Directory — Vanilla JS
 * TechSites A.I. — No frameworks, no dependencies.
 * Handles: dark mode, mobile menu, search, filters, scroll, lazy load, icons.
 */

(function () {
  'use strict';

  // ── DOM Ready ──
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initScrollTop();
    initLazyImages();
    initLucideIcons();
    initFilters();
    initFooterLinks();
    initFadeAnimations();
    initHeroParallax();
    initLeafletMap();
  });

  // ══════════════════════════
  // DARK MODE
  // ══════════════════════════
  function initThemeToggle() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    var stored = localStorage.getItem('theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ══════════════════════════
  // MOBILE MENU (Sidebar)
  // ══════════════════════════
  function initMobileMenu() {
    var hamburger = document.getElementById('navHamburger');
    var navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    var navContainer = navLinks.parentNode;
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    var movedToBody = false;

    // Move nav to body on mobile so it escapes backdrop-filter containing block
    function handleResize() {
      var isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile && !movedToBody) {
        document.body.appendChild(navLinks);
        document.body.appendChild(overlay);
        movedToBody = true;
      } else if (!isMobile && movedToBody) {
        navContainer.insertBefore(navLinks, navContainer.querySelector('.nav__actions'));
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        navLinks.classList.remove('open');
        overlay.classList.remove('visible');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        movedToBody = false;
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    function openMenu() {
      navLinks.classList.add('open');
      overlay.classList.add('visible');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      overlay.classList.remove('visible');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeMenu);

    // Close on link click
    var links = navLinks.querySelectorAll('.nav__link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', closeMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ══════════════════════════
  // SMOOTH SCROLL
  // ══════════════════════════
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = 80; // nav height
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    }
  }

  // ══════════════════════════
  // SCROLL TO TOP
  // ══════════════════════════
  function initScrollTop() {
    var btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ══════════════════════════
  // LAZY LOAD IMAGES
  // ══════════════════════════
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    var images = document.querySelectorAll('img[loading="lazy"]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(function (img) {
      observer.observe(img);
    });
  }

  // ══════════════════════════
  // LUCIDE ICONS
  // ══════════════════════════
  function initLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    } else {
      // Retry after CDN loads
      window.addEventListener('load', function () {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
      });
    }
  }

  // ══════════════════════════
  // FILTERS & SEARCH
  // ══════════════════════════
  function initFilters() {
    var config = window.__DIRECTORY_CONFIG__;
    if (!config) return;

    var categories = config.categories || [];
    var areas = config.areas || [];
    var listings = config.listings || [];

    // Populate category dropdowns
    populateSelect('heroCategoryFilter', categories, 'id', 'name');
    populateSelect('categoryFilter', categories, 'id', 'name');

    // Populate area dropdown
    populateSelect('areaFilter', areas, 'id', 'name');

    // Search + filter handlers
    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var areaFilter = document.getElementById('areaFilter');
    var sortFilter = document.getElementById('sortFilter');
    var heroSearch = document.getElementById('heroSearch');
    var heroSearchBtn = document.getElementById('heroSearchBtn');
    var heroCategoryFilter = document.getElementById('heroCategoryFilter');

    function applyFilters() {
      var query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      var cat = categoryFilter ? categoryFilter.value : '';
      var area = areaFilter ? areaFilter.value : '';
      var sort = sortFilter ? sortFilter.value : 'rating';

      var cards = document.querySelectorAll('#listingsGrid .listing-card');
      var visibleCount = 0;

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var cardCat = card.getAttribute('data-category') || '';
        var cardArea = card.getAttribute('data-area') || '';
        var cardText = card.textContent.toLowerCase();

        var matchQuery = !query || cardText.indexOf(query) !== -1;
        var matchCat = !cat || cardCat === cat;
        var matchArea = !area || cardArea === area;

        if (matchQuery && matchCat && matchArea) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      }

      // Show/hide empty message
      var emptyMsg = document.getElementById('listingsEmpty');
      if (emptyMsg) {
        emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (areaFilter) areaFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);

    // Hero search → transfers to listing filters
    if (heroSearchBtn) {
      heroSearchBtn.addEventListener('click', function () {
        if (heroSearch && searchInput) {
          searchInput.value = heroSearch.value;
        }
        if (heroCategoryFilter && categoryFilter) {
          categoryFilter.value = heroCategoryFilter.value;
        }
        // Scroll to listings
        var listingsSection = document.getElementById('listings');
        if (listingsSection) {
          var top = listingsSection.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
        setTimeout(applyFilters, 100);
      });
    }

    // Enter key on hero search
    if (heroSearch) {
      heroSearch.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && heroSearchBtn) {
          heroSearchBtn.click();
        }
      });
    }
  }

  function populateSelect(selectId, items, valueKey, labelKey) {
    var select = document.getElementById(selectId);
    if (!select) return;

    for (var i = 0; i < items.length; i++) {
      var option = document.createElement('option');
      option.value = items[i][valueKey];
      option.textContent = items[i][labelKey];
      select.appendChild(option);
    }
  }

  // ══════════════════════════
  // FOOTER LINKS (dynamic)
  // ══════════════════════════
  function initFooterLinks() {
    var config = window.__DIRECTORY_CONFIG__;
    if (!config) return;

    var catList = document.getElementById('footerCategories');
    if (catList && config.categories) {
      config.categories.forEach(function (cat) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = 'category/' + cat.id + '.html';
        a.textContent = cat.name;
        li.appendChild(a);
        catList.appendChild(li);
      });
    }

    var areaList = document.getElementById('footerAreas');
    if (areaList && config.areas) {
      config.areas.forEach(function (area) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#listings';
        a.textContent = area.name;
        li.appendChild(a);
        areaList.appendChild(li);
      });
    }
  }

  // ══════════════════════════
  // FADE-IN ANIMATIONS
  // ══════════════════════════
  function initFadeAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var elements = document.querySelectorAll('.section, .listing-card, .category-card, .blog-card');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in', 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  // ══════════════════════════
  // HERO PARALLAX
  // ══════════════════════════
  function initHeroParallax() {
    var bg = document.getElementById('heroBg');
    if (!bg) return;

    // Disable on mobile for performance
    var isMobile = window.innerWidth < 768;
    if (isMobile) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          var hero = document.getElementById('hero');
          if (!hero) return;
          var heroBottom = hero.offsetTop + hero.offsetHeight;
          // Only animate while hero is in viewport
          if (scrollY < heroBottom) {
            var offset = scrollY * 0.35;
            bg.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ══════════════════════════
  // LEAFLET MAP (OpenStreetMap)
  // ══════════════════════════
  function initLeafletMap() {
    var mapEl = document.getElementById('listingMap');
    if (!mapEl || typeof L === 'undefined') return;

    var lat = parseFloat(mapEl.getAttribute('data-lat'));
    var lng = parseFloat(mapEl.getAttribute('data-lng'));
    if (isNaN(lat) || isNaN(lng)) return;

    // Remove placeholder content
    var placeholder = mapEl.querySelector('.listing-map__placeholder');
    if (placeholder) placeholder.remove();

    var map = L.map('listingMap', {
      scrollWheelZoom: false,
      attributionControl: true
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    // Custom coffee-colored marker
    var icon = L.divIcon({
      className: 'custom-map-marker',
      html: '<div style="background:#6F4E37;width:32px;height:32px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M17 8h1a4 4 0 110 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v4M10 2v4M14 2v4"/></svg></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    L.marker([lat, lng], { icon: icon }).addTo(map);
  }

})();
