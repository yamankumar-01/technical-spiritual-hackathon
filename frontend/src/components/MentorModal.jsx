import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Phone,
  MessageCircle,
  Mail,
  User,
  X,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { adminService } from '../services/api';

/**
 * MentorModal - Add, update, or remove mentors assigned to registered teams.
 * Supports quick sync between calling & WhatsApp numbers and quick-select from existing mentors.
 */
const MentorModal = ({ team, existingMentors = [], onClose, onSuccess }) => {
  const [mentorName, setMentorName] = useState('');
  const [mentorPhone, setMentorPhone] = useState('');
  const [mentorWhatsapp, setMentorWhatsapp] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [sameAsCalling, setSameAsCalling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (team) {
      const m = team.mentor || {};
      const currentName = m.name || team.mentor_name || '';
      const currentPhone = m.phone || team.mentor_phone || '';
      const currentWhatsapp = m.whatsapp || team.mentor_whatsapp || '';
      const currentEmail = m.email || team.mentor_email || '';

      setMentorName(currentName);
      setMentorPhone(currentPhone);
      setMentorWhatsapp(currentWhatsapp);
      setMentorEmail(currentEmail);
      setSameAsCalling(Boolean(currentPhone && currentPhone === currentWhatsapp));
      setErrorMsg('');
    }
  }, [team]);

  if (!team) return null;

  const handlePhoneChange = (val) => {
    setMentorPhone(val);
    if (sameAsCalling) {
      setMentorWhatsapp(val);
    }
  };

  const handleSameAsCallingToggle = (e) => {
    const checked = e.target.checked;
    setSameAsCalling(checked);
    if (checked) {
      setMentorWhatsapp(mentorPhone);
    }
  };

  const handleSelectPresetMentor = (m) => {
    setMentorName(m.name || '');
    setMentorPhone(m.phone || '');
    setMentorWhatsapp(m.whatsapp || m.phone || '');
    setMentorEmail(m.email || '');
    setSameAsCalling(Boolean(m.phone && (m.phone === m.whatsapp || !m.whatsapp)));
    setErrorMsg('');
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!mentorName.trim()) {
      setErrorMsg('Mentor Name is required.');
      return;
    }
    if (!mentorPhone.trim()) {
      setErrorMsg('Mobile / Calling Number is required.');
      return;
    }
    if (!mentorWhatsapp.trim()) {
      setErrorMsg('WhatsApp Number is required.');
      return;
    }
    if (!mentorEmail.trim() || !mentorEmail.includes('@')) {
      setErrorMsg('A valid Email Address is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');

      const res = await adminService.updateTeamMentor(team._id || team.id, {
        name: mentorName.trim(),
        phone: mentorPhone.trim(),
        whatsapp: mentorWhatsapp.trim(),
        email: mentorEmail.trim().toLowerCase(),
      });

      if (res.data?.success) {
        onSuccess(res.data.team, res.data.message || 'Mentor details updated successfully.');
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save mentor details.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMentor = async () => {
    if (!window.confirm(`Are you sure you want to unassign the mentor from team "${team.teamName}"?`)) {
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');

      const res = await adminService.updateTeamMentor(team._id || team.id, {
        name: null,
        phone: null,
        whatsapp: null,
        email: null,
      });

      if (res.data?.success) {
        onSuccess(res.data.team, 'Mentor unassigned successfully.');
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to unassign mentor.');
    } finally {
      setSaving(false);
    }
  };

  const hasAssignedMentor = Boolean(
    team.mentor?.name || team.mentor_name || team.mentor?.email || team.mentor_email
  );

  const cleanWhatsappNumber = (mentorWhatsapp || '').replace(/[^\d+]/g, '').replace(/^0+/, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                {hasAssignedMentor ? 'Edit Assigned Mentor' : 'Assign Team Mentor'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Team: <strong className="text-slate-900 dark:text-white">{team.teamName}</strong>{' '}
                <span className="text-sky-600 dark:text-sky-400">({team.teamCode})</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Team Context Snapshot Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Assigned Problem Statement:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-mono text-[10.5px]">
                {team.problemStatement?.code || 'N/A'}
              </span>
              <span className="truncate max-w-[200px]" title={team.problemStatement?.title}>
                {team.problemStatement?.title || 'Problem Track'}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>
                Venue:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {team.venue?.roomNumber || 'Not allocated yet'}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                Slot:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {team.venue?.timeSlot || 'Not fixed yet'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick presets from existing mentors pool if available */}
        {existingMentors && existingMentors.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10.5px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
              Quick Pick from Existing Mentors ({existingMentors.length}):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {existingMentors.slice(0, 6).map((m, idx) => (
                <button
                  key={`${m.email}-${idx}`}
                  type="button"
                  onClick={() => handleSelectPresetMentor(m)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    mentorEmail.toLowerCase() === (m.email || '').toLowerCase()
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400/60'
                  }`}
                  title={`${m.name} • ${m.phone} • ${m.email}`}
                >
                  <User className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Mentor Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mentor Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Rajesh Kumar / Prof. Neha Sharma"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>

          {/* Calling Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mobile / Calling Number *</span>
              </span>
              {mentorPhone && (
                <a
                  href={`tel:${mentorPhone}`}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 lowercase"
                >
                  call
                </a>
              )}
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={mentorPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium font-mono"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp Number *</span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sameAsCalling}
                  onChange={handleSameAsCallingToggle}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Same as Calling</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={mentorWhatsapp}
                onChange={(e) => {
                  setMentorWhatsapp(e.target.value);
                  if (sameAsCalling && e.target.value !== mentorPhone) {
                    setSameAsCalling(false);
                  }
                }}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium font-mono pr-20"
              />
              {cleanWhatsappNumber && (
                <a
                  href={`https://wa.me/${cleanWhatsappNumber.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>Chat</span>
                </a>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Email Address *</span>
              </span>
              {mentorEmail && (
                <a
                  href={`mailto:${mentorEmail}`}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 lowercase"
                >
                  mail
                </a>
              )}
            </label>
            <input
              type="email"
              placeholder="e.g. mentor.tsh@jecrc.ac.in"
              value={mentorEmail}
              onChange={(e) => setMentorEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>

          {/* Direct Communication Quick Links when details filled */}
          {mentorName && (mentorPhone || mentorWhatsapp || mentorEmail) && (
            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 space-y-1.5 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block text-[11px]">
                Direct Contact Actions:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {mentorPhone && (
                  <a
                    href={`tel:${mentorPhone}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] hover:bg-indigo-50 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-indigo-500" />
                    <span>Call ({mentorPhone})</span>
                  </a>
                )}
                {mentorWhatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsappNumber.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
                {mentorEmail && (
                  <a
                    href={`mailto:${mentorEmail}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] hover:bg-slate-50 transition-colors"
                  >
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 gap-2">
            <div>
              {hasAssignedMentor && (
                <button
                  type="button"
                  onClick={handleRemoveMentor}
                  disabled={saving}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  title="Unassign mentor from this team"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Unassign</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{hasAssignedMentor ? 'Update Mentor' : 'Assign Mentor'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorModal;
