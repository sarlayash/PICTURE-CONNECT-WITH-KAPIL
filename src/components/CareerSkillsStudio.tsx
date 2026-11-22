import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  HelpCircle,
  Lightbulb,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  CAREER_BADGES,
  CAREER_MCQS,
  CAREER_SKILL_CATEGORIES,
  CAREER_SKILLS_META,
  CAREER_STUDY_CARDS,
  CareerBadgeDefinition,
  CareerCategoryId,
  computeCareerCategoryStats,
  getCareerSkillsRank,
} from '../data/careerSkillsData';
import {
  CareerSkillsProgressDoc,
  markCareerTopicStudied,
  resetCareerCategoryTest,
  submitCareerMcqAnswer,
} from '../services/careerSkillsFirestoreService';
import { buildCredentialEmailHtml } from '../services/gmailService';
import { getCareerTheme } from '../data/themeColors';
import { buildCareerCertificateDataUrl } from '../utils/credentialGenerators';
import { EmailCredentialRequest } from './EmailCredentialModal';
import { SmartImage } from './SmartImage';

interface CareerSkillsStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  careerProgress: CareerSkillsProgressDoc;
  initialTab?: CareerCategoryId | 'credentials';
  onActiveTabChange?: (tab: CareerCategoryId | 'credentials') => void;
  onRequestEmail?: (req: EmailCredentialRequest) => void;
}

type ActiveStudioTab = CareerCategoryId | 'credentials';
type CategoryInnerMode = 'mcq' | 'study';

const BADGE_PALETTES: Record<
  CareerBadgeDefinition['accent'],
  { primary: string; glow: string; softBg: string }
> = {
  blue: {
    primary: '#2563EB',
    glow: '#60A5FA',
    softBg:
      'border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30',
  },
  emerald: {
    primary: '#059669',
    glow: '#34D399',
    softBg:
      'border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30',
  },
  amber: {
    primary: '#D97706',
    glow: '#FBBF24',
    softBg:
      'border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30',
  },
  violet: {
    primary: '#7C3AED',
    glow: '#A78BFA',
    softBg:
      'border-violet-200 dark:border-violet-900 bg-violet-50/70 dark:bg-violet-950/30',
  },
  rose: {
    primary: '#E11D48',
    glow: '#FB7185',
    softBg:
      'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30',
  },
  cyan: {
    primary: '#0891B2',
    glow: '#22D3EE',
    softBg:
      'border-cyan-200 dark:border-cyan-900 bg-cyan-50/70 dark:bg-cyan-950/30',
  },
};

function renderCareerBadgePng(
  badge: CareerBadgeDefinition,
  learnerName: string,
  certId: string,
  issueDate: string
): string {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const palette = BADGE_PALETTES[badge.accent] || BADGE_PALETTES.blue;

  const bg = ctx.createRadialGradient(S / 2, 420, 80, S / 2, S / 2, 760);
  bg.addColorStop(0, '#0F244D');
  bg.addColorStop(0.55, '#08132B');
  bg.addColorStop(1, '#040915');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(200, 155, 60, 0.72)';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, S - 88, S - 88);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, S - 124, S - 124);

  ctx.textAlign = 'center';
  ctx.fillStyle = palette.glow;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('EMPLOYABILITY UNIVERSE WITH KAPIL · CAREER MCQ BADGE', S / 2, 128);

  const cx = S / 2;
  const cy = 430;
  const outerR = 235;

  const aura = ctx.createRadialGradient(cx, cy, 110, cx, cy, 325);
  aura.addColorStop(0, `${palette.primary}66`);
  aura.addColorStop(1, 'transparent');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 325, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#071127';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#C89B3C';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 22, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = palette.glow;
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('VERIFIED', cx, cy - 28);
  ctx.fillStyle = palette.glow;
  ctx.font = '800 40px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CAREER SKILL', cx, cy + 28);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText('INDIANISM · INTERVIEW · GD', cx, cy + 72);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 50px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.title, S / 2, 765, S - 180);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 25px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.criteriaLabel, S / 2, 825, S - 180);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 21px "JetBrains Mono", monospace';
  ctx.fillText('AWARDED TO', S / 2, 915);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(learnerName, S / 2, 975, S - 180);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 19px "JetBrains Mono", monospace';
  ctx.fillText(
    `POWERED BY KAPIL  ·  ${issueDate}  ·  ${certId}`,
    S / 2,
    1080,
    S - 140
  );

  return canvas.toDataURL('image/png');
}

export const CareerSkillsStudio: React.FC<CareerSkillsStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  careerProgress,
  initialTab = 'indianism',
  onActiveTabChange,
  onRequestEmail,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveStudioTab>(initialTab);
  const [innerMode, setInnerMode] = useState<CategoryInnerMode>('mcq');
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});
  const [mcqBusyId, setMcqBusyId] = useState<string | null>(null);
  const [resetConfirmCat, setResetConfirmCat] =
    useState<CareerCategoryId | null>(null);
  const [resetBusy, setResetBusy] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const catStats = useMemo(
    () =>
      computeCareerCategoryStats({
        answeredMcqs: careerProgress.answeredMcqs,
        correctMcqs: careerProgress.correctMcqs,
        hintUsedMcqs: careerProgress.hintUsedMcqs,
      }),
    [
      careerProgress.answeredMcqs,
      careerProgress.correctMcqs,
      careerProgress.hintUsedMcqs,
    ]
  );

  const rank = getCareerSkillsRank(careerProgress.careerXp);
  const totalAnswered = careerProgress.answeredMcqs.length;
  const totalCorrect = careerProgress.correctMcqs.length;
  const overallAccuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const activeCategoryDef =
    activeTab !== 'credentials'
      ? CAREER_SKILL_CATEGORIES.find((c) => c.id === activeTab) ??
        CAREER_SKILL_CATEGORIES[0]
      : null;

  const categoryMcqs = useMemo(() => {
    if (activeTab === 'credentials') return [];
    return CAREER_MCQS.map((item, globalIndex) => ({
      item,
      globalIndex,
    })).filter((entry) => entry.item.category === activeTab);
  }, [activeTab]);

  const categoryStudyCards = useMemo(() => {
    if (activeTab === 'credentials') return [];
    return CAREER_STUDY_CARDS.filter((card) => card.category === activeTab);
  }, [activeTab]);

  const handleMarkStudied = async (topicId: string) => {
    setErrorMsg(null);
    try {
      const res = await markCareerTopicStudied({
        user,
        current: careerProgress,
        topicId,
      });
      if (res.newlyAwardedXp > 0) {
        setToastMsg(
          `Playbook studied! +${res.newlyAwardedXp} Career XP${
            res.newlyUnlockedBadges.length > 0 ? ' · New badge unlocked!' : ''
          }`
        );
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to save playbook progress.'
      );
    }
  };

  const handleAnswerMcq = async (
    globalIndex: number,
    chosenOption: number,
    mcqId: string
  ) => {
    setMcqBusyId(mcqId);
    setErrorMsg(null);
    try {
      const usedHint = Boolean(visibleHints[mcqId]);
      const res = await submitCareerMcqAnswer({
        user,
        current: careerProgress,
        mcqIndex: globalIndex,
        chosenOption,
        usedHint,
      });
      setToastMsg(
        res.isCorrect
          ? `Correct! +${res.newlyAwardedXp} Career XP${
              usedHint ? ' (hint used)' : ' (clean answer)'
            }${
              res.newlyUnlockedBadges.length > 0 ? ' · New badge unlocked!' : ''
            }`
          : `Answer recorded (+${res.newlyAwardedXp} XP effort credit). Review the rationale below.`
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to save MCQ answer.'
      );
    } finally {
      setMcqBusyId(null);
    }
  };

  const handleConfirmResetCategory = async (category: CareerCategoryId) => {
    setResetBusy(true);
    setErrorMsg(null);
    try {
      await resetCareerCategoryTest({
        user,
        current: careerProgress,
        category,
      });
      setVisibleHints((prev) => {
        const next = { ...prev };
        CAREER_MCQS.filter((q) => q.category === category).forEach((q) => {
          delete next[q.id];
        });
        return next;
      });
      setResetConfirmCat(null);
      setToastMsg(
        `${
          CAREER_SKILL_CATEGORIES.find((c) => c.id === category)?.shortTitle ??
          'Category'
        } MCQ test reset. Ready for a fresh attempt!`
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to reset category test.'
      );
    } finally {
      setResetBusy(false);
    }
  };

  const issueDate = new Date().toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadBadgePng = (badge: CareerBadgeDefinition) => {
    const dataUrl = renderCareerBadgePng(
      badge,
      learnerName,
      careerProgress.careerCertificateId,
      issueDate
    );
    if (!dataUrl) return;
    const safeName = badge.title.replace(/[^a-zA-Z0-9]+/g, '-');
    const link = document.createElement('a');
    link.download = `Badge-${safeName}-Kapil.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCertificatePng = () => {
    setDownloadingCert(true);
    try {
      const canvas = certCanvasRef.current || document.createElement('canvas');
      const W = 2400;
      const H = 1700;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#FDFCF8');
      grad.addColorStop(0.5, '#FFFFFF');
      grad.addColorStop(1, '#EFF6FF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#0B1733';
      ctx.lineWidth = 22;
      ctx.strokeRect(54, 54, W - 108, H - 108);

      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 6;
      ctx.strokeRect(86, 86, W - 172, H - 172);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#1D4ED8';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText(
        'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  CAREER & PLACEMENT MCQ ACADEMY',
        W / 2,
        210
      );

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 70px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CERTIFICATE OF PLACEMENT COMMUNICATION', W / 2, 315);

      ctx.fillStyle = '#C89B3C';
      ctx.fillRect(W / 2 - 240, 352, 480, 4);

      ctx.fillStyle = '#334155';
      ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'Indianism & Global English · Interview Skills · Group Discussion (GD) Mastery',
        W / 2,
        422
      );

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "JetBrains Mono", monospace';
      ctx.fillText('PROUDLY PRESENTED TO VERIFIED LEARNER', W / 2, 535);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(learnerName, W / 2, 650, W - 360);

      ctx.fillStyle = '#475569';
      ctx.font = '500 26px "JetBrains Mono", monospace';
      ctx.fillText(
        `${learnerEmail}  ·  Rank: ${rank.title}`,
        W / 2,
        715,
        W - 360
      );

      ctx.fillStyle = '#334155';
      ctx.font = '500 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'For demonstrating mastery across Global Corporate English (Indianism elimination),',
        W / 2,
        820
      );
      ctx.fillText(
        'Executive Interview Skills, and Structured Group Discussion Leadership.',
        W / 2,
        868
      );

      const metrics = [
        { label: 'INDIANISM', val: `${catStats.indianism.correct}/15` },
        { label: 'INTERVIEW', val: `${catStats.interview.correct}/15` },
        { label: 'GD SKILLS', val: `${catStats.gd.correct}/15` },
        { label: 'CAREER XP', val: `${careerProgress.careerXp} XP` },
      ];
      const boxW = 420;
      const gap = 40;
      const startX = (W - (boxW * 4 + gap * 3)) / 2;
      const boxY = 965;
      metrics.forEach((m, i) => {
        const bx = startX + i * (boxW + gap);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(bx, boxY, boxW, 180);
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, boxY, boxW, 180);
        ctx.fillStyle = '#64748B';
        ctx.font = '700 22px "JetBrains Mono", monospace';
        ctx.fillText(m.label, bx + boxW / 2, boxY + 58);
        ctx.fillStyle = '#0F172A';
        ctx.font = '800 44px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(m.val, bx + boxW / 2, boxY + 132);
      });

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(issueDate, 200, 1420);
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText(`CERT ID: ${careerProgress.careerCertificateId}`, 200, 1465);

      ctx.beginPath();
      ctx.arc(W / 2, 1410, 115, 0, Math.PI * 2);
      ctx.fillStyle = '#0B1733';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#C89B3C';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('POWERED BY', W / 2, 1400);
      ctx.fillText('KAPIL', W / 2, 1435);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Powered By Kapil', W - 200, 1420);
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText('Lead Employability & Communication Mentor', W - 200, 1465);

      const safeName = learnerName.replace(/[^a-zA-Z0-9]+/g, '-');
      const link = document.createElement('a');
      link.download = `Employability-Universe-Career-Skills-${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Overview Header */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
              {CAREER_SKILLS_META.subtitle} · {CAREER_SKILLS_META.poweredBy}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {CAREER_SKILLS_META.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {CAREER_SKILLS_META.description}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 sm:min-w-[290px] space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">CAREER RANK</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {rank.title}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Career XP
                </div>
                <div className="font-mono text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                  {careerProgress.careerXp}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  MCQs Done
                </div>
                <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {totalAnswered}/45
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Accuracy
                </div>
                <div className="font-mono text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                  {overallAccuracy}%
                </div>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-blue-700 dark:bg-blue-500 transition-all"
                style={{
                  width: `${Math.min(100, Math.round((totalAnswered / 45) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Color-Coded Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          {CAREER_SKILL_CATEGORIES.map((cat) => {
            const st = catStats[cat.id];
            const active = activeTab === cat.id;
            const done = st.answered >= st.total;
            const cTheme = getCareerTheme(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveTab(cat.id);
                  onActiveTabChange?.(cat.id);
                  setResetConfirmCat(null);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? `${cTheme.activeButton} shadow-sm`
                    : done
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 opacity-75 hover:opacity-100'
                    : `${cTheme.softBorder} ${cTheme.softSurface} text-slate-800 dark:text-slate-200 ${cTheme.ringHover}`
                }`}
              >
                {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span className={done && !active ? 'line-through decoration-slate-400/70' : ''}>
                  {cat.number} {cat.shortTitle}
                </span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({st.correct}/{st.total})
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setActiveTab('credentials');
              onActiveTabChange?.('credentials');
            }}
            className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'credentials'
                ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                : 'border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 hover:border-amber-500'
            }`}
          >
            04. Badges &amp; PNG Certificate ({careerProgress.unlockedCareerBadges.length}/6)
          </button>
        </div>
      </section>

      {toastMsg && (
        <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* ACTIVE CATEGORY VIEW (Indianism / Interview Skills / GD Skills) */}
      {activeCategoryDef && activeTab !== 'credentials' && (() => {
        const activeCatTheme = getCareerTheme(activeTab);
        return (
        <div className="space-y-6">
          {/* Category Visual Feature Split */}
          <div className={`rounded-2xl border ${activeCatTheme.softBorder} bg-white dark:bg-slate-900 overflow-hidden`}>
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${activeCatTheme.topBar}`}
              aria-hidden="true"
            />
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 aspect-[16/9] lg:aspect-auto lg:min-h-[220px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900">
              <SmartImage
                src={activeCategoryDef.image}
                alt={activeCategoryDef.imageAlt}
                fallbackTitle={activeCategoryDef.title}
                fallbackSubtitle={activeCategoryDef.subtitle}
                priority
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className={`text-xs font-mono font-bold ${activeCatTheme.text}`}>
                  CATEGORY {activeCategoryDef.number} · {activeCategoryDef.subtitle}
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  {activeCategoryDef.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeCategoryDef.description}
                </p>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                  {activeCategoryDef.highlights.join(' · ')}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                {/* Inner Mode Switcher */}
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setInnerMode('mcq')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      innerMode === 'mcq'
                        ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    MCQ Test ({catStats[activeTab].answered}/15)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInnerMode('study')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      innerMode === 'study'
                        ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    Study Playbooks ({categoryStudyCards.length})
                  </button>
                </div>

                {/* Live Category Score + Reset */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    Score: {catStats[activeTab].correct}/15 ({catStats[activeTab].accuracyPct}%)
                  </span>
                  {catStats[activeTab].answered > 0 &&
                    (resetConfirmCat === activeTab ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={resetBusy}
                          onClick={() => handleConfirmResetCategory(activeTab)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {resetBusy ? 'Resetting...' : 'Confirm Retake'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetConfirmCat(null)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setResetConfirmCat(activeTab)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Test</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* MODE 1: GRADED MCQ TEST (15 QUESTIONS PER CATEGORY) */}
          {innerMode === 'mcq' && (
            <div className="space-y-4">
              {categoryMcqs.map(({ item, globalIndex }, localIdx) => {
                const answered = careerProgress.answeredMcqs.includes(item.id);
                const chosen = careerProgress.mcqChoices[globalIndex] ?? -1;
                const isCorrect = careerProgress.correctMcqs.includes(item.id);
                const hintShown =
                  Boolean(visibleHints[item.id]) ||
                  careerProgress.hintUsedMcqs.includes(item.id);
                const busy = mcqBusyId === item.id;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          Q{String(localIdx + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">
                          ·
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {item.topic}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">
                          ·
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {item.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {!answered && (
                          <button
                            type="button"
                            onClick={() =>
                              setVisibleHints((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>
                              {hintShown
                                ? 'Hide Hint'
                                : `Show Hint (${item.xpWithHint} XP)`}
                            </span>
                          </button>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                          {answered
                            ? isCorrect
                              ? 'Correct'
                              : 'Incorrect'
                            : `+${hintShown ? item.xpWithHint : item.xpClean} XP`}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-950 dark:text-white leading-snug">
                      {item.question}
                    </h3>

                    {hintShown && (
                      <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/70 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Mentor Hint:</strong> {item.hint}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.options.map((opt, optIdx) => {
                        const isPicked = chosen === optIdx;
                        const isRightOpt = optIdx === item.correctIndex;
                        let style =
                          'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 hover:border-blue-500 text-slate-800 dark:text-slate-200';
                        if (answered) {
                          if (isRightOpt) {
                            style =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100';
                          } else if (isPicked && !isRightOpt) {
                            style =
                              'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100';
                          } else {
                            style =
                              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 opacity-75';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={answered || busy}
                            onClick={() =>
                              handleAnswerMcq(globalIndex, optIdx, item.id)
                            }
                            className={`text-left rounded-xl border p-3.5 text-xs sm:text-sm transition-colors flex items-start justify-between gap-2.5 ${style} ${
                              answered ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="leading-relaxed">{opt}</span>
                            </div>
                            {answered && isRightOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            )}
                            {answered && isPicked && !isRightOpt && (
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-400 mr-2">
                          EXPLANATION:
                        </span>
                        {item.explanation}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* MODE 2: PLAYBOOK STUDY VAULT */}
          {innerMode === 'study' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryStudyCards.map((card, idx) => {
                const studied = careerProgress.studiedTopics.includes(card.id);
                return (
                  <article
                    key={card.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          PLAYBOOK {String(idx + 1).padStart(2, '0')} · {card.tag}
                        </span>
                        {studied && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Studied</span>
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-slate-950 dark:text-white">
                        {card.beforeOrPrompt}
                      </div>

                      <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs font-medium text-emerald-950 dark:text-emerald-100 leading-relaxed">
                        {card.afterOrFramework}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {card.takeaway}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {studied ? 'Recorded in ledger' : '+10 XP bonus (first 12 cards)'}
                      </span>
                      {!studied && (
                        <button
                          type="button"
                          onClick={() => handleMarkStudied(card.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Mark Studied</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        );
      })()}

      {/* TAB 4: BADGES & PNG CERTIFICATE */}
      {activeTab === 'credentials' && (
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Career MCQ Mastery Badges ({careerProgress.unlockedCareerBadges.length}/6)
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Download each unlocked badge as a 1200 × 1200 px collectible PNG medallion.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                Indianism {catStats.indianism.correct}/15 · Interview {catStats.interview.correct}/15 · GD {catStats.gd.correct}/15
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAREER_BADGES.map((badge) => {
                const unlocked = careerProgress.unlockedCareerBadges.includes(
                  badge.id
                );
                const palette = BADGE_PALETTES[badge.accent];
                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
                      unlocked
                        ? palette.softBg
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          unlocked
                            ? 'bg-white dark:bg-slate-950 text-blue-700 dark:text-blue-400 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {unlocked ? (
                          <Trophy className="w-5 h-5" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>
                      <span className="font-mono text-[11px] font-bold uppercase">
                        {unlocked ? 'Earned' : 'Locked'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                        {badge.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2.5">
                      <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                        {badge.criteriaLabel}
                      </div>
                      {unlocked ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadBadgePng(badge)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PNG Badge</span>
                        </button>
                      ) : (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Lock className="w-3 h-3 shrink-0" />
                          <span>Reach criteria to unlock PNG</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Official Certificate Preview & PNG Export */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Official Career Skills PNG Certificate · Powered By Kapil
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Exports a 2400 × 1700 px PNG certificate recording your verified Indianism, Interview Skills &amp; GD Skills scores.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  disabled={downloadingCert}
                  onClick={handleDownloadCertificatePng}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer shrink-0 disabled:opacity-60"
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {downloadingCert
                      ? 'Rendering PNG...'
                      : 'Download Certificate (PNG)'}
                  </span>
                </button>
                {onRequestEmail && learnerEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      const png = buildCareerCertificateDataUrl(
                        learnerName,
                        learnerEmail,
                        careerProgress
                      );
                      const { htmlBody, textFallback } = buildCredentialEmailHtml({
                        learnerName,
                        learnerEmail,
                        credentialKindLabel: 'Career Skills Academy Certificate (PNG)',
                        credentialTitle: 'Certificate of Placement Communication',
                        certificateId: careerProgress.careerCertificateId,
                        summaryPoints: [
                          `Career MCQs Correct: ${careerProgress.correctMcqs.length}/${CAREER_MCQS.length}`,
                          `Career XP: ${careerProgress.careerXp} XP`,
                          `Badges Unlocked: ${careerProgress.unlockedCareerBadges.length}/${CAREER_BADGES.length}`,
                        ],
                      });
                      onRequestEmail({
                        recipientEmail: learnerEmail,
                        recipientName: learnerName,
                        credentialType: 'certificate',
                        title: 'Career Skills Certificate (PNG)',
                        subject:
                          'Your Career Skills Certificate — EMPLOYABILITY UNIVERSE With Kapil',
                        htmlBody,
                        textFallback,
                        targetView: 'career',
                        attachment: {
                          filename:
                            'Employability-Universe-Career-Skills-Certificate-Kapil.png',
                          mimeType: 'image/png',
                          base64OrDataUrl: png,
                        },
                      });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-semibold cursor-pointer shrink-0"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email to Sign-Up ID</span>
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 dark:border-slate-700 bg-gradient-to-br from-[#FDFCF8] via-white to-blue-50 text-slate-900 p-6 sm:p-10 shadow-xl">
              <div className="border-2 border-amber-600/70 p-6 sm:p-10 space-y-6 text-center">
                <div className="text-xs font-mono font-bold tracking-[0.2em] text-blue-700">
                  EMPLOYABILITY UNIVERSE WITH KAPIL · CAREER &amp; PLACEMENT MCQ ACADEMY
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-950">
                  CERTIFICATE OF PLACEMENT COMMUNICATION
                </h3>
                <div className="w-48 h-0.5 bg-amber-600/70 mx-auto" />
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    Proudly awarded to
                  </div>
                  <div className="font-display text-3xl sm:text-5xl font-extrabold text-slate-950">
                    {learnerName}
                  </div>
                  <div className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {learnerEmail} · {rank.title}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-slate-200 bg-slate-50 rounded-xl p-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">
                      Indianism
                    </div>
                    <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                      {catStats.indianism.correct} / 15
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">
                      Interview Skills
                    </div>
                    <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                      {catStats.interview.correct} / 15
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">
                      GD Skills
                    </div>
                    <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                      {catStats.gd.correct} / 15
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">
                      Career XP
                    </div>
                    <div className="font-display text-lg font-bold text-blue-700 tabular-nums">
                      {careerProgress.careerXp} XP
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono text-slate-600">
                  <div>
                    {issueDate} · ID: {careerProgress.careerCertificateId}
                  </div>
                  <div className="font-display text-base font-extrabold text-slate-950">
                    Powered By Kapil
                  </div>
                </div>
              </div>
            </div>
            <canvas ref={certCanvasRef} className="hidden" aria-hidden="true" />
          </section>
        </div>
      )}
    </div>
  );
};
