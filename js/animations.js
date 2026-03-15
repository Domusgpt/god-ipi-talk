/**
 * ══════════════════════════════════════════════════════════════
 * ANIMATIONS.JS — Per-Slide Entrance Animations
 * ══════════════════════════════════════════════════════════════
 *
 * Each slide can have custom entrance animations that fire when
 * the slide becomes active. This creates a "build" effect where
 * elements appear one by one, giving the audience time to absorb
 * each piece of information.
 *
 * ANIMATION PHILOSOPHY
 * ────────────────────
 * Animations serve the mathematics, not the other way around.
 * Each animation is designed to mirror what the math is doing:
 *
 *   - Palindrome bars GROW UPWARD → populations being counted
 *   - Shell cards APPEAR LEFT TO RIGHT → shells being enumerated
 *   - σ-chain steps SLIDE IN → the function being iterated
 *
 * All animations use CSS transitions (defined in components.css)
 * triggered by adding CSS classes. No JavaScript animation loops.
 * This keeps performance predictable even with WebGL iframes.
 *
 * TIMING
 * ──────
 * Delays are calibrated for a live presentation pace:
 *   - 200-350ms between elements → comfortable for narration
 *   - 300ms initial delay → lets the slide opacity transition finish
 *   - Total build time: 1.5-3 seconds per animated slide
 */

(function () {
  'use strict';

  // Track which slides have already been animated
  // (so revisiting a slide doesn't replay the animation)
  const animated = new Set();

  /**
   * Trigger entrance animations for a specific slide.
   * Called by engine.js whenever a slide becomes active.
   *
   * @param {number} slideIndex - Zero-based slide index
   */
  window.triggerSlideAnimations = function (slideIndex) {
    // Skip if already animated
    if (animated.has(slideIndex)) return;
    animated.add(slideIndex);

    switch (slideIndex) {
      case 1:
        // ── Slide 2: Palindrome Bars ──
        // The six bars grow upward to their population heights.
        // Each bar appears 200ms after the previous one.
        //
        // Heights are proportional to shell populations:
        //   24 → 72px, 56 → 168px, 40 → 120px
        //   (scaled by 3× for visual impact)
        animateBars();
        break;

      case 4:
        // ── Slide 5: Shell Cards ──
        // Six cards appear one by one, left to right.
        // The palindromic symmetry becomes visible as
        // shells 4 and 5 mirror shells 1 and 0.
        animateShellCards();
        break;

      case 7:
        // ── Slide 8: σ-Chain ──
        // Each step of the chain slides in from the left.
        // Arrows appear between steps.
        // This mimics "iterating" the σ function.
        animateSigmaChain();
        break;
    }
  };

  /**
   * Animate the palindrome bar chart (Slide 2).
   *
   * The bars represent shell populations [24, 56, 40, 40, 56, 24].
   * They start at height 0 and grow to their target heights.
   * The CSS transition in components.css handles the smooth growth.
   */
  function animateBars() {
    const bars = document.querySelectorAll('#palindrome-bars .bar-fill');
    bars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.style.height = bar.dataset.h + 'px';
      }, 300 + i * 200);
    });
  }

  /**
   * Animate the shell cards (Slide 5).
   *
   * Cards start invisible (opacity: 0, translateY: 20px) via CSS.
   * Adding the "show" class triggers the CSS transition.
   * The 350ms stagger lets the presenter narrate each shell.
   */
  function animateShellCards() {
    const cards = document.querySelectorAll('#shell-grid .shell-card');
    cards.forEach(function (card, i) {
      setTimeout(function () {
        card.classList.add('show');
      }, 400 + i * 350);
    });
  }

  /**
   * Animate the σ-chain (Slide 8).
   *
   * Steps and arrows alternate, sliding in from the left.
   * The 600ms delay between elements gives the audience
   * time to read each number and its significance.
   *
   * σ(28) = 56  → "28 rotation planes produce 56 D8 roots"
   * σ(56) = 120 → "56 D8 roots connect to 120 dimensions"
   * σ(120)= 360 → "120 dimensions govern 360 = |A₆| = 6 shells"
   */
  function animateSigmaChain() {
    const elements = document.querySelectorAll(
      '#sigma-chain .sigma-step, #sigma-chain .sigma-arrow'
    );
    elements.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('show');
      }, 300 + i * 600);
    });
  }
})();
