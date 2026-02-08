import { useEffect, useMemo, useState } from 'react';
import { getLoanById, getLoanLedger } from '../../services/middleware.service';
import type { Loan, LoanLedgerItem, LoanStatus, LoanTransactionType, PaginatedResult } from '../../services/types';
import { useAdminNavigation } from './useAdminNavigation';

const PAGE_START = 0;

export function useLoanLedger(loanId: string | undefined) {
  const { goTo, goBack } = useAdminNavigation();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loanLoading, setLoanLoading] = useState(false);

  const [transactions, setTransactions] = useState<LoanLedgerItem[]>([]);
  const [page, setPage] = useState(PAGE_START);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!loanId) return;

    let mounted = true;
    (async () => {
      try {
        setLoanLoading(true);
        const loanData = await getLoanById(loanId);
        if (!mounted) return;
        setLoan(loanData || null);
      } catch (err) {
        console.error('Failed to load loan details:', err);
      } finally {
        if (mounted) setLoanLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loanId]);

  useEffect(() => {
    if (!loanId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const result: PaginatedResult<LoanLedgerItem> = await getLoanLedger(loanId, PAGE_START);
        if (!mounted) return;
        setTransactions(result.data);
        setHasMore(result.hasMore);
        setPage(PAGE_START);
      } catch (err) {
        console.error('Failed to load loan ledger:', err);
        if (mounted) {
          setErrorMessage((err as Error).message || 'Failed to load loan ledger');
          setShowFailurePopup(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loanId]);

  const loadMore = async () => {
    if (!loanId || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const result = await getLoanLedger(loanId, nextPage);
      setTransactions(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more transactions:', err);
      setErrorMessage((err as Error).message || 'Failed to load more transactions');
      setShowFailurePopup(true);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleBackToLoans = () => {
    goBack('/admin/loans');
  };

  const handleAddTransaction = () => {
    if (!loanId) return;
    goTo(`/admin/loans/ledger/${loanId}/add-transaction`);
  };

  const handleFailureClose = () => {
    setShowFailurePopup(false);
  };

  const getStatusLabel = (status?: LoanStatus) =>
    status === 'ACTIVE' ? 'Active' : status === 'CLOSED' ? 'Closed' : 'Unknown';

  const getTransactionTypeLabel = (type: LoanTransactionType) => {
    switch (type) {
      case 'DISBURSEMENT':
        return 'Disbursement';
      case 'REPAYMENT':
        return 'Repayment';
      case 'INTEREST':
        return 'Interest Payment';
      default:
        return 'Transaction';
    }
  };

  const getTransactionTypeColor = (type: LoanTransactionType) => {
    switch (type) {
      case 'DISBURSEMENT':
        return 'bg-blue-100 text-blue-800';
      case 'REPAYMENT':
        return 'bg-green-100 text-green-800';
      case 'INTEREST':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedLoanType = useMemo(() => {
    if (!loan) return 'Loan';
    switch (loan.loan_type) {
      case 'OWNER':
        return 'Owner Loan';
      case 'BANK':
        return 'Bank Loan';
      case 'SHORT_TERM':
        return 'Short-term Borrowing';
      default:
        return 'Loan';
    }
  }, [loan]);

  return {
    loan,
    loanLoading,
    formattedLoanType,
    transactions,
    loading,
    hasMore,
    loadingMore,
    showFailurePopup,
    errorMessage,
    getStatusLabel,
    getTransactionTypeLabel,
    getTransactionTypeColor,
    handleBackToLoans,
    handleAddTransaction,
    handleFailureClose,
    loadMore,
  };
}
