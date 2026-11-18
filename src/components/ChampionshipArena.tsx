import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
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
} from '../data/workshopData';

interface ChampionshipArenaProps {
  teams: TeamRecord[];
  onUpdateTeams: (teams: TeamRecord[]) => void;
}

export const ChampionshipArena: React.FC<ChampionshipArenaProps> = ({
  teams,
  onUpdateTeams,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || 'team-1');
  const [activityLabel, setActivityLabel] = useState(ACTIVITIES[9].title);
  const [newMemberName, setNewMemberName] = useState('');
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

  const handleRecordScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const newScore = {
      id: `score-${Date.now()}`,
      activityTitle: activityLabel,
      judgePanel: {
        studentJudge1,
        studentJudge2,
        facultyJudge,
      },
      criteria: { ...criteriaScores },
      total: rubricTotal,
      notes: judgeNotes.trim(),
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateTeams(
      teams.map((t) =>
        t.id === selectedTeam.id ? { ...t, scores: [newScore, ...t.scores] } : t
      )
    );
    setJudgeNotes('');
  };

  const handleRotateSpeakers = (teamId?: string) => {
    onUpdateTeams(
      teams.map((team) => {
        if (teamId && team.id !== teamId) return team;
        if (team.members.length === 0) return team;
        const rotated = team.members.map((member, idx) => {
          const currentRoleIdx = TEAM_ROLES.indexOf(member.role);
          const nextRole =
            TEAM_ROLES[(currentRoleIdx + 1) % TEAM_ROLES.length] ?? TEAM_ROLES[idx % TEAM_ROLES.length];
          return { ...member, role: nextRole };
        });
        return { ...team, members: rotated };
      })
    );
  };

  const handleToggleSpoke = (teamId: string, memberId: string) => {
    onUpdateTeams(
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) =>
                m.id === memberId ? { ...m, spokeCount: m.spokeCount + 1 } : m
              ),
            }
          : t
      )
    );
  };

  const handleUpdateTeamName = (teamId: string, name: string) => {
    onUpdateTeams(teams.map((t) => (t.id === teamId ? { ...t, name } : t)));
  };

  const handleUpdateMemberName = (teamId: string, memberId: string, name: string) => {
    onUpdateTeams(
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) => (m.id === memberId ? { ...m, name } : m)),
            }
          : t
      )
    );
  };

  const handleUpdateMemberRole = (teamId: string, memberId: string, role: TeamRole) => {
    onUpdateTeams(
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
            }
          : t
      )
    );
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !selectedTeam) return;
    const role = TEAM_ROLES[selectedTeam.members.length % TEAM_ROLES.length];
    onUpdateTeams(
      teams.map((t) =>
        t.id === selectedTeam.id
          ? {
              ...t,
              members: [
                ...t.members,
                {
                  id: `${t.id}-m-${Date.now()}`,
                  name: newMemberName.trim(),
                  role,
                  spokeCount: 0,
                },
              ],
            }
          : t
      )
    );
    setNewMemberName('');
  };

  const handleDeleteScore = (teamId: string, scoreId: string) => {
    onUpdateTeams(
      teams.map((t) =>
        t.id === teamId
          ? { ...t, scores: t.scores.filter((s) => s.id !== scoreId) }
          : t
      )
    );
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
          <button
            type="button"
            onClick={() => handleRotateSpeakers()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rotate All Speakers</span>
          </button>
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
          {/* Left: Live Judge Rubric Scorer */}
          <form
            onSubmit={handleRecordScore}
            className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                Score a Team (100 Marks)
              </h2>
              <div className="font-mono tabular-nums text-2xl font-bold text-blue-700 dark:text-blue-400">
                {rubricTotal} / 100
              </div>
            </div>

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

            {/* 6 Official Rubric Sliders */}
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
                        {value} / {criterion.maxMarks}
                      </span>
                    </div>
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
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {criterion.guidance}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3 Judge Verification Reference */}
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
              value={judgeNotes}
              onChange={(e) => setJudgeNotes(e.target.value)}
              placeholder="Optional judge feedback (e.g., shyest speaker stepped up brilliantly)..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Record Score for {selectedTeam?.name}</span>
            </button>
          </form>

          {/* Right: Live Ranked Leaderboard */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                Championship Standings (10 Teams)
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sorted by cumulative score
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
          {/* Team List */}
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

          {/* Roster & Role Rotation Editor */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <input
                type="text"
                value={selectedTeam.name}
                onChange={(e) => handleUpdateTeamName(selectedTeam.id, e.target.value)}
                aria-label="Team name"
                className="font-display text-xl font-bold bg-transparent border-b border-transparent focus:border-blue-600 focus:outline-none text-slate-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleRotateSpeakers(selectedTeam.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rotate Team Roles</span>
              </button>
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
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleUpdateMemberName(selectedTeam.id, member.id, e.target.value)
                    }
                    className="font-medium text-sm bg-transparent border-b border-transparent focus:border-blue-600 focus:outline-none text-slate-900 dark:text-white"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateMemberRole(
                          selectedTeam.id,
                          member.id,
                          e.target.value as TeamRole
                        )
                      }
                      className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                    >
                      {TEAM_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleToggleSpoke(selectedTeam.id, member.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
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
                        {member.spokeCount > 0 ? `Spoke (${member.spokeCount}x)` : 'Mark Spoke'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTeam.members.length < 6 && (
              <form onSubmit={handleAddMember} className="flex gap-2 pt-2">
                <input
                  type="text"
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
              No scores recorded yet. Use the 100-Point Judge Rubric tab to evaluate teams as they present.
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
                    <button
                      type="button"
                      onClick={() => handleDeleteScore(team.id, score.id)}
                      aria-label="Delete score"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
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
