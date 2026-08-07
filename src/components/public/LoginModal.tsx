import React, { useState } from 'react';
import { X, User, ShieldCheck, KeyRound, Sparkles, Building2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [identifier, setIdentifier] = useState('8392-1029-4812');
  const [otp, setOtp] = useState('123456');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'citizen') {
      setIdentifier('8392-1029-4812');
    } else if (role === 'officer') {
      setIdentifier('MH12-OFFICER-9081');
    } else {
      setIdentifier('ADMIN-PARIVAHAN-001');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">Parivahan Single Sign-On (SSO)</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="p-5 space-y-4 text-xs">
          {/* Role Selection Tabs */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">Select User Access Role *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'citizen', label: 'Citizen', desc: 'Aadhaar SSO' },
                { id: 'officer', label: 'RTO Officer', desc: 'MH-12 Pune' },
                { id: 'admin', label: 'Admin', desc: 'Central Portal' },
              ].map((roleItem) => {
                const isSelected = selectedRole === roleItem.id;
                return (
                  <button
                    key={roleItem.id}
                    type="button"
                    onClick={() => handleRoleSelect(roleItem.id as UserRole)}
                    className={`p-2.5 rounded-xl border text-left font-bold transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0A4D8C] text-white border-[#0A4D8C] shadow-md'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs">{roleItem.label}</span>
                    <span className={`text-[9px] font-normal mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      {roleItem.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Credentials Banner */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-950 space-y-1">
            <div className="font-bold text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Persona Preset Loaded:</span>
            </div>
            {selectedRole === 'citizen' && (
              <p className="text-[10px] text-amber-900">
                Persona: <strong>Rajesh Sharma</strong> (Citizen) • Pre-filled Aadhaar & OTP
              </p>
            )}
            {selectedRole === 'officer' && (
              <p className="text-[10px] text-amber-900">
                Persona: <strong>Inspector Vikram Kulkarni</strong> (RTO MH-12 Pune)
              </p>
            )}
            {selectedRole === 'admin' && (
              <p className="text-[10px] text-amber-900">
                Persona: <strong>System Administrator</strong> (Ministry of Road Transport)
              </p>
            )}
          </div>

          {/* Identifier Input */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              {selectedRole === 'citizen' ? 'Aadhaar / Mobile Number *' : 'Government Employee ID *'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
            />
          </div>

          {/* OTP / Secret Code */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              {selectedRole === 'citizen' ? 'One-Time Password (OTP) *' : 'Department Security PIN *'}
            </label>
            <input
              type="password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Default simulation OTP: 123456</span>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold rounded-xl shadow transition"
            >
              Sign In to Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
