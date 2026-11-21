import { jsPDF } from 'jspdf';
import {
  BadgeDefinition,
  BADGES,
  getLearnerRank,
  LEVELS,
  WORKSHOP_META,
} from '../data/workshopData';
import {
  SHOPPING_BADGES,
  SHOPPING_MCQS,
} from '../data/shoppingNegotiationData';
import {
  ADVANCED_BADGES,
  ADVANCED_META,
  AdvancedBadgeDefinition,
  getAdvancedRank,
} from '../data/advancedTrackData';
import { CAREER_BADGES, CAREER_MCQS } from '../data/careerSkillsData';
import { MASTER_BADGES, MASTER_MCQS } from '../data/masterUniverseData';
import { AdvancedProgressDoc } from '../services/advancedFirestoreService';
import { CareerSkillsProgressDoc } from '../services/careerSkillsFirestoreService';
import { FinalAssessmentDoc } from '../services/finalAssessmentService';
import { LearnerProgressDoc } from '../services/firestoreService';
import { MasterSkillsProgressDoc } from '../services/masterUniverseFirestoreService';
import { ShoppingProgressDoc } from '../services/shoppingFirestoreService';

const PALETTE: Record<
  string,
  { primary: string; glow: string; light: string }
> = {
  blue: { primary: '#2563EB', glow: '#60A5FA', light: '#DBEAFE' },
  emerald: { primary: '#059669', glow: '#34D399', light: '#D1FAE5' },
  amber: { primary: '#D97706', glow: '#FBBF24', light: '#FEF3C7' },
  violet: { primary: '#7C3AED', glow: '#A78BFA', light: '#EDE9FE' },
  rose: { primary: '#E11D48', glow: '#FB7185', light: '#FFE4E6' },
  cyan: { primary: '#0891B2', glow: '#22D3EE', light: '#CFFAFE' },
};

function getTodayFormatted(timestampMs?: number): string {
  return new Date(timestampMs || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Renders a 1200x1200 high-resolution collectible PNG badge and returns its data URL.
 */
export function buildBadgePngDataUrl(params: {
  title: string;
  criteriaLabel: string;
  accent: string;
  trackHeader: string;
  stampLabel: string;
  learnerName: string;
  certificateId: string;
  issueDate?: string;
}): string {
  const S = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const palette = PALETTE[params.accent] ?? PALETTE.blue;
  const issueDate = params.issueDate || getTodayFormatted();

  const bg = ctx.createRadialGradient(S / 2, 430, 80, S / 2, S / 2, 760);
  bg.addColorStop(0, '#16223A');
  bg.addColorStop(0.55, '#0B1120');
  bg.addColorStop(1, '#050811');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = 'rgba(200, 155, 60, 0.58)';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, S - 88, S - 88);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, S - 124, S - 124);

  ctx.textAlign = 'center';
  ctx.fillStyle = palette.glow;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(params.trackHeader, S / 2, 128, S - 160);

  const cx = S / 2;
  const cy = 430;
  const outerR = 235;

  const aura = ctx.createRadialGradient(cx, cy, 120, cx, cy, 320);
  aura.addColorStop(0, `${palette.primary}55`);
  aura.addColorStop(1, 'transparent');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#C89B3C';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 24, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = palette.glow;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy - 16);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 8;
    const r = 92;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const shieldGrad = ctx.createLinearGradient(-80, -80, 80, 80);
  shieldGrad.addColorStop(0, palette.primary);
  shieldGrad.addColorStop(1, '#0F172A');
  ctx.fillStyle = shieldGrad;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FDE047';
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? 58 : 20;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = '#FDE047';
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(params.stampLabel, cx, cy + 148);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 62px "Bricolage Grotesque", Georgia, sans-serif';
  ctx.fillText(params.title, S / 2, 765, S - 180);

  ctx.fillStyle = palette.light;
  ctx.font = '500 25px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(params.criteriaLabel, S / 2, 818, S - 180);

  ctx.strokeStyle = 'rgba(200, 155, 60, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(S / 2 - 220, 855);
  ctx.lineTo(S / 2 + 220, 855);
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('EARNED BY VERIFIED LEARNER', S / 2, 912);

  ctx.fillStyle = '#FDE047';
  ctx.font = '800 44px "Bricolage Grotesque", sans-serif';
  ctx.fillText(params.learnerName, S / 2, 972, S - 180);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(issueDate, 92, 1112);

  ctx.textAlign = 'right';
  ctx.fillText(`CERT ID: ${params.certificateId}`, S - 92, 1112);

  return canvas.toDataURL('image/png');
}

export function buildCoreBadgePngDataUrl(
  badge: BadgeDefinition,
  learnerName: string,
  certificateId: string
): string {
  return buildBadgePngDataUrl({
    title: badge.title,
    criteriaLabel: badge.criteriaLabel,
    accent: badge.accent,
    trackHeader: 'EMPLOYABILITY UNIVERSE WITH KAPIL · PICTURE CONNECT BADGE',
    stampLabel: 'POWERED BY KAPIL',
    learnerName,
    certificateId,
  });
}

export function buildAdvBadgePngDataUrl(
  badge: AdvancedBadgeDefinition,
  learnerName: string,
  advCertificateId: string
): string {
  return buildBadgePngDataUrl({
    title: badge.title,
    criteriaLabel: badge.criteriaLabel,
    accent: badge.accent,
    trackHeader: 'EMPLOYABILITY UNIVERSE WITH KAPIL · AI PICTURE CONNECT',
    stampLabel: 'POWERED BY KAPIL · AI TRACK',
    learnerName,
    certificateId: advCertificateId,
  });
}

/**
 * Generic 1600x1133 museum-grade PNG certificate builder (compact enough for fast Gmail attachment < 450 KB while razor crisp).
 */
export function buildExecutiveCertificatePngDataUrl(params: {
  headerBanner: string;
  mainTitle: string;
  subtitle: string;
  learnerName: string;
  learnerEmail: string;
  citationLine1: string;
  citationLine2: string;
  metrics: { label: string; value: string }[];
  certificateId: string;
  sealTop: string;
  accentColor: string;
  subRibbonText?: string;
  issueDate?: string;
}): string {
  const W = 1800;
  const H = 1275;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const issueDate = params.issueDate || getTodayFormatted();

  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#FCFBF7');
  bgGrad.addColorStop(0.5, '#FFFFFF');
  bgGrad.addColorStop(1, '#F5F7FA');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, W, 28);
  ctx.fillRect(0, H - 28, W, 28);

  ctx.strokeStyle = params.accentColor;
  ctx.lineWidth = 5;
  ctx.strokeRect(54, 54, W - 108, H - 108);

  ctx.strokeStyle = '#C89B3C';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(72, 72, W - 144, H - 144);

  ctx.textAlign = 'center';
  ctx.fillStyle = params.accentColor;
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(params.headerBanner, W / 2, 162, W - 240);

  ctx.fillStyle = '#0F172A';
  ctx.font = '800 54px "Bricolage Grotesque", Georgia, serif';
  ctx.fillText(params.mainTitle, W / 2, 246, W - 220);

  ctx.strokeStyle = '#C89B3C';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 220, 276);
  ctx.lineTo(W / 2 + 220, 276);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '600 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(params.subtitle, W / 2, 326, W - 260);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 19px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('THIS OFFICIAL CREDENTIAL IS PROUDLY AWARDED TO', W / 2, 405);

  ctx.fillStyle = '#0F172A';
  ctx.font = '800 68px "Bricolage Grotesque", Georgia, serif';
  ctx.fillText(params.learnerName, W / 2, 495, W - 320);

  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 360, 524);
  ctx.lineTo(W / 2 + 360, 524);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText(`Verified Google Learner · ${params.learnerEmail}`, W / 2, 562, W - 320);

  ctx.fillStyle = '#334155';
  ctx.font = '400 23px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(params.citationLine1, W / 2, 632, W - 280);
  ctx.fillText(params.citationLine2, W / 2, 670, W - 280);

  // Metric ribbon
  const boxX = 165;
  const boxY = 725;
  const boxW = W - 330;
  const boxH = 136;
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  const colW = boxW / Math.max(1, params.metrics.length);
  params.metrics.forEach((m, idx) => {
    const cx = boxX + colW * idx + colW / 2;
    if (idx > 0) {
      ctx.beginPath();
      ctx.moveTo(boxX + colW * idx, boxY + 24);
      ctx.lineTo(boxX + colW * idx, boxY + boxH - 24);
      ctx.strokeStyle = '#CBD5E1';
      ctx.stroke();
    }
    ctx.fillStyle = '#64748B';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText(m.label, cx, boxY + 50, colW - 28);
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 24px "Bricolage Grotesque", sans-serif';
    ctx.fillText(m.value, cx, boxY + 95, colW - 28);
  });

  if (params.subRibbonText) {
    const subY = 880;
    ctx.fillStyle = '#ECFDF5';
    ctx.fillRect(boxX, subY, boxW, 56);
    ctx.strokeStyle = '#A7F3D0';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, subY, boxW, 56);
    ctx.fillStyle = '#047857';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText(params.subRibbonText, W / 2, subY + 34, boxW - 36);
  }

  // Footer signatures
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(issueDate, 175, 1058);
  ctx.strokeStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(175, 1074);
  ctx.lineTo(525, 1074);
  ctx.stroke();
  ctx.fillStyle = '#64748B';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText(`CERT ID: ${params.certificateId}`, 175, 1104);

  const sealX = W / 2;
  const sealY = 1054;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 80, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#C89B3C';
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FDE047';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText(params.sealTop, sealX, sealY - 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 19px "Bricolage Grotesque", sans-serif';
  ctx.fillText('POWERED BY', sealX, sealY + 4);
  ctx.fillStyle = '#FDE047';
  ctx.font = '800 26px "Bricolage Grotesque", sans-serif';
  ctx.fillText('KAPIL', sealX, sealY + 34);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 26px "Bricolage Grotesque", Georgia, serif';
  ctx.fillText('Powered By Kapil', W - 175, 1058);
  ctx.strokeStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(W - 525, 1074);
  ctx.lineTo(W - 175, 1074);
  ctx.stroke();
  ctx.fillStyle = '#64748B';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillText('EMPLOYABILITY UNIVERSE ARCHITECT', W - 175, 1104);

  return canvas.toDataURL('image/png');
}

export function buildCoreCertificateDataUrl(
  learnerName: string,
  learnerEmail: string,
  progress: LearnerProgressDoc,
  shoppingProgress?: ShoppingProgressDoc
): string {
  const rank = getLearnerRank(progress.xp);
  const completedCount = progress.completedLevels.length;
  const shopAnswered = shoppingProgress?.answeredMcqs.length ?? 0;
  const shopCorrect = shoppingProgress?.correctMcqs.length ?? 0;
  const shopAcc = shopAnswered > 0 ? Math.round((shopCorrect / shopAnswered) * 100) : 0;

  return buildExecutiveCertificatePngDataUrl({
    headerBanner: 'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  PICTURE CONNECT MASTERY',
    mainTitle:
      completedCount === LEVELS.length
        ? 'CERTIFICATE OF EXPERIENTIAL MASTERY'
        : 'CERTIFICATE OF VISUAL ACHIEVEMENT',
    subtitle: WORKSHOP_META.positioning,
    learnerName,
    learnerEmail,
    citationLine1:
      'for demonstrating Visual Intelligence, Creative Synthesis, Structured Communication,',
    citationLine2: `and Executive Problem-Solving across ${completedCount} of 10 Experiential Levels.`,
    metrics: [
      { label: 'TOTAL XP', value: `${progress.xp} XP` },
      { label: 'LEVELS DONE', value: `${completedCount} / 10` },
      { label: 'BADGES', value: `${progress.unlockedBadges.length} / ${BADGES.length}` },
      { label: 'RANK', value: rank.title },
    ],
    certificateId: progress.certificateId,
    sealTop: 'OFFICIAL SEAL',
    accentColor: '#1E3A8A',
    subRibbonText:
      shopAnswered > 0 || (shoppingProgress?.shopXp ?? 0) > 0
        ? `SHOPPING & SMART BUYER: ${shopCorrect}/${SHOPPING_MCQS.length} MCQs (${shopAcc}%) · ${shoppingProgress?.shopXp ?? 0} Shop XP · Lab ${shoppingProgress?.roleplayScore ?? 0}/100`
        : undefined,
  });
}

export function buildShoppingCertificateDataUrl(
  learnerName: string,
  learnerEmail: string,
  shoppingProgress: ShoppingProgressDoc
): string {
  const ans = shoppingProgress.answeredMcqs.length;
  const cor = shoppingProgress.correctMcqs.length;
  const acc = ans > 0 ? Math.round((cor / ans) * 100) : 0;

  return buildExecutiveCertificatePngDataUrl({
    headerBanner: 'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  SHOPPING & NEGOTIATION',
    mainTitle: 'CERTIFICATE OF SMART BUYING & NEGOTIATION',
    subtitle: 'Consumer Psychology · Best-Deal Timing · Commercial Negotiation Mastery',
    learnerName,
    learnerEmail,
    citationLine1:
      'for completing real-world buyer profiling, cross-domain deal timing playbooks,',
    citationLine2: `and scoring ${cor}/${SHOPPING_MCQS.length} MCQs (${acc}%) with Negotiation Lab ${shoppingProgress.roleplayScore}/100.`,
    metrics: [
      { label: 'SHOPPING XP', value: `${shoppingProgress.shopXp} XP` },
      { label: 'MCQ SCORE', value: `${cor}/${SHOPPING_MCQS.length} (${acc}%)` },
      { label: 'ROLE-PLAY LAB', value: `${shoppingProgress.roleplayScore} / 100` },
      {
        label: 'SHOP BADGES',
        value: `${shoppingProgress.unlockedShopBadges.length} / ${SHOPPING_BADGES.length}`,
      },
    ],
    certificateId: shoppingProgress.shopCertificateId,
    sealTop: 'SMART BUYER',
    accentColor: '#047857',
  });
}

export function buildCareerCertificateDataUrl(
  learnerName: string,
  learnerEmail: string,
  careerProgress: CareerSkillsProgressDoc
): string {
  const ans = careerProgress.answeredMcqs.length;
  const cor = careerProgress.correctMcqs.length;
  const acc = ans > 0 ? Math.round((cor / ans) * 100) : 0;

  return buildExecutiveCertificatePngDataUrl({
    headerBanner: 'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  CAREER SKILLS ACADEMY',
    mainTitle: 'CERTIFICATE OF CAREER COMMUNICATION EXCELLENCE',
    subtitle: 'Indianism Mastery · Executive Interview Skills · Group Discussion Leadership',
    learnerName,
    learnerEmail,
    citationLine1:
      'for mastering Global Corporate English, Behavioral STAR Interviews, and GD Strategy',
    citationLine2: `across ${ans}/${CAREER_MCQS.length} graded placement MCQs with ${acc}% accuracy.`,
    metrics: [
      { label: 'CAREER XP', value: `${careerProgress.careerXp} XP` },
      { label: 'MCQ SCORE', value: `${cor}/${CAREER_MCQS.length} (${acc}%)` },
      {
        label: 'TRACKS DONE',
        value: `${careerProgress.completedCategories.length} / 3`,
      },
      {
        label: 'BADGES',
        value: `${careerProgress.unlockedCareerBadges.length} / ${CAREER_BADGES.length}`,
      },
    ],
    certificateId: careerProgress.careerCertificateId,
    sealTop: 'CAREER READY',
    accentColor: '#0E7490',
  });
}

export function buildMasterUniverseCertificateDataUrl(
  learnerName: string,
  learnerEmail: string,
  masterProgress: MasterSkillsProgressDoc
): string {
  const ans = masterProgress.answeredMcqs.length;
  const cor = masterProgress.correctMcqs.length;
  const acc = ans > 0 ? Math.round((cor / ans) * 100) : 0;

  return buildExecutiveCertificatePngDataUrl({
    headerBanner: 'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  16-TRACK MASTER UNIVERSE',
    mainTitle: 'CERTIFICATE OF TECH, APTITUDE & GRAMMAR MASTERY',
    subtitle:
      'Aptitude · Grammar · Tenses · Punctuation · Idioms · C · C++ · Java · Python · DSA · Excel · Power BI · DBMS · Cloud',
    learnerName,
    learnerEmail,
    citationLine1:
      'for demonstrating multi-domain placement readiness across FAANG/IT company problems,',
    citationLine2: `scoring ${cor}/${MASTER_MCQS.length} MCQs (${acc}%) across ${masterProgress.completedTracks.length}/16 Master Tracks.`,
    metrics: [
      { label: 'UNIVERSE XP', value: `${masterProgress.masterXp} XP` },
      { label: 'MCQ SCORE', value: `${cor}/${MASTER_MCQS.length} (${acc}%)` },
      { label: 'TRACKS DONE', value: `${masterProgress.completedTracks.length} / 16` },
      {
        label: 'BADGES',
        value: `${masterProgress.unlockedMasterBadges.length} / ${MASTER_BADGES.length}`,
      },
    ],
    certificateId: masterProgress.masterCertificateId,
    sealTop: 'MASTER TRACK',
    accentColor: '#6D28D9',
  });
}

export function buildAdvancedCertificateDataUrl(
  learnerName: string,
  learnerEmail: string,
  advProgress: AdvancedProgressDoc,
  avgScore: number
): string {
  const rank = getAdvancedRank(advProgress.advXp);
  const completedCount = advProgress.completedChallenges.length;
  return buildExecutiveCertificatePngDataUrl({
    headerBanner: `EMPLOYABILITY UNIVERSE WITH KAPIL  ·  ${ADVANCED_META.title}`,
    mainTitle:
      completedCount >= 25
        ? 'CERTIFICATE OF AI-POWERED VISUAL MASTERY'
        : 'CERTIFICATE OF AI-POWERED EMPLOYABILITY',
    subtitle: ADVANCED_META.tagline,
    learnerName,
    learnerEmail,
    citationLine1:
      'for mastering AI Prompt Design, Visual Evidence Interpretation, and SCARE Storytelling',
    citationLine2: `across ${completedCount} of 25 Real-World Visual Challenges (Avg Auto-Score ${avgScore}/100).`,
    metrics: [
      { label: 'CHALLENGES', value: `${completedCount} / 25` },
      { label: 'AVG SCORE', value: `${avgScore} / 100` },
      { label: 'ADVANCED XP', value: `${advProgress.advXp} XP` },
      {
        label: 'BADGES & RANK',
        value: `${advProgress.unlockedAdvBadges.length}/${ADVANCED_BADGES.length} · ${rank.title}`,
      },
    ],
    certificateId: advProgress.advCertificateId,
    sealTop: 'AI ADVANCED',
    accentColor: '#4338CA',
  });
}

export function buildFinalCertificateDataUrl(
  learnerName: string,
  learnerEmail: string,
  finalDoc: FinalAssessmentDoc,
  shoppingProgress?: ShoppingProgressDoc
): string {
  const collegeClean =
    finalDoc.collegeOrOrg.trim() || 'Campus & Corporate Placement Cohort';
  const targetRoleClean =
    finalDoc.targetRole.trim() || 'Analyst, Product & Technology Roles';
  const shopAnswered = shoppingProgress?.answeredMcqs.length ?? 0;
  const shopCorrect = shoppingProgress?.correctMcqs.length ?? 0;
  const shopAcc = shopAnswered > 0 ? Math.round((shopCorrect / shopAnswered) * 100) : 0;

  return buildExecutiveCertificatePngDataUrl({
    headerBanner: 'EMPLOYABILITY UNIVERSE WITH KAPIL  ·  1000 XP FINAL CAPSTONE',
    mainTitle: 'FINAL CAPSTONE CERTIFICATE OF MERIT',
    subtitle: `${finalDoc.gradeTier.toUpperCase()}  ·  NORMAL + AI ADVANCED SYNTHESIS`,
    learnerName,
    learnerEmail: `${learnerEmail} · ${collegeClean}`,
    citationLine1:
      'for successfully clearing the 90-Minute Proctored Final Assessment (50% Elevated Rigor)',
    citationLine2: `across Real-World Executive Case Studies and SCARE Defense for ${targetRoleClean}.`,
    metrics: [
      {
        label: 'FINAL SCORE',
        value: `${finalDoc.totalXpAwarded}/1000 (${finalDoc.percentageScore}%)`,
      },
      { label: 'DIAGNOSTICS', value: `${finalDoc.mcqScore} / 400 XP` },
      { label: 'CASE STUDIES', value: `${finalDoc.caseScore} / 500 XP` },
      { label: 'SCARE DEFENSE', value: `${finalDoc.scareScore} / 100` },
    ],
    certificateId: `${finalDoc.finalCertificateId} · LOR ${finalDoc.lorVerificationId}`,
    sealTop: '1000 XP',
    accentColor: '#0F172A',
    issueDate: getTodayFormatted(finalDoc.submittedAtMs),
    subRibbonText:
      shopAnswered > 0 || (shoppingProgress?.shopXp ?? 0) > 0
        ? `SHOPPING & SMART BUYER: ${shopCorrect}/${SHOPPING_MCQS.length} MCQs (${shopAcc}%) · Lab ${shoppingProgress?.roleplayScore ?? 0}/100 · ${shoppingProgress?.shopXp ?? 0} Shop XP`
        : undefined,
  });
}

/**
 * Generates the Personalized Placement Letter of Recommendation PDF as a base64 data URL
 * suitable for attaching directly to a Gmail message.
 */
export function buildPersonalizedLorPdfDataUrl(params: {
  learnerName: string;
  learnerEmail: string;
  finalDoc: FinalAssessmentDoc;
  coreProgress: LearnerProgressDoc;
  advProgress: AdvancedProgressDoc;
  advAvgScore: number;
  shoppingProgress?: ShoppingProgressDoc;
}): string {
  const {
    learnerName,
    learnerEmail,
    finalDoc,
    coreProgress,
    advProgress,
    advAvgScore,
    shoppingProgress,
  } = params;

  const docPdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = docPdf.internal.pageSize.getWidth();
  const pageH = docPdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;

  const toPdfSafe = (value: string): string =>
    (value || '')
      .replace(/₹/g, 'Rs. ')
      .replace(/[—–]/g, '-')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/…/g, '...')
      .replace(/•/g, '-')
      .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');

  const issueDate = getTodayFormatted(finalDoc.submittedAtMs);
  const targetRoleClean =
    (finalDoc.targetRole || '').trim() || 'Entry-Level Analyst, Product & Technology Roles';
  const collegeClean =
    (finalDoc.collegeOrOrg || '').trim() || 'Campus & Corporate Placement Cohort';
  const m = Math.floor((finalDoc.timeUsedSeconds || 0) / 60);
  const s = (finalDoc.timeUsedSeconds || 0) % 60;
  const durationLabel = `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;

  const shopAnswered = shoppingProgress?.answeredMcqs?.length ?? 0;
  const shopCorrect = shoppingProgress?.correctMcqs?.length ?? 0;
  const shopAccuracy =
    shopAnswered > 0 ? Math.round((shopCorrect / shopAnswered) * 100) : 0;
  const hasShoppingActivity =
    shopAnswered > 0 ||
    (shoppingProgress?.shopXp ?? 0) > 0 ||
    (shoppingProgress?.roleplayScore ?? 0) > 0;

  docPdf.setFillColor(15, 23, 42);
  docPdf.rect(0, 0, pageW, 10, 'F');
  docPdf.rect(0, pageH - 8, pageW, 8, 'F');
  docPdf.setDrawColor(200, 155, 60);
  docPdf.setLineWidth(0.5);
  docPdf.rect(10, 14, pageW - 20, pageH - 26);

  let y = 26;
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(13.5);
  docPdf.setTextColor(15, 23, 42);
  docPdf.text('EMPLOYABILITY UNIVERSE WITH KAPIL', margin, y);

  docPdf.setFontSize(8.5);
  docPdf.setTextColor(29, 78, 216);
  docPdf.text('POWERED BY KAPIL · ONE-STOP PLACEMENT PORTAL', pageW - margin, y, {
    align: 'right',
  });

  y += 5;
  docPdf.setFont('helvetica', 'normal');
  docPdf.setFontSize(8.5);
  docPdf.setTextColor(100, 116, 139);
  docPdf.text(
    'Visual Intelligence · Analytical Problem-Solving · Executive Communication · Interview Readiness',
    margin,
    y
  );

  y += 4;
  docPdf.setDrawColor(203, 213, 225);
  docPdf.line(margin, y, pageW - margin, y);

  y += 8;
  docPdf.setFont('courier', 'bold');
  docPdf.setFontSize(8.5);
  docPdf.setTextColor(71, 85, 105);
  docPdf.text(`LOR REF: ${toPdfSafe(finalDoc.lorVerificationId)}`, margin, y);
  docPdf.text(`DATE OF ISSUE: ${toPdfSafe(issueDate).toUpperCase()}`, pageW - margin, y, {
    align: 'right',
  });

  y += 5;
  docPdf.text(`CAPSTONE CERT ID: ${toPdfSafe(finalDoc.finalCertificateId)}`, margin, y);
  docPdf.text(`CANDIDATE EMAIL: ${toPdfSafe(learnerEmail)}`, pageW - margin, y, {
    align: 'right',
  });

  y += 12;
  docPdf.setFont('times', 'bold');
  docPdf.setFontSize(15.5);
  docPdf.setTextColor(15, 23, 42);
  docPdf.text('LETTER OF RECOMMENDATION FOR CAMPUS & CORPORATE PLACEMENT', pageW / 2, y, {
    align: 'center',
  });

  y += 3;
  docPdf.setDrawColor(200, 155, 60);
  docPdf.setLineWidth(0.7);
  docPdf.line(pageW / 2 - 42, y, pageW / 2 + 42, y);

  y += 10;
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(10);
  docPdf.text(
    'To Hiring Managers, Talent Acquisition Leaders, and Placement Committees:',
    margin,
    y
  );

  const safeName = toPdfSafe(learnerName);
  const safeCollege = toPdfSafe(collegeClean);
  const safeRole = toPdfSafe(targetRoleClean);
  const safeTier = toPdfSafe(finalDoc.gradeTier);

  const shopClause = hasShoppingActivity
    ? `, and the Shopping, Smart Buyer & Negotiation Studio (${shopCorrect}/${SHOPPING_MCQS.length} MCQs at ${shopAccuracy}%, Lab ${shoppingProgress?.roleplayScore ?? 0}/100, ${shoppingProgress?.shopXp ?? 0} Shop XP)`
    : '';

  const paragraphs = [
    toPdfSafe(
      `It is my privilege to strongly recommend ${safeName} (${safeCollege}) for ${safeRole}. ${safeName} completed our experiential visual-intelligence curriculum and successfully cleared the timed 90-Minute Proctored Final Assessment (1000 XP Capstone) with ${finalDoc.totalXpAwarded}/1000 XP (${finalDoc.percentageScore}% - ${safeTier}), completed in ${durationLabel}.`
    ),
    toPdfSafe(
      `Across the integrated program, ${safeName} demonstrated verifiable proficiency spanning the Core Visual Mastery Track (${coreProgress.completedLevels.length}/10 levels, ${coreProgress.xp} Core XP), the AI-Powered Advanced Track (${advProgress.completedChallenges.length}/25 challenges, avg ${advAvgScore}/100)${shopClause}.`
    ),
    toPdfSafe(
      `In the Final Capstone evaluation, ${safeName} earned ${finalDoc.mcqScore}/400 XP in Rapid Synthesis Diagnostics, ${finalDoc.caseScore}/500 XP across five multi-domain executive case studies, and ${finalDoc.scareScore}/100 XP in the 60-Second SCARE Placement Pitch.`
    ),
    toPdfSafe(
      `Based on these audited responses, ${safeName} exhibits the structured reasoning, ethical integrity, and crisp stakeholder communication required to contribute reliably from Day One. I endorse their candidature without reservation for ${safeRole}.`
    ),
  ];

  docPdf.setFont('times', 'normal');
  docPdf.setFontSize(10);
  docPdf.setTextColor(30, 41, 59);
  for (const p of paragraphs) {
    y += 5;
    const lines = docPdf.splitTextToSize(p, contentW);
    docPdf.text(lines, margin, y);
    y += lines.length * 4.4 + 1.2;
  }

  const sigY = pageH - 42;
  y = Math.min(y + 4, sigY - 38);
  docPdf.setFillColor(248, 250, 252);
  docPdf.setDrawColor(203, 213, 225);
  docPdf.roundedRect(margin, y, contentW, 24, 2, 2, 'FD');

  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(8.5);
  docPdf.setTextColor(29, 78, 216);
  docPdf.text(
    `VERIFIED RECORD: ${finalDoc.totalXpAwarded}/1000 XP (${finalDoc.percentageScore}%) · CORE ${coreProgress.completedLevels.length}/10 · AI ${advProgress.completedChallenges.length}/25 · ${safeTier}`,
    margin + 4,
    y + 14
  );

  docPdf.setDrawColor(148, 163, 184);
  docPdf.line(margin, sigY + 12, margin + 62, sigY + 12);
  docPdf.line(pageW - margin - 68, sigY + 12, pageW - margin, sigY + 12);

  docPdf.setFont('times', 'bolditalic');
  docPdf.setFontSize(14);
  docPdf.setTextColor(15, 23, 42);
  docPdf.text('Kapil Narula', margin, sigY + 9);
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(8.5);
  docPdf.text('Kapil Narula · Powered By Kapil', margin, sigY + 17);
  docPdf.setFont('helvetica', 'normal');
  docPdf.setFontSize(8);
  docPdf.setTextColor(100, 116, 139);
  docPdf.text('Creator & Lead Employability Mentor', margin, sigY + 21);

  docPdf.setFont('courier', 'bold');
  docPdf.setFontSize(8);
  docPdf.setTextColor(15, 23, 42);
  docPdf.text(`VERIFICATION ID: ${toPdfSafe(finalDoc.lorVerificationId)}`, pageW - margin, sigY + 17, {
    align: 'right',
  });
  docPdf.setFont('helvetica', 'normal');
  docPdf.setTextColor(100, 116, 139);
  docPdf.text(`Official Placement Credential · ${toPdfSafe(issueDate)}`, pageW - margin, sigY + 21, {
    align: 'right',
  });

  return docPdf.output('datauristring');
}
