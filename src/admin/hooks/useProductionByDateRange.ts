import { useEffect, useState, useMemo } from 'react';
import { getProductionEntriesByDateRange } from '../../services/middleware.service';

type FilterType = 'Current Month' | 'Last month' | 'Last year' | 'Custom range';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ProductionEntry {
  id: string;
  production_date: string;
  bricks: number;
  round: number;
  wet_ash_kg: number;
  marble_powder_kg: number;
  crusher_powder_kg: number;
  fly_ash_kg: number;
  cement_bags: number;
  created_by: string;
  created_at: string;
}

interface ProductionTotals {
  totalBricks: number;
  totalRound: number;
  totalWetAshKg: number;
  totalMarblePowderKg: number;
  totalCrusherPowderKg: number;
  totalFlyAshKg: number;
  totalCementBags: number;
}

interface GraphDataPoint {
  date: string;
  bricks: number;
}

interface UseProductionByDateRangeResult {
  entries: ProductionEntry[];
  loading: boolean;
  error: string | null;
  totals: ProductionTotals;
  graphData: GraphDataPoint[];
}

function getCurrentMonthRange(): DateRange {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
}

function getLastMonthRange(): DateRange {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

function getLastYearRange(): DateRange {
  const year = new Date().getFullYear() - 1;
  return {
    startDate: new Date(year, 0, 1).toISOString().split('T')[0],
    endDate: new Date(year, 11, 31).toISOString().split('T')[0],
  };
}

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
        return getCurrentMonthRange();
      }
      return { startDate: customStartDate, endDate: customEndDate };
    default:
      return getCurrentMonthRange();
  }
}

function formatGraphLabel(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
}

/**
 * Hook to fetch production entries for a date range and compute totals + graph data.
 * Used in MetricsScreen — Production Performance section.
 */
export function useProductionByDateRange(
  filterType: FilterType,
  customStartDate?: string,
  customEndDate?: string
): UseProductionByDateRangeResult {
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const dateRange = getDateRange(filterType, customStartDate, customEndDate);
        const data = await getProductionEntriesByDateRange(dateRange.startDate, dateRange.endDate);

        if (mounted) {
          setEntries(data);
        }
      } catch (err) {
        console.error('Failed to load production entries:', err);
        if (mounted) {
          setError((err as Error).message || 'Failed to load production data');
          setEntries([]);
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

  // Aggregate totals across all entries in the range
  const totals = useMemo<ProductionTotals>(() => {
    return entries.reduce(
      (acc, e) => ({
        totalBricks: acc.totalBricks + (e.bricks ?? 0),
        totalRound: acc.totalRound + (e.round ?? 0),
        totalWetAshKg: acc.totalWetAshKg + (e.wet_ash_kg ?? 0),
        totalMarblePowderKg: acc.totalMarblePowderKg + (e.marble_powder_kg ?? 0),
        totalCrusherPowderKg: acc.totalCrusherPowderKg + (e.crusher_powder_kg ?? 0),
        totalFlyAshKg: acc.totalFlyAshKg + (e.fly_ash_kg ?? 0),
        totalCementBags: acc.totalCementBags + (e.cement_bags ?? 0),
      }),
      {
        totalBricks: 0,
        totalRound: 0,
        totalWetAshKg: 0,
        totalMarblePowderKg: 0,
        totalCrusherPowderKg: 0,
        totalFlyAshKg: 0,
        totalCementBags: 0,
      }
    );
  }, [entries]);

  // Build graph data: oldest → newest, up to 30 entries
  const graphData = useMemo<GraphDataPoint[]>(() => {
    return entries
      .slice(0, 30)
      .map((e) => ({
        date: formatGraphLabel(e.production_date),
        bricks: e.bricks ?? 0,
      }))
      .reverse(); // oldest first on x-axis
  }, [entries]);

  return {
    entries,
    loading,
    error,
    totals,
    graphData,
  };
}
