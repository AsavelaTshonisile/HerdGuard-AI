import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-xs text-charcoal-muted mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center space-x-2 font-bold text-forest-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-forest-600" />
            <span>HerdGuard AI South Africa</span>
          </div>
          <p className="mt-2 text-charcoal-muted leading-relaxed">
            Intelligent livestock health monitoring, disease-risk awareness, and biosecurity platform.
            Empowering communal, smallholder, and commercial farmers across all 9 provinces.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-charcoal text-xs uppercase tracking-wider">
            South African Veterinary Helplines
          </h4>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-forest-700" />
              <span>DALRRD Animal Health: +27 (012) 319 7456</span>
            </li>
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-forest-700" />
              <span>ARC Onderstepoort Diagnostics: +27 (012) 529 9111</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-charcoal text-xs uppercase tracking-wider">
            Regulatory Position
          </h4>
          <p className="mt-2 leading-relaxed">
            HerdGuard AI does not replace statutory disease reporting under the Animal Diseases Act (Act 35 of 1984).
            AI assessments are preliminary and require veterinary confirmation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px]">
        <p>© {new Date().getFullYear()} HerdGuard AI. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="https://www.dalrrd.gov.za" target="_blank" rel="noreferrer" className="hover:text-forest-800 flex items-center space-x-1">
            <span>DALRRD Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://sava.co.za" target="_blank" rel="noreferrer" className="hover:text-forest-800 flex items-center space-x-1">
            <span>SA Veterinary Association</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
