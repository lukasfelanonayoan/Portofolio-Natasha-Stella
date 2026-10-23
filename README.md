# Portofolio Natasha Stella

Website portofolio & rate card content creator (HTML, CSS, JavaScript + Bootstrap).

**Repo:** [lukasfelanonayoan/Portofolio-Natasha-Stella](https://github.com/lukasfelanonayoan/Portofolio-Natasha-Stella)

**URL setelah deploy:**  
https://lukasfelanonayoan.github.io/Portofolio-Natasha-Stella/

---

## Cara deploy ke GitHub Pages

### 1. Push project ke GitHub

Pastikan semua file sudah di-commit dan di-push ke branch `master` (atau `main`):

```bash
git add .
git commit -m "Siap deploy GitHub Pages"
git push origin master
```

### 2. Aktifkan GitHub Pages

1. Buka repo di GitHub
2. Klik **Settings**
3. Menu kiri: **Pages**
4. Di bagian **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `master` (atau `main`)
   - **Folder:** `/ (root)`
5. Klik **Save**

### 3. Tunggu & buka situsnya

- Proses deploy biasanya 1–3 menit
- Status bisa dicek di tab **Actions** atau di halaman **Pages**
- Buka:  
  https://lukasfelanonayoan.github.io/Portofolio-Natasha-Stella/

> Jika halaman 404, tunggu sebentar lalu hard refresh (`Ctrl + F5`). Pastikan `index.html` ada di root repo.

---

## Update website setelah diubah

Setiap kali ada perubahan:

```bash
git add .
git commit -m "Update konten website"
git push origin master
```

GitHub Pages akan otomatis publish ulang dalam beberapa menit.

---

## Cara buka di lokal

Double-click `index.html`, atau buka file itu dari browser.

Tidak perlu `npm install` atau command server.

---

## Struktur file

```
Portofolio-Stella/
├── index.html          # Halaman utama
├── styles.css          # Styling
├── script.js           # Interaksi + sync foto profil
├── assets/
│   └── profile.jpg     # Fallback foto profil
└── README.md
```

---

## Edit rate card / harga

Buka `index.html`, cari bagian **Rate Card**, lalu ubah teks di dalam:

```html
<p class="rate-price">Rp 350.000 <span>– Rp 600.000</span></p>
```

Simpan → commit → push → website ikut ter-update.

---

## Catatan

- Foto profil di-sync dari Threads / TikTok (cadangan: `assets/profile.jpg`)
- Bootstrap & Google Fonts dimuat dari CDN (perlu koneksi internet)
- Cocok untuk GitHub Pages karena murni static (HTML/CSS/JS)
