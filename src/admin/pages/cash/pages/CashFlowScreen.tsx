import { useState } from 'react';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { Popup } from '../../../../components/Popup';
import { useNavigate } from 'react-router-dom';
import { useCashFlow } from '../../../hooks/useCashFlow';

interface DayLedger {
  id: string;
  date: string;
  cashIn: number;
  cashOut: number;
  status: 'Open' | 'Frozen';
}

// Mock data — day ledgers are yet to be integrated with BE
const MOCK_DAY_LEDGERS: DayLedger[] = [
  { id: 'DL-001', date: '2025-12-28', cashIn: 85000, cashOut: 45000, status: 'Open' },
  { id: 'DL-002', date: '2025-12-27', cashIn: 120000, cashOut: 75000, status: 'Frozen' },
  { id: 'DL-003', date: '2025-12-26', cashIn: 95000, cashOut: 60000, status: 'Frozen' },
  { id: 'DL-004', date: '2025-12-25', cashIn: 110000, cashOut: 85000, status: 'Frozen' },
  { id: 'DL-005', date: '2025-12-24', cashIn: 78000, cashOut: 52000, status: 'Frozen' },
  { id: 'DL-006', date: '2025-12-23', cashIn: 135000, cashOut: 68000, status: 'Frozen' },
  { id: 'DL-007', date: '2025-12-22', cashIn: 92000, cashOut: 48000, status: 'Frozen' },
  { id: 'DL-008', date: '2025-12-21', cashIn: 105000, cashOut: 72000, status: 'Frozen' },
  { id: 'DL-009', date: '2025-12-20', cashIn: 88000, cashOut: 55000, status: 'Frozen' },
  { id: 'DL-010', date: '2025-12-19', cashIn: 115000, cashOut: 63000, status: 'Frozen' },
  { id: 'DL-011', date: '2025-12-18', cashIn: 98000, cashOut: 58000, status: 'Frozen' },
  { id: 'DL-012', date: '2025-12-17', cashIn: 125000, cashOut: 78000, status: 'Frozen' },
  { id: 'DL-013', date: '2025-12-16', cashIn: 82000, cashOut: 46000, status: 'Frozen' },
  { id: 'DL-014', date: '2025-12-15', cashIn: 108000, cashOut: 65000, status: 'Frozen' },
  { id: 'DL-015', date: '2025-12-14', cashIn: 95000, cashOut: 58000, status: 'Frozen' },
  { id: 'DL-016', date: '2025-12-13', cashIn: 118000, cashOut: 71000, status: 'Frozen' },
  { id: 'DL-017', date: '2025-12-12', cashIn: 87000, cashOut: 49000, status: 'Frozen' },
  { id: 'DL-018', date: '2025-12-11', cashIn: 102000, cashOut: 62000, status: 'Frozen' },
  { id: 'DL-019', date: '2025-12-10', cashIn: 93000, cashOut: 54000, status: 'Frozen' },
  { id: 'DL-020', date: '2025-12-09', cashIn: 112000, cashOut: 68000, status: 'Frozen' },
  { id: 'DL-021', date: '2025-12-08', cashIn: 99000, cashOut: 57000, status: 'Frozen' },
  { id: 'DL-022', date: '2025-12-07', cashIn: 128000, cashOut: 74000, status: 'Frozen' },
  { id: 'DL-023', date: '2025-12-06', cashIn: 85000, cashOut: 51000, status: 'Frozen' },
  { id: 'DL-024', date: '2025-12-05', cashIn: 107000, cashOut: 64000, status: 'Frozen' },
  { id: 'DL-025', date: '2025-12-04', cashIn: 96000, cashOut: 59000, status: 'Frozen' },
];

export function CashFlowScreen() {
  const navigate = useNavigate();
  const {
    // Accounts
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
  } = useCashFlow();

  const [showBypassErrorPopup, setShowBypassErrorPopup] = useState(false);
  const [bypassErrorMessage, setBypassErrorMessage] = useState('');
  const [dayLedgers] = useState<DayLedger[]>(MOCK_DAY_LEDGERS);
  const [displayCount, setDisplayCount] = useState(10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDayLedgerClick = (ledger: DayLedger) => {
    const sortedLedgers = [...dayLedgers].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const oldestOpenDay = sortedLedgers.find(l => l.status === 'Open');

    if (ledger.status === 'Open') {
      navigate(`/admin/cash/ledger/${ledger.id}`);
      return;
    }

    if (ledger.status === 'Frozen') {
      navigate(`/admin/cash/ledger/${ledger.id}`);
      return;
    }

    if (oldestOpenDay && new Date(ledger.date) > new Date(oldestOpenDay.date)) {
      setBypassErrorMessage(`Please complete and freeze the cash ledger for ${formatDate(oldestOpenDay.date)} before proceeding.`);
      setShowBypassErrorPopup(true);
      return;
    }

    navigate(`/admin/cash/ledger/${ledger.id}`);
  };

  const displayedLedgers = dayLedgers.slice(0, displayCount);
  const hasMore = displayCount < dayLedgers.length;
  const isLoading = accountsLoading || summaryLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Cash Flow Management</h1>
              <p className="text-gray-600 mt-1">Track cash and account balances</p>
            </div>
            <button
              onClick={openCreateAccountModal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Account
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Cash Balance */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm mb-2">Cash</p>
                <p className="text-gray-900 text-2xl">₹{cashBalance.toLocaleString()}</p>
              </div>

              {/* Dynamic Bank Account Cards */}
              {bankAccounts.map((account) => (
                <div key={account.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm mb-2">Account #{account.account_number}</p>
                  <p className="text-gray-900 text-2xl">₹{Number(account.balance).toLocaleString()}</p>
                </div>
              ))}

              {/* Outstanding Receivables */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 text-sm mb-2">Outstanding Receivables</p>
                <p className="text-gray-900 text-2xl">₹{outstandingReceivables.toLocaleString()}</p>
              </div>

              {/* Outstanding Payables (Vendor) */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <p className="text-gray-600 text-sm mb-2">Outstanding Payables (Vendor)</p>
                <p className="text-gray-900 text-2xl">₹{outstandingVendorPayables.toLocaleString()}</p>
              </div>

              {/* Outstanding Salary */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm mb-2">Outstanding Salary</p>
                <p className="text-gray-500 text-lg italic">Yet to integrate</p>
              </div>

              {/* Outstanding Loan Amount */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm mb-2">Outstanding Loan Amount</p>
                <p className="text-gray-900 text-2xl">₹{outstandingLoanAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Daily Cash Ledger Table */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-gray-900">Daily Cash Ledger</h2>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-gray-700">Cash In</th>
                        <th className="px-4 py-3 text-left text-gray-700">Cash Out</th>
                        <th className="px-4 py-3 text-left text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedLedgers.map((ledger) => (
                        <tr
                          key={ledger.id}
                          onClick={() => handleDayLedgerClick(ledger)}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-4 py-4 text-gray-900">{formatDate(ledger.date)}</td>
                          <td className="px-4 py-4 text-green-600">₹{ledger.cashIn.toLocaleString()}</td>
                          <td className="px-4 py-4 text-red-600">₹{ledger.cashOut.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                ledger.status === 'Open'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {ledger.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {hasMore && (
                <div className="p-6 text-center">
                  <button
                    onClick={() => setDisplayCount(displayCount + 10)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeCreateAccountModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-gray-900 mb-6">Create Account</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="accountNumber" className="block text-gray-700 mb-2">
                  Account Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  value={createAccountInput.account_number}
                  onChange={(e) => updateCreateAccountInput('account_number', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter account number"
                />
                {errors.account_number && (
                  <p className="text-red-600 text-sm mt-1">{errors.account_number}</p>
                )}
              </div>

              <div>
                <label htmlFor="openingBalance" className="block text-gray-700 mb-2">
                  Opening Balance <span className="text-red-600">*</span>
                </label>
                <input
                  id="openingBalance"
                  type="number"
                  value={createAccountInput.opening_balance}
                  onChange={(e) => updateCreateAccountInput('opening_balance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter opening balance"
                />
                {errors.opening_balance && (
                  <p className="text-red-600 text-sm mt-1">{errors.opening_balance}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  onClick={closeCreateAccountModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAccount}
                  disabled={createLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Success"
          message="Account created successfully"
          onClose={() => setShowSuccessPopup(false)}
          type="success"
        />
      )}

      {/* Failure Popup */}
      {showFailurePopup && (
        <Popup
          title="Error"
          message={failureMessage}
          onClose={() => setShowFailurePopup(false)}
        />
      )}

      {/* Bypass Error Popup */}
      {showBypassErrorPopup && (
        <Popup
          title="Cannot Proceed"
          message={bypassErrorMessage}
          onClose={() => setShowBypassErrorPopup(false)}
        />
      )}
    </div>
  );
}
