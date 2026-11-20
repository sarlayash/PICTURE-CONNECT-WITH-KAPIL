import React from 'react';
import { Compass, Quote } from 'lucide-react';
import { LANDING_SHOWCASE_IMAGES } from '../data/imageAssets';
import { SmartImage } from './SmartImage';

interface FounderNoteSectionProps {
  variant: 'landing' | 'portal';
}

export const FounderNoteSection: React.FC<FounderNoteSectionProps> = ({
  variant,
}) => {
  const isLanding = variant === 'landing';

  return (
    <section
      aria-labelledby="founder-note-heading"
      className={`rounded-2xl border overflow-hidden ${
        isLanding
          ? 'border-[#253D73] bg-gradient-to-br from-[#0B1733] via-[#102047] to-[#0A1530] text-slate-100'
          : 'border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-[#FFFDF7] via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* Signature Top Gold-to-Sapphire Architectural Accent Hairline */}
      <div
        className="h-1 w-full bg-gradient-to-r from-amber-500 via-sky-500 to-violet-500"
        aria-hidden="true"
      />

      <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Editorial Mentor Study Visual */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div
            className={`aspect-[4/3] lg:flex-1 lg:min-h-[300px] w-full overflow-hidden rounded-xl border ${
              isLanding
                ? 'border-[#253D73]'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <SmartImage
              src={LANDING_SHOWCASE_IMAGES.founderStudio.src}
              alt={LANDING_SHOWCASE_IMAGES.founderStudio.alt}
              fallbackTitle="Kapil — Employability Universe Architect"
              fallbackSubtitle="Mentor Study & Vision Blueprint"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className={`flex items-center justify-between gap-3 pt-1 text-xs font-mono ${
              isLanding
                ? 'text-slate-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Compass
                className={`w-3.5 h-3.5 ${
                  isLanding
                    ? 'text-amber-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              />
              <span>EMPLOYABILITY UNIVERSE ARCHITECT</span>
            </span>
            <span>FOUNDER&apos;S DESK</span>
          </div>
        </div>

        {/* Right: Authentic Founder Note Prose & Signature */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span
                className={`font-bold ${
                  isLanding
                    ? 'text-amber-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                FOUNDER&apos;S NOTE
              </span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span
                className={
                  isLanding
                    ? 'text-sky-300'
                    : 'text-indigo-700 dark:text-indigo-400 font-semibold'
                }
              >
                FROM THE EMPLOYABILITY UNIVERSE ARCHITECT
              </span>
            </div>

            <h2
              id="founder-note-heading"
              className={`font-display text-2xl sm:text-3xl font-bold tracking-tight leading-tight [text-wrap:balance] ${
                isLanding ? 'text-white' : 'text-slate-950 dark:text-white'
              }`}
            >
              &ldquo;Degrees open the door — clarity, character, and cross-domain execution build the career.&rdquo;
            </h2>

            <div
              className={`space-y-3.5 text-sm sm:text-[15px] leading-relaxed ${
                isLanding
                  ? 'text-slate-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <p>
                For years, I watched brilliant students and ambitious young professionals stumble not because they lacked potential, but because employability training was fragmented into disconnected silos — grammar in one notebook, coding in another, interviews in last-minute panic, and visual storytelling rarely taught at all.
              </p>
              <p>
                <strong
                  className={
                    isLanding ? 'text-white' : 'text-slate-950 dark:text-white'
                  }
                >
                  EMPLOYABILITY UNIVERSE With Kapil
                </strong>{' '}
                was architected as a single, disciplined sanctuary where everything modern recruiters evaluate comes together: observing deeply through Picture Connect, negotiating with poise, communicating in crisp global English, commanding Interviews and Group Discussions, sharpening Aptitude, Grammar, Tenses, Punctuation &amp; Idioms, writing rock-solid C, C++, Java, Python &amp; DSA, and making data-backed decisions with Excel, Power BI, DBMS, and Cloud Computing.
              </p>
              <p>
                Treat every level, playbook, MCQ, and case study here as a live rehearsal for the room you want to lead tomorrow. Show up with curiosity, respect your craft, and never settle for average when excellence is within reach.
              </p>
            </div>
          </div>

          {/* Signature Block & 3 Guiding Tenets */}
          <div
            className={`pt-5 border-t flex flex-col sm:flex-row sm:items-end justify-between gap-5 ${
              isLanding
                ? 'border-[#253D73]'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Quote
                  className={`w-4 h-4 ${
                    isLanding
                      ? 'text-amber-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                />
                <span
                  className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${
                    isLanding ? 'text-white' : 'text-slate-950 dark:text-white'
                  }`}
                >
                  Kapil
                </span>
              </div>
              <div
                className={`text-xs font-semibold ${
                  isLanding
                    ? 'text-amber-300'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                Employability Universe Architect
              </div>
              <div
                className={`text-xs ${
                  isLanding
                    ? 'text-slate-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Founder &amp; Mentor · EMPLOYABILITY UNIVERSE With Kapil
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <div
                  className={`font-bold ${
                    isLanding
                      ? 'text-sky-400'
                      : 'text-blue-700 dark:text-blue-400'
                  }`}
                >
                  01. Observe
                </div>
                <div
                  className={
                    isLanding
                      ? 'text-slate-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  See Beyond
                </div>
              </div>
              <div>
                <div
                  className={`font-bold ${
                    isLanding
                      ? 'text-violet-400'
                      : 'text-violet-700 dark:text-violet-400'
                  }`}
                >
                  02. Architect
                </div>
                <div
                  className={
                    isLanding
                      ? 'text-slate-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  Think &amp; Code
                </div>
              </div>
              <div>
                <div
                  className={`font-bold ${
                    isLanding
                      ? 'text-emerald-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  03. Lead
                </div>
                <div
                  className={
                    isLanding
                      ? 'text-slate-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  Earn Placement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
