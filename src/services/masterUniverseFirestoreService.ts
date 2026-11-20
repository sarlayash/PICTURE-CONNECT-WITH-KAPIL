import { User } from 'firebase/auth';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  computeMasterBadges,
  computeMasterPillarStats,
  computeMasterTrackStats,
  getMasterUniverseRank,
  MASTER_MCQS,
  MASTER_TRACKS,
  MasterTrackId,
} from '../data/masterUniverseData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

const VALID_TRACK_IDS = new Set<MasterTrackId>(MASTER_TRACKS.map((t) => t.id));

export interface MasterSkillsProgressDoc {
  ownerId: string;
  authorName: string;
  authorEmail: string;
  masterXp: number;
  studiedPlaybooks: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  mcqChoices: number[];
  completedTracks: MasterTrackId[];
  unlockedMasterBadges: string[];
  masterCertificateId: string;
  updatedAtMs?: number;
}

export interface AdminMasterSkillsSummary extends MasterSkillsProgressDoc {
  masterRankTitle: string;
  accuracyPct: number;
  aptitudeGrammarCorrect: number;
  codingDsaCorrect: number;
  dataCloudCorrect: number;
  pythonCorrect: number;
  verbalExtendedCorrect: number;
}

export function buildMasterCertificateId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `EUWK-2026-${clean}`;
}

export function createDefaultMasterProgress(
  uid: string,
  authorName = 'Verified Learner',
  authorEmail = ''
): MasterSkillsProgressDoc {
  return {
    ownerId: uid,
    authorName,
    authorEmail,
    masterXp: 0,
    studiedPlaybooks: [],
    answeredMcqs: [],
    correctMcqs: [],
    hintUsedMcqs: [],
    mcqChoices: Array(MASTER_MCQS.length).fill(-1),
    completedTracks: [],
    unlockedMasterBadges: [],
    masterCertificateId: buildMasterCertificateId(uid),
  };
}

function mapMasterDoc(
  uid: string,
  data: Record<string, unknown>
): MasterSkillsProgressDoc {
  const rawChoices = Array.isArray(data.mcqChoices)
    ? data.mcqChoices.slice(0, MASTER_MCQS.length).map((n) => {
        const val = Number(n);
        return Number.isFinite(val) && val >= -1 && val <= 3 ? Math.floor(val) : -1;
      })
    : Array(MASTER_MCQS.length).fill(-1);
  while (rawChoices.length < MASTER_MCQS.length) rawChoices.push(-1);

  const completedTracks = Array.isArray(data.completedTracks)
    ? data.completedTracks
        .map(String)
        .filter((id): id is MasterTrackId =>
          VALID_TRACK_IDS.has(id as MasterTrackId)
        )
        .slice(0, 16)
    : [];

  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;

  return {
    ownerId: String(data.ownerId || uid),
    authorName: String(data.authorName || 'Verified Learner'),
    authorEmail: String(data.authorEmail || ''),
    masterXp: Number(data.masterXp || 0),
    studiedPlaybooks: Array.isArray(data.studiedPlaybooks)
      ? data.studiedPlaybooks.map(String).slice(0, 120)
      : [],
    answeredMcqs: Array.isArray(data.answeredMcqs)
      ? data.answeredMcqs.map(String).slice(0, 160)
      : [],
    correctMcqs: Array.isArray(data.correctMcqs)
      ? data.correctMcqs.map(String).slice(0, 160)
      : [],
    hintUsedMcqs: Array.isArray(data.hintUsedMcqs)
      ? data.hintUsedMcqs.map(String).slice(0, 160)
      : [],
    mcqChoices: rawChoices,
    completedTracks,
    unlockedMasterBadges: Array.isArray(data.unlockedMasterBadges)
      ? data.unlockedMasterBadges.map(String).slice(0, 12)
      : [],
    masterCertificateId: String(
      data.masterCertificateId || buildMasterCertificateId(uid)
    ),
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

function deriveCompletedTracks(answeredMcqs: string[]): MasterTrackId[] {
  const stats = computeMasterTrackStats({
    answeredMcqs,
    correctMcqs: [],
    hintUsedMcqs: [],
  });
  return MASTER_TRACKS.filter((t) => stats[t.id].completed).map((t) => t.id);
}

async function persistMasterDoc(
  user: User,
  nextState: Omit<MasterSkillsProgressDoc, 'ownerId' | 'authorName' | 'authorEmail'>
): Promise<void> {
  const path = `masterSkillsProgress/${user.uid}`;
  const ref = doc(db, 'masterSkillsProgress', user.uid);
  try {
    await setDoc(ref, {
      ownerId: user.uid,
      authorName:
        clip(
          user.displayName || user.email?.split('@')[0] || 'Verified Learner',
          100
        ) || 'Verified Learner',
      authorEmail: clip(user.email || '', 160),
      masterXp: Math.min(60000, Math.max(0, Math.round(nextState.masterXp))),
      studiedPlaybooks: nextState.studiedPlaybooks.slice(0, 120),
      answeredMcqs: nextState.answeredMcqs.slice(0, 160),
      correctMcqs: nextState.correctMcqs.slice(0, 160),
      hintUsedMcqs: nextState.hintUsedMcqs.slice(0, 160),
      mcqChoices: nextState.mcqChoices.slice(0, 160),
      completedTracks: nextState.completedTracks.slice(0, 16),
      unlockedMasterBadges: nextState.unlockedMasterBadges.slice(0, 12),
      masterCertificateId:
        nextState.masterCertificateId || buildMasterCertificateId(user.uid),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeMasterProgress(
  user: User,
  onData: (docData: MasterSkillsProgressDoc) => void
): () => void {
  const path = `masterSkillsProgress/${user.uid}`;
  const ref = doc(db, 'masterSkillsProgress', user.uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(mapMasterDoc(user.uid, snap.data()));
      } else {
        onData(
          createDefaultMasterProgress(
            user.uid,
            user.displayName || user.email?.split('@')[0] || 'Verified Learner',
            user.email || ''
          )
        );
      }
    },
    (error) => {
      if (!auth.currentUser) return;
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function markMasterPlaybookStudied(params: {
  user: User;
  current: MasterSkillsProgressDoc;
  playbookId: string;
}): Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }> {
  const { user, current, playbookId } = params;
  const cleanId = clip(playbookId, 40);
  if (current.studiedPlaybooks.includes(cleanId)) {
    return { newlyAwardedXp: 0, newlyUnlockedBadges: [] };
  }

  const nextStudied = [...current.studiedPlaybooks, cleanId].slice(0, 120);
  // Up to 240 bonus XP for studying playbooks (+5 XP for first 48 cards)
  const xpGain = current.studiedPlaybooks.length < 48 ? 5 : 0;
  const nextXp = Math.min(60000, current.masterXp + xpGain);

  const nextBadges = computeMasterBadges({
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
    hintUsedMcqs: current.hintUsedMcqs,
    studiedPlaybooks: nextStudied,
  });

  const mergedBadges = Array.from(
    new Set([...current.unlockedMasterBadges, ...nextBadges])
  ).slice(0, 12);

  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedMasterBadges.includes(b)
  );

  await persistMasterDoc(user, {
    ...current,
    masterXp: nextXp,
    studiedPlaybooks: nextStudied,
    unlockedMasterBadges: mergedBadges,
  });

  return { newlyAwardedXp: xpGain, newlyUnlockedBadges };
}

export async function submitMasterMcqAnswer(params: {
  user: User;
  current: MasterSkillsProgressDoc;
  mcqIndex: number;
  chosenOption: number;
  usedHint: boolean;
}): Promise<{
  isCorrect: boolean;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const { user, current, mcqIndex, chosenOption, usedHint } = params;
  const item = MASTER_MCQS[mcqIndex];
  if (!item) {
    throw new Error('Invalid Master Universe MCQ index.');
  }

  if (current.answeredMcqs.includes(item.id)) {
    return {
      isCorrect: current.correctMcqs.includes(item.id),
      newlyAwardedXp: 0,
      newlyUnlockedBadges: [],
    };
  }

  const isCorrect = chosenOption === item.correctIndex;
  const nextAnswered = [...current.answeredMcqs, item.id].slice(0, 160);
  const nextCorrect = isCorrect
    ? [...current.correctMcqs, item.id].slice(0, 160)
    : current.correctMcqs;
  const nextHints =
    usedHint && !current.hintUsedMcqs.includes(item.id)
      ? [...current.hintUsedMcqs, item.id].slice(0, 160)
      : current.hintUsedMcqs;

  const nextChoices = [...current.mcqChoices];
  while (nextChoices.length < MASTER_MCQS.length) nextChoices.push(-1);
  nextChoices[mcqIndex] = chosenOption;

  const xpGain = isCorrect ? (usedHint ? item.xpWithHint : item.xpClean) : 5;
  const nextXp = Math.min(60000, current.masterXp + xpGain);
  const nextCompletedTracks = deriveCompletedTracks(nextAnswered);

  const computedBadges = computeMasterBadges({
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    studiedPlaybooks: current.studiedPlaybooks,
  });
  const mergedBadges = Array.from(
    new Set([...current.unlockedMasterBadges, ...computedBadges])
  ).slice(0, 12);
  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedMasterBadges.includes(b)
  );

  await persistMasterDoc(user, {
    ...current,
    masterXp: nextXp,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    mcqChoices: nextChoices,
    completedTracks: nextCompletedTracks,
    unlockedMasterBadges: mergedBadges,
  });

  return {
    isCorrect,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export async function resetMasterTrackTest(params: {
  user: User;
  current: MasterSkillsProgressDoc;
  trackId: MasterTrackId;
}): Promise<void> {
  const { user, current, trackId } = params;
  const trackIds = new Set(
    MASTER_MCQS.filter((q) => q.trackId === trackId).map((q) => q.id)
  );

  const nextAnswered = current.answeredMcqs.filter((id) => !trackIds.has(id));
  const nextCorrect = current.correctMcqs.filter((id) => !trackIds.has(id));
  const nextHints = current.hintUsedMcqs.filter((id) => !trackIds.has(id));

  const nextChoices = [...current.mcqChoices];
  while (nextChoices.length < MASTER_MCQS.length) nextChoices.push(-1);
  MASTER_MCQS.forEach((q, idx) => {
    if (q.trackId === trackId) {
      nextChoices[idx] = -1;
    }
  });

  // Recalculate XP cleanly from remaining answers + studied playbooks so retakes never inflate XP
  const remainingStudiedXp = Math.min(48, current.studiedPlaybooks.length) * 5;
  const remainingMcqXp = MASTER_MCQS.reduce((acc, q) => {
    if (!nextAnswered.includes(q.id)) return acc;
    if (nextCorrect.includes(q.id)) {
      return acc + (nextHints.includes(q.id) ? q.xpWithHint : q.xpClean);
    }
    return acc + 5;
  }, 0);

  const nextCompletedTracks = deriveCompletedTracks(nextAnswered);

  await persistMasterDoc(user, {
    ...current,
    masterXp: remainingStudiedXp + remainingMcqXp,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    mcqChoices: nextChoices,
    completedTracks: nextCompletedTracks,
  });
}

export function subscribeAdminMasterData(
  onData: (byUid: Record<string, AdminMasterSkillsSummary>) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'masterSkillsProgress'), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const out: Record<string, AdminMasterSkillsSummary> = {};
      snap.docs.forEach((d) => {
        const mapped = mapMasterDoc(d.id, d.data());
        const trackStats = computeMasterTrackStats({
          answeredMcqs: mapped.answeredMcqs,
          correctMcqs: mapped.correctMcqs,
          hintUsedMcqs: mapped.hintUsedMcqs,
        });
        const pillarStats = computeMasterPillarStats(trackStats);
        const answered = mapped.answeredMcqs.length;
        const accuracyPct =
          answered > 0
            ? Math.round((mapped.correctMcqs.length / answered) * 100)
            : 0;
        out[d.id] = {
          ...mapped,
          masterRankTitle: getMasterUniverseRank(mapped.masterXp).title,
          accuracyPct,
          aptitudeGrammarCorrect: pillarStats.aptitude_grammar.correct,
          codingDsaCorrect: pillarStats.coding_dsa.correct,
          dataCloudCorrect: pillarStats.data_cloud.correct,
          pythonCorrect: trackStats.python_lang.correct,
          verbalExtendedCorrect:
            trackStats.tenses.correct +
            trackStats.punctuation.correct +
            trackStats.idioms.correct,
        };
      });
      onData(out);
    },
    (err) => {
      onPermissionError(
        `Master Universe MCQ stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}
