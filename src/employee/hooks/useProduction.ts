import { useState } from "react";
import { ProductionInput } from "../types";
import { createProductionEntry, validateSession } from "../../services/middleware.service";

export function useProduction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitProduction = async (payload: ProductionInput) => {
    try {
      setLoading(true);
      setError(null);

      const user = await validateSession()
      if(!user) throw new Error("User not authenticated");

      await createProductionEntry(payload, user.id);
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
