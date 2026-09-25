import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { psService, teamService } from '../services/api';
import ProblemStatementListItem from '../components/ProblemStatementListItem';
import ProblemStatementModal from '../components/ProblemStatementModal';
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  Filter,
  Search,
  Layers,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';

const DOMAIN_FILTERS = [
  { id: 'all', label: 'All Tracks' },
  { id: 'ar_ai', label: 'AR & AI Solutions', keywords: ['ar', 'ai', 'voice', 'vision', 'browser', 'screen', 'detox'] },
  { id: 'iot', label: 'IoT & Smart Hardware', keywords: ['iot', 'hardware', 'touch', 'platform', 'console', 'board', '3d'] },
  { id: 'mindfulness', label: 'Mindfulness & Health', keywords: ['mindfulness', 'meditation', 'nutrition', 'sattvic', 'health', 'focus', 'traffic control', 'well-being'] },
  { id: 'campus', label: 'Campus & Academics', keywords: ['campus', 'academic', 'exam', 'rtu', 'library', 'resource', 'venue', 'dialogue', 'textbook'] },
  { id: 'habits_games', label: 'Habits, Games & Ethics', keywords: ['habit', 'virtue', 'power', 'karma', 'game', 'character', 'reflection', 'goodness', 'journal'] },
  { id: 'environment', label: 'Environment & Sustainability', keywords: ['carbon', 'waste', 'tree', 'plantation', 'geotag', 'sdg', 'botanical', 'noise', 'wildlife', 'microplastic', 'water', 'e-waste', 'green', 'swachhta', 'prithvi', 'tarukosh', 'dhara', 'anusandhan', 'arogya'] },
];

export const PSPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPS, setSelectedPS] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [seatFilter, setSeatFilter] = useState('all'); // 'all', 'available', 'full'
  const [refreshing, setRefreshing] = useState(false);

  // User state maps
  const [userTeamsMap, setUserTeamsMap] = useState({});

  const fetchPS = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const startTime = Date.now();

      // Fetch live real-time capacity for all problem statements
      const res = await psService.getAllCapacity();
      if (res.data?.success) {
        setProblemStatements(res.data.data);
      }

      // Fetch user teams if logged in
      if (user) {
        try {
          const userRes = await teamService.getMyRegistrations();
          if (userRes.data?.success) {
            const tMap = {};
            (userRes.data.teams || []).forEach((t) => {
              const psId = typeof t.problemStatement === 'object' ? t.problemStatement?._id : t.problemStatement;
              if (psId) tMap[psId] = t;
            });
            setUserTeamsMap(tMap);
          }
        } catch (err) {
          console.error('Failed to load user registrations:', err);
        }
      }

      if (isManual) {
        const elapsed = Date.now() - startTime;
        if (elapsed < 600) {
          await new Promise((r) => setTimeout(r, 600 - elapsed));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch problem statements.');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPS();
    const interval = setInterval(() => fetchPS(), 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle Register click - directly routes to team registration
  const handleRegister = (ps) => {
    if (!user) {
      navigate(`/login?redirect=/register-team?psId=${ps._id}`);
      return;
    }

    // Check if user already submitted a registration
    if (userTeamsMap[ps._id]) {
      navigate('/dashboard');
      return;
    }

    const avail = ps.available !== undefined ? ps.available : ps.seatsAvailable ?? 5;
    if (avail <= 0) {
      alert('All slots are booked. Please proceed with the remaining Problem Statements.');
      return;
    }

    navigate(`/register-team?psId=${ps._id}`);
  };

  const categories = useMemo(() => {
    return ['All', ...new Set(problemStatements.map((p) => p.category).filter(Boolean))].sort();
  }, [problemStatements]);

  const filteredPS = useMemo(() => {
    return problemStatements.filter((ps) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = ps.title?.toLowerCase().includes(q);
        const inCode = ps.code?.toLowerCase().includes(q);
        const inCategory = ps.category?.toLowerCase().includes(q);
        if (!inTitle && !inCode && !inCategory) return false;
      }

      // 2. Domain Filter
      if (selectedDomain !== 'all') {
        const domainConfig = DOMAIN_FILTERS.find((d) => d.id === selectedDomain);
        if (domainConfig?.keywords) {
          const categoryText = (ps.category || '').toLowerCase();
          const titleText = (ps.title || '').toLowerCase();
          const matchesDomain = domainConfig.keywords.some(
            (kw) => categoryText.includes(kw) || titleText.includes(kw)
          );
          if (!matchesDomain) return false;
        }
      }

      // 3. Exact Category Filter
      if (selectedCategory !== 'All' && ps.category !== selectedCategory) {
        return false;
      }

      // 4. Seat Filter
      const avail = ps.available !== undefined ? ps.available : ps.seatsAvailable ?? 5;
      if (seatFilter === 'available' && avail <= 0) return false;
      if (seatFilter === 'full' && avail > 0) return false;

      return true;
    });
  }, [problemStatements, searchQuery, selectedDomain, selectedCategory, seatFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2EB88A]" />
            <span>50 Official Hackathon Challenges</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            Problem Statements Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400 max-w-2xl">
            Each track has a strictly capped 5-team capacity across JECRC Foundation. Reserve your team's slot.
          </p>
        </div>

        {/* Action button: Refresh live seats */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fetchPS(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-[#071510] border border-slate-200 dark:border-white/10 hover:border-[#2EB88A] text-[#12141A] dark:text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2EB88A] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Live Slots'}</span>
          </button>
        </div>
      </div>

      {/* Domain Filters Carousel/Bar */}
      <div className="w-full max-w-full flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth">
        {DOMAIN_FILTERS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDomain(d.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDomain === d.id
                ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-800/80 text-[#536159] dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 hover:border-[#2EB88A]/50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Search Bar & Secondary Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-white/90 dark:bg-[#071510]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, title, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-[#12141A] dark:text-white focus:outline-none focus:border-[#2EB88A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Seat Filter Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setSeatFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                seatFilter === 'all' ? 'bg-white dark:bg-slate-900 text-[#12141A] dark:text-white shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              All ({problemStatements.length})
            </button>
            <button
              type="button"
              onClick={() => setSeatFilter('available')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                seatFilter === 'available' ? 'bg-white dark:bg-slate-900 text-[#1E9470] dark:text-[#2EB88A] shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setSeatFilter('full')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                seatFilter === 'full' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Full
            </button>
          </div>
        </div>
      </div>

      {/* Problem Statements List */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-3 border-[#2EB88A] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#536159] dark:text-slate-400">Loading live problem statements and capacities...</p>
        </div>
      ) : filteredPS.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/60 dark:bg-[#071510]/60 border border-slate-200 dark:border-white/10 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-[#12141A] dark:text-white">No problem statements match your filter criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('all');
              setSelectedCategory('All');
              setSeatFilter('all');
            }}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#DDF5EB] text-[#1E9470] hover:bg-[#DDF5EB]/80"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredPS.map((ps, idx) => (
            <ProblemStatementListItem
              key={ps._id}
              ps={ps}
              index={idx}
              onViewDetails={(p) => setSelectedPS(p)}
              userTeam={userTeamsMap[ps._id]}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedPS && (
        <ProblemStatementModal
          ps={selectedPS}
          onClose={() => setSelectedPS(null)}
          userTeam={userTeamsMap[selectedPS._id]}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default PSPage;
