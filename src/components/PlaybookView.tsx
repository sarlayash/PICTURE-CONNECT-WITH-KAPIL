import React, { useState } from 'react';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Square,
} from 'lucide-react';
import {
  CLOSING_SCRIPT_LINES,
  OPENING_SCRIPT_LINES,
  PrepItem,
  SESSION_BLUEPRINT,
  WORKSHOP_META,
} from '../data/workshopData';

interface PlaybookViewProps {
  prepItems: PrepItem[];
  onTogglePrep: (id: string) => void;
  onAddPrepItem: (label: string, category: string) => void;
}

export const PlaybookView: React.FC<PlaybookViewProps> = ({
  prepItems,
  onTogglePrep,
  onAddPrepItem,
}) => {
  const [scriptTab, setScriptTab] = useState<'opening' | 'closing'>('opening');
  const [cueIndex, setCueIndex] = useState(0);
  const [teleprompterMode, setTeleprompterMode] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Facilitation');

  const activeLines =
    scriptTab === 'opening' ? OPENING_SCRIPT_LINES : CLOSING_SCRIPT_LINES;
  const completedCount = prepItems.filter((item) => item.completed).length;
  const completionPercent =
    prepItems.length > 0 ? Math.round((completedCount / prepItems.length) * 100) : 0;

  const handleAddPrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;
    onAddPrepItem(newItemLabel.trim(), newItemCategory);
    setNewItemLabel('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Facilitator Playbook · Opening &amp; Closing Scripts · Preparation Checklist
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            Scripts &amp; Session Readiness
          </h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Playbook</span>
        </button>
      </div>

      {/* Scripts & Teleprompter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setScriptTab('opening');
                  setCueIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                  scriptTab === 'opening'
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Opening — Create Curiosity
              </button>
              <button
                type="button"
                onClick={() => {
                  setScriptTab('closing');
                  setCueIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                  scriptTab === 'closing'
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Closing — Make It Memorable
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTeleprompterMode((t) => !t)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {teleprompterMode ? 'Show Full Script' : 'Cue-by-Cue Focus'}
            </button>
          </div>

          {teleprompterMode ? (
            <div className="rounded-xl bg-slate-950 text-white p-6 sm:p-8 space-y-6">
              <div className="font-mono text-xs text-slate-400">
                Line {cueIndex + 1} of {activeLines.length}
              </div>
              <p className="font-display text-2xl sm:text-3xl font-semibold leading-snug">
                &ldquo;{activeLines[cueIndex]}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={cueIndex === 0}
                  onClick={() => setCueIndex((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={cueIndex === activeLines.length - 1}
                  onClick={() =>
                    setCueIndex((i) => Math.min(activeLines.length - 1, i + 1))
                  }
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-700 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <span>Next Beat</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeLines.map((line, idx) => (
                <p
                  key={line}
                  className={`text-sm sm:text-base leading-relaxed p-3 rounded-lg border ${
                    idx === activeLines.length - 1
                      ? 'border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 font-medium text-slate-950 dark:text-white'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            Positioning: <span className="font-semibold text-slate-900 dark:text-white">{WORKSHOP_META.positioning}</span> — {WORKSHOP_META.closingCallout}
          </div>
        </div>

        {/* Right: Preparation Checklist */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                What to Prepare Tonight
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Your preparation checklist
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono tabular-nums text-2xl font-bold text-blue-700 dark:text-blue-400">
                {completionPercent}%
              </div>
              <div className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400">
                {completedCount} of {prepItems.length} completed
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-700 transition-all duration-200"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <div className="space-y-2">
            {prepItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onTogglePrep(item.id)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex items-start gap-3 cursor-pointer"
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-medium ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.category}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleAddPrep} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="Add tonight prep item..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                <option value="Facilitation">Facilitation</option>
                <option value="Room & AV">Room &amp; AV</option>
                <option value="Props">Props</option>
                <option value="Judging Panel">Judging</option>
              </select>
              <button
                type="submit"
                aria-label="Add checklist item"
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Complete 180-Minute Schedule Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
          Full 180-Minute Run Sheet
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Window</th>
                <th className="py-2 pr-4">Duration</th>
                <th className="py-2 pr-4">Phase</th>
                <th className="py-2 pr-4">Segment</th>
                <th className="py-2">Facilitation Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SESSION_BLUEPRINT.map((block) => (
                <tr key={block.id}>
                  <td className="py-2.5 pr-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {String(block.startMinute).padStart(3, '0')}–
                    {String(block.startMinute + block.durationMinutes).padStart(3, '0')}m
                  </td>
                  <td className="py-2.5 pr-4 font-mono tabular-nums font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {block.durationMinutes} min
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {block.phase}
                  </td>
                  <td className="py-2.5 pr-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {block.title}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">
                    {block.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
