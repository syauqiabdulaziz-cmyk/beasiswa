import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { CRITERIA, MAJORS, GRADES } from '../data/criteria';
import { getStoredScholarships, getStoredApplicants, addApplicant } from '../lib/storage';
import { Applicant, CriterionCode, Scholarship } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedScholarship = searchParams.get('beasiswa') || '';

  const [step, setStep] = useState<1 | 2>(1);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  // Step 1: Data Diri
  const [name, setName] = useState('');
  const [nisn, setNisn] = useState('');
  const [grade, setGrade] = useState<'X' | 'XI' | 'XII'>('X');
  const [major, setMajor] = useState<string>(MAJORS[0]);
  const [whatsapp, setWhatsapp] = useState('');
  const [scholarshipId, setScholarshipId] = useState('');

  // Step 2: Kriteria Scores (C1..C7, default 3)
  const [scores, setScores] = useState<Record<CriterionCode, number>>({
    C1: 4,
    C2: 1,
    C3: 1,
    C4: 3,
    C5: 2,
    C6: 4,
    C7: 2,
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [duplicateApplicantId, setDuplicateApplicantId] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredScholarships();
    setScholarships(list);

    if (preselectedScholarship && list.some((s) => s.id === preselectedScholarship)) {
      setScholarshipId(preselectedScholarship);
    } else if (list.length > 0) {
      setScholarshipId(list[0].id);
    }
  }, [preselectedScholarship]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setDuplicateApplicantId(null);

    // Validasi Step 1
    if (!name.trim()) {
      setErrorMsg('Silakan masukkan nama lengkap siswa.');
      return;
    }

    const cleanNisn = nisn.trim();
    if (!/^\d{10}$/.test(cleanNisn)) {
      setErrorMsg('NISN harus berupa 10 digit angka (contoh: 0071829101).');
      return;
    }

    if (!whatsapp.trim() || whatsapp.trim().length < 9) {
      setErrorMsg('Silakan masukkan nomor WhatsApp aktif yang valid.');
      return;
    }

    if (!scholarshipId) {
      setErrorMsg('Silakan pilih salah satu beasiswa yang diminati.');
      return;
    }

    // Cek keunikan NISN
    const existing = getStoredApplicants().find((a) => a.nisn === cleanNisn);
    if (existing) {
      setDuplicateApplicantId(existing.id);
      setErrorMsg(
        `NISN ${cleanNisn} sudah terdaftar atas nama "${existing.name}". Setiap siswa hanya boleh memiliki 1 pendaftaran.`
      );
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCriterionChange = (code: CriterionCode, scoreValue: number) => {
    setScores((prev) => ({
      ...prev,
      [code]: scoreValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanNisn = nisn.trim();
    // Double check duplicate
    const existing = getStoredApplicants().find((a) => a.nisn === cleanNisn);
    if (existing) {
      setDuplicateApplicantId(existing.id);
      setErrorMsg(`NISN ${cleanNisn} sudah terdaftar.`);
      return;
    }

    // Buat objek pendaftar baru
    const newId = `app-${Date.now()}`;
    const regNum = `REG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newApplicant: Applicant = {
      id: newId,
      registrationNumber: regNum,
      nisn: cleanNisn,
      name: name.trim(),
      grade,
      major,
      whatsapp: whatsapp.trim(),
      scholarshipId,
      scores,
      createdAt: new Date().toISOString(),
      status: 'menunggu',
    };

    addApplicant(newApplicant);
    navigate(`/hasil/${newId}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Wizard */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Formulir Pendaftaran Siswa Baru</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Pendaftaran Beasiswa Internal
        </h1>
        <p className="text-sm text-slate-600">
          Lengkapi data dalam 2 langkah praktis. Semua data kriteria berupa pilihan dropdown.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 1
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            1
          </div>
          <span
            className={`text-xs font-semibold ${
              step === 1 ? 'text-emerald-700' : 'text-slate-600'
            }`}
          >
            Data Diri
          </span>
        </div>

        <div className="w-12 h-0.5 bg-slate-200" />

        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === 2
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            2
          </div>
          <span
            className={`text-xs font-semibold ${
              step === 2 ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            Kriteria SAW (C1–C7)
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium">{errorMsg}</p>
            {duplicateApplicantId && (
              <Link
                to={`/hasil/${duplicateApplicantId}`}
                className="inline-flex items-center gap-1.5 font-semibold text-rose-900 underline hover:text-rose-950"
              >
                Lihat Hasil Pendaftaran NISN Ini →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Data Diri */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Langkah 1: Identitas Calon Penerima
            </h2>
            <p className="text-xs text-slate-500">
              Pastikan data nama dan NISN sesuai dengan data pokok pendidikan di sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nama Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Ilham Ramadhan"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* NISN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NISN (10 Digit Angka) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={nisn}
                onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                placeholder="0071829101"
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Harus unik, 1 siswa hanya bisa 1 pendaftaran
              </span>
            </div>

            {/* Tingkat Kelas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tingkat Kelas <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Kelas {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Jurusan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kompetensi Keahlian (Jurusan) <span className="text-rose-500">*</span>
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* No WhatsApp */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Digunakan untuk konfirmasi dan pengumuman dari panitia
              </span>
            </div>

            {/* Pilihan Beasiswa */}
            <div className="sm:col-span-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Pilihan Beasiswa yang Diminati <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scholarships.map((sch) => {
                  const isSelected = scholarshipId === sch.id;
                  return (
                    <div
                      key={sch.id}
                      onClick={() => setScholarshipId(sch.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">
                          {sch.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Kuota: {sch.quota}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {sch.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Lanjut ke Penilaian Kriteria</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Kriteria C1..C7 */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Langkah 2: Penilaian 7 Kriteria Beasiswa
              </h2>
              <p className="text-xs text-slate-500">
                Pilih kondisi yang paling sesuai dengan diri kamu. Skor otomatis dihitung dengan metode SAW.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 p-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali
            </button>
          </div>

          <div className="space-y-5">
            {CRITERIA.map((crit, index) => {
              const currentScore = scores[crit.code] ?? 3;
              return (
                <div
                  key={crit.code}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                        {crit.code}
                      </span>
                      <span>{crit.question}</span>
                    </label>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      crit.type === 'cost' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {crit.type === 'cost' ? 'Kriteria Cost (Penghasilan)' : 'Kriteria Benefit'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {crit.description}
                  </p>

                  <select
                    value={currentScore}
                    onChange={(e) => handleCriterionChange(crit.code, Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-slate-800"
                  >
                    {crit.options.map((opt) => (
                      <option key={opt.score} value={opt.score}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Data Diri
            </button>

            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Lihat Hasil SAW</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
