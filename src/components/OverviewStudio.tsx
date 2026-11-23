import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Flame,
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
  VIDEO_CASE_STUDIES,
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
import { getLevelTheme, getTrackTheme } from '../data/themeColors';
import {
  MASTER_TRACKS,
  MasterPillarId,
  MasterTrackId,
} from '../data/masterUniverseTypes';
import { MasterTrackScoreSummary } from '../data/masterUniverseData';
import {
  getTodayDateKey,
  NOV_23_DATE_KEY,
  NOV_23_PAPER_CODE,
  NOV_24_DATE_KEY,
  NOV_24_PAPER_CODE,
} from '../data/dailyMockData';
import { SectionAuditReport } from '../services/notificationService';
import {
  BODY_LANGUAGE_IMAGES,
  LANDING_SHOWCASE_IMAGES,
  PHOTO_ASSETS,
} from '../data/imageAssets';

export type AppView =
  | 'journey'
  | 'levels'
  | 'wheel'
  | 'shopping'
  | 'career'
  | 'body_language'
  | 'universe'
  | 'advanced'
  | 'daily_mock'
  | 'final'
  | 'achievements'
  | 'profile';

type HubCategoryFilter =
  | 'all'
  | 'visual_ai'
  | 'communication'
  | 'aptitude_verbal'
  | 'coding_cloud'
  | 'assessments';

interface CareerCategoryStat {
  answered: number;
  correct: number;
  total: number;
  accuracyPct: number;
}

interface OverviewStudioProps {
  learnerName: string;
  progress: LearnerProgressDoc;
  advCompletedCount?: number;
  advXp?: number;
  shopCompletedMcqs?: number;
  shopCorrectMcqs?: number;
  shopBadgesCount?: number;
  shopXp?: number;
  shopRoleplayScore?: number;
  careerAnswered?: number;
  careerCorrect?: number;
  careerXp?: number;
  bodySolvedCount?: number;
  bodyAnsweredCount?: number;
  bodyCorrectCount?: number;
  bodyXp?: number;
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
  dailyMockStatus?: 'not_started' | 'in_progress' | 'submitted';
  dailyMockScorePct?: number;
  dailyMockHardPct?: number;
  dailyMockStreak?: number;
  dailyMockPaperCode?: string;
  nov23Status?: 'not_started' | 'in_progress' | 'submitted';
  nov23ScorePct?: number;
  nov23HardPct?: number;
  nov24Status?: 'not_started' | 'in_progress' | 'submitted';
  nov24ScorePct?: number;
  nov24HardPct?: number;
  careerCategoryStats?: Record<CareerCategoryId, CareerCategoryStat>;
  masterTrackStats?: Record<MasterTrackId, MasterTrackScoreSummary>;
  sectionAudit?: SectionAuditReport;
  totalCombinedXp?: number;
  onNavigateView: (
    view: AppView,
    levelNum?: number,
    careerTab?: CareerCategoryId,
    masterPillar?: MasterPillarId,
    masterTrack?: MasterTrackId,
    mockDateKey?: string
  ) => void;
  learnerConnections: {
    id: string;
    picture: string;
    concept: string;
    explanation: string;
    authorName?: string;
  }[];
  onAddConnection: (
    picture: string,
    concept: string,
    explanation: string
  ) => Promise<void>;
  sharedVideoPosts: ConnectionPostDoc[];
  onSubmitVideoChallenge: (
    video: VideoCaseStudy,
    reflection: string
  ) => Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }>;
}

interface HubSectionCard {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  progressText: string;
  percent: number;
  completed: boolean;
  locked?: boolean;
  accentBar: string;
  accentText: string;
  image?: string;
  imageAlt?: string;
  onOpen: () => void;
}

const VIDEO_IDS_SET = new Set(VIDEO_CASE_STUDIES.map((v) => v.id));

export const OverviewStudio: React.FC<OverviewStudioProps> = ({
  learnerName,
  progress,
  advCompletedCount = 0,
  advXp = 0,
  shopCompletedMcqs = 0,
  shopCorrectMcqs = 0,
  shopBadgesCount = 0,
  shopXp = 0,
  shopRoleplayScore = 0,
  careerAnswered = 0,
  careerXp = 0,
  bodySolvedCount = 0,
  bodyAnsweredCount = 0,
  bodyCorrectCount = 0,
  bodyXp = 0,
  indianismScore = '0/15 Correct',
  interviewScore = '0/15 Correct',
  gdScore = '0/15 Correct',
  masterAnswered = 0,
  masterXp = 0,
  finalStatus = 'not_started',
  finalXp = 0,
  finalPassed = false,
  finalAttemptCount = 0,
  finalEligible = false,
  finalPrereqLabel = '0/4',
  dailyMockStatus = 'not_started',
  dailyMockScorePct = 0,
  dailyMockHardPct = 0,
  dailyMockStreak = 0,
  dailyMockPaperCode = '',
  nov23Status = 'not_started',
  nov23ScorePct = 0,
  nov23HardPct = 0,
  nov24Status = 'not_started',
  nov24ScorePct = 0,
  nov24HardPct = 0,
  careerCategoryStats,
  masterTrackStats,
  sectionAudit,
  totalCombinedXp,
  onNavigateView,
  learnerConnections,
  onAddConnection,
  sharedVideoPosts,
  onSubmitVideoChallenge,
}) => {
  const [selectedPairId, setSelectedPairId] = useState(
    CENTRAL_CONCEPT_PAIRS[1].id
  );
  const [revealedIds, setRevealedIds] = useState<string[]>([
    CENTRAL_CONCEPT_PAIRS[1].id,
  ]);
  const [categoryFilter, setCategoryFilter] =
    useState<HubCategoryFilter>('all');
  const [hideCompleted, setHideCompleted] = useState(false);

  const [customPicture, setCustomPicture] = useState('');
  const [customConcept, setCustomConcept] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submittingConnection, setSubmittingConnection] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const activePair =
    CENTRAL_CONCEPT_PAIRS.find((p) => p.id === selectedPairId) ??
    CENTRAL_CONCEPT_PAIRS[0];
  const isRevealed = revealedIds.includes(activePair.id);

  const rank = getLearnerRank(progress.xp);
  const nextLevel =
    LEVELS.find((lvl) => !progress.completedLevels.includes(lvl.level))?.level ??
    1;
  const completedCount = progress.completedLevels.length;
  const maxLevelXp = LEVELS.reduce((acc, l) => acc + l.xpReward, 0);

  const combinedXp =
    totalCombinedXp ??
    progress.xp + advXp + shopXp + careerXp + bodyXp + masterXp + finalXp;

  const overallPct =
    sectionAudit?.overallCompletionPct ??
    Math.round((completedCount / LEVELS.length) * 100);
  const nextRecommendedSection = sectionAudit?.missingOrIncompleteItems[0];

  const videoDoneCount = progress.completedWheelPrompts.filter((id) =>
    VIDEO_IDS_SET.has(id)
  ).length;
  const wheelTotalDone = progress.completedWheelPrompts.length;

  const findCategoryImage = (catId: string): { src: string; alt: string } => {
    const found = ACADEMY_CATEGORIES.find((c) => c.id === catId);
    return found
      ? { src: found.image, alt: found.imageAlt }
      : {
          src: PHOTO_ASSETS.crossroads.src,
          alt: PHOTO_ASSETS.crossroads.alt,
        };
  };

  // Build the 5 cleanly organized category groups with exact live completion status
  const visualAiCards: HubSectionCard[] = useMemo(() => {
    const pcImg = findCategoryImage('picture-connect');
    const levelsPct = Math.round((completedCount / 10) * 100);
    const advPct = Math.round((Math.min(25, advCompletedCount) / 25) * 100);
    const wheelPct = Math.min(100, Math.round((wheelTotalDone / 5) * 100));
    const videoPct = Math.round(
      (videoDoneCount / Math.max(1, VIDEO_CASE_STUDIES.length)) * 100
    );

    return [
      {
        id: 'sec-picture-connect',
        code: '01 · CORE STUDIO',
        title: 'Picture Connect (Levels 1–10)',
        subtitle: '100+ Placement Visual Scenarios · 10 Progressive Levels',
        description:
          'Sharpen executive observation, STAR storytelling, DSA whiteboard framing, workplace detective audits, and boardroom case analysis.',
        progressText: `${completedCount}/10 Levels`,
        percent: levelsPct,
        completed: completedCount >= 10,
        accentBar: 'from-blue-600 to-indigo-600',
        accentText: 'text-blue-700 dark:text-blue-400',
        image: pcImg.src,
        imageAlt: pcImg.alt,
        onOpen: () => onNavigateView('levels', nextLevel),
      },
      {
        id: 'sec-ai-advanced',
        code: '02 · AI STUDIO',
        title: 'AI Picture Connect — Advanced Track',
        subtitle: '5 Themes · 25 Visual Prompts · 100-Mark Auto-Scoring',
        description:
          'Generate and critique domain visuals across Products, Values, Abstract Thinking, Placements & Services with SCARE defense scoring.',
        progressText: `${advCompletedCount}/25 Scored · ${advXp} XP`,
        percent: advPct,
        completed: advCompletedCount >= 25,
        accentBar: 'from-violet-600 to-fuchsia-600',
        accentText: 'text-violet-700 dark:text-violet-400',
        image: PHOTO_ASSETS.placement_whiteboard_dsa.src,
        imageAlt: PHOTO_ASSETS.placement_whiteboard_dsa.alt,
        onOpen: () => onNavigateView('advanced'),
      },
      {
        id: 'sec-wheel',
        code: '03 · RAPID THINK',
        title: 'Spinning Wheel Quick-Think Lab',
        subtitle: 'Spontaneous Framing · Final Exam Prerequisite (5+)',
        description:
          'Spin real-time career prompts and publish crisp 60-second reflections to build spontaneous interview agility.',
        progressText: `${Math.min(5, wheelTotalDone)}/5 Reflections`,
        percent: wheelPct,
        completed: wheelTotalDone >= 5,
        accentBar: 'from-cyan-600 to-blue-600',
        accentText: 'text-cyan-700 dark:text-cyan-400',
        image: PHOTO_ASSETS.placement_career_fair.src,
        imageAlt: PHOTO_ASSETS.placement_career_fair.alt,
        onOpen: () => onNavigateView('wheel'),
      },
      {
        id: 'sec-videos',
        code: '04 · CASE FILMS',
        title: 'Video Case Studies & Reflections',
        subtitle: `${VIDEO_CASE_STUDIES.length} Curated Leadership Films · In-Portal Player`,
        description:
          'Watch curated real-world leadership films right inside the hub, spot unspoken human cues, and post your reflection.',
        progressText: `${videoDoneCount}/${VIDEO_CASE_STUDIES.length} Films Done`,
        percent: videoPct,
        completed: videoDoneCount >= VIDEO_CASE_STUDIES.length,
        accentBar: 'from-sky-600 to-indigo-500',
        accentText: 'text-sky-700 dark:text-sky-400',
        image: PHOTO_ASSETS.placement_waiting_corridor.src,
        imageAlt: PHOTO_ASSETS.placement_waiting_corridor.alt,
        onOpen: () => {
          const el = document.getElementById('video-case-studies');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      },
    ];
  }, [
    completedCount,
    advCompletedCount,
    advXp,
    wheelTotalDone,
    videoDoneCount,
    nextLevel,
    onNavigateView,
  ]);

  const communicationCards: HubSectionCard[] = useMemo(() => {
    const indStat = careerCategoryStats?.indianism;
    const intStat = careerCategoryStats?.interview;
    const gdStat = careerCategoryStats?.gd;
    const indImg = findCategoryImage('indianism');
    const intImg = findCategoryImage('interview-skills');
    const gdImg = findCategoryImage('gd-skills');
    const shopImg = findCategoryImage('shopping-negotiation');

    const shopComplete = shopCompletedMcqs >= 50 && shopRoleplayScore >= 60;
    const shopPct = Math.min(
      100,
      Math.round(
        (Math.min(50, shopCompletedMcqs) / 50) * 80 +
          (shopRoleplayScore >= 60 ? 20 : (shopRoleplayScore / 60) * 20)
      )
    );

    const bodyComplete = bodySolvedCount >= 6 && bodyAnsweredCount >= 15;
    const bodyPct = Math.min(
      100,
      Math.round(
        (Math.min(15, bodyAnsweredCount) / 15) * 70 +
          (Math.min(6, bodySolvedCount) / 6) * 30
      )
    );

    return [
      {
        id: 'sec-body-language',
        code: '01 · BODY LANGUAGE',
        title: 'Body Language & Executive Presence Studio',
        subtitle: '5 Real-Scene Images · 6 Action Labs · 15 MCQs · PNG Cert',
        description:
          'Master lobby walk-in, firm handshakes, open spine posture, webcam eye-line framing, GD listening, and stress composure cues.',
        progressText: `${bodySolvedCount}/6 Labs · ${bodyCorrectCount}/15 MCQs`,
        percent: bodyPct,
        completed: bodyComplete,
        accentBar: 'from-teal-600 to-cyan-500',
        accentText: 'text-teal-700 dark:text-teal-400',
        image: BODY_LANGUAGE_IMAGES.interview_posture.src,
        imageAlt: BODY_LANGUAGE_IMAGES.interview_posture.alt,
        onOpen: () => onNavigateView('body_language'),
      },
      {
        id: 'sec-indianism',
        code: '02 · GLOBAL ENGLISH',
        title: 'Indianism & Global Business English',
        subtitle: '15 Graded MCQs · Executive Replacement Playbooks',
        description:
          'Replace regional filler habits with crisp international corporate English for MNC interviews and client calls.',
        progressText: indStat
          ? `${indStat.answered}/${indStat.total} MCQs · ${indStat.correct} Correct`
          : indianismScore,
        percent: indStat
          ? Math.round((indStat.answered / indStat.total) * 100)
          : 0,
        completed: Boolean(indStat && indStat.answered >= indStat.total),
        accentBar: 'from-sky-600 to-cyan-500',
        accentText: 'text-sky-700 dark:text-sky-400',
        image: indImg.src,
        imageAlt: indImg.alt,
        onOpen: () => onNavigateView('career', undefined, 'indianism'),
      },
      {
        id: 'sec-interview',
        code: '03 · INTERVIEW PREP',
        title: 'Interview Skills & STAR Mastery',
        subtitle: '15 Graded MCQs · Behavioral & Salary Playbooks',
        description:
          'Structure high-conviction HR, behavioral STAR, weakness, and compensation responses with mentor-tested frameworks.',
        progressText: intStat
          ? `${intStat.answered}/${intStat.total} MCQs · ${intStat.correct} Correct`
          : interviewScore,
        percent: intStat
          ? Math.round((intStat.answered / intStat.total) * 100)
          : 0,
        completed: Boolean(intStat && intStat.answered >= intStat.total),
        accentBar: 'from-indigo-600 to-blue-600',
        accentText: 'text-indigo-700 dark:text-indigo-400',
        image: intImg.src,
        imageAlt: intImg.alt,
        onOpen: () => onNavigateView('career', undefined, 'interview'),
      },
      {
        id: 'sec-gd',
        code: '04 · GROUP DISCUSSION',
        title: 'Group Discussion (GD) Leadership',
        subtitle: '15 Graded MCQs · PESTLE & Consensus Playbooks',
        description:
          'Master structured opening frames, respectful rebuttals, inclusive moderation, and crisp 30-second closing summaries.',
        progressText: gdStat
          ? `${gdStat.answered}/${gdStat.total} MCQs · ${gdStat.correct} Correct`
          : gdScore,
        percent: gdStat
          ? Math.round((gdStat.answered / gdStat.total) * 100)
          : 0,
        completed: Boolean(gdStat && gdStat.answered >= gdStat.total),
        accentBar: 'from-teal-600 to-emerald-500',
        accentText: 'text-teal-700 dark:text-teal-400',
        image: gdImg.src,
        imageAlt: gdImg.alt,
        onOpen: () => onNavigateView('career', undefined, 'gd'),
      },
      {
        id: 'sec-shopping',
        code: '05 · NEGOTIATION',
        title: 'Shopping, Smart Buyer & Negotiation',
        subtitle: '50 MCQs · 25 Domain Cases · 6 Buyer Types · Role-Play Lab',
        description:
          'Learn buyer psychology, annual deal-timing calendars, 8-layer deal stacking, anti-scam audits, and live negotiation role-plays.',
        progressText: `${shopCompletedMcqs}/50 MCQs (${shopCorrectMcqs} Correct) · Lab ${shopRoleplayScore}/100`,
        percent: shopPct,
        completed: shopComplete,
        accentBar: 'from-emerald-600 to-teal-500',
        accentText: 'text-emerald-700 dark:text-emerald-400',
        image: shopImg.src,
        imageAlt: shopImg.alt,
        onOpen: () => onNavigateView('shopping'),
      },
    ];
  }, [
    bodySolvedCount,
    bodyAnsweredCount,
    bodyCorrectCount,
    careerCategoryStats,
    indianismScore,
    interviewScore,
    gdScore,
    shopCompletedMcqs,
    shopCorrectMcqs,
    shopRoleplayScore,
    onNavigateView,
  ]);

  const aptitudeVerbalTracks = useMemo(
    () => MASTER_TRACKS.filter((t) => t.pillarId === 'aptitude_grammar'),
    []
  );

  const codingCloudTracks = useMemo(
    () =>
      MASTER_TRACKS.filter(
        (t) => t.pillarId === 'coding_dsa' || t.pillarId === 'data_cloud'
      ),
    []
  );

  const assessmentCards: HubSectionCard[] = useMemo(() => {
    const localToday = getTodayDateKey();
    const isTodayNov23 = localToday === NOV_23_DATE_KEY;
    const isTodayNov24 = localToday === NOV_24_DATE_KEY;
    const nov24Done = nov24Status === 'submitted';
    const nov23Done = nov23Status === 'submitted';
    const dailyDone = dailyMockStatus === 'submitted';
    const finalPct = finalPassed
      ? 100
      : finalStatus === 'submitted'
      ? 60
      : finalStatus === 'in_progress'
      ? 50
      : 0;

    const nov24Card: HubSectionCard = {
      id: 'sec-nov24-mock',
      code: `01 · NOV 24 SPECIAL · ${NOV_24_PAPER_CODE}`,
      title: 'Nov 24, 2026 Body Language & Placement Sprint',
      subtitle: '40 Brand-New MCQs · Body Language + 7 Pillars · 20 Hard (50%)',
      description:
        'Brand-new Nov 24, 2026 full-length 7-pillar timed assessment integrating Executive Body Language scenarios alongside Coding, Aptitude, Grammar & Data.',
      progressText: nov24Done
        ? `Done · ${nov24ScorePct}% (Hard ${nov24HardPct}%)`
        : nov24Status === 'in_progress'
        ? 'Timer Running · Resume Now'
        : 'Live Now · 40 Fresh MCQs (+500 XP)',
      percent: nov24Done ? 100 : nov24Status === 'in_progress' ? 50 : 0,
      completed: nov24Done,
      accentBar: 'from-teal-600 to-emerald-500',
      accentText: 'text-teal-700 dark:text-teal-400',
      image: BODY_LANGUAGE_IMAGES.boardroom_presence.src,
      imageAlt: BODY_LANGUAGE_IMAGES.boardroom_presence.alt,
      onOpen: () =>
        onNavigateView(
          'daily_mock',
          undefined,
          undefined,
          undefined,
          undefined,
          NOV_24_DATE_KEY
        ),
    };

    const nov23Card: HubSectionCard = {
      id: 'sec-nov23-mock',
      code: `02 · NOV 23 SPECIAL · ${NOV_23_PAPER_CODE}`,
      title: 'Nov 23, 2026 Placement Sprint Assessment',
      subtitle: '40 Brand-New MCQs · 20 Hard (50%) + 20 Standard · 60 Min',
      description:
        'Dedicated Nov 23, 2026 full-length 7-pillar timed assessment with 40 fresh placement questions, instant scorecard & email summary.',
      progressText: nov23Done
        ? `Done · ${nov23ScorePct}% (Hard ${nov23HardPct}%)`
        : nov23Status === 'in_progress'
        ? 'Timer Running · Resume Now'
        : 'Live Now · 40 Fresh MCQs (+500 XP)',
      percent: nov23Done ? 100 : nov23Status === 'in_progress' ? 50 : 0,
      completed: nov23Done,
      accentBar: 'from-rose-600 to-amber-500',
      accentText: 'text-rose-700 dark:text-rose-400',
      image: PHOTO_ASSETS.placement_aptitude_desk.src,
      imageAlt: PHOTO_ASSETS.placement_aptitude_desk.alt,
      onOpen: () =>
        onNavigateView(
          'daily_mock',
          undefined,
          undefined,
          undefined,
          undefined,
          NOV_23_DATE_KEY
        ),
    };

    const dailyRotatingCard: HubSectionCard = {
      id: 'sec-daily-mock',
      code: dailyMockPaperCode
        ? `03 · DAILY MOCK · ${dailyMockPaperCode}`
        : '03 · DAILY MOCK',
      title: 'Daily 60-Min All-Topics Mock Test',
      subtitle: '40 MCQs · 50% Hard FAANG/MNC · Portal & Email Summary',
      description:
        'Daily rotating 60-minute exam covering all 7 Employability Universe pillars with instant topic analytics and email results.',
      progressText: dailyDone
        ? `Done Today · ${dailyMockScorePct}% (Hard ${dailyMockHardPct}%)`
        : dailyMockStatus === 'in_progress'
        ? 'Timer Running · Resume Now'
        : `Ready · Streak ${dailyMockStreak}d`,
      percent: dailyDone ? 100 : dailyMockStatus === 'in_progress' ? 50 : 0,
      completed: dailyDone,
      accentBar: 'from-rose-600 to-orange-500',
      accentText: 'text-rose-700 dark:text-rose-400',
      image: PHOTO_ASSETS.placement_aptitude_desk.src,
      imageAlt: PHOTO_ASSETS.placement_aptitude_desk.alt,
      onOpen: () =>
        onNavigateView(
          'daily_mock',
          undefined,
          undefined,
          undefined,
          undefined,
          localToday
        ),
    };

    const cards: HubSectionCard[] =
      isTodayNov23 || isTodayNov24
        ? [nov24Card, nov23Card]
        : [nov24Card, nov23Card, dailyRotatingCard];

    cards.push(
      {
        id: 'sec-final-capstone',
        code: '04 · PROCTORED CAPSTONE',
        title: 'Final Capstone Assessment (1000 XP) & LOR',
        subtitle: '90 Min · 10 Hard MCQs + 5 Visual Cases + Placement LOR PDF',
        description:
          'Proctored flagship evaluation unlocking the Official Final PNG Certificate and personalized Placement Letter of Recommendation.',
        progressText:
          finalStatus === 'submitted'
            ? finalPassed
              ? `Passed · ${finalXp}/1000 XP`
              : `Attempt ${finalAttemptCount}/2 (${finalXp} XP)`
            : finalEligible
            ? 'Unlocked · Ready (90 Min)'
            : `Locked · ${finalPrereqLabel} Prereqs`,
        percent: finalPct,
        completed: finalPassed,
        locked: finalStatus === 'not_started' && !finalEligible,
        accentBar: 'from-amber-600 to-orange-600',
        accentText: 'text-amber-700 dark:text-amber-400',
        image: LANDING_SHOWCASE_IMAGES.capstoneArena.src,
        imageAlt: LANDING_SHOWCASE_IMAGES.capstoneArena.alt,
        onOpen: () => onNavigateView('final'),
      },
      {
        id: 'sec-credentials',
        code: '05 · CREDENTIAL VAULT',
        title: 'Badges, PNG Certificates & Email Delivery',
        subtitle: `${progress.unlockedBadges.length}/${BADGES.length} Core Badges · ${shopBadgesCount}/10 Shop Badges · Direct Gmail`,
        description:
          'Download high-resolution PNG badges, verified certificates, and send credentials or LOR straight to your registered email.',
        progressText: `${combinedXp.toLocaleString()} Total XP`,
        percent: Math.round(
          (progress.unlockedBadges.length / Math.max(1, BADGES.length)) * 100
        ),
        completed: false,
        accentBar: 'from-slate-800 to-blue-700',
        accentText: 'text-slate-800 dark:text-slate-200',
        image: LANDING_SHOWCASE_IMAGES.credentialsShowcase.src,
        imageAlt: LANDING_SHOWCASE_IMAGES.credentialsShowcase.alt,
        onOpen: () => onNavigateView('achievements'),
      }
    );

    return cards;
  }, [
    nov24Status,
    nov24ScorePct,
    nov24HardPct,
    nov23Status,
    nov23ScorePct,
    nov23HardPct,
    dailyMockStatus,
    dailyMockPaperCode,
    dailyMockScorePct,
    dailyMockHardPct,
    dailyMockStreak,
    finalStatus,
    finalPassed,
    finalXp,
    finalAttemptCount,
    finalEligible,
    finalPrereqLabel,
    progress.unlockedBadges.length,
    shopBadgesCount,
    combinedXp,
    onNavigateView,
  ]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPicture.trim() || !customConcept.trim() || !customReason.trim())
      return;
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
        err instanceof Error
          ? err.message
          : 'Unable to save connection. Please try again.'
      );
    } finally {
      setSubmittingConnection(false);
    }
  };

  const renderSectionCard = (card: HubSectionCard) => {
    const done = card.completed;
    return (
      <button
        key={card.id}
        type="button"
        onClick={card.onOpen}
        className={`text-left rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
          done
            ? 'border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/45 opacity-70 hover:opacity-95'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-sm'
        }`}
      >
        <div>
          <div
            className={`h-1 w-full ${
              done
                ? 'bg-slate-300 dark:bg-slate-700'
                : `bg-gradient-to-r ${card.accentBar}`
            }`}
            aria-hidden="true"
          />
          {card.image && (
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <SmartImage
                src={card.image}
                alt={card.imageAlt || card.title}
                fallbackTitle={card.title}
                fallbackSubtitle={card.subtitle}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  done
                    ? 'grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-85'
                    : 'group-hover:scale-[1.02]'
                }`}
              />
            </div>
          )}

          <div className="p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span
                className={
                  done
                    ? 'font-semibold text-slate-400 dark:text-slate-500'
                    : `font-bold ${card.accentText}`
                }
              >
                {card.code}
              </span>
              {done ? (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              ) : card.locked ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                  <Lock className="w-3 h-3" />
                  <span>Prerequisites</span>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                  {card.percent}%
                </span>
              )}
            </div>

            <h3
              className={`font-display text-base font-bold leading-snug ${
                done
                  ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400/70'
                  : 'text-slate-950 dark:text-white'
              }`}
            >
              {card.title}
            </h3>

            <p
              className={`text-xs leading-relaxed ${
                done
                  ? 'text-slate-500 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {card.description}
            </p>
          </div>
        </div>

        <div className="px-5 pb-4 pt-2 space-y-2.5">
          <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                done
                  ? 'bg-slate-400 dark:bg-slate-600'
                  : `bg-gradient-to-r ${card.accentBar}`
              }`}
              style={{ width: `${Math.min(100, Math.max(0, card.percent))}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums truncate">
              {card.progressText}
            </span>
            <span
              className={`inline-flex items-center gap-1 font-semibold whitespace-nowrap shrink-0 ${
                done
                  ? 'text-slate-500 dark:text-slate-400'
                  : card.accentText
              }`}
            >
              <span>{done ? 'Review' : 'Open'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </button>
    );
  };

  const renderMasterTrackCard = (track: (typeof MASTER_TRACKS)[number]) => {
    const stat = masterTrackStats?.[track.id];
    const done = Boolean(stat?.completed);
    const answered = stat?.answered ?? 0;
    const correct = stat?.correct ?? 0;
    const total = stat?.total ?? 10;
    const pct = Math.round((answered / Math.max(1, total)) * 100);
    const tTheme = getTrackTheme(track.id);

    if (hideCompleted && done) return null;

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
        className={`text-left rounded-xl border overflow-hidden flex flex-col justify-between transition-all cursor-pointer group ${
          done
            ? 'border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/45 opacity-70 hover:opacity-95'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div
          className={`h-1 w-full ${
            done
              ? 'bg-slate-300 dark:bg-slate-700'
              : `bg-gradient-to-r ${tTheme.topBar}`
          }`}
          aria-hidden="true"
        />
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span
                className={
                  done
                    ? 'font-semibold text-slate-400 dark:text-slate-500'
                    : `font-bold ${tTheme.text}`
                }
              >
                {track.number}
              </span>
              {done ? (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Done</span>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                  {answered}/{total} MCQs
                </span>
              )}
            </div>
            <div
              className={`font-display text-sm font-bold leading-snug ${
                done
                  ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400/70'
                  : 'text-slate-950 dark:text-white'
              }`}
            >
              {track.shortTitle}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              Live Notes · 10 FAANG/MNC Problems · 10 MCQs
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  done ? 'bg-slate-400 dark:bg-slate-600' : tTheme.progressBar
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              <span>
                {correct}/{total} Correct
              </span>
              <span className={done ? 'text-slate-400' : `${tTheme.text} font-semibold`}>
                {done ? 'Review' : 'Study →'}
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  const countCompleted = (items: { completed: boolean }[]) =>
    items.filter((i) => i.completed).length;

  const aptDoneCount = aptitudeVerbalTracks.filter(
    (t) => masterTrackStats?.[t.id]?.completed
  ).length;
  const codeDoneCount = codingCloudTracks.filter(
    (t) => masterTrackStats?.[t.id]?.completed
  ).length;

  const visibleVisualCards = hideCompleted
    ? visualAiCards.filter((c) => !c.completed)
    : visualAiCards;
  const visibleCommCards = hideCompleted
    ? communicationCards.filter((c) => !c.completed)
    : communicationCards;
  const visibleAssessCards = hideCompleted
    ? assessmentCards.filter((c) => !c.completed)
    : assessmentCards;

  const categoryTabs: { id: HubCategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Categories (5)' },
    { id: 'visual_ai', label: 'Visual & AI' },
    { id: 'communication', label: 'Communication' },
    { id: 'aptitude_verbal', label: 'Aptitude & Verbal' },
    { id: 'coding_cloud', label: 'Coding & Cloud' },
    { id: 'assessments', label: 'Assessments' },
  ];

  return (
    <div className="space-y-12">
      {/* Executive Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-1">
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
              Welcome back,{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {learnerName}
              </span>
              . Every topic is organized into 5 clear career categories below—completed sections automatically gray out so you always know what to tackle next without losing any scores, XP, or certificates.
            </p>
          </div>

          {/* Unified Readiness & Resume Strip */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Learner Rank · Core &amp; Universe Mastery
                </div>
                <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  {rank.title}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Combined Universe XP
                </div>
                <div className="font-mono text-xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                  {combinedXp.toLocaleString()} XP
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-700 dark:bg-blue-500 transition-all duration-500"
                  style={{ width: `${Math.max(4, overallPct)}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>
                  Portal Readiness: {overallPct}% ({sectionAudit?.completedCount ?? 0}/
                  {sectionAudit?.totalCount ?? 8} Pillars Complete)
                </span>
                <span>
                  {completedCount}/10 Visual Levels · {masterAnswered}/160 Tech MCQs ·{' '}
                  {careerAnswered}/45 Career MCQs
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (nextRecommendedSection) {
                    onNavigateView(
                      nextRecommendedSection.targetView as AppView,
                      nextRecommendedSection.nextLevelNum
                    );
                  } else {
                    onNavigateView('levels', nextLevel);
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>
                  {nextRecommendedSection
                    ? `Resume: ${nextRecommendedSection.title.split('(')[0].trim()}`
                    : `Review Level ${nextLevel}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onNavigateView(
                    'daily_mock',
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    NOV_24_DATE_KEY
                  )
                }
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  nov24Status === 'submitted'
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                    : 'border-teal-300 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/30 hover:bg-teal-100/70 dark:hover:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                }`}
              >
                {nov24Status === 'submitted' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                <span>
                  {nov24Status === 'submitted'
                    ? `Nov 24 Mock Done (${nov24ScorePct}%)`
                    : 'Nov 24 Assessment (40 MCQs)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('body_language')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Body Language Lab</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateView('achievements')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Certificates</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Concept Spotlight Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <VisualArtwork
              id={activePair.artwork}
              photoKey={activePair.photoKey}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Central Concept Spotlight</span>
              <span className="font-mono tabular-nums">
                {maxLevelXp} Core Level XP
              </span>
            </div>
            <div className="text-xl font-display font-bold text-slate-950 dark:text-white">
              {activePair.pictureTitle} +{' '}
              {isRevealed ? activePair.abstractConcept : '???'}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isRevealed
                ? activePair.explanation
                : 'Before revealing the answer, pause for 10 seconds: what deep leadership or placement principle does this visual unlock?'}
            </p>
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleReveal(activePair.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
              >
                {isRevealed ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                <span>
                  {isRevealed ? 'Hide Concept Meaning' : 'Reveal Concept Meaning'}
                </span>
              </button>
              <span className="text-xs text-slate-400 font-mono truncate">
                {activePair.reflectionPrompt}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Learner Snapshot */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-slate-200 dark:border-slate-800 py-5">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Visual Levels Complete
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
            {completedCount} / 10
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            MCQs Completed (All Tracks)
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
            {masterAnswered + careerAnswered + shopCompletedMcqs + bodyAnsweredCount} / 270
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Mock Streak</span>
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-950 dark:text-white mt-1">
            {dailyMockStreak} day{dailyMockStreak === 1 ? '' : 's'}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Verified Certificate ID
          </div>
          <div className="font-mono tabular-nums text-sm sm:text-base font-bold text-blue-700 dark:text-blue-400 mt-2">
            {progress.certificateId}
          </div>
        </div>
      </section>

      {/* RE-ORGANIZED 5-CATEGORY EMPLOYABILITY DIRECTORY */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              Curriculum Organized by Category
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Completed sections and tracks are grayed out automatically for clear focus—click any card anytime to review notes, retake tests, or verify scores.
            </p>
          </div>

          {/* Hide/Show Completed Switcher */}
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setHideCompleted(false)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                !hideCompleted
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Show All (Gray Out Done)
            </button>
            <button
              type="button"
              onClick={() => setHideCompleted(true)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                hideCompleted
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Focus Incomplete Only
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categoryTabs.map((tab) => {
            const active = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-slate-900 dark:bg-blue-700 border-slate-900 dark:border-blue-700 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CATEGORY 01: Visual Thinking & AI Studio */}
        {(categoryFilter === 'all' || categoryFilter === 'visual_ai') && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  01. Visual Thinking &amp; AI Studio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Placement Picture Connect Levels 1–10, AI Visual Prompting Track, Spinning Wheel &amp; Film Case Studies.
                </p>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {countCompleted(visualAiCards)}/{visualAiCards.length} Completed
              </span>
            </div>

            {visibleVisualCards.length === 0 ? (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  All Visual Thinking &amp; AI sections are completed. Switch to &ldquo;Show All&rdquo; to review them anytime.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {visibleVisualCards.map(renderSectionCard)}
              </div>
            )}
          </div>
        )}

        {/* CATEGORY 02: Communication & Placement Readiness */}
        {(categoryFilter === 'all' || categoryFilter === 'communication') && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  02. Communication, Body Language &amp; Negotiation Readiness
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Visual Body Language Labs, Global Business English, STAR Interview Mastery, Group Discussion Leadership &amp; Smart Buyer Negotiation Lab.
                </p>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {countCompleted(communicationCards)}/{communicationCards.length}{' '}
                Completed
              </span>
            </div>

            {visibleCommCards.length === 0 ? (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  All Communication, Body Language &amp; Negotiation sections are completed.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleCommCards.map(renderSectionCard)}
              </div>
            )}
          </div>
        )}

        {/* CATEGORY 03: Aptitude & Verbal Foundation (7 Direct Tracks) */}
        {(categoryFilter === 'all' || categoryFilter === 'aptitude_verbal') && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  03. Aptitude &amp; Verbal Foundation (7 Tracks)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Quantitative Aptitude, Core Grammar, Parts of Speech, Syntax, Tenses, Punctuation &amp; Idioms — each with Live Notes, 10 FAANG/MNC Solved Problems &amp; 10 MCQs.
                </p>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {aptDoneCount}/{aptitudeVerbalTracks.length} Tracks Completed
              </span>
            </div>

            {hideCompleted && aptDoneCount === aptitudeVerbalTracks.length ? (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All 7 Aptitude &amp; Verbal tracks are completed.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {aptitudeVerbalTracks.map(renderMasterTrackCard)}
              </div>
            )}
          </div>
        )}

        {/* CATEGORY 04: Programming, DSA, Data & Cloud (9 Direct Tracks) */}
        {(categoryFilter === 'all' || categoryFilter === 'coding_cloud') && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  04. Programming, DSA, Data Analytics &amp; Cloud (9 Tracks)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  C, C++, Java, Python, Data Structures &amp; Algorithms, Excel, Power BI, DBMS &amp; SQL, and Cloud Computing with real FAANG/MNC solved questions.
                </p>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {codeDoneCount}/{codingCloudTracks.length} Tracks Completed
              </span>
            </div>

            {hideCompleted && codeDoneCount === codingCloudTracks.length ? (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All 9 Coding, Data &amp; Cloud tracks are completed.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {codingCloudTracks.map(renderMasterTrackCard)}
              </div>
            )}
          </div>
        )}

        {/* CATEGORY 05: Timed Assessments & Credentials */}
        {(categoryFilter === 'all' || categoryFilter === 'assessments') && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  05. Timed Assessments &amp; Verified Credentials
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily 60-Min Hard Mock Test, 90-Min Proctored Final Capstone (1000 XP), Placement LOR PDF &amp; Verified PNG Certificates.
                </p>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {countCompleted(assessmentCards)}/
                {assessmentCards.filter((c) => c.id !== 'sec-credentials').length}{' '}
                Exams Completed
              </span>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                visibleAssessCards.length >= 4
                  ? 'xl:grid-cols-4'
                  : 'lg:grid-cols-3'
              } gap-5`}
            >
              {visibleAssessCards.map(renderSectionCard)}
            </div>
          </div>
        )}
      </section>

      {/* 10-Level Visual Mastery Path (Completed Levels Grayed Out) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Picture Connect — 10-Level Visual Mastery Path
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Each level now includes +10 placement-oriented scenarios. Completed levels gray out automatically while remaining open for review.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            {completedCount}/10 Levels Completed
          </span>
        </div>

        {hideCompleted && completedCount >= LEVELS.length ? (
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              All 10 Picture Connect levels are completed. Switch to &ldquo;Show All&rdquo; above to revisit any level.
            </span>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {LEVELS.map((lvl) => {
            const done = progress.completedLevels.includes(lvl.level);
            const lvlTheme = getLevelTheme(lvl.level);
            if (hideCompleted && done) return null;
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => onNavigateView('levels', lvl.level)}
                className={`text-left rounded-xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  done
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/45 opacity-65 hover:opacity-95'
                    : `${lvlTheme.softBorder} ${lvlTheme.softSurface} ${lvlTheme.ringHover}`
                }`}
              >
                <div
                  className={`h-1 w-full ${
                    done
                      ? 'bg-slate-300 dark:bg-slate-700'
                      : `bg-gradient-to-r ${lvlTheme.topBar}`
                  }`}
                  aria-hidden="true"
                />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-xs font-bold ${
                        done
                          ? 'text-slate-400 dark:text-slate-500'
                          : lvlTheme.text
                      }`}
                    >
                      LEVEL {String(lvl.level).padStart(2, '0')}
                    </span>
                    {done ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span
                        className={`font-mono text-[11px] font-semibold ${lvlTheme.text} tabular-nums`}
                      >
                        +{lvl.xpReward} XP
                      </span>
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-display font-semibold text-sm leading-snug ${
                        done
                          ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400/70'
                          : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {lvl.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {lvl.skillTag}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        )}
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
                      {revealed ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
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
              <span>
                {submittingConnection ? 'Publishing...' : 'Add to Learner Wall'}
              </span>
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

      {/* Portal Video Case Studies & Challenges */}
      <div id="video-case-studies">
        <VideoChallengesSection
          mode="portal"
          completedVideoIds={progress.completedWheelPrompts}
          sharedVideoPosts={sharedVideoPosts}
          onSubmitChallenge={onSubmitVideoChallenge}
        />
      </div>
    </div>
  );
};
