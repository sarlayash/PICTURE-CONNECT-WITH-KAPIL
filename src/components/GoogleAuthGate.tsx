import React, { useState } from 'react';
import { ArrowRight, Award, Lock, Play, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { signInWithGoogleOnly } from '../firebase';
import { ACADEMY_CATEGORIES, WORKSHOP_META } from '../data/workshopData';
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
  const [selectedCatId, setSelectedCatId] = useState<string>(ACADEMY_CATEGORIES[0].id);

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
  const activeCategory =
    ACADEMY_CATEGORIES.find((c) => c.id === selectedCatId) ?? ACADEMY_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#060E20] bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.28),_transparent_62%)] text-slate-100 py-6 sm:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Editorial Academy Hero */}
          <div className="lg:col-span-7 rounded-2xl border border-[#1E335C] bg-[#0B1733] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                  <span>{WORKSHOP_META.institution}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="font-semibold text-sky-400">
                    {WORKSHOP_META.poweredBy}
                  </span>
                </div>
                <LiveClock compact variant="navy" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                {WORKSHOP_META.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-sky-400 tracking-wide">
                {WORKSHOP_META.subtitle}
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {WORKSHOP_META.positioning} — {WORKSHOP_META.corePhilosophy}
              </p>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#1E335C] bg-[#071127]">
              <VisualArtwork id="crossroads" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#1E335C] text-xs items-center">
              <div>
                <div className="text-slate-400">Visual &amp; Soft Skills</div>
                <div className="font-mono font-semibold text-white mt-0.5 tabular-nums">
                  Levels 1–10 + AI + GD
                </div>
              </div>
              <div>
                <div className="text-slate-400">Aptitude &amp; Grammar</div>
                <div className="font-mono font-semibold text-white mt-0.5 tabular-nums">
                  4 Tracks · 40 MCQs
                </div>
              </div>
              <div>
                <div className="text-slate-400">Code, Data &amp; Cloud</div>
                <div className="font-mono font-semibold text-white mt-0.5 tabular-nums">
                  8 Tech Tracks · 80 MCQs
                </div>
              </div>
              <div className="flex justify-start sm:justify-end">
                <button
                  type="button"
                  onClick={scrollToVideos}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-xs font-semibold text-sky-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Watch 2 Films</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Genuine Google-Only Learner Gate */}
          <div className="lg:col-span-5 rounded-2xl border border-[#1E335C] bg-[#0B1733] p-6 sm:p-8 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Learner Access Only</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Sign in with Google
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your Google display name powers your personal XP ledger across every category, downloadable PNG badges, and verifiable certificates{' '}
                <span className="font-semibold text-white">
                  Powered By Kapil
                </span>
                .
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 border-y border-[#1E335C] py-4">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Picture Connect (Levels 1–10, Spin Wheel &amp; 25 AI Briefs) + Shopping, Negotiation, Indianism, Interview &amp; GD</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>12 Tech &amp; Placement Tracks: Aptitude, Grammar, Parts of Speech/Grammar, C, C++, Java, DSA, Excel, Power BI, DBMS &amp; Cloud</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>120+ Graded Tech MCQs, 90-Min 1000 XP Final Capstone, PNG Badges, Certificates &amp; Placement LOR PDF</span>
              </div>
            </div>

            {displayError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/50 text-xs text-red-200 leading-relaxed"
              >
                {displayError}
              </div>
            )}

            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
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

            <div className="pt-3 border-t border-[#1E335C] flex flex-col gap-3 text-xs text-slate-400">
              <div className="space-y-1">
                <div>Strictly genuine Google sign-ups only — no guests or passwords.</div>
                <div>Your XP, completed tracks, and certificate credentials sync automatically.</div>
              </div>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E335C] bg-[#071127] hover:bg-[#112247] text-xs font-semibold text-slate-200 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Academy Skill Categories Directory */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-semibold text-sky-400">
                ONE-STOP MASTER CURRICULUM · 9 EMPLOYABILITY CATEGORIES
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Explore EMPLOYABILITY UNIVERSE Categories
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Communication · Aptitude &amp; Grammar · C/C++/Java/DSA · Excel/BI/DBMS/Cloud · Capstone
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACADEMY_CATEGORIES.map((cat) => {
              const selected = cat.id === activeCategory.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`text-left rounded-2xl border overflow-hidden flex flex-col justify-between transition-colors cursor-pointer group ${
                    selected
                      ? 'border-sky-400/80 bg-[#0F2046] ring-1 ring-sky-400/30'
                      : 'border-[#1E335C] bg-[#0B1733] hover:border-sky-500/50 hover:bg-[#0D1C3D]'
                  }`}
                >
                  <div>
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#1E335C] bg-[#071127]">
                      <img
                        src={cat.image}
                        alt={cat.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
                        <span className="font-semibold text-sky-400">
                          {cat.number}
                        </span>
                        <span className="truncate">{cat.subtitle.split('·')[0].trim()}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="mx-5 mb-4 pt-3 border-t border-[#1E335C] text-[11px] font-mono text-slate-400">
                    {cat.highlights}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-[#1E335C] bg-[#0B1733] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-white">
                {activeCategory.number} {activeCategory.title} — {activeCategory.subtitle}
              </div>
              <div className="text-xs text-slate-300">
                Sign in with Google to save XP, badges, and certificates across all categories, or preview our 2 Video Case Studies below.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {activeCategory.id === 'and-more' && (
                <button
                  type="button"
                  onClick={scrollToVideos}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1E335C] bg-[#071127] hover:bg-[#112247] text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 text-sky-400" />
                  <span>Preview Video Films</span>
                </button>
              )}
              <button
                type="button"
                disabled={submitting}
                onClick={handleGoogleLogin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <span>Enter {activeCategory.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Landing Video Case Studies & Challenges (Watch Directly Inside Portal) */}
        <VideoChallengesSection
          mode="landing"
          onRequestSignIn={handleGoogleLogin}
        />
      </div>
    </div>
  );
};
