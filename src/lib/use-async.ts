import { useCallback, useEffect, useState } from "react";
import { isUnauthorized } from "./utils";

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fn()
      .then((value) => {
        if (!cancelled) setData(value);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setError("Unauthorized");
          return;
        }
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { data, loading, error, reload, setData };
}
