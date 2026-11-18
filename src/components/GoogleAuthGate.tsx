import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { signInWithGoogleOnly } from '../firebase';
import { WORKSHOP_META } from '../data/workshopData';
import { VisualArtwork } from './VisualArtwork';

interface GoogleAuthGateProps {
  authError: string | null;
}

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({ authError }) => {
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setLocalError(null);
    try {
      await signInWithGoogleOnly();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Google sign-in was cancelled or blocked. Please try again.';
      setLocalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Editorial Workshop Preview */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{WORKSHOP_META.institution}</span>
              <span aria-hidden="true">·</span>
              <span>{WORKSHOP_META.subtitle}</span>
              <span aria-hidden="true">·</span>
              <span>{WORKSHOP_META.poweredBy}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
              {WORKSHOP_META.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {WORKSHOP_META.positioning} — {WORKSHOP_META.corePhilosophy}
            </p>
          </div>

          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
            <VisualArtwork id="crossroads" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <div className="text-slate-500 dark:text-slate-400">Session</div>
              <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                180 Minutes
              </div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400">Experiential</div>
              <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                10 Activities
              </div>
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400">Championship</div>
              <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                10 Teams · 100 pts
              </div>
            </div>
          </div>
        </div>

        {/* Right: Verified Google-Only Sign In */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Learner Access Only</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Sign in with Google
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To keep classroom submissions, perspectives, and Championship scores genuine, access is restricted exclusively to verified Google accounts.
            </p>
          </div>

          {displayError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 leading-relaxed"
            >
              {displayError}
            </div>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={handleGoogleLogin}
            className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>{submitting ? 'Verifying Google Account...' : 'Continue with Google'}</span>
          </button>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div>No guest accounts, passwords, or unverified sign-ups allowed.</div>
            <div>Your personal responses and ideas sync automatically to your verified account.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
