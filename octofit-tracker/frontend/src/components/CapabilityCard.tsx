import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

export function useCapabilityData<T extends Record<string, unknown[]>>(
  apiPath: string,
  dataKey: keyof T
) {
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
        setError('Unable to load data. Please try again later.');
        setLoading(false);
      });
  }, [apiPath, dataKey]);

  return { data, error, loading };
}

type Props = {
  title: string;
  description: string;
  apiPath: string;
  dataKey: string;
  emptyMessage: string;
  renderData: (data: unknown[]) => React.ReactNode;
};

export function CapabilityCard({ title, description, apiPath, dataKey, emptyMessage, renderData }: Props) {
  const { data, error, loading } = useCapabilityData<Record<string, unknown[]>>(apiPath, dataKey);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
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
        {!loading && !error && (!data || data.length === 0) && <p>{emptyMessage}</p>}
        {!loading && !error && data && data.length > 0 && renderData(data)}
      </div>
    </section>
  );
}
