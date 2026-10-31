import React from 'react';
import { ShieldCheck, Target, HeartHandshake, Award, AlertCircle } from 'lucide-react';
import DisclaimerBanner from '../../components/DisclaimerBanner';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
          About HerdGuard AI
        </h1>
        <p className="mt-3 text-base text-charcoal-muted leading-relaxed">
          Intelligent livestock health monitoring, disease-risk awareness, and biosecurity platform
          designed specifically for South African farmers and agricultural ecosystems.
        </p>
      </div>

      <DisclaimerBanner className="mb-10" />

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-charcoal">Our Core Mission</h2>
          <p className="text-sm text-charcoal-muted mt-2 leading-relaxed">
            To provide accessible, reliable digital livestock health tools for South African smallholder,
            communal, and commercial farmers. By facilitating early symptom observation, transparent preliminary risk
            assessment, and prompt veterinary collaboration, we safeguard livestock assets and rural livelihoods.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-charcoal">Inclusive Agricultural Focus</h2>
          <p className="text-sm text-charcoal-muted mt-2 leading-relaxed">
            South Africa’s livestock sector holds immense potential, yet communal and smallholder farmers frequently
            face delayed reporting channels and limited visibility into individual herd health histories. HerdGuard AI
            delivers intuitive digital tools designed with accessibility and practical field utility in mind.
          </p>
        </div>
      </div>

      {/* Regulatory Alignment and Guardrails */}
      <div className="p-8 rounded-2xl bg-forest-50 border border-forest-100 mb-12">
        <h2 className="text-lg font-bold text-forest-950 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-forest-700" />
          <span>Statutory Alignment & Ethical Guardrails</span>
        </h2>
        <div className="mt-4 space-y-3 text-sm text-forest-900 leading-relaxed">
          <p>
            <strong>Complementary Role:</strong> HerdGuard AI is engineered strictly to complement official South African
            veterinary structures, including provincial Department of Agriculture veterinary services, municipal animal health
            technicians, and national traceability systems.
          </p>
          <p>
            <strong>No Prescription or Final Diagnosis:</strong> The platform explicitly does not prescribe veterinary
            medicines or dosages, nor does it present AI assessments as confirmed clinical diagnoses. Suspected notifiable
            conditions immediately trigger recommendations to contact the State Veterinarian.
          </p>
          <p>
            <strong>Grounded Knowledge:</strong> All advisory responses and biosecurity guidelines are retrieved from
            authoritative South African veterinary bodies including DALRRD, the Agricultural Research Council (ARC), and the
            South African Veterinary Council (SAVC).
          </p>
        </div>
      </div>
    </div>
  );
}
