import React, { useState } from 'react';
import { CreditCard, QrCode, Building, Wallet, CheckCircle2, Download, Printer, X, ShieldCheck } from 'lucide-react';
import { PaymentMethod, PaymentRecord } from '../../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicantName: string;
  purpose: string;
  amount: number;
  onPaymentSuccess: (receipt: PaymentRecord) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  applicantName,
  purpose,
  amount,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [vpa, setVpa] = useState('rajesh@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8901');
  const [cardHolder, setCardHolder] = useState(applicantName);
  const [processing, setProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const payload = {
      applicationId,
      applicantName,
      purpose,
      amount,
      paymentMethod: method,
    };

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.id) {
        setCompletedReceipt(data);
        onPaymentSuccess(data);
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">Parivahan Fee e-Payment Gateway</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {!completedReceipt ? (
          <form onSubmit={handlePay} className="p-5 space-y-4 text-xs">
            {/* Fee Summary Box */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 space-y-1">
              <div className="text-[10px] text-blue-800 uppercase font-bold tracking-wider">Treasury Fee Summary</div>
              <div className="font-bold text-gray-900 text-sm">{purpose}</div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-gray-600">Applicant: <strong>{applicantName}</strong></span>
                <span className="text-lg font-extrabold text-[#0A4D8C]">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Select Payment Gateway Option *</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'net_banking', label: 'Banking', icon: Building },
                  { id: 'wallet', label: 'Wallet', icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  const selected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex flex-col items-center justify-center gap-1 transition ${
                        selected
                          ? 'bg-[#0A4D8C] text-white border-[#0A4D8C] shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Specific Inputs */}
            {method === 'upi' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-white p-2 rounded-lg border border-gray-300 flex items-center justify-center shadow-inner shrink-0">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-gray-900">Scan & Pay via BHIM UPI / GPay / PhonePe</div>
                    <div className="text-[10px] text-gray-500">Scan code on mobile app or type Virtual Payment Address below</div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">UPI ID (VPA) *</label>
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    required
                    placeholder="e.g. mobile@upi"
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 font-mono text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Card Number *</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 font-mono text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Expiry Date *</label>
                    <input type="text" defaultValue="08/29" className="w-full bg-white border border-gray-300 rounded-xl p-2 font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">CVV *</label>
                    <input type="password" defaultValue="•••" className="w-full bg-white border border-gray-300 rounded-xl p-2 font-mono text-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-Bit Bank Grade Encrypted Payment Gateway (RBI & NPCI Verified)</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              >
                {processing ? 'Processing Transaction...' : `Pay ₹${amount.toLocaleString('en-IN')} Now`}
              </button>
            </div>
          </form>
        ) : (
          /* Payment Success & e-Receipt View */
          <div className="p-6 space-y-4 text-xs text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-emerald-950">PAYMENT SUCCESSFUL!</h3>
              <p className="text-gray-500 text-[11px] mt-0.5">Government Treasury e-Receipt Issued</p>
            </div>

            <div className="bg-slate-50 border border-gray-300 rounded-2xl p-4 text-left space-y-2 font-mono text-[11px] text-gray-800">
              <div className="flex justify-between border-b pb-1 font-bold text-gray-900">
                <span>Receipt No:</span>
                <span className="text-[#0A4D8C]">{completedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span>{completedReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicant Name:</span>
                <span>{completedReceipt.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span>Purpose:</span>
                <span>{completedReceipt.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="uppercase">{completedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold text-sm text-emerald-700">
                <span>Total Amount Paid:</span>
                <span>₹{completedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition"
              >
                Close Gateway
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
