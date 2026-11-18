import React, { useState } from 'react';
import {
  Activity,
  Award,
  Briefcase,
  Calculator,
  Camera,
  Check,
  Compass,
  FileText,
  GitBranch,
  Hourglass,
  Keyboard,
  Layers,
  Mountain,
  Puzzle,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Umbrella,
  Users,
} from 'lucide-react';
import {
  ArtworkId,
  BOARDROOM_CLUES,
  WORKPLACE_MISTAKES,
} from '../data/workshopData';
import { PHOTO_ASSETS, PhotoAssetKey } from '../data/imageAssets';

interface VisualArtworkProps {
  id: ArtworkId;
  photoKey?: PhotoAssetKey;
  className?: string;
  discoveredMistakes?: string[];
  onSelectMistake?: (mistakeId: string) => void;
  discoveredClues?: string[];
  onSelectClue?: (clueId: string) => void;
}

const DIRECT_PHOTO_MAP: Record<ArtworkId, PhotoAssetKey> = {
  crossroads: 'crossroads',
  bridge: 'bridge',
  broken_pencil: 'broken_pencil',
  traffic_signal: 'traffic_signal',
  mirror: 'mirror',
  ladder: 'ladder',
  tree: 'tree',
  apple: 'apple',
  rocket: 'rocket',
  hourglass: 'hourglass',
  exam: 'memory_scene',
  interview: 'interview',
  umbrella: 'umbrella',
  camera: 'camera',
  business: 'boardroom_decline',
  puzzle: 'puzzle',
  teamwork: 'bridge',
  stethoscope: 'stethoscope',
  compass: 'compass',
  calculator: 'calculator',
  keyboard: 'keyboard',
  paperclip: 'paperclip',
  emotion_scene: 'emotion_scene',
  workplace_detective: 'workplace_detective',
  boardroom_decline: 'boardroom_decline',
  memory_scene: 'memory_scene',
  challenge_stop: 'traffic_signal',
  challenge_growth: 'challenge_growth',
  challenge_iceberg: 'challenge_iceberg',
  challenge_ripple: 'challenge_ripple',
  challenge_choices: 'mountain_peak',
  challenge_missing_piece: 'challenge_missing_piece',
  coffee_cup: 'coffee_cup',
  lighthouse: 'lighthouse',
  mountain_peak: 'mountain_peak',
  notebook: 'memory_scene',
};

interface EditorialPlateConfig {
  label: string;
  sublabel: string;
  gradient: string;
  accentColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EDITORIAL_PLATES: Partial<Record<ArtworkId, EditorialPlateConfig>> = {
  bridge: {
    label: 'Structural Bridge',
    sublabel: 'Tension · Span · Trust',
    gradient: 'from-slate-900 via-slate-800 to-blue-950',
    accentColor: 'text-blue-400',
    icon: GitBranch,
  },
  traffic_signal: {
    label: 'Signal Cadence',
    sublabel: 'Stop · Prepare · Move',
    gradient: 'from-zinc-900 via-slate-900 to-amber-950',
    accentColor: 'text-amber-400',
    icon: Activity,
  },
  mirror: {
    label: 'Mirror Lens',
    sublabel: 'Clarity · Self-Audit',
    gradient: 'from-slate-950 via-slate-900 to-cyan-950',
    accentColor: 'text-cyan-400',
    icon: Sparkles,
  },
  ladder: {
    label: 'Ascent Ladder',
    sublabel: 'Grounding · Ambition',
    gradient: 'from-stone-950 via-slate-900 to-indigo-950',
    accentColor: 'text-indigo-400',
    icon: TrendingUp,
  },
  tree: {
    label: 'Deep-Rooted Canopy',
    sublabel: 'Roots · Shelter · Scale',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    accentColor: 'text-emerald-400',
    icon: Layers,
  },
  apple: {
    label: 'First Principle',
    sublabel: 'Curiosity · Gravity',
    gradient: 'from-slate-950 via-rose-950 to-slate-900',
    accentColor: 'text-rose-400',
    icon: Sparkles,
  },
  rocket: {
    label: 'Orbital Velocity',
    sublabel: 'Propulsion · Scale',
    gradient: 'from-slate-950 via-blue-950 to-indigo-950',
    accentColor: 'text-blue-400',
    icon: TrendingUp,
  },
  hourglass: {
    label: 'Finite Window',
    sublabel: 'Focus · Precision',
    gradient: 'from-slate-950 via-amber-950 to-stone-950',
    accentColor: 'text-amber-400',
    icon: Hourglass,
  },
  exam: {
    label: 'Evaluation Arena',
    sublabel: 'Poise · Preparation',
    gradient: 'from-slate-950 via-slate-900 to-blue-950',
    accentColor: 'text-blue-300',
    icon: FileText,
  },
  interview: {
    label: 'Executive Table',
    sublabel: 'Presence · Conviction',
    gradient: 'from-slate-950 via-slate-900 to-emerald-950',
    accentColor: 'text-emerald-400',
    icon: Briefcase,
  },
  umbrella: {
    label: 'Protective Canopy',
    sublabel: 'Resilience · Cover',
    gradient: 'from-slate-950 via-cyan-950 to-slate-900',
    accentColor: 'text-cyan-400',
    icon: Umbrella,
  },
  camera: {
    label: 'Optical Aperture',
    sublabel: 'Observe · Frame · Focus',
    gradient: 'from-zinc-950 via-slate-900 to-slate-800',
    accentColor: 'text-sky-400',
    icon: Camera,
  },
  business: {
    label: 'Enterprise Matrix',
    sublabel: 'Value · Execution',
    gradient: 'from-slate-950 via-slate-900 to-blue-950',
    accentColor: 'text-blue-400',
    icon: Briefcase,
  },
  puzzle: {
    label: 'Interlocking Fit',
    sublabel: 'Synergy · Synthesis',
    gradient: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'text-indigo-400',
    icon: Puzzle,
  },
  teamwork: {
    label: 'Aligned Network',
    sublabel: 'Trust · Velocity',
    gradient: 'from-slate-950 via-teal-950 to-slate-900',
    accentColor: 'text-teal-400',
    icon: Users,
  },
  stethoscope: {
    label: 'Organisational Pulse',
    sublabel: 'Listen · Diagnose',
    gradient: 'from-slate-950 via-blue-950 to-slate-900',
    accentColor: 'text-sky-400',
    icon: Stethoscope,
  },
  compass: {
    label: 'True North',
    sublabel: 'Direction · Strategy',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    accentColor: 'text-emerald-400',
    icon: Compass,
  },
  calculator: {
    label: 'Unit Economics',
    sublabel: 'Precision · Margin',
    gradient: 'from-zinc-950 via-slate-900 to-indigo-950',
    accentColor: 'text-indigo-300',
    icon: Calculator,
  },
  keyboard: {
    label: 'Async Blueprint',
    sublabel: 'Clarity · Leverage',
    gradient: 'from-slate-950 via-zinc-900 to-blue-950',
    accentColor: 'text-blue-300',
    icon: Keyboard,
  },
  coffee_cup: {
    label: 'Focus Ritual',
    sublabel: 'Momentum · Calm',
    gradient: 'from-stone-950 via-amber-950 to-slate-950',
    accentColor: 'text-amber-300',
    icon: Sparkles,
  },
  lighthouse: {
    label: 'Signal Beacon',
    sublabel: 'Trust · Visibility',
    gradient: 'from-slate-950 via-cyan-950 to-blue-950',
    accentColor: 'text-cyan-300',
    icon: Award,
  },
  mountain_peak: {
    label: 'Summit Horizon',
    sublabel: 'Vision · Endurance',
    gradient: 'from-slate-950 via-slate-900 to-indigo-950',
    accentColor: 'text-indigo-300',
    icon: Mountain,
  },
  notebook: {
    label: 'Blueprint Journal',
    sublabel: 'Capture · Structure',
    gradient: 'from-slate-950 via-stone-900 to-slate-900',
    accentColor: 'text-amber-300',
    icon: FileText,
  },
  challenge_stop: {
    label: 'STOP',
    sublabel: 'Intentional Boundaries',
    gradient: 'from-slate-950 via-blue-950 to-slate-900',
    accentColor: 'text-blue-400',
    icon: Activity,
  },
  challenge_growth: {
    label: 'GROWTH',
    sublabel: 'Resilience Under Pressure',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    accentColor: 'text-emerald-400',
    icon: TrendingUp,
  },
  challenge_iceberg: {
    label: 'ICEBERG',
    sublabel: '10% Visible · 90% Depth',
    gradient: 'from-slate-950 via-sky-950 to-slate-900',
    accentColor: 'text-sky-400',
    icon: Layers,
  },
  challenge_ripple: {
    label: 'RIPPLE EFFECT',
    sublabel: 'Compounding Decisions',
    gradient: 'from-slate-950 via-violet-950 to-slate-900',
    accentColor: 'text-violet-400',
    icon: Activity,
  },
  challenge_choices: {
    label: 'CHOICES',
    sublabel: 'Agency & Trade-Offs',
    gradient: 'from-slate-950 via-amber-950 to-slate-900',
    accentColor: 'text-amber-400',
    icon: GitBranch,
  },
  challenge_missing_piece: {
    label: 'THE MISSING PIECE',
    sublabel: 'Profile Completion',
    gradient: 'from-slate-950 via-rose-950 to-slate-900',
    accentColor: 'text-rose-400',
    icon: Puzzle,
  },
};

export const VisualArtwork: React.FC<VisualArtworkProps> = ({
  id,
  photoKey,
  className = 'w-full h-full',
  discoveredMistakes = [],
  onSelectMistake,
  discoveredClues = [],
  onSelectClue,
}) => {
  const [imgError, setImgError] = useState(false);

  // Interactive Workplace Audit Photo (Level 6)
  if (id === 'workplace_detective' && !imgError) {
    const asset = PHOTO_ASSETS.workplace_detective;
    return (
      <div
        className={`relative select-none overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 ${className}`}
      >
        <img
          src={asset.src}
          alt={asset.alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover block"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/15"
          aria-hidden="true"
        />
        {WORKPLACE_MISTAKES.map((mistake) => {
          const found = discoveredMistakes.includes(mistake.id);
          return (
            <button
              key={mistake.id}
              type="button"
              onClick={() => onSelectMistake?.(mistake.id)}
              title={`#${mistake.number}: ${mistake.title}`}
              aria-label={`Inspect workplace issue ${mistake.number}: ${mistake.title}`}
              style={{ left: `${mistake.xPercent}%`, top: `${mistake.yPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer shadow-lg ring-2 ${
                found
                  ? 'bg-emerald-500 text-white ring-white'
                  : 'bg-slate-950/85 text-white ring-amber-400 hover:bg-blue-600'
              }`}
            >
              {found ? <Check className="w-4 h-4" /> : mistake.number}
            </button>
          );
        })}
      </div>
    );
  }

  // Interactive Boardroom Turnaround Photo (Level 9)
  if (id === 'boardroom_decline' && !imgError) {
    const asset = PHOTO_ASSETS.boardroom_decline;
    return (
      <div
        className={`relative select-none overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 ${className}`}
      >
        <img
          src={asset.src}
          alt={asset.alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover block"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"
          aria-hidden="true"
        />
        {BOARDROOM_CLUES.map((clue, idx) => {
          const found = discoveredClues.includes(clue.id);
          return (
            <button
              key={clue.id}
              type="button"
              onClick={() => onSelectClue?.(clue.id)}
              title={`${clue.dimension}: ${clue.headline}`}
              aria-label={`Inspect ${clue.dimension} clue`}
              style={{ left: `${clue.xPercent}%`, top: `${clue.yPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md font-sans text-[11px] font-semibold flex items-center gap-1 transition-transform duration-200 hover:scale-105 cursor-pointer shadow-lg ring-1 whitespace-nowrap ${
                found
                  ? 'bg-emerald-600 text-white ring-white/80'
                  : 'bg-slate-950/85 text-slate-100 ring-blue-400 hover:bg-blue-700'
              }`}
            >
              <span className="font-mono text-[10px] opacity-80">0{idx + 1}</span>
              <span>{clue.dimension}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // High-resolution generated photography for every ArtworkId
  const resolvedPhotoKey = photoKey ?? DIRECT_PHOTO_MAP[id];
  if (resolvedPhotoKey && !imgError) {
    const asset = PHOTO_ASSETS[resolvedPhotoKey];
    return (
      <div
        className={`group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 ${className}`}
      >
        <img
          src={asset.src}
          alt={asset.alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent flex items-end px-4 pb-2.5"
        >
          <span className="font-mono text-[10px] tracking-wider uppercase text-slate-100 drop-shadow-sm">
            {asset.caption}
          </span>
        </div>
      </div>
    );
  }

  // Styled CSS/SVG fallback plate if an image asset ever fails to load
  const plate = EDITORIAL_PLATES[id] ?? {
    label: 'Visual Prompt',
    sublabel: 'Observe · Connect · Explain',
    gradient: 'from-slate-950 via-slate-900 to-blue-950',
    accentColor: 'text-blue-400',
    icon: Sparkles,
  };
  const IconComp = plate.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${plate.gradient} text-white flex flex-col justify-between p-5 ${className}`}
      role="img"
      aria-label={`${plate.label} — ${plate.sublabel}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400">
        <span>Visual Metaphor</span>
        <span>Picture Connect</span>
      </div>

      <div className="relative my-auto py-4 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl border border-white/15 bg-white/5 backdrop-blur flex items-center justify-center shadow-inner">
          <IconComp className={`w-8 h-8 ${plate.accentColor}`} />
        </div>
      </div>

      <div className="relative space-y-0.5">
        <div className="font-display text-lg font-semibold tracking-tight text-white">
          {plate.label}
        </div>
        <div className="font-mono text-[11px] text-slate-300">{plate.sublabel}</div>
      </div>
    </div>
  );
};
