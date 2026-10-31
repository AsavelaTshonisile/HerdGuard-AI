import React from 'react';
import { 
  KeyRound, 
  LayoutDashboard, 
  MapPin, 
  Layers, 
  Activity, 
  Cpu, 
  Map, 
  Syringe, 
  Bell, 
  Bot 
} from 'lucide-react';
import DisclaimerBanner from '../../components/DisclaimerBanner';

export default function FeaturesPage() {
  const features = [
    {
      num: '01',
      title: 'Authentication & Role-Based Security',
      icon: KeyRound,
      desc: 'Secure JWT tokens and bcrypt password hashing with strict role segregation for Farmers, Veterinary Professionals, and System Administrators.'
    },
    {
      num: '02',
      title: 'Real-Time Farmer Dashboard',
      icon: LayoutDashboard,
      desc: 'Live statistical counters for total livestock, healthy vs sick animals, pending reports, and interactive Recharts visualizations of breed distribution and timeline trends.'
    },
    {
      num: '03',
      title: 'Farm Management & Coordinates',
      icon: MapPin,
      desc: 'Register multiple farm parcels across all 9 South African provinces and local municipalities with numerical GPS coordinates and farm types.'
    },
    {
      num: '04',
      title: 'Individual Livestock Profiles',
      icon: Layers,
      desc: 'Comprehensive cattle profiles with unique ear tag numbers, breed, sex, approximate age, weight, and chronological medical history.'
    },
    {
      num: '05',
      title: 'Livestock Health Symptom Reporting',
      icon: Activity,
      desc: 'Structured checklist of common cattle symptoms (fever, mouth lesions, excessive drooling, lameness, diarrhoea) with automated reference numbering.'
    },
    {
      num: '06',
      title: 'AI-Assisted Preliminary Risk Engine',
      icon: Cpu,
      desc: 'Clinical pattern recognition categorizes reports into Low, Moderate, High, and Urgent Attention Required, triggering immediate veterinary referral disclaimers.'
    },
    {
      num: '07',
      title: 'Geographical Disease Intelligence',
      icon: Map,
      desc: 'Interactive Leaflet OpenStreetMap displaying suspected, professionally reviewed, and official disease incidents with province-level filtering.'
    },
    {
      num: '08',
      title: 'Vaccination & Cold-Chain Management',
      icon: Syringe,
      desc: 'Track compulsory South African inoculations (Anthrax, Brucellosis S19, Blackquarter, LSD) with automated calculation of overdue and upcoming due dates.'
    },
    {
      num: '09',
      title: 'In-App Notifications & Biosecurity Alerts',
      icon: Bell,
      desc: 'Instant database-persisted notifications for report reviews, nearby disease warnings in the same province, and overdue vaccination alerts.'
    },
    {
      num: '10',
      title: 'HerdGuard AI Assistant (RAG)',
      icon: Bot,
      desc: 'Conversational assistant retrieving verified agricultural knowledge from the Department of Agriculture (DALRRD) and ARC Onderstepoort with citations.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
          Platform Features & Capabilities
        </h1>
        <p className="mt-3 text-base text-charcoal-muted leading-relaxed">
          An integrated, production-minded suite of tools designed to advance South African livestock health and food security.
        </p>
      </div>

      <DisclaimerBanner className="mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.num} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex space-x-4">
              <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0 font-bold">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-forest-600 uppercase tracking-wider mb-1">
                  Module {feat.num}
                </div>
                <h3 className="text-base font-bold text-charcoal">{feat.title}</h3>
                <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
