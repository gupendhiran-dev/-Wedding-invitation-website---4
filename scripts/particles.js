/* =============================================================
   particles.js — Particle system factory for Pixar Wedding
   ============================================================= */

window.ParticleSystems = (function () {

  /* ── PETALS ─────────────────────────────────────────────── */
  function spawnPetals(container, count = 18, colors = ['#e8a0a0', '#f2c4c4', '#fdddc4', '#d4a0d4']) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'petal';
      const size = 8 + Math.random() * 12;
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -20px;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
        animation: petalFall ${5 + Math.random() * 8}s linear ${Math.random() * 10}s infinite;
        opacity: ${0.5 + Math.random() * 0.5};
        transform-origin: center;
      `;
      container.appendChild(el);
    }
  }

  /* ── FIREFLIES ────────────────────────────────────────────── */
  function spawnFireflies(container, count = 20) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'firefly';
      const dur = 4 + Math.random() * 6;
      const glowDur = 1.5 + Math.random() * 2;
      el.style.cssText = `
        left: ${Math.random() * 90}%;
        top: ${Math.random() * 90}%;
        animation:
          fireflyFloat ${dur}s ease-in-out ${Math.random() * 5}s infinite,
          fireflyGlow  ${glowDur}s ease-in-out ${Math.random() * 2}s infinite;
        width: ${4 + Math.random() * 4}px;
        height: ${4 + Math.random() * 4}px;
      `;
      container.appendChild(el);
    }
  }

  /* ── STARS ────────────────────────────────────────────────── */
  function spawnStars(container, count = 120) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'star';
      const size = 1 + Math.random() * 3;
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation: twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 4}s infinite;
        opacity: ${0.3 + Math.random() * 0.7};
      `;
      container.appendChild(el);
    }
  }

  /* ── FLOATING HEARTS ──────────────────────────────────────── */
  function spawnHearts(container, count = 30) {
    const emojis = ['♥', '❤', '💕', '💗', '💖'];
    for (let i = 0; i < count; i++) {
      (function (delay) {
        setTimeout(() => {
          const el = document.createElement('span');
          el.className = 'heart-particle';
          el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          el.style.cssText = `
            left: ${10 + Math.random() * 80}%;
            bottom: ${10 + Math.random() * 40}%;
            font-size: ${0.8 + Math.random() * 1.5}rem;
            color: ${Math.random() > 0.5 ? '#e8a0a0' : '#d4a853'};
            animation: heartFloat ${1.5 + Math.random() * 1.5}s ease-out forwards;
          `;
          container.appendChild(el);
          setTimeout(() => el.remove(), 3000);
        }, delay);
      })(i * 120);
    }
  }

  /* ── LANTERNS ─────────────────────────────────────────────── */
  function spawnLanterns(container, count = 15) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'lantern';
      const dur = 8 + Math.random() * 10;
      el.style.cssText = `
        left: ${5 + Math.random() * 90}%;
        bottom: -50px;
        animation: lanternRise ${dur}s ease-in ${Math.random() * 8}s infinite;
        background: rgba(${220 + Math.random() * 35}, ${160 + Math.random() * 60}, ${30 + Math.random() * 40}, 0.9);
        width: ${18 + Math.random() * 12}px;
        height: ${26 + Math.random() * 12}px;
      `;
      container.appendChild(el);
    }
  }

  /* ── FIREWORKS ────────────────────────────────────────────── */
  function launchFireworks(container, ongoing = false) {
    const colors = ['#d4a853', '#e8a0a0', '#f2d49b', '#c9b8d8', '#8aab8a', '#ffffff'];

    function burst() {
      const cx = 15 + Math.random() * 70;
      const cy = 10 + Math.random() * 60;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const sparkCount = 16 + Math.floor(Math.random() * 16);

      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2;
        const dist = 50 + Math.random() * 80;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        const spark = document.createElement('div');
        spark.style.cssText = `
          position: absolute;
          left: ${cx}%;
          top: ${cy}%;
          width: ${2 + Math.random() * 3}px;
          height: ${2 + Math.random() * 3}px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 6px 2px ${color};
          animation: fireworkSpark ${0.8 + Math.random() * 0.6}s ease-out forwards;
          --tx: ${tx}px;
          --ty: ${ty}px;
          pointer-events: none;
        `;
        container.appendChild(spark);
        setTimeout(() => spark.remove(), 1600);
      }

      // central flash
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: absolute;
        left: calc(${cx}% - 4px);
        top: calc(${cy}% - 4px);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 0 20px 10px white;
        animation: fireworkBurst 0.5s ease-out forwards;
        pointer-events: none;
      `;
      container.appendChild(flash);
      setTimeout(() => flash.remove(), 600);
    }

    // Initial salvo
    const delays = [0, 300, 700, 1100, 1600, 2200];
    delays.forEach(d => setTimeout(burst, d));

    if (ongoing) {
      // Keep firing
      const iv = setInterval(burst, 1200);
      // Store so caller can stop
      container._fireworkInterval = iv;
    }
  }

  /* ── SPARKLE BURST on element ─────────────────────────────── */
  function sparkleBurst(el, count = 12) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      const angle = (i / count) * Math.PI * 2;
      const dist = 30 + Math.random() * 50;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      spark.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        width: ${3 + Math.random() * 4}px;
        height: ${3 + Math.random() * 4}px;
        border-radius: 50%;
        background: ${Math.random() > 0.5 ? '#d4a853' : '#e8a0a0'};
        box-shadow: 0 0 6px 2px currentColor;
        animation: fireworkSpark 0.9s ease-out forwards;
        --tx: ${tx}px;
        --ty: ${ty}px;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 1000);
    }
  }

  /* ── CLOUDS ───────────────────────────────────────────────── */
  function spawnClouds(container, count = 6) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'cloud';
      const w = 100 + Math.random() * 200;
      const h = 30 + Math.random() * 40;
      el.style.cssText = `
        left: -${w}px;
        top: ${10 + Math.random() * 60}%;
        width: ${w}px;
        height: ${h}px;
        animation: cloudDrift ${20 + Math.random() * 30}s linear ${Math.random() * 20}s infinite;
        opacity: ${0.2 + Math.random() * 0.3};
      `;
      container.appendChild(el);
    }
  }

  /* ── BIRDS (SVG inline) ───────────────────────────────────── */
  function spawnBirds(container, count = 5) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        left: -60px;
        top: ${5 + Math.random() * 40}%;
        animation: birdGlide ${14 + Math.random() * 10}s linear ${i * 2.5}s infinite;
        pointer-events: none;
        z-index: 1;
      `;
      el.innerHTML = `
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8 Q8 0 0 4" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M16 8 Q24 0 32 4" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>
      `;
      const svg = el.querySelector('svg');
      // Wing flap via JS
      let t = Math.random() * Math.PI * 2;
      setInterval(() => {
        t += 0.18;
        const y1 = Math.sin(t) * 6;
        const y2 = Math.sin(t + Math.PI) * 6;
        svg.innerHTML = `
          <path d="M16 8 Q8 ${y1} 0 ${y1 + 3}" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M16 8 Q24 ${y2} 32 ${y2 + 3}" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        `;
      }, 60);
      container.appendChild(el);
    }
  }

  /* ── BUTTERFLIES ──────────────────────────────────────────── */
  function spawnButterflies(container, count = 6) {
    const colors = ['#e8a0a0', '#d4a853', '#c9b8d8', '#8aab8a'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const color = colors[i % colors.length];
      el.style.cssText = `
        position: absolute;
        left: ${10 + Math.random() * 70}%;
        top: ${20 + Math.random() * 50}%;
        animation: butterflyFly ${6 + Math.random() * 5}s ease-in-out ${Math.random() * 4}s infinite;
        pointer-events: none;
        z-index: 1;
      `;
      el.innerHTML = `
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
          <ellipse cx="7" cy="10" rx="7" ry="5" fill="${color}" opacity="0.8"/>
          <ellipse cx="21" cy="10" rx="7" ry="5" fill="${color}" opacity="0.8"/>
          <line x1="14" y1="4" x2="14" y2="16" stroke="#6b4c2a" stroke-width="1" opacity="0.5"/>
        </svg>
      `;
      // Wing beat
      let t2 = Math.random() * Math.PI * 2;
      const svgEl = el.querySelector('svg');
      setInterval(() => {
        t2 += 0.22;
        const rx = Math.abs(Math.sin(t2)) * 7;
        svgEl.innerHTML = `
          <ellipse cx="7" cy="10" rx="${rx}" ry="5" fill="${color}" opacity="0.8"/>
          <ellipse cx="21" cy="10" rx="${rx}" ry="5" fill="${color}" opacity="0.8"/>
          <line x1="14" y1="4" x2="14" y2="16" stroke="#6b4c2a" stroke-width="1" opacity="0.5"/>
        `;
      }, 60);
      container.appendChild(el);
    }
  }

  /* ── FLOWERS (swaying) ────────────────────────────────────── */
  function spawnFlowers(container, count = 12) {
    const types = ['🌸', '🌺', '🌼', '🌻', '🌹'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${(i / count) * 100 + Math.random() * 6}%;
        font-size: ${1.5 + Math.random() * 1.5}rem;
        transform-origin: bottom center;
        animation: sway ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite;
        pointer-events: none;
        z-index: 1;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
      `;
      el.textContent = types[Math.floor(Math.random() * types.length)];
      container.appendChild(el);
    }
  }

  /* ── PUBLIC API ────────────────────────────────────────────── */
  return {
    spawnPetals,
    spawnFireflies,
    spawnStars,
    spawnHearts,
    spawnLanterns,
    launchFireworks,
    sparkleBurst,
    spawnClouds,
    spawnBirds,
    spawnButterflies,
    spawnFlowers,
  };

})();
