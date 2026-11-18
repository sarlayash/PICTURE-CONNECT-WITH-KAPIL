import { useEffect, useState } from 'react';
import { MonitorPlay, Moon, Sun } from 'lucide-react';
import {
  createInitialTeams,
  DEFAULT_PREP_CHECKLIST,
  PrepItem,
  TeamRecord,
  WORKSHOP_META,
} from './data/workshopData';
import { OverviewStudio } from './components/OverviewStudio';
import { ActivitiesStudio } from './components/ActivitiesStudio';
import { ChallengesStudio } from './components/ChallengesStudio';
import { ChampionshipArena } from './components/ChampionshipArena';
import { PlaybookView } from './components/PlaybookView';
import { StageProjectorModal } from './components/StageProjectorModal';

type AppView = 'overview' | 'activities' | 'challenges' | 'championship' | 'playbook';

interface LearnerConnection {
  id: string;
  picture: string;
  concept: string;
  explanation: string;
}

const STORAGE_KEYS = {
  teams: 'pcwk_teams_v1',
  prep: 'pcwk_prep_v1',
  connections: 'pcwk_connections_v1',
  theme: 'pcwk_theme_v1',
};

export default function App() {
  const [view, setView] = useState<AppView>('overview');
  const [activeActivityNumber, setActiveActivityNumber] = useState<number>(1);
  const [stageOpen, setStageOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) === 'dark';
    } catch {
      return false;
    }
  });

  const [teams, setTeams] = useState<TeamRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.teams);
      return saved ? (JSON.parse(saved) as TeamRecord[]) : createInitialTeams();
    } catch {
      return createInitialTeams();
    }
  });

  const [prepItems, setPrepItems] = useState<PrepItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.prep);
      return saved ? (JSON.parse(saved) as PrepItem[]) : DEFAULT_PREP_CHECKLIST;
    } catch {
      return DEFAULT_PREP_CHECKLIST;
    }
  });

  const [learnerConnections, setLearnerConnections] = useState<LearnerConnection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.connections);
      return saved ? (JSON.parse(saved) as LearnerConnection[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage quota errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
    } catch {
      // Ignore storage quota errors
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.prep, JSON.stringify(prepItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [prepItems]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.connections,
        JSON.stringify(learnerConnections)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [learnerConnections]);

  const handleNavigateView = (target: AppView, activityNum?: number) => {
    if (activityNum) {
      setActiveActivityNumber(activityNum);
    }
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddConnection = (
    picture: string,
    concept: string,
    explanation: string
  ) => {
    setLearnerConnections((prev) => [
      { id: `conn-${Date.now()}`, picture, concept, explanation },
      ...prev,
    ]);
  };

  const handleTogglePrep = (id: string) => {
    setPrepItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddPrepItem = (label: string, category: string) => {
    setPrepItems((prev) => [
      ...prev,
      { id: `prep-${Date.now()}`, label, category, completed: false },
    ]);
  };

  const navItems: { id: AppView; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activities', label: 'Activities' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'championship', label: 'Championship' },
    { id: 'playbook', label: 'Playbook' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigateView('overview')}
            className="font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {WORKSHOP_META.shortTitle}
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map((item) => {
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigateView(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-blue-700 text-slate-950 dark:border-blue-400 dark:text-white font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setStageOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <MonitorPlay className="w-4 h-4" />
              <span>Stage Mode</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden border-t border-slate-100 dark:border-slate-900 px-3 py-1.5 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigateView(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {view === 'overview' && (
          <OverviewStudio
            onNavigateView={handleNavigateView}
            learnerConnections={learnerConnections}
            onAddConnection={handleAddConnection}
          />
        )}

        {view === 'activities' && (
          <ActivitiesStudio
            activeActivityNumber={activeActivityNumber}
            onSelectActivity={setActiveActivityNumber}
            onGoToChampionship={() => handleNavigateView('championship')}
          />
        )}

        {view === 'challenges' && <ChallengesStudio />}

        {view === 'championship' && (
          <ChampionshipArena teams={teams} onUpdateTeams={setTeams} />
        )}

        {view === 'playbook' && (
          <PlaybookView
            prepItems={prepItems}
            onTogglePrep={handleTogglePrep}
            onAddPrepItem={handleAddPrepItem}
          />
        )}
      </main>

      {/* Clean Footer with Theme Switcher & Attribution */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              {WORKSHOP_META.title} · {WORKSHOP_META.positioning}
            </div>
            <div>
              {WORKSHOP_META.institution} · {WORKSHOP_META.poweredBy} · {WORKSHOP_META.pillars.join(' · ')}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{darkMode ? 'Light Classroom Mode' : 'Dark Auditorium Mode'}</span>
          </button>
        </div>
      </footer>

      {/* Distraction-Free Fullscreen Projector Stage */}
      <StageProjectorModal
        open={stageOpen}
        onClose={() => setStageOpen(false)}
        initialActivityNumber={activeActivityNumber}
      />
    </div>
  );
}
