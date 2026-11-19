import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck2,
  Play,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  CaseFieldKey,
  FINAL_ASSESSMENT_META,
  FINAL_CASE_STUDIES,
  FINAL_MCQS,
  FINAL_SCARE_PROMPT,
} from '../data/finalAssessmentData';
import { AdvancedProgressDoc } from '../services/advancedFirestoreService';
import {
  extractCaseResponses,
  FinalAssessmentDoc,
  saveFinalAssessmentDraft,
  startFinalAssessmentSession,
  submitFinalAssessment,
} from '../services/finalAssessmentService';
import { LearnerProgressDoc } from '../services/firestoreService';
import { FinalCredentialsPanel } from './FinalCredentialsPanel';

interface FinalAssessmentStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  finalDoc: FinalAssessmentDoc;
  coreProgress: LearnerProgressDoc;
  advProgress: AdvancedProgressDoc;
  advAvgScore: number;
}

type ExamSectionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
// 0 = Part A MCQs, 1..5 = Case Studies 1..5, 6 = Part C SCARE & Final Submit

const SECTION_LABELS: { idx: ExamSectionIndex; short: string; xpLabel: string }[] = [
  { idx: 0, short: 'Part A · 10 MCQs', xpLabel: '400 XP' },
  { idx: 1, short: 'Case 01 · FinTech', xpLabel: '100 XP' },
  { idx: 2, short: 'Case 02 · EV Safety', xpLabel: '100 XP' },
  { idx: 3, short: 'Case 03 · Hospital', xpLabel: '100 XP' },
  { idx: 4, short: 'Case 04 · SaaS', xpLabel: '100 XP' },
  { idx: 5, short: 'Case 05 · Panel', xpLabel: '100 XP' },
  { idx: 6, short: 'Part C · SCARE', xpLabel: '100 XP' },
];

function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const FinalAssessmentStudio: React.FC<FinalAssessmentStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  finalDoc,
  coreProgress,
  advProgress,
  advAvgScore,
}) => {
  const [targetRole, setTargetRole] = useState(finalDoc.targetRole);
  const [collegeOrOrg, setCollegeOrOrg] = useState(finalDoc.collegeOrOrg);

  const [mcqAnswers, setMcqAnswers] = useState<number[]>(finalDoc.mcqAnswers);
  const [caseResponses, setCaseResponses] = useState<Record<CaseFieldKey, string>>(
    () => extractCaseResponses(finalDoc)
  );
  const [capstoneScare, setCapstoneScare] = useState(finalDoc.capstoneScare);

  const [sectionIdx, setSectionIdx] = useState<ExamSectionIndex>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    FINAL_ASSESSMENT_META.durationSeconds
  );
  const [starting, setStarting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [draftSavedNote, setDraftSavedNote] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRationales, setShowRationales] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const autoSubmittedRef = useRef(false);
  const hydratedOwnerRef = useRef<string>('');

  // Hydrate local editor from Firestore when doc arrives initially or transitions status
  useEffect(() => {
    const syncKey = `${finalDoc.ownerId}_${finalDoc.status}_${finalDoc.startedAtMs}`;
    if (hydratedOwnerRef.current !== syncKey) {
      hydratedOwnerRef.current = syncKey;
      setTargetRole(finalDoc.targetRole);
      setCollegeOrOrg(finalDoc.collegeOrOrg);
      setMcqAnswers(finalDoc.mcqAnswers);
      setCaseResponses(extractCaseResponses(finalDoc));
      setCapstoneScare(finalDoc.capstoneScare);
    }
  }, [finalDoc]);

  // Strict 90-Minute Proctored Countdown synchronized to startedAtMs
  useEffect(() => {
    if (finalDoc.status !== 'in_progress' || !finalDoc.startedAtMs) return;

    const computeRemaining = () => {
      const elapsedSec = Math.floor((Date.now() - finalDoc.startedAtMs) / 1000);
      return Math.max(0, FINAL_ASSESSMENT_META.durationSeconds - elapsedSec);
    };

    const initialRem = computeRemaining();
    setRemainingSeconds(initialRem);

    const timer = window.setInterval(() => {
      const rem = computeRemaining();
      setRemainingSeconds(rem);
      if (rem <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        window.clearInterval(timer);
        void submitFinalAssessment({
          user,
          startedAtMs: finalDoc.startedAtMs,
          targetRole,
          collegeOrOrg,
          mcqAnswers,
          caseResponses,
          capstoneScare,
        }).catch((err) => {
          setErrorMsg(
            err instanceof Error ? err.message : 'Auto-submit failed on timeout.'
          );
        });
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    finalDoc.status,
    finalDoc.startedAtMs,
    user,
    targetRole,
    collegeOrOrg,
    mcqAnswers,
    caseResponses,
    capstoneScare,
  ]);

  const answeredMcqCount = useMemo(
    () => mcqAnswers.filter((a) => a >= 0 && a <= 3).length,
    [mcqAnswers]
  );

  const answeredCaseFieldsCount = useMemo(
    () =>
      Object.values(caseResponses).filter((v) => v.trim().length >= 5).length,
    [caseResponses]
  );

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStarting(true);
    try {
      autoSubmittedRef.current = false;
      await startFinalAssessmentSession({
        user,
        targetRole: targetRole || 'Entry-Level Analyst / Software & Business Role',
        collegeOrOrg: collegeOrOrg || 'Placement Candidate',
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Could not start final assessment.'
      );
    } finally {
      setStarting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (finalDoc.status !== 'in_progress') return;
    setSavingDraft(true);
    setDraftSavedNote(null);
    setErrorMsg(null);
    try {
      await saveFinalAssessmentDraft({
        user,
        targetRole,
        collegeOrOrg,
        mcqAnswers,
        caseResponses,
        capstoneScare,
      });
      setDraftSavedNote('Draft synced to cloud');
      window.setTimeout(() => setDraftSavedNote(null), 2500);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to sync draft.'
      );
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSwitchSection = (nextIdx: ExamSectionIndex) => {
    setSectionIdx(nextIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (finalDoc.status === 'in_progress') {
      void saveFinalAssessmentDraft({
        user,
        targetRole,
        collegeOrOrg,
        mcqAnswers,
        caseResponses,
        capstoneScare,
      }).catch(() => {});
    }
  };

  const handleFinalSubmit = async () => {
    if (finalDoc.status !== 'in_progress' || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      autoSubmittedRef.current = true;
      await submitFinalAssessment({
        user,
        startedAtMs: finalDoc.startedAtMs,
        targetRole,
        collegeOrOrg,
        mcqAnswers,
        caseResponses,
        capstoneScare,
      });
      setConfirmSubmitOpen(false);
    } catch (err) {
      autoSubmittedRef.current = false;
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not submit final assessment. Please retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // STATE 1: NOT STARTED — Proctored Briefing Lobby
  // =========================================================================
  if (finalDoc.status === 'not_started') {
    return (
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                {FINAL_ASSESSMENT_META.subtitle.toUpperCase()} · {FINAL_ASSESSMENT_META.poweredBy}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {FINAL_ASSESSMENT_META.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {FINAL_ASSESSMENT_META.description}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 sm:min-w-[270px] space-y-2 shrink-0">
              <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                EXAM PARAMETERS
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Time Limit</div>
                  <div className="font-mono text-xl font-bold text-slate-950 dark:text-white tabular-nums">
                    90:00 Min
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Max Reward</div>
                  <div className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                    1000 XP
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Passing Mark</div>
                  <div className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    600 XP (60%)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Outputs</div>
                  <div className="font-mono text-sm font-bold text-slate-950 dark:text-white">
                    PNG Cert + LOR PDF
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Part Syllabus Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                <span>PART A · RAPID DIAGNOSTICS</span>
                <span>400 XP</span>
              </div>
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                10 Non-Repeated Hard MCQs
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                5 executive dilemmas drawn from Normal Track (Levels 1–10) + 5 prompt/governance dilemmas from AI Advanced Track at 50% higher analytical difficulty.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
                <span>PART B · REAL CASE STUDIES</span>
                <span>500 XP</span>
              </div>
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                5 New Cases &amp; Custom Visuals
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                FinTech Outage War-Room, EV Battery Recall QA, Hospital Digital Triage, SaaS Churn Boardroom, and Tier-1 Placement Panel (3 new questions per case).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                <span>PART C · SCARE SYNTHESIS</span>
                <span>100 XP</span>
              </div>
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                60s Executive Defense &amp; LOR
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlocks automatic grading, your Official Final Capstone Certificate (PNG), and a personalized Placement Letter of Recommendation (PDF).
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Pre-Exam Personalization Inputs for LOR PDF */}
          <form onSubmit={handleStartExam} className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Placement Role (Printed on Your Personalized LOR PDF)
                </label>
                <input
                  type="text"
                  maxLength={115}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Software Development Engineer / Business Analyst"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / Cohort / Organization
                </label>
                <input
                  type="text"
                  maxLength={115}
                  value={collegeOrOrg}
                  onChange={(e) => setCollegeOrOrg(e.target.value)}
                  placeholder="e.g., B.Tech CSE 2026 · FACE Prep Placement Batch"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Candidate: <strong className="text-slate-900 dark:text-white">{learnerName}</strong> ({learnerEmail}) · Timer begins immediately upon clicking Start.
              </div>
              <button
                type="submit"
                disabled={starting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <Play className="w-4 h-4" />
                <span>{starting ? 'Initializing 90:00 Clock...' : 'Start 90-Minute Final Assessment'}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  // =========================================================================
  // STATE 3: SUBMITTED — Auto-Graded Scoreboard, Diagnostic Audit & LOR PDF
  // =========================================================================
  if (finalDoc.status === 'submitted') {
    const mcqCorrectCount = FINAL_MCQS.reduce(
      (acc, q, idx) => (finalDoc.mcqAnswers[idx] === q.correctIndex ? acc + 1 : acc),
      0
    );

    return (
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                PROCTORED ASSESSMENT SUBMITTED · AUTOMATICALLY GRADED
              </div>
              <h1 className="font-display text-3xl font-extrabold text-slate-950 dark:text-white">
                {finalDoc.gradeTier || 'Assessment Evaluated'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {finalDoc.executiveFeedback}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-5 text-center sm:min-w-[230px] shrink-0">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                TOTAL FINAL SCORE
              </div>
              <div className="font-mono text-3xl font-extrabold text-blue-700 dark:text-blue-400 tabular-nums mt-1">
                {finalDoc.totalXpAwarded} / 1000 XP
              </div>
              <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mt-1 tabular-nums">
                {finalDoc.percentageScore}% · {finalDoc.passed ? 'PASSED' : 'BELOW 600 XP'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-200 dark:border-slate-800 pt-5">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Part A · Diagnostics</div>
              <div className="font-mono text-xl font-bold text-slate-950 dark:text-white tabular-nums mt-0.5">
                {finalDoc.mcqScore}/400 XP ({mcqCorrectCount}/10)
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Part B · 5 Case Studies</div>
              <div className="font-mono text-xl font-bold text-slate-950 dark:text-white tabular-nums mt-0.5">
                {finalDoc.caseScore}/500 XP
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Part C · SCARE Defense</div>
              <div className="font-mono text-xl font-bold text-slate-950 dark:text-white tabular-nums mt-0.5">
                {finalDoc.scareScore}/100 XP
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Time Completed</div>
              <div className="font-mono text-xl font-bold text-slate-950 dark:text-white tabular-nums mt-0.5">
                {formatCountdown(finalDoc.timeUsedSeconds)} / 90:00
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowRationales((v) => !v)}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {showRationales
                ? 'Hide Part A Diagnostic Answer Key & Rationales'
                : 'Review Part A Diagnostic Answer Key & Rationales →'}
            </button>
          </div>

          {showRationales && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {FINAL_MCQS.map((q, idx) => {
                const chosen = finalDoc.mcqAnswers[idx];
                const isRight = chosen === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      isRight
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span>
                        Q{idx + 1} · {q.trackSource}
                      </span>
                      <span>{isRight ? '+40 XP · Correct' : '0 XP · Review'}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 italic">
                      {q.rationale}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Official Certificate & Personalized LOR PDF Panel */}
        <FinalCredentialsPanel
          learnerName={learnerName}
          learnerEmail={learnerEmail}
          finalDoc={finalDoc}
          coreProgress={coreProgress}
          advProgress={advProgress}
          advAvgScore={advAvgScore}
        />
      </div>
    );
  }

  // =========================================================================
  // STATE 2: IN PROGRESS — Live 90-Minute Proctored Exam Workspace
  // =========================================================================
  const isCriticalTime = remainingSeconds <= 600;
  const activeCaseStudy =
    sectionIdx >= 1 && sectionIdx <= 5
      ? FINAL_CASE_STUDIES[sectionIdx - 1]
      : null;

  return (
    <div className="space-y-6">
      {/* Proctored Live Timer & Progress Control Deck */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-base font-extrabold tabular-nums ${
                isCriticalTime
                  ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                  : 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatCountdown(remainingSeconds)}</span>
              <span className="text-[11px] font-semibold">
                {isCriticalTime ? '· Final 10 Min Warning' : '· Remaining'}
              </span>
            </div>

            <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
              MCQs: <strong className="text-slate-950 dark:text-white">{answeredMcqCount}/10</strong> · Cases:{' '}
              <strong className="text-slate-950 dark:text-white">{answeredCaseFieldsCount}/15</strong> · Target: 1000 XP
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {draftSavedNote && (
              <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                {draftSavedNote}
              </span>
            )}
            <button
              type="button"
              disabled={savingDraft}
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmSubmitOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Finish &amp; Auto-Score (1000 XP)</span>
            </button>
          </div>
        </div>

        {/* Inline Safe Submit Confirmation Strip (Zero window.confirm) */}
        {confirmSubmitOpen && (
          <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Confirm Final Submission:</strong> You have answered{' '}
                <strong>{answeredMcqCount}/10</strong> MCQs and{' '}
                <strong>{answeredCaseFieldsCount}/15</strong> Case prompts. Submitting locks your assessment and issues your score, PNG Certificate, and LOR PDF.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Continue Editing
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Grading...' : 'Confirm & Submit Now'}
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 dark:border-slate-800">
          {SECTION_LABELS.map((tab) => {
            const active = sectionIdx === tab.idx;
            return (
              <button
                key={tab.idx}
                type="button"
                onClick={() => handleSwitchSection(tab.idx)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {tab.short} ({tab.xpLabel})
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 0: PART A — 10 Non-Repeated 50% Hard Scenario MCQs (400 XP) */}
      {sectionIdx === 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                Part A · Rapid Synthesis Diagnostics (10 Questions · 400 XP)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Each question awards 40 XP and tests 50% elevated cross-track reasoning without repeating earlier quiz items.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
              {answeredMcqCount}/10 Answered
            </span>
          </div>

          <div className="space-y-4">
            {FINAL_MCQS.map((q, qIdx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    Q{qIdx + 1} · {q.trackSource}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">40 XP</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {q.scenario}
                </div>

                <div className="font-display text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                  {q.question}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const selected = mcqAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          setMcqAnswers((prev) => {
                            const next = [...prev];
                            next[qIdx] = optIdx;
                            return next;
                          });
                        }}
                        className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-colors cursor-pointer flex items-start gap-3 ${
                          selected
                            ? 'border-blue-700 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/40 text-slate-950 dark:text-white font-semibold'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleSwitchSection(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
            >
              <span>Proceed to Case Study 01</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* SECTIONS 1..5: PART B — 5 New Real-World Visual Case Studies (100 XP each) */}
      {activeCaseStudy && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
                {activeCaseStudy.number} · {activeCaseStudy.trackBlend}
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-0.5">
                {activeCaseStudy.title}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeCaseStudy.companyContext}
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 shrink-0">
              100 XP Case Evaluation
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Case Visual & Quantitative Dossier */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                {brokenImages[activeCaseStudy.id] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-800 to-slate-950 text-white">
                    <Sparkles className="w-8 h-8 text-amber-400 mb-2" />
                    <div className="font-display font-bold text-sm">
                      {activeCaseStudy.title}
                    </div>
                  </div>
                ) : (
                  <img
                    src={activeCaseStudy.imageSrc}
                    alt={activeCaseStudy.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setBrokenImages((prev) => ({
                        ...prev,
                        [activeCaseStudy.id]: true,
                      }))
                    }
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2.5">
                <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  EXECUTIVE SCENARIO BRIEF
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeCaseStudy.scenarioBrief}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    HARD OPERATIONAL CONSTRAINTS
                  </div>
                  {activeCaseStudy.quantitativeConstraints.map((c) => (
                    <div
                      key={c}
                      className="text-xs font-mono text-slate-900 dark:text-slate-200"
                    >
                      · {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 Non-Repeated Analytical Questions */}
            <div className="lg:col-span-7 space-y-4">
              {activeCaseStudy.questions.map((q) => (
                <div key={q.fieldKey} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                      {q.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {(caseResponses[q.fieldKey] || '').length}/1180
                    </span>
                  </div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.prompt}
                  </label>
                  <textarea
                    rows={4}
                    maxLength={1180}
                    value={caseResponses[q.fieldKey]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCaseResponses((prev) => ({
                        ...prev,
                        [q.fieldKey]: val,
                      }));
                    }}
                    placeholder="Provide specific visual evidence, clear risk/trade-off logic, and measurable action..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() =>
                handleSwitchSection((sectionIdx - 1) as ExamSectionIndex)
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleSwitchSection((sectionIdx + 1) as ExamSectionIndex)
              }
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <span>
                {sectionIdx === 5
                  ? 'Proceed to Part C · SCARE Defense'
                  : `Next: Case Study 0${sectionIdx + 1}`}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* SECTION 6: PART C — Final 60s S-C-A-R-E Placement Defense & Submission */}
      {sectionIdx === 6 && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              FINAL ROUND · 100 XP EXECUTIVE DEFENSE
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              {FINAL_SCARE_PROMPT.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {FINAL_SCARE_PROMPT.instruction}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Target Placement Role (for PDF LOR)
              </label>
              <input
                type="text"
                maxLength={115}
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm College / Cohort (for PDF LOR)
              </label>
              <input
                type="text"
                maxLength={115}
                value={collegeOrOrg}
                onChange={(e) => setCollegeOrOrg(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Your Complete S-C-A-R-E Executive Placement Defense
              </label>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {capstoneScare.length}/1480
              </span>
            </div>
            <textarea
              rows={7}
              maxLength={1480}
              value={capstoneScare}
              onChange={(e) => setCapstoneScare(e.target.value)}
              placeholder="S (See): ...&#10;C (Connect): ...&#10;A (Analyse risks & trade-offs): ...&#10;R (Respond with measurable action): ...&#10;E (Express placement-ready outcome): ..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleSwitchSection(5)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Case Study 05</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmSubmitOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Final Assessment &amp; Generate Certificate + LOR PDF</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
