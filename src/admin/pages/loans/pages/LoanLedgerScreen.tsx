import React from 'react';
import { LoanLedgerScreen as LoanLedgerScreenComponent } from '../../../../components/admin/LoanLedgerScreen';
import type { AdminScreen } from '../../../../AdminApp';
import { useAdminNavigation } from '../../../hooks/useAdminNavigation';

export function LoanLedgerScreen() {
  const { goTo, goBack } = useAdminNavigation();

  const handleNavigate = (screen: AdminScreen) => {
    switch (screen) {
      case 'loan-management':
        goBack('/admin/loans');
        break;
      case 'add-loan-transaction':
        goTo('/admin/loans/ledger/add-transaction');
        break;
      default:
        goBack('/admin/loans');
        break;
    }
  };

  return <LoanLedgerScreenComponent onNavigate={handleNavigate} />;
}
