# Sistem Penerimaan Beasiswa SMK Komputama Majenang (Metode SAW)

Aplikasi Web Sistem Pendukung Keputusan (SPK / DSS) untuk seleksi beasiswa internal di SMK Komputama Majenang menggunakan metode **Simple Additive Weighting (SAW)**.

Dibangun dengan **React 19 + Vite + TypeScript + Tailwind CSS + react-router-dom**. Sistem berjalan 100% di browser (client-side) dengan data tersimpan di `localStorage` dan otomatis terisi data contoh (15 siswa) saat pertama dibuka.

---

## Fitur Utama

1. **Beranda**: Informasi 5 jenis beasiswa internal, kuota, dan langkah pendaftaran.
2. **Form Pendaftaran 2-Langkah**:
   - Langkah 1: Data Diri (Nama, NISN, Kelas, Jurusan, WhatsApp, Pilihan Beasiswa).
   - Langkah 2: 7 Kriteria SAW (C1–C7) dengan pilihan dropdown praktis.
3. **Hasil & Rekomendasi Instan**:
   - Skor SAW preferensi $V$, kategori kelayakan (Sangat Layak, Layak, Belum Layak).
   - Posisi peringkat saat ini terhadap kuota.
   - Perbandingan kecocokan di semua 5 beasiswa.
   - **Rekomendasi Cerdas**: Rekomendasi pindah beasiswa lain jika belum lolos di pilihan utama (dengan tombol 1-klik "Pindah ke beasiswa ini").
   - Transparansi perhitungan langkah demi langkah (tabel nilai asli, normalisasi, bobot, dan perkalian).
   - Tombol **Cetak Bukti Pendaftaran**.
4. **Cek Status**: Cukup masukkan NISN untuk memantau status kelulusan kapan saja.
5. **Panel Admin (Password: `admin123`)**:
   - Dashboard statistik pendaftar dan kuota.
   - Tabel pendaftar lengkap dengan pencarian, filter, dan hapus.
   - Peringkat ranking per beasiswa dengan tombol otomatis "Terima Sesuai Kuota" dan ubah status manual.
   - Pengaturan nama, kuota, dan bobot beasiswa dengan validasi real-time (total bobot = 1.00).
   - Ekspor data pendaftar & ranking ke file CSV.
   - Tombol Reset ke Data Contoh.

---

## 5 Jenis Beasiswa Internal & Bobot SAW

| Beasiswa | Kuota | C1 (Rapor) | C2 (Tahfidz) | C3 (Lomba) | C4 (Gaji Ortu - Cost) | C5 (Keluarga) | C6 (Kehadiran) | C7 (Organisasi) |
|---|---|---|---|---|---|---|---|---|
| **Tahfidz** | 5 | 0.10 | 0.50 | 0.05 | 0.10 | 0.05 | 0.10 | 0.10 |
| **Prestasi Akademik** | 5 | 0.45 | 0.05 | 0.10 | 0.10 | 0.05 | 0.20 | 0.05 |
| **Prestasi Non-Akademik** | 3 | 0.10 | 0.05 | 0.50 | 0.10 | 0.05 | 0.10 | 0.10 |
| **Kurang Mampu / Yatim** | 10 | 0.10 | 0.05 | 0.05 | 0.40 | 0.25 | 0.10 | 0.05 |
| **Kepemimpinan & Organisasi** | 3 | 0.15 | 0.05 | 0.10 | 0.10 | 0.05 | 0.15 | 0.40 |

> **Metode Normalisasi Skala Tetap (1–5):**
> - Kriteria Benefit: $r = x / 5$
> - Kriteria Cost (C4): $r = 1 / x$
> - Nilai Preferensi: $V = \sum_{j=1}^{n} (w_j \times r_{ij})$

---

## Cara Menjalankan di Komputer Lokal

1. **Clone repository atau ekstrak folder project**:
   ```bash
   git clone <url-repo-anda>
   cd <nama-folder>
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan mode development**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000` (atau port yang tertera di terminal).

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```
   Hasil build akan tersimpan di direktori `dist/`.

---

## Cara Deploy ke Vercel

1. **Push kode ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Sistem Beasiswa SAW SMK Komputama Majenang"
   git branch -M main
   git remote add origin https://github.com/<username-anda>/<nama-repo>.git
   git push -u origin main
   ```

2. **Deploy di Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik **"Add New..."** lalu pilih **"Project"**.
   - Pilih repositori GitHub yang baru saja Anda buat, lalu klik **"Import"**.
   - Framework Preset otomatis mendeteksi **Vite**.
   - Klik **"Deploy"**.
   - Selesai! File `vercel.json` sudah disediakan sehingga seluruh rute URL SPA akan otomatis diarahkan ke `index.html`.
