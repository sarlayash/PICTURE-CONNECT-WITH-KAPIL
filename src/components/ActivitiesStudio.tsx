import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import {
  ACTIVITY_1_DEFAULT_INTERPRETATIONS,
  ArtworkId,
  BOARDROOM_CLUES,
  FINALE_SIX_PICTURES,
  IMPOSSIBLE_PAIRS,
  LEVELS,
  MEMORY_OBJECTS_HARD,
  MEMORY_OBJECTS_STANDARD,
  PROFESSION_CARDS,
  SELL_OBJECTS,
  STORY_ARCHITECT_CARDS,
  WORKPLACE_MISTAKES,
} from '../data/workshopData';
import { PhotoAssetKey } from '../data/imageAssets';
import {
  ConnectionPostDoc,
  LearnerProgressDoc,
  LearnerWorkspaceDoc,
} from '../services/firestoreService';
import { StageTimer } from './StageTimer';
import { VisualArtwork } from './VisualArtwork';

interface ActivitiesStudioProps {
  activeLevel: number;
  onSelectLevel: (num: number) => void;
  onGoToCertificate: () => void;
  progress: LearnerProgressDoc;
  onCompleteLevel: (
    levelNum: number
  ) => Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }>;
  sharedPerspectives: ConnectionPostDoc[];
  onAddPerspective: (sceneTitle: string, text: string) => Promise<void>;
  workspace: LearnerWorkspaceDoc;
  onSaveWorkspace: (patch: Partial<Omit<LearnerWorkspaceDoc, 'ownerId'>>) => Promise<void>;
}

const ACT1_PICTURES: { title: string; artwork: ArtworkId; photoKey?: PhotoAssetKey }[] = [
  { title: 'A Person Standing at a Crossroads', artwork: 'crossroads', photoKey: 'crossroads' },
  { title: 'A Broken Pencil', artwork: 'broken_pencil', photoKey: 'broken_pencil' },
  { title: 'A Titanium Paperclip', artwork: 'paperclip', photoKey: 'paperclip' },
  { title: 'A Rain-Streaked Window Reflection', artwork: 'emotion_scene', photoKey: 'emotion_scene' },
];

export const ActivitiesStudio: React.FC<ActivitiesStudioProps> = ({
  activeLevel,
  onSelectLevel,
  onGoToCertificate,
  progress,
  onCompleteLevel,
  sharedPerspectives,
  onAddPerspective,
  workspace,
  onSaveWorkspace,
}) => {
  const levelDef = LEVELS.find((l) => l.level === activeLevel) ?? LEVELS[0];
  const isCompleted = progress.completedLevels.includes(levelDef.level);

  const [levelRewardToast, setLevelRewardToast] = useState<string | null>(null);
  const [completingLevel, setCompletingLevel] = useState(false);

  // Level 1 State
  const [act1PicIdx, setAct1PicIdx] = useState(0);
  const [newPerspective, setNewPerspective] = useState('');
  const [savingPerspective, setSavingPerspective] = useState(false);

  const combinedPerspectives = [
    ...ACTIVITY_1_DEFAULT_INTERPRETATIONS.map((text, idx) => ({
      id: `default-${idx}`,
      text,
      authorName: 'Example',
    })),
    ...sharedPerspectives.map((p) => ({
      id: p.id,
      text: p.title,
      authorName: p.authorName,
    })),
  ];

  // Level 2 State
  const [pairIdx, setPairIdx] = useState(0);
  const [randomPair, setRandomPair] = useState<{
    leftTitle: string;
    leftArtwork: ArtworkId;
    rightTitle: string;
    rightArtwork: ArtworkId;
    photoKey?: PhotoAssetKey;
  } | null>(null);
  const [showPairAnswer, setShowPairAnswer] = useState(false);
  const [act2Pitch, setAct2Pitch] = useState(workspace.act2Pitch || '');

  // Level 3 State (Solo 5-Picture Story Architect)
  const [storyTitle, setStoryTitle] = useState(workspace.act3StoryTitle || '');
  const [storyBeats, setStoryBeats] = useState<string[]>(() => {
    try {
      const parsed = workspace.act3StoryBeats ? JSON.parse(workspace.act3StoryBeats) : [];
      if (Array.isArray(parsed) && parsed.length === 5) return parsed.map(String);
    } catch {
      // Fallback empty beats
    }
    return ['', '', '', '', ''];
  });

  // Level 4 State (15s Visual Flash Memory)
  const [memoryVisible, setMemoryVisible] = useState(false);
  const [memoryHardMode, setMemoryHardMode] = useState(false);
  const [memoryShowAnswers, setMemoryShowAnswers] = useState(false);
  const [memoryObserved, setMemoryObserved] = useState(workspace.act4Observed || '');
  const [memoryMissing, setMemoryMissing] = useState(workspace.act4Missing || '');
  const [memoryBeforeAfter, setMemoryBeforeAfter] = useState(workspace.act4BeforeAfter || '');

  // Level 5 State (Picture to Profession + CEO Mindset)
  const [profIdx, setProfIdx] = useState(0);
  const [profRevealed, setProfRevealed] = useState(false);
  const [ceoSolution, setCeoSolution] = useState(workspace.act5CeoSolution || '');
  const [showCeoSample, setShowCeoSample] = useState(false);

  // Level 6 State (Workplace Detective)
  const [discoveredMistakes, setDiscoveredMistakes] = useState<string[]>([]);
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);

  // Level 7 State (Sell Me This Picture)
  const [sellIdx, setSellIdx] = useState(0);
  const [showSellSample, setShowSellSample] = useState(false);
  const [pitchData, setPitchData] = useState({
    name: workspace.act7PitchName || '',
    tagline: workspace.act7PitchTagline || '',
    audience: workspace.act7PitchAudience || '',
    usp1: '',
    usp2: '',
    usp3: '',
    script: workspace.act7PitchScript || '',
  });

  // Level 8 State (Emotion Behind Picture)
  const [empathyData, setEmpathyData] = useState({
    emotion: workspace.act8Emotion || '',
    situation: workspace.act8Situation || '',
    perspective: workspace.act8Perspective || '',
    response: workspace.act8Response || '',
  });

  // Level 9 State (Boardroom Turnaround)
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [activeClueId, setActiveClueId] = useState<string>(BOARDROOM_CLUES[0].id);
  const [boardroomProposal, setBoardroomProposal] = useState(workspace.act9Proposal || '');

  // Level 10 State (Six Pictures One Vision Capstone)
  const [finaleTheme, setFinaleTheme] = useState(workspace.act10Theme || '');
  const [finaleNotes, setFinaleNotes] = useState(workspace.act10Notes || '');

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setAct2Pitch(workspace.act2Pitch || '');
    if (workspace.act3StoryTitle !== undefined) setStoryTitle(workspace.act3StoryTitle || '');
    if (workspace.act3StoryBeats) {
      try {
        const parsed = JSON.parse(workspace.act3StoryBeats);
        if (Array.isArray(parsed) && parsed.length === 5) {
          setStoryBeats(parsed.map(String));
        }
      } catch {
        // ignore invalid json
      }
    }
    setMemoryObserved(workspace.act4Observed || '');
    setMemoryMissing(workspace.act4Missing || '');
    setMemoryBeforeAfter(workspace.act4BeforeAfter || '');
    setCeoSolution(workspace.act5CeoSolution || '');
    setPitchData((prev) => ({
      ...prev,
      name: workspace.act7PitchName || prev.name,
      tagline: workspace.act7PitchTagline || prev.tagline,
      audience: workspace.act7PitchAudience || prev.audience,
      script: workspace.act7PitchScript || prev.script,
    }));
    setEmpathyData({
      emotion: workspace.act8Emotion || '',
      situation: workspace.act8Situation || '',
      perspective: workspace.act8Perspective || '',
      response: workspace.act8Response || '',
    });
    setBoardroomProposal(workspace.act9Proposal || '');
    setFinaleTheme(workspace.act10Theme || '');
    setFinaleNotes(workspace.act10Notes || '');
  }, [workspace]);

  useEffect(() => {
    setLevelRewardToast(null);
    setSavedNotice(null);
  }, [activeLevel]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  const flashNotice = (label: string) => {
    setSavedNotice(label);
    window.setTimeout(() => setSavedNotice(null), 2600);
  };

  const handleSaveAndComplete = async (
    levelNum: number,
    workspacePatch?: Partial<Omit<LearnerWorkspaceDoc, 'ownerId'>>
  ) => {
    setCompletingLevel(true);
    try {
      if (workspacePatch) {
        await onSaveWorkspace(workspacePatch);
      }
      const res = await onCompleteLevel(levelNum);
      if (res.newlyAwardedXp > 0) {
        setLevelRewardToast(
          `Level ${levelNum} Complete! +${res.newlyAwardedXp} XP added${
            res.newlyUnlockedBadges.length > 0 ? ' · New Mastery Badge Unlocked!' : ''
          }`
        );
      } else {
        flashNotice('Saved updated work!');
      }
    } finally {
      setCompletingLevel(false);
    }
  };

  const startMemoryFlash = () => {
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    setMemoryVisible(true);
    setMemoryShowAnswers(false);
    flashTimerRef.current = window.setTimeout(() => {
      setMemoryVisible(false);
    }, 15000);
  };

  const handleAddPerspective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerspective.trim() || savingPerspective) return;
    setSavingPerspective(true);
    try {
      await onAddPerspective(ACT1_PICTURES[act1PicIdx].title, newPerspective.trim());
      setNewPerspective('');
      flashNotice('Perspective added to Learner Wall');
    } finally {
      setSavingPerspective(false);
    }
  };

  const generateRandomPair = () => {
    const pool: { title: string; artwork: ArtworkId }[] = [
      { title: 'Broken Pencil', artwork: 'broken_pencil' },
      { title: 'Lighthouse', artwork: 'lighthouse' },
      { title: 'Espresso Cup', artwork: 'coffee_cup' },
      { title: 'Compass', artwork: 'compass' },
      { title: 'Mountain Peak', artwork: 'mountain_peak' },
      { title: 'Umbrella', artwork: 'umbrella' },
      { title: 'Camera', artwork: 'camera' },
      { title: 'Titanium Clip', artwork: 'paperclip' },
    ];
    const a = pool[Math.floor(Math.random() * pool.length)];
    let b = pool[Math.floor(Math.random() * pool.length)];
    while (b.title === a.title) {
      b = pool[Math.floor(Math.random() * pool.length)];
    }
    setRandomPair({
      leftTitle: a.title,
      leftArtwork: a.artwork,
      rightTitle: b.title,
      rightArtwork: b.artwork,
    });
    setShowPairAnswer(false);
  };

  const activePair = IMPOSSIBLE_PAIRS[pairIdx];
  const activeProf = PROFESSION_CARDS[profIdx];
  const activeSell = SELL_OBJECTS[sellIdx];
  const activeClue = BOARDROOM_CLUES.find((c) => c.id === activeClueId) ?? BOARDROOM_CLUES[0];
  const activeMistake = WORKPLACE_MISTAKES.find((m) => m.id === selectedMistakeId);

  return (
    <div className="space-y-6">
      {/* Horizontal Levels 1-10 Navigator */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max">
          {LEVELS.map((item) => {
            const active = item.level === activeLevel;
            const done = progress.completedLevels.includes(item.level);
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onSelectLevel(item.level)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  active
                    ? 'bg-blue-700 border-blue-700 text-white font-semibold'
                    : done
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <span className="font-mono font-bold">L{String(item.level).padStart(2, '0')}</span>
                <span>{item.title.split('!')[0]}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Header Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                LEVEL {String(levelDef.level).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{levelDef.skillTag}</span>
              <span aria-hidden="true">·</span>
              <span>{levelDef.durationLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {isCompleted ? 'Completed' : `+${levelDef.xpReward} XP Reward`}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              {levelDef.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Skill Outcome:</span>{' '}
              {levelDef.learningOutcome}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <StageTimer
              key={levelDef.level}
              initialSeconds={levelDef.timerSeconds}
              label={`L${levelDef.level} Clock`}
            />
          </div>
        </div>

        {levelRewardToast && (
          <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              {levelRewardToast}
            </span>
            {levelDef.level < 10 ? (
              <button
                type="button"
                onClick={() => onSelectLevel(levelDef.level + 1)}
                className="underline font-bold cursor-pointer shrink-0"
              >
                Next: Level {levelDef.level + 1} →
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoToCertificate}
                className="underline font-bold cursor-pointer shrink-0"
              >
                Open PNG Certificate →
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {levelDef.instructions.map((step, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
            >
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400 shrink-0">
                0{idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {levelDef.highlightRule && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-xs font-medium text-amber-900 dark:text-amber-200">
            Key Principle: {levelDef.highlightRule}
          </div>
        )}
      </div>

      {/* LEVEL 1: One Picture, 50 Perspectives */}
      {activeLevel === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                {ACT1_PICTURES[act1PicIdx].title}
              </h2>
              <div className="flex items-center gap-1.5">
                {ACT1_PICTURES.map((p, idx) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setAct1PicIdx(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                      idx === act1PicIdx
                        ? 'bg-blue-700 text-white'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork
                id={ACT1_PICTURES[act1PicIdx].artwork}
                photoKey={ACT1_PICTURES[act1PicIdx].photoKey}
              />
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  Perspective Wall ({combinedPerspectives.length})
                </h2>
                {savedNotice && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {savedNotice}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {combinedPerspectives.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-400 shrink-0">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200">{item.text}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {item.authorName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleAddPerspective} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPerspective}
                  onChange={(e) => setNewPerspective(e.target.value)}
                  placeholder="Write your unique interpretation..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={savingPerspective || !newPerspective.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              <button
                type="button"
                disabled={completingLevel}
                onClick={() => handleSaveAndComplete(1)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Level 1 Completed' : 'Complete Level 1 (+100 XP)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2: The Impossible Connection */}
      {activeLevel === 2 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {IMPOSSIBLE_PAIRS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPairIdx(idx);
                    setRandomPair(null);
                    setShowPairAnswer(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    !randomPair && pairIdx === idx
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p.leftTitle} + {p.rightTitle}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={generateRandomPair}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Pair</span>
            </button>
          </div>

          {!randomPair && activePair.photoKey ? (
            <div className="aspect-[16/8] max-w-3xl mx-auto w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork id={activePair.leftArtwork} photoKey={activePair.photoKey} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  IMAGE A · {(randomPair ?? activePair).leftTitle}
                </div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <VisualArtwork id={(randomPair ?? activePair).leftArtwork} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  IMAGE B · {(randomPair ?? activePair).rightTitle}
                </div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <VisualArtwork id={(randomPair ?? activePair).rightArtwork} />
                </div>
              </div>
            </div>
          )}

          {!randomPair && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Sample Logical Connection
                </div>
                <div className="text-base font-display font-semibold text-slate-950 dark:text-white mt-0.5">
                  {showPairAnswer ? activePair.possibleConnection : 'Draft your own bridge first'}
                </div>
                {showPairAnswer && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                    {activePair.reasoningHint}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPairAnswer((s) => !s)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                {showPairAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPairAnswer ? 'Hide Hint' : 'Reveal Sample Bridge'}</span>
              </button>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your 45-Second Logical Bridge
              </label>
              {savedNotice && <span className="text-xs text-emerald-600">{savedNotice}</span>}
            </div>
            <textarea
              rows={3}
              value={act2Pitch}
              onChange={(e) => setAct2Pitch(e.target.value)}
              placeholder="Write a logical yet creative bridge uniting both images..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              disabled={completingLevel || !act2Pitch.trim()}
              onClick={() => handleSaveAndComplete(2, { act2Pitch })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Update Level 2 Response' : 'Complete Level 2 (+120 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 3: Five-Picture Story Architect (100% Solo Learner) */}
      {activeLevel === 3 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STORY_ARCHITECT_CARDS.map((card, idx) => (
              <div
                key={card.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-blue-700 dark:text-blue-400 font-semibold">
                    <span>SCENE 0{card.step}</span>
                    <span>{card.beatLabel}</span>
                  </div>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <VisualArtwork id={card.artwork} photoKey={card.photoKey} />
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={storyBeats[idx] || ''}
                  onChange={(e) => {
                    const next = [...storyBeats];
                    next[idx] = e.target.value;
                    setStoryBeats(next);
                  }}
                  placeholder={`Write the ${card.beatLabel.toLowerCase()} beat...`}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Memorable Story Title
              </label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="e.g., When the Pencil Snapped, Launch Began"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="md:col-span-4 flex items-center justify-end gap-3">
              {savedNotice && <span className="text-xs text-emerald-600">{savedNotice}</span>}
              <button
                type="button"
                disabled={completingLevel || !storyTitle.trim()}
                onClick={() =>
                  handleSaveAndComplete(3, {
                    act3StoryTitle: storyTitle,
                    act3StoryBeats: JSON.stringify(storyBeats),
                  })
                }
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Update Level 3 Story' : 'Complete Level 3 (+130 XP)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 4: What Is Missing? (15s Visual Flash) */}
      {activeLevel === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  15-Second Visual Memory Drill
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Observe every detail on the desk for 15 seconds before it hides.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMemoryHardMode((m) => !m)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                    memoryHardMode
                      ? 'bg-slate-900 dark:bg-blue-700 text-white border-transparent'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {memoryHardMode ? 'Hard Recall (10 Items)' : 'Standard Recall (6 Items)'}
                </button>
                <button
                  type="button"
                  onClick={startMemoryFlash}
                  className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                >
                  {memoryVisible ? 'Restart 15s Flash' : 'Flash Photo (15s)'}
                </button>
              </div>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              {memoryVisible ? (
                <VisualArtwork id="memory_scene" photoKey="memory_scene" />
              ) : (
                <div className="w-full h-full bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <EyeOff className="w-8 h-8 text-blue-400" />
                  <div className="font-display text-lg font-semibold text-white">
                    Photo Hidden — Recall From Memory
                  </div>
                  <p className="text-xs text-slate-400 max-w-md">
                    Click &ldquo;Flash Photo (15s)&rdquo; to reveal the executive desk scene for 15 seconds, then list everything you observed and what essential accessory is missing.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMemoryShowAnswers((s) => !s)}
                    className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                  >
                    {memoryShowAnswers ? 'Hide Answer Key' : 'Check Answer Key'}
                  </button>
                </div>
              )}
            </div>

            {memoryShowAnswers && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Visual Audit Key ({memoryHardMode ? '10' : '6'} Items)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {(memoryHardMode ? MEMORY_OBJECTS_HARD : MEMORY_OBJECTS_STANDARD).map((obj) => (
                    <div
                      key={obj.id}
                      className={
                        obj.isMissingHint
                          ? 'text-amber-700 dark:text-amber-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    >
                      · {obj.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              Your Visual Recall Audit
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  1. What objects did you observe?
                </label>
                <textarea
                  rows={2}
                  value={memoryObserved}
                  onChange={(e) => setMemoryObserved(e.target.value)}
                  placeholder="List objects you spotted on the desk..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  2. What was missing from the scene?
                </label>
                <input
                  type="text"
                  value={memoryMissing}
                  onChange={(e) => setMemoryMissing(e.target.value)}
                  placeholder="e.g., Laptop charger, smartphone, water bottle..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  3. What happened just before &amp; what happens next?
                </label>
                <textarea
                  rows={3}
                  value={memoryBeforeAfter}
                  onChange={(e) => setMemoryBeforeAfter(e.target.value)}
                  placeholder="Infer the story around this desk..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="button"
                disabled={completingLevel || !memoryObserved.trim()}
                onClick={() =>
                  handleSaveAndComplete(4, {
                    act4Observed: memoryObserved,
                    act4Missing: memoryMissing,
                    act4BeforeAfter: memoryBeforeAfter,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Update Level 4 Recall' : 'Complete Level 4 (+130 XP)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 5: Picture to Profession + CEO Mindset */}
      {activeLevel === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {PROFESSION_CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    setProfIdx(idx);
                    setProfRevealed(false);
                    setShowCeoSample(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    idx === profIdx
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {card.objectName}
                </button>
              ))}
            </div>

            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork id={activeProf.artwork} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Connected Profession
                </div>
                <div className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {profRevealed ? activeProf.profession : 'Guess first, then reveal'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfRevealed((r) => !r)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                {profRevealed ? 'Hide Role' : 'Reveal Profession'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                EXECUTIVE PIVOT · CEO CHALLENGE
              </div>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                {activeProf.ceoPrompt}
              </h2>
              <textarea
                rows={4}
                value={ceoSolution}
                onChange={(e) => setCeoSolution(e.target.value)}
                placeholder="Write your CEO strategic solution using this object as a metaphor..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowCeoSample((s) => !s)}
                className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {showCeoSample ? 'Hide Example CEO Idea' : 'See Example CEO Insight'}
              </button>
              {showCeoSample && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300">
                  {activeProf.exampleCeoIdea}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={completingLevel || !ceoSolution.trim()}
              onClick={() => handleSaveAndComplete(5, { act5CeoSolution: ceoSolution })}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Update Level 5 Response' : 'Complete Level 5 (+140 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 6: Workplace Detective */}
      {activeLevel === 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Inspect the corporate office photo and click numbered hotspots to flag workplace violations.
              </div>
              <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {discoveredMistakes.length} / 10 Flagged
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDiscoveredMistakes([]);
                    setSelectedMistakeId(null);
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="aspect-[16/9] w-full">
              <VisualArtwork
                id="workplace_detective"
                discoveredMistakes={discoveredMistakes}
                onSelectMistake={(id) => {
                  setSelectedMistakeId(id);
                  setDiscoveredMistakes((prev) =>
                    prev.includes(id) ? prev : [...prev, id]
                  );
                }}
              />
            </div>

            {activeMistake && (
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 space-y-1">
                <div className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
                  VIOLATION #{activeMistake.number} · {activeMistake.category}
                </div>
                <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                  {activeMistake.title}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {activeMistake.detail}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                Audit Log ({discoveredMistakes.length}/10)
              </h2>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {WORKPLACE_MISTAKES.map((m) => {
                  const found = discoveredMistakes.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMistakeId(m.id);
                        if (!found) setDiscoveredMistakes((prev) => [...prev, m.id]);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        found
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                          #{m.number}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white truncate flex-1">
                          {found ? m.title : 'Click hotspot on photo'}
                        </span>
                        {found && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={completingLevel || discoveredMistakes.length < 5}
              onClick={() => handleSaveAndComplete(6)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {discoveredMistakes.length < 5
                  ? `Flag ${5 - discoveredMistakes.length} more violations to unlock`
                  : isCompleted
                  ? 'Level 6 Completed'
                  : 'Complete Level 6 (+150 XP)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 7: Sell Me This Picture! */}
      {activeLevel === 7 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {SELL_OBJECTS.map((obj, idx) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => {
                    setSellIdx(idx);
                    setShowSellSample(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    idx === sellIdx
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {obj.objectName}
                </button>
              ))}
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork id={activeSell.artwork} photoKey={activeSell.photoKey} />
            </div>

            <button
              type="button"
              onClick={() => setShowSellSample((s) => !s)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
            >
              {showSellSample ? 'Hide ConnectPro Reference' : `Reveal Reference (${activeSell.sampleName})`}
            </button>

            {showSellSample && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 text-xs">
                <div className="font-display font-bold text-sm text-slate-950 dark:text-white">
                  {activeSell.sampleName} — {activeSell.sampleTagline}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeSell.samplePitch}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              Brand Positioning &amp; 30-Second Pitch Sheet
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={pitchData.name}
                  onChange={(e) => setPitchData({ ...pitchData, name: e.target.value })}
                  placeholder="e.g., ConnectPro"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={pitchData.tagline}
                  onChange={(e) => setPitchData({ ...pitchData, tagline: e.target.value })}
                  placeholder="e.g., The smallest collaboration tech"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={pitchData.audience}
                onChange={(e) => setPitchData({ ...pitchData, audience: e.target.value })}
                placeholder="Who pays top value for this flagship product?"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                30-Second Sales Pitch
              </label>
              <textarea
                rows={4}
                value={pitchData.script}
                onChange={(e) => setPitchData({ ...pitchData, script: e.target.value })}
                placeholder="Write a hook, 3 crisp USPs, and a confident closing ask..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="button"
              disabled={completingLevel || !pitchData.name.trim() || !pitchData.script.trim()}
              onClick={() =>
                handleSaveAndComplete(7, {
                  act7PitchName: pitchData.name,
                  act7PitchTagline: pitchData.tagline,
                  act7PitchAudience: pitchData.audience,
                  act7PitchScript: pitchData.script,
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Update Level 7 Pitch' : 'Complete Level 7 (+150 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 8: Emotion Behind the Picture */}
      {activeLevel === 8 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork id="emotion_scene" photoKey="emotion_scene" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notice the gaze, hand posture, rain-streaked glass, and quiet evening workspace. Base your empathy on visible evidence.
            </p>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              Empathy &amp; Evidence Worksheet
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  1. Possible Emotion &amp; Visual Cue
                </label>
                <input
                  type="text"
                  value={empathyData.emotion}
                  onChange={(e) => setEmpathyData({ ...empathyData, emotion: e.target.value })}
                  placeholder="e.g., Quiet mental fatigue..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  2. Likely Situation
                </label>
                <input
                  type="text"
                  value={empathyData.situation}
                  onChange={(e) => setEmpathyData({ ...empathyData, situation: e.target.value })}
                  placeholder="What might have occurred today?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                3. The Person’s Perspective
              </label>
              <textarea
                rows={2}
                value={empathyData.perspective}
                onChange={(e) => setEmpathyData({ ...empathyData, perspective: e.target.value })}
                placeholder="How might they be framing this moment internally?"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                4. Supportive Words You Would Say
              </label>
              <textarea
                rows={2}
                value={empathyData.response}
                onChange={(e) => setEmpathyData({ ...empathyData, response: e.target.value })}
                placeholder="Open a respectful, non-judgmental conversation..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="button"
              disabled={completingLevel || !empathyData.emotion.trim() || !empathyData.response.trim()}
              onClick={() =>
                handleSaveAndComplete(8, {
                  act8Emotion: empathyData.emotion,
                  act8Situation: empathyData.situation,
                  act8Perspective: empathyData.perspective,
                  act8Response: empathyData.response,
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Update Level 8 Analysis' : 'Complete Level 8 (+160 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 9: Corporate Boardroom Turnaround */}
      {activeLevel === 9 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Click all 5 strategic clue tags on the boardroom photograph.
              </span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                {discoveredClues.length} / 5 Clues Audited
              </span>
            </div>
            <div className="aspect-[16/9] w-full">
              <VisualArtwork
                id="boardroom_decline"
                discoveredClues={discoveredClues}
                onSelectClue={(id) => {
                  setActiveClueId(id);
                  setDiscoveredClues((prev) => (prev.includes(id) ? prev : [...prev, id]));
                }}
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1.5">
              <div className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
                CLUE · {activeClue.dimension}
              </div>
              <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                {activeClue.headline}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {activeClue.visualEvidence}
              </p>
              <div className="text-xs font-medium text-slate-900 dark:text-white pt-1">
                Strategic Prompt: {activeClue.strategicQuestion}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                2-Minute Turnaround Brief
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesise Customers, Employees, Quality, Marketing, and Competition into a concrete 3-step recovery plan.
              </p>
              <textarea
                rows={9}
                value={boardroomProposal}
                onChange={(e) => setBoardroomProposal(e.target.value)}
                placeholder="1. Immediate 14-day quality & customer stabilisation...&#10;2. Team alignment & accountability...&#10;3. Differentiation vs rival..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="button"
              disabled={completingLevel || !boardroomProposal.trim()}
              onClick={() => handleSaveAndComplete(9, { act9Proposal: boardroomProposal })}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Update Level 9 Brief' : 'Complete Level 9 (+180 XP)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 10: Six Pictures, One Vision Capstone */}
      {activeLevel === 10 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FINALE_SIX_PICTURES.map((card, idx) => (
              <div
                key={card.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2"
              >
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  CARD 0{idx + 1}
                </div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                  <VisualArtwork id={card.artwork} photoKey={card.photoKey} />
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {card.title}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  Grand Capstone Blueprint
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Example theme: &ldquo;The Journey of a Leader — From Reflection Desk to Boardroom Vision.&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={onGoToCertificate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>View &amp; Download PNG Certificate</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Unifying Vision Title
                </label>
                <input
                  type="text"
                  value={finaleTheme}
                  onChange={(e) => setFinaleTheme(e.target.value)}
                  placeholder="Enter your single unifying theme connecting all 6 photographs..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  3-Part Keynote Narrative (Connecting All 6 Images)
                </label>
                <textarea
                  rows={5}
                  value={finaleNotes}
                  onChange={(e) => setFinaleNotes(e.target.value)}
                  placeholder="Opening Hook (Desk & Crossroads) -> Core Turning Point (Broken Pencil & Titanium Clip) -> Leadership Resolution (Empathy & Boardroom Vision)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="button"
                disabled={completingLevel || !finaleTheme.trim() || !finaleNotes.trim()}
                onClick={() =>
                  handleSaveAndComplete(10, {
                    act10Theme: finaleTheme,
                    act10Notes: finaleNotes,
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isCompleted
                    ? 'Update Capstone Blueprint'
                    : 'Complete Level 10 Capstone (+250 XP)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
