import { useEffect, useState } from 'react';
import { getProductionEntriesFromToday } from '../../services/middleware.service';

interface ProductionEntry {
  date: string;
  bricks: number;
  round: number;
  wetAshKg: number;
  marblePowderKg: number;
  crusherPowderKg: number;
  flyAshKg: number;
  cementBags: number;
}

const INITIAL_PAGE = 0;

export function useProductionEntries() {
  const [productionEntries, setProductionEntries] = useState<ProductionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // fetch specific page and optionally append
  async function fetchPage(p: number, append = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductionEntriesFromToday(p);
      const mapped: ProductionEntry[] = (res.data ?? []).map((d: any) => ({
        date: d.production_date,
        bricks: d.bricks,
        round: d.round,
        wetAshKg: d.wet_ash_kg ?? 0,
        marblePowderKg: d.marble_powder_kg ?? 0,
        crusherPowderKg: d.crusher_powder_kg ?? 0,
        flyAshKg: d.fly_ash_kg ?? 0,
        cementBags: d.cement_bags ?? 0,
      }));

      setHasMore(Boolean(res.hasMore));

      if (append) {
        setProductionEntries(prev => [...prev, ...mapped]);
      } else {
        setProductionEntries(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch production entries', err);
      setError('Failed to load production data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // initial load
  useEffect(() => {
    fetchPage(INITIAL_PAGE, false);
    setPage(INITIAL_PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    await fetchPage(nextPage, true);
    setPage(nextPage);
  };

  return { productionEntries, loading, loadMore, hasMore, error };
}
