import { useEffect, useState } from 'react';
import { useAdminNavigation } from './useAdminNavigation';
import { validateCreateLoan } from '../validators/createLoan.validator';
import { createLoan, getAccounts } from '../../services/middleware.service';
import type { Account, CreateLoanInput } from '../../services/types';

export function useCreateLoan() {
  const { goBack } = useAdminNavigation();

  const [createLoanInput, setCreateLoanInput] = useState<CreateLoanInput>({
    lender_name: '',
    loan_type: 'BANK',
    principal_amount: 0,
    interest_rate: null,
    disbursement_account_id: null,
    start_date: '',
    notes: null,
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateCreateLoanInput(field: keyof CreateLoanInput, value: any) {
    setCreateLoanInput(prev => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setAccountsLoading(true);
        const data = await getAccounts();
        if (mounted) setAccounts(data);
      } catch (err) {
        console.error('Failed to load accounts:', err);
      } finally {
        if (mounted) setAccountsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const validateForm = () => {
    const newErrors = validateCreateLoan(createLoanInput);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      await createLoan({
        ...createLoanInput,
        interest_rate:
          createLoanInput.interest_rate === null || createLoanInput.interest_rate === undefined
            ? null
            : Number(createLoanInput.interest_rate),
        principal_amount: Number(createLoanInput.principal_amount),
        disbursement_account_id: createLoanInput.disbursement_account_id || null,
        notes: createLoanInput.notes?.trim() ? createLoanInput.notes : null,
      });

      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Failed to create loan:', err);
      setErrors(prev => ({ ...prev, form: (err as Error).message || 'Failed to create loan' }));
      setShowFailurePopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    goBack('/admin/loans');
  };

  const handleFailureClose = () => {
    setShowFailurePopup(false);
  };

  return {
    createLoanInput,
    updateCreateLoanInput,
    accounts,
    accountsLoading,
    errors,
    showSuccessPopup,
    showFailurePopup,
    loading,
    handleCreate,
    handleSuccessClose,
    handleFailureClose,
    goBack,
  };
}
