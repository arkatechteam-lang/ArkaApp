import { useEffect, useState } from "react";
import {
  fetchVendors,
  createMaterialPurchase,
} from "../services/materialPurchase.service";
import { MaterialPurchaseInput, Vendor } from "../types";

export function useMaterialPurchase() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors()
      .then(setVendors)
      .catch(() => setError("Failed to load vendors"))
      .finally(() => setVendorsLoading(false));
  }, []);

  async function submitMaterialPurchase(input: MaterialPurchaseInput) {
    try {
      setLoading(true);
      setError(null);
      await createMaterialPurchase(input);
    } catch {
      setError("Failed to save material purchase");
      throw new Error();
    } finally {
      setLoading(false);
    }
  }

  return {
    vendors,
    vendorsLoading,
    submitMaterialPurchase,
    loading,
    error,
  };
}
