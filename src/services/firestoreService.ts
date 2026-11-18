import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  createInitialTeams,
  DEFAULT_PREP_CHECKLIST,
  PrepItem,
  RoundScore,
  TEAM_ROLES,
  TeamMember,
  TeamRecord,
  TeamRole,
} from '../data/workshopData';
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
}

export interface LearnerWorkspaceDoc {
  ownerId: string;
  act2Pitch?: string;
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
            authorName: String(data.authorName || 'Learner'),
            kind: (data.kind as ConnectionPostDoc['kind']) || 'concept',
            promptRef: String(data.promptRef || ''),
            title: String(data.title || ''),
            body: String(data.body || ''),
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

export function subscribePrepItems(
  uid: string,
  onData: (items: PrepItem[]) => void
): () => void {
  const path = 'prepItems';
  const q = query(collection(db, path), where('ownerId', '==', uid));

  return onSnapshot(
    q,
    (snap) => {
      const items: PrepItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          label: String(data.label || ''),
          category: String(data.category || 'Facilitation'),
          completed: Boolean(data.completed),
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function seedDefaultPrepItems(uid: string): Promise<void> {
  const path = 'prepItems';
  try {
    const batch = writeBatch(db);
    DEFAULT_PREP_CHECKLIST.forEach((item) => {
      const ref = doc(db, path, `${uid}_${item.id}`.slice(0, 128));
      batch.set(ref, {
        ownerId: uid,
        label: clip(item.label, 200),
        category: clip(item.category, 50),
        completed: false,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function togglePrepItemDoc(
  itemId: string,
  completed: boolean
): Promise<void> {
  const path = `prepItems/${itemId}`;
  try {
    await updateDoc(doc(db, 'prepItems', itemId), {
      completed,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function createPrepItemDoc(
  uid: string,
  label: string,
  category: string
): Promise<void> {
  const path = 'prepItems';
  try {
    await addDoc(collection(db, path), {
      ownerId: uid,
      label: clip(label, 200),
      category: clip(category, 50) || 'Facilitation',
      completed: false,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeChampionshipTeams(
  onData: (teams: TeamRecord[]) => void
): () => void {
  const teamsPath = 'teams';
  const qTeams = query(collection(db, teamsPath), orderBy('order', 'asc'));

  let currentTeams: { id: string; name: string; order: number }[] = [];
  const membersMap: Record<string, TeamMember[]> = {};
  const scoresMap: Record<string, RoundScore[]> = {};
  const subUnsubs: (() => void)[] = [];

  const emit = () => {
    onData(
      currentTeams.map((t) => ({
        id: t.id,
        name: t.name,
        members: membersMap[t.id] || [],
        scores: scoresMap[t.id] || [],
      }))
    );
  };

  const unsubTeams = onSnapshot(
    qTeams,
    (snap) => {
      subUnsubs.forEach((u) => u());
      subUnsubs.length = 0;

      currentTeams = snap.docs.map((d) => ({
        id: d.id,
        name: String(d.data().name || d.id),
        order: Number(d.data().order || 1),
      }));

      if (currentTeams.length === 0) {
        onData([]);
        return;
      }

      currentTeams.forEach((team) => {
        const memPath = `teams/${team.id}/members`;
        const qMembers = query(
          collection(db, memPath),
          where('spokeCount', '>=', 0)
        );
        const unsubM = onSnapshot(
          qMembers,
          (mSnap) => {
            membersMap[team.id] = mSnap.docs.map((md) => ({
              id: md.id,
              name: String(md.data().name || 'Learner'),
              role: (md.data().role as TeamRole) || 'Speaker',
              spokeCount: Number(md.data().spokeCount || 0),
            }));
            emit();
          },
          (err) => handleFirestoreError(err, OperationType.LIST, memPath)
        );

        const scorePath = `teams/${team.id}/scores`;
        const qScores = query(
          collection(db, scorePath),
          where('total', '>=', 0)
        );
        const unsubS = onSnapshot(
          qScores,
          (sSnap) => {
            scoresMap[team.id] = sSnap.docs.map((sd) => {
              const d = sd.data();
              return {
                id: sd.id,
                activityTitle: String(d.activityTitle || ''),
                judgePanel: {
                  studentJudge1: Number(d.studentJudge1 || 0),
                  studentJudge2: Number(d.studentJudge2 || 0),
                  facultyJudge: Number(d.facultyJudge || 0),
                },
                criteria: {
                  creativity: Number(d.creativity || 0),
                  logic: Number(d.logic || 0),
                  clarity: Number(d.clarity || 0),
                  participation: Number(d.participation || 0),
                  confidence: Number(d.confidence || 0),
                  time: Number(d.time || 0),
                },
                total: Number(d.total || 0),
                notes: String(d.notes || ''),
                recordedAt: d.createdAt?.toDate
                  ? d.createdAt
                      .toDate()
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Recorded',
              };
            });
            emit();
          },
          (err) => handleFirestoreError(err, OperationType.LIST, scorePath)
        );

        subUnsubs.push(unsubM, unsubS);
      });

      emit();
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, teamsPath);
    }
  );

  return () => {
    unsubTeams();
    subUnsubs.forEach((u) => u());
  };
}

export async function seedDefaultTeamsFirestore(): Promise<void> {
  const initial = createInitialTeams();
  const path = 'teams';
  try {
    for (let i = 0; i < initial.length; i += 1) {
      const team = initial[i];
      await setDoc(doc(db, 'teams', team.id), {
        name: clip(team.name, 80),
        order: i + 1,
        updatedAt: serverTimestamp(),
      });
      const batch = writeBatch(db);
      team.members.forEach((m) => {
        batch.set(doc(db, 'teams', team.id, 'members', m.id), {
          name: clip(m.name, 80),
          role: m.role,
          spokeCount: m.spokeCount,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTeamNameFirestore(
  teamId: string,
  name: string
): Promise<void> {
  const path = `teams/${teamId}`;
  try {
    await updateDoc(doc(db, 'teams', teamId), {
      name: clip(name, 80) || teamId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateTeamMemberFirestore(
  teamId: string,
  memberId: string,
  patch: Partial<{ name: string; role: TeamRole; spokeCount: number }>
): Promise<void> {
  const path = `teams/${teamId}/members/${memberId}`;
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.name !== undefined) payload.name = clip(patch.name, 80) || 'Learner';
  if (patch.role !== undefined) payload.role = patch.role;
  if (patch.spokeCount !== undefined) payload.spokeCount = Math.max(0, Math.min(500, patch.spokeCount));
  try {
    await updateDoc(doc(db, 'teams', teamId, 'members', memberId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addTeamMemberFirestore(
  teamId: string,
  name: string,
  role: TeamRole
): Promise<void> {
  const memberId = `${teamId}-m-${Date.now()}`;
  const path = `teams/${teamId}/members/${memberId}`;
  try {
    await setDoc(doc(db, 'teams', teamId, 'members', memberId), {
      name: clip(name, 80) || 'Learner',
      role,
      spokeCount: 0,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function rotateSpeakersFirestore(teams: TeamRecord[]): Promise<void> {
  const path = 'teams';
  try {
    const batch = writeBatch(db);
    teams.forEach((team) => {
      team.members.forEach((member, idx) => {
        const currentRoleIdx = TEAM_ROLES.indexOf(member.role);
        const nextRole =
          TEAM_ROLES[(currentRoleIdx + 1) % TEAM_ROLES.length] ??
          TEAM_ROLES[idx % TEAM_ROLES.length];
        batch.update(doc(db, 'teams', team.id, 'members', member.id), {
          role: nextRole,
          updatedAt: serverTimestamp(),
        });
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function recordTeamScoreFirestore(
  teamId: string,
  user: User,
  score: Omit<RoundScore, 'id' | 'recordedAt'>
): Promise<void> {
  const path = `teams/${teamId}/scores`;
  try {
    await addDoc(collection(db, 'teams', teamId, 'scores'), {
      activityTitle: clip(score.activityTitle, 120),
      studentJudge1: Math.max(0, Math.min(100, score.judgePanel.studentJudge1)),
      studentJudge2: Math.max(0, Math.min(100, score.judgePanel.studentJudge2)),
      facultyJudge: Math.max(0, Math.min(100, score.judgePanel.facultyJudge)),
      creativity: Math.max(0, Math.min(20, score.criteria.creativity)),
      logic: Math.max(0, Math.min(20, score.criteria.logic)),
      clarity: Math.max(0, Math.min(20, score.criteria.clarity)),
      participation: Math.max(0, Math.min(15, score.criteria.participation)),
      confidence: Math.max(0, Math.min(15, score.criteria.confidence)),
      time: Math.max(0, Math.min(10, score.criteria.time)),
      total: Math.max(0, Math.min(100, score.total)),
      notes: clip(score.notes, 400),
      recordedByUid: user.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteTeamScoreFirestore(
  teamId: string,
  scoreId: string
): Promise<void> {
  const path = `teams/${teamId}/scores/${scoreId}`;
  try {
    await deleteDoc(doc(db, 'teams', teamId, 'scores', scoreId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
