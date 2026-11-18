import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Shuffle } from 'lucide-react';
import { SURPRISE_CHALLENGES } from '../data/workshopData';
import { ConnectionPostDoc } from '../services/firestoreService';
import { StageTimer } from './StageTimer';
import { VisualArtwork } from './VisualArtwork';

interface ChallengesStudioProps {
  sharedReflections: ConnectionPostDoc[];
  onAddReflection: (challengeId: string, challengeTitle: string, body: string) => Promise<void>;
}

export const ChallengesStudio: React.FC<ChallengesStudioProps> = ({
  sharedReflections,
  onAddReflection,
}) => {
  const [selectedId, setSelectedId] = useState(SURPRISE_CHALLENGES[0].id);
  const [revealPrompt, setRevealPrompt] = useState(true);
  const [draftNote, setDraftNote] = useState('');
  const [saving, setSaving] = useState(false);

  const active =
    SURPRISE_CHALLENGES.find((c) => c.id === selectedId) ?? SURPRISE_CHALLENGES[0];

  const handleDrawRandom = () => {
    const others = SURPRISE_CHALLENGES.filter((c) => c.id !== selectedId);
    const pick = others[Math.floor(Math.random() * others.length)];
    setSelectedId(pick.id);
    setRevealPrompt(false);
  };

  const handleAddReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftNote.trim() || saving) return;
    setSaving(true);
    try {
      await onAddReflection(active.id, active.title, draftNote.trim());
      setDraftNote('');
    } finally {
      setSaving(false);
    }
  };

  const savedNotes = sharedReflections.filter((r) => r.promptRef === active.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Spontaneous Discussions · Surprise Picture Challenges
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Surprise Picture Challenges
          </h1>
        </div>
        <button
          type="button"
          onClick={handleDrawRandom}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Shuffle className="w-4 h-4" />
          <span>Draw Surprise Challenge</span>
        </button>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SURPRISE_CHALLENGES.map((challenge) => {
          const isCurrent = challenge.id === active.id;
          return (
            <button
              key={challenge.id}
              type="button"
              onClick={() => setSelectedId(challenge.id)}
              className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                isCurrent
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                Challenge {challenge.number}
              </div>
              <div className="font-display font-semibold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                {challenge.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two-Zone Stage + Reflection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Challenge {active.number} · {active.employabilityLens}
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                {active.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setRevealPrompt((r) => !r)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {revealPrompt ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealPrompt ? 'Hide Question' : 'Reveal Question'}</span>
            </button>
          </div>

          <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <VisualArtwork id={active.artwork} />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            {revealPrompt ? (
              <>
                <div className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  &ldquo;{active.question}&rdquo;
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {active.deepeningPrompt}
                </p>
              </>
            ) : (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Show the image first and invite immediate gut reactions before revealing the core question.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <StageTimer
            initialSeconds={60}
            label="Spontaneous Speaking Clock"
            presets={[
              { label: '45 sec Quick', seconds: 45 },
              { label: '60 sec Standard', seconds: 60 },
              { label: '90 sec Deep', seconds: 90 },
            ]}
          />

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Verified Learner Voices &amp; Reflections
            </div>
            <form onSubmit={handleAddReflection} className="space-y-2.5">
              <textarea
                rows={3}
                maxLength={600}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder={`Share your honest perspective on: ${active.question}`}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Share Reflection'}</span>
              </button>
            </form>

            {savedNotes.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 max-h-56 overflow-y-auto">
                {savedNotes.map((note, idx) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-0.5"
                  >
                    <div className="text-[11px] font-semibold text-slate-900 dark:text-white">
                      {String(idx + 1).padStart(2, '0')} · {note.authorName}
                    </div>
                    <div>{note.body}</div>
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
