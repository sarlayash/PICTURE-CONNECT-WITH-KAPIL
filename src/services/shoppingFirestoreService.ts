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
  computeShoppingCategoryStats,
  evaluateNegotiationRoleplay,
  getShoppingRank,
  RoleplayEvaluation,
  SHOPPING_BADGES,
  SHOPPING_MCQS,
} from '../data/shoppingNegotiationData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export interface ShoppingProgressDoc {
  ownerId: string;
  authorName: string;
  authorEmail: string;
  shopXp: number;
  studiedExamples: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  mcqChoices: number[];
  roleplayDraft: string;
  roleplayScore: number;
  roleplayFeedback: string;
  unlockedShopBadges: string[];
  shopCertificateId: string;
  completedModule: boolean;
  updatedAtMs?: number;
}

export interface AdminShoppingUserSummary extends ShoppingProgressDoc {
  shopRankTitle: string;
  accuracyPct: number;
}

export function buildShopCertificateId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `SNCK-2026-${clean}`;
}

export function createDefaultShoppingProgress(
  uid: string,
  authorName = 'Verified Learner',
  authorEmail = ''
): ShoppingProgressDoc {
  return {
    ownerId: uid,
    authorName,
    authorEmail,
    shopXp: 0,
    studiedExamples: [],
    answeredMcqs: [],
    correctMcqs: [],
    hintUsedMcqs: [],
    mcqChoices: Array(SHOPPING_MCQS.length).fill(-1),
    roleplayDraft: '',
    roleplayScore: 0,
    roleplayFeedback: '',
    unlockedShopBadges: [],
    shopCertificateId: buildShopCertificateId(uid),
    completedModule: false,
  };
}

function mapShoppingDoc(
  uid: string,
  data: Record<string, unknown>
): ShoppingProgressDoc {
  const rawChoices = Array.isArray(data.mcqChoices)
    ? data.mcqChoices.slice(0, SHOPPING_MCQS.length).map((n) => {
        const val = Number(n);
        return Number.isFinite(val) && val >= -1 && val <= 3 ? Math.floor(val) : -1;
      })
    : Array(SHOPPING_MCQS.length).fill(-1);
  while (rawChoices.length < SHOPPING_MCQS.length) rawChoices.push(-1);

  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;

  return {
    ownerId: String(data.ownerId || uid),
    authorName: String(data.authorName || 'Verified Learner'),
    authorEmail: String(data.authorEmail || ''),
    shopXp: Number(data.shopXp || 0),
    studiedExamples: Array.isArray(data.studiedExamples)
      ? data.studiedExamples.map(String).slice(0, 80)
      : [],
    answeredMcqs: Array.isArray(data.answeredMcqs)
      ? data.answeredMcqs.map(String).slice(0, SHOPPING_MCQS.length)
      : [],
    correctMcqs: Array.isArray(data.correctMcqs)
      ? data.correctMcqs.map(String).slice(0, SHOPPING_MCQS.length)
      : [],
    hintUsedMcqs: Array.isArray(data.hintUsedMcqs)
      ? data.hintUsedMcqs.map(String).slice(0, SHOPPING_MCQS.length)
      : [],
    mcqChoices: rawChoices,
    roleplayDraft: String(data.roleplayDraft || ''),
    roleplayScore: Number(data.roleplayScore || 0),
    roleplayFeedback: String(data.roleplayFeedback || ''),
    unlockedShopBadges: Array.isArray(data.unlockedShopBadges)
      ? data.unlockedShopBadges.map(String).slice(0, 15)
      : [],
    shopCertificateId: String(
      data.shopCertificateId || buildShopCertificateId(uid)
    ),
    completedModule: Boolean(data.completedModule),
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

function computeBadges(params: {
  studiedExamples: string[];
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  roleplayScore: number;
  completedModule: boolean;
}): string[] {
  const hintSet = new Set(params.hintUsedMcqs);
  const cleanCorrectCount = params.correctMcqs.filter((id) => !hintSet.has(id)).length;
  const stats = computeShoppingCategoryStats({
    answeredMcqs: params.answeredMcqs,
    correctMcqs: params.correctMcqs,
    studiedExamples: params.studiedExamples,
  });

  return SHOPPING_BADGES.filter((b) =>
    b.checkUnlocked({
      studiedCount: params.studiedExamples.length,
      buyerCaseStudiedCount: stats.buyerCasesStudied,
      answeredCount: params.answeredMcqs.length,
      correctCount: params.correctMcqs.length,
      cleanCorrectCount,
      riddleCorrectCount: stats.byCategory.riddle.correct,
      buyerTypesCorrectCount: stats.byCategory.buyer_types.correct,
      domainsCorrectCount: stats.byCategory.domains.correct,
      dealsTimingCorrectCount: stats.byCategory.deals_timing.correct,
      roleplayScore: params.roleplayScore,
      completedModule: params.completedModule,
    })
  )
    .map((b) => b.id)
    .slice(0, 15);
}

async function persistShoppingDoc(
  user: User,
  nextState: Omit<ShoppingProgressDoc, 'ownerId' | 'authorName' | 'authorEmail'>
): Promise<void> {
  const path = `shoppingProgress/${user.uid}`;
  const ref = doc(db, 'shoppingProgress', user.uid);
  const safeAuthorName =
    clip(user.displayName || user.email?.split('@')[0] || '', 100) ||
    'Verified Learner';
  try {
    await setDoc(ref, {
      ownerId: user.uid,
      authorName: safeAuthorName,
      authorEmail: clip(user.email || '', 160),
      shopXp: Math.min(20000, Math.max(0, Math.round(nextState.shopXp))),
      studiedExamples: nextState.studiedExamples.slice(0, 80),
      answeredMcqs: nextState.answeredMcqs.slice(0, SHOPPING_MCQS.length),
      correctMcqs: nextState.correctMcqs.slice(0, SHOPPING_MCQS.length),
      hintUsedMcqs: nextState.hintUsedMcqs.slice(0, SHOPPING_MCQS.length),
      mcqChoices: nextState.mcqChoices.slice(0, SHOPPING_MCQS.length),
      roleplayDraft: clip(nextState.roleplayDraft, 1480),
      roleplayScore: Math.min(100, Math.max(0, Math.round(nextState.roleplayScore))),
      roleplayFeedback: clip(nextState.roleplayFeedback, 780),
      unlockedShopBadges: nextState.unlockedShopBadges.slice(0, 15),
      shopCertificateId:
        nextState.shopCertificateId || buildShopCertificateId(user.uid),
      completedModule: Boolean(nextState.completedModule),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeShoppingProgress(
  user: User,
  onData: (docData: ShoppingProgressDoc) => void
): () => void {
  const path = `shoppingProgress/${user.uid}`;
  const ref = doc(db, 'shoppingProgress', user.uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(mapShoppingDoc(user.uid, snap.data()));
      } else {
        onData(
          createDefaultShoppingProgress(
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

export async function markShoppingExampleStudied(params: {
  user: User;
  current: ShoppingProgressDoc;
  exampleId: string;
}): Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }> {
  const { user, current, exampleId } = params;
  const cleanId = clip(exampleId, 40);
  if (current.studiedExamples.includes(cleanId)) {
    return { newlyAwardedXp: 0, newlyUnlockedBadges: [] };
  }

  const nextStudied = [...current.studiedExamples, cleanId].slice(0, 80);
  // Up to 250 XP total for studying solved examples (+10 XP each for first 25)
  const xpGain = current.studiedExamples.length < 25 ? 10 : 0;
  const nextXp = current.shopXp + xpGain;

  const nextBadges = computeBadges({
    studiedExamples: nextStudied,
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
    hintUsedMcqs: current.hintUsedMcqs,
    roleplayScore: current.roleplayScore,
    completedModule: current.completedModule,
  });

  const newlyUnlockedBadges = nextBadges.filter(
    (b) => !current.unlockedShopBadges.includes(b)
  );

  await persistShoppingDoc(user, {
    ...current,
    shopXp: nextXp,
    studiedExamples: nextStudied,
    unlockedShopBadges: nextBadges,
  });

  return { newlyAwardedXp: xpGain, newlyUnlockedBadges };
}

export async function submitShoppingMcqAnswer(params: {
  user: User;
  current: ShoppingProgressDoc;
  mcqIndex: number;
  chosenOption: number;
  usedHint: boolean;
}): Promise<{
  isCorrect: boolean;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const { user, current, mcqIndex, chosenOption, usedHint } = params;
  const item = SHOPPING_MCQS[mcqIndex];
  if (!item) {
    throw new Error('Invalid question index.');
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

  const nextAnswered = [...current.answeredMcqs, item.id].slice(0, SHOPPING_MCQS.length);
  const nextCorrect = isCorrect
    ? [...current.correctMcqs, item.id].slice(0, SHOPPING_MCQS.length)
    : current.correctMcqs;
  const nextHints =
    usedHint && !current.hintUsedMcqs.includes(item.id)
      ? [...current.hintUsedMcqs, item.id].slice(0, SHOPPING_MCQS.length)
      : current.hintUsedMcqs;

  const nextChoices = [...current.mcqChoices];
  while (nextChoices.length < SHOPPING_MCQS.length) nextChoices.push(-1);
  nextChoices[mcqIndex] = chosenOption;

  const xpGain = isCorrect ? (usedHint ? item.xpWithHint : item.xpClean) : 5;
  const nextXp = current.shopXp + xpGain;
  const nextCompleted =
    current.completedModule ||
    (nextAnswered.length >= 20 && current.roleplayScore > 0) ||
    nextAnswered.length >= SHOPPING_MCQS.length;

  const nextBadges = computeBadges({
    studiedExamples: current.studiedExamples,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    roleplayScore: current.roleplayScore,
    completedModule: nextCompleted,
  });

  const newlyUnlockedBadges = nextBadges.filter(
    (b) => !current.unlockedShopBadges.includes(b)
  );

  await persistShoppingDoc(user, {
    ...current,
    shopXp: nextXp,
    answeredMcqs: nextAnswered,
    correctMcqs: nextCorrect,
    hintUsedMcqs: nextHints,
    mcqChoices: nextChoices,
    unlockedShopBadges: nextBadges,
    completedModule: nextCompleted,
  });

  return {
    isCorrect,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export async function submitNegotiationRoleplay(params: {
  user: User;
  current: ShoppingProgressDoc;
  roleplayDraft: string;
}): Promise<{
  evaluation: RoleplayEvaluation;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const { user, current, roleplayDraft } = params;
  const evaluation = evaluateNegotiationRoleplay(roleplayDraft);
  const isFirst = current.roleplayScore === 0;
  const xpGain = isFirst
    ? 100 + evaluation.totalScore
    : evaluation.totalScore > current.roleplayScore
    ? evaluation.totalScore - current.roleplayScore
    : 0;
  const bestScore = Math.max(current.roleplayScore, evaluation.totalScore);
  const nextXp = current.shopXp + xpGain;
  const nextCompleted =
    current.completedModule ||
    (current.answeredMcqs.length >= 20 && bestScore > 0) ||
    current.answeredMcqs.length >= SHOPPING_MCQS.length;

  const nextBadges = computeBadges({
    studiedExamples: current.studiedExamples,
    answeredMcqs: current.answeredMcqs,
    correctMcqs: current.correctMcqs,
    hintUsedMcqs: current.hintUsedMcqs,
    roleplayScore: bestScore,
    completedModule: nextCompleted,
  });

  const newlyUnlockedBadges = nextBadges.filter(
    (b) => !current.unlockedShopBadges.includes(b)
  );

  await persistShoppingDoc(user, {
    ...current,
    shopXp: nextXp,
    roleplayDraft: clip(roleplayDraft, 1480),
    roleplayScore: bestScore,
    roleplayFeedback: evaluation.feedback,
    unlockedShopBadges: nextBadges,
    completedModule: nextCompleted,
  });

  return {
    evaluation,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export function subscribeAdminShoppingData(
  onData: (byUid: Record<string, AdminShoppingUserSummary>) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'shoppingProgress'), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const out: Record<string, AdminShoppingUserSummary> = {};
      snap.docs.forEach((d) => {
        const mapped = mapShoppingDoc(d.id, d.data());
        const answered = mapped.answeredMcqs.length;
        const accuracyPct =
          answered > 0
            ? Math.round((mapped.correctMcqs.length / answered) * 100)
            : 0;
        out[d.id] = {
          ...mapped,
          shopRankTitle: getShoppingRank(mapped.shopXp).title,
          accuracyPct,
        };
      });
      onData(out);
    },
    (err) => {
      onPermissionError(
        `Shopping & Negotiation stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}
