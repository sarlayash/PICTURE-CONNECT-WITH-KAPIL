import { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  Award,
  Bell,
  Lock,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  UserCircle2,
} from 'lucide-react';
import { evaluateFinalPrerequisites } from './data/finalAssessmentData';
import { getNavSectionTheme } from './data/themeColors';
import { BADGES, getLearnerRank, LEVELS, WORKSHOP_META } from './data/workshopData';
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
  createDefaultUserProfile,
  LearnerProgressDoc,
  LearnerWorkspaceDoc,
  recordVideoChallengeCompletion,
  recordWheelCompletion,
  saveLearnerWorkspace,
  subscribeConnections,
  subscribeLearnerProgress,
  subscribeLearnerWorkspace,
  subscribeUserProfile,
  updateUserProfile,
  upsertUserAccount,
  UserProfileDoc,
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
import {
  CareerCategoryId,
  computeCareerCategoryStats,
} from './data/careerSkillsData';
import {
  CareerSkillsProgressDoc,
  createDefaultCareerSkillsProgress,
  subscribeCareerSkillsProgress,
} from './services/careerSkillsFirestoreService';
import {
  computeMasterPillarStats,
  computeMasterTrackStats,
  MasterPillarId,
  MasterTrackId,
} from './data/masterUniverseData';
import {
  createDefaultMasterProgress,
  MasterSkillsProgressDoc,
  subscribeMasterProgress,
} from './services/masterUniverseFirestoreService';
import {
  computeSectionAudit,
  LearnerNotificationDoc,
  logLearnerNotification,
  NotificationTargetView,
  registerNotificationServiceWorker,
  shouldTriggerScheduledReminder,
  showBrowserPushNotification,
  subscribeMyNotifications,
} from './services/notificationService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoogleAuthGate } from './components/GoogleAuthGate';
import { AppView, OverviewStudio } from './components/OverviewStudio';
import { ActivitiesStudio } from './components/ActivitiesStudio';
import { SpinWheelStudio } from './components/SpinWheelStudio';
import { AchievementsCertificate } from './components/AchievementsCertificate';
import { AdvancedTrackStudio } from './components/AdvancedTrackStudio';
import { ShoppingNegotiationStudio } from './components/ShoppingNegotiationStudio';
import { CareerSkillsStudio } from './components/CareerSkillsStudio';
import { MasterUniverseStudio } from './components/MasterUniverseStudio';
import {
  computeDailyMockStreak,
  DailyMockAttemptDoc,
  subscribeMyDailyMockAttempts,
} from './services/dailyMockFirestoreService';
import {
  generateDailyMockPaper,
  getTodayDateKey,
} from './data/dailyMockData';
import { DailyMockStudio } from './components/DailyMockStudio';
import { FinalAssessmentStudio } from './components/FinalAssessmentStudio';
import { AdminDashboard } from './components/AdminDashboard';
import { SectionFeedbackBar } from './components/SectionFeedbackBar';
import { MyProfileStudio } from './components/MyProfileStudio';
import { NotificationCenterDrawer } from './components/NotificationCenterDrawer';
import {
  EmailCredentialModal,
  EmailCredentialRequest,
} from './components/EmailCredentialModal';
import {
  FEEDBACK_SECTION_LABELS,
  FeedbackSectionId,
} from './services/feedbackFirestoreService';

const THEME_STORAGE_KEY = 'pcwk_theme_v2';

function PictureConnectWorkspace() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [view, setView] = useState<AppView>('journey');
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [activeCareerTab, setActiveCareerTab] =
    useState<CareerCategoryId>('indianism');
  const [activeMasterPillar, setActiveMasterPillar] =
    useState<MasterPillarId>('aptitude_grammar');
  const [activeMasterTrack, setActiveMasterTrack] = useState<
    MasterTrackId | undefined
  >(undefined);
  const [activeMasterTrackTitle, setActiveMasterTrackTitle] = useState<string>(
    'Quantitative & Logical Aptitude'
  );
  const [adminOpen, setAdminOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [emailRequest, setEmailRequest] =
    useState<EmailCredentialRequest | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfileDoc>(() =>
    createDefaultUserProfile('pending')
  );
  const [notifications, setNotifications] = useState<LearnerNotificationDoc[]>(
    []
  );
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
  const [careerProgress, setCareerProgress] = useState<CareerSkillsProgressDoc>(() =>
    createDefaultCareerSkillsProgress('pending')
  );
  const [masterProgress, setMasterProgress] = useState<MasterSkillsProgressDoc>(() =>
    createDefaultMasterProgress('pending')
  );
  const [dailyMockAttempts, setDailyMockAttempts] = useState<
    DailyMockAttemptDoc[]
  >([]);
  const [dailyMockLoaded, setDailyMockLoaded] = useState(false);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const reminderCheckedUidRef = useRef<string>('');
  const dailyMockNotifiedKeyRef = useRef<string>('');

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
        setAdminOpen(false);
        setNotifDrawerOpen(false);
        setEmailRequest(null);
        reminderCheckedUidRef.current = '';
        dailyMockNotifiedKeyRef.current = '';
        setDailyMockAttempts([]);
        setDailyMockLoaded(false);
        setNotificationsLoaded(false);
        setUserProfile(createDefaultUserProfile('pending'));
        setNotifications([]);
        setConnections([]);
        setWorkspace({ ownerId: '' });
        setProgress(createDefaultProgress('pending'));
        setAdvProgress(createDefaultAdvancedProgress('pending'));
        setAdvSubmissions({});
        setFinalAssessment(createDefaultFinalAssessment('pending'));
        setShoppingProgress(createDefaultShoppingProgress('pending'));
        setCareerProgress(createDefaultCareerSkillsProgress('pending'));
        setMasterProgress(createDefaultMasterProgress('pending'));
        setAuthReady(true);
        return;
      }

      if (!isGenuineGoogleUser(nextUser)) {
        setAuthError(
          'Only genuine, verified Google accounts are permitted. Non-Google or unverified accounts have been signed out.'
        );
        await signOutUser();
        setUser(null);
        setAdminOpen(false);
        setAuthReady(true);
        return;
      }

      setAuthError(null);
      setUser(nextUser);
      setUserProfile(
        createDefaultUserProfile(
          nextUser.uid,
          nextUser.displayName || nextUser.email?.split('@')[0] || 'Verified Learner',
          nextUser.email || '',
          nextUser.photoURL || undefined
        )
      );
      setNotifications([]);
      setConnections([]);
      setWorkspace({ ownerId: nextUser.uid });
      setAdvSubmissions({});
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
      setCareerProgress(
        createDefaultCareerSkillsProgress(
          nextUser.uid,
          nextUser.displayName || nextUser.email?.split('@')[0] || 'Verified Learner',
          nextUser.email || ''
        )
      );
      setMasterProgress(
        createDefaultMasterProgress(
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
    registerNotificationServiceWorker();
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const onSwMessage = (event: MessageEvent) => {
        if (event.data?.type === 'NOTIFICATION_NAVIGATE' && event.data?.targetView) {
          setView(event.data.targetView as AppView);
        }
      };
      navigator.serviceWorker.addEventListener('message', onSwMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', onSwMessage);
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    setDailyMockLoaded(false);
    setNotificationsLoaded(false);
    const unsubProfile = subscribeUserProfile(user, setUserProfile);
    const unsubNotifications = subscribeMyNotifications(user.uid, (items) => {
      setNotifications(items);
      setNotificationsLoaded(true);
    });
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
    const unsubCareer = subscribeCareerSkillsProgress(user, setCareerProgress);
    const unsubMaster = subscribeMasterProgress(user, setMasterProgress);
    const unsubDailyMock = subscribeMyDailyMockAttempts(user.uid, (items) => {
      setDailyMockAttempts(items);
      setDailyMockLoaded(true);
    });

    return () => {
      unsubProfile();
      unsubNotifications();
      unsubConnections();
      unsubWorkspace();
      unsubProgress();
      unsubAdvProgress();
      unsubAdvSubmissions();
      unsubFinal();
      unsubShopping();
      unsubCareer();
      unsubMaster();
      unsubDailyMock();
    };
  }, [authReady, user]);

  const sectionAudit = useMemo(
    () =>
      computeSectionAudit({
        completedLevels: progress.completedLevels,
        completedWheelPrompts: progress.completedWheelPrompts,
        shoppingAnsweredCount: shoppingProgress.answeredMcqs.length,
        shoppingRoleplayScore: shoppingProgress.roleplayScore,
        careerAnsweredCount: careerProgress.answeredMcqs.length,
        masterAnsweredCount: masterProgress.answeredMcqs.length,
        advCompletedCount: advProgress.completedChallenges.length,
        finalPassed: finalAssessment.passed,
        finalStatus: finalAssessment.status,
      }),
    [
      progress.completedLevels,
      progress.completedWheelPrompts,
      shoppingProgress.answeredMcqs.length,
      shoppingProgress.roleplayScore,
      careerProgress.answeredMcqs.length,
      masterProgress.answeredMcqs.length,
      advProgress.completedChallenges.length,
      finalAssessment.passed,
      finalAssessment.status,
    ]
  );

  // Automatic scheduled missing-section push reminder when due
  useEffect(() => {
    if (!user || userProfile.uid !== user.uid) return;
    if (reminderCheckedUidRef.current === user.uid) return;
    const due = shouldTriggerScheduledReminder({
      pushEnabled: userProfile.pushEnabled,
      reminderFrequency: userProfile.reminderFrequency,
      lastReminderAtMs: userProfile.lastReminderAtMs,
      missingCount: sectionAudit.missingOrIncompleteItems.length,
    });
    if (!due) return;

    reminderCheckedUidRef.current = user.uid;
    const nextMissing = sectionAudit.missingOrIncompleteItems[0];
    if (!nextMissing) return;

    const title = `Missing Section Reminder (${sectionAudit.overallCompletionPct}% done)`;
    const body = `${nextMissing.title}: ${nextMissing.actionHint}`;

    (async () => {
      const delivery = await showBrowserPushNotification({
        title,
        body,
        targetView: nextMissing.targetView,
        tag: 'euwk-scheduled-reminder',
      });
      try {
        await logLearnerNotification({
          user,
          kind: 'missing_reminder',
          title,
          body,
          targetView: nextMissing.targetView,
          credentialType: 'reminder_digest',
          channel: delivery.delivered ? 'push' : 'in_app',
          sentBy: 'system',
        });
        await updateUserProfile(user, { lastReminderAtMs: Date.now() });
      } catch (err) {
        console.error('Scheduled reminder log failed:', err);
      }
    })();
  }, [user, userProfile, sectionAudit]);

  // Automatic once-per-day Daily 60-Min Mock portal + browser push launch notification
  useEffect(() => {
    if (!user || userProfile.uid !== user.uid) return;
    if (!dailyMockLoaded || !notificationsLoaded) return;

    const todayKey = getTodayDateKey();
    const dedupKey = `${user.uid}_${todayKey}`;
    if (dailyMockNotifiedKeyRef.current === dedupKey) return;

    const todayAttempt = dailyMockAttempts.find((a) => a.dateKey === todayKey);
    if (todayAttempt?.status === 'submitted') {
      dailyMockNotifiedKeyRef.current = dedupKey;
      return;
    }

    const todayPaper = generateDailyMockPaper(todayKey);
    const alreadyLoggedToday = notifications.some(
      (n) =>
        n.kind === 'daily_mock_launch' &&
        (n.title.includes(todayPaper.paperCode) ||
          n.body.includes(todayPaper.paperCode))
    );
    if (alreadyLoggedToday) {
      dailyMockNotifiedKeyRef.current = dedupKey;
      return;
    }

    dailyMockNotifiedKeyRef.current = dedupKey;
    const title = `Daily 60-Min Mock Live (${todayPaper.paperCode})`;
    const body = `40 MCQs across all 7 topics (20 Hard / 50%). Complete in 60 min to receive your daily results summary on portal & email.`;

    (async () => {
      let deliveredPush = false;
      if (userProfile.pushEnabled) {
        const res = await showBrowserPushNotification({
          title,
          body,
          targetView: 'daily_mock',
          tag: `euwk-daily-mock-${todayKey}`,
        });
        deliveredPush = res.delivered;
      }
      try {
        await logLearnerNotification({
          user,
          kind: 'daily_mock_launch',
          title,
          body,
          targetView: 'daily_mock',
          credentialType: 'daily_mock_invite',
          channel: deliveredPush ? 'push' : 'in_app',
          sentBy: 'system',
        });
      } catch (err) {
        console.error('Daily mock launch notification log failed:', err);
      }
    })();
  }, [
    user,
    userProfile.uid,
    userProfile.pushEnabled,
    dailyMockLoaded,
    notificationsLoaded,
    dailyMockAttempts,
    notifications,
  ]);

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

  const learnerName =
    userProfile.displayName ||
    user.displayName ||
    user.email?.split('@')[0] ||
    'Verified Learner';
  const learnerAvatar =
    userProfile.customPhotoDataUrl || userProfile.photoURL || user.photoURL || '';
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const rank = getLearnerRank(progress.xp);

  const handleNavigateView = (
    target: AppView,
    levelNum?: number,
    careerTab?: CareerCategoryId,
    masterPillar?: MasterPillarId,
    masterTrack?: MasterTrackId
  ) => {
    if (levelNum) {
      setActiveLevel(levelNum);
    }
    if (careerTab) {
      setActiveCareerTab(careerTab);
    }
    if (masterPillar) {
      setActiveMasterPillar(masterPillar);
    }
    if (masterTrack) {
      setActiveMasterTrack(masterTrack);
    } else if (masterPillar) {
      setActiveMasterTrack(undefined);
    }
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const careerStats = computeCareerCategoryStats({
    answeredMcqs: careerProgress.answeredMcqs,
    correctMcqs: careerProgress.correctMcqs,
    hintUsedMcqs: careerProgress.hintUsedMcqs,
  });

  const masterTrackStats = computeMasterTrackStats({
    answeredMcqs: masterProgress.answeredMcqs,
    correctMcqs: masterProgress.correctMcqs,
    hintUsedMcqs: masterProgress.hintUsedMcqs,
  });
  const masterPillarStats = computeMasterPillarStats(masterTrackStats);

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

  const todayDateKey = getTodayDateKey();
  const todayDailyPaper = generateDailyMockPaper(todayDateKey);
  const todayDailyAttempt = dailyMockAttempts.find(
    (a) => a.dateKey === todayDateKey
  );
  const dailyMockStreak = computeDailyMockStreak(
    dailyMockAttempts,
    todayDateKey
  );

  const navItems: { id: AppView; label: string; locked?: boolean }[] = [
    { id: 'journey', label: 'Journey' },
    { id: 'levels', label: 'Levels 1–10' },
    { id: 'wheel', label: 'Wheel' },
    { id: 'shopping', label: 'Shop & Deals' },
    { id: 'career', label: 'Career MCQs' },
    { id: 'universe', label: 'Tech & DSA' },
    { id: 'advanced', label: 'AI Track' },
    {
      id: 'daily_mock',
      label:
        todayDailyAttempt?.status === 'submitted'
          ? `Daily Mock (${todayDailyAttempt.scorePercent}%)`
          : 'Daily 60m',
    },
    { id: 'final', label: 'Final 1000 XP', locked: isFinalLocked },
  ];

  const activeSectionTheme = getNavSectionTheme(view);
  const activeLevelObj = LEVELS.find((lvl) => lvl.level === activeLevel);
  const feedbackSubTopic =
    view === 'levels'
      ? `Level ${activeLevel}${activeLevelObj ? `: ${activeLevelObj.title}` : ''}`
      : view === 'career'
      ? activeCareerTab === 'indianism'
        ? 'Indianism & Global English'
        : activeCareerTab === 'interview'
        ? 'Interview Skills'
        : 'GD Skills'
      : view === 'universe'
      ? activeMasterTrackTitle
      : '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Strict 3-Zone Top Bar Contract with Active Section Color Hairline */}
      <header className="no-print sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div
          className={`h-0.5 w-full bg-gradient-to-r ${activeSectionTheme.topBar} transition-all duration-300`}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 lg:gap-4">
          <button
            type="button"
            onClick={() => handleNavigateView('journey')}
            className="font-display text-sm lg:text-base font-bold tracking-tight text-slate-950 dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {WORKSHOP_META.shortTitle}
          </button>

          <nav
            aria-label="Primary navigation"
            className="hidden xl:flex items-center gap-3.5 text-[13px] font-medium"
          >
            {navItems.map((item) => {
              const active = view === item.id;
              const itemTheme = getNavSectionTheme(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigateView(item.id)}
                  className={`inline-flex items-center gap-1.5 py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? `${itemTheme.activeTab} font-semibold`
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 hover:from-blue-800 hover:to-violet-800 text-white text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 tabular-nums shadow-sm"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Certificate · {progress.xp} XP</span>
            </button>
          </div>
        </div>

        <div className="xl:hidden border-t border-slate-100 dark:border-slate-900 px-3 py-1.5 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = view === item.id;
            const itemTheme = getNavSectionTheme(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigateView(item.id)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? itemTheme.activeButton
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
        {/* Verified Google Learner Identity, Push Alerts Bell & My Profile Strip */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            {learnerAvatar ? (
              <img
                src={learnerAvatar}
                alt={learnerName}
                onClick={() => handleNavigateView('profile')}
                className="w-7 h-7 rounded-full object-cover border border-indigo-400/50 cursor-pointer shrink-0"
              />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <button
              type="button"
              onClick={() => handleNavigateView('profile')}
              className="font-semibold text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-400 cursor-pointer"
            >
              {learnerName}
            </button>
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

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setNotifDrawerOpen(true)}
              className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Reminders</span>
              {(unreadNotificationsCount > 0 ||
                sectionAudit.missingOrIncompleteItems.length > 0) && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold">
                  {unreadNotificationsCount > 0
                    ? unreadNotificationsCount
                    : sectionAudit.missingOrIncompleteItems.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavigateView('profile')}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                view === 'profile'
                  ? 'text-indigo-700 dark:text-indigo-400 underline'
                  : 'text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400'
              }`}
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>

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
            shopCorrectMcqs={shoppingProgress.correctMcqs.length}
            shopBadgesCount={shoppingProgress.unlockedShopBadges.length}
            shopXp={shoppingProgress.shopXp}
            shopRoleplayScore={shoppingProgress.roleplayScore}
            careerAnswered={careerProgress.answeredMcqs.length}
            careerCorrect={careerProgress.correctMcqs.length}
            careerXp={careerProgress.careerXp}
            indianismScore={`${careerStats.indianism.correct}/${careerStats.indianism.total} Correct`}
            interviewScore={`${careerStats.interview.correct}/${careerStats.interview.total} Correct`}
            gdScore={`${careerStats.gd.correct}/${careerStats.gd.total} Correct`}
            masterAnswered={masterProgress.answeredMcqs.length}
            masterCorrect={masterProgress.correctMcqs.length}
            masterXp={masterProgress.masterXp}
            aptitudeGrammarScore={`${masterPillarStats.aptitude_grammar.correct}/${masterPillarStats.aptitude_grammar.total} Correct`}
            codingDsaScore={`${masterPillarStats.coding_dsa.correct}/${masterPillarStats.coding_dsa.total} Correct`}
            dataCloudScore={`${masterPillarStats.data_cloud.correct}/${masterPillarStats.data_cloud.total} Correct`}
            finalStatus={finalAssessment.status}
            finalXp={finalAssessment.totalXpAwarded}
            finalPassed={finalAssessment.passed}
            finalAttemptCount={finalAssessment.attemptCount}
            finalEligible={finalPrereq.eligible}
            finalPrereqLabel={`${finalPrereq.completedSections}/${finalPrereq.totalSections}`}
            dailyMockStatus={todayDailyAttempt?.status || 'not_started'}
            dailyMockScorePct={todayDailyAttempt?.scorePercent || 0}
            dailyMockHardPct={todayDailyAttempt?.hardAccuracyPercent || 0}
            dailyMockStreak={dailyMockStreak}
            dailyMockPaperCode={todayDailyPaper.paperCode}
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
              const res = await awardLevelCompletion(user.uid, progress, levelNum);
              if (res.newlyAwardedXp > 0) {
                const lvlTitle =
                  LEVELS.find((l) => l.level === levelNum)?.title ||
                  `Level ${levelNum}`;
                if (userProfile.pushEnabled) {
                  showBrowserPushNotification({
                    title: `Level ${levelNum} Completed! +${res.newlyAwardedXp} XP`,
                    body: `Great momentum on "${lvlTitle}". Keep going toward all 10 levels!`,
                    targetView: 'achievements',
                    tag: `euwk-lvl-${levelNum}`,
                  });
                }
                logLearnerNotification({
                  user,
                  kind: 'section_completed',
                  title: `Completed Level ${levelNum}: ${lvlTitle}`,
                  body: `Earned +${res.newlyAwardedXp} XP${
                    res.newlyUnlockedBadges.length > 0
                      ? ` and unlocked ${res.newlyUnlockedBadges.length} new badge(s)!`
                      : '.'
                  }`,
                  targetView: 'achievements',
                  channel: userProfile.pushEnabled ? 'push' : 'in_app',
                  sentBy: 'system',
                }).catch(() => {});
              }
              return res;
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
            onRequestEmail={setEmailRequest}
          />
        )}

        {view === 'career' && (
          <CareerSkillsStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            careerProgress={careerProgress}
            initialTab={activeCareerTab}
            onActiveTabChange={(tab) => {
              if (tab !== 'credentials') {
                setActiveCareerTab(tab);
              }
            }}
            onRequestEmail={setEmailRequest}
          />
        )}

        {view === 'universe' && (
          <MasterUniverseStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            masterProgress={masterProgress}
            initialPillar={activeMasterPillar}
            initialTrack={activeMasterTrack}
            onActiveTrackChange={setActiveMasterTrackTitle}
            onRequestEmail={setEmailRequest}
          />
        )}

        {view === 'advanced' && (
          <AdvancedTrackStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            advProgress={advProgress}
            submissions={advSubmissions}
            onRequestEmail={setEmailRequest}
          />
        )}

        {view === 'daily_mock' && (
          <DailyMockStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            pushEnabled={userProfile.pushEnabled}
            attempts={dailyMockAttempts}
            onRequestEmail={setEmailRequest}
            onOpenRemindersDrawer={() => setNotifDrawerOpen(true)}
          />
        )}

        {view === 'final' && (
          <FinalAssessmentStudio
            user={user}
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            defaultCollege={userProfile.college}
            finalDoc={finalAssessment}
            coreProgress={progress}
            advProgress={advProgress}
            advAvgScore={advAvgScore}
            shoppingProgress={shoppingProgress}
            onNavigateView={handleNavigateView}
            onRequestEmail={setEmailRequest}
          />
        )}

        {view === 'achievements' && (
          <AchievementsCertificate
            learnerName={learnerName}
            learnerEmail={user.email || ''}
            progress={progress}
            shoppingProgress={shoppingProgress}
            onNavigateToLevels={(lvl) => handleNavigateView('levels', lvl)}
            onRequestEmail={setEmailRequest}
          />
        )}

        {view === 'profile' && (
          <MyProfileStudio
            user={user}
            profile={userProfile}
            progress={progress}
            shoppingProgress={shoppingProgress}
            careerProgress={careerProgress}
            masterProgress={masterProgress}
            advProgress={advProgress}
            advAvgScore={advAvgScore}
            finalAssessment={finalAssessment}
            audit={sectionAudit}
            onRequestEmail={setEmailRequest}
            onNavigateView={(target: NotificationTargetView, lvl?: number) =>
              handleNavigateView(target as AppView, lvl)
            }
          />
        )}

        {/* Per-Section Learner Feedback Bar — Feeds Mentor Kapil's Admin Feedback Reports */}
        {view !== 'profile' && (
          <div className="no-print pt-4">
            <SectionFeedbackBar
              user={user}
              sectionId={view as FeedbackSectionId}
              sectionLabel={FEEDBACK_SECTION_LABELS[view as FeedbackSectionId]}
              subTopic={feedbackSubTopic}
            />
          </div>
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

      <NotificationCenterDrawer
        open={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        user={user}
        profile={userProfile}
        audit={sectionAudit}
        notifications={notifications}
        dailyMockAttempts={dailyMockAttempts}
        onNavigateView={(target, lvl) =>
          handleNavigateView(target as AppView, lvl)
        }
        onRequestEmail={(req) => {
          setNotifDrawerOpen(false);
          setEmailRequest(req);
        }}
      />

      <AdminDashboard
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        currentUser={user}
        onRequestEmail={setEmailRequest}
      />

      <EmailCredentialModal
        user={user}
        request={emailRequest}
        onClose={() => setEmailRequest(null)}
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
