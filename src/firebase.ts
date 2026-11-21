import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  doc,
  getDocFromServer,
  getFirestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

// In-memory only (never localStorage or sessionStorage)
let cachedGmailAccessToken: string | null = null;
let cachedGmailTokenExpiresAtMs = 0;

export function clearCachedGmailToken(): void {
  cachedGmailAccessToken = null;
  cachedGmailTokenExpiresAtMs = 0;
}

export function getCachedGmailToken(): string | null {
  if (!cachedGmailAccessToken) return null;
  if (Date.now() >= cachedGmailTokenExpiresAtMs) {
    clearCachedGmailToken();
    return null;
  }
  return cachedGmailAccessToken;
}

onAuthStateChanged(auth, (u) => {
  if (!u) {
    clearCachedGmailToken();
  }
});

export const ADMIN_EMAIL = 'kapilnarula27july@gmail.com';

export function isGenuineGoogleUser(user: User | null): user is User {
  if (!user) return false;
  if (!user.emailVerified) return false;
  return user.providerData.some((p) => p.providerId === 'google.com');
}

export function isFacilitatorAdmin(user: User | null): boolean {
  return Boolean(
    user &&
      isGenuineGoogleUser(user) &&
      user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
}

export async function signInWithGoogleOnly(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  if (!isGenuineGoogleUser(result.user)) {
    clearCachedGmailToken();
    await signOut(auth);
    throw new Error(
      'Only verified Google accounts are permitted. Please sign in with a genuine Google account.'
    );
  }
  return result.user;
}

/**
 * Requests a short-lived in-memory Google OAuth access token with `gmail.send`
 * scope so the signed-in user can send badges, certificates, LORs, or reminders
 * to their own verified sign-up Gmail address.
 */
export async function requestGmailSendToken(
  loginHint?: string,
  forceRefresh = false
): Promise<string> {
  if (!forceRefresh) {
    const existing = getCachedGmailToken();
    if (existing) return existing;
  }

  const gmailProvider = new GoogleAuthProvider();
  gmailProvider.addScope(GMAIL_SEND_SCOPE);
  const customParams: Record<string, string> = {
    prompt: forceRefresh ? 'consent' : 'select_account',
  };
  if (loginHint && loginHint.includes('@')) {
    customParams.login_hint = loginHint;
  }
  gmailProvider.setCustomParameters(customParams);

  const result = await signInWithPopup(auth, gmailProvider);
  if (!isGenuineGoogleUser(result.user)) {
    clearCachedGmailToken();
    await signOut(auth);
    throw new Error('Only verified Google accounts can send credentials via Gmail.');
  }

  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;
  if (!token) {
    throw new Error(
      'Gmail permission was not granted. Please allow Gmail send access in the Google popup to email your credentials.'
    );
  }

  cachedGmailAccessToken = token;
  // Google OAuth access tokens typically live 60 minutes; refresh proactively at 50m
  cachedGmailTokenExpiresAtMs = Date.now() + 50 * 60 * 1000;
  return token;
}

export async function signOutUser(): Promise<void> {
  clearCachedGmailToken();
  await signOut(auth);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();
