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
  BADGES,
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

export const AchievementsCertificate: React.FC<AchievementsCertificateProps> = ({
  learnerName,
  learnerEmail,
  progress,
  onNavigateToLevels,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rank = getLearnerRank(progress.xp);
  const completedCount = progress.completedLevels.length;
  const isFullMastery = completedCount === LEVELS.length;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

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
      ctx.fillText(learnerName, W / 2, 665);

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
      ctx.fillText(`Verified Google Learner · ${learnerEmail}`, W / 2, 755);

      // Body citation
      ctx.fillStyle = '#334155';
      ctx.font = '400 32px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        'for demonstrating Visual Intelligence, Creative Synthesis, Structured Communication,',
        W / 2,
        850
      );
      ctx.fillText(
        `and Executive Problem-Solving across ${completedCount} of 10 Experiential Levels.`,
        W / 2,
        900
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
        ctx.fillText(m.label, cx, boxY + 68);

        ctx.fillStyle = '#0F172A';
        ctx.font = '800 36px "Bricolage Grotesque", sans-serif';
        ctx.fillText(m.value, cx, boxY + 124);
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
      link.download = `Picture-Connect-Certificate-Powered-By-Kapil.png`;
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
            Every completed level and spinning wheel exercise builds your XP, unlocks verified achievement badges, and updates your personalized PNG certificate{' '}
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

      {/* Mastery Badges Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            Achievement Badges ({progress.unlockedBadges.length} / {BADGES.length})
          </h2>
          <button
            type="button"
            onClick={() => onNavigateToLevels()}
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Continue Levels 1–10 →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                  unlocked
                    ? ACCENT_STYLES[badge.accent] || ACCENT_STYLES.blue
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      unlocked
                        ? 'bg-white/80 dark:bg-slate-950/60 shadow-sm'
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

                <div className="pt-2 border-t border-black/10 dark:border-white/10 text-[11px] font-mono">
                  {badge.criteriaLabel}
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

        {downloadNote && (
          <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadNote}</span>
          </div>
        )}

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
