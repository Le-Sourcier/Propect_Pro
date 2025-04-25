// Exemple React hook
import { useEffect, useState } from "react";

export function useJobSSE(jobId: string) {
  const [status, setStatus] = useState<string>();
  const [results, setResults] = useState<number>();

  useEffect(() => {
    const es = new EventSource(
      `${import.meta.env.VITE_API_URL}/job/${jobId}/events`
    );
    es.onmessage = (e) => {
      const { status: s, results: r } = JSON.parse(e.data);
      setStatus(s);
      if (r !== undefined) setResults(r);
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [jobId]);

  return { status, results };
}
