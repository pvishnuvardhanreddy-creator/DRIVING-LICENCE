import React, { useState } from 'react';
import { Car, X, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApplicationType } from '../../types';

interface ApplyVehicleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: () => void;
}

export const ApplyVehicleRegistrationModal: React.FC<ApplyVehicleRegistrationModalProps> = ({
  isOpen,
  onClose,
  onApplicationCreated,
}) => {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState<ApplicationType>('new_vehicle_registration');
  const [makerModel, setMakerModel] = useState('Mahindra XUV700 AX7');
  const [vehicleClass, setVehicleClass] = useState<'2_wheeler' | 'lmv_car' | 'electric' | 'hmv_truck'>('lmv_car');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'EV' | 'CNG'>('Petrol');
  const [chassisNumber, setChassisNumber] = useState('MAT612093M8A' + Math.floor(10000 + Math.random() * 90000));
  const [engineNumber, setEngineNumber] = useState('ENG' + Math.floor(10000000 + Math.random() * 90000000));
  const [rtoOffice, setRtoOffice] = useState('MH-12 (Pune RTO)');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const feeMap: Record<string, number> = {
    new_vehicle_registration: 3200,
    ownership_transfer: 1200,
    address_change: 300,
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
      type: serviceType,
      rtoOffice,
      feeAmount: feeMap[serviceType] || 2500,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          type: 'insurance',
          name: 'Vehicle_Insurance_Policy.pdf',
          fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600',
          status: 'pending',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: `doc-${Date.now()}-2`,
          type: 'puc',
          name: 'Pollution_Under_Control.pdf',
          fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
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
      console.error('Failed to create vehicle application:', err);
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
            <Car className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">Vehicle Registration & RC Transfer Portal</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Service Selection */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Select Service Type *</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ApplicationType)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-semibold text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
            >
              <option value="new_vehicle_registration">New Vehicle RC Registration - Fee ₹3,200</option>
              <option value="ownership_transfer">Vehicle Ownership Transfer (Form 29 & 30) - Fee ₹1,200</option>
              <option value="address_change">Change of Owner Address on RC - Fee ₹300</option>
            </select>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Vehicle Maker & Model *</label>
              <input
                type="text"
                value={makerModel}
                onChange={(e) => setMakerModel(e.target.value)}
                placeholder="e.g. Tata Nexon EV or Honda Activa"
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Fuel / Power Type *</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="EV">EV (Electric Vehicle)</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Chassis Number (17 Chars) *</label>
              <input
                type="text"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Engine / Motor Number *</label>
              <input
                type="text"
                value={engineNumber}
                onChange={(e) => setEngineNumber(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              />
            </div>
          </div>

          {/* RTO Location */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Issuing RTO Jurisdiction *</label>
            <select
              value={rtoOffice}
              onChange={(e) => setRtoOffice(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
            >
              <option value="MH-12 (Pune RTO)">MH-12 (Pune RTO, MH)</option>
              <option value="MH-01 (Mumbai South)">MH-01 (Mumbai South, MH)</option>
              <option value="DL-01 (Delhi Central)">DL-01 (Delhi Central)</option>
              <option value="KA-01 (Bengaluru Central)">KA-01 (Bengaluru Central)</option>
            </select>
          </div>

          {/* Fee Calculation Badge */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-emerald-950 font-bold">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Smart Card RC & Road Tax Fee</span>
            </div>
            <span className="text-base text-emerald-700 font-extrabold">₹{feeMap[serviceType]}</span>
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
              {submitting ? 'Creating Application...' : 'Proceed to Document Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
