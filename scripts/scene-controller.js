/* =============================================================
   scene-controller.js — Three.js 3D background world
   Creates depth-layered cinematic 3D environments per scene
   ============================================================= */

window.SceneController = (function () {

  let renderer, camera, scene;
  let currentSceneId = 'intro';
  let clock;
  let particleMeshes = [];
  let animFrameId;

  const SCENES = {};

  /* ── INIT ─────────────────────────────────────────────────── */
  function init() {
    const canvas = document.getElementById('world-canvas');
    if (!canvas || !window.THREE) return;

    clock = new THREE.Clock();

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Build all scene particle systems
    buildIntroScene();
    buildFlowerScene();
    buildNightScene();
    buildProposalScene();
    buildFinaleScene();

    // Show intro by default
    activateScene('intro');

    // Start loop
    animate();

    // Resize handler
    window.addEventListener('resize', onResize);
  }

  /* ── ANIMATE LOOP ─────────────────────────────────────────── */
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Animate all particle meshes in active scene
    particleMeshes.forEach(({ mesh, data }) => {
      if (!mesh.visible) return;
      if (data.type === 'stars') {
        mesh.rotation.y = t * 0.005;
        mesh.rotation.x = Math.sin(t * 0.003) * 0.05;
      }
      if (data.type === 'particles') {
        const positions = mesh.geometry.attributes.position.array;
        for (let i = 0; i < data.velocities.length; i++) {
          positions[i * 3]     += data.velocities[i].x;
          positions[i * 3 + 1] += data.velocities[i].y;
          positions[i * 3 + 2] += data.velocities[i].z;

          // Wrap Y
          if (positions[i * 3 + 1] > 12) positions[i * 3 + 1] = -12;
          if (positions[i * 3 + 1] < -12) positions[i * 3 + 1] = 12;
          // Wrap X
          if (positions[i * 3] > 16) positions[i * 3] = -16;
          if (positions[i * 3] < -16) positions[i * 3] = 16;
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      }
      if (data.type === 'lanterns') {
        const positions = mesh.geometry.attributes.position.array;
        for (let i = 0; i < data.velocities.length; i++) {
          positions[i * 3]     += Math.sin(t * 0.3 + i) * 0.003;
          positions[i * 3 + 1] += data.velocities[i].y;
          if (positions[i * 3 + 1] > 16) {
            positions[i * 3 + 1] = -8;
            positions[i * 3]     = (Math.random() - 0.5) * 18;
          }
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        // Pulse opacity
        mesh.material.opacity = 0.6 + Math.sin(t * 2) * 0.2;
      }
    });

    // Gentle camera sway on intro
    if (currentSceneId === 'intro') {
      camera.position.x = Math.sin(t * 0.2) * 0.3;
      camera.position.y = Math.cos(t * 0.15) * 0.2;
    } else {
      camera.position.x += (0 - camera.position.x) * 0.02;
      camera.position.y += (0 - camera.position.y) * 0.02;
    }

    renderer.render(scene, camera);
  }

  /* ── SCENE BUILDERS ───────────────────────────────────────── */

  function buildIntroScene() {
    // Floating gold sparkle particles
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: 0.004 + Math.random() * 0.008,
        z: 0,
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffd080,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    SCENES.intro = [mesh];
    particleMeshes.push({ mesh, data: { type: 'particles', velocities } });
  }

  function buildFlowerScene() {
    // Petal particles rising
    const count = 200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = -2 + Math.random() * -3;
      velocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: 0.003 + Math.random() * 0.006,
        z: 0,
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffaabb,
      size: 0.1,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    SCENES.flowers = [mesh];
    particleMeshes.push({ mesh, data: { type: 'particles', velocities } });
  }

  function buildNightScene() {
    // Star field
    const count = 800;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = -5 - Math.random() * 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starMesh = new THREE.Points(geo, mat);
    scene.add(starMesh);
    SCENES.met = [starMesh];
    particleMeshes.push({ mesh: starMesh, data: { type: 'stars' } });
  }

  function buildProposalScene() {
    // Floating lanterns
    const count = 40;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -3 - Math.random() * 4;
      velocities.push({ y: 0.003 + Math.random() * 0.005 });
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffcc44,
      size: 0.18,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    SCENES.proposal = [mesh];
    particleMeshes.push({ mesh, data: { type: 'lanterns', velocities } });
  }

  function buildFinaleScene() {
    // Mix of colored particles bursting
    const count = 500;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const colors = new Float32Array(count * 3);
    const palette = [
      [0.83, 0.66, 0.32], // gold
      [0.91, 0.63, 0.63], // rose
      [0.79, 0.72, 0.85], // lavender
      [0.54, 0.67, 0.54], // sage
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = -3 + Math.random() * -4;
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: 0.005 + Math.random() * 0.012,
        z: 0,
      });
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    SCENES.finale = [mesh];
    particleMeshes.push({ mesh, data: { type: 'particles', velocities } });
  }

  /* ── SCENE SWITCHING ──────────────────────────────────────── */
  function activateScene(sceneId) {
    // Hide all
    Object.keys(SCENES).forEach(key => {
      (SCENES[key] || []).forEach(mesh => { mesh.visible = false; });
    });

    // Show requested
    currentSceneId = sceneId;
    const meshes = SCENES[sceneId] || [];
    meshes.forEach(mesh => { mesh.visible = true; });

    // Adjust camera Z per scene for depth feel
    const cameraZ = { intro: 8, flowers: 7, met: 9, proposal: 8, finale: 7 };
    if (camera) {
      gsap.to(camera.position, {
        z: cameraZ[sceneId] || 8,
        duration: 1.8,
        ease: 'power2.inOut',
      });
    }
  }

  /* ── RESIZE ───────────────────────────────────────────────── */
  function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /* ── PUBLIC ───────────────────────────────────────────────── */
  return { init, activateScene };

})();
