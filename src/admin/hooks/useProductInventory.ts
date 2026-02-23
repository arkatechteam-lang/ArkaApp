import { useState, useEffect } from "react";
import { getProductInventory } from "../../services/middleware.service";

export interface ProductInventoryData {
  id: string;
  product_type: string;
  quantity: number;
  updated_at: string | null;
}

export function useProductInventory() {
  const [inventory, setInventory] = useState<ProductInventoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductInventory();
        setInventory(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product inventory");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const closeError = () => setShowError(false);

  return {
    inventory,
    loading,
    error,
    showError,
    closeError,
  };
}
