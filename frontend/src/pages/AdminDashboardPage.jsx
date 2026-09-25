import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import api, { adminService, psService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Users,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  FileText,
  Mail,
  RotateCcw,
  Trash2,
  ChevronRight,
  X,
  Download,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalCapacity: 0,
    activeHolds: 0,
    paymentPending: 0,
    confirmed: 0,
    availableSlots: 0,
    rejected: 0,
    total: 0,
    totalRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Filtering
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations', 'capacity_breakdown', 'ps_seats', 'queries'
  const [problemStatements, setProblemStatements] = useState([]);
  const [capacityBreakdown, setCapacityBreakdown] = useState([]);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [capacitySearch, setCapacitySearch] = useState('');
  const [queries, setQueries] = useState([]);

  // Selected registration for details modal
  const [inspectTeam, setInspectTeam] = useState(null);

  // PS Teams View Modal & Deletion States
  const [selectedPSForTeams, setSelectedPSForTeams] = useState(null);
  const [psTeams, setPsTeams] = useState([]);
  const [loadingPSTeams, setLoadingPSTeams] = useState(false);
  const [psTeamsError, setPsTeamsError] = useState('');

  // Team deletion confirmation modal
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(false);

  // Venue Allocation Modal States
  const [venueModalTeam, setVenueModalTeam] = useState(null);
  const [venueRoomNumber, setVenueRoomNumber] = useState('');
  const [venueTimeSlot, setVenueTimeSlot] = useState('');
  const [savingVenue, setSavingVenue] = useState(false);
  const [venueModalError, setVenueModalError] = useState('');

  const handleOpenVenueModal = (team) => {
    setVenueModalTeam(team);
    setVenueRoomNumber(team.venue?.roomNumber || '');
    setVenueTimeSlot(team.venue?.timeSlot || '');
    setVenueModalError('');
  };

  const handleSaveVenue = async (e) => {
    if (e) e.preventDefault();
    if (!venueModalTeam) return;

    if (!venueRoomNumber.trim() && !venueTimeSlot.trim()) {
      setVenueModalError('Please specify at least a room number or a time slot.');
      return;
    }

    try {
      setSavingVenue(true);
      setVenueModalError('');
      const res = await adminService.updateTeamVenue(venueModalTeam._id, {
        roomNumber: venueRoomNumber.trim(),
        timeSlot: venueTimeSlot.trim(),
      });

      if (res.data?.success) {
        setActionSuccessMsg(res.data.message || 'Venue allocated successfully.');
        const updatedTeam = res.data.team;
        setRegistrations((prev) =>
          prev.map((t) => (t._id === updatedTeam._id ? updatedTeam : t))
        );
        if (inspectTeam && inspectTeam._id === updatedTeam._id) {
          setInspectTeam(updatedTeam);
        }
        setVenueModalTeam(null);
      }
    } catch (err) {
      setVenueModalError(err.message || 'Failed to allocate venue.');
    } finally {
      setSavingVenue(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await adminService.getRegistrations({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });

      if (res.data?.success) {
        setRegistrations(res.data.data);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch admin registrations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPSSeats = async () => {
    try {
      const res = await psService.getAll();
      if (res.data?.success) {
        setProblemStatements(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch PS seats:', err);
    }
  };

  const fetchCapacityBreakdown = async () => {
    try {
      setLoadingCapacity(true);
      const res = await psService.getAllCapacity();
      if (res.data?.success) {
        setCapacityBreakdown(res.data.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch capacity breakdown:', err);
    } finally {
      setLoadingCapacity(false);
    }
  };

  const fetchQueries = async () => {
    try {
      const res = await adminService.getQueries();
      if (res.data?.success) {
        setQueries(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch queries:', err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchPSSeats();
    fetchCapacityBreakdown();
    fetchQueries();
  }, [statusFilter]);

  // Approve registration (atomically generates SRC-HACK-2026-XXXX and confirms)
  const handleApprove = async (teamId) => {
    try {
      setErrorMsg('');
      const res = await adminService.approveRegistration(teamId, {
        notes: 'Verified and approved by admin desk.',
        status: 'confirmed',
      });
      if (res.data?.success) {
        setActionSuccessMsg(res.data.message);
        fetchRegistrations();
        fetchPSSeats();
        fetchCapacityBreakdown();
        if (inspectTeam && inspectTeam._id === teamId) {
          setInspectTeam(res.data.team);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve team registration.');
    }
  };

  // Reject registration (safely releases seat if it was decremented)
  const handleReject = async (teamId) => {
    if (!window.confirm('Are you sure you want to reject this registration? If a seat was held, it will be released.')) {
      return;
    }

    try {
      setErrorMsg('');
      const res = await adminService.rejectRegistration(teamId, {
        notes: 'Payment verification failed or invalid details.',
      });
      if (res.data?.success) {
        setActionSuccessMsg(res.data.message);
        fetchRegistrations();
        fetchPSSeats();
        fetchCapacityBreakdown();
        if (inspectTeam && inspectTeam._id === teamId) {
          setInspectTeam(res.data.team);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reject team registration.');
    }
  };

  // Reset all PS to 5 seats
  const handleResetSeats = async () => {
    if (!window.confirm('Reset all problem statements to 5 available seats each?')) return;
    try {
      const res = await adminService.resetPS();
      if (res.data?.success) {
        setActionSuccessMsg(res.data.message);
        fetchPSSeats();
      }
    } catch (err) {
      setErrorMsg('Failed to reset problem statements.');
    }
  };

  // Open Problem Statement Teams modal
  const handleOpenPSTeams = async (ps) => {
    setSelectedPSForTeams(ps);
    setLoadingPSTeams(true);
    setPsTeamsError('');
    try {
      const res = await adminService.getPSTeams(ps._id);
      if (res.data?.success) {
        setPsTeams(res.data.data || []);
      } else {
        setPsTeams([]);
      }
    } catch (err) {
      setPsTeamsError(err.message || 'Failed to load teams for this problem statement.');
      setPsTeams([]);
    } finally {
      setLoadingPSTeams(false);
    }
  };

  // Confirm delete team registration and restore 1 seat
  const handleConfirmDeleteTeam = async () => {
    if (!teamToDelete) return;
    try {
      setDeletingTeam(true);
      const res = await adminService.deleteTeam(teamToDelete._id);
      if (res.data?.success) {
        const successMessage =
          res.data.message ||
          `Team "${teamToDelete.teamName}" deleted and 1 seat restored successfully.`;
        setActionSuccessMsg(successMessage);

        // Remove deleted team from current PS teams modal list
        setPsTeams((prev) => prev.filter((t) => t._id !== teamToDelete._id));

        // Increment seatsAvailable by 1 on the PS card locally (capped at 5)
        const targetPSId =
          selectedPSForTeams?._id ||
          teamToDelete.problemStatement?._id ||
          teamToDelete.problemStatement;

        setProblemStatements((prev) =>
          prev.map((p) => {
            if (p._id === targetPSId) {
              return {
                ...p,
                seatsAvailable: Math.min(5, (p.seatsAvailable || 0) + 1),
              };
            }
            return p;
          })
        );

        // Update selectedPSForTeams seat count if modal is still open
        setSelectedPSForTeams((prev) =>
          prev
            ? {
                ...prev,
                seatsAvailable: Math.min(5, (prev.seatsAvailable || 0) + 1),
              }
            : null
        );

        // If inspectTeam modal was showing this team, close it
        if (inspectTeam && inspectTeam._id === teamToDelete._id) {
          setInspectTeam(null);
        }

        // Close confirmation dialog
        setTeamToDelete(null);

        // Re-fetch all data to ensure server sync
        fetchRegistrations();
        fetchPSSeats();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete team registration.');
    } finally {
      setDeletingTeam(false);
    }
  };

  // Authenticated View Slip handler
  const handleViewSlip = async (proofUrl) => {
    if (!proofUrl) return;
    try {
      const fullUrl = proofUrl.startsWith('http')
        ? proofUrl
        : `http://localhost:5000${proofUrl.startsWith('/') ? '' : '/'}${proofUrl}`;
      const response = await api.get(fullUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      alert(err.message || 'Failed to open payment proof. Please ensure you are logged in.');
    }
  };

  // Download / Export all registrations to genuine Microsoft Excel (.xlsx format)
  const handleExportExcel = () => {
    try {
      const token = localStorage.getItem('tsh_token') || '';
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `TSH_2026_Teams_Master_${dateStr}.xlsx`;
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const downloadUrl = `${apiBase}/admin/export/${fileName}?token=${encodeURIComponent(token)}`;
      window.location.assign(downloadUrl);
      return;
    } catch (serverErr) {
      console.warn('Server export stream failed, falling back to client generation:', serverErr);
    }

    if (!registrations || registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    // 1. Create a new Excel Workbook
    const wb = XLSX.utils.book_new();

    // 2. Prepare Sheet 1: Teams Master Roster
    const headers = [
      'Registration Number',
      'Team Code',
      'Team Name',
      'Problem Statement Code',
      'Problem Statement Title',
      'Category',
      'Registration Status',
      'Payment Status',
      'Registration Fee (INR)',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Leader College',
      'Leader Branch',
      'Leader Year',
      'Member 1 Name',
      'Member 1 Email',
      'Member 1 Phone',
      'Member 1 Branch',
      'Member 1 Year',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone',
      'Member 2 Branch',
      'Member 2 Year',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Phone',
      'Member 3 Branch',
      'Member 3 Year',
      'Registration Date & Time',
    ];

    const rows = registrations.map((t) => {
      const ps = t.problemStatement || {};
      const leader = t.leader || {};
      const m1 = (t.members && t.members[0]) || {};
      const m2 = (t.members && t.members[1]) || {};
      const m3 = (t.members && t.members[2]) || {};

      let paymentDesc = 'Pending Collection at SRC Desk';
      if (['finalized', 'confirmed'].includes(t.status)) {
        paymentDesc = 'Paid & Verified at SRC Desk';
      } else if (t.status === 'rejected') {
        paymentDesc = 'Registration Rejected (Slot Released)';
      }

      return [
        t.registrationNumber || 'PENDING APPROVAL',
        t.teamCode || 'N/A',
        t.teamName || 'N/A',
        ps.code || 'N/A',
        ps.title || 'N/A',
        ps.category || 'N/A',
        (t.status || 'pending').toUpperCase(),
        paymentDesc,
        t.payment?.amount || 400,
        leader.name || 'N/A',
        leader.email || 'N/A',
        leader.phone || 'N/A',
        leader.college || 'JECRC Foundation',
        leader.branch || 'N/A',
        leader.year || 'N/A',
        m1.name || '',
        m1.email || '',
        m1.phone || '',
        m1.branch || '',
        m1.year || '',
        m2.name || '',
        m2.email || '',
        m2.phone || '',
        m2.branch || '',
        m2.year || '',
        m3.name || '',
        m3.email || '',
        m3.phone || '',
        m3.branch || '',
        m3.year || '',
        t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : 'N/A',
      ];
    });

    const wsMaster = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Set professional column widths for Sheet 1
    wsMaster['!cols'] = [
      { wch: 24 }, // Registration Number
      { wch: 15 }, // Team Code
      { wch: 28 }, // Team Name
      { wch: 15 }, // PS Code
      { wch: 42 }, // PS Title
      { wch: 30 }, // Category
      { wch: 20 }, // Registration Status
      { wch: 32 }, // Payment Status
      { wch: 15 }, // Registration Fee (INR)
      { wch: 22 }, // Leader Name
      { wch: 28 }, // Leader Email
      { wch: 16 }, // Leader Phone
      { wch: 26 }, // Leader College
      { wch: 16 }, // Leader Branch
      { wch: 14 }, // Leader Year
      { wch: 20 }, // Member 1 Name
      { wch: 26 }, // Member 1 Email
      { wch: 16 }, // Member 1 Phone
      { wch: 16 }, // Member 1 Branch
      { wch: 14 }, // Member 1 Year
      { wch: 20 }, // Member 2 Name
      { wch: 26 }, // Member 2 Email
      { wch: 16 }, // Member 2 Phone
      { wch: 16 }, // Member 2 Branch
      { wch: 14 }, // Member 2 Year
      { wch: 20 }, // Member 3 Name
      { wch: 26 }, // Member 3 Email
      { wch: 16 }, // Member 3 Phone
      { wch: 16 }, // Member 3 Branch
      { wch: 14 }, // Member 3 Year
      { wch: 24 }, // Registration Date & Time
    ];

    XLSX.utils.book_append_sheet(wb, wsMaster, 'Teams Master Roster');

    // 3. Prepare Sheet 2: Problem Statement Capacity Matrix
    if (capacityBreakdown && capacityBreakdown.length > 0) {
      const capHeaders = [
        'PS Code',
        'Problem Statement Title',
        'Category Track',
        'Total Capacity',
        'Active Form Holds',
        'Payment Pending (SRC)',
        'Confirmed / Approved',
        'Available Slots',
        'Registration State',
      ];

      const capRows = capacityBreakdown.map((c) => [
        c.code,
        c.title,
        c.category,
        c.capacity || 5,
        c.activeHolds || 0,
        c.paymentPending || 0,
        c.confirmed || 0,
        c.available !== undefined ? c.available : Math.max(0, (c.capacity || 5) - ((c.activeHolds || 0) + (c.paymentPending || 0) + (c.confirmed || 0))),
        c.available > 0 ? 'AVAILABLE' : 'TEMPORARILY UNAVAILABLE',
      ]);

      const wsCapacity = XLSX.utils.aoa_to_sheet([capHeaders, ...capRows]);
      wsCapacity['!cols'] = [
        { wch: 14 }, // PS Code
        { wch: 45 }, // PS Title
        { wch: 32 }, // Category
        { wch: 14 }, // Capacity
        { wch: 26 }, // Active Holds
        { wch: 24 }, // Payment Pending
        { wch: 20 }, // Confirmed
        { wch: 16 }, // Available Slots
        { wch: 26 }, // Registration State
      ];
      XLSX.utils.book_append_sheet(wb, wsCapacity, 'Track Capacity Matrix');
    }

    // 4. Prepare Sheet 3: Hackathon Executive Summary & KPIs
    const summaryData = [
      ['Metric / KPI', 'Value', 'Context / Description'],
      ['Total Problem Statements', stats.totalProblems || problemStatements.length || 50, 'Configured problem statement tracks in database'],
      ['Total Maximum Capacity', stats.totalCapacity || 250, 'Max allowable teams across all 50 tracks (5 teams per problem)'],
      ['Active Form Holds', stats.activeHolds || 0, 'Teams currently within their temporary form reservation'],
      ['Payment Pending (SRC Club)', stats.paymentPending || 0, 'Submitted teams awaiting offline payment verification at SRC Club desk'],
      ['Confirmed & Approved Teams', stats.confirmed || 0, 'Teams verified and assigned official SRC-HACK-2026-XXXX numbers'],
      ['Available Slots Remaining', stats.availableSlots !== undefined ? stats.availableSlots : 250, 'Open slots available for team registration'],
      ['Rejected Applications', stats.rejected || 0, 'Unverified/rejected registrations (slots restored to available)'],
      ['Total Registered Teams in Sheet', registrations.length, 'Total registration documents exported in this workbook'],
      ['Export Date & Timestamp', new Date().toLocaleString('en-IN'), 'Authoritative export generated from TSH Admin Control Hub'],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [
      { wch: 34 },
      { wch: 16 },
      { wch: 55 },
    ];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive KPIs');

    // 5. Download genuine Microsoft Excel (.xlsx) file
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `TSH_2026_Teams_Master_${dateStr}.xlsx`;

    try {
      // Primary: Official SheetJS native file writer (sets binary octet-stream & .xlsx extension)
      XLSX.writeFile(wb, fileName, { bookType: 'xlsx' });
    } catch (writeErr) {
      console.warn('XLSX.writeFile fallback invoked:', writeErr);
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      }, 30000);
    }
  };

  // Download / Export registrations to CSV (.csv) format
  const handleExportCSV = () => {
    try {
      const token = localStorage.getItem('tsh_token') || '';
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `TSH_2026_Teams_Master_${dateStr}.csv`;
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const downloadUrl = `${apiBase}/admin/export/${fileName}?token=${encodeURIComponent(token)}`;
      window.location.assign(downloadUrl);
      return;
    } catch (serverErr) {
      console.warn('Server CSV export stream failed, falling back to client generation:', serverErr);
    }

    if (!registrations || registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Registration Number',
      'Team Code',
      'Team Name',
      'Problem Statement Code',
      'Problem Statement Title',
      'Category',
      'Registration Status',
      'Payment Status',
      'Registration Fee (INR)',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Leader College',
      'Leader Branch',
      'Leader Year',
      'Member 1 Name',
      'Member 1 Email',
      'Member 1 Phone',
      'Member 1 Branch',
      'Member 1 Year',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone',
      'Member 2 Branch',
      'Member 2 Year',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Phone',
      'Member 3 Branch',
      'Member 3 Year',
      'Registration Date & Time',
    ];

    const rows = registrations.map((t) => {
      const ps = t.problemStatement || {};
      const leader = t.leader || {};
      const m1 = (t.members && t.members[0]) || {};
      const m2 = (t.members && t.members[1]) || {};
      const m3 = (t.members && t.members[2]) || {};

      let paymentDesc = 'Pending Collection at SRC Desk';
      if (['finalized', 'confirmed'].includes(t.status)) {
        paymentDesc = 'Paid & Verified at SRC Desk';
      } else if (t.status === 'rejected') {
        paymentDesc = 'Registration Rejected (Slot Released)';
      }

      return [
        t.registrationNumber || 'PENDING APPROVAL',
        t.teamCode || 'N/A',
        t.teamName || 'N/A',
        ps.code || 'N/A',
        ps.title || 'N/A',
        ps.category || 'N/A',
        (t.status || 'pending').toUpperCase(),
        paymentDesc,
        t.payment?.amount || 400,
        leader.name || 'N/A',
        leader.email || 'N/A',
        leader.phone || 'N/A',
        leader.college || 'JECRC Foundation',
        leader.branch || 'N/A',
        leader.year || 'N/A',
        m1.name || '',
        m1.email || '',
        m1.phone || '',
        m1.branch || '',
        m1.year || '',
        m2.name || '',
        m2.email || '',
        m2.phone || '',
        m2.branch || '',
        m2.year || '',
        m3.name || '',
        m3.email || '',
        m3.phone || '',
        m3.branch || '',
        m3.year || '',
        t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : 'N/A',
      ];
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, 'Teams');

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `TSH_2026_Teams_Master_${dateStr}.csv`;
    try {
      XLSX.writeFile(wb, fileName, { bookType: 'csv' });
    } catch {
      const csvStr = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob(['\ufeff' + csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      }, 30000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#DDF5EB] dark:bg-[#2EB88A]/15 text-[#1E9470] dark:text-[#2EB88A] tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>ADMINISTRATOR CONTROL HUB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12141A] dark:text-white font-['Outfit'] tracking-tight mt-1.5">
            TSH Registrations & Seat Allocations
          </h1>
          <p className="text-sm text-[#536159] dark:text-slate-400 mt-1">
            Review manual payments, approve teams, release seats, and manage allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#2EB88A] hover:bg-[#1E9470] text-white transition-all shadow-sm hover:shadow-md cursor-pointer"
            title="Download full offline master table (.xlsx)"
          >
            <Download className="w-4 h-4" />
            <span>Download Offline Table (Excel)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#12141A] dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Download offline CSV format"
          >
            <FileText className="w-4 h-4 text-[#2EB88A]" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => {
              fetchRegistrations();
              fetchPSSeats();
              fetchQueries();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#12141A] dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-[#2EB88A] transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#2EB88A]" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#DDF5EB] dark:bg-emerald-950/30 border border-[#2EB88A]/30 text-[#1E9470] dark:text-emerald-300 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#2EB88A] shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-xs font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-xs font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* 7 Metric Counters Bar */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {/* Total Problems */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
          <span className="text-[11px] text-[#536159] dark:text-slate-400 uppercase font-bold tracking-wider block">
            Total Problems
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            {stats.totalProblems || problemStatements?.length || 50}
          </p>
          <span className="text-[11px] text-[#536159] dark:text-slate-400 block truncate">
            Tracks available
          </span>
        </div>

        {/* Total Capacity */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
          <span className="text-[11px] text-[#536159] dark:text-slate-400 uppercase font-bold tracking-wider block">
            Total Capacity
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            {stats.totalCapacity || 250}
          </p>
          <span className="text-[11px] text-[#536159] dark:text-slate-400 block truncate">
            Max team slots
          </span>
        </div>

        {/* Active Holds */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/20 backdrop-blur-md border border-indigo-200 dark:border-indigo-800/40 shadow-xs space-y-1">
          <span className="text-[11px] text-indigo-700 dark:text-indigo-400 uppercase font-bold tracking-wider block">
            Active Holds
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 font-['Outfit'] flex items-center gap-1.5">
            {stats.activeHolds || 0}
            {(stats.activeHolds > 0) && (
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            )}
          </p>
          <span className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80 block truncate">
            Active reservation
          </span>
        </div>

        {/* Payment Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/20 backdrop-blur-md border border-amber-200 dark:border-amber-800/40 shadow-xs space-y-1">
          <span className="text-[11px] text-amber-800 dark:text-amber-400 uppercase font-bold tracking-wider block">
            Payment Pending
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-300 font-['Outfit']">
            {stats.paymentPending || 0}
          </p>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 block truncate">
            Pending SRC Desk
          </span>
        </div>

        {/* Confirmed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF8F2] dark:bg-[#2EB88A]/10 backdrop-blur-md border border-[#2EB88A]/30 dark:border-[#2EB88A]/20 shadow-xs space-y-1">
          <span className="text-[11px] text-[#1E9470] dark:text-[#2EB88A] uppercase font-bold tracking-wider block">
            Confirmed
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E9470] dark:text-[#2EB88A] font-['Outfit']">
            {stats.confirmed || 0}
          </p>
          <span className="text-[11px] text-[#1E9470]/80 dark:text-[#2EB88A]/80 block truncate">
            Approved & locked
          </span>
        </div>

        {/* Available Slots */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/20 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/40 shadow-xs space-y-1">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-400 uppercase font-bold tracking-wider block">
            Available Slots
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-300 font-['Outfit']">
            {stats.availableSlots !== undefined ? stats.availableSlots : 250}
          </p>
          <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 block truncate">
            Open for holds
          </span>
        </div>

        {/* Rejected */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/20 backdrop-blur-md border border-rose-200 dark:border-rose-800/40 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-rose-800 dark:text-rose-400 uppercase font-bold tracking-wider block">
            Rejected
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-300 font-['Outfit']">
            {stats.rejected || 0}
          </p>
          <span className="text-[11px] text-rose-700/80 dark:text-rose-400/80 block truncate">
            Slots released
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl w-fit max-w-full overflow-x-auto no-scrollbar border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'registrations'
              ? 'bg-white dark:bg-[#1E9470] text-[#1E9470] dark:text-white shadow-xs'
              : 'text-[#536159] dark:text-slate-400 hover:text-[#12141A] dark:hover:text-white'
          }`}
        >
          Team Registrations ({registrations.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('capacity_breakdown');
            fetchCapacityBreakdown();
          }}
          className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'capacity_breakdown'
              ? 'bg-white dark:bg-[#1E9470] text-[#1E9470] dark:text-white shadow-xs'
              : 'text-[#536159] dark:text-slate-400 hover:text-[#12141A] dark:hover:text-white'
          }`}
        >
          Problem Capacity Breakdown ({capacityBreakdown.length || 50})
        </button>
        <button
          onClick={() => setActiveTab('ps_seats')}
          className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ps_seats'
              ? 'bg-white dark:bg-[#1E9470] text-[#1E9470] dark:text-white shadow-xs'
              : 'text-[#536159] dark:text-slate-400 hover:text-[#12141A] dark:hover:text-white'
          }`}
        >
          Problem Statement Seats ({problemStatements.length})
        </button>
        <button
          onClick={() => setActiveTab('queries')}
          className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'queries'
              ? 'bg-white dark:bg-[#1E9470] text-[#1E9470] dark:text-white shadow-xs'
              : 'text-[#536159] dark:text-slate-400 hover:text-[#12141A] dark:hover:text-white'
          }`}
        >
          Contact Queries ({queries.length})
        </button>
      </div>

      {/* TAB 1: REGISTRATIONS TABLE */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          {/* Search & Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search registration #, team code, name, leader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRegistrations()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-all shadow-xs"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#536159] dark:text-slate-300 whitespace-nowrap">
                  Filter Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-[#12141A] dark:text-slate-100 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-all shadow-xs cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="finalized">Finalized</option>
                  <option value="rejected">Rejected</option>
                  <option value="registered">SRC Awaited</option>
                </select>
              </div>

              {/* Export to Excel (.xlsx) and CSV Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:from-[#1E9470] hover:to-[#16785a] text-white text-xs sm:text-sm font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
                  title="Download genuine Microsoft Excel (.xlsx) workbook with 3 sheets"
                >
                  <Download className="w-4 h-4" />
                  <span>Export .xlsx</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2EB88A] text-[#12141A] dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
                  title="Download Comma-Separated Values (.csv) file"
                >
                  <Download className="w-3.5 h-3.5 text-[#2EB88A]" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#071510]/95 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[#536159] dark:text-slate-300 text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="px-2.5 py-2.5 w-10 text-center whitespace-nowrap">#</th>
                  <th className="px-3 py-2.5 min-w-[125px]">Team</th>
                  <th className="px-3 py-2.5 min-w-[170px] max-w-[240px]">Track / PS</th>
                  <th className="px-3 py-2.5 min-w-[130px]">Leader</th>
                  <th className="px-3 py-2.5 min-w-[140px] whitespace-nowrap">Payment & Status</th>
                  <th className="px-3 py-2.5 min-w-[140px] whitespace-nowrap">Venue</th>
                  <th className="px-3 py-2.5 text-left min-w-[140px] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[#536159] dark:text-slate-400">
                      Loading registrations...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[#536159] dark:text-slate-400">
                      No registrations found matching the filters.
                    </td>
                  </tr>
                ) : (
                  registrations.map((t, idx) => (
                    <tr
                      key={t._id}
                      onClick={() => setInspectTeam(t)}
                      className="hover:bg-[#DDF5EB]/30 dark:hover:bg-[#2EB88A]/10 transition-colors cursor-pointer group"
                      title="Click row to inspect team details"
                    >
                      <td className="px-2.5 py-2 text-center font-mono font-bold text-xs text-[#536159] dark:text-slate-400 whitespace-nowrap">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-2 min-w-[125px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-xs text-[#1E9470] dark:text-[#2EB88A] whitespace-nowrap">
                            {t.teamCode}
                          </span>
                          {t.registrationNumber && (
                            <span className="inline-flex items-center gap-1 font-mono font-extrabold text-[9.5px] text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 whitespace-nowrap shadow-2xs" title="Verified Registration Number">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              {t.registrationNumber}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-[#12141A] dark:text-white text-xs leading-tight line-clamp-1 mt-0.5" title={t.teamName}>
                          {t.teamName}
                        </div>
                      </td>
                      <td className="px-3 py-2 min-w-[170px] max-w-[240px]">
                        <div className="font-semibold text-xs text-[#12141A] dark:text-slate-200 leading-snug line-clamp-2" title={t.problemStatement?.title}>
                          {t.problemStatement?.title || 'Unknown PS'}
                        </div>
                        <div className="text-[10px] text-[#536159] dark:text-slate-400 font-mono mt-0.5 font-medium">
                          {t.problemStatement?.code}
                        </div>
                      </td>
                      <td className="px-3 py-2 min-w-[130px]">
                        <div className="font-semibold text-xs text-[#12141A] dark:text-white leading-tight truncate max-w-[140px]" title={t.leader?.name}>
                          {t.leader?.name}
                        </div>
                        <div className="text-[10px] text-[#536159] dark:text-slate-400 truncate max-w-[140px] leading-tight mt-0.5" title={t.leader?.email}>
                          {t.leader?.email}
                        </div>
                        <div className="text-[10px] text-[#536159] dark:text-slate-400 font-mono mt-0.5">
                          {t.leader?.phone}
                        </div>
                      </td>
                      <td className="px-3 py-2 min-w-[140px] whitespace-nowrap">
                        <div>
                          <StatusBadge status={t.status} />
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-semibold text-[#536159] dark:text-slate-400 font-mono">
                              Fee: ₹{t.payment?.amount || 400}
                            </span>
                            {t.payment?.manualProofUrl && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewSlip(t.payment.manualProofUrl);
                                }}
                                className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#1E9470] dark:text-[#2EB88A] hover:underline bg-[#DDF5EB] dark:bg-[#2EB88A]/20 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                Slip
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Venue Column */}
                      <td className="px-3 py-2 min-w-[140px]">
                        {t.venue && (t.venue.roomNumber || t.venue.timeSlot) ? (
                          <div className="space-y-0.5">
                            {t.venue.roomNumber && (
                              <div className="font-bold text-xs text-[#12141A] dark:text-white flex items-center gap-1.5">
                                <span className="p-0.5 rounded bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A]">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                </span>
                                <span className="truncate max-w-[140px]" title={t.venue.roomNumber}>
                                  {t.venue.roomNumber}
                                </span>
                              </div>
                            )}
                            {t.venue.timeSlot && (
                              <div className="text-[10px] text-[#536159] dark:text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                                <span className="truncate max-w-[140px]" title={t.venue.timeSlot}>
                                  {t.venue.timeSlot}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] italic text-slate-400 dark:text-slate-500">
                            Not allocated yet
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-left min-w-[140px] whitespace-nowrap">
                        <div className="flex items-center justify-start gap-1 sm:gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                          {['payment_pending', 'registered'].includes(t.status) && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(t._id);
                                }}
                                title="Approve upon payment"
                                className="px-2.5 py-1 min-w-[56px] text-center rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:shadow-md hover:shadow-[#2EB88A]/30 transition-all cursor-pointer whitespace-nowrap"
                              >
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(t._id);
                                }}
                                title="Reject registration"
                                className="px-2.5 py-1 min-w-[50px] text-center rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer whitespace-nowrap"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {t.status === 'confirmed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(t._id);
                              }}
                              className="px-3 py-1 min-w-[60px] text-center rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:shadow-md hover:shadow-[#2EB88A]/30 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                            >
                              Finalize
                            </button>
                          )}

                          {t.status === 'finalized' && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved
                            </span>
                          )}

                          {/* Allocate / Update Venue Button (only when approved/confirmed/finalized) */}
                          {['confirmed', 'finalized', 'approved'].includes(t.status?.toLowerCase()) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenVenueModal(t);
                              }}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                                t.venue?.roomNumber || t.venue?.timeSlot
                                  ? 'bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] border border-[#2EB88A]/40 hover:bg-[#cbf1e1] dark:hover:bg-[#2EB88A]/30 shadow-2xs'
                                  : 'text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:shadow-md hover:shadow-[#2EB88A]/30 shadow-2xs'
                              }`}
                              title={t.venue?.roomNumber || t.venue?.timeSlot ? 'Update allocated venue' : 'Allocate venue to this team'}
                            >
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{t.venue?.roomNumber || t.venue?.timeSlot ? 'Update Venue' : 'Allocate Venue'}</span>
                            </button>
                          )}

                          {t.status === 'rejected' && (
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">
                              Released
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEM CAPACITY BREAKDOWN */}
      {activeTab === 'capacity_breakdown' && (
        <div className="space-y-5">
          {/* Capacity Logic Info Header */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#DDF5EB]/70 dark:bg-[#2EB88A]/10 border border-[#2EB88A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#2EB88A] animate-pulse" />
                <h3 className="text-sm sm:text-base font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                  Real-time Problem Statement Capacity Matrix
                </h3>
              </div>
              <p className="text-xs text-[#536159] dark:text-slate-300">
                Formula: <strong className="text-[#1E9470] dark:text-[#2EB88A]">Occupied</strong> = Active Holds (15m) + Payment Pending + Confirmed. <strong className="text-[#1E9470] dark:text-[#2EB88A]">Available</strong> = Capacity (5) - Occupied.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold flex-wrap">
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white hover:from-[#1E9470] hover:to-[#16785a] transition-all cursor-pointer shadow-xs"
                title="Download complete registration records & capacity matrix as Microsoft Excel (.xlsx)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .xlsx</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#2EB88A]/40 text-[#1E9470] dark:text-[#2EB88A] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                title="Download CSV format"
              >
                <Download className="w-3.5 h-3.5 text-[#2EB88A]" />
                <span>CSV</span>
              </button>
              <button
                onClick={fetchCapacityBreakdown}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#2EB88A]/40 text-[#1E9470] dark:text-[#2EB88A] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCapacity ? 'animate-spin' : ''}`} />
                <span>Refresh Matrix</span>
              </button>
            </div>
          </div>

          {/* Search Filter for Capacity Matrix */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by PS code, title, category..."
              value={capacitySearch}
              onChange={(e) => setCapacitySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-all shadow-xs"
            />
          </div>

          {/* Capacity Breakdown Table */}
          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#071510]/95 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[#536159] dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="px-4 sm:px-5 py-3.5 min-w-[120px] whitespace-nowrap">PS Code</th>
                  <th className="px-4 sm:px-5 py-3.5 min-w-[260px] max-w-[340px]">Title & Track</th>
                  <th className="px-4 sm:px-5 py-3.5 text-center min-w-[90px] whitespace-nowrap">Capacity</th>
                  <th className="px-4 sm:px-5 py-3.5 text-center min-w-[140px] whitespace-nowrap">Active Holds (15m)</th>
                  <th className="px-4 sm:px-5 py-3.5 text-center min-w-[140px] whitespace-nowrap">Payment Pending</th>
                  <th className="px-4 sm:px-5 py-3.5 text-center min-w-[120px] whitespace-nowrap">Confirmed</th>
                  <th className="px-4 sm:px-5 py-3.5 text-center min-w-[110px] whitespace-nowrap">Available</th>
                  <th className="px-4 sm:px-5 py-3.5 text-center min-w-[170px] whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-5 py-3.5 text-right min-w-[120px] whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {loadingCapacity ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-[#536159] dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#2EB88A]" />
                        <span>Loading capacity breakdown...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const filtered = capacityBreakdown.filter((item) => {
                      if (!capacitySearch) return true;
                      const q = capacitySearch.toLowerCase();
                      return (
                        item.code?.toLowerCase().includes(q) ||
                        item.title?.toLowerCase().includes(q) ||
                        item.category?.toLowerCase().includes(q)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={9} className="px-5 py-10 text-center text-[#536159] dark:text-slate-400">
                            No problem statements found matching "{capacitySearch}".
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((item) => {
                      const isFull = item.available <= 0;
                      return (
                        <tr key={item.problemId} className="hover:bg-[#DDF5EB]/20 dark:hover:bg-[#2EB88A]/5 transition-colors">
                          <td className="px-4 sm:px-5 py-3.5 font-mono font-bold text-xs text-[#1E9470] dark:text-[#2EB88A] whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30">
                              {item.code}
                            </span>
                          </td>
                          <td className="px-4 sm:px-5 py-3.5 min-w-[260px] max-w-[340px]">
                            <div className="font-bold text-sm text-[#12141A] dark:text-white leading-snug break-words">
                              {item.title}
                            </div>
                            <div className="text-xs text-[#536159] dark:text-slate-400 mt-1 font-medium">
                              {item.category}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center font-bold text-sm text-[#12141A] dark:text-slate-200">
                            {item.capacity || 5}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {item.activeHolds > 0 ? (
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                                {item.activeHolds}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-xs">0</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {item.paymentPending > 0 ? (
                              <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                                {item.paymentPending}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-xs">0</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {item.confirmed > 0 ? (
                              <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                {item.confirmed}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-xs">0</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`font-mono font-extrabold text-sm ${isFull ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {item.available}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {isFull ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
                                TEMPORARILY UNAVAILABLE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                                AVAILABLE ({item.available} LEFT)
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                const psObj = problemStatements.find((p) => p._id === item.problemId) || {
                                  _id: item.problemId,
                                  code: item.code,
                                  title: item.title,
                                  seatsAvailable: item.available,
                                };
                                handleOpenPSTeams(psObj);
                              }}
                              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-[#12141A] dark:text-slate-200 hover:bg-[#DDF5EB] hover:text-[#1E9470] dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
                            >
                              View Teams
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })()
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROBLEM STATEMENT SEATS MANAGER */}
      {activeTab === 'ps_seats' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#DDF5EB]/60 dark:bg-[#2EB88A]/10 border border-[#2EB88A]/30 text-xs sm:text-sm text-[#1E9470] dark:text-[#2EB88A]">
            <div className="flex items-center gap-2 font-medium">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#2EB88A] animate-pulse" />
              <span>Click any Problem Statement card below to view registered teams or delete registrations to free seats.</span>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#2EB88A]/30">
              {problemStatements.length} Problem Statements Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problemStatements.map((ps) => {
              const allocatedCount = Math.max(0, 5 - (ps.seatsAvailable || 0));
              return (
                <div
                  key={ps._id}
                  onClick={() => handleOpenPSTeams(ps)}
                  className="group p-6 rounded-2xl bg-white/95 dark:bg-[#071510]/95 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 hover:border-[#2EB88A] hover:shadow-lg hover:shadow-[#2EB88A]/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  title="Click to view registered teams"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 px-3 py-1 rounded-full border border-[#2EB88A]/20">
                        {ps.code}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          ps.seatsAvailable <= 0
                            ? 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40'
                            : 'text-[#1E9470] dark:text-[#2EB88A] border-[#2EB88A]/30 bg-[#EBF8F2] dark:bg-[#2EB88A]/15'
                        }`}
                      >
                        {ps.seatsAvailable <= 0 ? '0/5 Seats (FULL)' : `${ps.seatsAvailable}/5 Seats Available`}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#12141A] dark:text-white font-['Outfit'] line-clamp-2 group-hover:text-[#1E9470] dark:group-hover:text-[#2EB88A] transition-colors">
                      {ps.title}
                    </h3>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold text-[#536159] dark:text-slate-400">
                        <span>Allocated</span>
                        <span className="font-mono font-bold text-[#12141A] dark:text-slate-200">
                          {allocatedCount} of 5 Teams
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2EB88A] to-[#1E9470] transition-all duration-500"
                          style={{ width: `${(allocatedCount / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] group-hover:underline">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      View Registered Teams ({allocatedCount})
                    </span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT QUERIES */}
      {activeTab === 'queries' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#071510]/95 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[#536159] dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Sender</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Message</th>
                  <th className="px-5 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {queries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-[#536159] dark:text-slate-400">
                      No contact inquiries submitted yet.
                    </td>
                  </tr>
                ) : (
                  queries.map((q) => (
                    <tr key={q._id} className="hover:bg-[#DDF5EB]/20 dark:hover:bg-[#2EB88A]/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-[#12141A] dark:text-white">{q.name}</div>
                        <div className="text-xs text-[#536159] dark:text-slate-400">{q.email}</div>
                      </td>
                      <td className="px-5 py-4 font-bold text-sm text-[#1E9470] dark:text-[#2EB88A]">
                        {q.subject}
                      </td>
                      <td className="px-5 py-4 max-w-md text-sm text-[#12141A] dark:text-slate-200">
                        {q.message}
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-[#536159] dark:text-slate-400">
                        {new Date(q.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Inspection Modal */}
      {inspectTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-[#071510] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#1E9470] dark:text-[#2EB88A] font-bold bg-[#DDF5EB] dark:bg-[#2EB88A]/15 px-3 py-1 rounded-full">
                    {inspectTeam.teamCode}
                  </span>
                  {inspectTeam.registrationNumber ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {inspectTeam.registrationNumber}
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      Reg No: Pending Approval
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#12141A] dark:text-white font-['Outfit'] mt-1">
                  {inspectTeam.teamName}
                </h3>
              </div>
              <StatusBadge status={inspectTeam.status} />
            </div>

            {/* Problem Statement */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#536159] dark:text-slate-400">
                Chosen Problem Statement
              </span>
              <p className="text-base font-bold text-[#12141A] dark:text-white">
                {inspectTeam.problemStatement?.title}
              </p>
              <p className="text-xs font-mono text-[#536159] dark:text-slate-400">
                Code: {inspectTeam.problemStatement?.code}
              </p>
            </div>

            {/* Leader Details */}
            <div className="p-4 rounded-2xl bg-[#EBF8F2] dark:bg-[#2EB88A]/10 border border-[#2EB88A]/30 space-y-2">
              <h4 className="text-xs font-bold uppercase text-[#1E9470] dark:text-[#2EB88A]">
                Team Leader
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#12141A] dark:text-slate-200">
                <div>
                  <span className="text-[#536159] dark:text-slate-400 font-semibold">Name:</span>{' '}
                  {inspectTeam.leader?.name}
                </div>
                <div>
                  <span className="text-[#536159] dark:text-slate-400 font-semibold">Email:</span>{' '}
                  {inspectTeam.leader?.email}
                </div>
                <div>
                  <span className="text-[#536159] dark:text-slate-400 font-semibold">Phone:</span>{' '}
                  {inspectTeam.leader?.phone}
                </div>
                <div>
                  <span className="text-[#536159] dark:text-slate-400 font-semibold">Branch & Year:</span>{' '}
                  {inspectTeam.leader?.branch} • {inspectTeam.leader?.year}
                </div>
              </div>
            </div>

            {/* 3 Members */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#536159] dark:text-slate-400">
                Team Members (3)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {inspectTeam.members?.map((m, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
                  >
                    <p className="font-bold text-sm text-[#12141A] dark:text-white break-words">{m.name}</p>
                    <p className="text-[#536159] dark:text-slate-400 break-all text-[11px]">{m.email}</p>
                    <p className="text-[#536159] dark:text-slate-400 font-mono">{m.phone}</p>
                    <p className="text-[#536159] dark:text-slate-400">
                      {m.branch} • {m.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A]">
                Registration Fee & SRC Verification
              </h4>
              <div className="text-sm text-[#12141A] dark:text-slate-200 space-y-1.5">
                <p>
                  Collection Mode: <strong>Student Resource Center (SRC) In-Person Desk</strong>
                </p>
                <p>
                  Fee Amount: <strong>₹{inspectTeam.payment?.amount || 400} (Team of 4)</strong>
                </p>
                <p>
                  Payment Status:{' '}
                  {['finalized', 'confirmed'].includes(inspectTeam.status) ? (
                    <strong className="text-emerald-600 dark:text-emerald-400">Verified & Paid at SRC Counter</strong>
                  ) : (
                    <strong className="text-amber-600 dark:text-amber-400">Pending Collection at SRC Desk</strong>
                  )}
                </p>
                {inspectTeam.payment?.manualProofUrl && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleViewSlip(inspectTeam.payment.manualProofUrl)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] hover:bg-[#cbf1e1] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Uploaded Payment Slip
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Venue Allocation Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Venue Allocation</span>
                </h4>
                {['confirmed', 'finalized', 'approved'].includes(inspectTeam.status?.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => handleOpenVenueModal(inspectTeam)}
                    className="text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{inspectTeam.venue?.roomNumber || inspectTeam.venue?.timeSlot ? 'Edit Venue' : 'Allocate Venue'}</span>
                  </button>
                )}
              </div>
              <div className="text-sm text-[#12141A] dark:text-slate-200">
                {inspectTeam.venue && (inspectTeam.venue.roomNumber || inspectTeam.venue.timeSlot) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[#536159] dark:text-slate-400 font-semibold block text-[11px]">Room Number:</span>
                      <strong className="text-[#12141A] dark:text-white text-xs">{inspectTeam.venue.roomNumber || 'Not assigned'}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[#536159] dark:text-slate-400 font-semibold block text-[11px]">Time Slot:</span>
                      <strong className="text-[#12141A] dark:text-white text-xs">{inspectTeam.venue.timeSlot || 'Not assigned'}</strong>
                    </div>
                    {inspectTeam.venue.allocatedAt && (
                      <div className="text-[11px] text-[#536159] dark:text-slate-400 col-span-1 sm:col-span-2 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Allocated on: {new Date(inspectTeam.venue.allocatedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Venue not allocated yet.{' '}
                    {['confirmed', 'finalized', 'approved'].includes(inspectTeam.status?.toLowerCase())
                      ? 'Click Allocate Venue above to assign a room.'
                      : 'Team must be approved before a venue can be allocated.'}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectTeam(null)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => setTeamToDelete(inspectTeam)}
                  className="px-4 py-2.5 rounded-full text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Delete team and restore 1 seat"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Team (+1 Seat)</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {['payment_pending', 'registered'].includes(inspectTeam.status) && (
                  <>
                    <button
                      onClick={() => handleReject(inspectTeam._id)}
                      className="px-5 py-2.5 rounded-full text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50 transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(inspectTeam._id)}
                      className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:shadow-lg hover:shadow-[#2EB88A]/25 transition-all cursor-pointer"
                    >
                      Approve & Deduct Seat
                    </button>
                  </>
                )}

                {['confirmed', 'finalized', 'approved'].includes(inspectTeam.status?.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => handleOpenVenueModal(inspectTeam)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:shadow-lg hover:shadow-[#2EB88A]/25 transition-all cursor-pointer shadow-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{inspectTeam.venue?.roomNumber || inspectTeam.venue?.timeSlot ? 'Update Venue' : 'Allocate Venue'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Problem Statement Registered Teams Modal */}
      {selectedPSForTeams && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white dark:bg-[#071510] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono text-[#1E9470] dark:text-[#2EB88A] font-bold bg-[#DDF5EB] dark:bg-[#2EB88A]/15 px-3 py-1 rounded-full border border-[#2EB88A]/20">
                    {selectedPSForTeams.code}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      selectedPSForTeams.seatsAvailable <= 0
                        ? 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40'
                        : 'text-[#1E9470] dark:text-[#2EB88A] border-[#2EB88A]/30 bg-[#EBF8F2] dark:bg-[#2EB88A]/15'
                    }`}
                  >
                    {selectedPSForTeams.seatsAvailable <= 0
                      ? '0/5 Seats Available (FULL)'
                      : `${selectedPSForTeams.seatsAvailable}/5 Seats Available`}
                  </span>
                  <span className="text-xs font-semibold text-[#536159] dark:text-slate-400">
                    ({Math.max(0, 5 - (selectedPSForTeams.seatsAvailable || 0))} of 5 Allocated)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                  {selectedPSForTeams.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedPSForTeams(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner if any */}
            {psTeamsError && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{psTeamsError}</span>
              </div>
            )}

            {/* Content: Loading vs Empty vs Team List */}
            {loadingPSTeams ? (
              <div className="py-14 flex flex-col items-center justify-center space-y-3 text-[#536159] dark:text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-[#2EB88A]" />
                <p className="text-sm font-medium">Fetching registered teams for {selectedPSForTeams.code}...</p>
              </div>
            ) : psTeams.length === 0 ? (
              <div className="py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/20 flex items-center justify-center mx-auto text-[#1E9470] dark:text-[#2EB88A]">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-[#12141A] dark:text-white font-['Outfit']">
                  No Teams Registered Yet
                </h4>
                <p className="text-sm text-[#536159] dark:text-slate-400 max-w-md mx-auto">
                  There are currently no teams registered under problem statement{' '}
                  <strong className="text-[#12141A] dark:text-white">{selectedPSForTeams.code}</strong>. All 5 seats are completely open and available.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#536159] dark:text-slate-400 uppercase tracking-wider px-1">
                  <span>Registered Teams ({psTeams.length})</span>
                  <span>Seats: {selectedPSForTeams.seatsAvailable}/5 Available</span>
                </div>

                <div className="space-y-4">
                  {psTeams.map((team) => (
                    <div
                      key={team._id}
                      className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-[#2EB88A]/40 transition-colors"
                    >
                      {/* Team Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/20 px-3 py-1 rounded-full border border-[#2EB88A]/20">
                            {team.teamCode}
                          </span>
                          <h4 className="text-base sm:text-lg font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                            {team.teamName}
                          </h4>
                          <StatusBadge status={team.status} />
                        </div>

                        {/* Delete Team Button */}
                        <button
                          onClick={() => setTeamToDelete(team)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer self-start sm:self-center shadow-xs"
                          title="Delete this team and restore 1 seat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Team (+1 Seat)</span>
                        </button>
                      </div>

                      {/* Team Leader & Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] block">
                            Team Leader
                          </span>
                          <p className="font-bold text-[#12141A] dark:text-white">
                            {team.leader?.name}
                          </p>
                          <p className="text-[#536159] dark:text-slate-400">{team.leader?.email}</p>
                          <p className="text-[#536159] dark:text-slate-400 font-mono">
                            {team.leader?.phone}
                          </p>
                          <p className="text-[#536159] dark:text-slate-400 text-xs">
                            {team.leader?.branch} • {team.leader?.year}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] block">
                            Payment & Registration
                          </span>
                          <p className="text-[#12141A] dark:text-slate-200">
                            Method: <strong className="capitalize">{team.payment?.method || 'Pending'}</strong>
                          </p>
                          {team.payment?.manualTxnId && (
                            <p className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                              UTR: {team.payment.manualTxnId}
                            </p>
                          )}
                          <p className="text-xs text-[#536159] dark:text-slate-400">
                            Registered: {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                          {team.payment?.manualProofUrl && (
                            <button
                              type="button"
                              onClick={() => handleViewSlip(team.payment.manualProofUrl)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#1E9470] dark:text-[#2EB88A] hover:underline pt-0.5 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Payment Slip
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Members (3) */}
                      {team.members && team.members.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#536159] dark:text-slate-400 block">
                            Members ({team.members.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {team.members.map((m, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs space-y-0.5"
                              >
                                <p className="font-bold text-[#12141A] dark:text-white break-words">
                                  {m.name}
                                </p>
                                <p className="text-[#536159] dark:text-slate-400 break-all text-[11px]">{m.email}</p>
                                <p className="text-[#536159] dark:text-slate-400 font-mono text-[11px]">
                                  {m.phone}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-[#536159] dark:text-slate-400 font-medium">
                Showing {psTeams.length} registered team(s) under {selectedPSForTeams.code}
              </span>
              <button
                onClick={() => setSelectedPSForTeams(null)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-slate-200 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog For Deleting Team */}
      {teamToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#071510] border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                  Confirm Team Deletion
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                  Action requires explicit confirmation
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-sm text-[#12141A] dark:text-slate-200">
              <p>
                Are you sure you want to permanently delete this team?
              </p>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <p className="font-bold text-base text-[#12141A] dark:text-white">
                  {teamToDelete.teamName}
                </p>
                <p className="text-xs font-mono font-bold text-[#1E9470] dark:text-[#2EB88A]">
                  Code: {teamToDelete.teamCode}
                </p>
                <p className="text-xs text-[#536159] dark:text-slate-400 mt-1">
                  Leader: {teamToDelete.leader?.name} ({teamToDelete.leader?.email})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-bold">Effects of this action:</p>
              <ul className="list-disc pl-4 space-y-1 text-amber-800 dark:text-amber-400">
                <li>Permanently removes team registration and member records.</li>
                <li>
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    Increases available seat count by +1
                  </strong>{' '}
                  for this Problem Statement (capped at 5).
                </li>
                <li>Immediately takes effect across all pages and registration flows.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deletingTeam}
                onClick={() => setTeamToDelete(null)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingTeam}
                onClick={handleConfirmDeleteTeam}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-md hover:shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {deletingTeam ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting & Restoring Seat...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete & Increase Seat (+1)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Venue Allocation & Update Modal */}
      {venueModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#071510] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 border border-[#2EB88A]/30 flex items-center justify-center shrink-0 text-[#1E9470] dark:text-[#2EB88A]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                    {venueModalTeam.venue?.roomNumber || venueModalTeam.venue?.timeSlot
                      ? 'Update Venue Allocation'
                      : 'Allocate Venue'}
                  </h3>
                  <p className="text-xs text-[#536159] dark:text-slate-400 font-mono mt-0.5">
                    Team: <strong className="text-[#12141A] dark:text-white">{venueModalTeam.teamName}</strong> ({venueModalTeam.teamCode})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVenueModalTeam(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message if any */}
            {venueModalError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{venueModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveVenue} className="space-y-4">
              {/* Room Number Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#536159] dark:text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#1E9470] dark:text-[#2EB88A]" />
                  <span>Room / Hall / Lab Number *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Lab 301, Block B or Audi 2"
                  value={venueRoomNumber}
                  onChange={(e) => setVenueRoomNumber(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-all shadow-2xs font-medium"
                />
              </div>

              {/* Time Slot Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#536159] dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1E9470] dark:text-[#2EB88A]" />
                  <span>Presentation / Reporting Time Slot *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Day 1, 10:00 AM - 12:00 PM"
                  value={venueTimeSlot}
                  onChange={(e) => setVenueTimeSlot(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-all shadow-2xs font-medium"
                />

                {/* Quick Presets */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-[#536159] dark:text-slate-400 tracking-wider block mb-1">
                    Quick Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Day 1, 10:00 AM - 12:00 PM',
                      'Day 1, 02:00 PM - 04:00 PM',
                      'Day 2, 09:00 AM - 11:00 AM',
                      'Day 2, 01:00 PM - 03:00 PM',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setVenueTimeSlot(slot)}
                        className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          venueTimeSlot === slot
                            ? 'bg-[#DDF5EB] dark:bg-[#2EB88A]/25 border-[#2EB88A] text-[#1E9470] dark:text-[#2EB88A] font-bold shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-[#536159] dark:text-slate-300 hover:border-[#2EB88A]/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl bg-[#DDF5EB]/60 dark:bg-[#2EB88A]/10 border border-[#2EB88A]/20 text-[11px] text-[#1E9470] dark:text-[#2EB88A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2EB88A]" />
                <span>
                  Team is approved. This venue will appear on the student dashboard immediately.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setVenueModalTeam(null)}
                  disabled={savingVenue}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-slate-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVenue}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:shadow-md hover:shadow-[#2EB88A]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingVenue ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Venue...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Save Venue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
