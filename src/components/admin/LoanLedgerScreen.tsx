import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Plus } from 'lucide-react';

interface LoanLedgerScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

interface LoanTransaction {
  id: string;
  date: string;
  transactionType: 'Disbursement' | 'Repayment' | 'Interest Payment';
  amount: number;
  runningBalance: number;
  modeOfPayment: string;
  sai: string;
  rai: string;
}

// Mock data
const MOCK_LOAN = {
  id: 'LOAN-001',
  lenderName: 'ABC Bank',
  loanType: 'Bank Loan',
  principalAmount: 1000000,
  outstandingBalance: 500000,
  status: 'Active',
};

const MOCK_TRANSACTIONS: LoanTransaction[] = [
  {
    id: 'LT-001',
    date: '2025-01-15',
    transactionType: 'Disbursement',
    amount: 1000000,
    runningBalance: 1000000,
    modeOfPayment: 'Bank Transfer',
    sai: 'ABC Bank - 9876',
    rai: '#3455332',
  },
  {
    id: 'LT-002',
    date: '2025-02-15',
    transactionType: 'Repayment',
    amount: 100000,
    runningBalance: 900000,
    modeOfPayment: 'Bank Transfer',
    sai: '#3455332',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-003',
    date: '2025-03-15',
    transactionType: 'Interest Payment',
    amount: 50000,
    runningBalance: 900000,
    modeOfPayment: 'UPI',
    sai: 'PhonePe - 9876543210',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-004',
    date: '2025-04-15',
    transactionType: 'Repayment',
    amount: 200000,
    runningBalance: 700000,
    modeOfPayment: 'Cheque',
    sai: 'SBI - Cheque #789456',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-005',
    date: '2025-05-15',
    transactionType: 'Interest Payment',
    amount: 45000,
    runningBalance: 700000,
    modeOfPayment: 'Bank Transfer',
    sai: '#7894561',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-006',
    date: '2025-06-15',
    transactionType: 'Repayment',
    amount: 200000,
    runningBalance: 500000,
    modeOfPayment: 'Bank Transfer',
    sai: '#3455332',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-007',
    date: '2025-07-15',
    transactionType: 'Interest Payment',
    amount: 40000,
    runningBalance: 500000,
    modeOfPayment: 'UPI',
    sai: 'GooglePay - 9876543210',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-008',
    date: '2025-08-15',
    transactionType: 'Repayment',
    amount: 150000,
    runningBalance: 350000,
    modeOfPayment: 'Bank Transfer',
    sai: '#3455332',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-009',
    date: '2025-09-15',
    transactionType: 'Interest Payment',
    amount: 35000,
    runningBalance: 350000,
    modeOfPayment: 'Cheque',
    sai: 'HDFC - Cheque #456123',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-010',
    date: '2025-10-15',
    transactionType: 'Repayment',
    amount: 100000,
    runningBalance: 250000,
    modeOfPayment: 'Bank Transfer',
    sai: '#7894561',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-011',
    date: '2025-11-15',
    transactionType: 'Interest Payment',
    amount: 30000,
    runningBalance: 250000,
    modeOfPayment: 'UPI',
    sai: 'Paytm - 9876543210',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-012',
    date: '2025-12-15',
    transactionType: 'Repayment',
    amount: 150000,
    runningBalance: 100000,
    modeOfPayment: 'Bank Transfer',
    sai: '#3455332',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-013',
    date: '2025-12-20',
    transactionType: 'Interest Payment',
    amount: 25000,
    runningBalance: 100000,
    modeOfPayment: 'Bank Transfer',
    sai: '#7894561',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-014',
    date: '2025-12-25',
    transactionType: 'Repayment',
    amount: 50000,
    runningBalance: 50000,
    modeOfPayment: 'UPI',
    sai: 'PhonePe - 9876543210',
    rai: 'ABC Bank - 9876',
  },
  {
    id: 'LT-015',
    date: '2025-12-27',
    transactionType: 'Repayment',
    amount: 50000,
    runningBalance: 0,
    modeOfPayment: 'Bank Transfer',
    sai: '#3455332',
    rai: 'ABC Bank - 9876',
  },
];

export function LoanLedgerScreen({ onNavigate }: LoanLedgerScreenProps) {
  const [transactions] = useState<LoanTransaction[]>(MOCK_TRANSACTIONS);
  const [displayCount, setDisplayCount] = useState(10);

  const displayedTransactions = transactions.slice(0, displayCount);
  const hasMore = displayCount < transactions.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'Disbursement':
        return 'bg-blue-100 text-blue-800';
      case 'Repayment':
        return 'bg-green-100 text-green-800';
      case 'Interest Payment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('loan-management')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Loan Management
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Loan Ledger - {MOCK_LOAN.lenderName}</h1>
              <p className="text-gray-600 mt-1">Transaction history and details</p>
            </div>
            <button
              onClick={() => onNavigate('add-loan-transaction')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Loan Details Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Loan Type</p>
              <p className="text-gray-900">{MOCK_LOAN.loanType}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Principal Amount</p>
              <p className="text-gray-900">₹{MOCK_LOAN.principalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Outstanding Balance</p>
              <p className={`${MOCK_LOAN.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{MOCK_LOAN.outstandingBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  MOCK_LOAN.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {MOCK_LOAN.status}
              </span>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Transaction History</h2>
          </div>

          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-600">No transactions found for this loan.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-gray-700">Transaction Type</th>
                        <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                        <th className="px-4 py-3 text-left text-gray-700">Running Loan Balance</th>
                        <th className="px-4 py-3 text-left text-gray-700">Mode of Payment</th>
                        <th className="px-4 py-3 text-left text-gray-700">SAI</th>
                        <th className="px-4 py-3 text-left text-gray-700">RAI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-gray-900">{formatDate(transaction.date)}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${getTransactionTypeColor(transaction.transactionType)}`}>
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-900">₹{transaction.amount.toLocaleString()}</td>
                          <td className="px-4 py-4 text-gray-900">₹{transaction.runningBalance.toLocaleString()}</td>
                          <td className="px-4 py-4 text-gray-900">{transaction.modeOfPayment}</td>
                          <td className="px-4 py-4 text-gray-900">{transaction.sai}</td>
                          <td className="px-4 py-4 text-gray-900">{transaction.rai}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setDisplayCount(displayCount + 10)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}