import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Printer,
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Search,
} from 'lucide-react';
import {
  getStoredApplicants,
  getStoredScholarships,
  switchApplicantScholarship,
} from '../lib/storage';
import {
  evaluateAllScholarshipsForApplicant,
  calculateRankingsForScholarship,
} from '../lib/saw';
import { Applicant, Scholarship } from '../types';
import SAWCalculationAccordion from '../components/SAWCalculationAccordion';
import PrintRegistrationModal from '../components/PrintRegistrationModal';

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [switchSuccessMsg, setSwitchSuccessMsg] = useState<string | null>(null);

  const loadData = () => {
    const apps = getStoredApplicants();
    const schs = getStoredScholarships();
    setAllApplicants(apps);
    setScholarships(schs);

    const target = apps.find((a) => a.id === id);
    if (target) {
      setApplicant(target);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!applicant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Data Pendaftar Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">
          Nomor pendaftaran atau ID siswa tidak valid atau data telah direset.
        </p>
        <Link
          to="/daftar"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
        >
          Daftar Sekarang
        </Link>
      </div>
    );
  }

  // Cari objek beasiswa saat ini
  const currentScholarship =
    scholarships.find((s) => s.id === applicant.scholarshipId) || scholarships[0];

  if (!currentScholarship) {
    return null;
  }

  // Hitung evaluasi lengkap di semua beasiswa
  const multiEval = evaluateAllScholarshipsForApplicant(applicant, allApplicants, scholarships);
  const currentEval = multiEval.current;

  // Hitung ranking riil di beasiswa terpilih
  const currentRankings = calculateRankingsForScholarship(allApplicants, currentScholarship);
  const myRankingData = currentRankings.find((r) => r.applicant.id === applicant.id);
  const realRank = myRankingData ? myRankingData.rank : 1;
  const inQuota = realRank <= currentScholarship.quota;

  const handleSwitchScholarship = (newSchId: string, newSchName: string) => {
    const updated = switchApplicantScholarship(applicant.id, newSchId);
    if (updated) {
      setApplicant({ ...updated });
      setSwitchSuccessMsg(`Pilihan beasiswa berhasil dialihkan ke "${newSchName}".`);
      loadData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Badge kategori warna
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Sangat Layak':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
        };
      case 'Layak':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
        };
    }
  };

  const currentBadge = getCategoryBadge(currentEval.category);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Toast Notification */}
      {switchSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{switchSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSwitchSuccessMsg(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Hasil Evaluasi Simple Additive Weighting (SAW)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hasil Seleksi: {applicant.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            NISN: <span className="font-mono font-bold text-slate-700">{applicant.nisn}</span> ·
            Kelas {applicant.grade} ({applicant.major}) · No. Registrasi:{' '}
            <span className="font-mono">{applicant.registrationNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti Pendaftaran</span>
          </button>
        </div>
      </div>

      {/* 1. KARTU BESAR SKOR SAW BEASISWA PILIHAN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pilihan Beasiswa Saat Ini
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentScholarship.name}
            </h2>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              {currentScholarship.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentBadge.bg}`}
              >
                {currentBadge.icon}
                <span>Kategori: {currentEval.category}</span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  inQuota
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  Peringkat #{realRank} dari {currentRankings.length} Pendaftar
                </span>
                <span className="text-slate-400">·</span>
                <span>{inQuota ? 'Masuk Kuota' : 'Di Luar Kuota'}</span>
              </div>
            </div>
          </div>

          {/* Nilai Preferensi V Callout Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 p-6 rounded-2xl text-center min-w-[200px] shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Nilai Preferensi (V)
            </span>
            <div className="text-4xl font-extrabold text-emerald-900 font-mono tracking-tight">
              {currentEval.scoreV.toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-700 font-mono mt-1 block">
              Skala 0.00 – 1.00
            </span>
            <div className="mt-3 text-[11px] text-slate-600 bg-white/80 py-1 px-2 rounded-lg border border-emerald-100">
              Kuota Tersedia: <strong className="text-slate-900">{currentScholarship.quota} Siswa</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KOTAK REKOMENDASI OTOMATIS */}
      <div
        className={`rounded-2xl p-6 border transition-all ${
          inQuota && currentEval.category !== 'Belum Layak'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              inQuota && currentEval.category !== 'Belum Layak'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">
                Rekomendasi Cerdas Sistem
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/70 border border-current">
                Analisis Otomatis
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed">
              {multiEval.message}
            </p>

            {/* Alternatif Beasiswa jika ada */}
            {multiEval.recommendations.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-semibold block text-slate-800">
                  Opsi Beasiswa Lain dengan Peluang Lebih Tinggi:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {multiEval.recommendations.map((rec) => {
                    const sch = scholarships.find((s) => s.id === rec.scholarshipId);
                    return (
                      <div
                        key={rec.scholarshipId}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs hover:border-emerald-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-xs text-slate-900">
                              {rec.scholarshipName}
                            </span>
                            <span className="font-mono font-bold text-emerald-700 text-xs">
                              Skor: {rec.scoreV.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {sch?.description}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-600">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold">
                              {rec.category}
                            </span>
                            <span>Posisi Masuk Kuota</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSwitchScholarship(rec.scholarshipId, rec.scholarshipName)}
                          className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Pindah ke Beasiswa Ini</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. KECOCOKAN KAMU DI SEMUA BEASISWA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Tingkat Kecocokan di Semua Beasiswa
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan nilai preferensi SAW di 5 kategori beasiswa SMK Komputama Majenang.
          </p>
        </div>

        <div className="space-y-4">
          {multiEval.all.map((item, index) => {
            const isHighest = index === 0;
            const isCurrent = item.scholarshipId === applicant.scholarshipId;
            const percent = Math.min(100, Math.round(item.scoreV * 100));

            return (
              <div
                key={item.scholarshipId}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500/60 bg-emerald-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {item.scholarshipName}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                        Pilihan Kamu
                      </span>
                    )}
                    {isHighest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Paling Cocok
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold text-slate-600">
                      {item.category}
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-700">
                      {item.scoreV.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.scoreV >= 0.75
                        ? 'bg-emerald-600'
                        : item.scoreV >= 0.60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Action to switch if not current */}
                {!isCurrent && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSwitchScholarship(item.scholarshipId, item.scholarshipName)}
                      className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                    >
                      <span>Alihkan pilihan ke beasiswa ini</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ACCORDION DETAIL CARA HITUNG (UNTUK PRESENTASI TUGAS) */}
      <SAWCalculationAccordion
        evaluation={currentEval}
        scholarshipQuota={currentScholarship.quota}
      />

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          ← Kembali ke Beranda
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/status"
            className="w-full sm:w-auto text-center px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Pantau Status Nanti
          </Link>
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="w-full sm:w-auto text-center px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti Pendaftaran</span>
          </button>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <PrintRegistrationModal
          applicant={applicant}
          scholarship={currentScholarship}
          evaluation={currentEval}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
