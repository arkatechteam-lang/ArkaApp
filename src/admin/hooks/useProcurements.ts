import { useEffect, useState } from 'react';
import { getProcurements } from '../../services/middleware.service';

export interface ProcurementData {
  id: string;
  material_id: string;
  vendor_id: string;
  quantity: number;
  rate_per_unit: number;
  total_price: number;
  date: string;
  approved: boolean;
  created_by: string;
  created_at: string;
  materials?: {
    id: string;
    name: string;
    unit: string;
  };
  vendors?: {
    id: string;
    name: string;
    phone: string | null;
  };
}

interface UseProcurementsResult {
  procurements: ProcurementData[];
  loading: boolean;
  error: string | null;
  showError: boolean;
  closeError: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all approved procurements
 * Used for InventoryManagementScreen - Procurement tab
 */
export function useProcurements(): UseProcurementsResult {
  const [procurements, setProcurements] = useState<ProcurementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchProcurements = async () => {
    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      const procurementsData = await getProcurements();
      setProcurements(procurementsData);
    } catch (err) {
      console.error('Failed to fetch procurements', err);
      setError('Failed to load procurements. Please try again.');
      setShowError(true);
      setProcurements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurements();
  }, []);

  const closeError = () => {
    setShowError(false);
  };

  return {
    procurements,
    loading,
    error,
    showError,
    closeError,
    refetch: fetchProcurements,
  };
}
