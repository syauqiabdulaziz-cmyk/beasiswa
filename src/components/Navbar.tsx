import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, GraduationCap, Menu, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Daftar Beasiswa', path: '/daftar' },
    { name: 'Cek Status', path: '/status' },
    { name: 'Admin', path: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
              SMK Komputama Majenang
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Sistem Beasiswa Internal (SAW)
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors whitespace-nowrap ${
                isActive(link.path)
                  ? 'text-emerald-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Primary Action Button */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            to="/daftar"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            Daftar Sekarang
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
