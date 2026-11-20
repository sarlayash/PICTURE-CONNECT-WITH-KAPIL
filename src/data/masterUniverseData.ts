import {
  APTITUDE_GRAMMAR_MCQS,
  APTITUDE_GRAMMAR_PLAYBOOKS,
} from './masterAptitudeGrammarData';
import {
  CODING_DSA_MCQS,
  CODING_DSA_PLAYBOOKS,
} from './masterCodingDsaData';
import {
  DATA_CLOUD_MCQS,
  DATA_CLOUD_PLAYBOOKS,
} from './masterDataCloudData';
import {
  MASTER_BADGES,
  MASTER_PILLARS,
  MASTER_TRACKS,
  MasterMcq,
  MasterPillarId,
  MasterPlaybookCard,
  MasterTrackId,
} from './masterUniverseTypes';

export * from './masterUniverseTypes';

export const MASTER_PLAYBOOKS: MasterPlaybookCard[] = [
  ...APTITUDE_GRAMMAR_PLAYBOOKS,
  ...CODING_DSA_PLAYBOOKS,
  ...DATA_CLOUD_PLAYBOOKS,
];

export const MASTER_MCQS: MasterMcq[] = [
  ...APTITUDE_GRAMMAR_MCQS,
  ...CODING_DSA_MCQS,
  ...DATA_CLOUD_MCQS,
];

export interface MasterTrackScoreSummary {
  trackId: MasterTrackId;
  total: number;
  answered: number;
  correct: number;
  hintsUsed: number;
  accuracyPct: number;
  completed: boolean;
}

export interface MasterPillarScoreSummary {
  pillarId: MasterPillarId;
  total: number;
  answered: number;
  correct: number;
  accuracyPct: number;
  completedTracks: number;
  totalTracks: number;
}

export function computeMasterTrackStats(params: {
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
}): Record<MasterTrackId, MasterTrackScoreSummary> {
  const answeredSet = new Set(params.answeredMcqs);
  const correctSet = new Set(params.correctMcqs);
  const hintSet = new Set(params.hintUsedMcqs);

  const out = {} as Record<MasterTrackId, MasterTrackScoreSummary>;
  MASTER_TRACKS.forEach((track) => {
    const items = MASTER_MCQS.filter((q) => q.trackId === track.id);
    const answered = items.filter((q) => answeredSet.has(q.id)).length;
    const correct = items.filter((q) => correctSet.has(q.id)).length;
    const hintsUsed = items.filter((q) => hintSet.has(q.id)).length;
    out[track.id] = {
      trackId: track.id,
      total: items.length,
      answered,
      correct,
      hintsUsed,
      accuracyPct: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      completed: answered >= items.length && items.length > 0,
    };
  });
  return out;
}

export function computeMasterPillarStats(
  trackStats: Record<MasterTrackId, MasterTrackScoreSummary>
): Record<MasterPillarId, MasterPillarScoreSummary> {
  const out = {} as Record<MasterPillarId, MasterPillarScoreSummary>;
  MASTER_PILLARS.forEach((pillar) => {
    let total = 0;
    let answered = 0;
    let correct = 0;
    let completedTracks = 0;
    pillar.trackIds.forEach((tid) => {
      const s = trackStats[tid];
      total += s.total;
      answered += s.answered;
      correct += s.correct;
      if (s.completed) completedTracks++;
    });
    out[pillar.id] = {
      pillarId: pillar.id,
      total,
      answered,
      correct,
      accuracyPct: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      completedTracks,
      totalTracks: pillar.trackIds.length,
    };
  });
  return out;
}

export function computeMasterBadges(params: {
  answeredMcqs: string[];
  correctMcqs: string[];
  hintUsedMcqs: string[];
  studiedPlaybooks: string[];
}): string[] {
  const trackStats = computeMasterTrackStats(params);
  const pillarStats = computeMasterPillarStats(trackStats);
  const hintSet = new Set(params.hintUsedMcqs);
  const cleanCorrect = params.correctMcqs.filter((id) => !hintSet.has(id)).length;
  const completedTracksCount = MASTER_TRACKS.filter(
    (t) => trackStats[t.id].completed
  ).length;

  return MASTER_BADGES.filter((b) =>
    b.checkUnlocked({
      aptitudeGrammarCorrect: pillarStats.aptitude_grammar.correct,
      codingDsaCorrect: pillarStats.coding_dsa.correct,
      dataCloudCorrect: pillarStats.data_cloud.correct,
      dsaCorrect: trackStats.dsa.correct,
      totalAnswered: params.answeredMcqs.length,
      totalCorrect: params.correctMcqs.length,
      cleanCorrect,
      studiedCount: params.studiedPlaybooks.length,
      completedTracksCount,
    })
  )
    .map((b) => b.id)
    .slice(0, 12);
}
