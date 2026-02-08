import React from 'react';
import { AddLoanTransactionScreen as AddLoanTransactionScreenComponent } from '../../../../components/admin/AddLoanTransactionScreen';
import type { AdminScreen } from '../../../../AdminApp';
import { useAdminNavigation } from '../../../hooks/useAdminNavigation';

export function AddLoanTransactionScreen() {
  const { goBack } = useAdminNavigation();

  const handleNavigate = (screen: AdminScreen) => {
    switch (screen) {
      case 'loan-ledger':
        goBack('/admin/loans/ledger');
        break;
      default:
        goBack('/admin/loans/ledger');
        break;
    }
  };

  return <AddLoanTransactionScreenComponent onNavigate={handleNavigate} />;
}
