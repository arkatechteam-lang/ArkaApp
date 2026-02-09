import type { CreateLoanLedgerInput } from '../../services/types';

export function validateAddLoanTransaction(
  input: Omit<CreateLoanLedgerInput, 'loan_id'>,
  outstandingBalance?: number
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Amount validation
  if (!input.amount || input.amount <= 0) {
    errors.amount = 'Amount must be a valid positive number';
  } else if (
    input.transaction_type === 'REPAYMENT' &&
    outstandingBalance !== undefined &&
    input.amount > outstandingBalance
  ) {
    errors.amount = `Repayment amount cannot exceed outstanding balance of ₹${outstandingBalance.toLocaleString()}`;
  }

  // Transaction date validation
  if (!input.transaction_date) {
    errors.transaction_date = 'Transaction date is required';
  }

  // SAI and RAI validation (mandatory when mode of payment is not Cash)
  if (input.payment_mode !== 'CASH') {
    if (!input.sender_account_id || !input.sender_account_id.trim()) {
      errors.sender_account_id = 'Sender Account Info is required when payment mode is not Cash';
    }
    if (!input.receiver_account_info || !input.receiver_account_info.trim()) {
      errors.receiver_account_info = 'Receiver Account Info is required when payment mode is not Cash';
    }
  }

  return errors;
}
