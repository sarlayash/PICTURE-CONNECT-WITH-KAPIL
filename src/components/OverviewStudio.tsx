import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  FileCheck2,
  Lock,
  Plus,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  ACADEMY_CATEGORIES,
  BADGES,
  CENTRAL_CONCEPT_PAIRS,
  getLearnerRank,
  LEVELS,
  VideoCaseStudy,
  WORKSHOP_META,
} from '../data/workshopData';
import {
  ConnectionPostDoc,
  LearnerProgressDoc,
} from '../services/firestoreService';
import { FounderNoteSection } from './FounderNoteSection';
import { LiveClock } from './LiveClock';
import { SmartImage } from './SmartImage';
import { VisualArtwork } from './VisualArtwork';
import { VideoChallengesSection } from './VideoChallengesSection';

import { CareerCategoryId } from '../data/careerSkillsData';
import {
  getCategoryTheme,
  getLevelTheme,
  getTrackTheme,
} from '../data/themeColors';
import {
  MASTER_TRACKS,
  MasterPillarId,
  MasterTrackId,
} from '../data/masterUniverseTypes';

export type AppView =
  | 'journey'
  | 'levels'
  | 'wheel'
  | 'shopping'
  | 'career'
  | 'universe'
  | 'advanced'
  | 'final'
  | 'achievements';

interface OverviewStudioProps {
  learnerName: string;
  progress: LearnerProgressDoc;
  advCompletedCount?: number;
  advXp?: number;
  shopCompletedMcqs?: number;
  shopXp?: number;
  shopRoleplayScore?: number;
  careerAnswered?: number;
  careerCorrect?: number;
  careerXp?: number;
  indianismScore?: string;
  interviewScore?: string;
  gdScore?: string;
  masterAnswered?: number;
  masterCorrect?: number;
  masterXp?: number;
  aptitudeGrammarScore?: string;
  codingDsaScore?: string;
  dataCloudScore?: string;
  finalStatus?: 'not_started' | 'in_progress' | 'submitted';
  finalXp?: number;
  finalPassed?: boolean;
  finalAttemptCount?: number;
  finalEligible?: boolean;
  finalPrereqLabel?: string;
  onNavigateView: (
    view: AppView,
    levelNum?: number,
    careerTab?: CareerCategoryId,
    masterPillar?: MasterPillarId,
    masterTrack?: MasterTrackId
  ) => void;
  learnerConnections: {
    id: string;
    picture: string;
    concept: string;
    explanation: string;
    authorName?: string;
  }[];
  onAddConnection: (picture: string, concept: string, explanation: string) => Promise<void>;
  sharedVideoPosts: ConnectionPostDoc[];
  onSubmitVideoChallenge: (
    video: VideoCaseStudy,
    reflection: string
  ) => Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }>;
}

export const OverviewStudio: React.FC<OverviewStudioProps> = ({
  learnerName,
  progress,
  advCompletedCount = 0,
  advXp = 0,
  shopCompletedMcqs = 0,
  shopXp = 0,
  shopRoleplayScore = 0,
  careerAnswered = 0,
  careerCorrect = 0,
  careerXp = 0,
  indianismScore = '0/15 MCQs',
  interviewScore = '0/15 MCQs',
  gdScore = '0/15 MCQs',
  masterAnswered = 0,
  masterCorrect = 0,
  masterXp = 0,
  aptitudeGrammarScore = '0/40 Correct',
  codingDsaScore = '0/40 Correct',
  dataCloudScore = '0/40 Correct',
  finalStatus = 'not_started',
  finalXp = 0,
  finalPassed = false,
  finalAttemptCount = 0,
  finalEligible = false,
  finalPrereqLabel = '0/4',
  onNavigateView,
  learnerConnections,
  onAddConnection,
  sharedVideoPosts,
  onSubmitVideoChallenge,
}) => {
  const [selectedPairId, setSelectedPairId] = useState(CENTRAL_CONCEPT_PAIRS[1].id);
  const [revealedIds, setRevealedIds] = useState<string[]>([CENTRAL_CONCEPT_PAIRS[1].id]);
  const [customPicture, setCustomPicture] = useState('');
  const [customConcept, setCustomConcept] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submittingConnection, setSubmittingConnection] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const activePair =
    CENTRAL_CONCEPT_PAIRS.find((p) => p.id === selectedPairId) ?? CENTRAL_CONCEPT_PAIRS[0];
  const isRevealed = revealedIds.includes(activePair.id);

  const rank = getLearnerRank(progress.xp);
  const nextLevel =
    LEVELS.find((lvl) => !progress.completedLevels.includes(lvl.level))?.level ?? 1;
  const completedCount = progress.completedLevels.length;
  const maxLevelXp = LEVELS.reduce((acc, l) => acc + l.xpReward, 0);
  const completionPct = Math.round((completedCount / LEVELS.length) * 100);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPicture.trim() || !customConcept.trim() || !customReason.trim()) return;
    setSubmittingConnection(true);
    setConnectionError(null);
    try {
      await onAddConnection(
        customPicture.trim(),
        customConcept.trim(),
        customReason.trim()
      );
      setCustomPicture('');
      setCustomConcept('');
      setCustomReason('');
    } catch (err) {
      setConnectionError(
        err instanceof Error ? err.message : 'Unable to save connection. Please try again.'
      );
    } finally {
      setSubmittingConnection(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{WORKSHOP_META.institution}</span>
                <span aria-hidden="true">·</span>
                <span>{WORKSHOP_META.positioning}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  {WORKSHOP_META.poweredBy}
                </span>
              </div>
              <LiveClock />
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.08] [text-wrap:balance]">
              {WORKSHOP_META.title}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Welcome, <span className="font-semibold text-slate-900 dark:text-white">{learnerName}</span>.{' '}
              Your one-stop mastery portal for{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                Picture Connect, Shopping &amp; Negotiation, Indianism, Interview &amp; GD, Aptitude &amp; Grammar, C/C++/Java/DSA, Excel, Power BI, DBMS &amp; Cloud Computing
              </span>{' '}
              — with verified PNG badges, certificates &amp; Placement LOR PDF.
            </p>
          </div>

          {/* Learner Progress Strip */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Current Rank
                </div>
                <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  {rank.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Earned XP
                </div>
                <div className="font-mono text-xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                  {progress.xp} XP
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                  style={{ width: `${Math.max(4, completionPct)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>
                  {completedCount}/10 Levels Complete ({completionPct}%)
                </span>
                <span>
                  {rank.nextTitle
                    ? `${Math.max(0, (rank.nextXp ?? 0) - progress.xp)} XP to ${rank.nextTitle}`
                    : 'Peak Scholar Rank Achieved'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigateView('levels', nextLevel)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span>
                  {completedCount === 10
                    ? 'Review Levels 1–10'
                    : `Start Level ${nextLevel}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateView('wheel')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Spin the Wheel</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateView('achievements')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>PNG Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Concept Spotlight Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <VisualArtwork id={activePair.artwork} photoKey={activePair.photoKey} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Central Concept Spotlight</span>
              <span className="font-mono tabular-nums">
                {maxLevelXp} Level XP Available
              </span>
            </div>
            <div className="text-xl font-display font-bold text-slate-950 dark:text-white">
              {activePair.pictureTitle} + {isRevealed ? activePair.abstractConcept : '???'}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isRevealed
                ? activePair.explanation
                : 'Before revealing the answer, pause for 10 seconds: what deep leadership or career principle does this visual unlock?'}
            </p>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleReveal(activePair.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isRevealed ? 'Hide Concept Meaning' : 'Reveal Concept Meaning'}</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">
                {activePair.reflectionPrompt.slice(0, 42)}...
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Learner Snapshot */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-slate-200 dark:border-slate-800 py-5">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Levels Completed</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
            {completedCount} / 10
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Badges Unlocked</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
            {progress.unlockedBadges.length} / {BADGES.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Wheel Spins</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
            {progress.wheelSpins}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Certificate ID</div>
          <div className="font-mono tabular-nums text-sm sm:text-base font-bold text-blue-700 dark:text-blue-400 mt-2">
            {progress.certificateId}
          </div>
        </div>
      </section>

      {/* Interactive 9-Category Employability Universe Directory */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              EMPLOYABILITY UNIVERSE — Choose Your Track
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              One-stop placement mastery across Communication, Aptitude &amp; Grammar, C/C++/Java/DSA, Excel, Power BI, DBMS, Cloud &amp; Capstone.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            9 Master Categories · Live Progress Sync
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACADEMY_CATEGORIES.map((cat) => {
            const liveStatus =
              cat.id === 'picture-connect'
                ? `${completedCount}/10 Levels · ${advCompletedCount}/25 AI`
                : cat.id === 'shopping-negotiation'
                ? `${shopCompletedMcqs}/20 MCQs · Lab ${shopRoleplayScore}/100`
                : cat.id === 'indianism'
                ? indianismScore
                : cat.id === 'interview-skills'
                ? interviewScore
                : cat.id === 'gd-skills'
                ? gdScore
                : cat.id === 'aptitude-grammar'
                ? aptitudeGrammarScore
                : cat.id === 'coding-dsa'
                ? codingDsaScore
                : cat.id === 'data-cloud'
                ? dataCloudScore
                : finalStatus === 'submitted'
                ? finalPassed
                  ? `Passed · ${finalXp} XP`
                  : `Attempt ${finalAttemptCount}/2 (${finalXp} XP)`
                : finalEligible
                ? 'Capstone Ready · 90 Min'
                : `${finalPrereqLabel} Prereqs · Video Films`;

            const theme = getCategoryTheme(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onNavigateView(
                    cat.targetView,
                    undefined,
                    cat.careerTab,
                    cat.masterPillar
                  )
                }
                className={`text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${theme.ringHover} overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:shadow-md`}
              >
                <div>
                  <div
                    className={`h-1 w-full bg-gradient-to-r ${theme.topBar}`}
                    aria-hidden="true"
                  />
                  <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                    <SmartImage
                      src={cat.image}
                      alt={cat.imageAlt}
                      fallbackTitle={cat.title}
                      fallbackSubtitle={cat.subtitle}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className={`font-bold ${theme.text}`}>
                        {cat.number}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                        {liveStatus}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className={`mx-5 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold ${theme.text}`}>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    {cat.highlights}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Isolated 12-Track Master Tech, Data, Aptitude & Grammar Universe Launch Strip */}
      <section className="rounded-2xl border border-blue-300 dark:border-blue-800/80 bg-gradient-to-r from-[#0B1733] via-[#10224A] to-[#172C5E] text-white p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-mono font-bold text-sky-400">
              ONE-STOP MASTER HUB · 12 SUBJECT TRACKS · 72 PLAYBOOKS · 120 MCQS · 8 BADGES + PNG CERT
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Aptitude, Grammar, C, C++, Java, DSA, Excel, Power BI, DBMS &amp; Cloud
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every core technical &amp; aptitude subject recruiters test — structured in Kapil’s signature Study Playbook + Hinted MCQ + Retake + PNG Badge &amp; Official Certificate format without impacting your existing progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="text-left sm:text-right font-mono">
              <div className="text-[11px] text-slate-300">
                UNIVERSE TECH PROGRESS
              </div>
              <div className="text-sm font-bold text-sky-300 tabular-nums">
                {masterAnswered}/120 MCQs ({masterCorrect} Correct) · {masterXp} XP
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateView('universe', undefined, undefined, 'aptitude_grammar')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Open 12-Track Master Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/15">
          {MASTER_TRACKS.map((track) => {
            const tTheme = getTrackTheme(track.id);
            return (
              <button
                key={track.id}
                type="button"
                onClick={() =>
                  onNavigateView(
                    'universe',
                    undefined,
                    undefined,
                    track.pillarId,
                    track.id
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-semibold text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className={tTheme.textDarkLanding}>{track.number}</span>{' '}
                {track.shortTitle}
              </button>
            );
          })}
        </div>
      </section>

      {/* Isolated Career & Placement MCQ Academy (Indianism · Interview Skills · GD Skills) */}
      <section className="rounded-2xl border border-sky-200 dark:border-sky-900/70 bg-gradient-to-r from-[#F4F9FF] via-white to-violet-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-sky-950/30 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">
            NEW MCQ ACADEMY · 45 GRADED MCQS + 28 PLAYBOOKS + 6 BADGES + PNG CERT
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
            Indianism, Interview Skills &amp; GD Skills Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminate Indianisms with global business English, ace behavioral STAR interviews &amp; salary rounds, and lead structured Group Discussions across 3 interactive MCQ tests with hints, explanations, retakes &amp; downloadable PNG credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-left sm:text-right font-mono">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              CAREER MCQ PROGRESS
            </div>
            <div className="text-sm font-bold text-sky-700 dark:text-sky-400 tabular-nums">
              {careerAnswered}/45 MCQs ({careerCorrect} Correct) · {careerXp} XP
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('career', undefined, 'indianism')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Career MCQ Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Isolated AI-Powered Advanced Track Launch Strip */}
      <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-gradient-to-r from-[#FDFBF5] via-white to-indigo-50/70 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
            NEW SEPARATE JOURNEY · ZERO IMPACT ON CORE XP OR LEVELS
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
            AI-Powered Picture Connect — Advanced Track
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            5 Themes (Products, Values, Abstract Thinking, Placements, Services), 25 visual prompt briefs, image upload, 125 questions, instant 100-mark auto-scoring, and dedicated Advanced PNG Badges &amp; Certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-left sm:text-right font-mono">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              ADVANCED PROGRESS
            </div>
            <div className="text-sm font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
              {advCompletedCount}/25 Challenges · {advXp} Adv XP
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('advanced')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open AI Advanced Track</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Isolated Shopping & Negotiation Skills Module (FACE Konfi-07) */}
      <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/70 bg-gradient-to-r from-[#F7FDF9] via-white to-blue-50/70 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/20 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
            NEW SKILL LEVEL · FACE KONFI-07 SOLVED EXAMPLES + HINTED MCQS + PNG CERT
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
            Shopping &amp; Negotiation Skills Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Master all 42 FACE Konfi-07 shopping riddles (38 solved examples), 20 hint-assisted MCQs, an interactive Negotiation Role-Play Lab (Courteousness, Logic, Persuasion, Convincing, Precision), 6 PNG Badges &amp; PNG Certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-left sm:text-right font-mono">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              NEGOTIATION PROGRESS
            </div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {shopCompletedMcqs}/20 MCQs · Lab {shopRoleplayScore}/100 · {shopXp} XP
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('shopping')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Shopping &amp; Negotiation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Isolated 90-Minute 1000 XP Proctored Final Capstone Assessment */}
      <section className="rounded-2xl border border-amber-300/80 dark:border-amber-800/70 bg-gradient-to-r from-[#FFFDF7] via-white to-blue-50/70 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950/30 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
            1000 XP PROCTORED CAPSTONE · 90 MINUTES · 50% ELEVATED RIGOR
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
            Final Capstone Assessment &amp; Placement LOR (PDF)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            10 non-repeated hard MCQs (400 XP), 5 new visual case studies across FinTech, EV, Healthcare, SaaS &amp; Placement Panel (500 XP), SCARE defense (100 XP), automatic scoring, Final PNG Certificate, and personalized Placement Letter of Recommendation (PDF).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-left sm:text-right font-mono">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              FINAL ASSESSMENT STATUS
            </div>
            <div className="text-sm font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {finalStatus === 'submitted'
                ? finalPassed
                  ? `Passed · ${finalXp}/1000 XP`
                  : finalAttemptCount < 2
                  ? `Attempt 1/2 (${finalXp} XP) · Retake Open`
                  : `Attempt ${finalAttemptCount}/2 (${finalXp} XP) · Contact Admin`
                : finalStatus === 'in_progress'
                ? `Attempt ${Math.max(1, finalAttemptCount)} Clock Active`
                : finalEligible
                ? 'Ready to Begin · 90:00 Min'
                : `Locked · ${finalPrereqLabel} Prerequisites`}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('final')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {finalStatus === 'not_started' && !finalEligible ? (
              <Lock className="w-4 h-4" />
            ) : (
              <FileCheck2 className="w-4 h-4" />
            )}
            <span>
              {finalStatus === 'submitted'
                ? finalPassed
                  ? 'View Score, Cert & LOR PDF'
                  : finalAttemptCount < 2
                  ? 'Review & Start Attempt 2/2'
                  : 'View Score & Mentor Guidance'
                : finalStatus === 'in_progress'
                ? 'Resume 90-Min Exam'
                : finalEligible
                ? 'Open 90-Min Final Assessment'
                : 'View Prerequisite Checklist'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Levels 1 to 10 Progression Grid */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Your 10-Level Visual Mastery Path
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Every level builds a sharper workplace communication habit. Jump into any stage below.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            {WORKSHOP_META.pillars.join(' · ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {LEVELS.map((lvl) => {
            const done = progress.completedLevels.includes(lvl.level);
            const lvlTheme = getLevelTheme(lvl.level);
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => onNavigateView('levels', lvl.level)}
                className={`text-left rounded-xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  done
                    ? 'border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500'
                    : `${lvlTheme.softBorder} ${lvlTheme.softSurface} ${lvlTheme.ringHover}`
                }`}
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r ${lvlTheme.topBar}`}
                  aria-hidden="true"
                />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono text-xs font-bold ${lvlTheme.text}`}>
                      LEVEL {String(lvl.level).padStart(2, '0')}
                    </span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className={`font-mono text-[11px] font-semibold ${lvlTheme.text} tabular-nums`}>
                        +{lvl.xpReward} XP
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-slate-950 dark:text-white leading-snug">
                      {lvl.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {lvl.skillTag}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Founder's Note from Employability Universe Architect — Kapil */}
      <FounderNoteSection variant="portal" />

      {/* Central Concept Explorer + Shared Learner Wall */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              The Central Concept: Explain the Unseen Link
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Explore the 6 signature visual metaphors and publish your own original connection to the live learner board.
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            6 Core Metaphors · {learnerConnections.length} Learner Links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CENTRAL_CONCEPT_PAIRS.map((pair) => {
            const revealed = revealedIds.includes(pair.id);
            const selected = selectedPairId === pair.id;
            return (
              <div
                key={pair.id}
                onClick={() => setSelectedPairId(pair.id)}
                className={`rounded-xl border p-4 transition-colors cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 ${
                  selected
                    ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
                  <VisualArtwork id={pair.artwork} photoKey={pair.photoKey} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-semibold text-base text-slate-950 dark:text-white">
                      {pair.pictureTitle}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReveal(pair.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer shrink-0"
                    >
                      {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{revealed ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </div>

                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Connected Concept:{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {revealed ? pair.abstractConcept : 'Click Reveal'}
                    </span>
                  </div>

                  {revealed && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {pair.explanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Learner Connection Studio */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleSaveCustom} className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                Publish Your Own Metaphor Connection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pick any everyday object, pair it with an abstract mindset, and explain the logic in 1–2 sentences.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Everyday Picture
                </label>
                <input
                  type="text"
                  value={customPicture}
                  onChange={(e) => setCustomPicture(e.target.value)}
                  placeholder="e.g., A Keyhole"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Abstract Concept
                </label>
                <input
                  type="text"
                  value={customConcept}
                  onChange={(e) => setCustomConcept(e.target.value)}
                  placeholder="e.g., Curiosity"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Explain the Connection
              </label>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Why do these two ideas belong together?"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            {connectionError && (
              <div className="p-2.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
                {connectionError}
              </div>
            )}
            <button
              type="submit"
              disabled={submittingConnection}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submittingConnection ? 'Publishing...' : 'Add to Learner Wall'}</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Learner Connections ({learnerConnections.length})
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Synced via Google Sign-In</span>
              </span>
            </div>
            {learnerConnections.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                No custom connections published yet. Be the first learner to add an everyday object + mindset link!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {learnerConnections.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>
                          {item.picture} + {item.concept}
                        </span>
                      </div>
                      {item.authorName && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                          {item.authorName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Portal Video Case Studies & Challenges (Watch Directly Inside Portal) */}
      <VideoChallengesSection
        mode="portal"
        completedVideoIds={progress.completedWheelPrompts}
        sharedVideoPosts={sharedVideoPosts}
        onSubmitChallenge={onSubmitVideoChallenge}
      />
    </div>
  );
};
