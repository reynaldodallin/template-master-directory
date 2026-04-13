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
  // MOBILE MENU
  // ══════════════════════════
  function initMobileMenu() {
    var hamburger = document.getElementById('navHamburger');
    var navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close on link click
    var links = navLinks.querySelectorAll('.nav__link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    }

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
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

})();
