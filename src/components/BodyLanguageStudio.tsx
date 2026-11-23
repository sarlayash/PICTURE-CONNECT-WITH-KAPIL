import React, { useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Camera,
  CheckCircle2,
  Download,
  Eye,
  Hand,
  HelpCircle,
  Lightbulb,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  XCircle,
} from 'lucide-react';
import {
  BODY_LANGUAGE_BADGES,
  BODY_LANGUAGE_MCQS,
  BODY_LANGUAGE_META,
  BODY_LANGUAGE_SCENARIOS,
  BodyLanguageScenario,
  getBodyLanguageRank,
} from '../data/bodyLanguageData';
import { BODY_LANGUAGE_IMAGES } from '../data/imageAssets';
import {
  BodyLanguageProgressDoc,
  markBodyScenarioExplored,
  resetBodyMcqTest,
  submitBodyChallengeChoice,
  submitBodyMcqAnswer,
} from '../services/bodyLanguageFirestoreService';
import { buildCredentialEmailHtml } from '../services/gmailService';
import {
  buildBodyLanguageBadgePngDataUrl,
  buildBodyLanguageCertificateDataUrl,
} from '../utils/credentialGenerators';
import { EmailCredentialRequest } from './EmailCredentialModal';
import { SmartImage } from './SmartImage';

interface BodyLanguageStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  bodyProgress: BodyLanguageProgressDoc;
  onRequestEmail?: (req: EmailCredentialRequest) => void;
}

type StudioTab = 'scenarios' | 'mcq' | 'credentials';

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const BodyLanguageStudio: React.FC<BodyLanguageStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  bodyProgress,
  onRequestEmail,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('scenarios');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    BODY_LANGUAGE_SCENARIOS[0].id
  );
  const [challengePickById, setChallengePickById] = useState<
    Record<string, number>
  >({});
  const [challengeFeedbackById, setChallengeFeedbackById] = useState<
    Record<string, { ok: boolean; text: string }>
  >({});
  const [busyScenarioId, setBusyScenarioId] = useState<string | null>(null);

  // MCQ Test state
  const [mcqDifficultyFilter, setMcqDifficultyFilter] = useState<
    'all' | 'Core' | 'Applied' | 'Executive'
  >('all');
  const [revealedHintIds, setRevealedHintIds] = useState<string[]>([]);
  const [busyMcqId, setBusyMcqId] = useState<string | null>(null);
  const [mcqToast, setMcqToast] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const activeScenario: BodyLanguageScenario = useMemo(
    () =>
      BODY_LANGUAGE_SCENARIOS.find((s) => s.id === selectedScenarioId) ??
      BODY_LANGUAGE_SCENARIOS[0],
    [selectedScenarioId]
  );

  const rank = getBodyLanguageRank(bodyProgress.bodyXp);
  const exploredCount = bodyProgress.exploredScenarios.length;
  const solvedCount = bodyProgress.solvedChallenges.length;
  const answeredCount = bodyProgress.answeredMcqs.length;
  const correctCount = bodyProgress.correctMcqs.length;
  const accuracyPct =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const filteredMcqs = useMemo(
    () =>
      BODY_LANGUAGE_MCQS.map((q, globalIdx) => ({ q, globalIdx })).filter(
        ({ q }) =>
          mcqDifficultyFilter === 'all' || q.difficulty === mcqDifficultyFilter
      ),
    [mcqDifficultyFilter]
  );

  const handleSelectScenario = async (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    try {
      await markBodyScenarioExplored({
        user,
        current: bodyProgress,
        scenarioId,
      });
    } catch (err) {
      console.error('Failed to mark scenario explored:', err);
    }
  };

  const handleExploreCurrentScenario = async () => {
    setBusyScenarioId(activeScenario.id);
    try {
      const res = await markBodyScenarioExplored({
        user,
        current: bodyProgress,
        scenarioId: activeScenario.id,
      });
      if (res.newlyAwardedXp > 0) {
        setMcqToast(
          `Scenario "${activeScenario.title}" marked studied (+${res.newlyAwardedXp} XP)!`
        );
      }
    } finally {
      setBusyScenarioId(null);
    }
  };

  const handleSolveChallenge = async (scenario: BodyLanguageScenario) => {
    const picked = challengePickById[scenario.id];
    if (picked === undefined) return;
    setBusyScenarioId(scenario.id);
    try {
      const res = await submitBodyChallengeChoice({
        user,
        current: bodyProgress,
        scenarioId: scenario.id,
        chosenOption: picked,
      });
      if (res.isCorrect) {
        setChallengeFeedbackById((prev) => ({
          ...prev,
          [scenario.id]: {
            ok: true,
            text:
              res.newlyAwardedXp > 0
                ? `Executive fix verified! +${res.newlyAwardedXp} XP earned. ${scenario.challenge.explanation}`
                : `Verified! ${scenario.challenge.explanation}`,
          },
        }));
      } else {
        setChallengeFeedbackById((prev) => ({
          ...prev,
          [scenario.id]: {
            ok: false,
            text: 'Not quite the executive fix — compare the Poor Habit vs Executive Body Language cues above and try another adjustment.',
          },
        }));
      }
    } finally {
      setBusyScenarioId(null);
    }
  };

  const handleAnswerMcq = async (globalIdx: number, optionIdx: number) => {
    const item = BODY_LANGUAGE_MCQS[globalIdx];
    if (!item || bodyProgress.answeredMcqs.includes(item.id)) return;
    setBusyMcqId(item.id);
    setMcqToast(null);
    try {
      const usedHint = revealedHintIds.includes(item.id);
      const res = await submitBodyMcqAnswer({
        user,
        current: bodyProgress,
        mcqIndex: globalIdx,
        chosenOption: optionIdx,
        usedHint,
      });
      setMcqToast(
        res.isCorrect
          ? `Sharp read! +${res.newlyAwardedXp} XP earned${
              res.newlyUnlockedBadges.length > 0
                ? ` · Unlocked ${res.newlyUnlockedBadges.length} new badge!`
                : '.'
            }`
          : `Recorded (+${res.newlyAwardedXp} XP). Review the recruiter rationale below.`
      );
    } finally {
      setBusyMcqId(null);
    }
  };

  const handleResetTest = async () => {
    await resetBodyMcqTest({ user, current: bodyProgress });
    setConfirmReset(false);
    setRevealedHintIds([]);
    setMcqToast('MCQ test reset cleanly. Ready for a fresh attempt!');
  };

  const certificatePreviewUrl = useMemo(() => {
    if (typeof document === 'undefined') return '';
    return buildBodyLanguageCertificateDataUrl(
      learnerName,
      learnerEmail,
      bodyProgress
    );
  }, [learnerName, learnerEmail, bodyProgress]);

  const handleEmailCertificate = () => {
    if (!onRequestEmail || !learnerEmail) return;
    const dataUrl = buildBodyLanguageCertificateDataUrl(
      learnerName,
      learnerEmail,
      bodyProgress
    );
    const { htmlBody, textFallback } = buildCredentialEmailHtml({
      learnerName,
      learnerEmail,
      credentialKindLabel: 'Official Verified PNG Certificate',
      credentialTitle: 'Certificate of Executive Body Language & Presence',
      certificateId: bodyProgress.bodyCertificateId,
      summaryPoints: [
        `Body Language XP: ${bodyProgress.bodyXp} XP (${rank.title})`,
        `Visual Action Labs Solved: ${solvedCount}/${BODY_LANGUAGE_SCENARIOS.length}`,
        `Scenario MCQs: ${correctCount}/${BODY_LANGUAGE_MCQS.length} (${accuracyPct}% accuracy)`,
        `Badges Unlocked: ${bodyProgress.unlockedBodyBadges.length}/${BODY_LANGUAGE_BADGES.length}`,
      ],
    });
    onRequestEmail({
      recipientEmail: learnerEmail,
      recipientName: learnerName,
      credentialType: 'certificate',
      title: 'Executive Body Language Certificate (PNG)',
      subject:
        'Your Official Body Language & Executive Presence Certificate — EMPLOYABILITY UNIVERSE With Kapil',
      htmlBody,
      textFallback,
      targetView: 'body_language',
      attachment: {
        filename: 'Employability-Universe-Body-Language-Certificate-Kapil.png',
        mimeType: 'image/png',
        base64OrDataUrl: dataUrl,
      },
    });
  };

  const handleEmailBadge = (badgeId: string) => {
    const badge = BODY_LANGUAGE_BADGES.find((b) => b.id === badgeId);
    if (!badge || !onRequestEmail || !learnerEmail) return;
    const dataUrl = buildBodyLanguageBadgePngDataUrl(
      badge,
      learnerName,
      bodyProgress.bodyCertificateId
    );
    const { htmlBody, textFallback } = buildCredentialEmailHtml({
      learnerName,
      learnerEmail,
      credentialKindLabel: '1200×1200 Mastery PNG Badge',
      credentialTitle: badge.title,
      certificateId: bodyProgress.bodyCertificateId,
      summaryPoints: [
        `Earned Criteria: ${badge.criteriaLabel}`,
        `Current Presence Rank: ${rank.title} (${bodyProgress.bodyXp} XP)`,
      ],
    });
    onRequestEmail({
      recipientEmail: learnerEmail,
      recipientName: learnerName,
      credentialType: 'badge',
      title: `${badge.title} Badge (PNG)`,
      subject: `Earned Badge: ${badge.title} — EMPLOYABILITY UNIVERSE With Kapil`,
      htmlBody,
      textFallback,
      targetView: 'body_language',
      attachment: {
        filename: `Badge-${badge.id}.png`,
        mimeType: 'image/png',
        base64OrDataUrl: dataUrl,
      },
    });
  };

  const activePhoto = BODY_LANGUAGE_IMAGES[activeScenario.imageKey];
  const isCurrentExplored = bodyProgress.exploredScenarios.includes(
    activeScenario.id
  );
  const isCurrentChallengeSolved = bodyProgress.solvedChallenges.includes(
    activeScenario.id
  );
  const currentFeedback = challengeFeedbackById[activeScenario.id];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-teal-700 dark:text-teal-400">
                <UserCheck className="w-4 h-4" />
                <span>NON-VERBAL INTELLIGENCE &amp; EXECUTIVE PRESENCE</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {BODY_LANGUAGE_META.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {BODY_LANGUAGE_META.subtitle}. Study authentic visual placement
                scenarios with channel-by-channel Poor Habit vs Executive Body
                Language cues, solve 6 live scenario-fix challenges, and pass
                15 real-world decoding MCQs.
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/30 p-4 min-w-[230px] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Presence Rank
              </div>
              <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                {rank.title}
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                {rank.nextTitle
                  ? `Next: ${rank.nextTitle} at ${rank.nextXp} XP`
                  : 'Highest Presence Tier Unlocked'}
              </div>
            </div>
          </div>

          {/* 4-Column Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Presence XP
              </div>
              <div className="font-mono tabular-nums text-2xl font-bold text-teal-700 dark:text-teal-400 mt-1">
                {bodyProgress.bodyXp}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Scenarios Studied
              </div>
              <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
                {exploredCount} / {BODY_LANGUAGE_SCENARIOS.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Action Labs Solved
              </div>
              <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
                {solvedCount} / {BODY_LANGUAGE_SCENARIOS.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Scenario MCQs
              </div>
              <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
                {correctCount}/{BODY_LANGUAGE_MCQS.length}{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({accuracyPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Studio Mode Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(
              [
                {
                  id: 'scenarios' as const,
                  label: `Visual Scenario Lab (${solvedCount}/6 Fixes)`,
                },
                {
                  id: 'mcq' as const,
                  label: `Real-Scenario MCQ Test (${answeredCount}/15)`,
                },
                {
                  id: 'credentials' as const,
                  label: `Badges & Certificate (${bodyProgress.unlockedBodyBadges.length}/4)`,
                },
              ]
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-teal-700 bg-teal-700 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {mcqToast && (
        <div className="rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 px-4 py-3 text-xs font-semibold text-teal-900 dark:text-teal-200 flex items-center justify-between gap-3">
          <span>{mcqToast}</span>
          <button
            type="button"
            onClick={() => setMcqToast(null)}
            className="text-xs underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: VISUAL SCENARIO LAB */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Scenario Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              6 Real Placement Scenarios
            </div>
            {BODY_LANGUAGE_SCENARIOS.map((scen) => {
              const selected = scen.id === activeScenario.id;
              const solved = bodyProgress.solvedChallenges.includes(scen.id);
              const studied = bodyProgress.exploredScenarios.includes(scen.id);
              const thumb = BODY_LANGUAGE_IMAGES[scen.imageKey];
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => handleSelectScenario(scen.id)}
                  className={`w-full text-left rounded-xl border p-3 transition-colors cursor-pointer flex items-start gap-3 ${
                    selected
                      ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 shadow-sm'
                      : solved
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/50 opacity-85 hover:opacity-100'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400'
                  }`}
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-950">
                    <SmartImage
                      src={thumb.src}
                      alt={thumb.alt}
                      fallbackTitle={scen.number}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="font-bold text-teal-700 dark:text-teal-400">
                        SCENARIO {scen.number}
                      </span>
                      {solved ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Solved
                        </span>
                      ) : studied ? (
                        <span className="text-slate-500">Studied</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">
                          New
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs font-bold leading-snug ${
                        solved && !selected
                          ? 'text-slate-600 dark:text-slate-400'
                          : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {scen.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Visual & Channel Decoder */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="aspect-[16/9] sm:aspect-[16/8] w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-950 relative">
                <SmartImage
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fallbackTitle={activeScenario.title}
                  fallbackSubtitle={activeScenario.setting}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                      SCENARIO {activeScenario.number} · {activeScenario.setting}
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                      {activeScenario.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeScenario.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={busyScenarioId === activeScenario.id || isCurrentExplored}
                    onClick={handleExploreCurrentScenario}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                      isCurrentExplored
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isCurrentExplored ? 'Scenario Studied (+15 XP)' : 'Mark Studied (+15 XP)'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 space-y-1">
                    <div className="font-mono font-bold text-slate-500 uppercase text-[10px]">
                      Why Recruiters Care
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeScenario.stakes}
                    </p>
                  </div>
                  <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/30 p-3.5 space-y-1">
                    <div className="font-mono font-bold text-teal-700 dark:text-teal-400 uppercase text-[10px]">
                      Kapil’s Golden Rule
                    </div>
                    <p className="font-semibold text-teal-950 dark:text-teal-200 leading-relaxed">
                      {activeScenario.goldenRule}
                    </p>
                  </div>
                </div>

                {/* Channel-by-Channel Comparison */}
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Signal Comparison: Poor Habit vs Executive Body Language
                  </div>
                  {activeScenario.channels.map((cue, idx) => (
                    <div
                      key={`${activeScenario.id}-${idx}`}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-950 dark:text-white">
                        {cue.channel.includes('Eye') ? (
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : cue.channel.includes('Hands') ? (
                          <Hand className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        <span>{cue.channel}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-lg border border-rose-200 dark:border-rose-900/70 bg-rose-50/60 dark:bg-rose-950/20 p-3 space-y-1">
                          <div className="font-mono font-bold text-[10px] uppercase text-rose-700 dark:text-rose-400">
                            Avoid This Mistake
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {cue.mistakeSignal}
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/60 dark:bg-emerald-950/20 p-3 space-y-1">
                          <div className="font-mono font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400">
                            Executive Upgrade
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            {cue.executiveSignal}
                          </p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
                        <strong className="text-slate-800 dark:text-slate-200">
                          Panel Read:
                        </strong>{' '}
                        {cue.recruiterTakeaway}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Action Challenge */}
                <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/25 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                      <span>LIVE SCENARIO FIX CHALLENGE (+30 XP)</span>
                    </div>
                    {isCurrentChallengeSolved && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Challenge Cleared
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-950 dark:text-white leading-relaxed">
                    {activeScenario.challenge.prompt}
                  </p>

                  <div className="space-y-2">
                    {activeScenario.challenge.options.map((opt, optIdx) => {
                      const picked =
                        challengePickById[activeScenario.id] === optIdx ||
                        (isCurrentChallengeSolved &&
                          optIdx === activeScenario.challenge.correctIndex);
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isCurrentChallengeSolved}
                          onClick={() =>
                            setChallengePickById((prev) => ({
                              ...prev,
                              [activeScenario.id]: optIdx,
                            }))
                          }
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                            isCurrentChallengeSolved &&
                            optIdx === activeScenario.challenge.correctIndex
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                              : picked
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-white font-semibold'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                          }`}
                        >
                          <span className="font-mono font-bold mr-2">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!isCurrentChallengeSolved && (
                    <button
                      type="button"
                      disabled={
                        challengePickById[activeScenario.id] === undefined ||
                        busyScenarioId === activeScenario.id
                      }
                      onClick={() => handleSolveChallenge(activeScenario)}
                      className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
                    >
                      Verify Executive Fix (+30 XP)
                    </button>
                  )}

                  {(currentFeedback || isCurrentChallengeSolved) && (
                    <div
                      className={`rounded-lg p-3 text-xs leading-relaxed ${
                        isCurrentChallengeSolved || currentFeedback?.ok
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {currentFeedback?.text ||
                        activeScenario.challenge.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 15-MCQ SCENARIO TEST */}
      {activeTab === 'mcq' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'Core', 'Applied', 'Executive'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setMcqDifficultyFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer whitespace-nowrap shrink-0 ${
                    mcqDifficultyFilter === lvl
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lvl === 'all' ? 'All 15 Scenarios' : `${lvl} Level`}
                </button>
              ))}
            </div>

            {answeredCount > 0 && (
              <div className="flex items-center gap-2">
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake MCQ Test</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                      Reset MCQ answers?
                    </span>
                    <button
                      type="button"
                      onClick={handleResetTest}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {filteredMcqs.map(({ q, globalIdx }) => {
              const answered = bodyProgress.answeredMcqs.includes(q.id);
              const chosen = bodyProgress.mcqChoices[globalIdx] ?? -1;
              const isCorrect = bodyProgress.correctMcqs.includes(q.id);
              const hintVisible =
                revealedHintIds.includes(q.id) ||
                bodyProgress.hintUsedMcqs.includes(q.id);

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-colors ${
                    answered
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-teal-700 dark:text-teal-400">
                        Q{String(globalIdx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {q.topic}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{q.difficulty}</span>
                    </div>

                    {!answered && (
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedHintIds((prev) =>
                            prev.includes(q.id) ? prev : [...prev, q.id]
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>
                          {hintVisible
                            ? `Hint Shown (+${q.xpWithHint} XP)`
                            : `Use Hint (+${q.xpWithHint} XP vs +${q.xpClean} XP)`}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">
                      Real Scenario:
                    </strong>{' '}
                    {q.scenario}
                  </div>

                  <p className="text-sm sm:text-base font-bold text-slate-950 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  {hintVisible && !answered && (
                    <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{q.hint}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isThisCorrect = optIdx === q.correctIndex;
                      const isThisChosen = optIdx === chosen;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={answered || busyMcqId === q.id}
                          onClick={() => handleAnswerMcq(globalIdx, optIdx)}
                          className={`text-left px-4 py-3 rounded-xl border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                            answered
                              ? isThisCorrect
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold'
                                : isThisChosen
                                ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                                : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 text-slate-500'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                          }`}
                        >
                          <span className="font-mono font-bold shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1">{opt}</span>
                          {answered && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {answered && isThisChosen && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div
                      className={`rounded-xl p-3.5 text-xs leading-relaxed border ${
                        isCorrect
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                          : 'border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <strong className="font-mono uppercase mr-1.5">
                        {isCorrect ? 'Correct:' : 'Panel Debrief:'}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: 4 COLLECTIBLE PNG BADGES & OFFICIAL CERTIFICATE */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BODY_LANGUAGE_BADGES.map((badge) => {
              const unlocked = bodyProgress.unlockedBodyBadges.includes(
                badge.id
              );
              const pngUrl = unlocked
                ? buildBodyLanguageBadgePngDataUrl(
                    badge,
                    learnerName,
                    bodyProgress.bodyCertificateId
                  )
                : '';

              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
                    unlocked
                      ? 'border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-900'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-75'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Trophy
                        className={`w-5 h-5 ${
                          unlocked ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
                        }`}
                      />
                      {unlocked ? (
                        <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] font-mono text-slate-500">
                      {badge.criteriaLabel}
                    </div>
                    {unlocked && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            downloadDataUrl(
                              pngUrl,
                              `Badge-${badge.id}-Kapil.png`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] font-semibold cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>PNG</span>
                        </button>
                        {onRequestEmail && (
                          <button
                            type="button"
                            onClick={() => handleEmailBadge(badge.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-semibold cursor-pointer"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Official Certificate Preview + Download & Email */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CERT ID: {bodyProgress.bodyCertificateId}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  Official Certificate of Executive Body Language &amp; Presence
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Live-synced with your solved Action Labs ({solvedCount}/6) and
                  Body Language MCQs ({correctCount}/15).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {certificatePreviewUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      downloadDataUrl(
                        certificatePreviewUrl,
                        'Employability-Universe-Body-Language-Certificate-Kapil.png'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                )}
                {onRequestEmail && (
                  <button
                    type="button"
                    onClick={handleEmailCertificate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Certificate to {learnerEmail}</span>
                  </button>
                )}
              </div>
            </div>

            {certificatePreviewUrl && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 p-2">
                <img
                  src={certificatePreviewUrl}
                  alt="Body Language Official Certificate"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
