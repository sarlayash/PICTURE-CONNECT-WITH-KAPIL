import React, { useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Lock,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  ADVANCED_BADGES,
  ADVANCED_META,
  AdvancedBadgeDefinition,
  getAdvancedRank,
} from '../data/advancedTrackData';
import {
  AdvancedProgressDoc,
  AdvancedSubmissionDoc,
} from '../services/advancedFirestoreService';

interface AdvancedAchievementsProps {
  learnerName: string;
  learnerEmail: string;
  advProgress: AdvancedProgressDoc;
  submissions: Record<string, AdvancedSubmissionDoc>;
  onJumpToChallenges: () => void;
}

const ACCENT_STYLES: Record<string, string> = {
  blue: 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300',
  emerald:
    'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
  amber:
    'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
  violet:
    'border-violet-300 dark:border-violet-800 bg-violet-50/70 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
  rose: 'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300',
  cyan: 'border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300',
};

const ADV_BADGE_PALETTE: Record<
  AdvancedBadgeDefinition['accent'],
  { primary: string; glow: string; light: string }
> = {
  blue: { primary: '#4F46E5', glow: '#818CF8', light: '#E0E7FF' },
  emerald: { primary: '#059669', glow: '#34D399', light: '#D1FAE5' },
  amber: { primary: '#D97706', glow: '#FBBF24', light: '#FEF3C7' },
  violet: { primary: '#7C3AED', glow: '#A78BFA', light: '#EDE9FE' },
  rose: { primary: '#E11D48', glow: '#FB7185', light: '#FFE4E6' },
  cyan: { primary: '#0891B2', glow: '#22D3EE', light: '#CFFAFE' },
};

function renderAndDownloadAdvBadgePng(
  badge: AdvancedBadgeDefinition,
  learnerName: string,
  advCertificateId: string,
  issueDate: string
): void {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const palette = ADV_BADGE_PALETTE[badge.accent] ?? ADV_BADGE_PALETTE.blue;

  // Deep obsidian-indigo radial backdrop
  const bg = ctx.createRadialGradient(S / 2, 420, 90, S / 2, S / 2, 760);
  bg.addColorStop(0, '#1E1B4B');
  bg.addColorStop(0.55, '#0F172A');
  bg.addColorStop(1, '#030712');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  // Double metallic border
  ctx.strokeStyle = 'rgba(217, 179, 92, 0.72)';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, S - 88, S - 88);

  ctx.strokeStyle = 'rgba(129, 140, 248, 0.32)';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, S - 124, S - 124);

  // Header tag
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.glow;
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.fillText('EMPLOYABILITY SKILLS WITH KAPIL · AI PICTURE CONNECT', S / 2, 128);

  // Central Hexagonal Prestige Emblem
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

  // Outer gold ring
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#090D16';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#D9B35C';
  ctx.stroke();

  // Accent ring
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 22, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = palette.glow;
  ctx.stroke();

  // Precision ticks
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const r1 = outerR - 34;
    const r2 = i % 3 === 0 ? outerR - 50 : outerR - 41;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.strokeStyle = i % 3 === 0 ? '#FDE047' : 'rgba(255,255,255,0.22)';
    ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
    ctx.stroke();
  }

  // Hexagonal AI crystal shield
  ctx.save();
  ctx.translate(cx, cy - 18);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    const r = 98;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const shieldGrad = ctx.createLinearGradient(-85, -85, 85, 85);
  shieldGrad.addColorStop(0, palette.primary);
  shieldGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = shieldGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FDE047';
  ctx.stroke();

  // 4-point AI spark inside shield
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? 58 : 18;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#FDE047';
  ctx.fill();
  ctx.restore();

  // Medallion attribution stamp
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.fillText('POWERED BY KAPIL · AI TRACK', cx, cy + 148);

  // Badge title & criteria
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 58px "Bricolage Grotesque", Georgia, sans-serif';
  ctx.fillText(badge.title, S / 2, 765, S - 180);

  ctx.fillStyle = palette.light;
  ctx.font = '500 25px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(badge.criteriaLabel, S / 2, 818, S - 180);

  ctx.strokeStyle = 'rgba(217, 179, 92, 0.72)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(S / 2 - 220, 856);
  ctx.lineTo(S / 2 + 220, 856);
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('AWARDED TO VERIFIED LEARNER', S / 2, 912);

  ctx.fillStyle = '#FDE047';
  ctx.font = '800 44px "Bricolage Grotesque", sans-serif';
  ctx.fillText(learnerName, S / 2, 972, S - 180);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(issueDate, 92, 1112);

  ctx.textAlign = 'right';
  ctx.fillText(`ADV ID: ${advCertificateId}`, S - 92, 1112);

  const safeSlug = badge.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `AI-Picture-Connect-Advanced-Badge-${safeSlug}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const AdvancedAchievements: React.FC<AdvancedAchievementsProps> = ({
  learnerName,
  learnerEmail,
  advProgress,
  submissions,
  onJumpToChallenges,
}) => {
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [downloadingBadgeId, setDownloadingBadgeId] = useState<string | null>(null);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const completedCount = advProgress.completedChallenges.length;
  const subCount = Object.keys(submissions).length;
  const divisor = Math.max(completedCount, subCount);
  const avgScore =
    divisor > 0 ? Math.round(advProgress.totalScoreSum / divisor) : 0;
  const rank = getAdvancedRank(advProgress.advXp);
  const isFullMastery = completedCount >= 25;
  const unlockedBadgesList = ADVANCED_BADGES.filter((b) =>
    advProgress.unlockedAdvBadges.includes(b.id)
  );

  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadBadgePng = (badge: AdvancedBadgeDefinition) => {
    setDownloadingBadgeId(badge.id);
    setDownloadNote(null);
    try {
      renderAndDownloadAdvBadgePng(
        badge,
        learnerName,
        advProgress.advCertificateId,
        issueDate
      );
      setDownloadNote(`Advanced PNG badge "${badge.title}" downloaded!`);
    } finally {
      setDownloadingBadgeId(null);
    }
  };

  const handleDownloadAllEarned = () => {
    if (unlockedBadgesList.length === 0) return;
    setDownloadNote(null);
    unlockedBadgesList.forEach((badge, idx) => {
      window.setTimeout(() => {
        renderAndDownloadAdvBadgePng(
          badge,
          learnerName,
          advProgress.advCertificateId,
          issueDate
        );
      }, idx * 220);
    });
    setDownloadNote(
      `Downloading ${unlockedBadgesList.length} Advanced PNG badge${
        unlockedBadgesList.length > 1 ? 's' : ''
      }...`
    );
  };

  const handleDownloadAdvCertPng = () => {
    setDownloadingCert(true);
    setDownloadNote(null);

    try {
      const canvas = canvasRef.current ?? document.createElement('canvas');
      const W = 2400;
      const H = 1700;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Warm ivory editorial background inspired by the PDF workbook
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#FDFBF5');
      bgGrad.addColorStop(0.5, '#FFFFFF');
      bgGrad.addColorStop(1, '#F6F3EB');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Top & Bottom indigo executive trim
      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(0, 0, W, 38);
      ctx.fillRect(0, H - 38, W, 38);

      // Double gold & indigo frames
      ctx.strokeStyle = '#312E81';
      ctx.lineWidth = 6;
      ctx.strokeRect(72, 72, W - 144, H - 144);

      ctx.strokeStyle = '#B48A3E';
      ctx.lineWidth = 3;
      ctx.strokeRect(94, 94, W - 188, H - 188);

      // Corner ornaments
      const corners = [
        [94, 94, 1, 1],
        [W - 94, 94, -1, 1],
        [94, H - 94, 1, -1],
        [W - 94, H - 94, -1, -1],
      ];
      ctx.strokeStyle = '#B48A3E';
      ctx.lineWidth = 5;
      corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * 50);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * 50, cy);
        ctx.stroke();
      });

      // Header
      ctx.textAlign = 'center';
      ctx.fillStyle = '#4338CA';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.fillText(
        `BUILDING EMPLOYABILITY SKILLS WITH KAPIL  ·  ${ADVANCED_META.title}`,
        W / 2,
        215
      );

      // Main Title
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 72px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText(
        isFullMastery
          ? 'CERTIFICATE OF AI-POWERED VISUAL MASTERY'
          : 'CERTIFICATE OF AI-POWERED EMPLOYABILITY',
        W / 2,
        328
      );

      // Gold line
      ctx.strokeStyle = '#B48A3E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 310, 368);
      ctx.lineTo(W / 2 + 310, 368);
      ctx.stroke();

      // Tagline
      ctx.fillStyle = '#475569';
      ctx.font = '700 28px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(ADVANCED_META.tagline, W / 2, 430);

      // Awarded to
      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText('THIS ADVANCED CREDENTIAL IS PROUDLY AWARDED TO', W / 2, 536);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 94px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText(learnerName, W / 2, 658, W - 440);

      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 480, 698);
      ctx.lineTo(W / 2 + 480, 698);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '500 24px "JetBrains Mono", monospace';
      ctx.fillText(`Verified Google Learner · ${learnerEmail}`, W / 2, 748, W - 420);

      // Citation
      ctx.fillStyle = '#334155';
      ctx.font = '400 31px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        'for mastering AI Prompt Design, Visual Evidence Interpretation, SCARE Storytelling,',
        W / 2,
        842,
        W - 400
      );
      ctx.fillText(
        `and Workplace Reasoning across ${completedCount} of 25 Visual Challenges (Products · Values · Abstract · Placements · Services).`,
        W / 2,
        892,
        W - 400
      );

      // 4-Metric Ribbon
      const boxX = 220;
      const boxY = 974;
      const boxW = W - 440;
      const boxH = 182;
      ctx.fillStyle = '#F8F7F2';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#D6CEB8';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      const metrics = [
        { label: 'CHALLENGES SCORED', value: `${completedCount} / 25` },
        { label: 'AVG AUTO-SCORE', value: `${avgScore} / 100` },
        { label: 'ADVANCED XP', value: `${advProgress.advXp} XP` },
        {
          label: 'ADV BADGES & RANK',
          value: `${advProgress.unlockedAdvBadges.length}/${ADVANCED_BADGES.length} · ${rank.title}`,
        },
      ];
      const colW = boxW / metrics.length;
      metrics.forEach((m, idx) => {
        const cx = boxX + colW * idx + colW / 2;
        if (idx > 0) {
          ctx.beginPath();
          ctx.moveTo(boxX + colW * idx, boxY + 30);
          ctx.lineTo(boxX + colW * idx, boxY + boxH - 30);
          ctx.strokeStyle = '#D6CEB8';
          ctx.stroke();
        }
        ctx.fillStyle = '#64748B';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(m.label, cx, boxY + 66, colW - 36);

        ctx.fillStyle = '#0F172A';
        ctx.font = idx === 3 ? '800 25px "Bricolage Grotesque", sans-serif' : '800 36px "Bricolage Grotesque", sans-serif';
        ctx.fillText(m.value, cx, boxY + 124, colW - 36);
      });

      // Signature Left
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(issueDate, 240, 1410);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(240, 1430);
      ctx.lineTo(680, 1430);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText(`ISSUED · ID: ${advProgress.advCertificateId}`, 240, 1470);

      // Center Seal
      const sealX = W / 2;
      const sealY = 1405;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 108, 0, Math.PI * 2);
      ctx.fillStyle = '#1E1B4B';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#B48A3E';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, 92, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FACC15';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.font = '700 17px "JetBrains Mono", monospace';
      ctx.fillText('AI ADVANCED TRACK', sealX, sealY - 28);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 25px "Bricolage Grotesque", sans-serif';
      ctx.fillText('POWERED BY', sealX, sealY + 4);
      ctx.fillStyle = '#FDE047';
      ctx.font = '800 36px "Bricolage Grotesque", sans-serif';
      ctx.fillText('KAPIL', sealX, sealY + 44);

      // Signature Right
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText('Powered By Kapil', W - 240, 1410);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(W - 680, 1430);
      ctx.lineTo(W - 240, 1430);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText('AI-POWERED EMPLOYABILITY MENTOR', W - 240, 1470);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'AI-Picture-Connect-Advanced-Certificate-Powered-By-Kapil.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadNote('High-resolution Advanced Track PNG certificate downloaded!');
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Summary */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-white dark:bg-slate-900 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-400">
            ADVANCED TRACK CREDENTIALS · SEPARATE FROM CORE TRACK
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            {learnerName} — {rank.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Every AI visual challenge you upload, evaluate, and score builds your dedicated Advanced XP, unlocks these 8 collectible Advanced Track PNG badges, and updates your AI-Powered Employability Certificate{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              Powered By Kapil
            </span>
            . Your Core Track XP, Levels 1–10, and Core badges remain untouched.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Advanced XP</div>
            <div className="font-mono text-2xl font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
              {advProgress.advXp}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Challenges</div>
            <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
              {completedCount}/25
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Score</div>
            <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {avgScore}/100
            </div>
          </div>
        </div>
      </div>

      {downloadNote && (
        <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadNote}</span>
        </div>
      )}

      {/* 8 Collectible Advanced Badges */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Advanced Mastery Badges ({advProgress.unlockedAdvBadges.length} / {ADVANCED_BADGES.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock theme and distinction medallions to download high-res 1200 × 1200 px PNG collectibles.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {unlockedBadgesList.length > 0 && (
              <button
                type="button"
                onClick={handleDownloadAllEarned}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Download All Earned ({unlockedBadgesList.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={onJumpToChallenges}
              className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Back to 25 Visual Challenges →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADVANCED_BADGES.map((badge) => {
            const unlocked = advProgress.unlockedAdvBadges.includes(badge.id);
            const busy = downloadingBadgeId === badge.id;
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                  unlocked
                    ? ACCENT_STYLES[badge.accent] || ACCENT_STYLES.blue
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      unlocked
                        ? 'bg-white/85 dark:bg-slate-950/70 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {unlocked ? (
                      <Trophy className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                    {unlocked ? 'Earned' : 'Locked'}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-base font-bold text-slate-950 dark:text-white">
                    {badge.title}
                  </h4>
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
                      disabled={busy}
                      onClick={() => handleDownloadBadgePng(badge)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>{busy ? 'Exporting PNG...' : 'Download PNG'}</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 shrink-0" />
                      <span>Complete milestone to unlock PNG</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Advanced Certificate Preview & PNG Export */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Official Advanced Track PNG Certificate · Powered By Kapil
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Exports a 2400 × 1700 px PNG certificate showcasing your AI-Powered Visual Mastery score, challenges, and Advanced ID ({advProgress.advCertificateId}).
            </p>
          </div>

          <button
            type="button"
            disabled={downloadingCert}
            onClick={handleDownloadAdvCertPng}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <Award className="w-4 h-4" />
            <span>
              {downloadingCert
                ? 'Generating PNG...'
                : 'Download Advanced Certificate (PNG)'}
            </span>
          </button>
        </div>

        {/* Responsive Preview Card */}
        <div className="rounded-2xl border-4 border-indigo-950 dark:border-indigo-700 bg-gradient-to-br from-[#FDFBF5] via-white to-[#F5F1E6] text-slate-900 p-6 sm:p-10 shadow-xl">
          <div className="border-2 border-amber-700/60 p-6 sm:p-10 space-y-8 text-center relative">
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold tracking-[0.2em] text-indigo-700 uppercase">
                BUILDING EMPLOYABILITY SKILLS WITH KAPIL · {ADVANCED_META.title}
              </div>
              <h4 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                {isFullMastery
                  ? 'CERTIFICATE OF AI-POWERED VISUAL MASTERY'
                  : 'CERTIFICATE OF AI-POWERED EMPLOYABILITY'}
              </h4>
              <div className="w-48 h-0.5 bg-amber-700/60 mx-auto" />
              <div className="text-sm text-slate-600 font-semibold pt-1">
                {ADVANCED_META.tagline}
              </div>
            </div>

            <div className="space-y-2 py-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                This advanced credential is proudly awarded to
              </div>
              <div className="font-display text-3xl sm:text-5xl font-extrabold text-slate-950">
                {learnerName}
              </div>
              <div className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Google Learner · {learnerEmail}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-amber-900/15 bg-amber-50/40 rounded-xl p-4 text-center">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  Challenges
                </div>
                <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                  {completedCount} / 25
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  Avg Auto-Score
                </div>
                <div className="font-display text-lg font-bold text-emerald-700 tabular-nums">
                  {avgScore} / 100
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  Advanced XP
                </div>
                <div className="font-display text-lg font-bold text-indigo-700 tabular-nums">
                  {advProgress.advXp} XP
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">
                  Rank &amp; Badges
                </div>
                <div className="font-display text-sm font-bold text-slate-950">
                  {advProgress.unlockedAdvBadges.length}/{ADVANCED_BADGES.length} · {rank.title}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="text-center sm:text-left">
                <div className="text-sm font-bold text-slate-900">{issueDate}</div>
                <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                  ADV ID: {advProgress.advCertificateId}
                </div>
              </div>

              <div className="w-28 h-28 rounded-full bg-indigo-950 border-4 border-amber-500 flex flex-col items-center justify-center text-center shadow-lg shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
                <span className="text-[8px] font-mono uppercase tracking-widest text-white">
                  AI Track
                </span>
                <span className="font-display text-sm font-extrabold text-amber-300 leading-none">
                  POWERED BY KAPIL
                </span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-display text-lg font-extrabold text-slate-950">
                  Powered By Kapil
                </div>
                <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                  AI-Powered Employability Mentor
                </div>
              </div>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </section>
    </div>
  );
};
