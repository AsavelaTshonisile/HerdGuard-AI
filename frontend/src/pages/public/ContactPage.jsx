import React from 'react';
import { PhoneCall, Mail, MapPin, ExternalLink, HelpCircle } from 'lucide-react';
import DisclaimerBanner from '../../components/DisclaimerBanner';

export default function ContactPage() {
  const provincialOffices = [
    { province: 'Eastern Cape (Stutterheim / East London)', phone: '+27 (043) 683 1240', email: 'vet.ec@dalrrd.gov.za' },
    { province: 'Free State (Bloemfontein)', phone: '+27 (051) 861 8300', email: 'vet.fs@dalrrd.gov.za' },
    { province: 'Gauteng (Pretoria / Onderstepoort)', phone: '+27 (012) 319 7456', email: 'vet.gp@dalrrd.gov.za' },
    { province: 'KwaZulu-Natal (Pietermaritzburg / Allerton)', phone: '+27 (033) 347 6200', email: 'vet.kzn@dalrrd.gov.za' },
    { province: 'Limpopo (Polokwane)', phone: '+27 (015) 294 3000', email: 'vet.lim@dalrrd.gov.za' },
    { province: 'Mpumalanga (Mbombela)', phone: '+27 (013) 766 6067', email: 'vet.mp@dalrrd.gov.za' },
    { province: 'North West (Potchefstroom / Mahikeng)', phone: '+27 (018) 389 5111', email: 'vet.nw@dalrrd.gov.za' },
    { province: 'Northern Cape (Kimberley)', phone: '+27 (053) 838 9100', email: 'vet.nc@dalrrd.gov.za' },
    { province: 'Western Cape (Elsenburg / Stellenbosch)', phone: '+27 (021) 808 5111', email: 'vet.wc@dalrrd.gov.za' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
          Contact & Provincial Veterinary Directory
        </h1>
        <p className="mt-3 text-base text-charcoal-muted leading-relaxed">
          Need assistance with HerdGuard AI or reporting an animal health emergency?
          Connect with agricultural extension officers and state veterinary services.
        </p>
      </div>

      <DisclaimerBanner className="mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-charcoal">HerdGuard AI Support</h2>
          
          <div className="space-y-4 text-xs text-charcoal">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-forest-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Technical Support</span>
                <span className="text-charcoal-muted">support@herdguard.co.za</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <PhoneCall className="w-5 h-5 text-forest-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Toll-Free Agricultural Line</span>
                <span className="text-charcoal-muted">0800 00 4373 (0800 00 HERD)</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-forest-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Headquarters</span>
                <span className="text-charcoal-muted">Bloemfontein / Pretoria, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Official Provincial State Veterinary Offices
          </h2>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {provincialOffices.map((off) => (
              <div key={off.province} className="py-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-bold text-charcoal">{off.province}</span>
                  <div className="text-charcoal-muted">{off.email}</div>
                </div>
                <div className="mt-1 sm:mt-0 font-semibold text-forest-800">
                  {off.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
