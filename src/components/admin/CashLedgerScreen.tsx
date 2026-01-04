import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, X } from 'lucide-react';
import { Popup } from '../Popup';

interface CashLedgerScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

interface CashInEntry {
  id: string;
  date: string;
  sourceType: 'Customer Payment' | 'Loan Disbursement' | 'Owner Capital Injection';
  receiverType: string;
  amount: number;
}

interface CashOutEntry {
  id: string;
  time: string;
  paymentType: 'Vendor Payment' | 'Salary Payment' | 'Expense Payment' | 'Loan Repayment' | 'Interest Payment' | 'Owner Withdrawal' | 'Asset Purchase';
  senderType: string;
  amount: number;
}

// Mock data
const LEDGER_DATE = '2025-12-28';
const LEDGER_STATUS: 'Open' | 'Frozen' = 'Open';

const MOCK_CASH_IN: CashInEntry[] = [
  { id: 'CI-001', date: '28-Dec-2025', sourceType: 'Customer Payment', receiverType: 'Cash', amount: 50000 },
  { id: 'CI-002', date: '28-Dec-2025', sourceType: 'Customer Payment', receiverType: '#3455332', amount: 35000 },
];

const MOCK_CASH_OUT: CashOutEntry[] = [
  { id: 'CO-001', time: '10:30 AM', paymentType: 'Vendor Payment', senderType: 'Cash', amount: 25000 },
  { id: 'CO-002', time: '02:15 PM', paymentType: 'Salary Payment', senderType: '#3455332', amount: 20000 },
];

export function CashLedgerScreen({ onNavigate }: CashLedgerScreenProps) {
  const [activeTab, setActiveTab] = useState<'cash-in' | 'cash-out'>('cash-in');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(false);
  const [withdrawalType, setWithdrawalType] = useState('Cash');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalAmountError, setWithdrawalAmountError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock balances
  const totalOpeningBalance = 500000;
  const totalCashIn = 85000;
  const totalCashOut = 45000;
  const totalClosingBalance = totalOpeningBalance + totalCashIn - totalCashOut;

  const cashOpeningBalance = 125000;
  const cashCashIn = 50000;
  const cashCashOut = 25000;
  const cashClosingBalance = cashOpeningBalance + cashCashIn - cashCashOut;

  const acc1OpeningBalance = 250000;
  const acc1CashIn = 35000;
  const acc1CashOut = 20000;
  const acc1ClosingBalance = acc1OpeningBalance + acc1CashIn - acc1CashOut;

  const acc2OpeningBalance = 125000;
  const acc2CashIn = 0;
  const acc2CashOut = 0;
  const acc2ClosingBalance = acc2OpeningBalance + acc2CashIn - acc2CashOut;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleOpenWithdrawalModal = () => {
    setWithdrawalType('Cash');
    setWithdrawalAmount('');
    setWithdrawalReason('');
    setWithdrawalAmountError('');
    setShowWithdrawalModal(true);
  };

  const handleCloseWithdrawalModal = () => {
    setShowWithdrawalModal(false);
    setWithdrawalAmountError('');
  };

  const validateWithdrawal = () => {
    setWithdrawalAmountError('');

    if (!withdrawalAmount.trim()) {
      setWithdrawalAmountError('Amount is required');
      return false;
    }

    const amount = Number(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalAmountError('Amount must be a valid positive number');
      return false;
    }

    if (withdrawalType === 'Cash' && amount > cashClosingBalance) {
      setWithdrawalAmountError('Amount cannot exceed cash in hand');
      return false;
    }

    return true;
  };

  const handleSubmitWithdrawal = () => {
    if (validateWithdrawal()) {
      setSuccessMessage('Cash withdrawal recorded successfully');
      setShowWithdrawalModal(false);
      setShowSuccessPopup(true);
    }
  };

  const handleFreezeDay = () => {
    setShowFreezeConfirmation(false);
    setSuccessMessage('Cash ledger frozen successfully');
    setShowSuccessPopup(true);
    // Navigate back after short delay
    setTimeout(() => {
      onNavigate('cash-flow');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('cash-flow')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cash Flow
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Cash Ledger - {formatDate(LEDGER_DATE)}</h1>
              <p className="text-gray-600 mt-1">Daily cash flow tracking</p>
            </div>
            {LEDGER_STATUS === 'Open' && (
              <div className="flex gap-3">
                <button
                  onClick={handleOpenWithdrawalModal}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  Cash Withdrawal
                </button>
                <button
                  onClick={() => setShowFreezeConfirmation(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  Freeze Day
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-200">
            <h3 className="text-gray-700 mb-4">Total</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Opening Balance</span>
                <span className="text-gray-900">₹{totalOpeningBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash In</span>
                <span className="text-green-600">₹{totalCashIn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash Out</span>
                <span className="text-red-600">₹{totalCashOut.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="text-gray-900">Closing Balance</span>
                <span className="text-gray-900">₹{totalClosingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cash Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-700 mb-4">Cash</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Opening Balance</span>
                <span className="text-gray-900">₹{cashOpeningBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash In</span>
                <span className="text-green-600">₹{cashCashIn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash Out</span>
                <span className="text-red-600">₹{cashCashOut.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900">Closing Balance</span>
                <span className="text-gray-900">₹{cashClosingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Account 1 Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-700 mb-4">#3455332</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Opening Balance</span>
                <span className="text-gray-900">₹{acc1OpeningBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash In</span>
                <span className="text-green-600">₹{acc1CashIn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash Out</span>
                <span className="text-red-600">₹{acc1CashOut.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900">Closing Balance</span>
                <span className="text-gray-900">₹{acc1ClosingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Account 2 Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-700 mb-4">#7894561</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Opening Balance</span>
                <span className="text-gray-900">₹{acc2OpeningBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash In</span>
                <span className="text-green-600">₹{acc2CashIn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cash Out</span>
                <span className="text-red-600">₹{acc2CashOut.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900">Closing Balance</span>
                <span className="text-gray-900">₹{acc2ClosingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-700 mb-4">Status</h3>
            <div className="flex items-center justify-center h-full">
              <span
                className={`px-4 py-2 rounded-full text-lg ${
                  LEDGER_STATUS === 'Open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {LEDGER_STATUS}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('cash-in')}
                className={`flex-1 px-6 py-4 text-center transition-colors ${
                  activeTab === 'cash-in'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cash In
              </button>
              <button
                onClick={() => setActiveTab('cash-out')}
                className={`flex-1 px-6 py-4 text-center transition-colors ${
                  activeTab === 'cash-out'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cash Out
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'cash-in' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-gray-700">Source Type</th>
                      <th className="px-4 py-3 text-left text-gray-700">Receiver Type</th>
                      <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {MOCK_CASH_IN.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900">{entry.date}</td>
                        <td className="px-4 py-4 text-gray-900">{entry.sourceType}</td>
                        <td className="px-4 py-4 text-gray-900">{entry.receiverType}</td>
                        <td className="px-4 py-4 text-green-600">+₹{entry.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700">Time</th>
                      <th className="px-4 py-3 text-left text-gray-700">Payment Type</th>
                      <th className="px-4 py-3 text-left text-gray-700">Sender Type</th>
                      <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {MOCK_CASH_OUT.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900">{entry.time}</td>
                        <td className="px-4 py-4 text-gray-900">{entry.paymentType}</td>
                        <td className="px-4 py-4 text-gray-900">{entry.senderType}</td>
                        <td className="px-4 py-4 text-red-600">-₹{entry.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cash Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseWithdrawalModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-gray-900 mb-6">Cash Withdrawal</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="withdrawalDate" className="block text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="withdrawalDate"
                  type="text"
                  value={formatDate(LEDGER_DATE)}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="withdrawalType" className="block text-gray-700 mb-2">
                  Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="withdrawalType"
                  value={withdrawalType}
                  onChange={(e) => setWithdrawalType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="3455332">#3455332</option>
                  <option value="7894561">#7894561</option>
                </select>
              </div>

              <div>
                <label htmlFor="withdrawalAmount" className="block text-gray-700 mb-2">
                  Amount <span className="text-red-600">*</span>
                </label>
                <input
                  id="withdrawalAmount"
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter amount"
                />
                {withdrawalAmountError && (
                  <p className="text-red-600 text-sm mt-1">{withdrawalAmountError}</p>
                )}
              </div>

              <div>
                <label htmlFor="withdrawalReason" className="block text-gray-700 mb-2">
                  Reason <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <textarea
                  id="withdrawalReason"
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Enter reason for withdrawal"
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  onClick={handleCloseWithdrawalModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitWithdrawal}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Confirmation Modal */}
      {showFreezeConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">Freeze Day</h2>
            <p className="text-gray-700 mb-6">
              Do you want to permanently freeze the ledger for the day?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFreezeConfirmation(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleFreezeDay}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Success"
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
          type="success"
        />
      )}
    </div>
  );
}
