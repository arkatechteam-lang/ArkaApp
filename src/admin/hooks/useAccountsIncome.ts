import { useEffect, useState, useMemo } from 'react';
import { getOrdersByDateRange } from '../../services/middleware.service';
import type { Order } from '../../services/types';

type FilterType = 'Current Month' | 'Last month' | 'Last year' | 'Custom range';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface UseAccountsIncomeResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalIncome: number;
  showError: boolean;
  closeError: () => void;
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
  switch (filterType) {
    case 'Current Month':
      return getCurrentMonthRange();
    case 'Last month':
      return getLastMonthRange();
    case 'Last year':
      return getLastYearRange();
    case 'Custom range':
      if (!customStartDate || !customEndDate) {
        return getCurrentMonthRange(); // Fallback to current month
      }
      return {
        startDate: customStartDate,
        endDate: customEndDate,
      };
    default:
      return getCurrentMonthRange();
  }
}

/**
 * Hook to fetch and manage accounts income data
 * Fetches orders for a specific date range and calculates totals
 */
export function useAccountsIncome(
  filterType: FilterType,
  customStartDate?: string,
  customEndDate?: string
): UseAccountsIncomeResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setShowError(false);

        const dateRange = getDateRange(filterType, customStartDate, customEndDate);
        const data = await getOrdersByDateRange(dateRange.startDate, dateRange.endDate);

        if (mounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to load income orders:', err);
        if (mounted) {
          const errorMessage = (err as Error).message || 'Failed to load income data';
          setError(errorMessage);
          setShowError(true);
          setOrders([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [filterType, customStartDate, customEndDate]);

  // Calculate total income using final_price
  const totalIncome = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.final_price || 0), 0);
  }, [orders]);

  const closeError = () => {
    setShowError(false);
  };

  return {
    orders,
    loading,
    error,
    totalIncome,
    showError,
    closeError,
  };
}
