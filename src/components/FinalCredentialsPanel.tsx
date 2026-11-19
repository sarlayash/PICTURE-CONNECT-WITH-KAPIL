import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Award,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FINAL_ASSESSMENT_META } from '../data/finalAssessmentData';
import { AdvancedProgressDoc } from '../services/advancedFirestoreService';
import { FinalAssessmentDoc } from '../services/finalAssessmentService';
import { LearnerProgressDoc } from '../services/firestoreService';

interface FinalCredentialsPanelProps {
  learnerName: string;
  learnerEmail: string;
  finalDoc: FinalAssessmentDoc;
  coreProgress: LearnerProgressDoc;
  advProgress: AdvancedProgressDoc;
  advAvgScore: number;
  onStartSecondAttempt?: () => void;
  retryingSecondAttempt?: boolean;
  retryError?: string | null;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export const FinalCredentialsPanel: React.FC<FinalCredentialsPanelProps> = ({
  learnerName,
  learnerEmail,
  finalDoc,
  coreProgress,
  advProgress,
  advAvgScore,
  onStartSecondAttempt,
  retryingSecondAttempt = false,
  retryError = null,
}) => {
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingLorPdf, setDownloadingLorPdf] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const issueDate = new Date(
    finalDoc.submittedAtMs || Date.now()
  ).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const targetRoleClean =
    finalDoc.targetRole.trim() || 'Entry-Level Analyst, Product & Technology Roles';
  const collegeClean =
    finalDoc.collegeOrOrg.trim() || 'Campus & Corporate Placement Cohort';

  const handleDownloadFinalCertificatePng = () => {
    if (!finalDoc.passed) return;
    setDownloadingPng(true);
    setStatusNote(null);

    try {
      const canvas = canvasRef.current ?? document.createElement('canvas');
      const W = 2400;
      const H = 1700;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Museum obsidian-gold & ivory certificate palette
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#FDFCF8');
      bgGrad.addColorStop(0.5, '#FFFFFF');
      bgGrad.addColorStop(1, '#F4F6FA');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Top & bottom deep obsidian bands
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, W, 42);
      ctx.fillRect(0, H - 42, W, 42);

      // Double gold & navy borders
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 7;
      ctx.strokeRect(72, 72, W - 144, H - 144);

      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 3;
      ctx.strokeRect(94, 94, W - 188, H - 188);

      // Corner ornaments
      const corners = [
        [94, 94, 1, 1],
        [W - 94, 94, -1, 1],
        [94, H - 94, 1, -1],
        [W - 94, H - 94, -1, -1],
      ];
      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 6;
      corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * 54);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * 54, cy);
        ctx.stroke();
      });

      // Header
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1D4ED8';
      ctx.font = '700 26px "JetBrains Mono", monospace';
      ctx.fillText(
        'PICTURE CONNECT WITH KAPIL  ·  1000 XP FINAL CAPSTONE ASSESSMENT',
        W / 2,
        210
      );

      // Main Title
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 72px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText('FINAL CAPSTONE CERTIFICATE OF MERIT', W / 2, 322);

      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 320, 362);
      ctx.lineTo(W / 2 + 320, 362);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '700 28px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        `${finalDoc.gradeTier.toUpperCase()}  ·  NORMAL + AI ADVANCED SYNTHESIS`,
        W / 2,
        422
      );

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText('THIS FINAL CREDENTIAL IS PROUDLY AWARDED TO', W / 2, 526);

      // Recipient Name
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 94px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText(learnerName, W / 2, 646, W - 440);

      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 480, 686);
      ctx.lineTo(W / 2 + 480, 686);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '500 23px "JetBrains Mono", monospace';
      ctx.fillText(
        `Verified Google Candidate · ${learnerEmail} · ${collegeClean}`,
        W / 2,
        736,
        W - 420
      );

      // Citation
      ctx.fillStyle = '#334155';
      ctx.font = '400 30px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(
        'for successfully completing the 90-Minute Proctored Final Assessment (50% Elevated Rigor)',
        W / 2,
        826,
        W - 400
      );
      ctx.fillText(
        `across Real-World Executive Case Studies, Rapid Synthesis Diagnostics, and SCARE Defense for ${targetRoleClean}.`,
        W / 2,
        874,
        W - 400
      );

      // 4-Metric Ribbon
      const boxX = 220;
      const boxY = 956;
      const boxW = W - 440;
      const boxH = 186;
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      const metrics = [
        {
          label: 'FINAL SCORE & XP',
          value: `${finalDoc.totalXpAwarded} / 1000 XP (${finalDoc.percentageScore}%)`,
        },
        {
          label: 'DIAGNOSTICS (PART A)',
          value: `${finalDoc.mcqScore} / 400 XP`,
        },
        {
          label: 'CASE STUDIES (PART B)',
          value: `${finalDoc.caseScore} / 500 XP`,
        },
        {
          label: 'SCARE DEFENSE & TIME',
          value: `${finalDoc.scareScore}/100 · ${formatDuration(finalDoc.timeUsedSeconds)}`,
        },
      ];

      const colW = boxW / metrics.length;
      metrics.forEach((m, idx) => {
        const cx = boxX + colW * idx + colW / 2;
        if (idx > 0) {
          ctx.beginPath();
          ctx.moveTo(boxX + colW * idx, boxY + 28);
          ctx.lineTo(boxX + colW * idx, boxY + boxH - 28);
          ctx.strokeStyle = '#CBD5E1';
          ctx.stroke();
        }
        ctx.fillStyle = '#64748B';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(m.label, cx, boxY + 66, colW - 36);

        ctx.fillStyle = '#0F172A';
        ctx.font = '800 30px "Bricolage Grotesque", sans-serif';
        ctx.fillText(m.value, cx, boxY + 124, colW - 36);
      });

      // Bottom Signature Strip
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 27px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(issueDate, 240, 1400, 620);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(240, 1422);
      ctx.lineTo(740, 1422);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 21px "JetBrains Mono", monospace';
      ctx.fillText(
        `CERT ID: ${finalDoc.finalCertificateId} · LOR: ${finalDoc.lorVerificationId}`,
        240,
        1464,
        780
      );

      // Center Seal
      const sealX = W / 2;
      const sealY = 1400;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 108, 0, Math.PI * 2);
      ctx.fillStyle = '#090D16';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#C89B3C';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, 92, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FACC15';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.font = '700 17px "JetBrains Mono", monospace';
      ctx.fillText('1000 XP CAPSTONE', sealX, sealY - 28);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 25px "Bricolage Grotesque", sans-serif';
      ctx.fillText('POWERED BY', sealX, sealY + 4);
      ctx.fillStyle = '#FDE047';
      ctx.font = '800 36px "Bricolage Grotesque", sans-serif';
      ctx.fillText('KAPIL', sealX, sealY + 44);

      // Right Signature
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Bricolage Grotesque", Georgia, serif';
      ctx.fillText('Powered By Kapil', W - 240, 1400);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(W - 700, 1422);
      ctx.lineTo(W - 240, 1422);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '600 21px "JetBrains Mono", monospace';
      ctx.fillText('LEAD EMPLOYABILITY MENTOR & ASSESSOR', W - 240, 1464);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download =
        'Picture-Connect-Final-Capstone-Certificate-Powered-By-Kapil.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusNote('Official Final Capstone PNG Certificate downloaded!');
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleDownloadPersonalizedLorPdf = () => {
    if (!finalDoc.passed) return;
    setDownloadingLorPdf(true);
    setStatusNote(null);

    try {
      const docPdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageW = docPdf.internal.pageSize.getWidth(); // 210mm
      const pageH = docPdf.internal.pageSize.getHeight(); // 297mm
      const margin = 18;
      const contentW = pageW - margin * 2;

      // Top & Bottom Navy Executive Bars
      docPdf.setFillColor(15, 23, 42);
      docPdf.rect(0, 0, pageW, 10, 'F');
      docPdf.rect(0, pageH - 8, pageW, 8, 'F');

      // Subtle architectural inner border
      docPdf.setDrawColor(200, 155, 60);
      docPdf.setLineWidth(0.5);
      docPdf.rect(10, 14, pageW - 20, pageH - 26);

      // Letterhead Header
      let y = 26;
      docPdf.setFont('helvetica', 'bold');
      docPdf.setFontSize(15);
      docPdf.setTextColor(15, 23, 42);
      docPdf.text('PICTURE CONNECT WITH KAPIL', margin, y);

      docPdf.setFont('helvetica', 'bold');
      docPdf.setFontSize(9.5);
      docPdf.setTextColor(29, 78, 216);
      docPdf.text('POWERED BY KAPIL · PLACEMENT EMPLOYABILITY ACADEMY', pageW - margin, y, {
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
      docPdf.setLineWidth(0.4);
      docPdf.line(margin, y, pageW - margin, y);

      // Reference & Date Strip
      y += 8;
      docPdf.setFont('courier', 'bold');
      docPdf.setFontSize(8.5);
      docPdf.setTextColor(71, 85, 105);
      docPdf.text(`LOR REF: ${finalDoc.lorVerificationId}`, margin, y);
      docPdf.text(`DATE OF ISSUE: ${issueDate.toUpperCase()}`, pageW - margin, y, {
        align: 'right',
      });

      y += 5;
      docPdf.text(`CAPSTONE CERT ID: ${finalDoc.finalCertificateId}`, margin, y);
      docPdf.text(`CANDIDATE EMAIL: ${learnerEmail}`, pageW - margin, y, {
        align: 'right',
      });

      // Document Title
      y += 12;
      docPdf.setFont('times', 'bold');
      docPdf.setFontSize(16);
      docPdf.setTextColor(15, 23, 42);
      docPdf.text('LETTER OF RECOMMENDATION FOR CAMPUS & CORPORATE PLACEMENT', pageW / 2, y, {
        align: 'center',
      });

      y += 3;
      docPdf.setDrawColor(200, 155, 60);
      docPdf.setLineWidth(0.7);
      docPdf.line(pageW / 2 - 42, y, pageW / 2 + 42, y);

      // Salutation & Context
      y += 10;
      docPdf.setFont('helvetica', 'bold');
      docPdf.setFontSize(10);
      docPdf.setTextColor(15, 23, 42);
      docPdf.text(
        'To Hiring Managers, Talent Acquisition Leaders, and Placement Committees:',
        margin,
        y
      );

      // Personalized LOR Body Paragraphs
      const p1 = `It is my privilege to strongly recommend ${learnerName} (${collegeClean}) for ${targetRoleClean}. ${learnerName} completed our rigorous experiential visual-intelligence curriculum and successfully cleared the timed 90-Minute Proctored Final Assessment (1000 XP Capstone, weighted at 50% higher analytical rigor) with a score of ${finalDoc.totalXpAwarded}/1000 XP (${finalDoc.percentageScore}% — ${finalDoc.gradeTier}), completed in ${formatDuration(finalDoc.timeUsedSeconds)}.`;

      const p2 = `Across the integrated program, ${learnerName} demonstrated verifiable proficiency spanning both the Core Visual Mastery Track (${coreProgress.completedLevels.length}/10 executive levels completed, ${coreProgress.xp} Core XP) and the AI-Powered Advanced Track (${advProgress.completedChallenges.length}/25 real-world visual challenges scored, averaging ${advAvgScore}/100). Unlike theoretical classroom tests, this assessment demands separating observable evidence from unverified assumptions, framing unit-economics and safety trade-offs, and articulating accountable workplace decisions under strict time pressure.`;

      const p3 = `In the Final Capstone evaluation, ${learnerName} earned ${finalDoc.mcqScore}/400 XP in Rapid Synthesis Diagnostics, ${finalDoc.caseScore}/500 XP across five multi-domain executive case studies (FinTech Payment Outage Governance, EV Thermal Quality vs. Revenue Trade-Off, Human-Centered Healthcare Service Recovery, B2B SaaS Onboarding Alignment, and Technical Interview Portfolio Defense), and ${finalDoc.scareScore}/100 XP in the 60-Second SCARE (See–Connect–Analyse–Respond–Express) Placement Pitch.`;

      const p4 = `Based on these audited responses, ${learnerName} exhibits the structured reasoning, ethical integrity, customer empathy, and crisp stakeholder communication required to contribute reliably from Day One. I endorse their candidature without reservation for ${targetRoleClean}.`;

      docPdf.setFont('times', 'normal');
      docPdf.setFontSize(10);
      docPdf.setTextColor(30, 41, 59);

      const sigY = pageH - 42;
      const paraLineH = 4.4;

      const writeWrappedParagraph = (text: string) => {
        y += 5;
        const lines = docPdf.splitTextToSize(text, contentW);
        docPdf.text(lines, margin, y);
        y += lines.length * paraLineH + 1.2;
      };

      writeWrappedParagraph(p1);
      writeWrappedParagraph(p2);
      writeWrappedParagraph(p3);
      writeWrappedParagraph(p4);

      // Verified Performance Scorecard Box inside LOR
      y = Math.min(y + 3, sigY - 48);
      docPdf.setFillColor(248, 250, 252);
      docPdf.setDrawColor(203, 213, 225);
      docPdf.setLineWidth(0.4);
      docPdf.roundedRect(margin, y, contentW, 28, 2, 2, 'FD');

      docPdf.setFont('helvetica', 'bold');
      docPdf.setFontSize(8.5);
      docPdf.setTextColor(29, 78, 216);
      docPdf.text('VERIFIED ASSESSMENT & PORTFOLIO RECORD (FIRESTORE AUDITED)', margin + 4, y + 6);

      const cols = [
        { k: 'FINAL ASSESSMENT', v: `${finalDoc.totalXpAwarded}/1000 XP (${finalDoc.percentageScore}%)` },
        { k: 'CORE TRACK', v: `${coreProgress.completedLevels.length}/10 Lvls · ${coreProgress.xp} XP` },
        { k: 'AI ADVANCED TRACK', v: `${advProgress.completedChallenges.length}/25 · Avg ${advAvgScore}/100` },
        { k: 'GRADE TIER', v: finalDoc.gradeTier },
      ];

      const colWidth = (contentW - 8) / cols.length;
      cols.forEach((col, i) => {
        const cx = margin + 4 + i * colWidth;
        docPdf.setFont('courier', 'bold');
        docPdf.setFontSize(7);
        docPdf.setTextColor(100, 116, 139);
        docPdf.text(col.k, cx, y + 14);

        docPdf.setFont('helvetica', 'bold');
        docPdf.setFontSize(8.5);
        docPdf.setTextColor(15, 23, 42);
        const valLines = docPdf.splitTextToSize(col.v, colWidth - 3).slice(0, 2);
        docPdf.text(valLines, cx, y + 20);
      });

      y += 35;

      // Mentor Assessment Note (guarded against signature block overlap)
      if (y + 10 < sigY) {
        docPdf.setFont('helvetica', 'bold');
        docPdf.setFontSize(8.5);
        docPdf.setTextColor(71, 85, 105);
        docPdf.text('ASSESSOR SUMMARY:', margin, y);
        docPdf.setFont('helvetica', 'normal');
        const maxFbLines = Math.max(1, Math.floor((sigY - (y + 4.5) - 2) / 4));
        const fbLines = docPdf
          .splitTextToSize(finalDoc.executiveFeedback, contentW)
          .slice(0, maxFbLines);
        docPdf.text(fbLines, margin, y + 4.5);
      }

      // Signature Footer Block
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
      docPdf.text(`VERIFICATION ID: ${finalDoc.lorVerificationId}`, pageW - margin, sigY + 17, {
        align: 'right',
      });
      docPdf.setFont('helvetica', 'normal');
      docPdf.setTextColor(100, 116, 139);
      docPdf.text(`Official Placement Credential · ${issueDate}`, pageW - margin, sigY + 21, {
        align: 'right',
      });

      const safeName = learnerName.replace(/[^a-zA-Z0-9]+/g, '-');
      docPdf.save(`Placement-LOR-${safeName}-Powered-By-Kapil.pdf`);
      setStatusNote('Personalized Placement LOR (PDF) downloaded!');
    } finally {
      setDownloadingLorPdf(false);
    }
  };

  if (!finalDoc.passed) {
    const usedAttempts = Math.max(1, finalDoc.attemptCount || 1);
    const canSelfRetake = usedAttempts < 2 && Boolean(onStartSecondAttempt);

    return (
      <div
        className={`rounded-2xl border p-6 space-y-4 ${
          canSelfRetake
            ? 'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/25'
            : 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/25'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-2 font-mono text-xs font-bold ${
            canSelfRetake
              ? 'text-blue-800 dark:text-blue-300'
              : 'text-amber-800 dark:text-amber-300'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {canSelfRetake ? (
              <RotateCcw className="w-4 h-4 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 shrink-0" />
            )}
            <span>
              {canSelfRetake
                ? 'ATTEMPT 1 OF 2 BELOW 600 XP · 1 SELF-SERVICE RETAKE AVAILABLE'
                : `ATTEMPT ${usedAttempts} OF 2 USED · CONTACT ADMIN FOR FURTHER RETAKE`}
            </span>
          </span>
          <span>Attempt {usedAttempts} / 2</span>
        </div>

        <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          Score Achieved: {finalDoc.totalXpAwarded} / 1000 XP ({finalDoc.percentageScore}%)
        </h3>

        {canSelfRetake ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Issuing the Official Final Capstone Certificate and Personalized Placement Letter of Recommendation (PDF) requires at least{' '}
              <strong>{FINAL_ASSESSMENT_META.passingXp} / 1000 XP (60%)</strong>. You have{' '}
              <strong>1 self-service retake remaining</strong> before needing to contact your mentor/admin. Review the Part A diagnostic answer key above first, then start your fresh 90-minute Attempt 2 of 2 when ready.
            </p>

            {retryError && (
              <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
                {retryError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Note: Starting Attempt 2 clears previous draft answers and starts a fresh 90:00 proctored timer.
              </div>
              <button
                type="button"
                disabled={retryingSecondAttempt}
                onClick={onStartSecondAttempt}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {retryingSecondAttempt
                    ? 'Starting Attempt 2 of 2...'
                    : 'Start Attempt 2 of 2 (Fresh 90:00 Clock)'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Issuing the Official Final Capstone Certificate and Personalized Placement Letter of Recommendation (PDF) requires at least{' '}
            <strong>{FINAL_ASSESSMENT_META.passingXp} / 1000 XP (60%)</strong>. Both self-service attempts (2/2) have now been completed. Please review your Part A rationales and case study feedback, and contact your mentor or administrator to request an official retake reset.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {statusNote && (
        <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusNote}</span>
        </div>
      )}

      {/* Action Bar: Download PNG Certificate + Download Personalized LOR PDF */}
      <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
            CREDENTIALS ISSUED · PLACEMENT VERIFIED
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            Official Final Certificate &amp; Personalized Placement LOR (PDF)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Certificate ID <span className="font-mono font-semibold">{finalDoc.finalCertificateId}</span> · LOR Ref{' '}
            <span className="font-mono font-semibold">{finalDoc.lorVerificationId}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={downloadingPng}
            onClick={handleDownloadFinalCertificatePng}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPng ? 'Generating PNG...' : 'Download Final Certificate (PNG)'}</span>
          </button>

          <button
            type="button"
            disabled={downloadingLorPdf}
            onClick={handleDownloadPersonalizedLorPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>{downloadingLorPdf ? 'Building PDF...' : 'Download Personalized LOR (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview: Official Final Certificate */}
      <div className="rounded-2xl border-4 border-slate-900 dark:border-slate-700 bg-gradient-to-br from-[#FDFCF8] via-white to-slate-100 text-slate-900 p-6 sm:p-10 shadow-xl">
        <div className="border-2 border-amber-600/70 p-6 sm:p-10 space-y-7 text-center">
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-blue-700 uppercase">
              PICTURE CONNECT WITH KAPIL · 1000 XP FINAL CAPSTONE ASSESSMENT
            </div>
            <h4 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              FINAL CAPSTONE CERTIFICATE OF MERIT
            </h4>
            <div className="w-56 h-0.5 bg-amber-600/70 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">
              {finalDoc.gradeTier} · Normal + AI Advanced Synthesis
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              This final credential is proudly awarded to
            </div>
            <div className="font-display text-3xl sm:text-5xl font-extrabold text-slate-950">
              {learnerName}
            </div>
            <div className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {learnerEmail} · {collegeClean}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-slate-200 bg-slate-50 rounded-xl p-4">
            <div>
              <div className="text-[10px] font-mono text-slate-500">FINAL SCORE</div>
              <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                {finalDoc.totalXpAwarded}/1000 XP
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500">DIAGNOSTICS</div>
              <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                {finalDoc.mcqScore}/400 XP
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500">CASE STUDIES</div>
              <div className="font-display text-lg font-bold text-slate-950 tabular-nums">
                {finalDoc.caseScore}/500 XP
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500">SCARE &amp; TIME</div>
              <div className="font-display text-base font-bold text-blue-700 tabular-nums">
                {finalDoc.scareScore}/100 · {formatDuration(finalDoc.timeUsedSeconds)}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-3">
            <div className="text-center sm:text-left">
              <div className="text-sm font-bold text-slate-900">{issueDate}</div>
              <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                CERT ID: {finalDoc.finalCertificateId}
              </div>
            </div>
            <div className="w-28 h-28 rounded-full bg-slate-950 border-4 border-amber-500 flex flex-col items-center justify-center text-center shadow-lg shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
              <span className="text-[8px] font-mono uppercase tracking-widest text-white">
                1000 XP
              </span>
              <span className="font-display text-xs font-extrabold text-amber-300 leading-none">
                POWERED BY KAPIL
              </span>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-display text-lg font-extrabold text-slate-950">
                Powered By Kapil
              </div>
              <div className="text-[11px] font-mono text-slate-500 border-t border-slate-300 pt-1 mt-1">
                Lead Employability Mentor
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview: Personalized Letter of Recommendation (PDF Ready) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
              LETTER OF RECOMMENDATION PREVIEW · REF {finalDoc.lorVerificationId}
            </div>
            <h4 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Personalized Placement LOR for {learnerName}
            </h4>
          </div>
          <button
            type="button"
            disabled={downloadingLorPdf}
            onClick={handleDownloadPersonalizedLorPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer whitespace-nowrap shrink-0"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Download Formal PDF</span>
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          <p className="font-semibold text-slate-900 dark:text-white">
            To Hiring Managers, Talent Acquisition Leaders, and Placement Committees:
          </p>
          <p>
            It is my privilege to strongly recommend{' '}
            <strong className="text-slate-950 dark:text-white">{learnerName}</strong> ({collegeClean}) for{' '}
            <strong className="text-slate-950 dark:text-white">{targetRoleClean}</strong>.{' '}
            {learnerName} cleared the 90-Minute Proctored Final Assessment (1000 XP Capstone, 50% elevated rigor) with{' '}
            <strong className="font-mono">
              {finalDoc.totalXpAwarded}/1000 XP ({finalDoc.percentageScore}% — {finalDoc.gradeTier})
            </strong>{' '}
            in {formatDuration(finalDoc.timeUsedSeconds)}.
          </p>
          <p>
            Across the integrated curriculum, {learnerName} demonstrated verifiable proficiency spanning the Core Visual Mastery Track (
            <strong className="font-mono">
              {coreProgress.completedLevels.length}/10 levels · {coreProgress.xp} XP
            </strong>
            ) and the AI-Powered Advanced Track (
            <strong className="font-mono">
              {advProgress.completedChallenges.length}/25 challenges · Avg {advAvgScore}/100
            </strong>
            ), alongside strong execution across five executive case studies ({finalDoc.caseScore}/500 XP) and the SCARE Placement Defense ({finalDoc.scareScore}/100 XP).
          </p>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Signed: Kapil Narula · Powered By Kapil · Verification ID: {finalDoc.lorVerificationId}
          </p>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
};
