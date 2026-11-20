import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Lock,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  BADGES,
  BadgeDefinition,
  getLearnerRank,
  LEVELS,
  WORKSHOP_META,
} from '../data/workshopData';
import { LearnerProgressDoc } from '../services/firestoreService';

interface AchievementsCertificateProps {
  learnerName: string;
  learnerEmail: string;
  progress: LearnerProgressDoc;
  onNavigateToLevels: (levelNum?: number) => void;
}

const ACCENT_STYLES: Record<string, string> = {
  blue: 'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
  emerald:
    'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
  amber:
    'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
  violet:
    'border-violet-300 dark:border-violet-800 bg-violet-50/70 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
  rose: 'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300',
  cyan: 'border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300',
};

const BADGE_CANVAS_PALETTE: Record<
  BadgeDefinition['accent'],
  { primary: string; glow: string; light: string }
> = {
  blue: { primary: '#2563EB', glow: '#60A5FA', light: '#DBEAFE' },
  emerald: { primary: '#059669', glow: '#34D399', light: '#D1FAE5' },
  amber: { primary: '#D97706', glow: '#FBBF24', light: '#FEF3C7' },
  violet: { primary: '#7C3AED', glow: '#A78BFA', light: '#EDE9FE' },
  rose: { primary: '#E11D48', glow: '#FB7185', light: '#FFE4E6' },
  cyan: { primary: '#0891B2', glow: '#22D3EE', light: '#CFFAFE' },
};

function renderAndDownloadBadgePng(
  badge: BadgeDefinition,
  learnerName: string,
  certificateId: string,
  issueDate: string
): void {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const palette = BADGE_CANVAS_PALETTE[badge.accent] ?? BADGE_CANVAS_PALETTE.blue;

  // 1. Deep gallery obsidian radial backdrop
  const bg = ctx.createRadialGradient(S / 2, 430, 80, S / 2, S / 2, 760);
  bg.addColorStop(0, '#16223A');
  bg.addColorStop(0.55, '#0B1120');
  bg.addColorStop(1, '#050811');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  // Subtle architectural outer hairline border + gold inner accent
  ctx.strokeStyle = 'rgba(200, 155, 60, 0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, S - 88, S - 88);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, S - 124, S - 124);

  // Header metadata
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.glow;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('EMPLOYABILITY SKILLS WITH KAPIL · PICTURE CONNECT BADGE', S / 2, 128);

  // Central Collectible Medallion
  const cx = S / 2;
  const cy = 430;
  const outerR = 235;

  // Ambient aura glow behind medallion
  const aura = ctx.createRadialGradient(cx, cy, 120, cx, cy, 320);
  aura.addColorStop(0, `${palette.primary}55`);
  aura.addColorStop(1, 'transparent');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.fill();

  // Outer notched metallic gold ring
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#C89B3C';
  ctx.stroke();

  // Colored inner rim
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 24, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = palette.glow;
  ctx.stroke();

  // Segmented compass ticks along inner rim
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    const r1 = outerR - 36;
    const r2 = i % 2 === 0 ? outerR - 50 : outerR - 43;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.strokeStyle = i % 6 === 0 ? '#FDE047' : 'rgba(255,255,255,0.28)';
    ctx.lineWidth = i % 6 === 0 ? 3.5 : 1.5;
    ctx.stroke();
  }

  // Geometric Star / Shield Emblem inside Medallion
  ctx.save();
  ctx.translate(cx, cy - 16);

  // Octagonal shield core
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

  // 4-point visionary star inside shield
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? 58 : 20;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#FDE047';
  ctx.fill();
  ctx.restore();

  // Lower medallion stamp
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('POWERED BY KAPIL', cx, cy + 148);

  // Badge Title & Description
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 66px "Bricolage Grotesque", Georgia, sans-serif';
  ctx.fillText(badge.title, S / 2, 765, S - 180);

  ctx.fillStyle = palette.light;
  ctx.font = '500 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(badge.criteriaLabel, S / 2, 818, S - 180);

  // Subtle gold divider
  ctx.strokeStyle = 'rgba(200, 155, 60, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(S / 2 - 220, 855);
  ctx.lineTo(S / 2 + 220, 855);
  ctx.stroke();

  // Recipient block
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('EARNED BY VERIFIED LEARNER', S / 2, 912);

  ctx.fillStyle = '#FDE047';
  ctx.font = '800 44px "Bricolage Grotesque", sans-serif';
  ctx.fillText(learnerName, S / 2, 972, S - 180);

  // Footer strip
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(issueDate, 92, 1112);

  ctx.textAlign = 'right';
  ctx.fillText(`CERT ID: ${certificateId}`, S - 92, 1112);

  const safeSlug = badge.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Picture-Connect-Badge-${safeSlug}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const AchievementsCertificate: React.FC<AchievementsCertificateProps> = ({
  learnerName,
  learnerEmail,
  progress,
  onNavigateToLevels,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadingBadgeId, setDownloadingBadgeId] = useState<string | null>(null);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rank = getLearnerRank(progress.xp);
  const completedCount = progress.completedLevels.length;
  const isFullMastery = completedCount === LEVELS.length;
  const unlockedBadgesList = BADGES.filter((b) => progress.unlockedBadges.includes(b.id));
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadBadgePng = (badge: BadgeDefinition) => {
    setDownloadingBadgeId(badge.id);
    setDownloadNote(null);
    try {
      renderAndDownloadBadgePng(badge, learnerName, progress.certificateId, issueDate);
      setDownloadNote(`PNG badge "${badge.title}" downloaded!`);
    } finally {
      setDownloadingBadgeId(null);
    }
  };

  const handleDownloadAllEarnedBadges = () => {
    if (unlockedBadgesList.length === 0) return;
    setDownloadNote(null);
    unlockedBadgesList.forEach((badge, index) => {
      window.setTimeout(() => {
        renderAndDownloadBadgePng(badge, learnerName, progress.certificateId, issueDate);
      }, index * 220);
    });
    setDownloadNote(
      `Downloading ${unlockedBadgesList.length} earned PNG badge${
        unlockedBadgesList.length > 1 ? 's' : ''
      }...`
    );
  };

  const handleDownloadPng = () => {
    setDownloading(true);
    setDownloadNote(null);

    try {
      const canvas = canvasRef.current ?? document.createElement('canvas');
      const W = 2400;
      const H = 1700;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Crisp parchment-cream museum backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#FCFBF7');
      bgGrad.addColorStop(0.5, '#FFFFFF');
      bgGrad.addColorStop(1, '#F5F7FA');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle executive top navy band
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, W, 36);
      ctx.fillRect(0, H - 36, W, 36);

      // Architectural outer & inner double gold borders
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 6;
      ctx.strokeRect(72, 72, W - 144, H - 144);

      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 3;
      ctx.strokeRect(94, 94, W - 188, H - 188);

      // Subtle corner geometric flourishes
      const corners = [
        [94, 94, 1, 1],
        [W - 94, 94, -1, 1],
        [94, H - 94, 1, -1],
        [W - 94, H - 94, -1, -1],
      ];
      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 5;
      corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * 48);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * 48, cy);
        ctx.stroke();
      });

      // Institution & Academy header
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1D4ED8';
      ctx.font = '700 28px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        `${WORKSHOP_META.institution.toUpperCase()}  ·  ${WORKSHOP_META.title}`,
        W / 2,
        215
      );

      // Certificate Main Title
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 76px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText(
        isFullMastery
          ? 'CERTIFICATE OF EXPERIENTIAL MASTERY'
          : 'CERTIFICATE OF VISUAL ACHIEVEMENT',
        W / 2,
        330
      );

      // Gold divider line
      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 280, 370);
      ctx.lineTo(W / 2 + 280, 370);
      ctx.stroke();

      // Tagline
      ctx.fillStyle = '#475569';
      ctx.font = '500 32px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(WORKSHOP_META.positioning, W / 2, 435);

      // Proudly presented to
      ctx.fillStyle = '#64748B';
      ctx.font = '600 26px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText('THIS CREDENTIAL IS AWARDED TO', W / 2, 545);

      // Learner's verified Google Name
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 94px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText(learnerName, W / 2, 665, W - 440);

      // Name underline
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 480, 705);
      ctx.lineTo(W / 2 + 480, 705);
      ctx.stroke();

      // Verified email subline
      ctx.fillStyle = '#64748B';
      ctx.font = '500 24px "JetBrains Mono", monospace';
      ctx.fillText(`Verified Google Learner · ${learnerEmail}`, W / 2, 755, W - 420);

      // Body citation
      ctx.fillStyle = '#334155';
      ctx.font = '400 32px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        'for demonstrating Visual Intelligence, Creative Synthesis, Structured Communication,',
        W / 2,
        850,
        W - 400
      );
      ctx.fillText(
        `and Executive Problem-Solving across ${completedCount} of 10 Experiential Levels.`,
        W / 2,
        900,
        W - 400
      );

      // 4-Metric Achievement Ribbon Box
      const boxX = 240;
      const boxY = 980;
      const boxW = W - 480;
      const boxH = 180;
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      const metrics = [
        { label: 'TOTAL XP EARNED', value: `${progress.xp} XP` },
        { label: 'LEVELS COMPLETED', value: `${completedCount} / 10` },
        { label: 'BADGES UNLOCKED', value: `${progress.unlockedBadges.length} / ${BADGES.length}` },
        { label: 'LEARNER RANK', value: rank.title },
      ];
      const colW = boxW / metrics.length;
      metrics.forEach((m, idx) => {
        const cx = boxX + colW * idx + colW / 2;
        if (idx > 0) {
          ctx.beginPath();
          ctx.moveTo(boxX + colW * idx, boxY + 32);
          ctx.lineTo(boxX + colW * idx, boxY + boxH - 32);
          ctx.strokeStyle = '#CBD5E1';
          ctx.stroke();
        }
        ctx.fillStyle = '#64748B';
        ctx.font = '700 22px "JetBrains Mono", monospace';
        ctx.fillText(m.label, cx, boxY + 68, colW - 36);

        ctx.fillStyle = '#0F172A';
        ctx.font = '800 36px "Bricolage Grotesque", sans-serif';
        ctx.fillText(m.value, cx, boxY + 124, colW - 36);
      });

      // Signature Left: Date & Certificate ID
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(issueDate, 240, 1410);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(240, 1430);
      ctx.lineTo(660, 1430);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText(`ISSUED DATE · ID: ${progress.certificateId}`, 240, 1470);

      // Center Gold & Navy Seal: POWERED BY KAPIL
      const sealX = W / 2;
      const sealY = 1405;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 108, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#C89B3C';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, 92, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#EAB308';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillText('OFFICIAL SEAL', sealX, sealY - 28);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 26px "Bricolage Grotesque", sans-serif';
      ctx.fillText('POWERED BY', sealX, sealY + 4);
      ctx.fillStyle = '#FDE047';
      ctx.font = '800 36px "Bricolage Grotesque", sans-serif';
      ctx.fillText('KAPIL', sealX, sealY + 44);

      // Signature Right: Powered By Kapil
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText('Powered By Kapil', W - 240, 1410);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(W - 660, 1430);
      ctx.lineTo(W - 240, 1430);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "JetBrains Mono", monospace';
      ctx.fillText('EXPERIENTIAL LEARNING CREATOR', W - 240, 1470);

      // Export PNG download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Employability-Skills-Picture-Connect-Certificate-Kapil.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadNote('High-resolution PNG certificate downloaded!');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header + Rank Summary */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
            ACHIEVEMENTS, BADGES &amp; OFFICIAL CREDENTIAL
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            {learnerName} — {rank.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Every completed level and spinning wheel exercise builds your XP, unlocks verified achievement badges you can download individually as PNG collectibles, and updates your personalized certificate{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              Powered By Kapil
            </span>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total XP</div>
            <div className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {progress.xp}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Levels</div>
            <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
              {completedCount}/10
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Badges</div>
            <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
              {progress.unlockedBadges.length}/{BADGES.length}
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

      {/* Mastery Badges Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Achievement Badges ({progress.unlockedBadges.length} / {BADGES.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unlock any badge by completing its milestone to export a high-res 1200 × 1200 px collectible medallion PNG.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {unlockedBadgesList.length > 0 && (
              <button
                type="button"
                onClick={handleDownloadAllEarnedBadges}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Download All Earned ({unlockedBadgesList.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateToLevels()}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Continue Levels 1–10 →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id);
            const busy = downloadingBadgeId === badge.id;
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                  unlocked
                    ? ACCENT_STYLES[badge.accent] || ACCENT_STYLES.blue
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
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

      {/* Live Certificate Preview & PNG Downloader */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Official PNG Certificate · Powered By Kapil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Exports a crisp 2400 × 1700 px museum-grade PNG certificate personalized with your Google identity, XP, and level completion.
            </p>
          </div>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PNG...' : 'Download Certificate (PNG)'}</span>
          </button>
        </div>

        {/* Responsive Live Certificate Card Preview */}
        <div className="rounded-2xl border-4 border-slate-900 dark:border-slate-700 bg-gradient-to-br from-[#FCFBF7] via-white to-slate-100 text-slate-900 p-6 sm:p-10 shadow-xl">
          <div className="border-2 border-amber-600/70 p-6 sm:p-10 space-y-8 text-center relative">
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold tracking-[0.2em] text-blue-700 uppercase">
                {WORKSHOP_META.institution} · {WORKSHOP_META.title}
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                {isFullMastery
                  ? 'CERTIFICATE OF EXPERIENTIAL MASTERY'
                  : 'CERTIFICATE OF VISUAL ACHIEVEMENT'}
              </h3>
              <div className="w-48 h-0.5 bg-amber-600/70 mx-auto" />
              <div className="text-sm text-slate-600 font-medium pt-1">
                {WORKSHOP_META.positioning}
              </div>
            </div>

            <div className="space-y-2 py-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                This credential is proudly awarded to
              </div>
              <div className="font-display text-3xl sm:text-5xl font-extrabold text-slate-950">
                {learnerName}
              </div>
              <div className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Google Learner · {learnerEmail}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-slate-200 bg-slate-50/90 rounded-xl p-4 text-center">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Total XP</div>
                <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                  {progress.xp} XP
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Levels</div>
                <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                  {completedCount} / 10
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Badges</div>
                <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                  {progress.unlockedBadges.length} / {BADGES.length}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Rank</div>
                <div className="font-display text-lg font-bold text-blue-700">
                  {rank.title}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="text-center sm:text-left">
                <div className="text-sm font-bold text-slate-900">{issueDate}</div>
                <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                  ID: {progress.certificateId}
                </div>
              </div>

              <div className="w-28 h-28 rounded-full bg-slate-950 border-4 border-amber-500 flex flex-col items-center justify-center text-center shadow-lg shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-white">
                  Powered By
                </span>
                <span className="font-display text-base font-extrabold text-amber-300 leading-none">
                  KAPIL
                </span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-display text-lg font-extrabold text-slate-950">
                  Powered By Kapil
                </div>
                <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                  Experiential Learning Creator
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden high-DPI export canvas */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </section>
    </div>
  );
};
