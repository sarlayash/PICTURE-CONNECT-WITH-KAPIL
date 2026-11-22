import {
  clearCachedGmailToken,
  requestGmailSendToken,
} from '../firebase';

export interface EmailAttachmentPayload {
  filename: string;
  mimeType: 'image/png' | 'application/pdf';
  /** Pure base64 string (without data:...;base64, prefix) OR full data URL */
  base64OrDataUrl: string;
}

export interface SendGmailParams {
  toEmail: string;
  subject: string;
  htmlBody: string;
  textFallback: string;
  attachment?: EmailAttachmentPayload;
  loginHint?: string;
}

export interface SendGmailResult {
  messageId: string;
  threadId?: string;
}

/**
 * Strips CR/LF to eliminate RFC 2822 header injection risks.
 */
export function sanitizeHeaderValue(value: string): string {
  return String(value || '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

export function isValidEmailAddress(email: string): boolean {
  const raw = String(email || '');
  if (/[\r\n]/.test(raw)) return false;
  const clean = raw.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) && clean.length <= 160;
}

/**
 * Extracts raw base64 payload from either a data URL or a plain base64 string.
 */
export function extractBase64Payload(base64OrDataUrl: string): string {
  const trimmed = String(base64OrDataUrl || '').trim();
  const commaIdx = trimmed.indexOf(',');
  if (trimmed.startsWith('data:') && commaIdx !== -1) {
    return trimmed.slice(commaIdx + 1).replace(/\s+/g, '');
  }
  return trimmed.replace(/\s+/g, '');
}

/**
 * Wraps base64 data cleanly at 76 chars per line per RFC 2045.
 */
export function chunkBase64Lines(base64: string, lineLength = 76): string {
  const clean = base64.replace(/\s+/g, '');
  const chunks: string[] = [];
  for (let i = 0; i < clean.length; i += lineLength) {
    chunks.push(clean.slice(i, i + lineLength));
  }
  return chunks.join('\r\n');
}

/**
 * UTF-8 safe base64 encoder that works identically in browsers and Node tests.
 */
export function utf8ToBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    const slice = bytes.subarray(i, i + step);
    binary += String.fromCharCode(...slice);
  }
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  // Fallback for Node test environments where Buffer exists
  return Buffer.from(bytes).toString('base64');
}

export function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function encodeMimeSubject(subject: string): string {
  const clean = sanitizeHeaderValue(subject);
  if (/^[\x20-\x7E]*$/.test(clean)) {
    return clean;
  }
  return `=?UTF-8?B?${utf8ToBase64(clean)}?=`;
}

/**
 * Builds a standards-compliant RFC 2822 MIME message (multipart/mixed when an
 * attachment is present, multipart/alternative for text + HTML) and returns the
 * raw base64url string expected by Gmail API `messages.send`.
 */
export function buildMimeEmail(params: {
  toEmail: string;
  subject: string;
  htmlBody: string;
  textFallback: string;
  attachment?: EmailAttachmentPayload;
  boundarySeed?: string;
}): { rawMime: string; rawBase64Url: string } {
  const to = sanitizeHeaderValue(params.toEmail);
  if (!isValidEmailAddress(to)) {
    throw new Error('Recipient email address is invalid.');
  }

  const encodedSubject = encodeMimeSubject(params.subject);
  const seed = params.boundarySeed || `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const altBoundary = `alt_euwk_${seed}`;
  const mixBoundary = `mix_euwk_${seed}`;

  const textPart = [
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    chunkBase64Lines(utf8ToBase64(params.textFallback)),
  ].join('\r\n');

  const htmlPart = [
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    chunkBase64Lines(utf8ToBase64(params.htmlBody)),
  ].join('\r\n');

  const alternativeBody = [
    `--${altBoundary}`,
    textPart,
    `--${altBoundary}`,
    htmlPart,
    `--${altBoundary}--`,
  ].join('\r\n');

  let rawMime: string;

  if (params.attachment) {
    const safeFilename = sanitizeHeaderValue(params.attachment.filename).replace(
      /["\\]/g,
      ''
    );
    const attachmentBase64 = extractBase64Payload(params.attachment.base64OrDataUrl);
    if (!attachmentBase64) {
      throw new Error('Attachment data is empty.');
    }

    rawMime = [
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${mixBoundary}"`,
      '',
      `--${mixBoundary}`,
      `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
      '',
      alternativeBody,
      '',
      `--${mixBoundary}`,
      `Content-Type: ${params.attachment.mimeType}; name="${safeFilename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${safeFilename}"`,
      '',
      chunkBase64Lines(attachmentBase64),
      `--${mixBoundary}--`,
    ].join('\r\n');
  } else {
    rawMime = [
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
      '',
      alternativeBody,
    ].join('\r\n');
  }

  const rawBase64Url = toBase64Url(utf8ToBase64(rawMime));
  return { rawMime, rawBase64Url };
}

function escapeHtml(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildCredentialEmailHtml(params: {
  learnerName: string;
  learnerEmail: string;
  credentialKindLabel: string;
  credentialTitle: string;
  certificateId?: string;
  summaryPoints: string[];
  footerNote?: string;
}): { htmlBody: string; textFallback: string } {
  const safeName = escapeHtml(params.learnerName);
  const safeEmail = escapeHtml(params.learnerEmail);
  const safeKind = escapeHtml(params.credentialKindLabel);
  const safeTitle = escapeHtml(params.credentialTitle);
  const safeId = params.certificateId ? escapeHtml(params.certificateId) : '';
  const pointsHtml = params.summaryPoints
    .map(
      (pt) =>
        `<li style="margin:6px 0;color:#1e293b;font-size:14px;line-height:1.5;">${escapeHtml(pt)}</li>`
    )
    .join('');

  const htmlBody = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:14px;overflow:hidden;">
    <div style="background:linear-gradient(90deg,#0f172a,#1e3a8a,#4f46e5);padding:24px 28px;color:#ffffff;">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#fde047;font-weight:700;">EMPLOYABILITY UNIVERSE WITH KAPIL</div>
      <h1 style="margin:8px 0 4px;font-size:22px;line-height:1.25;">${safeTitle}</h1>
      <div style="font-size:13px;color:#cbd5e1;">${safeKind} · Powered By Kapil</div>
    </div>
    <div style="padding:26px 28px;">
      <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Hello <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">
        Congratulations on your milestone inside <strong>EMPLOYABILITY UNIVERSE With Kapil</strong>! Your official <strong>${safeKind}</strong> is attached to this email for your placement portfolio, LinkedIn profile, and recruiter applications.
      </p>
      ${
        safeId
          ? `<div style="margin:14px 0;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-family:monospace;font-size:12px;color:#0f172a;">
              <strong>Credential Verification ID:</strong> ${safeId}<br/>
              <strong>Verified Sign-Up Email:</strong> ${safeEmail}
            </div>`
          : ''
      }
      <ul style="padding-left:20px;margin:14px 0 18px;">
        ${pointsHtml}
      </ul>
      <p style="margin:18px 0 0;font-size:13px;color:#475569;line-height:1.6;">
        ${escapeHtml(
          params.footerNote ||
            'Keep building your XP across all modules to unlock the 1000 XP Final Capstone Certificate & Personalized Placement LOR.'
        )}
      </p>
      <div style="margin-top:22px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
        Warm regards,<br/>
        <strong style="color:#0f172a;">Kapil Narula</strong> · Architect &amp; Lead Employability Mentor<br/>
        EMPLOYABILITY UNIVERSE With Kapil · One-Stop Career &amp; Placement Solution
      </div>
    </div>
  </div>
</body>
</html>`;

  const textFallback = [
    `EMPLOYABILITY UNIVERSE WITH KAPIL — ${params.credentialTitle}`,
    `Hello ${params.learnerName},`,
    '',
    `Your official ${params.credentialKindLabel} is attached to this email.`,
    params.certificateId ? `Verification ID: ${params.certificateId}` : '',
    `Verified Sign-Up Email: ${params.learnerEmail}`,
    '',
    ...params.summaryPoints.map((p) => `- ${p}`),
    '',
    params.footerNote ||
      'Keep progressing across EMPLOYABILITY UNIVERSE With Kapil to unlock every badge, certificate, and Placement LOR.',
    '',
    'Warm regards,',
    'Kapil Narula — Powered By Kapil',
  ]
    .filter(Boolean)
    .join('\n');

  return { htmlBody, textFallback };
}

export function buildMissingSectionsReminderEmail(params: {
  learnerName: string;
  learnerEmail: string;
  overallCompletionPct: number;
  completedSections: { title: string; detail: string }[];
  missingSections: { title: string; detail: string; actionHint: string }[];
  portalUrl?: string;
}): { subject: string; htmlBody: string; textFallback: string } {
  const safeName = escapeHtml(params.learnerName);
  const portalUrl =
    params.portalUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const missingCount = params.missingSections.length;

  const subject =
    missingCount > 0
      ? `Study Reminder: ${missingCount} section${missingCount > 1 ? 's' : ''} remaining in EMPLOYABILITY UNIVERSE With Kapil (${params.overallCompletionPct}% done)`
      : `All Sections Mastered! Your EMPLOYABILITY UNIVERSE With Kapil Summary (100%)`;

  const missingHtml = params.missingSections
    .map(
      (item) => `<li style="margin:8px 0;padding:10px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
        <div style="font-weight:700;font-size:13px;color:#92400e;">${escapeHtml(item.title)}</div>
        <div style="font-size:12px;color:#78350f;margin-top:2px;">${escapeHtml(item.detail)}</div>
        <div style="font-size:12px;color:#1d4ed8;margin-top:4px;font-weight:600;">Next step: ${escapeHtml(item.actionHint)}</div>
      </li>`
    )
    .join('');

  const completedHtml = params.completedSections
    .map(
      (item) =>
        `<li style="margin:5px 0;font-size:13px;color:#065f46;"><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.detail)}</li>`
    )
    .join('');

  const htmlBody = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:14px;overflow:hidden;">
    <div style="background:linear-gradient(90deg,#0f172a,#1e3a8a,#0f766e);padding:24px 28px;color:#ffffff;">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#fde047;font-weight:700;">EMPLOYABILITY UNIVERSE WITH KAPIL · PROGRESS REMINDER</div>
      <h1 style="margin:8px 0 4px;font-size:21px;line-height:1.3;">Your Personal Section Completion Checklist</h1>
      <div style="font-size:13px;color:#cbd5e1;">Overall Universe Mastery: <strong>${params.overallCompletionPct}%</strong></div>
    </div>
    <div style="padding:26px 28px;">
      <p style="margin:0 0 14px;font-size:15px;">Hi <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
        ${
          missingCount > 0
            ? `You are <strong>${params.overallCompletionPct}%</strong> through EMPLOYABILITY UNIVERSE With Kapil. Completing the remaining ${missingCount} section${missingCount > 1 ? 's' : ''} below unlocks additional badges, verified PNG certificates, and your Placement LOR.`
            : 'Outstanding achievement! You have completed every tracked section across EMPLOYABILITY UNIVERSE With Kapil.'
        }
      </p>
      ${
        missingCount > 0
          ? `<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.8px;color:#b45309;margin:18px 0 8px;">Remaining / In-Progress Sections (${missingCount})</h2>
             <ul style="list-style:none;padding:0;margin:0 0 18px;">${missingHtml}</ul>`
          : ''
      }
      ${
        params.completedSections.length > 0
          ? `<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.8px;color:#047857;margin:18px 0 8px;">Completed Milestones (${params.completedSections.length})</h2>
             <ul style="padding-left:18px;margin:0 0 18px;">${completedHtml}</ul>`
          : ''
      }
      ${
        portalUrl
          ? `<div style="margin:20px 0;">
              <a href="${escapeHtml(portalUrl)}" style="display:inline-block;padding:12px 20px;background:#1d4ed8;color:#ffffff;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700;">Continue Learning on EMPLOYABILITY UNIVERSE →</a>
            </div>`
          : ''
      }
      <div style="margin-top:20px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
        Sent to verified sign-up ID: ${escapeHtml(params.learnerEmail)}<br/>
        <strong style="color:#0f172a;">Mentor Kapil Narula</strong> · EMPLOYABILITY UNIVERSE With Kapil
      </div>
    </div>
  </div>
</body>
</html>`;

  const textFallback = [
    `EMPLOYABILITY UNIVERSE WITH KAPIL — Progress Reminder (${params.overallCompletionPct}% Complete)`,
    `Hi ${params.learnerName},`,
    '',
    missingCount > 0 ? `Remaining / Missing Sections (${missingCount}):` : 'All sections completed!',
    ...params.missingSections.map(
      (s) => `- ${s.title}: ${s.detail} | Next step: ${s.actionHint}`
    ),
    '',
    params.completedSections.length > 0
      ? `Completed Sections (${params.completedSections.length}):`
      : '',
    ...params.completedSections.map((s) => `- ${s.title}: ${s.detail}`),
    '',
    portalUrl ? `Open Portal: ${portalUrl}` : '',
    '— Mentor Kapil Narula · EMPLOYABILITY UNIVERSE With Kapil',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, htmlBody, textFallback };
}

/**
 * Daily 60-Min Mock Test Launch Notification Email (50% Hard MCQs across all 7 pillars)
 */
export function buildDailyMockLaunchEmail(params: {
  learnerName: string;
  learnerEmail: string;
  dateKey: string;
  displayDate: string;
  paperCode: string;
  streakDays: number;
  portalUrl?: string;
}): { subject: string; htmlBody: string; textFallback: string } {
  const safeName = escapeHtml(params.learnerName);
  const safeDate = escapeHtml(params.displayDate);
  const safeCode = escapeHtml(params.paperCode);
  const portalUrl =
    params.portalUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const subject = `Daily 60-Min Mock Test Live (${params.displayDate}) · 50% Hard MCQs · ${params.paperCode}`;

  const topics = [
    'Quantitative & Logical Aptitude (6 MCQs · 3 Hard)',
    'Grammar, Tenses, Punctuation & Idioms (6 MCQs · 3 Hard)',
    'C, C++, Java, Python & DSA (8 MCQs · 4 Hard)',
    'Excel, Power BI, DBMS & Cloud Computing (6 MCQs · 3 Hard)',
    'Indianism, Interview & GD Skills (6 MCQs · 3 Hard)',
    'Shopping, Buyer Psychology & Negotiation (4 MCQs · 2 Hard)',
    'Picture Connect, Critical Thinking & AI (4 MCQs · 2 Hard)',
  ];

  const topicsHtml = topics
    .map(
      (t) =>
        `<li style="margin:5px 0;font-size:13px;color:#1e293b;">${escapeHtml(t)}</li>`
    )
    .join('');

  const htmlBody = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:14px;overflow:hidden;">
    <div style="background:linear-gradient(90deg,#0f172a,#881337,#4f46e5);padding:24px 28px;color:#ffffff;">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#fde047;font-weight:700;">EMPLOYABILITY UNIVERSE WITH KAPIL · DAILY MOCK TEST</div>
      <h1 style="margin:8px 0 4px;font-size:21px;line-height:1.25;">Today’s 60-Minute Mock Paper Is Ready</h1>
      <div style="font-size:13px;color:#e2e8f0;">${safeDate} · Paper ${safeCode} · 40 MCQs (20 Hard / 50%)</div>
    </div>
    <div style="padding:26px 28px;">
      <p style="margin:0 0 12px;font-size:15px;">Hello <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">
        Your daily 60-minute placement mock exam is now open inside <strong>EMPLOYABILITY UNIVERSE With Kapil</strong>. Today’s standardized paper tests <strong>every topic covered across the portal</strong> with strictly <strong>50% Hard FAANG/MNC-level MCQs</strong>.
      </p>
      <div style="display:block;margin:14px 0 18px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;color:#0f172a;">
        <strong>Duration:</strong> 60 Minutes (Auto-save + Live Countdown)<br/>
        <strong>Difficulty Split:</strong> 20 Hard MCQs (50%) + 20 Standard MCQs (50%)<br/>
        <strong>Pass Benchmark:</strong> 60% (24/40) · Earn up to +500 Daily XP<br/>
        <strong>Current Streak:</strong> ${params.streakDays} day${params.streakDays === 1 ? '' : 's'}
      </div>
      <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:#475569;">All 7 Topics Covered Today</h2>
      <ul style="padding-left:18px;margin:0 0 18px;">${topicsHtml}</ul>
      ${
        portalUrl
          ? `<div style="margin:18px 0 10px;">
              <a href="${escapeHtml(portalUrl)}" style="display:inline-block;padding:12px 22px;background:#be123c;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Launch Today’s 60-Min Mock Test</a>
            </div>`
          : ''
      }
      <p style="margin:14px 0 0;font-size:12px;color:#64748b;">
        Once submitted, your detailed daily results summary (Hard vs Standard accuracy + 7-pillar mastery breakdown) will be generated immediately for portal review and email delivery.
      </p>
      <div style="margin-top:20px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
        Stay sharp every day,<br/>
        <strong style="color:#0f172a;">Kapil Narula</strong> · EMPLOYABILITY UNIVERSE With Kapil
      </div>
    </div>
  </div>
</body>
</html>`;

  const textFallback = [
    `EMPLOYABILITY UNIVERSE WITH KAPIL — DAILY 60-MIN MOCK TEST (${params.displayDate})`,
    `Paper Code: ${params.paperCode} | 40 MCQs | 60 Minutes | 50% Hard MCQs`,
    '',
    `Hello ${params.learnerName},`,
    'Today’s 60-minute Daily Mock Test is live across all 7 Employability Universe pillars:',
    ...topics.map((t) => `- ${t}`),
    '',
    `Current Streak: ${params.streakDays} day(s) | Pass Target: 60% | Reward: up to +500 XP`,
    portalUrl ? `Open Portal: ${portalUrl}` : '',
    '— Mentor Kapil Narula · EMPLOYABILITY UNIVERSE With Kapil',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, htmlBody, textFallback };
}

/**
 * Daily Mock Test Results Summary Email (sent to learner's sign-up email ID)
 */
export function buildDailyMockResultSummaryEmail(params: {
  learnerName: string;
  learnerEmail: string;
  displayDate: string;
  paperCode: string;
  correctCount: number;
  totalQuestions: number;
  scorePercent: number;
  hardCorrectCount: number;
  hardTotal: number;
  hardAccuracyPercent: number;
  standardCorrectCount: number;
  standardTotal: number;
  timeUsedSeconds: number;
  gradeLabel: string;
  passed: boolean;
  xpAwarded: number;
  streakDays: number;
  strongestTopic: string;
  weakestTopic: string;
  mentorAdvice: string;
  pillarRows: {
    pillarTitle: string;
    correct: number;
    total: number;
    hardCorrect: number;
    hardTotal: number;
    percent: number;
  }[];
  portalUrl?: string;
}): { subject: string; htmlBody: string; textFallback: string } {
  const safeName = escapeHtml(params.learnerName);
  const safeDate = escapeHtml(params.displayDate);
  const safeCode = escapeHtml(params.paperCode);
  const mins = Math.floor(params.timeUsedSeconds / 60);
  const secs = params.timeUsedSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  const stdPercent = Math.round(
    (params.standardCorrectCount / Math.max(1, params.standardTotal)) * 100
  );
  const portalUrl =
    params.portalUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const subject = `Daily Mock Results (${params.displayDate}): ${params.scorePercent}% (${params.correctCount}/${params.totalQuestions}) · Hard ${params.hardAccuracyPercent}% · ${params.gradeLabel}`;

  const pillarRowsHtml = params.pillarRows
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;font-weight:600;">${escapeHtml(r.pillarTitle)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:monospace;text-align:center;color:#0f172a;">${r.correct}/${r.total}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:monospace;text-align:center;color:#9f1239;">${r.hardCorrect}/${r.hardTotal}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:monospace;text-align:right;font-weight:700;color:${r.percent >= 70 ? '#047857' : r.percent >= 50 ? '#b45309' : '#be123c'};">${r.percent}%</td>
      </tr>`
    )
    .join('');

  const htmlBody = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:650px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:14px;overflow:hidden;">
    <div style="background:linear-gradient(90deg,#0f172a,#1e3a8a,#047857);padding:24px 28px;color:#ffffff;">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#fde047;font-weight:700;">DAILY MOCK TEST RESULTS SUMMARY · EMPLOYABILITY UNIVERSE WITH KAPIL</div>
      <h1 style="margin:8px 0 4px;font-size:22px;line-height:1.25;">${params.scorePercent}% Overall · ${escapeHtml(params.gradeLabel)}</h1>
      <div style="font-size:13px;color:#cbd5e1;">${safeDate} · Paper ${safeCode} · Time Used ${timeStr}</div>
    </div>
    <div style="padding:26px 28px;">
      <p style="margin:0 0 14px;font-size:15px;">Hello <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#334155;">
        Here is your verified Daily 60-Minute Mock Test scorecard across all 7 Employability Universe pillars.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
        <tr>
          <td style="padding:12px 14px;font-size:12px;color:#475569;border-right:1px solid #e2e8f0;">
            <div>OVERALL SCORE</div>
            <div style="font-size:20px;font-weight:800;color:#0f172a;font-family:monospace;margin-top:4px;">${params.correctCount}/${params.totalQuestions} (${params.scorePercent}%)</div>
          </td>
          <td style="padding:12px 14px;font-size:12px;color:#475569;border-right:1px solid #e2e8f0;">
            <div>HARD MCQs (50%)</div>
            <div style="font-size:20px;font-weight:800;color:#be123c;font-family:monospace;margin-top:4px;">${params.hardCorrectCount}/${params.hardTotal} (${params.hardAccuracyPercent}%)</div>
          </td>
          <td style="padding:12px 14px;font-size:12px;color:#475569;">
            <div>STANDARD MCQs (50%)</div>
            <div style="font-size:20px;font-weight:800;color:#047857;font-family:monospace;margin-top:4px;">${params.standardCorrectCount}/${params.standardTotal} (${stdPercent}%)</div>
          </td>
        </tr>
      </table>

      <div style="margin-bottom:18px;padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;color:#1e293b;">
        <strong>Status:</strong> ${params.passed ? 'PASSED (60%+ Benchmark Cleared)' : 'NEEDS REVISION (Target 60%+)'} · <strong>Daily XP Earned:</strong> +${params.xpAwarded} XP · <strong>Active Streak:</strong> ${params.streakDays} day${params.streakDays === 1 ? '' : 's'}<br/>
        <strong>Strongest Pillar:</strong> ${escapeHtml(params.strongestTopic)} · <strong>Priority Revision Focus:</strong> ${escapeHtml(params.weakestTopic)}
      </div>

      <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:#475569;">7-Pillar Topic Breakdown</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;margin-bottom:18px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th align="left" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Topic Pillar</th>
            <th align="center" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Score</th>
            <th align="center" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Hard</th>
            <th align="right" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Accuracy</th>
          </tr>
        </thead>
        <tbody>${pillarRowsHtml}</tbody>
      </table>

      <div style="padding:14px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;font-size:13px;line-height:1.6;color:#78350f;">
        <strong>Mentor Kapil’s Daily Action Plan:</strong> ${escapeHtml(params.mentorAdvice)}
      </div>

      ${
        portalUrl
          ? `<div style="margin:18px 0 8px;">
              <a href="${escapeHtml(portalUrl)}" style="display:inline-block;padding:11px 20px;background:#1e3a8a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:13px;">Review All 40 Answer Explanations on Portal</a>
            </div>`
          : ''
      }

      <div style="margin-top:20px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
        Consistency beats cramming,<br/>
        <strong style="color:#0f172a;">Kapil Narula</strong> · Architect &amp; Lead Employability Mentor · EMPLOYABILITY UNIVERSE With Kapil
      </div>
    </div>
  </div>
</body>
</html>`;

  const textFallback = [
    `EMPLOYABILITY UNIVERSE WITH KAPIL — DAILY MOCK RESULTS (${params.displayDate})`,
    `Paper: ${params.paperCode} | Learner: ${params.learnerName} (${params.learnerEmail})`,
    `Overall: ${params.correctCount}/${params.totalQuestions} (${params.scorePercent}%) — ${params.gradeLabel} (${params.passed ? 'PASSED' : 'NEEDS REVISION'})`,
    `Hard MCQs (50%): ${params.hardCorrectCount}/${params.hardTotal} (${params.hardAccuracyPercent}%)`,
    `Standard MCQs (50%): ${params.standardCorrectCount}/${params.standardTotal} (${stdPercent}%)`,
    `Time Used: ${timeStr} | XP Awarded: +${params.xpAwarded} | Streak: ${params.streakDays} day(s)`,
    `Strongest: ${params.strongestTopic} | Focus Revision: ${params.weakestTopic}`,
    '',
    '7-PILLAR BREAKDOWN:',
    ...params.pillarRows.map(
      (r) =>
        `- ${r.pillarTitle}: ${r.correct}/${r.total} (${r.percent}%) | Hard ${r.hardCorrect}/${r.hardTotal}`
    ),
    '',
    `Mentor Kapil’s Advice: ${params.mentorAdvice}`,
    portalUrl ? `Portal: ${portalUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, htmlBody, textFallback };
}

/**
 * Admin Daily Cohort Digest Email summarizing all learner attempts for a given day
 */
export function buildAdminDailyCohortDigestEmail(params: {
  displayDate: string;
  paperCode: string;
  totalLearners: number;
  submittedRows: {
    name: string;
    email: string;
    scorePercent: number;
    hardAccuracyPercent: number;
    gradeLabel: string;
    weakestTopic: string;
  }[];
  pendingCount: number;
}): { subject: string; htmlBody: string; textFallback: string } {
  const count = params.submittedRows.length;
  const avgScore =
    count > 0
      ? Math.round(
          params.submittedRows.reduce((s, r) => s + r.scorePercent, 0) / count
        )
      : 0;
  const avgHard =
    count > 0
      ? Math.round(
          params.submittedRows.reduce((s, r) => s + r.hardAccuracyPercent, 0) /
            count
        )
      : 0;
  const passedCount = params.submittedRows.filter(
    (r) => r.scorePercent >= 60
  ).length;

  const subject = `Daily Mock Cohort Digest (${params.displayDate}): ${count}/${params.totalLearners} Submitted · Avg ${avgScore}% (Hard ${avgHard}%)`;

  const rowsHtml =
    params.submittedRows.length > 0
      ? params.submittedRows
          .map(
            (r) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;"><strong>${escapeHtml(r.name)}</strong><br/><span style="font-size:11px;color:#64748b;">${escapeHtml(r.email)}</span></td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:monospace;text-align:center;font-weight:700;">${r.scorePercent}%</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;font-family:monospace;text-align:center;color:#be123c;">${r.hardAccuracyPercent}%</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:12px;">${escapeHtml(r.gradeLabel)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#475569;">${escapeHtml(r.weakestTopic)}</td>
        </tr>`
          )
          .join('')
      : `<tr><td colspan="5" style="padding:14px;text-align:center;font-size:13px;color:#64748b;">No learners have submitted today’s paper yet.</td></tr>`;

  const htmlBody = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:14px;overflow:hidden;">
    <div style="background:#0f172a;padding:22px 26px;color:#ffffff;">
      <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#fde047;font-weight:700;">ADMIN DAILY MOCK COHORT DIGEST · EMPLOYABILITY UNIVERSE WITH KAPIL</div>
      <h1 style="margin:8px 0 4px;font-size:20px;">${escapeHtml(params.displayDate)} · ${escapeHtml(params.paperCode)}</h1>
      <div style="font-size:13px;color:#cbd5e1;">Submitted: ${count}/${params.totalLearners} · Pending: ${params.pendingCount} · Avg Score: ${avgScore}% · Avg Hard MCQ: ${avgHard}% · Passed: ${passedCount}/${count}</div>
    </div>
    <div style="padding:22px 26px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;">
        <thead>
          <tr style="background:#f8fafc;">
            <th align="left" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Learner</th>
            <th align="center" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Overall</th>
            <th align="center" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Hard 50%</th>
            <th align="left" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Grade</th>
            <th align="left" style="padding:8px 10px;font-size:11px;text-transform:uppercase;color:#475569;">Weakest Topic</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

  const textFallback = [
    `ADMIN DAILY MOCK COHORT DIGEST — ${params.displayDate} (${params.paperCode})`,
    `Submitted: ${count}/${params.totalLearners} | Pending: ${params.pendingCount} | Avg: ${avgScore}% | Hard Avg: ${avgHard}% | Passed: ${passedCount}/${count}`,
    '',
    ...params.submittedRows.map(
      (r) =>
        `- ${r.name} (${r.email}): ${r.scorePercent}% | Hard ${r.hardAccuracyPercent}% | ${r.gradeLabel} | Focus: ${r.weakestTopic}`
    ),
  ].join('\n');

  return { subject, htmlBody, textFallback };
}

/**
 * Dispatches an email through the authenticated user's Gmail account using
 * Gmail API v1 `users/me/messages/send` with in-memory OAuth access token.
 * Must ONLY be called after explicit user confirmation in the UI modal.
 */
export async function sendGmailMessage(
  params: SendGmailParams
): Promise<SendGmailResult> {
  const { rawBase64Url } = buildMimeEmail({
    toEmail: params.toEmail,
    subject: params.subject,
    htmlBody: params.htmlBody,
    textFallback: params.textFallback,
    attachment: params.attachment,
  });

  const attemptSend = async (token: string) =>
    fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawBase64Url }),
    });

  let token = await requestGmailSendToken(params.loginHint, false);
  let res = await attemptSend(token);

  // Automatic 1-time refresh on 401 expired/revoked token
  if (res.status === 401) {
    clearCachedGmailToken();
    token = await requestGmailSendToken(params.loginHint, true);
    res = await attemptSend(token);
  }

  if (!res.ok) {
    let errDetail = `HTTP ${res.status}`;
    try {
      const errJson = (await res.json()) as {
        error?: { message?: string; status?: string };
      };
      if (errJson?.error?.message) {
        errDetail = errJson.error.message;
      }
    } catch {
      // keep HTTP status fallback
    }
    if (res.status === 403) {
      clearCachedGmailToken();
      throw new Error(
        `Gmail send permission was declined or unavailable (${errDetail}). Please try again and allow Gmail access in the Google popup.`
      );
    }
    throw new Error(`Gmail delivery failed: ${errDetail}`);
  }

  const data = (await res.json()) as { id?: string; threadId?: string };
  return {
    messageId: data.id || 'sent',
    threadId: data.threadId,
  };
}
