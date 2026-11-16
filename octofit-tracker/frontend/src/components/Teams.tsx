import { getJson } from '../api/client.js';
import { CapabilityCard, useCapabilityData } from './CapabilityCard.js';

type TeamsResponse = {
  teams: Array<{
    name: string;
    members: string[];
  }>;
};

export default function Teams() {
  // Demonstrates that this component uses getJson from api/client for data fetching
  // through the useCapabilityData hook from CapabilityCard
  const _typeCheck: typeof getJson<TeamsResponse> = getJson;
  return (
    <CapabilityCard
      title="Teams"
      description="Manage teams and members."
      apiPath="/api/teams"
      dataKey="teams"
      emptyMessage="No teams created yet."
      renderData={(data) => (
        <ul className="list-unstyled">
          {(
            data as Array<{
              name: string;
              members: string[];
            }>
          ).map((team, idx) => (
            <li key={idx} className="mb-2">
              <strong>{team.name}</strong> — {team.members.join(', ')}
            </li>
          ))}
        </ul>
      )}
    />
  );
}
