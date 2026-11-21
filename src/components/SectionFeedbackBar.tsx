import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Send,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  FEEDBACK_CATEGORY_META,
  FeedbackCategory,
  FeedbackSectionId,
  SectionFeedbackDoc,
  submitSectionFeedback,
  subscribeMySectionFeedback,
} from '../services/feedbackFirestoreService';

interface SectionFeedbackBarProps {
  user: User;
  sectionId: FeedbackSectionId;
  sectionLabel: string;
  subTopic?: string;
}

const RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Needs Major Improvement', color: 'text-rose-600 dark:text-rose-400' },
  2: { label: 'Can Be Much Better', color: 'text-orange-600 dark:text-orange-400' },
  3: { label: 'Solid & Helpful', color: 'text-amber-600 dark:text-amber-400' },
  4: { label: 'Great Placement Value', color: 'text-emerald-600 dark:text-emerald-400' },
  5: { label: 'Real WOW Experience!', color: 'text-indigo-700 dark:text-indigo-300' },
};

export const SectionFeedbackBar: React.FC<SectionFeedbackBarProps> = ({
  user,
  sectionId,
  sectionLabel,
  subTopic = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>('content_depth');
  const [highlights, setHighlights] = useState('');
  const [improvement, setImprovement] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [myItems, setMyItems] = useState<SectionFeedbackDoc[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMyItems([]);
    const unsub = subscribeMySectionFeedback(
      user,
      sectionId,
      (items) => {
        setMyItems(items);
      },
      (msg) => {
        setErrorMsg(msg);
      }
    );
    return () => unsub();
  }, [user, sectionId]);

  useEffect(() => {
    setToast(null);
    setErrorMsg(null);
  }, [sectionId, subTopic]);

  const activeCategoryMeta =
    FEEDBACK_CATEGORY_META.find((c) => c.id === category) ||
    FEEDBACK_CATEGORY_META[0];
  const activeRating = hoverRating || rating;
  const ratingMeta = RATING_LABELS[activeRating] || RATING_LABELS[5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (improvement.trim().length < 4) {
      setErrorMsg(
        'Please share at least a quick thought or suggestion (4+ characters) so Mentor Kapil can act on it.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await submitSectionFeedback({
        user,
        sectionId,
        sectionLabel,
        subTopic,
        category,
        rating,
        highlights,
        improvement,
      });
      setHighlights('');
      setImprovement('');
      setRating(5);
      setToast(
        'Thank you! Your feedback has been delivered straight to Mentor Kapil’s Admin Feedback Report.'
      );
      setShowHistory(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to save feedback right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Section Feedback for Mentor Kapil"
      className="mt-10 rounded-2xl border border-indigo-200/90 dark:border-indigo-900/70 bg-gradient-to-br from-white via-indigo-50/40 to-amber-50/40 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 shadow-sm overflow-hidden"
    >
      {/* Compact Header Strip */}
      <div className="px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
                Help Mentor Kapil Upgrade This Section
              </span>
              {subTopic && (
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md truncate max-w-[240px]">
                  {subTopic}
                </span>
              )}
              {myItems.length > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                  {myItems.length} Shared by You
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              Rate <span className="text-indigo-700 dark:text-indigo-400">{sectionLabel}</span> &amp; Share Improvement Ideas
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {!expanded && (
            <div className="hidden md:flex items-center gap-0.5 pr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setExpanded(true);
                  }}
                  title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {expanded ? 'Hide Feedback Form' : 'Give Section Feedback'}
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Interactive Feedback Form */}
      {expanded && (
        <div className="px-5 pb-6 pt-2 sm:px-6 border-t border-indigo-100/90 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Interactive 5-Star WOW Rating + Focus Category */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1. Rate Your Experience Here
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} out of 5 stars`}
                        className="p-1 rounded-lg hover:bg-amber-100/60 dark:hover:bg-amber-950/50 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= activeRating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="ml-1">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {activeRating}/5
                    </span>
                    <p className={`text-xs font-bold ${ratingMeta.color}`}>
                      {ratingMeta.label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  2. Feedback Focus Area
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {FEEDBACK_CATEGORY_META.map((cat) => {
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: Optional WOW Highlight + Main Improvement Suggestion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  What Worked Great / WOW Moment{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  maxLength={400}
                  placeholder="e.g., Mentor Kapil’s FAANG solved tips & crisp notes saved me hours!"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Suggestion for Improvement or Advancement *
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium font-mono">
                    {improvement.length}/1000
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  maxLength={1000}
                  placeholder={activeCategoryMeta.promptPlaceholder}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {toast && (
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3.5 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{toast}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Every suggestion goes directly to{' '}
                <strong className="text-slate-700 dark:text-slate-200">
                  Mentor Kapil’s Admin Feedback Dashboard
                </strong>{' '}
                to shape future upgrades.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-extrabold shadow-sm disabled:opacity-60 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Sending to Kapil…' : 'Submit Feedback to Mentor Kapil'}
              </button>
            </div>
          </form>

          {/* Learner's Own Submitted History for This Section */}
          {myItems.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 inline-flex items-center gap-1.5 cursor-pointer"
              >
                {showHistory ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                Your Previous Feedback for This Section ({myItems.length})
              </button>

              {showHistory && (
                <div className="mt-3 space-y-2.5">
                  {myItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-0.5 font-extrabold text-amber-600 dark:text-amber-400">
                            {item.rating}★
                          </span>
                          {item.subTopic && (
                            <span className="font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                              {item.subTopic}
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider ${
                            item.status === 'implemented'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : item.status === 'reviewed'
                              ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {item.status === 'implemented'
                            ? 'Implemented by Kapil'
                            : item.status === 'reviewed'
                            ? 'Reviewed by Kapil'
                            : 'Sent to Kapil'}
                        </span>
                      </div>
                      {item.highlights && (
                        <p className="text-slate-600 dark:text-slate-300 mb-1">
                          <strong className="text-slate-800 dark:text-white">WOW:</strong>{' '}
                          {item.highlights}
                        </p>
                      )}
                      <p className="text-slate-800 dark:text-slate-200">{item.improvement}</p>
                      {item.adminNote && (
                        <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1.5 text-indigo-900 dark:text-indigo-200">
                          <strong>Mentor Kapil’s Reply:</strong> {item.adminNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
