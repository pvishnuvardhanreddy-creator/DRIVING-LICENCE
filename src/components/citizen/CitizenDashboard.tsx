import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Car,
  CreditCard,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Eye,
  Sparkles,
  Search,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RTOApplication, Vehicle, DrivingLicense, PaymentRecord } from '../../types';

interface CitizenDashboardProps {
  onOpenApplyLicense: () => void;
  onOpenApplyVehicle: () => void;
  onOpenPayFees: () => void;
  onOpenTestSimulator: () => void;
  onViewSmartCardLicense: (license: DrivingLicense) => void;
  onViewSmartCardVehicle: (vehicle: Vehicle) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onOpenApplyLicense,
  onOpenApplyVehicle,
  onOpenPayFees,
  onOpenTestSimulator,
  onViewSmartCardLicense,
  onViewSmartCardVehicle,
}) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<RTOApplication[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [myLicenses, setMyLicenses] = useState<DrivingLicense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const [appRes, vehRes, licRes] = await Promise.all([
        fetch(`/api/applications?role=citizen&userId=${user.id}`),
        fetch(`/api/vehicles?ownerId=${user.id}`),
        fetch(`/api/licenses?userId=${user.id}`),
      ]);

      const apps = await appRes.json();
      const vehs = await vehRes.json();
      const lics = await licRes.json();

      setApplications(apps);
      setMyVehicles(vehs);
      setMyLicenses(lics);
    } catch (err) {
      console.error('Failed to fetch citizen portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: RTOApplication['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="bg-blue-100 text-[#0A4D8C] px-2.5 py-0.5 rounded-full font-bold text-[10px]">Submitted</span>;
      case 'documents_under_review':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Under Review</span>;
      case 'test_scheduled':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Test Scheduled</span>;
      case 'approved':
      case 'certificate_issued':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Certificate Issued</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A4D8C] to-blue-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-800/80 px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-300 border border-blue-400/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Citizen Profile</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Citizen'}
            </h2>
            <p className="text-blue-100 text-xs mt-1">
              Aadhaar: <span className="font-mono">{user?.aadhaarNumber}</span> • Registered Phone: {user?.phone}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenApplyLicense}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for DL / LL</span>
            </button>

            <button
              onClick={onOpenApplyVehicle}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register Vehicle RC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#0A4D8C] rounded-xl flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-gray-500 text-[11px]">Active Licenses</div>
            <div className="text-xl font-extrabold text-gray-900">{myLicenses.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-gray-500 text-[11px]">Registered Vehicles</div>
            <div className="text-xl font-extrabold text-gray-900">{myVehicles.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-gray-500 text-[11px]">Active Applications</div>
            <div className="text-xl font-extrabold text-gray-900">{applications.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-gray-500 text-[11px]">Total Fees Paid</div>
            <div className="text-xl font-extrabold text-gray-900">
              ₹{applications.reduce((acc, a) => acc + (a.paymentStatus === 'completed' ? a.feeAmount : 0), 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications Tracker Timeline */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0A4D8C]" />
              <span>Live Application Status & Tracking</span>
            </h3>
            <span className="text-[11px] text-gray-500">Auto-Refreshed</span>
          </div>

          {applications.length === 0 ? (
            <div className="py-10 text-center text-gray-500 space-y-2">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-bold text-xs text-gray-700">No active RTO applications</p>
              <button
                onClick={onOpenApplyLicense}
                className="bg-[#0A4D8C] text-white font-bold px-4 py-1.5 rounded-xl text-xs"
              >
                Start New Application
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-[#0A4D8C] font-mono">{app.applicationNumber}</div>
                      <div className="font-bold text-gray-900 text-xs mt-0.5 capitalize">
                        {app.type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-gray-500 text-[10px]">RTO Office: {app.rtoOffice}</div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  {/* Payment Alert if pending */}
                  {app.paymentStatus === 'pending' && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex justify-between items-center text-amber-900">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>Fee Payment Pending: <strong>₹{app.feeAmount}</strong></span>
                      </div>
                      <button
                        onClick={onOpenPayFees}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Pay Online
                      </button>
                    </div>
                  )}

                  {/* Scheduled Test details if present */}
                  {app.testDetails && (
                    <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-xl text-purple-950 font-medium">
                      <div className="font-bold text-xs flex justify-between">
                        <span>Driving Track Test Appointment:</span>
                        <span className="text-purple-700 font-mono">{app.testDetails.scheduledDate} ({app.testDetails.scheduledTime})</span>
                      </div>
                      <div className="text-[10px] text-purple-800 mt-0.5">Center: {app.testDetails.rtoCenter}</div>
                    </div>
                  )}

                  {/* Officer Remarks */}
                  {app.officerRemarks && (
                    <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 text-blue-900 text-[11px]">
                      <span className="font-bold text-[#0A4D8C] block">Officer Review Note:</span>
                      <span>"{app.officerRemarks}"</span>
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 flex justify-between pt-1">
                    <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                    <span>Last Update: {new Date(app.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Issued Licenses & Vehicles */}
        <div className="lg:col-span-5 space-y-6">
          {/* My Digital Driving Licenses */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>My Driving Licenses ({myLicenses.length})</span>
              </h3>
            </div>

            {myLicenses.length === 0 ? (
              <div className="text-gray-500 text-center py-4 text-xs">
                No active Driving License found under your profile.
              </div>
            ) : (
              <div className="space-y-2">
                {myLicenses.map((lic) => (
                  <div key={lic.id} className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-amber-950 font-mono text-sm">{lic.licenseNumber}</div>
                      <div className="text-gray-600 text-[11px]">Valid Until: <strong className="text-amber-800">{lic.expiryDate}</strong></div>
                      <div className="text-[10px] text-gray-500">{lic.vehicleClasses.join(', ')}</div>
                    </div>

                    <button
                      onClick={() => onViewSmartCardLicense(lic)}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow transition flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Smart Card</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Registered Vehicles */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>My Vehicle RCs ({myVehicles.length})</span>
              </h3>
            </div>

            {myVehicles.length === 0 ? (
              <div className="text-gray-500 text-center py-4 text-xs">
                No registered vehicles linked with your Aadhaar.
              </div>
            ) : (
              <div className="space-y-2">
                {myVehicles.map((v) => (
                  <div key={v.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-emerald-950 font-mono text-sm">{v.registrationNumber}</div>
                      <div className="text-gray-700 text-[11px] font-semibold">{v.makerModel} ({v.fuelType})</div>
                      <div className="text-[10px] text-gray-500">Chassis: {v.chassisNumber}</div>
                    </div>

                    <button
                      onClick={() => onViewSmartCardVehicle(v)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>RC Card</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Mock Exam Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 rounded-2xl border border-emerald-700 flex justify-between items-center">
            <div>
              <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Learner License Computer Exam Simulator</span>
              </div>
              <p className="text-[11px] text-emerald-100 mt-0.5">
                Practice 10 traffic rules questions before your official test.
              </p>
            </div>

            <button
              onClick={onOpenTestSimulator}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow transition shrink-0"
            >
              Take Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
