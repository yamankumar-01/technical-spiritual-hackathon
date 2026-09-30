import React, { useState } from 'react';
import { Wrench, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { adminService } from '../services/api';

export const FixSeatModal = ({ ps, onClose, onSuccess }) => {
  if (!ps) return null;

  const currentTotal = ps.capacity || ps.totalSeats || 5;
  const currentAvailable = ps.available !== undefined ? ps.available : ps.seatsAvailable ?? 5;

  const [totalSeats, setTotalSeats] = useState(currentTotal);
  const [seatsAvailable, setSeatsAvailable] = useState(currentAvailable);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const psId = ps._id || ps.id || ps.problemId || ps.code;
      if (!psId) {
        throw new Error('Problem Statement identifier is missing.');
      }
      const res = await adminService.updatePSSeats(psId, {
        totalSeats: Number(totalSeats),
        seatsAvailable: Number(seatsAvailable),
      });
      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.data || res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update seats.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                  {ps.code}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Admin Seat Fix
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display line-clamp-1">
                {ps.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Available Seats (Slots Left)
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="number"
                min="0"
                max={totalSeats}
                value={seatsAvailable}
                onChange={(e) => setSeatsAvailable(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-center text-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                required
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 1, 2, 3, 4, 5].filter((n) => n <= totalSeats).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSeatsAvailable(preset)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                      Number(seatsAvailable) === preset
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset === 0 ? '0 (Full)' : preset}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
              Directly override remaining seats open for holds and registration.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Total Capacity
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={totalSeats}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                setTotalSeats(val);
                if (seatsAvailable > val) setSeatsAvailable(val);
              }}
              className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-center text-sm focus:outline-none focus:border-sky-500"
              required
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
              Standard capacity for this hackathon is 5 teams per problem statement.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fixing Seat...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Fix Seat</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FixSeatModal;
