import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Play,
  Send,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  PROMOTIONAL_SHORT_VIDEOS,
  VIDEO_CASE_STUDIES,
  VideoCaseStudy,
} from '../data/workshopData';
import { ConnectionPostDoc } from '../services/firestoreService';

interface VideoChallengesSectionProps {
  mode: 'landing' | 'portal';
  completedVideoIds?: string[];
  sharedVideoPosts?: ConnectionPostDoc[];
  onSubmitChallenge?: (
    video: VideoCaseStudy,
    reflection: string
  ) => Promise<{ newlyAwardedXp: number; newlyUnlockedBadges: string[] }>;
  onRequestSignIn?: () => void;
}

export const VideoChallengesSection: React.FC<VideoChallengesSectionProps> = ({
  mode,
  completedVideoIds = [],
  sharedVideoPosts = [],
  onSubmitChallenge,
  onRequestSignIn,
}) => {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChallengeSubmit = async (
    e: React.FormEvent,
    video: VideoCaseStudy
  ) => {
    e.preventDefault();
    if (!onSubmitChallenge) return;
    const text = (drafts[video.id] || '').trim();
    if (!text) return;

    setSubmittingId(video.id);
    setErrors((prev) => ({ ...prev, [video.id]: '' }));
    try {
      const res = await onSubmitChallenge(video, text);
      setDrafts((prev) => ({ ...prev, [video.id]: '' }));
      setToasts((prev) => ({
        ...prev,
        [video.id]:
          res.newlyAwardedXp > 0
            ? `Challenge submitted! +${res.newlyAwardedXp} XP added to your profile.`
            : 'Updated challenge reflection published to Learner Wall!',
      }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [video.id]:
          err instanceof Error
            ? err.message
            : 'Unable to save video reflection. Please try again.',
      }));
    } finally {
      setSubmittingId(null);
    }
  };

  const isLanding = mode === 'landing';

  return (
    <div id="video-case-challenges" className="space-y-14">
      {isLanding && (
        <section
          id="promotional-videos"
          className="space-y-5"
          aria-labelledby="promo-videos-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-semibold text-amber-400">
                WATCH DIRECTLY ON LANDING PAGE · SARLAYASH MISSION | POWERED BY KAPIL
              </div>
              <h2
                id="promo-videos-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-white mt-1"
              >
                Official Promotional Reels — EMPLOYABILITY UNIVERSE
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Preview the mission, placement tracks, AI labs, and recruiter-ready credentials in 4 quick official reels right here before signing in.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 shrink-0 tabular-nums">
              {PROMOTIONAL_SHORT_VIDEOS.length} Official Reels · YouTube Shorts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {PROMOTIONAL_SHORT_VIDEOS.map((promo) => (
              <article
                key={promo.id}
                className="rounded-2xl border border-[#1E3563] bg-[#0B1733] overflow-hidden flex flex-col justify-between"
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r ${promo.accentGradient}`}
                  aria-hidden="true"
                />
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5">
                    {/* Unboxed Metadata Strip */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono font-bold text-amber-400 shrink-0">
                          REEL {promo.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{promo.category}</span>
                      </div>
                      <a
                        href={promo.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Shorts</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-white leading-snug">
                        {promo.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {promo.subtitle}
                      </p>
                    </div>

                    {/* Inline Vertical 9:16 YouTube Shorts Player */}
                    <div className="aspect-[9/16] w-full overflow-hidden rounded-xl border border-[#1E335C] bg-slate-950">
                      <iframe
                        src={`https://www.youtube.com/embed/${promo.youtubeId}?rel=0&modestbranding=1`}
                        title={`${promo.title} — EMPLOYABILITY UNIVERSE With Kapil Promotional Reel`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0 block"
                      />
                    </div>

                    {/* Matching Brief & Key Highlights */}
                    <div className="rounded-xl border border-[#1E335C] bg-[#071127] p-3.5 space-y-2.5">
                      <div className="font-display text-xs font-bold text-white">
                        {promo.highlightTitle}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {promo.summary}
                      </p>
                      <div className="space-y-1.5 pt-2 border-t border-[#1E335C]/80">
                        {promo.keyPoints.map((pt, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-[11px] text-slate-200 leading-relaxed"
                          >
                            <span className="font-mono font-bold text-sky-400 shrink-0">
                              0{idx + 1}
                            </span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 pt-1">
                        Takeaway: {promo.takeaway}
                      </div>
                    </div>
                  </div>

                  {/* Matching Action Footer */}
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5 min-w-0">
                      <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Official Preview</span>
                    </span>
                    <button
                      type="button"
                      onClick={onRequestSignIn}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Join Free</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        className="space-y-5"
        aria-labelledby="video-challenges-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div
              className={`text-xs font-mono font-semibold ${
                isLanding ? 'text-sky-400' : 'text-blue-700 dark:text-blue-400'
              }`}
            >
              WATCH DIRECTLY IN PORTAL · REAL-WORLD FILM CHALLENGES
            </div>
            <h2
              id="video-challenges-heading"
              className={`font-display text-2xl sm:text-3xl font-bold mt-1 ${
                isLanding ? 'text-white' : 'text-slate-950 dark:text-white'
              }`}
            >
              Video Case Studies &amp; Leadership Challenges
            </h2>
            <p
              className={`text-sm mt-1 max-w-3xl ${
                isLanding ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Watch both curated films directly inside the workspace, observe the human details others overlook, and complete each leadership challenge.
            </p>
          </div>
          <span
            className={`text-xs font-mono shrink-0 tabular-nums ${
              isLanding ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            2 Case Films · +150 Bonus XP
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {VIDEO_CASE_STUDIES.map((video) => {
          const isDone = completedVideoIds.includes(video.id);
          const videoPosts = sharedVideoPosts.filter(
            (post) => post.promptRef === video.id
          );
          const toast = toasts[video.id];
          const busy = submittingId === video.id;

          const filmGradient =
            video.number === '01'
              ? 'from-sky-500 via-cyan-400 to-blue-600'
              : 'from-rose-500 via-amber-400 to-orange-500';

          return (
            <article
              key={video.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-opacity ${
                isLanding
                  ? 'border-[#1E3563] bg-[#0B1733]'
                  : isDone
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/45 opacity-75 hover:opacity-100'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div
                className={`h-1 w-full ${
                  !isLanding && isDone
                    ? 'bg-slate-300 dark:bg-slate-700'
                    : `bg-gradient-to-r ${filmGradient}`
                }`}
                aria-hidden="true"
              />
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Clean Unboxed Metadata Strip */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 text-xs ${
                    isLanding ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold ${
                        isLanding ? 'text-sky-400' : 'text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      FILM {video.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{video.category}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono font-semibold tabular-nums ${
                        isLanding
                          ? 'text-emerald-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {isDone ? 'Completed' : `+${video.xpReward} XP`}
                    </span>
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
                        isLanding
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <h3
                    className={`font-display text-xl font-bold ${
                      isLanding ? 'text-white' : 'text-slate-950 dark:text-white'
                    }`}
                  >
                    {video.title}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isLanding ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {video.subtitle}
                  </p>
                </div>

                {/* Inline Embedded YouTube Player */}
                <div
                  className={`aspect-video w-full overflow-hidden rounded-xl border bg-slate-950 ${
                    isLanding
                      ? 'border-[#1E335C]'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                    title={`${video.title} — EMPLOYABILITY UNIVERSE With Kapil Video Case Study`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full border-0 block"
                  />
                </div>

                {/* Challenge Brief & Guided Questions */}
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    isLanding
                      ? 'border-[#1E335C] bg-[#071127]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`font-display text-sm font-bold ${
                        isLanding ? 'text-white' : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {video.challengeTitle}
                    </div>
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isLanding ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {video.summary}
                  </p>
                  <div
                    className={`space-y-1.5 pt-2 border-t ${
                      isLanding
                        ? 'border-[#1E335C]/80'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    {video.reflectionQuestions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className={`flex items-start gap-2 text-xs leading-relaxed ${
                          isLanding
                            ? 'text-slate-200'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className={`font-mono font-bold shrink-0 ${
                            isLanding ? 'text-sky-400' : 'text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          0{qIdx + 1}
                        </span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`text-[11px] font-medium pt-1 ${
                      isLanding ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Takeaway: {video.employabilityTakeaway}
                  </div>
                </div>
              </div>

              {/* Action Footer: Landing Sign-In CTA OR Portal Live Submission */}
              {mode === 'landing' ? (
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-sky-400" />
                    <span>Watch above, then submit your challenge inside</span>
                  </span>
                  <button
                    type="button"
                    onClick={onRequestSignIn}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Sign in to Claim +{video.xpReward} XP</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {errors[video.id] && (
                    <div className="p-2.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs font-medium text-red-700 dark:text-red-300">
                      {errors[video.id]}
                    </div>
                  )}
                  {toast && (
                    <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{toast}</span>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleChallengeSubmit(e, video)}
                    className="space-y-2.5"
                  >
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Challenge Insight ({video.title})
                    </label>
                    <textarea
                      rows={2}
                      value={drafts[video.id] || ''}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [video.id]: e.target.value,
                        }))
                      }
                      placeholder="Write your observation, emotional shift you spotted, and your workplace takeaway..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {videoPosts.length} Learner Submission
                        {videoPosts.length === 1 ? '' : 's'}
                      </span>
                      <button
                        type="submit"
                        disabled={busy || !(drafts[video.id] || '').trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {busy
                            ? 'Saving...'
                            : isDone
                            ? 'Post Another Insight'
                            : `Submit Challenge (+${video.xpReward} XP)`}
                        </span>
                      </button>
                    </div>
                  </form>

                  {videoPosts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-36 overflow-y-auto pr-1">
                      {videoPosts.slice(0, 4).map((post) => (
                        <div
                          key={post.id}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {post.authorName}
                            </span>
                            <span className="font-mono">Verified Insight</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {post.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </div>
            </article>
          );
        })}
        </div>
      </section>
    </div>
  );
};
