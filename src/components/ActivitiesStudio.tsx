import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  ACTIVITIES,
  ACTIVITY_1_DEFAULT_INTERPRETATIONS,
  ArtworkId,
  BOARDROOM_CLUES,
  FINALE_SIX_PICTURES,
  IMPOSSIBLE_PAIRS,
  MEMORY_OBJECTS_HARD,
  MEMORY_OBJECTS_STANDARD,
  PROFESSION_CARDS,
  SELL_OBJECTS,
  STORY_RELAY_CARDS,
  WORKPLACE_MISTAKES,
} from '../data/workshopData';
import { ConnectionPostDoc, LearnerWorkspaceDoc } from '../services/firestoreService';
import { StageTimer } from './StageTimer';
import { VisualArtwork } from './VisualArtwork';

interface ActivitiesStudioProps {
  activeActivityNumber: number;
  onSelectActivity: (num: number) => void;
  onGoToChampionship: () => void;
  sharedPerspectives: ConnectionPostDoc[];
  onAddPerspective: (sceneTitle: string, text: string) => Promise<void>;
  workspace: LearnerWorkspaceDoc;
  onSaveWorkspace: (patch: Partial<Omit<LearnerWorkspaceDoc, 'ownerId'>>) => Promise<void>;
}

const ACT1_PICTURES: { title: string; artwork: ArtworkId }[] = [
  { title: 'A Person Standing at a Crossroads', artwork: 'crossroads' },
  { title: 'A Bridge Over Troubled Water', artwork: 'bridge' },
  { title: 'A Broken Pencil', artwork: 'broken_pencil' },
  { title: 'A Traffic Signal', artwork: 'traffic_signal' },
];

export const ActivitiesStudio: React.FC<ActivitiesStudioProps> = ({
  activeActivityNumber,
  onSelectActivity,
  onGoToChampionship,
  sharedPerspectives,
  onAddPerspective,
  workspace,
  onSaveWorkspace,
}) => {
  const activity =
    ACTIVITIES.find((a) => a.number === activeActivityNumber) ?? ACTIVITIES[0];

  // Activity 1 State
  const [act1PicIdx, setAct1PicIdx] = useState(0);
  const [newPerspective, setNewPerspective] = useState('');
  const [savingPerspective, setSavingPerspective] = useState(false);

  const combinedPerspectives = [
    ...ACTIVITY_1_DEFAULT_INTERPRETATIONS.map((text, idx) => ({
      id: `default-${idx}`,
      text,
      authorName: 'Sample',
    })),
    ...sharedPerspectives.map((p) => ({
      id: p.id,
      text: p.title,
      authorName: p.authorName,
    })),
  ];

  // Activity 2 State
  const [pairIdx, setPairIdx] = useState(0);
  const [randomPair, setRandomPair] = useState<{
    leftTitle: string;
    leftArtwork: ArtworkId;
    rightTitle: string;
    rightArtwork: ArtworkId;
  } | null>(null);
  const [showPairAnswer, setShowPairAnswer] = useState(false);
  const [act2Pitch, setAct2Pitch] = useState(workspace.act2Pitch || '');

  // Activity 3 State
  const [relayStep, setRelayStep] = useState(1);
  const [relayBeats, setRelayBeats] = useState<Record<number, string>>({});
  const [relayTitle, setRelayTitle] = useState('');
  const [relayChecklist, setRelayChecklist] = useState<string[]>([]);

  // Activity 4 State
  const [memoryVisible, setMemoryVisible] = useState(false);
  const [memoryHardMode, setMemoryHardMode] = useState(false);
  const [memoryShowAnswers, setMemoryShowAnswers] = useState(false);
  const [memoryObserved, setMemoryObserved] = useState(workspace.act4Observed || '');
  const [memoryMissing, setMemoryMissing] = useState(workspace.act4Missing || '');
  const [memoryBeforeAfter, setMemoryBeforeAfter] = useState(workspace.act4BeforeAfter || '');

  // Activity 5 State
  const [profIdx, setProfIdx] = useState(0);
  const [profRevealed, setProfRevealed] = useState(false);
  const [ceoSolution, setCeoSolution] = useState(workspace.act5CeoSolution || '');
  const [showCeoSample, setShowCeoSample] = useState(false);

  // Activity 6 State
  const [discoveredMistakes, setDiscoveredMistakes] = useState<string[]>([]);
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);

  // Activity 7 State
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

  // Activity 8 State
  const [empathyData, setEmpathyData] = useState({
    emotion: workspace.act8Emotion || '',
    situation: workspace.act8Situation || '',
    perspective: workspace.act8Perspective || '',
    response: workspace.act8Response || '',
  });

  // Activity 9 State
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([BOARDROOM_CLUES[0].id]);
  const [activeClueId, setActiveClueId] = useState<string>(BOARDROOM_CLUES[0].id);
  const [boardroomProposal, setBoardroomProposal] = useState(workspace.act9Proposal || '');

  // Activity 10 State
  const [finaleCards, setFinaleCards] = useState(FINALE_SIX_PICTURES);
  const [finaleTheme, setFinaleTheme] = useState(workspace.act10Theme || '');
  const [finaleNotes, setFinaleNotes] = useState(workspace.act10Notes || '');
  const [workspaceSavedMsg, setWorkspaceSavedMsg] = useState<string | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!workspace.ownerId || hydratedRef.current) return;
    hydratedRef.current = true;
    const usps = (workspace.act7PitchUsps || '').split('|').map((s) => s.trim());
    setAct2Pitch(workspace.act2Pitch || '');
    setMemoryObserved(workspace.act4Observed || '');
    setMemoryMissing(workspace.act4Missing || '');
    setMemoryBeforeAfter(workspace.act4BeforeAfter || '');
    setCeoSolution(workspace.act5CeoSolution || '');
    setPitchData({
      name: workspace.act7PitchName || '',
      tagline: workspace.act7PitchTagline || '',
      audience: workspace.act7PitchAudience || '',
      usp1: usps[0] || '',
      usp2: usps[1] || '',
      usp3: usps[2] || '',
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

  const persistDraft = async (patch: Partial<Omit<LearnerWorkspaceDoc, 'ownerId'>>) => {
    await onSaveWorkspace(patch);
    setWorkspaceSavedMsg('Saved to your verified account');
    window.setTimeout(() => setWorkspaceSavedMsg(null), 2200);
  };

  const handleAddPerspective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerspective.trim() || savingPerspective) return;
    setSavingPerspective(true);
    try {
      await onAddPerspective(ACT1_PICTURES[act1PicIdx].title, newPerspective.trim());
      setNewPerspective('');
    } finally {
      setSavingPerspective(false);
    }
  };

  const handleShufflePair = () => {
    const pool: { title: string; artwork: ArtworkId }[] = [
      { title: 'Apple', artwork: 'apple' },
      { title: 'Rocket', artwork: 'rocket' },
      { title: 'Hourglass', artwork: 'hourglass' },
      { title: 'Exam', artwork: 'exam' },
      { title: 'Mirror', artwork: 'mirror' },
      { title: 'Umbrella', artwork: 'umbrella' },
      { title: 'Camera', artwork: 'camera' },
      { title: 'Puzzle', artwork: 'puzzle' },
      { title: 'Ladder', artwork: 'ladder' },
      { title: 'Broken Pencil', artwork: 'broken_pencil' },
    ];
    const i = Math.floor(Math.random() * pool.length);
    let j = Math.floor(Math.random() * pool.length);
    if (j === i) j = (i + 1) % pool.length;
    setRandomPair({
      leftTitle: pool[i].title,
      leftArtwork: pool[i].artwork,
      rightTitle: pool[j].title,
      rightArtwork: pool[j].artwork,
    });
    setShowPairAnswer(false);
  };

  const toggleRelayCheck = (item: string) => {
    setRelayChecklist((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleInspectMistake = (id: string) => {
    setSelectedMistakeId(id);
    setDiscoveredMistakes((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleInspectClue = (id: string) => {
    setActiveClueId(id);
    setDiscoveredClues((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const shuffleFinaleCards = () => {
    const pool: { id: string; title: string; artwork: ArtworkId }[] = [
      ...FINALE_SIX_PICTURES,
      { id: 'f7', title: 'Lighthouse', artwork: 'lighthouse' },
      { id: 'f8', title: 'Traffic Signal', artwork: 'traffic_signal' },
      { id: 'f9', title: 'Rocket', artwork: 'rocket' },
      { id: 'f10', title: 'Mirror', artwork: 'mirror' },
      { id: 'f11', title: 'Tree', artwork: 'tree' },
    ];
    const copy = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setFinaleCards(copy);
  };

  const renderTimerForActivity = () => {
    if (activity.number === 10) {
      return (
        <StageTimer
          initialSeconds={300}
          label="Grand Finale Phase Timer"
          presets={[
            { label: '5 min Prep', seconds: 300 },
            { label: '2 min Presentation', seconds: 120 },
            { label: '1 min Q&A', seconds: 60 },
          ]}
        />
      );
    }

    if (activity.number === 4) {
      return (
        <StageTimer
          initialSeconds={15}
          label="15-Second Visual Flash"
          onStart={() => {
            setMemoryVisible(true);
            setMemoryShowAnswers(false);
          }}
          onExpire={() => {
            setMemoryVisible(false);
          }}
          onReset={() => {
            setMemoryVisible(false);
          }}
        />
      );
    }

    return (
      <StageTimer
        initialSeconds={activity.timerSeconds}
        label={`Activity ${activity.number} Timer`}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Activity Selector Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {ACTIVITIES.map((act) => {
            const active = act.number === activity.number;
            return (
              <button
                key={act.number}
                type="button"
                onClick={() => onSelectActivity(act.number)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="font-mono mr-1.5">{String(act.number).padStart(2, '0')}</span>
                <span>{act.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono">Activity {String(activity.number).padStart(2, '0')} of 10</span>
            <span aria-hidden="true">·</span>
            <span>{activity.subtitle}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{activity.durationLabel}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            {activity.title}
          </h1>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
          <span className="font-semibold text-slate-900 dark:text-white">Learning Outcome: </span>
          {activity.learningOutcome}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (Stage Left 62% · Control & Learner Deck Right 38%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT ZONE: INTERACTIVE STAGE */}
        <div className="lg:col-span-7 space-y-4">
          {/* Activity 1 Stage */}
          {activity.number === 1 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  {ACT1_PICTURES[act1PicIdx].title}
                </div>
                <div className="flex items-center gap-1.5">
                  {ACT1_PICTURES.map((p, idx) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setAct1PicIdx(idx)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                        idx === act1PicIdx
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Scene {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                <VisualArtwork id={ACT1_PICTURES[act1PicIdx].artwork} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Live Classroom Perspectives</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {combinedPerspectives.length} / 50 captured
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {combinedPerspectives.map((item, idx) => (
                    <div
                      key={item.id}
                      className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-slate-400 shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>{item.text}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                        {item.authorName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Activity 2 Stage */}
          {activity.number === 2 && (() => {
            const base = IMPOSSIBLE_PAIRS[pairIdx];
            const leftTitle = randomPair ? randomPair.leftTitle : base.leftTitle;
            const leftArtwork = randomPair ? randomPair.leftArtwork : base.leftArtwork;
            const rightTitle = randomPair ? randomPair.rightTitle : base.rightTitle;
            const rightArtwork = randomPair ? randomPair.rightArtwork : base.rightArtwork;

            return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {IMPOSSIBLE_PAIRS.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setRandomPair(null);
                          setPairIdx(idx);
                          setShowPairAnswer(false);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                          !randomPair && idx === pairIdx
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Pair {idx + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleShufflePair}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Surprise Pair</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <VisualArtwork id={leftArtwork} />
                    </div>
                    <div className="text-center font-display font-semibold text-base text-slate-900 dark:text-white">
                      {leftTitle}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <VisualArtwork id={rightArtwork} />
                    </div>
                    <div className="text-center font-display font-semibold text-base text-slate-900 dark:text-white">
                      {rightTitle}
                    </div>
                  </div>
                </div>

                {!randomPair && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Possible Connection
                      </div>
                      <div className="font-display font-semibold text-base text-slate-900 dark:text-white">
                        {showPairAnswer ? base.possibleConnection : 'Hidden — Challenge Speakers in 45s'}
                      </div>
                      {showPairAnswer && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {base.reasoningHint}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPairAnswer((s) => !s)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      {showPairAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPairAnswer ? 'Hide Hint' : 'Reveal Sample Link'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Activity 3 Stage */}
          {activity.number === 3 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Sequential Team Relay · Click a speaker turn to spotlight their card
                </div>
                <div className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                  Speaker {relayStep} of 6
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STORY_RELAY_CARDS.slice(0, 5).map((card, idx) => {
                  const stepNum = idx + 1;
                  const unlocked = stepNum <= relayStep;
                  const active = stepNum === relayStep;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setRelayStep(stepNum)}
                      className={`text-left rounded-xl border p-2.5 transition-colors cursor-pointer space-y-2 ${
                        active
                          ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        Student {stepNum}
                      </div>
                      <div className="aspect-[3/2] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900">
                        {unlocked ? (
                          <VisualArtwork id={card.artwork} />
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Locked Card</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {unlocked ? card.title : `Picture ${stepNum}`}
                      </div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setRelayStep(6)}
                  className={`text-left rounded-xl border p-2.5 transition-colors cursor-pointer flex flex-col justify-between ${
                    relayStep === 6
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Student 6 (Final)
                  </div>
                  <div className="py-4 text-center space-y-1">
                    <div className="font-display font-semibold text-sm text-slate-900 dark:text-white">
                      Name the Story
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Deliver Conclusion &amp; Title
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 truncate">
                    {relayTitle || 'Awaiting title...'}
                  </div>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Story Arc:</span>
                {['Beginning', 'Conflict', 'Solution', 'Conclusion'].map((arc) => {
                  const checked = relayChecklist.includes(arc);
                  return (
                    <button
                      key={arc}
                      type="button"
                      onClick={() => toggleRelayCheck(arc)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                        checked
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {checked ? `✓ ${arc}` : arc}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity 4 Stage (15-second flash curtain) */}
          {activity.number === 4 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMemoryHardMode(false)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                      !memoryHardMode
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Standard (8 Objects)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemoryHardMode(true)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                      memoryHardMode
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Increased Difficulty (13 Objects)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMemoryVisible((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {memoryVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{memoryVisible ? 'Hide Scene Now' : 'Peek Scene'}</span>
                </button>
              </div>

              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                {memoryVisible ? (
                  <VisualArtwork id="memory_scene" memoryHardMode={memoryHardMode} />
                ) : (
                  <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="font-display text-xl sm:text-2xl font-semibold">
                      Picture Hidden for Memory Recall
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                      Press Start on the 15-second timer to flash the study desk scene to the class. When 15 seconds finish, it hides automatically!
                    </p>
                    <button
                      type="button"
                      onClick={() => setMemoryShowAnswers((s) => !s)}
                      className="px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      {memoryShowAnswers ? 'Hide Verification Key' : 'Check Observed Objects Key'}
                    </button>
                  </div>
                )}
              </div>

              {memoryShowAnswers && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Verified Scene Inventory ({memoryHardMode ? '13' : '8'} objects)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {(memoryHardMode ? MEMORY_OBJECTS_HARD : MEMORY_OBJECTS_STANDARD).map((obj) => (
                      <div key={obj.id} className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${obj.isMissingHint ? 'text-amber-600' : 'text-emerald-600'}`} />
                        <span className={obj.isMissingHint ? 'font-semibold text-amber-800 dark:text-amber-300' : ''}>
                          {obj.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity 5 Stage */}
          {activity.number === 5 && (() => {
            const card = PROFESSION_CARDS[profIdx];
            return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PROFESSION_CARDS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProfIdx(idx);
                        setProfRevealed(false);
                        setShowCeoSample(false);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                        idx === profIdx
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.objectName}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                  <div className="aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <VisualArtwork id={card.artwork} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Everyday Object</div>
                      <div className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                        {card.objectName}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Connected Profession</span>
                        <button
                          type="button"
                          onClick={() => setProfRevealed((r) => !r)}
                          className="text-xs font-semibold text-blue-700 dark:text-blue-400 cursor-pointer"
                        >
                          {profRevealed ? 'Hide' : 'Reveal'}
                        </button>
                      </div>
                      <div className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                        {profRevealed ? card.profession : 'Ask learners first...'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 space-y-1.5">
                      <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        The CEO Twist
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                        {card.ceoPrompt}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCeoSample((s) => !s)}
                        className="text-xs font-semibold text-blue-700 dark:text-blue-400 pt-1 cursor-pointer"
                      >
                        {showCeoSample ? 'Hide Example Strategy' : 'View Example CEO Strategy'}
                      </button>
                      {showCeoSample && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                          {card.exampleCeoIdea}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Activity 6 Stage (Interactive Workplace Detective) */}
          {activity.number === 6 && (() => {
            const activeMistake = WORKPLACE_MISTAKES.find((m) => m.id === selectedMistakeId);
            return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Click the numbered markers inside the office scene to uncover all 10 deliberate mistakes.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {discoveredMistakes.length} / 10 Found
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscoveredMistakes([]);
                        setSelectedMistakeId(null);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                <VisualArtwork
                  id="workplace_detective"
                  discoveredMistakes={discoveredMistakes}
                  onSelectMistake={handleInspectMistake}
                />

                {activeMistake ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      Spot #{activeMistake.number} · {activeMistake.category}
                    </div>
                    <div className="font-display font-semibold text-base text-slate-900 dark:text-white">
                      {activeMistake.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {activeMistake.detail}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Select any numbered circle in the workplace diagram above to inspect the hazard or etiquette issue.
                  </div>
                )}
              </div>
            );
          })()}

          {/* Activity 7 Stage */}
          {activity.number === 7 && (() => {
            const item = SELL_OBJECTS[sellIdx];
            return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {SELL_OBJECTS.map((obj, idx) => (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => {
                          setSellIdx(idx);
                          setShowSellSample(false);
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap ${
                          idx === sellIdx
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {obj.objectName}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSellSample((s) => !s)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{showSellSample ? 'Hide Example' : 'Show ConnectPro Example'}</span>
                  </button>
                </div>

                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <VisualArtwork id={item.artwork} />
                </div>

                {showSellSample && (
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
                    <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                      {item.sampleName} — &ldquo;{item.sampleTagline}&rdquo;
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Target Audience:</span> {item.sampleAudience}
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300">
                      {item.sampleUsps.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                    <p className="italic text-slate-800 dark:text-slate-200 pt-1">
                      &ldquo;{item.samplePitch}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Activity 8 Stage */}
          {activity.number === 8 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <VisualArtwork id="emotion_scene" />
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white">Facilitation Rule: </span>
                {activity.highlightRule}
              </div>
            </div>
          )}

          {/* Activity 9 Stage (Interactive Boardroom Clue Explorer) */}
          {activity.number === 9 && (() => {
            const currentClue =
              BOARDROOM_CLUES.find((c) => c.id === activeClueId) ?? BOARDROOM_CLUES[0];
            return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Case: A company experienced a sudden 40% decline in sales. Inspect all 5 clue buttons.
                  </div>
                  <div className="font-mono tabular-nums text-xs font-semibold text-blue-700 dark:text-blue-400">
                    {discoveredClues.length} / 5 Clues Examined
                  </div>
                </div>

                <VisualArtwork
                  id="boardroom_decline"
                  discoveredClues={discoveredClues}
                  onSelectClue={handleInspectClue}
                />

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    Clue Dimension: {currentClue.dimension}
                  </div>
                  <div className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    {currentClue.headline}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {currentClue.visualEvidence}
                  </p>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 pt-1">
                    Boardroom Question: {currentClue.strategicQuestion}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Activity 10 Stage (Six Pictures, One Vision) */}
          {activity.number === 10 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    Grand Finale Deck · Six Unrelated Pictures
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Example Theme: &ldquo;The Journey of an Engineer – From Classroom to Boardroom.&rdquo;
                  </div>
                </div>
                <button
                  type="button"
                  onClick={shuffleFinaleCards}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Deal New 6 Cards</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {finaleCards.map((card, i) => (
                  <div
                    key={`${card.id}-${i}`}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 space-y-2"
                  >
                    <div className="aspect-[3/2] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                      <VisualArtwork id={card.artwork} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {card.title}
                      </span>
                      <span className="font-mono text-slate-400">0{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ZONE: CONTROL, TIMER & LEARNER RESPONSE DECK */}
        <div className="lg:col-span-5 space-y-4">
          {renderTimerForActivity()}

          {/* Rules & Instructions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              How This Activity Runs
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4 leading-relaxed">
              {activity.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {activity.highlightRule && (
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                Key Challenge: {activity.highlightRule}
              </div>
            )}
          </div>

          {/* Activity-Specific Learner Interactive Workspace */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Learner &amp; Team Response Pad
            </div>

            {activity.number === 1 && (
              <form onSubmit={handleAddPerspective} className="space-y-2.5">
                <label className="block text-xs text-slate-600 dark:text-slate-400">
                  Add a new student interpretation (aim for 10+ unique lenses):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPerspective}
                    onChange={(e) => setNewPerspective(e.target.value)}
                    placeholder="e.g., Courage to choose an unconventional path"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>
            )}

            {activity.number === 2 && (
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-400">
                  Draft your 45-second logical-creative bridge:
                </label>
                <textarea
                  rows={4}
                  value={act2Pitch}
                  onChange={(e) => setAct2Pitch(e.target.value)}
                  placeholder="How do these two unrelated images connect logically?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            {activity.number === 3 && (
              <div className="space-y-2.5">
                <label className="block text-xs text-slate-600 dark:text-slate-400">
                  {relayStep <= 5
                    ? `Speaker ${relayStep} Story Contribution (${STORY_RELAY_CARDS[relayStep - 1].title}):`
                    : 'Speaker 6 Story Title & Final Moral:'}
                </label>
                {relayStep <= 5 ? (
                  <textarea
                    rows={3}
                    value={relayBeats[relayStep] || ''}
                    onChange={(e) =>
                      setRelayBeats((prev) => ({ ...prev, [relayStep]: e.target.value }))
                    }
                    placeholder={`Enter Speaker ${relayStep}'s story beat...`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <input
                    type="text"
                    value={relayTitle}
                    onChange={(e) => setRelayTitle(e.target.value)}
                    placeholder="Enter the team's story title..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}
                <div className="flex justify-between pt-1">
                  <button
                    type="button"
                    disabled={relayStep === 1}
                    onClick={() => setRelayStep((s) => Math.max(1, s - 1))}
                    className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium disabled:opacity-40 cursor-pointer"
                  >
                    Previous Speaker
                  </button>
                  <button
                    type="button"
                    disabled={relayStep === 6}
                    onClick={() => setRelayStep((s) => Math.min(6, s + 1))}
                    className="px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    Next Speaker
                  </button>
                </div>
              </div>
            )}

            {activity.number === 4 && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={memoryObserved}
                  onChange={(e) => setMemoryObserved(e.target.value)}
                  placeholder="1. What objects did you observe?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  value={memoryMissing}
                  onChange={(e) => setMemoryMissing(e.target.value)}
                  placeholder="2. What was missing? (e.g., charger cable, bottle)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <textarea
                  rows={2}
                  value={memoryBeforeAfter}
                  onChange={(e) => setMemoryBeforeAfter(e.target.value)}
                  placeholder="3–4. What happened before this photo, and what happens next?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>
            )}

            {activity.number === 5 && (
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-400">
                  Your CEO Business Solution for {PROFESSION_CARDS[profIdx].objectName}:
                </label>
                <textarea
                  rows={4}
                  value={ceoSolution}
                  onChange={(e) => setCeoSolution(e.target.value)}
                  placeholder="As CEO, how would you apply this object as a metaphor or tool to solve a company challenge?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>
            )}

            {activity.number === 6 && (
              <div className="space-y-2">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Audit Category Coverage ({discoveredMistakes.length} / 10):
                </div>
                {(
                  [
                    'Workplace safety violations',
                    'Communication failures',
                    'Time management problems',
                    'Professional etiquette issues',
                    'Security risks',
                  ] as const
                ).map((cat) => {
                  const totalInCat = WORKPLACE_MISTAKES.filter((m) => m.category === cat).length;
                  const foundInCat = WORKPLACE_MISTAKES.filter(
                    (m) => m.category === cat && discoveredMistakes.includes(m.id)
                  ).length;
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {foundInCat}/{totalInCat}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activity.number === 7 && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={pitchData.name}
                  onChange={(e) => setPitchData({ ...pitchData, name: e.target.value })}
                  placeholder="Product Name (e.g., ConnectPro)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  value={pitchData.tagline}
                  onChange={(e) => setPitchData({ ...pitchData, tagline: e.target.value })}
                  placeholder="Tagline"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  value={pitchData.audience}
                  onChange={(e) => setPitchData({ ...pitchData, audience: e.target.value })}
                  placeholder="Target Audience"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <div className="grid grid-cols-1 gap-1.5">
                  <input
                    type="text"
                    value={pitchData.usp1}
                    onChange={(e) => setPitchData({ ...pitchData, usp1: e.target.value })}
                    placeholder="USP 1"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <input
                    type="text"
                    value={pitchData.usp2}
                    onChange={(e) => setPitchData({ ...pitchData, usp2: e.target.value })}
                    placeholder="USP 2"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <input
                    type="text"
                    value={pitchData.usp3}
                    onChange={(e) => setPitchData({ ...pitchData, usp3: e.target.value })}
                    placeholder="USP 3"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                </div>
                <textarea
                  rows={2}
                  value={pitchData.script}
                  onChange={(e) => setPitchData({ ...pitchData, script: e.target.value })}
                  placeholder="30-second sales pitch..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>
            )}

            {activity.number === 8 && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={empathyData.emotion}
                  onChange={(e) => setEmpathyData({ ...empathyData, emotion: e.target.value })}
                  placeholder="1. Possible emotion & why..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  value={empathyData.situation}
                  onChange={(e) => setEmpathyData({ ...empathyData, situation: e.target.value })}
                  placeholder="2. The situation..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <input
                  type="text"
                  value={empathyData.perspective}
                  onChange={(e) => setEmpathyData({ ...empathyData, perspective: e.target.value })}
                  placeholder="3. The person's perspective..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <textarea
                  rows={2}
                  value={empathyData.response}
                  onChange={(e) => setEmpathyData({ ...empathyData, response: e.target.value })}
                  placeholder="4. What would you say to this person?"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>
            )}

            {activity.number === 9 && (
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-400">
                  2-Minute Boardroom Turnaround Proposal:
                </label>
                <textarea
                  rows={4}
                  value={boardroomProposal}
                  onChange={(e) => setBoardroomProposal(e.target.value)}
                  placeholder="Connect your findings across Customers, Employees, Product quality, Marketing, and Competition into a decisive recovery plan..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>
            )}

            {activity.number === 10 && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={finaleTheme}
                  onChange={(e) => setFinaleTheme(e.target.value)}
                  placeholder="Unifying Theme Title..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <textarea
                  rows={3}
                  value={finaleNotes}
                  onChange={(e) => setFinaleNotes(e.target.value)}
                  placeholder="Outline how all 6 pictures flow through your team's narrative..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <button
                  type="button"
                  onClick={onGoToChampionship}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Score Teams in Championship Rubric</span>
                </button>
              </div>
            )}

            {[2, 4, 5, 7, 8, 9, 10].includes(activity.number) && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {workspaceSavedMsg || ''}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    persistDraft({
                      act2Pitch,
                      act4Observed: memoryObserved,
                      act4Missing: memoryMissing,
                      act4BeforeAfter: memoryBeforeAfter,
                      act5CeoSolution: ceoSolution,
                      act7PitchName: pitchData.name,
                      act7PitchTagline: pitchData.tagline,
                      act7PitchAudience: pitchData.audience,
                      act7PitchUsps: [pitchData.usp1, pitchData.usp2, pitchData.usp3]
                        .filter(Boolean)
                        .join(' | '),
                      act7PitchScript: pitchData.script,
                      act8Emotion: empathyData.emotion,
                      act8Situation: empathyData.situation,
                      act8Perspective: empathyData.perspective,
                      act8Response: empathyData.response,
                      act9Proposal: boardroomProposal,
                      act10Theme: finaleTheme,
                      act10Notes: finaleNotes,
                    })
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  Save My Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
