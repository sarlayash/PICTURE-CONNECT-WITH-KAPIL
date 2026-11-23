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
  BODY_LANGUAGE_MCQS,
  BODY_LANGUAGE_SCENARIOS,
  computeBodyLanguageBadges,
  getBodyLanguageRank,
} from '../data/bodyLanguageData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export interface BodyLanguageProgressDoc {
  ownerId: string;
  authorName: string;
  authorEmail: string;
  bodyXp: number;
  exploredScenarios: string[];
  solvedChallenges: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  mcqChoices: number[];
  unlockedBodyBadges: string[];
  bodyCertificateId: string;
  updatedAtMs?: number;
}

export interface AdminBodyLanguageSummary extends BodyLanguageProgressDoc {
  rankTitle: string;
  accuracyPct: number;
}

export function buildBodyLanguageCertificateId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `BLWK-2026-${clean}`;
}

export function createDefaultBodyLanguageProgress(
  uid: string,
  authorName = 'Verified Learner',
  authorEmail = ''
): BodyLanguageProgressDoc {
  return {
    ownerId: uid,
    authorName,
    authorEmail,
    bodyXp: 0,
    exploredScenarios: [],
    solvedChallenges: [],
    answeredMcqs: [],
    correctMcqs: [],
    hintUsedMcqs: [],
    mcqChoices: Array(BODY_LANGUAGE_MCQS.length).fill(-1),
    unlockedBodyBadges: [],
    bodyCertificateId: buildBodyLanguageCertificateId(uid),
  };
}

function mapBodyLanguageDoc(
  uid: string,
  data: Record<string, unknown>
): BodyLanguageProgressDoc {
  const rawChoices = Array.isArray(data.mcqChoices)
    ? data.mcqChoices.slice(0, BODY_LANGUAGE_MCQS.length).map((n) => {
        const val = Number(n);
        return Number.isFinite(val) && val >= -1 && val <= 3 ? Math.floor(val) : -1;
      })
    : Array(BODY_LANGUAGE_MCQS.length).fill(-1);
  while (rawChoices.length < BODY_LANGUAGE_MCQS.length) rawChoices.push(-1);

  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;

  return {
    ownerId: String(data.ownerId || uid),
    authorName: String(data.authorName || 'Verified Learner'),
    authorEmail: String(data.authorEmail || ''),
    bodyXp: Number(data.bodyXp || 0),
    exploredScenarios: Array.isArray(data.exploredScenarios)
      ? data.exploredScenarios.map(String).slice(0, 12)
      : [],
    solvedChallenges: Array.isArray(data.solvedChallenges)
      ? data.solvedChallenges.map(String).slice(0, 12)
      : [],
    answeredMcqs: Array.isArray(data.answeredMcqs)
      ? data.answeredMcqs.map(String).slice(0, 15)
      : [],
    correctMcqs: Array.isArray(data.correctMcqs)
      ? data.correctMcqs.map(String).slice(0, 15)
      : [],
    hintUsedMcqs: Array.isArray(data.hintUsedMcqs)
      ? data.hintUsedMcqs.map(String).slice(0, 15)
      : [],
    mcqChoices: rawChoices,
    unlockedBodyBadges: Array.isArray(data.unlockedBodyBadges)
      ? data.unlockedBodyBadges.map(String).slice(0, 8)
      : [],
    bodyCertificateId: String(
      data.bodyCertificateId || buildBodyLanguageCertificateId(uid)
    ),
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

function recalculateTotalBodyXp(state: {
  exploredScenarios: string[];
  solvedChallenges: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
}): number {
  const scenarioXp = Math.min(6, state.exploredScenarios.length) * 15;
  const challengeXp = Math.min(6, state.solvedChallenges.length) * 30;
  const mcqXp = BODY_LANGUAGE_MCQS.reduce((acc, q) => {
    if (!state.answeredMcqs.includes(q.id)) return acc;
    if (state.correctMcqs.includes(q.id)) {
      return acc + (state.hintUsedMcqs.includes(q.id) ? q.xpWithHint : q.xpClean);
    }
    return acc + 5;
  }, 0);
  return Math.min(15000, scenarioXp + challengeXp + mcqXp);
}

async function persistBodyLanguageDoc(
  user: User,
  nextState: Omit<
    BodyLanguageProgressDoc,
    'ownerId' | 'authorName' | 'authorEmail'
  >
): Promise<void> {
  const path = `bodyLanguageProgress/${user.uid}`;
  const ref = doc(db, 'bodyLanguageProgress', user.uid);
  try {
    await setDoc(ref, {
      ownerId: user.uid,
      authorName:
        clip(user.displayName || user.email?.split('@')[0] || '', 100) ||
        'Verified Learner',
      authorEmail: clip(user.email || '', 160),
      bodyXp: Math.min(15000, Math.max(0, Math.round(nextState.bodyXp))),
      exploredScenarios: nextState.exploredScenarios.slice(0, 12),
      solvedChallenges: nextState.solvedChallenges.slice(0, 12),
      answeredMcqs: nextState.answeredMcqs.slice(0, 15),
      correctMcqs: nextState.correctMcqs.slice(0, 15),
      hintUsedMcqs: nextState.hintUsedMcqs.slice(0, 15),
      mcqChoices: nextState.mcqChoices.slice(0, 15),
      unlockedBodyBadges: nextState.unlockedBodyBadges.slice(0, 8),
      bodyCertificateId:
        nextState.bodyCertificateId || buildBodyLanguageCertificateId(user.uid),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeBodyLanguageProgress(
  user: User,
  onData: (docData: BodyLanguageProgressDoc) => void
): () => void {
  const path = `bodyLanguageProgress/${user.uid}`;
  const ref = doc(db, 'bodyLanguageProgress', user.uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(mapBodyLanguageDoc(user.uid, snap.data()));
      } else {
        onData(
          createDefaultBodyLanguageProgress(
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

export async function markBodyScenarioExplored(params: {
  user: User;
  current: BodyLanguageProgressDoc;
  scenarioId: string;
}): Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }> {
  const { user, current, scenarioId } = params;
  const cleanId = clip(scenarioId, 40);
  if (current.exploredScenarios.includes(cleanId)) {
    return { newlyAwardedXp: 0, newlyUnlockedBadges: [] };
  }

  const nextExplored = [...current.exploredScenarios, cleanId].slice(0, 12);
  const nextXp = recalculateTotalBodyXp({
    exploredScenarios: nextExplored,
    solvedChallenges: current.solvedChallenges,
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
    hintUsedMcqs: current.hintUsedMcqs,
  });
  const xpGain = Math.max(0, nextXp - current.bodyXp);

  const computedBadges = computeBodyLanguageBadges({
    exploredScenarios: nextExplored,
    solvedChallenges: current.solvedChallenges,
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
  });
  const mergedBadges = Array.from(
    new Set([...current.unlockedBodyBadges, ...computedBadges])
  ).slice(0, 8);
  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedBodyBadges.includes(b)
  );

  await persistBodyLanguageDoc(user, {
    ...current,
    bodyXp: nextXp,
    exploredScenarios: nextExplored,
    unlockedBodyBadges: mergedBadges,
  });

  return { newlyAwardedXp: xpGain, newlyUnlockedBadges };
}

export async function submitBodyChallengeChoice(params: {
  user: User;
  current: BodyLanguageProgressDoc;
  scenarioId: string;
  chosenOption: number;
}): Promise<{
  isCorrect: boolean;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const { user, current, scenarioId, chosenOption } = params;
  const scenario = BODY_LANGUAGE_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) {
    throw new Error('Invalid Body Language scenario ID.');
  }

  const isCorrect = chosenOption === scenario.challenge.correctIndex;
  if (!isCorrect) {
    return { isCorrect: false, newlyAwardedXp: 0, newlyUnlockedBadges: [] };
  }

  const cleanId = clip(scenarioId, 40);
  const alreadySolved = current.solvedChallenges.includes(cleanId);
  if (alreadySolved) {
    return { isCorrect: true, newlyAwardedXp: 0, newlyUnlockedBadges: [] };
  }

  const nextExplored = current.exploredScenarios.includes(cleanId)
    ? current.exploredScenarios
    : [...current.exploredScenarios, cleanId].slice(0, 12);
  const nextSolved = [...current.solvedChallenges, cleanId].slice(0, 12);

  const nextXp = recalculateTotalBodyXp({
    exploredScenarios: nextExplored,
    solvedChallenges: nextSolved,
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
    hintUsedMcqs: current.hintUsedMcqs,
  });
  const xpGain = Math.max(0, nextXp - current.bodyXp);

  const computedBadges = computeBodyLanguageBadges({
    exploredScenarios: nextExplored,
    solvedChallenges: nextSolved,
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
  });
  const mergedBadges = Array.from(
    new Set([...current.unlockedBodyBadges, ...computedBadges])
  ).slice(0, 8);
  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedBodyBadges.includes(b)
  );

  await persistBodyLanguageDoc(user, {
    ...current,
    bodyXp: nextXp,
    exploredScenarios: nextExplored,
    solvedChallenges: nextSolved,
    unlockedBodyBadges: mergedBadges,
  });

  return {
    isCorrect: true,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export async function submitBodyMcqAnswer(params: {
  user: User;
  current: BodyLanguageProgressDoc;
  mcqIndex: number;
  chosenOption: number;
  usedHint: boolean;
}): Promise<{
  isCorrect: boolean;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const { user, current, mcqIndex, chosenOption, usedHint } = params;
  const item = BODY_LANGUAGE_MCQS[mcqIndex];
  if (!item) {
    throw new Error('Invalid Body Language MCQ index.');
  }

  if (current.answeredMcqs.includes(item.id)) {
    return {
      isCorrect: current.correctMcqs.includes(item.id),
      newlyAwardedXp: 0,
      newlyUnlockedBadges: [],
    };
  }

  const isCorrect = chosenOption === item.correctIndex;
  const nextAnswered = [...current.answeredMcqs, item.id].slice(0, 15);
  const nextCorrect = isCorrect
    ? [...current.correctMcqs, item.id].slice(0, 15)
    : current.correctMcqs;
  const nextHints =
    usedHint && !current.hintUsedMcqs.includes(item.id)
      ? [...current.hintUsedMcqs, item.id].slice(0, 15)
      : current.hintUsedMcqs;

  const nextChoices = [...current.mcqChoices];
  while (nextChoices.length < BODY_LANGUAGE_MCQS.length) nextChoices.push(-1);
  nextChoices[mcqIndex] = chosenOption;

  const nextXp = recalculateTotalBodyXp({
    exploredScenarios: current.exploredScenarios,
    solvedChallenges: current.solvedChallenges,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
  });
  const xpGain = Math.max(0, nextXp - current.bodyXp);

  const computedBadges = computeBodyLanguageBadges({
    exploredScenarios: current.exploredScenarios,
    solvedChallenges: current.solvedChallenges,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
  });
  const mergedBadges = Array.from(
    new Set([...current.unlockedBodyBadges, ...computedBadges])
  ).slice(0, 8);
  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedBodyBadges.includes(b)
  );

  await persistBodyLanguageDoc(user, {
    ...current,
    bodyXp: nextXp,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    mcqChoices: nextChoices,
    unlockedBodyBadges: mergedBadges,
  });

  return {
    isCorrect,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export async function resetBodyMcqTest(params: {
  user: User;
  current: BodyLanguageProgressDoc;
}): Promise<void> {
  const { user, current } = params;
  const nextXp = recalculateTotalBodyXp({
    exploredScenarios: current.exploredScenarios,
    solvedChallenges: current.solvedChallenges,
    answeredMcqs: [],
    correctMcqs: [],
    hintUsedMcqs: [],
  });

  await persistBodyLanguageDoc(user, {
    ...current,
    bodyXp: nextXp,
    answeredMcqs: [],
    correctMcqs: [],
    hintUsedMcqs: [],
    mcqChoices: Array(BODY_LANGUAGE_MCQS.length).fill(-1),
  });
}

export function subscribeAdminBodyLanguageData(
  onData: (byUid: Record<string, AdminBodyLanguageSummary>) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'bodyLanguageProgress'), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const out: Record<string, AdminBodyLanguageSummary> = {};
      snap.docs.forEach((d) => {
        const mapped = mapBodyLanguageDoc(d.id, d.data());
        const answered = mapped.answeredMcqs.length;
        const accuracyPct =
          answered > 0
            ? Math.round((mapped.correctMcqs.length / answered) * 100)
            : 0;
        out[d.id] = {
          ...mapped,
          rankTitle: getBodyLanguageRank(mapped.bodyXp).title,
          accuracyPct,
        };
      });
      onData(out);
    },
    (err) => {
      if (!auth.currentUser) return;
      onPermissionError(
        `Body Language stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}
