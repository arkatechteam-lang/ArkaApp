import { useState, useEffect } from "react";
import { getAdjustments } from "../../services/middleware.service";

export interface AdjustmentData {
  id: string;
  adjustment_date: string;
  actual_bricks: number | null;
  actual_wet_ash_kg: number | null;
  actual_marble_powder_kg: number | null;
  actual_crusher_powder_kg: number | null;
  actual_fly_ash_kg: number | null;
  actual_cement_bags: number | null;
  adjusted_bricks: number | null;
  adjusted_wet_ash_kg: number | null;
  adjusted_marble_powder_kg: number | null;
  adjusted_crusher_powder_kg: number | null;
  adjusted_fly_ash_kg: number | null;
  adjusted_cement_bags: number | null;
  reason: string | null;
  created_by: string;
  created_at: string;
}

export function useAdjustments() {
  const [adjustments, setAdjustments] = useState<AdjustmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdjustments();
      setAdjustments(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch adjustments");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const closeError = () => setShowError(false);
  const refetch = () => fetchAdjustments();

  return {
    adjustments,
    loading,
    error,
    showError,
    closeError,
    refetch,
  };
}
