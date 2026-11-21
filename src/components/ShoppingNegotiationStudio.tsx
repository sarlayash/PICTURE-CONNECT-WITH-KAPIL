import React, { useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  HelpCircle,
  Layers,
  Lightbulb,
  Lock,
  Mail,
  MessageSquare,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import {
  BUYER_ARCHETYPE_MAP,
  BUYER_ARCHETYPES,
  BuyerArchetypeId,
  computeShoppingCategoryStats,
  DARK_PATTERN_ALERTS,
  DEAL_STACKING_MECHANICS,
  DOMAIN_TIMING_CALENDAR,
  evaluateNegotiationRoleplay,
  getShoppingRank,
  MENTOR_KAPIL_BUYER_RULES,
  NEGOTIATION_LAB_SCENARIO,
  SHOPPING_BADGES,
  SHOPPING_MCQS,
  SHOPPING_MODULE_META,
  SHOPPING_NOTES_CHEAT_SHEET,
  ShoppingBadgeDefinition,
  ShoppingMcqCategory,
  SOLVED_BUYER_DOMAIN_EXAMPLES,
  SOLVED_KONFI_RIDDLES,
  SOLVED_NEGOTIATION_CASES,
  SolvedBuyerDomainExample,
} from '../data/shoppingNegotiationData';
import { buildCredentialEmailHtml } from '../services/gmailService';
import {
  markShoppingExampleStudied,
  ShoppingProgressDoc,
  submitNegotiationRoleplay,
  submitShoppingMcqAnswer,
} from '../services/shoppingFirestoreService';
import { buildShoppingCertificateDataUrl } from '../utils/credentialGenerators';
import { EmailCredentialRequest } from './EmailCredentialModal';
import { SmartImage } from './SmartImage';

interface ShoppingNegotiationStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  shoppingProgress: ShoppingProgressDoc;
  onRequestEmail?: (req: EmailCredentialRequest) => void;
}

type StudioTab = 'notes' | 'examples' | 'mcqs' | 'roleplay' | 'credentials';
type ExampleKindFilter = 'buyer_cases' | 'riddles' | 'cases' | 'all';
type DomainGroupFilter = 'All' | SolvedBuyerDomainExample['domainGroup'];

const DOMAIN_GROUPS: DomainGroupFilter[] = [
  'All',
  'Tech & Appliances',
  'Lifestyle & Retail',
  'Travel, Auto & Home',
  'Finance, Health & Services',
  'Career, SaaS & B2B',
];

const ACCENT_PALETTE: Record<
  ShoppingBadgeDefinition['accent'],
  { primary: string; glow: string; borderClass: string; textClass: string }
> = {
  blue: {
    primary: '#2563EB',
    glow: '#60A5FA',
    borderClass:
      'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200',
    textClass: 'text-blue-700 dark:text-blue-400',
  },
  emerald: {
    primary: '#059669',
    glow: '#34D399',
    borderClass:
      'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200',
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  amber: {
    primary: '#D97706',
    glow: '#FBBF24',
    borderClass:
      'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200',
    textClass: 'text-amber-700 dark:text-amber-400',
  },
  violet: {
    primary: '#7C3AED',
    glow: '#A78BFA',
    borderClass:
      'border-violet-300 dark:border-violet-800 bg-violet-50/70 dark:bg-violet-950/30 text-violet-800 dark:text-violet-200',
    textClass: 'text-violet-700 dark:text-violet-400',
  },
  rose: {
    primary: '#E11D48',
    glow: '#FB7185',
    borderClass:
      'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200',
    textClass: 'text-rose-700 dark:text-rose-400',
  },
  cyan: {
    primary: '#0891B2',
    glow: '#22D3EE',
    borderClass:
      'border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-200',
    textClass: 'text-cyan-700 dark:text-cyan-400',
  },
};

const MCQ_CATEGORY_LABELS: Record<ShoppingMcqCategory, string> = {
  buyer_types: 'Buyer Types',
  domains: 'Domains & Services',
  deals_timing: 'Deals & Timing',
  riddle: 'Konfi-07 Riddles',
  negotiation: 'Negotiation',
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
  ctx.fillText('EMPLOYABILITY UNIVERSE WITH KAPIL · SMART BUYER BADGE', S / 2, 128);

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
  ctx.fillText('SB', 0, 16);
  ctx.restore();

  ctx.fillStyle = '#FDE047';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('POWERED BY KAPIL · SHOPPING & NEGOTIATION', cx, cy + 160);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.title, S / 2, 760, S - 160);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.criteriaLabel, S / 2, 815, S - 160);

  ctx.fillStyle = '#FDE047';
  ctx.font = '700 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Awarded to ${learnerName}`, S / 2, 950, S - 160);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(`ID: ${certId}  ·  ${issueDate}`, S / 2, 1020);

  const link = document.createElement('a');
  const slug = badge.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `Badge-Shopping-${slug}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function copyTextSafely(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below for sandboxed iframes
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export const ShoppingNegotiationStudio: React.FC<ShoppingNegotiationStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  shoppingProgress,
  onRequestEmail,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('notes');
  const [exampleKind, setExampleKind] = useState<ExampleKindFilter>('buyer_cases');
  const [buyerFilter, setBuyerFilter] = useState<'All' | BuyerArchetypeId>('All');
  const [domainGroupFilter, setDomainGroupFilter] = useState<DomainGroupFilter>('All');
  const [riddleCategory, setRiddleCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [mcqFilter, setMcqFilter] = useState<'all' | ShoppingMcqCategory>('all');
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});
  const [mcqBusyId, setMcqBusyId] = useState<string | null>(null);

  const [roleplayInput, setRoleplayInput] = useState(
    shoppingProgress.roleplayDraft || ''
  );
  const [roleplayBusy, setRoleplayBusy] = useState(false);

  const [copiedCheatSheet, setCopiedCheatSheet] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (shoppingProgress.roleplayDraft && !roleplayInput) {
      setRoleplayInput(shoppingProgress.roleplayDraft);
    }
  }, [shoppingProgress.roleplayDraft, roleplayInput]);

  const rank = getShoppingRank(shoppingProgress.shopXp);
  const totalMcqs = SHOPPING_MCQS.length;
  const answeredCount = shoppingProgress.answeredMcqs.length;
  const correctCount = shoppingProgress.correctMcqs.length;
  const accuracyPct =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const categoryStats = useMemo(
    () =>
      computeShoppingCategoryStats({
        answeredMcqs: shoppingProgress.answeredMcqs,
        correctMcqs: shoppingProgress.correctMcqs,
        studiedExamples: shoppingProgress.studiedExamples,
      }),
    [
      shoppingProgress.answeredMcqs,
      shoppingProgress.correctMcqs,
      shoppingProgress.studiedExamples,
    ]
  );

  const filteredBuyerCases = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return SOLVED_BUYER_DOMAIN_EXAMPLES.filter((ex) => {
      if (buyerFilter !== 'All' && ex.buyerType !== buyerFilter) return false;
      if (domainGroupFilter !== 'All' && ex.domainGroup !== domainGroupFilter)
        return false;
      if (!q) return true;
      const buyerTitle = BUYER_ARCHETYPE_MAP[ex.buyerType]?.title.toLowerCase() ?? '';
      return (
        ex.number.toLowerCase().includes(q) ||
        ex.domain.toLowerCase().includes(q) ||
        ex.productOrService.toLowerCase().includes(q) ||
        ex.scenario.toLowerCase().includes(q) ||
        ex.solvedAction.toLowerCase().includes(q) ||
        ex.whenToBuy.toLowerCase().includes(q) ||
        ex.proTip.toLowerCase().includes(q) ||
        buyerTitle.includes(q)
      );
    });
  }, [buyerFilter, domainGroupFilter, searchTerm]);

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
    return SHOPPING_MCQS.map((item, idx) => ({ item, idx })).filter(({ item }) => {
      if (mcqFilter !== 'all' && item.category !== mcqFilter) return false;
      if (onlyUnanswered && shoppingProgress.answeredMcqs.includes(item.id))
        return false;
      return true;
    });
  }, [mcqFilter, onlyUnanswered, shoppingProgress.answeredMcqs]);

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

  const unlockedBadgesList = useMemo(
    () =>
      SHOPPING_BADGES.filter((b) =>
        shoppingProgress.unlockedShopBadges.includes(b.id)
      ),
    [shoppingProgress.unlockedShopBadges]
  );

  const handleCopyCheatSheet = async () => {
    const ok = await copyTextSafely(SHOPPING_NOTES_CHEAT_SHEET);
    if (ok) {
      setCopiedCheatSheet(true);
      setToastMsg('Smart Buyer & Deals Cheat Sheet copied to clipboard!');
      window.setTimeout(() => setCopiedCheatSheet(false), 2500);
    } else {
      setErrorMsg('Clipboard access is blocked in this browser view.');
    }
  };

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
              ? ` · Unlocked ${res.newlyUnlockedBadges.length} new badge!`
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
            ? ` · New Shopping Badge Unlocked!`
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

  const handleDownloadAllEarnedBadges = () => {
    if (unlockedBadgesList.length === 0) return;
    unlockedBadgesList.forEach((badge, idx) => {
      window.setTimeout(() => {
        downloadShopBadgePng(
          badge,
          learnerName,
          shoppingProgress.shopCertificateId,
          issueDate
        );
      }, idx * 220);
    });
    setToastMsg(
      `Exporting ${unlockedBadgesList.length} earned Shopping PNG badge${
        unlockedBadgesList.length > 1 ? 's' : ''
      }...`
    );
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
      bgGrad.addColorStop(1, '#ECFDF5');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 22;
      ctx.strokeRect(54, 54, W - 108, H - 108);

      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 6;
      ctx.strokeRect(86, 86, W - 172, H - 172);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#047857';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText(
        'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  SHOPPING, SMART BUYER & NEGOTIATION',
        W / 2,
        195
      );

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 68px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CERTIFICATE OF SMART BUYER & NEGOTIATION MASTERY', W / 2, 295, W - 280);

      ctx.fillStyle = '#C89B3C';
      ctx.fillRect(W / 2 - 240, 330, 480, 4);

      ctx.fillStyle = '#334155';
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${categoryStats.honorsTier} · 6 Buyer Types · 25 Domain Cases · 50 Graded MCQs`,
        W / 2,
        395
      );

      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText('PROUDLY PRESENTED TO VERIFIED LEARNER', W / 2, 495);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(learnerName, W / 2, 605, W - 360);

      ctx.fillStyle = '#475569';
      ctx.font = '500 24px "JetBrains Mono", monospace';
      ctx.fillText(
        `${learnerEmail}  ·  RANK: ${rank.title.toUpperCase()}`,
        W / 2,
        662,
        W - 360
      );

      ctx.fillStyle = '#1E293B';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'Has demonstrated real-world Smart Buyer Intelligence across Customer Psychology, Multi-Domain TCO,',
        W / 2,
        755,
        W - 320
      );
      ctx.fillText(
        'When-to-Buy Calendars, Deal Stacking, Anti-Scam Red Flags, Konfi-07 Deduction & Persuasive Negotiation.',
        W / 2,
        800,
        W - 320
      );

      // 5 Primary Metric Boxes
      const boxY = 865;
      const boxH = 165;
      const totalRowW = W - 320;
      const gap = 24;
      const boxW = (totalRowW - gap * 4) / 5;
      const metrics = [
        { label: 'SHOP XP', val: `${shoppingProgress.shopXp} XP` },
        { label: '50-MCQ SCORE', val: `${correctCount}/${totalMcqs} (${accuracyPct}%)` },
        {
          label: 'BUYER CASES',
          val: `${categoryStats.buyerCasesStudied}/${categoryStats.buyerCasesTotal}`,
        },
        { label: 'ROLE-PLAY LAB', val: `${shoppingProgress.roleplayScore}/100` },
        {
          label: 'BADGES EARNED',
          val: `${shoppingProgress.unlockedShopBadges.length}/${SHOPPING_BADGES.length}`,
        },
      ];
      metrics.forEach((m, idx) => {
        const bx = 160 + idx * (boxW + gap);
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.fillRect(bx, boxY, boxW, boxH);
        ctx.strokeRect(bx, boxY, boxW, boxH);

        ctx.fillStyle = '#64748B';
        ctx.font = '700 18px "JetBrains Mono", monospace';
        ctx.fillText(m.label, bx + boxW / 2, boxY + 54, boxW - 24);

        ctx.fillStyle = '#0F172A';
        ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(m.val, bx + boxW / 2, boxY + 118, boxW - 24);
      });

      // Sub-domain 5-Pillar Verified Score Strip
      const stripY = 1068;
      const stripH = 112;
      ctx.fillStyle = '#ECFDF5';
      ctx.strokeStyle = '#A7F3D0';
      ctx.lineWidth = 2;
      ctx.fillRect(160, stripY, totalRowW, stripH);
      ctx.strokeRect(160, stripY, totalRowW, stripH);

      ctx.fillStyle = '#047857';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillText('VERIFIED 5-DOMAIN MCQ SCORE BREAKDOWN', W / 2, stripY + 38);

      const subLine = [
        `Buyer Types: ${categoryStats.byCategory.buyer_types.correct}/10`,
        `Domains & Services: ${categoryStats.byCategory.domains.correct}/10`,
        `Deals & Timing: ${categoryStats.byCategory.deals_timing.correct}/10`,
        `Konfi-07 Riddles: ${categoryStats.byCategory.riddle.correct}/10`,
        `Negotiation: ${categoryStats.byCategory.negotiation.correct}/10`,
      ].join('   ·   ');
      ctx.fillStyle = '#064E3B';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.fillText(subLine, W / 2, stripY + 82, totalRowW - 48);

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
      link.download = `Employability-Universe-Shopping-SmartBuyer-${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToastMsg('High-resolution Shopping & Smart Buyer Certificate PNG downloaded!');
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

            <div className="space-y-3 sm:min-w-[300px] lg:max-w-[350px] shrink-0">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                <SmartImage
                  src={SHOPPING_MODULE_META.heroImage}
                  alt="Shopping and Negotiation Skills executive session"
                  fallbackTitle="Shopping & Negotiation Skills"
                  fallbackSubtitle="Smart Buyer Mastery & Deal Lab"
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">MODULE RANK</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[190px]">
                    {rank.title}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Shop XP</div>
                    <div className="font-mono text-base font-bold text-slate-950 dark:text-white tabular-nums">
                      {shoppingProgress.shopXp}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">MCQs</div>
                    <div className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {answeredCount}/{totalMcqs}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Cases</div>
                    <div className="font-mono text-base font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
                      {categoryStats.buyerCasesStudied}/{categoryStats.buyerCasesTotal}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Badges</div>
                    <div className="font-mono text-base font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                      {shoppingProgress.unlockedShopBadges.length}/{SHOPPING_BADGES.length}
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((shoppingProgress.shopXp / 2450) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5 Color-Coded Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            {[
              {
                id: 'notes' as StudioTab,
                label: '01. Live Notes & 6 Buyer Types',
                activeCls: 'bg-blue-700 border-blue-700 text-white shadow-sm',
                idleCls:
                  'border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 hover:border-blue-500',
              },
              {
                id: 'examples' as StudioTab,
                label: `02. 25 Buyer Cases + 38 Riddles (${shoppingProgress.studiedExamples.length} Studied)`,
                activeCls: 'bg-emerald-700 border-emerald-700 text-white shadow-sm',
                idleCls:
                  'border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 hover:border-emerald-500',
              },
              {
                id: 'mcqs' as StudioTab,
                label: `03. 50-MCQ Quiz (${answeredCount}/${totalMcqs})`,
                activeCls: 'bg-teal-700 border-teal-700 text-white shadow-sm',
                idleCls:
                  'border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 hover:border-teal-500',
              },
              {
                id: 'roleplay' as StudioTab,
                label: `04. Role-Play Lab (${shoppingProgress.roleplayScore}/100)`,
                activeCls: 'bg-amber-600 border-amber-600 text-white shadow-sm',
                idleCls:
                  'border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:border-amber-500',
              },
              {
                id: 'credentials' as StudioTab,
                label: `05. 10 Badges & Live Cert (${shoppingProgress.unlockedShopBadges.length}/${SHOPPING_BADGES.length})`,
                activeCls: 'bg-violet-700 border-violet-700 text-white shadow-sm',
                idleCls:
                  'border-violet-200 dark:border-violet-900 bg-violet-50/70 dark:bg-violet-950/30 text-violet-900 dark:text-violet-200 hover:border-violet-500',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* ================================================================= */}
      {/* TAB 1: LIVE CRISP NOTES, 6 VISUAL BUYER ARCHETYPES & DEAL PLAYBOOK */}
      {/* ================================================================= */}
      {activeTab === 'notes' && (
        <div className="space-y-8">
          {/* Top Action Banner */}
          <section className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                LIVE CRISP REVISION NOTES · SMART BUYING &amp; CONSUMER PSYCHOLOGY
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                6 Types of Customers, Annual When-to-Buy Calendar, Deal-Stacking &amp; Scam Defense
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Master buyer psychology from both sides of the counter — whether saving thousands as a smart consumer or pitching deals in sales, procurement &amp; campus interviews.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyCheatSheet}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer whitespace-nowrap"
              >
                {copiedCheatSheet ? (
                  <ClipboardCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
                <span>{copiedCheatSheet ? 'Cheat Sheet Copied' : 'Copy Cheat Sheet'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('examples')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore 25 Solved Cases →</span>
              </button>
            </div>
          </section>

          {/* 6 Visual Types of Customers / Buyer Archetypes */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>SECTION A · 6 BUYER &amp; CUSTOMER ARCHETYPES WITH REAL-WORLD PROFILES</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-0.5">
                  Know Every Type of Buyer (How They Think, Trap Risks &amp; Winning Strategy)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Click any persona to filter its solved cases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BUYER_ARCHETYPES.map((buyer) => {
                const pal = ACCENT_PALETTE[buyer.accent];
                return (
                  <article
                    key={buyer.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                        <SmartImage
                          src={buyer.image}
                          alt={buyer.imageAlt}
                          fallbackTitle={buyer.title}
                          fallbackSubtitle={buyer.tagline}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <div className={`text-xs font-mono font-bold ${pal.textClass}`}>
                            BUYER ARCHETYPE
                          </div>
                          <h4 className="font-display text-lg font-bold text-slate-950 dark:text-white mt-0.5">
                            {buyer.title}
                          </h4>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {buyer.tagline}
                          </p>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {buyer.psychology}
                        </p>

                        <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                          <div className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            KEY BUYING TRIGGERS
                          </div>
                          {buyer.keyTriggers.map((trig) => (
                            <div key={trig} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{trig}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 rounded-xl border border-red-200/70 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 text-xs text-red-900 dark:text-red-200">
                          <strong>Blind-Spot Trap:</strong> {buyer.blindSpotTrap}
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs text-emerald-950 dark:text-emerald-200">
                          <strong>Smart Buying Rule:</strong> {buyer.smartBuyingRule}
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <strong className="text-slate-900 dark:text-slate-200">
                            Seller / Pitch Angle:
                          </strong>{' '}
                          {buyer.sellerStrategy}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setBuyerFilter(buyer.id);
                          setExampleKind('buyer_cases');
                          setActiveTab('examples');
                        }}
                        className={`text-xs font-semibold hover:underline cursor-pointer ${pal.textClass}`}
                      >
                        View Solved Cases for This Buyer →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Section B: When to Buy — Annual Multi-Domain Calendar (10 Domains) */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" />
                <span>SECTION B · WHEN TO BUY ACROSS EVERY MAJOR DOMAIN (10 DOMAINS)</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white mt-0.5">
                Master Timing Calendar — Buy Off-Cycle, Save 15%–65% Year-Round
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOMAIN_TIMING_CALENDAR.map((row) => (
                <div
                  key={row.domain}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                      {row.domain}
                    </h4>
                    <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {row.typicalSavings}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      Best Window:
                    </strong>{' '}
                    {row.bestTimeToBuy}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-rose-700 dark:text-rose-400">Avoid When:</strong>{' '}
                    {row.avoidBuyingWhen}
                  </div>
                  <div className="text-xs text-blue-900 dark:text-blue-200 pt-1.5 border-t border-slate-200 dark:border-slate-800 leading-relaxed">
                    <strong>Golden Trick:</strong> {row.goldenTrick}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: 8-Layer Deal-Stacking Mechanics */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>SECTION C · 8-LAYER DEAL-STACKING FORMULA</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white mt-0.5">
                How Top Deal Strategists Stack Discounts Legally Without Losing Warranty
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {DEAL_STACKING_MECHANICS.map((layer) => (
                <div
                  key={layer.step}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1.5"
                >
                  <div className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    {layer.step}
                  </div>
                  <div className="font-display text-sm font-bold text-slate-950 dark:text-white">
                    {layer.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {layer.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section D: Dark Pattern Alerts + Mentor Kapil's 5 Golden Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>SECTION D · 6 ANTI-SCAM DARK PATTERNS TO SPOT INSTANTLY</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white mt-0.5">
                  Red-Flag Pricing Traps &amp; Exact Counter-Moves
                </h3>
              </div>

              <div className="space-y-3">
                {DARK_PATTERN_ALERTS.map((dp) => (
                  <div
                    key={dp.pattern}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 space-y-1.5 text-xs"
                  >
                    <div className="font-display text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{dp.pattern}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>Trap:</strong> {dp.howItTricks}
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      <strong>Counter-Move:</strong> {dp.counterMove}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-[#FFFDF7] via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MENTOR KAPIL&apos;S SMART BUYER CODE</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white mt-0.5">
                    5 Golden Rules Before You Spend a Single Rupee
                  </h3>
                </div>

                <ol className="space-y-3">
                  {MENTOR_KAPIL_BUYER_RULES.map((rule, idx) => (
                    <li
                      key={rule}
                      className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-white/90 dark:bg-slate-950/80 p-3.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="font-mono font-extrabold text-amber-700 dark:text-amber-400 shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t border-amber-200/70 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Ready to test your deal IQ?
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('mcqs')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer"
                >
                  <span>Start 50-MCQ Quiz →</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: 25 REAL-WORLD BUYER & DOMAIN SOLVED EXAMPLES + 38 KONFI-07 */}
      {/* ================================================================= */}
      {activeTab === 'examples' && (
        <div className="space-y-6">
          {/* Sub-kind switcher & search */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                {
                  id: 'buyer_cases' as ExampleKindFilter,
                  label: `25 Real-World Buyer & Domain Cases (${categoryStats.buyerCasesStudied}/25)`,
                },
                { id: 'riddles' as ExampleKindFilter, label: 'Konfi-07 Riddles (32)' },
                { id: 'cases' as ExampleKindFilter, label: 'Negotiation Scripts (6)' },
                { id: 'all' as ExampleKindFilter, label: 'All Solved (63)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setExampleKind(btn.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    exampleKind === btn.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {(exampleKind === 'buyer_cases' || exampleKind === 'all') && (
                <>
                  <select
                    value={buyerFilter}
                    onChange={(e) =>
                      setBuyerFilter(e.target.value as 'All' | BuyerArchetypeId)
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="All">All 6 Buyer Types</option>
                    {BUYER_ARCHETYPES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>

                  <select
                    value={domainGroupFilter}
                    onChange={(e) =>
                      setDomainGroupFilter(e.target.value as DomainGroupFilter)
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    {DOMAIN_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g === 'All' ? 'All 5 Domain Groups' : g}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {(exampleKind === 'riddles' || exampleKind === 'all') && (
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
                  placeholder="Search product, domain, buyer..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>
              Total Studied:{' '}
              <strong className="text-slate-950 dark:text-white">
                {shoppingProgress.studiedExamples.length}/63
              </strong>{' '}
              · Buyer Cases:{' '}
              <strong className="text-emerald-700 dark:text-emerald-400">
                {categoryStats.buyerCasesStudied}/25
              </strong>{' '}
              (First 25 studied award +10 XP each · 15+ Buyer Cases unlock 25-Domain Buyer Analyst badge)
            </span>
            {(buyerFilter !== 'All' || domainGroupFilter !== 'All' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setBuyerFilter('All');
                  setDomainGroupFilter('All');
                  setSearchTerm('');
                }}
                className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* 25 Real-World Solved Buyer & Domain Examples */}
          {(exampleKind === 'buyer_cases' || exampleKind === 'all') && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  25 Real-World Solved Examples: Products, Services, Buyer Types &amp; Deal Math
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Showing {filteredBuyerCases.length} of {SOLVED_BUYER_DOMAIN_EXAMPLES.length}
                </span>
              </div>

              {filteredBuyerCases.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No solved buyer cases match your current filter. Click &ldquo;Reset Filters&rdquo; to view all 25 real-world examples.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredBuyerCases.map((ex) => {
                    const buyer = BUYER_ARCHETYPE_MAP[ex.buyerType];
                    const pal = ACCENT_PALETTE[buyer?.accent ?? 'blue'];
                    const studied = shoppingProgress.studiedExamples.includes(ex.id);

                    return (
                      <article
                        key={ex.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="p-5 space-y-3.5">
                          {/* Top Row: Buyer Archetype Visual Thumbnail + Metadata + Studied CTA */}
                          <div className="flex items-start gap-3.5">
                            {buyer && (
                              <div className="w-24 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shrink-0">
                                <SmartImage
                                  src={buyer.image}
                                  alt={buyer.imageAlt}
                                  fallbackTitle={buyer.title}
                                  fallbackSubtitle={ex.domain}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                  <span className={pal.textClass}>{ex.number}</span> ·{' '}
                                  {ex.domainGroup} · {ex.domain}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleMarkStudied(ex.id)}
                                  disabled={studied}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer ${
                                    studied
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{studied ? 'Studied' : 'Mark Studied'}</span>
                                </button>
                              </div>

                              <h4 className="font-display text-base font-bold text-slate-950 dark:text-white leading-snug">
                                {ex.productOrService}
                              </h4>

                              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Buyer Type:{' '}
                                <span className={`font-semibold ${pal.textClass}`}>
                                  {buyer?.title}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* When to Buy Strip */}
                          <div className="px-3 py-2 rounded-xl border border-blue-200/70 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2">
                            <CalendarClock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>When to Buy:</strong> {ex.whenToBuy}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            <strong className="text-slate-950 dark:text-white">Scenario:</strong>{' '}
                            {ex.scenario}
                          </p>

                          <div className="p-3 rounded-xl border border-red-200/70 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 text-xs text-red-900 dark:text-red-200 leading-relaxed">
                            <strong>Common Trap:</strong> {ex.commonTrap}
                          </div>

                          <div className="p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                            <strong>Solved Smart-Buyer Action:</strong> {ex.solvedAction}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                              <div className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <span>SAVINGS MATH</span>
                              </div>
                              <div className="mt-0.5 font-medium leading-snug">
                                {ex.savingsMath}
                              </div>
                            </div>
                            <div className="p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200">
                              <div className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                <span>PRO TIP</span>
                              </div>
                              <div className="mt-0.5 leading-snug">{ex.proTip}</div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Worked Negotiation Cases (6) */}
          {(exampleKind === 'cases' || exampleKind === 'all') &&
            filteredCases.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  Solved Commercial &amp; Campus Negotiation Dialogues (6 Cases)
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

          {/* Solved Konfi-07 Shopping List Riddles (32) */}
          {(exampleKind === 'riddles' || exampleKind === 'all') &&
            filteredRiddles.length > 0 && (
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
                          &ldquo;{r.riddlePrompt}&rdquo;
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

      {/* ================================================================= */}
      {/* TAB 3: 50-MCQ GRADED QUIZ WITH HINTS & 5-DOMAIN SUBSCORES         */}
      {/* ================================================================= */}
      {activeTab === 'mcqs' && (
        <div className="space-y-5">
          {/* 5-Domain Live Subscore Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(
              [
                'buyer_types',
                'domains',
                'deals_timing',
                'riddle',
                'negotiation',
              ] as ShoppingMcqCategory[]
            ).map((cat) => {
              const stat = categoryStats.byCategory[cat];
              const active = mcqFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMcqFilter(active ? 'all' : cat)}
                  className={`text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
                    active
                      ? 'border-teal-600 dark:border-teal-400 bg-teal-50/70 dark:bg-teal-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500'
                  }`}
                >
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {MCQ_CATEGORY_LABELS[cat]}
                  </div>
                  <div className="font-mono text-base font-bold text-slate-950 dark:text-white tabular-nums mt-0.5">
                    {stat.correct}/{stat.total}{' '}
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      ({stat.answered} done)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all' as const, label: `All (${totalMcqs})` },
                { id: 'buyer_types' as const, label: 'Buyer Types (10)' },
                { id: 'domains' as const, label: 'Domains & Services (10)' },
                { id: 'deals_timing' as const, label: 'Deals & Timing (10)' },
                { id: 'riddle' as const, label: 'Konfi-07 Riddles (10)' },
                { id: 'negotiation' as const, label: 'Negotiation (10)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setMcqFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    mcqFilter === f.id
                      ? 'bg-teal-700 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setOnlyUnanswered((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                  onlyUnanswered
                    ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {onlyUnanswered ? 'Showing Unanswered Only' : 'Filter: Unanswered Only'}
              </button>
            </div>

            <div className="font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
              Score:{' '}
              <strong className="text-slate-950 dark:text-white">
                {correctCount}/{answeredCount} ({accuracyPct}%)
              </strong>{' '}
              · Clean: +40 XP · Hint: +25 XP
            </div>
          </div>

          {filteredMcqs.length === 0 ? (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-8 text-center space-y-2">
              <div className="font-display text-lg font-bold text-emerald-900 dark:text-emerald-200">
                All questions in this filter are answered!
              </div>
              <button
                type="button"
                onClick={() => {
                  setOnlyUnanswered(false);
                  setMcqFilter('all');
                }}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 underline cursor-pointer"
              >
                View all {totalMcqs} questions &amp; explanations
              </button>
            </div>
          ) : (
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
                      <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                        Q{idx + 1} · {MCQ_CATEGORY_LABELS[item.category]} · {item.sourceRef}
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
                          'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-teal-500';
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
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 4: ROLE-PLAY NEGOTIATION SIMULATOR LAB                        */}
      {/* ================================================================= */}
      {activeTab === 'roleplay' && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {liveEval && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>LIVE RUBRIC ESTIMATE</span>
                      <span className="text-amber-700 dark:text-amber-400 tabular-nums">
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

      {/* ================================================================= */}
      {/* TAB 5: 10 PNG BADGES & LIVE-SCORED SHOPPING CERTIFICATE (PNG)     */}
      {/* ================================================================= */}
      {activeTab === 'credentials' && (
        <div className="space-y-8">
          {/* 10 Shopping & Smart Buyer Badges */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Shopping &amp; Smart Buyer Badges ({shoppingProgress.unlockedShopBadges.length}/
                  {SHOPPING_BADGES.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Unlock mastery medallions across Buyer Psychology, Multi-Domain Cases, Deals &amp; Timing, Riddles, and Negotiation — downloadable as 1200×1200 PNGs.
                </p>
              </div>
              {unlockedBadgesList.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadAllEarnedBadges}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Download All Earned ({unlockedBadgesList.length})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {SHOPPING_BADGES.map((badge) => {
                const unlocked = shoppingProgress.unlockedShopBadges.includes(badge.id);
                const palette = ACCENT_PALETTE[badge.accent] ?? ACCENT_PALETTE.blue;
                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 ${
                      unlocked
                        ? palette.borderClass
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-950/70 flex items-center justify-center">
                        {unlocked ? (
                          <Trophy className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase">
                        {unlocked ? 'Earned' : 'Locked'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white leading-snug">
                        {badge.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-black/10 dark:border-white/10 space-y-2">
                      <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300">
                        {badge.criteriaLabel}
                      </div>
                      {unlocked ? (
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
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PNG</span>
                        </button>
                      ) : (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Complete milestone to unlock
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Official Shopping & Smart Buyer Certificate (Live Score Updated!) */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Official Shopping &amp; Smart Buyer Certificate (PNG)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unlock by completing all 50 MCQs ({answeredCount}/{totalMcqs}) OR completing 20+ MCQs + Role-Play Lab ({shoppingProgress.roleplayScore}/100). Every new MCQ score, studied case, and badge updates your certificate live (and syncs to your Portal &amp; Capstone Certificates!).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  disabled={!shoppingProgress.completedModule || downloadingCert}
                  onClick={handleDownloadCertificatePng}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {shoppingProgress.completedModule ? (
                    <Download className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>
                    {!shoppingProgress.completedModule
                      ? 'Unlock via 50 MCQs or 20 MCQs + Lab'
                      : downloadingCert
                      ? 'Generating PNG...'
                      : 'Download Certificate (PNG)'}
                  </span>
                </button>
                {onRequestEmail && learnerEmail && shoppingProgress.completedModule && (
                  <button
                    type="button"
                    onClick={() => {
                      const png = buildShoppingCertificateDataUrl(
                        learnerName,
                        learnerEmail,
                        shoppingProgress
                      );
                      const { htmlBody, textFallback } = buildCredentialEmailHtml({
                        learnerName,
                        learnerEmail,
                        credentialKindLabel: 'Shopping & Smart Buyer Certificate (PNG)',
                        credentialTitle: 'Certificate of Smart Buyer & Negotiation Mastery',
                        certificateId: shoppingProgress.shopCertificateId,
                        summaryPoints: [
                          `Shopping MCQs Correct: ${shoppingProgress.correctMcqs.length}/${SHOPPING_MCQS.length}`,
                          `Negotiation Role-Play Lab: ${shoppingProgress.roleplayScore}/100 · Shop XP: ${shoppingProgress.shopXp} XP`,
                          `Badges Unlocked: ${shoppingProgress.unlockedShopBadges.length}/${SHOPPING_BADGES.length}`,
                        ],
                      });
                      onRequestEmail({
                        recipientEmail: learnerEmail,
                        recipientName: learnerName,
                        credentialType: 'certificate',
                        title: 'Shopping & Smart Buyer Certificate (PNG)',
                        subject:
                          'Your Shopping & Smart Buyer Certificate — EMPLOYABILITY UNIVERSE With Kapil',
                        htmlBody,
                        textFallback,
                        targetView: 'shopping',
                        attachment: {
                          filename:
                            'Employability-Universe-Shopping-Negotiation-Certificate-Kapil.png',
                          mimeType: 'image/png',
                          base64OrDataUrl: png,
                        },
                      });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email to Sign-Up ID</span>
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 dark:border-slate-700 bg-gradient-to-br from-[#FDFBF7] via-white to-emerald-50 text-slate-900 p-6 sm:p-10 shadow-xl">
              <div className="border-2 border-amber-600/70 p-6 sm:p-10 space-y-6 text-center">
                <div className="space-y-2">
                  <div className="font-mono text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase">
                    EMPLOYABILITY UNIVERSE WITH KAPIL · SHOPPING, SMART BUYER &amp; NEGOTIATION
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                    CERTIFICATE OF SMART BUYER &amp; NEGOTIATION MASTERY
                  </h3>
                  <div className="w-56 h-0.5 bg-amber-600/70 mx-auto" />
                  <div className="text-xs sm:text-sm font-semibold text-slate-700">
                    {categoryStats.honorsTier} · 6 Buyer Types · 25 Domain Cases · 50 Graded MCQs
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                    Proudly awarded to verified learner
                  </div>
                  <div className="font-display text-3xl sm:text-5xl font-extrabold text-slate-950">
                    {learnerName}
                  </div>
                  <div className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {learnerEmail} · Rank: {rank.title}
                    </span>
                  </div>
                </div>

                {/* 5 Live Score Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border border-slate-200 bg-slate-50 rounded-xl p-4">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">SHOP XP</div>
                    <div className="font-display text-base sm:text-lg font-bold text-slate-950 tabular-nums">
                      {shoppingProgress.shopXp} XP
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">50-MCQ SCORE</div>
                    <div className="font-display text-base sm:text-lg font-bold text-emerald-700 tabular-nums">
                      {correctCount}/{totalMcqs} ({accuracyPct}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">BUYER CASES</div>
                    <div className="font-display text-base sm:text-lg font-bold text-slate-950 tabular-nums">
                      {categoryStats.buyerCasesStudied}/{categoryStats.buyerCasesTotal}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">ROLE-PLAY LAB</div>
                    <div className="font-display text-base sm:text-lg font-bold text-slate-950 tabular-nums">
                      {shoppingProgress.roleplayScore}/100
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[10px] font-mono text-slate-500">BADGES</div>
                    <div className="font-display text-base sm:text-lg font-bold text-amber-700 tabular-nums">
                      {shoppingProgress.unlockedShopBadges.length}/{SHOPPING_BADGES.length}
                    </div>
                  </div>
                </div>

                {/* 5-Domain MCQ Subscore Strip */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-center space-y-1">
                  <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                    Verified 5-Domain MCQ Mastery Breakdown
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-mono font-semibold text-emerald-950 tabular-nums">
                    <span>Buyer Types: {categoryStats.byCategory.buyer_types.correct}/10</span>
                    <span>·</span>
                    <span>Domains: {categoryStats.byCategory.domains.correct}/10</span>
                    <span>·</span>
                    <span>Deals &amp; Timing: {categoryStats.byCategory.deals_timing.correct}/10</span>
                    <span>·</span>
                    <span>Riddles: {categoryStats.byCategory.riddle.correct}/10</span>
                    <span>·</span>
                    <span>Negotiation: {categoryStats.byCategory.negotiation.correct}/10</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                  <div className="text-center sm:text-left">
                    <div className="text-sm font-bold text-slate-900">{issueDate}</div>
                    <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                      ID: {shoppingProgress.shopCertificateId}
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-amber-500 flex flex-col items-center justify-center text-center shrink-0">
                    <Award className="w-4 h-4 text-amber-300 mb-0.5" />
                    <span className="text-[8px] font-mono uppercase text-white">
                      Powered By
                    </span>
                    <span className="font-display text-xs font-extrabold text-amber-300">
                      KAPIL
                    </span>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="font-display text-lg font-extrabold text-slate-950">
                      Powered By Kapil
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                      Lead Employability Mentor
                    </div>
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
