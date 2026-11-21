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
  CAREER_MCQS,
  CareerCategoryId,
  computeCareerBadges,
  computeCareerCategoryStats,
  getCareerSkillsRank,
} from '../data/careerSkillsData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export interface CareerSkillsProgressDoc {
  ownerId: string;
  authorName: string;
  authorEmail: string;
  careerXp: number;
  studiedTopics: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  mcqChoices: number[];
  completedCategories: CareerCategoryId[];
  unlockedCareerBadges: string[];
  careerCertificateId: string;
  updatedAtMs?: number;
}

export interface AdminCareerSkillsSummary extends CareerSkillsProgressDoc {
  careerRankTitle: string;
  accuracyPct: number;
  indianismCorrect: number;
  interviewCorrect: number;
  gdCorrect: number;
}

export function buildCareerCertificateId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `CSWK-2026-${clean}`;
}

export function createDefaultCareerSkillsProgress(
  uid: string,
  authorName = 'Verified Learner',
  authorEmail = ''
): CareerSkillsProgressDoc {
  return {
    ownerId: uid,
    authorName,
    authorEmail,
    careerXp: 0,
    studiedTopics: [],
    answeredMcqs: [],
    correctMcqs: [],
    hintUsedMcqs: [],
    mcqChoices: Array(CAREER_MCQS.length).fill(-1),
    completedCategories: [],
    unlockedCareerBadges: [],
    careerCertificateId: buildCareerCertificateId(uid),
  };
}

function mapCareerDoc(
  uid: string,
  data: Record<string, unknown>
): CareerSkillsProgressDoc {
  const rawChoices = Array.isArray(data.mcqChoices)
    ? data.mcqChoices.slice(0, CAREER_MCQS.length).map((n) => {
        const val = Number(n);
        return Number.isFinite(val) && val >= -1 && val <= 3 ? Math.floor(val) : -1;
      })
    : Array(CAREER_MCQS.length).fill(-1);
  while (rawChoices.length < CAREER_MCQS.length) rawChoices.push(-1);

  const validCats: CareerCategoryId[] = ['indianism', 'interview', 'gd'];
  const completedCategories = Array.isArray(data.completedCategories)
    ? data.completedCategories
        .map(String)
        .filter((c): c is CareerCategoryId =>
          validCats.includes(c as CareerCategoryId)
        )
        .slice(0, 3)
    : [];

  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;

  return {
    ownerId: String(data.ownerId || uid),
    authorName: String(data.authorName || 'Verified Learner'),
    authorEmail: String(data.authorEmail || ''),
    careerXp: Number(data.careerXp || 0),
    studiedTopics: Array.isArray(data.studiedTopics)
      ? data.studiedTopics.map(String).slice(0, 35)
      : [],
    answeredMcqs: Array.isArray(data.answeredMcqs)
      ? data.answeredMcqs.map(String).slice(0, 45)
      : [],
    correctMcqs: Array.isArray(data.correctMcqs)
      ? data.correctMcqs.map(String).slice(0, 45)
      : [],
    hintUsedMcqs: Array.isArray(data.hintUsedMcqs)
      ? data.hintUsedMcqs.map(String).slice(0, 45)
      : [],
    mcqChoices: rawChoices,
    completedCategories,
    unlockedCareerBadges: Array.isArray(data.unlockedCareerBadges)
      ? data.unlockedCareerBadges.map(String).slice(0, 12)
      : [],
    careerCertificateId: String(
      data.careerCertificateId || buildCareerCertificateId(uid)
    ),
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

function deriveCompletedCategories(answeredMcqs: string[]): CareerCategoryId[] {
  const stats = computeCareerCategoryStats({
    answeredMcqs,
    correctMcqs: [],
    hintUsedMcqs: [],
  });
  const done: CareerCategoryId[] = [];
  if (stats.indianism.completed) done.push('indianism');
  if (stats.interview.completed) done.push('interview');
  if (stats.gd.completed) done.push('gd');
  return done;
}

async function persistCareerDoc(
  user: User,
  nextState: Omit<CareerSkillsProgressDoc, 'ownerId' | 'authorName' | 'authorEmail'>
): Promise<void> {
  const path = `careerSkillsProgress/${user.uid}`;
  const ref = doc(db, 'careerSkillsProgress', user.uid);
  try {
    await setDoc(ref, {
      ownerId: user.uid,
      authorName:
        clip(user.displayName || user.email?.split('@')[0] || '', 100) ||
        'Verified Learner',
      authorEmail: clip(user.email || '', 160),
      careerXp: Math.min(25000, Math.max(0, Math.round(nextState.careerXp))),
      studiedTopics: nextState.studiedTopics.slice(0, 35),
      answeredMcqs: nextState.answeredMcqs.slice(0, 45),
      correctMcqs: nextState.correctMcqs.slice(0, 45),
      hintUsedMcqs: nextState.hintUsedMcqs.slice(0, 45),
      mcqChoices: nextState.mcqChoices.slice(0, 45),
      completedCategories: nextState.completedCategories.slice(0, 3),
      unlockedCareerBadges: nextState.unlockedCareerBadges.slice(0, 12),
      careerCertificateId:
        nextState.careerCertificateId || buildCareerCertificateId(user.uid),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeCareerSkillsProgress(
  user: User,
  onData: (docData: CareerSkillsProgressDoc) => void
): () => void {
  const path = `careerSkillsProgress/${user.uid}`;
  const ref = doc(db, 'careerSkillsProgress', user.uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(mapCareerDoc(user.uid, snap.data()));
      } else {
        onData(
          createDefaultCareerSkillsProgress(
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

export async function markCareerTopicStudied(params: {
  user: User;
  current: CareerSkillsProgressDoc;
  topicId: string;
}): Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }> {
  const { user, current, topicId } = params;
  const cleanId = clip(topicId, 40);
  if (current.studiedTopics.includes(cleanId)) {
    return { newlyAwardedXp: 0, newlyUnlockedBadges: [] };
  }

  const nextStudied = [...current.studiedTopics, cleanId].slice(0, 35);
  // Up to 120 bonus XP for studying playbooks (+10 XP each for first 12 cards)
  const xpGain = current.studiedTopics.length < 12 ? 10 : 0;
  const nextXp = current.careerXp + xpGain;

  const computedBadges = computeCareerBadges({
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
    hintUsedMcqs: current.hintUsedMcqs,
    studiedTopics: nextStudied,
  });

  const mergedBadges = Array.from(
    new Set([...current.unlockedCareerBadges, ...computedBadges])
  ).slice(0, 12);

  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedCareerBadges.includes(b)
  );

  await persistCareerDoc(user, {
    ...current,
    careerXp: nextXp,
    studiedTopics: nextStudied,
    unlockedCareerBadges: mergedBadges,
  });

  return { newlyAwardedXp: xpGain, newlyUnlockedBadges };
}

export async function submitCareerMcqAnswer(params: {
  user: User;
  current: CareerSkillsProgressDoc;
  mcqIndex: number;
  chosenOption: number;
  usedHint: boolean;
}): Promise<{
  isCorrect: boolean;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const { user, current, mcqIndex, chosenOption, usedHint } = params;
  const item = CAREER_MCQS[mcqIndex];
  if (!item) {
    throw new Error('Invalid career MCQ index.');
  }

  const alreadyAnswered = current.answeredMcqs.includes(item.id);
  const isCorrect = chosenOption === item.correctIndex;

  if (alreadyAnswered) {
    return {
      isCorrect: current.correctMcqs.includes(item.id),
      newlyAwardedXp: 0,
      newlyUnlockedBadges: [],
    };
  }

  const nextAnswered = [...current.answeredMcqs, item.id].slice(0, 45);
  const nextCorrect = isCorrect
    ? [...current.correctMcqs, item.id].slice(0, 45)
    : current.correctMcqs;
  const nextHints =
    usedHint && !current.hintUsedMcqs.includes(item.id)
      ? [...current.hintUsedMcqs, item.id].slice(0, 45)
      : current.hintUsedMcqs;

  const nextChoices = [...current.mcqChoices];
  while (nextChoices.length < CAREER_MCQS.length) nextChoices.push(-1);
  nextChoices[mcqIndex] = chosenOption;

  const xpGain = isCorrect ? (usedHint ? item.xpWithHint : item.xpClean) : 5;
  const nextXp = Math.min(25000, current.careerXp + xpGain);
  const nextCompletedCats = deriveCompletedCategories(nextAnswered);

  const computedBadges = computeCareerBadges({
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    studiedTopics: current.studiedTopics,
  });

  const mergedBadges = Array.from(
    new Set([...current.unlockedCareerBadges, ...computedBadges])
  ).slice(0, 12);

  const newlyUnlockedBadges = mergedBadges.filter(
    (b) => !current.unlockedCareerBadges.includes(b)
  );

  await persistCareerDoc(user, {
    ...current,
    careerXp: nextXp,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    mcqChoices: nextChoices,
    completedCategories: nextCompletedCats,
    unlockedCareerBadges: mergedBadges,
  });

  return {
    isCorrect,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export async function resetCareerCategoryTest(params: {
  user: User;
  current: CareerSkillsProgressDoc;
  category: CareerCategoryId;
}): Promise<void> {
  const { user, current, category } = params;
  const catIds = new Set(
    CAREER_MCQS.filter((q) => q.category === category).map((q) => q.id)
  );

  const nextAnswered = current.answeredMcqs.filter((id) => !catIds.has(id));
  const nextCorrect = current.correctMcqs.filter((id) => !catIds.has(id));
  const nextHints = current.hintUsedMcqs.filter((id) => !catIds.has(id));

  const nextChoices = [...current.mcqChoices];
  while (nextChoices.length < CAREER_MCQS.length) nextChoices.push(-1);
  CAREER_MCQS.forEach((q, idx) => {
    if (q.category === category) {
      nextChoices[idx] = -1;
    }
  });

  // Preserve unlocked badges and recalculate XP cleanly from remaining correct answers so retakes cannot infinitely farm XP
  const remainingStudiedXp = Math.min(12, current.studiedTopics.length) * 10;
  const remainingMcqXp = CAREER_MCQS.reduce((acc, q) => {
    if (!nextAnswered.includes(q.id)) return acc;
    if (nextCorrect.includes(q.id)) {
      return acc + (nextHints.includes(q.id) ? q.xpWithHint : q.xpClean);
    }
    return acc + 5;
  }, 0);

  const nextCompletedCats = deriveCompletedCategories(nextAnswered);

  await persistCareerDoc(user, {
    ...current,
    careerXp: remainingStudiedXp + remainingMcqXp,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    mcqChoices: nextChoices,
    completedCategories: nextCompletedCats,
  });
}

export function subscribeAdminCareerSkillsData(
  onData: (byUid: Record<string, AdminCareerSkillsSummary>) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'careerSkillsProgress'), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const out: Record<string, AdminCareerSkillsSummary> = {};
      snap.docs.forEach((d) => {
        const mapped = mapCareerDoc(d.id, d.data());
        const stats = computeCareerCategoryStats({
          answeredMcqs: mapped.answeredMcqs,
          correctMcqs: mapped.correctMcqs,
          hintUsedMcqs: mapped.hintUsedMcqs,
        });
        const answered = mapped.answeredMcqs.length;
        const accuracyPct =
          answered > 0
            ? Math.round((mapped.correctMcqs.length / answered) * 100)
            : 0;
        out[d.id] = {
          ...mapped,
          careerRankTitle: getCareerSkillsRank(mapped.careerXp).title,
          accuracyPct,
          indianismCorrect: stats.indianism.correct,
          interviewCorrect: stats.interview.correct,
          gdCorrect: stats.gd.correct,
        };
      });
      onData(out);
    },
    (err) => {
      if (!auth.currentUser) return;
      onPermissionError(
        `Career Skills MCQ stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}
