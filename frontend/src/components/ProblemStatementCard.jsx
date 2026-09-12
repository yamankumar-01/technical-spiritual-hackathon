import React from 'react';
import { Lock, Check, ChevronRight } from 'lucide-react';

export const ProblemStatementCard = ({ ps, onViewDetails, onSelect, isSelected = false, showSelectButton = false }) => {
  const isFull = ps.seatsAvailable <= 0;
  const seatsLeft = ps.seatsAvailable ?? 5;
  const totalSeats = ps.totalSeats || 5;
  const percentage = (seatsLeft / totalSeats) * 100;

  // Clean 2-3 Color System: Deep Slate Base + Amber Brand + Emerald Status
  let seatColor = 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
  let progressColor = 'bg-emerald-500';
  if (seatsLeft === 0) {
    seatColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    progressColor = 'bg-rose-500';
  } else if (seatsLeft <= 2) {
    seatColor = 'text-amber-300 border-amber-500/30 bg-amber-500/10';
    progressColor = 'bg-amber-500';
  }

  const handleCardClick = (e) => {
    if (e.target.closest('.select-btn-prevent')) return;
    if (onViewDetails) {
      onViewDetails(ps);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-3xl p-6 cursor-pointer transition-all duration-200 text-left outline-none ${
        isFull
          ? 'bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 opacity-60'
          : isSelected
          ? 'bg-white dark:bg-[#071510] border-2 border-[#2EB88A] shadow-[0_12px_36px_rgba(46,184,138,0.25)] ring-4 ring-[#2EB88A]/20'
          : 'bg-white/95 dark:bg-[#071510]/95 hover:bg-white dark:hover:bg-[#0a1e17] border border-white/80 dark:border-white/10 hover:border-[#2EB88A]/40 shadow-[0_10px_30px_rgba(18,20,26,0.06)] hover:shadow-[0_14px_38px_rgba(46,184,138,0.12)] hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Top Track & Seat Tag */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="font-mono text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/20 px-3 py-1 rounded-full border border-[#2EB88A]/30">
            {ps.code}
          </span>

          {/* Seats Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${seatColor}`}>
            {isFull ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>FULL (0/{totalSeats})</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {seatsLeft}/{totalSeats} seats left
                </span>
              </>
            )}
          </div>
        </div>

        {/* Problem Statement Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#12141A] dark:text-white font-['Outfit'] leading-snug mb-2.5 min-h-[50px] group-hover:text-[#1E9470] dark:group-hover:text-[#2EB88A] transition-colors">
          {ps.title}
        </h3>

        {/* Category Pill */}
        <div className="mb-4">
          <span className="text-xs font-medium text-[#536159] dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700/60">
            {ps.category || 'Techno-Spiritual Track'}
          </span>
        </div>

        {/* Mini Seat Progress Bar */}
        <div className="space-y-1 mb-2">
          <div className="flex justify-between text-[11px] font-medium text-[#536159] dark:text-slate-400">
            <span>Seat Allocation</span>
            <span>{isFull ? '100% Booked' : `${totalSeats - seatsLeft} / ${totalSeats} Booked`}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer info: Click anywhere hint or Select button */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-[#536159] dark:text-slate-400">
        <span className="flex items-center gap-1 group-hover:text-[#1E9470] dark:group-hover:text-[#2EB88A] transition-colors">
          <span>Click box to view full details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>

        {showSelectButton && (
          <button
            disabled={isFull}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(ps);
            }}
            className={`select-btn-prevent flex items-center justify-center gap-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
              isFull
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : isSelected
                ? 'bg-emerald-500 text-white font-extrabold shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                : 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 text-white font-bold shadow-[0_4px_12px_rgba(46,184,138,0.3)]'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : isFull ? (
              <span>Full</span>
            ) : (
              <span>Select PS</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProblemStatementCard;
