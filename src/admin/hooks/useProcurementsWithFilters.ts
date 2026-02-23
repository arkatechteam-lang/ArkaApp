import { useEffect, useState } from 'react';
import { 
  getUnapprovedProcurements, 
  getUnapprovedProcurementCount,
  ProcurementWithDetails 
} from '../../services/middleware.service';

type FilterType = 'Current month' | 'Last month' | 'Last year' | 'Custom range';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface UseProcurementsWithFiltersResult {
  procurements: ProcurementWithDetails[];
  count: number;
  loading: boolean;
  error: string | null;
  showError: boolean;
  closeError: () => void;
  refetch?: () => Promise<void>;
}

/**
 * Calculate the start and end dates for Current Month filter
 * Current Month = 1st of current month to today
 */
function getCurrentMonthRange(): DateRange {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = today;

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Calculate the start and end dates for Last Month filter
 * Last Month = 1st to last day of previous month
 */
function getLastMonthRange(): DateRange {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of previous month

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Calculate the start and end dates for Last Year filter
 * Last Year = Jan 1 to Dec 31 of previous year
 */
function getLastYearRange(): DateRange {
  const today = new Date();
  const year = today.getFullYear();

  const startDate = new Date(year - 1, 0, 1); // Jan 1 of last year
  const endDate = new Date(year - 1, 11, 31); // Dec 31 of last year

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Get date range based on filter type
 */
function getDateRange(
  filterType: FilterType,
  customStartDate?: string,
  customEndDate?: string
): DateRange {
  if (filterType === 'Current month') {
    return getCurrentMonthRange();
  } else if (filterType === 'Last month') {
    return getLastMonthRange();
  } else if (filterType === 'Last year') {
    return getLastYearRange();
  } else if (filterType === 'Custom range') {
    return {
      startDate: customStartDate || getCurrentMonthRange().startDate,
      endDate: customEndDate || getCurrentMonthRange().endDate,
    };
  }
  return getCurrentMonthRange();
}

/**
 * Fetch all unapproved procurements (no date filter)
 * Used for UnapprovedProcurementsScreen - shows all unapproved entries
 */
export function useAllUnapprovedProcurements(): UseProcurementsWithFiltersResult {
  const [procurements, setProcurements] = useState<ProcurementWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchProcurements = async () => {
    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      const procurementsData = await getUnapprovedProcurements();
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
    count: 0, // Not used in unapproved screen
    loading,
    error,
    showError,
    closeError,
    refetch: fetchProcurements,
  };
}

/**
 * Fetch unapproved procurements count (no date filter)
 * Used for InventoryManagementScreen - count shows ALL unapproved procurements
 */
export function useProcurementsCountWithFilter(
  filterType?: FilterType,
  customStartDate?: string,
  customEndDate?: string
): UseProcurementsWithFiltersResult {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      setError(null);
      setShowError(false);

      try {
        // Fetch count of ALL unapproved procurements (no date filter)
        const countData = await getUnapprovedProcurementCount();
        setCount(countData);
      } catch (err) {
        console.error('Failed to fetch count', err);
        setError('Failed to load count. Please try again.');
        setShowError(true);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []); // Empty dependency array - count doesn't change with filter

  const closeError = () => {
    setShowError(false);
  };

  return {
    procurements: [],
    count,
    loading,
    error,
    showError,
    closeError,
  };
}

/**
 * Legacy hook - kept for backward compatibility
 * Fetches both procurements and count (no date filter)
 */
export function useProcurementsWithFilters(
  filterType?: FilterType,
  customStartDate?: string,
  customEndDate?: string
): UseProcurementsWithFiltersResult {
  const [procurements, setProcurements] = useState<ProcurementWithDetails[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setShowError(false);

      try {
        // Fetch count of ALL unapproved procurements (no date filter)
        const countData = await getUnapprovedProcurementCount();
        setCount(countData);
        setProcurements([]); // Don't fetch procurements with filter
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Failed to load data. Please try again.');
        setShowError(true);
        setProcurements([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array - no date filter dependency

  const closeError = () => {
    setShowError(false);
  };

  return {
    procurements,
    count,
    loading,
    error,
    showError,
    closeError,
  };
}
