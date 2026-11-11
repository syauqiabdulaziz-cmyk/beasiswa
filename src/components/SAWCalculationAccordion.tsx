import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, HelpCircle } from 'lucide-react';
import { SAWEvaluation } from '../types';

interface Props {
  evaluation: SAWEvaluation;
  scholarshipQuota?: number;
}

export default function SAWCalculationAccordion({ evaluation, scholarshipQuota }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900">
              Lihat Cara Hitungnya (Detail Perhitungan SAW)
            </h4>
            <p className="text-xs text-slate-500">
              Transparansi langkah: Nilai Mentah → Normalisasi (r) → Bobot (w) → Hasil Preferensi (V = {evaluation.scoreV.toFixed(4)})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-medium hidden sm:inline">
            {isOpen ? 'Tutup Rincian' : 'Buka Rincian'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Formula Metode Simple Additive Weighting (Skala Tetap 1–5):
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>
                <strong>Kriteria Benefit (C1, C2, C3, C5, C6, C7):</strong> Normalisasi <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">r = x / 5</code> (karena skor maksimal adalah 5).
              </li>
              <li>
                <strong>Kriteria Cost (C4 - Penghasilan Ortu):</strong> Normalisasi <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">r = 1 / x</code> (karena skor minimum adalah 1, semakin kecil gaji makin tinggi nilainya).
              </li>
              <li>
                <strong>Nilai Preferensi (V):</strong> Penjumlahan dari seluruh <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">w × r</code>. Total bobot beasiswa = 1.00.
              </li>
            </ul>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Kriteria</th>
                  <th className="py-2.5 px-2 text-center">Jenis</th>
                  <th className="py-2.5 px-2 text-center">Nilai Asli (x)</th>
                  <th className="py-2.5 px-3 text-right">Normalisasi (r)</th>
                  <th className="py-2.5 px-3 text-right">Bobot (w)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-900">Hasil (w × r)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluation.breakdown.map((row) => (
                  <tr key={row.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">
                      {row.code}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        row.type === 'cost' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {row.type === 'cost' ? 'Cost' : 'Benefit'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono tabular-nums font-semibold text-slate-900">
                      {row.rawScore} / 5
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {row.type === 'cost'
                        ? `1 / ${row.rawScore} = ${row.normalizedScore.toFixed(4)}`
                        : `${row.rawScore} / 5 = ${row.normalizedScore.toFixed(4)}`}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {row.weight.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-emerald-700">
                      +{row.weightedScore.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50/70 border-t-2 border-emerald-500 font-bold text-slate-900">
                  <td colSpan={5} className="py-2.5 px-3 text-right text-xs">
                    Total Nilai Preferensi SAW (V):
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs">
                    1.00
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-sm text-emerald-800">
                    {evaluation.scoreV.toFixed(4)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div>
              Status Kategori: <strong className="text-slate-900">{evaluation.category}</strong>
              <span className="text-slate-400 ml-1.5">
                (≥ 0.75: Sangat Layak, 0.60–0.74: Layak, &lt; 0.60: Belum Layak)
              </span>
            </div>
            {scholarshipQuota && evaluation.rank && (
              <div>
                Peringkat: <strong className="text-slate-900">#{evaluation.rank}</strong> dari kuota <strong className="text-slate-900">{scholarshipQuota}</strong> siswa
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
