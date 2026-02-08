import { useEffect, useState } from 'react';
import { getLoans } from '../../services/middleware.service';
import type { Loan, LoanStatus, LoanType } from '../../services/types';
import { useAdminNavigation } from './useAdminNavigation';

export function useLoanManagement() {
  const { goTo, goBack } = useAdminNavigation();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getLoans();
        if (mounted) setLoans(data);
      } catch (err) {
        console.error('Failed to load loans:', err);
        if (mounted) {
          setErrorMessage((err as Error).message || 'Failed to load loans');
          setShowFailurePopup(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusLabel = (status: LoanStatus) =>
    status === 'ACTIVE' ? 'Active' : 'Closed';

  const getStatusColor = (status: LoanStatus) =>
    status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  const getLoanTypeLabel = (type: LoanType) => {
    switch (type) {
      case 'OWNER':
        return 'Owner Loan';
      case 'BANK':
        return 'Bank Loan';
      case 'SHORT_TERM':
        return 'Short-term Borrowing';
      default:
        return 'Loan';
    }
  };

  const getLoanTypeColor = (type: LoanType) => {
    switch (type) {
      case 'OWNER':
        return 'from-blue-500 to-blue-600';
      case 'BANK':
        return 'from-purple-500 to-purple-600';
      case 'SHORT_TERM':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleBackToHome = () => {
    goBack('/admin/home');
  };

  const handleCreateLoan = () => {
    goTo('/admin/loans/create');
  };

  const handleOpenLedger = (loanId: string) => {
    goTo(`/admin/loans/ledger?loanId=${loanId}`);
  };

  const handleFailureClose = () => {
    setShowFailurePopup(false);
  };

  return {
    loans,
    loading,
    showFailurePopup,
    errorMessage,
    getStatusLabel,
    getStatusColor,
    getLoanTypeLabel,
    getLoanTypeColor,
    handleBackToHome,
    handleCreateLoan,
    handleOpenLedger,
    handleFailureClose,
  };
}
