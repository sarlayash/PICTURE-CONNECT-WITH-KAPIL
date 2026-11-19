import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Compass,
  Eye,
  RotateCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { WHEEL_DECKS, WheelSegment } from '../data/workshopData';
import { ConnectionPostDoc, LearnerProgressDoc } from '../services/firestoreService';
import { StageTimer } from './StageTimer';
import { VisualArtwork } from './VisualArtwork';

interface SpinWheelStudioProps {
  progress: LearnerProgressDoc;
  sharedReflections: ConnectionPostDoc[];
  onCompleteWheelPrompt: (
    promptId: string,
    promptTitle: string,
    reflectionText: string,
    xpReward: number
  ) => Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }>;
}

export const SpinWheelStudio: React.FC<SpinWheelStudioProps> = ({
  progress,
  sharedReflections,
  onCompleteWheelPrompt,
}) => {
  const [deckId, setDeckId] = useState<'challenges' | 'mashup' | 'ceo_pitch'>('challenges');
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeSegment, setActiveSegment] = useState<WheelSegment>(WHEEL_DECKS[0].segments[0]);
  const [showHint, setShowHint] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const spinTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
    };
  }, []);

  const deck = useMemo(
    () => WHEEL_DECKS.find((d) => d.id === deckId) ?? WHEEL_DECKS[0],
    [deckId]
  );

  const handleSelectDeck = (nextDeckId: 'challenges' | 'mashup' | 'ceo_pitch') => {
    if (isSpinning) return;
    setDeckId(nextDeckId);
    const nextDeck = WHEEL_DECKS.find((d) => d.id === nextDeckId) ?? WHEEL_DECKS[0];
    setActiveSegment(nextDeck.segments[0]);
    setShowHint(false);
    setRewardBanner(null);
    setSubmitError(null);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    const count = deck.segments.length;
    const pickedIndex = Math.floor(Math.random() * count);
    const segAngle = 360 / count;
    // Center of pickedIndex in SVG coordinates (0 deg at 12 o'clock clockwise)
    const centerOfWedge = pickedIndex * segAngle + segAngle / 2;
    const targetMod = (360 - centerOfWedge + 360) % 360;
    const currentMod = ((rotationDeg % 360) + 360) % 360;
    const delta = (targetMod - currentMod + 360) % 360;
    const fullSpins = 360 * 5;
    const nextRotation = rotationDeg + fullSpins + delta;

    setIsSpinning(true);
    setRewardBanner(null);
    setSubmitError(null);
    setShowHint(false);
    setRotationDeg(nextRotation);

    if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
    spinTimerRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setActiveSegment(deck.segments[pickedIndex]);
    }, 3600);
  };

  const handleSubmitExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await onCompleteWheelPrompt(
        activeSegment.id,
        activeSegment.promptTitle,
        responseText.trim(),
        activeSegment.xpReward
      );
      setResponseText('');
      setRewardBanner(
        `Saved! +${result.newlyAwardedXp} XP awarded${
          result.newlyUnlockedBadges.length > 0
            ? ` · New badge unlocked!`
            : ''
        }`
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to save wheel response. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const segmentAngle = 360 / deck.segments.length;
  const completedCount = progress.completedWheelPrompts.length;

  // Build crisp SVG pie wedge path around (200, 200), r = 184, 0° at 12 o'clock clockwise
  const buildWedgePath = (index: number) => {
    const startDeg = index * segmentAngle - 90;
    const endDeg = (index + 1) * segmentAngle - 90;
    const rad = Math.PI / 180;
    const r = 184;
    const cx = 200;
    const cy = 200;
    const x1 = cx + r * Math.cos(startDeg * rad);
    const y1 = cy + r * Math.sin(startDeg * rad);
    const x2 = cx + r * Math.cos(endDeg * rad);
    const y2 = cy + r * Math.sin(endDeg * rad);
    const largeArc = segmentAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  };

  const getLabelCoords = (index: number) => {
    const midDeg = index * segmentAngle + segmentAngle / 2 - 90;
    const rad = Math.PI / 180;
    const labelRadius = 118;
    return {
      x: 200 + labelRadius * Math.cos(midDeg * rad),
      y: 200 + labelRadius * Math.sin(midDeg * rad),
      rotate: midDeg + 90,
    };
  };

  return (
    <div className="space-y-8">
      {/* Header + Deck Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
            INTERACTIVE AGILITY LAB · +50 TO +60 XP PER EXERCISE
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white mt-1">
            Spinning Wheel Exercise Studio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Pick a deck, spin the wheel to draw a surprise visual challenge, beat the countdown clock, and save your response to earn bonus XP and badges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
          <span>{progress.wheelSpins} Total Spins</span>
          <span aria-hidden="true">·</span>
          <span>{completedCount} Unique Prompts Completed</span>
        </div>
      </div>

      {/* 3 Wheel Deck Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {WHEEL_DECKS.map((item) => {
          const active = item.id === deckId;
          const deckDoneCount = item.segments.filter((seg) =>
            progress.completedWheelPrompts.includes(seg.id)
          ).length;
          return (
            <button
              key={item.id}
              type="button"
              disabled={isSpinning}
              onClick={() => handleSelectDeck(item.id)}
              className={`text-left rounded-xl border p-4 transition-colors cursor-pointer disabled:opacity-60 ${
                active
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-display text-sm font-bold text-slate-950 dark:text-white">
                  {item.name}
                </div>
                <span
                  className={`font-mono text-[11px] font-bold tabular-nums shrink-0 ${
                    deckDoneCount > 0
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {deckDoneCount}/{item.segments.length} Done
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {item.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Split: Interactive Wheel + Active Exercise Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: SVG Spinning Wheel */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col items-center space-y-6">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            {/* Top Pointer */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 drop-shadow-md"
              aria-hidden="true"
            >
              <svg width="28" height="32" viewBox="0 0 28 32">
                <polygon
                  points="14,30 2,4 26,4"
                  className="fill-slate-950 dark:fill-white stroke-white dark:stroke-slate-950"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Rotating Wheel SVG */}
            <div
              className="w-full h-full rounded-full shadow-xl"
              style={{
                transform: `rotate(${rotationDeg}deg)`,
                transition: isSpinning
                  ? 'transform 3.6s cubic-bezier(0.12, 0.88, 0.22, 1)'
                  : 'none',
              }}
            >
              <svg viewBox="0 0 400 400" className="w-full h-full block">
                <circle
                  cx="200"
                  cy="200"
                  r="192"
                  className="fill-slate-900 dark:fill-slate-800"
                />
                {deck.segments.map((seg, idx) => {
                  const pos = getLabelCoords(idx);
                  return (
                    <g key={seg.id}>
                      <path
                        d={buildWedgePath(idx)}
                        fill={seg.color}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                      <text
                        x={pos.x}
                        y={pos.y}
                        fill="#FFFFFF"
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${pos.rotate}, ${pos.x}, ${pos.y})`}
                        style={{ letterSpacing: '0.06em' }}
                      >
                        {seg.shortLabel}
                      </text>
                    </g>
                  );
                })}
                {/* Center Hub */}
                <circle
                  cx="200"
                  cy="200"
                  r="34"
                  fill="#0F172A"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                />
                <text
                  x="200"
                  y="201"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  SPIN
                </text>
              </svg>
            </div>
          </div>

          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning Wheel...' : `Spin ${deck.name}`}</span>
          </button>

          {/* Direct segment quick-picks below */}
          <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Or Jump to Any Wedge
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {deck.segments.map((seg) => {
                const done = progress.completedWheelPrompts.includes(seg.id);
                const selected = activeSegment.id === seg.id;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    disabled={isSpinning}
                    onClick={() => {
                      setActiveSegment(seg);
                      setRewardBanner(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between gap-1 cursor-pointer transition-colors ${
                      selected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{seg.label}</span>
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Drawn Prompt Workspace */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
                <Compass className="w-4 h-4" />
                <span>{activeSegment.promptTitle}</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                Reward: +{activeSegment.xpReward} XP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-5 aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <VisualArtwork id={activeSegment.artwork} />
              </div>

              <div className="md:col-span-7 space-y-3">
                <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white leading-snug">
                  {activeSegment.promptQuestion}
                </h2>

                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Thinking Lens' : 'Show Thinking Lens'}</span>
                </button>

                {showHint && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 leading-relaxed">
                    {activeSegment.hint}
                  </p>
                )}

                <StageTimer
                  key={activeSegment.id}
                  initialSeconds={activeSegment.timerSeconds}
                  label="Sprint Clock"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs font-medium text-red-700 dark:text-red-300">
                {submitError}
              </div>
            )}

            {rewardBanner && (
              <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{rewardBanner}</span>
              </div>
            )}

            <form onSubmit={handleSubmitExercise} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Structured Response (Organise your thoughts clearly in 2–4 lines)
              </label>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your sharp insight, connection, or 30-second pitch here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Your response is published to the Learner Reflection Feed below.
                </span>
                <button
                  type="submit"
                  disabled={submitting || !responseText.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-950 dark:bg-blue-700 hover:bg-slate-800 dark:hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting
                      ? 'Submitting...'
                      : `Complete & Claim +${activeSegment.xpReward} XP`}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Community Wheel Reflections */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                Recent Wheel Reflections ({sharedReflections.length})
              </h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Peer Insights
              </span>
            </div>
            {sharedReflections.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 py-4">
                Spin the wheel and publish the first reflection!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {sharedReflections.slice(0, 8).map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-blue-700 dark:text-blue-400 truncate">
                        {post.title}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">
                        {post.authorName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {post.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
