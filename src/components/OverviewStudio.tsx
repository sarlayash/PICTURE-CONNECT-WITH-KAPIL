import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Plus,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  BADGES,
  CENTRAL_CONCEPT_PAIRS,
  getLearnerRank,
  LEVELS,
  WORKSHOP_META,
} from '../data/workshopData';
import { LearnerProgressDoc } from '../services/firestoreService';
import { LiveClock } from './LiveClock';
import { VisualArtwork } from './VisualArtwork';

export type AppView = 'journey' | 'levels' | 'wheel' | 'achievements';

interface OverviewStudioProps {
  learnerName: string;
  progress: LearnerProgressDoc;
  onNavigateView: (view: AppView, levelNum?: number) => void;
  learnerConnections: {
    id: string;
    picture: string;
    concept: string;
    explanation: string;
    authorName?: string;
  }[];
  onAddConnection: (picture: string, concept: string, explanation: string) => Promise<void>;
}

export const OverviewStudio: React.FC<OverviewStudioProps> = ({
  learnerName,
  progress,
  onNavigateView,
  learnerConnections,
  onAddConnection,
}) => {
  const [selectedPairId, setSelectedPairId] = useState(CENTRAL_CONCEPT_PAIRS[1].id);
  const [revealedIds, setRevealedIds] = useState<string[]>([CENTRAL_CONCEPT_PAIRS[1].id]);
  const [customPicture, setCustomPicture] = useState('');
  const [customConcept, setCustomConcept] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [submittingConnection, setSubmittingConnection] = useState(false);

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
    try {
      await onAddConnection(
        customPicture.trim(),
        customConcept.trim(),
        customReason.trim()
      );
      setCustomPicture('');
      setCustomConcept('');
      setCustomReason('');
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
                <span>{WORKSHOP_META.subtitle}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  {WORKSHOP_META.poweredBy}
                </span>
              </div>
              <LiveClock />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.06]">
              See Beyond. Think Beyond. Connect Beyond.
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Welcome, <span className="font-semibold text-slate-900 dark:text-white">{learnerName}</span>.{' '}
              {WORKSHOP_META.corePhilosophy} Master all 10 interactive visual levels, spin the creative wheel, collect XP & badges, and download your personal PNG certificate.
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
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => onNavigateView('levels', lvl.level)}
                className={`text-left rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  done
                    ? 'border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    LEVEL {String(lvl.level).padStart(2, '0')}
                  </span>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                      +{lvl.xpReward} XP
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-slate-950 dark:text-white leading-snug">
                    {lvl.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lvl.skillTag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

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
    </div>
  );
};
