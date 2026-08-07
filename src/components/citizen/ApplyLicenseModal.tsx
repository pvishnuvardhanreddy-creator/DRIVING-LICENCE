import React, { useState } from 'react';
import { FileText, X, Check, CreditCard, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApplicationType } from '../../types';

interface ApplyLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: () => void;
}

export const ApplyLicenseModal: React.FC<ApplyLicenseModalProps> = ({
  isOpen,
  onClose,
  onApplicationCreated,
}) => {
  const { user } = useAuth();
  const [licenseType, setLicenseType] = useState<ApplicationType>('learner_license');
  const [rtoOffice, setRtoOffice] = useState('MH-12 (Pune RTO)');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [vehicleClasses, setVehicleClasses] = useState<string[]>(['MCWG', 'LMV']);
  const [existingLicenseNo, setExistingLicenseNo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const feeMap: Record<ApplicationType, number> = {
    learner_license: 500,
    permanent_license: 1100,
    license_renewal: 600,
    duplicate_license: 400,
    international_permit: 1500,
    new_vehicle_registration: 3200,
    ownership_transfer: 1200,
    address_change: 300,
  };

  const handleToggleClass = (cls: string) => {
    setVehicleClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      userId: user?.id || 'user-c1',
      applicantName: user?.name || 'Rajesh Sharma',
      applicantEmail: user?.email || 'rajesh.sharma@example.com',
      applicantPhone: user?.phone || '+91 98765 43210',
      aadhaarNumber: user?.aadhaarNumber || '8392-1029-4812',
      type: licenseType,
      rtoOffice,
      feeAmount: feeMap[licenseType] || 1000,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          type: 'aadhaar',
          name: 'Aadhaar_Verification_Doc.pdf',
          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
        },
      ],
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onApplicationCreated();
        onClose();
      }
    } catch (err) {
      console.error('Failed to create application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">Driving License Application Portal</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* License Service Selection */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Select Service Type *</label>
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value as ApplicationType)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-semibold text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
            >
              <option value="learner_license">New Learner License (LL) - Fee ₹500</option>
              <option value="permanent_license">New Permanent License (DL) - Fee ₹1,100</option>
              <option value="license_renewal">Driving License Renewal - Fee ₹600</option>
              <option value="duplicate_license">Duplicate License Request - Fee ₹400</option>
              <option value="international_permit">International Driving Permit (IDP) - Fee ₹1,500</option>
            </select>
          </div>

          {/* RTO Office Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Select RTO Office *</label>
              <select
                value={rtoOffice}
                onChange={(e) => setRtoOffice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              >
                <option value="MH-12 (Pune RTO)">MH-12 (Pune RTO, MH)</option>
                <option value="MH-01 (Mumbai South)">MH-01 (Mumbai South, MH)</option>
                <option value="DL-01 (Delhi Central)">DL-01 (Delhi Central)</option>
                <option value="KA-01 (Bengaluru Central)">KA-01 (Bengaluru Central)</option>
                <option value="TN-01 (Chennai Central)">TN-01 (Chennai Central)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>

          {/* Existing License Number for Renewal/Duplicate */}
          {licenseType !== 'learner_license' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Existing Learner / Permanent License Number *
              </label>
              <input
                type="text"
                value={existingLicenseNo}
                onChange={(e) => setExistingLicenseNo(e.target.value)}
                placeholder="e.g. MH12 20240098124 or LL-MH12-2026-004921"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              />
            </div>
          )}

          {/* Vehicle Categories */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Requested Vehicle Class(es) *</label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: 'MCWG', name: 'MCWG (Motorcycle with Gear)' },
                { id: 'LMV', name: 'LMV (Light Motor Vehicle - Car)' },
                { id: 'MCWOG', name: 'MCWOG (Motorcycle without Gear)' },
                { id: 'TRANS', name: 'TRANS (Commercial Heavy Transport)' },
              ].map((item) => {
                const checked = vehicleClasses.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleClass(item.id)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                      checked
                        ? 'bg-blue-50 border-[#0A4D8C] text-[#0A4D8C]'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.name}</span>
                    {checked && <Check className="w-4 h-4 text-[#0A4D8C]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applicant Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-1 text-gray-700 text-[11px]">
            <div className="font-bold text-gray-900 border-b pb-1">Applicant Auto-Filled Credentials:</div>
            <div>Name: <strong>{user?.name}</strong></div>
            <div>Aadhaar: <strong>{user?.aadhaarNumber}</strong></div>
            <div>Phone: <strong>{user?.phone}</strong></div>
          </div>

          {/* Fee Calculation Badge */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-amber-950 font-bold">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <span>Government Standard Fee</span>
            </div>
            <span className="text-base text-amber-700 font-extrabold">₹{feeMap[licenseType]}</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold rounded-xl shadow transition"
            >
              {submitting ? 'Submitting Application...' : 'Proceed to Document Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
