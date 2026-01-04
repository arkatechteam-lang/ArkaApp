import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Plus, Filter, Info } from 'lucide-react';

interface SalaryLedgerDetailScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

interface LedgerEntry {
  id: string;
  date: string;
  time: string;
  type: 'Salary Auto-Entry' | 'Advance' | 'Weekly Payment' | 'Emergency Payment' | 'Partial Settlement' | 'Full Settlement' | 'Daily Payment';
  amount: number;
  runningBalance: number;
  notes?: string;
  modeOfPayment: string;
  senderAccountInfo: string;
  receiverAccountInfo: string;
  createdBy: string;
  createdAt: string;
}

const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  { id: 'LE-001', date: '2024-12-10', time: '14:30', type: 'Salary Auto-Entry', amount: 15000, runningBalance: 15000, notes: 'Monthly salary for December', modeOfPayment: 'Bank Transfer', senderAccountInfo: 'ABC Bank, Account No. 1234567890', receiverAccountInfo: 'XYZ Bank, Account No. 0987654321', createdBy: 'Admin', createdAt: '2024-12-10 14:30:00' },
  { id: 'LE-002', date: '2024-12-08', time: '10:15', type: 'Weekly Payment', amount: -5000, runningBalance: 0, notes: 'Weekly payout', modeOfPayment: 'Bank Transfer', senderAccountInfo: 'ABC Bank, Account No. 1234567890', receiverAccountInfo: 'XYZ Bank, Account No. 0987654321', createdBy: 'Admin', createdAt: '2024-12-08 10:15:00' },
  { id: 'LE-003', date: '2024-12-05', time: '16:45', type: 'Advance', amount: -2000, runningBalance: 5000, notes: 'Going to native', modeOfPayment: 'Bank Transfer', senderAccountInfo: 'ABC Bank, Account No. 1234567890', receiverAccountInfo: 'XYZ Bank, Account No. 0987654321', createdBy: 'Admin', createdAt: '2024-12-05 16:45:00' },
  { id: 'LE-004', date: '2024-12-01', time: '09:00', type: 'Salary Auto-Entry', amount: 15000, runningBalance: 7000, notes: 'Monthly salary for November', modeOfPayment: 'Bank Transfer', senderAccountInfo: 'ABC Bank, Account No. 1234567890', receiverAccountInfo: 'XYZ Bank, Account No. 0987654321', createdBy: 'System', createdAt: '2024-12-01 09:00:00' },
  { id: 'LE-005', date: '2024-11-28', time: '11:30', type: 'Emergency Payment', amount: -3000, runningBalance: -8000, notes: 'Medical need', modeOfPayment: 'Bank Transfer', senderAccountInfo: 'ABC Bank, Account No. 1234567890', receiverAccountInfo: 'XYZ Bank, Account No. 0987654321', createdBy: 'Admin', createdAt: '2024-11-28 11:30:00' },
];

export function SalaryLedgerDetailScreen({ onNavigate }: SalaryLedgerDetailScreenProps) {
  const [displayCount, setDisplayCount] = useState(20);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: '',
  });
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

  // Mock employee data
  const employee = {
    name: 'Ramesh Kumar',
    id: 'EMP-001',
    role: 'Production Supervisor',
    category: 'Fixed Salary',
    runningBalance: 15000,
  };

  const sortedEntries = [...MOCK_LEDGER_ENTRIES].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`).getTime();
    const dateB = new Date(`${b.date} ${b.time}`).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const displayedEntries = sortedEntries.slice(0, displayCount);
  const hasMore = displayCount < sortedEntries.length;

  const handleShowAudit = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
    setShowAuditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('salary-ledger')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Salary Ledger
          </button>
          <h1 className="text-gray-900">Salary Ledger Details</h1>
          <p className="text-gray-600 mt-1">Employee passbook and transaction history</p>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Employee Name</p>
              <p className="text-gray-900">{employee.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Employee ID</p>
              <p className="text-gray-900">{employee.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Role</p>
              <p className="text-gray-900">{employee.role}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Category</p>
              <span className="inline-block px-2 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                {employee.category}
              </span>
            </div>
          </div>
        </div>

        {/* Running Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Current Running Balance</p>
              <p className="text-3xl">{employee.runningBalance > 0 ? `₹${employee.runningBalance.toLocaleString()}` : 'No pending balance'}</p>
            </div>
            <button
              onClick={() => onNavigate('add-payment')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2">From Date</label>
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2">To Date</label>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ledger Entries */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-gray-900 mb-4">Transaction History</h2>
            
            {displayedEntries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No salary transactions recorded for this employee.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">Date & Time</th>
                        <th className="px-4 py-3 text-left text-gray-700">Type</th>
                        <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                        <th className="px-4 py-3 text-left text-gray-700">Running Balance</th>
                        <th className="px-4 py-3 text-left text-gray-700">Notes</th>
                        <th className="px-4 py-3 text-left text-gray-700">Mode of Payment</th>
                        <th className="px-4 py-3 text-left text-gray-700">SAI</th>
                        <th className="px-4 py-3 text-left text-gray-700">RAI</th>
                        <th className="px-4 py-3 text-left text-gray-700">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-gray-900">
                            {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {entry.time}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              entry.type.includes('Settlement') ? 'bg-green-100 text-green-800' :
                              entry.type.includes('Payment') || entry.type.includes('Advance') ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className={`px-4 py-4 ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.amount > 0 ? '+' : ''}₹{Math.abs(entry.amount).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-gray-900">₹{entry.runningBalance.toLocaleString()}</td>
                          <td className="px-4 py-4 text-gray-600 text-sm">{entry.notes || '-'}</td>
                          <td className="px-4 py-4 text-gray-900 text-sm">{entry.modeOfPayment}</td>
                          <td className="px-4 py-4 text-gray-600 text-sm">{entry.senderAccountInfo}</td>
                          <td className="px-4 py-4 text-gray-600 text-sm">{entry.receiverAccountInfo}</td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleShowAudit(entry)}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Audit Details"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                  {displayedEntries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-900 text-sm">
                            {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {entry.time}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                            entry.type.includes('Settlement') ? 'bg-green-100 text-green-800' :
                            entry.type.includes('Payment') || entry.type.includes('Advance') ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {entry.type}
                          </span>
                        </div>
                        <button
                          onClick={() => handleShowAudit(entry)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="View Audit Details"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className={entry.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                            {entry.amount > 0 ? '+' : ''}₹{Math.abs(entry.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Running Balance:</span>
                          <span className="text-gray-900">₹{entry.runningBalance.toLocaleString()}</span>
                        </div>
                        {entry.notes && (
                          <div>
                            <span className="text-gray-600">Notes: </span>
                            <span className="text-gray-900">{entry.notes}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Mode of Payment: </span>
                          <span className="text-gray-900">{entry.modeOfPayment}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">SAI: </span>
                          <span className="text-gray-900 text-xs">{entry.senderAccountInfo}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">RAI: </span>
                          <span className="text-gray-900 text-xs">{entry.receiverAccountInfo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setDisplayCount(displayCount + 20)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      {showAuditModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="flex flex-col">
              <h2 className="text-gray-900 mb-4">Audit Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Transaction ID</p>
                  <p className="text-gray-900">{selectedEntry.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Created At</p>
                  <p className="text-gray-900">{selectedEntry.createdAt}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Created By</p>
                  <p className="text-gray-900">{selectedEntry.createdBy}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Mode of Payment</p>
                  <p className="text-gray-900">{selectedEntry.modeOfPayment}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sender Account Info</p>
                  <p className="text-gray-900">{selectedEntry.senderAccountInfo}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Receiver Account Info</p>
                  <p className="text-gray-900">{selectedEntry.receiverAccountInfo}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}