/**
 * @file storage.ts
 * @description Modul penyimpanan client-side berbasis localStorage
 * dengan data awal (seed) 15 siswa dan 5 jenis beasiswa internal SMK Komputama Majenang.
 */

import { Applicant, Scholarship } from '../types';

export const ADMIN_PASSWORD = 'admin123'; // Catatan: Password statis ini hanya untuk keperluan demo prototipe

export const DEFAULT_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'tahfidz',
    name: "Beasiswa Tahfidz Al-Qur'an",
    shortName: 'Tahfidz',
    description: 'Apresiasi bagi siswa yang tekun menghafal dan memelihara ayat-ayat suci Al-Qur\'an.',
    quota: 5,
    weights: {
      C1: 0.10,
      C2: 0.50,
      C3: 0.05,
      C4: 0.10,
      C5: 0.05,
      C6: 0.10,
      C7: 0.10,
    },
  },
  {
    id: 'akademik',
    name: 'Beasiswa Prestasi Akademik',
    shortName: 'Akademik',
    description: 'Diberikan kepada siswa dengan peringkat rapor unggul dan kedisiplinan belajar konsisten.',
    quota: 5,
    weights: {
      C1: 0.45,
      C2: 0.05,
      C3: 0.10,
      C4: 0.10,
      C5: 0.05,
      C6: 0.20,
      C7: 0.05,
    },
  },
  {
    id: 'non-akademik',
    name: 'Beasiswa Prestasi Non-Akademik',
    shortName: 'Non-Akademik',
    description: 'Penghargaan atas prestasi kejuaraan dalam bidang olahraga, seni, sains, atau ketangkasan.',
    quota: 3,
    weights: {
      C1: 0.10,
      C2: 0.05,
      C3: 0.50,
      C4: 0.10,
      C5: 0.05,
      C6: 0.10,
      C7: 0.10,
    },
  },
  {
    id: 'kurang-mampu',
    name: 'Beasiswa Siswa Kurang Mampu / Yatim-Dhuafa',
    shortName: 'Kurang Mampu',
    description: 'Bantuan biaya pendidikan dari yayasan/sekolah bagi siswa dengan keterbatasan ekonomi.',
    quota: 10,
    weights: {
      C1: 0.10,
      C2: 0.05,
      C3: 0.05,
      C4: 0.40,
      C5: 0.25,
      C6: 0.10,
      C7: 0.05,
    },
  },
  {
    id: 'organisasi',
    name: 'Beasiswa Kepemimpinan & Organisasi',
    shortName: 'Kepemimpinan',
    description: 'Diberikan kepada pengurus aktif OSIS, Pramuka, Rohis, dan ekstrakurikuler sekolah.',
    quota: 3,
    weights: {
      C1: 0.15,
      C2: 0.05,
      C3: 0.10,
      C4: 0.10,
      C5: 0.05,
      C6: 0.15,
      C7: 0.40,
    },
  },
];

export const INITIAL_APPLICANTS: Applicant[] = [
  // 1. Pendaftar Tahfidz
  {
    id: 'app-001',
    registrationNumber: 'REG-2026-001',
    nisn: '0071829101',
    name: 'Ahmad Fauzi Hidayat',
    grade: 'XI',
    major: 'Teknik Komputer dan Jaringan (TKJ)',
    whatsapp: '081234567801',
    scholarshipId: 'tahfidz',
    scores: { C1: 4, C2: 5, C3: 2, C4: 2, C5: 2, C6: 5, C7: 3 },
    createdAt: '2026-02-01T08:30:00Z',
    status: 'diterima',
  },
  {
    id: 'app-002',
    registrationNumber: 'REG-2026-002',
    nisn: '0071829102',
    name: 'Siti Nurhaliza Zahra',
    grade: 'XII',
    major: 'Akuntansi dan Keuangan Lembaga (AKL)',
    whatsapp: '081234567802',
    scholarshipId: 'tahfidz',
    scores: { C1: 5, C2: 5, C3: 3, C4: 3, C5: 2, C6: 5, C7: 4 },
    createdAt: '2026-02-02T09:15:00Z',
    status: 'diterima',
  },
  {
    id: 'app-003',
    registrationNumber: 'REG-2026-003',
    nisn: '0071829103',
    name: 'Muhammad Rizky Pratama',
    grade: 'X',
    major: 'Rekayasa Perangkat Lunak (RPL)',
    whatsapp: '081234567803',
    scholarshipId: 'tahfidz',
    scores: { C1: 3, C2: 4, C3: 1, C4: 2, C5: 3, C6: 4, C7: 2 },
    createdAt: '2026-02-03T10:00:00Z',
    status: 'menunggu',
  },

  // 2. Pendaftar Akademik
  {
    id: 'app-004',
    registrationNumber: 'REG-2026-004',
    nisn: '0061928204',
    name: 'Dewi Lestari Putri',
    grade: 'XII',
    major: 'Rekayasa Perangkat Lunak (RPL)',
    whatsapp: '081234567804',
    scholarshipId: 'akademik',
    scores: { C1: 5, C2: 2, C3: 4, C4: 3, C5: 2, C6: 5, C7: 3 },
    createdAt: '2026-02-04T11:20:00Z',
    status: 'diterima',
  },
  {
    id: 'app-005',
    registrationNumber: 'REG-2026-005',
    nisn: '0061928205',
    name: 'Bagas Aditya Nugraha',
    grade: 'XI',
    major: 'Teknik Bisnis Sepeda Motor (TBSM)',
    whatsapp: '081234567805',
    scholarshipId: 'akademik',
    scores: { C1: 4, C2: 2, C3: 3, C4: 2, C5: 2, C6: 5, C7: 2 },
    createdAt: '2026-02-05T08:45:00Z',
    status: 'menunggu',
  },
  {
    id: 'app-006',
    registrationNumber: 'REG-2026-006',
    nisn: '0061928206',
    name: 'Nabila Syakirah',
    grade: 'X',
    major: 'Otomatisasi dan Tata Kelola Perkantoran (OTKP)',
    whatsapp: '081234567806',
    scholarshipId: 'akademik',
    scores: { C1: 5, C2: 3, C3: 3, C4: 4, C5: 1, C6: 4, C7: 3 },
    createdAt: '2026-02-06T14:10:00Z',
    status: 'menunggu',
  },

  // 3. Pendaftar Non-Akademik
  {
    id: 'app-007',
    registrationNumber: 'REG-2026-007',
    nisn: '0081234507',
    name: 'Fikri Haikal Ramadhan',
    grade: 'XI',
    major: 'Teknik Kendaraan Ringan Otomotif (TKRO)',
    whatsapp: '081234567807',
    scholarshipId: 'non-akademik',
    scores: { C1: 3, C2: 1, C3: 5, C4: 3, C5: 2, C6: 4, C7: 3 },
    createdAt: '2026-02-07T09:30:00Z',
    status: 'diterima',
  },
  {
    id: 'app-008',
    registrationNumber: 'REG-2026-008',
    nisn: '0081234508',
    name: 'Dimas Anggara Saputra',
    grade: 'X',
    major: 'Teknik Komputer dan Jaringan (TKJ)',
    whatsapp: '081234567808',
    scholarshipId: 'non-akademik',
    scores: { C1: 3, C2: 2, C3: 4, C4: 2, C5: 1, C6: 5, C7: 4 },
    createdAt: '2026-02-08T13:00:00Z',
    status: 'menunggu',
  },

  // 4. Pendaftar Kurang Mampu
  {
    id: 'app-009',
    registrationNumber: 'REG-2026-009',
    nisn: '0078899109',
    name: 'Rina Kusuma Astuti',
    grade: 'XII',
    major: 'Akuntansi dan Keuangan Lembaga (AKL)',
    whatsapp: '081234567809',
    scholarshipId: 'kurang-mampu',
    scores: { C1: 4, C2: 2, C3: 2, C4: 1, C5: 5, C6: 5, C7: 2 },
    createdAt: '2026-02-09T10:15:00Z',
    status: 'diterima',
  },
  {
    id: 'app-010',
    registrationNumber: 'REG-2026-010',
    nisn: '0078899110',
    name: 'Arif Maulana Yusuf',
    grade: 'XI',
    major: 'Teknik Kendaraan Ringan Otomotif (TKRO)',
    whatsapp: '081234567810',
    scholarshipId: 'kurang-mampu',
    scores: { C1: 3, C2: 1, C3: 1, C4: 1, C5: 4, C6: 4, C7: 2 },
    createdAt: '2026-02-10T11:40:00Z',
    status: 'diterima',
  },
  {
    id: 'app-011',
    registrationNumber: 'REG-2026-011',
    nisn: '0078899111',
    name: 'Tia Maulida Rahma',
    grade: 'X',
    major: 'Otomatisasi dan Tata Kelola Perkantoran (OTKP)',
    whatsapp: '081234567811',
    scholarshipId: 'kurang-mampu',
    scores: { C1: 4, C2: 2, C3: 1, C4: 2, C5: 3, C6: 5, C7: 3 },
    createdAt: '2026-02-11T09:00:00Z',
    status: 'menunggu',
  },
  {
    id: 'app-012',
    registrationNumber: 'REG-2026-012',
    nisn: '0078899112',
    name: 'Wahyu Hidayatullah',
    grade: 'XI',
    major: 'Teknik Bisnis Sepeda Motor (TBSM)',
    whatsapp: '081234567812',
    scholarshipId: 'kurang-mampu',
    scores: { C1: 2, C2: 1, C3: 1, C4: 1, C5: 5, C6: 4, C7: 1 },
    createdAt: '2026-02-12T14:30:00Z',
    status: 'diterima',
  },

  // 5. Pendaftar Kepemimpinan & Organisasi
  {
    id: 'app-013',
    registrationNumber: 'REG-2026-013',
    nisn: '0067788113',
    name: 'Bayu Prasetyo',
    grade: 'XII',
    major: 'Teknik Komputer dan Jaringan (TKJ)',
    whatsapp: '081234567813',
    scholarshipId: 'organisasi',
    scores: { C1: 4, C2: 2, C3: 3, C4: 3, C5: 2, C6: 5, C7: 5 },
    createdAt: '2026-02-13T08:15:00Z',
    status: 'diterima',
  },
  {
    id: 'app-014',
    registrationNumber: 'REG-2026-014',
    nisn: '0067788114',
    name: 'Putri Ayu Wulandari',
    grade: 'XI',
    major: 'Otomatisasi dan Tata Kelola Perkantoran (OTKP)',
    whatsapp: '081234567814',
    scholarshipId: 'organisasi',
    scores: { C1: 4, C2: 3, C3: 2, C4: 2, C5: 2, C6: 5, C7: 4 },
    createdAt: '2026-02-14T10:50:00Z',
    status: 'menunggu',
  },
  // 6. Siswa yang awalnya mendaftar Tahfidz tetapi skornya lebih cocok di Kurang Mampu (bagus untuk demo rekomendasi)
  {
    id: 'app-015',
    registrationNumber: 'REG-2026-015',
    nisn: '0089911215',
    name: 'Zulham Efendi',
    grade: 'X',
    major: 'Rekayasa Perangkat Lunak (RPL)',
    whatsapp: '081234567815',
    scholarshipId: 'tahfidz',
    scores: { C1: 3, C2: 1, C3: 1, C4: 1, C5: 5, C6: 4, C7: 2 },
    createdAt: '2026-02-15T13:20:00Z',
    status: 'menunggu',
  },
];

const STORAGE_KEYS = {
  SCHOLARSHIPS: 'smk_komputama_scholarships_v1',
  APPLICANTS: 'smk_komputama_applicants_v1',
  ADMIN_AUTH: 'smk_komputama_admin_auth_v1',
};

export function getStoredScholarships(): Scholarship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS);
    if (!raw) {
      saveStoredScholarships(DEFAULT_SCHOLARSHIPS);
      return DEFAULT_SCHOLARSHIPS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SCHOLARSHIPS;
  }
}

export function saveStoredScholarships(scholarships: Scholarship[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
  } catch (err) {
    console.error('Gagal menyimpan beasiswa ke localStorage:', err);
  }
}

export function getStoredApplicants(): Applicant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
    if (!raw) {
      saveStoredApplicants(INITIAL_APPLICANTS);
      return INITIAL_APPLICANTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICANTS;
  }
}

export function saveStoredApplicants(applicants: Applicant[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(applicants));
  } catch (err) {
    console.error('Gagal menyimpan pendaftar ke localStorage:', err);
  }
}

export function addApplicant(newApplicant: Applicant): void {
  const applicants = getStoredApplicants();
  applicants.unshift(newApplicant);
  saveStoredApplicants(applicants);
}

export function updateApplicant(updated: Applicant): void {
  const applicants = getStoredApplicants();
  const index = applicants.findIndex((a) => a.id === updated.id);
  if (index !== -1) {
    applicants[index] = updated;
    saveStoredApplicants(applicants);
  }
}

export function deleteApplicant(id: string): void {
  const applicants = getStoredApplicants().filter((a) => a.id !== id);
  saveStoredApplicants(applicants);
}

export function switchApplicantScholarship(applicantId: string, newScholarshipId: string): Applicant | null {
  const applicants = getStoredApplicants();
  const target = applicants.find((a) => a.id === applicantId);
  if (!target) return null;

  target.scholarshipId = newScholarshipId;
  saveStoredApplicants(applicants);
  return target;
}

export function resetToSeedData(): void {
  saveStoredScholarships(DEFAULT_SCHOLARSHIPS);
  saveStoredApplicants(INITIAL_APPLICANTS);
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminAuthenticated(auth: boolean): void {
  if (auth) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
}

/**
 * Utilitas untuk mengunduh string CSV ke file di browser pengguna
 */
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
