import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  ACTIVITIES,
  CENTRAL_CONCEPT_PAIRS,
  SURPRISE_CHALLENGES,
  WORKSHOP_META,
} from '../data/workshopData';
import { StageTimer } from './StageTimer';
import { VisualArtwork } from './VisualArtwork';

interface StageProjectorModalProps {
  open: boolean;
  onClose: () => void;
  initialActivityNumber: number;
}

type StageDeckItem = {
  kicker: string;
  title: string;
  prompt: string;
  artwork: Parameters<typeof VisualArtwork>[0]['id'];
  defaultSeconds: number;
};

const STAGE_DECK: StageDeckItem[] = [
  ...CENTRAL_CONCEPT_PAIRS.map((p) => ({
    kicker: 'Central Concept Warm-Up',
    title: p.pictureTitle,
    prompt: `Connect this picture with something seemingly unrelated. (${p.discussionPrompt})`,
    artwork: p.artwork,
    defaultSeconds: 60,
  })),
  {
    kicker: `Activity 01 · ${ACTIVITIES[0].title}`,
    title: 'A Person Standing at a Crossroads',
    prompt: 'Ask 10 different students to interpret what this crossroads means. Multiple perspectives welcome.',
    artwork: 'crossroads',
    defaultSeconds: 180,
  },
  {
    kicker: `Activity 04 · ${ACTIVITIES[3].title}`,
    title: '15-Second Visual Flash Recall',
    prompt: 'Observe every detail for 15 seconds. What objects did you see? What is missing? What happened before & next?',
    artwork: 'memory_scene',
    defaultSeconds: 15,
  },
  {
    kicker: `Activity 06 · ${ACTIVITIES[5].title}`,
    title: 'Workplace Audit (8–10 Mistakes)',
    prompt: 'Each team gets 3 minutes to spot safety, communication, time, etiquette, and security failures.',
    artwork: 'workplace_detective',
    defaultSeconds: 180,
  },
  {
    kicker: `Activity 07 · ${ACTIVITIES[6].title}`,
    title: 'Sell Me This Picture!',
    prompt: 'Create Product Name, Tagline, Target Audience, 3 USPs, and deliver a 30-second pitch!',
    artwork: 'paperclip',
    defaultSeconds: 30,
  },
  {
    kicker: `Activity 08 · ${ACTIVITIES[7].title}`,
    title: 'Emotion Behind the Picture',
    prompt: 'Identify the emotion, situation, person’s perspective, and what you would say. Explain your reasoning.',
    artwork: 'emotion_scene',
    defaultSeconds: 120,
  },
  {
    kicker: `Activity 09 · ${ACTIVITIES[8].title}`,
    title: '40% Sales Decline Diagnostic',
    prompt: 'Examine Customers, Employees, Product Quality, Marketing, and Competition for a 2-minute boardroom pitch.',
    artwork: 'boardroom_decline',
    defaultSeconds: 120,
  },
  ...SURPRISE_CHALLENGES.map((c) => ({
    kicker: `Surprise Challenge ${c.number} · ${c.title}`,
    title: c.question,
    prompt: c.deepeningPrompt,
    artwork: c.artwork,
    defaultSeconds: 60,
  })),
];

export const StageProjectorModal: React.FC<StageProjectorModalProps> = ({
  open,
  onClose,
  initialActivityNumber,
}) => {
  const defaultIdx =
    initialActivityNumber === 1
      ? 6
      : initialActivityNumber === 4
      ? 7
      : initialActivityNumber === 6
      ? 8
      : initialActivityNumber === 7
      ? 9
      : initialActivityNumber === 8
      ? 10
      : initialActivityNumber === 9
      ? 11
      : 0;

  const [slideIdx, setSlideIdx] = useState(defaultIdx);

  if (!open) return null;

  const current = STAGE_DECK[slideIdx] ?? STAGE_DECK[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Classroom Projector Stage Mode"
    >
      {/* Top Stage Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-0.5">
          <div className="text-xs text-slate-400">
            {WORKSHOP_META.title} · {WORKSHOP_META.institution}
          </div>
          <div className="font-display text-lg font-semibold text-white">
            {current.kicker}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Exit Stage Mode</span>
        </button>
      </div>

      {/* Main Projection Canvas */}
      <div className="my-auto py-6 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
          <VisualArtwork id={current.artwork} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              {current.title}
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {current.prompt}
            </p>
          </div>

          <StageTimer
            initialSeconds={current.defaultSeconds}
            label="Stage Clock"
          />
        </div>
      </div>

      {/* Bottom Slide Switcher */}
      <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
        <div className="font-mono tabular-nums text-xs text-slate-400">
          Slide {slideIdx + 1} of {STAGE_DECK.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setSlideIdx((i) => (i - 1 + STAGE_DECK.length) % STAGE_DECK.length)
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>
          <button
            type="button"
            onClick={() => setSlideIdx((i) => (i + 1) % STAGE_DECK.length)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-xs font-semibold cursor-pointer"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
