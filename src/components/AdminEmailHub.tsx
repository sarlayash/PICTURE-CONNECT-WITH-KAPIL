import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Edit3,
  Eye,
  ListPlus,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { ADMIN_EMAIL, requestGmailSendToken } from '../firebase';
import {
  ADMIN_EMAIL_TEMPLATES,
  AdminDistributionListDoc,
  AllAudienceSubFilter,
  chunkRecipients,
  createDistributionList,
  deleteDistributionList,
  EmailTargetMode,
  getRegisteredLearnersWithEmail,
  markDistributionListSent,
  MAX_DISTRIBUTION_LIST_MEMBERS,
  resolveEmailTargetRecipients,
  updateDistributionList,
} from '../services/adminDistributionService';
import { AdminUserRecord } from '../services/firestoreService';
import {
  buildAdminCustomBroadcastEmail,
  sendGmailMessage,
} from '../services/gmailService';
import { adminSendReminderNotification } from '../services/notificationService';

interface AdminEmailHubProps {
  adminEmail: string;
  records: AdminUserRecord[];
  distributionLists: AdminDistributionListDoc[];
  dailySubmittedUids: Set<string>;
  preselectedSpecificUid?: string | null;
  onClearPreselectedSpecificUid?: () => void;
}

interface DispatchRow {
  uid: string;
  name: string;
  email: string;
  domain?: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error?: string;
  messageId?: string;
}

function formatShortDate(ms: number): string {
  if (!ms) return 'Never sent';
  return new Date(ms).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const AdminEmailHub: React.FC<AdminEmailHubProps> = ({
  adminEmail,
  records,
  distributionLists,
  dailySubmittedUids,
  preselectedSpecificUid,
  onClearPreselectedSpecificUid,
}) => {
  const registeredLearners = useMemo(
    () => getRegisteredLearnersWithEmail(records),
    [records]
  );

  const [targetMode, setTargetMode] = useState<EmailTargetMode>('all');
  const [allSubFilter, setAllSubFilter] =
    useState<AllAudienceSubFilter>('all_registered');
  const [optedInOnly, setOptedInOnly] = useState(false);
  const [excludedUids, setExcludedUids] = useState<Set<string>>(() => new Set());
  const [audienceSearch, setAudienceSearch] = useState('');

  const [specificSearch, setSpecificSearch] = useState('');
  const [specificUid, setSpecificUid] = useState<string>('');
  const [selectedListId, setSelectedListId] = useState<string>('');

  // Distribution list inline editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [listMemberSearch, setListMemberSearch] = useState('');
  const [listMemberUids, setListMemberUids] = useState<Set<string>>(
    () => new Set()
  );
  const [listSaveBusy, setListSaveBusy] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [listNote, setListNote] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Composer & dispatch state
  const [activeTemplateId, setActiveTemplateId] = useState<string>('custom');
  const [subject, setSubject] = useState(ADMIN_EMAIL_TEMPLATES[0].subject);
  const [messageBody, setMessageBody] = useState(ADMIN_EMAIL_TEMPLATES[0].body);
  const [ctaLabel, setCtaLabel] = useState(ADMIN_EMAIL_TEMPLATES[0].ctaLabel);
  const [ctaUrl, setCtaUrl] = useState(() =>
    typeof window !== 'undefined' ? window.location.origin : ''
  );
  const [deliveryMethod, setDeliveryMethod] = useState<
    'personalized' | 'bcc_batch'
  >('personalized');
  const [alsoNotifyPortal, setAlsoNotifyPortal] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);
  const [sending, setSending] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [dispatchRows, setDispatchRows] = useState<DispatchRow[]>([]);
  const [dispatchSummary, setDispatchSummary] = useState<{
    sent: number;
    failed: number;
    total: number;
    modeLabel: string;
  } | null>(null);

  // Sync preselected learner from Learner Inspector shortcut
  useEffect(() => {
    if (preselectedSpecificUid) {
      setTargetMode('specific');
      setSpecificUid(preselectedSpecificUid);
      setExcludedUids(new Set());
      setConfirmStep(false);
      onClearPreselectedSpecificUid?.();
    }
  }, [preselectedSpecificUid, onClearPreselectedSpecificUid]);

  // Keep selectedListId valid as lists load/update
  useEffect(() => {
    if (distributionLists.length === 0) {
      setSelectedListId('');
      return;
    }
    if (!selectedListId || !distributionLists.some((l) => l.id === selectedListId)) {
      setSelectedListId(distributionLists[0].id);
    }
  }, [distributionLists, selectedListId]);

  // Default specificUid to first registered learner if unset
  useEffect(() => {
    if (
      registeredLearners.length > 0 &&
      (!specificUid || !registeredLearners.some((r) => r.uid === specificUid))
    ) {
      setSpecificUid(registeredLearners[0].uid);
    }
  }, [registeredLearners, specificUid]);

  const activeList = useMemo(
    () => distributionLists.find((l) => l.id === selectedListId) || null,
    [distributionLists, selectedListId]
  );

  const optedInCount = useMemo(
    () =>
      registeredLearners.filter((r) => r.emailRemindersEnabled !== false).length,
    [registeredLearners]
  );

  const dailyPendingCount = useMemo(
    () =>
      registeredLearners.filter((r) => !dailySubmittedUids.has(r.uid)).length,
    [registeredLearners, dailySubmittedUids]
  );

  const incompleteCoreCount = useMemo(
    () =>
      registeredLearners.filter((r) => r.completedLevels.length < 10).length,
    [registeredLearners]
  );

  const { recipients: resolvedRecipients, unresolvedListCount } = useMemo(
    () =>
      resolveEmailTargetRecipients({
        mode: targetMode,
        records: registeredLearners,
        specificUid,
        distributionList: activeList,
        optedInOnly,
        audienceFilter: allSubFilter,
        dailySubmittedUids,
        excludedUids,
      }),
    [
      targetMode,
      registeredLearners,
      specificUid,
      activeList,
      optedInOnly,
      allSubFilter,
      dailySubmittedUids,
      excludedUids,
    ]
  );

  // Unexcluded audience list (for display with checkboxes in 'all' or 'distribution_list')
  const baseAudienceForDisplay = useMemo(
    () =>
      resolveEmailTargetRecipients({
        mode: targetMode,
        records: registeredLearners,
        specificUid,
        distributionList: activeList,
        optedInOnly,
        audienceFilter: allSubFilter,
        dailySubmittedUids,
        excludedUids: new Set(),
      }).recipients,
    [
      targetMode,
      registeredLearners,
      specificUid,
      activeList,
      optedInOnly,
      allSubFilter,
      dailySubmittedUids,
    ]
  );

  const filteredAudienceForDisplay = useMemo(() => {
    const q = audienceSearch.trim().toLowerCase();
    if (!q) return baseAudienceForDisplay;
    return baseAudienceForDisplay.filter(
      (r) =>
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.domain || '').toLowerCase().includes(q) ||
        (r.college || '').toLowerCase().includes(q)
    );
  }, [baseAudienceForDisplay, audienceSearch]);

  const filteredSpecificCandidates = useMemo(() => {
    const q = specificSearch.trim().toLowerCase();
    if (!q) return registeredLearners;
    return registeredLearners.filter(
      (r) =>
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.domain || '').toLowerCase().includes(q) ||
        (r.college || '').toLowerCase().includes(q)
    );
  }, [registeredLearners, specificSearch]);

  const filteredListEditorCandidates = useMemo(() => {
    const q = listMemberSearch.trim().toLowerCase();
    if (!q) return registeredLearners;
    return registeredLearners.filter(
      (r) =>
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.domain || '').toLowerCase().includes(q) ||
        (r.college || '').toLowerCase().includes(q)
    );
  }, [registeredLearners, listMemberSearch]);

  const previewSample = useMemo(() => {
    const first = resolvedRecipients[0] || registeredLearners[0];
    if (!first) {
      return buildAdminCustomBroadcastEmail({
        learnerName: 'Registered Learner',
        learnerEmail: 'learner@example.com',
        learnerDomain: 'Software Engineering',
        subject,
        messageBody,
        ctaLabel,
        ctaUrl,
      });
    }
    if (deliveryMethod === 'bcc_batch' && resolvedRecipients.length > 1) {
      return buildAdminCustomBroadcastEmail({
        learnerName: 'EMPLOYABILITY UNIVERSE Learner',
        learnerEmail: 'Selected Distribution Cohort (BCC)',
        learnerDomain: 'All Placement Tracks',
        subject,
        messageBody,
        ctaLabel,
        ctaUrl,
      });
    }
    return buildAdminCustomBroadcastEmail({
      learnerName: first.displayName,
      learnerEmail: first.email,
      learnerDomain: first.domain || first.areaOfInterest || 'Career & Placement',
      subject,
      messageBody,
      ctaLabel,
      ctaUrl,
    });
  }, [
    resolvedRecipients,
    registeredLearners,
    deliveryMethod,
    subject,
    messageBody,
    ctaLabel,
    ctaUrl,
  ]);

  const openCreateListEditor = () => {
    setEditingListId(null);
    setListName('');
    setListDesc('');
    setListMemberSearch('');
    setListMemberUids(new Set());
    setListError(null);
    setListNote(null);
    setEditorOpen(true);
    setTargetMode('distribution_list');
  };

  const openEditListEditor = (list: AdminDistributionListDoc) => {
    const uidSet = new Set<string>();
    const emailMap = new Map(
      registeredLearners.map((r) => [r.email.toLowerCase(), r.uid])
    );
    const validUidSet = new Set(registeredLearners.map((r) => r.uid));
    list.recipientUids.forEach((uid) => {
      if (validUidSet.has(uid)) uidSet.add(uid);
    });
    list.recipientEmails.forEach((em) => {
      const foundUid = emailMap.get(em.toLowerCase());
      if (foundUid) uidSet.add(foundUid);
    });

    setEditingListId(list.id);
    setListName(list.name);
    setListDesc(list.description);
    setListMemberSearch('');
    setListMemberUids(uidSet);
    setListError(null);
    setListNote(null);
    setEditorOpen(true);
  };

  const handleSaveDistributionList = async (e: React.FormEvent) => {
    e.preventDefault();
    setListError(null);
    setListNote(null);

    if (!listName.trim()) {
      setListError('Please enter a name for the distribution list.');
      return;
    }
    if (listMemberUids.size === 0) {
      setListError(
        'Select at least 1 already-registered learner email to include in this list.'
      );
      return;
    }

    setListSaveBusy(true);
    try {
      const uids = Array.from(listMemberUids);
      if (editingListId) {
        await updateDistributionList({
          listId: editingListId,
          name: listName,
          description: listDesc,
          recipientUids: uids,
          records: registeredLearners,
        });
        setSelectedListId(editingListId);
        setListNote(`Updated distribution list "${listName.trim()}".`);
      } else {
        const newId = await createDistributionList({
          name: listName,
          description: listDesc,
          recipientUids: uids,
          records: registeredLearners,
        });
        setSelectedListId(newId);
        setListNote(`Created distribution list "${listName.trim()}".`);
      }
      setEditorOpen(false);
      setEditingListId(null);
      setExcludedUids(new Set());
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : 'Unable to save distribution list.'
      );
    } finally {
      setListSaveBusy(false);
    }
  };

  const handleDeleteDistributionList = async (listId: string) => {
    setDeleteBusy(true);
    setListError(null);
    setListNote(null);
    try {
      await deleteDistributionList(listId);
      setDeleteConfirmId(null);
      setListNote('Distribution list deleted.');
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : 'Failed to delete distribution list.'
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleSaveCurrentSelectionAsList = () => {
    const prefillUids = new Set(resolvedRecipients.map((r) => r.uid));
    setEditingListId(null);
    setListName(
      allSubFilter === 'daily_mock_pending'
        ? 'Daily Mock Pending Cohort'
        : allSubFilter === 'incomplete_core'
        ? 'Incomplete Core Track'
        : 'Custom Registered Cohort'
    );
    setListDesc(
      `Created from ${prefillUids.size} registered learner(s) on ${new Date().toLocaleDateString()}.`
    );
    setListMemberSearch('');
    setListMemberUids(prefillUids);
    setListError(null);
    setListNote(null);
    setTargetMode('distribution_list');
    setEditorOpen(true);
  };

  const handleSelectTemplate = (tplId: string) => {
    const found = ADMIN_EMAIL_TEMPLATES.find((t) => t.id === tplId);
    if (!found) return;
    setActiveTemplateId(found.id);
    setSubject(found.subject);
    setMessageBody(found.body);
    setCtaLabel(found.ctaLabel);
    setConfirmStep(false);
  };

  const appendTokenToBody = (token: string) => {
    setMessageBody((prev) =>
      prev.endsWith(' ') || prev.endsWith('\n') || !prev
        ? `${prev}${token}`
        : `${prev} ${token}`
    );
  };

  const toggleAudienceExclude = (uid: string) => {
    setExcludedUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
    setConfirmStep(false);
  };

  const toggleListMember = (uid: string) => {
    setListMemberUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else if (next.size < MAX_DISTRIBUTION_LIST_MEMBERS) {
        next.add(uid);
      }
      return next;
    });
  };

  const runDispatchForRecipients = async (targets: AdminUserRecord[]) => {
    if (targets.length === 0) {
      setComposerError('No registered recipients selected.');
      return;
    }
    if (!subject.trim()) {
      setComposerError('Please enter an email subject line.');
      return;
    }
    if (!messageBody.trim()) {
      setComposerError('Please enter a message body before sending.');
      return;
    }

    setSending(true);
    setConfirmStep(false);
    setComposerError(null);
    setDispatchSummary(null);

    const initialRows: DispatchRow[] = targets.map((r) => ({
      uid: r.uid,
      name: r.displayName,
      email: r.email,
      domain: r.domain || r.areaOfInterest,
      status: 'pending',
    }));
    setDispatchRows(initialRows);

    const senderHint = adminEmail || ADMIN_EMAIL;

    // Acquire Gmail send OAuth token FIRST inside user click gesture so batch loop has zero popup blocking
    try {
      await requestGmailSendToken(senderHint, false);
    } catch (err) {
      setSending(false);
      setComposerError(
        err instanceof Error
          ? err.message
          : 'Gmail send permission was cancelled or unavailable.'
      );
      setDispatchRows([]);
      return;
    }

    let sentCount = 0;
    let failedCount = 0;
    const useBccBatch =
      deliveryMethod === 'bcc_batch' && targets.length > 1;

    if (useBccBatch) {
      const batches = chunkRecipients(targets, 45);
      for (const batch of batches) {
        const batchUids = new Set(batch.map((b) => b.uid));
        setDispatchRows((prev) =>
          prev.map((row) =>
            batchUids.has(row.uid) ? { ...row, status: 'sending' } : row
          )
        );
        try {
          const composed = buildAdminCustomBroadcastEmail({
            learnerName: 'EMPLOYABILITY UNIVERSE Learner',
            learnerEmail: 'Verified Registered Cohort (BCC)',
            learnerDomain: 'Placement Readiness Track',
            subject,
            messageBody,
            audienceLabel:
              targetMode === 'distribution_list' && activeList
                ? `DISTRIBUTION LIST · ${activeList.name.toUpperCase()}`
                : 'COHORT BROADCAST · EMPLOYABILITY UNIVERSE WITH KAPIL',
            ctaLabel,
            ctaUrl,
          });
          const result = await sendGmailMessage({
            toEmail: senderHint,
            bccEmails: batch.map((b) => b.email),
            subject: composed.subject,
            htmlBody: composed.htmlBody,
            textFallback: composed.textFallback,
            loginHint: senderHint,
          });
          sentCount += batch.length;
          setDispatchRows((prev) =>
            prev.map((row) =>
              batchUids.has(row.uid)
                ? { ...row, status: 'sent', messageId: result.messageId }
                : row
            )
          );

          if (alsoNotifyPortal) {
            for (const member of batch) {
              try {
                const personal = buildAdminCustomBroadcastEmail({
                  learnerName: member.displayName,
                  learnerEmail: member.email,
                  learnerDomain: member.domain || member.areaOfInterest,
                  subject,
                  messageBody,
                });
                await adminSendReminderNotification({
                  targetUid: member.uid,
                  recipientEmail: member.email,
                  kind: 'admin_reminder',
                  credentialType: 'reminder_digest',
                  title: personal.subject.slice(0, 120),
                  body: personal.textFallback.slice(0, 580),
                  targetView: 'journey',
                  channel: 'email',
                });
              } catch {
                // Non-fatal notification log fallback
              }
            }
          }
        } catch (err) {
          failedCount += batch.length;
          const errMsg =
            err instanceof Error ? err.message : 'Batch delivery failed.';
          setDispatchRows((prev) =>
            prev.map((row) =>
              batchUids.has(row.uid)
                ? { ...row, status: 'failed', error: errMsg }
                : row
            )
          );
        }
      }
    } else {
      // 1-to-1 Personalized delivery via Gmail API
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        setDispatchRows((prev) =>
          prev.map((row) =>
            row.uid === target.uid ? { ...row, status: 'sending' } : row
          )
        );
        try {
          const composed = buildAdminCustomBroadcastEmail({
            learnerName: target.displayName,
            learnerEmail: target.email,
            learnerDomain: target.domain || target.areaOfInterest,
            subject,
            messageBody,
            audienceLabel:
              targetMode === 'distribution_list' && activeList
                ? `LIST: ${activeList.name.toUpperCase()}`
                : targetMode === 'specific'
                ? 'DIRECT MENTOR MESSAGE · EMPLOYABILITY UNIVERSE WITH KAPIL'
                : 'COHORT ANNOUNCEMENT · EMPLOYABILITY UNIVERSE WITH KAPIL',
            ctaLabel,
            ctaUrl,
          });
          const res = await sendGmailMessage({
            toEmail: target.email,
            subject: composed.subject,
            htmlBody: composed.htmlBody,
            textFallback: composed.textFallback,
            loginHint: senderHint,
          });
          sentCount += 1;
          setDispatchRows((prev) =>
            prev.map((row) =>
              row.uid === target.uid
                ? { ...row, status: 'sent', messageId: res.messageId }
                : row
            )
          );
          if (alsoNotifyPortal) {
            try {
              await adminSendReminderNotification({
                targetUid: target.uid,
                recipientEmail: target.email,
                kind: 'admin_reminder',
                credentialType: 'reminder_digest',
                title: composed.subject.slice(0, 120),
                body: messageBody.trim().slice(0, 580),
                targetView: 'journey',
                channel: 'email',
              });
            } catch {
              // Non-fatal notification log failure
            }
          }
        } catch (err) {
          failedCount += 1;
          const errMsg =
            err instanceof Error ? err.message : 'Gmail send failed.';
          setDispatchRows((prev) =>
            prev.map((row) =>
              row.uid === target.uid
                ? { ...row, status: 'failed', error: errMsg }
                : row
            )
          );
        }
        // Respect gentle pacing between Gmail sends
        if (i < targets.length - 1) {
          await new Promise((r) => setTimeout(r, 120));
        }
      }
    }

    if (targetMode === 'distribution_list' && activeList && sentCount > 0) {
      try {
        await markDistributionListSent({
          listId: activeList.id,
          currentSentCount: activeList.sentCount,
        });
      } catch {
        // Non-fatal metadata sync
      }
    }

    setDispatchSummary({
      sent: sentCount,
      failed: failedCount,
      total: targets.length,
      modeLabel: useBccBatch ? 'BCC Batch' : '1-to-1 Personalized',
    });
    setSending(false);
  };

  const handleRetryFailed = () => {
    const failedUids = new Set(
      dispatchRows.filter((r) => r.status === 'failed').map((r) => r.uid)
    );
    const retryTargets = registeredLearners.filter((r) =>
      failedUids.has(r.uid)
    );
    void runDispatchForRecipients(retryTargets);
  };

  const sentCountLive = dispatchRows.filter((r) => r.status === 'sent').length;
  const failedCountLive = dispatchRows.filter((r) => r.status === 'failed').length;
  const progressPct =
    dispatchRows.length > 0
      ? Math.round(
          ((sentCountLive + failedCountLive) / dispatchRows.length) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Top KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Registered Emails Ready</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
            {registeredLearners.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Verified Google accounts only
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Saved Distribution Lists</span>
            <ListPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
            {distributionLists.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Synced to Firestore
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Email Reminders Opted-In</span>
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2 tabular-nums">
            {optedInCount} / {registeredLearners.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {dailyPendingCount} pending Daily Mock
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 p-4">
          <div className="flex items-center justify-between text-xs text-blue-800 dark:text-blue-300 font-semibold">
            <span>Selected Recipients</span>
            <Mail className="w-4 h-4" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-950 dark:text-white mt-2 tabular-nums">
            {resolvedRecipients.length}
          </div>
          <div className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-1 truncate">
            {targetMode === 'all'
              ? 'All Registered Mode'
              : targetMode === 'specific'
              ? resolvedRecipients[0]?.email || 'Select 1 registered ID'
              : activeList
              ? `List: ${activeList.name}`
              : 'Choose a list'}
          </div>
        </div>
      </div>

      {/* Main 2-Column Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Audience Selector & Distribution List Builder */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                01. Target Registered Audience
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose all users, one registered email ID, or a saved distribution list.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateListEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New List</span>
            </button>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTargetMode('all');
                setExcludedUids(new Set());
                setConfirmStep(false);
              }}
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap truncate ${
                targetMode === 'all'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({registeredLearners.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetMode('specific');
                setExcludedUids(new Set());
                setConfirmStep(false);
              }}
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap truncate ${
                targetMode === 'specific'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Specific Email
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetMode('distribution_list');
                setExcludedUids(new Set());
                setConfirmStep(false);
              }}
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap truncate ${
                targetMode === 'distribution_list'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lists ({distributionLists.length})
            </button>
          </div>

          {listError && (
            <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
              {listError}
            </div>
          )}

          {listNote && (
            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-2">
              <span>{listNote}</span>
              <button
                type="button"
                onClick={() => setListNote(null)}
                className="text-emerald-700 dark:text-emerald-300 hover:underline font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* MODE A: ALL REGISTERED LEARNERS */}
          {targetMode === 'all' && !editorOpen && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={allSubFilter}
                  onChange={(e) => {
                    setAllSubFilter(e.target.value as AllAudienceSubFilter);
                    setExcludedUids(new Set());
                    setConfirmStep(false);
                  }}
                  aria-label="Filter registered learners"
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                >
                  <option value="all_registered">
                    All Registered ({registeredLearners.length})
                  </option>
                  <option value="daily_mock_pending">
                    Daily Mock Pending ({dailyPendingCount})
                  </option>
                  <option value="incomplete_core">
                    Core Levels Incomplete ({incompleteCoreCount})
                  </option>
                  <option value="completed_core">
                    10/10 Core Completed (
                    {registeredLearners.length - incompleteCoreCount})
                  </option>
                </select>

                <button
                  type="button"
                  onClick={handleSaveCurrentSelectionAsList}
                  disabled={resolvedRecipients.length === 0}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-indigo-300 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Save Filter as List</span>
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={optedInOnly}
                  onChange={(e) => setOptedInOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                <span>
                  Only include learners opted into email reminders ({optedInCount})
                </span>
              </label>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={audienceSearch}
                  onChange={(e) => setAudienceSearch(e.target.value)}
                  placeholder="Filter recipients by name, email, or domain..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="tabular-nums">
                  Sending to {resolvedRecipients.length} of{' '}
                  {baseAudienceForDisplay.length}
                </span>
                {excludedUids.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setExcludedUids(new Set())}
                    className="text-blue-700 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    Re-include All ({excludedUids.size})
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {filteredAudienceForDisplay.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No registered learners match the active filter.
                  </div>
                ) : (
                  filteredAudienceForDisplay.map((r) => {
                    const included = !excludedUids.has(r.uid);
                    return (
                      <label
                        key={r.uid}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-950/60 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={included}
                          onChange={() => toggleAudienceExclude(r.uid)}
                          className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">
                            {r.displayName}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 truncate">
                            {r.email}
                            {r.domain ? ` · ${r.domain}` : ''}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                          {r.xp} XP
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* MODE B: SPECIFIC REGISTERED EMAIL ID */}
          {targetMode === 'specific' && !editorOpen && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-300">
                Select an already-registered learner below. Only verified Google sign-up emails stored in Firestore can be targeted here.
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={specificSearch}
                  onChange={(e) => setSpecificSearch(e.target.value)}
                  placeholder="Search registered email ID, name, or college..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {filteredSpecificCandidates.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No already-registered email matches &ldquo;{specificSearch}&rdquo;.
                  </div>
                ) : (
                  filteredSpecificCandidates.map((r) => {
                    const selected = r.uid === specificUid;
                    return (
                      <button
                        key={r.uid}
                        type="button"
                        onClick={() => {
                          setSpecificUid(r.uid);
                          setConfirmStep(false);
                        }}
                        className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 text-xs transition-colors cursor-pointer ${
                          selected
                            ? 'bg-blue-50 dark:bg-blue-950/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-950/60'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-950 dark:text-white truncate">
                            {r.displayName}
                          </div>
                          <div className="font-mono text-[11px] text-blue-700 dark:text-blue-400 truncate">
                            {r.email}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {r.domain || 'General Track'} ·{' '}
                            {r.college || 'No college set'}
                          </div>
                        </div>
                        {selected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* MODE C: SAVED DISTRIBUTION LISTS + INLINE LIST BUILDER */}
          {(targetMode === 'distribution_list' || editorOpen) && (
            <div className="space-y-3">
              {editorOpen ? (
                <form onSubmit={handleSaveDistributionList} className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-950 dark:text-white">
                      {editingListId
                        ? 'Edit Distribution List'
                        : 'Create Distribution List'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditorOpen(false);
                        setEditingListId(null);
                        setListError(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      List Name (max 80 chars)
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="e.g. CS Final Year Placement Cohort"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      maxLength={240}
                      value={listDesc}
                      onChange={(e) => setListDesc(e.target.value)}
                      placeholder="Purpose or batch notes..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  {/* Quick-select presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setListMemberUids(
                          new Set(
                            registeredLearners
                              .slice(0, MAX_DISTRIBUTION_LIST_MEMBERS)
                              .map((r) => r.uid)
                          )
                        )
                      }
                      className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      + All Registered
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setListMemberUids(
                          new Set(
                            registeredLearners
                              .filter((r) => !dailySubmittedUids.has(r.uid))
                              .slice(0, MAX_DISTRIBUTION_LIST_MEMBERS)
                              .map((r) => r.uid)
                          )
                        )
                      }
                      className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      + Pending Daily Mock
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setListMemberUids(
                          new Set(
                            registeredLearners
                              .filter((r) => r.completedLevels.length < 10)
                              .slice(0, MAX_DISTRIBUTION_LIST_MEMBERS)
                              .map((r) => r.uid)
                          )
                        )
                      }
                      className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      + Incomplete Core
                    </button>
                    <button
                      type="button"
                      onClick={() => setListMemberUids(new Set())}
                      className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-500 hover:text-red-600 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={listMemberSearch}
                      onChange={(e) => setListMemberSearch(e.target.value)}
                      placeholder="Search registered learners to add/remove..."
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="tabular-nums">
                      Selected: {listMemberUids.size} /{' '}
                      {MAX_DISTRIBUTION_LIST_MEMBERS}
                    </span>
                    <span>Registered emails only</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {filteredListEditorCandidates.map((r) => {
                      const checked = listMemberUids.has(r.uid);
                      return (
                        <label
                          key={r.uid}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-950/60 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleListMember(r.uid)}
                            className="rounded border-slate-300 text-indigo-700 focus:ring-indigo-600 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {r.displayName}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500 truncate">
                              {r.email}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditorOpen(false);
                        setEditingListId(null);
                      }}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={listSaveBusy}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {listSaveBusy
                          ? 'Saving...'
                          : editingListId
                          ? 'Update Distribution List'
                          : 'Save Distribution List'}
                      </span>
                    </button>
                  </div>
                </form>
              ) : distributionLists.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-8 text-center space-y-3">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    No Distribution Lists Saved Yet
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Group registered learners into reusable cohorts (for example, Placement Batch 2026 or Daily Mock Pending) and send one-click broadcasts anytime.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateListEditor}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Distribution List</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
                    {distributionLists.map((list) => {
                      const active = list.id === selectedListId;
                      return (
                        <div
                          key={list.id}
                          className={`rounded-xl border p-3 transition-colors ${
                            active
                              ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedListId(list.id);
                                setExcludedUids(new Set());
                                setConfirmStep(false);
                              }}
                              className="text-left flex-1 min-w-0 cursor-pointer"
                            >
                              <div className="font-semibold text-xs text-slate-950 dark:text-white truncate">
                                {list.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                {list.recipientEmails.length} members · Sent{' '}
                                {list.sentCount}× ·{' '}
                                {formatShortDate(list.lastSentAtMs)}
                              </div>
                              {list.description && (
                                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                                  {list.description}
                                </div>
                              )}
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => openEditListEditor(list)}
                                title="Edit distribution list"
                                aria-label={`Edit ${list.name}`}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {deleteConfirmId === list.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={deleteBusy}
                                    onClick={() =>
                                      handleDeleteDistributionList(list.id)
                                    }
                                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold cursor-pointer whitespace-nowrap"
                                  >
                                    {deleteBusy ? '...' : 'Delete'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="p-1 rounded border border-slate-300 dark:border-slate-700 text-slate-500 cursor-pointer"
                                    aria-label="Cancel delete"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(list.id)}
                                  title="Delete distribution list"
                                  aria-label={`Delete ${list.name}`}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activeList && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>
                          Active Members ({resolvedRecipients.length}/
                          {baseAudienceForDisplay.length})
                        </span>
                        {unresolvedListCount > 0 && (
                          <span className="text-amber-700 dark:text-amber-400">
                            {unresolvedListCount} unregistered skipped
                          </span>
                        )}
                      </div>
                      <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                        {baseAudienceForDisplay.map((r) => {
                          const included = !excludedUids.has(r.uid);
                          return (
                            <label
                              key={r.uid}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-950/60 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={included}
                                onChange={() => toggleAudienceExclude(r.uid)}
                                className="rounded border-slate-300 text-indigo-700 focus:ring-indigo-600 shrink-0"
                              />
                              <span className="font-semibold text-slate-900 dark:text-white truncate">
                                {r.displayName}
                              </span>
                              <span className="font-mono text-[11px] text-slate-500 truncate ml-auto">
                                {r.email}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Email Composer, Preview & Dispatch Console */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                02. Compose &amp; Dispatch via Gmail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sending from verified admin Gmail ({adminEmail || ADMIN_EMAIL})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Hide Email Preview' : 'Preview Email'}</span>
            </button>
          </div>

          {/* Quick Templates */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ADMIN_EMAIL_TEMPLATES.map((tpl) => {
              const active = activeTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {tpl.label}
                </button>
              );
            })}
          </div>

          {/* Subject & Body */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                maxLength={180}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setConfirmStep(false);
                }}
                placeholder="Enter email subject (supports {{name}} or {{firstName}})..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Message Body
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Insert token:</span>
                  {['{{name}}', '{{firstName}}', '{{domain}}'].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => appendTokenToBody(tok)}
                      className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono text-blue-700 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {tok}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={7}
                maxLength={4000}
                value={messageBody}
                onChange={(e) => {
                  setMessageBody(e.target.value);
                  setConfirmStep(false);
                }}
                placeholder="Write your personalized message to registered learners..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-950 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Action Button Label (optional)
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="Open EMPLOYABILITY UNIVERSE"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Action Button URL (https://...)
                </label>
                <input
                  type="url"
                  maxLength={240}
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Delivery Mode & Portal Notification Sync */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Delivery Method
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('personalized')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    deliveryMethod === 'personalized'
                      ? 'bg-blue-700 text-white'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  1-to-1 Personalized (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('bcc_batch')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    deliveryMethod === 'bcc_batch'
                      ? 'bg-blue-700 text-white'
                      : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Single BCC Batch (45/msg)
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alsoNotifyPortal}
                onChange={(e) => setAlsoNotifyPortal(e.target.checked)}
                className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
              />
              <span>
                Also log copy inside each recipient’s In-App Portal Notification Center
              </span>
            </label>
          </div>

          {/* Optional Sanitized HTML Preview */}
          {showPreview && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
              <div className="text-[11px] font-mono text-slate-500">
                SUBJECT PREVIEW: <strong className="text-slate-900 dark:text-white">{previewSample.subject}</strong>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-4 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {previewSample.textFallback}
              </div>
            </div>
          )}

          {composerError && (
            <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{composerError}</span>
            </div>
          )}

          {/* Action / Explicit Confirmation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="tabular-nums">
                Target: <strong className="text-slate-950 dark:text-white">{resolvedRecipients.length}</strong> registered recipient{resolvedRecipients.length === 1 ? '' : 's'}
              </span>
            </div>

            {confirmStep ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Send via Gmail to {resolvedRecipients.length} registered email{resolvedRecipients.length === 1 ? '' : 's'}?
                </span>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => setConfirmStep(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => void runDispatchForRecipients(resolvedRecipients)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Dispatch Now</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={sending || resolvedRecipients.length === 0 || !subject.trim() || !messageBody.trim()}
                onClick={() => {
                  setComposerError(null);
                  setConfirmStep(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>
                  {sending
                    ? `Sending (${sentCountLive}/${dispatchRows.length})...`
                    : `Review & Send Email (${resolvedRecipients.length})`}
                </span>
              </button>
            )}
          </div>

          {/* Live Delivery Progress & Per-Recipient Ledger */}
          {dispatchRows.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold text-slate-950 dark:text-white tabular-nums">
                  {dispatchSummary
                    ? `${dispatchSummary.modeLabel} Complete · ${dispatchSummary.sent}/${dispatchSummary.total} Sent${
                        dispatchSummary.failed > 0
                          ? ` · ${dispatchSummary.failed} Failed`
                          : ''
                      }`
                    : `Dispatching via Gmail · ${sentCountLive} sent / ${dispatchRows.length} total`}
                </div>
                <div className="flex items-center gap-2">
                  {!sending && failedCountLive > 0 && (
                    <button
                      type="button"
                      onClick={handleRetryFailed}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry Failed ({failedCountLive})</span>
                    </button>
                  )}
                  {!sending && (
                    <button
                      type="button"
                      onClick={() => {
                        setDispatchRows([]);
                        setDispatchSummary(null);
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    failedCountLive > 0 && !sending
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="max-h-48 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                {dispatchRows.map((row) => (
                  <div
                    key={row.uid}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {row.name}
                      </span>{' '}
                      <span className="font-mono text-[11px] text-slate-500">
                        ({row.email})
                      </span>
                      {row.error && (
                        <div className="text-[11px] text-red-600 dark:text-red-400 truncate">
                          {row.error}
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-mono text-[11px] font-bold uppercase shrink-0 ${
                        row.status === 'sent'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : row.status === 'failed'
                          ? 'text-red-600 dark:text-red-400'
                          : row.status === 'sending'
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
