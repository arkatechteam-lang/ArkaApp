import { useLocation, useNavigate } from 'react-router-dom';

export function useAdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigate forward and preserve current path as origin
   */
  const goTo = (path: string) => {
    navigate(path, {
      state: { from: location.pathname },
    });
  };

  /**
   * Go back to origin if available, else fallback
   */
  const goBack = (fallback = '/admin') => {
    const from = (location.state as any)?.from;
    navigate(from || fallback, { replace: true });
  };

  /**
   * Exit current flow (success / cancel)
   */
  const exitTo = (path: string) => {
    navigate(path, { replace: true });
  };

  return {
    goTo,
    goBack,
    exitTo,
    location,
  };
}
