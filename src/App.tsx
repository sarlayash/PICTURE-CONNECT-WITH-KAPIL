import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Award, Lock, LogOut, Moon, ShieldCheck, Sun } from 'lucide-react';
import { evaluateFinalPrerequisites } from './data/finalAssessmentData';
import { BADGES, getLearnerRank, WORKSHOP_META } from './data/workshopData';
import {
  auth,
  isGenuineGoogleUser,
  signOutUser,
} from './firebase';
import {
  awardLevelCompletion,
  ConnectionPostDoc,
  createConnectionPost,
  createDefaultProgress,
  LearnerProgressDoc,
  LearnerWorkspaceDoc,
  recordVideoChallengeCompletion,
  recordWheelCompletion,
  saveLearnerWorkspace,
  subscribeConnections,
  subscribeLearnerProgress,
  subscribeLearnerWorkspace,
  upsertUserAccount,
} from './services/firestoreService';
import {
  AdvancedProgressDoc,
  AdvancedSubmissionDoc,
  createDefaultAdvancedProgress,
  subscribeAdvancedProgress,
  subscribeAdvancedSubmissions,
} from './services/advancedFirestoreService';
import {
  createDefaultFinalAssessment,
  FinalAssessmentDoc,
  subscribeFinalAssessment,
} from './services/finalAssessmentService';
import {
  createDefaultShoppingProgress,
  ShoppingProgressDoc,
  subscribeShoppingProgress,
} from './services/shoppingFirestoreService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoogleAuthGate } from './components/GoogleAuthGate';
import { AppView, OverviewStudio } from './components/OverviewStudio';
import { ActivitiesStudio } from './components/ActivitiesStudio';
import { SpinWheelStudio } from './components/SpinWheelStudio';
import { AchievementsCertificate } from './components/AchievementsCertificate';
import { AdvancedTrackStudio } from './components/AdvancedTrackStudio';
import { ShoppingNegotiationStudio } from './components/ShoppingNegotiationStudio';
import { FinalAssessmentStudio } from './components/FinalAssessmentStudio';
import { AdminDashboard } from './components/AdminDashboard';

const THEME_STORAGE_KEY = 'pcwk_theme_v2';

function PictureConnectWorkspace() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [view, setView] = useState<AppView>('journey');
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [adminOpen, setAdminOpen] = useState(false);

  const [connections, setConnections] = useState<ConnectionPostDoc[]>([]);
  const [workspace, setWorkspace] = useState<LearnerWorkspaceDoc>({ ownerId: '' });
  const [progress, setProgress] = useState<LearnerProgressDoc>(() =>
    createDefaultProgress('pending')
  );
  const [advProgress, setAdvProgress] = useState<AdvancedProgressDoc>(() =>
    createDefaultAdvancedProgress('pending')
  );
  const [advSubmissions, setAdvSubmissions] = useState<
    Record<string, AdvancedSubmissionDoc>
  >({});
  const [finalAssessment, setFinalAssessment] = useState<FinalAssessmentDoc>(() =>
    createDefaultFinalAssessment('pending')
  );
  const [shoppingProgress, setShoppingProgress] = useState<ShoppingProgressDoc>(() =>
    createDefaultShoppingProgress('pending')
  );

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
      setProgress(createDefaultProgress(nextUser.uid));
      setAdvProgress(createDefaultAdvancedProgress(nextUser.uid));
      setFinalAssessment(
        createDefaultFinalAssessment(
          nextUser.uid,
          nextUser.displayName || nextUser.email?.split('@')[0] || 'Verified Learner',
          nextUser.email || ''
        )
      );
      setShoppingProgress(
        createDefaultShoppingProgress(
          nextUser.uid,
          nextUser.displayName || nextUser.email?.split('@')[0] || 'Verified Learner',
          nextUser.email || ''
        )
      );
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
    const unsubProgress = subscribeLearnerProgress(user.uid, setProgress);
    const unsubAdvProgress = subscribeAdvancedProgress(user.uid, setAdvProgress);
    const unsubAdvSubmissions = subscribeAdvancedSubmissions(
      user.uid,
      setAdvSubmissions
    );
    const unsubFinal = subscribeFinalAssessment(user, setFinalAssessment);
    const unsubShopping = subscribeShoppingProgress(user, setShoppingProgress);

    return () => {
      unsubConnections();
      unsubWorkspace();
      unsubProgress();
      unsubAdvProgress();
      unsubAdvSubmissions();
      unsubFinal();
      unsubShopping();
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
    return (
      <>
        <GoogleAuthGate
          authError={authError}
          onOpenAdmin={() => setAdminOpen(true)}
        />
        <AdminDashboard
          open={adminOpen}
          onClose={() => setAdminOpen(false)}
          currentUser={null}
        />
      </>
    );
  }

  const learnerName = user.displayName || user.email?.split('@')[0] || 'Verified Learner';
  const rank = getLearnerRank(progress.xp);

  const handleNavigateView = (target: AppView, levelNum?: number) => {
    if (levelNum) {
      setActiveLevel(levelNum);
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

  const advSubsList = Object.values(advSubmissions) as AdvancedSubmissionDoc[];
  const advAvgScore =
    advSubsList.length > 0
      ? Math.round(
          advSubsList.reduce((acc, s) => acc + s.totalScore, 0) / advSubsList.length
        )
      : 0;

  const finalPrereq = evaluateFinalPrerequisites(progress, advProgress);
  const isFinalLocked =
    finalAssessment.status === 'not_started' && !finalPrereq.eligible;

  const navItems: { id: AppView; label: string; locked?: boolean }[] = [
    { id: 'journey', label: 'Journey' },
    { id: 'levels', label: 'Levels 1–10' },
    { id: 'wheel', label: 'Spin Wheel' },
    { id: 'shopping', label: 'Shop & Negotiate' },
    { id: 'advanced', label: 'AI Advanced' },
    { id: 'final', label: 'Final 1000 XP', locked: isFinalLocked },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => handleNavigateView('journey')}
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
                  className={`inline-flex items-center gap-1.5 py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-blue-700 text-slate-950 dark:border-blue-400 dark:text-white font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {item.locked && <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => handleNavigateView('achievements')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 tabular-nums"
            >
              <Award className="w-4 h-4" />
              <span>Certificate · {progress.xp} XP</span>
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
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.locked && <Lock className="w-3 h-3" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Verified Google Learner Identity & Live XP Strip */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {learnerName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-blue-700 dark:text-blue-400">
              {rank.title}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {progress.completedLevels.length}/10 Levels
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {progress.unlockedBadges.length}/{BADGES.length} Badges
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAdminOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {view === 'journey' && (
          <OverviewStudio
            learnerName={learnerName}
            progress={progress}
            advCompletedCount={advProgress.completedChallenges.length}
            advXp={advProgress.advXp}
            shopCompletedMcqs={shoppingProgress.answeredMcqs.length}
            shopXp={shoppingProgress.shopXp}
            shopRoleplayScore={shoppingProgress.roleplayScore}
            finalStatus={finalAssessment.status}
            finalXp={finalAssessment.totalXpAwarded}
            finalPassed={finalAssessment.passed}
            finalAttemptCount={finalAssessment.attemptCount}
            finalEligible={finalPrereq.eligible}
            finalPrereqLabel={`${finalPrereq.completedSections}/${finalPrereq.totalSections}`}
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
            sharedVideoPosts={challengePosts}
            onSubmitVideoChallenge={async (video, reflection) => {
              await createConnectionPost(
                user,
                'challenge',
                video.id,
                video.challengeTitle,
                reflection
              );
              return recordVideoChallengeCompletion(
                user.uid,
                progress,
                video.id,
                video.xpReward
              );
            }}
          />
        )}

        {view === 'levels' && (
          <ActivitiesStudio
            activeLevel={activeLevel}
            onSelectLevel={setActiveLevel}
            onGoToCertificate={() => handleNavigateView('achievements')}
            progress={progress}
            onCompleteLevel={async (levelNum) => {
              return awardLevelCompletion(user.uid, progress, levelNum);
            }}
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

        {view === 'wheel' && (
          <SpinWheelStudio
            progress={progress}
            sharedReflections={challengePosts}
            onCompleteWheelPrompt={async (promptId, promptTitle, reflectionText, xpReward) => {
              await createConnectionPost(
                user,
                'challenge',
                promptId,
                promptTitle,
                reflectionText
              );
              return recordWheelCompletion(user.uid, progress, promptId, xpReward);
            }}
          />
        )}

        {view === 'shopping' && (
          <ShoppingNegotiationStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            shoppingProgress={shoppingProgress}
          />
        )}

        {view === 'advanced' && (
          <AdvancedTrackStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            advProgress={advProgress}
            submissions={advSubmissions}
          />
        )}

        {view === 'final' && (
          <FinalAssessmentStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            finalDoc={finalAssessment}
            coreProgress={progress}
            advProgress={advProgress}
            advAvgScore={advAvgScore}
            onNavigateView={handleNavigateView}
          />
        )}

        {view === 'achievements' && (
          <AchievementsCertificate
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            progress={progress}
            onNavigateToLevels={(lvl) => handleNavigateView('levels', lvl)}
          />
        )}
      </main>

      {/* Clean Footer with Theme Switcher & Powered By Kapil Attribution */}
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
            <span>{darkMode ? 'Light Studio Mode' : 'Dark Executive Mode'}</span>
          </button>
        </div>
      </footer>

      <AdminDashboard
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        currentUser={user}
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
