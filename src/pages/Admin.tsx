import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Users,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Sliders,
  ChevronRight,
  Eye,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  ADMIN_PASSWORD,
  getStoredApplicants,
  getStoredScholarships,
  saveStoredApplicants,
  saveStoredScholarships,
  deleteApplicant,
  resetToSeedData,
  isAdminAuthenticated,
  setAdminAuthenticated,
  downloadCSV,
} from '../lib/storage';
import { calculateRankingsForScholarship, evaluateApplicantForScholarship } from '../lib/saw';
import { Applicant, ApplicationStatus, CriterionCode, Scholarship, SAWEvaluation } from '../types';
import { CRITERIA } from '../data/criteria';
import SAWCalculationAccordion from '../components/SAWCalculationAccordion';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active Tab: 'dashboard' | 'applicants' | 'rankings' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applicants' | 'rankings' | 'settings'>(
    'dashboard'
  );

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScholarship, setFilterScholarship] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Ranking Tab Selection
  const [selectedRankingSchId, setSelectedRankingSchId] = useState('tahfidz');

  // Settings Edit State
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [weightInputs, setWeightInputs] = useState<Record<CriterionCode, number>>({
    C1: 0.1,
    C2: 0.5,
    C3: 0.05,
    C4: 0.1,
    C5: 0.05,
    C6: 0.1,
    C7: 0.1,
  });
  const [quotaInput, setQuotaInput] = useState(5);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // Detail Modal
  const [selectedApplicantDetail, setSelectedApplicantDetail] = useState<{
    applicant: Applicant;
    scholarship: Scholarship;
    evaluation: SAWEvaluation;
  } | null>(null);

  const reloadData = () => {
    const apps = getStoredApplicants();
    const schs = getStoredScholarships();
    setApplicants(apps);
    setScholarships(schs);
    if (!editingScholarship && schs.length > 0) {
      setEditingScholarship(schs[0]);
      setWeightInputs(schs[0].weights);
      setQuotaInput(schs[0].quota);
    }
  };

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      reloadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setLoginError(false);
      reloadData();
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mereset seluruh data kembali ke 15 data contoh awal?'
      )
    ) {
      resetToSeedData();
      reloadData();
      alert('Data pendaftar dan pengaturan beasiswa berhasil direset ke data contoh.');
    }
  };

  const handleDeleteApplicant = (id: string, name: string) => {
    if (window.confirm(`Hapus data pendaftar "${name}"?`)) {
      deleteApplicant(id);
      reloadData();
    }
  };

  const handleUpdateStatus = (applicantId: string, newStatus: ApplicationStatus) => {
    const updated = applicants.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a));
    saveStoredApplicants(updated);
    setApplicants(updated);
  };

  // Bulk Accept according to quota
  const handleAutoAcceptByQuota = (sch: Scholarship) => {
    const ranked = calculateRankingsForScholarship(applicants, sch);
    const updated = [...applicants];

    ranked.forEach((item) => {
      const idx = updated.findIndex((a) => a.id === item.applicant.id);
      if (idx !== -1) {
        if (item.inQuota && item.evaluation.category !== 'Belum Layak') {
          updated[idx].status = 'diterima';
        } else {
          updated[idx].status = 'ditolak';
        }
      }
    });

    saveStoredApplicants(updated);
    setApplicants(updated);
    alert(
      `Peringkat 1 s/d ${sch.quota} pada beasiswa "${sch.name}" telah ditetapkan sebagai DITERIMA (jika memenuhi kualifikasi).`
    );
  };

  // Export Applicants to CSV
  const handleExportApplicantsCSV = () => {
    const headers = [
      'ID Registrasi',
      'NISN',
      'Nama Siswa',
      'Kelas',
      'Jurusan',
      'WhatsApp',
      'Beasiswa Pilihan',
      'C1 (Rapor)',
      'C2 (Tahfidz)',
      'C3 (Prestasi)',
      'C4 (Gaji Ortu)',
      'C5 (Keluarga)',
      'C6 (Kehadiran)',
      'C7 (Organisasi)',
      'Skor SAW (V)',
      'Kategori',
      'Status Kelulusan',
    ];

    const rows = applicants.map((a) => {
      const sch = scholarships.find((s) => s.id === a.scholarshipId);
      const evalData = sch ? evaluateApplicantForScholarship(a.scores, sch) : null;
      return [
        `"${a.registrationNumber}"`,
        `"${a.nisn}"`,
        `"${a.name}"`,
        `"${a.grade}"`,
        `"${a.major}"`,
        `"${a.whatsapp}"`,
        `"${sch?.name ?? a.scholarshipId}"`,
        a.scores.C1,
        a.scores.C2,
        a.scores.C3,
        a.scores.C4,
        a.scores.C5,
        a.scores.C6,
        a.scores.C7,
        evalData ? evalData.scoreV.toFixed(4) : '-',
        evalData ? evalData.category : '-',
        a.status,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(`data_pendaftar_beasiswa_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  // Export Ranking to CSV
  const handleExportRankingCSV = (sch: Scholarship) => {
    const ranked = calculateRankingsForScholarship(applicants, sch);
    const headers = [
      'Peringkat',
      'NISN',
      'Nama Siswa',
      'Kelas',
      'Jurusan',
      'Nilai Preferensi V',
      'Kategori',
      'Masuk Kuota',
      'Status Keputusan',
    ];

    const rows = ranked.map((r) => [
      r.rank,
      `"${r.applicant.nisn}"`,
      `"${r.applicant.name}"`,
      `"${r.applicant.grade}"`,
      `"${r.applicant.major}"`,
      r.evaluation.scoreV.toFixed(4),
      r.evaluation.category,
      r.inQuota ? 'YA' : 'TIDAK',
      r.applicant.status,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCSV(`ranking_beasiswa_${sch.id}_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  // Settings Save
  const totalWeight = Object.values(weightInputs).reduce((sum, w) => sum + Number(w), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScholarship) return;
    if (!isWeightValid) {
      alert('Total seluruh bobot kriteria harus tepat berjumlah 1.00!');
      return;
    }

    const updated = scholarships.map((s) => {
      if (s.id === editingScholarship.id) {
        return {
          ...s,
          quota: Number(quotaInput),
          weights: weightInputs,
        };
      }
      return s;
    });

    saveStoredScholarships(updated);
    setScholarships(updated);
    setSettingsSuccessMsg(`Pengaturan untuk "${editingScholarship.name}" berhasil disimpan.`);
    setTimeout(() => setSettingsSuccessMsg(null), 3000);
  };

  // If not logged in, show simple password form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Login Portal Panitia Beasiswa
            </h1>
            <p className="text-xs text-slate-500">
              SMK Komputama Majenang (Demo prototipe: password statis <code className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-800">admin123</code>)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi Administrator
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Kata sandi salah. Gunakan sandi demo <strong>admin123</strong>.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              Masuk Dashboard Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered applicants
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nisn.includes(searchQuery) ||
      a.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSch = filterScholarship === 'all' || a.scholarshipId === filterScholarship;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;

    return matchesSearch && matchesSch && matchesStatus;
  });

  const selectedRankingSch =
    scholarships.find((s) => s.id === selectedRankingSchId) || scholarships[0];
  const rankingList = selectedRankingSch
    ? calculateRankingsForScholarship(applicants, selectedRankingSch)
    : [];

  // Summary Metrics
  const totalApplicantsCount = applicants.length;
  const acceptedCount = applicants.filter((a) => a.status === 'diterima').length;
  const pendingCount = applicants.filter((a) => a.status === 'menunggu').length;
  const rejectedCount = applicants.filter((a) => a.status === 'ditolak').length;
  const totalQuotaAll = scholarships.reduce((sum, s) => sum + s.quota, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Panel Administrator & Panitia Seleksi Beasiswa</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Seleksi SAW SMK Komputama Majenang
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetData}
            title="Kembalikan ke 15 siswa awal"
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Data Contoh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'dashboard', label: 'Ringkasan / Statistik', icon: <Users className="w-4 h-4" /> },
          { id: 'applicants', label: `Data Pendaftar (${applicants.length})`, icon: <Award className="w-4 h-4" /> },
          { id: 'rankings', label: 'Peringkat & Kelulusan SAW', icon: <CheckCircle className="w-4 h-4" /> },
          { id: 'settings', label: 'Pengaturan Kuota & Bobot', icon: <Sliders className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD METRICS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Total Pendaftar</span>
              <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
                {totalApplicantsCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Siswa Terdaftar</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-emerald-700 font-medium block">Total Diterima</span>
              <span className="text-3xl font-extrabold font-mono text-emerald-700 mt-1 block">
                {acceptedCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Dari {totalQuotaAll} Total Kuota
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-blue-700 font-medium block">Menunggu Seleksi</span>
              <span className="text-3xl font-extrabold font-mono text-blue-700 mt-1 block">
                {pendingCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Belum Diverifikasi</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-rose-700 font-medium block">Belum Lolos</span>
              <span className="text-3xl font-extrabold font-mono text-rose-700 mt-1 block">
                {rejectedCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Di Luar Kuota / Tidak Lolos</span>
            </div>
          </div>

          {/* Breakdown per Scholarship */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Statistik Pendaftar & Rasio Kuota per Beasiswa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scholarships.map((sch) => {
                const inThisSch = applicants.filter((a) => a.scholarshipId === sch.id);
                const acceptedInSch = inThisSch.filter((a) => a.status === 'diterima').length;
                const ratioPercent = Math.min(100, Math.round((acceptedInSch / sch.quota) * 100));

                return (
                  <div
                    key={sch.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{sch.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                        Kuota: {sch.quota}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Pendaftar: <strong>{inThisSch.length}</strong> siswa</span>
                      <span>Diterima: <strong className="text-emerald-700">{acceptedInSch}</strong> / {sch.quota}</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${ratioPercent}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRankingSchId(sch.id);
                        setActiveTab('rankings');
                      }}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Lihat Peringkat SAW</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA PENDAFTAR TABLE */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          {/* Filters & Export */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Nama / NISN..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <select
                value={filterScholarship}
                onChange={(e) => setFilterScholarship(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              >
                <option value="all">Semua Beasiswa</option>
                {scholarships.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diterima">Diterima</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExportApplicantsCSV}
              className="w-full md:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-3">NISN & Nama</th>
                    <th className="py-3 px-3">Kelas / Jurusan</th>
                    <th className="py-3 px-3">Beasiswa Pilihan</th>
                    <th className="py-3 px-2 text-center">Skor SAW (V)</th>
                    <th className="py-3 px-2 text-center">Kategori</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada data pendaftar yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((a) => {
                      const sch = scholarships.find((s) => s.id === a.scholarshipId) || scholarships[0];
                      const evalData = sch ? evaluateApplicantForScholarship(a.scores, sch) : null;

                      return (
                        <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{a.name}</span>
                            <span className="font-mono text-[11px] text-slate-500">{a.nisn}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <span>Kelas {a.grade}</span>
                            <span className="block text-[11px] text-slate-500 truncate max-w-[140px]">
                              {a.major}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-800 font-medium">
                            {sch?.shortName ?? sch?.name}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold tabular-nums text-emerald-700">
                            {evalData ? evalData.scoreV.toFixed(2) : '-'}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                evalData?.category === 'Sangat Layak'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : evalData?.category === 'Layak'
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {evalData?.category ?? '-'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <select
                              value={a.status}
                              onChange={(e) => handleUpdateStatus(a.id, e.target.value as any)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                                a.status === 'diterima'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : a.status === 'ditolak'
                                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                                  : 'bg-blue-50 border-blue-300 text-blue-800'
                              }`}
                            >
                              <option value="menunggu">Menunggu</option>
                              <option value="diterima">Diterima</option>
                              <option value="ditolak">Ditolak</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                title="Lihat Detail SAW"
                                onClick={() =>
                                  setSelectedApplicantDetail({
                                    applicant: a,
                                    scholarship: sch,
                                    evaluation: evalData!,
                                  })
                                }
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                title="Hapus Data"
                                onClick={() => handleDeleteApplicant(a.id, a.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERINGKAT & KELULUSAN SAW */}
      {activeTab === 'rankings' && selectedRankingSch && (
        <div className="space-y-4">
          {/* Top Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Pilih Beasiswa:
              </label>
              <select
                value={selectedRankingSchId}
                onChange={(e) => setSelectedRankingSchId(e.target.value)}
                className="px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-900"
              >
                {scholarships.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Kuota: {s.quota})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleAutoAcceptByQuota(selectedRankingSch)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Terima Sesuai Kuota ({selectedRankingSch.quota} Siswa)</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportRankingCSV(selectedRankingSch)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">
                  Peringkat Pendaftar: {selectedRankingSch.name}
                </span>
                <span className="text-slate-500 ml-2">
                  (Peringkat 1 s/d {selectedRankingSch.quota} berstatus Masuk Kuota)
                </span>
              </div>
              <span className="font-mono font-semibold text-slate-600">
                Total: {rankingList.length} Pendaftar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center">Rank</th>
                    <th className="py-2.5 px-3">Nama Siswa & NISN</th>
                    <th className="py-2.5 px-3">Jurusan</th>
                    <th className="py-2.5 px-2 text-center">Rapor (C1)</th>
                    <th className="py-2.5 px-2 text-center">Tahfidz (C2)</th>
                    <th className="py-2.5 px-2 text-center">Lomba (C3)</th>
                    <th className="py-2.5 px-2 text-center">Gaji (C4)</th>
                    <th className="py-2.5 px-2 text-center">Keluarga (C5)</th>
                    <th className="py-2.5 px-2 text-center">Hadir (C6)</th>
                    <th className="py-2.5 px-2 text-center">Organisasi (C7)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900">Skor V</th>
                    <th className="py-2.5 px-3 text-center">Status Keputusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankingList.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-slate-400">
                        Belum ada siswa yang mendaftar pada beasiswa ini.
                      </td>
                    </tr>
                  ) : (
                    rankingList.map((item, idx) => {
                      const isAtQuotaBorder = item.rank === selectedRankingSch.quota;
                      return (
                        <React.Fragment key={item.applicant.id}>
                          <tr
                            className={`hover:bg-slate-50/80 transition-colors ${
                              item.inQuota ? 'bg-emerald-50/20' : 'bg-white'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-[11px] font-mono ${
                                  item.inQuota
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {item.rank}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-slate-900 block">{item.applicant.name}</span>
                              <span className="font-mono text-[10px] text-slate-500">{item.applicant.nisn}</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 truncate max-w-[120px]">
                              {item.applicant.major}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C1}</td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C2}</td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C3}</td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C4}</td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C5}</td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C6}</td>
                            <td className="py-2.5 px-2 text-center font-mono">{item.applicant.scores.C7}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-sm text-emerald-800">
                              {item.evaluation.scoreV.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <select
                                value={item.applicant.status}
                                onChange={(e) =>
                                  handleUpdateStatus(item.applicant.id, e.target.value as any)
                                }
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                  item.applicant.status === 'diterima'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    : item.applicant.status === 'ditolak'
                                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                                    : 'bg-blue-50 border-blue-300 text-blue-800'
                                }`}
                              >
                                <option value="menunggu">Menunggu</option>
                                <option value="diterima">Diterima</option>
                                <option value="ditolak">Ditolak</option>
                              </select>
                            </td>
                          </tr>

                          {/* Garis Batas Kuota */}
                          {isAtQuotaBorder && idx < rankingList.length - 1 && (
                            <tr className="bg-amber-100/70 border-y border-amber-300">
                              <td
                                colSpan={12}
                                className="py-1 text-center text-[10px] font-bold text-amber-900 tracking-wider uppercase"
                              >
                                ── Batas Kuota Maksimal ({selectedRankingSch.quota} Siswa) ──
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PENGATURAN BEASISWA & BOBOT */}
      {activeTab === 'settings' && editingScholarship && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Pengaturan Kuota & Matriks Bobot Kriteria
              </h3>
              <p className="text-xs text-slate-500">
                Setiap jenis beasiswa memiliki bobot kriteria tersendiri sesuai fokus pembinaan.
              </p>
            </div>

            {/* Select scholarship to edit */}
            <select
              value={editingScholarship.id}
              onChange={(e) => {
                const target = scholarships.find((s) => s.id === e.target.value);
                if (target) {
                  setEditingScholarship(target);
                  setWeightInputs(target.weights);
                  setQuotaInput(target.quota);
                }
              }}
              className="px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
            >
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  Edit: {s.name}
                </option>
              ))}
            </select>
          </div>

          {settingsSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{settingsSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Beasiswa
                </label>
                <input
                  type="text"
                  disabled
                  value={editingScholarship.name}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-300 rounded-xl text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kuota Penerima (Siswa)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={quotaInput}
                  onChange={(e) => setQuotaInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Weight inputs for C1..C7 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Matriks Bobot Kriteria C1 – C7:
                </span>
                <span
                  className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                    isWeightValid
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  Total Bobot: {totalWeight.toFixed(2)} / 1.00 {isWeightValid ? '✓ Sesuai' : '⚠ Harus 1.00'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CRITERIA.map((crit) => (
                  <div key={crit.code} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">
                        {crit.code} - {crit.name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-500">
                        {crit.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={0.01}
                        min={0}
                        max={1}
                        value={weightInputs[crit.code] ?? 0}
                        onChange={(e) =>
                          setWeightInputs((prev) => ({
                            ...prev,
                            [crit.code]: Number(e.target.value),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-right font-bold text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={!isWeightValid}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
              >
                Simpan Perubahan Bobot & Kuota
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApplicantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Rincian Pendaftar: {selectedApplicantDetail.applicant.name}
                </h3>
                <p className="text-xs text-slate-500">
                  NISN: {selectedApplicantDetail.applicant.nisn} · {selectedApplicantDetail.applicant.major}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicantDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <SAWCalculationAccordion
              evaluation={selectedApplicantDetail.evaluation}
              scholarshipQuota={selectedApplicantDetail.scholarship.quota}
            />

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApplicantDetail(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small Demo Note in Footer */}
      <div className="pt-4 text-center text-xs text-slate-400">
        Data ini hanya contoh simulasi untuk keperluan prototipe seleksi beasiswa internal SMK Komputama Majenang.
      </div>
    </div>
  );
}
