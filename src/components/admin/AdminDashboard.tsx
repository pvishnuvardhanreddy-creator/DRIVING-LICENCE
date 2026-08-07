import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  ShieldAlert,
  Users,
  Car,
  FileText,
  CreditCard,
  Download,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { User, AuditLog } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [logsList, setLogsList] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'logs' | 'reports'>('analytics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/logs'),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const logsData = await logsRes.json();

      setStats(statsData);
      setUsersList(usersData);
      setLogsList(logsData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0A4D8C', '#28A745', '#FFC107', '#DC3545', '#6f42c1'];

  const handleBackupDatabase = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      stats,
      users: usersList,
      logs: logsList,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `rto_parivahan_db_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSVReport = (reportType: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'revenue') {
      csvContent += 'Month,Registrations,Licenses,Revenue_INR\n';
      stats?.monthlyStats?.forEach((m: any) => {
        csvContent += `${m.month},${m.registrations},${m.licenses},${m.revenue}\n`;
      });
    } else {
      csvContent += 'Timestamp,Actor,Role,Action,Details\n';
      logsList.forEach((l) => {
        csvContent += `"${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.details}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rto_${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0A4D8C] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-800/80 px-3 py-1 rounded-full text-xs font-semibold text-purple-200 border border-purple-400/30 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>RTO Central System Administration & Analytics Engine</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Parivahan e-Governance Command Control
          </h2>
          <p className="text-purple-200 text-xs mt-0.5">
            Real-time Audit Logs • Database Backup • Revenue Analytics • Role Management
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBackupDatabase}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-1.5"
          >
            <Database className="w-4 h-4" />
            <span>Backup Database JSON</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-[10px]">Citizens Registered</div>
            <div className="text-lg font-extrabold text-gray-900 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-[10px]">RTO Officers</div>
            <div className="text-lg font-extrabold text-blue-800 mt-1">{stats.totalOfficers}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-[10px]">Registered Vehicles</div>
            <div className="text-lg font-extrabold text-emerald-700 mt-1">{stats.totalVehicles}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-[10px]">Active Licenses</div>
            <div className="text-lg font-extrabold text-amber-700 mt-1">{stats.totalLicenses}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-[10px]">Pending Approvals</div>
            <div className="text-lg font-extrabold text-purple-700 mt-1">{stats.pendingApplications}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-[10px]">Total Revenue</div>
            <div className="text-lg font-extrabold text-emerald-600 mt-1">₹{(stats.totalRevenue || 48200).toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}

      {/* Sub Nav Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'analytics', label: 'Analytics & Recharts' },
          { id: 'users', label: 'User & Officer Management' },
          { id: 'logs', label: 'Security Audit Logs' },
          { id: 'reports', label: 'Reports & Export' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition text-xs ${
              activeTab === tab.id
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ANALYTICS WITH RECHARTS */}
      {activeTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Registrations & Revenue Line Chart */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="font-bold text-gray-900 text-sm border-b pb-2 flex justify-between items-center">
              <span>Monthly Registrations & Fee Revenue Trend</span>
              <span className="text-gray-400 text-[10px]">Monthly Aggregated Data</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#0A4D8C" strokeWidth={3} name="Vehicle RCs" />
                  <Line type="monotone" dataKey="licenses" stroke="#28A745" strokeWidth={3} name="Driving Licenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vehicle Category Pie Chart */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="font-bold text-gray-900 text-sm border-b pb-2">Vehicle Category Share</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.vehicleCategoryBreakdown}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label
                  >
                    {stats.vehicleCategoryBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] space-y-1 text-gray-600 border-t pt-2">
              {stats.vehicleCategoryBreakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span>{item.name}</span>
                  </span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200 font-bold text-gray-800 flex justify-between items-center">
            <span>System Users & Officer RBAC Directory ({usersList.length})</span>
          </div>

          <div className="divide-y divide-gray-100 overflow-x-auto">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3">
                  <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-gray-300" />
                  <div>
                    <div className="font-bold text-gray-900 text-xs flex items-center gap-2">
                      <span>{u.name}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-900'
                            : u.role === 'officer'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <div className="text-gray-500 text-[11px] mt-0.5">
                      Email: {u.email} • Phone: {u.phone} • Aadhaar: {u.aadhaarNumber}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 font-semibold">
                  Jurisdiction: {u.rtoName || 'National Portal'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200 font-bold text-gray-800 flex justify-between items-center">
            <span>Real-time Security Audit Logs Feed ({logsList.length})</span>
            <button
              onClick={() => handleExportCSVReport('audit_logs')}
              className="bg-purple-900 text-white font-bold px-3 py-1 rounded-lg text-xs"
            >
              Export CSV
            </button>
          </div>

          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {logsList.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50 transition text-xs flex justify-between items-start gap-3">
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <span>{log.actorName}</span>
                    <span className="bg-gray-100 text-gray-800 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                      {log.action}
                    </span>
                  </div>
                  <div className="text-gray-600 text-[11px] mt-0.5">{log.details}</div>
                </div>

                <div className="text-right text-[10px] text-gray-400 font-mono shrink-0">
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                  <div>IP: {log.ipAddress}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS ENGINE */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="font-bold text-gray-900 text-sm border-b pb-2 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Official Governance PDF / CSV Report Generator</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-950 text-sm">Monthly Treasury Revenue Statement</h4>
              <p className="text-gray-600 text-xs">Contains aggregated fee breakdowns for DLs, RCs, Road Tax, and Fines.</p>
              <button
                onClick={() => handleExportCSVReport('revenue')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Revenue CSV</span>
              </button>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <h4 className="font-bold text-blue-950 text-sm">Audit Security & User Logs</h4>
              <p className="text-gray-600 text-xs">Complete trace of all system logins, license approvals, and officer actions.</p>
              <button
                onClick={() => handleExportCSVReport('audit')}
                className="bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Audit CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
