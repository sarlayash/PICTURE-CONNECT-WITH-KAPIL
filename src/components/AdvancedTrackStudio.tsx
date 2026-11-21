import React, { useEffect, useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  ImagePlus,
  Layers,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import {
  ADVANCED_BADGES,
  ADVANCED_META,
  ADVANCED_THEMES,
  AdvancedChallenge,
  AdvancedThemeId,
  AutoScoreResult,
  getAdvancedRank,
  HOW_TO_STEPS,
  LEARNING_LOOP_STEPS,
  MASTER_PROMPT_ADDON,
  PERSONAL_REFLECTION_PROMPTS,
  QUICK_PROMPT_SUFFIX,
  SAMPLE_PRESENTATION,
  SCARE_STEPS,
  scoreAdvancedSubmission,
} from '../data/advancedTrackData';
import {
  AdvancedProgressDoc,
  AdvancedSubmissionDoc,
  saveAndScoreAdvancedChallenge,
} from '../services/advancedFirestoreService';
import { AdvancedAchievements } from './AdvancedAchievements';
import { EmailCredentialRequest } from './EmailCredentialModal';

interface AdvancedTrackStudioProps {
  user: User;
  learnerName: string;
  learnerEmail: string;
  advProgress: AdvancedProgressDoc;
  submissions: Record<string, AdvancedSubmissionDoc>;
  onRequestEmail?: (req: EmailCredentialRequest) => void;
}

type StudioTab = 'challenges' | 'guide' | 'credentials';

const THEME_ACCENT_ACTIVE: Record<AdvancedThemeId, string> = {
  products: 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 dark:border-blue-500 text-blue-900 dark:text-blue-200',
  values: 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200',
  abstract: 'border-violet-600 bg-violet-50/80 dark:bg-violet-950/40 dark:border-violet-500 text-violet-900 dark:text-violet-200',
  placements: 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 dark:border-amber-500 text-amber-900 dark:text-amber-200',
  services: 'border-cyan-600 bg-cyan-50/80 dark:bg-cyan-950/40 dark:border-cyan-500 text-cyan-900 dark:text-cyan-200',
};

/**
 * Compresses an uploaded image file cleanly in-browser via HTML5 Canvas
 * so it stays crisp while remaining safely below Firestore's document size limit.
 */
async function compressImageToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not decode selected image file.'));
      el.src = objectUrl;
    });

    const maxDim = 920;
    let width = img.naturalWidth || img.width || 800;
    let height = img.naturalHeight || img.height || 600;
    if (width > maxDim || height > maxDim) {
      if (width >= height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Browser canvas is unavailable for image processing.');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let quality = 0.82;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (dataUrl.length > 220000 && quality > 0.35) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    if (dataUrl.length > 255000) {
      // Secondary scale-down for extraordinarily dense textures
      const smallCanvas = document.createElement('canvas');
      smallCanvas.width = Math.round(canvas.width * 0.72);
      smallCanvas.height = Math.round(canvas.height * 0.72);
      const sCtx = smallCanvas.getContext('2d');
      if (sCtx) {
        sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
        dataUrl = smallCanvas.toDataURL('image/jpeg', 0.65);
      }
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const AdvancedTrackStudio: React.FC<AdvancedTrackStudioProps> = ({
  user,
  learnerName,
  learnerEmail,
  advProgress,
  submissions,
  onRequestEmail,
}) => {
  const [studioTab, setStudioTab] = useState<StudioTab>('challenges');
  const [activeThemeId, setActiveThemeId] = useState<AdvancedThemeId>('products');
  const [activeChallengeId, setActiveChallengeId] = useState<string>('1.1');

  const activeTheme = useMemo(
    () =>
      ADVANCED_THEMES.find((t) => t.id === activeThemeId) ?? ADVANCED_THEMES[0],
    [activeThemeId]
  );

  const activeChallenge: AdvancedChallenge = useMemo(
    () =>
      activeTheme.challenges.find((c) => c.id === activeChallengeId) ??
      activeTheme.challenges[0],
    [activeTheme, activeChallengeId]
  );

  const savedSub = submissions[activeChallenge.id];

  // Local editor state synced when switching challenge
  const [promptUsed, setPromptUsed] = useState(activeChallenge.brief);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [answers, setAnswers] = useState<[string, string, string, string, string]>([
    '',
    '',
    '',
    '',
    '',
  ]);
  const [scareSummary, setScareSummary] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showScareHints, setShowScareHints] = useState(false);

  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitBanner, setSubmitBanner] = useState<{
    scoreResult: AutoScoreResult;
    xpGain: number;
    newBadges: string[];
  } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDirtyRef = useRef(false);
  const hydratedKeyRef = useRef<string>('');
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const existing = submissions[activeChallenge.id];
    const subKey = `${activeChallenge.id}_${existing?.updatedAtMs ?? existing?.totalScore ?? 'empty'}`;
    hydratedKeyRef.current = subKey;
    isDirtyRef.current = false;

    if (existing) {
      setPromptUsed(existing.promptUsed || activeChallenge.brief);
      setImageDataUrl(existing.imageDataUrl || '');
      setAnswers([
        existing.answer1 || '',
        existing.answer2 || '',
        existing.answer3 || '',
        existing.answer4 || '',
        existing.answer5 || '',
      ]);
      setScareSummary(existing.scareSummary || '');
    } else {
      setPromptUsed(activeChallenge.brief);
      setImageDataUrl('');
      setAnswers(['', '', '', '', '']);
      setScareSummary('');
    }
    setImgError(null);
    setSaveError(null);
    setSubmitBanner(null);
  }, [activeChallenge.id, activeChallenge.brief]);

  // Hydrate all 8 fields if Firestore finishes loading this challenge's submission before user edits
  useEffect(() => {
    if (!savedSub || isDirtyRef.current) return;
    const subKey = `${activeChallenge.id}_${savedSub.updatedAtMs ?? savedSub.totalScore ?? 'loaded'}`;
    if (hydratedKeyRef.current === subKey) return;
    hydratedKeyRef.current = subKey;

    setPromptUsed(savedSub.promptUsed || activeChallenge.brief);
    setImageDataUrl(savedSub.imageDataUrl || '');
    setAnswers([
      savedSub.answer1 || '',
      savedSub.answer2 || '',
      savedSub.answer3 || '',
      savedSub.answer4 || '',
      savedSub.answer5 || '',
    ]);
    setScareSummary(savedSub.scareSummary || '');
  }, [activeChallenge.id, activeChallenge.brief, savedSub]);

  const handleSelectTheme = (themeId: AdvancedThemeId) => {
    setActiveThemeId(themeId);
    const theme = ADVANCED_THEMES.find((t) => t.id === themeId);
    if (theme && theme.challenges[0]) {
      setActiveChallengeId(theme.challenges[0].id);
    }
  };

  const handleAppendAddon = (snippet: string) => {
    isDirtyRef.current = true;
    setPromptUsed((prev) => {
      if (prev.includes(snippet)) return prev;
      const base = prev.trim();
      return base ? `${base}\n\n${snippet}` : snippet;
    });
  };

  const handleCopyPrompt = async () => {
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promptUsed);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) {
      try {
        const ta = document.createElement('textarea');
        ta.value = promptUsed;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        copied = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        copied = false;
      }
    }
    if (copied) {
      setCopiedPrompt(true);
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImgError('Please choose a PNG, JPG, or WebP image file.');
      return;
    }
    setUploadingImg(true);
    setImgError(null);
    try {
      const compressed = await compressImageToDataUrl(file);
      if (compressed.length > 275000) {
        setImgError('Image is still too large after compression. Try a smaller screenshot or image.');
        return;
      }
      isDirtyRef.current = true;
      setImageDataUrl(compressed);
    } catch (err) {
      setImgError(
        err instanceof Error ? err.message : 'Unable to process image file.'
      );
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnswerChange = (idx: number, value: string) => {
    isDirtyRef.current = true;
    setAnswers((prev) => {
      const next: [string, string, string, string, string] = [...prev] as [
        string,
        string,
        string,
        string,
        string,
      ];
      next[idx] = value;
      return next;
    });
  };

  const livePreviewScore = useMemo(
    () =>
      scoreAdvancedSubmission({
        baseBrief: activeChallenge.brief,
        promptUsed,
        hasImage: imageDataUrl.startsWith('data:image/'),
        answers,
        scareSummary,
      }),
    [activeChallenge.brief, promptUsed, imageDataUrl, answers, scareSummary]
  );

  const handleEvaluateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    const answeredCount = answers.filter((a) => a.trim().length >= 3).length;
    if (answeredCount === 0 && !imageDataUrl) {
      setSaveError(
        'Please upload an image or answer at least one thinking question before evaluating.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await saveAndScoreAdvancedChallenge({
        user,
        challenge: activeChallenge,
        currentProgress: advProgress,
        existingSubmissions: submissions,
        promptUsed,
        imageDataUrl,
        answers,
        scareSummary,
      });
      isDirtyRef.current = false;
      setSubmitBanner({
        scoreResult: res.scoreResult,
        xpGain: res.newlyAwardedXp,
        newBadges: res.newlyUnlockedBadges,
      });
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : 'Could not save and score challenge. Check your connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = advProgress.completedChallenges.length;
  const subCount = Object.keys(submissions).length;
  const divisor = Math.max(completedCount, subCount);
  const avgScore =
    divisor > 0 ? Math.round(advProgress.totalScoreSum / divisor) : 0;
  const advRank = getAdvancedRank(advProgress.advXp);

  return (
    <div className="space-y-8">
      {/* Advanced Track Hero & Live Scoreboard */}
      <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-gradient-to-br from-[#FDFBF5] via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="text-xs font-mono font-bold tracking-wider text-indigo-700 dark:text-indigo-400">
              {ADVANCED_META.edition.toUpperCase()} · {ADVANCED_META.poweredBy}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {ADVANCED_META.title}
            </h1>
            <div className="text-sm font-mono font-semibold text-amber-700 dark:text-amber-400">
              {ADVANCED_META.tagline}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {ADVANCED_META.description}
            </p>
          </div>

          <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-white/90 dark:bg-slate-900/90 p-4 sm:min-w-[290px] space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 dark:text-slate-400">
                ADVANCED RANK
              </span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                {advRank.title}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
              <div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  ADV XP
                </div>
                <div className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
                  {advProgress.advXp}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  SCORED
                </div>
                <div className="font-mono text-lg font-bold text-slate-950 dark:text-white tabular-nums">
                  {completedCount}/25
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  AVG /100
                </div>
                <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {avgScore}
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 text-center pt-1 border-t border-slate-100 dark:border-slate-800">
              Isolated Track · Core XP &amp; Levels 1–10 untouched
            </div>
          </div>
        </div>

        {/* Sub-Navigation Switcher inside Advanced Track */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setStudioTab('challenges')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              studioTab === 'challenges'
                ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 hover:border-rose-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5 Themes &amp; 25 Visual Challenges</span>
          </button>

          <button
            type="button"
            onClick={() => setStudioTab('guide')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              studioTab === 'guide'
                ? 'bg-indigo-700 border-indigo-700 text-white shadow-sm'
                : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 hover:border-indigo-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Loop, SCARE &amp; 100-Mark Rubric</span>
          </button>

          <button
            type="button"
            onClick={() => setStudioTab('credentials')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              studioTab === 'credentials'
                ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 hover:border-amber-500'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>
              Advanced Badges ({advProgress.unlockedAdvBadges.length}/{ADVANCED_BADGES.length}) &amp; PNG Certificate
            </span>
          </button>
        </div>
      </section>

      {/* TAB 3: Advanced Badges & PNG Certificate */}
      {studioTab === 'credentials' && (
        <AdvancedAchievements
          learnerName={learnerName}
          learnerEmail={learnerEmail}
          advProgress={advProgress}
          submissions={submissions}
          onJumpToChallenges={() => setStudioTab('challenges')}
          onRequestEmail={onRequestEmail}
        />
      )}

      {/* TAB 2: Learning Loop, SCARE Framework & Rubric Guide */}
      {studioTab === 'guide' && (
        <div className="space-y-8">
          {/* 5-Step Learning Loop */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              The 5-Step Learning Loop
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {LEARNING_LOOP_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-[#FDFBF5] dark:bg-slate-950 space-y-1.5"
                >
                  <div className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400">
                    {item.step}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How to use ChatGPT or Gemini + Master Image-Prompt Add-On */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                How to Use ChatGPT or Gemini
              </h2>
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {HOW_TO_STEPS.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-amber-300/80 dark:border-amber-800/70 bg-[#FDFBF5] dark:bg-slate-900 p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
                  MASTER IMAGE-PROMPT ADD-ON
                </div>
                <p className="text-sm italic text-slate-800 dark:text-slate-200 leading-relaxed">
                  {MASTER_PROMPT_ADDON}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStudioTab('challenges')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Apply Add-On Inside Prompt Studio</span>
              </button>
            </div>
          </section>

          {/* SCARE Presentation Framework + 100-Mark Auto-Scoring Rubric */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                SCARE: From Image to Interview-Ready Answer
              </h2>
              <div className="space-y-2.5">
                {SCARE_STEPS.map((s) => (
                  <div
                    key={s.letter}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white font-display font-bold flex items-center justify-center shrink-0">
                      {s.letter}
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {s.word}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {s.instruction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 space-y-1">
                <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300">
                  SAMPLE 45-SECOND PRESENTATION
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {SAMPLE_PRESENTATION}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  100-Mark Visual Boardroom Auto-Scoring Rubric
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Evaluates individual learners across all 5 employability dimensions automatically upon submission.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-mono text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 px-3">Criteria</th>
                      <th className="py-2.5 px-3">Marks</th>
                      <th className="py-2.5 px-3">Strong Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Observation &amp; Evidence</td>
                      <td className="py-2.5 px-3 font-mono font-bold">20</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        Uploads visual artifact; cites visible details cleanly.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Reasoning &amp; Problem-Solving</td>
                      <td className="py-2.5 px-3 font-mono font-bold">25</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        Explains causes, options, risks, evidence and trade-offs.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Creativity &amp; Connection</td>
                      <td className="py-2.5 px-3 font-mono font-bold">20</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        Refines prompt craft and builds original workplace links.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Practical Action</td>
                      <td className="py-2.5 px-3 font-mono font-bold">20</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        Recommends realistic next steps, pilots, or metrics.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">SCARE Clarity &amp; Completeness</td>
                      <td className="py-2.5 px-3 font-mono font-bold">15</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        Answers all 5 questions concisely + SCARE summary.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  PERSONAL REFLECTION QUESTIONS
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {PERSONAL_REFLECTION_PROMPTS.map((q) => (
                    <li key={q} className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">■</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 1: Interactive Prompt Writing Studio, Image Upload & Auto-Scored Q1-Q5 */}
      {studioTab === 'challenges' && (
        <div className="space-y-6">
          {/* 5 Theme Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ADVANCED_THEMES.map((theme) => {
              const isActive = theme.id === activeTheme.id;
              const doneInTheme = theme.challenges.filter((c) =>
                advProgress.completedChallenges.includes(c.id)
              ).length;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`text-left rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isActive
                      ? THEME_ACCENT_ACTIVE[theme.id]
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="font-bold">THEME {theme.number}</span>
                    <span className="tabular-nums font-semibold">
                      {doneInTheme}/5 Done
                    </span>
                  </div>
                  <div>
                    <div className="font-display font-bold text-base text-slate-950 dark:text-white">
                      {theme.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {theme.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Theme Focus + 5 Visual Challenge Pills */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
                  {activeTheme.number} | {activeTheme.title} — {activeTheme.subtitle}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Employability focus: {activeTheme.employabilityFocus}
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                Select 1 of 5 Visual Challenges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {activeTheme.challenges.map((c) => {
                const sub = submissions[c.id];
                const isSelected = c.id === activeChallenge.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChallengeId(c.id)}
                    className={`text-left rounded-xl border px-3.5 py-2.5 transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'border-indigo-700 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-600/20'
                        : sub
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        #{c.id}
                      </span>
                      {sub ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{sub.totalScore}/100</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Open</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-950 dark:text-white leading-snug">
                      {c.title.replace(`${c.id} `, '')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Challenge Split Workspace */}
          <form
            onSubmit={handleEvaluateAndSave}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* LEFT COLUMN (5 cols): Brief + Prompt Writing Studio + Image Upload */}
            <div className="lg:col-span-5 space-y-5">
              {/* Step 1: Prompt Writing Studio */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    STEP 1 · WRITING PROMPT STUDIO
                  </div>
                  <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    {activeChallenge.title}
                  </h2>
                </div>

                {/* Official PDF Brief Box */}
                <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-[#FDFBF5] dark:bg-slate-950 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase text-amber-800 dark:text-amber-400">
                    Official AI Image-Generation Brief
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeChallenge.brief}
                  </p>
                </div>

                {/* Editable Learner Prompt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Refined AI Image Prompt
                    </label>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {promptUsed.length}/1380
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    maxLength={1380}
                    value={promptUsed}
                    onChange={(e) => {
                      isDirtyRef.current = true;
                      setPromptUsed(e.target.value);
                    }}
                    placeholder="Refine your prompt by adding Indian/global workplace setting, lighting, expressions, and point of view..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAppendAddon(MASTER_PROMPT_ADDON)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-[11px] font-semibold text-amber-900 dark:text-amber-300 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>+ Master Add-On</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAppendAddon(QUICK_PROMPT_SUFFIX)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <span>+ Clean Image Rule</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-indigo-700 hover:bg-slate-800 dark:hover:bg-indigo-600 text-white text-[11px] font-semibold cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3 h-3" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* External Tool Shortcuts */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Generate visual in:</span>
                    <a
                      href="https://gemini.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-400 hover:underline"
                    >
                      <span>Gemini</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://chatgpt.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-400 hover:underline"
                    >
                      <span>ChatGPT</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2: Upload Generated / Chosen Image */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      STEP 2 · UPLOAD VISUAL ARTIFACT
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                      Upload Your Generated Image
                    </h3>
                  </div>
                  {imageDataUrl && (
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      Attached (+12 rubric pts)
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imgError && (
                  <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
                    {imgError}
                  </div>
                )}

                {imageDataUrl ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img
                        src={imageDataUrl}
                        alt={`Learner visual for ${activeChallenge.title}`}
                        className="w-full max-h-72 object-contain mx-auto"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        Cloud-optimized (~{Math.round((imageDataUrl.length * 0.75) / 1024)} KB)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          Replace Image
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            isDirtyRef.current = true;
                            setImageDataUrl('');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingImg}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 p-8 flex flex-col items-center justify-center text-center gap-2 transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                      <ImagePlus className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {uploadingImg
                        ? 'Optimizing image for cloud sync...'
                        : 'Click to Upload Your Generated Image (PNG / JPG / WebP)'}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                      Automatically compressed in-browser so your image persists safely inside your learner portfolio.
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (7 cols): 5 Distinct Thinking Questions + SCARE + Live Auto-Scoring */}
            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      STEP 3 · CONNECT, INTERPRET &amp; RESPOND (Q1–Q5)
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                      Answer All 5 Workplace Thinking Questions
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      LIVE RUBRIC ESTIMATE
                    </div>
                    <div className="text-sm font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
                      {livePreviewScore.totalScore} / 100
                    </div>
                  </div>
                </div>

                {/* Q1 to Q5 Textareas */}
                <div className="space-y-4">
                  {activeChallenge.questions.map((questionText, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        {questionText}
                      </label>
                      <textarea
                        rows={2}
                        maxLength={1180}
                        value={answers[idx]}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        placeholder="Write your reasoning using visible visual evidence and practical workplace thinking..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  ))}
                </div>

                {/* SCARE Presentation Summary */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      SCARE 45-Second Presentation Summary (+Communication Marks)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowScareHints((v) => !v)}
                      className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {showScareHints ? 'Hide SCARE Guide' : 'Show S-C-A-R-E Guide'}
                    </button>
                  </div>

                  {showScareHints && (
                    <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-mono font-bold text-indigo-800 dark:text-indigo-300">
                        S (See) · C (Connect) · A (Analyse) · R (Respond) · E (Express)
                      </div>
                      <div className="italic">{SAMPLE_PRESENTATION}</div>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    maxLength={1180}
                    value={scareSummary}
                    onChange={(e) => {
                      isDirtyRef.current = true;
                      setScareSummary(e.target.value);
                    }}
                    placeholder="“I can see... I connect this image with... The key risk/cause is... I would recommend...”"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {saveError && (
                  <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
                    {saveError}
                  </div>
                )}

                {/* Submit / Auto-Score Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {savedSub ? (
                      <span>
                        Last saved score:{' '}
                        <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                          {savedSub.totalScore}/100
                        </strong>{' '}
                        (resubmit anytime to improve)
                      </span>
                    ) : (
                      <span>
                        First evaluated submission unlocks{' '}
                        <strong className="text-indigo-700 dark:text-indigo-400">
                          100–150 Advanced XP
                        </strong>
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {submitting
                        ? 'Scoring & Saving...'
                        : savedSub
                        ? 'Re-Evaluate & Update Score'
                        : 'Evaluate & Save (Auto-Score /100)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Instant 100-Mark Auto-Score Scorecard (Shown after submit OR from saved record) */}
              {(submitBanner || savedSub) && (
                <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-4">
                  {(() => {
                    const activeScore = submitBanner
                      ? submitBanner.scoreResult
                      : {
                          totalScore: savedSub!.totalScore,
                          obsScore: savedSub!.obsScore,
                          reasonScore: savedSub!.reasonScore,
                          creativityScore: savedSub!.creativityScore,
                          actionScore: savedSub!.actionScore,
                          commScore: savedSub!.commScore,
                          gradeLabel:
                            savedSub!.totalScore >= 85
                              ? 'Boardroom Distinction'
                              : savedSub!.totalScore >= 70
                              ? 'Industry Ready'
                              : savedSub!.totalScore >= 50
                              ? 'Developing Practitioner'
                              : 'Needs Stronger Evidence',
                          feedback: savedSub!.feedback,
                        };

                    return (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                              {submitBanner
                                ? `EVALUATION SAVED · +${submitBanner.xpGain} ADVANCED XP`
                                : 'SAVED AUTO-SCORE REPORT'}
                            </div>
                            <div className="font-display text-xl font-bold text-slate-950 dark:text-white">
                              {activeScore.gradeLabel}
                            </div>
                          </div>
                          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 font-mono text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {activeScore.totalScore} / 100
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                          {[
                            { label: 'Observation', val: activeScore.obsScore, max: 20 },
                            { label: 'Reasoning', val: activeScore.reasonScore, max: 25 },
                            { label: 'Creativity', val: activeScore.creativityScore, max: 20 },
                            { label: 'Action', val: activeScore.actionScore, max: 20 },
                            { label: 'SCARE Clarity', val: activeScore.commScore, max: 15 },
                          ].map((m) => (
                            <div
                              key={m.label}
                              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                            >
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                {m.label}
                              </div>
                              <div className="font-mono text-sm font-bold text-slate-950 dark:text-white tabular-nums mt-0.5">
                                {m.val}/{m.max}
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {activeScore.feedback}
                        </p>

                        {submitBanner && submitBanner.newBadges.length > 0 && (
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                              New Advanced Badge Unlocked! ({submitBanner.newBadges.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => setStudioTab('credentials')}
                              className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              Download PNG Badge →
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
