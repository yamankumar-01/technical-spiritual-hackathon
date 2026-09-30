import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Sparkles, ArrowRight, Lock, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { psService } from '../services/api';

export const ProblemStatementModal = ({
  ps,
  onClose,
  onSelect,
  isSelected = false,
  inRegistration = false,
  userTeam = null,
  onRegister = null,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [detailedPS, setDetailedPS] = useState(ps);

  useEffect(() => {
    setDetailedPS(ps);
    if (ps?._id && (!ps.background || !ps.challenge || !ps.keyRequirements?.length)) {
      psService
        .getById(ps._id)
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            setDetailedPS((prev) => ({ ...prev, ...res.data.data }));
          }
        })
        .catch((err) => console.warn('Could not fetch full PS details:', err));
    }
  }, [ps]);

  if (!ps) return null;

  const data = detailedPS || ps;
  const totalSeats = data.capacity || data.totalSeats || 5;
  const available = data.available !== undefined ? data.available : data.seatsAvailable ?? 5;
  const isAvailable = available > 0;
  const isBooked = available <= 0 || data.registrationState === 'BOOKED';
  const isClosed = data.registrationState === 'CLOSED';
  const isNotStarted = data.registrationState === 'NOT_STARTED';

  const isTempUnavailable = Boolean(data.isTempUnavailable);
  const userHold = Boolean(data.userHold);

  const handleAction = () => {
    onClose();
    if (userTeam) {
      navigate('/dashboard');
      return;
    }
    if (inRegistration && onSelect) {
      onSelect(ps);
      return;
    }
    if (onRegister) {
      onRegister(ps);
      return;
    }
    if (!user) {
      navigate(`/login?redirect=/register-team?psId=${ps._id}`);
    } else {
      navigate(`/register-team?psId=${ps._id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_25px_60px_rgba(15,23,42,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-sky-50/40 dark:bg-slate-950/60">
          <div className="space-y-2 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800/60 shadow-xs">
                {data.code}
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700/60">
                {data.category}
              </span>

              {/* Seats badge */}
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isClosed
                    ? 'text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-500/10'
                    : isNotStarted
                    ? 'text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10'
                    : isBooked
                    ? 'text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-500/10'
                    : 'text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10'
                }`}
              >
                {isClosed
                  ? 'Registration Closed'
                  : isNotStarted
                  ? 'Registration Not Started'
                  : isBooked
                  ? 'All Slots Booked (0 Slots)'
                  : `${available}/${totalSeats} Slots Available`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display leading-tight">
              {data.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {/* Status Alert if Temp Unavailable */}
          {isTempUnavailable && !userHold && !userTeam && !isClosed && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Temporarily Unavailable</span>
              </div>
              <p>
                All available slots are currently occupied. Another participant may currently be filling the last available slot. Please try again after a few minutes.
              </p>
            </div>
          )}

          {/* Background Context */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 font-mono">
              1. Background & Context
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
              {data.background || (
                <span className="text-slate-400 italic">No background information specified for this track.</span>
              )}
            </div>
          </div>

          {/* Challenge Statement */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 font-mono">
              2. Core Challenge Statement
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
              {data.challenge || (
                <span className="text-slate-400 italic">No core challenge specified for this track.</span>
              )}
            </div>
          </div>

          {/* Key Requirements */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 font-mono">
              3. Key Technical & Functional Requirements
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2.5 min-h-[44px]">
              {data.keyRequirements && data.keyRequirements.length > 0 ? (
                data.keyRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic py-1">
                  Open architecture track — no restricted technical stack. Participants have full creative freedom to design their solution.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {userTeam ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Team registered for this track.
              </span>
            ) : isBooked ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                All slots booked (0 of {totalSeats} open).
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                {available} of {totalSeats} slots open • Fee: ₹1200 per team (4 members)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Intelligent Action Button */}
            {userTeam ? (
              <button
                onClick={handleAction}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all cursor-pointer"
              >
                <span>View Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : isClosed ? (
              <button
                disabled
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              >
                Registration Closed
              </button>
            ) : isNotStarted ? (
              <button
                disabled
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 cursor-not-allowed"
              >
                Registration Not Started
              </button>
            ) : isBooked ? (
              <button
                disabled
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-600 cursor-not-allowed"
              >
                All Slots Booked
              </button>
            ) : (
              <button
                onClick={handleAction}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-[0_6px_20px_rgba(14,165,233,0.3)] transition-all cursor-pointer"
              >
                <span>{inRegistration ? 'Choose This PS' : 'Register Team'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatementModal;
