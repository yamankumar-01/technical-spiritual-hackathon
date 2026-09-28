import React, { useState } from 'react';
import { contactService } from '../services/api';
import {
  Mail,
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider shadow-2xs font-display">
          <span>Connect With Us</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display">
          Secretariat & Inquiries
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-sans">
          Have queries about problem statements, team eligibility, or offline accommodation?
          Our student coordinators and faculty convenors are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Institute Account Details, Docs, Location */}
        <div className="lg:col-span-6 space-y-8">
          {/* Institute Details Block */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Organizing Institute & Host Campus
                </h3>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold font-display">
                  JECRC Foundation (Jaipur Engineering College and Research Centre)
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 font-sans">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800/60">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className="block text-slate-900 dark:text-slate-200 font-display">Campus Location & Venue:</strong>
                  <span>
                    JECRC Foundation Campus, Shri Ram ki Nangal, via Sitapura RIICO, Opposite EPIP Gate, Tonk Road, Jaipur, Rajasthan – 302022, India
                  </span>
                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=JECRC+Foundation+Jaipur"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 border border-sky-200/80 dark:border-sky-800/60 transition-all shadow-2xs font-display"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800/60">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-200 font-display">Official SRC Desk:</strong>
                  <a href="mailto:src@jecrc.ac.in" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">src@jecrc.ac.in</a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800/60">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-200 font-display">Desk Timings:</strong>
                  Monday – Saturday: 09:00 AM – 06:00 PM IST (24x7 active during event days)
                </div>
              </div>

              {/* JECRC Official Web Portal */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-900 dark:text-white font-display">JECRC Foundation Official Portal</span>
                </div>
                <a
                  href="https://jecrcfoundation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline font-display"
                >
                  <span>jecrcfoundation.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Downloadable Documents Block */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Official Event Documentation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Download guidelines, participation terms, and judging rubrics for your team preparations.
            </p>

            <div className="space-y-3">
              {downloadableDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800/60 hover:border-sky-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 font-display">{doc.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
                    {doc.driveUrl && (
                      <a
                        href={doc.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/60 transition-all shadow-2xs cursor-pointer font-display"
                        title="Open Sample PPT in Google Drive / Slides"
                      >
                        <span>Open Drive Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <a
                      href={doc.fileUrl}
                      download={doc.filename}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-105 shadow-2xs transition-all cursor-pointer font-display"
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
          <div className="p-8 sm:p-10 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_15px_45px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.4)] space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Send a Message to Admin</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                Have a specific question? Submit below and our coordination team will reply via email.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs flex items-center gap-2.5 font-sans">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aditi@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Team registration query or seat question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Message / Inquiry *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your query or message in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-105 text-white shadow-[0_8px_20px_rgba(14,165,233,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
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
