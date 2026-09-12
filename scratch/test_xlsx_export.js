import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Simulate registrations data
const sampleRegistrations = [
  {
    registrationNumber: 'SRC-HACK-2026-0001',
    teamCode: 'TSH-7741',
    teamName: 'Neural Monks',
    problemStatement: {
      code: 'TSH-PS-01',
      title: 'Pseudo Mirror – AI/AR-Based Self-Awareness Experience',
      category: 'AR & Soul Consciousness',
    },
    status: 'confirmed',
    payment: { amount: 400 },
    leader: {
      name: 'Yaman Sharma',
      email: 'yaman@tsh.edu',
      phone: '9876543210',
      college: 'JECRC Foundation',
      branch: 'CSE',
      year: '3rd Year',
    },
    members: [
      { name: 'Aarav Patel', email: 'aarav@tsh.edu', phone: '9876543211', branch: 'CSE', year: '3rd Year' },
      { name: 'Diya Verma', email: 'diya@tsh.edu', phone: '9876543212', branch: 'IT', year: '3rd Year' },
      { name: 'Rohan Gupta', email: 'rohan@tsh.edu', phone: '9876543213', branch: 'ECE', year: '3rd Year' },
    ],
    createdAt: new Date().toISOString(),
  },
];

const wb = XLSX.utils.book_new();

// Sheet 1: Teams Master Roster
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

const rows = sampleRegistrations.map((t) => [
  t.registrationNumber,
  t.teamCode,
  t.teamName,
  t.problemStatement.code,
  t.problemStatement.title,
  t.problemStatement.category,
  t.status.toUpperCase(),
  'Paid & Verified at SRC Desk',
  t.payment.amount,
  t.leader.name,
  t.leader.email,
  t.leader.phone,
  t.leader.college,
  t.leader.branch,
  t.leader.year,
  t.members[0].name,
  t.members[0].email,
  t.members[0].phone,
  t.members[0].branch,
  t.members[0].year,
  t.members[1].name,
  t.members[1].email,
  t.members[1].phone,
  t.members[1].branch,
  t.members[1].year,
  t.members[2].name,
  t.members[2].email,
  t.members[2].phone,
  t.members[2].branch,
  t.members[2].year,
  new Date(t.createdAt).toLocaleString('en-IN'),
]);

const wsMaster = XLSX.utils.aoa_to_sheet([headers, ...rows]);
XLSX.utils.book_append_sheet(wb, wsMaster, 'Teams Master Roster');

// Sheet 2: Problem Statement Capacity Matrix
const capHeaders = ['PS Code', 'Problem Statement Title', 'Category Track', 'Total Capacity', 'Active Holds (15-min window)', 'Payment Pending (SRC)', 'Confirmed / Approved', 'Available Slots', 'Registration State'];
const capRows = [
  ['TSH-PS-01', 'Pseudo Mirror', 'AR & Soul', 5, 0, 0, 5, 0, 'TEMPORARILY UNAVAILABLE'],
  ['TSH-PS-02', 'Mindful News Tracker', 'Ethics', 5, 1, 0, 1, 3, 'AVAILABLE'],
];
const wsCapacity = XLSX.utils.aoa_to_sheet([capHeaders, ...capRows]);
XLSX.utils.book_append_sheet(wb, wsCapacity, 'Track Capacity Matrix');

// Sheet 3: KPIs
const summaryData = [
  ['Metric / KPI', 'Value', 'Context / Description'],
  ['Total Problem Statements', 50, 'Configured problem statement tracks in database'],
  ['Total Maximum Capacity', 250, 'Max allowable teams across all 50 tracks'],
  ['Export Date & Timestamp', new Date().toLocaleString('en-IN'), 'Authoritative export generated from TSH Admin Control Hub'],
];
const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive KPIs');

const outPath = path.resolve('scratch', 'test_export_output.xlsx');
XLSX.writeFile(wb, outPath);

console.log('Saved .xlsx file to:', outPath);
console.log('File size:', fs.statSync(outPath).size, 'bytes');

// Read it back
const readWb = XLSX.readFile(outPath);
console.log('Sheet names in generated .xlsx:', readWb.SheetNames);
if (readWb.SheetNames.length === 3) {
  console.log('✓ Successfully validated real Excel .xlsx multi-sheet generation!');
} else {
  console.error('Failed sheet count validation');
}
