import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/api';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  MessageCircle,
  RefreshCw,
  FileText,
  AlertCircle,
  MapPin,
} from 'lucide-react';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchUserData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      setError('');
      const res = await teamService.getMyRegistrations();
      if (res.data?.success) {
        setTeams(res.data.teams || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your registrations.');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Participant Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            My Registrations & Slots
          </h1>
          <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400 mt-1">
            Track your reserved registration windows, offline SRC payment status, and confirmed slots.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUserData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#12141A] dark:text-white hover:border-[#2EB88A] transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#1E9470]' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-3 border-[#2EB88A] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#536159] dark:text-slate-400">Loading registrations...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Team Registrations */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#12141A] dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-[#2EB88A]" />
              <span>Team Registrations ({teams.length})</span>
            </h2>

            {teams.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-3xl bg-white/90 dark:bg-[#071510]/90 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 text-[#1E9470] dark:text-[#2EB88A] flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#12141A] dark:text-white">
                    No Active Registrations Found
                  </h3>
                  <p className="text-xs text-[#536159] dark:text-slate-400 max-w-sm mx-auto">
                    Explore all 50 official Problem Statements and reserve your team's slot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/ps')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:scale-105 transition-all shadow-[0_4px_15px_rgba(46,184,138,0.3)]"
                >
                  <span>Browse Problem Statements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => {
                  const isConfirmed = team.status === 'confirmed' || team.status === 'finalized';
                  const isPending = team.status === 'payment_pending' || team.status === 'registered';
                  const isRejected = team.status === 'rejected';

                  return (
                    <div
                      key={team._id}
                      className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                        isConfirmed
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40'
                          : isPending
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/40'
                          : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/40'
                      }`}
                    >
                      {/* Top Row: Track & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/20 px-2.5 py-0.5 rounded-full">
                              {team.problemStatement?.code}
                            </span>
                            <span className="text-xs text-[#536159] dark:text-slate-400">
                              {team.problemStatement?.category}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#12141A] dark:text-white leading-snug break-words">
                            {team.problemStatement?.title}
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isConfirmed && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-300 dark:border-emerald-700 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>CONFIRMED</span>
                            </div>
                          )}
                          {isPending && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>PAYMENT PENDING</span>
                            </div>
                          )}
                          {isRejected && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold border border-rose-300 dark:border-rose-700 whitespace-nowrap">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>REJECTED</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Team Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/70 dark:bg-[#071510]/70 border border-slate-200/80 dark:border-white/10 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-slate-400 block font-medium">Team Name</span>
                          <span className="font-bold text-[#12141A] dark:text-white block break-words">
                            {team.teamName}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-[#1E9470] dark:text-[#2EB88A] block">
                            {team.teamCode}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-slate-400 block font-medium">Team Leader</span>
                          <span className="font-bold text-[#12141A] dark:text-white block break-words">
                            {team.leader?.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 break-all block">
                            {team.leader?.email}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-slate-400 block font-medium">Registration Number</span>
                          {team.registrationNumber ? (
                            <span className="font-mono font-black text-emerald-700 dark:text-emerald-300">
                              {team.registrationNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Issued upon SRC approval</span>
                          )}
                        </div>
                      </div>

                      {/* Your Venue Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/85 dark:bg-[#071510]/85 border border-slate-200/80 dark:border-white/10 space-y-3 shadow-2xs backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A]">
                              <MapPin className="w-4 h-4" />
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#12141A] dark:text-white font-['Outfit']">
                              Your Venue
                            </h4>
                          </div>

                          {team.venue && (team.venue.roomNumber || team.venue.timeSlot) ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              Allocated
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                              Awaiting Allocation
                            </span>
                          )}
                        </div>

                        {team.venue && (team.venue.roomNumber || team.venue.timeSlot) ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#DDF5EB]/60 to-emerald-50/20 dark:from-[#2EB88A]/10 dark:to-transparent border border-[#2EB88A]/30 space-y-1">
                              <span className="text-[10.5px] uppercase font-bold text-[#1E9470] dark:text-[#2EB88A] tracking-wider block">
                                Room Number
                              </span>
                              <p className="text-sm sm:text-base font-extrabold text-[#12141A] dark:text-white flex items-center gap-1.5">
                                <Building className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A] shrink-0" />
                                <span>{team.venue.roomNumber || 'TBA'}</span>
                              </p>
                              <span className="text-[11px] text-[#536159] dark:text-slate-400 block">
                                Report to this hall/room for presentation
                              </span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#DDF5EB]/60 to-emerald-50/20 dark:from-[#2EB88A]/10 dark:to-transparent border border-[#2EB88A]/30 space-y-1">
                              <span className="text-[10.5px] uppercase font-bold text-[#1E9470] dark:text-[#2EB88A] tracking-wider block">
                                Time Slot
                              </span>
                              <p className="text-sm sm:text-base font-extrabold text-[#12141A] dark:text-white flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A] shrink-0" />
                                <span>{team.venue.timeSlot || 'TBA'}</span>
                              </p>
                              <span className="text-[11px] text-[#536159] dark:text-slate-400 block">
                                Please be seated 10 mins before your slot
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                            <div className="w-8 h-8 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 text-[#1E9470] dark:text-[#2EB88A] flex items-center justify-center mx-auto">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-[#12141A] dark:text-white">
                              Venue will be announced soon
                            </h5>
                            <p className="text-xs text-[#536159] dark:text-slate-400 max-w-md mx-auto">
                              The organizing committee is finalizing room allocations and evaluation time slots for confirmed teams. Check back shortly!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* State Specific Callout */}
                      {isPending && (
                        <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-amber-900/30 border border-amber-300/60 dark:border-amber-700/50 space-y-2 text-xs text-amber-900 dark:text-amber-200">
                          <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-100">
                            <Building className="w-4 h-4 text-amber-600" />
                            <span>Payment Mode: Offline at SRC Club</span>
                          </div>
                          <p>
                            Your registration slot has been reserved. Registration fees (₹400 per team) will be collected in person at the Student Resource Center (SRC) registration desk.
                          </p>
                          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Payment timings and desk updates will be shared in the official WhatsApp group.</span>
                          </div>
                        </div>
                      )}

                      {isConfirmed && (
                        <div className="p-4 rounded-2xl bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-300/60 dark:border-emerald-700/50 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                          <div className="flex items-center gap-2 font-bold text-emerald-950 dark:text-emerald-100">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Official Seat Confirmed!</span>
                          </div>
                          <p>
                            Your registration fee has been verified at the SRC desk. Your official registration number is{' '}
                            <span className="font-mono font-bold">{team.registrationNumber}</span>. Please preserve this number for entry on the hackathon day.
                          </p>
                        </div>
                      )}

                      {isRejected && (
                        <div className="p-4 rounded-2xl bg-rose-100/60 dark:bg-rose-900/30 border border-rose-300/60 dark:border-rose-700/50 space-y-1 text-xs text-rose-900 dark:text-rose-200">
                          <div className="font-bold text-rose-950 dark:text-rose-100">
                            Registration Rejected & Slot Released
                          </div>
                          <p>
                            {team.adminNotes ||
                              'Your registration was rejected because payment was not submitted at the SRC desk within the required deadline. The problem statement slot has been released.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
