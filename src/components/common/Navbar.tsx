import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import {
  ShieldAlert,
  Phone,
  Search,
  Globe,
  Sun,
  Moon,
  UserCheck,
  FileText,
  Car,
  CreditCard,
  Building2,
  Menu,
  X,
  Bot,
  QrCode,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenQRScanner: () => void;
  onOpenAIChat: () => void;
  onOpenSearch: () => void;
  onSelectNav: (nav: string) => void;
  activeNav: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQRScanner,
  onOpenAIChat,
  onOpenSearch,
  onSelectNav,
  activeNav,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { user, role, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'citizen', label: 'Citizen Portal', desc: 'Apply LL/DL, Vehicle RC, Pay Fees', color: 'bg-emerald-600' },
    { role: 'officer', label: 'RTO Officer Portal', desc: 'Verify Docs, Approve DL/RC, Tests', color: 'bg-blue-600' },
    { role: 'admin', label: 'Admin Dashboard', desc: 'System Logs, Analytics, User Management', color: 'bg-purple-600' },
  ];

  const handleRoleChange = async (newRole: UserRole) => {
    await switchRole(newRole);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Top Government Utility Bar */}
      <div className="bg-[#083a6b] text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-blue-900">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Government of India | Ministry of Road Transport & Highways
          </span>
          <span className="hidden md:inline-block text-blue-200">|</span>
          <span className="hidden md:flex items-center gap-1 text-blue-100">
            <Phone className="w-3 h-3 text-emerald-400" />
            National Helpline: <strong>1800-110-022</strong> (Toll Free)
          </span>
        </div>

        <div className="flex items-center space-x-3 my-0.5">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1 bg-blue-900/80 hover:bg-blue-800 text-blue-100 px-2.5 py-1 rounded transition text-xs font-medium"
          >
            <Search className="w-3 h-3 text-amber-300" />
            <span>Search RC/DL Status</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-blue-900/60 px-2 py-0.5 rounded text-xs">
            <Globe className="w-3 h-3 text-blue-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="en" className="text-gray-900">English (EN)</option>
              <option value="hi" className="text-gray-900">हिन्दी (HI)</option>
              <option value="mr" className="text-gray-900">मराठी (MR)</option>
              <option value="ta" className="text-gray-900">தமிழ் (TA)</option>
              <option value="te" className="text-gray-900">తెలుగు (TE)</option>
              <option value="bn" className="text-gray-900">বাংলা (BN)</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle theme"
            className="p-1 text-blue-200 hover:text-white transition"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-blue-200" />}
          </button>
        </div>
      </div>

      {/* Main Government Header */}
      <div className={`px-4 lg:px-8 py-3 transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#0A4D8C] text-white'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Brand & Emblem */}
          <div
            onClick={() => onSelectNav('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* Ashoka Emblem / Govt Badge */}
            <div className="w-11 h-11 bg-white rounded-full p-1 flex items-center justify-center shadow-inner border border-amber-300/40">
              <div className="text-center text-[#0A4D8C]">
                <ShieldAlert className="w-7 h-7 mx-auto text-[#0A4D8C]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                  Parivahan Sewa E-Governance
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-400/30">
                  ISO 27001 Certified
                </span>
              </div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white group-hover:text-amber-200 transition">
                {t('appHeading')}
              </h1>
            </div>
          </div>

          {/* Desktop Nav Actions & Persona Switcher */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition border border-emerald-400/30"
            >
              <Bot className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>{t('aiAssistant')}</span>
            </button>

            {/* QR Scanner */}
            <button
              onClick={onOpenQRScanner}
              className="flex items-center gap-1.5 bg-blue-800/80 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-400/30 transition"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>{t('verifyQR')}</span>
            </button>

            {/* DEMO ROLE SWITCHER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Role: {role.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-gray-700 border-b">
                    Switch Demo User Persona
                  </div>
                  <div className="p-1.5 space-y-1">
                    {rolesList.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleChange(r.role)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition flex items-start gap-2.5 ${
                          role === r.role ? 'bg-blue-50 border border-blue-200 font-semibold' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`w-2 h-2 mt-1 rounded-full ${r.color}`}></span>
                        <div>
                          <div className="font-bold text-gray-900">{r.label}</div>
                          <div className="text-[11px] text-gray-500">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current Logged In User Avatar */}
            {user && (
              <div className="flex items-center gap-2 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-800">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-300"
                />
                <div className="text-left text-xs">
                  <div className="font-bold text-white max-w-[120px] truncate">{user.name}</div>
                  <div className="text-[10px] text-amber-300">{user.rtoCode || 'Citizen'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenAIChat}
              className="p-1.5 bg-emerald-600 text-white rounded-lg"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-blue-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <nav className={`border-b text-xs font-semibold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-200 text-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between">
          <div className="hidden lg:flex space-x-1">
            {[
              { id: 'home', label: t('home'), icon: Building2 },
              { id: 'license', label: t('drivingLicense'), icon: FileText },
              { id: 'vehicle', label: t('vehicleRegistration'), icon: Car },
              { id: 'payments', label: t('payFees'), icon: CreditCard },
              { id: 'track', label: t('trackApplication'), icon: Search },
              { id: 'grievance', label: 'Grievance & Help', icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 transition border-b-2 ${
                    isActive
                      ? 'border-[#0A4D8C] text-[#0A4D8C] font-bold bg-blue-50/50'
                      : 'border-transparent hover:text-[#0A4D8C] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Portal Indicator Badge */}
          <div className="hidden lg:flex items-center gap-2 py-1">
            <span className="text-[11px] text-gray-500">Active View:</span>
            <span className="bg-blue-100 text-[#0A4D8C] font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
              {role === 'citizen' && '👤 Citizen Self-Service Portal'}
              {role === 'officer' && '🛡️ RTO Verification Officer Portal'}
              {role === 'admin' && '📊 RTO Central Administration'}
            </span>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-white p-4 space-y-3 border-t border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-amber-300 font-bold">Switch Demo Role:</span>
              <div className="flex gap-1">
                {rolesList.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      role === r.role ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {r.role.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { onSelectNav('home'); setMobileMenuOpen(false); }}
                className="p-2 bg-slate-800 rounded text-left"
              >
                {t('home')}
              </button>
              <button
                onClick={() => { onSelectNav('license'); setMobileMenuOpen(false); }}
                className="p-2 bg-slate-800 rounded text-left"
              >
                {t('drivingLicense')}
              </button>
              <button
                onClick={() => { onSelectNav('vehicle'); setMobileMenuOpen(false); }}
                className="p-2 bg-slate-800 rounded text-left"
              >
                {t('vehicleRegistration')}
              </button>
              <button
                onClick={() => { onSelectNav('payments'); setMobileMenuOpen(false); }}
                className="p-2 bg-slate-800 rounded text-left"
              >
                {t('payFees')}
              </button>
              <button
                onClick={() => { onSelectNav('track'); setMobileMenuOpen(false); }}
                className="p-2 bg-slate-800 rounded text-left"
              >
                {t('trackApplication')}
              </button>
              <button
                onClick={() => { onOpenQRScanner(); setMobileMenuOpen(false); }}
                className="p-2 bg-[#0A4D8C] text-white font-bold rounded text-left"
              >
                {t('verifyQR')}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
