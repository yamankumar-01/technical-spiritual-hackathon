import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  switch (status) {
    case 'finalized':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF8F2] dark:bg-[#2EB88A]/15 text-[#1E9470] dark:text-[#2EB88A] border border-[#2EB88A]/30 shadow-xs whitespace-nowrap ${className}`}
        >
          <Sparkles className="w-3 h-3 text-[#1E9470] dark:text-[#2EB88A] shrink-0" />
          Finalized
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DDF5EB] dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700/50 shadow-xs whitespace-nowrap ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
          Confirmed ✅
        </span>
      );
    case 'ps_not_declared':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 whitespace-nowrap ${className}`}
        >
          <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
          PS Pending
        </span>
      );
    case 'payment_pending':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 shadow-xs whitespace-nowrap ${className}`}
        >
          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
          Payment Pending
        </span>
      );
    case 'registered':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
          SRC Awaited
        </span>
      );
  }
};

export default StatusBadge;
