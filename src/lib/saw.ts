/**
 * @file saw.ts
 * @description Modul Logika Perhitungan Simple Additive Weighting (SAW)
 * untuk Sistem Penerimaan Beasiswa SMK Komputama Majenang.
 *
 * Menggunakan pendekatan Skala Tetap (Fixed Scale 1-5) sehingga nilai
 * preferensi tiap siswa dapat langsung dihitung secara deterministik dan adil:
 * 1. Kriteria Benefit: r_ij = x_ij / Max(x) -> r = x / 5
 * 2. Kriteria Cost: r_ij = Min(x) / x_ij -> r = 1 / x (karena skor minimum = 1)
 * 3. Nilai Preferensi (V): V_i = ∑ (w_j * r_ij)
 */

import { CRITERIA } from '../data/criteria';
import {
  Applicant,
  CriterionCode,
  MultiScholarshipEvaluation,
  SAWEvaluation,
  SAWStepBreakdown,
  Scholarship,
} from '../types';

/**
 * Menghitung normalisasi matriks (r_ij) untuk satu kriteria
 * @param code Kode kriteria (C1 - C7)
 * @param rawScore Skor mentah dari dropdown (1 - 5)
 * @returns Nilai normalisasi r (rentang 0.2 - 1.0)
 */
export function normalizeScore(code: CriterionCode, rawScore: number): number {
  const criterion = CRITERIA.find((c) => c.code === code);
  const type = criterion ? criterion.type : 'benefit';

  // Pastikan skor mentah berada di antara 1 dan 5
  const clampedScore = Math.max(1, Math.min(5, rawScore));

  if (type === 'cost') {
    // Normalisasi Cost: Min(x) / x_ij = 1 / x
    return Number((1 / clampedScore).toFixed(4));
  } else {
    // Normalisasi Benefit: x_ij / Max(x) = x / 5
    return Number((clampedScore / 5).toFixed(4));
  }
}

/**
 * Menentukan label kategori kelayakan berdasarkan nilai preferensi V
 * - V >= 0.75 : "Sangat Layak"
 * - 0.60 <= V < 0.75 : "Layak"
 * - V < 0.60 : "Belum Layak"
 */
export function determineCategory(scoreV: number): 'Sangat Layak' | 'Layak' | 'Belum Layak' {
  if (scoreV >= 0.75) return 'Sangat Layak';
  if (scoreV >= 0.60) return 'Layak';
  return 'Belum Layak';
}

/**
 * Menghitung skor SAW lengkap beserta rincian langkah demi langkah (untuk presentasi tugas)
 */
export function evaluateApplicantForScholarship(
  scores: Record<CriterionCode, number>,
  scholarship: Scholarship
): SAWEvaluation {
  const breakdown: SAWStepBreakdown[] = [];
  let totalV = 0;

  for (const criterion of CRITERIA) {
    const code = criterion.code;
    const rawScore = scores[code] ?? 1;
    const normalized = normalizeScore(code, rawScore);
    const weight = scholarship.weights[code] ?? 0;
    const weighted = Number((normalized * weight).toFixed(4));

    totalV += weighted;

    breakdown.push({
      code,
      name: criterion.name,
      type: criterion.type,
      rawScore,
      normalizedScore: normalized,
      weight,
      weightedScore: weighted,
    });
  }

  // Bulatkan total V ke 4 angka di belakang koma
  const finalV = Number(totalV.toFixed(4));
  const category = determineCategory(finalV);

  return {
    scholarshipId: scholarship.id,
    scholarshipName: scholarship.name,
    scoreV: finalV,
    category,
    breakdown,
  };
}

/**
 * Menghitung ranking dan kuota pendaftar dalam beasiswa tertentu
 */
export function calculateRankingsForScholarship(
  applicants: Applicant[],
  scholarship: Scholarship
): Array<{ applicant: Applicant; evaluation: SAWEvaluation; rank: number; inQuota: boolean }> {
  // Filter hanya pendaftar yang memilih beasiswa ini
  const targetedApplicants = applicants.filter((a) => a.scholarshipId === scholarship.id);

  // Evaluasi SAW untuk masing-masing pendaftar
  const scored = targetedApplicants.map((applicant) => {
    const evaluation = evaluateApplicantForScholarship(applicant.scores, scholarship);
    return {
      applicant,
      evaluation,
    };
  });

  // Urutkan dari nilai V tertinggi ke terendah
  // Jika V sama, urutkan dari waktu pendaftaran lebih awal
  scored.sort((a, b) => {
    if (b.evaluation.scoreV !== a.evaluation.scoreV) {
      return b.evaluation.scoreV - a.evaluation.scoreV;
    }
    return new Date(a.applicant.createdAt).getTime() - new Date(b.applicant.createdAt).getTime();
  });

  return scored.map((item, index) => {
    const rank = index + 1;
    const inQuota = rank <= scholarship.quota;
    item.evaluation.rank = rank;
    item.evaluation.totalApplicants = scored.length;
    item.evaluation.inQuota = inQuota;

    return {
      applicant: item.applicant,
      evaluation: item.evaluation,
      rank,
      inQuota,
    };
  });
}

/**
 * Menghitung kecocokan siswa di SEMUA beasiswa yang tersedia
 * Menghasilkan rekomendasi cerdas otomatis jika pilihan utama belum ideal.
 */
export function evaluateAllScholarshipsForApplicant(
  applicant: Applicant,
  allApplicants: Applicant[],
  scholarships: Scholarship[]
): MultiScholarshipEvaluation {
  // Evaluasi di semua beasiswa
  const allEvaluations: SAWEvaluation[] = scholarships.map((sch) => {
    const evalResult = evaluateApplicantForScholarship(applicant.scores, sch);

    // Hitung posisi hipotetis jika dia ada di beasiswa tersebut
    // Gabungkan pendaftar beasiswa tersebut (kecuali pelamar saat ini jika pindah)
    const otherInSch = allApplicants.filter(
      (a) => a.scholarshipId === sch.id && a.id !== applicant.id
    );

    const scoresList = otherInSch.map((a) => evaluateApplicantForScholarship(a.scores, sch).scoreV);
    scoresList.push(evalResult.scoreV);
    scoresList.sort((a, b) => b - a);

    const hypotheticalRank = scoresList.indexOf(evalResult.scoreV) + 1;
    evalResult.rank = hypotheticalRank;
    evalResult.totalApplicants = scoresList.length;
    evalResult.inQuota = hypotheticalRank <= sch.quota;

    return evalResult;
  });

  // Urutkan dari skor V tertinggi ke terendah
  const sortedEvaluations = [...allEvaluations].sort((a, b) => b.scoreV - a.scoreV);
  const bestFit = sortedEvaluations[0];

  // Cari evaluasi beasiswa yang saat ini dipilih
  const currentEval =
    allEvaluations.find((e) => e.scholarshipId === applicant.scholarshipId) || allEvaluations[0];

  // Logika rekomendasi:
  // 1. Jika pilihan saat ini "Layak" / "Sangat Layak" dan masuk kuota:
  //    -> "Selamat! Kamu cocok di beasiswa ini."
  // 2. Jika "Belum Layak" ATAU di luar kuota:
  //    -> Tampilkan rekomendasi maksimal 2 beasiswa lain yang skornya >= 0.60 dan berpeluang masuk kuota.
  const isCurrentEligibleAndInQuota =
    currentEval.category !== 'Belum Layak' && (currentEval.inQuota ?? false);

  let message = '';
  const recommendations: SAWEvaluation[] = [];

  if (isCurrentEligibleAndInQuota) {
    message = `Selamat! Kamu sangat cocok di ${currentEval.scholarshipName} dengan skor SAW ${currentEval.scoreV.toFixed(2)} (${currentEval.category}) dan saat ini berada di peringkat ${currentEval.rank} dari kuota ${
      scholarships.find((s) => s.id === currentEval.scholarshipId)?.quota ?? 5
    }.`;
  } else {
    // Cari alternatif lain di luar beasiswa yang dipilih saat ini
    const alternatives = sortedEvaluations.filter(
      (e) => e.scholarshipId !== applicant.scholarshipId && e.scoreV >= 0.60 && (e.inQuota ?? true)
    );

    if (alternatives.length > 0) {
      recommendations.push(...alternatives.slice(0, 2));
      const topAlt = recommendations[0];
      message = `Skor kamu di ${currentEval.scholarshipName} saat ini ${currentEval.scoreV.toFixed(2)} (${
        currentEval.category
      }${!currentEval.inQuota ? ', di luar kuota' : ''}). Kamu memiliki peluang lebih besar di ${
        topAlt.scholarshipName
      } dengan skor ${topAlt.scoreV.toFixed(2)} (${topAlt.category}) dan posisi masuk kuota.`;
    } else {
      // Jika tidak ada yang masuk kuota dengan skor >= 0.60, cari skor tertinggi kedua
      const fallbackAlt = sortedEvaluations.find((e) => e.scholarshipId !== applicant.scholarshipId);
      if (fallbackAlt && fallbackAlt.scoreV > currentEval.scoreV) {
        recommendations.push(fallbackAlt);
        message = `Skor kamu di ${currentEval.scholarshipName} saat ini ${currentEval.scoreV.toFixed(2)} (${
          currentEval.category
        }). Kamu memiliki potensi nilai lebih tinggi di ${fallbackAlt.scholarshipName} (skor ${fallbackAlt.scoreV.toFixed(2)}).`;
      } else {
        message = `Skor kamu di ${currentEval.scholarshipName} adalah ${currentEval.scoreV.toFixed(2)} (${currentEval.category}). Tetap pantau hasil seleksi berkala.`;
      }
    }
  }

  return {
    current: currentEval,
    all: sortedEvaluations,
    bestFit,
    recommendations,
    message,
  };
}
