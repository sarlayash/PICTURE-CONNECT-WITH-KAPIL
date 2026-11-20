import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  FileCheck2,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { signInWithGoogleOnly } from '../firebase';
import { LANDING_SHOWCASE_IMAGES } from '../data/imageAssets';
import { getCategoryTheme } from '../data/themeColors';
import { ACADEMY_CATEGORIES, WORKSHOP_META } from '../data/workshopData';
import { FounderNoteSection } from './FounderNoteSection';
import { LiveClock } from './LiveClock';
import { SmartImage } from './SmartImage';
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
  const [selectedCatId, setSelectedCatId] = useState<string>(
    ACADEMY_CATEGORIES[0].id
  );

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setLocalError(null);
    try {
      await signInWithGoogleOnly();
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';
      let msg =
        raw || 'Google sign-in was cancelled or blocked. Please try again.';
      if (raw.includes('auth/unauthorized-domain')) {
        const host = window.location.hostname;
        msg = `Domain "${host}" is not yet authorized in Firebase Auth. Add "${host}" under Firebase Console → Authentication → Settings → Authorized domains.`;
      } else if (raw.includes('auth/popup-blocked')) {
        msg =
          'Sign-in popup was blocked by your browser. Please allow popups for this site and click Continue with Google again.';
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
    ACADEMY_CATEGORIES.find((c) => c.id === selectedCatId) ??
    ACADEMY_CATEGORIES[0];
  const activeCatTheme = getCategoryTheme(activeCategory.id);

  return (
    <div className="min-h-screen bg-[#050C1C] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.24),_transparent_58%),radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.16),_transparent_55%)] text-slate-100 py-6 sm:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Editorial Academy Hero with Bespoke Atrium Photography */}
          <div className="lg:col-span-7 rounded-2xl border border-[#1E3563] bg-[#0B1733] overflow-hidden flex flex-col justify-between">
            <div
              className="h-1 w-full bg-gradient-to-r from-sky-400 via-violet-500 to-amber-400"
              aria-hidden="true"
            />
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                    <span>{WORKSHOP_META.institution}</span>
                    <span aria-hidden="true" className="text-slate-500">
                      ·
                    </span>
                    <span className="font-semibold text-amber-400">
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

              {/* Bespoke Employability Universe Hero Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#243E73] bg-[#071127]">
                <SmartImage
                  src={LANDING_SHOWCASE_IMAGES.heroUniverse.src}
                  alt={LANDING_SHOWCASE_IMAGES.heroUniverse.alt}
                  fallbackTitle="EMPLOYABILITY UNIVERSE With Kapil"
                  fallbackSubtitle="Global Placement & Career Mastery Academy"
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050C1C]/90 via-[#050C1C]/40 to-transparent flex items-end justify-between px-4 pb-3">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-100">
                    {LANDING_SHOWCASE_IMAGES.heroUniverse.caption}
                  </span>
                  <span className="font-mono text-[10px] text-amber-300 font-semibold hidden sm:inline">
                    9 Categories · 38 Badges · 6 Certificates
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#1E3563] text-xs items-center">
                <div>
                  <div className="text-slate-400">Visual &amp; Soft Skills</div>
                  <div className="font-mono font-semibold text-sky-300 mt-0.5 tabular-nums">
                    Levels 1–10 + AI + GD
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Aptitude &amp; Verbal</div>
                  <div className="font-mono font-semibold text-amber-300 mt-0.5 tabular-nums">
                    7 Tracks · 70 MCQs
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Code, Data &amp; Cloud</div>
                  <div className="font-mono font-semibold text-emerald-300 mt-0.5 tabular-nums">
                    9 Tech Tracks · 90 MCQs
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <button
                    type="button"
                    onClick={scrollToVideos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-400/40 bg-rose-500/15 hover:bg-rose-500/25 text-xs font-semibold text-rose-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch 2 Films</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Genuine Google-Only Learner Gate */}
          <div className="lg:col-span-5 rounded-2xl border border-[#1E3563] bg-[#0B1733] overflow-hidden flex flex-col justify-between">
            <div
              className="h-1 w-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500"
              aria-hidden="true"
            />
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Learner Access Only</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Sign in with Google
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Your Google display name powers your personal XP ledger across
                  every category, 38 downloadable PNG badges, 6 verifiable PNG
                  certificates, and Placement LOR PDF{' '}
                  <span className="font-semibold text-amber-300">
                    Powered By Kapil
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-y border-[#1E3563] py-4">
                <div className="flex items-start gap-2.5">
                  <Trophy className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    Picture Connect (Levels 1–10, 18-Prompt Spin Wheel &amp; 25
                    AI Briefs) + Shopping, Negotiation, Indianism, Interview
                    &amp; GD
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    16 Placement Tracks: Aptitude, Grammar, Parts of Speech &amp;
                    Grammar, Tenses, Punctuation, Idioms, C, C++, Java, Python,
                    DSA, Excel, Power BI, DBMS &amp; Cloud — with Live Crisp
                    Notes &amp; 160 FAANG/MNC Solved Problems
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    225+ Graded Hinted MCQs, 90-Min 1000 XP Final Capstone, 38
                    PNG Badges, 6 Certificates &amp; Placement LOR PDF
                  </span>
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
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-lg shadow-blue-950/40"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
                <span>
                  {submitting
                    ? 'Verifying Google Account...'
                    : 'Continue with Google'}
                </span>
              </button>

              <div className="pt-3 border-t border-[#1E3563] flex flex-col gap-3 text-xs text-slate-400">
                <div className="space-y-1">
                  <div>
                    Strictly genuine Google sign-ups only — no guests or
                    passwords.
                  </div>
                  <div>
                    Your XP, completed tracks, and certificate credentials sync
                    automatically.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E3563] bg-[#071127] hover:bg-[#112247] text-xs font-semibold text-slate-200 cursor-pointer transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Academy Skill Categories Directory — Distinct Color Identity Per Category */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-semibold text-amber-400">
                ONE-STOP MASTER CURRICULUM · 9 COLOR-CODED EMPLOYABILITY
                CATEGORIES
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Explore EMPLOYABILITY UNIVERSE Categories
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Communication · Aptitude &amp; Verbal · C/C++/Java/Python/DSA ·
              Excel/BI/DBMS/Cloud · Capstone
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACADEMY_CATEGORIES.map((cat) => {
              const selected = cat.id === activeCategory.id;
              const theme = getCategoryTheme(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`text-left rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
                    selected
                      ? theme.landingCardSelected
                      : `border-[#1E3563] bg-[#0B1733] ${theme.landingCardHover}`
                  }`}
                >
                  <div>
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${theme.topBar}`}
                      aria-hidden="true"
                    />
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#1E3563] bg-[#071127]">
                      <SmartImage
                        src={cat.image}
                        alt={cat.imageAlt}
                        fallbackTitle={cat.title}
                        fallbackSubtitle={cat.subtitle}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
                        <span
                          className={`font-bold ${theme.textDarkLanding}`}
                        >
                          {cat.number}
                        </span>
                        <span className="truncate">
                          {cat.subtitle.split('·')[0].trim()}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="mx-5 mb-4 pt-3 border-t border-[#1E3563] flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <span>{cat.highlights}</span>
                    <span
                      className={`font-semibold ${theme.textDarkLanding}`}
                    >
                      {theme.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-[#1E3563] bg-[#0B1733] overflow-hidden">
            <div
              className={`h-1 w-full bg-gradient-to-r ${activeCatTheme.topBar}`}
              aria-hidden="true"
            />
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold text-white">
                  <span className={activeCatTheme.textDarkLanding}>
                    {activeCategory.number}
                  </span>{' '}
                  {activeCategory.title} — {activeCategory.subtitle}
                </div>
                <div className="text-xs text-slate-300">
                  Sign in with Google to save XP, unlock 38 PNG badges, and
                  download 6 official certificates + Placement LOR PDF.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {activeCategory.id === 'and-more' && (
                  <button
                    type="button"
                    onClick={scrollToVideos}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1E3563] bg-[#071127] hover:bg-[#112247] text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 text-sky-400" />
                    <span>Preview Video Films</span>
                  </button>
                )}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleGoogleLogin}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60 ${activeCatTheme.activeButton}`}
                >
                  <span>Enter {activeCategory.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Credentials & Final Capstone Arena Showcase */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl border border-[#243E73] bg-[#0B1733] overflow-hidden flex flex-col justify-between">
            <div
              className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500"
              aria-hidden="true"
            />
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#1E3563]">
                <SmartImage
                  src={LANDING_SHOWCASE_IMAGES.credentialsShowcase.src}
                  alt={LANDING_SHOWCASE_IMAGES.credentialsShowcase.alt}
                  fallbackTitle="Verified Credentials Vault"
                  fallbackSubtitle="38 PNG Badges · 6 Certificates · Placement LOR PDF"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Award className="w-4 h-4" />
                  <span>RECRUITER-READY CREDENTIALS · INSTANT DOWNLOAD</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  38 PNG Badges, 6 Official Certificates &amp; Placement LOR PDF
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every track awards high-resolution 1200×1200 PNG mastery
                  badges and 2400×1700 verifiable certificates signed under{' '}
                  <strong className="text-white">
                    EMPLOYABILITY UNIVERSE With Kapil
                  </strong>
                  , plus a personalized Letter of Recommendation (PDF) on
                  passing the Final Capstone.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-[#1E3563] mx-6">
              <span>Core · AI · Shop · Career · Tech · Capstone</span>
              <span className="text-amber-300 font-semibold">100% Verifiable</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#243E73] bg-[#0B1733] overflow-hidden flex flex-col justify-between">
            <div
              className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500"
              aria-hidden="true"
            />
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#1E3563]">
                <SmartImage
                  src={LANDING_SHOWCASE_IMAGES.capstoneArena.src}
                  alt={LANDING_SHOWCASE_IMAGES.capstoneArena.alt}
                  fallbackTitle="Final Capstone Summit Arena"
                  fallbackSubtitle="90-Minute 1000 XP Proctored Executive Exam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-fuchsia-400">
                  <FileCheck2 className="w-4 h-4" />
                  <span>90-MINUTE CAPSTONE · 1000 XP · 2 ATTEMPTS</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Boardroom Case Studies &amp; Proctored Placement Evaluation
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Step into real executive crisis simulations across FinTech
                  outages, EV recalls, Healthcare AI triage, SaaS churn, and
                  placement panels — auto-scored across 1000 XP with detailed
                  rubric analytics.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-[#1E3563] mx-6">
              <span>5 Real Case Studies · 10 Hard MCQs · SCARE</span>
              <span className="text-fuchsia-300 font-semibold">Auto-Scored</span>
            </div>
          </div>
        </section>

        {/* Founder's Note from Employability Universe Architect — Kapil */}
        <FounderNoteSection variant="landing" />

        {/* Landing Video Case Studies & Challenges (Watch Directly Inside Portal) */}
        <VideoChallengesSection
          mode="landing"
          onRequestSignIn={handleGoogleLogin}
        />
      </div>
    </div>
  );
};
