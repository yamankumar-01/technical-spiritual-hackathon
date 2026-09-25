import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  UserCheck,
  FileCode,
  ClipboardList,
  CreditCard,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const HomePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [downloadNotification, setDownloadNotification] = useState('');

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleDownloadDoc = (doc) => {
    setDownloadNotification(`Downloading ${doc.title}...`);
    setTimeout(() => setDownloadNotification(''), 4000);

    const link = document.createElement('a');
    link.href = doc.fileUrl || '/tsh-2026-pitch-presentation-template.pptx';
    link.download = doc.filename || 'tsh-2026-pitch-presentation-template.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4-Step Registration Process Roadmap
  const registrationSteps = [
    {
      step: '01',
      title: 'Login / Create Account',
      tag: 'Authentication',
      desc: 'Sign in with your student credentials to initialize team management and unlock live track booking.',
      icon: UserCheck,
      actionText: 'Sign In / Register',
      actionLink: '/login',
    },
    {
      step: '02',
      title: 'Select Problem Statement',
      tag: 'Track Selection',
      desc: 'Browse all 50 approved statements and lock your track. Strictly capped at 5 teams per track across JECRC Foundation.',
      icon: FileCode,
      actionText: 'Explore 50 Tracks',
      actionLink: '/ps',
    },
    {
      step: '03',
      title: 'Fill 4-Member Details',
      tag: 'Roster Submission',
      desc: 'Submit full details for 1 Team Leader + 3 Members including College Name, Roll No, Branch, and contact info.',
      icon: ClipboardList,
      actionText: 'Team Roster Guidelines',
      actionLink: '/register-team',
    },
    {
      step: '04',
      title: 'Offline Payment & Approval',
      tag: 'Seat Confirmation',
      desc: 'Submit registration and complete offline payment verification at the Student Activity Centre (SRC) desk to confirm your seat.',
      icon: CreditCard,
      actionText: 'Lock Your Seat',
      actionLink: '/register-team',
    },
  ];

  // 5 Concise FAQs (Question 6 accommodation deleted as requested)
  const faqs = [
    {
      q: 'What is the team size requirement for TSH 2026?',
      a: 'The team size is strictly fixed at 4 members (1 Team Leader + 3 Members). All 4 members must be designated during registration.',
    },
    {
      q: 'Where can I explore the 50 Problem Statements?',
      a: 'All 50 official challenge statements are available in the Problem Statements directory. Each track has a strict cap of 5 teams to preserve mentorship depth and high jury scrutiny.',
      link: {
        to: '/ps',
        label: 'Browse all 50 Problem Statements',
      },
    },
    {
      q: 'How does the Problem Statement seat cap work?',
      a: 'Each problem statement has a strict cap of 5 teams maximum. Seats are held and decremented atomically once payment/confirmation is verified. If all 5 seats are claimed, the card is marked Full and locked from further registrations.',
    },
    {
      q: 'What is the payment and seat confirmation process?',
      a: 'Offline payment will be done at the SRC desk. After submitting your team registration online, visit the Student Resource Center (SRC) desk to complete the payment verification and receive official confirmation for your problem statement seat.',
    },
    {
      q: 'Who is eligible to participate?',
      a: 'Participation is exclusively open to students of JECRC Foundation. All undergraduate students from JECRC Foundation campuses are eligible to form a team and register.',
    },
  ];

  const GOOGLE_DRIVE_PPT_URL =
    'https://docs.google.com/presentation/d/1dCvnuvaMfC3XMHa1NIYA9hs-lOX8L36P/edit?slide=id.p5#slide=id.p5';

  // Official Documentation list (Hackathon PPT Template)
  const downloadableDocs = [
    {
      title: 'Hackathon Presentation Template',
      type: 'Official PPTX Template & Sample Pitch Deck',
      size: '1.1 MB',
      filename: 'tsh-2026-pitch-presentation-template.pptx',
      fileUrl: '/tsh-2026-pitch-presentation-template.pptx',
      driveUrl: GOOGLE_DRIVE_PPT_URL,
      highlight: true,
    },
  ];

  return (
    <div className="w-full space-y-16">
      {/* Dynamic Hero Section */}
      <HeroSection />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-16">
        {/* Registration Process Section (Replaced Five Pillars) */}
        <section id="registration-process" className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] px-3.5 py-1 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15">
              Registration Journey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
              How to Register for TSH 2026
            </h2>
            <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400">
              Follow these four structured steps in order to lock your problem statement and confirm your team seat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {registrationSteps.map((stepItem, idx) => {
              const IconComponent = stepItem.icon;
              return (
                <div
                  key={idx}
                  className="relative group bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(18,20,26,0.06)] border border-white/85 dark:border-white/10 hover:border-[#2EB88A]/40 hover:shadow-[0_15px_35px_rgba(46,184,138,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    {/* Header: Step Number Pill + Duotone Icon */}
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] font-mono text-sm font-bold flex items-center justify-center shadow-xs">
                        {stepItem.step}
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-[#EBF8F2] dark:bg-slate-800 text-[#2EB88A] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] font-mono">
                        {stepItem.tag}
                      </span>
                      <h3 className="text-lg font-bold text-[#12141A] dark:text-slate-100 leading-snug">
                        {stepItem.title}
                      </h3>
                      <p className="text-sm text-[#46544c] dark:text-slate-300 leading-relaxed pt-1">
                        {stepItem.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/5">
                    <Link
                      to={stepItem.actionLink}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E9470] dark:text-[#2EB88A] group-hover:text-[#12141A] dark:group-hover:text-white transition-colors"
                    >
                      <span>{stepItem.actionText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct CTA */}
          <div className="text-center pt-2">
            <Link
              to="/register-team"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_20px_rgba(46,184,138,0.35)] hover:shadow-[0_8px_25px_rgba(46,184,138,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Begin Team Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Official Event Documentation & Download Section (Matches Uploaded Screenshot) */}
        <section id="event-documentation" className="space-y-6 pt-6 border-t border-[#D2F0E3] dark:border-white/10">
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#12141A] dark:text-white font-['Outfit'] flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#2EB88A]" />
                  <span>Official Event Documentation</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400 mt-1">
                  Download guidelines, participation terms, and judging rubrics for your team preparations.
                </p>
              </div>

              {/* Link to Contact Us */}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#DDF5EB] hover:bg-[#DDF5EB]/80 dark:bg-[#2EB88A]/20 dark:hover:bg-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] transition-all self-start md:self-auto shadow-2xs"
              >
                <span>Format Queries? Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {downloadNotification && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{downloadNotification}</span>
              </div>
            )}

            <div className="space-y-3">
              {downloadableDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl transition-all ${
                    doc.highlight
                      ? 'bg-gradient-to-r from-[#DDF5EB]/50 via-white to-white dark:from-[#2EB88A]/10 dark:via-[#071510] dark:to-[#071510] border-2 border-[#2EB88A]/40 shadow-sm'
                      : 'bg-[#EBF8F2]/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 hover:border-[#2EB88A]/40 hover:bg-white dark:hover:bg-[#081b14]'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="p-3 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm sm:text-base font-bold text-[#12141A] dark:text-slate-100">
                          {doc.title}
                        </p>
                        {doc.highlight && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A] shrink-0 border border-[#2EB88A]/30">
                            Required PPT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#536159] dark:text-slate-400">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                    {doc.driveUrl && (
                      <a
                        href={doc.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#DDF5EB] hover:bg-[#cbf1e2] dark:bg-[#2EB88A]/15 dark:hover:bg-[#2EB88A]/25 text-[#1E9470] dark:text-[#2EB88A] border border-[#2EB88A]/30 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
                        title="Open Sample PPT in Google Slides / Drive"
                      >
                        <span>Open Drive Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <a
                      href={doc.fileUrl || '/tsh-2026-pitch-presentation-template.pptx'}
                      download={doc.filename || 'tsh-2026-pitch-presentation-template.pptx'}
                      onClick={() => {
                        setDownloadNotification(`Downloading ${doc.title}...`);
                        setTimeout(() => setDownloadNotification(''), 4000);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 shadow-[0_4px_14px_rgba(46,184,138,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                      title={`Download ${doc.title} (.pptx)`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PPT</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive FAQ Accordion Section (5 Questions) */}
        <section className="space-y-8 pt-6 border-t border-[#D2F0E3] dark:border-white/10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] px-3.5 py-1 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400">
              Click any question in the list to reveal its complete answers and guidance.
            </p>
          </div>

          <div className="w-full space-y-3 sm:space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-[#071510]/95 border-[#2EB88A]/50 shadow-md ring-2 ring-[#2EB88A]/20'
                      : 'bg-white/95 dark:bg-[#071510]/70 border-white/85 dark:border-white/10 hover:border-[#2EB88A]/30 hover:bg-white dark:hover:bg-[#071510] shadow-[0_8px_20px_rgba(18,20,26,0.04)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer select-none outline-none"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                          isOpen
                            ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-sm'
                            : 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A]'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h4
                        className={`text-sm sm:text-[15px] font-semibold transition-colors ${
                          isOpen
                            ? 'text-[#1E9470] dark:text-[#2EB88A]'
                            : 'text-[#12141A] dark:text-slate-100'
                        }`}
                      >
                        {faq.q}
                      </h4>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#EBF8F2] dark:bg-slate-800 text-[#536159] dark:text-slate-400 transition-all duration-300 ${
                        isOpen ? 'rotate-180 bg-[#DDF5EB] text-[#1E9470]' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 pt-1 text-xs sm:text-sm text-[#536159] dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pl-16 sm:pl-19 animate-fade-in">
                      <p>{faq.a}</p>
                      {faq.link && (
                        <Link
                          to={faq.link.to}
                          className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white transition-all shadow-sm hover:scale-[1.02]"
                        >
                          <span>{faq.link.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
