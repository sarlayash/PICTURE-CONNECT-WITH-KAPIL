import { User } from 'firebase/auth';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  CaseFieldKey,
  evaluateFinalPrerequisites,
  FINAL_ASSESSMENT_META,
  FinalGradeResult,
  gradeFinalAssessment,
} from '../data/finalAssessmentData';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { AdvancedProgressDoc } from './advancedFirestoreService';
import { LearnerProgressDoc } from './firestoreService';

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export interface FinalAssessmentDoc {
  ownerId: string;
  authorName: string;
  authorEmail: string;
  targetRole: string;
  collegeOrOrg: string;
  status: 'not_started' | 'in_progress' | 'submitted';
  attemptCount: number;
  startedAtMs: number;
  submittedAtMs: number;
  timeUsedSeconds: number;
  mcqAnswers: number[];
  c1a: string;
  c1b: string;
  c1c: string;
  c2a: string;
  c2b: string;
  c2c: string;
  c3a: string;
  c3b: string;
  c3c: string;
  c4a: string;
  c4b: string;
  c4c: string;
  c5a: string;
  c5b: string;
  c5c: string;
  capstoneScare: string;
  mcqScore: number;
  caseScore: number;
  scareScore: number;
  totalXpAwarded: number;
  percentageScore: number;
  passed: boolean;
  gradeTier: string;
  finalCertificateId: string;
  lorVerificationId: string;
  executiveFeedback: string;
  updatedAtMs?: number;
}

export function buildFinalCertificateId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `FPCK-2026-${clean}`;
}

export function buildLorVerificationId(uid: string): string {
  const clean =
    uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'LEARNER';
  return `LOR-PCK-2026-${clean}`;
}

export function createDefaultFinalAssessment(
  uid: string,
  authorName = 'Verified Learner',
  authorEmail = ''
): FinalAssessmentDoc {
  return {
    ownerId: uid,
    authorName,
    authorEmail,
    targetRole: '',
    collegeOrOrg: '',
    status: 'not_started',
    attemptCount: 0,
    startedAtMs: 0,
    submittedAtMs: 0,
    timeUsedSeconds: 0,
    mcqAnswers: Array(10).fill(-1),
    c1a: '',
    c1b: '',
    c1c: '',
    c2a: '',
    c2b: '',
    c2c: '',
    c3a: '',
    c3b: '',
    c3c: '',
    c4a: '',
    c4b: '',
    c4c: '',
    c5a: '',
    c5b: '',
    c5c: '',
    capstoneScare: '',
    mcqScore: 0,
    caseScore: 0,
    scareScore: 0,
    totalXpAwarded: 0,
    percentageScore: 0,
    passed: false,
    gradeTier: '',
    finalCertificateId: buildFinalCertificateId(uid),
    lorVerificationId: buildLorVerificationId(uid),
    executiveFeedback: '',
  };
}

function mapFinalDoc(
  uid: string,
  data: Record<string, unknown>
): FinalAssessmentDoc {
  const rawMcq = Array.isArray(data.mcqAnswers)
    ? data.mcqAnswers.slice(0, 10).map((n) => {
        const num = Number(n);
        return Number.isFinite(num) && num >= -1 && num <= 3 ? num : -1;
      })
    : Array(10).fill(-1);
  while (rawMcq.length < 10) rawMcq.push(-1);

  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;
  const status: FinalAssessmentDoc['status'] =
    data.status === 'submitted'
      ? 'submitted'
      : data.status === 'in_progress'
      ? 'in_progress'
      : 'not_started';
  const rawAttempt = Number(data.attemptCount);
  const attemptCount =
    Number.isFinite(rawAttempt) && rawAttempt >= 1
      ? Math.floor(rawAttempt)
      : status === 'not_started'
      ? 0
      : 1;

  return {
    ownerId: String(data.ownerId || uid),
    authorName: String(data.authorName || 'Verified Learner'),
    authorEmail: String(data.authorEmail || ''),
    targetRole: String(data.targetRole || ''),
    collegeOrOrg: String(data.collegeOrOrg || ''),
    status,
    attemptCount,
    startedAtMs: Number(data.startedAtMs || 0),
    submittedAtMs: Number(data.submittedAtMs || 0),
    timeUsedSeconds: Number(data.timeUsedSeconds || 0),
    mcqAnswers: rawMcq,
    c1a: String(data.c1a || ''),
    c1b: String(data.c1b || ''),
    c1c: String(data.c1c || ''),
    c2a: String(data.c2a || ''),
    c2b: String(data.c2b || ''),
    c2c: String(data.c2c || ''),
    c3a: String(data.c3a || ''),
    c3b: String(data.c3b || ''),
    c3c: String(data.c3c || ''),
    c4a: String(data.c4a || ''),
    c4b: String(data.c4b || ''),
    c4c: String(data.c4c || ''),
    c5a: String(data.c5a || ''),
    c5b: String(data.c5b || ''),
    c5c: String(data.c5c || ''),
    capstoneScare: String(data.capstoneScare || ''),
    mcqScore: Number(data.mcqScore || 0),
    caseScore: Number(data.caseScore || 0),
    scareScore: Number(data.scareScore || 0),
    totalXpAwarded: Number(data.totalXpAwarded || 0),
    percentageScore: Number(data.percentageScore || 0),
    passed: Boolean(data.passed),
    gradeTier: String(data.gradeTier || ''),
    finalCertificateId: String(
      data.finalCertificateId || buildFinalCertificateId(uid)
    ),
    lorVerificationId: String(
      data.lorVerificationId || buildLorVerificationId(uid)
    ),
    executiveFeedback: String(data.executiveFeedback || ''),
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

export function extractCaseResponses(
  docData: FinalAssessmentDoc
): Record<CaseFieldKey, string> {
  return {
    c1a: docData.c1a,
    c1b: docData.c1b,
    c1c: docData.c1c,
    c2a: docData.c2a,
    c2b: docData.c2b,
    c2c: docData.c2c,
    c3a: docData.c3a,
    c3b: docData.c3b,
    c3c: docData.c3c,
    c4a: docData.c4a,
    c4b: docData.c4b,
    c4c: docData.c4c,
    c5a: docData.c5a,
    c5b: docData.c5b,
    c5c: docData.c5c,
  };
}

export function subscribeFinalAssessment(
  user: User,
  onData: (docData: FinalAssessmentDoc) => void
): () => void {
  const path = `finalAssessments/${user.uid}`;
  const ref = doc(db, 'finalAssessments', user.uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(mapFinalDoc(user.uid, snap.data()));
      } else {
        onData(
          createDefaultFinalAssessment(
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

export async function startFinalAssessmentSession(params: {
  user: User;
  targetRole: string;
  collegeOrOrg: string;
  coreProgress: Pick<LearnerProgressDoc, 'completedLevels' | 'completedWheelPrompts'>;
  advProgress: Pick<AdvancedProgressDoc, 'completedChallenges'>;
}): Promise<number> {
  const { user, targetRole, collegeOrOrg, coreProgress, advProgress } = params;
  const prereq = evaluateFinalPrerequisites(coreProgress, advProgress);
  if (!prereq.eligible) {
    throw new Error(
      `Final Assessment is locked (${prereq.completedSections}/${prereq.totalSections} sections complete). ${prereq.missingSummary}`
    );
  }
  const path = `finalAssessments/${user.uid}`;
  const ref = doc(db, 'finalAssessments', user.uid);
  const startedAtMs = Date.now();

  try {
    await setDoc(ref, {
      ownerId: user.uid,
      authorName:
        clip(user.displayName || user.email?.split('@')[0] || '', 100) ||
        'Verified Learner',
      authorEmail: clip(user.email || 'verified@google.com', 160),
      targetRole: clip(targetRole, 120),
      collegeOrOrg: clip(collegeOrOrg, 120),
      status: 'in_progress',
      attemptCount: 1,
      startedAtMs,
      submittedAtMs: 0,
      timeUsedSeconds: 0,
      mcqAnswers: Array(10).fill(-1),
      c1a: '',
      c1b: '',
      c1c: '',
      c2a: '',
      c2b: '',
      c2c: '',
      c3a: '',
      c3b: '',
      c3c: '',
      c4a: '',
      c4b: '',
      c4c: '',
      c5a: '',
      c5b: '',
      c5c: '',
      capstoneScare: '',
      mcqScore: 0,
      caseScore: 0,
      scareScore: 0,
      totalXpAwarded: 0,
      percentageScore: 0,
      passed: false,
      gradeTier: '',
      finalCertificateId: buildFinalCertificateId(user.uid),
      lorVerificationId: buildLorVerificationId(user.uid),
      executiveFeedback: '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
  return startedAtMs;
}

export async function saveFinalAssessmentDraft(params: {
  user: User;
  targetRole: string;
  collegeOrOrg: string;
  mcqAnswers: number[];
  caseResponses: Record<CaseFieldKey, string>;
  capstoneScare: string;
}): Promise<void> {
  const {
    user,
    targetRole,
    collegeOrOrg,
    mcqAnswers,
    caseResponses,
    capstoneScare,
  } = params;
  const path = `finalAssessments/${user.uid}`;
  const ref = doc(db, 'finalAssessments', user.uid);

  const sanitizedMcq = mcqAnswers.slice(0, 10).map((n) => {
    const val = Number(n);
    return Number.isFinite(val) && val >= -1 && val <= 3 ? val : -1;
  });
  while (sanitizedMcq.length < 10) sanitizedMcq.push(-1);

  try {
    await updateDoc(ref, {
      authorName:
        clip(user.displayName || user.email?.split('@')[0] || '', 100) ||
        'Verified Learner',
      targetRole: clip(targetRole, 120),
      collegeOrOrg: clip(collegeOrOrg, 120),
      mcqAnswers: sanitizedMcq,
      c1a: clip(caseResponses.c1a, 1180),
      c1b: clip(caseResponses.c1b, 1180),
      c1c: clip(caseResponses.c1c, 1180),
      c2a: clip(caseResponses.c2a, 1180),
      c2b: clip(caseResponses.c2b, 1180),
      c2c: clip(caseResponses.c2c, 1180),
      c3a: clip(caseResponses.c3a, 1180),
      c3b: clip(caseResponses.c3b, 1180),
      c3c: clip(caseResponses.c3c, 1180),
      c4a: clip(caseResponses.c4a, 1180),
      c4b: clip(caseResponses.c4b, 1180),
      c4c: clip(caseResponses.c4c, 1180),
      c5a: clip(caseResponses.c5a, 1180),
      c5b: clip(caseResponses.c5b, 1180),
      c5c: clip(caseResponses.c5c, 1180),
      capstoneScare: clip(capstoneScare, 1480),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function submitFinalAssessment(params: {
  user: User;
  startedAtMs: number;
  targetRole: string;
  collegeOrOrg: string;
  mcqAnswers: number[];
  caseResponses: Record<CaseFieldKey, string>;
  capstoneScare: string;
}): Promise<FinalGradeResult> {
  const {
    user,
    startedAtMs,
    targetRole,
    collegeOrOrg,
    mcqAnswers,
    caseResponses,
    capstoneScare,
  } = params;
  const path = `finalAssessments/${user.uid}`;
  const ref = doc(db, 'finalAssessments', user.uid);

  const sanitizedMcq = mcqAnswers.slice(0, 10).map((n) => {
    const val = Number(n);
    return Number.isFinite(val) && val >= -1 && val <= 3 ? val : -1;
  });
  while (sanitizedMcq.length < 10) sanitizedMcq.push(-1);

  const cleanCases: Record<CaseFieldKey, string> = {
    c1a: clip(caseResponses.c1a, 1180),
    c1b: clip(caseResponses.c1b, 1180),
    c1c: clip(caseResponses.c1c, 1180),
    c2a: clip(caseResponses.c2a, 1180),
    c2b: clip(caseResponses.c2b, 1180),
    c2c: clip(caseResponses.c2c, 1180),
    c3a: clip(caseResponses.c3a, 1180),
    c3b: clip(caseResponses.c3b, 1180),
    c3c: clip(caseResponses.c3c, 1180),
    c4a: clip(caseResponses.c4a, 1180),
    c4b: clip(caseResponses.c4b, 1180),
    c4c: clip(caseResponses.c4c, 1180),
    c5a: clip(caseResponses.c5a, 1180),
    c5b: clip(caseResponses.c5b, 1180),
    c5c: clip(caseResponses.c5c, 1180),
  };
  const cleanScare = clip(capstoneScare, 1480);

  const grade = gradeFinalAssessment({
    mcqAnswers: sanitizedMcq,
    caseResponses: cleanCases,
    capstoneScare: cleanScare,
  });

  const submittedAtMs = Date.now();
  const elapsedSeconds =
    startedAtMs > 0
      ? Math.max(
          1,
          Math.min(
            FINAL_ASSESSMENT_META.durationSeconds,
            Math.round((submittedAtMs - startedAtMs) / 1000)
          )
        )
      : 0;

  try {
    await updateDoc(ref, {
      authorName:
        clip(user.displayName || user.email?.split('@')[0] || '', 100) ||
        'Verified Learner',
      targetRole: clip(targetRole, 120),
      collegeOrOrg: clip(collegeOrOrg, 120),
      status: 'submitted',
      submittedAtMs,
      timeUsedSeconds: elapsedSeconds,
      mcqAnswers: sanitizedMcq,
      ...cleanCases,
      capstoneScare: cleanScare,
      mcqScore: grade.mcqScore,
      caseScore: grade.caseScore,
      scareScore: grade.scareScore,
      totalXpAwarded: grade.totalXpAwarded,
      percentageScore: grade.percentageScore,
      passed: grade.passed,
      gradeTier: clip(grade.gradeTier, 60),
      executiveFeedback: clip(grade.executiveFeedback, 980),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }

  return grade;
}

export function canSelfRetryFinalAssessment(
  docData: Pick<FinalAssessmentDoc, 'status' | 'passed' | 'attemptCount'>
): boolean {
  return (
    docData.status === 'submitted' &&
    !docData.passed &&
    Math.max(1, docData.attemptCount || 1) < 2
  );
}

export async function retryFinalAssessmentSession(params: {
  user: User;
  existingDoc: FinalAssessmentDoc;
  targetRole?: string;
  collegeOrOrg?: string;
}): Promise<number> {
  const { user, existingDoc, targetRole, collegeOrOrg } = params;
  if (!canSelfRetryFinalAssessment(existingDoc)) {
    throw new Error(
      existingDoc.passed
        ? 'You have already passed the Final Assessment.'
        : 'All 2 self-service attempts have been used. Please contact your mentor or admin to request another retake.'
    );
  }

  const path = `finalAssessments/${user.uid}`;
  const ref = doc(db, 'finalAssessments', user.uid);
  const startedAtMs = Math.max(Date.now(), (existingDoc.startedAtMs || 0) + 1);

  try {
    await updateDoc(ref, {
      targetRole: clip(targetRole ?? existingDoc.targetRole, 120),
      collegeOrOrg: clip(collegeOrOrg ?? existingDoc.collegeOrOrg, 120),
      status: 'in_progress',
      attemptCount: 2,
      startedAtMs,
      submittedAtMs: 0,
      timeUsedSeconds: 0,
      mcqAnswers: Array(10).fill(-1),
      c1a: '',
      c1b: '',
      c1c: '',
      c2a: '',
      c2b: '',
      c2c: '',
      c3a: '',
      c3b: '',
      c3c: '',
      c4a: '',
      c4b: '',
      c4c: '',
      c5a: '',
      c5b: '',
      c5c: '',
      capstoneScare: '',
      mcqScore: 0,
      caseScore: 0,
      scareScore: 0,
      totalXpAwarded: 0,
      percentageScore: 0,
      passed: false,
      gradeTier: '',
      executiveFeedback: '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
  return startedAtMs;
}

export async function adminResetFinalAssessment(
  targetUid: string,
  currentAttemptCount = 1
): Promise<void> {
  const path = `finalAssessments/${targetUid}`;
  const ref = doc(db, 'finalAssessments', targetUid);
  const nextAttempt = Math.min(20, Math.max(1, currentAttemptCount) + 1);
  try {
    await updateDoc(ref, {
      status: 'in_progress',
      attemptCount: nextAttempt,
      startedAtMs: Date.now(),
      submittedAtMs: 0,
      timeUsedSeconds: 0,
      mcqAnswers: Array(10).fill(-1),
      c1a: '',
      c1b: '',
      c1c: '',
      c2a: '',
      c2b: '',
      c2c: '',
      c3a: '',
      c3b: '',
      c3c: '',
      c4a: '',
      c4b: '',
      c4c: '',
      c5a: '',
      c5b: '',
      c5c: '',
      capstoneScare: '',
      mcqScore: 0,
      caseScore: 0,
      scareScore: 0,
      totalXpAwarded: 0,
      percentageScore: 0,
      passed: false,
      gradeTier: '',
      executiveFeedback: '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeAdminFinalAssessments(
  onData: (byUid: Record<string, FinalAssessmentDoc>) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'finalAssessments'), limit(500));
  return onSnapshot(
    q,
    (snap) => {
      const out: Record<string, FinalAssessmentDoc> = {};
      snap.docs.forEach((d) => {
        out[d.id] = mapFinalDoc(d.id, d.data());
      });
      onData(out);
    },
    (err) => {
      if (!auth.currentUser) return;
      onPermissionError(
        `Final Assessment stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}
