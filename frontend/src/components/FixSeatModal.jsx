import React, { useState, useEffect } from 'react';
import {
  Wrench,
  X,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { adminService } from '../services/api';

export const FixSeatModal = ({ ps, onClose, onSuccess }) => {
  if (!ps) return null;

  const currentTotal = ps.totalSeats || ps.capacity || 5;
  const currentAvailable = ps.available !== undefined ? ps.available : ps.seatsAvailable ?? 5;
  const initialOccupied =
    ps.occupied !== undefined
      ? ps.occupied
      : Math.max(0, currentTotal - currentAvailable);

  const psId = ps._id || ps.id || ps.problemId || ps.code;

  const [totalSeats, setTotalSeats] = useState(currentTotal);
  const [alreadyRegistered, setAlreadyRegistered] = useState(initialOccupied);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch actual live registered teams for this PS on modal mount
  useEffect(() => {
    let isMounted = true;
    const loadPSTeams = async () => {
      try {
        setLoadingTeams(true);
        const res = await adminService.getPSTeams(psId);
        if (isMounted && res.data?.success) {
          const allTeams = res.data.data || [];
          // Count active registered teams (status != 'rejected')
          const activeTeams = allTeams.filter((t) => t.status !== 'rejected');
          setRegisteredTeams(activeTeams);
          setAlreadyRegistered(activeTeams.length);
          // If current capacity is below active teams, adjust to at least active teams
          setTotalSeats((prev) => Math.max(prev, activeTeams.length));
        }
      } catch (err) {
        console.warn('Could not fetch registered teams for PS:', err);
      } finally {
        if (isMounted) setLoadingTeams(false);
      }
    };

    if (psId) {
      loadPSTeams();
    }
    return () => {
      isMounted = false;
    };
  }, [psId]);

  const capacityNum = parseInt(totalSeats, 10) || 0;
  const isBelowRegistered = capacityNum < alreadyRegistered;
  const remainingSlots = Math.max(0, capacityNum - alreadyRegistered);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (isBelowRegistered) {
      setError(
        `Cannot reduce capacity to ${capacityNum}. There are already ${alreadyRegistered} team(s) registered for this problem statement. Minimum allowed capacity is ${alreadyRegistered}.`
      );
      return;
    }

    try {
      setSaving(true);
      const res = await adminService.updatePSSeats(psId, {
        totalSeats: capacityNum,
        seatsAvailable: remainingSlots,
      });

      if (res.data?.success) {
        if (onSuccess) onSuccess(res.data.data || res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update capacity.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md font-sans animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-300 dark:border-sky-800/60">
                  {ps.code}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Admin Capacity Manager
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display line-clamp-1 mt-0.5">
                {ps.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Slot Calculation Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/40 dark:from-slate-800/60 dark:to-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Slot Calculation Matrix</span>
            {loadingTeams && (
              <span className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 normal-case font-medium">
                <RefreshCw className="w-3 h-3 animate-spin" /> Verifying registered teams...
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* 1. Already Registered */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <span className="text-[10.5px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-tight">
                Already Registered
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                {alreadyRegistered}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Occupied Seats</span>
            </div>

            {/* 2. Total Capacity */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <span className="text-[10.5px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-tight">
                Total Capacity
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-slate-900 dark:text-white mt-0.5 block">
                {capacityNum}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Target Max</span>
            </div>

            {/* 3. Remaining Available Slots */}
            <div
              className={`p-3 rounded-xl border shadow-2xs ${
                remainingSlots <= 0
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
              }`}
            >
              <span className="text-[10.5px] uppercase font-bold text-slate-500 dark:text-slate-400 block leading-tight">
                Remaining Slots
              </span>
              <span
                className={`text-xl sm:text-2xl font-mono font-black mt-0.5 block ${
                  remainingSlots <= 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {remainingSlots}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  remainingSlots <= 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {remainingSlots <= 0 ? 'Full (0 Left)' : 'Open For Reg'}
              </span>
            </div>
          </div>

          {/* Formula Explanation */}
          <div className="text-[11.5px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between font-mono">
            <span>
              Remaining = Capacity ({capacityNum}) - Registered ({alreadyRegistered})
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              = {remainingSlots} Slots Left
            </span>
          </div>
        </div>

        {/* Validation Error Message */}
        {isBelowRegistered && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-start gap-2.5 animate-in shake duration-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Capacity Reduction Not Allowed</p>
              <p className="mt-0.5 leading-relaxed">
                You cannot reduce capacity below already registered teams (
                <strong>{alreadyRegistered}</strong>). Minimum allowed capacity for this Problem Statement is <strong>{alreadyRegistered}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Server Error Message */}
        {error && !isBelowRegistered && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Set Total Capacity (Max Teams) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={alreadyRegistered}
                max="100"
                value={totalSeats}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTotalSeats(isNaN(val) ? '' : val);
                }}
                className={`w-28 px-3.5 py-2.5 rounded-xl border font-mono font-bold text-center text-lg focus:outline-none transition-all ${
                  isBelowRegistered
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
                required
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Minimum capacity allowed: <strong>{alreadyRegistered}</strong>
              </span>
            </div>

            {/* Quick Adjustment Presets */}
            <div className="pt-2">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                Quick Capacity Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {/* Full / Zero remaining */}
                <button
                  type="button"
                  onClick={() => setTotalSeats(alreadyRegistered)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                    capacityNum === alreadyRegistered
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Make this PS full with zero remaining slots"
                >
                  Full ({alreadyRegistered})
                </button>

                {/* +1 Slot */}
                <button
                  type="button"
                  onClick={() => setTotalSeats(alreadyRegistered + 1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                    capacityNum === alreadyRegistered + 1
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  +1 Slot ({alreadyRegistered + 1})
                </button>

                {/* +2 Slots */}
                <button
                  type="button"
                  onClick={() => setTotalSeats(alreadyRegistered + 2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                    capacityNum === alreadyRegistered + 2
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  +2 Slots ({alreadyRegistered + 2})
                </button>

                {/* Standard 5 */}
                {alreadyRegistered <= 5 && (
                  <button
                    type="button"
                    onClick={() => setTotalSeats(5)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                      capacityNum === 5
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Standard 5
                  </button>
                )}

                {/* +5 Slots */}
                <button
                  type="button"
                  onClick={() => setTotalSeats(Math.max(alreadyRegistered, capacityNum + 5))}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  +5 More
                </button>
              </div>
            </div>
          </div>

          {/* Registered Teams Preview Toggle */}
          {registeredTeams.length > 0 && (
            <div className="pt-1 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowTeamsList((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1.5 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    View Registered Teams Occupying Seats ({registeredTeams.length})
                  </span>
                </span>
                {showTeamsList ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showTeamsList && (
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                  {registeredTeams.map((team, idx) => (
                    <div
                      key={team._id || team.id || idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {team.teamName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {team.teamCode} • Leader: {team.leader?.name || team.leaderName}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        {team.status || 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
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
              disabled={saving || isBelowRegistered || capacityNum < 1}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Capacity...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Set Capacity & Update Slots</span>
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
