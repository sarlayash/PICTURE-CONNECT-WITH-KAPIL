import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
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
import {
  DAILY_MOCK_CONFIG,
  DailyMockPaper,
  gradeDailyMockAttempt,
} from '../data/dailyMockData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

export interface DailyMockAttemptDoc {
  id: string;
  ownerId: string;
  authorName: string;
  authorEmail: string;
  dateKey: string;
  paperCode: string;
  status: 'in_progress' | 'submitted';
  startedAtMs: number;
  submittedAtMs: number;
  timeUsedSeconds: number;
  answers: number[];
  flaggedIndices: number[];
  totalQuestions: number;
  hardQuestionCount: number;
  answeredCount: number;
  correctCount: number;
  hardCorrectCount: number;
  standardCorrectCount: number;
  scorePercent: number;
  hardAccuracyPercent: number;
  passed: boolean;
  gradeLabel: string;
  xpAwarded: number;
  topicSummary: string;
  weakestTopic: string;
  strongestTopic: string;
  resultEmailed: boolean;
  updatedAtMs: number;
}

export function buildDailyMockAttemptId(uid: string, dateKey: string): string {
  return `${uid}_${dateKey}`;
}

function hydrateDailyMockDoc(
  id: string,
  raw: Record<string, unknown>
): DailyMockAttemptDoc {
  const answersRaw = Array.isArray(raw.answers) ? raw.answers : [];
  const answers = Array.from({ length: DAILY_MOCK_CONFIG.totalQuestions }, (_, i) => {
    const v = Number(answersRaw[i]);
    return Number.isInteger(v) && v >= -1 && v <= 3 ? v : -1;
  });

  const flaggedRaw = Array.isArray(raw.flaggedIndices) ? raw.flaggedIndices : [];
  const flaggedIndices = flaggedRaw
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v >= 0 && v < DAILY_MOCK_CONFIG.totalQuestions)
    .slice(0, 40);

  const updatedAtObj = raw.updatedAt as { toMillis?: () => number } | undefined;

  return {
    id,
    ownerId: String(raw.ownerId || ''),
    authorName: String(raw.authorName || 'Verified Learner'),
    authorEmail: String(raw.authorEmail || ''),
    dateKey: String(raw.dateKey || ''),
    paperCode: String(raw.paperCode || ''),
    status: raw.status === 'submitted' ? 'submitted' : 'in_progress',
    startedAtMs: Number(raw.startedAtMs) || 0,
    submittedAtMs: Number(raw.submittedAtMs) || 0,
    timeUsedSeconds: Math.min(3600, Math.max(0, Number(raw.timeUsedSeconds) || 0)),
    answers,
    flaggedIndices,
    totalQuestions: Number(raw.totalQuestions) || DAILY_MOCK_CONFIG.totalQuestions,
    hardQuestionCount: Number(raw.hardQuestionCount) || DAILY_MOCK_CONFIG.hardQuestions,
    answeredCount: Number(raw.answeredCount) || 0,
    correctCount: Number(raw.correctCount) || 0,
    hardCorrectCount: Number(raw.hardCorrectCount) || 0,
    standardCorrectCount: Number(raw.standardCorrectCount) || 0,
    scorePercent: Number(raw.scorePercent) || 0,
    hardAccuracyPercent: Number(raw.hardAccuracyPercent) || 0,
    passed: Boolean(raw.passed),
    gradeLabel: String(raw.gradeLabel || ''),
    xpAwarded: Number(raw.xpAwarded) || 0,
    topicSummary: String(raw.topicSummary || ''),
    weakestTopic: String(raw.weakestTopic || ''),
    strongestTopic: String(raw.strongestTopic || ''),
    resultEmailed: Boolean(raw.resultEmailed),
    updatedAtMs:
      typeof updatedAtObj?.toMillis === 'function'
        ? updatedAtObj.toMillis()
        : Number(raw.submittedAtMs) || Number(raw.startedAtMs) || 0,
  };
}

export function subscribeMyDailyMockAttempts(
  uid: string,
  onData: (attempts: DailyMockAttemptDoc[]) => void
): () => void {
  const q = query(
    collection(db, 'dailyMockAttempts'),
    where('ownerId', '==', uid),
    limit(60)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => hydrateDailyMockDoc(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
      onData(list);
    },
    (error) => {
      if (!auth.currentUser) return;
      handleFirestoreError(error, OperationType.LIST, 'dailyMockAttempts');
    }
  );
}

export function subscribeAllDailyMockAttempts(
  onData: (attempts: DailyMockAttemptDoc[]) => void,
  onError?: (errMsg: string) => void
): () => void {
  const q = query(collection(db, 'dailyMockAttempts'), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => hydrateDailyMockDoc(d.id, d.data() as Record<string, unknown>))
        .sort(
          (a, b) =>
            b.dateKey.localeCompare(a.dateKey) || b.updatedAtMs - a.updatedAtMs
        );
      onData(list);
    },
    (error) => {
      if (!auth.currentUser) return;
      if (onError) {
        onError(
          error instanceof Error
            ? `Daily Mock stream error: ${error.message}`
            : `Daily Mock stream error: ${String(error)}`
        );
      } else {
        handleFirestoreError(error, OperationType.LIST, 'dailyMockAttempts');
      }
    }
  );
}

export async function startOrResumeDailyMock(
  user: User,
  displayName: string,
  paper: DailyMockPaper
): Promise<DailyMockAttemptDoc> {
  const attemptId = buildDailyMockAttemptId(user.uid, paper.dateKey);
  const ref = doc(db, 'dailyMockAttempts', attemptId);
  const path = `dailyMockAttempts/${attemptId}`;

  try {
    const existingSnap = await getDoc(ref);
    if (existingSnap.exists()) {
      return hydrateDailyMockDoc(
        existingSnap.id,
        existingSnap.data() as Record<string, unknown>
      );
    }

    const nowMs = Date.now();
    const initialAnswers = Array.from(
      { length: paper.totalQuestions },
      () => -1
    );
    const payload = {
      ownerId: user.uid,
      authorName:
        (displayName || user.displayName || '').trim().slice(0, 100) ||
        'Verified Learner',
      authorEmail: (user.email || '').trim().slice(0, 160),
      dateKey: paper.dateKey,
      paperCode: paper.paperCode.slice(0, 40),
      status: 'in_progress' as const,
      startedAtMs: nowMs,
      submittedAtMs: 0,
      timeUsedSeconds: 0,
      answers: initialAnswers,
      flaggedIndices: [] as number[],
      totalQuestions: paper.totalQuestions,
      hardQuestionCount: paper.hardCount,
      answeredCount: 0,
      correctCount: 0,
      hardCorrectCount: 0,
      standardCorrectCount: 0,
      scorePercent: 0,
      hardAccuracyPercent: 0,
      passed: false,
      gradeLabel: '',
      xpAwarded: 0,
      topicSummary: '',
      weakestTopic: '',
      strongestTopic: '',
      resultEmailed: false,
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, payload);
    return hydrateDailyMockDoc(attemptId, {
      ...payload,
      updatedAtMs: nowMs,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveDailyMockProgress(
  attemptId: string,
  answers: number[],
  flaggedIndices: number[],
  timeUsedSeconds: number
): Promise<void> {
  const ref = doc(db, 'dailyMockAttempts', attemptId);
  const path = `dailyMockAttempts/${attemptId}`;
  const cleanAnswers = Array.from(
    { length: DAILY_MOCK_CONFIG.totalQuestions },
    (_, i) => {
      const v = Number(answers[i]);
      return Number.isInteger(v) && v >= -1 && v <= 3 ? v : -1;
    }
  );
  const cleanFlagged = Array.from(new Set(flaggedIndices))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < DAILY_MOCK_CONFIG.totalQuestions)
    .slice(0, 40);
  const answeredCount = cleanAnswers.filter((v) => v >= 0).length;

  try {
    await updateDoc(ref, {
      answers: cleanAnswers,
      flaggedIndices: cleanFlagged,
      answeredCount,
      timeUsedSeconds: Math.min(
        3600,
        Math.max(0, Math.round(timeUsedSeconds))
      ),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function submitDailyMockAttempt(params: {
  attemptId: string;
  authorName: string;
  paper: DailyMockPaper;
  answers: number[];
  flaggedIndices: number[];
  timeUsedSeconds: number;
}): Promise<{
  grade: ReturnType<typeof gradeDailyMockAttempt>;
  submittedAtMs: number;
}> {
  const ref = doc(db, 'dailyMockAttempts', params.attemptId);
  const path = `dailyMockAttempts/${params.attemptId}`;
  const cleanAnswers = Array.from(
    { length: params.paper.totalQuestions },
    (_, i) => {
      const v = Number(params.answers[i]);
      return Number.isInteger(v) && v >= -1 && v <= 3 ? v : -1;
    }
  );
  const cleanFlagged = Array.from(new Set(params.flaggedIndices))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < params.paper.totalQuestions)
    .slice(0, 40);

  const grade = gradeDailyMockAttempt(params.paper, cleanAnswers);
  const submittedAtMs = Date.now();
  const clampedTime = Math.min(
    3600,
    Math.max(0, Math.round(params.timeUsedSeconds))
  );

  try {
    await updateDoc(ref, {
      authorName:
        (params.authorName || '').trim().slice(0, 100) || 'Verified Learner',
      status: 'submitted',
      submittedAtMs,
      timeUsedSeconds: clampedTime,
      answers: cleanAnswers,
      flaggedIndices: cleanFlagged,
      answeredCount: grade.answeredCount,
      correctCount: grade.correctCount,
      hardCorrectCount: grade.hardCorrectCount,
      standardCorrectCount: grade.standardCorrectCount,
      scorePercent: grade.scorePercent,
      hardAccuracyPercent: grade.hardAccuracyPercent,
      passed: grade.passed,
      gradeLabel: grade.gradeLabel.slice(0, 40),
      xpAwarded: grade.xpAwarded,
      topicSummary: grade.topicSummary.slice(0, 800),
      weakestTopic: grade.weakestTopic.slice(0, 80),
      strongestTopic: grade.strongestTopic.slice(0, 80),
      updatedAt: serverTimestamp(),
    });
    return { grade, submittedAtMs };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markDailyMockResultEmailed(
  attemptId: string
): Promise<void> {
  const ref = doc(db, 'dailyMockAttempts', attemptId);
  const path = `dailyMockAttempts/${attemptId}`;
  try {
    await updateDoc(ref, {
      resultEmailed: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adminResetDailyMockAttempt(
  attemptId: string
): Promise<void> {
  const ref = doc(db, 'dailyMockAttempts', attemptId);
  const path = `dailyMockAttempts/${attemptId}`;
  try {
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Computes consecutive submitted Daily Mock days ending today (or yesterday if today not yet done).
 */
export function computeDailyMockStreak(
  attempts: DailyMockAttemptDoc[],
  todayDateKey: string
): number {
  const submittedDates = new Set(
    attempts.filter((a) => a.status === 'submitted').map((a) => a.dateKey)
  );
  if (submittedDates.size === 0) return 0;

  const parseKey = (k: string): Date => {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const fmtKey = (dt: Date): string => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  let cursor = parseKey(todayDateKey);
  if (!submittedDates.has(fmtKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!submittedDates.has(fmtKey(cursor))) return 0;
  }

  let streak = 0;
  while (submittedDates.has(fmtKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
