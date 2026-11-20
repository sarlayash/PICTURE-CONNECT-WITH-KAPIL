import React, { useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  HelpCircle,
  Lightbulb,
  Lock,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  evaluateNegotiationRoleplay,
  getShoppingRank,
  NEGOTIATION_LAB_SCENARIO,
  SHOPPING_BADGES,
  SHOPPING_MCQS,
  SHOPPING_MODULE_META,
  ShoppingBadgeDefinition,
  SOLVED_KONFI_RIDDLES,
  SOLVED_NEGOTIATION_CASES,
} from '../data/shoppingNegotiationData';
import {
  markShoppingExampleStudied,
  ShoppingProgressDoc,
  submitNegotiationRoleplay,
  submitShoppingMcqAnswer,
} from '../services/shoppingFirestoreService';
import { SmartImage } from './SmartImage';

interface ShoppingNegotiationStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  shoppingProgress: ShoppingProgressDoc;
}

type StudioTab = 'examples' | 'mcqs' | 'roleplay' | 'credentials';

const ACCENT_PALETTE: Record<
  ShoppingBadgeDefinition['accent'],
  { primary: string; glow: string; borderClass: string }
> = {
  blue: {
    primary: '#2563EB',
    glow: '#60A5FA',
    borderClass:
      'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200',
  },
  emerald: {
    primary: '#059669',
    glow: '#34D399',
    borderClass:
      'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200',
  },
  amber: {
    primary: '#D97706',
    glow: '#FBBF24',
    borderClass:
      'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200',
  },
  violet: {
    primary: '#7C3AED',
    glow: '#A78BFA',
    borderClass:
      'border-violet-300 dark:border-violet-800 bg-violet-50/70 dark:bg-violet-950/30 text-violet-800 dark:text-violet-200',
  },
  rose: {
    primary: '#E11D48',
    glow: '#FB7185',
    borderClass:
      'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200',
  },
  cyan: {
    primary: '#0891B2',
    glow: '#22D3EE',
    borderClass:
      'border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-200',
  },
};

function downloadShopBadgePng(
  badge: ShoppingBadgeDefinition,
  learnerName: string,
  certId: string,
  issueDate: string
): void {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const palette = ACCENT_PALETTE[badge.accent] ?? ACCENT_PALETTE.blue;

  const bg = ctx.createRadialGradient(S / 2, 430, 80, S / 2, S / 2, 760);
  bg.addColorStop(0, '#16243D');
  bg.addColorStop(0.55, '#0B1120');
  bg.addColorStop(1, '#050811');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(200, 155, 60, 0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, S - 88, S - 88);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, S - 124, S - 124);

  ctx.textAlign = 'center';
  ctx.fillStyle = palette.glow;
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText('EMPLOYABILITY UNIVERSE WITH KAPIL · NEGOTIATION BADGE', S / 2, 128);

  const cx = S / 2;
  const cy = 430;
  const outerR = 235;

  const aura = ctx.createRadialGradient(cx, cy, 120, cx, cy, 320);
  aura.addColorStop(0, `${palette.primary}55`);
  aura.addColorStop(1, 'transparent');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#C89B3C';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 24, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = palette.glow;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy - 12);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 8;
    const r = 92;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const shieldGrad = ctx.createLinearGradient(-80, -80, 80, 80);
  shieldGrad.addColorStop(0, palette.primary);
  shieldGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = shieldGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FDE047';
  ctx.stroke();

  ctx.fillStyle = '#FDE047';
  ctx.font = '800 44px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SN', 0, 16);
  ctx.restore();

  ctx.fillStyle = '#FDE047';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('POWERED BY KAPIL · PERSUASION & LOGIC', cx, cy + 160);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 50px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.title, S / 2, 760);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.criteriaLabel, S / 2, 815);

  ctx.fillStyle = '#FDE047';
  ctx.font = '700 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Awarded to ${learnerName}`, S / 2, 950);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(`ID: ${certId}  ·  ${issueDate}`, S / 2, 1020);

  const link = document.createElement('a');
  const slug = badge.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `Badge-Shopping-${slug}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export const ShoppingNegotiationStudio: React.FC<ShoppingNegotiationStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  shoppingProgress,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('examples');
  const [exampleKind, setExampleKind] = useState<'all' | 'riddles' | 'cases'>('all');
  const [riddleCategory, setRiddleCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [mcqFilter, setMcqFilter] = useState<'all' | 'riddle' | 'negotiation'>('all');
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});
  const [mcqBusyId, setMcqBusyId] = useState<string | null>(null);

  const [roleplayInput, setRoleplayInput] = useState(
    shoppingProgress.roleplayDraft || ''
  );
  const [roleplayBusy, setRoleplayBusy] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync draft once if loaded late from Firestore
  React.useEffect(() => {
    if (shoppingProgress.roleplayDraft && !roleplayInput) {
      setRoleplayInput(shoppingProgress.roleplayDraft);
    }
  }, [shoppingProgress.roleplayDraft, roleplayInput]);

  const rank = getShoppingRank(shoppingProgress.shopXp);
  const answeredCount = shoppingProgress.answeredMcqs.length;
  const correctCount = shoppingProgress.correctMcqs.length;
  const accuracyPct =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const filteredRiddles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return SOLVED_KONFI_RIDDLES.filter((r) => {
      if (riddleCategory !== 'All' && r.category !== riddleCategory) return false;
      if (!q) return true;
      return (
        r.qNumbers.toLowerCase().includes(q) ||
        r.riddlePrompt.toLowerCase().includes(q) ||
        r.solvedItem.toLowerCase().includes(q) ||
        r.deductionLogic.toLowerCase().includes(q)
      );
    });
  }, [riddleCategory, searchTerm]);

  const filteredCases = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return SOLVED_NEGOTIATION_CASES.filter((c) => {
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.scenario.toLowerCase().includes(q) ||
        c.solvedDialogue.toLowerCase().includes(q)
      );
    });
  }, [searchTerm]);

  const filteredMcqs = useMemo(() => {
    return SHOPPING_MCQS.map((item, idx) => ({ item, idx })).filter(
      ({ item }) => mcqFilter === 'all' || item.category === mcqFilter
    );
  }, [mcqFilter]);

  const liveEval = useMemo(
    () =>
      roleplayInput.trim().length > 0
        ? evaluateNegotiationRoleplay(roleplayInput)
        : null,
    [roleplayInput]
  );

  const issueDate = new Date(
    shoppingProgress.updatedAtMs || Date.now()
  ).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleMarkStudied = async (exampleId: string) => {
    setErrorMsg(null);
    try {
      const res = await markShoppingExampleStudied({
        user,
        current: shoppingProgress,
        exampleId,
      });
      if (res.newlyAwardedXp > 0 || res.newlyUnlockedBadges.length > 0) {
        setToastMsg(
          `Saved example progress${
            res.newlyAwardedXp > 0 ? ` (+${res.newlyAwardedXp} XP)` : ''
          }${
            res.newlyUnlockedBadges.length > 0
              ? ` · Unlocked ${res.newlyUnlockedBadges.length} badge!`
              : ''
          }`
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save progress.');
    }
  };

  const handleAnswerMcq = async (mcqIndex: number, chosenOption: number) => {
    const q = SHOPPING_MCQS[mcqIndex];
    if (!q || shoppingProgress.answeredMcqs.includes(q.id)) return;
    setMcqBusyId(q.id);
    setErrorMsg(null);
    try {
      const usedHint = Boolean(visibleHints[q.id]);
      const res = await submitShoppingMcqAnswer({
        user,
        current: shoppingProgress,
        mcqIndex,
        chosenOption,
        usedHint,
      });
      setToastMsg(
        `${res.isCorrect ? 'Correct deduction!' : 'Recorded for review.'} +${
          res.newlyAwardedXp
        } XP${
          res.newlyUnlockedBadges.length > 0
            ? ` · New Badge Unlocked!`
            : ''
        }`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not save MCQ answer.');
    } finally {
      setMcqBusyId(null);
    }
  };

  const handleSubmitRoleplay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roleplayInput.trim().length < 25) {
      setErrorMsg(
        'Please write at least 25 characters combining courteousness, item specifics, and a logical trade-off.'
      );
      return;
    }
    setRoleplayBusy(true);
    setErrorMsg(null);
    try {
      const res = await submitNegotiationRoleplay({
        user,
        current: shoppingProgress,
        roleplayDraft: roleplayInput,
      });
      setToastMsg(
        `Role-Play scored ${res.evaluation.totalScore}/100!${
          res.newlyAwardedXp > 0 ? ` (+${res.newlyAwardedXp} XP)` : ''
        }`
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to submit role-play.'
      );
    } finally {
      setRoleplayBusy(false);
    }
  };

  const handleDownloadCertificatePng = () => {
    if (!shoppingProgress.completedModule) return;
    setDownloadingCert(true);
    try {
      const canvas = certCanvasRef.current ?? document.createElement('canvas');
      const W = 2400;
      const H = 1700;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#FDFBF7');
      bgGrad.addColorStop(0.5, '#FFFFFF');
      bgGrad.addColorStop(1, '#EFF6FF');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 22;
      ctx.strokeRect(54, 54, W - 108, H - 108);

      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 6;
      ctx.strokeRect(86, 86, W - 172, H - 172);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#1D4ED8';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText(
        'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  SHOPPING & NEGOTIATION',
        W / 2,
        215
      );

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 72px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CERTIFICATE OF NEGOTIATION MASTERY', W / 2, 320);

      ctx.fillStyle = '#C89B3C';
      ctx.fillRect(W / 2 - 220, 355, 440, 4);

      ctx.fillStyle = '#334155';
      ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Shopping & Negotiation Skills · Persuasion, Logic & Precision', W / 2, 425);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "JetBrains Mono", monospace';
      ctx.fillText('PROUDLY PRESENTED TO VERIFIED LEARNER', W / 2, 545);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(learnerName, W / 2, 665);

      ctx.fillStyle = '#475569';
      ctx.font = '500 26px "JetBrains Mono", monospace';
      ctx.fillText(`${learnerEmail}  ·  RANK: ${rank.title.toUpperCase()}`, W / 2, 725);

      ctx.fillStyle = '#1E293B';
      ctx.font = '500 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'Has successfully mastered deductive Konfi-07 Shopping Role Play riddles, 20 Negotiation MCQs,',
        W / 2,
        840
      );
      ctx.fillText(
        'and demonstrated Courteousness, Logical Thinking, Persuasion, Convincing & Precision in Communication.',
        W / 2,
        892
      );

      // Metric boxes
      const boxY = 980;
      const boxH = 190;
      const boxW = 460;
      const metrics = [
        { label: 'MODULE XP', val: `${shoppingProgress.shopXp} XP` },
        { label: 'MCQ ACCURACY', val: `${correctCount}/20 (${accuracyPct}%)` },
        { label: 'ROLE-PLAY LAB', val: `${shoppingProgress.roleplayScore}/100` },
        {
          label: 'BADGES EARNED',
          val: `${shoppingProgress.unlockedShopBadges.length}/${SHOPPING_BADGES.length}`,
        },
      ];
      metrics.forEach((m, idx) => {
        const bx = 220 + idx * 500;
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.fillRect(bx, boxY, boxW, boxH);
        ctx.strokeRect(bx, boxY, boxW, boxH);

        ctx.fillStyle = '#64748B';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(m.label, bx + boxW / 2, boxY + 62);

        ctx.fillStyle = '#0F172A';
        ctx.font = '800 44px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(m.val, bx + boxW / 2, boxY + 132);
      });

      // Signature row
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(issueDate, 200, 1420);
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText(`CERT ID: ${shoppingProgress.shopCertificateId}`, 200, 1465);

      // Gold seal
      ctx.beginPath();
      ctx.arc(W / 2, 1410, 115, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
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
      link.download = `Employability-Universe-Shopping-Negotiation-${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Overview Header */}
      <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 overflow-hidden">
        <div
          className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
          aria-hidden="true"
        />
        <div className="p-6 sm:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              {SHOPPING_MODULE_META.subtitle} · {SHOPPING_MODULE_META.poweredBy}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {SHOPPING_MODULE_META.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {SHOPPING_MODULE_META.description}
            </p>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
              5 Core Pillars: {SHOPPING_MODULE_META.skillPillars.join(' · ')}
            </div>
          </div>

          <div className="space-y-3 sm:min-w-[290px] lg:max-w-[340px] shrink-0">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <SmartImage
                src={SHOPPING_MODULE_META.heroImage}
                alt="Shopping and Negotiation Skills executive session"
                fallbackTitle="Shopping & Negotiation Skills"
                fallbackSubtitle="FACE Konfi-07 & Deal Mastery Lab"
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">MODULE RANK</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">{rank.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Shop XP</div>
                  <div className="font-mono text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                    {shoppingProgress.shopXp}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">MCQs</div>
                  <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {answeredCount}/20
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Badges</div>
                  <div className="font-mono text-lg font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                    {shoppingProgress.unlockedShopBadges.length}/{SHOPPING_BADGES.length}
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-blue-700 dark:bg-blue-500 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((shoppingProgress.shopXp / 1000) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Color-Coded Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          {[
            {
              id: 'examples' as StudioTab,
              label: '01. Solved Examples (38)',
              activeCls: 'bg-emerald-700 border-emerald-700 text-white shadow-sm',
              idleCls:
                'border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 hover:border-emerald-500',
            },
            {
              id: 'mcqs' as StudioTab,
              label: `02. MCQs with Hints (${answeredCount}/20)`,
              activeCls: 'bg-teal-700 border-teal-700 text-white shadow-sm',
              idleCls:
                'border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 hover:border-teal-500',
            },
            {
              id: 'roleplay' as StudioTab,
              label: `03. Role-Play Lab (${shoppingProgress.roleplayScore}/100)`,
              activeCls: 'bg-amber-600 border-amber-600 text-white shadow-sm',
              idleCls:
                'border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:border-amber-500',
            },
            {
              id: 'credentials' as StudioTab,
              label: `04. Badges & PNG Certificate (${shoppingProgress.unlockedShopBadges.length}/6)`,
              activeCls: 'bg-violet-700 border-violet-700 text-white shadow-sm',
              idleCls:
                'border-violet-200 dark:border-violet-900 bg-violet-50/70 dark:bg-violet-950/30 text-violet-900 dark:text-violet-200 hover:border-violet-500',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id ? tab.activeCls : tab.idleCls
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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

      {/* TAB 1: SOLVED EXAMPLES & NEGOTIATION CASES */}
      {activeTab === 'examples' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all' as const, label: 'All Solved (38)' },
                { id: 'riddles' as const, label: 'Shopping List Riddles (32)' },
                { id: 'cases' as const, label: 'Negotiation Role-Play Cases (6)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setExampleKind(btn.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    exampleKind === btn.id
                      ? 'bg-slate-950 dark:bg-blue-700 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {exampleKind !== 'cases' && (
                <select
                  value={riddleCategory}
                  onChange={(e) => setRiddleCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="All">All Riddle Categories</option>
                  <option value="Home & Lifestyle">Home &amp; Lifestyle</option>
                  <option value="Knowledge & Tools">Knowledge &amp; Tools</option>
                  <option value="Rebus & Lateral">Rebus &amp; Lateral</option>
                  <option value="Electronics & Apparel">Electronics &amp; Apparel</option>
                </select>
              )}

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search item, Q#, or negotiation..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Examples Studied: <strong className="text-slate-950 dark:text-white">{shoppingProgress.studiedExamples.length}</strong> (Mark 6 studied to unlock Konfi-07 Scholar badge · first 10 award +10 XP each)
          </div>

          {/* Worked Negotiation Cases */}
          {exampleKind !== 'riddles' && filteredCases.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Solved Commercial &amp; Campus Negotiation Dialogues
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredCases.map((c) => {
                  const studied = shoppingProgress.studiedExamples.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
                            {c.pillarFocus}
                          </div>
                          <h4 className="font-display text-base font-bold text-slate-950 dark:text-white mt-0.5">
                            {c.title}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleMarkStudied(c.id)}
                          disabled={studied}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                            studied
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-blue-700 hover:bg-blue-800 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{studied ? 'Studied' : 'Mark Studied'}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong>Scenario:</strong> {c.scenario}
                      </p>

                      <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/70 dark:border-red-900/50 text-xs text-red-900 dark:text-red-200">
                        <strong>Avoid:</strong> {c.poorApproach}
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 text-xs text-emerald-950 dark:text-emerald-200">
                        <strong>Solved Persuasive Script:</strong> {c.solvedDialogue}
                      </div>

                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        <strong>Takeaway:</strong> {c.keyTakeaway}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Solved Konfi-07 Shopping List Riddles */}
          {exampleKind !== 'cases' && filteredRiddles.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Solved Konfi-07 Shopping List Riddles (All Q1–Q42 Covered)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRiddles.map((r) => {
                  const studied = shoppingProgress.studiedExamples.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-mono text-blue-700 dark:text-blue-400 font-bold">
                          {r.qNumbers} · {r.category}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleMarkStudied(r.id)}
                          disabled={studied}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer ${
                            studied
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>{studied ? 'Studied' : 'Mark Studied'}</span>
                        </button>
                      </div>

                      <div className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
                        “{r.riddlePrompt}”
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="font-display text-sm font-bold text-emerald-700 dark:text-emerald-400">
                          Solved Item: {r.solvedItem}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          <strong>Logic:</strong> {r.deductionLogic}
                        </p>
                        <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                          <strong>Negotiation Angle:</strong> {r.negotiationHook}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* TAB 2: MCQs WITH HINTS */}
      {activeTab === 'mcqs' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all' as const, label: 'All Questions (20)' },
                { id: 'riddle' as const, label: 'Konfi-07 Riddles (10)' },
                { id: 'negotiation' as const, label: 'Negotiation Strategy (10)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setMcqFilter(f.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    mcqFilter === f.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
              Accuracy: <strong className="text-slate-950 dark:text-white">{correctCount}/{answeredCount || 0} ({accuracyPct}%)</strong> · Clean Solve: +40 XP · With Hint: +25 XP
            </div>
          </div>

          <div className="space-y-4">
            {filteredMcqs.map(({ item, idx }) => {
              const isAnswered = shoppingProgress.answeredMcqs.includes(item.id);
              const chosenOption = shoppingProgress.mcqChoices[idx] ?? -1;
              const isCorrect = shoppingProgress.correctMcqs.includes(item.id);
              const usedHintOnSubmit = shoppingProgress.hintUsedMcqs.includes(item.id);
              const hintRevealed =
                Boolean(visibleHints[item.id]) || usedHintOnSubmit || isAnswered;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                      Q{idx + 1} · {item.sourceRef}
                    </div>
                    <div className="flex items-center gap-3">
                      {!isAnswered && (
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleHints((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>
                            {visibleHints[item.id] ? 'Hide Hint' : 'Show Hint (+25 XP)'}
                          </span>
                        </button>
                      )}
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {isAnswered
                          ? isCorrect
                            ? usedHintOnSubmit
                              ? '+25 XP (Hinted)'
                              : '+40 XP (Clean)'
                            : '+5 XP (Reviewed)'
                          : visibleHints[item.id]
                          ? '+25 XP w/ Hint'
                          : '+40 XP Clean'}
                      </span>
                    </div>
                  </div>

                  <div className="font-display text-sm sm:text-base font-bold text-slate-950 dark:text-white leading-snug">
                    {item.question}
                  </div>

                  {hintRevealed && (
                    <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <strong>Hint:</strong> {item.hint}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {item.options.map((opt, optIdx) => {
                      const isChosen = chosenOption === optIdx;
                      const isRightOpt = item.correctIndex === optIdx;
                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-blue-500';
                      if (isAnswered) {
                        if (isRightOpt) {
                          btnStyle =
                            'border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-semibold';
                        } else if (isChosen && !isRightOpt) {
                          btnStyle =
                            'border-red-400 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
                        } else {
                          btnStyle =
                            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-500 opacity-75';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered || mcqBusyId === item.id}
                          onClick={() => handleAnswerMcq(idx, optIdx)}
                          className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 ${
                            isAnswered ? 'cursor-default' : 'cursor-pointer'
                          } ${btnStyle}`}
                        >
                          <span className="flex items-start gap-2.5">
                            <span className="font-mono font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </span>
                          {isAnswered && isRightOpt && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {isAnswered && isChosen && !isRightOpt && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-950 dark:text-white">
                        Solved Explanation:
                      </strong>{' '}
                      {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ROLE-PLAY NEGOTIATION SIMULATOR LAB */}
      {activeTab === 'roleplay' && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
              INTERACTIVE ROLE-PLAY LAB · AUTO-SCORED /100 (+UP TO 200 XP)
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              {NEGOTIATION_LAB_SCENARIO.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {NEGOTIATION_LAB_SCENARIO.prompt}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handleSubmitRoleplay} className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Your Buyer Closing Script
                </label>
                <span className="font-mono text-slate-400 tabular-nums">
                  {roleplayInput.length}/1480
                </span>
              </div>
              <textarea
                rows={7}
                maxLength={1480}
                value={roleplayInput}
                onChange={(e) => setRoleplayInput(e.target.value)}
                placeholder="Example: Thank you for showing the Microwave, Study Chair, and Dictionary—the quality looks solid. With my strict ₹10,400 cohort budget, if I purchase all three in a single cash bundle right now, could we bridge the gap at ₹10,400 with free delivery and a 1-year warranty included?"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Best Saved Score:{' '}
                  <strong className="font-mono text-slate-950 dark:text-white">
                    {shoppingProgress.roleplayScore}/100
                  </strong>
                </div>
                <button
                  type="submit"
                  disabled={roleplayBusy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {roleplayBusy ? 'Evaluating Script...' : 'Evaluate & Save Role-Play'}
                  </span>
                </button>
              </div>
            </form>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
                <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  KONFI-07 5-PILLAR RUBRIC CHECKLIST
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {NEGOTIATION_LAB_SCENARIO.rubricChecklist.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {liveEval && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>LIVE RUBRIC ESTIMATE</span>
                      <span className="text-blue-700 dark:text-blue-400 tabular-nums">
                        {liveEval.totalScore}/100
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                      <div>Courteousness: {liveEval.courteousScore}/20</div>
                      <div>Logic: {liveEval.logicScore}/20</div>
                      <div>Persuasion: {liveEval.persuasionScore}/20</div>
                      <div>Convincing: {liveEval.convincingScore}/20</div>
                      <div className="col-span-2">Precision: {liveEval.precisionScore}/20</div>
                    </div>
                    {shoppingProgress.roleplayFeedback && (
                      <div className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                        <strong>Saved Feedback:</strong> {shoppingProgress.roleplayFeedback}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: BADGES (PNG) & CERTIFICATE (PNG) */}
      {activeTab === 'credentials' && (
        <div className="space-y-8">
          {/* 6 Shopping & Negotiation Badges */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                Shopping &amp; Negotiation Badges (Downloadable PNG)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Download high-resolution 1200×1200 PNG badges for every unlocked persuasion and Konfi-07 milestone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHOPPING_BADGES.map((badge) => {
                const unlocked = shoppingProgress.unlockedShopBadges.includes(badge.id);
                const palette = ACCENT_PALETTE[badge.accent];
                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl border p-5 space-y-3 flex flex-col justify-between ${
                      unlocked
                        ? palette.borderClass
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold">
                        <span>{unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                        <span>{badge.criteriaLabel}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {unlocked ? (
                          <Trophy className="w-5 h-5 shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 shrink-0 text-slate-400" />
                        )}
                        <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                          {badge.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    {unlocked && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadShopBadgePng(
                            badge,
                            learnerName,
                            shoppingProgress.shopCertificateId,
                            issueDate
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Badge (PNG)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Official Shopping & Negotiation Certificate */}
          {!shoppingProgress.completedModule ? (
            <section className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/25 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                <Lock className="w-4 h-4" />
                <span>CERTIFICATE UNLOCKS ON FULL MODULE COMPLETION</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Complete 20 MCQs ({answeredCount}/20) + Role-Play Lab (
                {shoppingProgress.roleplayScore > 0 ? 'Submitted' : 'Pending'})
              </h3>
              <div className="flex flex-wrap gap-3">
                {answeredCount < 20 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('mcqs')}
                    className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Finish MCQs ({20 - answeredCount} left)
                  </button>
                )}
                {shoppingProgress.roleplayScore === 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('roleplay')}
                    className="px-4 py-2 rounded-lg bg-slate-950 dark:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Complete Role-Play Lab
                  </button>
                )}
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    VERIFIED CREDENTIAL ISSUED · {shoppingProgress.shopCertificateId}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                    Certificate of Negotiation Mastery (PNG)
                  </h3>
                </div>
                <button
                  type="button"
                  disabled={downloadingCert}
                  onClick={handleDownloadCertificatePng}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {downloadingCert
                      ? 'Rendering PNG...'
                      : 'Download Certificate (PNG)'}
                  </span>
                </button>
              </div>

              <div className="rounded-2xl border-4 border-slate-900 dark:border-slate-700 bg-gradient-to-br from-[#FDFBF7] via-white to-blue-50 text-slate-900 p-6 sm:p-10 shadow-xl">
                <div className="border-2 border-amber-600/70 p-6 sm:p-10 space-y-6 text-center">
                  <div className="text-xs font-mono font-bold tracking-[0.2em] text-blue-700">
                    EMPLOYABILITY UNIVERSE WITH KAPIL · SHOPPING &amp; NEGOTIATION
                  </div>
                  <h4 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-950">
                    CERTIFICATE OF NEGOTIATION MASTERY
                  </h4>
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
                      <div className="text-[10px] font-mono text-slate-500">MODULE XP</div>
                      <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                        {shoppingProgress.shopXp} XP
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500">MCQ ACCURACY</div>
                      <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                        {correctCount}/20 ({accuracyPct}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500">ROLE-PLAY</div>
                      <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                        {shoppingProgress.roleplayScore}/100
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500">BADGES</div>
                      <div className="font-display text-lg font-bold text-blue-700 tabular-nums">
                        {shoppingProgress.unlockedShopBadges.length}/6
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono text-slate-500">
                    <span>
                      {issueDate} · ID: {shoppingProgress.shopCertificateId}
                    </span>
                    <span className="font-display text-base font-extrabold text-slate-950">
                      Powered By Kapil
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <canvas ref={certCanvasRef} className="hidden" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
