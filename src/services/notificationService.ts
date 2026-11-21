import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { CAREER_MCQS } from '../data/careerSkillsData';
import { MASTER_MCQS } from '../data/masterUniverseData';
import { SHOPPING_MCQS } from '../data/shoppingNegotiationData';
import { VIDEO_CASE_STUDIES } from '../data/workshopData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

export type NotificationTargetView =
  | 'journey'
  | 'levels'
  | 'wheel'
  | 'shopping'
  | 'career'
  | 'universe'
  | 'advanced'
  | 'final'
  | 'achievements'
  | 'profile';

export type NotificationKind =
  | 'missing_reminder'
  | 'section_completed'
  | 'credential_emailed'
  | 'admin_reminder';

export type NotificationChannel =
  | 'in_app'
  | 'push'
  | 'email'
  | 'push_and_email';

export type CredentialEmailType =
  | ''
  | 'badge'
  | 'certificate'
  | 'lor'
  | 'reminder_digest';

export type ReminderFrequency = 'daily' | 'every_3_days' | 'weekly' | 'off';

export interface LearnerNotificationDoc {
  id: string;
  ownerId: string;
  recipientEmail: string;
  kind: NotificationKind;
  title: string;
  body: string;
  targetView: NotificationTargetView;
  credentialType: CredentialEmailType;
  channel: NotificationChannel;
  read: boolean;
  sentBy: 'system' | 'learner' | 'admin';
  createdAtMs: number;
}

export interface SectionAuditItem {
  id: string;
  title: string;
  targetView: NotificationTargetView;
  status: 'completed' | 'in_progress' | 'missing';
  percent: number;
  currentLabel: string;
  actionHint: string;
  nextLevelNum?: number;
}

export interface SectionAuditReport {
  items: SectionAuditItem[];
  completedItems: SectionAuditItem[];
  missingOrIncompleteItems: SectionAuditItem[];
  overallCompletionPct: number;
  completedCount: number;
  totalCount: number;
}

export interface ProgressAuditSnapshot {
  completedLevels: number[];
  completedWheelPrompts: string[];
  shoppingAnsweredCount: number;
  shoppingRoleplayScore: number;
  careerAnsweredCount: number;
  masterAnsweredCount: number;
  advCompletedCount: number;
  finalPassed: boolean;
  finalStatus: 'not_started' | 'in_progress' | 'submitted';
}

const VIDEO_IDS = new Set(VIDEO_CASE_STUDIES.map((v) => v.id));

/**
 * Pure audit engine computing exact missing, in-progress, and completed sections
 * across all 8 pillars of EMPLOYABILITY UNIVERSE With Kapil.
 */
export function computeSectionAudit(
  snapshot: ProgressAuditSnapshot
): SectionAuditReport {
  const levelsDone = Math.min(10, snapshot.completedLevels.length);
  let nextMissingLevel = 1;
  for (let lvl = 1; lvl <= 10; lvl++) {
    if (!snapshot.completedLevels.includes(lvl)) {
      nextMissingLevel = lvl;
      break;
    }
  }

  const videoDoneCount = snapshot.completedWheelPrompts.filter((id) =>
    VIDEO_IDS.has(id)
  ).length;
  const wheelPromptCount = snapshot.completedWheelPrompts.filter(
    (id) => !VIDEO_IDS.has(id)
  ).length;
  const wheelTotalForPrereq = snapshot.completedWheelPrompts.length;

  const shopTotal = SHOPPING_MCQS.length; // 50
  const shopAnswered = Math.min(shopTotal, snapshot.shoppingAnsweredCount);
  const shopComplete =
    shopAnswered >= shopTotal && snapshot.shoppingRoleplayScore >= 60;
  const shopPct = Math.round(
    (shopAnswered / shopTotal) * 80 +
      (snapshot.shoppingRoleplayScore >= 60 ? 20 : (snapshot.shoppingRoleplayScore / 60) * 20)
  );

  const careerTotal = CAREER_MCQS.length; // 45
  const careerAnswered = Math.min(careerTotal, snapshot.careerAnsweredCount);
  const careerPct = Math.round((careerAnswered / careerTotal) * 100);

  const masterTotal = MASTER_MCQS.length; // 160
  const masterAnswered = Math.min(masterTotal, snapshot.masterAnsweredCount);
  const masterPct = Math.round((masterAnswered / masterTotal) * 100);

  const advDone = Math.min(25, snapshot.advCompletedCount);
  const advPct = Math.round((advDone / 25) * 100);

  const finalPct = snapshot.finalPassed
    ? 100
    : snapshot.finalStatus === 'in_progress'
    ? 50
    : snapshot.finalStatus === 'submitted'
    ? 60
    : 0;

  const items: SectionAuditItem[] = [
    {
      id: 'levels',
      title: 'Core Visual Mastery (Levels 1–10)',
      targetView: 'levels',
      status:
        levelsDone >= 10
          ? 'completed'
          : levelsDone > 0
          ? 'in_progress'
          : 'missing',
      percent: Math.round((levelsDone / 10) * 100),
      currentLabel: `${levelsDone}/10 Levels completed`,
      actionHint:
        levelsDone >= 10
          ? 'All 10 executive levels completed!'
          : `Resume Level ${nextMissingLevel} to earn XP and unlock Core Badges.`,
      nextLevelNum: levelsDone < 10 ? nextMissingLevel : undefined,
    },
    {
      id: 'videos',
      title: 'Video Case Studies (5 Real Scenarios)',
      targetView: 'journey',
      status:
        videoDoneCount >= VIDEO_CASE_STUDIES.length
          ? 'completed'
          : videoDoneCount > 0
          ? 'in_progress'
          : 'missing',
      percent: Math.round((videoDoneCount / VIDEO_CASE_STUDIES.length) * 100),
      currentLabel: `${videoDoneCount}/${VIDEO_CASE_STUDIES.length} Videos reflected`,
      actionHint:
        videoDoneCount >= VIDEO_CASE_STUDIES.length
          ? 'All Video Case Studies completed!'
          : `Watch and reflect on ${VIDEO_CASE_STUDIES.length - videoDoneCount} remaining video case study${VIDEO_CASE_STUDIES.length - videoDoneCount > 1 ? 'ies' : ''}.`,
    },
    {
      id: 'wheel',
      title: 'Spinning Wheel Challenge (5+ Prompts)',
      targetView: 'wheel',
      status:
        wheelTotalForPrereq >= 5
          ? 'completed'
          : wheelTotalForPrereq > 0
          ? 'in_progress'
          : 'missing',
      percent: Math.min(100, Math.round((wheelTotalForPrereq / 5) * 100)),
      currentLabel: `${wheelTotalForPrereq}/5 Reflections (${wheelPromptCount} Wheel + ${videoDoneCount} Video)`,
      actionHint:
        wheelTotalForPrereq >= 5
          ? 'Final Exam prerequisite met!'
          : `Complete ${5 - wheelTotalForPrereq} more Wheel/Video reflection${5 - wheelTotalForPrereq > 1 ? 's' : ''} to satisfy Final Exam prerequisite.`,
    },
    {
      id: 'shopping',
      title: 'Shopping, Smart Buyer & Negotiation (50 MCQs + Lab)',
      targetView: 'shopping',
      status: shopComplete
        ? 'completed'
        : shopAnswered > 0 || snapshot.shoppingRoleplayScore > 0
        ? 'in_progress'
        : 'missing',
      percent: Math.min(100, shopPct),
      currentLabel: `${shopAnswered}/${shopTotal} MCQs · Lab ${snapshot.shoppingRoleplayScore}/100`,
      actionHint: shopComplete
        ? 'Shopping & Negotiation mastered!'
        : shopAnswered < shopTotal
        ? `Answer ${shopTotal - shopAnswered} remaining Shopping MCQs and score 60+ in the Negotiation Lab.`
        : 'Complete the Negotiation Role-Play Lab (60+/100) to finish this module.',
    },
    {
      id: 'career',
      title: 'Career Skills Academy (Indianism, Interview & GD)',
      targetView: 'career',
      status:
        careerAnswered >= careerTotal
          ? 'completed'
          : careerAnswered > 0
          ? 'in_progress'
          : 'missing',
      percent: careerPct,
      currentLabel: `${careerAnswered}/${careerTotal} Career MCQs`,
      actionHint:
        careerAnswered >= careerTotal
          ? 'All 45 Career Skills MCQs completed!'
          : `Complete ${careerTotal - careerAnswered} more MCQs across Indianism, Interview & GD Skills.`,
    },
    {
      id: 'universe',
      title: '16-Track Tech, Python, Grammar, DSA & Data Universe',
      targetView: 'universe',
      status:
        masterAnswered >= masterTotal
          ? 'completed'
          : masterAnswered > 0
          ? 'in_progress'
          : 'missing',
      percent: masterPct,
      currentLabel: `${masterAnswered}/${masterTotal} Universe MCQs`,
      actionHint:
        masterAnswered >= masterTotal
          ? 'All 16 Master Universe tracks completed!'
          : `Attempt ${masterTotal - masterAnswered} remaining FAANG/IT MCQs across Coding, Grammar, Aptitude & Data tracks.`,
    },
    {
      id: 'advanced',
      title: 'AI-Powered Visual Reasoning Track (25 Challenges)',
      targetView: 'advanced',
      status:
        advDone >= 25 ? 'completed' : advDone > 0 ? 'in_progress' : 'missing',
      percent: advPct,
      currentLabel: `${advDone}/25 Visual Challenges scored`,
      actionHint:
        advDone >= 25
          ? 'All 25 AI Visual Challenges scored!'
          : `Score ${25 - advDone} remaining AI challenges to unlock the 1000 XP Final Assessment.`,
    },
    {
      id: 'final',
      title: '1000 XP Proctored Final Capstone & Placement LOR',
      targetView: 'final',
      status: snapshot.finalPassed
        ? 'completed'
        : snapshot.finalStatus !== 'not_started'
        ? 'in_progress'
        : 'missing',
      percent: finalPct,
      currentLabel: snapshot.finalPassed
        ? 'Passed · Certificate & LOR Unlocked'
        : snapshot.finalStatus === 'in_progress'
        ? 'Attempt in progress'
        : snapshot.finalStatus === 'submitted'
        ? 'Submitted (Below 600 XP · Retake)'
        : 'Not yet attempted',
      actionHint: snapshot.finalPassed
        ? 'Email your Final Certificate & Placement LOR from Credentials!'
        : levelsDone >= 10 && wheelTotalForPrereq >= 5 && advDone >= 25
        ? 'Prerequisites unlocked! Start your 90-minute Final Assessment.'
        : 'Complete Levels 1–10, 5 Wheel/Video prompts, and 25 AI Challenges to unlock.',
    },
  ];

  const completedItems = items.filter((i) => i.status === 'completed');
  const missingOrIncompleteItems = items.filter((i) => i.status !== 'completed');
  const overallCompletionPct = Math.round(
    items.reduce((sum, item) => sum + item.percent, 0) / items.length
  );

  return {
    items,
    completedItems,
    missingOrIncompleteItems,
    overallCompletionPct,
    completedCount: completedItems.length,
    totalCount: items.length,
  };
}

export function getFrequencyIntervalMs(freq: ReminderFrequency): number {
  switch (freq) {
    case 'daily':
      return 24 * 60 * 60 * 1000;
    case 'every_3_days':
      return 3 * 24 * 60 * 60 * 1000;
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000;
    case 'off':
    default:
      return Number.POSITIVE_INFINITY;
  }
}

export function shouldTriggerScheduledReminder(params: {
  pushEnabled: boolean;
  reminderFrequency: ReminderFrequency;
  lastReminderAtMs: number;
  missingCount: number;
  nowMs?: number;
}): boolean {
  if (!params.pushEnabled) return false;
  if (params.reminderFrequency === 'off') return false;
  if (params.missingCount <= 0) return false;
  const now = params.nowMs ?? Date.now();
  const interval = getFrequencyIntervalMs(params.reminderFrequency);
  if (!params.lastReminderAtMs) return true;
  return now - params.lastReminderAtMs >= interval;
}

// ============================================================
// Browser Push Notification & Service Worker Utilities
// ============================================================

export function isPushNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission():
  | NotificationPermission
  | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

let swRegPromise: Promise<ServiceWorkerRegistration | null> | null = null;

export async function registerNotificationServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  if (!swRegPromise) {
    swRegPromise = navigator.serviceWorker
      .register('/sw-notifications.js')
      .then((reg) => reg)
      .catch(() => null);
  }
  return swRegPromise;
}

export async function requestBrowserPushPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (!isPushNotificationSupported()) return 'unsupported';
  try {
    await registerNotificationServiceWorker();
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return Notification.permission;
  }
}

export async function showBrowserPushNotification(params: {
  title: string;
  body: string;
  targetView?: NotificationTargetView;
  tag?: string;
}): Promise<{ delivered: boolean; via: 'service_worker' | 'window_api' | 'in_app_only' }> {
  if (!isPushNotificationSupported() || Notification.permission !== 'granted') {
    return { delivered: false, via: 'in_app_only' };
  }

  const options: NotificationOptions = {
    body: params.body,
    tag: params.tag || 'employability-universe-reminder',
    data: {
      targetView: params.targetView || 'journey',
      url: typeof window !== 'undefined' ? window.location.origin : '/',
    },
  };

  try {
    const reg = await registerNotificationServiceWorker();
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(params.title, options);
      return { delivered: true, via: 'service_worker' };
    }
  } catch {
    // Fallback to Notification constructor below
  }

  try {
    new Notification(params.title, options);
    return { delivered: true, via: 'window_api' };
  } catch {
    return { delivered: false, via: 'in_app_only' };
  }
}

// ============================================================
// Firestore CRUD for /learnerNotifications
// ============================================================

function clip(value: string, max: number): string {
  return String(value || '').trim().slice(0, max);
}

function mapNotificationDoc(
  id: string,
  data: Record<string, unknown>
): LearnerNotificationDoc {
  const createdObj = data.createdAt as { toMillis?: () => number } | undefined;
  return {
    id,
    ownerId: String(data.ownerId || ''),
    recipientEmail: String(data.recipientEmail || ''),
    kind: (String(data.kind || 'missing_reminder') as NotificationKind),
    title: String(data.title || 'Notification'),
    body: String(data.body || ''),
    targetView: (String(data.targetView || 'journey') as NotificationTargetView),
    credentialType: (String(data.credentialType || '') as CredentialEmailType),
    channel: (String(data.channel || 'in_app') as NotificationChannel),
    read: Boolean(data.read),
    sentBy: (String(data.sentBy || 'system') as 'system' | 'learner' | 'admin'),
    createdAtMs: createdObj?.toMillis ? createdObj.toMillis() : Date.now(),
  };
}

export async function logLearnerNotification(params: {
  user: User;
  kind: NotificationKind;
  title: string;
  body: string;
  targetView: NotificationTargetView;
  credentialType?: CredentialEmailType;
  channel: NotificationChannel;
  sentBy?: 'system' | 'learner';
}): Promise<string> {
  const path = 'learnerNotifications';
  const recipientEmail = clip(params.user.email || '', 160);
  if (!recipientEmail) {
    throw new Error('Verified sign-up email missing.');
  }

  try {
    const docRef = await addDoc(collection(db, 'learnerNotifications'), {
      ownerId: params.user.uid,
      recipientEmail,
      kind: params.kind,
      title: clip(params.title, 120) || 'Portal Notification',
      body: clip(params.body, 600) || 'Check your progress in EMPLOYABILITY UNIVERSE With Kapil.',
      targetView: params.targetView,
      credentialType: params.credentialType || '',
      channel: params.channel,
      read: false,
      sentBy: params.sentBy || 'system',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function adminSendReminderNotification(params: {
  targetUid: string;
  recipientEmail: string;
  title: string;
  body: string;
  targetView: NotificationTargetView;
  channel?: NotificationChannel;
}): Promise<string> {
  const path = 'learnerNotifications';
  try {
    const docRef = await addDoc(collection(db, 'learnerNotifications'), {
      ownerId: params.targetUid,
      recipientEmail: clip(params.recipientEmail, 160) || 'learner@unknown.local',
      kind: 'admin_reminder',
      title: clip(params.title, 120) || 'Mentor Kapil Reminder',
      body: clip(params.body, 600) || 'Complete your remaining sections to unlock badges and certificates.',
      targetView: params.targetView,
      credentialType: 'reminder_digest',
      channel: params.channel || 'in_app',
      read: false,
      sentBy: 'admin',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export function subscribeMyNotifications(
  uid: string,
  onData: (items: LearnerNotificationDoc[]) => void
): () => void {
  const q = query(
    collection(db, 'learnerNotifications'),
    where('ownerId', '==', uid),
    limit(60)
  );

  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapNotificationDoc(d.id, d.data()))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(items);
    },
    (error) => {
      if (!auth.currentUser) return;
      console.error('Notification stream error:', error);
    }
  );
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const path = `learnerNotifications/${notificationId}`;
  try {
    await updateDoc(doc(db, 'learnerNotifications', notificationId), {
      read: true,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markAllNotificationsRead(
  notifications: LearnerNotificationDoc[]
): Promise<void> {
  const unread = notifications.filter((n) => !n.read);
  await Promise.all(unread.map((n) => markNotificationRead(n.id)));
}

export function subscribeAdminNotifications(
  onData: (items: LearnerNotificationDoc[]) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'learnerNotifications'), limit(300));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapNotificationDoc(d.id, d.data()))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(items);
    },
    (err) => {
      if (!auth.currentUser) return;
      onPermissionError(
        `Notification logs stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}
