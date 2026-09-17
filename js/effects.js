/* =============================================
   EFFECTS.JS — Particles, Cursor, Themes, Hearts, Confetti,
   Magic Sparkler Trail, Wish Balloons, Wax Seal Letter & Gift Box
   Blooming Birthday for Ana — TikTok Viral Edition
   ============================================= */

const Effects = (() => {
  'use strict';

  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  /* ============================================
     THEME MANAGER (Dynamic Color Palettes)
     ============================================ */
  const ThemeManager = (() => {
    const THEMES = ['rose', 'lavender', 'sunset', 'sakura'];
    let currentTheme = 'rose';

    function setTheme(theme) {
      if (!THEMES.includes(theme)) return;
      currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);

      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.theme === theme);
      });

      if (window.Flower3D && Flower3D.setFlowerTheme) {
        Flower3D.setFlowerTheme(theme === 'sunset' ? 'peach' : theme);
      }
    }

    function init() {
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const theme = btn.dataset.theme;
          setTheme(theme);
        });
      });

      setTheme('rose');
    }

    return { init, setTheme, getTheme: () => currentTheme };
  })();

  /* ============================================
     CURSOR SPOTLIGHT (Subtle & Soft Ambient Glow)
     ============================================ */
  const CursorSpotlight = (() => {
    let spotlight = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    function render() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      if (spotlight) {
        spotlight.style.transform = `translate3d(${currentX - 60}px, ${currentY - 60}px, 0)`;
      }
      requestAnimationFrame(render);
    }

    function init() {
      if (prefersReducedMotion || isMobile) return;

      spotlight = document.getElementById('cursor-spotlight');
      if (!spotlight) {
        spotlight = document.createElement('div');
        spotlight.id = 'cursor-spotlight';
        spotlight.className = 'cursor-spotlight';
        document.body.prepend(spotlight);
      }

      window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      }, { passive: true });

      render();
    }

    return { init };
  })();

  /* ============================================
     CLICK & TOUCH SPARKLES (Instant Fading Bursts)
     ============================================ */
  const ClickSparkles = (() => {
    const SPARKLE_ICONS = ['🌸', '✨', '💖', '🌷', '🤍', '⭐'];

    function createBurst(x, y) {
      if (prefersReducedMotion) return;

      const count = isMobile ? 4 : 6;
      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'click-sparkle';
        span.textContent = SPARKLE_ICONS[Math.floor(Math.random() * SPARKLE_ICONS.length)];

        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = Math.random() * 40 + 20;
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance - 15;

        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        span.style.setProperty('--dx', `${destX}px`);
        span.style.setProperty('--dy', `${destY}px`);
        span.style.setProperty('--rot', `${(Math.random() - 0.5) * 40}deg`);

        document.body.appendChild(span);

        setTimeout(() => {
          if (span.parentNode) span.parentNode.removeChild(span);
        }, 500); // Fades quickly in 500ms
      }
    }

    function init() {
      document.addEventListener('click', (e) => {
        if (e.target.closest('#heart-btn') || e.target.closest('.modal') || e.target.closest('#sparkler-canvas')) return;
        createBurst(e.clientX, e.clientY);
      });
    }

    return { init, burst: createBurst };
  })();

  /* ============================================
     3D CARD TILT ON HOVER
     ============================================ */
  const CardTilt = (() => {
    function init() {
      if (isMobile || prefersReducedMotion) return;

      const cards = document.querySelectorAll('.glass-card, .polaroid-card, .wish-card');

      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    return { init };
  })();

  /* ============================================
     MAGIC FIREWORKS (Rockets, Layered Blooms & Hearts)
     ============================================ */
  const FireworkAudio = (() => {
    let context, master, noise, enabled = true;
    const voices = new Set();

    function unlock() {
      if (!enabled) return;
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        if (!context) {
          context = new Audio();
          master = context.createGain();
          master.gain.value = 0.8;
          master.connect(context.destination);
          noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
          const data = noise.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        }
        if (context.state !== 'running') context.resume().catch(() => {});
      } catch (_) { /* Visual fireworks remain available without audio. */ }
    }

    function sound(kind) {
      if (!enabled || !context || context.state !== 'running' || voices.size >= 10) return;
      const now = context.currentTime;
      const launch = kind === 'launch';
      const length = launch ? 0.65 : 1.2;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = noise;
      filter.type = launch ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(launch ? 600 : 1700, now);
      filter.frequency.exponentialRampToValueAtTime(launch ? 2200 : 100, now + length);
      filter.Q.value = launch ? 2 : 0.7;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(launch ? 0.5 : 1.0, now + (launch ? 0.12 : 0.015));
      gain.gain.exponentialRampToValueAtTime(0.001, now + length);
      source.connect(filter); filter.connect(gain); gain.connect(master);
      voices.add(source);
      source.onended = () => { voices.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
      source.start(now); source.stop(now + length);
      if (!launch) {
        // A soft low boom beneath the noise tail.
        const bass = context.createOscillator(), envelope = context.createGain();
        bass.frequency.setValueAtTime(95, now);
        bass.frequency.exponentialRampToValueAtTime(35, now + 0.35);
        envelope.gain.setValueAtTime(0.001, now);
        envelope.gain.linearRampToValueAtTime(0.7, now + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        bass.connect(envelope); envelope.connect(master); voices.add(bass);
        bass.onended = () => { voices.delete(bass); bass.disconnect(); envelope.disconnect(); };
        bass.start(now); bass.stop(now + 0.55);
      }
    }

    function stop() {
      voices.forEach(source => { try { source.stop(); } catch (_) {} });
      voices.clear();
    }

    function init() {
      const btn = document.getElementById('fireworks-sound-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        enabled = !enabled;
        if (master) master.gain.value = enabled ? 0.8 : 0;
        if (enabled) unlock(); else stop();
        btn.setAttribute('aria-pressed', String(enabled));
        btn.textContent = enabled ? '🔊' : '🔇';
        btn.setAttribute('aria-label', enabled ? 'Matikan suara kembang api' : 'Nyalakan suara kembang api');
      });
    }
    return {init, unlock, sound, stop};
  })();

  const MagicSparkler = (() => {
    let canvas, ctx, toggleBtn, hint;
    let sparks = [], rockets = [], isEnabled = false, animId = null;
    let lastTime = 0, nextLaunch = 0, lastPointer = 0, burstIndex = 0;
    const limit = isMobile ? 300 : 650;
    const palettes = {
      rose: ['#ff6da8', '#ffd58a', '#ffb9db'],
      lavender: ['#bc92ff', '#efc6ff', '#ffe3a3'],
      sunset: ['#ff9971', '#ffdb8a', '#ffbcab'],
      sakura: ['#ff82b0', '#ffc9e0', '#ffe3a3']
    };

    function addSpark(x, y, vx, vy, color, life, size) {
      if (sparks.length >= limit) sparks.shift();
      sparks.push({ x, y, vx, vy, color, life, maxLife: life, size, trail: [] });
    }

    function burst(x, y) {
      FireworkAudio.sound('burst');
      const colors = palettes[ThemeManager.getTheme()] || palettes.rose;
      const heart = burstIndex++ % 3 === 2;
      const count = prefersReducedMotion ? 24 : (isMobile ? 80 : 130);
      const radius = Math.min(innerWidth * 0.25, 170);
      for (let i = 0; i < count; i++) {
        const angle = i / count * Math.PI * 2;
        let vx, vy;
        if (heart) {
          vx = 16 * Math.pow(Math.sin(angle), 3) * radius / 16;
          vy = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) -
            2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * radius / 16;
        } else {
          const speed = radius * (i % 3 === 0 ? 0.5 : 1) * (0.85 + Math.random() * 0.3);
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }
        addSpark(x, y, vx, vy, colors[i % colors.length],
          prefersReducedMotion ? 0.8 : 1.6 + Math.random() * 0.8, 1.2 + Math.random() * 1.4);
      }
      wake();
    }

    function launch(x = innerWidth * (0.18 + Math.random() * 0.64),
      y = innerHeight * (0.18 + Math.random() * 0.3)) {
      if (prefersReducedMotion) { burst(x, y); return; }
      if (rockets.length >= 4) return;
      FireworkAudio.sound('launch');
      rockets.push({ x: x + (Math.random() - 0.5) * 120, y: innerHeight + 15,
        targetX: x, targetY: y, age: 0, duration: 0.85 + Math.random() * 0.3,
        startY: innerHeight + 15, trail: [] });
      wake();
    }

    function wake() {
      if (animId === null && !document.hidden) {
        lastTime = 0;
        animId = requestAnimationFrame(render);
      }
    }

    function drawTrail(points, color, alpha, width) {
      if (points.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      for (let i = 1; i < points.length; i++) {
        ctx.globalAlpha = alpha * i / points.length;
        ctx.beginPath();
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }
    }

    function render(time) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.04) : 1 / 60;
      lastTime = time;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      if (isEnabled && !prefersReducedMotion && time >= nextLaunch) {
        launch();
        nextLaunch = time + (isMobile ? 1500 : 1100);
      }
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.age += dt;
        const progress = Math.min(r.age / r.duration, 1);
        r.x += (r.targetX - r.x) * Math.min(dt * 5, 1);
        r.y = r.startY + (r.targetY - r.startY) * (1 - Math.pow(1 - progress, 2));
        r.trail.push({x: r.x, y: r.y});
        if (r.trail.length > 16) r.trail.shift();
        drawTrail(r.trail, '#ffdda1', 0.8, 2);
        if (progress >= 1) { burst(r.x, r.y); rockets.splice(i, 1); }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        s.trail.push({x: s.x, y: s.y});
        if (s.trail.length > 7) s.trail.shift();
        s.vx *= Math.exp(-0.8 * dt);
        s.vy = s.vy * Math.exp(-0.8 * dt) + 30 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const alpha = Math.pow(s.life / s.maxLife, 0.7);
        drawTrail(s.trail, s.color, alpha * 0.55, s.size * 0.7);
        ctx.globalAlpha = alpha * 0.12;
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff8e9';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      animId = null;
      if (isEnabled && !prefersReducedMotion || sparks.length || rockets.length) {
        if (animId === null) animId = requestAnimationFrame(render);
      }
    }

    function setEnabled(enabled) {
      isEnabled = enabled;
      toggleBtn.classList.toggle('is-active', enabled);
      toggleBtn.setAttribute('aria-pressed', String(enabled));
      toggleBtn.textContent = enabled ? '✧ Matikan Kembang Api' : '✨ Nyalakan Kembang Api Magic';
      toggleBtn.setAttribute('aria-label', enabled ? 'Matikan kembang api magic' : 'Nyalakan kembang api magic');
      canvas.classList.toggle('is-active', enabled && !prefersReducedMotion);
      if (hint) hint.textContent = enabled ? 'Sentuh langit untuk membuat ledakanmu sendiri ♡' : 'Sedikit cahaya untuk hari spesialmu';
      if (enabled) {
        FireworkAudio.unlock();
        nextLaunch = performance.now() + 1100;
        launch(innerWidth * 0.32, innerHeight * 0.3);
        if (!prefersReducedMotion) launch(innerWidth * 0.7, innerHeight * 0.23);
      } else {
        sparks = []; rockets = [];
        FireworkAudio.stop();
        if (animId !== null) cancelAnimationFrame(animId);
        animId = null;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
    }

    function init() {
      canvas = document.getElementById('sparkler-canvas');
      toggleBtn = document.getElementById('sparkler-toggle-btn');
      hint = document.getElementById('sparkler-hint');
      if (!canvas || !toggleBtn) return;
      ctx = resizeCanvas(canvas);
      if (!ctx) return;
      FireworkAudio.init();
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.addEventListener('click', () => setEnabled(!isEnabled));
      window.addEventListener('pointerdown', e => {
        if (!isEnabled || e.target.closest('button, a, input, video, [role="button"], .lightbox, .music-player')) return;
        const now = performance.now();
        if (now - lastPointer < 250) return;
        lastPointer = now;
        launch(e.clientX, Math.max(60, Math.min(e.clientY, innerHeight * 0.75)));
      }, {passive: true});
      window.addEventListener('resize', () => {
        ctx = resizeCanvas(canvas);
        sparks = []; rockets = [];
      }, {passive: true});
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) setEnabled(false);
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isEnabled) setEnabled(false);
      });
    }

    return { init, spawn: (x, y) => { if (ctx) burst(x, y); } };
  })();

  /* ============================================
     INTERACTIVE WISH BALLOONS (Balon Harapan)
     ============================================ */
  const WishBalloons = (() => {
    const BALLOON_MESSAGES = [
      'Senyummu selalu membawa kehangatan 🌸',
      'Kamu adalah pribadi yang luar biasa kuat ✨',
      'Kehadiranmu membuat dunia jauh lebih indah 🌷',
      'Semoga semua mimpi indahmu tercapai 🤍',
      'Semangat untuk setiap langkah barumu 🌟',
      'Terima kasih telah menjadi Ana yang istimewa 💖'
    ];

    function init() {
      const container = document.getElementById('balloons-container');
      if (!container) return;

      const balloonNodes = container.querySelectorAll('.wish-balloon');
      balloonNodes.forEach((balloon, idx) => {
        balloon.addEventListener('click', (e) => {
          if (balloon.classList.contains('is-popped')) return;
          popBalloon(balloon, idx, e.clientX, e.clientY);
        });
      });
    }

    function popBalloon(balloon, index, x, y) {
      balloon.classList.add('is-popped');
      ClickSparkles.burst(x, y);

      const msg = BALLOON_MESSAGES[index % BALLOON_MESSAGES.length];
      const noteEl = document.createElement('div');
      noteEl.className = 'balloon-pop-note';
      noteEl.textContent = msg;
      noteEl.style.left = `${balloon.offsetLeft + 20}px`;
      noteEl.style.top = `${balloon.offsetTop}px`;

      balloon.parentElement.appendChild(noteEl);

      setTimeout(() => {
        noteEl.classList.add('is-shown');
      }, 50);

      setTimeout(() => {
        if (noteEl.parentNode) noteEl.parentNode.removeChild(noteEl);
      }, 4500);
    }

    return { init };
  })();

  /* ============================================
     SURPRISE 3D GIFT BOX (Kotak Kado Interaktif)
     ============================================ */
  const SurpriseGiftBox = (() => {
    function init() {
      const giftBox = document.getElementById('gift-box-wrap');
      const unwrapBtn = document.getElementById('gift-unwrap-btn');
      const giftReveal = document.getElementById('gift-reveal-content');

      if (!giftBox) return;

      function openGift() {
        if (giftBox.classList.contains('is-opened')) return;
        giftBox.classList.add('is-opened');

        if (giftReveal) {
          setTimeout(() => {
            giftReveal.classList.add('is-visible');
          }, 600);
        }

        Confetti.burst();
        if (unwrapBtn) unwrapBtn.style.display = 'none';
      }

      giftBox.addEventListener('click', openGift);
      if (unwrapBtn) unwrapBtn.addEventListener('click', openGift);
    }

    return { init };
  })();

  /* ============================================
     ROMANTIC WAX SEAL ENVELOPE (Surat Cinta)
     ============================================ */
  const WaxSealEnvelope = (() => {
    function init() {
      const sealBtn = document.getElementById('wax-seal-btn');
      const envelope = document.getElementById('romantic-envelope');
      const letterContent = document.getElementById('letter-content');

      if (!sealBtn || !envelope) return;

      sealBtn.addEventListener('click', () => {
        envelope.classList.add('is-open');
        sealBtn.style.pointerEvents = 'none';

        setTimeout(() => {
          typewriterLetter();
        }, 800);
      });
    }

    function typewriterLetter() {
      const paras = document.querySelectorAll('.letter-para');
      paras.forEach((p, idx) => {
        setTimeout(() => {
          p.classList.add('is-revealed');
        }, idx * 400);
      });
    }

    return { init };
  })();

  /* ============================================
     OPENING PARTICLES
     ============================================ */
  const OpeningParticles = (() => {
    let canvas, ctx, particles = [], animId = null, active = false;
    const PARTICLE_COUNT = isMobile ? 30 : 60;
    const TYPES = ['star', 'dot', 'heart', 'petal'];
    const COLORS = ['#FFC2D1', '#FF8FAB', '#FB6F92', '#FFE4EC', '#B983FF', '#FFFFFF'];

    function createParticle() {
      const type = TYPES[Math.floor(Math.random() * TYPES.length)];
      return {
        x: Math.random() * (canvas.width / dpr),
        y: Math.random() * (canvas.height / dpr),
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        opacity: Math.random() * 0.6 + 0.2,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      };
    }

    function drawStar(x, y, size, color, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const method = i === 0 ? 'moveTo' : 'lineTo';
        ctx[method](x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawHeart(x, y, size, color, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const s = size * 0.6;
      ctx.moveTo(x, y + s * 0.4);
      ctx.bezierCurveTo(x, y - s * 0.2, x - s, y - s * 0.2, x - s, y + s * 0.1);
      ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s);
      ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
      ctx.bezierCurveTo(x + s, y - s * 0.2, x, y - s * 0.2, x, y + s * 0.4);
      ctx.fill();
      ctx.restore();
    }

    function drawPetal(x, y, size, color, opacity, rotation) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawDot(x, y, size, color, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 3;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      if (!active) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        p.opacity += p.opacityDir * 0.005;
        if (p.opacity > 0.8) p.opacityDir = -1;
        if (p.opacity < 0.15) p.opacityDir = 1;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        switch (p.type) {
          case 'star': drawStar(p.x, p.y, p.size, p.color, p.opacity); break;
          case 'heart': drawHeart(p.x, p.y, p.size, p.color, p.opacity); break;
          case 'petal': drawPetal(p.x, p.y, p.size, p.color, p.opacity, p.rotation); break;
          default: drawDot(p.x, p.y, p.size, p.color, p.opacity);
        }
      });

      animId = requestAnimationFrame(draw);
    }

    return {
      init() {
        if (prefersReducedMotion) return;
        canvas = document.getElementById('opening-particles');
        if (!canvas) return;
        ctx = resizeCanvas(canvas);
        particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
        active = true;
        draw();

        window.addEventListener('resize', () => {
          if (canvas && active) ctx = resizeCanvas(canvas);
        }, { passive: true });
      },
      destroy() {
        active = false;
        if (animId) cancelAnimationFrame(animId);
        particles = [];
      }
    };
  })();

  /* ============================================
     BACKGROUND FALLING PETALS (Subtle & Elegant)
     ============================================ */
  const BackgroundPetals = (() => {
    let canvas, ctx, petals = [], animId = null, active = false;
    const PETAL_COUNT = isMobile ? 6 : 12;
    const COLORS = ['#FFC2D1', '#FFE4EC', '#FF8FAB', '#FFF5F7', '#D4B8FF'];

    function createPetal() {
      const w = canvas ? canvas.width / dpr : window.innerWidth;
      const h = canvas ? canvas.height / dpr : window.innerHeight;
      return {
        x: Math.random() * w,
        y: Math.random() * h * -0.3 - 20,
        size: Math.random() * 4 + 2,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.01,
        opacity: Math.random() * 0.15 + 0.08,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }

    function draw() {
      if (!active) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      petals.forEach(p => {
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.25;
        p.rotation += p.rotationSpeed;

        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    }

    return {
      init() {
        if (prefersReducedMotion) return;
        canvas = document.getElementById('petals-bg');
        if (!canvas) return;
        ctx = resizeCanvas(canvas);
        petals = Array.from({ length: PETAL_COUNT }, createPetal);
        active = true;
        draw();
        canvas.classList.add('is-active');

        window.addEventListener('resize', () => {
          if (canvas && active) ctx = resizeCanvas(canvas);
        }, { passive: true });
      },
      pause() {
        active = false;
        if (animId) cancelAnimationFrame(animId);
      },
      resume() {
        if (!canvas || prefersReducedMotion) return;
        active = true;
        draw();
      }
    };
  })();

  /* ============================================
     CURSOR TRAIL (Fast Disappearing Subtle Shimmer)
     ============================================ */
  const CursorTrail = (() => {
    let particles = [], animId = null, active = false;
    const MAX_PARTICLES = 10;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function createTrailParticle(x, y) {
      return {
        x, y,
        size: Math.random() * 2.5 + 1.2,
        life: 1,
        decay: Math.random() * 0.08 + 0.06, // Disappears in ~0.2s
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        color: Math.random() > 0.5 ? '#FFC2D1' : '#FF8FAB',
        glow: false
      };
    }

    function draw() {
      if (!active) return;
      const canvas = document.getElementById('heart-particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      particles = particles.filter(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= p.decay;
        p.size *= 0.94;

        if (p.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.life * 0.35;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      animId = requestAnimationFrame(draw);
    }

    return {
      init() {
        if (isMobile || !canHover || prefersReducedMotion) return;
        const canvas = document.getElementById('heart-particles');
        if (!canvas) return;
        resizeCanvas(canvas);

        active = true;
        let lastX = 0, lastY = 0;

        document.addEventListener('mousemove', (e) => {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 18 && particles.length < MAX_PARTICLES) {
            particles.push(createTrailParticle(e.clientX, e.clientY));
            lastX = e.clientX;
            lastY = e.clientY;
          }
        }, { passive: true });

        draw();
      }
    };
  })();

  /* ============================================
     HEART BUTTON (Interactive Virtual Hugs)
     ============================================ */
  const HeartButton = (() => {
    let count = 0;
    const STORAGE_KEY = 'ana-birthday-hearts';

    function spawnHeartParticles(originX, originY) {
      const canvas = document.getElementById('heart-particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const hearts = [];
      const COLORS = ['#FB6F92', '#FF8FAB', '#FFC2D1', '#B983FF', '#FFE4EC'];

      for (let i = 0; i < 14; i++) {
        hearts.push({
          x: originX,
          y: originY,
          size: Math.random() * 12 + 8,
          speedX: (Math.random() - 0.5) * 8,
          speedY: -(Math.random() * 6 + 4),
          gravity: 0.12,
          life: 1,
          decay: Math.random() * 0.015 + 0.01,
          rotation: (Math.random() - 0.5) * 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }

      function animate() {
        const stillAlive = hearts.filter(h => {
          h.x += h.speedX;
          h.y += h.speedY;
          h.speedY += h.gravity;
          h.life -= h.decay;

          if (h.life <= 0) return false;

          ctx.save();
          ctx.globalAlpha = h.life;
          ctx.fillStyle = h.color;
          ctx.translate(h.x, h.y);
          ctx.rotate(h.rotation);

          const s = h.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.4);
          ctx.bezierCurveTo(0, -s * 0.2, -s, -s * 0.2, -s, s * 0.1);
          ctx.bezierCurveTo(-s, s * 0.6, 0, s, 0, s);
          ctx.bezierCurveTo(0, s, s, s * 0.6, s, s * 0.1);
          ctx.bezierCurveTo(s, -s * 0.2, 0, -s * 0.2, 0, s * 0.4);
          ctx.fill();
          ctx.restore();

          return true;
        });

        if (stillAlive.length > 0) {
          requestAnimationFrame(animate);
        }
      }

      animate();
    }

    return {
      init() {
        const btn = document.getElementById('heart-btn');
        const countEl = document.getElementById('heart-count');
        const canvas = document.getElementById('heart-particles');
        if (!btn || !countEl) return;

        const saved = localStorage.getItem(STORAGE_KEY);
        count = saved ? parseInt(saved, 10) : 0;
        countEl.textContent = count;

        if (canvas) resizeCanvas(canvas);

        btn.addEventListener('click', () => {
          count++;
          countEl.textContent = count;
          localStorage.setItem(STORAGE_KEY, count);

          const rect = btn.getBoundingClientRect();
          spawnHeartParticles(rect.left + rect.width / 2, rect.top);

          btn.style.transform = 'scale(1.25)';
          setTimeout(() => { btn.style.transform = ''; }, 200);
        });

        window.addEventListener('resize', () => {
          if (canvas) resizeCanvas(canvas);
        }, { passive: true });
      }
    };
  })();

  /* ============================================
     CONFETTI & FIREWORKS BURST
     ============================================ */
  const Confetti = (() => {
    function burst() {
      const canvas = document.getElementById('confetti-canvas');
      if (!canvas) return;
      const ctx = resizeCanvas(canvas);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const pieces = [];
      const COLORS = ['#FB6F92', '#FF8FAB', '#FFC2D1', '#B983FF', '#FFE4EC', '#F5D99A', '#FFFFFF', '#FFD700'];
      const TYPES = ['rect', 'circle', 'petal', 'star'];

      for (let i = 0; i < (isMobile ? 80 : 160); i++) {
        pieces.push({
          x: w / 2 + (Math.random() - 0.5) * 140,
          y: h / 2,
          size: Math.random() * 10 + 4,
          speedX: (Math.random() - 0.5) * 16,
          speedY: -(Math.random() * 14 + 6),
          gravity: 0.16 + Math.random() * 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.18,
          life: 1,
          decay: 0.005 + Math.random() * 0.005,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type: TYPES[Math.floor(Math.random() * TYPES.length)]
        });
      }

      function animate() {
        ctx.clearRect(0, 0, w, h);

        const alive = pieces.filter(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.speedY += p.gravity;
          p.speedX *= 0.99;
          p.rotation += p.rotationSpeed;
          p.life -= p.decay;

          if (p.life <= 0) return false;

          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          switch (p.type) {
            case 'rect':
              ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
              break;
            case 'circle':
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'petal':
              ctx.beginPath();
              ctx.ellipse(0, 0, p.size * 0.3, p.size * 0.7, 0, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'star':
              ctx.beginPath();
              for (let s = 0; s < 5; s++) {
                const a = (s * 4 * Math.PI) / 5 - Math.PI / 2;
                ctx[s === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * (p.size * 0.6), Math.sin(a) * (p.size * 0.6));
              }
              ctx.closePath();
              ctx.fill();
              break;
          }
          ctx.restore();

          return true;
        });

        if (alive.length > 0) {
          requestAnimationFrame(animate);
        }
      }

      animate();
    }

    return { burst };
  })();

  /* ---- Fireworks Spawner ---- */
  function triggerFireworks() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = resizeCanvas(canvas);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    for (let f = 0; f < 3; f++) {
      setTimeout(() => {
        Confetti.burst();
      }, f * 400);
    }
  }

  /* ============================================
     PUBLIC API & INITIALIZER
     ============================================ */
  function initAll() {
    ThemeManager.init();
    CursorSpotlight.init();
    ClickSparkles.init();
    CardTilt.init();
    CursorTrail.init();
    HeartButton.init();
    MagicSparkler.init();
    WishBalloons.init();
    SurpriseGiftBox.init();
    WaxSealEnvelope.init();
  }

  return {
    initAll,
    ThemeManager,
    CursorSpotlight,
    ClickSparkles,
    CardTilt,
    OpeningParticles,
    BackgroundPetals,
    CursorTrail,
    HeartButton,
    MagicSparkler,
    WishBalloons,
    SurpriseGiftBox,
    WaxSealEnvelope,
    confettiBurst: Confetti.burst,
    triggerFireworks
  };
})();
