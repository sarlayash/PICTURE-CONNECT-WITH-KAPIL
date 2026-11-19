import { User } from 'firebase/auth';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  ADVANCED_BADGES,
  AdvancedChallenge,
  AdvancedThemeId,
  AutoScoreResult,
  getAdvancedRank,
  scoreAdvancedSubmission,
} from '../data/advancedTrackData';
import { db, handleFirestoreError, OperationType } from '../firebase';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export interface AdvancedProgressDoc {
  ownerId: string;
  advXp: number;
  totalScoreSum: number;
  completedChallenges: string[];
  unlockedAdvBadges: string[];
  advCertificateId: string;
}

export interface AdvancedSubmissionDoc {
  id: string;
  ownerId: string;
  authorName: string;
  challengeId: string;
  themeId: AdvancedThemeId;
  promptUsed: string;
  imageDataUrl: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
  scareSummary: string;
  totalScore: number;
  obsScore: number;
  reasonScore: number;
  creativityScore: number;
  actionScore: number;
  commScore: number;
  feedback: string;
  updatedAtMs?: number;
}

export interface AdminAdvancedUserSummary {
  ownerId: string;
  advXp: number;
  advRankTitle: string;
  totalScoreSum: number;
  completedChallenges: string[];
  avgScore: number;
  unlockedAdvBadges: string[];
  advCertificateId: string;
  submissions: AdvancedSubmissionDoc[];
  updatedAtMs: number;
}

export function buildAdvCertificateId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `APCK-2026-${clean}`;
}

export function createDefaultAdvancedProgress(uid: string): AdvancedProgressDoc {
  return {
    ownerId: uid,
    advXp: 0,
    totalScoreSum: 0,
    completedChallenges: [],
    unlockedAdvBadges: [],
    advCertificateId: buildAdvCertificateId(uid),
  };
}

export function subscribeAdvancedProgress(
  uid: string,
  onData: (progress: AdvancedProgressDoc) => void
): () => void {
  const path = `advancedProgress/${uid}`;
  const ref = doc(db, 'advancedProgress', uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          ownerId: uid,
          advXp: Number(data.advXp || 0),
          totalScoreSum: Number(data.totalScoreSum || 0),
          completedChallenges: Array.isArray(data.completedChallenges)
            ? data.completedChallenges.map(String).slice(0, 25)
            : [],
          unlockedAdvBadges: Array.isArray(data.unlockedAdvBadges)
            ? data.unlockedAdvBadges.map(String).slice(0, 15)
            : [],
          advCertificateId: String(
            data.advCertificateId || buildAdvCertificateId(uid)
          ),
        });
      } else {
        onData(createDefaultAdvancedProgress(uid));
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

function mapSubmissionSnapshot(
  docId: string,
  data: Record<string, unknown>
): AdvancedSubmissionDoc {
  const updatedAtObj = data.updatedAt as { toMillis?: () => number } | undefined;
  return {
    id: docId,
    ownerId: String(data.ownerId || ''),
    authorName: String(data.authorName || 'Verified Learner'),
    challengeId: String(data.challengeId || ''),
    themeId: (String(data.themeId || 'products') as AdvancedThemeId),
    promptUsed: String(data.promptUsed || ''),
    imageDataUrl: String(data.imageDataUrl || ''),
    answer1: String(data.answer1 || ''),
    answer2: String(data.answer2 || ''),
    answer3: String(data.answer3 || ''),
    answer4: String(data.answer4 || ''),
    answer5: String(data.answer5 || ''),
    scareSummary: String(data.scareSummary || ''),
    totalScore: Number(data.totalScore || 0),
    obsScore: Number(data.obsScore || 0),
    reasonScore: Number(data.reasonScore || 0),
    creativityScore: Number(data.creativityScore || 0),
    actionScore: Number(data.actionScore || 0),
    commScore: Number(data.commScore || 0),
    feedback: String(data.feedback || ''),
    updatedAtMs: updatedAtObj?.toMillis ? updatedAtObj.toMillis() : 0,
  };
}

export function subscribeAdvancedSubmissions(
  uid: string,
  onData: (byChallengeId: Record<string, AdvancedSubmissionDoc>) => void
): () => void {
  const path = 'advancedSubmissions';
  const q = query(
    collection(db, path),
    where('ownerId', '==', uid),
    limit(50)
  );

  return onSnapshot(
    q,
    (snap) => {
      const next: Record<string, AdvancedSubmissionDoc> = {};
      snap.docs.forEach((d) => {
        const mapped = mapSubmissionSnapshot(d.id, d.data());
        if (mapped.challengeId) {
          next[mapped.challengeId] = mapped;
        }
      });
      onData(next);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveAndScoreAdvancedChallenge(params: {
  user: User;
  challenge: AdvancedChallenge;
  currentProgress: AdvancedProgressDoc;
  existingSubmissions: Record<string, AdvancedSubmissionDoc>;
  promptUsed: string;
  imageDataUrl: string;
  answers: [string, string, string, string, string];
  scareSummary: string;
}): Promise<{
  scoreResult: AutoScoreResult;
  newlyAwardedXp: number;
  newlyUnlockedBadges: string[];
}> {
  const {
    user,
    challenge,
    currentProgress,
    existingSubmissions,
    promptUsed,
    imageDataUrl,
    answers,
    scareSummary,
  } = params;

  const cleanPrompt = clip(promptUsed, 1380);
  const cleanImage = imageDataUrl.slice(0, 278000);
  const cleanAnswers: [string, string, string, string, string] = [
    clip(answers[0], 1180),
    clip(answers[1], 1180),
    clip(answers[2], 1180),
    clip(answers[3], 1180),
    clip(answers[4], 1180),
  ];
  const cleanScare = clip(scareSummary, 1180);

  const scoreResult = scoreAdvancedSubmission({
    baseBrief: challenge.brief,
    promptUsed: cleanPrompt,
    hasImage: cleanImage.startsWith('data:image/'),
    answers: cleanAnswers,
    scareSummary: cleanScare,
  });

  const submissionId = `${user.uid}_${challenge.slug}`.slice(0, 128);
  const subPath = `advancedSubmissions/${submissionId}`;
  const subRef = doc(db, 'advancedSubmissions', submissionId);

  try {
    await setDoc(subRef, {
      ownerId: user.uid,
      authorName: clip(user.displayName || user.email?.split('@')[0] || 'Verified Learner', 100),
      challengeId: challenge.id,
      themeId: challenge.themeId,
      promptUsed: cleanPrompt,
      imageDataUrl: cleanImage,
      answer1: cleanAnswers[0],
      answer2: cleanAnswers[1],
      answer3: cleanAnswers[2],
      answer4: cleanAnswers[3],
      answer5: cleanAnswers[4],
      scareSummary: cleanScare,
      totalScore: scoreResult.totalScore,
      obsScore: scoreResult.obsScore,
      reasonScore: scoreResult.reasonScore,
      creativityScore: scoreResult.creativityScore,
      actionScore: scoreResult.actionScore,
      commScore: scoreResult.commScore,
      feedback: clip(scoreResult.feedback, 780),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, subPath);
  }

  // Recompute aggregate Advanced Track metrics safely (never touches Core Track)
  const previousSub = existingSubmissions[challenge.id];
  const isFirstCompletion = !currentProgress.completedChallenges.includes(challenge.id);
  const nextCompleted = isFirstCompletion
    ? [...currentProgress.completedChallenges, challenge.id].sort().slice(0, 25)
    : currentProgress.completedChallenges.slice(0, 25);

  const mergedScoresByChallenge: Record<string, number> = {};
  Object.values(existingSubmissions).forEach((s) => {
    mergedScoresByChallenge[s.challengeId] = s.totalScore;
  });
  mergedScoresByChallenge[challenge.id] = scoreResult.totalScore;

  const allScores = Object.values(mergedScoresByChallenge);
  const totalScoreSum = Math.min(
    2500,
    allScores.reduce((acc, s) => acc + s, 0)
  );
  const maxChallengeScore = allScores.length > 0 ? Math.max(...allScores) : 0;
  const avgScore =
    allScores.length > 0 ? Math.round(totalScoreSum / allScores.length) : 0;

  let xpGain = 0;
  if (isFirstCompletion) {
    xpGain = 100 + Math.round(scoreResult.totalScore * 0.5);
  } else if (previousSub && scoreResult.totalScore > previousSub.totalScore) {
    xpGain = Math.max(5, Math.round((scoreResult.totalScore - previousSub.totalScore) * 0.5));
  }

  const nextAdvXp = Math.min(25000, currentProgress.advXp + xpGain);
  const nextBadges = ADVANCED_BADGES.filter((b) =>
    b.checkUnlocked({
      completedChallenges: nextCompleted,
      maxChallengeScore,
      avgScore,
      advXp: nextAdvXp,
    })
  )
    .map((b) => b.id)
    .slice(0, 15);

  const newlyUnlockedBadges = nextBadges.filter(
    (b) => !currentProgress.unlockedAdvBadges.includes(b)
  );

  const progPath = `advancedProgress/${user.uid}`;
  const progRef = doc(db, 'advancedProgress', user.uid);
  try {
    await setDoc(progRef, {
      ownerId: user.uid,
      advXp: nextAdvXp,
      totalScoreSum,
      completedChallenges: nextCompleted,
      unlockedAdvBadges: nextBadges,
      advCertificateId:
        currentProgress.advCertificateId || buildAdvCertificateId(user.uid),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, progPath);
  }

  return {
    scoreResult,
    newlyAwardedXp: xpGain,
    newlyUnlockedBadges,
  };
}

export function subscribeAdminAdvancedData(
  onData: (byUid: Record<string, AdminAdvancedUserSummary>) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const progMap: Record<string, AdvancedProgressDoc & { updatedAtMs: number }> = {};
  const subsByOwner: Record<string, AdvancedSubmissionDoc[]> = {};

  const emit = () => {
    const allUids = new Set<string>([
      ...Object.keys(progMap),
      ...Object.keys(subsByOwner),
    ]);
    const out: Record<string, AdminAdvancedUserSummary> = {};
    allUids.forEach((uid) => {
      const p = progMap[uid] ?? {
        ...createDefaultAdvancedProgress(uid),
        updatedAtMs: 0,
      };
      const subs = subsByOwner[uid] ?? [];
      const count = Math.max(p.completedChallenges.length, subs.length);
      const avgScore = count > 0 ? Math.round(p.totalScoreSum / count) : 0;
      const latestSubMs = subs.reduce(
        (m, s) => Math.max(m, s.updatedAtMs ?? 0),
        0
      );
      out[uid] = {
        ownerId: uid,
        advXp: p.advXp,
        advRankTitle: getAdvancedRank(p.advXp).title,
        totalScoreSum: p.totalScoreSum,
        completedChallenges: p.completedChallenges,
        avgScore,
        unlockedAdvBadges: p.unlockedAdvBadges,
        advCertificateId: p.advCertificateId,
        submissions: subs.sort((a, b) => a.challengeId.localeCompare(b.challengeId)),
        updatedAtMs: Math.max(p.updatedAtMs, latestSubMs),
      };
    });
    onData(out);
  };

  const unsubProg = onSnapshot(
    query(collection(db, 'advancedProgress'), limit(500)),
    (snap) => {
      snap.docs.forEach((d) => {
        const data = d.data();
        progMap[d.id] = {
          ownerId: d.id,
          advXp: Number(data.advXp || 0),
          totalScoreSum: Number(data.totalScoreSum || 0),
          completedChallenges: Array.isArray(data.completedChallenges)
            ? data.completedChallenges.map(String)
            : [],
          unlockedAdvBadges: Array.isArray(data.unlockedAdvBadges)
            ? data.unlockedAdvBadges.map(String)
            : [],
          advCertificateId: String(
            data.advCertificateId || buildAdvCertificateId(d.id)
          ),
          updatedAtMs: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : 0,
        };
      });
      emit();
    },
    (err) => {
      onPermissionError(
        `Advanced Progress sync note: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );

  const unsubSubs = onSnapshot(
    query(collection(db, 'advancedSubmissions'), limit(1000)),
    (snap) => {
      Object.keys(subsByOwner).forEach((k) => delete subsByOwner[k]);
      snap.docs.forEach((d) => {
        const mapped = mapSubmissionSnapshot(d.id, d.data());
        if (!mapped.ownerId) return;
        if (!subsByOwner[mapped.ownerId]) subsByOwner[mapped.ownerId] = [];
        subsByOwner[mapped.ownerId].push(mapped);
      });
      emit();
    },
    (err) => {
      onPermissionError(
        `Advanced Submissions sync note: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );

  return () => {
    unsubProg();
    unsubSubs();
  };
}
