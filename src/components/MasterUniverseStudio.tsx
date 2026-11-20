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
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  computeMasterPillarStats,
  computeMasterTrackStats,
  getMasterUniverseRank,
  MASTER_BADGES,
  MASTER_MCQS,
  MASTER_PILLARS,
  MASTER_PLAYBOOKS,
  MASTER_TRACKS,
  MASTER_UNIVERSE_META,
  MasterBadgeDefinition,
  MasterPillarId,
  MasterTrackId,
} from '../data/masterUniverseData';
import {
  markMasterPlaybookStudied,
  MasterSkillsProgressDoc,
  resetMasterTrackTest,
  submitMasterMcqAnswer,
} from '../services/masterUniverseFirestoreService';
import { getPillarTheme, getTrackTheme } from '../data/themeColors';
import { SmartImage } from './SmartImage';

interface MasterUniverseStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  masterProgress: MasterSkillsProgressDoc;
  initialPillar?: MasterPillarId | 'credentials';
  initialTrack?: MasterTrackId;
}

type StudioTopTab = MasterPillarId | 'credentials';
type TrackInnerMode = 'mcq' | 'study';

const BADGE_PALETTES: Record<
  MasterBadgeDefinition['accent'],
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

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currY = y;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currY);
      line = words[i];
      currY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currY);
}

function downloadMasterBadgePng(
  badge: MasterBadgeDefinition,
  learnerName: string,
  certId: string
) {
  const canvas = document.createElement('canvas');
  const S = 1200;
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const pal = BADGE_PALETTES[badge.accent];
  const bg = ctx.createRadialGradient(S / 2, S / 2, 120, S / 2, S / 2, S * 0.72);
  bg.addColorStop(0, '#0F2248');
  bg.addColorStop(1, '#040915');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(212,175,55,0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, S - 84, S - 84);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#93C5FD';
  ctx.font = '700 26px "JetBrains Mono", monospace';
  ctx.fillText('EMPLOYABILITY UNIVERSE WITH KAPIL · MASTER BADGE', S / 2, 128);

  const cx = S / 2;
  const cy = 480;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 270, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = pal.glow;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 232, 0, Math.PI * 2);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.stroke();

  const inner = ctx.createRadialGradient(cx, cy - 60, 20, cx, cy, 220);
  inner.addColorStop(0, pal.glow);
  inner.addColorStop(1, pal.primary);
  ctx.beginPath();
  ctx.arc(cx, cy, 212, 0, Math.PI * 2);
  ctx.fillStyle = inner;
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 88 : 38;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = cx + r * Math.cos(ang);
    const py = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 50px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(badge.title, S / 2, 835);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 27px "Plus Jakarta Sans", sans-serif';
  wrapCanvasText(ctx, badge.description, S / 2, 895, 920, 38);

  ctx.fillStyle = '#FCD34D';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Awarded to ${learnerName}`, S / 2, 1020);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText(`POWERED BY KAPIL  ·  ${certId}`, S / 2, 1098);

  const link = document.createElement('a');
  const slug = badge.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `Universe-Badge-${slug}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const MasterUniverseStudio: React.FC<MasterUniverseStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  masterProgress,
  initialPillar = 'aptitude_grammar',
  initialTrack,
}) => {
  const [activePillar, setActivePillar] = useState<StudioTopTab>(initialPillar);
  const [activeTrack, setActiveTrack] = useState<MasterTrackId>(
    initialTrack ?? 'aptitude'
  );
  const [innerMode, setInnerMode] = useState<TrackInnerMode>('mcq');
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [retakeConfirm, setRetakeConfirm] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (initialTrack) {
      const found = MASTER_TRACKS.find((t) => t.id === initialTrack);
      if (found) {
        setActivePillar(found.pillarId);
        setActiveTrack(found.id);
        setRetakeConfirm(false);
        return;
      }
    }
    if (initialPillar) {
      setActivePillar(initialPillar);
      if (initialPillar !== 'credentials') {
        const pillarDef = MASTER_PILLARS.find((p) => p.id === initialPillar);
        if (pillarDef) {
          setActiveTrack(pillarDef.trackIds[0]);
        }
      }
      setRetakeConfirm(false);
    }
  }, [initialPillar, initialTrack]);

  const rank = getMasterUniverseRank(masterProgress.masterXp);
  const trackStats = useMemo(
    () =>
      computeMasterTrackStats({
        answeredMcqs: masterProgress.answeredMcqs,
        correctMcqs: masterProgress.correctMcqs,
        hintUsedMcqs: masterProgress.hintUsedMcqs,
      }),
    [
      masterProgress.answeredMcqs,
      masterProgress.correctMcqs,
      masterProgress.hintUsedMcqs,
    ]
  );

  const pillarStats = useMemo(
    () => computeMasterPillarStats(trackStats),
    [trackStats]
  );

  const totalAnswered = masterProgress.answeredMcqs.length;
  const totalCorrect = masterProgress.correctMcqs.length;
  const overallAccuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const completedTracksCount = MASTER_TRACKS.filter(
    (t) => trackStats[t.id].completed
  ).length;
  const certUnlocked = completedTracksCount >= 3 || totalAnswered >= 30;
  const fullMasteryUnlocked = completedTracksCount >= 12 && overallAccuracy >= 75;

  const currentPillarDef = useMemo(
    () =>
      MASTER_PILLARS.find((p) => p.id === activePillar) ?? MASTER_PILLARS[0],
    [activePillar]
  );

  const currentTrackDef = useMemo(
    () => MASTER_TRACKS.find((t) => t.id === activeTrack) ?? MASTER_TRACKS[0],
    [activeTrack]
  );

  const trackPlaybooks = useMemo(
    () => MASTER_PLAYBOOKS.filter((p) => p.trackId === activeTrack),
    [activeTrack]
  );

  const trackMcqs = useMemo(
    () =>
      MASTER_MCQS.map((q, globalIdx) => ({ q, globalIdx })).filter(
        ({ q }) => q.trackId === activeTrack
      ),
    [activeTrack]
  );

  const handleSelectPillar = (tab: StudioTopTab) => {
    setActivePillar(tab);
    setRetakeConfirm(false);
    if (tab !== 'credentials') {
      const def = MASTER_PILLARS.find((p) => p.id === tab);
      if (def && !def.trackIds.includes(activeTrack)) {
        setActiveTrack(def.trackIds[0]);
      }
    }
  };

  const handleMarkPlaybook = async (playbookId: string) => {
    setBusyId(playbookId);
    setErrorMsg(null);
    try {
      const res = await markMasterPlaybookStudied({
        user,
        current: masterProgress,
        playbookId,
      });
      if (res.newlyAwardedXp > 0) {
        setStatusMsg(`Playbook logged (+${res.newlyAwardedXp} Universe XP).`);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to save playbook progress.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSelectOption = async (
    globalIdx: number,
    mcqId: string,
    optionIdx: number
  ) => {
    if (masterProgress.answeredMcqs.includes(mcqId)) return;
    setBusyId(mcqId);
    setErrorMsg(null);
    try {
      const usedHint = Boolean(revealedHints[mcqId]);
      const res = await submitMasterMcqAnswer({
        user,
        current: masterProgress,
        mcqIndex: globalIdx,
        chosenOption: optionIdx,
        usedHint,
      });
      setStatusMsg(
        res.isCorrect
          ? `Correct! +${res.newlyAwardedXp} Universe XP${
              usedHint ? ' (Hint assisted)' : ' (Clean solve)'
            }${
              res.newlyUnlockedBadges.length > 0
                ? ' · New Universe Badge Unlocked!'
                : ''
            }`
          : `Answer recorded (+${res.newlyAwardedXp} XP effort). Read the technical rationale below.`
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to submit MCQ answer.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRetakeTrack = async () => {
    setBusyId(`retake_${activeTrack}`);
    setErrorMsg(null);
    try {
      await resetMasterTrackTest({
        user,
        current: masterProgress,
        trackId: activeTrack,
      });
      setRetakeConfirm(false);
      setRevealedHints((prev) => {
        const next = { ...prev };
        trackMcqs.forEach(({ q }) => delete next[q.id]);
        return next;
      });
      setStatusMsg(
        `${currentTrackDef.shortTitle} test reset cleanly. Take your fresh attempt now!`
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to reset track test.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDownloadCertificatePng = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    setDownloadingCert(true);
    try {
      const W = 2400;
      const H = 1700;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#FDFBF5');
      bg.addColorStop(0.55, '#FFFFFF');
      bg.addColorStop(1, '#F0F7FF');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#061229';
      ctx.lineWidth = 18;
      ctx.strokeRect(48, 48, W - 96, H - 96);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 5;
      ctx.strokeRect(76, 76, W - 152, H - 152);

      ctx.fillStyle = '#061229';
      ctx.fillRect(108, 108, W - 216, 12);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#1D4ED8';
      ctx.font = '700 28px "JetBrains Mono", monospace';
      ctx.fillText(
        'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  MASTER SKILL CREDENTIAL',
        W / 2,
        205
      );

      ctx.fillStyle = '#061229';
      ctx.font = '800 66px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        fullMasteryUnlocked
          ? 'MASTER CERTIFICATE OF FULL-STACK EMPLOYABILITY'
          : 'CERTIFICATE OF MULTI-DOMAIN PROFICIENCY',
        W / 2,
        305
      );

      ctx.fillStyle = '#475569';
      ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        'APTITUDE · ENGLISH GRAMMAR · C / C++ / JAVA / DSA · EXCEL · POWER BI · DBMS · CLOUD',
        W / 2,
        365
      );

      ctx.fillStyle = '#64748B';
      ctx.font = '500 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('THIS OFFICIAL CREDENTIAL IS PROUDLY AWARDED TO', W / 2, 465);

      ctx.fillStyle = '#061229';
      ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(learnerName, W / 2, 575);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 420, 610);
      ctx.lineTo(W / 2 + 420, 610);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = '500 29px "Plus Jakarta Sans", sans-serif';
      wrapCanvasText(
        ctx,
        `for demonstrating verified technical, analytical, and linguistic competence across EMPLOYABILITY UNIVERSE With Kapil (${completedTracksCount}/12 skill tracks completed, ${totalCorrect}/${totalAnswered} graded MCQs solved at ${overallAccuracy}% accuracy, earning ${masterProgress.masterXp} Universe XP as "${rank.title}").`,
        W / 2,
        682,
        1800,
        44
      );

      // 4 Pillar / Metric Tiles
      const metrics = [
        {
          label: 'APTITUDE & GRAMMAR',
          value: `${pillarStats.aptitude_grammar.correct}/40`,
        },
        {
          label: 'C · C++ · JAVA · DSA',
          value: `${pillarStats.coding_dsa.correct}/40`,
        },
        {
          label: 'EXCEL · BI · DBMS · CLOUD',
          value: `${pillarStats.data_cloud.correct}/40`,
        },
        {
          label: 'UNIVERSE XP & BADGES',
          value: `${masterProgress.masterXp} XP · ${masterProgress.unlockedMasterBadges.length}/8`,
        },
      ];

      const boxW = 470;
      const gap = 36;
      const startX = (W - (boxW * 4 + gap * 3)) / 2;
      metrics.forEach((m, idx) => {
        const bx = startX + idx * (boxW + gap);
        const by = 885;
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(bx, by, boxW, 165);
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, boxW, 165);

        ctx.fillStyle = '#64748B';
        ctx.font = '700 21px "JetBrains Mono", monospace';
        ctx.fillText(m.label, bx + boxW / 2, by + 58);

        ctx.fillStyle = '#0F172A';
        ctx.font = '800 38px "JetBrains Mono", monospace';
        ctx.fillText(m.value, bx + boxW / 2, by + 122);
      });

      const issuedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText(`CERTIFICATE ID: ${masterProgress.masterCertificateId}`, 170, 1295);
      ctx.fillStyle = '#475569';
      ctx.font = '500 23px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Issued on ${issuedDate} · Verified: ${learnerEmail}`, 170, 1340);

      // Gold Seal
      ctx.save();
      const sx = W / 2;
      const sy = 1350;
      ctx.beginPath();
      ctx.arc(sx, sy, 108, 0, Math.PI * 2);
      ctx.fillStyle = '#061229';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#D4AF37';
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FCD34D';
      ctx.font = '700 20px "JetBrains Mono", monospace';
      ctx.fillText('VERIFIED', sx, sy - 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('UNIVERSE', sx, sy + 18);
      ctx.fillStyle = '#93C5FD';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillText('BY KAPIL', sx, sy + 48);
      ctx.restore();

      ctx.textAlign = 'right';
      ctx.fillStyle = '#061229';
      ctx.font = 'italic 700 46px Georgia, serif';
      ctx.fillText('Kapil Narula', W - 170, 1300);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W - 520, 1320);
      ctx.lineTo(W - 170, 1320);
      ctx.stroke();
      ctx.fillStyle = '#1D4ED8';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.fillText('FOUNDER & MENTOR · EMPLOYABILITY UNIVERSE', W - 170, 1362);

      const link = document.createElement('a');
      link.download = `Employability-Universe-Master-Certificate-${masterProgress.masterCertificateId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingCert(false);
    }
  };

  const activeTrackTheme = getTrackTheme(activeTrack);
  const activePillarTheme =
    activePillar === 'credentials'
      ? null
      : getPillarTheme(activePillar);

  return (
    <div className="space-y-8">
      {/* Studio Overview Header */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${
            activePillarTheme
              ? activePillarTheme.topBar
              : 'from-amber-500 via-yellow-500 to-orange-500'
          }`}
          aria-hidden="true"
        />
        <div className="p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400">
              EMPLOYABILITY UNIVERSE WITH KAPIL · 12 PLACEMENT SUBJECTS · 120 HINTED MCQS
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              {MASTER_UNIVERSE_META.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {MASTER_UNIVERSE_META.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 font-mono">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">UNIVERSE XP</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                {masterProgress.masterXp}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">MCQS DONE</div>
              <div className="text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                {totalAnswered}/120
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">ACCURACY</div>
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {overallAccuracy}%
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">BADGES</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {masterProgress.unlockedMasterBadges.length}/{MASTER_BADGES.length}
              </div>
            </div>
          </div>
        </div>

        {/* Rank Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div>
            Rank:{' '}
            <span className="font-bold text-slate-950 dark:text-white">
              {rank.title}
            </span>{' '}
            · Tracks Completed:{' '}
            <span className="font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {completedTracksCount}/12
            </span>{' '}
            · Playbooks Studied:{' '}
            <span className="font-bold text-slate-950 dark:text-white tabular-nums">
              {masterProgress.studiedPlaybooks.length}/72
            </span>
          </div>
          <div>
            {rank.nextTitle
              ? `${Math.max(0, (rank.nextXp ?? 0) - masterProgress.masterXp)} XP to ${rank.nextTitle}`
              : 'Peak Employability Universe Rank Achieved'}
          </div>
        </div>

        {/* Top 4 Color-Coded Pillar Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {MASTER_PILLARS.map((pillar) => {
            const pStat = pillarStats[pillar.id];
            const active = activePillar === pillar.id;
            const pTheme = getPillarTheme(pillar.id);
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handleSelectPillar(pillar.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? `${pTheme.activeButton} shadow-sm`
                    : `${pTheme.softBorder} ${pTheme.softSurface} text-slate-800 dark:text-slate-200 ${pTheme.ringHover}`
                }`}
              >
                <span>{pillar.shortTitle}</span>
                <span className="font-mono text-[11px] opacity-85 tabular-nums">
                  ({pStat.correct}/{pStat.total})
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handleSelectPillar('credentials')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activePillar === 'credentials'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 hover:border-amber-500'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges ({masterProgress.unlockedMasterBadges.length}/8) &amp; PNG Certificate</span>
          </button>
        </div>
        </div>
      </section>

      {statusMsg && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 px-4 py-3 text-xs font-medium text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-xs text-red-700 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Active Pillar Workspace */}
      {activePillar !== 'credentials' && (
        <div className="space-y-6">
          {/* 4-Track Color-Coded Selector Bar Inside Pillar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {currentPillarDef.trackIds.map((tid) => {
              const tDef = MASTER_TRACKS.find((t) => t.id === tid)!;
              const tStat = trackStats[tid];
              const selected = activeTrack === tid;
              const tTheme = getTrackTheme(tid);
              return (
                <button
                  key={tid}
                  type="button"
                  onClick={() => {
                    setActiveTrack(tid);
                    setRetakeConfirm(false);
                  }}
                  className={`text-left rounded-xl border overflow-hidden transition-all cursor-pointer ${
                    selected
                      ? `${tTheme.softBorder} ${tTheme.softSurface} ring-1 ring-inset ring-slate-400/20 shadow-sm`
                      : `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${tTheme.ringHover}`
                  }`}
                >
                  <div
                    className={`h-1 w-full bg-gradient-to-r ${tTheme.topBar}`}
                    aria-hidden="true"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className={`font-bold ${tTheme.text}`}>
                        {tDef.number}
                      </span>
                      <span
                        className={`tabular-nums font-semibold ${
                          tStat.completed
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {tStat.correct}/{tStat.total} Correct
                      </span>
                    </div>
                    <div className="font-display font-bold text-sm text-slate-950 dark:text-white">
                      {tDef.shortTitle}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${tTheme.progressBar} transition-all`}
                        style={{
                          width: `${Math.round((tStat.answered / tStat.total) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Track Hero Card with Editorial SmartImage + Color-Coded Mode Switcher */}
          <section className={`rounded-2xl border ${activeTrackTheme.softBorder} bg-white dark:bg-slate-900 overflow-hidden`}>
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${activeTrackTheme.topBar}`}
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto bg-slate-100 dark:bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
              <SmartImage
                src={currentTrackDef.image}
                alt={currentTrackDef.imageAlt}
                fallbackTitle={currentTrackDef.title}
                fallbackSubtitle={currentTrackDef.subtitle}
                priority
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <div className={`text-xs font-mono font-bold ${activeTrackTheme.text}`}>
                  {currentPillarDef.number} · {currentTrackDef.number} {currentTrackDef.subtitle}
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  {currentTrackDef.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentTrackDef.description}
                </p>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                  {currentTrackDef.highlights.join(' · ')}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInnerMode('mcq')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      innerMode === 'mcq'
                        ? activeTrackTheme.activeButton
                        : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      MCQ Test ({trackStats[activeTrack].answered}/10)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInnerMode('study')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      innerMode === 'study'
                        ? activeTrackTheme.activeButton
                        : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study Playbooks (6)</span>
                  </button>
                </div>

                {innerMode === 'mcq' && trackStats[activeTrack].answered > 0 && (
                  <div className="flex items-center gap-2">
                    {retakeConfirm ? (
                      <>
                        <button
                          type="button"
                          disabled={busyId === `retake_${activeTrack}`}
                          onClick={handleRetakeTrack}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                        >
                          {busyId === `retake_${activeTrack}`
                            ? 'Resetting...'
                            : 'Confirm Retake'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRetakeConfirm(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRetakeConfirm(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake {currentTrackDef.shortTitle}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>
          </section>

          {/* Inner Mode 1: Study Playbooks (6 Cards) */}
          {innerMode === 'study' && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackPlaybooks.map((card, i) => {
                const studied = masterProgress.studiedPlaybooks.includes(card.id);
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-colors ${
                      studied
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/15'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="font-bold text-blue-700 dark:text-blue-400">
                          PLAYBOOK {String(i + 1).padStart(2, '0')} · {card.tag}
                        </span>
                        {studied && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Studied</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                        {card.conceptTitle}
                      </h3>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                        {card.ruleOrFormula}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Example:{' '}
                        </span>
                        {card.example}
                      </p>

                      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                        <span className="font-semibold">Placement Tip: </span>
                        {card.placementTip}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={studied || busyId === card.id}
                        onClick={() => handleMarkPlaybook(card.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          studied
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 cursor-default'
                            : 'bg-slate-950 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white cursor-pointer'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {studied
                            ? 'Mastered in Vault'
                            : busyId === card.id
                            ? 'Saving...'
                            : 'Mark Studied (+5 XP)'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* Inner Mode 2: 10 Graded Hinted MCQs */}
          {innerMode === 'mcq' && (
            <section className="space-y-4">
              {trackMcqs.map(({ q, globalIdx }, localIdx) => {
                const answered = masterProgress.answeredMcqs.includes(q.id);
                const chosen = masterProgress.mcqChoices[globalIdx] ?? -1;
                const isCorrect = masterProgress.correctMcqs.includes(q.id);
                const hintOpen =
                  Boolean(revealedHints[q.id]) ||
                  masterProgress.hintUsedMcqs.includes(q.id);

                return (
                  <article
                    key={q.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-slate-500 dark:text-slate-400">
                        <strong className="text-blue-700 dark:text-blue-400">
                          Q{String(localIdx + 1).padStart(2, '0')}
                        </strong>{' '}
                        · {q.topic} · {q.difficulty}
                      </span>

                      <div className="flex items-center gap-3">
                        {!answered && (
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedHints((prev) => ({
                                ...prev,
                                [q.id]: !prev[q.id],
                              }))
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{hintOpen ? 'Hide Hint' : 'Mentor Hint (+20 XP)'}</span>
                          </button>
                        )}
                        <span className="tabular-nums text-slate-500 dark:text-slate-400">
                          {answered
                            ? isCorrect
                              ? 'CORRECT'
                              : 'REVIEW RATIONALE'
                            : `+${hintOpen ? q.xpWithHint : q.xpClean} XP`}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-950 dark:text-white leading-snug">
                      {q.question}
                    </h3>

                    {hintOpen && !answered && (
                      <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <span>
                          <strong>Mentor Hint:</strong> {q.hint}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isThisChosen = chosen === optIdx;
                        const isRightOpt = q.correctIndex === optIdx;
                        let styleClass =
                          'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:border-blue-500 text-slate-800 dark:text-slate-200';
                        if (answered) {
                          if (isRightOpt) {
                            styleClass =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold';
                          } else if (isThisChosen && !isRightOpt) {
                            styleClass =
                              'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                          } else {
                            styleClass =
                              'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 opacity-75';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={answered || busyId === q.id}
                            onClick={() =>
                              handleSelectOption(globalIdx, q.id, optIdx)
                            }
                            className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-colors flex items-start justify-between gap-3 ${
                              answered ? 'cursor-default' : 'cursor-pointer'
                            } ${styleClass}`}
                          >
                            <span className="flex items-start gap-2.5">
                              <span className="font-mono font-bold shrink-0">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </span>
                            {answered && isRightOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            )}
                            {answered && isThisChosen && !isRightOpt && (
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isCorrect
                            ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <strong>Technical Rationale: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </div>
      )}

      {/* Credentials Tab: 8 PNG Badges + Official PNG Master Certificate */}
      {activePillar === 'credentials' && (
        <div className="space-y-8">
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                Employability Universe Badges ({masterProgress.unlockedMasterBadges.length}/{MASTER_BADGES.length})
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Download high-resolution 1200×1200 PNG medallions for LinkedIn and placement portfolios as you unlock milestones across all 12 subjects.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MASTER_BADGES.map((badge) => {
                const unlocked = masterProgress.unlockedMasterBadges.includes(badge.id);
                const pal = BADGE_PALETTES[badge.accent];
                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
                      unlocked
                        ? pal.softBg
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 opacity-75'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          {badge.criteriaLabel}
                        </span>
                        {unlocked ? (
                          <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                        {badge.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() =>
                        downloadMasterBadgePng(
                          badge,
                          learnerName,
                          masterProgress.masterCertificateId
                        )
                      }
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        unlocked
                          ? 'bg-slate-950 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white cursor-pointer'
                          : 'border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{unlocked ? 'Download Badge PNG' : 'Locked'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Official PNG Certificate Preview & Download */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                  EMPLOYABILITY UNIVERSE WITH KAPIL · OFFICIAL MASTER CERTIFICATE
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-1">
                  Multi-Domain Employability Certificate (2400×1700 PNG)
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Unlocks after completing any 3 subject tests (30+ MCQs). Upgrades to Master Certificate of Full-Stack Employability at 12/12 tracks with ≥75% accuracy.
                </p>
              </div>

              <button
                type="button"
                disabled={!certUnlocked || downloadingCert}
                onClick={handleDownloadCertificatePng}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  certUnlocked
                    ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {certUnlocked ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {downloadingCert
                    ? 'Rendering PNG...'
                    : certUnlocked
                    ? 'Download Master Certificate PNG'
                    : `Complete ${Math.max(0, 30 - totalAnswered)} More MCQs to Unlock`}
                </span>
              </button>
            </div>

            <div className="rounded-2xl border-2 border-slate-900 dark:border-amber-600/70 bg-gradient-to-br from-[#FDFBF5] via-white to-blue-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 p-6 sm:p-8 text-center space-y-4">
              <div className="text-[11px] font-mono font-bold tracking-widest text-blue-700 dark:text-blue-400">
                EMPLOYABILITY UNIVERSE WITH KAPIL · MASTER SKILL CREDENTIAL
              </div>
              <div className="font-display text-xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                {fullMasteryUnlocked
                  ? 'MASTER CERTIFICATE OF FULL-STACK EMPLOYABILITY'
                  : 'CERTIFICATE OF MULTI-DOMAIN PROFICIENCY'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Awarded to
              </div>
              <div className="font-display text-2xl sm:text-4xl font-bold text-slate-950 dark:text-white">
                {learnerName}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70">
                  <div className="text-[10px] text-slate-500">APTITUDE &amp; GRAMMAR</div>
                  <div className="font-bold text-slate-950 dark:text-white mt-0.5 tabular-nums">
                    {pillarStats.aptitude_grammar.correct}/40
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70">
                  <div className="text-[10px] text-slate-500">C · C++ · JAVA · DSA</div>
                  <div className="font-bold text-slate-950 dark:text-white mt-0.5 tabular-nums">
                    {pillarStats.coding_dsa.correct}/40
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70">
                  <div className="text-[10px] text-slate-500">EXCEL · BI · DBMS · CLOUD</div>
                  <div className="font-bold text-slate-950 dark:text-white mt-0.5 tabular-nums">
                    {pillarStats.data_cloud.correct}/40
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>ID: {masterProgress.masterCertificateId}</span>
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{masterProgress.masterXp} Universe XP · Powered By Kapil</span>
                </span>
              </div>
            </div>

            <canvas ref={certCanvasRef} className="hidden" aria-hidden="true" />
          </section>
        </div>
      )}
    </div>
  );
};
