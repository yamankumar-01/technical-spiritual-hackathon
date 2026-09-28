import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  switch (status) {
    case 'finalized':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700/60 shadow-xs whitespace-nowrap ${className}`}
        >
          <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
          Finalized
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 shadow-xs whitespace-nowrap ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
