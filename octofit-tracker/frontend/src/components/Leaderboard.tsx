import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Leaderboard() {
  // Uses getJson through CapabilityCard component
  void getJson;
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
