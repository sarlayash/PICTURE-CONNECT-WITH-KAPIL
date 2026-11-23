import React, { useMemo, useState } from 'react';
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
import { COLOR_THEMES } from '../data/themeColors';
import {
  LANDING_CURRICULUM_PARTS,
  LandingCurriculumModule,
  LandingCurriculumPart,
  WORKSHOP_META,
} from '../data/workshopData';
import { FounderNoteSection } from './FounderNoteSection';
import { LiveClock } from './LiveClock';
import { SmartImage } from './SmartImage';
import { VideoChallengesSection } from './VideoChallengesSection';

interface GoogleAuthGateProps {
  authError: string | null;
  onOpenAdmin: () => void;
}

type PartFilterId = 'all' | LandingCurriculumPart['id'];

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({
  authError,
  onOpenAdmin,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [partFilter, setPartFilter] = useState<PartFilterId>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    LANDING_CURRICULUM_PARTS[0].modules[0].id
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

  const scrollToPromoVideos = () => {
    document
      .getElementById('promotional-videos')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCaseStudies = () => {
    document
      .getElementById('video-case-challenges')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const visibleParts = useMemo(
    () =>
      partFilter === 'all'
        ? LANDING_CURRICULUM_PARTS
        : LANDING_CURRICULUM_PARTS.filter((p) => p.id === partFilter),
    [partFilter]
  );

  const selectedModuleInfo = useMemo<{
    part: LandingCurriculumPart;
    module: LandingCurriculumModule;
  }>(() => {
    for (const part of LANDING_CURRICULUM_PARTS) {
      const found = part.modules.find((m) => m.id === selectedModuleId);
      if (found) return { part, module: found };
    }
    return {
      part: LANDING_CURRICULUM_PARTS[0],
      module: LANDING_CURRICULUM_PARTS[0].modules[0],
    };
  }, [selectedModuleId]);

  const displayError = localError || authError;

  const partFilterTabs: { id: PartFilterId; label: string }[] = [
    { id: 'all', label: 'All 3 Parts (Complete Mastery)' },
    { id: 'part_1_core', label: '01 · Comm, Soft Skills, Aptitude & Coding/DSA' },
    { id: 'part_2_utility', label: '02 · MS Office, Excel, Power BI & Tableau' },
    { id: 'part_3_dbms_ai', label: '03 · DBMS, AI & Assessments' },
  ];

  return (
    <div className="min-h-screen bg-[#050C1C] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.24),_transparent_58%),radial-gradient(ellipse_at_bottom_right,_rgba(124,58,237,0.16),_transparent_55%)] text-slate-100 py-6 sm:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Hero Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Editorial Academy Hero */}
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
                  Part 1: Communication, Soft Skills, Aptitude, Coding &amp; DSA · Part 2: MS Office, Excel, Power BI &amp; Tableau · Part 3: DBMS &amp; AI
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
                  <span className="font-mono text-[10px] text-amber-300 font-semibold hidden sm:inline tabular-nums">
                    3 Unified Parts · 42 Badges · 6 Certificates
                  </span>
                </div>
              </div>

              {/* 3-Part Quick KPI Summary + Promo Reel Jump */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#1E3563] text-xs items-center">
                <div>
                  <div className="text-slate-400">Part 01 · Core &amp; Code</div>
                  <div className="font-mono font-semibold text-sky-300 mt-0.5 truncate">
                    Comm · Soft · Apt · DSA
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Part 02 · Utility Tools</div>
                  <div className="font-mono font-semibold text-emerald-300 mt-0.5 truncate">
                    Office · Excel · BI · Tableau
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Part 03 · Data &amp; AI</div>
                  <div className="font-mono font-semibold text-violet-300 mt-0.5 truncate">
                    DBMS · AI · Capstone
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <button
                    type="button"
                    onClick={scrollToPromoVideos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-400/40 bg-rose-500/15 hover:bg-rose-500/25 text-xs font-semibold text-rose-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Promo Reels</span>
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
                  all 3 curriculum parts, 42 downloadable PNG badges, 6
                  verifiable certificates, and Placement LOR PDF{' '}
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
                    Part 1: Global Communication, Interview &amp; GD,
                    Negotiation, Aptitude, Grammar/Tenses/Idioms &amp; C, C++,
                    Java, Python, DSA
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Part 2: Workplace Utility Tools — MS Office (Word &amp;
                    PowerPoint), Microsoft Excel, Power BI DAX &amp; Tableau BI
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    Part 3: DBMS &amp; SQL, Cloud, AI Picture Connect, Daily
                    60-Min Hard Mock, 1000 XP Final Capstone &amp; LOR PDF
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
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-lg shadow-blue-950/40 whitespace-nowrap"
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
                    All saved XP, solved MCQs, badges, and certificates stay
                    synced under your account with zero data loss.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E3563] bg-[#071127] hover:bg-[#112247] text-xs font-semibold text-slate-200 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TOP SHOWCASE: Promotional Videos Placed Right On Top Before Curriculum */}
        <VideoChallengesSection
          mode="landing"
          showPromoShorts
          showCaseStudies={false}
          onRequestSignIn={handleGoogleLogin}
        />

        {/* RE-ORGANIZED 3-PART CURRICULUM ARCHITECTURE */}
        <section id="curriculum-3-parts" className="space-y-10">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <div>
                <div className="text-xs font-mono font-semibold text-amber-400">
                  ONE-STOP PLACEMENT ARCHITECTURE · ORGANIZED INTO 3 PARTS
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1 [text-wrap:balance]">
                  Master Every Placement Skill in 3 Structured Parts
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                01. Core &amp; Code · 02. Utility Tools &amp; BI · 03. DBMS, AI
                &amp; Credentials
              </div>
            </div>

            {/* Interactive 3-Part Segmented Filter Bar */}
            <div
              role="tablist"
              aria-label="Filter curriculum by part"
              className="flex items-center gap-1.5 overflow-x-auto pb-1"
            >
              {partFilterTabs.map((tab) => {
                const active = partFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPartFilter(tab.id)}
                    className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'border-sky-400 bg-sky-500/20 text-white'
                        : 'border-[#1E3563] bg-[#0B1733] text-slate-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-12">
            {visibleParts.map((part) => (
              <div key={part.id} className="space-y-5">
                {/* Part Header Band */}
                <div className="pb-3 border-b border-[#1E3563] flex flex-col lg:flex-row lg:items-end justify-between gap-2">
                  <div className="space-y-1">
                    <div
                      className={`text-xs font-mono font-bold ${part.accentTextClass}`}
                    >
                      {part.number}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                      {part.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                      {part.summary}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-400 shrink-0 tabular-nums">
                    {part.modules.length} Focused Modules
                  </div>
                </div>

                {/* Part Module Cards Grid */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 ${
                    part.modules.length === 3
                      ? 'lg:grid-cols-3'
                      : 'xl:grid-cols-4'
                  } gap-5 items-stretch`}
                >
                  {part.modules.map((mod) => {
                    const selected = selectedModuleId === mod.id;
                    const theme = COLOR_THEMES[mod.themeColor];
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`text-left rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group ${
                          selected
                            ? part.selectedBorderClass
                            : `border-[#1E3563] bg-[#0B1733] ${part.hoverBorderClass}`
                        }`}
                      >
                        <div>
                          <div
                            className={`h-1 w-full bg-gradient-to-r ${theme.topBar}`}
                            aria-hidden="true"
                          />
                          <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#1E3563] bg-[#071127]">
                            <SmartImage
                              src={mod.image}
                              alt={mod.imageAlt}
                              fallbackTitle={mod.title}
                              fallbackSubtitle={mod.subtitle}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                          </div>
                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
                              <span
                                className={`font-bold ${theme.textDarkLanding}`}
                              >
                                {mod.number}
                              </span>
                              <span className="truncate">{mod.coverage}</span>
                            </div>
                            <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                              {mod.title}
                            </h4>
                            <div className="text-xs font-medium text-sky-300/90">
                              {mod.subtitle}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                              {mod.description}
                            </p>
                          </div>
                        </div>

                        <div className="mx-5 mb-4 pt-3 border-t border-[#1E3563] flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                          <span className="truncate">{mod.metrics}</span>
                          <span
                            className={`font-semibold whitespace-nowrap shrink-0 ${theme.textDarkLanding}`}
                          >
                            {selected ? 'Selected' : 'Preview'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Selected Module Launch Bar */}
          <div className="rounded-xl border border-[#1E3563] bg-[#0B1733] overflow-hidden">
            <div
              className={`h-1 w-full bg-gradient-to-r ${selectedModuleInfo.part.topAccentGradient}`}
              aria-hidden="true"
            />
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold text-white">
                  <span className={selectedModuleInfo.part.accentTextClass}>
                    {selectedModuleInfo.module.number}
                  </span>{' '}
                  {selectedModuleInfo.module.title} —{' '}
                  {selectedModuleInfo.module.subtitle}
                </div>
                <div className="text-xs text-slate-300">
                  Sign in with Google to access full interactive notes, solved
                  company problems, MCQs, and downloadable PNG badges &amp;
                  certificates.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={scrollToCaseStudies}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1E3563] bg-[#071127] hover:bg-[#112247] text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 text-sky-400" />
                  <span>Watch Case Films</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleGoogleLogin}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60 ${selectedModuleInfo.part.buttonClass}`}
                >
                  <span>Start Module with Google</span>
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
                  fallbackSubtitle="42 PNG Badges · 6 Certificates · Placement LOR PDF"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Award className="w-4 h-4" />
                  <span>RECRUITER-READY CREDENTIALS · INSTANT DOWNLOAD</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  42 PNG Badges, 6 Official Certificates &amp; Placement LOR PDF
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
              <span>Part 01 · Part 02 · Part 03</span>
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
          showPromoShorts={false}
          showCaseStudies
          onRequestSignIn={handleGoogleLogin}
        />
      </div>
    </div>
  );
};
