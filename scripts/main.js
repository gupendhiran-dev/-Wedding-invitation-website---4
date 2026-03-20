/* =============================================================
   main.js — App bootstrap
   Initializes Lenis, Three.js, GSAP, and all modules
   ============================================================= */

(function () {
  'use strict';

  /* ── LENIS SMOOTH SCROLL ─────────────────────────────────── */
  function initLenis() {
    if (!window.Lenis) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Hook into GSAP ticker
    if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Connect Lenis to GSAP ScrollTrigger
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Smooth anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: 0, duration: 2 });
      });
    });

    return lenis;
  }

  /* ── LOADER ─────────────────────────────────────────────────── */
  function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => { loader.style.display = 'none'; }, 700);
  }

  /* ── BOOT ────────────────────────────────────────────────────── */
  function boot() {
    // 1. Init Three.js world
    if (window.SceneController) {
      SceneController.init();
    }

    // 2. Init Lenis
    initLenis();

    // 3. Init GSAP animations
    if (window.WeddingAnimations) {
      WeddingAnimations.init();
    }

    // 4. Hide loader after brief delay (allows assets to settle)
    setTimeout(hideLoader, 2200);
  }

  /* ── DOM READY ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ── PERFORMANCE: reduce motion ─────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--ease-cinematic', 'ease');
    // Disable some heavy animations
    const style = document.createElement('style');
    style.textContent = `
      .petal, .firefly, .star, .bird, .butterfly, .cloud, .lantern {
        animation-duration: 0.01s !important;
        animation-iteration-count: 1 !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

})();
