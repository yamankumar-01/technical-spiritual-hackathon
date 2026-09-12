import React, { useState } from 'react';
import { contactService } from '../services/api';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await contactService.submitQuery(formData);
      if (res.data?.success) {
        setSuccessMsg(res.data.message || 'Your inquiry has been submitted successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const GOOGLE_DRIVE_PPT_URL =
    'https://docs.google.com/presentation/d/1dCvnuvaMfC3XMHa1NIYA9hs-lOX8L36P/edit?slide=id.p5#slide=id.p5';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(46,184,138,0.15)]">
          <span>Connect With Us</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
          Secretariat & Inquiries
        </h1>
        <p className="text-sm text-[#536159] dark:text-slate-300">
          Have queries about problem statements, team eligibility, or offline accommodation?
          Our student coordinators and faculty convenors are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Institute Account Details, Docs, Location */}
        <div className="lg:col-span-6 space-y-8">
          {/* Institute Details Block */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#12141A] dark:text-white font-['Outfit']">
                  Organizing Institute & Host Campus
                </h3>
                <p className="text-xs text-[#1E9470] dark:text-[#2EB88A] font-semibold">
                  JECRC Foundation (Jaipur Engineering College and Research Centre)
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#536159] dark:text-slate-300">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
                <div className="p-2 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className="block text-[#12141A] dark:text-slate-200">Campus Location & Venue:</strong>
                  <span>
                    JECRC Foundation Campus, Shri Ram ki Nangal, via Sitapura RIICO, Opposite EPIP Gate, Tonk Road, Jaipur, Rajasthan – 302022, India
                  </span>
                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=JECRC+Foundation+Jaipur"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/20 hover:bg-[#cbf1e1] border border-[#2EB88A]/30 transition-all shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
                <div className="p-2 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#12141A] dark:text-slate-200">Official Email Desks:</strong>
                  info@jecrcmail.com • secretariat@tsh.edu • support@tsh.edu
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
                <div className="p-2 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#12141A] dark:text-slate-200">Campus Board & Helplines:</strong>
                  0141-2770232 / 0141-2770120 (JECRC Board) • +91 98765 43210 (TSH Desk)
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
                <div className="p-2 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#12141A] dark:text-slate-200">Desk Timings:</strong>
                  Monday – Saturday: 09:00 AM – 06:00 PM IST (24x7 active during event days)
                </div>
              </div>

              {/* JECRC Official Web Portal */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2EB88A]" />
                  <span className="font-semibold text-[#12141A] dark:text-white">JECRC Foundation Official Portal</span>
                </div>
                <a
                  href="https://jecrcfoundation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] hover:underline"
                >
                  <span>jecrcfoundation.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Downloadable Documents Block */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-4">
            <h3 className="text-base font-bold text-[#12141A] dark:text-white font-['Outfit'] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2EB88A]" />
              <span>Official Event Documentation</span>
            </h3>
            <p className="text-xs text-[#536159] dark:text-slate-400">
              Download guidelines, participation terms, and judging rubrics for your team preparations.
            </p>

            <div className="space-y-3">
              {downloadableDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#EBF8F2]/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 hover:border-[#2EB88A]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#12141A] dark:text-slate-200">{doc.title}</p>
                      <p className="text-[11px] text-[#536159] dark:text-slate-400">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                    {doc.driveUrl && (
                      <a
                        href={doc.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DDF5EB] hover:bg-[#cbf1e2] dark:bg-[#2EB88A]/15 dark:hover:bg-[#2EB88A]/25 text-[#1E9470] dark:text-[#2EB88A] border border-[#2EB88A]/30 transition-all shadow-2xs cursor-pointer"
                        title="Open Sample PPT in Google Drive / Slides"
                      >
                        <span>Open Drive Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <a
                      href={doc.fileUrl}
                      download={doc.filename}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 shadow-2xs transition-all cursor-pointer"
                      title="Download PPTX File"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PPT</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Query Submission Box */}
        <div className="lg:col-span-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_15px_45px_rgba(18,20,26,0.07)] space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#12141A] dark:text-white font-['Outfit']">Send a Message to Admin</h3>
              <p className="text-xs text-[#536159] dark:text-slate-400 mt-1">
                Have a specific question? Submit below and our coordination team will reply via email.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#12141A] dark:text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#12141A] dark:text-slate-300">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aditi@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#12141A] dark:text-slate-300">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Team registration query or seat question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#12141A] dark:text-slate-300">Message / Inquiry *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your query or message in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-full text-xs font-bold bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 text-white shadow-[0_8px_20px_rgba(46,184,138,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Secretariat</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
