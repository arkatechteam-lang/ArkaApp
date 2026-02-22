import { useState, useEffect } from 'react';
import { useAdminNavigation } from './useAdminNavigation';
import { getActiveEmployees, getInactiveEmployees, updateEmployeeStatus } from '../../services/middleware.service';
import type { EmployeeWithCategory } from '../../services/types';

type TabType = 'Active' | 'Inactive';

export function useEmployeeManagement() {
  const { goBack, goTo } = useAdminNavigation();

  const [activeTab, setActiveTab] = useState<TabType>('Active');
  const [activeEmployees, setActiveEmployees] = useState<EmployeeWithCategory[]>([]);
  const [inactiveEmployees, setInactiveEmployees] = useState<EmployeeWithCategory[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [inactivePage, setInactivePage] = useState(0);
  const [hasMoreActive, setHasMoreActive] = useState(false);
  const [hasMoreInactive, setHasMoreInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalActiveEmployees, setTotalActiveEmployees] = useState(0);
  const [totalInactiveEmployees, setTotalInactiveEmployees] = useState(0);

  // Track if we've fetched data for each tab to avoid unnecessary refetches
  const [hasInitializedActive, setHasInitializedActive] = useState(false);
  const [hasInitializedInactive, setHasInitializedInactive] = useState(false);

  const fetchActiveEmployees = async (currentPage: number, search: string) => {
    try {
      setLoading(true);
      const result = await getActiveEmployees(search, currentPage);
      
      if (currentPage === 0) {
        setActiveEmployees(result.data);
      } else {
        setActiveEmployees(prev => [...prev, ...result.data]);
      }
      
      setHasMoreActive(result.hasMore);
      setTotalActiveEmployees(result.total);
    } catch (err) {
      console.error('Failed to fetch active employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInactiveEmployees = async (currentPage: number, search: string) => {
    try {
      setLoading(true);
      const result = await getInactiveEmployees(search, currentPage);
      
      if (currentPage === 0) {
        setInactiveEmployees(result.data);
      } else {
        setInactiveEmployees(prev => [...prev, ...result.data]);
      }
      
      setHasMoreInactive(result.hasMore);
      setTotalInactiveEmployees(result.total);
    } catch (err) {
      console.error('Failed to fetch inactive employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data only for the current tab on mount and when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === 'Active') {
        fetchActiveEmployees(0, searchQuery);
        setActivePage(0);
      } else {
        fetchInactiveEmployees(0, searchQuery);
        setInactivePage(0);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  // Initialize both tabs on component mount to populate counts
  useEffect(() => {
    if (!hasInitializedActive) {
      fetchActiveEmployees(0, searchQuery);
      setHasInitializedActive(true);
    }
    if (!hasInitializedInactive) {
      fetchInactiveEmployees(0, searchQuery);
      setHasInitializedInactive(true);
    }
  }, []);

  const handleLoadMoreActive = () => {
    const nextPage = activePage + 1;
    setActivePage(nextPage);
    fetchActiveEmployees(nextPage, searchQuery);
  };

  const handleLoadMoreInactive = () => {
    const nextPage = inactivePage + 1;
    setInactivePage(nextPage);
    fetchInactiveEmployees(nextPage, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Initialize the tab data if not already fetched
    if (tab === 'Active' && !hasInitializedActive) {
      fetchActiveEmployees(0, searchQuery);
      setHasInitializedActive(true);
    } else if (tab === 'Inactive' && !hasInitializedInactive) {
      fetchInactiveEmployees(0, searchQuery);
      setHasInitializedInactive(true);
    }
  };

  const handleToggleEmployeeStatus = async (employeeId: string, newStatus: boolean) => {
    try {
      setLoading(true);
      await updateEmployeeStatus(employeeId, newStatus);
      
      // Refresh BOTH tabs since the employee moves from one tab to another
      // This ensures counts are updated accurately
      await fetchActiveEmployees(0, searchQuery);
      await fetchInactiveEmployees(0, searchQuery);
      setActivePage(0);
      setInactivePage(0);
    } catch (err) {
      console.error('Failed to update employee status:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTab,
    activeEmployees,
    inactiveEmployees,
    loading,
    hasMoreActive,
    hasMoreInactive,
    searchQuery,
    totalActiveEmployees,
    totalInactiveEmployees,
    handleSearchChange,
    handleTabChange,
    handleLoadMoreActive,
    handleLoadMoreInactive,
    handleToggleEmployeeStatus,
    goBack,
    goTo,
  };
}
