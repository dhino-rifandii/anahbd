/* =============================================
   GALLERY.JS — Polaroid Gallery & Lightbox
   Blooming Birthday for Ana
   ============================================= */

const Gallery = (() => {
  'use strict';

  let images = [];
  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  const SWIPE_THRESHOLD = 50;

  /* ---- Gather all gallery images ---- */
  function collectImages() {
    const cards = document.querySelectorAll('.polaroid-card, .polaroid__frame');
    images = [];
    cards.forEach(card => {
      const img = card.querySelector('.polaroid-card__img, .polaroid__img');
      if (img) {
        images.push({
          src: img.src,
          alt: img.alt || img.getAttribute('aria-label') || 'Foto Ana',
          isVideo: img.tagName === 'VIDEO',
          poster: img.poster || ''
        });
      }
    });
  }

  /* ---- Lightbox Controls ---- */
  function showMedia() {
    const item = images[currentIndex];
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    video.pause();
    video.removeAttribute('src');
    video.load();
    img.hidden = item.isVideo;
    video.hidden = !item.isVideo;
    if (item.isVideo) {
      video.src = item.src;
      video.poster = item.poster;
      video.setAttribute('aria-label', item.alt);
      video.muted = true;
      video.play().catch(() => { /* Native controls remain available. */ });
    } else {
      img.src = item.src;
      img.alt = item.alt;
    }
  }

  function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg || !images[index]) return;

    currentIndex = index;
    showMedia();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) closeBtn.focus();

    updateNavVisibility();
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const video = document.getElementById('lightbox-video');
    if (video) video.pause();

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the clicked photo
    const cards = document.querySelectorAll('.polaroid-card, .polaroid__frame');
    if (cards[currentIndex]) cards[currentIndex].focus();
  }

  function navigate(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    currentIndex = newIndex;

    showMedia();

    updateNavVisibility();
  }

  function updateNavVisibility() {
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (prevBtn) prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.3';
    if (nextBtn) nextBtn.style.opacity = currentIndex < images.length - 1 ? '1' : '0.3';
  }

  /* ---- Touch Swipe Handling ---- */
  function onTouchStart(e) {
    if (e.target.closest('video, button')) {
      isSwiping = false;
      return;
    }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  }

  function onTouchMove(e) {
    if (!isSwiping) return;
    e.preventDefault();
  }

  function onTouchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0) {
        navigate(1);
      } else {
        navigate(-1);
      }
    }
  }

  /* ---- Init ---- */
  function init() {
    collectImages();

    // Click handlers for polaroid cards
    const cards = document.querySelectorAll('.polaroid-card, .polaroid__frame');
    cards.forEach((card, i) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', card.querySelector('video') ? 'Putar video kenangan fullscreen' : 'Buka foto fullscreen');

      card.addEventListener('click', () => {
        const index = card.dataset.idx !== undefined ? parseInt(card.dataset.idx, 10) : i;
        openLightbox(index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const index = card.dataset.idx !== undefined ? parseInt(card.dataset.idx, 10) : i;
          openLightbox(index);
        }
      });
    });

    // Lightbox controls
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const lightbox = document.getElementById('lightbox');
    const overlay = lightbox ? lightbox.querySelector('.lightbox__overlay') : null;

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
    if (overlay) overlay.addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('is-open')) return;
      if (e.target.tagName === 'VIDEO' && e.key !== 'Escape') return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigate(-1);
          break;
        case 'ArrowRight':
          navigate(1);
          break;
      }
    });

    // Touch swipe for lightbox
    if (lightbox) {
      lightbox.addEventListener('touchstart', onTouchStart, { passive: true });
      lightbox.addEventListener('touchmove', onTouchMove, { passive: false });
      lightbox.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    // Lightbox image transition styling
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
      lightboxImg.style.transition = 'opacity 0.2s ease, transform 0.3s ease';
    }
  }

  return { init };
})();
