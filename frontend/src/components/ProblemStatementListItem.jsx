import React from 'react';
import { ChevronRight, Lock, Check, Clock, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';

export const ProblemStatementListItem = ({
  ps,
  index,
  onViewDetails,
  onSelect,
  isSelected = false,
  showSelectButton = false,
  userHold = null,
  userTeam = null,
  onRegister = null,
  onRetry = null,
}) => {
  const totalSeats = ps.capacity || ps.totalSeats || 5;
  const available = ps.available !== undefined ? ps.available : ps.seatsAvailable ?? 5;
  const isAvailable = available > 0;
  const isTempUnavailable = available <= 0 || ps.registrationState === 'TEMPORARILY_UNAVAILABLE';
  const isClosed = ps.registrationState === 'CLOSED';
  const isNotStarted = ps.registrationState === 'NOT_STARTED';

  let seatBadgeClass = 'text-[#1E9470] dark:text-[#2EB88A] border-[#2EB88A]/30 bg-[#DDF5EB] dark:bg-[#2EB88A]/10';
  if (isClosed) {
    seatBadgeClass = 'text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-500/10';
  } else if (isTempUnavailable) {
    seatBadgeClass = 'text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10';
  } else if (available <= 2) {
    seatBadgeClass = 'text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10';
  }

  const displayNumber = index !== undefined ? `#${String(index + 1).padStart(2, '0')}` : ps.code;

  const handleClick = (e) => {
    if (e.target.closest('.action-btn-prevent')) return;
    if (onViewDetails) {
      onViewDetails(ps);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`group relative w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-200 text-left select-none outline-none ${
        isClosed
          ? 'bg-slate-100/70 dark:bg-[#0a0f1a]/80 border border-slate-200 dark:border-slate-800/60 opacity-60'
          : isSelected
          ? 'bg-white dark:bg-[#071510] border-2 border-[#2EB88A] ring-2 ring-[#2EB88A]/20 shadow-[0_12px_32px_rgba(46,184,138,0.18)]'
          : 'bg-white/95 dark:bg-[#071510]/95 hover:bg-white dark:hover:bg-[#0a1e17] border border-white/85 dark:border-white/10 hover:border-[#2EB88A]/40 shadow-[0_8px_25px_rgba(18,20,26,0.05)] hover:shadow-[0_12px_30px_rgba(18,20,26,0.09)]'
      }`}
    >
      {/* Left Column: Number, Code, Title & Category */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] font-mono text-xs font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          {displayNumber}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 px-2.5 py-0.5 rounded-full border border-[#2EB88A]/20">
              {ps.code}
            </span>

            <span className="text-xs font-medium text-[#536159] dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/60 truncate max-w-[280px]">
              {ps.category || 'Techno-Spiritual Track'}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#12141A] dark:text-slate-100 group-hover:text-[#1E9470] dark:group-hover:text-[#2EB88A] transition-colors leading-snug">
            {ps.title}
          </h3>

          <p className="text-xs text-[#536159] dark:text-slate-400 line-clamp-2 leading-relaxed">
            {ps.challenge || ps.background || ps.description}
          </p>
        </div>
      </div>

      {/* Right Column: Slot Capacity + Intelligent Button */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${seatBadgeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>
            {isClosed
              ? 'Registration Closed'
              : isNotStarted
              ? 'Not Started'
              : isTempUnavailable
              ? `Unavailable (0/${totalSeats})`
              : `${available}/${totalSeats} Slots Left`}
          </span>
        </div>

        {/* Action Button */}
        {showSelectButton && onSelect ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(ps);
            }}
            disabled={isTempUnavailable || isClosed}
            className={`action-btn-prevent px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-md'
                : isTempUnavailable || isClosed
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : isTempUnavailable ? (
              <span>Unavailable</span>
            ) : (
              <span>Select PS</span>
            )}
          </button>
        ) : onRegister ? (
          <div className="action-btn-prevent">
            {userTeam ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(ps);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/20 hover:bg-[#DDF5EB]/80 border border-[#2EB88A]/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>View Registration</span>
              </button>
            ) : userHold ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(ps);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-sm transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Continue (15m)</span>
              </button>
            ) : isClosed ? (
              <button
                type="button"
                disabled
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              >
                Closed
              </button>
            ) : isTempUnavailable ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRetry) onRetry(ps);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 border border-amber-300 dark:border-amber-700/60 transition-all flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Again</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(ps);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-slate-400 group-hover:text-[#2EB88A] group-hover:translate-x-1 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatementListItem;
