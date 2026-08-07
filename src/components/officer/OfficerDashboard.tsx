import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Clock,
  Eye,
  Calendar,
  Award,
  AlertCircle,
  X,
  Search,
  Filter
} from 'lucide-react';
import { RTOApplication, DocumentFile, DrivingTestSlot } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<RTOApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<RTOApplication | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'review' | 'tests' | 'approved'>('pending');
  const [officerNotes, setOfficerNotes] = useState('');
  const [testDate, setTestDate] = useState('2026-08-12');
  const [testTime, setTestTime] = useState('11:00 AM');
  const [testCenter, setTestCenter] = useState('MH-12 Pune Track 1');
  const [testScore, setTestScore] = useState(8);
  const [testResult, setTestResult] = useState<'passed' | 'failed'>('passed');
  const [issuedNoInput, setIssuedNoInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications?role=officer&rtoOffice=MH-12');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load officer queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (appId: string, docId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/applications/${appId}/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setSelectedApp(updated);
      fetchQueue();
    } catch (err) {
      console.error('Doc verify error:', err);
    }
  };

  const handleUpdateStatus = async (appId: string, status: RTOApplication['status']) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          officerRemarks: officerNotes || `Status updated to ${status} by ${user?.name || 'Officer'}`,
          officerName: user?.name || 'Inspector Vikram Kulkarni',
          issuedNumber: issuedNoInput,
        }),
      });
      if (res.ok) {
        fetchQueue();
        setSelectedApp(null);
        setOfficerNotes('');
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleScheduleTest = async (appId: string) => {
    const testPayload: DrivingTestSlot = {
      id: `test-${Date.now()}`,
      applicationId: appId,
      applicantName: selectedApp?.applicantName || 'Citizen',
      testType: 'practical_driving',
      scheduledDate: testDate,
      scheduledTime: testTime,
      rtoCenter: testCenter,
      status: 'scheduled',
    };

    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'test_scheduled',
          officerRemarks: `Practical driving track test scheduled for ${testDate} at ${testCenter}`,
          officerName: user?.name || 'Inspector Vikram Kulkarni',
          testDetails: testPayload,
        }),
      });
      if (res.ok) {
        fetchQueue();
        setSelectedApp(null);
      }
    } catch (err) {
      console.error('Schedule test error:', err);
    }
  };

  const filteredApps = applications.filter((a) => {
    if (activeTab === 'pending') return a.status === 'submitted' || a.status === 'documents_under_review';
    if (activeTab === 'tests') return a.status === 'test_scheduled';
    if (activeTab === 'approved') return a.status === 'approved' || a.status === 'certificate_issued';
    return true;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Officer Welcome Header */}
      <div className="bg-[#0A4D8C] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-800 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-blue-400/30 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authorized Regional Transport Officer Dashboard</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {user?.name || 'Inspector Vikram Kulkarni'} ({user?.rtoCode || 'MH-12 Pune'})
          </h2>
          <p className="text-blue-100 text-xs mt-0.5">
            Verification Queue: <strong className="text-amber-300">{applications.length} Active Applications</strong> in Jurisdiction
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchQueue}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'pending', label: 'Documents Pending Review' },
          { id: 'tests', label: 'Driving Track Tests' },
          { id: 'approved', label: 'Approved & Certificates Issued' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition text-xs ${
              activeTab === tab.id
                ? 'bg-[#0A4D8C] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gray-200 font-bold text-gray-800 flex justify-between items-center">
          <span>Officer Application Queue ({filteredApps.length})</span>
          <span className="text-gray-500 text-[11px]">Click an application to inspect documents & take action</span>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          {filteredApps.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold">
              No applications currently waiting in this queue tab.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="p-4 hover:bg-blue-50/50 transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-sm text-[#0A4D8C]">{app.applicationNumber}</span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                      {app.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-gray-900 font-semibold text-xs mt-1">
                    Applicant: <strong>{app.applicantName}</strong> (Aadhaar: {app.aadhaarNumber})
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Submitted: {new Date(app.submittedAt).toLocaleDateString()} • Attached Documents: {app.documents.length}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      app.status === 'certificate_issued'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'test_scheduled'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>

                  <button className="bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* OFFICER INSPECTION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
              <div>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <span>Application Inspection: {selectedApp.applicationNumber}</span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    {selectedApp.type}
                  </span>
                </h2>
                <p className="text-blue-100 text-xs">Applicant: {selectedApp.applicantName} ({selectedApp.applicantPhone})</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1 hover:bg-blue-800 rounded-lg transition">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Documents Verification Section */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-sm border-b pb-1 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#0A4D8C]" />
                  <span>Document Verification Side-by-Side</span>
                </h3>

                {selectedApp.documents.length === 0 ? (
                  <div className="text-gray-500 italic p-3 bg-gray-50 rounded-xl">No uploaded documents attached to this application yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedApp.documents.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 uppercase text-[11px]">{doc.type}: {doc.name}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              doc.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                          <img src={doc.fileUrl} alt={doc.name} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleVerifyDocument(selectedApp.id, doc.id, 'verified')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg transition text-center"
                          >
                            Approve Doc
                          </button>
                          <button
                            onClick={() => handleVerifyDocument(selectedApp.id, doc.id, 'rejected')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 rounded-lg transition text-center"
                          >
                            Reject Doc
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Form 1: Schedule Track Test */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-2">
                <h4 className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <span>Schedule Practical Driving Test Slot</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-purple-900 text-[10px] mb-0.5">Test Date</label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-900 text-[10px] mb-0.5">Time Slot</label>
                    <input
                      type="text"
                      value={testTime}
                      onChange={(e) => setTestTime(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-2 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-900 text-[10px] mb-0.5">RTO Center</label>
                    <input
                      type="text"
                      value={testCenter}
                      onChange={(e) => setTestCenter(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-2 font-semibold"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleScheduleTest(selectedApp.id)}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Schedule Test & Notify Applicant
                </button>
              </div>

              {/* Action Form 2: Final Approval & Issue DL/RC */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Approve Application & Issue Digital Smart Card Certificate</span>
                </h4>

                <div>
                  <label className="block font-semibold text-emerald-900 text-[10px] mb-0.5">
                    Assign Official Certificate Number (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={issuedNoInput}
                    onChange={(e) => setIssuedNoInput(e.target.value)}
                    placeholder="e.g. MH12 20260098124 or MH 12 FK 9912"
                    className="w-full bg-white border border-emerald-300 rounded-xl p-2 font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-emerald-900 text-[10px] mb-0.5">Officer Review Remarks</label>
                  <textarea
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    rows={2}
                    placeholder="Enter official approval or rejection notes..."
                    className="w-full bg-white border border-emerald-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'certificate_issued')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                  >
                    Approve & Issue Certificate
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
