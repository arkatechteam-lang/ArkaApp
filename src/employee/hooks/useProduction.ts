import { useState } from "react";
import { ProductionInput } from "../types";
import { createProductionEntry } from "../services/production.service";

export function useProduction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitProduction = async (payload: ProductionInput) => {
    setLoading(true);
    setError(null);

    try {
      await createProductionEntry(payload);
    } catch (err:any) {
      setError("Failed to submit production entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitProduction,
    loading,
    error,
  };
}
