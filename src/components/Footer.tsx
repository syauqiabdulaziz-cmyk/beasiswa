import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">
                SMK Komputama Majenang
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Sistem Seleksi Penerimaan Beasiswa Internal Berbasis Simple Additive Weighting (SAW).
              Mendorong prestasi dan pemerataan akses pendidikan bagi seluruh siswa.
            </p>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Jl. Raya Majenang No. 12, Cilacap, Jawa Tengah</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Telp / WhatsApp Panitia: (0280) 621xxx</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              Menu Layanan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Beranda & Informasi Beasiswa
                </Link>
              </li>
              <li>
                <Link to="/daftar" className="hover:text-emerald-400 transition-colors">
                  Formulir Pendaftaran Beasiswa
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-emerald-400 transition-colors">
                  Cek Status Seleksi (NISN)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Portal Panitia (Admin)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
              Transparansi Metode SAW
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Perhitungan nilai preferensi ($V$) dilakukan secara objektif dengan pembobotan
              7 kriteria terukur (Rapor, Tahfidz, Prestasi, Penghasilan Ortu, Kondisi Keluarga,
              Kehadiran, dan Organisasi).
            </p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Catatan Simulasi:</span> Seluruh data tersimpan lokal di peramban Anda untuk keperluan evaluasi dan presentasi sistem.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SMK Komputama Majenang. Hak Cipta Dilindungi.</p>
          <p className="text-slate-400">Metode SAW · Sistem Pendukung Keputusan</p>
        </div>
      </div>
    </footer>
  );
}
