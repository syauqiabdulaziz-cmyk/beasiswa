import { CriterionDefinition } from '../types';

export const MAJORS = [
  'Teknik Komputer dan Jaringan (TKJ)',
  'Rekayasa Perangkat Lunak (RPL)',
  'Akuntansi dan Keuangan Lembaga (AKL)',
  'Otomatisasi dan Tata Kelola Perkantoran (OTKP)',
  'Teknik Bisnis Sepeda Motor (TBSM)',
  'Teknik Kendaraan Ringan Otomotif (TKRO)',
] as const;

export const GRADES = ['X', 'XI', 'XII'] as const;

export const CRITERIA: CriterionDefinition[] = [
  {
    code: 'C1',
    name: 'Nilai Rata-rata Rapor',
    type: 'benefit',
    description: 'Rata-rata nilai rapor semester terakhir',
    question: 'Berapa rata-rata nilai rapor terakhir kamu?',
    options: [
      { label: '≥ 90 (Sangat Baik / Istimewa)', score: 5 },
      { label: '85 – 89 (Baik Sekali)', score: 4 },
      { label: '80 – 84 (Baik)', score: 3 },
      { label: '75 – 79 (Cukup)', score: 2 },
      { label: '< 75 (Kurang)', score: 1 },
    ],
  },
  {
    code: 'C2',
    name: 'Hafalan Al-Qur\'an',
    type: 'benefit',
    description: 'Jumlah juz Al-Qur\'an yang telah dihafal dan mutqin',
    question: 'Berapa banyak hafalan Al-Qur\'an yang sudah kamu miliki?',
    options: [
      { label: '≥ 15 Juz (Tahfidz Lanjutan)', score: 5 },
      { label: '10 – 14 Juz', score: 4 },
      { label: '5 – 9 Juz', score: 3 },
      { label: '1 – 4 Juz (Juz Amma / Dasar)', score: 2 },
      { label: 'Belum ada hafalan juz', score: 1 },
    ],
  },
  {
    code: 'C3',
    name: 'Prestasi Lomba Tertinggi',
    type: 'benefit',
    description: 'Tingkat kejuaraan lomba akademik maupun non-akademik yang pernah diraih',
    question: 'Apa tingkat prestasi lomba tertinggi yang pernah kamu raih?',
    options: [
      { label: 'Juara Tingkat Provinsi / Nasional', score: 5 },
      { label: 'Juara Tingkat Kabupaten', score: 4 },
      { label: 'Juara Tingkat Kecamatan', score: 3 },
      { label: 'Juara Tingkat Sekolah', score: 2 },
      { label: 'Belum pernah menjuarai lomba', score: 1 },
    ],
  },
  {
    code: 'C4',
    name: 'Penghasilan Orang Tua / Bulan',
    type: 'cost',
    description: 'Total pendapatan orang tua per bulan (kriteria biaya / cost: makin kecil makin diprioritaskan)',
    question: 'Berapa kisaran total penghasilan orang tua per bulan?',
    options: [
      { label: '< Rp 1.000.000 / bulan', score: 1 },
      { label: 'Rp 1.000.000 – Rp 2.000.000 / bulan', score: 2 },
      { label: 'Rp 2.000.000 – Rp 3.000.000 / bulan', score: 3 },
      { label: 'Rp 3.000.000 – Rp 5.000.000 / bulan', score: 4 },
      { label: '> Rp 5.000.000 / bulan', score: 5 },
    ],
  },
  {
    code: 'C5',
    name: 'Kondisi Keluarga & Tanggungan',
    type: 'benefit',
    description: 'Status orang tua dan jumlah anggota keluarga yang menjadi tanggungan',
    question: 'Bagaimana kondisi keluarga dan tanggungan orang tua kamu?',
    options: [
      { label: 'Yatim Piatu (Tidak memiliki ayah dan ibu)', score: 5 },
      { label: 'Yatim atau Piatu (Salah satu meninggal)', score: 4 },
      { label: 'Orang tua lengkap & jumlah tanggungan ≥ 5 anak', score: 3 },
      { label: 'Orang tua lengkap & jumlah tanggungan 3 – 4 anak', score: 2 },
      { label: 'Orang tua lengkap & jumlah tanggungan ≤ 2 anak', score: 1 },
    ],
  },
  {
    code: 'C6',
    name: 'Tingkat Kehadiran',
    type: 'benefit',
    description: 'Persentase presensi kehadiran di sekolah selama semester berjalan',
    question: 'Berapa persentase kehadiran kamu di sekolah?',
    options: [
      { label: '≥ 95% (Hampir tidak pernah absen)', score: 5 },
      { label: '90% – 94% (Sangat rajin)', score: 4 },
      { label: '85% – 89% (Cukup rajin)', score: 3 },
      { label: '80% – 84% (Standar minimal)', score: 2 },
      { label: '< 80% (Sering absen / izin)', score: 1 },
    ],
  },
  {
    code: 'C7',
    name: 'Keaktifan Organisasi / Ekskul',
    type: 'benefit',
    description: 'Peran dan keikutsertaan dalam organisasi kesiswaan (OSIS, Pramuka, Rohis, dll)',
    question: 'Sejauh mana keaktifan kamu di organisasi atau ekstrakurikuler sekolah?',
    options: [
      { label: 'Pengurus Inti (Ketua, Wakil, Sekretaris, Bendahara)', score: 5 },
      { label: 'Pengurus Bidang / Koordinator Seksi', score: 4 },
      { label: 'Anggota Aktif lebih dari 1 organisasi / ekskul', score: 3 },
      { label: 'Anggota di 1 organisasi / ekskul', score: 2 },
      { label: 'Tidak mengikuti organisasi / ekskul', score: 1 },
    ],
  },
];
