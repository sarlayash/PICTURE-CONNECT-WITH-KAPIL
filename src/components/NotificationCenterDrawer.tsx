import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  ArrowRight,
  Bell,
  BellOff,
  BellRing,
  CheckCheck,
  CheckCircle2,
  Clock,
  Mail,
  Sparkles,
  X,
} from 'lucide-react';
import {
  buildDailyMockLaunchEmail,
  buildDailyMockResultSummaryEmail,
  buildMissingSectionsReminderEmail,
} from '../services/gmailService';
import {
  formatDateKeyReadable,
  generateDailyMockPaper,
  getTodayDateKey,
  gradeDailyMockAttempt,
} from '../data/dailyMockData';
import {
  computeDailyMockStreak,
  DailyMockAttemptDoc,
  markDailyMockResultEmailed,
} from '../services/dailyMockFirestoreService';
import {
  ProfileReminderFrequency,
  updateUserProfile,
  UserProfileDoc,
} from '../services/firestoreService';
import {
  getBrowserNotificationPermission,
  LearnerNotificationDoc,
  logLearnerNotification,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationTargetView,
  requestBrowserPushPermission,
  SectionAuditReport,
  showBrowserPushNotification,
} from '../services/notificationService';
import { EmailCredentialRequest } from './EmailCredentialModal';

interface NotificationCenterDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User;
  profile: UserProfileDoc;
  audit: SectionAuditReport;
  notifications: LearnerNotificationDoc[];
  dailyMockAttempts?: DailyMockAttemptDoc[];
  onNavigateView: (target: NotificationTargetView, levelNum?: number) => void;
  onRequestEmail: (req: EmailCredentialRequest) => void;
}

const FREQ_LABELS: Record<ProfileReminderFrequency, string> = {
  daily: 'Daily',
  every_3_days: 'Every 3 Days',
  weekly: 'Weekly',
  off: 'Paused',
};

function formatTimeAgo(ms: number): string {
  if (!ms) return 'Just now';
  const diffMin = Math.max(0, Math.floor((Date.now() - ms) / 60000));
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  open,
  onClose,
  user,
  profile,
  audit,
  notifications,
  dailyMockAttempts = [],
  onNavigateView,
  onRequestEmail,
}) => {
  const [busyPush, setBusyPush] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tab, setTab] = useState<'missing' | 'history'>('missing');

  if (!open) return null;

  const perm = getBrowserNotificationPermission();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const todayDateKey = getTodayDateKey();
  const todayPaper = generateDailyMockPaper(todayDateKey);
  const todayMockAttempt = dailyMockAttempts.find(
    (a) => a.dateKey === todayDateKey
  );
  const dailyMockStreak = computeDailyMockStreak(
    dailyMockAttempts,
    todayDateKey
  );

  const handleTogglePush = async () => {
    setBusyPush(true);
    setFeedback(null);
    try {
      if (!profile.pushEnabled) {
        const result = await requestBrowserPushPermission();
        if (result === 'denied') {
          setFeedback(
            'Browser notifications are blocked in your browser site settings. In-app & email reminders still work automatically!'
          );
          await updateUserProfile(user, { pushEnabled: false });
          return;
        }
        await updateUserProfile(user, { pushEnabled: true });
        if (result === 'granted') {
          const nextItem = audit.missingOrIncompleteItems[0];
          await showBrowserPushNotification({
            title: 'Push Reminders Enabled · EMPLOYABILITY UNIVERSE',
            body: nextItem
              ? `Next up: ${nextItem.title} (${audit.overallCompletionPct}% overall complete).`
              : 'All sections mastered! Ready to email your badges, certificates & LOR.',
            targetView: nextItem?.targetView || 'achievements',
            tag: 'euwk-push-enabled',
          });
          setFeedback('Push notifications enabled! Sent a live confirmation alert.');
        } else {
          setFeedback(
            'In-app smart reminders enabled (browser push is restricted in this preview frame).'
          );
        }
      } else {
        await updateUserProfile(user, { pushEnabled: false });
        setFeedback('Push notifications paused. You can re-enable anytime.');
      }
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'Unable to update push setting.'
      );
    } finally {
      setBusyPush(false);
    }
  };

  const handleSendTestPush = async () => {
    setBusyPush(true);
    setFeedback(null);
    try {
      const nextItem = audit.missingOrIncompleteItems[0];
      const title = nextItem
        ? `Reminder: ${audit.missingOrIncompleteItems.length} section${
            audit.missingOrIncompleteItems.length > 1 ? 's' : ''
          } remaining`
        : '100% Universe Mastery Achieved!';
      const body = nextItem
        ? `${nextItem.title}: ${nextItem.actionHint}`
        : 'All 8 modules complete! Download or email your credentials anytime.';

      if (perm !== 'granted') {
        await requestBrowserPushPermission();
      }
      const delivery = await showBrowserPushNotification({
        title,
        body,
        targetView: nextItem?.targetView || 'achievements',
        tag: `euwk-test-${Date.now()}`,
      });
      await logLearnerNotification({
        user,
        kind: nextItem ? 'missing_reminder' : 'section_completed',
        title,
        body,
        targetView: nextItem?.targetView || 'achievements',
        credentialType: 'reminder_digest',
        channel: delivery.delivered ? 'push' : 'in_app',
        sentBy: 'learner',
      });
      await updateUserProfile(user, { lastReminderAtMs: Date.now() });
      setFeedback(
        delivery.delivered
          ? 'Live browser push reminder delivered & logged!'
          : 'Reminder logged in your Notification Center (enable browser permission outside iframe for OS popups).'
      );
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'Could not trigger reminder.'
      );
    } finally {
      setBusyPush(false);
    }
  };

  const handleFrequencyChange = async (freq: ProfileReminderFrequency) => {
    try {
      await updateUserProfile(user, { reminderFrequency: freq });
      setFeedback(`Reminder schedule updated to ${FREQ_LABELS[freq]}.`);
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'Could not update schedule.'
      );
    }
  };

  const handleEmailChecklist = () => {
    const recipientEmail = user.email || profile.email;
    if (!recipientEmail) return;
    const digest = buildMissingSectionsReminderEmail({
      learnerName: profile.displayName || user.displayName || 'Verified Learner',
      learnerEmail: recipientEmail,
      overallCompletionPct: audit.overallCompletionPct,
      completedSections: audit.completedItems.map((i) => ({
        title: i.title,
        detail: i.currentLabel,
      })),
      missingSections: audit.missingOrIncompleteItems.map((i) => ({
        title: i.title,
        detail: i.currentLabel,
        actionHint: i.actionHint,
      })),
    });
    onRequestEmail({
      recipientEmail,
      recipientName: profile.displayName || user.displayName || 'Verified Learner',
      credentialType: 'reminder_digest',
      title: 'Missing Sections & Completion Reminder Digest',
      subject: digest.subject,
      htmlBody: digest.htmlBody,
      textFallback: digest.textFallback,
      targetView: audit.missingOrIncompleteItems[0]?.targetView || 'journey',
    });
  };

  const handleEmailDailyMockAction = () => {
    const recipientEmail = user.email || profile.email;
    if (!recipientEmail) return;
    const learnerName =
      profile.displayName || user.displayName || 'Verified Learner';

    if (todayMockAttempt && todayMockAttempt.status === 'submitted') {
      const graded = gradeDailyMockAttempt(todayPaper, todayMockAttempt.answers);
      const standardTotal = Math.max(
        1,
        todayMockAttempt.totalQuestions - todayMockAttempt.hardQuestionCount
      );
      const emailDoc = buildDailyMockResultSummaryEmail({
        learnerName,
        learnerEmail: recipientEmail,
        displayDate: todayPaper.displayDate,
        paperCode: todayPaper.paperCode,
        correctCount: todayMockAttempt.correctCount,
        totalQuestions: todayMockAttempt.totalQuestions,
        scorePercent: todayMockAttempt.scorePercent,
        hardCorrectCount: todayMockAttempt.hardCorrectCount,
        hardTotal: todayMockAttempt.hardQuestionCount,
        hardAccuracyPercent: todayMockAttempt.hardAccuracyPercent,
        standardCorrectCount: todayMockAttempt.standardCorrectCount,
        standardTotal,
        timeUsedSeconds: todayMockAttempt.timeUsedSeconds,
        gradeLabel: todayMockAttempt.gradeLabel || graded.gradeLabel,
        passed: todayMockAttempt.passed,
        xpAwarded: todayMockAttempt.xpAwarded,
        streakDays: dailyMockStreak,
        strongestTopic: todayMockAttempt.strongestTopic || graded.strongestTopic,
        weakestTopic: todayMockAttempt.weakestTopic || graded.weakestTopic,
        mentorAdvice: graded.mentorAdvice,
        pillarRows: graded.pillarScores.map((p) => ({
          pillarTitle: p.pillarTitle,
          correct: p.correct,
          total: p.total,
          hardCorrect: p.hardCorrect,
          hardTotal: p.hardTotal,
          percent: p.percent,
        })),
      });
      onRequestEmail({
        recipientEmail,
        recipientName: learnerName,
        credentialType: 'daily_mock_summary',
        title: `Daily Mock Results Summary (${todayPaper.displayDate})`,
        subject: emailDoc.subject,
        htmlBody: emailDoc.htmlBody,
        textFallback: emailDoc.textFallback,
        targetView: 'daily_mock',
        onAfterSent: async () => {
          await markDailyMockResultEmailed(todayMockAttempt.id);
        },
      });
      return;
    }

    const invite = buildDailyMockLaunchEmail({
      learnerName,
      learnerEmail: recipientEmail,
      dateKey: todayDateKey,
      displayDate: formatDateKeyReadable(todayDateKey),
      paperCode: todayPaper.paperCode,
      streakDays: dailyMockStreak,
    });
    onRequestEmail({
      recipientEmail,
      recipientName: learnerName,
      credentialType: 'daily_mock_invite',
      title: `Daily 60-Min Mock Reminder (${todayPaper.paperCode})`,
      subject: invite.subject,
      htmlBody: invite.htmlBody,
      textFallback: invite.textFallback,
      targetView: 'daily_mock',
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                  Reminders &amp; Push Alerts
                </h2>
                <p className="text-[11px] font-mono text-slate-500">
                  {audit.completedCount}/{audit.totalCount} Sections Done ·{' '}
                  {audit.overallCompletionPct}% Mastery
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close reminders drawer"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Push Controls Bar */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                {profile.pushEnabled ? (
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Push Notifications</span>
              </div>
              <button
                type="button"
                disabled={busyPush}
                onClick={handleTogglePush}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                  profile.pushEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                {profile.pushEnabled ? 'Enabled (Pause)' : 'Enable Push'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Cadence:
              </span>
              <div className="flex items-center gap-1">
                {(['daily', 'every_3_days', 'weekly', 'off'] as const).map(
                  (freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => handleFrequencyChange(freq)}
                      className={`px-2 py-0.5 rounded-md font-medium cursor-pointer ${
                        profile.reminderFrequency === freq
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {FREQ_LABELS[freq]}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                disabled={busyPush}
                onClick={handleSendTestPush}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-600" />
                <span>Send Push Now</span>
              </button>
              <button
                type="button"
                onClick={handleEmailChecklist}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-semibold cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Checklist</span>
              </button>
            </div>
          </div>

          {feedback && (
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-200">
              {feedback}
            </div>
          )}

          {/* Sub-tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTab('missing')}
              className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                tab === 'missing'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Missing Sections ({audit.missingOrIncompleteItems.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                tab === 'history'
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Activity &amp; Alerts {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {/* Today's 60-Min Daily Mock Test Quick Card */}
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/25 p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Daily 60-Min Mock · {todayPaper.paperCode}
                </div>
                <div className="text-xs font-bold text-slate-950 dark:text-white mt-0.5">
                  {todayMockAttempt?.status === 'submitted'
                    ? `Completed Today: ${todayMockAttempt.scorePercent}% (${todayMockAttempt.correctCount}/${todayMockAttempt.totalQuestions})`
                    : todayMockAttempt?.status === 'in_progress'
                    ? `In Progress · ${todayMockAttempt.answers.filter((v) => v >= 0).length}/40 Answered`
                    : 'Today’s 40-MCQ Paper Pending (50% Hard)'}
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5 tabular-nums">
                  {todayMockAttempt?.status === 'submitted'
                    ? `Hard 50%: ${todayMockAttempt.hardAccuracyPercent}% · Streak: ${dailyMockStreak}d`
                    : `All 7 Topics · 20 Hard + 20 Standard · Streak: ${dailyMockStreak}d`}
                </div>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  todayMockAttempt?.status === 'submitted'
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                }`}
              >
                {todayMockAttempt?.status === 'submitted' ? 'DONE' : '60m LIVE'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onNavigateView('daily_mock');
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-semibold cursor-pointer"
              >
                <span>
                  {todayMockAttempt?.status === 'submitted'
                    ? 'View Daily Results'
                    : todayMockAttempt?.status === 'in_progress'
                    ? 'Resume 60m Mock'
                    : 'Take Daily Mock'}
                </span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleEmailDailyMockAction}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-semibold text-rose-800 dark:text-rose-300 cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span>
                  {todayMockAttempt?.status === 'submitted'
                    ? 'Email Summary'
                    : 'Email Reminder'}
                </span>
              </button>
            </div>
          </div>

          {tab === 'missing' ? (
            <>
              {audit.missingOrIncompleteItems.length === 0 ? (
                <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="font-display font-bold text-slate-950 dark:text-white">
                    100% Complete — Zero Missing Sections!
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Visit My Profile or Credentials to email all your earned badges, certificates, and Placement LOR to your sign-up Gmail.
                  </p>
                </div>
              ) : (
                audit.missingOrIncompleteItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-950 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {item.currentLabel}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'missing'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        {item.percent}%
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                        style={{ width: `${Math.max(4, item.percent)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {item.actionHint}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigateView(item.targetView, item.nextLevelNum);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <span>Jump to Section</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}

              {audit.completedItems.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Completed Sections ({audit.completedItems.length})
                  </div>
                  {audit.completedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs"
                    >
                      <span className="flex items-center gap-2 font-medium text-emerald-900 dark:text-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item.title}</span>
                      </span>
                      <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        100%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {unreadCount > 0 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead(notifications)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                </div>
              )}

              {notifications.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  No alerts or email dispatches yet. Enable push notifications or email a badge/certificate to see live activity here.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.read) markNotificationRead(n.id);
                    }}
                    className={`rounded-xl border p-3.5 space-y-1.5 cursor-pointer transition-colors ${
                      n.read
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50'
                        : 'border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase">
                      <span
                        className={`font-bold ${
                          n.kind === 'credential_emailed'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : n.kind === 'daily_mock_launch'
                            ? 'text-rose-700 dark:text-rose-400'
                            : n.kind === 'daily_mock_result'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : n.kind === 'admin_reminder'
                            ? 'text-violet-700 dark:text-violet-400'
                            : n.kind === 'section_completed'
                            ? 'text-blue-700 dark:text-blue-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {n.kind.replace(/_/g, ' ')} · {n.channel.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-500">
                        {formatTimeAgo(n.createdAtMs)}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-950 dark:text-white">
                      {n.title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {n.body}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!n.read) markNotificationRead(n.id);
                        onNavigateView(n.targetView);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer pt-1"
                    >
                      <span>Open Section</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
