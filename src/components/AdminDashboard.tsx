import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Download,
  Eye,
  FileCheck2,
  FileJson,
  Lock,
  LogOut,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { ADVANCED_BADGES } from '../data/advancedTrackData';
import { BADGES } from '../data/workshopData';
import {
  ADMIN_EMAIL,
  isFacilitatorAdmin,
  signInWithGoogleOnly,
} from '../firebase';
import {
  AdminAdvancedUserSummary,
  subscribeAdminAdvancedData,
} from '../services/advancedFirestoreService';
import {
  adminResetFinalAssessment,
  FinalAssessmentDoc,
  subscribeAdminFinalAssessments,
} from '../services/finalAssessmentService';
import {
  AdminUserRecord,
  subscribeAdminLiveData,
} from '../services/firestoreService';

interface AdminDashboardProps {
  open: boolean;
  onClose: () => void;
  currentUser: User | null;
}

type FilterStatus = 'all' | 'mastered' | 'active' | 'starter';
type SortBy = 'xp' | 'levels' | 'wheel' | 'recent';

function formatTimestamp(ms: number): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeCsv(value: unknown): string {
  const str = String(value ?? '').replace(/"/g, '""');
  return `"${str}"`;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  open,
  onClose,
  currentUser,
}) => {
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [credError, setCredError] = useState<string | null>(null);
  const [credentialsUnlocked, setCredentialsUnlocked] = useState(false);

  const [records, setRecords] = useState<AdminUserRecord[]>([]);
  const [advByUid, setAdvByUid] = useState<
    Record<string, AdminAdvancedUserSummary>
  >({});
  const [finalByUid, setFinalByUid] = useState<
    Record<string, FinalAssessmentDoc>
  >({});
  const [adminTrackView, setAdminTrackView] = useState<'core' | 'advanced' | 'final'>('core');
  const [lastSyncMs, setLastSyncMs] = useState<number>(0);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('xp');
  const [inspectedUser, setInspectedUser] = useState<AdminUserRecord | null>(null);
  const [resetConfirmUid, setResetConfirmUid] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState(false);

  const hasAdminGoogleSession = isFacilitatorAdmin(currentUser);

  useEffect(() => {
    if (!open || !credentialsUnlocked || !hasAdminGoogleSession) return;

    setStreamError(null);
    const unsubCore = subscribeAdminLiveData(
      (nextRecords, syncTime) => {
        setRecords(nextRecords);
        setLastSyncMs(syncTime);
      },
      (errMsg) => {
        setStreamError(errMsg);
      }
    );
    const unsubAdv = subscribeAdminAdvancedData(
      (advMap) => {
        setAdvByUid(advMap);
      },
      (errMsg) => {
        setStreamError(errMsg);
      }
    );
    const unsubFinal = subscribeAdminFinalAssessments(
      (finalMap) => {
        setFinalByUid(finalMap);
      },
      (errMsg) => {
        setStreamError(errMsg);
      }
    );

    return () => {
      unsubCore();
      unsubAdv();
      unsubFinal();
    };
  }, [open, credentialsUnlocked, hasAdminGoogleSession]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = records.filter((r) => {
      const matchesSearch =
        !q ||
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.certificateId.toLowerCase().includes(q) ||
        r.rankTitle.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (statusFilter === 'mastered') return r.completedLevels.length === 10;
      if (statusFilter === 'active') {
        return r.completedLevels.length > 0 && r.completedLevels.length < 10;
      }
      if (statusFilter === 'starter') return r.completedLevels.length === 0;
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'levels') {
        return b.completedLevels.length - a.completedLevels.length || b.xp - a.xp;
      }
      if (sortBy === 'wheel') {
        return b.wheelSpins - a.wheelSpins || b.xp - a.xp;
      }
      if (sortBy === 'recent') {
        return b.lastActiveMs - a.lastActiveMs;
      }
      return b.xp - a.xp || b.completedLevels.length - a.completedLevels.length;
    });

    return list;
  }, [records, searchQuery, statusFilter, sortBy]);

  if (!open) return null;

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      userIdInput.trim().toLowerCase() === 'admin' &&
      passwordInput === 'admin'
    ) {
      setCredError(null);
      setCredentialsUnlocked(true);
    } else {
      setCredError('Invalid User ID or Password. Use User ID "admin" and Password "admin".');
    }
  };

  const handleConnectAdminGoogle = async () => {
    setGoogleBusy(true);
    setStreamError(null);
    try {
      const user = await signInWithGoogleOnly();
      if (!isFacilitatorAdmin(user)) {
        setStreamError(
          `Signed in as ${user.email}, which is a standard learner account. To view live all-user Firestore data, please select ${ADMIN_EMAIL} in Google Sign-In.`
        );
      }
    } catch (err) {
      setStreamError(
        err instanceof Error ? err.message : 'Google sign-in failed. Please try again.'
      );
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleDownloadCsvReport = () => {
    const headers = [
      'Learner Name',
      'Google Email',
      'Core Rank',
      'Core Total XP',
      'Core Levels Completed',
      'Completed Levels',
      'Core Badges Unlocked',
      'Wheel Spins',
      'Wheel Prompts Done',
      'Shared Wall Posts',
      'Core Certificate ID',
      'Advanced XP',
      'Advanced Rank',
      'Advanced Challenges (/25)',
      'Advanced Avg Auto-Score (/100)',
      'Advanced Badges (/8)',
      'Advanced Certificate ID',
      'Final Exam Status',
      'Final Total XP (/1000)',
      'Final Part A MCQs (/400)',
      'Final Part B Cases (/500)',
      'Final Part C SCARE (/100)',
      'Final Grade Tier',
      'Final Passed',
      'Final Target Role',
      'Final College/Cohort',
      'Final Cert ID',
      'Final LOR ID',
      'Joined At',
      'Last Active',
      'Level 2 Pitch',
      'Level 3 Story Title',
      'Level 5 CEO Solution',
      'Level 7 Product Pitch Name',
      'Level 9 Boardroom Proposal',
      'Level 10 Capstone Theme',
    ];

    const rows = filteredRecords.map((r) => {
      const adv = advByUid[r.uid];
      const fin = finalByUid[r.uid];
      return [
        r.displayName,
        r.email,
        r.rankTitle,
        r.xp,
        `${r.completedLevels.length}/10`,
        r.completedLevels.map((n) => `L${n}`).join(' '),
        `${r.unlockedBadges.length}/${BADGES.length}`,
        r.wheelSpins,
        r.completedWheelPrompts.length,
        r.wallPostsCount,
        r.certificateId,
        adv?.advXp ?? 0,
        adv?.advRankTitle ?? 'AI Visual Explorer',
        `${adv?.completedChallenges.length ?? 0}/25`,
        adv?.avgScore ?? 0,
        `${adv?.unlockedAdvBadges.length ?? 0}/${ADVANCED_BADGES.length}`,
        adv?.advCertificateId ?? '',
        fin?.status ?? 'not_started',
        fin?.totalXpAwarded ?? 0,
        fin?.mcqScore ?? 0,
        fin?.caseScore ?? 0,
        fin?.scareScore ?? 0,
        fin?.gradeTier ?? '',
        fin?.passed ? 'YES' : 'NO',
        fin?.targetRole ?? '',
        fin?.collegeOrOrg ?? '',
        fin?.finalCertificateId ?? '',
        fin?.lorVerificationId ?? '',
        formatTimestamp(r.createdAtMs),
        formatTimestamp(
          Math.max(r.lastActiveMs, adv?.updatedAtMs ?? 0, fin?.submittedAtMs ?? 0)
        ),
        r.workspace.act2Pitch || '',
        r.workspace.act3StoryTitle || '',
        r.workspace.act5CeoSolution || '',
        r.workspace.act7PitchName || '',
        r.workspace.act9Proposal || '',
        r.workspace.act10Theme || '',
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `Picture-Connect-Admin-Report-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJsonReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      totalLearners: filteredRecords.length,
      learners: filteredRecords.map((r) => ({
        ...r,
        advancedTrack: advByUid[r.uid] ?? null,
        finalAssessment: finalByUid[r.uid] ?? null,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `Picture-Connect-Firestore-Export-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetFinalAttempt = async (uid: string) => {
    setResetBusy(true);
    setStreamError(null);
    try {
      await adminResetFinalAssessment(uid);
      setResetConfirmUid(null);
    } catch (err) {
      setStreamError(
        err instanceof Error ? err.message : 'Failed to reset Final Assessment.'
      );
    } finally {
      setResetBusy(false);
    }
  };

  const totalLearners = records.length;
  const totalXpSum = records.reduce((sum, r) => sum + r.xp, 0);
  const avgXp = totalLearners > 0 ? Math.round(totalXpSum / totalLearners) : 0;
  const finalSubmittedCount = Object.values(finalByUid).filter(
    (f) => f.status === 'submitted'
  ).length;
  const finalPassedCount = Object.values(finalByUid).filter(
    (f) => f.status === 'submitted' && f.passed
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Admin Dashboard"
    >
      <div className="w-full max-w-7xl max-h-[94vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                Admin Command Center · Picture Connect with Kapil
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {credentialsUnlocked && hasAdminGoogleSession
                  ? `Live Firestore Sync · ${totalLearners} Real Users · Last sync ${
                      lastSyncMs ? formatTimestamp(lastSyncMs) : 'Connecting...'
                    }`
                  : 'Restricted Administration Portal'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {credentialsUnlocked && (
              <button
                type="button"
                onClick={() => {
                  setCredentialsUnlocked(false);
                  setUserIdInput('');
                  setPasswordInput('');
                  setInspectedUser(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Admin</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Admin Dashboard"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: User ID / Password Gate (admin / admin) */}
          {!credentialsUnlocked && (
            <div className="max-w-md mx-auto my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ADMIN AUTHENTICATION</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Sign in to Admin Dashboard
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Monitor real-time learner progress, XP, levels, wheel exercises, and export live Firestore reports.
                </p>
              </div>

              {credError && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
                  {credError}
                </div>
              )}

              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="admin"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="•••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Unlock Admin Dashboard
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Google Admin Session Verification (Zero-Trust Firestore Protection) */}
          {credentialsUnlocked && !hasAdminGoogleSession && (
            <div className="max-w-lg mx-auto my-8 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-mono font-semibold text-amber-800 dark:text-amber-300">
                  STEP 2 OF 2 · FIRESTORE ENCRYPTION KEY
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  Verify Admin Google Account
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Admin credentials accepted. Because learner emails and progress are protected by Zero-Trust Firestore Security Rules, connect with the authorized owner Google account (
                  <span className="font-mono font-semibold">{ADMIN_EMAIL}</span>) to stream live data for all users.
                </p>
              </div>

              {streamError && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
                  {streamError}
                </div>
              )}

              <button
                type="button"
                disabled={googleBusy}
                onClick={handleConnectAdminGoogle}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-slate-950 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {googleBusy
                    ? 'Verifying Google Session...'
                    : `Sign in with Google (${ADMIN_EMAIL})`}
                </span>
              </button>
            </div>
          )}

          {/* Step 3: Live Admin Analytics, User Performance Table & Report Exporter */}
          {credentialsUnlocked && hasAdminGoogleSession && (
            <>
              {streamError && (
                <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
                  {streamError}
                </div>
              )}

              {/* Track Selector Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminTrackView('core')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      adminTrackView === 'core'
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Core Track (Levels 1–10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTrackView('advanced')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      adminTrackView === 'advanced'
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    AI Advanced Track (25 Challenges)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTrackView('final')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      adminTrackView === 'final'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Final Exam (1000 XP · LOR PDF)
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {finalSubmittedCount} Final Submitted ({finalPassedCount} Passed)
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Verified Google Users</span>
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
                    {totalLearners}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Average Core XP</span>
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
                    {avgXp} XP
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Final Exam Passed</span>
                    <FileCheck2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
                    {finalPassedCount} / {finalSubmittedCount}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>AI Track Submissions</span>
                    <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
                    {Object.values(advByUid).reduce(
                      (s, a) => s + a.submissions.length,
                      0
                    )}
                  </div>
                </div>
              </div>

              {/* Controls: Search + Filter + Sort + Download Reports */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative flex-1 min-w-[220px] max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, email, or certificate ID..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="all">All Users ({totalLearners})</option>
                    <option value="mastered">10/10 Mastery Only</option>
                    <option value="active">Active in Progress</option>
                    <option value="starter">0 Levels Completed</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="xp">Sort: Highest XP</option>
                    <option value="levels">Sort: Levels Completed</option>
                    <option value="wheel">Sort: Wheel Spins</option>
                    <option value="recent">Sort: Most Recently Active</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadCsvReport}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJsonReport}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Live Learner Performance Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase">
                      <th className="py-3 px-4">Learner</th>
                      {adminTrackView === 'core' ? (
                        <>
                          <th className="py-3 px-3">Rank</th>
                          <th className="py-3 px-3">XP</th>
                          <th className="py-3 px-3">Levels (1–10)</th>
                          <th className="py-3 px-3">Badges</th>
                          <th className="py-3 px-3">Wheel</th>
                          <th className="py-3 px-3">Certificate ID</th>
                        </>
                      ) : adminTrackView === 'advanced' ? (
                        <>
                          <th className="py-3 px-3">Adv Rank</th>
                          <th className="py-3 px-3">Adv XP</th>
                          <th className="py-3 px-3">Challenges (/25)</th>
                          <th className="py-3 px-3">Avg Score</th>
                          <th className="py-3 px-3">Adv Badges</th>
                          <th className="py-3 px-3">Adv Cert ID</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-3">Exam Status</th>
                          <th className="py-3 px-3">Final XP (/1000)</th>
                          <th className="py-3 px-3">Part A (/400)</th>
                          <th className="py-3 px-3">Part B (/500)</th>
                          <th className="py-3 px-3">Part C (/100)</th>
                          <th className="py-3 px-3">LOR &amp; Tier</th>
                        </>
                      )}
                      <th className="py-3 px-3">Last Active</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-8 text-center text-slate-500 dark:text-slate-400"
                        >
                          No matching learners found in live Firestore stream.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((learner) => {
                        const pct = Math.round((learner.completedLevels.length / 10) * 100);
                        const adv = advByUid[learner.uid];
                        const advPct = Math.round(
                          ((adv?.completedChallenges.length ?? 0) / 25) * 100
                        );
                        const fin = finalByUid[learner.uid];
                        return (
                          <tr
                            key={learner.uid}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-950 dark:text-white">
                                {learner.displayName}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                {learner.email}
                              </div>
                            </td>
                            {adminTrackView === 'core' ? (
                              <>
                                <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                                  {learner.rankTitle}
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                                  {learner.xp}
                                </td>
                                <td className="py-3 px-3 min-w-[130px]">
                                  <div className="flex items-center justify-between font-mono text-[11px] mb-1 tabular-nums">
                                    <span>{learner.completedLevels.length}/10</span>
                                    <span className="text-slate-400">{pct}%</span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums">
                                  {learner.unlockedBadges.length}/{BADGES.length}
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums">
                                  {learner.wheelSpins} spins
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                                  {learner.certificateId}
                                </td>
                              </>
                            ) : adminTrackView === 'advanced' ? (
                              <>
                                <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                                  {adv?.advRankTitle ?? 'AI Visual Explorer'}
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
                                  {adv?.advXp ?? 0}
                                </td>
                                <td className="py-3 px-3 min-w-[130px]">
                                  <div className="flex items-center justify-between font-mono text-[11px] mb-1 tabular-nums">
                                    <span>{adv?.completedChallenges.length ?? 0}/25</span>
                                    <span className="text-slate-400">{advPct}%</span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                                      style={{ width: `${advPct}%` }}
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                                  {adv?.avgScore ?? 0}/100
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums">
                                  {adv?.unlockedAdvBadges.length ?? 0}/{ADVANCED_BADGES.length}
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                                  {adv?.advCertificateId || '—'}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-3 px-3 font-mono font-semibold">
                                  {fin?.status === 'submitted' ? (
                                    <span className={fin.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
                                      {fin.passed ? 'PASSED' : 'SUBMITTED (<600)'}
                                    </span>
                                  ) : fin?.status === 'in_progress' ? (
                                    <span className="text-blue-700 dark:text-blue-400">IN PROGRESS</span>
                                  ) : (
                                    <span className="text-slate-400">NOT STARTED</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-slate-950 dark:text-white tabular-nums">
                                  {fin ? `${fin.totalXpAwarded}/1000` : '—'}
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums">
                                  {fin ? `${fin.mcqScore}/400` : '—'}
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums">
                                  {fin ? `${fin.caseScore}/500` : '—'}
                                </td>
                                <td className="py-3 px-3 font-mono tabular-nums">
                                  {fin ? `${fin.scareScore}/100` : '—'}
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                                  {fin?.status === 'submitted'
                                    ? `${fin.lorVerificationId} · ${fin.gradeTier}`
                                    : '—'}
                                </td>
                              </>
                            )}
                            <td className="py-3 px-3 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {formatTimestamp(
                                adminTrackView === 'final'
                                  ? fin?.submittedAtMs || fin?.startedAtMs || learner.lastActiveMs
                                  : adminTrackView === 'advanced'
                                  ? adv?.updatedAtMs || learner.lastActiveMs
                                  : learner.lastActiveMs
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setInspectedUser(learner)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Selected Learner Submissions Inspector */}
              {inspectedUser && (
                <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-slate-950 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
                        LEARNER PORTFOLIO AUDIT · {inspectedUser.certificateId}
                      </div>
                      <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                        {inspectedUser.displayName} ({inspectedUser.email})
                      </h3>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                        Completed Levels:{' '}
                        {inspectedUser.completedLevels.length > 0
                          ? inspectedUser.completedLevels.map((l) => `L${l}`).join(', ')
                          : 'None yet'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectedUser(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                    >
                      Close Inspector ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Level 2 · Impossible Connection
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {inspectedUser.workspace.act2Pitch || 'Not submitted yet'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Level 3 · Story Architect
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {inspectedUser.workspace.act3StoryTitle || 'Not submitted yet'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Level 5 · CEO Mindset
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {inspectedUser.workspace.act5CeoSolution || 'Not submitted yet'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Level 7 · Product Pitch
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {inspectedUser.workspace.act7PitchName
                          ? `${inspectedUser.workspace.act7PitchName}: ${
                              inspectedUser.workspace.act7PitchScript || ''
                            }`
                          : 'Not submitted yet'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Level 9 · Boardroom Turnaround
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {inspectedUser.workspace.act9Proposal || 'Not submitted yet'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Level 10 · Capstone Vision
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {inspectedUser.workspace.act10Theme
                          ? `${inspectedUser.workspace.act10Theme} — ${
                              inspectedUser.workspace.act10Notes || ''
                            }`
                          : 'Not submitted yet'}
                      </p>
                    </div>
                  </div>

                  {inspectedUser.posts.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        Wall &amp; Spinning Wheel Submissions ({inspectedUser.posts.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto">
                        {inspectedUser.posts.map((post) => (
                          <div
                            key={post.id}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                          >
                            <div className="font-semibold text-blue-700 dark:text-blue-400">
                              [{post.kind.toUpperCase()}] {post.title}
                            </div>
                            <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                              {post.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(advByUid[inspectedUser.uid]?.submissions.length ?? 0) > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                        AI Advanced Track Submissions ({advByUid[inspectedUser.uid].submissions.length}/25 · Avg {advByUid[inspectedUser.uid].avgScore}/100)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto">
                        {advByUid[inspectedUser.uid].submissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 text-xs flex items-start gap-3"
                          >
                            {sub.imageDataUrl && (
                              <img
                                src={sub.imageDataUrl}
                                alt={`Challenge ${sub.challengeId}`}
                                className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                              />
                            )}
                            <div className="space-y-1 min-w-0">
                              <div className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                                Challenge #{sub.challengeId} · {sub.totalScore}/100
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                                {sub.feedback}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {finalByUid[inspectedUser.uid] && (
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          Final 1000 XP Proctored Assessment ({finalByUid[inspectedUser.uid].status.toUpperCase()}) ·{' '}
                          {finalByUid[inspectedUser.uid].totalXpAwarded}/1000 XP ({finalByUid[inspectedUser.uid].percentageScore}%)
                        </div>

                        {finalByUid[inspectedUser.uid].status === 'submitted' && (
                          <div className="flex items-center gap-2">
                            {resetConfirmUid === inspectedUser.uid ? (
                              <>
                                <button
                                  type="button"
                                  disabled={resetBusy}
                                  onClick={() => handleResetFinalAttempt(inspectedUser.uid)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold cursor-pointer"
                                >
                                  {resetBusy ? 'Resetting...' : 'Confirm Retake Reset'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setResetConfirmUid(null)}
                                  className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setResetConfirmUid(inspectedUser.uid)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700 text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Grant Final Retake (90:00)</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            Part A: {finalByUid[inspectedUser.uid].mcqScore}/400 · Part B: {finalByUid[inspectedUser.uid].caseScore}/500 · Part C: {finalByUid[inspectedUser.uid].scareScore}/100
                          </div>
                          <div className="text-slate-600 dark:text-slate-300">
                            Target Role: {finalByUid[inspectedUser.uid].targetRole || '—'} · College: {finalByUid[inspectedUser.uid].collegeOrOrg || '—'}
                          </div>
                          <div className="font-mono text-[11px] text-blue-700 dark:text-blue-400">
                            Cert: {finalByUid[inspectedUser.uid].finalCertificateId} · LOR: {finalByUid[inspectedUser.uid].lorVerificationId}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            Part C · SCARE Placement Defense
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 line-clamp-3">
                            {finalByUid[inspectedUser.uid].capstoneScare || 'Not submitted yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
