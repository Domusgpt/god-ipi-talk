/**
 * ══════════════════════════════════════════════════════════════
 * ENGINE.JS — Presentation Navigation & Control System
 * ══════════════════════════════════════════════════════════════
 *
 * This is the core engine that drives the slide deck. It handles:
 *
 *   1. NAVIGATION — Arrow keys, touch swipe, number keys
 *   2. TIMER — Counts up from 0:00 when the first slide change happens
 *   3. IFRAME MANAGEMENT — Lazy-loads visualizers only when their slide is active
 *   4. PRESENTER NOTES — Toggle with N key (not visible to YouTube audience)
 *   5. FULLSCREEN — Toggle with F key
 *
 * ARCHITECTURE NOTES
 * ──────────────────
 * The slide system uses CSS opacity transitions rather than transforms.
 * This is intentional — Three.js WebGL contexts inside iframes can
 * behave unpredictably during CSS transforms (especially on Safari).
 * Opacity changes don't affect layout or compositing in the same way.
 *
 * Iframes use a lazy-loading pattern: each iframe has a data-src
 * attribute instead of src. When a slide becomes active, engine.js
 * copies data-src → src, triggering the load. This means only ONE
 * WebGL context runs at a time, preventing GPU memory exhaustion.
 */

(function () {
  'use strict';

  // ── DOM References ──
  const slides   = Array.from(document.querySelectorAll('.slide'));
  const counter  = document.getElementById('counter');
  const timerEl  = document.getElementById('timer');
  const notesBar = document.getElementById('notes-bar');
  const total    = slides.length;

  // ── State ──
  let currentSlide  = 0;
  let notesVisible  = false;
  let timerStart    = null;
  let timerRAF      = null;
  let reviewMode    = false;
  let overviewOpen  = false;

  /**
   * Navigate to a specific slide by index.
   *
   * This function handles:
   *   - Deactivating the current slide
   *   - Activating the target slide
   *   - Loading any lazy iframes
   *   - Updating HUD elements
   *   - Triggering slide-specific animations
   *   - Starting the timer on first navigation
   *
   * @param {number} idx - Zero-based slide index
   */
  function goToSlide(idx) {
    if (idx < 0 || idx >= total) return;
    if (idx === currentSlide) return;

    // Deactivate current
    slides[currentSlide].classList.remove('active');

    // Activate target
    currentSlide = idx;
    slides[currentSlide].classList.add('active');

    // Update slide counter
    counter.textContent = (currentSlide + 1) + ' / ' + total;

    // Lazy-load iframe if present
    const iframe = slides[currentSlide].querySelector('iframe[data-src]');
    if (iframe && !iframe.src) {
      iframe.src = iframe.dataset.src;
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

  /**
   * Start the presentation timer.
   * Counts up from 0:00 using requestAnimationFrame for smooth updates.
   * The timer only starts when the presenter advances past the title slide,
   * giving them time to get settled before the clock starts.
   */
  function startTimer() {
    timerStart = performance.now();

    function tick() {
      const elapsed = Math.floor((performance.now() - timerStart) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      timerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      timerRAF = requestAnimationFrame(tick);
    }

    tick();
  }

  // ── Keyboard Controls ──
  document.addEventListener('keydown', function (e) {
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
        // Toggle fullscreen — essential for screen sharing
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        break;

      case 'n':
      case 'N':
        // Toggle presenter notes
        // TIP: When screen-sharing on YouTube, share a specific
        // Chrome tab (not entire screen) — then the notes bar
        // won't be visible to the audience even when shown.
        e.preventDefault();
        notesVisible = !notesVisible;
        notesBar.classList.toggle('show', notesVisible);
        break;

      default:
        // Number keys 1-9 → jump to slides 1-9
        // Key 0 → jump to slide 10
        if (e.key >= '1' && e.key <= '9') {
          goToSlide(parseInt(e.key) - 1);
        } else if (e.key === '0') {
          goToSlide(9);
        }
        break;
    }
  });

  // ── Touch Swipe Support ──
  // For tablet/phone usage or touch-screen laptops.
  let touchStartX = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goToSlide(currentSlide + 1);   // Swipe left → next
      else        goToSlide(currentSlide - 1);     // Swipe right → prev
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
    slides.forEach(function (slide) {
      slide.querySelectorAll('.shell-card, .sigma-step, .sigma-arrow').forEach(function (el) {
        el.classList.add('show');
      });
      slide.querySelectorAll('.bar-fill').forEach(function (bar) {
        if (bar.dataset.h) bar.style.height = bar.dataset.h + 'px';
      });
    });
  }

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
  // Set up the first slide and populate initial notes
  goToSlide(0);
  // Re-activate slide 0 since goToSlide skips same-index
  slides[0].classList.add('active');
  counter.textContent = '1 / ' + total;
  notesBar.textContent = slides[0].dataset.notes || '';

  // Export for external use if needed
  window.presentationEngine = {
    goToSlide: goToSlide,
    getCurrentSlide: function () { return currentSlide; },
    getTotal: function () { return total; }
  };
})();
