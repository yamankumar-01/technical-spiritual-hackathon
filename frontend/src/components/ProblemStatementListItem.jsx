import React from 'react';
import { ChevronRight, Lock, Check, Clock, AlertTriangle, RefreshCw, ArrowRight, Wrench } from 'lucide-react';

export const ProblemStatementListItem = ({
  ps,
  index,
  onViewDetails,
  onSelect,
  isSelected = false,
  showSelectButton = false,
  userTeam = null,
  onRegister = null,
  onFixSeat = null,
}) => {
  const totalSeats = ps.capacity || ps.totalSeats || 5;
  const available = ps.available !== undefined ? ps.available : ps.seatsAvailable ?? 5;
  const isAvailable = available > 0;
  const isBooked = available <= 0 || ps.registrationState === 'BOOKED';
  const isClosed = ps.registrationState === 'CLOSED';
  const isNotStarted = ps.registrationState === 'NOT_STARTED';

  let seatBadgeClass = 'text-sky-700 dark:text-sky-400 border-sky-400/30 bg-sky-50 dark:bg-sky-500/10';
  if (isClosed || isBooked) {
    seatBadgeClass = 'text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-500/10';
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
      className={`group relative w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-200 text-left select-none outline-none font-sans ${
        isClosed
          ? 'bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 opacity-60'
          : isSelected
          ? 'bg-white/95 dark:bg-slate-900/95 border-2 border-sky-500 ring-2 ring-sky-500/20 shadow-[0_12px_32px_rgba(14,165,233,0.18)]'
          : 'bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(14,165,233,0.08)]'
      }`}
    >
      {/* Left Column: Number, Code, Title & Category */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 font-mono text-xs font-bold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
          {displayNumber}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200/80 dark:border-sky-800/60">
              {ps.code}
            </span>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/60 truncate max-w-[280px]">
              {ps.category || 'Techno-Spiritual Track'}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug font-display">
            {ps.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {ps.challenge || ps.background || ps.description}
          </p>
        </div>
      </div>

      {/* Right Column: Slot Capacity + Intelligent Button */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 font-display ${seatBadgeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>
            {isClosed
              ? 'Registration Closed'
              : isNotStarted
              ? 'Not Started'
              : isBooked
              ? `All Slots Booked (0/${totalSeats})`
              : `${available}/${totalSeats} Slots Left`}
          </span>
        </div>

        {/* Admin Fix Seat Button */}
        {onFixSeat && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFixSeat(ps);
            }}
            className="action-btn-prevent px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-300/80 dark:border-amber-700/80 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer font-display"
            title={`Fix seats for ${ps.code} (${ps.title})`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Fix Seat</span>
          </button>
        )}

        {/* Action Button */}
        {showSelectButton && onSelect ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(ps);
            }}
            disabled={isBooked || isClosed}
            className={`action-btn-prevent px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-display ${
              isSelected
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                : isBooked || isClosed
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : isBooked ? (
              <span>Booked</span>
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
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 border border-sky-300/60 dark:border-sky-800/60 transition-all flex items-center gap-1.5 font-display"
              >
                <Check className="w-3.5 h-3.5" />
                <span>View Registration</span>
              </button>
            ) : isClosed ? (
              <button
                type="button"
                disabled
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed font-display"
              >
                Closed
              </button>
            ) : isBooked ? (
              <button
                type="button"
                disabled
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-600 cursor-not-allowed font-display"
              >
                Booked
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegister(ps);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-105 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-display"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatementListItem;
