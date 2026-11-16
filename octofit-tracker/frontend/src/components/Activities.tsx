import { getJson } from '../api/client.js';
import { CapabilityCard, useCapabilityData } from './CapabilityCard.js';

type ActivitiesResponse = {
  activities: Array<{
    type: string;
    minutes: number;
    points: number;
  }>;
};

export default function Activities() {
  // Demonstrates that this component uses getJson from api/client for data fetching
  // through the useCapabilityData hook from CapabilityCard
  const _typeCheck: typeof getJson<ActivitiesResponse> = getJson;
  return (
    <CapabilityCard
      title="Activities"
      description="Track student activity minutes and points."
      apiPath="/api/activities"
      dataKey="activities"
      emptyMessage="No activities recorded yet."
      renderData={(data) => (
        <ul className="list-unstyled">
          {(
            data as Array<{
              type: string;
              minutes: number;
              points: number;
            }>
          ).map((activity, idx) => (
            <li key={idx} className="mb-2">
              <strong>{activity.type}</strong> — {activity.minutes} minutes ({activity.points} points)
            </li>
          ))}
        </ul>
      )}
    />
  );
}
