import { useEffect, useState } from 'react';
import { getProductionEntries } from '../../services/middleware.service';

export interface ProductionEntryData {
  id: string;
  production_date: string;
  bricks: number;
  round: number;
  wet_ash_kg: number | null;
  marble_powder_kg: number | null;
  crusher_powder_kg: number | null;
  fly_ash_kg: number | null;
  cement_bags: number | null;
  created_by: string;
  created_at: string;
}

interface UseProductionEntriesResult {
  entries: ProductionEntryData[];
  loading: boolean;
  error: string | null;
  showError: boolean;
  closeError: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all production entries
 * Used for InventoryManagementScreen - Usage tab
 */
export function useProductionEntries(): UseProductionEntriesResult {
  const [entries, setEntries] = useState<ProductionEntryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      const entriesData = await getProductionEntries();
      setEntries(entriesData);
    } catch (err) {
      console.error('Failed to fetch production entries', err);
      setError('Failed to load production entries. Please try again.');
      setShowError(true);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const closeError = () => {
    setShowError(false);
  };

  return {
    entries,
    loading,
    error,
    showError,
    closeError,
    refetch: fetchEntries,
  };
}
