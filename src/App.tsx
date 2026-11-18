import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LogOut, MonitorPlay, Moon, ShieldCheck, Sun } from 'lucide-react';
import {
  PrepItem,
  RoundScore,
  TeamRecord,
  TeamRole,
  WORKSHOP_META,
} from './data/workshopData';
import {
  auth,
  isFacilitatorAdmin,
  isGenuineGoogleUser,
  signOutUser,
} from './firebase';
import {
  addTeamMemberFirestore,
  ConnectionPostDoc,
  createConnectionPost,
  createPrepItemDoc,
  deleteTeamScoreFirestore,
  LearnerWorkspaceDoc,
  recordTeamScoreFirestore,
  rotateSpeakersFirestore,
  saveLearnerWorkspace,
  seedDefaultPrepItems,
  seedDefaultTeamsFirestore,
  subscribeChampionshipTeams,
  subscribeConnections,
  subscribeLearnerWorkspace,
  subscribePrepItems,
  togglePrepItemDoc,
  updateTeamMemberFirestore,
  updateTeamNameFirestore,
  upsertUserAccount,
} from './services/firestoreService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoogleAuthGate } from './components/GoogleAuthGate';
import { OverviewStudio } from './components/OverviewStudio';
import { ActivitiesStudio } from './components/ActivitiesStudio';
import { ChallengesStudio } from './components/ChallengesStudio';
import { ChampionshipArena } from './components/ChampionshipArena';
import { PlaybookView } from './components/PlaybookView';
import { StageProjectorModal } from './components/StageProjectorModal';

type AppView = 'overview' | 'activities' | 'challenges' | 'championship' | 'playbook';

const THEME_STORAGE_KEY = 'pcwk_theme_v1';

function PictureConnectWorkspace() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [view, setView] = useState<AppView>('overview');
  const [activeActivityNumber, setActiveActivityNumber] = useState<number>(1);
  const [stageOpen, setStageOpen] = useState(false);

  const [connections, setConnections] = useState<ConnectionPostDoc[]>([]);
  const [workspace, setWorkspace] = useState<LearnerWorkspaceDoc>({ ownerId: '' });
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [prepItems, setPrepItems] = useState<PrepItem[]>([]);
  const seededPrepRef = useRef<string | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage quota errors
    }
  }, [darkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setAuthReady(true);
        return;
      }

      if (!isGenuineGoogleUser(nextUser)) {
        setAuthError(
          'Only genuine, verified Google accounts are permitted. Non-Google or unverified accounts have been signed out.'
        );
        await signOutUser();
        setUser(null);
        setAuthReady(true);
        return;
      }

      setAuthError(null);
      setUser(nextUser);
      setAuthReady(true);
      try {
        await upsertUserAccount(nextUser);
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    const unsubConnections = subscribeConnections(setConnections);
    const unsubWorkspace = subscribeLearnerWorkspace(user.uid, setWorkspace);
    const unsubTeams = subscribeChampionshipTeams(setTeams);
    const unsubPrep = subscribePrepItems(user.uid, (items) => {
      setPrepItems(items);
      if (items.length === 0 && seededPrepRef.current !== user.uid) {
        seededPrepRef.current = user.uid;
        seedDefaultPrepItems(user.uid).catch(console.error);
      }
    });

    return () => {
      unsubConnections();
      unsubWorkspace();
      unsubTeams();
      unsubPrep();
    };
  }, [authReady, user]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Verifying Google session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <GoogleAuthGate authError={authError} />;
  }

  const admin = isFacilitatorAdmin(user);

  const handleNavigateView = (target: AppView, activityNum?: number) => {
    if (activityNum) {
      setActiveActivityNumber(activityNum);
    }
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const conceptConnections = connections
    .filter((c) => c.kind === 'concept')
    .map((c) => {
      const parts = c.title.split('+').map((s) => s.trim());
      return {
        id: c.id,
        picture: parts[0] || c.promptRef,
        concept: parts[1] || 'Connection',
        explanation: c.body,
        authorName: c.authorName,
      };
    });

  const perspectivePosts = connections.filter((c) => c.kind === 'perspective');
  const challengePosts = connections.filter((c) => c.kind === 'challenge');

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
          <button
            type="button"
            onClick={() => handleNavigateView('overview')}
            className="font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {WORKSHOP_META.shortTitle}
          </button>

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Verified Google Identity Workspace Strip */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.displayName || 'Verified Learner'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{user.email}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-blue-700 dark:text-blue-400">
              {admin ? 'Facilitator Admin' : 'Verified Google Learner'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => signOutUser()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {view === 'overview' && (
          <OverviewStudio
            onNavigateView={handleNavigateView}
            learnerConnections={conceptConnections}
            onAddConnection={async (picture, concept, explanation) => {
              await createConnectionPost(
                user,
                'concept',
                'central-concept',
                `${picture} + ${concept}`,
                explanation
              );
            }}
          />
        )}

        {view === 'activities' && (
          <ActivitiesStudio
            activeActivityNumber={activeActivityNumber}
            onSelectActivity={setActiveActivityNumber}
            onGoToChampionship={() => handleNavigateView('championship')}
            sharedPerspectives={perspectivePosts}
            onAddPerspective={async (sceneTitle, text) => {
              await createConnectionPost(
                user,
                'perspective',
                sceneTitle,
                text,
                sceneTitle
              );
            }}
            workspace={workspace}
            onSaveWorkspace={async (patch) => {
              await saveLearnerWorkspace(user.uid, patch);
            }}
          />
        )}

        {view === 'challenges' && (
          <ChallengesStudio
            sharedReflections={challengePosts}
            onAddReflection={async (challengeId, challengeTitle, body) => {
              await createConnectionPost(
                user,
                'challenge',
                challengeId,
                challengeTitle,
                body
              );
            }}
          />
        )}

        {view === 'championship' && (
          <ChampionshipArena
            teams={teams}
            isAdmin={admin}
            onSeedTeams={seedDefaultTeamsFirestore}
            onUpdateTeamName={updateTeamNameFirestore}
            onRotateAllSpeakers={() => rotateSpeakersFirestore(teams)}
            onUpdateMember={updateTeamMemberFirestore}
            onAddMember={addTeamMemberFirestore}
            onRecordScore={(teamId, score: Omit<RoundScore, 'id' | 'recordedAt'>) =>
              recordTeamScoreFirestore(teamId, user, score)
            }
            onDeleteScore={deleteTeamScoreFirestore}
          />
        )}

        {view === 'playbook' && (
          <PlaybookView
            prepItems={prepItems}
            onTogglePrep={async (id) => {
              const target = prepItems.find((i) => i.id === id);
              if (target) {
                await togglePrepItemDoc(id, !target.completed);
              }
            }}
            onAddPrepItem={async (label, category) => {
              await createPrepItemDoc(user.uid, label, category);
            }}
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

      <StageProjectorModal
        open={stageOpen}
        onClose={() => setStageOpen(false)}
        initialActivityNumber={activeActivityNumber}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PictureConnectWorkspace />
    </ErrorBoundary>
  );
}
