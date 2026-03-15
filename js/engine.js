/**
 * ENGINE.JS — Presentation Navigation & Control System
 *
 * Now with:
 *   - Directional slide transitions (exit-left / exit-right)
 *   - Progress bar
 *   - Floating particle system
 *   - Iframe load shimmer
 *   - Nav bar for mobile (above iframes)
 */

(function () {
  'use strict';

  // ── DOM References ──
  var slides      = Array.from(document.querySelectorAll('.slide'));
  var counter     = document.getElementById('counter');
  var timerEl     = document.getElementById('timer');
  var notesBar    = document.getElementById('notes-bar');
  var total       = slides.length;

  // ── State ──
  var currentSlide  = 0;
  var notesVisible  = false;
  var timerStart    = null;
  var timerRAF      = null;
  var reviewMode    = false;
  var overviewOpen  = false;

  // ── Create Progress Bar ──
  var progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.style.width = '0%';
  document.body.appendChild(progressBar);

  // ── Create Particle Field ──
  var particleField = document.createElement('div');
  particleField.className = 'particle-field';
  document.body.insertBefore(particleField, document.body.firstChild);

  function spawnParticles() {
    var colors = [
      'rgba(200, 169, 110, 0.3)',
      'rgba(0, 229, 255, 0.25)',
      'rgba(191, 127, 255, 0.2)'
    ];
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = 2 + Math.random() * 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (15 + Math.random() * 25) + 's';
      p.style.animationDelay = (Math.random() * 20) + 's';
      particleField.appendChild(p);
    }
  }
  spawnParticles();

  // ── Update Progress Bar ──
  function updateProgress() {
    var pct = total > 1 ? (currentSlide / (total - 1)) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /**
   * Navigate to a specific slide with directional transition.
   */
  function goToSlide(idx) {
    if (idx < 0 || idx >= total) return;
    if (idx === currentSlide) return;

    var direction = idx > currentSlide ? 'left' : 'right';
    var prev = currentSlide;

    // Add exit class to current slide
    slides[prev].classList.remove('active');
    if (!reviewMode) {
      slides[prev].classList.add(direction === 'left' ? 'exit-left' : 'exit-right');
      setTimeout(function () {
        slides[prev].classList.remove('exit-left', 'exit-right');
      }, 600);
    }

    // Activate new slide
    currentSlide = idx;
    slides[currentSlide].classList.remove('exit-left', 'exit-right');
    slides[currentSlide].classList.add('active');

    // Update HUD
    counter.textContent = (currentSlide + 1) + ' / ' + total;
    updateProgress();

    // Lazy-load iframe if present
    var iframe = slides[currentSlide].querySelector('iframe[data-src]');
    if (iframe && !iframe.src) {
      iframe.src = iframe.dataset.src;
      // Detect when iframe loads and fade it in
      iframe.addEventListener('load', function () {
        iframe.classList.add('loaded');
        var wrap = iframe.closest('.iframe-wrap');
        if (wrap) wrap.classList.add('loaded');
      });
    }

    // Update presenter notes
    notesBar.textContent = slides[currentSlide].dataset.notes || '';

    // Trigger animations for this slide
    if (typeof window.triggerSlideAnimations === 'function') {
      window.triggerSlideAnimations(currentSlide);
    }

    // Start timer on first real navigation
    if (!timerStart && idx > 0) {
      startTimer();
    }
  }

  function startTimer() {
    timerStart = performance.now();
    function tick() {
      var elapsed = Math.floor((performance.now() - timerStart) / 1000);
      var m = Math.floor(elapsed / 60);
      var s = elapsed % 60;
      timerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      timerRAF = requestAnimationFrame(tick);
    }
    tick();
  }

  // ── Keyboard Controls ──
  document.addEventListener('keydown', function (e) {
    if (overviewOpen && e.key !== 'Escape' && e.key !== 'g' && e.key !== 'G') return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        goToSlide(currentSlide + 1);
        break;

      case 'ArrowLeft':
        e.preventDefault();
        goToSlide(currentSlide - 1);
        break;

      case 'Escape':
        if (overviewOpen) { e.preventDefault(); toggleOverview(); }
        break;

      case 'g':
      case 'G':
        e.preventDefault();
        toggleOverview();
        break;

      case 'r':
      case 'R':
        e.preventDefault();
        reviewMode = !reviewMode;
        if (reviewMode) enterReviewMode();
        else { document.body.classList.remove('review-mode'); }
        break;

      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        goToSlide(total - 1);
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        break;

      case 'n':
      case 'N':
        e.preventDefault();
        notesVisible = !notesVisible;
        notesBar.classList.toggle('show', notesVisible);
        break;

      default:
        if (e.key >= '1' && e.key <= '9') {
          goToSlide(parseInt(e.key) - 1);
        } else if (e.key === '0') {
          goToSlide(9);
        }
        break;
    }
  });

  // ── Touch Swipe Support ──
  var touchStartX = 0;
  var touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goToSlide(currentSlide + 1);
      else        goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  // ── Slide Overview ──
  var overviewEl   = document.getElementById('slide-overview');
  var overviewGrid = document.getElementById('slide-overview-grid');

  function buildOverview() {
    overviewGrid.innerHTML = '';
    slides.forEach(function (slide, i) {
      var item = document.createElement('div');
      item.className = 'slide-overview-item' + (i === currentSlide ? ' current' : '');
      var h2 = slide.querySelector('h2');
      var title = h2 ? h2.textContent : 'Slide ' + (i + 1);
      item.innerHTML = '<div class="slide-overview-num">' + (i + 1) + ' / ' + total +
        '</div><div class="slide-overview-title">' + title + '</div>';
      item.addEventListener('click', function () {
        goToSlide(i);
        toggleOverview();
      });
      overviewGrid.appendChild(item);
    });
  }

  function toggleOverview() {
    overviewOpen = !overviewOpen;
    if (overviewOpen) buildOverview();
    overviewEl.classList.toggle('open', overviewOpen);
  }

  // ── Review Mode ──
  function enterReviewMode() {
    reviewMode = true;
    document.body.classList.add('review-mode');
    if (typeof window.markAllAnimated === 'function') {
      window.markAllAnimated();
    }
    slides.forEach(function (slide) {
      slide.querySelectorAll('.shell-card, .sigma-step, .sigma-arrow').forEach(function (el) {
        el.classList.add('show');
      });
      slide.querySelectorAll('.bar-fill').forEach(function (bar) {
        if (bar.dataset.h) bar.style.height = bar.dataset.h + 'px';
      });
    });
  }

  // ── Mobile Nav Bar ──
  var navBar    = document.getElementById('nav-bar');
  var navPrev   = document.getElementById('nav-prev');
  var navNext   = document.getElementById('nav-next');
  var navTitle  = document.getElementById('nav-title');
  var edgeLeft  = document.getElementById('edge-left');
  var edgeRight = document.getElementById('edge-right');

  if (navPrev) navPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    goToSlide(currentSlide - 1);
  });
  if (navNext) navNext.addEventListener('click', function (e) {
    e.stopPropagation();
    goToSlide(currentSlide + 1);
  });
  if (edgeLeft) edgeLeft.addEventListener('click', function (e) {
    e.stopPropagation();
    goToSlide(currentSlide - 1);
  });
  if (edgeRight) edgeRight.addEventListener('click', function (e) {
    e.stopPropagation();
    goToSlide(currentSlide + 1);
  });

  if (navBar) {
    var navTouchX = 0;
    navBar.addEventListener('touchstart', function (e) {
      navTouchX = e.touches[0].clientX;
    }, { passive: true });
    navBar.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - navTouchX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  // Update nav title on slide change
  var origGoToSlide = goToSlide;
  goToSlide = function (idx) {
    origGoToSlide(idx);
    if (navTitle && slides[currentSlide]) {
      var h2 = slides[currentSlide].querySelector('h2');
      navTitle.textContent = h2 ? h2.textContent : 'Slide ' + (currentSlide + 1);
    }
  };

  // ── Mobile: tap MENU or counter to open slide grid ──
  var menuBtn = document.getElementById('mobile-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleOverview();
    });
  }
  counter.style.cursor = 'pointer';
  counter.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleOverview();
  });

  // ── Auto-enable review mode on touch devices ──
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    enterReviewMode();
  }

  // ── Initialize ──
  goToSlide(0);
  slides[0].classList.add('active');
  counter.textContent = '1 / ' + total;
  notesBar.textContent = slides[0].dataset.notes || '';
  updateProgress();

  // Trigger title slide animation
  if (typeof window.triggerSlideAnimations === 'function') {
    window.triggerSlideAnimations(0);
  }

  // Export
  window.presentationEngine = {
    goToSlide: goToSlide,
    getCurrentSlide: function () { return currentSlide; },
    getTotal: function () { return total; }
  };
})();
