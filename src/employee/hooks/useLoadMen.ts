import { useEffect, useState } from "react";
import { fetchLoadMen } from "../services/loadMen.service";
import { LoadMan } from "../types";

export function useLoadMen() {
  const [loadMen, setLoadMen] = useState<LoadMan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoadMen()
      .then(setLoadMen)
      .catch(() => setError("Failed to load employees"))
      .finally(() => setLoading(false));
  }, []);

  return { loadMen, loading, error };
}
