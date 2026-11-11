import React from 'react';
import { X, Printer, CheckCircle, GraduationCap } from 'lucide-react';
import { Applicant, SAWEvaluation, Scholarship } from '../types';
import { CRITERIA } from '../data/criteria';

interface Props {
  applicant: Applicant;
  scholarship: Scholarship;
  evaluation: SAWEvaluation;
  onClose: () => void;
}

export default function PrintRegistrationModal({
  applicant,
  scholarship,
  evaluation,
  onClose,
}: Props) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(applicant.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Toolbar (hidden in print) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Cetak Bukti Pendaftaran Beasiswa
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Area */}
        <div className="p-8 sm:p-10 text-slate-900 print-card" id="printable-proof">
          {/* Letterhead Kop Surat */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-extrabold uppercase tracking-wide text-slate-900 leading-tight">
                  SMK KOMPUTAMA MAJENANG
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Jl. Raya Majenang No. 12, Majenang, Kab. Cilacap, Jawa Tengah 53257
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Website: smkkomputama.sch.id · Email: info@smkkomputama.sch.id · Telp: (0280) 621xxx
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider underline underline-offset-4 text-slate-900">
              TANDA BUKTI PENDAFTARAN BEASISWA INTERNAL
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Nomor Registrasi: <span className="font-mono font-bold text-slate-900">{applicant.registrationNumber}</span>
            </p>
          </div>

          {/* Biodata Table */}
          <div className="mb-6 space-y-2 text-xs">
            <h3 className="font-bold uppercase text-[11px] text-slate-700 border-b border-slate-200 pb-1 mb-2">
              A. Data Calon Penerima Beasiswa
            </h3>
            <div className="grid grid-cols-3 gap-y-1.5 text-xs">
              <span className="text-slate-600 font-medium">Nomor Induk Siswa Nasional (NISN)</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">: {applicant.nisn}</span>

              <span className="text-slate-600 font-medium">Nama Lengkap Siswa</span>
              <span className="col-span-2 font-bold text-slate-900">: {applicant.name}</span>

              <span className="text-slate-600 font-medium">Tingkat Kelas</span>
              <span className="col-span-2 text-slate-800">: Kelas {applicant.grade}</span>

              <span className="text-slate-600 font-medium">Kompetensi Keahlian (Jurusan)</span>
              <span className="col-span-2 text-slate-800">: {applicant.major}</span>

              <span className="text-slate-600 font-medium">Nomor WhatsApp / HP</span>
              <span className="col-span-2 text-slate-800">: {applicant.whatsapp}</span>

              <span className="text-slate-600 font-medium">Waktu Pendaftaran</span>
              <span className="col-span-2 text-slate-800">: {formattedDate}</span>
            </div>
          </div>

          {/* Scholarship & SAW Score Table */}
          <div className="mb-6 space-y-2 text-xs">
            <h3 className="font-bold uppercase text-[11px] text-slate-700 border-b border-slate-200 pb-1 mb-2">
              B. Pilihan Beasiswa & Hasil Evaluasi SAW
            </h3>
            <div className="grid grid-cols-3 gap-y-1.5 text-xs mb-3">
              <span className="text-slate-600 font-medium">Jenis Beasiswa Dipilih</span>
              <span className="col-span-2 font-bold text-emerald-800">: {scholarship.name} (Kuota: {scholarship.quota} Siswa)</span>

              <span className="text-slate-600 font-medium">Nilai Preferensi SAW (V)</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">: {evaluation.scoreV.toFixed(4)}</span>

              <span className="text-slate-600 font-medium">Kategori Kelayakan</span>
              <span className="col-span-2 font-semibold text-slate-800">: {evaluation.category}</span>

              <span className="text-slate-600 font-medium">Peringkat Sementara</span>
              <span className="col-span-2 font-medium text-slate-800">: Peringkat #{evaluation.rank ?? '-'} ({evaluation.inQuota ? 'Masuk Kuota' : 'Di Luar Kuota'})</span>
            </div>

            {/* Criteria Scores Summary */}
            <table className="w-full text-[11px] border border-slate-300 border-collapse mt-2">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300 text-left">Kode Kriteria</th>
                  <th className="p-1.5 border-r border-slate-300 text-left">Nama Kriteria</th>
                  <th className="p-1.5 border-r border-slate-300 text-center">Skor Pilihan</th>
                  <th className="p-1.5 text-right">Nilai Normalisasi (r)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {CRITERIA.map((crit) => {
                  const score = applicant.scores[crit.code] ?? 1;
                  const itemBreakdown = evaluation.breakdown.find((b) => b.code === crit.code);
                  return (
                    <tr key={crit.code}>
                      <td className="p-1.5 border-r border-slate-300 font-mono font-semibold">{crit.code}</td>
                      <td className="p-1.5 border-r border-slate-300">{crit.name}</td>
                      <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">{score} / 5</td>
                      <td className="p-1.5 text-right font-mono tabular-nums">{itemBreakdown?.normalizedScore.toFixed(4) ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Notes & Signatures */}
          <div className="pt-4 border-t border-slate-200 text-xs">
            <p className="text-[11px] text-slate-500 italic mb-6">
              Catatan: Simpan lembar tanda bukti pendaftaran ini sebagai bukti sah keikutsertaan seleksi beasiswa internal SMK Komputama Majenang Tahun Ajaran 2026/2027.
            </p>

            <div className="grid grid-cols-2 text-center text-xs mt-6">
              <div>
                <p className="text-slate-600 mb-14">
                  Siswa Pendaftar,
                </p>
                <p className="font-bold text-slate-900 underline">{applicant.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">NISN: {applicant.nisn}</p>
              </div>

              <div>
                <p className="text-slate-600 mb-14">
                  Majenang, {formattedDate}<br />
                  Panitia Beasiswa SMK Komputama,
                </p>
                <p className="font-bold text-slate-900 underline">( Panitia Seleksi Beasiswa )</p>
                <p className="text-[11px] text-slate-500">NIP / NUPTK.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons (no-print) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </div>
  );
}
