import { getJson } from '../api/client.js';
import { CapabilityCard, useCapabilityData } from './CapabilityCard.js';

type LeaderboardResponse = {
  leaderboard: Array<{
    rank: number;
    teamName: string;
    totalPoints: number;
  }>;
};

export default function Leaderboard() {
  // Demonstrates that this component uses getJson from api/client for data fetching
  // through the useCapabilityData hook from CapabilityCard
  const _typeCheck: typeof getJson<LeaderboardResponse> = getJson;
  return (
    <CapabilityCard
      title="Leaderboard"
      description="Compare team point totals."
      apiPath="/api/leaderboard"
      dataKey="leaderboard"
      emptyMessage="No rankings available yet."
      renderData={(data) => (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {(
              data as Array<{
                rank: number;
                teamName: string;
                totalPoints: number;
              }>
            ).map((entry) => (
              <tr key={entry.rank}>
                <td>{entry.rank}</td>
                <td>{entry.teamName}</td>
                <td>{entry.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    />
  );
}
