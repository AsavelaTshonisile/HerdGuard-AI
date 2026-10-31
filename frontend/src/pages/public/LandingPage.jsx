import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Layers, 
  Activity, 
  Map, 
  Syringe, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Compass,
  FileCheck2
} from 'lucide-react';
import DisclaimerBanner from '../../components/DisclaimerBanner';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section with Cattle Pasture Background */}
      <section className="relative overflow-hidden text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('/cattle-hero.jpg')` }}
        />
        {/* Semi-transparent Dark Forest / Charcoal Overlay for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/90 via-forest-900/80 to-forest-950/95 backdrop-blur-[1px]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-500/40 text-forest-200 text-xs font-semibold mb-6 shadow-md backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-forest-400 animate-pulse"></span>
            <span>Empowering South African Livestock Farmers & Veterinary Networks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
            Protecting South Africa’s Cattle with <span className="text-forest-300">Intelligent Health Intelligence</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-forest-100/95 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            HerdGuard AI helps smallholder, communal, and commercial farmers maintain digital animal health records,
            detect unusual symptoms early through AI-assisted risk awareness, track vaccinations, and coordinate with local veterinary professionals.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-forest-500 hover:bg-forest-400 text-forest-950 font-bold text-sm transition shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Register Your Farm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-sm transition shadow-lg flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <span>Sign In to Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Official Positioning Disclaimer */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 w-full">
        <DisclaimerBanner />
      </section>

      {/* Target User Roles Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700">Built for South Africa</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
            Bridging Farmers, Extension Officers & Veterinary Services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal">Livestock Farmers</h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              Designed with simple, readable interfaces for communal, smallholder, and commercial farmers. Tag individual animals, log health alerts, track mandatory vaccinations, and get actionable AI biosecurity guidance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold mb-4">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal">Veterinary Professionals & Technicians</h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              Receive early symptom alerts in your district, review clinical patterns, add official recommendations, monitor communal holding camps, and initiate early diagnostic investigations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal">System Administrators</h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              Real-time platform oversight, provincial user management, biosecurity incident verification, and curated agricultural knowledge deployment aligned with DALRRD directives.
            </p>
          </div>
        </div>
      </section>

      {/* Core Modules Feature Grid */}
      <section className="py-16 bg-white border-y border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700">Integrated Capabilities</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
              Complete Digital Livestock Health Architecture
            </p>
            <p className="text-sm text-charcoal-muted mt-2">
              Every feature is functional and connected directly to our real-time database and intelligence engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-base">Individual Animal Profiles</h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Register cattle with official ear tags, breed (Bonsmara, Nguni, Brahman), sex, age, and complete historical health and vaccination timelines.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-base">AI Preliminary Risk Assessment</h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Transparent syndromic pattern recognition identifies potential notifiable diseases (e.g. Foot and Mouth, LSD) and flags urgent veterinarian referral.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-base">Geographical Disease Intelligence</h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Interactive Leaflet OpenStreetMap mapping of suspected and verified disease incidents across all South African provinces and municipal districts.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-base">Vaccination & Cold-Chain Tracking</h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Record Anthrax, Brucellosis S19, Blackquarter, and Lumpy Skin Disease inoculations with automatic upcoming and overdue reminders.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-base">HerdGuard AI Assistant (RAG)</h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Conversational agricultural assistant grounded in verified knowledge from the South African Department of Agriculture (DALRRD) and ARC Onderstepoort.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-base">Strict Role Security</h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Secure JWT authentication, bcrypt password hashing, and role-based permissions preventing unauthorized data access between farms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-forest-50 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
            Start Monitoring Your Herd with HerdGuard AI
          </h2>
          <p className="mt-3 text-sm text-forest-800 leading-relaxed">
            Free registration for South African farmers. Help build a more resilient, biosecure agricultural community.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm transition shadow-sm"
            >
              Register Farmer Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-white hover:bg-cream border border-forest-200 text-forest-900 font-semibold text-sm transition"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
