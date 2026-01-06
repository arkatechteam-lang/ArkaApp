import { useState } from "react";
import { createDelivery } from "../services/delivery.service";
import { DeliveryInput } from "../types";

export function useDelivery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitDelivery(input: DeliveryInput) {
    try {
      setLoading(true);
      setError(null);

      const result = await createDelivery(input);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    } catch (err) {
      setError("Failed to submit delivery");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    submitDelivery,
    loading,
    error,
  };
}
