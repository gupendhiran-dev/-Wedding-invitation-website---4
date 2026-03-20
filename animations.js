/* =============================================================
   animations.js — GSAP ScrollTrigger choreography
   All scroll-driven reveals, transitions, and scene activations
   ============================================================= */

window.WeddingAnimations = (function () {

  function init() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    setupRevealObserver();
    setupNavScroll();
    setupSceneActivations();
    setupCountdown();
    setupRSVP();
    setupGallery();
    setupBeginButton();
    setupProposalHearts();
    setupFinaleEffects();
    injectSceneParticles();
  }

  /* ── INTERSECTION OBSERVER for .reveal-* classes ──────────── */
  function setupRevealObserver() {
    const opts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, opts);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .scale-in').forEach(el => {
      observer.observe(el);
    });
  }

  /* ── NAV: Add .scrolled class after first scroll ─────────── */
  function setupNavScroll() {
    const nav = document.getElementById('top-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── GSAP SCENE TRANSITIONS via ScrollTrigger ─────────────── */
  function setupSceneActivations() {
    if (!window.SceneController || !window.gsap) return;

    const sceneMap = [
      { id: 'scene-intro',    key: 'intro' },
      { id: 'scene-flowers',  key: 'flowers' },
      { id: 'scene-met',      key: 'met' },
      { id: 'scene-park',     key: 'flowers' },  // reuse flower particles
      { id: 'scene-proposal', key: 'proposal' },
      { id: 'scene-finale',   key: 'finale' },
    ];

    sceneMap.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        onEnter: () => SceneController.activateScene(key),
      });
    });
  }

  /* ── COUNTDOWN TIMER ──────────────────────────────────────── */
  function setupCountdown() {
    const weddingDate = new Date('2025-06-14T16:00:00');
    const daysEl  = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl  = document.getElementById('cd-mins');
    const secsEl  = document.getElementById('cd-secs');

    if (!daysEl) return;

    let prevSecs = -1;

    function update() {
      const now  = new Date();
      const diff = weddingDate - now;
      if (diff <= 0) {
        daysEl.textContent  = '000';
        hoursEl.textContent = '00';
        minsEl.textContent  = '00';
        secsEl.textContent  = '00';
        return;
      }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);

      daysEl.textContent  = String(days).padStart(3, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent  = String(mins).padStart(2, '0');

      if (secs !== prevSecs) {
        secsEl.textContent = String(secs).padStart(2, '0');
        secsEl.classList.remove('flip');
        void secsEl.offsetWidth; // reflow
        secsEl.classList.add('flip');
        prevSecs = secs;
      }
    }
    update();
    setInterval(update, 1000);
  }

  /* ── RSVP FORM ────────────────────────────────────────────── */
  function setupRSVP() {
    const form    = document.getElementById('rsvp-form');
    const success = document.getElementById('rsvp-success');
    const submit  = document.getElementById('rsvp-submit');
    const yesBtn  = document.getElementById('attend-yes');
    const noBtn   = document.getElementById('attend-no');

    if (!form) return;

    // Toggle attend buttons
    [yesBtn, noBtn].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        yesBtn.classList.toggle('active', btn.dataset.val === 'yes');
        noBtn.classList.toggle('active',  btn.dataset.val === 'no');
      });
    });

    // Submit
    if (submit) {
      submit.addEventListener('click', () => {
        const name  = document.getElementById('rsvp-name')?.value.trim();
        const phone = document.getElementById('rsvp-phone')?.value.trim();
        if (!name) {
          shakeField('rsvp-name');
          return;
        }

        // Sparkle burst on button
        if (window.ParticleSystems) {
          ParticleSystems.sparkleBurst(submit, 16);
        }

        // Animate out form, in success
        gsap.to(form, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            form.style.display = 'none';
            success.style.display = 'flex';
            gsap.from(success, { opacity: 0, y: 20, duration: 0.6, ease: 'back.out(1.7)' });
          },
        });
      });
    }
  }

  function shakeField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = '#e05050';
    gsap.fromTo(el,
      { x: 0 },
      { x: 8, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut',
        onComplete: () => { el.style.borderColor = ''; } }
    );
  }

  /* ── GALLERY LIGHTBOX ─────────────────────────────────────── */
  function setupGallery() {
    const lightbox = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lightbox-img');
    const lbClose  = document.getElementById('lightbox-close');

    if (!lightbox) return;

    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        lbImg.innerHTML = `<span>Memory ${i + 1}</span>`;
        lightbox.classList.add('active');
        gsap.from(lbImg, { scale: 0.7, duration: 0.5, ease: 'back.out(1.7)' });
      });
    });

    lbClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
      gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => {
        lightbox.classList.remove('active');
        gsap.set(lightbox, { opacity: 1 });
      }});
    }

    // Keyboard ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ── BEGIN BUTTON ─────────────────────────────────────────── */
  function setupBeginButton() {
    const btn = document.getElementById('begin-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const flowers = document.getElementById('scene-flowers');
      if (!flowers) return;
      gsap.to(window, {
        scrollTo: { y: flowers, offsetY: 0 },
        duration: 2,
        ease: 'power3.inOut',
      });
      if (window.ParticleSystems) {
        ParticleSystems.sparkleBurst(btn, 20);
      }
    });
  }

  /* ── PROPOSAL HEARTS on scroll enter ─────────────────────── */
  function setupProposalHearts() {
    const proposal = document.getElementById('scene-proposal');
    const burst    = document.getElementById('heart-burst');
    if (!proposal || !burst) return;

    ScrollTrigger.create({
      trigger: proposal,
      start: 'top 50%',
      once: true,
      onEnter: () => {
        setTimeout(() => {
          if (window.ParticleSystems) {
            ParticleSystems.spawnHearts(burst, 40);
          }
        }, 600);
      },
    });
  }

  /* ── FINALE FIREWORKS ─────────────────────────────────────── */
  function setupFinaleEffects() {
    const finale    = document.getElementById('scene-finale');
    const fireworks = document.getElementById('fireworks');
    if (!finale || !fireworks) return;

    let started = false;
    ScrollTrigger.create({
      trigger: finale,
      start: 'top 60%',
      onEnter: () => {
        if (started) return;
        started = true;
        if (window.ParticleSystems) {
          ParticleSystems.spawnLanterns(fireworks, 20);
          setTimeout(() => ParticleSystems.launchFireworks(fireworks, true), 800);
        }
      },
    });
  }

  /* ── INJECT PARTICLES INTO APPROPRIATE SCENES ─────────────── */
  function injectSceneParticles() {
    if (!window.ParticleSystems) return;

    // Intro: cloud overlay
    const introEl = document.getElementById('scene-intro');
    if (introEl) {
      const cloudDiv = document.createElement('div');
      cloudDiv.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;';
      introEl.insertBefore(cloudDiv, introEl.firstChild);
      ParticleSystems.spawnClouds(cloudDiv, 8);
      ParticleSystems.spawnBirds(cloudDiv, 6);
    }

    // Flowers: petals + butterflies + flowers
    const flowerEl = document.getElementById('scene-flowers');
    if (flowerEl) {
      const div = document.createElement('div');
      div.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;';
      flowerEl.insertBefore(div, flowerEl.firstChild);
      ParticleSystems.spawnPetals(div, 22);
      ParticleSystems.spawnButterflies(div, 6);
      ParticleSystems.spawnFlowers(div, 14);
    }

    // Met scene: floating hearts
    const heartsEl = document.getElementById('floating-hearts');
    if (heartsEl) {
      // Continuous hearts
      function dropHeart() {
        const h = document.createElement('span');
        h.textContent = ['♥','❤','💕'][Math.floor(Math.random()*3)];
        h.style.cssText = `
          position:absolute;
          left:${Math.random()*90}%;
          bottom:0;
          font-size:${0.6+Math.random()}rem;
          color:rgba(${Math.random()>0.5?'232,160,160':'212,168,83'},0.5);
          animation:heartFloat ${2+Math.random()*2}s ease-out forwards;
          pointer-events:none;
        `;
        heartsEl.appendChild(h);
        setTimeout(()=>h.remove(), 4000);
      }
      setInterval(dropHeart, 400);
    }

    // Park: fireflies
    const parkEl = document.getElementById('scene-park');
    if (parkEl) {
      const div = document.createElement('div');
      div.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;';
      parkEl.insertBefore(div, parkEl.firstChild);
      ParticleSystems.spawnFireflies(div, 18);
    }

    // Proposal: stars
    const starsEl = document.getElementById('stars-bg');
    if (starsEl) {
      ParticleSystems.spawnStars(starsEl, 150);
    }
  }

  /* ── PUBLIC ───────────────────────────────────────────────── */
  return { init };

})();
