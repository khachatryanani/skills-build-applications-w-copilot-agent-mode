import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

export default function Workouts() {
  const [data, setData] = useState<Array<{ title: string; reason: string }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const userEmail = 'mona@example.com';
    getJson<{ suggestions: Array<{ title: string; reason: string }> }>(`/api/workouts/suggestions/${userEmail}`)
      .then(response => {
        setData(response.suggestions || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Unable to load suggestions. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Workout suggestions</h2>
        <p>Recommend workouts from activity patterns.</p>
        {loading && <p role="status">Loading...</p>}
        {error && <div role="alert">{error}</div>}
        {!loading && !error && (!data || data.length === 0) && <p>No workout suggestions available.</p>}
        {!loading && !error && data && data.length > 0 && (
          <ul className="list-unstyled">
            {data.map((suggestion, idx) => (
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
