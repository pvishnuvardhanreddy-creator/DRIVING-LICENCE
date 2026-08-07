import React from 'react';
import { ShieldAlert, Phone, Mail, MapPin, ExternalLink, Clock, FileCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About Portal */}
        <div>
          <div className="flex items-center space-x-2 text-white font-bold mb-3">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span className="text-sm">RTO Parivahan E-Services</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-3">
            Ministry of Road Transport and Highways, Government of India. Centralized web portal for vehicle registration, driving licenses, and transport e-governance.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-amber-300">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital India & NIC Powered Portal</span>
          </div>
        </div>

        {/* Col 2: Quick E-Services */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 border-b border-slate-800 pb-1">Quick Online Services</h3>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#license" className="hover:text-amber-300 transition flex items-center gap-1"><ExternalLink className="w-3 h-3 text-amber-400" /> Learner License Application</a></li>
            <li><a href="#license" className="hover:text-amber-300 transition flex items-center gap-1"><ExternalLink className="w-3 h-3 text-amber-400" /> Permanent Driving License Renewal</a></li>
            <li><a href="#vehicle" className="hover:text-amber-300 transition flex items-center gap-1"><ExternalLink className="w-3 h-3 text-amber-400" /> New Vehicle RC Registration</a></li>
            <li><a href="#vehicle" className="hover:text-amber-300 transition flex items-center gap-1"><ExternalLink className="w-3 h-3 text-amber-400" /> Vehicle Ownership Transfer (Form 29/30)</a></li>
            <li><a href="#payments" className="hover:text-amber-300 transition flex items-center gap-1"><ExternalLink className="w-3 h-3 text-amber-400" /> Pay Road Tax & Online Fees</a></li>
          </ul>
        </div>

        {/* Col 3: Emergency & Helpline */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 border-b border-slate-800 pb-1">Toll Free Helplines</h3>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white text-xs">National RTO Support</div>
                <div className="text-amber-300 font-mono">1800-110-022 / 0120-2459171</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div>
                <div className="font-bold text-white text-xs">Working Hours</div>
                <div className="text-slate-400 text-[11px]">Mon - Sat: 9:30 AM - 6:00 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <div className="text-slate-300">helpdesk-morth@gov.in</div>
            </div>
          </div>
        </div>

        {/* Col 4: Central Office Address */}
        <div>
          <h3 className="text-white font-bold text-sm mb-3 border-b border-slate-800 pb-1">Head Office</h3>
          <div className="flex items-start gap-2 text-slate-400 leading-relaxed">
            <MapPin className="w-4 h-4 text-red-400 mt-1 shrink-0" />
            <span>
              Transport Bhawan, 1 Parliament Street, New Delhi - 110001, India.
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Designed in accordance with Web Content Accessibility Guidelines (WCAG 2.1 AA compliant).
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950 py-3 text-center text-slate-500 text-[11px] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© 2026 Ministry of Road Transport and Highways (MoRTH), Government of India. All Rights Reserved.</span>
          <div className="flex space-x-4 text-slate-400">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:underline">Terms & Conditions</a>
            <span>•</span>
            <a href="#hyperlink" className="hover:underline">Hyperlinking Policy</a>
            <span>•</span>
            <a href="#disclaimer" className="hover:underline">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
