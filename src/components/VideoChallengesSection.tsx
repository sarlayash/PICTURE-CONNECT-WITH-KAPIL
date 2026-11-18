import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Play,
  Send,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { VIDEO_CASE_STUDIES, VideoCaseStudy } from '../data/workshopData';
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

  const handleChallengeSubmit = async (
    e: React.FormEvent,
    video: VideoCaseStudy
  ) => {
    e.preventDefault();
    if (!onSubmitChallenge) return;
    const text = (drafts[video.id] || '').trim();
    if (!text) return;

    setSubmittingId(video.id);
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
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <section
      id="video-case-challenges"
      className="space-y-5"
      aria-labelledby="video-challenges-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
            WATCH DIRECTLY IN PORTAL · REAL-WORLD FILM CHALLENGES
          </div>
          <h2
            id="video-challenges-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1"
          >
            Video Case Studies &amp; Leadership Challenges
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Watch both curated films directly inside the workspace, observe the human details others overlook, and complete each leadership challenge.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
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

          return (
            <article
              key={video.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Clean Unboxed Metadata Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                      FILM {video.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{video.category}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {isDone ? 'Completed' : `+${video.xpReward} XP`}
                    </span>
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {video.subtitle}
                  </p>
                </div>

                {/* Inline Embedded YouTube Player */}
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                    title={`${video.title} — Picture Connect Video Case Study`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full border-0 block"
                  />
                </div>

                {/* Challenge Brief & Guided Questions */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-display text-sm font-bold text-slate-950 dark:text-white">
                      {video.challengeTitle}
                    </div>
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {video.summary}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    {video.reflectionQuestions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-400 shrink-0">
                          0{qIdx + 1}
                        </span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1">
                    Takeaway: {video.employabilityTakeaway}
                  </div>
                </div>
              </div>

              {/* Action Footer: Landing Sign-In CTA OR Portal Live Submission */}
              {mode === 'landing' ? (
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Watch above, then submit your challenge inside</span>
                  </span>
                  <button
                    type="button"
                    onClick={onRequestSignIn}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Sign in to Claim +{video.xpReward} XP</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
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
            </article>
          );
        })}
      </div>
    </section>
  );
};
