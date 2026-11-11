import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Printer,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { getStoredApplicants, getStoredScholarships } from '../lib/storage';
import { calculateRankingsForScholarship, evaluateApplicantForScholarship } from '../lib/saw';
import { Applicant, Scholarship, SAWEvaluation } from '../types';
import PrintRegistrationModal from '../components/PrintRegistrationModal';

export default function Status() {
  const [searchParams] = useSearchParams();
  const queryNisn = searchParams.get('nisn') || '';

  const [nisnInput, setNisnInput] = useState(queryNisn);
  const [searchedApplicant, setSearchedApplicant] = useState<Applicant | null>(null);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [evaluation, setEvaluation] = useState<SAWEvaluation | null>(null);
  const [rankInfo, setRankInfo] = useState<{ rank: number; inQuota: boolean; total: number } | null>(
    null
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const performSearch = (nisnToSearch: string) => {
    const clean = nisnToSearch.trim();
    if (!clean) return;

    setHasSearched(true);
    const applicants = getStoredApplicants();
    const scholarships = getStoredScholarships();

    const found = applicants.find((a) => a.nisn === clean);
    if (found) {
      setSearchedApplicant(found);
      const sch = scholarships.find((s) => s.id === found.scholarshipId) || scholarships[0];
      setScholarship(sch);

      // Hitung SAW
      const ev = evaluateApplicantForScholarship(found.scores, sch);
      setEvaluation(ev);

      // Hitung Ranking
      const rankings = calculateRankingsForScholarship(applicants, sch);
      const myRank = rankings.find((r) => r.applicant.id === found.id);
      if (myRank) {
        setRankInfo({
          rank: myRank.rank,
          inQuota: myRank.inQuota,
          total: rankings.length,
        });
      }
    } else {
      setSearchedApplicant(null);
      setScholarship(null);
      setEvaluation(null);
      setRankInfo(null);
    }
  };

  useEffect(() => {
    if (queryNisn) {
      setNisnInput(queryNisn);
      performSearch(queryNisn);
    }
  }, [queryNisn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(nisnInput);
  };

  const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'diterima':
        return {
          label: 'DITERIMA (LOLOS SELEKSI BEASISWA)',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          desc: 'Selamat! Berdasarkan hasil pemeringkatan metode SAW, kamu ditetapkan menerima beasiswa ini.',
        };
      case 'ditolak':
        return {
          label: 'BELUM LOLOS SELEKSI',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
          desc: 'Mohon maaf, total skor atau kuota penerima untuk beasiswa ini telah terpenuhi.',
        };
      default:
        return {
          label: 'MENUNGGU VERIFIKASI / PROSES SELEKSI',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-300',
          icon: <Clock className="w-4 h-4 text-blue-600" />,
          desc: 'Pendaftaran kamu telah tersimpan. Panitia sedang melakukan verifikasi berkas dan perankingan kuota.',
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <Search className="w-3.5 h-3.5 text-emerald-600" />
          <span>Layanan Informasi Siswa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Cek Status Pendaftaran Beasiswa
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Masukkan 10 digit Nomor Induk Siswa Nasional (NISN) yang digunakan saat mendaftar.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <label className="block text-xs font-semibold text-slate-700">
          Nomor Induk Siswa Nasional (NISN)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              maxLength={10}
              value={nisnInput}
              onChange={(e) => setNisnInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Ketik 10 digit NISN kamu..."
              className="w-full px-4 py-3 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Cari Status</span>
          </button>
        </div>

        {/* Demo NISN suggestions */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span>Contoh NISN demo:</span>
          <button
            type="button"
            onClick={() => {
              setNisnInput('0071829101');
              performSearch('0071829101');
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
          >
            0071829101 (Tahfidz)
          </button>
          <button
            type="button"
            onClick={() => {
              setNisnInput('0061928204');
              performSearch('0061928204');
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
          >
            0061928204 (Akademik)
          </button>
          <button
            type="button"
            onClick={() => {
              setNisnInput('0078899109');
              performSearch('0078899109');
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono"
          >
            0078899109 (Kurang Mampu)
          </button>
        </div>
      </form>

      {/* Result Card */}
      {hasSearched && searchedApplicant && scholarship && evaluation && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          {/* Status Badge Banner */}
          {(() => {
            const statusMeta = getStatusBadge(searchedApplicant.status);
            return (
              <div className={`p-4 rounded-xl border ${statusMeta.badgeClass} space-y-1`}>
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  {statusMeta.icon}
                  <span>{statusMeta.label}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{statusMeta.desc}</p>
              </div>
            );
          })()}

          {/* Student Biodata Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-5">
            <div>
              <span className="text-slate-500 block">Nama Siswa</span>
              <span className="font-bold text-sm text-slate-900">{searchedApplicant.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">NISN / Nomor Registrasi</span>
              <span className="font-mono font-semibold text-slate-800">
                {searchedApplicant.nisn} · {searchedApplicant.registrationNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Kelas & Kompetensi Keahlian</span>
              <span className="text-slate-800 font-medium">
                Kelas {searchedApplicant.grade} · {searchedApplicant.major}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Beasiswa yang Dipilih</span>
              <span className="font-bold text-emerald-800">{scholarship.name}</span>
            </div>
          </div>

          {/* Ranking & SAW Score stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Nilai Preferensi (V)
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-800">
                {evaluation.scoreV.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Kategori: {evaluation.category}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Peringkat Seleksi
              </span>
              <span className="text-2xl font-extrabold font-mono text-slate-900">
                #{rankInfo?.rank ?? '-'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Dari total {rankInfo?.total ?? 0} pendaftar
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Status Kuota
              </span>
              <span
                className={`text-sm font-bold block mt-1.5 ${
                  rankInfo?.inQuota ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {rankInfo?.inQuota ? 'Masuk Kuota Penerima' : 'Di Luar Kuota'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Kuota: {scholarship.quota} Siswa
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              to={`/hasil/${searchedApplicant.id}`}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <span>Lihat Detail Perhitungan SAW & Rekomendasi Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Bukti</span>
            </button>
          </div>
        </div>
      )}

      {/* Not Found Banner */}
      {hasSearched && !searchedApplicant && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">NISN Belum Terdaftar</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Data dengan NISN <strong>{nisnInput}</strong> tidak ditemukan di pangkalan data beasiswa.
            Pastikan digit angka sudah benar atau daftarkan diri kamu sekarang.
          </p>
          <div className="pt-2">
            <Link
              to="/daftar"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Daftar Beasiswa Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && searchedApplicant && scholarship && evaluation && (
        <PrintRegistrationModal
          applicant={searchedApplicant}
          scholarship={scholarship}
          evaluation={evaluation}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
