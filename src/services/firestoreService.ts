import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { BADGES, getLearnerRank, LEVELS } from '../data/workshopData';
import { db, handleFirestoreError, OperationType } from '../firebase';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export interface ConnectionPostDoc {
  id: string;
  authorId: string;
  authorName: string;
  kind: 'concept' | 'perspective' | 'challenge';
  promptRef: string;
  title: string;
  body: string;
  createdAtMs?: number;
}

export interface LearnerWorkspaceDoc {
  ownerId: string;
  act2Pitch?: string;
  act3StoryTitle?: string;
  act3StoryBeats?: string;
  act4Observed?: string;
  act4Missing?: string;
  act4BeforeAfter?: string;
  act5CeoSolution?: string;
  act7PitchName?: string;
  act7PitchTagline?: string;
  act7PitchAudience?: string;
  act7PitchUsps?: string;
  act7PitchScript?: string;
  act8Emotion?: string;
  act8Situation?: string;
  act8Perspective?: string;
  act8Response?: string;
  act9Proposal?: string;
  act10Theme?: string;
  act10Notes?: string;
}

export interface LearnerProgressDoc {
  ownerId: string;
  xp: number;
  completedLevels: number[];
  unlockedBadges: string[];
  wheelSpins: number;
  completedWheelPrompts: string[];
  certificateId: string;
}

export interface AdminUserRecord {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  rankTitle: string;
  xp: number;
  completedLevels: number[];
  unlockedBadges: string[];
  wheelSpins: number;
  completedWheelPrompts: string[];
  certificateId: string;
  wallPostsCount: number;
  workspace: LearnerWorkspaceDoc;
  posts: ConnectionPostDoc[];
  createdAtMs: number;
  lastActiveMs: number;
}

export function buildCertificateId(uid: string): string {
  const clean = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `PCK-2026-${clean}`;
}

export function createDefaultProgress(uid: string): LearnerProgressDoc {
  return {
    ownerId: uid,
    xp: 0,
    completedLevels: [],
    unlockedBadges: [],
    wheelSpins: 0,
    completedWheelPrompts: [],
    certificateId: buildCertificateId(uid),
  };
}

function computeUnlockedBadges(state: {
  completedLevels: number[];
  xp: number;
  wheelSpins: number;
  completedWheelPrompts: string[];
}): string[] {
  return BADGES.filter((b) => b.checkUnlocked(state))
    .map((b) => b.id)
    .slice(0, 20);
}

export async function ensureLearnerProgressDoc(uid: string): Promise<void> {
  const path = `learnerProgress/${uid}`;
  const ref = doc(db, 'learnerProgress', uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: uid,
        xp: 0,
        completedLevels: [],
        unlockedBadges: [],
        wheelSpins: 0,
        completedWheelPrompts: [],
        certificateId: buildCertificateId(uid),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function upsertUserAccount(user: User): Promise<void> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  const displayName = clip(user.displayName || user.email?.split('@')[0] || 'Learner', 100);
  const email = clip(user.email || '', 160);
  const photoURL = user.photoURL ? clip(user.photoURL, 500) : '';

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        displayName,
        email,
        ...(photoURL ? { photoURL } : {}),
        providerId: 'google.com',
        role: 'learner',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        displayName,
        ...(photoURL ? { photoURL } : {}),
        updatedAt: serverTimestamp(),
      });
    }
    await ensureLearnerProgressDoc(user.uid);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeConnections(
  onData: (items: ConnectionPostDoc[]) => void
): () => void {
  const path = 'connections';
  const q = query(
    collection(db, path),
    where('kind', 'in', ['concept', 'perspective', 'challenge']),
    limit(100)
  );

  return onSnapshot(
    q,
    (snap) => {
      const withTimes = snap.docs.map((d) => {
        const data = d.data();
        const createdAtMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : 0;
        return {
          createdAtMs,
          post: {
            id: d.id,
            authorId: String(data.authorId || ''),
            authorName: String(data.authorName || 'Verified Learner'),
            kind: (data.kind as ConnectionPostDoc['kind']) || 'concept',
            promptRef: String(data.promptRef || ''),
            title: String(data.title || ''),
            body: String(data.body || ''),
            createdAtMs,
          } satisfies ConnectionPostDoc,
        };
      });
      withTimes.sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(withTimes.map((entry) => entry.post));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createConnectionPost(
  user: User,
  kind: 'concept' | 'perspective' | 'challenge',
  promptRef: string,
  title: string,
  body: string
): Promise<void> {
  const path = 'connections';
  try {
    await addDoc(collection(db, path), {
      authorId: user.uid,
      authorName: clip(user.displayName || 'Verified Learner', 100),
      kind,
      promptRef: clip(promptRef, 80) || 'general',
      title: clip(title, 120),
      body: clip(body, 600),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeLearnerWorkspace(
  uid: string,
  onData: (workspace: LearnerWorkspaceDoc) => void
): () => void {
  const path = `learnerWorkspaces/${uid}`;
  const ref = doc(db, 'learnerWorkspaces', uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as LearnerWorkspaceDoc);
      } else {
        onData({ ownerId: uid });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveLearnerWorkspace(
  uid: string,
  patch: Partial<Omit<LearnerWorkspaceDoc, 'ownerId'>>
): Promise<void> {
  const path = `learnerWorkspaces/${uid}`;
  const ref = doc(db, 'learnerWorkspaces', uid);
  const sanitized: Record<string, unknown> = {
    ownerId: uid,
    updatedAt: serverTimestamp(),
  };

  const limits: Record<string, number> = {
    act2Pitch: 1000,
    act3StoryTitle: 160,
    act3StoryBeats: 1500,
    act4Observed: 500,
    act4Missing: 500,
    act4BeforeAfter: 800,
    act5CeoSolution: 1000,
    act7PitchName: 120,
    act7PitchTagline: 160,
    act7PitchAudience: 200,
    act7PitchUsps: 600,
    act7PitchScript: 1000,
    act8Emotion: 300,
    act8Situation: 300,
    act8Perspective: 300,
    act8Response: 500,
    act9Proposal: 1200,
    act10Theme: 200,
    act10Notes: 1200,
  };

  for (const [key, value] of Object.entries(patch)) {
    if (typeof value === 'string' && limits[key]) {
      sanitized[key] = value.slice(0, limits[key]);
    }
  }

  try {
    await setDoc(ref, sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeLearnerProgress(
  uid: string,
  onData: (progress: LearnerProgressDoc) => void
): () => void {
  const path = `learnerProgress/${uid}`;
  const ref = doc(db, 'learnerProgress', uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          ownerId: uid,
          xp: Number(data.xp || 0),
          completedLevels: Array.isArray(data.completedLevels)
            ? data.completedLevels.map(Number).filter((n) => n >= 1 && n <= 10)
            : [],
          unlockedBadges: Array.isArray(data.unlockedBadges)
            ? data.unlockedBadges.map(String)
            : [],
          wheelSpins: Number(data.wheelSpins || 0),
          completedWheelPrompts: Array.isArray(data.completedWheelPrompts)
            ? data.completedWheelPrompts.map(String)
            : [],
          certificateId: String(data.certificateId || buildCertificateId(uid)),
        });
      } else {
        onData(createDefaultProgress(uid));
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function awardLevelCompletion(
  uid: string,
  current: LearnerProgressDoc,
  levelNumber: number
): Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }> {
  const path = `learnerProgress/${uid}`;
  const ref = doc(db, 'learnerProgress', uid);
  const levelDef = LEVELS.find((l) => l.level === levelNumber);
  const xpGain = levelDef?.xpReward ?? 100;

  const alreadyDone = current.completedLevels.includes(levelNumber);
  const nextLevels = alreadyDone
    ? current.completedLevels
    : [...current.completedLevels, levelNumber].sort((a, b) => a - b).slice(0, 10);

  const nextXp = Math.min(50000, current.xp + (alreadyDone ? 0 : xpGain));
  const nextBadges = computeUnlockedBadges({
    completedLevels: nextLevels,
    xp: nextXp,
    wheelSpins: current.wheelSpins,
    completedWheelPrompts: current.completedWheelPrompts,
  });

  const newlyUnlockedBadges = nextBadges.filter(
    (b) => !current.unlockedBadges.includes(b)
  );

  try {
    await setDoc(ref, {
      ownerId: uid,
      xp: nextXp,
      completedLevels: nextLevels,
      unlockedBadges: nextBadges,
      wheelSpins: current.wheelSpins,
      completedWheelPrompts: current.completedWheelPrompts.slice(0, 50),
      certificateId: current.certificateId || buildCertificateId(uid),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  return {
    newlyAwardedXp: alreadyDone ? 0 : xpGain,
    newlyUnlockedBadges,
  };
}

export async function recordWheelCompletion(
  uid: string,
  current: LearnerProgressDoc,
  promptId: string,
  xpReward: number
): Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }> {
  const path = `learnerProgress/${uid}`;
  const ref = doc(db, 'learnerProgress', uid);

  const cleanPromptId = clip(promptId, 80);
  const alreadyCompleted = current.completedWheelPrompts.includes(cleanPromptId);
  const nextPrompts = alreadyCompleted
    ? current.completedWheelPrompts
    : [...current.completedWheelPrompts, cleanPromptId].slice(0, 50);

  const xpGain = alreadyCompleted ? 15 : xpReward;
  const nextXp = Math.min(50000, current.xp + xpGain);
  const nextSpins = Math.min(5000, current.wheelSpins + 1);

  const nextBadges = computeUnlockedBadges({
    completedLevels: current.completedLevels,
    xp: nextXp,
    wheelSpins: nextSpins,
    completedWheelPrompts: nextPrompts,
  });

  const newlyUnlockedBadges = nextBadges.filter(
    (b) => !current.unlockedBadges.includes(b)
  );

  try {
    await setDoc(ref, {
      ownerId: uid,
      xp: nextXp,
      completedLevels: current.completedLevels.slice(0, 10),
      unlockedBadges: nextBadges,
      wheelSpins: nextSpins,
      completedWheelPrompts: nextPrompts,
      certificateId: current.certificateId || buildCertificateId(uid),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }

  return {
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

/**
 * Real-time Admin Dashboard stream across /users, /learnerProgress, /learnerWorkspaces, and /connections.
 * Caller must be verified platform owner (kapilnarula27july@gmail.com) per Firestore rules.
 */
export function subscribeAdminLiveData(
  onData: (records: AdminUserRecord[], lastSyncMs: number) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const usersMap: Record<
    string,
    {
      uid: string;
      displayName: string;
      email: string;
      photoURL?: string;
      createdAtMs: number;
      updatedAtMs: number;
    }
  > = {};
  const progressMap: Record<string, LearnerProgressDoc & { updatedAtMs: number }> = {};
  const workspaceMap: Record<string, LearnerWorkspaceDoc & { updatedAtMs: number }> = {};
  const postsByAuthor: Record<string, ConnectionPostDoc[]> = {};

  const emitMerged = () => {
    const allUids = new Set<string>([
      ...Object.keys(usersMap),
      ...Object.keys(progressMap),
    ]);

    const records: AdminUserRecord[] = Array.from(allUids).map((uid) => {
      const user = usersMap[uid];
      const prog = progressMap[uid];
      const ws = workspaceMap[uid] ?? { ownerId: uid };
      const posts = postsByAuthor[uid] ?? [];
      const xp = prog?.xp ?? 0;
      const completedLevels = prog?.completedLevels ?? [];
      const unlockedBadges = prog?.unlockedBadges ?? [];
      const wheelSpins = prog?.wheelSpins ?? 0;
      const completedWheelPrompts = prog?.completedWheelPrompts ?? [];
      const lastActiveMs = Math.max(
        user?.updatedAtMs ?? 0,
        prog?.updatedAtMs ?? 0,
        ws?.updatedAtMs ?? 0
      );

      return {
        uid,
        displayName: user?.displayName || 'Verified Learner',
        email: user?.email || 'Hidden / Syncing',
        photoURL: user?.photoURL,
        rankTitle: getLearnerRank(xp).title,
        xp,
        completedLevels,
        unlockedBadges,
        wheelSpins,
        completedWheelPrompts,
        certificateId: prog?.certificateId || buildCertificateId(uid),
        wallPostsCount: posts.length,
        workspace: ws,
        posts,
        createdAtMs: user?.createdAtMs ?? 0,
        lastActiveMs,
      };
    });

    records.sort((a, b) => b.xp - a.xp || b.lastActiveMs - a.lastActiveMs);
    onData(records, Date.now());
  };

  const handleErr = (collectionName: string) => (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Admin stream error on ${collectionName}:`, message);
    onPermissionError(
      `Firestore denied access to "${collectionName}". Ensure you are signed in with the Admin Google account (kapilnarula27july@gmail.com).`
    );
  };

  const unsubUsers = onSnapshot(
    query(collection(db, 'users'), limit(500)),
    (snap) => {
      snap.docs.forEach((d) => {
        const data = d.data();
        usersMap[d.id] = {
          uid: d.id,
          displayName: String(data.displayName || 'Learner'),
          email: String(data.email || ''),
          photoURL: data.photoURL ? String(data.photoURL) : undefined,
          createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0,
          updatedAtMs: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 0,
        };
      });
      emitMerged();
    },
    handleErr('users')
  );

  const unsubProgress = onSnapshot(
    query(collection(db, 'learnerProgress'), limit(500)),
    (snap) => {
      snap.docs.forEach((d) => {
        const data = d.data();
        progressMap[d.id] = {
          ownerId: d.id,
          xp: Number(data.xp || 0),
          completedLevels: Array.isArray(data.completedLevels)
            ? data.completedLevels.map(Number).filter((n) => n >= 1 && n <= 10)
            : [],
          unlockedBadges: Array.isArray(data.unlockedBadges)
            ? data.unlockedBadges.map(String)
            : [],
          wheelSpins: Number(data.wheelSpins || 0),
          completedWheelPrompts: Array.isArray(data.completedWheelPrompts)
            ? data.completedWheelPrompts.map(String)
            : [],
          certificateId: String(data.certificateId || buildCertificateId(d.id)),
          updatedAtMs: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 0,
        };
      });
      emitMerged();
    },
    handleErr('learnerProgress')
  );

  const unsubWorkspaces = onSnapshot(
    query(collection(db, 'learnerWorkspaces'), limit(500)),
    (snap) => {
      snap.docs.forEach((d) => {
        const data = d.data();
        workspaceMap[d.id] = {
          ...(data as LearnerWorkspaceDoc),
          ownerId: d.id,
          updatedAtMs: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 0,
        };
      });
      emitMerged();
    },
    handleErr('learnerWorkspaces')
  );

  const unsubConnections = onSnapshot(
    query(
      collection(db, 'connections'),
      where('kind', 'in', ['concept', 'perspective', 'challenge']),
      limit(500)
    ),
    (snap) => {
      Object.keys(postsByAuthor).forEach((k) => delete postsByAuthor[k]);
      snap.docs.forEach((d) => {
        const data = d.data();
        const authorId = String(data.authorId || '');
        if (!authorId) return;
        if (!postsByAuthor[authorId]) postsByAuthor[authorId] = [];
        postsByAuthor[authorId].push({
          id: d.id,
          authorId,
          authorName: String(data.authorName || 'Learner'),
          kind: (data.kind as ConnectionPostDoc['kind']) || 'concept',
          promptRef: String(data.promptRef || ''),
          title: String(data.title || ''),
          body: String(data.body || ''),
          createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0,
        });
      });
      emitMerged();
    },
    handleErr('connections')
  );

  return () => {
    unsubUsers();
    unsubProgress();
    unsubWorkspaces();
    unsubConnections();
  };
}
