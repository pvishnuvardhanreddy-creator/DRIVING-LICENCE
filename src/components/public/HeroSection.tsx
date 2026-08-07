import React, { useState } from 'react';
import {
  Search,
  FileCheck2,
  Car,
  FileText,
  CreditCard,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Bell
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onOpenApplyLicense: () => void;
  onOpenApplyVehicle: () => void;
  onOpenPayFees: () => void;
  onOpenTrack: () => void;
  onOpenQRScanner: () => void;
  onOpenTestSimulator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenApplyLicense,
  onOpenApplyVehicle,
  onOpenPayFees,
  onOpenTrack,
  onOpenQRScanner,
  onOpenTestSimulator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0A4D8C] via-[#083a6b] to-slate-900 text-white pt-8 pb-16">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Ticker Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-2 flex items-center gap-3 text-xs text-amber-200 shadow-sm">
          <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
            Official Advisory
          </span>
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
            <Bell className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>
              All Driving Licenses & RCs issued after Jan 2026 feature encrypted QR verification. Beware of unauthorized third-party agencies.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Quick Search */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-blue-400/30 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Integrated E-Governance Transport Portal</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Seamless RTO Services for <span className="text-amber-300">Vehicles & Drivers</span>
          </h1>

          <p className="text-blue-100 text-sm lg:text-base leading-relaxed max-w-2xl">
            Apply online for Learner & Permanent Driving Licenses, Register New Vehicles, Transfer Ownership, Pay Road Tax, and download QR-certified Digital Smart Cards.
          </p>

          {/* Quick Search Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-2xl border border-white/20 shadow-2xl space-y-3">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
              <span>Instant Verification & Status Search</span>
              <span className="text-blue-200 font-normal normal-case">Enter RC No / DL No / Application No</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. MH 12 AB 9988 or MH12 20240098124 or RTO2026-88120"
                  className="w-full bg-white text-gray-900 pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg transition flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-blue-200">
              <span className="font-semibold text-white">Popular Searches:</span>
              <button
                type="button"
                onClick={() => { setSearchQuery('MH 12 AB 9988'); onSearch('MH 12 AB 9988'); }}
                className="hover:text-amber-300 underline"
              >
                MH 12 AB 9988
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setSearchQuery('MH12 20240098124'); onSearch('MH12 20240098124'); }}
                className="hover:text-amber-300 underline"
              >
                MH12 20240098124
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setSearchQuery('RTO2026-88120'); onSearch('RTO2026-88120'); }}
                className="hover:text-amber-300 underline"
              >
                RTO2026-88120
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={onOpenApplyLicense}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-xl text-left transition group"
            >
              <FileText className="w-5 h-5 text-amber-300 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Apply DL / LL</div>
              <div className="text-[10px] text-blue-200">New & Renewal</div>
            </button>

            <button
              onClick={onOpenApplyVehicle}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-xl text-left transition group"
            >
              <Car className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Vehicle RC</div>
              <div className="text-[10px] text-blue-200">New Reg / Transfer</div>
            </button>

            <button
              onClick={onOpenPayFees}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-3 rounded-xl text-left transition group"
            >
              <CreditCard className="w-5 h-5 text-blue-300 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">Pay Fees</div>
              <div className="text-[10px] text-blue-200">Road Tax & Fine</div>
            </button>

            <button
              onClick={onOpenTestSimulator}
              className="bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 p-3 rounded-xl text-left transition group"
            >
              <Sparkles className="w-5 h-5 text-emerald-300 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold">LL Mock Test</div>
              <div className="text-[10px] text-emerald-100">Practice Exam</div>
            </button>
          </div>
        </div>

        {/* Right Column: Live Statistics Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c3359] border border-blue-400/30 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-blue-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">National Transport Metrics</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-400/30">
                LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/50 p-3.5 rounded-xl border border-blue-800">
                <div className="text-[11px] text-blue-200">Registered Vehicles</div>
                <div className="text-2xl font-extrabold text-amber-300 mt-1">3.84 Million</div>
                <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Digital RCs
                </div>
              </div>

              <div className="bg-blue-900/50 p-3.5 rounded-xl border border-blue-800">
                <div className="text-[11px] text-blue-200">Active Licenses</div>
                <div className="text-2xl font-extrabold text-amber-300 mt-1">2.91 Million</div>
                <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> QR Encrypted
                </div>
              </div>

              <div className="bg-blue-900/50 p-3.5 rounded-xl border border-blue-800">
                <div className="text-[11px] text-blue-200">Daily Applications</div>
                <div className="text-2xl font-extrabold text-white mt-1">42,890</div>
                <div className="text-[10px] text-blue-300 mt-0.5">Average SLA: 48 Hrs</div>
              </div>

              <div className="bg-blue-900/50 p-3.5 rounded-xl border border-blue-800">
                <div className="text-[11px] text-blue-200">Fee Revenue Collected</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">₹48.2 Cr</div>
                <div className="text-[10px] text-blue-300 mt-0.5">Direct Govt Treasury</div>
              </div>
            </div>

            {/* Quick QR Scanner CTA */}
            <div className="mt-5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/30 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QrCode className="w-8 h-8 text-amber-300" />
                <div>
                  <div className="text-xs font-bold text-white">QR Code Public Inspector</div>
                  <div className="text-[10px] text-amber-200">Scan or verify any DL or RC Smart Card</div>
                </div>
              </div>

              <button
                onClick={onOpenQRScanner}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow transition shrink-0"
              >
                Scan Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
