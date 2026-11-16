import { CapabilityCard } from './CapabilityCard.js';

export default function Activities() {
  return (
    <CapabilityCard
      title="Activities"
      description="Track student activity minutes and points."
      apiPath="/api/activities"
      dataKey="activities"
      emptyMessage="No activities recorded yet."
      renderData={(data) => (
        <ul className="list-unstyled">
          {(data as Array<{ type: string; minutes: number; points: number }>).map((activity, idx) => (
            <li key={idx} className="mb-2">
              <strong>{activity.type}</strong> — {activity.minutes} minutes ({activity.points} points)
            </li>
          ))}
        </ul>
      )}
    />
  );
}
