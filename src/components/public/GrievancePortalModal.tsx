import React, { useState } from 'react';
import { MessageSquare, X, CheckCircle2, ShieldAlert, Send } from 'lucide-react';

interface GrievancePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrievancePortalModal: React.FC<GrievancePortalModalProps> = ({ isOpen, onClose }) => {
  const [complainantName, setComplainantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rtoOffice, setRtoOffice] = useState('MH-12 (Pune RTO)');
  const [category, setCategory] = useState('Delay in DL Dispatch');
  const [details, setDetails] = useState('');
  const [ticketCreated, setTicketCreated] = useState<{ id: string; ticketNo: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const ticketNo = `GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketCreated({ id: `t-${Date.now()}`, ticketNo });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">Public Grievance Redressal Portal</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {!ticketCreated ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900 text-[11px]">
              Direct monitoring by CPGRAMS & State Transport Commissionerate. SLA response time within 48 hours.
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Complainant Full Name *</label>
              <input
                type="text"
                required
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                placeholder="e.g. Sunita Deshmukh"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Email ID *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Concerned RTO Jurisdiction *</label>
                <select
                  value={rtoOffice}
                  onChange={(e) => setRtoOffice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
                >
                  <option value="MH-12 (Pune RTO)">MH-12 (Pune RTO)</option>
                  <option value="MH-01 (Mumbai South)">MH-01 (Mumbai South)</option>
                  <option value="DL-01 (Delhi Central)">DL-01 (Delhi Central)</option>
                  <option value="KA-01 (Bengaluru Central)">KA-01 (Bengaluru Central)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
                >
                  <option value="Delay in DL Dispatch">Delay in DL Dispatch</option>
                  <option value="RC Address Error">RC Address Error</option>
                  <option value="Payment Deduction Error">Payment Deduction Error</option>
                  <option value="RTO Office Feedback">RTO Office Staff Feedback</option>
                  <option value="Technical Website Bug">Technical Website Bug</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the issue clearly with relevant application or RC numbers..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 font-medium text-xs focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none"
              />
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
                disabled={submitting}
                className="px-6 py-2 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Filing Grievance...' : 'Submit Grievance Ticket'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4 text-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">GRIEVANCE TICKET CREATED</h3>
            <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl font-mono text-xs">
              Ticket Reference ID: <strong className="text-[#0A4D8C] text-sm">{ticketCreated.ticketNo}</strong>
            </div>
            <p className="text-gray-600">
              Your complaint has been registered with the Transport Commissionerate. You will receive updates via SMS on <strong>{phone}</strong>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0A4D8C] text-white font-bold rounded-xl shadow transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
