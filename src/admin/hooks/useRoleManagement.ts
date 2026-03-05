import { useState, useEffect } from 'react';
import { useAdminNavigation } from './useAdminNavigation';
import {
  getActiveRoles,
  getInactiveRoles,
  updateRoleStatus,
} from '../../services/middleware.service';
import type { Role } from '../../services/types';

type TabType = 'Active' | 'Inactive';

export function useRoleManagement() {
  const { goBack, goTo } = useAdminNavigation();

  const [activeTab, setActiveTab] = useState<TabType>('Active');
  const [activeRoles, setActiveRoles] = useState<Role[]>([]);
  const [inactiveRoles, setInactiveRoles] = useState<Role[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [inactivePage, setInactivePage] = useState(0);
  const [hasMoreActive, setHasMoreActive] = useState(false);
  const [hasMoreInactive, setHasMoreInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalActiveRoles, setTotalActiveRoles] = useState(0);
  const [totalInactiveRoles, setTotalInactiveRoles] = useState(0);

  // Track if we've fetched data for each tab to avoid unnecessary refetches
  const [hasInitializedActive, setHasInitializedActive] = useState(false);
  const [hasInitializedInactive, setHasInitializedInactive] = useState(false);

  const fetchActiveRoles = async (currentPage: number) => {
    try {
      setLoading(true);
      const result = await getActiveRoles(currentPage);

      if (currentPage === 0) {
        setActiveRoles(result.data);
      } else {
        setActiveRoles((prev) => [...prev, ...result.data]);
      }

      setHasMoreActive(result.hasMore);
      setTotalActiveRoles(result.total);
    } catch (err) {
      console.error('Failed to fetch active roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInactiveRoles = async (currentPage: number) => {
    try {
      setLoading(true);
      const result = await getInactiveRoles(currentPage);

      if (currentPage === 0) {
        setInactiveRoles(result.data);
      } else {
        setInactiveRoles((prev) => [...prev, ...result.data]);
      }

      setHasMoreInactive(result.hasMore);
      setTotalInactiveRoles(result.total);
    } catch (err) {
      console.error('Failed to fetch inactive roles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize both tabs on component mount to populate counts
  useEffect(() => {
    if (!hasInitializedActive) {
      fetchActiveRoles(0);
      setHasInitializedActive(true);
    }
    if (!hasInitializedInactive) {
      fetchInactiveRoles(0);
      setHasInitializedInactive(true);
    }
  }, []);

  const handleLoadMoreActive = () => {
    const nextPage = activePage + 1;
    setActivePage(nextPage);
    fetchActiveRoles(nextPage);
  };

  const handleLoadMoreInactive = () => {
    const nextPage = inactivePage + 1;
    setInactivePage(nextPage);
    fetchInactiveRoles(nextPage);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    if (tab === 'Active' && !hasInitializedActive) {
      fetchActiveRoles(0);
      setHasInitializedActive(true);
    } else if (tab === 'Inactive' && !hasInitializedInactive) {
      fetchInactiveRoles(0);
      setHasInitializedInactive(true);
    }
  };

  const handleToggleRoleStatus = async (roleId: string, newStatus: boolean) => {
    try {
      setLoading(true);
      await updateRoleStatus(roleId, newStatus);

      // Refresh both tabs since the role moves between them
      await fetchActiveRoles(0);
      await fetchInactiveRoles(0);
      setActivePage(0);
      setInactivePage(0);
    } catch (err) {
      console.error('Failed to update role status:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTab,
    activeRoles,
    inactiveRoles,
    loading,
    hasMoreActive,
    hasMoreInactive,
    totalActiveRoles,
    totalInactiveRoles,
    handleTabChange,
    handleLoadMoreActive,
    handleLoadMoreInactive,
    handleToggleRoleStatus,
    goBack,
    goTo,
  };
}
