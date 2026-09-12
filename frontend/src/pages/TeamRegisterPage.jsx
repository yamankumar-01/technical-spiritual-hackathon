import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { psService, teamService } from '../services/api';
import ProblemStatementListItem from '../components/ProblemStatementListItem';
import ProblemStatementModal from '../components/ProblemStatementModal';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Building,
  Search,
  RefreshCw,
  X,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const REGISTRATION_FEE = 400;

export const TeamRegisterPage = () => {
  const { user, myTeam, refreshTeamStatus, setMyTeam } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [problemStatements, setProblemStatements] = useState([]);
  const [loadingPS, setLoadingPS] = useState(true);
  const [modalPS, setModalPS] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshingSeats, setRefreshingSeats] = useState(false);

  // 15-Minute Temporary Hold State
  const [holdToken, setHoldToken] = useState('');
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(900);
  const [isHoldExpired, setIsHoldExpired] = useState(false);
  const [tempUnavailableNotice, setTempUnavailableNotice] = useState('');

  // Form State
  const [selectedPS, setSelectedPS] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    branch: 'Computer Science',
    year: '3rd Year',
  });
  const [members, setMembers] = useState([
    { name: '', phone: '', email: '', branch: '', year: '' },
    { name: '', phone: '', email: '', branch: '', year: '' },
    { name: '', phone: '', email: '', branch: '', year: '' },
  ]);

  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Active Refresh Live Capacity Handler
  const handleRefreshSeats = async () => {
    try {
      setRefreshingSeats(true);
      const startTime = Date.now();
      const res = await psService.getAllCapacity();
      if (res.data?.success) {
        setProblemStatements(res.data.data);
        if (selectedPS) {
          const updated = res.data.data.find((p) => p._id === selectedPS._id);
          if (updated) setSelectedPS(updated);
        }
      }
      const elapsed = Date.now() - startTime;
      if (elapsed < 600) {
        await new Promise((r) => setTimeout(r, 600 - elapsed));
      }
    } catch (err) {
      console.error('Failed to refresh capacity', err);
    } finally {
      setRefreshingSeats(false);
    }
  };

  // Initial Load & URL Parameter Check
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const preselectedPSId = params.get('psId');
    const paramHoldToken = params.get('holdToken');

    const initPage = async () => {
      try {
        setLoadingPS(true);
        const res = await psService.getAllCapacity();
        if (res.data?.success) {
          setProblemStatements(res.data.data);

          if (preselectedPSId) {
            const match = res.data.data.find((p) => p._id === preselectedPSId);
            if (match) {
              setSelectedPS(match);

              // Check if user already has an active hold for this PS
              if (user) {
                try {
                  const holdCheck = await psService.getActiveHold(preselectedPSId);
                  if (holdCheck.data?.success && holdCheck.data.hasActiveHold) {
                    setHoldToken(holdCheck.data.hold.holdToken);
                    setHoldExpiresAt(holdCheck.data.hold.expiresAt);
                    setRemainingSeconds(holdCheck.data.hold.duration);
                    setIsHoldExpired(false);
                    setStep(2); // Resume filling form
                  } else if (paramHoldToken) {
                    // Try to re-acquire or verify hold
                    const acquireRes = await psService.acquireHold(preselectedPSId);
                    if (acquireRes.data?.success) {
                      setHoldToken(acquireRes.data.holdToken);
                      setHoldExpiresAt(acquireRes.data.expiresAt);
                      setRemainingSeconds(acquireRes.data.duration);
                      setIsHoldExpired(false);
                      setStep(2);
                    }
                  }
                } catch (holdErr) {
                  console.error('Error verifying active hold:', holdErr);
                }
              }
            }
          }
        }
      } catch (err) {
        setErrorMsg('Failed to load problem statements.');
      } finally {
        setLoadingPS(false);
      }
    };

    initPage();
  }, [location.search, user]);

  // If user already has a confirmed or pending registration, allow review
  useEffect(() => {
    if (myTeam) {
      setRegisteredTeam(myTeam);
      if (['confirmed', 'payment_pending', 'finalized'].includes(myTeam.status)) {
        // Registration is active
      }
    }
  }, [myTeam]);

  // 15-Minute Countdown Timer (Authoritative from server expiresAt)
  useEffect(() => {
    if (step !== 2 || !holdExpiresAt || isHoldExpired) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expires = new Date(holdExpiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setIsHoldExpired(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, holdExpiresAt, isHoldExpired]);

  const formatCountdown = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Member field updater
  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  // Step 1 to Step 2: Acquire 15-minute slot hold atomically
  const handleProceedToMembers = async () => {
    if (!selectedPS) {
      setErrorMsg('Please select a Problem Statement to proceed.');
      return;
    }

    const available = selectedPS.available !== undefined ? selectedPS.available : selectedPS.seatsAvailable ?? 5;
    if (available <= 0) {
      setTempUnavailableNotice(
        'Temporarily unavailable. All available slots are currently occupied. Another participant may currently be filling the last available slot. Please try again after a few minutes.'
      );
      return;
    }

    if (!user) {
      navigate(`/login?redirect=/register-team?psId=${selectedPS._id}`);
      return;
    }

    try {
      setProcessing(true);
      setErrorMsg('');
      setTempUnavailableNotice('');

      // Atomically check capacity and acquire 15-minute hold
      const res = await psService.acquireHold(selectedPS._id);
      if (res.data?.success) {
        setHoldToken(res.data.holdToken);
        setHoldExpiresAt(res.data.expiresAt);
        setRemainingSeconds(res.data.duration || 900);
        setIsHoldExpired(false);
        setStep(2);
      } else if (res.data?.code === 'TEMPORARILY_UNAVAILABLE') {
        setTempUnavailableNotice(
          res.data.message ||
            'Temporarily unavailable. All available slots are currently occupied. Another participant may currently be filling the last available slot. Please try again after a few minutes.'
        );
      }
    } catch (err) {
      if (err.code === 'TEMPORARILY_UNAVAILABLE' || err.response?.data?.code === 'TEMPORARILY_UNAVAILABLE') {
        setTempUnavailableNotice(
          err.response?.data?.message ||
            'Temporarily unavailable. All available slots are currently occupied. Another participant may currently be filling the last available slot. Please try again after a few minutes.'
        );
      } else {
        setErrorMsg(err.message || 'Failed to acquire slot hold.');
      }
    } finally {
      setProcessing(false);
    }
  };

  // User resets and re-selects problem upon window expiration
  const handleSelectProblemAgain = () => {
    setHoldToken('');
    setHoldExpiresAt(null);
    setRemainingSeconds(900);
    setIsHoldExpired(false);
    setErrorMsg('');
    setTempUnavailableNotice('');
    setStep(1);
    navigate('/ps');
  };

  // Step 2 to Step 3: Submit team details with holdToken
  const handleSaveTeamDetails = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isHoldExpired || remainingSeconds <= 0) {
      setIsHoldExpired(true);
      return;
    }

    if (!teamName.trim()) {
      setErrorMsg('Please provide a team name.');
      return;
    }

    // Validate leader
    if (!leader.name || !leader.phone || !leader.email || !leader.branch || !leader.year) {
      setErrorMsg('Please fill in all leader details.');
      return;
    }

    // Validate 3 members
    for (let i = 0; i < 3; i++) {
      const m = members[i];
      if (!m.name || !m.phone || !m.email || !m.branch || !m.year) {
        setErrorMsg(`Please fill in all fields for Team Member ${i + 1}.`);
        return;
      }
    }

    // Client-side anti-duplicate check: All 4 emails must be unique
    const leaderEmail = leader.email.trim().toLowerCase();
    const memberEmails = members.map((m) => m.email.trim().toLowerCase());
    const allEmails = [leaderEmail, ...memberEmails];

    if (new Set(allEmails).size !== allEmails.length) {
      setErrorMsg('All team member emails must be unique. Duplicate email addresses are not allowed within the team roster.');
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        teamName: teamName.trim(),
        psId: selectedPS._id,
        holdToken, // Authoritative hold token
        leader,
        members,
      };

      const res = await teamService.registerTeam(payload);
      if (res.data?.success) {
        setRegisteredTeam(res.data.team);
        setMyTeam(res.data.team);
        setStep(3);
        fireCelebration();
        await refreshTeamStatus();
      }
    } catch (err) {
      if (err.code === 'HOLD_EXPIRED' || err.response?.data?.code === 'HOLD_EXPIRED') {
        setIsHoldExpired(true);
        setErrorMsg('Your 15-minute registration window has expired. The temporary slot reserved for you has been released.');
      } else {
        setErrorMsg(err.message || 'Failed to submit team registration.');
      }
    } finally {
      setProcessing(false);
    }
  };

  // Trigger celebration animation
  const fireCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const filteredProblemStatements = problemStatements.filter((ps) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ps.title?.toLowerCase().includes(q) ||
      ps.code?.toLowerCase().includes(q) ||
      ps.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Wizard Progress Stepper */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(46,184,138,0.15)]">
            <span>Registration Wizard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            Team Registration
          </h1>
          <p className="text-xs text-[#536159] dark:text-slate-400">
            Fixed team structure: 1 Team Leader + 3 Members (Total 4 Members) • 15-Minute Slot Hold
          </p>
        </div>

        {/* Stepper Steps */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 max-w-xl mx-auto pt-2 px-2">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all ${
              step === 1
                ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-[0_4px_12px_rgba(46,184,138,0.3)]'
                : step > 1
                ? 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A] border border-[#2EB88A]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-[#536159] dark:text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
            <span className="hidden sm:inline">Select PS</span>
            <span className="sm:hidden">PS</span>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-slate-200 dark:bg-slate-700 shrink-0" />

          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all ${
              step === 2
                ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-[0_4px_12px_rgba(46,184,138,0.3)]'
                : step > 2
                ? 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A] border border-[#2EB88A]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-[#536159] dark:text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
            <span className="hidden sm:inline">15-Min Form (4 Members)</span>
            <span className="sm:hidden">Form</span>
          </div>
          <div className="w-4 sm:w-8 h-0.5 bg-slate-200 dark:bg-slate-700 shrink-0" />

          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all ${
              step === 3
                ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-[0_4px_12px_rgba(46,184,138,0.3)]'
                : 'bg-slate-100 dark:bg-slate-800 text-[#536159] dark:text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
            <span className="hidden sm:inline">Payment Pending (SRC)</span>
            <span className="sm:hidden">Pending</span>
          </div>
        </div>
      </div>

      {/* Global Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Temporarily Unavailable Notice (Requirement 6 & 29) */}
      {tempUnavailableNotice && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 shadow-md space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                Temporarily unavailable
              </h3>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {tempUnavailableNotice}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleRefreshSeats}
              disabled={refreshingSeats}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingSeats ? 'animate-spin' : ''}`} />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: SELECT PROBLEM STATEMENT */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#0c1420]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#12141A] dark:text-white font-['Outfit']">
                Step 1: Choose Your Problem Track
              </h2>
              <p className="text-xs text-[#5B6470] dark:text-slate-400">
                A 15-minute slot hold will be automatically reserved for your team when you click Proceed.
              </p>
            </div>

            {selectedPS && (
              <button
                onClick={handleProceedToMembers}
                disabled={processing}
                className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 text-white shadow-[0_6px_20px_rgba(46,184,138,0.25)] flex items-center gap-2 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span>{processing ? 'Reserving 15-Min Slot...' : 'Proceed to Team Members'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Bar & Refresh */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem statements by title, code, or keyword..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-[#12141A] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleRefreshSeats}
              disabled={refreshingSeats}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 text-[#12141A] dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow transition-all cursor-pointer select-none shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2EB88A] ${refreshingSeats ? 'animate-spin' : ''}`} />
              <span>{refreshingSeats ? 'Refreshing...' : 'Refresh Live Slots'}</span>
            </button>
          </div>

          {/* List Layout of Problem Statements */}
          {loadingPS ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-900/50 animate-pulse border border-slate-200/80 dark:border-slate-800" />
              ))}
            </div>
          ) : filteredProblemStatements.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No problem statements matching "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A] cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredProblemStatements.map((ps, idx) => (
                <ProblemStatementListItem
                  key={ps._id}
                  ps={ps}
                  index={idx}
                  showSelectButton={true}
                  isSelected={selectedPS?._id === ps._id}
                  onSelect={(item) => setSelectedPS(item)}
                  onViewDetails={(item) => setModalPS(item)}
                />
              ))}
            </div>
          )}

          {/* Simple Floating Action Bar */}
          {selectedPS && (
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl px-5 py-3.5 rounded-2xl bg-white dark:bg-[#071510] border-2 border-[#2EB88A] shadow-[0_10px_30px_rgba(18,20,26,0.15)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#1E9470] dark:text-[#2EB88A] uppercase tracking-wide">
                    Selected Track ({selectedPS.code})
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#12141A] dark:text-white truncate max-w-xs sm:max-w-md">
                    {selectedPS.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToMembers}
                disabled={processing}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 active:scale-95 shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <span>{processing ? 'Reserving...' : 'Proceed to Step 2'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: FIXED 4-MEMBER TEAM DETAILS WITH 15-MINUTE COUNTDOWN */}
      {step === 2 && (
        <form onSubmit={handleSaveTeamDetails} className="space-y-6">
          {/* Prominent 15-Minute Countdown Banner (Requirements 8, 9, 10) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-600/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-mono text-base font-black">
                ⏱
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-100">
                  Complete registration within{' '}
                  <span className="font-mono text-base sm:text-lg text-amber-700 dark:text-amber-300 font-black px-2 py-0.5 rounded-lg bg-amber-200/60 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 ml-1">
                    {formatCountdown(remainingSeconds)}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                  This slot is temporarily reserved for you while you complete the form.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/50 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                Track: {selectedPS?.code}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#12141A] dark:text-white font-['Outfit']">
                Step 2: Team Roster (Fixed 4 Members)
              </h2>
              <p className="text-xs text-[#536159] dark:text-slate-400">
                Provide details for 1 Team Leader + 3 Members. All fields are mandatory.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-[#536159] dark:text-slate-300 hover:text-[#12141A] dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change PS</span>
            </button>
          </div>

          {/* Team Name Input */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-2">
            <label className="text-xs font-bold text-[#12141A] dark:text-slate-200 uppercase tracking-wider font-mono">
              Team Name *
            </label>
            <input
              type="text"
              required
              disabled={isHoldExpired}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. SoulSync Innovators"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2EB88A] disabled:opacity-50"
            />
          </div>

          {/* Team Leader Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2EB88A]" />
              <h3 className="text-sm font-bold text-[#12141A] dark:text-white uppercase tracking-wider font-mono">
                Team Leader Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Full Name *</label>
                <input
                  type="text"
                  required
                  disabled={isHoldExpired}
                  value={leader.name}
                  onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Email *</label>
                <input
                  type="email"
                  required
                  disabled={isHoldExpired}
                  value={leader.email}
                  onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Phone Number *</label>
                <input
                  type="tel"
                  required
                  disabled={isHoldExpired}
                  value={leader.phone}
                  onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Branch *</label>
                <input
                  type="text"
                  required
                  disabled={isHoldExpired}
                  value={leader.branch}
                  onChange={(e) => setLeader({ ...leader, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Academic Year *</label>
                <select
                  value={leader.year}
                  disabled={isHoldExpired}
                  onChange={(e) => setLeader({ ...leader, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Team Members 1, 2, 3 */}
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                <h3 className="text-sm font-bold text-[#12141A] dark:text-white uppercase tracking-wider font-mono">
                  Team Member {idx + 1}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isHoldExpired}
                    value={members[idx].name}
                    onChange={(e) => updateMember(idx, 'name', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Email *</label>
                  <input
                    type="email"
                    required
                    disabled={isHoldExpired}
                    value={members[idx].email}
                    onChange={(e) => updateMember(idx, 'email', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    disabled={isHoldExpired}
                    value={members[idx].phone}
                    onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Branch *</label>
                  <input
                    type="text"
                    required
                    disabled={isHoldExpired}
                    value={members[idx].branch}
                    onChange={(e) => updateMember(idx, 'branch', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Academic Year *</label>
                  <select
                    value={members[idx].year || '3rd Year'}
                    disabled={isHoldExpired}
                    onChange={(e) => updateMember(idx, 'year', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#12141A] dark:text-white disabled:opacity-50"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={processing || isHoldExpired}
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_20px_rgba(46,184,138,0.3)] hover:brightness-105 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{processing ? 'Submitting Registration...' : 'Submit Registration (Hold → Payment Pending)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* 15-Minute Hold Expiration Modal (Requirements 21, 22, 23, 24) */}
      {isHoldExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1420] border-2 border-rose-400 dark:border-rose-600 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⏱
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                Your 15-minute registration window has expired.
              </h3>
              <p className="text-xs text-[#536159] dark:text-slate-300 leading-relaxed">
                The temporary slot reserved for you has been released. To prevent slot holding, you must select the problem again to begin a new registration session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectProblemAgain}
              className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md transition-all cursor-pointer"
            >
              SELECT PROBLEM AGAIN
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REGISTRATION SUBMITTED & PAYMENT PENDING NOTICE (Requirements 15 & 16) */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] uppercase tracking-wider font-mono">
                  Registration Complete
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#12141A] dark:text-white font-['Outfit']">
                  Registration submitted successfully.
                </h2>
                <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400">
                  Your registration slot has been reserved. Status: <strong className="text-amber-600 dark:text-amber-400">PAYMENT PENDING</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF8F2]/60 dark:bg-slate-900/60 border border-[#2EB88A]/20 dark:border-slate-800 space-y-1 shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
                <div>
                  <StatusBadge status="payment_pending" />
                </div>
              </div>
            </div>

            {/* Offline SRC Payment Notice Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-amber-900 dark:text-amber-200 font-['Outfit']">
                    Offline Payment Collection & Seat Approval at SRC Club
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/80 font-medium">
                    Payment Mode: <strong>Offline</strong> • Payment Location: <strong>SRC Club</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-amber-200/80 dark:border-amber-800/40">
                {/* English Section */}
                <div className="space-y-3 text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Important Instructions (English)
                  </h4>
                  <ul className="space-y-2.5 list-disc list-inside leading-relaxed text-xs">
                    <li>
                      <strong>Registration Slot Reserved:</strong> Your team's slot under track{' '}
                      <strong>{registeredTeam?.problemStatement?.code || selectedPS?.code}</strong> is safely reserved.
                    </li>
                    <li>
                      <strong>Fee Amount:</strong> ₹{REGISTRATION_FEE} per team (covers all 4 members).
                    </li>
                    <li>
                      <strong>Payment Mode:</strong> Offline cash/verification at the <strong>Student Resource Center (SRC Club)</strong> desk.
                    </li>
                    <li>
                      <strong>WhatsApp Updates:</strong> Payment instructions and payment timings will be shared in the official WhatsApp group.
                    </li>
                    <li className="text-rose-700 dark:text-rose-400 font-semibold">
                      <strong>Admin Verification:</strong> Admins will manually verify payment at the desk to confirm your seat. If fees are not submitted, the registration will be rejected and the slot released.
                    </li>
                  </ul>
                </div>

                {/* Hindi Section */}
                <div className="space-y-3 text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    महत्वपूर्ण दिशा-निर्देश (हिंदी)
                  </h4>
                  <ul className="space-y-2.5 list-disc list-inside leading-relaxed text-xs">
                    <li>
                      <strong>सीट आरक्षित:</strong> आपकी टीम के लिए स्लॉट सुरक्षित रूप से <strong>Payment Pending</strong> में रखा गया है।
                    </li>
                    <li>
                      <strong>भुगतान का माध्यम:</strong> केवल <strong>SRC Club</strong> डेस्क पर ऑफलाइन लिया जाएगा।
                    </li>
                    <li>
                      <strong>व्हाट्सएप ग्रुप सूचना:</strong> भुगतान के समय और निर्देशों की घोषणा आधिकारिक व्हाट्सएप ग्रुप में की जाएगी।
                    </li>
                    <li>
                      <strong>ऑफलाइन अप्रूवल:</strong> काउंटर पर फीस जमा होने के बाद एडमिन टीम द्वारा सीट को <strong>CONFIRMED</strong> किया जाएगा।
                    </li>
                    <li className="text-rose-700 dark:text-rose-400 font-semibold">
                      <strong>निरस्तीकरण नियम:</strong> तय समय सीमा में फीस जमा न करने पर रजिस्ट्रेशन निरस्त (Reject) कर दिया जाएगा और सीट पुनः जारी कर दी जाएगी।
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation / Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#536159] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-center cursor-pointer"
              >
                Go to My Dashboard
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_20px_rgba(46,184,138,0.3)] hover:brightness-105 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PS View Modal */}
      {modalPS && (
        <ProblemStatementModal
          ps={modalPS}
          inRegistration={true}
          onClose={() => setModalPS(null)}
          onSelect={(ps) => {
            setSelectedPS(ps);
            setModalPS(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamRegisterPage;
