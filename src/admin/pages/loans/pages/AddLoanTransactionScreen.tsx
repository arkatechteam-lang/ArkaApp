import React from 'react';
import { AddLoanTransactionScreen as AddLoanTransactionScreenComponent } from '../../../../components/admin/AddLoanTransactionScreen';
import type { AdminScreen } from '../../../../AdminApp';
import { useAdminNavigation } from '../../../hooks/useAdminNavigation';
import { useParams } from 'react-router-dom';

export function AddLoanTransactionScreen() {
  const { goBack } = useAdminNavigation();
  const { loanId } = useParams<{ loanId: string }>();

  const handleNavigate = (screen: AdminScreen) => {
    switch (screen) {
      case 'loan-ledger':
        goBack(loanId ? `/admin/loans/ledger/${loanId}` : '/admin/loans');
        break;
      default:
        goBack(loanId ? `/admin/loans/ledger/${loanId}` : '/admin/loans');
        break;
    }
  };

  return <AddLoanTransactionScreenComponent onNavigate={handleNavigate} />;
}
