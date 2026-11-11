import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Trophy,
  HeartHandshake,
  Users,
  ArrowRight,
  CheckCircle,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react';
import { getStoredScholarships, getStoredApplicants } from '../lib/storage';
import { Scholarship } from '../types';

export default function Home() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applicantCount, setApplicantCount] = useState(0);

  useEffect(() => {
    setScholarships(getStoredScholarships());
    setApplicantCount(getStoredApplicants().length);
  }, []);

  const getScholarshipIcon = (id: string) => {
    switch (id) {
      case 'tahfidz':
        return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'akademik':
        return <Award className="w-6 h-6 text-blue-600" />;
      case 'non-akademik':
        return <Trophy className="w-6 h-6 text-amber-600" />;
      case 'kurang-mampu':
        return <HeartHandshake className="w-6 h-6 text-rose-600" />;
      case 'organisasi':
        return <Users className="w-6 h-6 text-purple-600" />;
      default:
        return <Award className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getBadgeColor = (id: string) => {
    switch (id) {
      case 'tahfidz':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'akademik':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'non-akademik':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'kurang-mampu':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'organisasi':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Penerimaan Beasiswa Internal TA 2026/2027</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
            Sistem Penerimaan Beasiswa <br />
            <span className="text-emerald-600">SMK Komputama Majenang</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Seleksi beasiswa internal sekolah yang objektif, transparan, dan adil menggunakan
            metode Simple Additive Weighting (SAW) dengan rekomendasi cerdas otomatis.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/daftar"
              className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              Daftar Beasiswa Sekarang
            </Link>
            <Link
              to="/status"
              className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Cek Status Pendaftaran (NISN)
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>5 Jenis Beasiswa Internal</span>
            </div>
            <span className="hidden sm:inline text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Total Kuota: 26 Siswa Penerima</span>
            </div>
            <span className="hidden sm:inline text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{applicantCount} Siswa Telah Mendaftar</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Beasiswa Cards Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            5 Pilihan Beasiswa Internal
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Disediakan khusus bagi siswa berprestasi, penghafal Al-Qur'an, aktif organisasi,
            serta siswa dari keluarga prasejahtera atau yatim-dhuafa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                    {getScholarshipIcon(sch.id)}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(
                      sch.id
                    )}`}
                  >
                    Kuota: {sch.quota} Siswa
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {sch.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {sch.description}
                </p>

                {/* Focus Criteria snippet */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-5 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wide">
                    Bobot Penilaian Utama:
                  </span>
                  <div className="text-slate-600">
                    {sch.id === 'tahfidz' && "Prioritas: Hafalan Al-Qur'an (50%), Rapor & Kehadiran (20%)"}
                    {sch.id === 'akademik' && 'Prioritas: Nilai Rapor (45%), Kehadiran (20%), Prestasi (10%)'}
                    {sch.id === 'non-akademik' && 'Prioritas: Prestasi Lomba (50%), Rapor & Kehadiran (20%)'}
                    {sch.id === 'kurang-mampu' && 'Prioritas: Penghasilan Ortu (40%), Kondisi Keluarga (25%)'}
                    {sch.id === 'organisasi' && 'Prioritas: Keaktifan Ekskul/OSIS (40%), Rapor & Hadir (30%)'}
                  </div>
                </div>
              </div>

              <Link
                to={`/daftar?beasiswa=${sch.id}`}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Pilih Beasiswa Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Daftar 3 Langkah */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Alur Sangat Mudah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cara Mendaftar Beasiswa
            </h2>
            <p className="text-slate-400 text-sm">
              Hanya butuh 3 menit. Cukup pilih jawaban dari dropdown yang sudah disiapkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-bold text-base text-white">Isi Data & Kriteria</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lengkapi biodata diri dan jawab 7 kriteria penilaian melalui pilihan dropdown yang praktis dan akurat.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-bold text-base text-white">Lihat Hasil & Rekomendasi</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistem langsung menghitung nilai SAW Anda dan memberi saran beasiswa paling cocok jika pilihan awal belum ideal.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-bold text-base text-white">Pantau Status & Cetak</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unduh lembar bukti pendaftaran dan pantau status kelulusan berkala menggunakan NISN di menu Cek Status.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/daftar"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg transition-colors"
            >
              <Award className="w-4 h-4" />
              Mulai Pendaftaran Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
