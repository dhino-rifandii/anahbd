# 🌷 Blooming Birthday for Ana

Website ucapan ulang tahun romantis untuk **Septiana Tri Handayani** (Ana), dengan konsep bunga yang mekar sebagai simbol cerita baru dalam hidup.

## ✨ Fitur

- **Opening screen** dengan particles dan tombol kejutan
- **3D Flower** yang mekar menggunakan Three.js
- **Polaroid gallery** dengan lightbox dan swipe gesture
- **Digital letter** dengan paragraph reveal animation
- **Birthday wishes** cards
- **Interactive heart button** dengan counter (localStorage)
- **Special message** modal dengan animasi tiup lilin + confetti
- **Background falling petals**
- **Desktop cursor trail**
- **Responsive** — mobile-first design
- **Music** player via YouTube embed

## 📁 Struktur Project

```
birthday-ana/
├── index.html              # Halaman utama
├── css/
│   ├── style.css           # Design system, layout, semua komponen
│   ├── animations.css      # Keyframe animations
│   └── responsive.css      # Media queries & responsive styles
├── js/
│   ├── main.js             # Initialization & global interactions
│   ├── flower3d.js         # Three.js 3D flower animation
│   ├── gallery.js          # Photo gallery & lightbox
│   ├── music.js            # YouTube music controller
│   └── effects.js          # Particles, cursor, hearts, confetti
├── assets/
│   └── images/             # Foto-foto Ana
│       ├── ana-01.jpg
│       ├── ana-02.jpg
│       ├── ana-03.jpg
│       ├── ana-04.jpg
│       ├── ana-05.jpg
│       └── ana-06.jpg
└── README.md               # File ini
```

## 🚀 Cara Menjalankan

1. Clone atau download project ini
2. Jalankan `python -m http.server 8080`, lalu buka `http://localhost:8080`, atau gunakan Live Server di VS Code. Pemutar YouTube memerlukan halaman HTTP/HTTPS.
3. Klik **Buka Kejutannya** untuk mengaktifkan musik. Panel YouTube akan terbuka agar tombol video bisa diketuk langsung jika browser memblokir pemutaran otomatis. Status berputar hanya ditampilkan setelah YouTube mengonfirmasi playback. Tombol play/pause dan mute tersedia di widget musik.
4. Suara kembang api memiliki tombol mute terpisah dari musik.

Tidak memerlukan npm, build process, atau backend server.

## 🖼️ Cara Mengganti Foto

1. Siapkan foto-foto dalam format `.jpg`, `.jpeg`, `.png`, atau `.webp`
2. Masukkan ke folder `assets/images/`
3. Buka `index.html`
4. Cari bagian `<!-- PHOTO MEMORIES / GALLERY -->` dan section gallery
5. Update atribut `src` pada setiap `<img>` di dalam `.polaroid__frame`
6. Update juga `src` pada `.story-photo img` untuk foto di Photo Story section
7. Sesuaikan `object-position` jika crop perlu diatur (contoh: `object-position: center 20%`)

**Tips:** Gunakan foto dengan rasio portrait (3:4) untuk hasil terbaik di polaroid gallery.

## 🎵 Cara Mengganti Musik

1. Siapkan file lagu dalam format `.mp3`
2. Pindahkan file tersebut ke folder `assets/`
3. Ubah nama file menjadi `music.mp3`
4. Lagu akan secara otomatis diputar tanpa memuat video dari luar.

**Rekomendasi:** Gunakan lagu instrumental romantis, piano, atau acoustic yang lembut.

## 💌 Cara Mengganti Ucapan

Semua teks ucapan ada di `index.html`:

- **Birthday Letter**: Cari section `id="letter-section"`, edit teks di dalam `.letter-para`
- **Birthday Wishes Cards**: Cari section `id="wishes-section"`, edit `.wish-card__text`
- **Special Message Modal**: Cari `id="special-modal"`, edit `.modal__text`
- **Final Section**: Cari `id="final-section"`, edit teks di `.final-text`
- **Tanggal**: Cari `.final-date` dan ubah "18 September"

## 🌐 Deploy ke GitHub Pages

1. Buat repository baru di GitHub
2. Push seluruh project:
   ```bash
   git init
   git add .
   git commit -m "Birthday website for Ana"
   git branch -M main
   git remote add origin https://github.com/USERNAME/birthday-ana.git
   git push -u origin main
   ```
3. Buka **Settings** → **Pages**
4. Source: Deploy from branch **main** / **root**
5. Save, tunggu beberapa menit
6. Website akan tersedia di: `https://USERNAME.github.io/birthday-ana/`

## 🌸 File Animasi Bunga

Animasi bunga 3D diatur di `js/flower3d.js`:

- **Geometri bunga**: Function `buildFlower()` — membuat stem, leaves, petals, center
- **Animasi mekar**: Function `updateBloom()` — timeline animasi bertahap
- **Gerakan angin**: Function `updateSway()` — sway effect
- **Warna**: Object `COLORS` di bagian atas file
- **Jumlah kelopak**: Cari loop `for (let i = 0; i < 8; ...)` (outer) dan `for (let i = 0; i < 5; ...)` (inner)

## ⚡ Mengurangi Particle jika Performa Berat

Jika website terasa lambat di device tertentu:

### Kurangi particle bunga 3D
Di `js/flower3d.js`, cari:
```javascript
const particleCount = isMobile ? 30 : 60;
```
Ubah angka menjadi lebih kecil (contoh: `15` dan `30`).

### Kurangi background petals
Di `js/effects.js`, cari:
```javascript
const PETAL_COUNT = isMobile ? 12 : 25;
```
Ubah menjadi angka yang lebih kecil.

### Kurangi opening particles
Di `js/effects.js`, cari:
```javascript
const PARTICLE_COUNT = isMobile ? 30 : 60;
```
Ubah menjadi angka yang lebih kecil.

### Kurangi confetti
Di `js/effects.js`, dalam function `burst()`, cari:
```javascript
for (let i = 0; i < (isMobile ? 60 : 120); i++)
```
Ubah angka sesuai kebutuhan.

## 📋 Teknologi

- HTML5 / CSS3 / Vanilla JavaScript
- [Three.js](https://threejs.org/) (r128) — 3D flower via CDN
- [GSAP](https://greensock.com/gsap/) (3.12) — animations via CDN
- [Google Fonts](https://fonts.google.com/) — Playfair Display, Great Vibes, Poppins
- YouTube IFrame API — background music

## 📱 Browser Support

- Chrome / Edge (latest)
- Safari (latest, iOS & macOS)
- Firefox (latest)
- Samsung Internet

---

Made with 🤍 for Ana
