import React, { useState, useEffect } from 'react';
import { Search, X, Car, FileText, FileCheck, ShieldAlert, ArrowRight, User } from 'lucide-react';
import { Vehicle, DrivingLicense, RTOApplication } from '../../types';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSelectApplication?: (app: RTOApplication) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onSelectApplication,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    vehicles: Vehicle[];
    licenses: DrivingLicense[];
    applications: RTOApplication[];
  }>({ vehicles: [], licenses: [], applications: [] });

  useEffect(() => {
    if (initialQuery && isOpen) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  if (!isOpen) return null;

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const totalHits = results.vehicles.length + results.licenses.length + results.applications.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0A4D8C] text-white p-4 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">Parivahan Universal Search Engine</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 bg-slate-50 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type Vehicle No, License No, Application No, Aadhaar, or Name..."
                className="w-full bg-white text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#0A4D8C] focus:outline-none shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition shrink-0"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Search Results List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs">
          {!loading && totalHits === 0 && query && (
            <div className="text-center py-10 text-gray-500">
              <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-gray-700">No matching RTO records found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for "MH 12 AB 9988", "MH12 20240098124", "RTO2026-88120", or "Rajesh"
              </p>
            </div>
          )}

          {/* Applications Match */}
          {results.applications.length > 0 && (
            <div>
              <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2 border-b pb-1">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Matching Applications ({results.applications.length})</span>
              </div>
              <div className="space-y-2">
                {results.applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl hover:bg-amber-100/50 transition flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-gray-900 text-xs flex items-center gap-2">
                        <span>App No: {app.applicationNumber}</span>
                        <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase">
                          {app.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-gray-600 text-[11px] mt-0.5">
                        Applicant: <strong>{app.applicantName}</strong> | RTO: {app.rtoOffice}
                      </div>
                      <div className="text-gray-500 text-[10px] mt-0.5">
                        Status: <strong className="text-amber-800">{app.status.toUpperCase()}</strong>
                      </div>
                    </div>

                    {onSelectApplication && (
                      <button
                        onClick={() => {
                          onSelectApplication(app);
                          onClose();
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shrink-0"
                      >
                        Track Status
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles Match */}
          {results.vehicles.length > 0 && (
            <div>
              <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2 border-b pb-1">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Matching Vehicle Registration Records ({results.vehicles.length})</span>
              </div>
              <div className="space-y-2">
                {results.vehicles.map((v) => (
                  <div key={v.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-emerald-950 font-mono text-sm">{v.registrationNumber}</div>
                      <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                        {v.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 mt-2">
                      <div>Owner: <strong>{v.ownerName}</strong></div>
                      <div>Model: <strong>{v.makerModel}</strong> ({v.fuelType})</div>
                      <div>Chassis: <span className="font-mono">{v.chassisNumber}</span></div>
                      <div>Valid Until: <span className="text-emerald-700 font-bold">{v.validUntil}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Licenses Match */}
          {results.licenses.length > 0 && (
            <div>
              <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2 border-b pb-1">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Matching Driving Licenses ({results.licenses.length})</span>
              </div>
              <div className="space-y-2">
                {results.licenses.map((l) => (
                  <div key={l.id} className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-blue-950 font-mono text-sm">{l.licenseNumber}</div>
                      <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                        {l.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 mt-2">
                      <div>Holder: <strong>{l.holderName}</strong></div>
                      <div>RTO: <strong>{l.issuingRTO}</strong></div>
                      <div>Classes: <strong>{l.vehicleClasses.join(', ')}</strong></div>
                      <div>Expiry Date: <span className="text-blue-800 font-bold">{l.expiryDate}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
