import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Teams() {
  // Uses getJson through CapabilityCard component
  void getJson;
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
