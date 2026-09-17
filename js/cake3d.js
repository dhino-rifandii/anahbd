/* =============================================
   CAKE3D.JS — Interactive 3D Birthday Cake & Candle Blow Out
   TikTok Viral Birthday Feature for Ana
   ============================================= */

const Cake3D = (() => {
  'use strict';

  let scene, camera, renderer, cakeGroup;
  let animId = null;
  let isBlownOut = false;
  let isMicActive = false;
  let micStream = null;
  let audioContext = null;
  let analyser = null;
  let flamePointLight = null;
  let flameMesh = null;
  let flameGlow = null;
  let smokeParticles = [];
  let cakeContainer = null;
  let cakeCanvas = null;

  let mouseX = 0, mouseY = 0;
  let targetRotY = 0, currentRotY = 0;
  let isDragging = false, prevMouseX = 0;

  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ---- Initialize Three.js Cake Scene ---- */
  function init() {
    cakeContainer = document.getElementById('cake-container');
    cakeCanvas = document.getElementById('cake-canvas');
    if (!cakeContainer || !cakeCanvas) return;

    const width = cakeContainer.clientWidth || 360;
    const height = cakeContainer.clientHeight || 420;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0.6, 0);

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: cakeCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const softPinkLight = new THREE.PointLight(0xffb6c1, 0.8, 10);
    softPinkLight.position.set(-4, 3, 2);
    scene.add(softPinkLight);

    // 4. Build 3D Cake Mesh
    buildCake();

    // 5. Setup Events & Interactions
    setupInteractions();
    setupButtons();

    // 6. Start Render Loop
    render();
  }

  /* ---- Build Elegant 3D Birthday Cake ---- */
  function buildCake() {
    cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -0.4, 0);

    // --- A. Golden / Glass Cake Stand Pedestal ---
    const plateGeom = new THREE.CylinderGeometry(2.4, 2.4, 0.12, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xffeef4,
      emissiveIntensity: 0.15
    });
    const plate = new THREE.Mesh(plateGeom, plateMat);
    plate.position.y = -0.5;
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    const standBaseGeom = new THREE.CylinderGeometry(1.2, 1.5, 0.25, 32);
    const standBase = new THREE.Mesh(standBaseGeom, plateMat);
    standBase.position.y = -0.7;
    cakeGroup.add(standBase);

    // --- B. Tier 1 (Bottom Cake Layer - Velvet Pink) ---
    const tier1Geom = new THREE.CylinderGeometry(2.0, 2.0, 1.1, 48);
    const cakeSpongeMat = new THREE.MeshStandardMaterial({
      color: 0xffcad4,
      roughness: 0.45,
      metalness: 0.05
    });
    const tier1 = new THREE.Mesh(tier1Geom, cakeSpongeMat);
    tier1.position.y = 0.1;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Bottom Frosting Piping Ring (Cream Pearls)
    addCreamPearls(cakeGroup, 2.0, -0.4, 28, 0.12, 0xffffff);
    // Tier 1 Top Frosting Dripping Border
    addCreamPearls(cakeGroup, 1.95, 0.65, 26, 0.11, 0xfff0f5);

    // --- C. Tier 2 (Top Cake Layer - Strawberry White Cream) ---
    const tier2Geom = new THREE.CylinderGeometry(1.4, 1.4, 0.95, 48);
    const cakeTopMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f3,
      roughness: 0.35,
      metalness: 0.05
    });
    const tier2 = new THREE.Mesh(tier2Geom, cakeTopMat);
    tier2.position.y = 1.1;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Tier 2 Top Cream Swirls
    addCreamPearls(cakeGroup, 1.35, 1.58, 20, 0.1, 0xff8fab);

    // --- D. Strawberries & Toppings on Top Tier ---
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const r = 0.95;
      const sx = Math.cos(angle) * r;
      const sz = Math.sin(angle) * r;
      addStrawberry(cakeGroup, sx, 1.62, sz);
    }

    // --- E. Birthday Candle ---
    const candleGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 24);
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xff9ebb,
      roughness: 0.3,
      metalness: 0.1
    });
    const candle = new THREE.Mesh(candleGeom, candleMat);
    candle.position.set(0, 2.05, 0);
    candle.castShadow = true;
    cakeGroup.add(candle);

    // Candle Spiral Gold Ribbon Pattern
    const spiralGeom = new THREE.TorusGeometry(0.085, 0.015, 8, 24);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    for (let s = 0; s < 3; s++) {
      const ring = new THREE.Mesh(spiralGeom, goldMat);
      ring.rotation.x = Math.PI / 2 + 0.2;
      ring.position.set(0, 1.75 + s * 0.25, 0);
      cakeGroup.add(ring);
    }

    // Candle Wick
    const wickGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const wick = new THREE.Mesh(wickGeom, wickMat);
    wick.position.set(0, 2.55, 0);
    cakeGroup.add(wick);

    // --- F. Glowing 3D Flame ---
    const flameGeom = new THREE.ConeGeometry(0.08, 0.28, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.95
    });
    flameMesh = new THREE.Mesh(flameGeom, flameMat);
    flameMesh.position.set(0, 2.75, 0);
    cakeGroup.add(flameMesh);

    // Inner Blue Flame Core
    const innerFlameGeom = new THREE.ConeGeometry(0.04, 0.14, 12);
    const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0x66ccff });
    const innerFlame = new THREE.Mesh(innerFlameGeom, innerFlameMat);
    innerFlame.position.set(0, 2.68, 0);
    cakeGroup.add(innerFlame);

    // Flame Point Light
    flamePointLight = new THREE.PointLight(0xffa500, 2.2, 6, 2);
    flamePointLight.position.set(0, 2.8, 0);
    cakeGroup.add(flamePointLight);

    // Flame Glow Halo
    const glowGeom = new THREE.SphereGeometry(0.22, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    flameGlow = new THREE.Mesh(glowGeom, glowMat);
    flameGlow.position.set(0, 2.76, 0);
    cakeGroup.add(flameGlow);

    // --- G. Sparkle Particles Floating Around Cake ---
    const sparkleCount = 45;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const radius = 1.8 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      sparklePositions[i * 3] = Math.cos(angle) * radius;
      sparklePositions[i * 3 + 1] = Math.random() * 3.5 - 0.5;
      sparklePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xffd7e8,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
    sparkles.name = 'cakeSparkles';
    cakeGroup.add(sparkles);

    scene.add(cakeGroup);
  }

  /* ---- Helper: Add Cream Pearls on Cake Border ---- */
  function addCreamPearls(group, radius, y, count, size, colorHex) {
    const pearlGeom = new THREE.SphereGeometry(size, 12, 12);
    const pearlMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.25,
      metalness: 0.1
    });
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeom, pearlMat);
      pearl.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      group.add(pearl);
    }
  }

  /* ---- Helper: Add Cute Strawberry Topping ---- */
  function addStrawberry(group, x, y, z) {
    const strawberryGroup = new THREE.Group();
    const berryGeom = new THREE.ConeGeometry(0.14, 0.28, 12);
    const berryMat = new THREE.MeshStandardMaterial({
      color: 0xe60039,
      roughness: 0.3,
      metalness: 0.1
    });
    const berry = new THREE.Mesh(berryGeom, berryMat);
    berry.rotation.x = Math.PI;
    strawberryGroup.add(berry);

    // Leaves on strawberry top
    const leafGeom = new THREE.ConeGeometry(0.06, 0.08, 5);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.5 });
    for (let l = 0; l < 4; l++) {
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.rotation.z = (l * Math.PI) / 2 + 0.4;
      leaf.position.y = 0.12;
      strawberryGroup.add(leaf);
    }

    strawberryGroup.position.set(x, y, z);
    group.add(strawberryGroup);
  }

  /* ---- Mouse / Drag Controls for Cake Rotation ---- */
  function setupInteractions() {
    if (!cakeContainer) return;

    cakeContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        targetRotY += deltaX * 0.008;
        prevMouseX = e.clientX;
      }
    });

    // Touch support
    cakeContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        targetRotY += deltaX * 0.008;
        prevMouseX = e.touches[0].clientX;
      }
    }, { passive: true });
  }

  /* ---- Buttons & Microphone Logic ---- */
  function setupButtons() {
    const blowBtn = document.getElementById('cake-blow-btn');
    const micBtn = document.getElementById('cake-mic-btn');
    const relightBtn = document.getElementById('cake-relight-btn');

    if (blowBtn) {
      blowBtn.addEventListener('click', () => {
        blowCandle();
      });
    }

    if (micBtn) {
      micBtn.addEventListener('click', toggleMicDetection);
    }

    if (relightBtn) {
      relightBtn.addEventListener('click', relightCandle);
    }
  }

  /* ---- Blow Candle Action ---- */
  function blowCandle() {
    if (isBlownOut) return;
    isBlownOut = true;

    // 1. Hide flame & glow
    if (flameMesh) flameMesh.visible = false;
    if (flameGlow) flameGlow.visible = false;
    if (flamePointLight) {
      if (typeof gsap !== 'undefined') {
        gsap.to(flamePointLight, { intensity: 0, duration: 0.3 });
      } else {
        flamePointLight.intensity = 0;
      }
    }

    // 2. Spawn realistic smoke particles
    createSmokePuff();

    // 3. Play celebratory sound & effects
    if (window.Effects && Effects.confettiBurst) {
      Effects.confettiBurst();
    }
    if (window.Effects && Effects.triggerFireworks) {
      Effects.triggerFireworks();
    }

    // 4. Update UI Status & Message
    const statusEl = document.getElementById('cake-status');
    const wishCard = document.getElementById('cake-wish-reveal');
    const relightBtn = document.getElementById('cake-relight-btn');
    const blowBtn = document.getElementById('cake-blow-btn');

    if (statusEl) {
      statusEl.innerHTML = '✨ <strong>Lilin berhasil ditiup!</strong> Semoga semua harapan indah Ana terkabul! 💖🎉';
      statusEl.classList.add('is-celebrating');
    }

    if (wishCard) {
      wishCard.classList.add('is-visible');
    }

    if (relightBtn) relightBtn.style.display = 'inline-flex';
    if (blowBtn) blowBtn.style.display = 'none';

    // Stop mic if active
    if (isMicActive) stopMic();
  }

  /* ---- Relight Candle Action ---- */
  function relightCandle() {
    isBlownOut = false;
    if (flameMesh) flameMesh.visible = true;
    if (flameGlow) flameGlow.visible = true;
    if (flamePointLight) {
      flamePointLight.intensity = 2.2;
    }

    const statusEl = document.getElementById('cake-status');
    const wishCard = document.getElementById('cake-wish-reveal');
    const relightBtn = document.getElementById('cake-relight-btn');
    const blowBtn = document.getElementById('cake-blow-btn');

    if (statusEl) {
      statusEl.innerHTML = 'Tiup lilinnya dengan menekan tombol atau berbicara/meniup mikrofon! 🎂';
      statusEl.classList.remove('is-celebrating');
    }

    if (wishCard) wishCard.classList.remove('is-visible');
    if (relightBtn) relightBtn.style.display = 'none';
    if (blowBtn) blowBtn.style.display = 'inline-flex';
  }

  /* ---- Smoke Puff Particles ---- */
  function createSmokePuff() {
    const smokeCount = 20;
    const smokeGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < smokeCount; i++) {
      const p = new THREE.Mesh(smokeGeom, smokeMat.clone());
      p.position.set(0, 2.6, 0);
      p.userData = {
        vx: (Math.random() - 0.5) * 0.03,
        vy: 0.04 + Math.random() * 0.04,
        vz: (Math.random() - 0.5) * 0.03,
        growth: 0.008 + Math.random() * 0.005,
        life: 1.0
      };
      cakeGroup.add(p);
      smokeParticles.push(p);
    }
  }

  /* ---- Microphone Blow Detection ---- */
  async function toggleMicDetection() {
    const micBtn = document.getElementById('cake-mic-btn');
    if (isMicActive) {
      stopMic();
      if (micBtn) micBtn.innerHTML = '🎙️ Aktifkan Deteksi Tiupan Mic';
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStream = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      isMicActive = true;
      if (micBtn) {
        micBtn.innerHTML = '🛑 Matikan Mic (Sedang Mendengarkan...)';
        micBtn.classList.add('is-listening');
      }

      checkMicBlow();
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
      alert('Izin mikrofon tidak diaktifkan. Kamu tetap bisa meniup lilin dengan tombol "Tiup Lilin" 🎂');
    }
  }

  function checkMicBlow() {
    if (!isMicActive || isBlownOut || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    // Check low-to-mid frequencies where breath sound has strong turbulence
    for (let i = 0; i < 20; i++) {
      sum += dataArray[i];
    }
    const average = sum / 20;

    // Threshold for detecting strong breath blowing into mic
    if (average > 70) {
      blowCandle();
      return;
    }

    requestAnimationFrame(checkMicBlow);
  }

  function stopMic() {
    isMicActive = false;
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      audioContext = null;
    }
    const micBtn = document.getElementById('cake-mic-btn');
    if (micBtn) {
      micBtn.innerHTML = '🎙️ Aktifkan Deteksi Tiupan Mic';
      micBtn.classList.remove('is-listening');
    }
  }

  /* ---- Render Loop ---- */
  function render() {
    animId = requestAnimationFrame(render);

    const time = performance.now() * 0.001;

    // Smooth rotation
    currentRotY += (targetRotY - currentRotY) * 0.08;
    if (!isDragging) {
      targetRotY += 0.004; // Auto slow romantic rotation
    }

    if (cakeGroup) {
      cakeGroup.rotation.y = currentRotY;

      // Realistic Flame flickering
      if (flameMesh && !isBlownOut) {
        const flickerX = 1 + Math.sin(time * 20) * 0.08 + (Math.random() - 0.5) * 0.06;
        const flickerY = 1 + Math.cos(time * 25) * 0.12;
        flameMesh.scale.set(flickerX, flickerY, flickerX);
        flameMesh.rotation.z = Math.sin(time * 12) * 0.08;

        if (flamePointLight) {
          flamePointLight.intensity = 2.0 + Math.sin(time * 15) * 0.4;
        }
      }

      // Sparkles floating
      const sparkles = cakeGroup.getObjectByName('cakeSparkles');
      if (sparkles) {
        sparkles.rotation.y = time * 0.1;
      }

      // Update smoke particles
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz;
        p.scale.addScalar(p.userData.growth);
        p.userData.life -= 0.015;
        p.material.opacity = p.userData.life * 0.6;

        if (p.userData.life <= 0) {
          cakeGroup.remove(p);
          smokeParticles.splice(i, 1);
        }
      }
    }

    renderer.render(scene, camera);
  }

  function resize() {
    if (!cakeContainer || !renderer || !camera) return;
    const width = cakeContainer.clientWidth || 360;
    const height = cakeContainer.clientHeight || 420;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', resize);

  return {
    init,
    blowCandle,
    relightCandle,
    resize
  };
})();
