import React, { useState } from 'react';
import {
  PillNavbar,
  HeroCard,
  FloatingOverlapBar,
  IconCard,
  MediaCard,
  DuotoneIcon,
} from '../components/soft-medical-glass';
import {
  Heart,
  Activity,
  Shield,
  Stethoscope,
  Sparkles,
  Search,
  Calendar,
  ChevronDown,
  ArrowRight,
  Clock,
  Award,
  Layers,
  Code,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';

export const SoftMedicalGlassDemo = () => {
  // State for interactive demo
  const [selectedDept, setSelectedDept] = useState('cardiology');
  const [activeTab, setActiveTab] = useState('components');
  const [copiedCode, setCopiedCode] = useState('');

  const copySnippet = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Nav links prop example
  const navLinks = [
    { label: 'Overview', href: '#hero', active: true },
    { label: 'Components', href: '#components' },
    { label: 'Departments', href: '#grid' },
    { label: 'Services', href: '#media' },
    { label: 'TSH Platform', href: '/' },
  ];

  // Logo prop example
  const logoElement = (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2EB88A] to-[#1E9470] flex items-center justify-center text-white shadow-sm font-bold text-sm">
        +
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[12px] font-black uppercase text-[#12141A] tracking-[0.14em]">SOFT GLASS</span>
        <span className="text-[10px] font-bold uppercase text-[#536159] tracking-[0.20em] -mt-0.5">DESIGN SYSTEM</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DDF5EB] via-[#EBF8F2] to-[#FFFFFF] text-[#12141A] font-['Poppins',sans-serif] selection:bg-[#bae6fd] selection:text-[#0369a1] dark:selection:bg-[#38bdf8]/40 dark:selection:text-white pb-28">
      {/* 1. PillNavbar Component Demo */}
      <PillNavbar
        logo={logoElement}
        links={navLinks}
        cta={{
          label: 'View Docs',
          onClick: () => {
            const el = document.getElementById('code-guide');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
        }}
      />

      {/* 2. HeroCard Component Demo */}
      <HeroCard
        tag="Reusable UI Architecture"
        title={
          <span>
            Soft Medical Glass <br />
            <span className="text-[#1E9470]">Design System</span>
          </span>
        }
        subtitle="A calm, trustworthy, and modern component library featuring pale mint gradient washes, heavy rounded containers, diffused shadows, and glassmorphic floating bars."
        actions={
          <>
            <button
              onClick={() => {
                const el = document.getElementById('components');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_18px_rgba(46,184,138,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Components</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/"
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#536159] bg-white/80 hover:bg-white hover:text-[#12141A] shadow-sm transition-all"
            >
              Back to TSH Conclave
            </a>
          </>
        }
        media={
          <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] rounded-[24px] sm:rounded-[30px] overflow-hidden bg-white shadow-inner flex items-center justify-center p-6">
            <img
              src="/doctor_consultation.jpg"
              alt="Medical consultation preview"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Subtle mint/green color grade overlay */}
            <div className="absolute inset-0 bg-[#2EB88A]/12 mix-blend-color pointer-events-none rounded-2xl" />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md flex items-center gap-2 text-xs font-semibold text-[#12141A]">
              <span className="w-2 h-2 rounded-full bg-[#2EB88A] animate-ping" />
              <span>Previewing: HeroCard + Color Grade</span>
            </div>
          </div>
        }
      />

      {/* 3. FloatingOverlapBar Component Demo (The Signature Layout Trick) */}
      <FloatingOverlapBar>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#536159]">
              Filter Department
            </label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-[#F4FAF6] hover:bg-[#EBF8F2] text-[#12141A] text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-8 appearance-none border border-slate-200/60 focus:border-[#2EB88A] outline-none font-medium cursor-pointer"
              >
                <option value="cardiology">Cardiology</option>
                <option value="emergency">Emergency Care</option>
                <option value="pediatric">Pediatric</option>
                <option value="diagnostics">Diagnostics</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#536159] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#536159]">
              Physician / Specialist
            </label>
            <div className="relative">
              <select className="w-full bg-[#F4FAF6] hover:bg-[#EBF8F2] text-[#12141A] text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-8 appearance-none border border-slate-200/60 focus:border-[#2EB88A] outline-none font-medium cursor-pointer">
                <option>All Available Doctors</option>
                <option>Dr. D. Shen, MD</option>
                <option>Dr. David Sterling, MD</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#536159] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#536159]">
              Consultation Date
            </label>
            <input
              type="date"
              className="w-full bg-[#F4FAF6] hover:bg-[#EBF8F2] text-[#12141A] text-xs sm:text-sm rounded-xl px-3.5 py-2 border border-slate-200/60 focus:border-[#2EB88A] outline-none font-medium cursor-pointer"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => alert(`Applied filters: Department = ${selectedDept}`)}
              className="w-full py-3 px-5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_18px_rgba(46,184,138,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply Filters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FloatingOverlapBar>

      {/* 4. IconCard Responsive Grid Demo */}
      <section id="components" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#12141A]">
            IconCard Grid Pattern
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6470]">
            Centered duotone icon-in-blob at top, bold title centered below. Retains 3 columns on small screens without breaking.
          </p>
        </div>

        {/* 3-column responsive grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          <IconCard
            icon={Activity}
            title="Emergency Care"
            description="24/7 immediate clinical response and mobile trauma ambulances."
            badge="Always Open"
            active={selectedDept === 'emergency'}
            onClick={() => setSelectedDept('emergency')}
          />
          <IconCard
            icon={Heart}
            title="Cardiology"
            description="Specialized cardiovascular evaluations, ECG telemetry, and valve care."
            badge="Top Rated"
            active={selectedDept === 'cardiology'}
            onClick={() => setSelectedDept('cardiology')}
          />
          <IconCard
            icon={Shield}
            title="Pediatric Care"
            description="Gentle, reassuring healthcare for infants, toddlers, and young teens."
            badge="Child Friendly"
            active={selectedDept === 'pediatric'}
            onClick={() => setSelectedDept('pediatric')}
          />
        </div>
      </section>

      {/* 5. MediaCard Row / Carousel Demo */}
      <section id="media" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#12141A]">
            MediaCard Stacked Row Pattern
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6470]">
            Rounded photo on top with subtle cyan color-grade filter, bold title below, short gray description below that.
          </p>
        </div>

        {/* Horizontal scrollable row */}
        <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x">
          <MediaCard
            image="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
            badge="Digital MRI / CT"
            title="Advanced Diagnostics"
            description="Equipped with modern high-field MRI scanners and 128-slice CT tomography."
            footer={
              <button className="text-xs font-bold text-[#2EB88A] hover:text-[#1E9470] inline-flex items-center gap-1 transition-colors">
                <span>Explore Machine Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
            className="min-w-[270px] sm:min-w-[320px] snap-start"
          />

          <MediaCard
            image="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
            badge="Sterile OR Suites"
            title="Specialized Surgeries"
            description="Pioneering laparoscopic and minimally invasive procedures with zero-infection protocols."
            footer={
              <button className="text-xs font-bold text-[#2EB88A] hover:text-[#1E9470] inline-flex items-center gap-1 transition-colors">
                <span>View Surgical Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
            className="min-w-[270px] sm:min-w-[320px] snap-start"
          />

          <MediaCard
            image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
            badge="Maternal Health"
            title="Maternity & Neonatal"
            description="Comprehensive postnatal comfort suites and 24/7 dedicated neonatal pediatric care."
            footer={
              <button className="text-xs font-bold text-[#2EB88A] hover:text-[#1E9470] inline-flex items-center gap-1 transition-colors">
                <span>Tour Maternity Ward</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
            className="min-w-[270px] sm:min-w-[320px] snap-start"
          />
        </div>
      </section>

      {/* 6. Code Usage Guide / Integration Reference */}
      <section id="code-guide" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-[0_15px_35px_rgba(18,20,26,0.06)] border border-white/85 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF5EB] text-[#2EB88A] flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#12141A]">Quick Integration Guide</h3>
              <p className="text-xs text-[#5B6470]">Import and use these components in any React project.</p>
            </div>
          </div>

          {/* Code Tabs */}
          <div className="bg-[#12141A] rounded-2xl p-5 text-slate-100 font-mono text-xs overflow-x-auto relative">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-slate-400">
              <span>ExampleUsage.jsx</span>
              <button
                onClick={() =>
                  copySnippet(
                    `import { PillNavbar, HeroCard, FloatingOverlapBar, IconCard, MediaCard } from './components/soft-medical-glass';\n\n// Use anywhere in your application!`,
                    'import'
                  )
                }
                className="flex items-center gap-1 text-[11px] text-[#2EB88A] hover:text-[#1E9470] transition-colors"
              >
                {copiedCode === 'import' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'import' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="pt-3 text-slate-300 leading-relaxed">
{`import {
  PillNavbar,
  HeroCard,
  FloatingOverlapBar,
  IconCard,
  MediaCard
} from './components/soft-medical-glass';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DDF5EB] via-[#EBF8F2] to-[#FFFFFF]">
      {/* 1. Floating Pill Navbar */}
      <PillNavbar logo={<span>BRAND</span>} links={navLinks} cta={{ label: "Get Started" }} />

      {/* 2. Card-Style Hero */}
      <HeroCard
        tag="Notice"
        title="Your Heading Here"
        subtitle="Your supporting subtitle here"
        media={<img src="/my-photo.jpg" />}
      />

      {/* 3. Floating Overlap Bar */}
      <FloatingOverlapBar>
        {/* Your search inputs, dropdowns, or CTA buttons */}
      </FloatingOverlapBar>

      {/* 4. Responsive Icon Cards */}
      <div className="grid grid-cols-3 gap-6">
        <IconCard icon={Activity} title="Service 1" description="Description..." />
        <IconCard icon={Heart} title="Service 2" description="Description..." />
        <IconCard icon={Shield} title="Service 3" description="Description..." />
      </div>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SoftMedicalGlassDemo;
