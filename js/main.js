/* =============================================
   MAIN.JS — Initialization & Global Interactions
   Blooming Birthday for Ana — TikTok Viral Edition
   ============================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     OPENING SCREEN
     ============================================ */
  function initOpening() {
    const opening = document.getElementById('opening');
    const openBtn = document.getElementById('open-btn');
    const mainContent = document.getElementById('main-content');
    const heartBtn = document.getElementById('heart-btn');

    if (!opening || !openBtn || !mainContent) return;

    // Start opening particles
    Effects.OpeningParticles.init();

    openBtn.addEventListener('click', () => {
      // 1. Fade out opening screen
      opening.classList.add('is-hidden');

      // 2. Show main content
      mainContent.classList.add('is-visible');

      // 3. Start music
      Music.startPlaying();

      // 4. Start background petals
      setTimeout(() => {
        Effects.BackgroundPetals.init();
      }, 500);

      // 5. Mark flower as ready (bloom will start when visible)
      if (typeof Flower3D !== 'undefined' && Flower3D.markReady) {
        Flower3D.markReady();
      }

      // 6. Initialize 3D Birthday Cake
      if (typeof Cake3D !== 'undefined' && Cake3D.init) {
        setTimeout(() => {
          Cake3D.init();
        }, 600);
      }

      // 7. Show heart button
      if (heartBtn) {
        setTimeout(() => {
          heartBtn.style.display = '';
        }, 1500);
      }

      // 8. Destroy opening particles after transition
      setTimeout(() => {
        Effects.OpeningParticles.destroy();
      }, 1500);

      // 9. Trigger hero reveals
      setTimeout(() => {
        revealHeroElements();
      }, 600);
    });
  }

  /* ============================================
     HERO TEXT REVEALS
     ============================================ */
  function revealHeroElements() {
    const heroReveals = document.querySelectorAll('#hero .reveal-up');
    heroReveals.forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, delay);
    });
  }

  /* ============================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================ */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up:not(#hero .reveal-up)');

    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /* ============================================
     FLOWER SECTION VISIBILITY
     ============================================ */
  function initFlowerVisibility() {
    const flowerSection = document.getElementById('flower-section');
    if (!flowerSection) return;

    let bloomTriggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Flower3D.resume();
          if (!bloomTriggered) {
            bloomTriggered = true;
            Flower3D.startBloom();
          }
        } else {
          Flower3D.pause();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(flowerSection);
  }

  /* ============================================
     GSAP-STYLE LETTER PARAGRAPH REVEAL
     ============================================ */
  function initLetterReveal() {
    const letterParas = document.querySelectorAll('.letter-para');
    if (!letterParas.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      letterParas.forEach((para, i) => {
        gsap.from(para, {
          scrollTrigger: {
            trigger: para,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 20,
          filter: 'blur(3px)',
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power2.out',
          clearProps: 'filter'
        });
      });
    }
  }

  /* ============================================
     INITIALIZE ALL MODULES
     ============================================ */
  function init() {
    Flower3D.init();
    Music.init();
    Gallery.init();
    Effects.initAll();
    initOpening();
    initScrollReveal();
    initFlowerVisibility();
    initLetterReveal();
  }

  /* ============================================
     DOM READY
     ============================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
