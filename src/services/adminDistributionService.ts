import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  ADMIN_EMAIL,
  auth,
  db,
  handleFirestoreError,
  isFacilitatorAdmin,
  OperationType,
} from '../firebase';
import { AdminUserRecord } from './firestoreService';
import { isValidEmailAddress } from './gmailService';

export interface AdminDistributionListDoc {
  id: string;
  ownerId: string;
  createdByEmail: string;
  name: string;
  description: string;
  recipientUids: string[];
  recipientEmails: string[];
  lastSentAtMs: number;
  sentCount: number;
  createdAtMs: number;
  updatedAtMs: number;
}

export type EmailTargetMode = 'all' | 'specific' | 'distribution_list';
export type AllAudienceSubFilter =
  | 'all_registered'
  | 'daily_mock_pending'
  | 'incomplete_core'
  | 'completed_core';

export interface EmailBroadcastTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
  ctaLabel: string;
}

export const MAX_DISTRIBUTION_LIST_MEMBERS = 250;

export const ADMIN_EMAIL_TEMPLATES: EmailBroadcastTemplate[] = [
  {
    id: 'custom',
    label: 'Custom Announcement',
    subject: 'Important Update from Mentor Kapil — EMPLOYABILITY UNIVERSE',
    body: 'Hi {{name}},\n\nI wanted to share an important update for your {{domain}} preparation inside EMPLOYABILITY UNIVERSE With Kapil.\n\nPlease log in today to review your upcoming milestones and stay on track for upcoming placement drives.\n\nBest wishes for your career growth!',
    ctaLabel: 'Open EMPLOYABILITY UNIVERSE',
  },
  {
    id: 'daily_mock',
    label: 'Daily 60-Min Mock Push',
    subject: 'Action Needed: Attempt Today’s 60-Min Daily Mock Test (50% Hard MCQs)',
    body: 'Hi {{name}},\n\nToday’s standardized 40-MCQ Daily Mock Test (with 50% Hard FAANG/MNC-level questions across Aptitude, Grammar, Coding/DSA, Python, Excel/BI, DBMS, Cloud, and Negotiation) is live.\n\nSet aside 60 focused minutes today to benchmark your readiness and earn up to +500 XP.',
    ctaLabel: 'Launch Daily 60-Min Mock',
  },
  {
    id: 'placement_drive',
    label: 'Workshop / Placement Session',
    subject: 'Live Mentorship & Placement Readiness Briefing — EMPLOYABILITY UNIVERSE',
    body: 'Hi {{name}},\n\nYou are invited to our upcoming placement readiness session tailored for the {{domain}} cohort.\n\nBefore joining, please ensure your Profile (LinkedIn, GitHub, Mobile, College) is 100% updated and complete your pending MCQ tracks so we can review your progress scorecard.',
    ctaLabel: 'Review My Progress & Profile',
  },
  {
    id: 'completion_lor',
    label: 'Certificate & LOR Reminder',
    subject: 'Unlock Your Placement Certificate & Personalized LOR, {{firstName}}',
    body: 'Hi {{name}},\n\nYou have already started strong on EMPLOYABILITY UNIVERSE With Kapil. Complete your remaining core levels, Spinning Wheel reflections, and 25 AI Visual Challenges to unlock the 1000 XP Final Capstone & personalized Placement LOR.\n\nSign in anytime to continue right from where you paused.',
    ctaLabel: 'Continue Learning Journey',
  },
];

function clip(value: string, max: number): string {
  return String(value || '').trim().slice(0, max);
}

/**
 * Filters admin user records strictly to already-registered learners with valid,
 * non-empty Google emails, deduplicated case-insensitively by email.
 */
export function getRegisteredLearnersWithEmail(
  records: AdminUserRecord[]
): AdminUserRecord[] {
  const seenEmails = new Set<string>();
  const out: AdminUserRecord[] = [];
  for (const r of records) {
    const email = String(r.email || '').trim();
    if (!isValidEmailAddress(email)) continue;
    const lower = email.toLowerCase();
    if (seenEmails.has(lower)) continue;
    seenEmails.add(lower);
    out.push({
      ...r,
      email,
    });
  }
  return out;
}

/**
 * Resolves a set of candidate learner UIDs strictly against registered records,
 * returning bounded, deduplicated UID and email arrays matching Firestore rules.
 */
export function resolveDistributionMembers(
  candidateUids: string[],
  records: AdminUserRecord[]
): {
  recipientUids: string[];
  recipientEmails: string[];
  members: AdminUserRecord[];
} {
  const registered = getRegisteredLearnersWithEmail(records);
  const byUid = new Map<string, AdminUserRecord>();
  for (const r of registered) {
    byUid.set(r.uid, r);
  }

  const seenUids = new Set<string>();
  const seenEmails = new Set<string>();
  const members: AdminUserRecord[] = [];
  const recipientUids: string[] = [];
  const recipientEmails: string[] = [];

  for (const rawUid of candidateUids) {
    const uid = String(rawUid || '').trim();
    if (!uid || seenUids.has(uid)) continue;
    const learner = byUid.get(uid);
    if (!learner) continue;
    const lowerEmail = learner.email.toLowerCase();
    if (seenEmails.has(lowerEmail)) continue;
    seenUids.add(uid);
    seenEmails.add(lowerEmail);
    members.push(learner);
    recipientUids.push(uid);
    recipientEmails.push(learner.email);
    if (members.length >= MAX_DISTRIBUTION_LIST_MEMBERS) break;
  }

  return { recipientUids, recipientEmails, members };
}

/**
 * Resolves final registered recipients for the Admin Email Hub based on mode:
 * - `all`: All registered learners (filtered by opt-in / subfilter / manual exclusions)
 * - `specific`: Single already-registered learner selected by UID or exact registered email
 * - `distribution_list`: Members of a saved distribution list matched against live registered users
 */
export function resolveEmailTargetRecipients(params: {
  mode: EmailTargetMode;
  records: AdminUserRecord[];
  specificUid?: string;
  distributionList?: AdminDistributionListDoc | null;
  optedInOnly?: boolean;
  audienceFilter?: AllAudienceSubFilter;
  dailySubmittedUids?: Set<string>;
  excludedUids?: Set<string>;
}): {
  recipients: AdminUserRecord[];
  unresolvedListCount: number;
} {
  const registered = getRegisteredLearnersWithEmail(params.records);
  const excluded = params.excludedUids || new Set<string>();

  if (params.mode === 'specific') {
    const target = registered.find((r) => r.uid === params.specificUid);
    return {
      recipients: target ? [target] : [],
      unresolvedListCount: 0,
    };
  }

  if (params.mode === 'distribution_list') {
    const list = params.distributionList;
    if (!list) {
      return { recipients: [], unresolvedListCount: 0 };
    }
    const byUid = new Map(registered.map((r) => [r.uid, r]));
    const byEmail = new Map(registered.map((r) => [r.email.toLowerCase(), r]));
    const seen = new Set<string>();
    const resolved: AdminUserRecord[] = [];
    let unresolved = 0;

    // Match by UID first, then fallback to registered email
    const maxLen = Math.max(list.recipientUids.length, list.recipientEmails.length);
    for (let i = 0; i < maxLen; i++) {
      const uid = list.recipientUids[i];
      const email = list.recipientEmails[i]?.toLowerCase();
      const match = (uid && byUid.get(uid)) || (email && byEmail.get(email));
      if (!match) {
        unresolved += 1;
        continue;
      }
      if (seen.has(match.uid) || excluded.has(match.uid)) continue;
      seen.add(match.uid);
      resolved.push(match);
    }

    return {
      recipients: resolved,
      unresolvedListCount: unresolved,
    };
  }

  // mode === 'all'
  const filtered = registered.filter((r) => {
    if (excluded.has(r.uid)) return false;
    if (params.optedInOnly && r.emailRemindersEnabled === false) return false;
    if (params.audienceFilter === 'daily_mock_pending') {
      return !(params.dailySubmittedUids && params.dailySubmittedUids.has(r.uid));
    }
    if (params.audienceFilter === 'incomplete_core') {
      return r.completedLevels.length < 10;
    }
    if (params.audienceFilter === 'completed_core') {
      return r.completedLevels.length >= 10;
    }
    return true;
  });

  return {
    recipients: filtered,
    unresolvedListCount: 0,
  };
}

/**
 * Splits recipients into bounded chunks (e.g., max 45 per BCC envelope).
 */
export function chunkRecipients<T>(items: T[], chunkSize = 45): T[][] {
  if (chunkSize < 1) throw new Error('chunkSize must be >= 1');
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

function mapDistributionListDoc(
  id: string,
  data: Record<string, unknown>
): AdminDistributionListDoc {
  const createdObj = data.createdAt as { toMillis?: () => number } | undefined;
  const updatedObj = data.updatedAt as { toMillis?: () => number } | undefined;
  return {
    id,
    ownerId: String(data.ownerId || ''),
    createdByEmail: String(data.createdByEmail || ADMIN_EMAIL),
    name: String(data.name || 'Untitled List'),
    description: String(data.description || ''),
    recipientUids: Array.isArray(data.recipientUids)
      ? data.recipientUids.map(String)
      : [],
    recipientEmails: Array.isArray(data.recipientEmails)
      ? data.recipientEmails.map(String)
      : [],
    lastSentAtMs: Number(data.lastSentAtMs || 0),
    sentCount: Number(data.sentCount || 0),
    createdAtMs: createdObj?.toMillis ? createdObj.toMillis() : 0,
    updatedAtMs: updatedObj?.toMillis ? updatedObj.toMillis() : 0,
  };
}

export function subscribeAdminDistributionLists(
  onData: (lists: AdminDistributionListDoc[]) => void,
  onPermissionError: (msg: string) => void
): () => void {
  const path = 'adminDistributionLists';
  const q = query(collection(db, path), limit(100));

  return onSnapshot(
    q,
    (snap) => {
      const lists = snap.docs
        .map((d) => mapDistributionListDoc(d.id, d.data()))
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs || a.name.localeCompare(b.name));
      onData(lists);
    },
    (error) => {
      if (!auth.currentUser) return;
      onPermissionError(
        `Distribution lists stream error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  );
}

export async function createDistributionList(params: {
  name: string;
  description: string;
  recipientUids: string[];
  records: AdminUserRecord[];
}): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser || !isFacilitatorAdmin(currentUser)) {
    throw new Error('Only the verified Admin Google account can create distribution lists.');
  }
  const cleanName = clip(params.name, 80);
  if (!cleanName) {
    throw new Error('Please enter a name for this distribution list.');
  }
  const { recipientUids, recipientEmails } = resolveDistributionMembers(
    params.recipientUids,
    params.records
  );
  if (recipientUids.length === 0) {
    throw new Error('Select at least 1 already-registered learner email for the distribution list.');
  }

  const path = 'adminDistributionLists';
  try {
    const ref = await addDoc(collection(db, path), {
      ownerId: currentUser.uid,
      createdByEmail: clip(currentUser.email || ADMIN_EMAIL, 160),
      name: cleanName,
      description: clip(params.description, 240),
      recipientUids,
      recipientEmails,
      lastSentAtMs: 0,
      sentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateDistributionList(params: {
  listId: string;
  name: string;
  description: string;
  recipientUids: string[];
  records: AdminUserRecord[];
}): Promise<void> {
  const currentUser = auth.currentUser;
  if (!isFacilitatorAdmin(currentUser)) {
    throw new Error('Only the verified Admin Google account can update distribution lists.');
  }
  const cleanName = clip(params.name, 80);
  if (!cleanName) {
    throw new Error('Distribution list name cannot be empty.');
  }
  const { recipientUids, recipientEmails } = resolveDistributionMembers(
    params.recipientUids,
    params.records
  );
  if (recipientUids.length === 0) {
    throw new Error('Distribution list must include at least 1 registered learner.');
  }

  const path = `adminDistributionLists/${params.listId}`;
  try {
    await updateDoc(doc(db, 'adminDistributionLists', params.listId), {
      name: cleanName,
      description: clip(params.description, 240),
      recipientUids,
      recipientEmails,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markDistributionListSent(params: {
  listId: string;
  currentSentCount: number;
}): Promise<void> {
  if (!isFacilitatorAdmin(auth.currentUser)) return;
  const path = `adminDistributionLists/${params.listId}`;
  try {
    await updateDoc(doc(db, 'adminDistributionLists', params.listId), {
      lastSentAtMs: Date.now(),
      sentCount: Math.min(100000, Math.max(0, Math.floor(params.currentSentCount) + 1)),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteDistributionList(listId: string): Promise<void> {
  if (!isFacilitatorAdmin(auth.currentUser)) {
    throw new Error('Only the verified Admin Google account can delete distribution lists.');
  }
  const path = `adminDistributionLists/${listId}`;
  try {
    await deleteDoc(doc(db, 'adminDistributionLists', listId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
