/**
 * ANIMATIONS.JS — Cinematic Entrance Animations
 *
 * Every slide gets staggered element entrances.
 * Key slides get special choreography:
 *   - Bars grow with spring physics
 *   - Shell cards cascade with type-color glow
 *   - Info rows typewriter in
 *   - Sigma chain flows like a river
 *   - Stat numbers count up from zero
 *   - Open questions unfold one by one
 */

(function () {
  'use strict';

  const animated = new Set();

  /**
   * Stagger-animate all child elements of a slide.
   * This is the default "everything fades in nicely" animation.
   */
  function animateSlideElements(slide, baseDelay) {
    baseDelay = baseDelay || 200;
    // Animate h2, h3, p, .eq, blockquote, .desc, .desc-sm, .split, .glow-line, etc.
    var targets = slide.querySelectorAll(
      'h2, h3, p, .eq, blockquote, .desc, .desc-sm, .glow-line, ' +
      '.split, .thanks-grid, .thanks-name, .iframe-overlay'
    );
    targets.forEach(function (el, i) {
      el.classList.add('anim-target');
      setTimeout(function () {
        el.classList.add('visible');
      }, baseDelay + i * 120);
    });
  }

  /**
   * Counter animation — makes a number count up from 0.
   */
  function countUp(el, target, duration, suffix) {
    suffix = suffix || '';
    var start = 0;
    var startTime = null;
    // Handle fraction targets
    var isFloat = String(target).indexOf('.') !== -1;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.round(eased * target);
      if (isFloat) {
        current = (eased * target).toFixed(3);
      }
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /**
   * Trigger entrance animations for a specific slide.
   */
  window.triggerSlideAnimations = function (slideIndex) {
    if (animated.has(slideIndex)) return;
    animated.add(slideIndex);

    var slides = document.querySelectorAll('.slide');
    var slide = slides[slideIndex];
    if (!slide) return;

    switch (slideIndex) {
      case 0:
        // ── Title Slide ──
        // Cinematic entrance: title fades in, then subtitle, then author
        animateTitleSlide(slide);
        break;

      case 1:
        // ── Slide 2: Palindrome Bars ──
        animateSlideElements(slide, 100);
        setTimeout(animateBars, 600);
        break;

      case 3:
        // ── Slide 4: Projection ──
        animateSlideElements(slide, 150);
        break;

      case 4:
        // ── Slide 5: Shell Cards ──
        animateSlideElements(slide, 100);
        setTimeout(animateShellCards, 500);
        break;

      case 5:
        // ── Slide 6: Information Table ──
        animateSlideElements(slide, 100);
        setTimeout(animateInfoRows, 500);
        break;

      case 6:
        // ── Slide 7: Vopson ──
        animateSlideElements(slide, 150);
        break;

      case 7:
        // ── Slide 8: σ-Chain ──
        animateSlideElements(slide, 100);
        setTimeout(animateSigmaChain, 500);
        break;

      case 12:
        // ── Slide 13: Fine Structure 137 ──
        animate137(slide);
        break;

      case 13:
        // ── Slide 14: Stats ──
        animateSlideElements(slide, 100);
        setTimeout(function () { animateStatCards(slide); }, 500);
        break;

      case 14:
        // ── Slide 15: Open Questions ──
        animateSlideElements(slide, 100);
        setTimeout(function () { animateOpenQuestions(slide); }, 400);
        break;

      case 15:
        // ── Slide 16: Thanks ──
        animateSlideElements(slide, 200);
        break;

      default:
        // All other slides (including iframe visualizer slides)
        animateSlideElements(slide, 200);
        break;
    }
  };

  /**
   * Mark all animations as complete (for review mode / touch devices).
   */
  window.markAllAnimated = function () {
    var slides = document.querySelectorAll('.slide');
    slides.forEach(function (slide, i) {
      animated.add(i);
      // Show all anim targets
      slide.querySelectorAll('.anim-target').forEach(function (el) {
        el.classList.add('visible');
      });
      // Show all animatable elements
      slide.querySelectorAll('.shell-card, .sigma-step, .sigma-arrow').forEach(function (el) {
        el.classList.add('show');
      });
      slide.querySelectorAll('.info-row').forEach(function (el) {
        el.classList.add('visible');
      });
      slide.querySelectorAll('.stat-card').forEach(function (el) {
        el.classList.add('visible');
      });
      slide.querySelectorAll('.oq-list li').forEach(function (el) {
        el.classList.add('visible');
      });
      slide.querySelectorAll('.bar-fill').forEach(function (bar) {
        if (bar.dataset.h) {
          bar.style.height = bar.dataset.h + 'px';
          bar.classList.add('grown');
        }
      });
      slide.querySelectorAll('.bar-value').forEach(function (el) {
        el.classList.add('visible');
      });
    });
  };

  // ── Title slide ──
  function animateTitleSlide(slide) {
    var elements = slide.querySelectorAll('.title-content > *');
    elements.forEach(function (el, i) {
      el.classList.add('anim-target');
      setTimeout(function () {
        el.classList.add('visible');
      }, 400 + i * 250);
    });
  }

  // ── Palindrome Bars ──
  function animateBars() {
    var bars = document.querySelectorAll('#palindrome-bars .bar-fill');
    var vals = document.querySelectorAll('#palindrome-bars .bar-value');
    bars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.style.height = bar.dataset.h + 'px';
        bar.classList.add('grown');
      }, i * 250);
    });
    // After bars done, show values
    vals.forEach(function (val, i) {
      setTimeout(function () {
        val.classList.add('visible');
      }, bars.length * 250 + 200 + i * 100);
    });
  }

  // ── Shell Cards ──
  function animateShellCards() {
    var cards = document.querySelectorAll('#shell-grid .shell-card');
    cards.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.add('show');
      }, i * 300);
    });
  }

  // ── Info Table Rows ──
  function animateInfoRows() {
    var rows = document.querySelectorAll('.info-row');
    rows.forEach(function (row, i) {
      setTimeout(function () {
        row.classList.add('visible');
      }, i * 400);
    });
  }

  // ── σ-Chain ──
  function animateSigmaChain() {
    var elements = document.querySelectorAll(
      '#sigma-chain .sigma-step, #sigma-chain .sigma-arrow'
    );
    elements.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('show');
      }, i * 500);
    });
  }

  // ── 137 Slide ──
  function animate137(slide) {
    var bigNum = slide.querySelector('.big-num');
    var others = slide.querySelectorAll('h2, h3, p, .eq, .desc-sm, .glow-line');

    // Start with everything hidden
    if (bigNum) {
      bigNum.style.opacity = '0';
      bigNum.style.transform = 'scale(0.5)';
      bigNum.style.transition = 'opacity 1.2s var(--ease), transform 1.2s var(--ease-spring)';
    }
    others.forEach(function (el) { el.classList.add('anim-target'); });

    // Big number slams in first
    setTimeout(function () {
      if (bigNum) {
        bigNum.style.opacity = '1';
        bigNum.style.transform = 'scale(1)';
      }
    }, 300);

    // Then supporting text
    others.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('visible');
      }, 1200 + i * 200);
    });
  }

  // ── Stat Cards with counting numbers ──
  function animateStatCards(slide) {
    var cards = slide.querySelectorAll('.stat-card');
    cards.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.add('visible');
        // Count up the number
        var numEl = card.querySelector('.sc-num');
        if (numEl) {
          var text = numEl.textContent.trim();
          // Handle "361/361" format
          if (text.indexOf('/') !== -1) {
            var parts = text.split('/');
            var target = parseInt(parts[0]);
            var denom = parts[1];
            var startTime = null;
            (function tick(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / 1500, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              numEl.textContent = Math.round(eased * target) + '/' + denom;
              if (progress < 1) requestAnimationFrame(tick);
            })(performance.now());
          } else {
            var num = parseInt(text);
            if (!isNaN(num) && num > 0) {
              countUp(numEl, num, 1500, '');
            }
          }
        }
      }, i * 300);
    });
  }

  // ── Open Questions List ──
  function animateOpenQuestions(slide) {
    var items = slide.querySelectorAll('.oq-list li');
    items.forEach(function (li, i) {
      setTimeout(function () {
        li.classList.add('visible');
      }, i * 250);
    });
  }
})();
