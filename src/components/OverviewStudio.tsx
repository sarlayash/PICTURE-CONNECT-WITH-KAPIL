import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Plus } from 'lucide-react';
import {
  CENTRAL_CONCEPT_PAIRS,
  SESSION_BLUEPRINT,
  WORKSHOP_META,
} from '../data/workshopData';
import { VisualArtwork } from './VisualArtwork';

interface OverviewStudioProps {
  onNavigateView: (
    view: 'overview' | 'activities' | 'challenges' | 'championship' | 'playbook',
    activityNum?: number
  ) => void;
  learnerConnections: { id: string; picture: string; concept: string; explanation: string; authorName?: string }[];
  onAddConnection: (picture: string, concept: string, explanation: string) => void;
}

export const OverviewStudio: React.FC<OverviewStudioProps> = ({
  onNavigateView,
  learnerConnections,
  onAddConnection,
}) => {
  const [selectedPairId, setSelectedPairId] = useState(CENTRAL_CONCEPT_PAIRS[0].id);
  const [revealedIds, setRevealedIds] = useState<string[]>(['bridge-trust']);
  const [customPicture, setCustomPicture] = useState('');
  const [customConcept, setCustomConcept] = useState('');
  const [customReason, setCustomReason] = useState('');

  const activePair =
    CENTRAL_CONCEPT_PAIRS.find((p) => p.id === selectedPairId) ?? CENTRAL_CONCEPT_PAIRS[0];
  const isRevealed = revealedIds.includes(activePair.id);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPicture.trim() || !customConcept.trim() || !customReason.trim()) return;
    onAddConnection(customPicture.trim(), customConcept.trim(), customReason.trim());
    setCustomPicture('');
    setCustomConcept('');
    setCustomReason('');
  };

  return (
    <div className="space-y-14">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span>{WORKSHOP_META.institution}</span>
              <span aria-hidden="true">·</span>
              <span>{WORKSHOP_META.subtitle}</span>
              <span aria-hidden="true">·</span>
              <span>{WORKSHOP_META.poweredBy}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.08]">
              See Beyond. Think Beyond. Connect Beyond.
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
              {WORKSHOP_META.corePhilosophy} Explore 10 live experiential activities, 6 spontaneous picture challenges, and the 10-team Championship designed so even the shyest learner speaks and organises ideas with clarity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateView('activities', 1)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>Launch Activity 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateView('championship')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Open 10-Team Championship</span>
            </button>
          </div>
        </div>

        {/* Visual Anchor Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
            <VisualArtwork id={activePair.artwork} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Central Concept Spotlight</span>
              <span className="font-mono tabular-nums">180 min · 10 Activities</span>
            </div>
            <div className="text-lg font-display font-semibold text-slate-900 dark:text-white">
              {activePair.pictureTitle} + {isRevealed ? activePair.abstractConcept : '???'}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isRevealed
                ? activePair.explanation
                : 'Challenge learners first: ask what seemingly unrelated leadership or life concept this image unlocks.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Session Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-slate-200 dark:border-slate-800 py-5">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Session Architecture</div>
          <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            180 Minutes
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Experiential Drills</div>
          <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            10 Activities
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Classroom Scale</div>
          <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            10 Teams (50+)
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Championship Rubric</div>
          <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            100 Points
          </div>
        </div>
      </section>

      {/* Section 2: The Central Concept Interactive Explorer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-white">
              01. The Central Concept Explorer
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Show a familiar picture, pause for learner guesses, then reveal the deeper connection and build your own.
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Click a pairing card to preview &amp; toggle connection
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 6 Pairing Selector Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CENTRAL_CONCEPT_PAIRS.map((pair) => {
              const selected = pair.id === activePair.id;
              const shown = revealedIds.includes(pair.id);
              return (
                <div
                  key={pair.id}
                  onClick={() => setSelectedPairId(pair.id)}
                  className={`rounded-xl border p-4 transition-colors cursor-pointer ${
                    selected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/25 dark:border-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Picture + Concept
                      </div>
                      <div className="font-display font-semibold text-base text-slate-900 dark:text-white mt-0.5">
                        {pair.pictureTitle} + {shown ? pair.abstractConcept : 'Hidden'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPairId(pair.id);
                        toggleReveal(pair.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {shown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{shown ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {shown ? pair.discussionPrompt : 'Ask learners to propose an abstract link before revealing.'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Learner Custom Connection Builder */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Create Your Own Connection
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Practice explaining a creative, logical bridge between any everyday picture and a career value.
              </p>
            </div>

            <form onSubmit={handleSaveCustom} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Picture Object
                  </label>
                  <input
                    type="text"
                    value={customPicture}
                    onChange={(e) => setCustomPicture(e.target.value)}
                    placeholder="e.g., A cracked teacup"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    placeholder="e.g., Adaptability"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Logical Explanation
                </label>
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Why do these two belong together?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Idea Wall</span>
              </button>
            </form>

            {learnerConnections.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 max-h-48 overflow-y-auto">
                {learnerConnections.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {item.picture} + {item.concept}
                      </span>
                      {item.authorName && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                          {item.authorName}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">{item.explanation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: 180-Minute Session Blueprint */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-white">
              02. Three-Hour Session Architecture (180 Minutes)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Follow the complete 180-minute pacing flow. Select any block to jump directly into its interactive stage.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
            00:00 → 03:00 (180 min total)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SESSION_BLUEPRINT.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => onNavigateView(block.targetView, block.activityNumber)}
              className="text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{block.phase}</span>
                  <span className="font-mono tabular-nums">
                    {block.startMinute}–{block.startMinute + block.durationMinutes} min ({block.durationMinutes}m)
                  </span>
                </div>
                <div className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  {block.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {block.summary}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <span>Open Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Core Outcome Banner */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {WORKSHOP_META.pillars.map((pillar, i) => (
              <React.Fragment key={pillar}>
                {i > 0 && <span aria-hidden="true">·</span>}
                <span>{pillar}</span>
              </React.Fragment>
            ))}
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-slate-950 dark:text-white">
            Workshop North Star
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {WORKSHOP_META.biggestOutcome}
          </p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onNavigateView('playbook')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Scripts &amp; Prep Checklist</span>
          </button>
        </div>
      </section>
    </div>
  );
};
