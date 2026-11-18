import React, { useState } from 'react';
import { Award, Lock, Play, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { signInWithGoogleOnly } from '../firebase';
import { WORKSHOP_META } from '../data/workshopData';
import { LiveClock } from './LiveClock';
import { VisualArtwork } from './VisualArtwork';
import { VideoChallengesSection } from './VideoChallengesSection';

interface GoogleAuthGateProps {
  authError: string | null;
  onOpenAdmin: () => void;
}

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({
  authError,
  onOpenAdmin,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setLocalError(null);
    try {
      await signInWithGoogleOnly();
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';
      let msg = raw || 'Google sign-in was cancelled or blocked. Please try again.';
      if (raw.includes('auth/unauthorized-domain')) {
        const host = window.location.hostname;
        msg = `Domain "${host}" is not yet authorized in Firebase Auth. Add "${host}" under Firebase Console → Authentication → Settings → Authorized domains.`;
      } else if (raw.includes('auth/popup-blocked')) {
        msg = 'Sign-in popup was blocked by your browser. Please allow popups for this site and click Continue with Google again.';
      }
      setLocalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToVideos = () => {
    document
      .getElementById('video-case-challenges')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Editorial Academy Hero */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{WORKSHOP_META.institution}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-400">
                    {WORKSHOP_META.poweredBy}
                  </span>
                </div>
                <LiveClock compact />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
                {WORKSHOP_META.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {WORKSHOP_META.positioning} — {WORKSHOP_META.corePhilosophy}
              </p>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <VisualArtwork id="crossroads" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs items-center">
              <div>
                <div className="text-slate-500 dark:text-slate-400">Skill Path</div>
                <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  Levels 1 – 10
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Practice Wheel</div>
                <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  18 Spin Prompts
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Credentials</div>
                <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">
                  XP · Badges · PNG
                </div>
              </div>
              <div className="flex justify-start sm:justify-end">
                <button
                  type="button"
                  onClick={scrollToVideos}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Watch 2 Films</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Genuine Google-Only Learner Gate */}
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
                Your Google display name powers your personal XP ledger, downloadable PNG badges, and verifiable certificate{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  Powered By Kapil
                </span>
                .
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-4">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Complete Levels 1–10 solo challenges to earn up to 1,510+ XP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Watch video case challenges &amp; spin 3 interactive wheels</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Unlock 8 mastery badges and export PNG badges &amp; certificate</span>
              </div>
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

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="space-y-1">
                <div>Strictly genuine Google sign-ups only — no guests or passwords.</div>
                <div>Your XP, completed levels, and certificate credentials sync automatically.</div>
              </div>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Landing Video Case Studies & Challenges (Watch Directly Inside Portal) */}
        <VideoChallengesSection
          mode="landing"
          onRequestSignIn={handleGoogleLogin}
        />
      </div>
    </div>
  );
};
