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
  FINALE_SIX_PICTURES,
  IMPOSSIBLE_PAIRS,
  LEVELS,
  PROFESSION_CARDS,
  SELL_OBJECTS,
  STORY_ARCHITECT_CARDS,
} from '../data/workshopData';
import {
  LEVEL1_PLACEMENT_SCENES,
  LEVEL2_PLACEMENT_EXTRA_PAIRS,
  LEVEL3_PLACEMENT_LAUNCH_CARDS,
  LEVEL3_PLACEMENT_STAR_CARDS,
  LEVEL4_FLASH_SCENES,
  LEVEL5_PLACEMENT_EXTRA_PROFESSIONS,
  LEVEL6_AUDIT_SCENES,
  LEVEL7_PLACEMENT_EXTRA_SELL_OBJECTS,
  LEVEL8_EMPATHY_SCENES,
  LEVEL9_CASE_SCENES,
  LEVEL10_PLACEMENT_BONUS_CARDS,
  PlacementImpossiblePair,
  PlacementProfessionCard,
  PlacementSellObject,
} from '../data/placementPictureConnectData';
import { PhotoAssetKey } from '../data/imageAssets';
import {
  ConnectionPostDoc,
  LearnerProgressDoc,
  LearnerWorkspaceDoc,
} from '../services/firestoreService';
import { getLevelTheme } from '../data/themeColors';
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

const ALL_IMPOSSIBLE_PAIRS: PlacementImpossiblePair[] = [
  ...IMPOSSIBLE_PAIRS.map((p) => ({
    ...p,
    placementRound: 'Lateral & Creative Thinking',
  })),
  ...LEVEL2_PLACEMENT_EXTRA_PAIRS,
];

const ALL_PROFESSION_CARDS: PlacementProfessionCard[] = [
  ...PROFESSION_CARDS,
  ...LEVEL5_PLACEMENT_EXTRA_PROFESSIONS,
];

const ALL_SELL_OBJECTS: PlacementSellObject[] = [
  ...SELL_OBJECTS.map((s) => ({
    ...s,
    photoKey: (s.photoKey ?? 'umbrella') as PhotoAssetKey,
  })),
  ...LEVEL7_PLACEMENT_EXTRA_SELL_OBJECTS,
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
    leftPhotoKey?: PhotoAssetKey;
    rightTitle: string;
    rightArtwork: ArtworkId;
    rightPhotoKey?: PhotoAssetKey;
    photoKey?: PhotoAssetKey;
  } | null>(null);
  const [showPairAnswer, setShowPairAnswer] = useState(false);
  const [act2Pitch, setAct2Pitch] = useState(workspace.act2Pitch || '');

  // Level 3 State (Solo 5-Picture Story Architect — Classic 5 + STAR 5 + PPO Launch 5 = 15 Images)
  const [storyDeckMode, setStoryDeckMode] = useState<'classic' | 'placement' | 'launch'>('launch');
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

  // Level 4 State (15s Visual Flash Memory — 6 Scenes: 1 Classic + 5 Placement)
  const [memorySceneIdx, setMemorySceneIdx] = useState(0);
  const [memoryVisible, setMemoryVisible] = useState(false);
  const [memoryHardMode, setMemoryHardMode] = useState(false);
  const [memoryShowAnswers, setMemoryShowAnswers] = useState(false);
  const [memoryObserved, setMemoryObserved] = useState(workspace.act4Observed || '');
  const [memoryMissing, setMemoryMissing] = useState(workspace.act4Missing || '');
  const [memoryBeforeAfter, setMemoryBeforeAfter] = useState(workspace.act4BeforeAfter || '');

  // Level 5 State (Picture to Profession + CEO Mindset — 6 Classic + 5 Placement)
  const [profIdx, setProfIdx] = useState(0);
  const [profRevealed, setProfRevealed] = useState(false);
  const [ceoSolution, setCeoSolution] = useState(workspace.act5CeoSolution || '');
  const [showCeoSample, setShowCeoSample] = useState(false);

  // Level 6 State (Workplace & Placement Detective — 1 Classic + 5 Placement Scenes)
  const [auditSceneIdx, setAuditSceneIdx] = useState(0);
  const [discoveredMistakes, setDiscoveredMistakes] = useState<string[]>([]);
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);

  // Level 7 State (Sell Me This Picture — 3 Classic + 5 Placement)
  const parsePitchUsps = (raw?: string): [string, string, string] => {
    if (!raw) return ['', '', ''];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return [String(parsed[0] || ''), String(parsed[1] || ''), String(parsed[2] || '')];
      }
    } catch {
      const parts = raw.split(/\n|•|\|/).map((s) => s.trim()).filter(Boolean);
      return [parts[0] || '', parts[1] || '', parts[2] || ''];
    }
    return ['', '', ''];
  };

  const initialUsps = parsePitchUsps(workspace.act7PitchUsps);
  const [sellIdx, setSellIdx] = useState(0);
  const [showSellSample, setShowSellSample] = useState(false);
  const [pitchData, setPitchData] = useState({
    name: workspace.act7PitchName || '',
    tagline: workspace.act7PitchTagline || '',
    audience: workspace.act7PitchAudience || '',
    usp1: initialUsps[0],
    usp2: initialUsps[1],
    usp3: initialUsps[2],
    script: workspace.act7PitchScript || '',
  });

  // Level 8 State (Emotion Behind Picture — 1 Classic + 5 Placement EQ Scenes)
  const [empathySceneIdx, setEmpathySceneIdx] = useState(0);
  const [empathyData, setEmpathyData] = useState({
    emotion: workspace.act8Emotion || '',
    situation: workspace.act8Situation || '',
    perspective: workspace.act8Perspective || '',
    response: workspace.act8Response || '',
  });

  // Level 9 State (Boardroom & Placement Case Turnaround — 1 Classic + 5 Placement Cases)
  const [caseSceneIdx, setCaseSceneIdx] = useState(0);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [activeClueId, setActiveClueId] = useState<string>(LEVEL9_CASE_SCENES[0].clues[0].id);
  const [boardroomProposal, setBoardroomProposal] = useState(workspace.act9Proposal || '');

  // Level 10 State (Grand Capstone — Original 6 + 5 Placement Vision Cards = 11)
  const [finaleDeckFilter, setFinaleDeckFilter] = useState<'all' | 'classic' | 'placement'>('all');
  const [finaleTheme, setFinaleTheme] = useState(workspace.act10Theme || '');
  const [finaleNotes, setFinaleNotes] = useState(workspace.act10Notes || '');

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setAct2Pitch(workspace.act2Pitch || '');
    setStoryTitle(workspace.act3StoryTitle || '');
    if (workspace.act3StoryBeats) {
      try {
        const parsed = JSON.parse(workspace.act3StoryBeats);
        if (Array.isArray(parsed) && parsed.length === 5) {
          setStoryBeats(parsed.map(String));
        } else {
          setStoryBeats(['', '', '', '', '']);
        }
      } catch {
        setStoryBeats(['', '', '', '', '']);
      }
    } else {
      setStoryBeats(['', '', '', '', '']);
    }
    setMemoryObserved(workspace.act4Observed || '');
    setMemoryMissing(workspace.act4Missing || '');
    setMemoryBeforeAfter(workspace.act4BeforeAfter || '');
    setCeoSolution(workspace.act5CeoSolution || '');
    const nextUsps = parsePitchUsps(workspace.act7PitchUsps);
    setPitchData({
      name: workspace.act7PitchName || '',
      tagline: workspace.act7PitchTagline || '',
      audience: workspace.act7PitchAudience || '',
      usp1: nextUsps[0],
      usp2: nextUsps[1],
      usp3: nextUsps[2],
      script: workspace.act7PitchScript || '',
    });
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
    setActionError(null);
  }, [activeLevel]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const flashNotice = (label: string) => {
    setSavedNotice(label);
    if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setSavedNotice(null), 2600);
  };

  const handleSaveAndComplete = async (
    levelNum: number,
    workspacePatch?: Partial<Omit<LearnerWorkspaceDoc, 'ownerId'>>
  ) => {
    setCompletingLevel(true);
    setActionError(null);
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
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to save level progress. Please try again.'
      );
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
    setActionError(null);
    try {
      await onAddPerspective(
        LEVEL1_PLACEMENT_SCENES[act1PicIdx].title,
        newPerspective.trim()
      );
      setNewPerspective('');
      flashNotice('Perspective added to Learner Wall');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to add perspective. Please try again.'
      );
    } finally {
      setSavingPerspective(false);
    }
  };

  const generateRandomPair = () => {
    const pool: { title: string; artwork: ArtworkId; photoKey: PhotoAssetKey }[] = [
      { title: 'ATS Resume Desk', artwork: 'notebook', photoKey: 'placement_resume_desk' },
      { title: 'DSA Whiteboard', artwork: 'keyboard', photoKey: 'placement_whiteboard_dsa' },
      { title: 'Offer Envelope', artwork: 'business', photoKey: 'placement_offer_envelope' },
      { title: 'Virtual Interview', artwork: 'interview', photoKey: 'placement_virtual_interview' },
      { title: 'GD Roundtable', artwork: 'teamwork', photoKey: 'placement_gd_roundtable' },
      { title: 'BI Dashboard', artwork: 'calculator', photoKey: 'placement_bi_analytics' },
      { title: 'Career Fair', artwork: 'business', photoKey: 'placement_career_fair' },
      { title: 'Code Review', artwork: 'keyboard', photoKey: 'placement_code_review' },
      { title: 'Hackathon Sprint', artwork: 'teamwork', photoKey: 'placement_hackathon_sprint' },
      { title: 'Mentor Coffee', artwork: 'coffee_cup', photoKey: 'placement_networking_coffee' },
      { title: 'Day-1 Desk', artwork: 'ladder', photoKey: 'placement_onboarding_day1' },
      { title: 'Broken Pencil', artwork: 'broken_pencil', photoKey: 'broken_pencil' },
      { title: 'Lighthouse', artwork: 'lighthouse', photoKey: 'lighthouse' },
      { title: 'Compass', artwork: 'compass', photoKey: 'compass' },
      { title: 'Mountain Peak', artwork: 'mountain_peak', photoKey: 'mountain_peak' },
      { title: 'Camera', artwork: 'camera', photoKey: 'camera' },
      { title: 'Titanium Clip', artwork: 'paperclip', photoKey: 'paperclip' },
    ];
    const a = pool[Math.floor(Math.random() * pool.length)];
    let b = pool[Math.floor(Math.random() * pool.length)];
    while (b.title === a.title) {
      b = pool[Math.floor(Math.random() * pool.length)];
    }
    setRandomPair({
      leftTitle: a.title,
      leftArtwork: a.artwork,
      leftPhotoKey: a.photoKey,
      rightTitle: b.title,
      rightArtwork: b.artwork,
      rightPhotoKey: b.photoKey,
    });
    setShowPairAnswer(false);
  };

  const activeAct1Scene = LEVEL1_PLACEMENT_SCENES[act1PicIdx] ?? LEVEL1_PLACEMENT_SCENES[0];
  const activePair = ALL_IMPOSSIBLE_PAIRS[pairIdx] ?? ALL_IMPOSSIBLE_PAIRS[0];
  const activeStoryCards =
    storyDeckMode === 'launch'
      ? LEVEL3_PLACEMENT_LAUNCH_CARDS
      : storyDeckMode === 'placement'
      ? LEVEL3_PLACEMENT_STAR_CARDS
      : STORY_ARCHITECT_CARDS;
  const activeMemoryScene = LEVEL4_FLASH_SCENES[memorySceneIdx] ?? LEVEL4_FLASH_SCENES[0];
  const activeProf = ALL_PROFESSION_CARDS[profIdx] ?? ALL_PROFESSION_CARDS[0];
  const activeAuditScene = LEVEL6_AUDIT_SCENES[auditSceneIdx] ?? LEVEL6_AUDIT_SCENES[0];
  const activeSell = ALL_SELL_OBJECTS[sellIdx] ?? ALL_SELL_OBJECTS[0];
  const activeEmpathyScene = LEVEL8_EMPATHY_SCENES[empathySceneIdx] ?? LEVEL8_EMPATHY_SCENES[0];
  const activeCaseScene = LEVEL9_CASE_SCENES[caseSceneIdx] ?? LEVEL9_CASE_SCENES[0];
  const activeClue =
    activeCaseScene.clues.find((c) => c.id === activeClueId) ?? activeCaseScene.clues[0];
  const activeMistake = activeAuditScene.mistakes.find((m) => m.id === selectedMistakeId);
  const sceneFoundMistakesCount = activeAuditScene.mistakes.filter((m) =>
    discoveredMistakes.includes(m.id)
  ).length;
  const sceneFoundCluesCount = activeCaseScene.clues.filter((c) =>
    discoveredClues.includes(c.id)
  ).length;
  const visibleFinaleCards =
    finaleDeckFilter === 'classic'
      ? FINALE_SIX_PICTURES.map((c) => ({ ...c, placementPillar: 'Core Leadership' }))
      : finaleDeckFilter === 'placement'
      ? LEVEL10_PLACEMENT_BONUS_CARDS
      : [
          ...FINALE_SIX_PICTURES.map((c) => ({ ...c, placementPillar: 'Core Leadership' })),
          ...LEVEL10_PLACEMENT_BONUS_CARDS,
        ];

  const activeLevelTheme = getLevelTheme(levelDef.level);

  return (
    <div className="space-y-6">
      {/* Horizontal Color-Coded Levels 1-10 Navigator */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-2 min-w-max">
          {LEVELS.map((item) => {
            const active = item.level === activeLevel;
            const done = progress.completedLevels.includes(item.level);
            const itemTheme = getLevelTheme(item.level);
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onSelectLevel(item.level)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  active
                    ? `${itemTheme.activeButton} font-semibold shadow-sm`
                    : done
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:border-emerald-500'
                    : `${itemTheme.softSurface} ${itemTheme.softBorder} text-slate-800 dark:text-slate-200 ${itemTheme.ringHover}`
                }`}
              >
                <span className={`font-mono font-bold ${active ? 'text-white' : itemTheme.text}`}>
                  L{String(item.level).padStart(2, '0')}
                </span>
                <span>{item.title.split('!')[0]}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Header Card with Distinct Level Color Accent */}
      <div className={`rounded-2xl border ${activeLevelTheme.softBorder} bg-white dark:bg-slate-900 overflow-hidden`}>
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${activeLevelTheme.topBar}`}
          aria-hidden="true"
        />
        <div className="p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className={`font-bold ${activeLevelTheme.text}`}>
                LEVEL {String(levelDef.level).padStart(2, '0')} · {activeLevelTheme.name.toUpperCase()}
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

        {actionError && (
          <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs font-medium text-red-700 dark:text-red-300">
            {actionError}
          </div>
        )}

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
              <span className={`font-mono font-bold ${activeLevelTheme.text} shrink-0`}>
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
      </div>

      {/* LEVEL 1: One Picture, 50 Perspectives (4 Classic + 5 Placement Images = 9) */}
      {activeLevel === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>{activeAct1Scene.placementContext}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>
                    Image {String(act1PicIdx + 1).padStart(2, '0')} of {LEVEL1_PLACEMENT_SCENES.length}
                  </span>
                </div>
              </div>
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                {activeAct1Scene.title}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5">
                {LEVEL1_PLACEMENT_SCENES.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAct1PicIdx(idx)}
                    title={p.title}
                    className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      idx === act1PicIdx
                        ? 'bg-blue-700 text-white font-semibold'
                        : p.isPlacementNew
                        ? 'border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 hover:border-indigo-400'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                    {p.isPlacementNew ? ' · Placement' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork
                id={activeAct1Scene.artwork}
                photoKey={activeAct1Scene.photoKey}
              />
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-950 dark:text-white">
                Placement Interview Prompt:
              </span>{' '}
              {activeAct1Scene.interviewAngle}
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

      {/* LEVEL 2: The Impossible Connection (6 Classic + 5 Placement Pairs = 11) */}
      {activeLevel === 2 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {ALL_IMPOSSIBLE_PAIRS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPairIdx(idx);
                    setRandomPair(null);
                    setShowPairAnswer(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    !randomPair && pairIdx === idx
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : p.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
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
                  <VisualArtwork
                    id={(randomPair ?? activePair).leftArtwork}
                    photoKey={(randomPair ?? activePair).leftPhotoKey}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  IMAGE B · {(randomPair ?? activePair).rightTitle}
                </div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <VisualArtwork
                    id={(randomPair ?? activePair).rightArtwork}
                    photoKey={(randomPair ?? activePair).rightPhotoKey}
                  />
                </div>
              </div>
            </div>
          )}

          {!randomPair && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>Sample Logical Connection</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span className="font-medium text-indigo-700 dark:text-indigo-400">
                    {activePair.placementRound}
                  </span>
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
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

      {/* LEVEL 3: Five-Picture Story Architect (Classic 5 + STAR 5 + PPO Launch 5 = 15 Images) */}
      {activeLevel === 3 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Choose from three 5-card visual decks: PPO Career Launch, Campus-to-Offer STAR, or Classic Leadership (15 total images).
            </div>
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStoryDeckMode('launch')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  storyDeckMode === 'launch'
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                PPO Launch Arc (+5 New)
              </button>
              <button
                type="button"
                onClick={() => setStoryDeckMode('placement')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  storyDeckMode === 'placement'
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Placement STAR Arc (5)
              </button>
              <button
                type="button"
                onClick={() => setStoryDeckMode('classic')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  storyDeckMode === 'classic'
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Classic Leadership (5)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {activeStoryCards.map((card, idx) => (
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
                  {'placementTip' in card && typeof card.placementTip === 'string' && card.placementTip && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {card.placementTip}
                    </p>
                  )}
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

      {/* LEVEL 4: What Is Missing? (15s Visual Flash — 1 Classic + 5 Placement Scenes = 6) */}
      {activeLevel === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {LEVEL4_FLASH_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
                    setMemorySceneIdx(idx);
                    setMemoryVisible(false);
                    setMemoryShowAnswers(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    idx === memorySceneIdx
                      ? 'bg-blue-700 border-blue-700 text-white font-semibold'
                      : scene.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {scene.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {activeMemoryScene.label}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeMemoryScene.promptHint}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMemoryHardMode((m) => !m)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
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
                  className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {memoryVisible ? 'Restart 15s Flash' : 'Flash Photo (15s)'}
                </button>
              </div>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              {memoryVisible ? (
                <VisualArtwork
                  id={activeMemoryScene.artwork}
                  photoKey={activeMemoryScene.photoKey}
                />
              ) : (
                <div className="w-full h-full bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <EyeOff className="w-8 h-8 text-blue-400" />
                  <div className="font-display text-lg font-semibold text-white">
                    Photo Hidden — Recall {activeMemoryScene.label}
                  </div>
                  <p className="text-xs text-slate-400 max-w-md">
                    Click &ldquo;Flash Photo (15s)&rdquo; to reveal this scene for 15 seconds, then list every detail you noticed and what placement-critical item is missing.
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
                  Visual Audit Key — {activeMemoryScene.label} ({memoryHardMode ? '10' : '6'} Items)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {(memoryHardMode
                    ? activeMemoryScene.hardItems
                    : activeMemoryScene.standardItems
                  ).map((obj) => (
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

      {/* LEVEL 5: Picture to Profession + CEO Mindset (6 Classic + 5 Placement Roles = 11) */}
      {activeLevel === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {ALL_PROFESSION_CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    setProfIdx(idx);
                    setProfRevealed(false);
                    setShowCeoSample(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    idx === profIdx
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : card.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {card.objectName}
                </button>
              ))}
            </div>

            <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork id={activeProf.artwork} photoKey={activeProf.photoKey} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span>Connected Placement Role</span>
                  {activeProf.targetCompanies && (
                    <>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{activeProf.targetCompanies}</span>
                    </>
                  )}
                </div>
                <div className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                  {profRevealed ? activeProf.profession : 'Guess the role first, then reveal'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfRevealed((r) => !r)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
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

      {/* LEVEL 6: Workplace & Placement Detective (1 Classic + 5 Placement Scenes = 6) */}
      {activeLevel === 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {LEVEL6_AUDIT_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    setAuditSceneIdx(idx);
                    setSelectedMistakeId(null);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    idx === auditSceneIdx
                      ? 'bg-blue-700 border-blue-700 text-white font-semibold'
                      : scene.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {scene.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-display text-base font-bold text-slate-950 dark:text-white">
                  {activeAuditScene.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {activeAuditScene.subtitle}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {sceneFoundMistakesCount} / {activeAuditScene.mistakes.length} Scene · {discoveredMistakes.length} Total
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const sceneIds = new Set(activeAuditScene.mistakes.map((m) => m.id));
                    setDiscoveredMistakes((prev) => prev.filter((id) => !sceneIds.has(id)));
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
                photoKey={activeAuditScene.photoKey}
                customMistakes={activeAuditScene.mistakes}
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
                Audit Log ({sceneFoundMistakesCount}/{activeAuditScene.mistakes.length})
              </h2>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {activeAuditScene.mistakes.map((m) => {
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

      {/* LEVEL 7: Sell Me This Picture! (3 Classic + 5 Placement Pitches = 8) */}
      {activeLevel === 7 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {ALL_SELL_OBJECTS.map((obj, idx) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => {
                    setSellIdx(idx);
                    setShowSellSample(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    idx === sellIdx
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : obj.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
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
              {showSellSample ? 'Hide Pitch Reference' : `Reveal Reference (${activeSell.sampleName})`}
            </button>

            {showSellSample && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 text-xs">
                <div className="font-display font-bold text-sm text-slate-950 dark:text-white">
                  {activeSell.sampleName} — {activeSell.sampleTagline}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target Audience: {activeSell.sampleAudience}
                </div>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                  {activeSell.sampleUsps.map((usp, i) => (
                    <li key={i}>{usp}</li>
                  ))}
                </ul>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-800">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  USP 01 (Value Hook)
                </label>
                <input
                  type="text"
                  maxLength={180}
                  value={pitchData.usp1}
                  onChange={(e) => setPitchData({ ...pitchData, usp1: e.target.value })}
                  placeholder="First standout benefit"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  USP 02 (Differentiator)
                </label>
                <input
                  type="text"
                  maxLength={180}
                  value={pitchData.usp2}
                  onChange={(e) => setPitchData({ ...pitchData, usp2: e.target.value })}
                  placeholder="Why it beats alternatives"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  USP 03 (Outcome)
                </label>
                <input
                  type="text"
                  maxLength={180}
                  value={pitchData.usp3}
                  onChange={(e) => setPitchData({ ...pitchData, usp3: e.target.value })}
                  placeholder="Measurable buyer result"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
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
                  act7PitchUsps: JSON.stringify([
                    pitchData.usp1.trim(),
                    pitchData.usp2.trim(),
                    pitchData.usp3.trim(),
                  ]).slice(0, 600),
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

      {/* LEVEL 8: Emotion Behind the Picture (1 Classic + 5 Placement EQ Scenes = 6) */}
      {activeLevel === 8 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {LEVEL8_EMPATHY_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setEmpathySceneIdx(idx)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    idx === empathySceneIdx
                      ? 'bg-blue-700 border-blue-700 text-white font-semibold'
                      : scene.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {scene.shortLabel}
                </button>
              ))}
            </div>

            <div className="font-display text-base font-bold text-slate-950 dark:text-white">
              {activeEmpathyScene.title}
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork
                id={activeEmpathyScene.artwork}
                photoKey={activeEmpathyScene.photoKey}
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                {activeEmpathyScene.cuePrompt}
              </p>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium">
                {activeEmpathyScene.placementQuestion}
              </div>
            </div>
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

      {/* LEVEL 9: Corporate Boardroom & Placement Case Turnaround (1 Classic + 5 Placement Cases = 6) */}
      {activeLevel === 9 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {LEVEL9_CASE_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    setCaseSceneIdx(idx);
                    setActiveClueId(scene.clues[0].id);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    idx === caseSceneIdx
                      ? 'bg-blue-700 border-blue-700 text-white font-semibold'
                      : scene.isPlacementNew
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {scene.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-display text-base font-bold text-slate-950 dark:text-white">
                  {activeCaseScene.title}
                </div>
                <span className="text-slate-600 dark:text-slate-300">
                  {activeCaseScene.subtitle}
                </span>
              </div>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums shrink-0">
                {sceneFoundCluesCount} / {activeCaseScene.clues.length} Clues Audited
              </span>
            </div>
            <div className="aspect-[16/9] w-full">
              <VisualArtwork
                id="boardroom_decline"
                photoKey={activeCaseScene.photoKey}
                customClues={activeCaseScene.clues}
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
                placeholder={activeCaseScene.placeholderBrief}
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

      {/* LEVEL 10: Grand Capstone Synthesis (6 Classic + 10 Placement Vision Cards = 16) */}
      {activeLevel === 10 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Unite your leadership and placement journey across 6 classic visuals and {LEVEL10_PLACEMENT_BONUS_CARDS.length} placement mastery visuals.
            </div>
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setFinaleDeckFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  finaleDeckFilter === 'all'
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All {FINALE_SIX_PICTURES.length + LEVEL10_PLACEMENT_BONUS_CARDS.length} Vision Cards
              </button>
              <button
                type="button"
                onClick={() => setFinaleDeckFilter('placement')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  finaleDeckFilter === 'placement'
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Placement Mastery ({LEVEL10_PLACEMENT_BONUS_CARDS.length})
              </button>
              <button
                type="button"
                onClick={() => setFinaleDeckFilter('classic')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  finaleDeckFilter === 'classic'
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Classic 6 Cards
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visibleFinaleCards.map((card, idx) => (
              <div
                key={card.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>CARD {String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                  <VisualArtwork id={card.artwork} photoKey={card.photoKey} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {card.placementPillar}
                  </div>
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
                  Example theme: &ldquo;From ATS Resume &amp; DSA Whiteboard to Sealed Offer &amp; Boardroom Leadership.&rdquo;
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
                  placeholder="Enter your unifying theme connecting your selected placement & leadership photographs..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  3-Part Placement &amp; Leadership Keynote Narrative ({visibleFinaleCards.length} Active Cards)
                </label>
                <textarea
                  rows={5}
                  value={finaleNotes}
                  onChange={(e) => setFinaleNotes(e.target.value)}
                  placeholder="Opening Hook (ATS Resume & Prep Desk) -> Core Turning Point (DSA Whiteboard, GD Roundtable & Virtual Presence) -> Career Resolution (Sealed Offer & Boardroom Vision)..."
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
