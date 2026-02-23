import { useEffect, useState } from 'react';
import { getInventoryStock, getInventoryStockForMaterial } from '../../services/middleware.service';

interface InventoryStockItem {
  material_id: string;
  quantity: number;
  updated_at: string;
  materials?: {
    id: string;
    name: string;
    unit: string;
  };
}

interface UseInventoryStockResult {
  stock: InventoryStockItem[];
  loading: boolean;
  error: string | null;
  showError: boolean;
  closeError: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all inventory stock
 */
export function useAllInventoryStock(): UseInventoryStockResult {
  const [stock, setStock] = useState<InventoryStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchStock = async () => {
    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      const stockData = await getInventoryStock();
      setStock(stockData);
    } catch (err) {
      console.error('Failed to fetch inventory stock', err);
      setError('Failed to load inventory stock. Please try again.');
      setShowError(true);
      setStock([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const closeError = () => {
    setShowError(false);
  };

  return {
    stock,
    loading,
    error,
    showError,
    closeError,
    refetch: fetchStock,
  };
}

/**
 * Hook to fetch inventory stock for a specific material
 */
export function useInventoryStockForMaterial(materialId: string | null): UseInventoryStockResult {
  const [stock, setStock] = useState<InventoryStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchStock = async () => {
    if (!materialId) {
      setStock([]);
      return;
    }

    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      const stockData = await getInventoryStockForMaterial(materialId);
      setStock(stockData ? [stockData] : []);
    } catch (err) {
      console.error('Failed to fetch inventory stock', err);
      setError('Failed to load inventory stock. Please try again.');
      setShowError(true);
      setStock([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [materialId]);

  const closeError = () => {
    setShowError(false);
  };

  return {
    stock,
    loading,
    error,
    showError,
    closeError,
    refetch: fetchStock,
  };
}
