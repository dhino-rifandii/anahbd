/* =============================================
   FLOWER3D.JS — Lush Botanical 3D Blooming Rose/Tulip
   with Animated Fluttering 3D Butterflies & Orbiting Hearts
   Blooming Birthday for Ana
   ============================================= */

const Flower3D = (() => {
  'use strict';

  let scene, camera, renderer, flowerGroup, glowParticles, pollenParticles;
  let butterflies = [], orbitingHearts = [];
  let animId = null, isActive = false, bloomStarted = false;
  let targetRotX = 0.2, targetRotY = 0;
  let isDragging = false, prevMouseX = 0, prevMouseY = 0;
  let bloomElapsed = 0;
  let bloomReady = false;

  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color Themes
  const THEMES = {
    rose: {
      outer: 0xFF7A9E,
      mid: 0xFF9EBA,
      inner: 0xFFC6D7,
      core: 0xFFE0EB,
      center: 0xFFD700,
      glow: 0xFFC2D1,
      stem: 0x4E8A54,
      leaf: 0x68A86E,
      butterfly: 0xFF94B8
    },
    lavender: {
      outer: 0x9B6BFF,
      mid: 0xB894FF,
      inner: 0xD6BFFF,
      core: 0xF0E6FF,
      center: 0xFFE082,
      glow: 0xD4B8FF,
      stem: 0x487A50,
      leaf: 0x629B6A,
      butterfly: 0xC499FF
    },
    peach: {
      outer: 0xFF7E67,
      mid: 0xFFA085,
      inner: 0xFFCBB8,
      core: 0xFFECE2,
      center: 0xFFD54F,
      glow: 0xFFD2A6,
      stem: 0x588C52,
      leaf: 0x72A86A,
      butterfly: 0xFFAD94
    },
    sakura: {
      outer: 0xFF85A2,
      mid: 0xFFAEC0,
      inner: 0xFFD6E0,
      core: 0xFFF5F8,
      center: 0xFFE57F,
      glow: 0xFFB6C1,
      stem: 0x508E58,
      leaf: 0x6BA873,
      butterfly: 0xFFC4D6
    }
  };

  let currentThemeKey = 'rose';
  let activeColors = { ...THEMES.rose };

  /* ---- Create Lush Curved 3D Petal Geometry ---- */
  function createLushPetalGeometry(width, height, cupDepth, curlAmount, segmentsU = 16, segmentsV = 20) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let j = 0; j <= segmentsV; j++) {
      const v = j / segmentsV;
      const currentHeight = v * height;

      let profileWidth;
      if (v < 0.25) {
        profileWidth = (v / 0.25) * width * 0.75;
      } else if (v < 0.7) {
        profileWidth = width * (0.75 + 0.25 * Math.sin(((v - 0.25) / 0.45) * Math.PI));
      } else {
        const t = (v - 0.7) / 0.3;
        profileWidth = width * Math.cos(t * Math.PI * 0.5);
      }

      for (let i = 0; i <= segmentsU; i++) {
        const u = i / segmentsU;
        const uCentered = (u - 0.5) * 2;

        const x = uCentered * profileWidth * 0.5;
        const y = currentHeight;

        const cup = Math.sin(v * Math.PI * 0.85) * (1.0 - uCentered * uCentered) * cupDepth;
        const rimCurl = Math.pow(v, 2.2) * curlAmount * (1.0 + 0.3 * Math.sin(u * Math.PI));
        const z = cup - rimCurl;

        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    for (let j = 0; j < segmentsV; j++) {
      for (let i = 0; i < segmentsU; i++) {
        const a = j * (segmentsU + 1) + i;
        const b = (j + 1) * (segmentsU + 1) + i;
        const c = (j + 1) * (segmentsU + 1) + (i + 1);
        const d = j * (segmentsU + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /* ---- Create Detailed Botanical Leaf Geometry ---- */
  function createBotanicalLeafGeometry(width, height) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];
    const segmentsU = 10, segmentsV = 16;

    for (let j = 0; j <= segmentsV; j++) {
      const v = j / segmentsV;
      const y = v * height;
      const profile = Math.sin(v * Math.PI) * width;

      for (let i = 0; i <= segmentsU; i++) {
        const u = i / segmentsU;
        const uCentered = (u - 0.5) * 2;
        const x = uCentered * profile * 0.5;
        const z = -Math.abs(uCentered) * profile * 0.15 - Math.sin(v * Math.PI * 0.7) * 0.08;

        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    for (let j = 0; j < segmentsV; j++) {
      for (let i = 0; i < segmentsU; i++) {
        const a = j * (segmentsU + 1) + i;
        const b = (j + 1) * (segmentsU + 1) + i;
        const c = (j + 1) * (segmentsU + 1) + (i + 1);
        const d = j * (segmentsU + 1) + (i + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  /* ---- Build Botanical Flower Model ---- */
  function buildFlower() {
    flowerGroup = new THREE.Group();
    flowerGroup.userData = {
      petals: [],
      sepals: [],
      leaves: [],
      stamens: [],
      stem: null,
      glow: null,
      pollen: null
    };

    const colors = activeColors;

    // 1. Organic Curved Stem
    const curvePoints = [
      new THREE.Vector3(0, -2.4, 0),
      new THREE.Vector3(0.04, -1.8, 0.02),
      new THREE.Vector3(-0.03, -1.1, -0.01),
      new THREE.Vector3(0.02, -0.4, 0.02),
      new THREE.Vector3(0, 0.4, 0)
    ];
    const stemCurve = new THREE.CatmullRomCurve3(curvePoints);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.055, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: colors.stem,
      roughness: 0.55,
      metalness: 0.05
    });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.scale.set(1, 0, 1);
    flowerGroup.add(stem);
    flowerGroup.userData.stem = stem;

    // 2. Botanical Leaves
    const leafGeom = createBotanicalLeafGeometry(0.55, 1.1);
    const leafMat = new THREE.MeshStandardMaterial({
      color: colors.leaf,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const leaf1 = new THREE.Mesh(leafGeom, leafMat);
    leaf1.position.set(0.08, -0.8, 0.02);
    leaf1.rotation.set(0.3, 0.4, -0.9);
    leaf1.scale.set(0, 0, 0);
    flowerGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeom, leafMat);
    leaf2.position.set(-0.06, -1.3, -0.02);
    leaf2.rotation.set(-0.2, -0.6, 1.0);
    leaf2.scale.set(0, 0, 0);
    flowerGroup.add(leaf2);

    const leaf3 = new THREE.Mesh(leafGeom, leafMat);
    leaf3.position.set(0.05, -1.7, -0.04);
    leaf3.rotation.set(0.4, 1.8, -0.8);
    leaf3.scale.set(0, 0, 0);
    flowerGroup.add(leaf3);

    flowerGroup.userData.leaves = [leaf1, leaf2, leaf3];

    // 3. Sepals
    const sepalGeom = createLushPetalGeometry(0.2, 0.55, 0.06, 0.12, 8, 10);
    for (let i = 0; i < 5; i++) {
      const sepal = new THREE.Mesh(sepalGeom, leafMat);
      const angle = (i / 5) * Math.PI * 2;
      sepal.position.set(0, 0.38, 0);
      sepal.rotation.y = angle;
      sepal.rotation.x = Math.PI * 0.45;
      sepal.userData = {
        targetRotX: Math.PI * 0.85,
        angle: angle
      };
      sepal.scale.set(0, 0, 0);
      flowerGroup.add(sepal);
      flowerGroup.userData.sepals.push(sepal);
    }

    // 4. Multi-Layer Lush Rose Petals (36 Petals)
    const petalLayers = [
      { count: 6, width: 0.32, height: 0.6, cup: 0.22, curl: 0.04, color: colors.core, emissive: colors.inner, radius: 0.04, y: 0.45, startRotX: 0.08, targetRotX: 0.22, layerIdx: 0 },
      { count: 8, width: 0.46, height: 0.8, cup: 0.26, curl: 0.08, color: colors.inner, emissive: colors.mid, radius: 0.08, y: 0.44, startRotX: 0.12, targetRotX: 0.42, layerIdx: 1 },
      { count: 10, width: 0.62, height: 1.0, cup: 0.32, curl: 0.18, color: colors.mid, emissive: colors.outer, radius: 0.12, y: 0.43, startRotX: 0.18, targetRotX: 0.72, layerIdx: 2 },
      { count: 12, width: 0.78, height: 1.15, cup: 0.36, curl: 0.32, color: colors.outer, emissive: colors.outer, radius: 0.16, y: 0.42, startRotX: 0.24, targetRotX: 1.15, layerIdx: 3 }
    ];

    petalLayers.forEach(layer => {
      const geom = createLushPetalGeometry(layer.width, layer.height, layer.cup, layer.curl);

      for (let i = 0; i < layer.count; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: layer.color,
          roughness: 0.42,
          metalness: 0.03,
          emissive: layer.emissive,
          emissiveIntensity: 0.08,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.96
        });

        const petal = new THREE.Mesh(geom, mat);
        const angle = (i / layer.count) * Math.PI * 2 + (layer.layerIdx * 0.35);

        petal.position.set(
          Math.cos(angle) * layer.radius,
          layer.y,
          Math.sin(angle) * layer.radius
        );

        petal.rotation.y = angle;
        petal.rotation.x = layer.startRotX;

        petal.userData = {
          layerIdx: layer.layerIdx,
          startRotX: layer.startRotX,
          targetRotX: layer.targetRotX + (Math.random() - 0.5) * 0.08,
          angle: angle
        };

        petal.scale.set(0, 0, 0);
        flowerGroup.add(petal);
        flowerGroup.userData.petals.push(petal);
      }
    });

    // 5. Golden Center Stamen & Pistils
    const centerCoreGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const centerCoreMat = new THREE.MeshStandardMaterial({
      color: colors.center,
      emissive: colors.center,
      emissiveIntensity: 0.35,
      roughness: 0.3
    });
    const centerCore = new THREE.Mesh(centerCoreGeom, centerCoreMat);
    centerCore.position.set(0, 0.46, 0);
    centerCore.scale.set(0, 0, 0);
    flowerGroup.add(centerCore);
    flowerGroup.userData.centerCore = centerCore;

    const filamentGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6);
    const antherGeom = new THREE.SphereGeometry(0.022, 8, 8);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFE082,
      emissive: 0xFFD54F,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });

    for (let i = 0; i < 18; i++) {
      const stamenGrp = new THREE.Group();
      const filament = new THREE.Mesh(filamentGeom, goldMat);
      filament.position.y = 0.08;
      const anther = new THREE.Mesh(antherGeom, goldMat);
      anther.position.y = 0.16;

      stamenGrp.add(filament);
      stamenGrp.add(anther);

      const angle = (i / 18) * Math.PI * 2;
      const rad = 0.06 + Math.random() * 0.04;
      stamenGrp.position.set(Math.cos(angle) * rad, 0.46, Math.sin(angle) * rad);
      stamenGrp.rotation.z = (Math.random() * 0.3 + 0.1) * (i % 2 === 0 ? 1 : -1);
      stamenGrp.rotation.y = angle;
      stamenGrp.scale.set(0, 0, 0);

      flowerGroup.add(stamenGrp);
      flowerGroup.userData.stamens.push(stamenGrp);
    }

    // 6. Sparkling Golden Pollen Halo
    const pollenCount = isMobile ? 35 : 70;
    const pollenGeom = new THREE.BufferGeometry();
    const pollenPos = new Float32Array(pollenCount * 3);
    for (let i = 0; i < pollenCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.4 + 0.05;
      pollenPos[i * 3] = Math.cos(a) * r;
      pollenPos[i * 3 + 1] = 0.5 + Math.random() * 0.6;
      pollenPos[i * 3 + 2] = Math.sin(a) * r;
    }
    pollenGeom.setAttribute('position', new THREE.BufferAttribute(pollenPos, 3));
    const pollenMat = new THREE.PointsMaterial({
      color: 0xFFF099,
      size: 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    pollenParticles = new THREE.Points(pollenGeom, pollenMat);
    flowerGroup.add(pollenParticles);
    flowerGroup.userData.pollen = pollenParticles;

    // 7. Ambient Floating Fairy Dust
    const dustCount = isMobile ? 50 : 110;
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 2.4 + 0.5;
      dustPos[i * 3] = Math.cos(a) * r;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      dustPos[i * 3 + 2] = Math.sin(a) * r;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: colors.glow,
      size: 0.045,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    glowParticles = new THREE.Points(dustGeom, dustMat);
    flowerGroup.add(glowParticles);
    flowerGroup.userData.glow = glowParticles;

    // 8. Add Animated 3D Butterflies Fluttering Around Flower
    buildAnimatedButterflies(flowerGroup);

    // 9. Add Orbiting 3D Floating Hearts
    buildOrbitingHearts(flowerGroup);

    flowerGroup.position.y = -0.3;
    scene.add(flowerGroup);
  }

  /* ---- Build 3D Animated Fluttering Butterflies ---- */
  function buildAnimatedButterflies(parent) {
    butterflies = [];
    const butterflyCount = 3;

    for (let b = 0; b < butterflyCount; b++) {
      const butterflyGrp = new THREE.Group();

      // Wing Shape
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.bezierCurveTo(0.1, 0.15, 0.35, 0.25, 0.38, 0.05);
      wingShape.bezierCurveTo(0.4, -0.1, 0.2, -0.15, 0.15, -0.22);
      wingShape.bezierCurveTo(0.1, -0.28, 0, -0.18, 0, 0);

      const wingGeom = new THREE.ShapeGeometry(wingShape);
      const wingMat = new THREE.MeshStandardMaterial({
        color: activeColors.butterfly || 0xFF94B8,
        emissive: 0xFFB6C1,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });

      // Left Wing
      const leftWing = new THREE.Mesh(wingGeom, wingMat);
      leftWing.scale.set(0.65, 0.65, 0.65);
      butterflyGrp.add(leftWing);

      // Right Wing
      const rightWing = new THREE.Mesh(wingGeom, wingMat);
      rightWing.scale.set(-0.65, 0.65, 0.65);
      butterflyGrp.add(rightWing);

      // Body
      const bodyGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      body.rotation.x = Math.PI / 2;
      butterflyGrp.add(body);

      butterflyGrp.userData = {
        leftWing,
        rightWing,
        orbitRadius: 1.2 + b * 0.45,
        speed: 0.8 + b * 0.3,
        yOffset: 0.3 + b * 0.4,
        phase: b * (Math.PI * 2 / butterflyCount)
      };

      parent.add(butterflyGrp);
      butterflies.push(butterflyGrp);
    }
  }

  /* ---- Build 3D Orbiting Glowing Hearts ---- */
  function buildOrbitingHearts(parent) {
    orbitingHearts = [];
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.1, y + 0.1);
    heartShape.bezierCurveTo(x + 0.1, y + 0.1, x + 0.08, y + 0.18, x, y + 0.18);
    heartShape.bezierCurveTo(x - 0.12, y + 0.18, x - 0.12, y + 0.06, x - 0.12, y + 0.06);
    heartShape.bezierCurveTo(x - 0.12, y - 0.04, x - 0.02, y - 0.14, x + 0.1, y - 0.22);
    heartShape.bezierCurveTo(x + 0.22, y - 0.14, x + 0.32, y - 0.04, x + 0.32, y + 0.06);
    heartShape.bezierCurveTo(x + 0.32, y + 0.06, x + 0.32, y + 0.18, x + 0.2, y + 0.18);
    heartShape.bezierCurveTo(x + 0.14, y + 0.18, x + 0.1, y + 0.1, x + 0.1, y + 0.1);

    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 };
    const heartGeom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeom.center();

    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xff6b8b,
      emissive: 0xff8fab,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.1
    });

    for (let h = 0; h < 5; h++) {
      const heart = new THREE.Mesh(heartGeom, heartMat);
      heart.scale.set(0.45, 0.45, 0.45);
      heart.userData = {
        radius: 1.4 + (h % 2) * 0.4,
        speed: 0.5 + h * 0.15,
        heightOffset: 0.2 + (h - 2) * 0.35,
        phase: (h / 5) * Math.PI * 2
      };
      parent.add(heart);
      orbitingHearts.push(heart);
    }
  }

  /* ---- Cinematic Lighting Setup ---- */
  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xFFF0F5, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(activeColors.glow, 0.7);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(activeColors.core, 1.2, 4);
    pointLight.position.set(0, 0.7, 0.2);
    scene.add(pointLight);
  }

  /* ---- Bloom Timeline Animation Update ---- */
  function updateBloom(dt) {
    if (!flowerGroup || !bloomStarted) return;

    bloomElapsed += dt;
    const t = bloomElapsed;
    const data = flowerGroup.userData;

    // Phase 1: Stem & Leaves Growth
    if (t <= 2.0) {
      const p = Math.min(t / 1.8, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (data.stem) data.stem.scale.set(1, ease, 1);

      data.leaves.forEach((leaf, i) => {
        const leafDelay = 0.5 + i * 0.3;
        if (t >= leafDelay) {
          const lp = Math.min((t - leafDelay) / 0.8, 1);
          const lease = 1 - Math.pow(1 - lp, 3);
          leaf.scale.set(lease, lease, lease);
        }
      });
    }

    // Phase 2: Calyx / Sepals Unfold
    if (t >= 1.0 && t <= 3.2) {
      const sp = Math.min((t - 1.0) / 1.6, 1);
      const sease = 1 - Math.pow(1 - sp, 3);
      data.sepals.forEach(sepal => {
        sepal.scale.set(sease, sease, sease);
        sepal.rotation.x = THREE.MathUtils.lerp(Math.PI * 0.45, sepal.userData.targetRotX, sease);
      });
    }

    // Phase 3: Petal Whorls Progressive Bloom
    if (t >= 1.5) {
      data.petals.forEach(petal => {
        const layerIdx = petal.userData.layerIdx;
        const layerDelay = 1.6 + (3 - layerIdx) * 0.55;
        if (t >= layerDelay) {
          const pp = Math.min((t - layerDelay) / 2.0, 1);
          const pease = 1 - Math.pow(1 - pp, 3);

          petal.scale.set(pease, pease, pease);
          petal.rotation.x = THREE.MathUtils.lerp(
            petal.userData.startRotX,
            petal.userData.targetRotX,
            pease
          );
        }
      });
    }

    // Phase 4: Center Stamen & Golden Core
    if (t >= 3.0) {
      const cp = Math.min((t - 3.0) / 1.5, 1);
      const cease = 1 - Math.pow(1 - cp, 3);
      if (data.centerCore) data.centerCore.scale.set(cease, cease, cease);

      data.stamens.forEach((stamen, i) => {
        const sDelay = 3.2 + (i % 6) * 0.1;
        if (t >= sDelay) {
          const sp = Math.min((t - sDelay) / 1.0, 1);
          const sease = 1 - Math.pow(1 - sp, 3);
          stamen.scale.set(sease, sease, sease);
        }
      });
    }

    // Phase 5: Magical Glow & Pollen particles
    if (t >= 3.8) {
      const gp = Math.min((t - 3.8) / 2.0, 1);
      if (glowParticles) glowParticles.material.opacity = gp * 0.65;
      if (pollenParticles) pollenParticles.material.opacity = gp * 0.85;
    }
  }

  /* ---- Render Loop ---- */
  function render() {
    if (!isActive) return;

    const dt = 0.016;
    updateBloom(dt);

    if (flowerGroup) {
      flowerGroup.rotation.y += (targetRotY - flowerGroup.rotation.y) * 0.06;
      flowerGroup.rotation.x += (targetRotX - flowerGroup.rotation.x) * 0.06;

      const time = performance.now() * 0.001;
      flowerGroup.position.y = -0.3 + Math.sin(time * 1.5) * 0.05;
      flowerGroup.rotation.z = Math.sin(time * 1.1) * 0.03;

      // Animate Butterflies (Flapping wings & flying orbit)
      butterflies.forEach(b => {
        const d = b.userData;
        const currentAngle = time * d.speed + d.phase;
        b.position.x = Math.cos(currentAngle) * d.orbitRadius;
        b.position.z = Math.sin(currentAngle) * d.orbitRadius;
        b.position.y = d.yOffset + Math.sin(time * 3 + d.phase) * 0.25;

        // Face forward tangent
        b.rotation.y = -currentAngle + Math.PI / 2;
        b.rotation.x = Math.sin(time * 2) * 0.2;

        // Rapid wing flap
        const flap = Math.sin(time * 24 + d.phase) * 0.8;
        if (d.leftWing) d.leftWing.rotation.y = flap;
        if (d.rightWing) d.rightWing.rotation.y = -flap;
      });

      // Animate Orbiting Hearts
      orbitingHearts.forEach(h => {
        const d = h.userData;
        const angle = time * d.speed + d.phase;
        h.position.x = Math.cos(angle) * d.radius;
        h.position.z = Math.sin(angle) * d.radius;
        h.position.y = d.heightOffset + Math.sin(time * 2 + d.phase) * 0.15;
        h.rotation.y = angle + Math.PI / 2;
        h.rotation.z = Math.sin(time * 2) * 0.2;
      });

      // Animate fairy dust particles
      if (glowParticles && glowParticles.geometry) {
        const pos = glowParticles.geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i + 1] += 0.003;
          if (pos[i + 1] > 2.0) pos[i + 1] = -1.8;
        }
        glowParticles.geometry.attributes.position.needsUpdate = true;
        glowParticles.rotation.y += 0.002;
      }

      // Animate golden pollen halo
      if (pollenParticles && pollenParticles.geometry) {
        pollenParticles.rotation.y += 0.008;
      }
    }

    renderer.render(scene, camera);
    animId = requestAnimationFrame(render);
  }

  /* ---- Replay Bloom Animation ---- */
  function replayBloom() {
    bloomElapsed = 0;
    bloomStarted = true;

    if (flowerGroup) {
      const data = flowerGroup.userData;
      if (data.stem) data.stem.scale.set(1, 0, 1);
      data.leaves.forEach(l => l.scale.set(0, 0, 0));
      data.sepals.forEach(s => {
        s.scale.set(0, 0, 0);
        s.rotation.x = Math.PI * 0.45;
      });
      data.petals.forEach(p => {
        p.scale.set(0, 0, 0);
        p.rotation.x = p.userData.startRotX;
      });
      if (data.centerCore) data.centerCore.scale.set(0, 0, 0);
      data.stamens.forEach(s => s.scale.set(0, 0, 0));
      if (glowParticles) glowParticles.material.opacity = 0;
      if (pollenParticles) pollenParticles.material.opacity = 0;
    }
  }

  /* ---- Change Flower Color Theme ---- */
  function setFlowerTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    currentThemeKey = themeKey;
    activeColors = { ...THEMES[themeKey] };

    if (!flowerGroup) return;

    flowerGroup.userData.petals.forEach(petal => {
      const layer = petal.userData.layerIdx;
      let targetCol = activeColors.outer;
      let targetEm = activeColors.outer;
      if (layer === 0) {
        targetCol = activeColors.core;
        targetEm = activeColors.inner;
      } else if (layer === 1) {
        targetCol = activeColors.inner;
        targetEm = activeColors.mid;
      } else if (layer === 2) {
        targetCol = activeColors.mid;
        targetEm = activeColors.outer;
      }
      petal.material.color.setHex(targetCol);
      petal.material.emissive.setHex(targetEm);
    });

    if (glowParticles) glowParticles.material.color.setHex(activeColors.glow);
  }

  /* ---- Mouse & Touch Orbit Drag Handlers ---- */
  function setupInteraction(canvas) {
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) {
        const rect = canvas.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          targetRotY = nx * 1.5;
          targetRotX = 0.2 + ny * 0.8;
        }
        return;
      }
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      targetRotX = Math.max(-0.4, Math.min(0.8, targetRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      targetRotX = Math.max(-0.4, Math.min(0.8, targetRotX));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
  }

  /* ---- Init Scene ---- */
  function init() {
    const canvas = document.getElementById('flower-canvas');
    if (!canvas) return;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0.4, 4.2);

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      setupLighting();
      buildFlower();
      setupInteraction(canvas);

      window.addEventListener('resize', () => {
        if (!canvas || !renderer || !camera) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      }, { passive: true });

      isActive = true;
      render();

      const replayBtn = document.getElementById('flower-replay-btn');
      if (replayBtn) replayBtn.addEventListener('click', replayBloom);

      document.querySelectorAll('.flower-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.flower-color-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const colorKey = btn.dataset.color || 'rose';
          setFlowerTheme(colorKey);
        });
      });

    } catch (e) {
      console.error('Flower3D init error:', e);
      const fallback = document.getElementById('flower-fallback');
      if (fallback) fallback.style.display = 'flex';
      if (canvas) canvas.style.display = 'none';
    }
  }

  function pause() {
    isActive = false;
    if (animId) cancelAnimationFrame(animId);
  }

  function resume() {
    if (isActive) return;
    isActive = true;
    render();
  }

  function startBloom() {
    bloomStarted = true;
  }

  function markReady() {
    bloomReady = true;
  }

  return {
    init,
    startBloom,
    markReady,
    replayBloom,
    setFlowerTheme,
    pause,
    resume
  };
})();
