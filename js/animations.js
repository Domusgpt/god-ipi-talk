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
        setTimeout(function() { startPackingAnim(); }, 600);
        setTimeout(function() {
          var bars = document.querySelectorAll('#palindrome-bars .bar-fill');
          var vals = document.querySelectorAll('#palindrome-bars .bar-value');
          bars.forEach(function (bar, i) {
            setTimeout(function () {
              bar.style.height = bar.dataset.h + 'px';
              bar.classList.add('grown');
            }, i * 500);
          });
          vals.forEach(function (val, i) {
            setTimeout(function () {
              val.classList.add('visible');
            }, bars.length * 500 + 400 + i * 200);
          });
        }, 4500);
        break;

      case 3:
        // ── Slide 4: Projection — animated dot separation ──
        animateSlideElements(slide, 100);
        setTimeout(startProjectionAnim, 800);
        break;

      case 4:
        // ── Slide 5: Shell Cards + concentric rings ──
        animateSlideElements(slide, 100);
        setTimeout(animateShellCards, 500);
        setTimeout(startRingsAnim, 1200);
        break;

      case 5:
        // ── Slide 6: Information Table + bits bar ──
        animateSlideElements(slide, 200);
        setTimeout(function() {
          var rows = slide.querySelectorAll('.info-row');
          rows.forEach(function (row, i) {
            setTimeout(function () {
              row.classList.add('visible');
            }, i * 800);
          });
        }, 800);
        setTimeout(function() { startBitsAnim(); }, 4200);
        break;

      case 6:
        // ── Slide 7: Vopson ──
        animateSlideElements(slide, 300);
        setTimeout(function() { startEntropyAnim(); }, 1500);
        break;

      case 7:
        // ── Slide 8: σ-Chain with divisor chips ──
        animateSlideElements(slide, 200);
        setTimeout(function() {
          var allEls = document.querySelectorAll('#sigma-chain .sigma-step, #sigma-chain .sigma-arrow, #sigma-chain .sigma-viz');
          var delay = 0;
          allEls.forEach(function (el) {
            if (el.classList.contains('sigma-step')) {
              (function(e, d) { setTimeout(function() { e.classList.add('show'); }, d); })(el, delay);
              delay += 1200;
            } else if (el.classList.contains('sigma-arrow')) {
              (function(e, d) { setTimeout(function() { e.classList.add('show'); }, d); })(el, delay);
              delay += 600;
            } else if (el.classList.contains('sigma-viz')) {
              (function(vizEl, d) { setTimeout(function() { animateDivisors(vizEl); }, d); })(el, delay);
              delay += 1400;
            }
          });
        }, 800);
        break;

      case 12:
        // ── Slide 13: 137 with decomposition blocks ──
        animate137WithDecomp(slide);
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
      slide.querySelectorAll('.bar-fill, .decomp-bar').forEach(function (bar) {
        if (bar.dataset.h) {
          var maxH = bar.classList.contains('decomp-bar') ? Math.max((parseFloat(bar.dataset.h) / 128) * 140, 8) : parseFloat(bar.dataset.h);
          bar.style.height = maxH + 'px';
          bar.classList.add('grown');
        }
      });
      slide.querySelectorAll('.sigma-divisor, .sigma-equals, .decomp-plus').forEach(function (el) {
        el.classList.add('visible');
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

  // ══════════════════════════════════════════════════════
  // VISUAL CONTENT ANIMATIONS
  // ══════════════════════════════════════════════════════

  // ── Sphere packing: 240 dots populate shells ──
  function startPackingAnim() {
    var c = document.getElementById('packing-canvas');
    if (!c) return;
    var dpr = window.devicePixelRatio || 1;
    var w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    var ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    var cx = w/2, cy = h/2;
    var maxR = Math.min(w,h) * 0.42;

    // 240 target positions in concentric arrangement
    var dots = [];
    var shellPops = [24, 56, 40, 40, 56, 24];
    var shellColors = ['#00e5ff','#c8a96e','#bf7fff','#bf7fff','#c8a96e','#00e5ff'];
    for (var s = 0; s < 6; s++) {
      var r = maxR * (0.25 + s * 0.13);
      for (var j = 0; j < shellPops[s]; j++) {
        var a = (j / shellPops[s]) * Math.PI * 2 + s * 0.3;
        dots.push({ x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r, color: shellColors[s], shell: s });
      }
    }
    // Shuffle order for reveal
    for (var i = dots.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = dots[i]; dots[i] = dots[j]; dots[j] = tmp;
    }

    var startTime = null;
    var totalDuration = 4000; // 4 seconds to place all 240

    function draw(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      var p = Math.min(elapsed / totalDuration, 1);
      var eased = 1 - Math.pow(1-p, 2);
      var numVisible = Math.floor(eased * dots.length);

      ctx.clearRect(0, 0, w, h);

      // Center point
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(232,224,208,0.3)'; ctx.fill();

      // Ghost rings
      for (var s = 0; s < 6; s++) {
        var r = maxR * (0.25 + s * 0.13);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(200,169,110,0.06)'; ctx.lineWidth = 1; ctx.stroke();
      }

      // Dots
      for (var i = 0; i < numVisible; i++) {
        var d = dots[i];
        var dotAge = Math.min((elapsed - (i/dots.length)*totalDuration*0.8) / 300, 1);
        if (dotAge <= 0) continue;
        var scale = 1 - Math.pow(1-dotAge, 3);
        ctx.beginPath(); ctx.arc(d.x, d.y, 2.5 * scale, 0, Math.PI*2);
        ctx.fillStyle = d.color; ctx.globalAlpha = 0.7 * scale; ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Counter
      ctx.font = 'bold 13px "Space Mono", monospace';
      ctx.fillStyle = '#c8a96e';
      ctx.globalAlpha = 0.8;
      ctx.textAlign = 'center';
      ctx.fillText(numVisible + ' / 240', cx, h - 6);
      ctx.globalAlpha = 1;

      if (p < 1) requestAnimationFrame(draw);
      else {
        // Final: label "E8"
        ctx.font = 'bold 16px "Space Mono", monospace';
        ctx.fillStyle = '#c8a96e'; ctx.globalAlpha = 0.6;
        ctx.textAlign = 'center'; ctx.fillText('E8', cx, 14);
        ctx.globalAlpha = 1;
      }
    }
    requestAnimationFrame(draw);
  }

  /* ── Entropy comparison: random vs E8 minimized ── */
  function startEntropyAnim() {
    var c = document.getElementById('entropy-canvas');
    if (!c) return;
    var dpr = window.devicePixelRatio || 1;
    var w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    var ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);

    // Two columns: "Random" (high entropy) vs "E8" (minimized)
    var colW = w * 0.4;
    var x1 = w * 0.08, x2 = w * 0.52;
    var barY = 30, barH = h - 60;

    var startTime = null;

    function draw(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / 3000, 1);
      var e = 1 - Math.pow(1-p, 3);
      ctx.clearRect(0, 0, w, h);

      // Labels
      ctx.font = '10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7a7060'; ctx.globalAlpha = Math.min(p*3, 1);
      ctx.fillText('RANDOM', x1 + colW/2, 14);
      ctx.fillStyle = '#c8a96e';
      ctx.fillText('E8', x2 + colW/2, 14);
      ctx.globalAlpha = 1;

      // Random column — chaotic bars (high entropy)
      var rEntropy = 0.85 * e; // stays high
      ctx.fillStyle = 'rgba(255,107,53,0.15)';
      ctx.fillRect(x1, barY, colW, barH);
      // Noise blocks
      for (var i = 0; i < 12; i++) {
        var by = barY + (i/12)*barH;
        var bh = barH/12 - 2;
        var bw = colW * (0.3 + Math.random()*0.7) * e;
        ctx.fillStyle = 'rgba(255,107,53,' + (0.2 + Math.random()*0.3) + ')';
        ctx.fillRect(x1, by, bw, bh);
      }

      // E8 column — organized 3-layer structure (minimum entropy)
      ctx.fillStyle = 'rgba(200,169,110,0.08)';
      ctx.fillRect(x2, barY, colW, barH);

      var layers = [
        { frac: 0.126, color: '#00e5ff', label: 'type' },      // 0.997/7.907
        { frac: 0.191, color: '#bf7fff', label: 'shell' },      // 1.509/7.907
        { frac: 0.683, color: '#e8e0d0', label: 'position' }    // 5.401/7.907
      ];
      var ly = barY;
      for (var i = 0; i < layers.length; i++) {
        var layerP = Math.max(0, Math.min((p - i*0.2)/0.5, 1));
        var le = 1 - Math.pow(1-layerP, 2);
        var lh = layers[i].frac * barH;
        ctx.fillStyle = layers[i].color;
        ctx.globalAlpha = 0.4 * le;
        ctx.fillRect(x2, ly, colW * le, lh);
        ctx.globalAlpha = 1;
        // Label inside
        if (le > 0.5) {
          ctx.font = '9px "Space Mono", monospace';
          ctx.fillStyle = layers[i].color;
          ctx.globalAlpha = Math.min((le-0.5)*2, 1) * 0.8;
          ctx.textAlign = 'center';
          ctx.fillText(layers[i].label, x2 + colW/2, ly + lh/2 + 3);
          ctx.globalAlpha = 1;
        }
        ly += lh;
      }

      // Bottom labels: entropy values
      if (p > 0.6) {
        var la = Math.min((p-0.6)*2.5, 1);
        ctx.font = 'bold 11px "Space Mono", monospace';
        ctx.globalAlpha = la;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff6b35'; ctx.fillText('HIGH', x1+colW/2, h-6);
        ctx.fillStyle = '#c8a96e'; ctx.fillText('MINIMUM', x2+colW/2, h-6);
        ctx.globalAlpha = 1;
      }

      if (p < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // ── Projection: 240 mixed dots separate into colored rings ──
  function startProjectionAnim() {
    var c = document.getElementById('proj-canvas');
    if (!c) return;
    var dpr = window.devicePixelRatio || 1;
    var w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    var ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    var cx = w/2, cy = h/2, maxR = Math.min(w,h) * 0.44;

    var pops = [24,56,40,40,56,24];
    var colors = ['#00e5ff','#c8a96e','#bf7fff','#bf7fff','#c8a96e','#00e5ff'];
    var dots = [];
    for (var s = 0; s < 6; s++) {
      var targetR = maxR * (0.3 + s * 0.12);
      for (var j = 0; j < pops[s]; j++) {
        var angle = (j / pops[s]) * Math.PI * 2 + s * 0.5;
        dots.push({
          sx: cx + (Math.random()-0.5)*maxR*1.4, sy: cy + (Math.random()-0.5)*maxR*1.4,
          ex: cx + Math.cos(angle)*targetR, ey: cy + Math.sin(angle)*targetR,
          color: colors[s], shell: s
        });
      }
    }

    var startTime = null, duration = 3000;
    function draw(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var t = 1 - Math.pow(1-p, 3);
      ctx.clearRect(0, 0, w, h);

      // Shell rings
      if (p > 0.3) {
        var ra = Math.min((p-0.3)/0.4, 1) * 0.15;
        for (var s = 0; s < 6; s++) {
          var r = maxR * (0.3 + s * 0.12);
          var rc = colors[s];
          var rr = parseInt(rc.slice(1,3),16), gg = parseInt(rc.slice(3,5),16), bb = parseInt(rc.slice(5,7),16);
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
          ctx.strokeStyle = 'rgba('+rr+','+gg+','+bb+','+ra+')';
          ctx.lineWidth = 1; ctx.stroke();
        }
      }

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        ctx.beginPath(); ctx.arc(d.sx+(d.ex-d.sx)*t, d.sy+(d.ey-d.sy)*t, 2, 0, Math.PI*2);
        ctx.fillStyle = p < 0.15 ? 'rgba(232,224,208,0.5)' : d.color;
        ctx.globalAlpha = 0.7 + t*0.3; ctx.fill(); ctx.globalAlpha = 1;
      }

      if (p > 0.1 && p < 0.5) {
        ctx.font = '11px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(232,224,208,' + (1-(p-0.1)/0.4)*0.6 + ')';
        ctx.textAlign = 'center'; ctx.fillText('Standard — roots mixed', cx, h-8);
      }
      if (p > 0.6) {
        ctx.font = '11px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(200,169,110,' + Math.min((p-0.6)/0.2,1)*0.8 + ')';
        ctx.textAlign = 'center'; ctx.fillText('Parity — types separated', cx, h-8);
      }
      if (p < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // ── Concentric rings showing shells ──
  function startRingsAnim() {
    var c = document.getElementById('rings-canvas');
    if (!c) return;
    var dpr = window.devicePixelRatio || 1;
    var w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    var ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    var cx = w/2, cy = h/2, maxR = Math.min(w,h) * 0.45;

    var shells = [
      {pop:24,color:'#00e5ff',label:'S+'},{pop:56,color:'#c8a96e',label:'D8'},
      {pop:40,color:'#00e5ff',label:'S+'},{pop:40,color:'#00e5ff',label:'S+'},
      {pop:56,color:'#c8a96e',label:'D8'},{pop:24,color:'#00e5ff',label:'S+'}
    ];
    var startTime = null;
    function draw(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < shells.length; i++) {
        var sp = Math.max(0, Math.min((elapsed - i*300) / 800, 1));
        if (sp <= 0) continue;
        var e = 1 - Math.pow(1-sp, 3);
        var r = maxR * (0.2 + i*0.13), s = shells[i];

        ctx.beginPath(); ctx.arc(cx, cy, r*e, 0, Math.PI*2);
        ctx.strokeStyle = s.color; ctx.globalAlpha = e*0.4; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;

        var nd = Math.round(s.pop * e / 4);
        for (var j = 0; j < nd; j++) {
          var a = (j/(s.pop/4)) * Math.PI*2 + elapsed*0.0003*(i%2===0?1:-1);
          ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*e, cy+Math.sin(a)*r*e, 2.5, 0, Math.PI*2);
          ctx.fillStyle = s.color; ctx.globalAlpha = e*0.8; ctx.fill(); ctx.globalAlpha = 1;
        }

        if (sp > 0.5) {
          ctx.font = '10px "Space Mono", monospace'; ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.min((sp-0.5)*2, 1)*0.7;
          ctx.textAlign = 'left'; ctx.fillText(s.pop+' '+s.label, cx+r*e+6, cy+4); ctx.globalAlpha = 1;
        }
      }
      if (elapsed < 20000) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // ── Information bits stacking bar ──
  function startBitsAnim() {
    var c = document.getElementById('bits-canvas');
    if (!c) return;
    var dpr = window.devicePixelRatio || 1;
    var w = c.clientWidth, h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    var ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);

    var totalBits = 7.907;
    var layers = [
      {bits:0.997, color:'#00e5ff', label:'H(type)'},
      {bits:1.509, color:'#bf7fff', label:'H(shell|type)'},
      {bits:5.401, color:'#e8e0d0', label:'H(pos|shell)'}
    ];
    var barY = 30, barH = 50, barMaxW = w * 0.85;
    var barX = (w - barMaxW) / 2;
    var startTime = null;

    function draw(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / 2500, 1);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(200,169,110,0.06)';
      ctx.fillRect(barX, barY, barMaxW, barH);

      var x = barX;
      for (var i = 0; i < layers.length; i++) {
        var ld = i * 0.25;
        var lp = Math.max(0, Math.min((p-ld)/0.5, 1));
        var le = 1 - Math.pow(1-lp, 2);
        var lw = (layers[i].bits / totalBits) * barMaxW * le;
        if (lw > 0) {
          ctx.fillStyle = layers[i].color; ctx.globalAlpha = 0.6;
          ctx.fillRect(x, barY, lw, barH); ctx.globalAlpha = 1;
          if (lp > 0.3 && lw > 30) {
            ctx.font = 'bold 11px "Space Mono", monospace';
            ctx.fillStyle = layers[i].color === '#e8e0d0' ? '#050508' : layers[i].color;
            ctx.globalAlpha = Math.min((lp-0.3)*2, 1); ctx.textAlign = 'center';
            ctx.fillText(layers[i].bits.toFixed(3), x+lw/2, barY+barH/2+4); ctx.globalAlpha = 1;
          }
        }
        x += lw;
      }

      x = barX;
      for (var i = 0; i < layers.length; i++) {
        var ld = i * 0.25;
        var lp = Math.max(0, Math.min((p-ld)/0.5, 1));
        var lw = (layers[i].bits / totalBits) * barMaxW * (1-Math.pow(1-lp,2));
        if (lp > 0.5) {
          ctx.font = '10px "Space Mono", monospace'; ctx.fillStyle = layers[i].color;
          ctx.globalAlpha = Math.min((lp-0.5)*2, 1)*0.7; ctx.textAlign = 'center';
          ctx.fillText(layers[i].label, x+lw/2, barY+barH+18); ctx.globalAlpha = 1;
        }
        x += lw;
      }

      if (p > 0.8) {
        var ta = Math.min((p-0.8)*5, 1);
        ctx.font = 'bold 14px "Space Mono", monospace'; ctx.fillStyle = '#c8a96e';
        ctx.globalAlpha = ta; ctx.textAlign = 'center';
        ctx.fillText('= 7.907 bits = log₂(240)', w/2, barY+barH+45); ctx.globalAlpha = 1;
      }
      if (p < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // ── σ-Chain with divisor chips ──
  function animateSigmaChainWithDivisors() {
    var allEls = document.querySelectorAll('#sigma-chain .sigma-step, #sigma-chain .sigma-arrow, #sigma-chain .sigma-viz');
    var delay = 0;
    allEls.forEach(function (el) {
      if (el.classList.contains('sigma-step')) {
        (function(e, d) { setTimeout(function() { e.classList.add('show'); }, d); })(el, delay);
        delay += 600;
      } else if (el.classList.contains('sigma-arrow')) {
        (function(e, d) { setTimeout(function() { e.classList.add('show'); }, d); })(el, delay);
        delay += 400;
      } else if (el.classList.contains('sigma-viz')) {
        (function(vizEl, d) { setTimeout(function() { animateDivisors(vizEl); }, d); })(el, delay);
        delay += 800;
      }
    });
  }

  function animateDivisors(vizEl) {
    var divisors = vizEl.dataset.divisors.split(',');
    var sum = vizEl.dataset.sum;
    vizEl.innerHTML = '';
    divisors.forEach(function (d, i) {
      var chip = document.createElement('span');
      chip.className = 'sigma-divisor'; chip.textContent = d;
      vizEl.appendChild(chip);
      if (i < divisors.length - 1) {
        var plus = document.createElement('span');
        plus.className = 'sigma-equals'; plus.textContent = '+';
        vizEl.appendChild(plus);
      }
    });
    var eq = document.createElement('span');
    eq.className = 'sigma-equals'; eq.textContent = ' = ' + sum;
    eq.style.color = 'var(--gold)'; eq.style.fontWeight = '700';
    vizEl.appendChild(eq);

    var allChips = vizEl.querySelectorAll('.sigma-divisor, .sigma-equals');
    allChips.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, i * 80);
    });
  }

  // ── 137 with decomposition blocks ──
  function animate137WithDecomp(slide) {
    var bigNum = slide.querySelector('.big-num');
    var others = slide.querySelectorAll('h2, h3, p, .desc-sm');
    if (bigNum) {
      bigNum.style.opacity = '0'; bigNum.style.transform = 'scale(0.5)';
      bigNum.style.transition = 'opacity 1.2s var(--ease), transform 1.2s var(--ease-spring)';
    }
    others.forEach(function (el) { el.classList.add('anim-target'); });
    setTimeout(function () {
      if (bigNum) { bigNum.style.opacity = '1'; bigNum.style.transform = 'scale(1)'; }
    }, 300);
    setTimeout(animateDecomp, 1400);
    others.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, 2800 + i * 200);
    });
  }

  function animateDecomp() {
    var bars = document.querySelectorAll('#decomp-137 .decomp-bar');
    var pluses = document.querySelectorAll('#decomp-137 .decomp-plus');
    var heights = [128, 8, 1];
    var maxH = 140;
    bars.forEach(function (bar, i) {
      var targetH = Math.max((heights[i] / 128) * maxH, 8);
      setTimeout(function () { bar.style.height = targetH + 'px'; }, i * 400);
    });
    pluses.forEach(function (p, i) {
      setTimeout(function () { p.classList.add('visible'); }, 200 + i * 400);
    });
  }

  // ── Verification progress bar ──
  function animateVerifyBar() {
    var fill = document.getElementById('verify-fill');
    var lbl = document.getElementById('verify-label');
    if (fill) fill.classList.add('full');
    if (lbl) {
      var startTime = null;
      (function tick(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / 2000, 1);
        var eased = 1 - Math.pow(1-p, 3);
        var n = Math.round(eased * 361);
        lbl.textContent = n + ' / 361 tests passing' + (p < 1 ? '...' : ' ✓');
        if (n >= 361) lbl.style.color = 'var(--gold)';
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }
  }

})();
