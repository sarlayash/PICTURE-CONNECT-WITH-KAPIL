import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Flag,
  Flame,
  Layers,
  Mail,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  DAILY_MOCK_CONFIG,
  DAILY_MOCK_PILLARS,
  formatDateKeyReadable,
  generateDailyMockPaper,
  getTodayDateKey,
  gradeDailyMockAttempt,
  NOV_23_DATE_KEY,
} from '../data/dailyMockData';
import {
  computeDailyMockStreak,
  DailyMockAttemptDoc,
  markDailyMockResultEmailed,
  saveDailyMockProgress,
  startOrResumeDailyMock,
  submitDailyMockAttempt,
} from '../services/dailyMockFirestoreService';
import {
  buildDailyMockLaunchEmail,
  buildDailyMockResultSummaryEmail,
} from '../services/gmailService';
import {
  logLearnerNotification,
  showBrowserPushNotification,
} from '../services/notificationService';
import { EmailCredentialRequest } from './EmailCredentialModal';

interface DailyMockStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  pushEnabled: boolean;
  attempts: DailyMockAttemptDoc[];
  initialDateKey?: string;
  onRequestEmail: (req: EmailCredentialRequest) => void;
  onOpenRemindersDrawer: () => void;
}

type PaletteFilter = 'all' | 'hard' | 'unanswered' | 'flagged';
type ReviewFilter = 'all' | 'incorrect' | 'hard';

function formatCountdown(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const DailyMockStudio: React.FC<DailyMockStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  pushEnabled,
  attempts,
  initialDateKey,
  onRequestEmail,
  onOpenRemindersDrawer,
}) => {
  const localTodayKey = useMemo(() => getTodayDateKey(), []);
  const defaultExamDateKey = useMemo(() => {
    if (initialDateKey) return initialDateKey;
    return localTodayKey <= NOV_23_DATE_KEY ? NOV_23_DATE_KEY : localTodayKey;
  }, [initialDateKey, localTodayKey]);

  const [activeExamDateKey, setActiveExamDateKey] = useState<string>(defaultExamDateKey);
  const todayKey = activeExamDateKey;
  const todayPaper = useMemo(() => generateDailyMockPaper(todayKey), [todayKey]);

  const todayAttempt = useMemo(
    () => attempts.find((a) => a.dateKey === todayKey) || null,
    [attempts, todayKey]
  );

  const streakReferenceDate = useMemo(() => {
    const nov23Done = attempts.some(
      (a) => a.dateKey === NOV_23_DATE_KEY && a.status === 'submitted'
    );
    return nov23Done && localTodayKey < NOV_23_DATE_KEY
      ? NOV_23_DATE_KEY
      : localTodayKey;
  }, [attempts, localTodayKey]);

  const streakDays = useMemo(
    () => computeDailyMockStreak(attempts, streakReferenceDate),
    [attempts, streakReferenceDate]
  );

  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(defaultExamDateKey);
  const inspectedAttempt = useMemo(
    () => attempts.find((a) => a.dateKey === selectedHistoryDate) || todayAttempt,
    [attempts, selectedHistoryDate, todayAttempt]
  );
  const inspectedPaper = useMemo(
    () =>
      inspectedAttempt
        ? generateDailyMockPaper(inspectedAttempt.dateKey)
        : todayPaper,
    [inspectedAttempt, todayPaper]
  );

  // Active exam state
  const [examStarted, setExamStarted] = useState(false);
  const [startingBusy, setStartingBusy] = useState(false);
  const [submittingBusy, setSubmittingBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array.from({ length: DAILY_MOCK_CONFIG.totalQuestions }, () => -1)
  );
  const [flagged, setFlagged] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paletteFilter, setPaletteFilter] = useState<PaletteFilter>('all');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [remainingSeconds, setRemainingSeconds] = useState(
    DAILY_MOCK_CONFIG.durationSeconds
  );
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [justSubmittedPrompt, setJustSubmittedPrompt] = useState(false);

  const autoSubmittedRef = useRef(false);
  const finalizeSubmitRef = useRef<(autoExpired?: boolean) => Promise<void>>(
    async () => {}
  );
  const answersRef = useRef(answers);
  const flaggedRef = useRef(flagged);
  answersRef.current = answers;
  flaggedRef.current = flagged;

  useEffect(() => {
    if (initialDateKey && !examStarted) {
      setActiveExamDateKey(initialDateKey);
      setSelectedHistoryDate(initialDateKey);
    }
  }, [initialDateKey, examStarted]);

  // Hydrate live in-progress attempt when Firestore updates or reloads
  useEffect(() => {
    if (todayAttempt?.status === 'in_progress') {
      answersRef.current = todayAttempt.answers;
      flaggedRef.current = todayAttempt.flaggedIndices;
      setAnswers(todayAttempt.answers);
      setFlagged(todayAttempt.flaggedIndices);
      const elapsedSec = Math.max(
        0,
        todayAttempt.timeUsedSeconds,
        Math.floor((Date.now() - todayAttempt.startedAtMs) / 1000)
      );
      setRemainingSeconds(
        Math.max(0, DAILY_MOCK_CONFIG.durationSeconds - elapsedSec)
      );
      setExamStarted(true);
    } else if (todayAttempt?.status === 'submitted') {
      setExamStarted(false);
    } else {
      setExamStarted(false);
    }
  }, [todayAttempt?.id, todayAttempt?.status]);

  // 1-second live exam countdown + automatic submission at 00:00
  useEffect(() => {
    if (!examStarted || todayAttempt?.status !== 'in_progress') return;
    const timer = window.setInterval(() => {
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - todayAttempt.startedAtMs) / 1000)
      );
      const left = Math.max(0, DAILY_MOCK_CONFIG.durationSeconds - elapsed);
      setRemainingSeconds(left);
      if (left <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        void finalizeSubmitRef.current(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [examStarted, todayAttempt?.id, todayAttempt?.status, todayAttempt?.startedAtMs]);

  // Periodic background checkpoint save every 25s
  useEffect(() => {
    if (!examStarted || !todayAttempt || todayAttempt.status !== 'in_progress') {
      return;
    }
    const interval = window.setInterval(() => {
      const elapsed = Math.min(
        DAILY_MOCK_CONFIG.durationSeconds,
        Math.max(0, Math.floor((Date.now() - todayAttempt.startedAtMs) / 1000))
      );
      void saveDailyMockProgress(
        todayAttempt.id,
        answersRef.current,
        flaggedRef.current,
        elapsed
      ).catch(() => {
        // Silent background save retry on next interaction
      });
    }, 25000);
    return () => window.clearInterval(interval);
  }, [examStarted, todayAttempt?.id, todayAttempt?.status, todayAttempt?.startedAtMs]);

  const handleStartOrResume = async () => {
    setStartingBusy(true);
    setActionError(null);
    autoSubmittedRef.current = false;
    try {
      const docAttempt = await startOrResumeDailyMock(
        user,
        learnerName,
        todayPaper
      );
      answersRef.current = docAttempt.answers;
      flaggedRef.current = docAttempt.flaggedIndices;
      setAnswers(docAttempt.answers);
      setFlagged(docAttempt.flaggedIndices);
      const elapsed = Math.max(
        0,
        docAttempt.timeUsedSeconds,
        Math.floor((Date.now() - docAttempt.startedAtMs) / 1000)
      );
      setRemainingSeconds(
        Math.max(0, DAILY_MOCK_CONFIG.durationSeconds - elapsed)
      );
      setCurrentIdx(0);
      setSelectedHistoryDate(todayKey);
      if (docAttempt.status === 'in_progress') {
        setExamStarted(true);
      }
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Could not launch today’s Daily Mock Test. Please retry.'
      );
    } finally {
      setStartingBusy(false);
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    if (!todayAttempt || todayAttempt.status !== 'in_progress') return;
    const next = [...answers];
    next[currentIdx] = optionIdx;
    answersRef.current = next;
    setAnswers(next);
    const elapsed = Math.min(
      DAILY_MOCK_CONFIG.durationSeconds,
      Math.max(0, Math.floor((Date.now() - todayAttempt.startedAtMs) / 1000))
    );
    void saveDailyMockProgress(todayAttempt.id, next, flagged, elapsed).catch(
      () => {
        // Persisted on next click or submit
      }
    );
  };

  const handleToggleFlag = (idx: number) => {
    if (!todayAttempt || todayAttempt.status !== 'in_progress') return;
    const exists = flagged.includes(idx);
    const nextFlagged = exists
      ? flagged.filter((v) => v !== idx)
      : [...flagged, idx];
    flaggedRef.current = nextFlagged;
    setFlagged(nextFlagged);
    const elapsed = Math.min(
      DAILY_MOCK_CONFIG.durationSeconds,
      Math.max(0, Math.floor((Date.now() - todayAttempt.startedAtMs) / 1000))
    );
    void saveDailyMockProgress(
      todayAttempt.id,
      answers,
      nextFlagged,
      elapsed
    ).catch(() => {});
  };

  const triggerEmailSummaryForAttempt = (attemptDoc: DailyMockAttemptDoc) => {
    const paper = generateDailyMockPaper(attemptDoc.dateKey);
    const grade = gradeDailyMockAttempt(paper, attemptDoc.answers);
    const emailContent = buildDailyMockResultSummaryEmail({
      learnerName,
      learnerEmail,
      displayDate: paper.displayDate,
      paperCode: paper.paperCode,
      correctCount: grade.correctCount,
      totalQuestions: grade.totalQuestions,
      scorePercent: grade.scorePercent,
      hardCorrectCount: grade.hardCorrectCount,
      hardTotal: grade.hardQuestionCount,
      hardAccuracyPercent: grade.hardAccuracyPercent,
      standardCorrectCount: grade.standardCorrectCount,
      standardTotal: grade.totalQuestions - grade.hardQuestionCount,
      timeUsedSeconds: attemptDoc.timeUsedSeconds,
      gradeLabel: grade.gradeLabel,
      passed: grade.passed,
      xpAwarded: grade.xpAwarded,
      streakDays: Math.max(1, streakDays),
      strongestTopic: grade.strongestTopic,
      weakestTopic: grade.weakestTopic,
      mentorAdvice: grade.mentorAdvice,
      pillarRows: grade.pillarScores.map((p) => ({
        pillarTitle: p.pillarTitle,
        correct: p.correct,
        total: p.total,
        hardCorrect: p.hardCorrect,
        hardTotal: p.hardTotal,
        percent: p.percent,
      })),
    });

    onRequestEmail({
      recipientEmail: learnerEmail,
      recipientName: learnerName,
      credentialType: 'daily_mock_summary',
      title: `Daily Mock Results Summary (${paper.displayDate})`,
      subject: emailContent.subject,
      htmlBody: emailContent.htmlBody,
      textFallback: emailContent.textFallback,
      targetView: 'daily_mock',
      onAfterSent: async () => {
        if (!attemptDoc.resultEmailed) {
          await markDailyMockResultEmailed(attemptDoc.id);
        }
        setJustSubmittedPrompt(false);
      },
    });
  };

  const triggerEmailTodayInvite = () => {
    const invite = buildDailyMockLaunchEmail({
      learnerName,
      learnerEmail,
      dateKey: todayPaper.dateKey,
      displayDate: todayPaper.displayDate,
      paperCode: todayPaper.paperCode,
      streakDays,
    });
    onRequestEmail({
      recipientEmail: learnerEmail,
      recipientName: learnerName,
      credentialType: 'daily_mock_invite',
      title: `Daily 60-Min Mock Reminder (${todayPaper.displayDate})`,
      subject: invite.subject,
      htmlBody: invite.htmlBody,
      textFallback: invite.textFallback,
      targetView: 'daily_mock',
    });
  };

  const handleFinalizeSubmit = async (autoExpired = false) => {
    if (!todayAttempt || todayAttempt.status !== 'in_progress') return;
    setSubmittingBusy(true);
    setConfirmSubmitOpen(false);
    setActionError(null);
    try {
      const elapsed = autoExpired
        ? DAILY_MOCK_CONFIG.durationSeconds
        : Math.min(
            DAILY_MOCK_CONFIG.durationSeconds,
            Math.max(1, Math.floor((Date.now() - todayAttempt.startedAtMs) / 1000))
          );

      const { grade } = await submitDailyMockAttempt({
        attemptId: todayAttempt.id,
        authorName: learnerName,
        paper: todayPaper,
        answers: answersRef.current,
        flaggedIndices: flaggedRef.current,
        timeUsedSeconds: elapsed,
      });

      setExamStarted(false);
      setSelectedHistoryDate(todayKey);
      setJustSubmittedPrompt(true);

      // Post-submission alerts run in an isolated block so a notification/push warning
      // never reports a false submission failure after Firestore has already graded & locked the exam.
      const notifTitle = `Daily Mock Result: ${grade.scorePercent}% (${grade.correctCount}/${grade.totalQuestions}) · ${grade.gradeLabel}`;
      const notifBody = `Paper ${todayPaper.paperCode}: Hard MCQs ${grade.hardCorrectCount}/${grade.hardQuestionCount} (${grade.hardAccuracyPercent}%), +${grade.xpAwarded} XP. Strongest: ${grade.strongestTopic} · Focus: ${grade.weakestTopic}.`;

      try {
        let deliveredPush = false;
        if (pushEnabled) {
          const delivery = await showBrowserPushNotification({
            title: notifTitle,
            body: notifBody,
            targetView: 'daily_mock',
            tag: `euwk-daily-mock-result-${todayKey}`,
          });
          deliveredPush = delivery.delivered;
        }

        await logLearnerNotification({
          user,
          kind: 'daily_mock_result',
          title: notifTitle,
          body: notifBody,
          targetView: 'daily_mock',
          credentialType: 'daily_mock_summary',
          channel: deliveredPush ? 'push' : 'in_app',
          sentBy: 'system',
        });
      } catch (notifErr) {
        console.warn('Daily Mock post-submit notification warning:', notifErr);
      }
    } catch (err) {
      autoSubmittedRef.current = false;
      setActionError(
        err instanceof Error
          ? err.message
          : 'Submission failed. Please retry — your answers are preserved.'
      );
    } finally {
      setSubmittingBusy(false);
    }
  };
  finalizeSubmitRef.current = handleFinalizeSubmit;

  const handleDownloadSummaryTxt = (attemptDoc: DailyMockAttemptDoc) => {
    const paper = generateDailyMockPaper(attemptDoc.dateKey);
    const grade = gradeDailyMockAttempt(paper, attemptDoc.answers);
    const lines = [
      'EMPLOYABILITY UNIVERSE WITH KAPIL — DAILY 60-MIN MOCK TEST REPORT',
      `Learner: ${learnerName} (${learnerEmail})`,
      `Date: ${paper.displayDate} | Paper Code: ${paper.paperCode}`,
      `Overall Score: ${grade.correctCount}/${grade.totalQuestions} (${grade.scorePercent}%) — ${grade.gradeLabel}`,
      `Hard MCQs (50% Pool): ${grade.hardCorrectCount}/${grade.hardQuestionCount} (${grade.hardAccuracyPercent}%)`,
      `Standard MCQs (50% Pool): ${grade.standardCorrectCount}/${grade.totalQuestions - grade.hardQuestionCount} (${grade.standardAccuracyPercent}%)`,
      `Time Used: ${formatCountdown(attemptDoc.timeUsedSeconds)} / 60:00 | XP Earned: +${grade.xpAwarded} XP`,
      `Strongest Topic: ${grade.strongestTopic} | Priority Focus: ${grade.weakestTopic}`,
      '',
      '7-PILLAR TOPIC MASTERY:',
      ...grade.pillarScores.map(
        (p) =>
          `- ${p.pillarTitle}: ${p.correct}/${p.total} (${p.percent}%) | Hard ${p.hardCorrect}/${p.hardTotal}`
      ),
      '',
      `Mentor Kapil's Advice: ${grade.mentorAdvice}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daily_Mock_Report_${paper.dateKey}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const answeredCountLive = useMemo(
    () => answers.filter((v) => v >= 0).length,
    [answers]
  );

  const submittedAttempts = useMemo(
    () => attempts.filter((a) => a.status === 'submitted'),
    [attempts]
  );
  const lifetimeAvgPct = useMemo(() => {
    if (submittedAttempts.length === 0) return 0;
    return Math.round(
      submittedAttempts.reduce((s, a) => s + a.scorePercent, 0) /
        submittedAttempts.length
    );
  }, [submittedAttempts]);

  const editionOptions = useMemo(() => {
    const keys = Array.from(new Set([NOV_23_DATE_KEY, localTodayKey])).sort((a, b) =>
      b.localeCompare(a)
    );
    return keys.map((dk) => {
      const paper = generateDailyMockPaper(dk);
      const attempt = attempts.find((a) => a.dateKey === dk);
      return { dateKey: dk, paper, attempt };
    });
  }, [localTodayKey, attempts]);

  // =========================================================================
  // VIEW 1: LIVE 60-MINUTE PROCTORED EXAM ROOM
  // =========================================================================
  if (examStarted && todayAttempt?.status === 'in_progress') {
    const activeQ = todayPaper.questions[currentIdx];
    const isUrgent = remainingSeconds <= 180;
    const isWarning = remainingSeconds <= 600 && !isUrgent;

    const filteredIndices = todayPaper.questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q, idx }) => {
        if (paletteFilter === 'hard') return q.difficulty === 'Hard';
        if (paletteFilter === 'unanswered') return answers[idx] < 0;
        if (paletteFilter === 'flagged') return flagged.includes(idx);
        return true;
      });

    return (
      <div className="space-y-6">
        {/* Sticky Exam Control Bar */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Daily 60-Min Mock</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-mono">{todayPaper.paperCode}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{todayPaper.displayDate}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
              Question {currentIdx + 1} of {todayPaper.totalQuestions}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Answered
              </div>
              <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {answeredCountLive}/{todayPaper.totalQuestions}
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-mono tabular-nums font-bold text-sm ${
                isUrgent
                  ? 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  : isWarning
                  ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
              }`}
              aria-live="polite"
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatCountdown(remainingSeconds)}</span>
            </div>

            <button
              type="button"
              disabled={submittingBusy}
              onClick={() => setConfirmSubmitOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingBusy ? 'Grading...' : 'Submit Mock'}</span>
            </button>
          </div>
        </div>

        {actionError && (
          <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Two-Column Exam Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Stage (Left 8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {activeQ.pillarTitle}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeQ.topic}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    activeQ.difficulty === 'Hard'
                      ? 'text-rose-700 dark:text-rose-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {activeQ.difficulty === 'Hard' ? (
                    <Flame className="w-3.5 h-3.5" />
                  ) : (
                    <Layers className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {activeQ.difficulty === 'Hard'
                      ? 'Hard MCQ (50% Pool)'
                      : 'Standard MCQ (50% Pool)'}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleFlag(currentIdx)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  flagged.includes(currentIdx)
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {flagged.includes(currentIdx) ? 'Flagged' : 'Flag for Review'}
                </span>
              </button>
            </div>

            <div className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white leading-relaxed">
              <span className="font-mono text-slate-400 dark:text-slate-500 mr-2">
                Q{String(currentIdx + 1).padStart(2, '0')}.
              </span>
              {activeQ.question}
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Answer options">
              {activeQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentIdx] === oIdx;
                const letter = ['A', 'B', 'C', 'D'][oIdx];
                return (
                  <button
                    key={oIdx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-950 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-[15px] leading-relaxed pt-0.5">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Answers auto-save to Firestore
              </div>

              {currentIdx < todayPaper.totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx((i) =>
                      Math.min(todayPaper.totalQuestions - 1, i + 1)
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmSubmitOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Review &amp; Submit</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator Palette (Right 4 cols) */}
          <aside className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                Question Palette
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {todayPaper.hardCount} Hard · {todayPaper.standardCount} Std
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'hard', label: 'Hard 20' },
                  { id: 'unanswered', label: 'Unanswered' },
                  { id: 'flagged', label: `Flagged (${flagged.length})` },
                ] as { id: PaletteFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPaletteFilter(tab.id)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    paletteFilter === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2">
              {filteredIndices.map(({ q, idx }) => {
                const isCurr = idx === currentIdx;
                const isAns = answers[idx] >= 0;
                const isFlag = flagged.includes(idx);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    title={`Q${idx + 1} · ${q.difficulty} · ${q.pillarTitle}`}
                    className={`relative h-10 rounded-lg border font-mono tabular-nums text-xs font-bold transition-colors cursor-pointer ${
                      isCurr
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : isFlag
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                        : isAns
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {idx + 1}
                    {q.difficulty === 'Hard' && (
                      <span
                        className={`block text-[9px] leading-none font-sans font-semibold ${
                          isCurr ? 'text-rose-200' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        H
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div>
                <strong className="text-rose-600 dark:text-rose-400">H</strong> = Hard MCQ (50% of exam) ·{' '}
                <strong className="text-emerald-700 dark:text-emerald-400">Green</strong> = Answered ·{' '}
                <strong className="text-amber-700 dark:text-amber-400">Amber</strong> = Flagged
              </div>
              <div>
                Remaining unanswered:{' '}
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {todayPaper.totalQuestions - answeredCountLive}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Confirm Final Submission Modal (never window.confirm) */}
        {confirmSubmitOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm Daily Mock Submission"
          >
            <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                Submit Today’s 60-Min Mock Test?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                You have answered{' '}
                <strong className="font-mono text-slate-950 dark:text-white">
                  {answeredCountLive} of {todayPaper.totalQuestions}
                </strong>{' '}
                questions with{' '}
                <strong className="font-mono text-slate-950 dark:text-white">
                  {formatCountdown(remainingSeconds)}
                </strong>{' '}
                remaining. Once submitted, your daily scorecard locks, a portal notification is generated, and you can email the full Daily Results Summary to{' '}
                <strong className="text-slate-950 dark:text-white">{learnerEmail}</strong>.
              </p>
              {answeredCountLive < todayPaper.totalQuestions && (
                <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300">
                  {todayPaper.totalQuestions - answeredCountLive} question(s) are still unanswered.
                </div>
              )}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmSubmitOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Continue Exam
                </button>
                <button
                  type="button"
                  disabled={submittingBusy}
                  onClick={() => void handleFinalizeSubmit(false)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {submittingBusy ? 'Grading...' : 'Confirm & Grade Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOBBY + DAILY RESULTS SUMMARY + HISTORY
  // =========================================================================
  const inspectedGrade =
    inspectedAttempt?.status === 'submitted'
      ? gradeDailyMockAttempt(inspectedPaper, inspectedAttempt.answers)
      : null;

  const filteredReviewQuestions = inspectedPaper.questions
    .map((q, idx) => ({ q, idx, userChoice: inspectedAttempt?.answers[idx] ?? -1 }))
    .filter(({ q, userChoice }) => {
      if (reviewFilter === 'incorrect') return userChoice !== q.correctIndex;
      if (reviewFilter === 'hard') return q.difficulty === 'Hard';
      return true;
    });

  return (
    <div className="space-y-8">
      {/* Assessment Edition Switcher (Always surfaces Nov 23, 2026 Special Assessment + Today) */}
      {editionOptions.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Select Assessment Edition:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {editionOptions.map(({ dateKey: dk, paper, attempt }) => {
              const selected = activeExamDateKey === dk;
              const done = attempt?.status === 'submitted';
              return (
                <button
                  key={dk}
                  type="button"
                  onClick={() => {
                    setActiveExamDateKey(dk);
                    setSelectedHistoryDate(dk);
                    setJustSubmittedPrompt(false);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selected
                      ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                      : done
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 opacity-75 hover:opacity-100'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-slate-400'
                  }`}
                >
                  {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  <span className={done && !selected ? 'line-through decoration-slate-400/70' : ''}>
                    {paper.isSpecialEdition
                      ? `Nov 23, 2026 Special (${paper.paperCode})`
                      : `${paper.displayDate} (${paper.paperCode})`}
                  </span>
                  <span className="font-mono text-[10px] opacity-85">
                    {done ? `· ${attempt.scorePercent}% Done` : '· 40 Fresh MCQs'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hero Briefing Card */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-indigo-600 to-amber-500" />
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-rose-700 dark:text-rose-400">
                {todayPaper.isSpecialEdition
                  ? todayPaper.editionTitle
                  : 'Daily 60-Minute Mock Test'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{todayPaper.displayDate}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{todayPaper.paperCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-2xl">
              {todayPaper.isSpecialEdition
                ? 'Nov 23, 2026 Placement Sprint Assessment (40 Brand-New MCQs)'
                : 'Master Every Placement Pillar with Today’s 50% Hard Timed Mock'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              A standardized 60-minute exam covering all 7 Employability Universe pillars—Aptitude, Grammar/Verbal, C/C++/Java/Python/DSA, Excel/Power BI/DBMS/Cloud, Indianism/Interview/GD, Shopping/Negotiation, and Picture Connect/AI—with strictly 20 Hard MCQs (50%) and 20 Standard MCQs (50%). Portal alerts notify you daily, and your graded results summary can be delivered straight to{' '}
              <strong className="text-slate-900 dark:text-white">{learnerEmail}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {todayAttempt?.status === 'submitted' ? (
                <button
                  type="button"
                  onClick={() => triggerEmailSummaryForAttempt(todayAttempt)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {todayAttempt.resultEmailed
                      ? 'Resend Today’s Results Email'
                      : 'Email Today’s Results Summary'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={startingBusy}
                  onClick={() => void handleStartOrResume()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                >
                  <Play className="w-4 h-4" />
                  <span>
                    {startingBusy
                      ? 'Preparing Today’s Paper...'
                      : todayAttempt?.status === 'in_progress'
                      ? 'Resume Today’s 60-Min Mock'
                      : 'Start Today’s 60-Min Mock'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={triggerEmailTodayInvite}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Email Today’s Mock Reminder</span>
              </button>

              <button
                type="button"
                onClick={onOpenRemindersDrawer}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Notification Settings</span>
              </button>
            </div>
          </div>

          {/* Right KPI Stack */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-5 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Exam Format
              </div>
              <div className="text-lg font-extrabold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                60m · 40 Qs
              </div>
              <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                20 Hard (50%)
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Daily Streak
              </div>
              <div className="text-lg font-extrabold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {submittedAttempts.length} completed
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Lifetime Avg
              </div>
              <div className="text-lg font-extrabold font-mono tabular-nums text-slate-950 dark:text-white mt-0.5">
                {submittedAttempts.length > 0 ? `${lifetimeAvgPct}%` : '—'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Pass target 60%
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Today’s Status
              </div>
              <div className="text-sm font-bold mt-1 flex items-center gap-1.5">
                {todayAttempt?.status === 'submitted' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                      {todayAttempt.scorePercent}% Done
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-amber-700 dark:text-amber-400">
                      Pending
                    </span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Up to +500 XP
              </div>
            </div>
          </div>
        </div>
      </section>

      {actionError && (
        <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Post-submission prompt encouraging daily summary email */}
      {justSubmittedPrompt && todayAttempt?.status === 'submitted' && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Daily Mock Graded &amp; Portal Notification Sent ({todayAttempt.scorePercent}% · Hard {todayAttempt.hardAccuracyPercent}%)
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Send your complete 7-pillar Daily Results Summary straight to your sign-up email ({learnerEmail}) for your daily study log.
            </p>
          </div>
          <button
            type="button"
            onClick={() => triggerEmailSummaryForAttempt(todayAttempt)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Daily Results Summary</span>
          </button>
        </div>
      )}

      {/* Today's Blueprint Overview (when not yet submitted) */}
      {!inspectedGrade && (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Today’s 7-Pillar Exam Blueprint ({todayPaper.paperCode})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every topic taught inside EMPLOYABILITY UNIVERSE With Kapil is tested daily with an exact 50% Hard / 50% Standard split.
              </p>
            </div>
            <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
              40 MCQs · 20 Hard · 20 Standard · 60 Min
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {DAILY_MOCK_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono">0{idx + 1}</span>
                  <span className="font-mono tabular-nums font-semibold text-rose-700 dark:text-rose-400">
                    {pillar.targetHard} Hard / {pillar.targetHard + pillar.targetStandard} Total
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-950 dark:text-white">
                  {pillar.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.topicsLabel}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Results Summary Dashboard (when today or selected past day is submitted) */}
      {inspectedAttempt && inspectedGrade && (
        <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>Daily Results Summary</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{inspectedPaper.displayDate}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span className="font-mono">{inspectedPaper.paperCode}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1 flex flex-wrap items-center gap-2.5">
                  <span className="font-mono tabular-nums">
                    {inspectedGrade.scorePercent}% ({inspectedGrade.correctCount}/{inspectedGrade.totalQuestions})
                  </span>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                  <span
                    className={
                      inspectedGrade.passed
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }
                  >
                    {inspectedGrade.gradeLabel}
                  </span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {selectedHistoryDate !== todayKey && (
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryDate(todayKey)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Return to Today</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => triggerEmailSummaryForAttempt(inspectedAttempt)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>
                    {inspectedAttempt.resultEmailed
                      ? 'Emailed · Send Copy Again'
                      : 'Email Summary to Sign-Up ID'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSummaryTxt(inspectedAttempt)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* 4-Column Scoreboard Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Hard MCQs (50%)</span>
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-rose-700 dark:text-rose-400 mt-1">
                  {inspectedGrade.hardCorrectCount}/{inspectedGrade.hardQuestionCount}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                  {inspectedGrade.hardAccuracyPercent}% Hard accuracy
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Standard MCQs (50%)</span>
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-1">
                  {inspectedGrade.standardCorrectCount}/
                  {inspectedGrade.totalQuestions - inspectedGrade.hardQuestionCount}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                  {inspectedGrade.standardAccuracyPercent}% Standard accuracy
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Time &amp; Completion</span>
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-950 dark:text-white mt-1">
                  {formatCountdown(inspectedAttempt.timeUsedSeconds)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                  {inspectedGrade.answeredCount}/{inspectedGrade.totalQuestions} attempted
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Daily XP Awarded</span>
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-amber-700 dark:text-amber-400 mt-1">
                  +{inspectedGrade.xpAwarded} XP
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {inspectedAttempt.resultEmailed
                    ? 'Summary emailed to inbox'
                    : 'Ready to email summary'}
                </div>
              </div>
            </div>

            {/* 7-Pillar Mastery Table */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>7-Pillar Topic Breakdown</span>
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Strongest: <strong className="text-emerald-700 dark:text-emerald-400">{inspectedGrade.strongestTopic}</strong>
                  <span className="mx-2" aria-hidden="true">·</span>
                  Priority Focus: <strong className="text-rose-700 dark:text-rose-400">{inspectedGrade.weakestTopic}</strong>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {inspectedGrade.pillarScores.map((p) => (
                  <div
                    key={p.pillarId}
                    className="p-3.5 sm:px-4 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-5">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {p.pillarTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        Hard MCQs: {p.hardCorrect}/{p.hardTotal}
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.percent >= 70
                              ? 'bg-emerald-600'
                              : p.percent >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-600'
                          }`}
                          style={{ width: `${p.percent}%` }}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 text-right font-mono tabular-nums text-xs font-bold text-slate-900 dark:text-white">
                      {p.correct}/{p.total} · {p.percent}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Kapil's Daily Diagnostic */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/20 text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mentor Kapil’s Daily Action Plan</span>
              </div>
              {inspectedGrade.mentorAdvice}
            </div>
          </div>

          {/* Full 40-Question Answer Key & Explanations */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Full Answer Key &amp; Explanations</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review every Hard and Standard MCQ rationale from {inspectedPaper.displayDate}.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                {(
                  [
                    { id: 'all', label: `All (${inspectedPaper.totalQuestions})` },
                    {
                      id: 'incorrect',
                      label: `Missed (${inspectedGrade.totalQuestions - inspectedGrade.correctCount})`,
                    },
                    { id: 'hard', label: `Hard Only (${inspectedPaper.hardCount})` },
                  ] as { id: ReviewFilter; label: string }[]
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setReviewFilter(f.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      reviewFilter === f.id
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviewQuestions.map(({ q, idx, userChoice }) => {
                const isRight = userChoice === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          Q{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{q.pillarTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            q.difficulty === 'Hard'
                              ? 'font-semibold text-rose-700 dark:text-rose-400'
                              : 'font-semibold text-slate-600 dark:text-slate-300'
                          }
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isRight
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {isRight ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isRight
                            ? 'Correct'
                            : userChoice < 0
                            ? 'Unanswered'
                            : 'Incorrect'}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-950 dark:text-white leading-relaxed">
                      {q.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isCorrectOpt = oIdx === q.correctIndex;
                        const isPickedWrong = oIdx === userChoice && !isCorrectOpt;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg border ${
                              isCorrectOpt
                                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                                : isPickedWrong
                                ? 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span className="font-mono font-bold mr-1.5">
                              {['A', 'B', 'C', 'D'][oIdx]}.
                            </span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                      <strong className="text-slate-950 dark:text-white">
                        Explanation:
                      </strong>{' '}
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Learner Daily Mock History Log */}
      {submittedAttempts.length > 0 && (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Your Daily Mock History</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Click any date to inspect or email its daily results summary</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 pr-4 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Paper</th>
                  <th className="py-2.5 px-3 font-semibold">Overall</th>
                  <th className="py-2.5 px-3 font-semibold">Hard (50%)</th>
                  <th className="py-2.5 px-3 font-semibold">Grade</th>
                  <th className="py-2.5 px-3 font-semibold">Focus Topic</th>
                  <th className="py-2.5 pl-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {submittedAttempts.map((att) => {
                  const isActive = inspectedAttempt?.id === att.id;
                  return (
                    <tr
                      key={att.id}
                      className={
                        isActive
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/25'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    >
                      <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatDateKeyReadable(att.dateKey)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {att.paperCode}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-bold text-slate-950 dark:text-white whitespace-nowrap">
                        {att.correctCount}/{att.totalQuestions} ({att.scorePercent}%)
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-bold text-rose-700 dark:text-rose-400 whitespace-nowrap">
                        {att.hardCorrectCount}/{att.hardQuestionCount} ({att.hardAccuracyPercent}%)
                      </td>
                      <td className="py-3 px-3 font-semibold whitespace-nowrap">
                        <span
                          className={
                            att.passed
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }
                        >
                          {att.gradeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {att.weakestTopic || '—'}
                      </td>
                      <td className="py-3 pl-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedHistoryDate(att.dateKey)}
                            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerEmailSummaryForAttempt(att)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-semibold cursor-pointer"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{att.resultEmailed ? 'Resend' : 'Email'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
