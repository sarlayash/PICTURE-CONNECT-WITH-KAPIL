import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Mail,
  Paperclip,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  EmailAttachmentPayload,
  extractBase64Payload,
  sendGmailMessage,
} from '../services/gmailService';
import {
  CredentialEmailType,
  logLearnerNotification,
  NotificationTargetView,
} from '../services/notificationService';

export interface EmailCredentialRequest {
  recipientEmail: string;
  recipientName: string;
  credentialType: CredentialEmailType;
  title: string;
  subject: string;
  htmlBody: string;
  textFallback: string;
  targetView: NotificationTargetView;
  attachment?: EmailAttachmentPayload;
  /** Optional custom sender label when Admin sends a reminder */
  sentByAdmin?: boolean;
  targetUid?: string;
}

interface EmailCredentialModalProps {
  user: User;
  request: EmailCredentialRequest | null;
  onClose: () => void;
  onSentSuccess?: (messageId: string) => void;
}

function formatApproxSizeKb(base64OrDataUrl: string): string {
  const raw = extractBase64Payload(base64OrDataUrl);
  const bytes = Math.floor((raw.length * 3) / 4);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const EmailCredentialModal: React.FC<EmailCredentialModalProps> = ({
  user,
  request,
  onClose,
  onSentSuccess,
}) => {
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  if (!request) return null;

  const isImageAttachment = request.attachment?.mimeType === 'image/png';
  const previewSrc =
    isImageAttachment && request.attachment?.base64OrDataUrl.startsWith('data:')
      ? request.attachment.base64OrDataUrl
      : isImageAttachment && request.attachment?.base64OrDataUrl
      ? `data:image/png;base64,${request.attachment.base64OrDataUrl}`
      : null;

  const handleConfirmSend = async () => {
    setSending(true);
    setErrorMsg(null);
    try {
      const res = await sendGmailMessage({
        toEmail: request.recipientEmail,
        subject: request.subject,
        htmlBody: request.htmlBody,
        textFallback: request.textFallback,
        attachment: request.attachment,
        loginHint: user.email || undefined,
      });

      if (!request.sentByAdmin) {
        try {
          await logLearnerNotification({
            user,
            kind:
              request.credentialType === 'reminder_digest'
                ? 'missing_reminder'
                : 'credential_emailed',
            title: `Emailed: ${request.title}`.slice(0, 120),
            body: `Delivered "${request.title}" to your verified sign-up email (${request.recipientEmail}) via Gmail.`,
            targetView: request.targetView,
            credentialType: request.credentialType,
            channel: 'email',
            sentBy: 'learner',
          });
        } catch (logErr) {
          console.error('Could not log email receipt to Firestore:', logErr);
        }
      }

      setSentId(res.messageId);
      if (onSentSuccess) onSentSuccess(res.messageId);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not send email via Gmail. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm Email Delivery via Gmail"
    >
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  CONFIRM GMAIL DELIVERY
                </div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  {request.title}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              aria-label="Close email confirmation dialog"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {sentId ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Email sent successfully via Gmail!</span>
                </div>
                <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                  Delivered to{' '}
                  <strong className="font-mono">{request.recipientEmail}</strong>
                  {request.attachment
                    ? ` with attachment "${request.attachment.filename}".`
                    : '.'}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-slate-500 uppercase">To (Sign-Up ID)</span>
                  <span className="font-mono font-semibold text-slate-950 dark:text-white inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {request.recipientEmail}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800 pt-2">
                  <span className="font-mono text-slate-500 uppercase">Subject</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {request.subject}
                  </span>
                </div>
                {request.attachment && (
                  <div className="flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 pt-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300 truncate">
                      {isImageAttachment ? (
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                      <span className="truncate">{request.attachment.filename}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 shrink-0 inline-flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      {formatApproxSizeKb(request.attachment.base64OrDataUrl)}
                    </span>
                  </div>
                )}
              </div>

              {previewSrc && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950 p-2.5 flex justify-center">
                  <img
                    src={previewSrc}
                    alt={request.title}
                    className="max-h-44 w-auto rounded-lg shadow-sm object-contain"
                  />
                </div>
              )}

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                This will send one email through your signed-in Google account to{' '}
                <strong className="font-mono text-slate-900 dark:text-slate-200">
                  {request.recipientEmail}
                </strong>
                . If this is your first email in this session, Google will show a quick permission popup to approve Gmail sending.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  disabled={sending}
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleConfirmSend}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {sending
                      ? 'Sending via Gmail...'
                      : 'Confirm & Send to Sign-Up Email'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
