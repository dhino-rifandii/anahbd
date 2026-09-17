/* =============================================
   MUSIC.JS — Romantic Multi-Track Music Player & Synthesizer
   with TikTok Romantic Hits & Lyrics Subtitle Ticker
   Blooming Birthday for Ana
   ============================================= */

const Music = (() => {
  'use strict';

  // Romantic Multi-Track Playlist with Lyrics & Chords
  const PLAYLIST = [
    {
      id: 'until-i-found-you',
      title: 'Until I Found You',
      artist: 'Stephen Sanchez',
      mood: '💖 TikTok Viral Romance',
      lyrics: [
        'I would never fall in love...',
        'Until I found her, until I found you...',
        'Heaven when I held you again 🤍',
        'I was lost within the darkness, but then I found her ✨'
      ],
      notes: [
        { note: 'G4', dur: 0.6 }, { note: 'A4', dur: 0.6 }, { note: 'B4', dur: 1.2 }, { note: 'D5', dur: 1.2 },
        { note: 'B4', dur: 0.8 }, { note: 'A4', dur: 0.8 }, { note: 'G4', dur: 1.8 },
        { note: 'E4', dur: 0.6 }, { note: 'G4', dur: 0.6 }, { note: 'A4', dur: 1.2 }, { note: 'B4', dur: 1.4 },
        { note: 'A4', dur: 0.8 }, { note: 'G4', dur: 2.2 },
        { note: 'D4', dur: 0.6 }, { note: 'G4', dur: 0.8 }, { note: 'B4', dur: 1.0 }, { note: 'C5', dur: 1.0 },
        { note: 'B4', dur: 1.2 }, { note: 'A4', dur: 1.2 }, { note: 'G4', dur: 2.5 }
      ],
      bpm: 78
    },
    {
      id: 'golden-hour',
      title: 'Golden Hour',
      artist: 'JVKE',
      mood: '✨ Emotional Piano Romance',
      lyrics: [
        'It’s your world and I’m just living in it...',
        'You slow down time in a world that’s full of noise 🌟',
        'She’s got that glow, looking like a dream 🌸',
        'Just one look and my whole sky lights up 💖'
      ],
      notes: [
        { note: 'E4', dur: 0.4 }, { note: 'G4', dur: 0.4 }, { note: 'B4', dur: 0.6 }, { note: 'E5', dur: 0.8 },
        { note: 'D5', dur: 0.6 }, { note: 'B4', dur: 0.6 }, { note: 'G4', dur: 0.6 }, { note: 'E4', dur: 1.2 },
        { note: 'F#4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'C#5', dur: 0.6 }, { note: 'F#5', dur: 0.8 },
        { note: 'E5', dur: 0.6 }, { note: 'C#5', dur: 0.6 }, { note: 'A4', dur: 0.6 }, { note: 'F#4', dur: 1.4 },
        { note: 'G4', dur: 0.4 }, { note: 'B4', dur: 0.4 }, { note: 'D5', dur: 0.6 }, { note: 'G5', dur: 1.8 }
      ],
      bpm: 88
    },
    {
      id: 'cant-help-falling',
      title: "Can't Help Falling in Love",
      artist: 'Kina Grannis / Acoustic & Piano',
      mood: '🌷 Warm & Timeless Love',
      lyrics: [
        'Wise men say only fools rush in...',
        'But I can’t help falling in love with you 🤍',
        'Like a river flows surely to the sea...',
        'Darling so it goes, some things are meant to be 🌸'
      ],
      notes: [
        { note: 'C4', dur: 1.2 }, { note: 'G4', dur: 1.2 }, { note: 'A4', dur: 1.2 }, { note: 'F4', dur: 1.2 },
        { note: 'C4', dur: 0.8 }, { note: 'G4', dur: 0.8 }, { note: 'C4', dur: 1.6 },
        { note: 'E4', dur: 1.0 }, { note: 'A4', dur: 1.0 }, { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 1.4 },
        { note: 'E4', dur: 1.0 }, { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 2.2 }
      ],
      bpm: 72
    },
    {
      id: 'penjaga-hati',
      title: 'Penjaga Hati',
      artist: 'Nadhif Basalamah',
      mood: '🤍 Soulful Indonesian Romance',
      lyrics: [
        'Karena bersamamu semua terasa indah...',
        'Gugur semua duka, tenang di setiap tatapmu ✨',
        'Kan ku jaga hatimu seluas samudra 🌊',
        'Bahagia selalu untukmu, Ana tercinta 🌷'
      ],
      notes: [
        { note: 'C4', dur: 0.6 }, { note: 'E4', dur: 0.6 }, { note: 'G4', dur: 1.0 }, { note: 'A4', dur: 1.2 },
        { note: 'G4', dur: 0.8 }, { note: 'F4', dur: 0.8 }, { note: 'E4', dur: 1.5 },
        { note: 'D4', dur: 0.6 }, { note: 'E4', dur: 0.6 }, { note: 'F4', dur: 1.0 }, { note: 'E4', dur: 1.0 },
        { note: 'D4', dur: 0.8 }, { note: 'C4', dur: 2.2 }
      ],
      bpm: 80
    },
    {
      id: 'lover',
      title: 'Lover',
      artist: 'Taylor Swift',
      mood: '🎀 Sweet Romantic Strings',
      lyrics: [
        'Can I go where you go? Can we always be this close? 💖',
        'Forever and ever, take me out and take me home...',
        'You’re my, my, my, my... lover 🌸',
        'All’s well that ends well to end up with you ✨'
      ],
      notes: [
        { note: 'G4', dur: 0.8 }, { note: 'G4', dur: 0.8 }, { note: 'A4', dur: 0.8 }, { note: 'G4', dur: 1.2 },
        { note: 'E4', dur: 1.5 }, { note: 'D4', dur: 0.8 }, { note: 'E4', dur: 1.0 }, { note: 'C4', dur: 2.0 },
        { note: 'E4', dur: 0.8 }, { note: 'G4', dur: 0.8 }, { note: 'A4', dur: 1.4 }, { note: 'C5', dur: 2.2 }
      ],
      bpm: 78
    },
    {
      id: 'a-thousand-years',
      title: 'A Thousand Years',
      artist: 'Christina Perri',
      mood: '🎻 Emotional Piano & Cello',
      lyrics: [
        'Heart beats fast, colors and promises...',
        'I have loved you for a thousand years 🤍',
        'I’ll love you for a thousand more...',
        'One step closer to all your dreams ✨'
      ],
      notes: [
        { note: 'C4', dur: 0.7 }, { note: 'E4', dur: 0.7 }, { note: 'G4', dur: 1.4 }, { note: 'A4', dur: 1.0 },
        { note: 'G4', dur: 1.2 }, { note: 'E4', dur: 1.2 }, { note: 'D4', dur: 1.6 },
        { note: 'C4', dur: 0.7 }, { note: 'E4', dur: 0.7 }, { note: 'G4', dur: 1.4 }, { note: 'C5', dur: 2.4 }
      ],
      bpm: 75
    },
    {
      id: 'sempurna',
      title: 'Sempurna',
      artist: 'Andra and The Backbone',
      mood: '🤍 Hangat & Penuh Makna',
      lyrics: [
        'Kau begitu sempurna, dimataku kau begitu indah...',
        'Kau membuat diriku akan selalu memujamu 🌸',
        'Terima kasih telah hadir membawa warna indah ✨',
        'Selamat ulang tahun untukmu, bidadari hatiku 🌷'
      ],
      notes: [
        { note: 'E4', dur: 0.6 }, { note: 'G#4', dur: 0.6 }, { note: 'B4', dur: 1.2 }, { note: 'C#5', dur: 1.2 },
        { note: 'B4', dur: 0.8 }, { note: 'A4', dur: 0.8 }, { note: 'G#4', dur: 1.6 },
        { note: 'F#4', dur: 0.6 }, { note: 'G#4', dur: 0.8 }, { note: 'A4', dur: 1.2 }, { note: 'G#4', dur: 2.0 }
      ],
      bpm: 82
    },
    {
      id: 'janji-suci',
      title: 'Janji Suci',
      artist: 'Yovie & Nuno',
      mood: '💍 Joyful Romantic Serenade',
      lyrics: [
        'Dengarkanlah wanita pujaanku...',
        'Malam ini akan kusampaikan hasrat suci kepadamu 💖',
        'Tatap mataku dan rasakan ketulusan ini 🌟',
        'Semoga bahagiamu abadi selamanya 🤍'
      ],
      notes: [
        { note: 'G4', dur: 0.5 }, { note: 'C5', dur: 1.0 }, { note: 'B4', dur: 0.8 }, { note: 'A4', dur: 0.8 },
        { note: 'G4', dur: 1.2 }, { note: 'E4', dur: 0.8 }, { note: 'F4', dur: 1.0 }, { note: 'G4', dur: 1.8 },
        { note: 'A4', dur: 0.6 }, { note: 'B4', dur: 0.6 }, { note: 'C5', dur: 1.2 }, { note: 'D5', dur: 2.0 }
      ],
      bpm: 84
    },
    {
      id: 'ana-birthday-waltz',
      title: "Ana's Romantic Celesta Waltz 🌸",
      artist: 'Special Birthday Music Box for Septiana',
      mood: '✨ Crystal Celesta & Strings',
      lyrics: [
        'Happy Birthday to you, Septiana Tri Handayani...',
        'Mekar indah setiap hari seperti bunga mawar 🌷',
        'Semoga doa dan impianmu menjadi kenyataan 🤍',
        'Today is your special day, celebrate with love ✨'
      ],
      notes: [
        { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 1.0 },
        { note: 'F4', dur: 1.0 }, { note: 'E4', dur: 2.0 },
        { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 1.0 },
        { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 2.0 },
        { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'C5', dur: 1.0 }, { note: 'A4', dur: 1.0 },
        { note: 'F4', dur: 1.0 }, { note: 'E4', dur: 1.0 }, { note: 'D4', dur: 1.5 },
        { note: 'Bb4', dur: 0.5 }, { note: 'Bb4', dur: 0.5 }, { note: 'A4', dur: 1.0 }, { note: 'F4', dur: 1.0 },
        { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 2.5 }
      ],
      bpm: 96
    }
  ];

  let wantsPlayback = false;
  let isPlaying = false;
  let isMuted = false;
  let audioPlayer = null;
  let lyricsInterval = null;
  let equalizerInterval = null;
  let currentLyricIndex = 0;
  let currentTrackIdx = 0;

  function setStatus(message, reveal = false) {
    const status = document.getElementById('music-status');
    if (status) status.textContent = message;
    if (reveal) document.getElementById('music-playlist-drawer')?.classList.add('is-open');
  }

  function stopped(message) {
    wantsPlayback = false;
    isPlaying = false;
    updateUI(); stopEqualizerAnim(); stopLyricsTicker();
    setStatus(message, Boolean(message));
  }

  function setupAudioPlayer() {
    audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;
    
    audioPlayer.addEventListener('play', () => {
      isPlaying = true;
      setStatus('');
      updateUI(); startEqualizerAnim(); startLyricsTicker();
    });
    
    audioPlayer.addEventListener('pause', () => {
      stopped('');
    });
    
    audioPlayer.addEventListener('ended', () => {
      if (wantsPlayback) {
        audioPlayer.currentTime = 0;
        audioPlayer.play().catch(() => stopped('Gagal memutar ulang lagu.'));
      }
    });
    
    audioPlayer.addEventListener('error', () => {
      stopped('Audio tidak dapat diputar. Pastikan file assets/music.mp3 tersedia.');
    });
  }

  /* ---- Lyrics Subtitle Ticker ---- */
  function startLyricsTicker() {
    stopLyricsTicker();
    const track = PLAYLIST[currentTrackIdx];
    const lyrics = track.lyrics || [];
    if (!lyrics.length) return;

    currentLyricIndex = 0;
    updateLyricsDisplay(lyrics[0]);

    lyricsInterval = setInterval(() => {
      if (!isPlaying) return;
      currentLyricIndex = (currentLyricIndex + 1) % lyrics.length;
      updateLyricsDisplay(lyrics[currentLyricIndex]);
    }, 4500);
  }

  function stopLyricsTicker() {
    if (lyricsInterval) {
      clearInterval(lyricsInterval);
      lyricsInterval = null;
    }
  }

  function updateLyricsDisplay(text) {
    const tickerEl = document.getElementById('music-lyrics-ticker');
    if (!tickerEl) return;

    tickerEl.style.opacity = '0';
    tickerEl.style.transform = 'translateY(6px)';

    setTimeout(() => {
      tickerEl.textContent = `❝ ${text} ❞`;
      tickerEl.style.opacity = '1';
      tickerEl.style.transform = 'translateY(0)';
    }, 250);
  }

  /* ---- Public Player Controls ---- */
  function play() {
    wantsPlayback = true;
    if (audioPlayer) {
      audioPlayer.muted = isMuted;
      audioPlayer.play().then(() => {
        isPlaying = true;
        updateUI();
      }).catch(err => {
        console.error(err);
        stopped('Ketuk tombol ▶ untuk mengaktifkan suara.');
      });
    }
    updateUI();
  }

  function pause() {
    wantsPlayback = false;
    if (audioPlayer) audioPlayer.pause();
    stopped('');
  }

  function togglePlay() {
    if (isPlaying) pause(); else play();
  }

  // The page currently has one configured recording.
  function nextTrack() {}
  function prevTrack() {}
  function selectTrack(idx) { if (idx === 0) { pause(); play(); } }

  function onTrackChanged() {
    updateTrackInfo();
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (audioPlayer) {
      audioPlayer.muted = isMuted;
    }
    updateUI();
  }

  /* ---- UI Updates & Visualizer ---- */
  function updateTrackInfo() {
    const track = PLAYLIST[currentTrackIdx];
    const titleEl = document.getElementById('music-title');
    const artistEl = document.getElementById('music-artist');

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;

    document.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('is-active', i === currentTrackIdx);
    });

    if (track.lyrics && track.lyrics.length) {
      updateLyricsDisplay(track.lyrics[0]);
    }
  }

  function updateUI() {
    const playBtn = document.getElementById('music-play-btn');
    const vinylEl = document.getElementById('music-vinyl');
    const muteBtn = document.getElementById('music-mute-btn');

    if (playBtn) {
      playBtn.innerHTML = isPlaying ? '<span class="music-icon">⏸</span>' : '<span class="music-icon">▶</span>';
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause Musik' : 'Putar Musik');
    }

    if (vinylEl) {
      vinylEl.classList.toggle('is-spinning', isPlaying);
    }

    if (muteBtn) {
      muteBtn.setAttribute('aria-label', isMuted ? 'Nyalakan suara musik' : 'Matikan suara musik');
      muteBtn.setAttribute('aria-pressed', String(isMuted));
      muteBtn.innerHTML = isMuted ? '<span class="music-icon">🔇</span>' : '<span class="music-icon">🔊</span>';
    }
  }

  function startEqualizerAnim() {
    stopEqualizerAnim();
    const bars = document.querySelectorAll('.eq-bar');
    if (!bars.length) return;

    equalizerInterval = setInterval(() => {
      if (!isPlaying) return;
      bars.forEach(bar => {
        const heightPercent = Math.floor(Math.random() * 80 + 20);
        bar.style.height = `${heightPercent}%`;
      });
    }, 120);
  }

  function stopEqualizerAnim() {
    if (equalizerInterval) {
      clearInterval(equalizerInterval);
      equalizerInterval = null;
    }
    const bars = document.querySelectorAll('.eq-bar');
    bars.forEach(bar => {
      bar.style.height = '20%';
    });
  }

  /* ---- Render Playlist Drawer ---- */
  function renderPlaylistDrawer() {
    const listEl = document.getElementById('playlist-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    PLAYLIST.slice(0, 1).forEach((track, idx) => {
      const item = document.createElement('li');
      item.className = `playlist-item ${idx === currentTrackIdx ? 'is-active' : ''}`;
      item.innerHTML = `
        <div class="playlist-item__num">${idx + 1}</div>
        <div class="playlist-item__info">
          <div class="playlist-item__title">${track.title}</div>
          <div class="playlist-item__artist">${track.artist}</div>
        </div>
        <span class="playlist-item__badge">${track.mood}</span>
      `;
      item.addEventListener('click', () => {
        selectTrack(idx);
        if (!isPlaying) play();
      });
      listEl.appendChild(item);
    });
  }

  /* ---- Initialize Player Widget ---- */
  function init() {
    const playerEl = document.getElementById('music-player');
    if (playerEl) playerEl.style.display = 'flex';

    setupAudioPlayer();
    renderPlaylistDrawer();
    updateTrackInfo();
    updateUI();

    const playBtn = document.getElementById('music-play-btn');
    const nextBtn = document.getElementById('music-next-btn');
    const prevBtn = document.getElementById('music-prev-btn');
    const muteBtn = document.getElementById('music-mute-btn');
    const drawerToggle = document.getElementById('music-drawer-toggle');
    const drawer = document.getElementById('music-playlist-drawer');
    const closeDrawerBtn = document.getElementById('playlist-close-btn');

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.hidden = true;
    if (prevBtn) prevBtn.hidden = true;
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);

    if (drawerToggle && drawer) {
      drawerToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        drawer.classList.toggle('is-open');
      });
    }

    if (closeDrawerBtn && drawer) {
      closeDrawerBtn.addEventListener('click', () => {
        drawer.classList.remove('is-open');
      });
    }

    document.addEventListener('click', (e) => {
      if (drawer && drawer.classList.contains('is-open') && !playerEl.contains(e.target) && e.target.id !== 'open-btn') {
        drawer.classList.remove('is-open');
      }
    });
  }

  function startPlaying() {
    play();
  }

  return {
    init,
    play,
    pause,
    togglePlay,
    nextTrack,
    prevTrack,
    selectTrack,
    toggleMute,
    startPlaying,
    getPlaylist: () => PLAYLIST
  };
})();
