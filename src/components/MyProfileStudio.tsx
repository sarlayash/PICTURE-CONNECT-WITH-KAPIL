import React, { useEffect, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Award,
  Bell,
  BellOff,
  BellRing,
  Briefcase,
  Building2,
  Camera,
  CheckCircle2,
  Compass,
  FileText,
  Github,
  Linkedin,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCircle2,
} from 'lucide-react';
import { BADGES } from '../data/workshopData';
import { ADVANCED_BADGES } from '../data/advancedTrackData';
import { CAREER_BADGES, CAREER_MCQS } from '../data/careerSkillsData';
import { MASTER_BADGES, MASTER_MCQS } from '../data/masterUniverseData';
import { SHOPPING_BADGES, SHOPPING_MCQS } from '../data/shoppingNegotiationData';
import { AdvancedProgressDoc } from '../services/advancedFirestoreService';
import { CareerSkillsProgressDoc } from '../services/careerSkillsFirestoreService';
import { FinalAssessmentDoc } from '../services/finalAssessmentService';
import {
  computeProfileCompleteness,
  isValidMobileInput,
  LearnerProgressDoc,
  normalizeGithubId,
  normalizeLinkedinId,
  PROFILE_DOMAINS,
  PROFILE_INTEREST_OPTIONS,
  ProfileReminderFrequency,
  updateUserProfile,
  UserProfileDoc,
} from '../services/firestoreService';
import {
  buildCredentialEmailHtml,
  buildMissingSectionsReminderEmail,
} from '../services/gmailService';
import { MasterSkillsProgressDoc } from '../services/masterUniverseFirestoreService';
import {
  logLearnerNotification,
  NotificationTargetView,
  requestBrowserPushPermission,
  SectionAuditReport,
  showBrowserPushNotification,
} from '../services/notificationService';
import { ShoppingProgressDoc } from '../services/shoppingFirestoreService';
import {
  buildAdvancedCertificateDataUrl,
  buildCareerCertificateDataUrl,
  buildCoreBadgePngDataUrl,
  buildCoreCertificateDataUrl,
  buildFinalCertificateDataUrl,
  buildMasterUniverseCertificateDataUrl,
  buildPersonalizedLorPdfDataUrl,
  buildShoppingCertificateDataUrl,
} from '../utils/credentialGenerators';
import { EmailCredentialRequest } from './EmailCredentialModal';

interface MyProfileStudioProps {
  user: User;
  profile: UserProfileDoc;
  progress: LearnerProgressDoc;
  shoppingProgress: ShoppingProgressDoc;
  careerProgress: CareerSkillsProgressDoc;
  masterProgress: MasterSkillsProgressDoc;
  advProgress: AdvancedProgressDoc;
  advAvgScore: number;
  finalAssessment: FinalAssessmentDoc;
  audit: SectionAuditReport;
  onRequestEmail: (req: EmailCredentialRequest) => void;
  onNavigateView: (target: NotificationTargetView, levelNum?: number) => void;
}

/**
 * Center-crops and compresses an uploaded image file to a 256x256 JPEG data URL
 * guaranteed under 120 KB for Firestore storage.
 */
async function compressAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid PNG, JPG, or WebP image file.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image file must be under 10 MB.');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Could not decode uploaded image.'));
    el.src = dataUrl;
  });

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable.');

  const side = Math.min(img.width, img.height);
  const sx = Math.floor((img.width - side) / 2);
  const sy = Math.floor((img.height - side) / 2);

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

  let quality = 0.82;
  let output = canvas.toDataURL('image/jpeg', quality);
  while (output.length > 120000 && quality > 0.35) {
    quality -= 0.1;
    output = canvas.toDataURL('image/jpeg', quality);
  }
  if (output.length > 135000) {
    throw new Error('Image could not be compressed cleanly. Try another photo.');
  }
  return output;
}

export const MyProfileStudio: React.FC<MyProfileStudioProps> = ({
  user,
  profile,
  progress,
  shoppingProgress,
  careerProgress,
  masterProgress,
  advProgress,
  advAvgScore,
  finalAssessment,
  audit,
  onRequestEmail,
  onNavigateView,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [customPhotoDataUrl, setCustomPhotoDataUrl] = useState(
    profile.customPhotoDataUrl || ''
  );
  const [linkedinId, setLinkedinId] = useState(profile.linkedinId);
  const [githubId, setGithubId] = useState(profile.githubId);
  const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber);
  const [college, setCollege] = useState(profile.college);
  const [domain, setDomain] = useState(profile.domain);
  const [customDomain, setCustomDomain] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setCustomPhotoDataUrl(profile.customPhotoDataUrl || '');
    setLinkedinId(profile.linkedinId);
    setGithubId(profile.githubId);
    setMobileNumber(profile.mobileNumber);
    setCollege(profile.college);
    if (profile.domain && !PROFILE_DOMAINS.includes(profile.domain)) {
      setDomain('__custom__');
      setCustomDomain(profile.domain);
    } else {
      setDomain(profile.domain);
      setCustomDomain('');
    }
    const tokens = profile.areaOfInterest
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const known = tokens.filter((t) => PROFILE_INTEREST_OPTIONS.includes(t));
    const extra = tokens.filter((t) => !PROFILE_INTEREST_OPTIONS.includes(t));
    setSelectedInterests(known);
    setCustomInterest(extra.join(', '));
  }, [profile]);

  const effectiveAvatar = customPhotoDataUrl || profile.photoURL || '';
  const effectiveDomain =
    domain === '__custom__' ? customDomain.trim() : domain.trim();
  const effectiveInterests = [
    ...selectedInterests,
    ...customInterest
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  ]
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .join(', ')
    .slice(0, 200);

  const livePreviewProfile: UserProfileDoc = {
    ...profile,
    displayName,
    customPhotoDataUrl,
    linkedinId,
    githubId,
    mobileNumber,
    college,
    domain: effectiveDomain,
    areaOfInterest: effectiveInterests,
  };
  const completeness = computeProfileCompleteness(livePreviewProfile);
  const signupEmail = user.email || profile.email;

  const totalEarnedBadges =
    progress.unlockedBadges.length +
    shoppingProgress.unlockedShopBadges.length +
    careerProgress.unlockedCareerBadges.length +
    masterProgress.unlockedMasterBadges.length +
    advProgress.unlockedAdvBadges.length;

  const totalMaxBadges =
    BADGES.length +
    SHOPPING_BADGES.length +
    CAREER_BADGES.length +
    MASTER_BADGES.length +
    ADVANCED_BADGES.length;

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setErrorMessage(null);
    setSaveMessage(null);
    try {
      const compressed = await compressAvatarFile(file);
      setCustomPhotoDataUrl(compressed);
      await updateUserProfile(user, { customPhotoDataUrl: compressed });
      setSaveMessage('Profile picture uploaded and saved!');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to upload profile picture.'
      );
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetPhoto = async () => {
    setUploadingPhoto(true);
    setErrorMessage(null);
    try {
      setCustomPhotoDataUrl('');
      await updateUserProfile(user, { customPhotoDataUrl: '' });
      setSaveMessage('Reverted to your default Google profile picture.');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not reset photo.'
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveMessage(null);

    if (!displayName.trim()) {
      setErrorMessage('Display Name cannot be empty.');
      return;
    }
    if (!isValidMobileInput(mobileNumber)) {
      setErrorMessage('Please enter a valid 7–15 digit mobile number (or leave blank).');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(user, {
        displayName: displayName.trim(),
        linkedinId: linkedinId.trim(),
        githubId: githubId.trim(),
        mobileNumber: mobileNumber.trim(),
        college: college.trim(),
        domain: effectiveDomain,
        areaOfInterest: effectiveInterests,
      });
      setSaveMessage(
        'My Profile saved to your verified Employability Universe account!'
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not save profile changes.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePush = async () => {
    setPushBusy(true);
    setErrorMessage(null);
    setSaveMessage(null);
    try {
      if (!profile.pushEnabled) {
        const perm = await requestBrowserPushPermission();
        if (perm === 'denied') {
          setErrorMessage(
            'Browser notifications are blocked in site settings. Email & in-app reminders remain active.'
          );
          await updateUserProfile(user, { pushEnabled: false });
          return;
        }
        await updateUserProfile(user, { pushEnabled: true });
        await showBrowserPushNotification({
          title: 'EMPLOYABILITY UNIVERSE Push Alerts Active',
          body: `We will remind you about your ${audit.missingOrIncompleteItems.length} remaining sections and celebrate completions!`,
          targetView: 'journey',
          tag: 'euwk-profile-push',
        });
        setSaveMessage('Push notifications enabled!');
      } else {
        await updateUserProfile(user, { pushEnabled: false });
        setSaveMessage('Push notifications paused.');
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to update push notifications.'
      );
    } finally {
      setPushBusy(false);
    }
  };

  const handleFrequencySelect = async (freq: ProfileReminderFrequency) => {
    try {
      await updateUserProfile(user, { reminderFrequency: freq });
      setSaveMessage('Reminder frequency updated.');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not update frequency.'
      );
    }
  };

  const handleTriggerPushReminderNow = async () => {
    setPushBusy(true);
    try {
      const firstMissing = audit.missingOrIncompleteItems[0];
      const title = firstMissing
        ? `Missing Section Alert: ${firstMissing.title}`
        : 'All Sections Completed · EMPLOYABILITY UNIVERSE';
      const body = firstMissing
        ? firstMissing.actionHint
        : 'Every tracked section is complete! Email your certificates & LOR now.';
      await requestBrowserPushPermission();
      const res = await showBrowserPushNotification({
        title,
        body,
        targetView: firstMissing?.targetView || 'achievements',
      });
      await logLearnerNotification({
        user,
        kind: firstMissing ? 'missing_reminder' : 'section_completed',
        title,
        body,
        targetView: firstMissing?.targetView || 'achievements',
        credentialType: 'reminder_digest',
        channel: res.delivered ? 'push' : 'in_app',
        sentBy: 'learner',
      });
      await updateUserProfile(user, { lastReminderAtMs: Date.now() });
      setSaveMessage(
        res.delivered
          ? 'Push reminder delivered & saved to your alert feed!'
          : 'Reminder added to your Notification Center!'
      );
    } finally {
      setPushBusy(false);
    }
  };

  const handleEmailMissingDigest = () => {
    if (!signupEmail) return;
    const digest = buildMissingSectionsReminderEmail({
      learnerName: displayName || profile.displayName,
      learnerEmail: signupEmail,
      overallCompletionPct: audit.overallCompletionPct,
      completedSections: audit.completedItems.map((i) => ({
        title: i.title,
        detail: i.currentLabel,
      })),
      missingSections: audit.missingOrIncompleteItems.map((i) => ({
        title: i.title,
        detail: i.currentLabel,
        actionHint: i.actionHint,
      })),
    });
    onRequestEmail({
      recipientEmail: signupEmail,
      recipientName: displayName || profile.displayName,
      credentialType: 'reminder_digest',
      title: 'Missing Sections & Completion Reminder',
      subject: digest.subject,
      htmlBody: digest.htmlBody,
      textFallback: digest.textFallback,
      targetView: audit.missingOrIncompleteItems[0]?.targetView || 'journey',
    });
  };

  const handleEmailCertificate = (
    kind: 'core' | 'shopping' | 'career' | 'master' | 'advanced' | 'final'
  ) => {
    if (!signupEmail) return;
    const name = displayName.trim() || profile.displayName;
    let dataUrl = '';
    let filename = '';
    let title = '';
    let certId = '';
    let summaryPoints: string[] = [];
    let targetView: NotificationTargetView = 'achievements';

    if (kind === 'core') {
      dataUrl = buildCoreCertificateDataUrl(name, signupEmail, progress, shoppingProgress);
      filename = 'Employability-Universe-Core-Certificate-Kapil.png';
      title = 'Core Visual Mastery Certificate (PNG)';
      certId = progress.certificateId;
      summaryPoints = [
        `Total Core XP: ${progress.xp} XP`,
        `Levels Completed: ${progress.completedLevels.length}/10`,
        `Core Badges Unlocked: ${progress.unlockedBadges.length}/${BADGES.length}`,
      ];
      targetView = 'achievements';
    } else if (kind === 'shopping') {
      dataUrl = buildShoppingCertificateDataUrl(name, signupEmail, shoppingProgress);
      filename = 'Employability-Universe-Shopping-Negotiation-Certificate-Kapil.png';
      title = 'Shopping & Smart Buyer Certificate (PNG)';
      certId = shoppingProgress.shopCertificateId;
      summaryPoints = [
        `Shopping MCQs Correct: ${shoppingProgress.correctMcqs.length}/${SHOPPING_MCQS.length}`,
        `Negotiation Role-Play Lab: ${shoppingProgress.roleplayScore}/100`,
        `Shopping XP: ${shoppingProgress.shopXp} XP · Badges: ${shoppingProgress.unlockedShopBadges.length}/${SHOPPING_BADGES.length}`,
      ];
      targetView = 'shopping';
    } else if (kind === 'career') {
      dataUrl = buildCareerCertificateDataUrl(name, signupEmail, careerProgress);
      filename = 'Employability-Universe-Career-Skills-Certificate-Kapil.png';
      title = 'Career Skills Academy Certificate (PNG)';
      certId = careerProgress.careerCertificateId;
      summaryPoints = [
        `Career MCQs Correct: ${careerProgress.correctMcqs.length}/${CAREER_MCQS.length}`,
        `Career XP: ${careerProgress.careerXp} XP`,
        `Badges Unlocked: ${careerProgress.unlockedCareerBadges.length}/${CAREER_BADGES.length}`,
      ];
      targetView = 'career';
    } else if (kind === 'master') {
      dataUrl = buildMasterUniverseCertificateDataUrl(name, signupEmail, masterProgress);
      filename = 'Employability-Universe-16-Track-Master-Certificate-Kapil.png';
      title = '16-Track Master Universe Certificate (PNG)';
      certId = masterProgress.masterCertificateId;
      summaryPoints = [
        `Universe MCQs Correct: ${masterProgress.correctMcqs.length}/${MASTER_MCQS.length}`,
        `Completed Tracks: ${masterProgress.completedTracks.length}/16`,
        `Universe XP: ${masterProgress.masterXp} XP`,
      ];
      targetView = 'universe';
    } else if (kind === 'advanced') {
      dataUrl = buildAdvancedCertificateDataUrl(
        name,
        signupEmail,
        advProgress,
        advAvgScore
      );
      filename = 'Employability-Universe-AI-Advanced-Certificate-Kapil.png';
      title = 'AI-Powered Advanced Track Certificate (PNG)';
      certId = advProgress.advCertificateId;
      summaryPoints = [
        `AI Visual Challenges Scored: ${advProgress.completedChallenges.length}/25`,
        `Average Auto-Score: ${advAvgScore}/100`,
        `Advanced XP: ${advProgress.advXp} XP`,
      ];
      targetView = 'advanced';
    } else {
      if (!finalAssessment.passed) return;
      dataUrl = buildFinalCertificateDataUrl(
        name,
        signupEmail,
        finalAssessment,
        shoppingProgress
      );
      filename = 'Employability-Universe-Final-Capstone-Certificate-Kapil.png';
      title = '1000 XP Final Capstone Certificate (PNG)';
      certId = finalAssessment.finalCertificateId;
      summaryPoints = [
        `Final Capstone Score: ${finalAssessment.totalXpAwarded}/1000 XP (${finalAssessment.percentageScore}%)`,
        `Grade Tier: ${finalAssessment.gradeTier}`,
        `LOR Verification ID: ${finalAssessment.lorVerificationId}`,
      ];
      targetView = 'final';
    }

    const { htmlBody, textFallback } = buildCredentialEmailHtml({
      learnerName: name,
      learnerEmail: signupEmail,
      credentialKindLabel: 'Official Verified PNG Certificate',
      credentialTitle: title,
      certificateId: certId,
      summaryPoints,
    });

    onRequestEmail({
      recipientEmail: signupEmail,
      recipientName: name,
      credentialType: 'certificate',
      title,
      subject: `Your Official ${title} — EMPLOYABILITY UNIVERSE With Kapil`,
      htmlBody,
      textFallback,
      targetView,
      attachment: {
        filename,
        mimeType: 'image/png',
        base64OrDataUrl: dataUrl,
      },
    });
  };

  const handleEmailLorPdf = () => {
    if (!signupEmail || !finalAssessment.passed) return;
    const name = displayName.trim() || profile.displayName;
    const pdfDataUrl = buildPersonalizedLorPdfDataUrl({
      learnerName: name,
      learnerEmail: signupEmail,
      finalDoc: finalAssessment,
      coreProgress: progress,
      advProgress,
      advAvgScore,
      shoppingProgress,
    });

    const { htmlBody, textFallback } = buildCredentialEmailHtml({
      learnerName: name,
      learnerEmail: signupEmail,
      credentialKindLabel: 'Personalized Placement Letter of Recommendation (PDF)',
      credentialTitle: 'Official Placement LOR — Signed by Kapil Narula',
      certificateId: finalAssessment.lorVerificationId,
      summaryPoints: [
        `Final Capstone Result: ${finalAssessment.totalXpAwarded}/1000 XP (${finalAssessment.percentageScore}% — ${finalAssessment.gradeTier})`,
        `Core Levels: ${progress.completedLevels.length}/10 · AI Challenges: ${advProgress.completedChallenges.length}/25`,
        `Target Role: ${finalAssessment.targetRole || 'Campus & Corporate Placement Roles'}`,
      ],
      footerNote:
        'Attach this official PDF Letter of Recommendation to your resume portfolio, campus placement portal, and recruiter emails.',
    });

    onRequestEmail({
      recipientEmail: signupEmail,
      recipientName: name,
      credentialType: 'lor',
      title: 'Personalized Placement LOR (PDF)',
      subject: `Your Personalized Placement LOR (PDF) — EMPLOYABILITY UNIVERSE With Kapil`,
      htmlBody,
      textFallback,
      targetView: 'final',
      attachment: {
        filename: `Employability-Universe-LOR-${name.replace(/[^a-zA-Z0-9]+/g, '-')}-Kapil.pdf`,
        mimeType: 'application/pdf',
        base64OrDataUrl: pdfDataUrl,
      },
    });
  };

  const handleEmailFeaturedBadge = () => {
    if (!signupEmail) return;
    const earnedCore = BADGES.find((b) => progress.unlockedBadges.includes(b.id));
    if (!earnedCore) return;
    const name = displayName.trim() || profile.displayName;
    const png = buildCoreBadgePngDataUrl(earnedCore, name, progress.certificateId);
    const { htmlBody, textFallback } = buildCredentialEmailHtml({
      learnerName: name,
      learnerEmail: signupEmail,
      credentialKindLabel: 'Verified Achievement Badge (PNG Medallion)',
      credentialTitle: `${earnedCore.title} Badge`,
      certificateId: progress.certificateId,
      summaryPoints: [
        `Badge Unlocked: ${earnedCore.title} — ${earnedCore.criteriaLabel}`,
        `Total Badges Across Portal: ${totalEarnedBadges} / ${totalMaxBadges}`,
        `Current Core XP: ${progress.xp} XP`,
      ],
    });
    onRequestEmail({
      recipientEmail: signupEmail,
      recipientName: name,
      credentialType: 'badge',
      title: `${earnedCore.title} Badge (PNG)`,
      subject: `Your Earned Badge: ${earnedCore.title} — EMPLOYABILITY UNIVERSE With Kapil`,
      htmlBody,
      textFallback,
      targetView: 'achievements',
      attachment: {
        filename: `Badge-${earnedCore.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
        mimeType: 'image/png',
        base64OrDataUrl: png,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Executive Profile Banner */}
      <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500" />
        <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Uploader */}
            <div className="relative shrink-0">
              {effectiveAvatar ? (
                <img
                  src={effectiveAvatar}
                  alt={displayName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-display text-3xl font-extrabold shadow-md">
                  {(displayName || 'L').slice(0, 2).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                disabled={uploadingPhoto}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload profile picture"
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-950 dark:bg-blue-600 hover:bg-slate-800 text-white shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                MY PROFILE · EMPLOYABILITY UNIVERSE LEARNER PASSPORT
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                {displayName || 'Verified Learner'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-mono text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {signupEmail}
                </span>
                {college && (
                  <>
                    <span>·</span>
                    <span>{college}</span>
                  </>
                )}
                {effectiveDomain && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                      {effectiveDomain}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{uploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
                </button>
                {customPhotoDataUrl && (
                  <button
                    type="button"
                    disabled={uploadingPhoto}
                    onClick={handleResetPhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Use Google Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Completeness Gauge */}
          <div className="w-full lg:w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Profile Readiness
              </span>
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                {completeness.percent}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${completeness.percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {completeness.missingLabels.length === 0
                ? '100% placement-ready profile!'
                : `Add: ${completeness.missingLabels.slice(0, 3).join(', ')}`}
            </div>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs font-semibold text-red-800 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Editable Profile Form */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Learner Details &amp; Career Identity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Used to personalize your Placement LOR, Mentor reports, and recruiter portfolio.
              </p>
            </div>
            <UserCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name *
              </span>
              <input
                type="text"
                required
                maxLength={100}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Mobile Number
              </span>
              <input
                type="tel"
                maxLength={25}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="space-y-1.5 block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                College / University / Organization
              </span>
              <input
                type="text"
                maxLength={160}
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g., B.Tech CSE — Final Year, XYZ University"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                LinkedIn ID or Profile URL
              </span>
              <input
                type="text"
                maxLength={160}
                value={linkedinId}
                onChange={(e) => setLinkedinId(e.target.value)}
                placeholder="linkedin.com/in/your-handle"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {linkedinId.trim() && (
                <a
                  href={normalizeLinkedinId(linkedinId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-blue-700 dark:text-blue-400 hover:underline block truncate"
                >
                  {normalizeLinkedinId(linkedinId)}
                </a>
              )}
            </label>

            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                GitHub ID or Profile URL
              </span>
              <input
                type="text"
                maxLength={160}
                value={githubId}
                onChange={(e) => setGithubId(e.target.value)}
                placeholder="github.com/your-username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {githubId.trim() && (
                <a
                  href={normalizeGithubId(githubId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-indigo-700 dark:text-indigo-400 hover:underline block truncate"
                >
                  {normalizeGithubId(githubId)}
                </a>
              )}
            </label>

            <label className="space-y-1.5 block sm:col-span-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Primary Domain
              </span>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select your target career domain...</option>
                {PROFILE_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="__custom__">Other (Specify custom domain)</option>
              </select>
              {domain === '__custom__' && (
                <input
                  type="text"
                  maxLength={100}
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="Enter your custom domain (e.g., Cybersecurity & Networking)"
                  className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </label>
          </div>

          {/* Area of Interest Chips + Custom */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Area of Interest (Select multiple)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROFILE_INTEREST_OPTIONS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-indigo-700 border-indigo-700 text-white'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              maxLength={120}
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Any other interests? (comma-separated, e.g., FinTech, DevOps)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-500">
              Sign-Up Email (locked): {signupEmail}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save My Profile'}</span>
            </button>
          </div>
        </form>

        {/* Right 5 Cols: Push Reminders + Email Credentials Center */}
        <div className="lg:col-span-5 space-y-6">
          {/* Push Notifications & Section Reminders */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
                  SMART STUDY REMINDERS
                </div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Push &amp; Email Section Reminders
                </h2>
              </div>
              {profile.pushEnabled ? (
                <Bell className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <BellOff className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get proactive browser push alerts and email digests for your{' '}
              <strong>{audit.missingOrIncompleteItems.length}</strong> remaining sections and celebrate every completed module.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Browser Push Alerts
              </span>
              <button
                type="button"
                disabled={pushBusy}
                onClick={handleTogglePush}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  profile.pushEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                {profile.pushEnabled ? 'Enabled · Click to Pause' : 'Enable Push'}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-slate-500">
                Reminder Frequency
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'daily', label: 'Daily' },
                    { id: 'every_3_days', label: '3 Days' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'off', label: 'Paused' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleFrequencySelect(opt.id)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      profile.reminderFrequency === opt.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={pushBusy}
                onClick={handleTriggerPushReminderNow}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-600" />
                <span>Send Push Now</span>
              </button>
              <button
                type="button"
                onClick={handleEmailMissingDigest}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Checklist</span>
              </button>
            </div>
          </div>

          {/* Email My Badges, Certificates & LOR Hub */}
          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  CREDENTIAL DELIVERY TO SIGN-UP EMAIL
                </div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Email Badges, Certificates &amp; LOR
                </h2>
              </div>
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Send any earned PNG badge, verified PNG certificate, or Placement LOR PDF directly to{' '}
              <strong className="font-mono text-slate-900 dark:text-white">
                {signupEmail}
              </strong>
              .
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleEmailCertificate('core')}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/70 dark:bg-slate-950/60 text-left cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Core Visual Mastery Certificate (PNG)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-blue-700 dark:text-blue-400 shrink-0">
                  Email →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleEmailCertificate('shopping')}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/70 dark:bg-slate-950/60 text-left cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shopping &amp; Smart Buyer Certificate (PNG)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                  Email →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleEmailCertificate('career')}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 bg-slate-50/70 dark:bg-slate-950/60 text-left cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Career Skills Academy Certificate (PNG)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-400 shrink-0">
                  Email →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleEmailCertificate('master')}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-500 bg-slate-50/70 dark:bg-slate-950/60 text-left cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>16-Track Master Universe Certificate (PNG)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-violet-700 dark:text-violet-400 shrink-0">
                  Email →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleEmailCertificate('advanced')}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-950/60 text-left cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>AI-Powered Advanced Certificate (PNG)</span>
                </span>
                <span className="text-[11px] font-mono font-semibold text-indigo-700 dark:text-indigo-400 shrink-0">
                  Email →
                </span>
              </button>

              <div className="pt-1 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {progress.unlockedBadges.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleEmailFeaturedBadge}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-amber-300/80 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-amber-950 dark:text-amber-200">
                      <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Email Earned Badge PNG ({totalEarnedBadges}/{totalMaxBadges} unlocked)
                      </span>
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400 shrink-0">
                      Email →
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigateView('levels', 1)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:text-blue-700 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock your first badge in Level 1 to email it</span>
                    </span>
                    <span className="font-mono text-[11px]">Start →</span>
                  </button>
                )}

                {finalAssessment.passed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEmailCertificate('final')}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950 dark:bg-blue-700 hover:opacity-90 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>Email Final Cert</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailLorPdf}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Email LOR (PDF)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigateView('final')}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 hover:text-blue-700 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pass Final 1000 XP Exam to email Final Cert &amp; LOR</span>
                    </span>
                    <span className="font-mono text-[11px]">View →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
