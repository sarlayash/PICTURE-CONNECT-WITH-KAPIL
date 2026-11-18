import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  Trophy,
  UserCheck,
} from 'lucide-react';
import {
  ACTIVITIES,
  RUBRIC_CRITERIA,
  RubricCriterion,
  TEAM_ROLES,
  TeamRecord,
  TeamRole,
  RoundScore,
} from '../data/workshopData';

interface ChampionshipArenaProps {
  teams: TeamRecord[];
  isAdmin: boolean;
  onSeedTeams: () => Promise<void>;
  onUpdateTeamName: (teamId: string, name: string) => Promise<void>;
  onRotateAllSpeakers: () => Promise<void>;
  onUpdateMember: (
    teamId: string,
    memberId: string,
    patch: Partial<{ name: string; role: TeamRole; spokeCount: number }>
  ) => Promise<void>;
  onAddMember: (teamId: string, name: string, role: TeamRole) => Promise<void>;
  onRecordScore: (
    teamId: string,
    score: Omit<RoundScore, 'id' | 'recordedAt'>
  ) => Promise<void>;
  onDeleteScore: (teamId: string, scoreId: string) => Promise<void>;
}

export const ChampionshipArena: React.FC<ChampionshipArenaProps> = ({
  teams,
  isAdmin,
  onSeedTeams,
  onUpdateTeamName,
  onRotateAllSpeakers,
  onUpdateMember,
  onAddMember,
  onRecordScore,
  onDeleteScore,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || 'team-1');
  const [activityLabel, setActivityLabel] = useState(ACTIVITIES[9].title);
  const [newMemberName, setNewMemberName] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [criteriaScores, setCriteriaScores] = useState<
    Record<RubricCriterion['id'], number>
  >({
    creativity: 16,
    logic: 16,
    clarity: 16,
    participation: 12,
    confidence: 12,
    time: 8,
  });
  const [studentJudge1, setStudentJudge1] = useState(80);
  const [studentJudge2, setStudentJudge2] = useState(80);
  const [facultyJudge, setFacultyJudge] = useState(80);
  const [judgeNotes, setJudgeNotes] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'scoreboard' | 'rosters' | 'history'>('scoreboard');

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? teams[0];
  const rubricTotal = Object.values(criteriaScores).reduce((sum, val) => sum + val, 0);

  const rankedTeams = [...teams]
    .map((team) => {
      const totalPoints = team.scores.reduce((s, r) => s + r.total, 0);
      const avgPoints =
        team.scores.length > 0 ? Math.round(totalPoints / team.scores.length) : 0;
      const spokeCount = team.members.filter((m) => m.spokeCount > 0).length;
      return { team, totalPoints, avgPoints, spokeCount };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const totalLearners = teams.reduce((s, t) => s + t.members.length, 0);
  const totalSpoken = teams.reduce(
    (s, t) => s + t.members.filter((m) => m.spokeCount > 0).length,
    0
  );

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await onSeedTeams();
    } finally {
      setSeeding(false);
    }
  };

  const handleRecordScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !isAdmin) return;

    await onRecordScore(selectedTeam.id, {
      activityTitle: activityLabel,
      judgePanel: {
        studentJudge1,
        studentJudge2,
        facultyJudge,
      },
      criteria: { ...criteriaScores },
      total: rubricTotal,
      notes: judgeNotes.trim(),
    });
    setJudgeNotes('');
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !selectedTeam || !isAdmin) return;
    const role = TEAM_ROLES[selectedTeam.members.length % TEAM_ROLES.length];
    await onAddMember(selectedTeam.id, newMemberName.trim(), role);
    setNewMemberName('');
  };

  const handleExportReport = () => {
    const payload = {
      event: 'Picture Connect with Kapil — Championship Results',
      institution: 'JIET Universe, Jodhpur',
      exportedAt: new Date().toISOString(),
      participation: { totalLearners, totalSpoken },
      leaderboard: rankedTeams.map((r, i) => ({
        rank: i + 1,
        team: r.team.name,
        totalPoints: r.totalPoints,
        roundsScored: r.team.scores.length,
        avgScore: r.avgPoints,
        membersSpoken: `${r.spokeCount}/${r.team.members.length}`,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'picture-connect-championship.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (teams.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
          The Picture Connect Championship
        </h1>
        {isAdmin ? (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              Initialize the 10 official Championship teams (5–6 learners per team) in Firestore so the entire class can follow live standings.
            </p>
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeed}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
            >
              <Trophy className="w-4 h-4" />
              <span>{seeding ? 'Creating 10 Teams...' : 'Initialize 10 Championship Teams'}</span>
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Waiting for Kapil (Facilitator Admin) to initialize the 10 Championship teams. Live standings will appear here automatically.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Organising 50+ Students · 10 Teams · English Presentation · 100-Point Rubric
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
            The Picture Connect Championship
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isAdmin && (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Live Read-Only View (Facilitator Scores)</span>
            </div>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={onRotateAllSpeakers}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate All Speakers</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Results</span>
          </button>
        </div>
      </div>

      {/* Key Championship Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Active Teams</div>
          <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900 dark:text-white mt-1">
            {teams.length} Teams
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Shy-Student Inclusion</div>
          <div className="font-mono tabular-nums text-2xl font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
            {totalSpoken} / {totalLearners} Spoke
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Judge Panel</div>
          <div className="font-mono tabular-nums text-lg font-semibold text-slate-900 dark:text-white mt-1.5">
            2 Student + 1 Faculty
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">Leading Team</div>
          <div className="font-display font-semibold text-base text-blue-700 dark:text-blue-400 mt-1.5 truncate">
            {rankedTeams[0]?.totalPoints > 0 ? rankedTeams[0].team.name : 'Awaiting Round 1'}
          </div>
        </div>
      </div>

      {/* Sub-view Segmented Control */}
      <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800">
        {(
          [
            { id: 'scoreboard', label: '100-Point Judge Rubric & Leaderboard' },
            { id: 'rosters', label: 'Team Roles & Speaker Rotation' },
            { id: 'history', label: 'Round Score Log' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'scoreboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Live Judge Rubric Scorer (Facilitator Admin Only) */}
          <form
            onSubmit={handleRecordScore}
            className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                {isAdmin ? 'Score a Team (100 Marks)' : 'Official 100-Point Rubric'}
              </h2>
              <div className="font-mono tabular-nums text-2xl font-bold text-blue-700 dark:text-blue-400">
                {rubricTotal} / 100
              </div>
            </div>

            {isAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Team
                  </label>
                  <select
                    value={selectedTeam?.id}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Activity Scored
                  </label>
                  <select
                    value={activityLabel}
                    onChange={(e) => setActivityLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {ACTIVITIES.map((a) => (
                      <option key={a.number} value={a.title}>
                        Activity {a.number}: {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {RUBRIC_CRITERIA.map((criterion) => {
                const value = criteriaScores[criterion.id];
                return (
                  <div key={criterion.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {criterion.label}
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {isAdmin ? `${value} / ${criterion.maxMarks}` : `${criterion.maxMarks} Marks`}
                      </span>
                    </div>
                    {isAdmin && (
                      <input
                        type="range"
                        min={0}
                        max={criterion.maxMarks}
                        value={value}
                        onChange={(e) =>
                          setCriteriaScores((prev) => ({
                            ...prev,
                            [criterion.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full accent-blue-700 cursor-pointer"
                      />
                    )}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {criterion.guidance}
                    </div>
                  </div>
                );
              })}
            </div>

            {isAdmin && (
              <>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Student Judge 1
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={studentJudge1}
                      onChange={(e) => setStudentJudge1(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Student Judge 2
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={studentJudge2}
                      onChange={(e) => setStudentJudge2(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      Faculty Judge
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={facultyJudge}
                      onChange={(e) => setFacultyJudge(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono tabular-nums text-xs"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={400}
                  value={judgeNotes}
                  onChange={(e) => setJudgeNotes(e.target.value)}
                  placeholder="Optional judge feedback..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Record Score for {selectedTeam?.name}</span>
                </button>
              </>
            )}
          </form>

          {/* Right: Live Ranked Leaderboard */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                Championship Standings (10 Teams)
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Real-time Firestore sync
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-2 pr-2">Rank</th>
                    <th className="py-2 pr-2">Team</th>
                    <th className="py-2 pr-2 text-right">Spoke</th>
                    <th className="py-2 pr-2 text-right">Rounds</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {rankedTeams.map((row, idx) => (
                    <tr
                      key={row.team.id}
                      onClick={() => setSelectedTeamId(row.team.id)}
                      className={`cursor-pointer transition-colors ${
                        row.team.id === selectedTeam?.id
                          ? 'bg-blue-50/50 dark:bg-blue-950/25'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="py-2.5 pr-2 font-mono tabular-nums font-semibold text-slate-500">
                        #{String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 pr-2 font-semibold text-slate-900 dark:text-white">
                        {row.team.name}
                      </td>
                      <td className="py-2.5 pr-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {row.spokeCount}/{row.team.members.length}
                      </td>
                      <td className="py-2.5 pr-2 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {row.team.scores.length}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums font-bold text-slate-950 dark:text-white">
                        {row.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rosters' && selectedTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
              Select Team (5–6 learners each)
            </div>
            {teams.map((t) => {
              const active = t.id === selectedTeam.id;
              const spoke = t.members.filter((m) => m.spokeCount > 0).length;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTeamId(t.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    active
                      ? 'bg-blue-700 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="truncate font-semibold">{t.name}</span>
                  <span className={`font-mono tabular-nums ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                    {spoke}/{t.members.length} spoke
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {isAdmin ? (
                <input
                  type="text"
                  defaultValue={selectedTeam.name}
                  key={selectedTeam.id}
                  onBlur={(e) => {
                    if (e.target.value.trim() && e.target.value !== selectedTeam.name) {
                      onUpdateTeamName(selectedTeam.id, e.target.value);
                    }
                  }}
                  aria-label="Team name"
                  className="font-display text-xl font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-slate-950 dark:text-white"
                />
              ) : (
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  {selectedTeam.name}
                </h2>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Rule: Rotate the Speaker role in every activity so the same confident students do not dominate, ensuring even the shyest student speaks at least once.
            </p>

            <div className="space-y-2.5">
              {selectedTeam.members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                >
                  {isAdmin ? (
                    <input
                      type="text"
                      defaultValue={member.name}
                      key={`${member.id}-${member.name}`}
                      onBlur={(e) => {
                        if (e.target.value.trim() && e.target.value !== member.name) {
                          onUpdateMember(selectedTeam.id, member.id, {
                            name: e.target.value,
                          });
                        }
                      }}
                      className="font-medium text-sm bg-transparent border-b border-transparent focus:border-blue-600 focus:outline-none text-slate-900 dark:text-white"
                    />
                  ) : (
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {member.name}
                    </span>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    {isAdmin ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          onUpdateMember(selectedTeam.id, member.id, {
                            role: e.target.value as TeamRole,
                          })
                        }
                        className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                      >
                        {TEAM_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {member.role}
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={!isAdmin}
                      onClick={() =>
                        onUpdateMember(selectedTeam.id, member.id, {
                          spokeCount: member.spokeCount + 1,
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:cursor-default cursor-pointer ${
                        member.spokeCount > 0
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {member.spokeCount > 0 ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                      <span className="font-mono tabular-nums">
                        {member.spokeCount > 0 ? `Spoke (${member.spokeCount}x)` : 'Not Yet'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isAdmin && selectedTeam.members.length < 6 && (
              <form onSubmit={handleAddMemberSubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  maxLength={80}
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Add 6th learner name..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Learner</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
            Recorded Round Evaluations
          </h2>
          {teams.every((t) => t.scores.length === 0) ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No scores recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {teams.flatMap((team) =>
                team.scores.map((score) => (
                  <div
                    key={score.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {team.name} · {score.activityTitle} · {score.recordedAt}
                      </div>
                      <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 dark:text-white">
                        Total: {score.total} / 100 (Judges: S1 {score.judgePanel.studentJudge1}, S2 {score.judgePanel.studentJudge2}, Faculty {score.judgePanel.facultyJudge})
                      </div>
                      {score.notes && (
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {score.notes}
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeleteScore(team.id, score.id)}
                        aria-label="Delete score"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer self-start"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
