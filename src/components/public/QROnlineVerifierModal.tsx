import React, { useState } from 'react';
import { QrCode, ShieldCheck, CheckCircle2, AlertTriangle, X, Search, FileText, Car, Award } from 'lucide-react';

interface QROnlineVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QROnlineVerifierModal: React.FC<QROnlineVerifierModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (codeToVerify?: string) => {
    const inputCode = (codeToVerify || code).trim().toUpperCase();
    if (!inputCode) return;

    setLoading(true);
    setVerificationResult(null);

    setTimeout(() => {
      setLoading(false);
      if (inputCode.includes('DL') || inputCode.includes('MH1220240098124') || inputCode.includes('RAJESH')) {
        setVerificationResult({
          type: 'Driving License',
          status: 'AUTHENTIC & ACTIVE',
          number: 'MH12 20240098124',
          holderName: 'Rajesh Sharma',
          dob: '18-Jun-1992',
          bloodGroup: 'O+',
          vehicleClasses: ['MCWG (Motorcycle with Gear)', 'LMV (Light Motor Vehicle)'],
          issueDate: '10-Jan-2024',
          expiryDate: '09-Jan-2044',
          issuingRTO: 'MH-12 (Pune RTO, Maharashtra)',
          digitalSignature: 'SIG-GOV-MH-88120349-VERIFIED',
        });
      } else if (inputCode.includes('RC') || inputCode.includes('MH12AB9988') || inputCode.includes('9988')) {
        setVerificationResult({
          type: 'Vehicle Registration Certificate (RC)',
          status: 'AUTHENTIC & ACTIVE',
          number: 'MH 12 AB 9988',
          ownerName: 'Rajesh Sharma',
          vehicleClass: 'LMV (Electric Passenger Car)',
          makerModel: 'Tata Nexon EV Max',
          chassisNumber: 'MAT612093M8A10294',
          engineNumber: 'ENG88102948',
          registrationDate: '15-Mar-2024',
          validity: '14-Mar-2039 (15 Years)',
          insuranceValidity: '14-Mar-2027 (HDFC Ergo)',
          pucValidity: '14-Mar-2027',
          issuingRTO: 'MH-12 (Pune RTO)',
          digitalSignature: 'SIG-GOV-RC-10293841-VERIFIED',
        });
      } else {
        setVerificationResult({
          status: 'NOT_FOUND',
          message: 'The scanned QR code payload could not be matched with any active RTO database record.',
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">QR Certificate Public Verifier</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-gray-600 leading-relaxed">
            Scan or enter the QR code payload printed on any Driving License or Vehicle Registration Smart Card to verify authenticity against official MoRTH records.
          </p>

          {/* Quick Demo Pre-fill Buttons */}
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 space-y-2">
            <span className="font-bold text-blue-900 block text-[11px]">Click a sample payload to verify instantly:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCode('RTO-DL-MH1220240098124-RAJESH-SHARMA');
                  handleVerify('RTO-DL-MH1220240098124-RAJESH-SHARMA');
                }}
                className="bg-white hover:bg-blue-100 text-[#0A4D8C] font-semibold px-2.5 py-1 rounded border border-blue-200 transition shadow-sm text-[11px]"
              >
                Sample DL QR Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode('RTO-RC-MH12AB9988-RAJESH-SHARMA');
                  handleVerify('RTO-RC-MH12AB9988-RAJESH-SHARMA');
                }}
                className="bg-white hover:bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded border border-emerald-200 transition shadow-sm text-[11px]"
              >
                Sample RC QR Code
              </button>
            </div>
          </div>

          {/* Input Form */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <QrCode className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste or type QR string..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none text-xs font-mono"
              />
            </div>
            <button
              onClick={() => handleVerify()}
              disabled={loading}
              className="bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition shrink-0"
            >
              {loading ? 'Verifying...' : 'Verify Record'}
            </button>
          </div>

          {/* Verification Results Output */}
          {verificationResult && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in duration-300">
              {verificationResult.status === 'NOT_FOUND' ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">Verification Failed</div>
                    <div className="text-xs text-red-700 mt-1">{verificationResult.message}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>{verificationResult.type}</span>
                    </div>
                    <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {verificationResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-800">
                    <div>
                      <span className="text-gray-500 block">Certificate No:</span>
                      <strong className="text-gray-900 font-mono text-xs">{verificationResult.number}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Holder / Owner Name:</span>
                      <strong className="text-gray-900">{verificationResult.holderName || verificationResult.ownerName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Issuing Authority:</span>
                      <strong>{verificationResult.issuingRTO}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Validity Date:</span>
                      <strong className="text-emerald-700">{verificationResult.expiryDate || verificationResult.validity}</strong>
                    </div>
                  </div>

                  {verificationResult.vehicleClasses && (
                    <div className="bg-white p-2 rounded border border-emerald-100 text-[11px]">
                      <span className="text-gray-500 block mb-0.5">Authorized Vehicle Classes:</span>
                      <div className="font-bold text-gray-800">{verificationResult.vehicleClasses.join(', ')}</div>
                    </div>
                  )}

                  {verificationResult.makerModel && (
                    <div className="bg-white p-2 rounded border border-emerald-100 text-[11px] grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-gray-500 block">Vehicle Model:</span>
                        <strong className="text-gray-800">{verificationResult.makerModel}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Chassis No:</span>
                        <strong className="font-mono text-gray-800">{verificationResult.chassisNumber}</strong>
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-emerald-800 font-mono bg-emerald-100/60 p-2 rounded flex justify-between items-center">
                    <span>Digital Seal: {verificationResult.digitalSignature}</span>
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
