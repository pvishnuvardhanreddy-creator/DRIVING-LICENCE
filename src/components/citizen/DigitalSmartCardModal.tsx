import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, Award, CheckCircle2 } from 'lucide-react';
import { DrivingLicense, Vehicle } from '../../types';

interface DigitalSmartCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  license?: DrivingLicense;
  vehicle?: Vehicle;
}

export const DigitalSmartCardModal: React.FC<DigitalSmartCardModalProps> = ({
  isOpen,
  onClose,
  license,
  vehicle,
}) => {
  if (!isOpen || (!license && !vehicle)) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">
              Digital {license ? 'Driving License' : 'Vehicle Registration (RC)'} Smart Card
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* DRIVING LICENSE SMART CARD FRONT */}
          {license && (
            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-blue-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xl overflow-hidden font-sans text-slate-900">
              {/* Background Hologram Sheen */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

              {/* Top Header */}
              <div className="flex justify-between items-start border-b-2 border-amber-400 pb-2 mb-3">
                <div>
                  <div className="text-[10px] font-extrabold text-[#0A4D8C] uppercase tracking-wider">
                    UNION OF INDIA • DRIVING LICENSE
                  </div>
                  <div className="text-xs font-bold text-amber-900">{license.issuingRTO}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-semibold">FORM 7 (RULE 16(2))</div>
                  <div className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase inline-block">
                    {license.status}
                  </div>
                </div>
              </div>

              {/* Card Body Grid */}
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* Photo & Chip */}
                <div className="col-span-4 space-y-2 text-center">
                  <div className="relative w-24 h-28 mx-auto bg-gray-200 rounded-lg overflow-hidden border-2 border-amber-400 shadow">
                    <img
                      src={license.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                      alt={license.holderName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Smart Card Chip */}
                  <div className="w-8 h-6 mx-auto bg-amber-400 rounded-sm border border-amber-600 shadow-inner flex items-center justify-center">
                    <div className="w-5 h-3 border-t border-b border-amber-700"></div>
                  </div>
                </div>

                {/* Main License Details */}
                <div className="col-span-8 space-y-1 text-[11px]">
                  <div>
                    <span className="text-gray-500 text-[10px] block">DL NO:</span>
                    <strong className="text-sm font-mono text-[#0A4D8C] font-extrabold">{license.licenseNumber}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[10px] block">NAME OF HOLDER:</span>
                    <strong className="text-xs font-bold uppercase text-gray-900">{license.holderName}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-0.5">
                    <div>
                      <span className="text-gray-500 text-[9px] block">DOB:</span>
                      <strong>{license.dob}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[9px] block">BLOOD GRP:</span>
                      <strong className="text-red-700">{license.bloodGroup}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[9px] block">VEHICLE CLASS(ES):</span>
                    <strong className="text-emerald-800">{license.vehicleClasses.join(', ')}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-0.5 border-t border-amber-200">
                    <div>
                      <span className="text-gray-500 text-[9px] block">ISSUE DATE:</span>
                      <strong>{license.issueDate}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[9px] block">VALID UNTIL:</span>
                      <strong className="text-[#0A4D8C] font-bold">{license.expiryDate}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer & QR Barcode */}
              <div className="mt-3 pt-2 border-t border-amber-300 flex justify-between items-center text-[9px] text-gray-600">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>MoRTH Encrypted Smart Card • IT Act Compliant</span>
                </div>

                <div className="flex items-center gap-1 font-mono text-gray-900 font-bold">
                  <QrCode className="w-5 h-5 text-slate-800" />
                  <span>{license.qrCodeValue}</span>
                </div>
              </div>
            </div>
          )}

          {/* VEHICLE REGISTRATION (RC) SMART CARD FRONT */}
          {vehicle && (
            <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-xl overflow-hidden font-sans text-slate-900">
              {/* Top Header */}
              <div className="flex justify-between items-start border-b-2 border-emerald-400 pb-2 mb-3">
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider">
                    VEHICLE REGISTRATION CERTIFICATE (RC)
                  </div>
                  <div className="text-xs font-bold text-gray-800">{vehicle.rtoOffice}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-semibold">FORM 23 (RULE 48)</div>
                  <div className="bg-emerald-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase inline-block">
                    {vehicle.status}
                  </div>
                </div>
              </div>

              {/* Card Body Grid */}
              <div className="space-y-2 text-[11px]">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-[10px] block">REGISTRATION NUMBER:</span>
                    <strong className="text-base font-mono text-emerald-900 font-extrabold">{vehicle.registrationNumber}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-[10px] block">FUEL TYPE:</span>
                    <strong className="text-amber-700">{vehicle.fuelType}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500 text-[9px] block">REGISTERED OWNER:</span>
                    <strong className="uppercase text-gray-900">{vehicle.ownerName}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[9px] block">MAKER & MODEL:</span>
                    <strong className="text-gray-900">{vehicle.makerModel}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[9px] block">CHASSIS NO:</span>
                    <strong className="font-mono text-gray-800">{vehicle.chassisNumber}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[9px] block">ENGINE / MOTOR NO:</span>
                    <strong className="font-mono text-gray-800">{vehicle.engineNumber}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[9px] block">REGISTRATION DATE:</span>
                    <strong>{vehicle.registrationDate}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 text-[9px] block">RC VALID UNTIL:</span>
                    <strong className="text-emerald-700 font-bold">{vehicle.validUntil}</strong>
                  </div>
                </div>

                <div className="bg-emerald-100/60 p-2 rounded-lg border border-emerald-200 text-[10px] flex justify-between">
                  <span>Insurance Valid: <strong>{vehicle.insuranceValidUntil}</strong></span>
                  <span>PUC Valid: <strong>{vehicle.pucValidUntil}</strong></span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2 border-t border-emerald-300 flex justify-between items-center text-[9px] text-gray-600">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Central Motor Vehicles Rules • Formally Certified</span>
                </div>

                <div className="flex items-center gap-1 font-mono text-gray-900 font-bold">
                  <QrCode className="w-5 h-5 text-slate-800" />
                  <span>{vehicle.qrCodeValue}</span>
                </div>
              </div>
            </div>
          )}

          {/* Download & Print Actions */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
