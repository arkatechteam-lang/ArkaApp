import type { CreateAccountInput } from '../../services/types';

export function validateCreateAccount(input: CreateAccountInput): Record<string, string> {
  const errors: Record<string, string> = {};

  // Account Number validation
  if (!input.account_number.trim()) {
    errors.account_number = 'Account number is required';
  }

  // Opening Balance validation
  if (
    input.opening_balance === null ||
    input.opening_balance === undefined ||
    isNaN(Number(input.opening_balance))
  ) {
    errors.opening_balance = 'Opening balance is required';
  } else if (Number(input.opening_balance) < 0) {
    errors.opening_balance = 'Opening balance must be a valid non-negative number';
  }

  return errors;
}
