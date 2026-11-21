import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

export type FeedbackSectionId =
  | 'journey'
  | 'levels'
  | 'wheel'
  | 'shopping'
  | 'career'
  | 'universe'
  | 'advanced'
  | 'final'
  | 'achievements';

export type FeedbackCategory =
  | 'content_depth'
  | 'new_topic'
  | 'ui_ux'
  | 'practice_problems'
  | 'mentor_appreciation';

export type FeedbackStatus = 'new' | 'reviewed' | 'implemented';

export interface SectionFeedbackDoc {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  sectionId: FeedbackSectionId;
  sectionLabel: string;
  subTopic: string;
  category: FeedbackCategory;
  rating: number;
  highlights: string;
  improvement: string;
  status: FeedbackStatus;
  adminNote: string;
  createdAtMs: number;
  updatedAtMs: number;
}

export const FEEDBACK_SECTION_LABELS: Record<FeedbackSectionId, string> = {
  journey: 'Universe Overview',
  levels: 'Levels 1–10 Picture Connect',
  wheel: 'Spinning Wheel Challenge',
  shopping: 'Shopping & Negotiation Skills',
  career: 'Indianism, Interview & GD Academy',
  universe: '16-Track Tech, Python, Grammar & Data Universe',
  advanced: 'AI-Powered Visual Reasoning Lab',
  final: 'Final Assessment & Placement LOR',
  achievements: 'Badges & Certificates Vault',
};

export const FEEDBACK_CATEGORY_META: {
  id: FeedbackCategory;
  label: string;
  promptPlaceholder: string;
}[] = [
  {
    id: 'content_depth',
    label: 'Notes & Explanation Clarity',
    promptPlaceholder:
      'Which concept, tip, or example could be explained even sharper or with extra shortcuts?',
  },
  {
    id: 'practice_problems',
    label: 'More Company Problems / MCQs',
    promptPlaceholder:
      'Which company (FAANG, TCS, Wipro, Capgemini, Amazon, TechM, Cognizant) or problem pattern should Kapil add next?',
  },
  {
    id: 'new_topic',
    label: 'Suggest a New Topic / Skill',
    promptPlaceholder:
      'What new skill, language, or placement round would make this portal even more valuable for you?',
  },
  {
    id: 'ui_ux',
    label: 'UI / UX & Experience Idea',
    promptPlaceholder:
      'Any layout, readability, speed, or interactive workflow enhancement you would love to see?',
  },
  {
    id: 'mentor_appreciation',
    label: 'WOW Moment / Mentor Note',
    promptPlaceholder:
      'Share what clicked for you, helped you in an interview, or made you say WOW!',
  },
];

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function mapFeedbackDoc(
  id: string,
  data: Record<string, unknown>
): SectionFeedbackDoc {
  const createdObj = data.createdAt as { toMillis?: () => number } | undefined;
  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;
  const rawRating = Number(data.rating || 5);
  const rating = Math.min(5, Math.max(1, Math.round(rawRating)));

  return {
    id,
    authorId: String(data.authorId || ''),
    authorName: String(data.authorName || 'Verified Learner'),
    authorEmail: String(data.authorEmail || ''),
    sectionId: (String(data.sectionId || 'journey') as FeedbackSectionId),
    sectionLabel: String(data.sectionLabel || 'Universe Overview'),
    subTopic: String(data.subTopic || ''),
    category: (String(data.category || 'content_depth') as FeedbackCategory),
    rating,
    highlights: String(data.highlights || ''),
    improvement: String(data.improvement || ''),
    status: (String(data.status || 'new') as FeedbackStatus),
    adminNote: String(data.adminNote || ''),
    createdAtMs: createdObj?.toMillis ? createdObj.toMillis() : 0,
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

export async function submitSectionFeedback(params: {
  user: User;
  sectionId: FeedbackSectionId;
  sectionLabel: string;
  subTopic?: string;
  category: FeedbackCategory;
  rating: number;
  highlights: string;
  improvement: string;
}): Promise<string> {
  const {
    user,
    sectionId,
    sectionLabel,
    subTopic = '',
    category,
    rating,
    highlights,
    improvement,
  } = params;

  const cleanImprovement = clip(improvement, 1000);
  if (cleanImprovement.length < 4) {
    throw new Error('Please share at least a short note (4+ characters).');
  }

  const cleanRating = Math.min(5, Math.max(1, Math.round(rating)));
  const path = 'sectionFeedback';

  try {
    const docRef = await addDoc(collection(db, 'sectionFeedback'), {
      authorId: user.uid,
      authorName:
        clip(
          user.displayName || user.email?.split('@')[0] || 'Verified Learner',
          100
        ) || 'Verified Learner',
      authorEmail: clip(user.email || '', 160),
      sectionId,
      sectionLabel:
        clip(sectionLabel || FEEDBACK_SECTION_LABELS[sectionId], 80) ||
        'Universe Overview',
      subTopic: clip(subTopic, 100),
      category,
      rating: cleanRating,
      highlights: clip(highlights, 400),
      improvement: cleanImprovement,
      status: 'new',
      adminNote: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export function subscribeMySectionFeedback(
  user: User,
  sectionId: FeedbackSectionId,
  onData: (items: SectionFeedbackDoc[]) => void,
  onError?: (msg: string) => void
): () => void {
  const q = query(
    collection(db, 'sectionFeedback'),
    where('authorId', '==', user.uid),
    limit(100)
  );

  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapFeedbackDoc(d.id, d.data()))
        .filter((item) => item.sectionId === sectionId)
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(items);
    },
    (error) => {
      if (!auth.currentUser) return;
      console.error('Feedback stream error:', error);
      if (onError) {
        onError(
          error instanceof Error
            ? error.message
            : 'Unable to load your previous feedback right now.'
        );
      }
    }
  );
}

export function subscribeAdminFeedback(
  onData: (items: SectionFeedbackDoc[]) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const q = query(collection(db, 'sectionFeedback'), limit(500));

  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => mapFeedbackDoc(d.id, d.data()))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onData(items);
    },
    (err) => {
      if (!auth.currentUser) return;
      onPermissionError(
        `Feedback Reports stream error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  );
}

export async function adminUpdateFeedback(params: {
  feedbackId: string;
  status: FeedbackStatus;
  adminNote: string;
}): Promise<void> {
  const { feedbackId, status, adminNote } = params;
  const path = `sectionFeedback/${feedbackId}`;
  try {
    await updateDoc(doc(db, 'sectionFeedback', feedbackId), {
      status,
      adminNote: clip(adminNote, 500),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
