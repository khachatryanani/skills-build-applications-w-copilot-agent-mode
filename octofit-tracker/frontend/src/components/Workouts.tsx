import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

function useCapabilityData<T extends Record<string, unknown[]>>(apiPath: string, dataKey: keyof T) {
  const [data, setData] = useState<T[keyof T] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJson<T>(apiPath)
      .then((response) => {
        setData((response[dataKey] as T[keyof T]) || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load suggestions. Please try again later.');
        setLoading(false);
      });
  }, [apiPath, dataKey]);

  return { data, error, loading };
}

export default function Workouts() {
  const userEmail = 'mona@example.com';
  const { data, error, loading } = useCapabilityData<{ suggestions: Array<{ title: string; reason: string }> }>(
    `/api/workouts/suggestions/${userEmail}`,
    'suggestions'
  );

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Workout suggestions</h2>
        <p>Recommend workouts from activity patterns.</p>
        {loading && (
          <p role="status" aria-live="polite">
            Loading...
          </p>
        )}
        {error && (
          <div role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        {!loading && !error && (!data || data.length === 0) && <p>No workout suggestions available.</p>}
        {!loading && !error && data && data.length > 0 && (
          <ul className="list-unstyled">
            {(
              data as Array<{
                title: string;
                reason: string;
              }>
            ).map((suggestion, idx) => (
              <li key={idx} className="mb-2">
                <strong>{suggestion.title}</strong> — {suggestion.reason}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
