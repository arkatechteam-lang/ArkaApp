import { useEffect, useState, useCallback } from 'react';
import {
  getAccounts,
  createAccount,
  getTotalOutstandingReceivables,
  getTotalOutstandingVendorPayables,
  getTotalOutstandingLoanAmount,
  CASH_ACCOUNT_ID,
} from '../../services/middleware.service';
import type { Account, CreateAccountInput } from '../../services/types';
import { useAdminNavigation } from './useAdminNavigation';
import { validateCreateAccount } from '../validators/createAccount.validator';

export function useCashFlow() {
  const { goBack, goTo } = useAdminNavigation();

  // ─── Accounts ───
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  // ─── Outstanding summary values ───
  const [outstandingReceivables, setOutstandingReceivables] = useState<number>(0);
  const [outstandingVendorPayables, setOutstandingVendorPayables] = useState<number>(0);
  const [outstandingLoanAmount, setOutstandingLoanAmount] = useState<number>(0);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // ─── Create account form ───
  const [createAccountInput, setCreateAccountInput] = useState({
    account_number: '',
    opening_balance: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // ─── Popups ───
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [failureMessage, setFailureMessage] = useState('');

  // ─── Derived values ───
  const cashAccount = accounts.find((a) => a.id === CASH_ACCOUNT_ID);
  const cashBalance = cashAccount ? Number(cashAccount.balance) : 0;
  const bankAccounts = accounts.filter((a) => a.id !== CASH_ACCOUNT_ID);

  // ─── Fetch accounts ───
  const fetchAccounts = useCallback(async () => {
    try {
      setAccountsLoading(true);
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
  console.error('Failed to load accounts:', err);
  setFailureMessage((err as Error).message || 'Failed to load accounts');
  setShowFailurePopup(true);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  // ─── Fetch outstanding summaries ───
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const [receivables, vendorPayables, loanAmount] = await Promise.all([
        getTotalOutstandingReceivables(),
        getTotalOutstandingVendorPayables(),
        getTotalOutstandingLoanAmount(),
      ]);
      setOutstandingReceivables(receivables);
      setOutstandingVendorPayables(vendorPayables);
      setOutstandingLoanAmount(loanAmount);
      if (receivables === 0 && vendorPayables === 0 && loanAmount === 0) {
        console.warn('All outstanding summaries are zero — check DB/views or network responses');
      }
    } catch (err) {
  console.error('Failed to load outstanding summaries:', err);
  setFailureMessage((err as Error).message || 'Failed to load summaries');
  setShowFailurePopup(true);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ─── Load on mount ───
  useEffect(() => {
    fetchAccounts();
    fetchSummary();
  }, [fetchAccounts, fetchSummary]);

  // ─── Create account form helpers ───
  const updateCreateAccountInput = (field: 'account_number' | 'opening_balance', value: string) => {
    setCreateAccountInput((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateAccountModal = () => {
    setCreateAccountInput({ account_number: '', opening_balance: '' });
    setErrors({});
    setShowCreateAccountModal(true);
  };

  const closeCreateAccountModal = () => {
    setShowCreateAccountModal(false);
    setErrors({});
  };

  const handleCreateAccount = async () => {
    const parsed: CreateAccountInput = {
      account_number: createAccountInput.account_number,
      opening_balance: createAccountInput.opening_balance === '' ? NaN : Number(createAccountInput.opening_balance),
    };
    const validationErrors = validateCreateAccount(parsed);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setCreateLoading(true);
      await createAccount({
        account_number: parsed.account_number.trim(),
        opening_balance: parsed.opening_balance,
      });
      setShowCreateAccountModal(false);
      setShowSuccessPopup(true);
      // Refresh accounts after creation
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to create account:', err);
      setFailureMessage((err as Error).message || 'Failed to create account');
      setShowFailurePopup(true);
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    // Accounts
    accounts,
    accountsLoading,
    cashBalance,
    bankAccounts,

    // Outstanding summaries
    outstandingReceivables,
    outstandingVendorPayables,
    outstandingLoanAmount,
    summaryLoading,

    // Create account
    createAccountInput,
    errors,
    showCreateAccountModal,
    createLoading,
    updateCreateAccountInput,
    openCreateAccountModal,
    closeCreateAccountModal,
    handleCreateAccount,

    // Popups
    showSuccessPopup,
    setShowSuccessPopup,
    showFailurePopup,
    setShowFailurePopup,
    failureMessage,

    // Navigation
    goBack,
    goTo,
  };
}
