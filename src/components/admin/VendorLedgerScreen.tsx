import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { Popup } from '../Popup';

interface VendorLedgerScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

// Mock vendor details
const MOCK_VENDOR = {
  id: 'VEN-001',
  name: 'ABC Suppliers',
  phoneNumber: '9876543210',
  materialsSupplied: ['Wet Ash', 'Crusher Powder'],
  gstNumber: 'GST123456',
};

// Mock procurement data
const MOCK_PROCUREMENTS = [
  { id: 'PROC-001', date: '2025-12-15', material: 'Wet Ash', quantityValue: 5, quantityUnit: 'tons', rate: 10, amount: 50000, status: 'Completed', notes: 'Quality checked' },
  { id: 'PROC-002', date: '2025-12-10', material: 'Crusher Powder', quantityValue: 300, quantityUnit: 'units', rate: 15, amount: 45000, status: 'Completed', notes: '' },
  { id: 'PROC-003', date: '2025-12-05', material: 'Wet Ash', quantityValue: 4, quantityUnit: 'tons', rate: 10, amount: 40000, status: 'Completed', notes: '' },
  { id: 'PROC-004', date: '2025-11-28', material: 'Crusher Powder', quantityValue: 600, quantityUnit: 'units', rate: 15, amount: 90000, status: 'Completed', notes: 'Bulk order' },
  { id: 'PROC-005', date: '2025-11-20', material: 'Wet Ash', quantityValue: 5.5, quantityUnit: 'tons', rate: 10, amount: 55000, status: 'Completed', notes: '' },
];

// Mock payment data
const MOCK_PAYMENTS = [
  { id: 'PAY-001', date: '2025-12-18', amount: 50000, modeOfPayment: 'Bank Transfer', sai: 'HDFC Bank - 1234', rai: 'ICICI Bank - 5678', notes: 'Invoice #001 payment', createdAt: '2025-12-18 10:30 AM', createdBy: 'Admin User' },
  { id: 'PAY-002', date: '2025-12-12', amount: 45000, modeOfPayment: 'UPI', sai: 'PhonePe - 9876543210', rai: 'GPay - 9876543210', notes: '', createdAt: '2025-12-12 02:15 PM', createdBy: 'Admin User' },
  { id: 'PAY-003', date: '2025-12-08', amount: 40000, modeOfPayment: 'Cheque', sai: 'SBI - Cheque #123456', rai: 'PNB - 8901', notes: 'Cheque cleared', createdAt: '2025-12-08 11:00 AM', createdBy: 'Admin User' },
  { id: 'PAY-004', date: '2025-11-30', amount: 90000, modeOfPayment: 'Bank Transfer', sai: 'Axis Bank - 4567', rai: 'ICICI Bank - 5678', notes: 'Bulk payment', createdAt: '2025-11-30 09:45 AM', createdBy: 'Manager' },
  { id: 'PAY-005', date: '2025-11-25', amount: 30000, modeOfPayment: 'Cash', sai: 'Cash', rai: 'Cash', notes: '', createdAt: '2025-11-25 03:20 PM', createdBy: 'Admin User' },
];

type TabType = 'procurements' | 'payments';

export function VendorLedgerScreen({ onNavigate }: VendorLedgerScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('procurements');
  const [displayCount, setDisplayCount] = useState(20);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  
  // Export Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFromDate, setExportFromDate] = useState('');
  const [exportToDate, setExportToDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Image'>('PDF');
  const [exportFromDateError, setExportFromDateError] = useState('');
  const [exportToDateError, setExportToDateError] = useState('');
  const [showNoTransactionsPopup, setShowNoTransactionsPopup] = useState(false);
  const [showExportErrorPopup, setShowExportErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate totals
  const totalPurchase = MOCK_PROCUREMENTS.reduce((sum, p) => sum + p.amount, 0);
  const totalPayment = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = totalPurchase - totalPayment;

  // Filter and sort data
  const filterAndSortData = (data: any[]) => {
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return itemDate >= from && itemDate <= to;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  };

  const currentData = activeTab === 'procurements' 
    ? filterAndSortData(MOCK_PROCUREMENTS) 
    : filterAndSortData(MOCK_PAYMENTS);

  const displayedData = currentData.slice(0, displayCount);
  const hasMore = displayCount < currentData.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  const handleOpenExportModal = () => {
    setExportFromDate('');
    setExportToDate('');
    setExportFormat('PDF');
    setExportFromDateError('');
    setExportToDateError('');
    setShowExportModal(true);
  };
  
  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setExportFromDateError('');
    setExportToDateError('');
  };
  
  const handleDownloadExport = () => {
    // Clear previous errors
    setExportFromDateError('');
    setExportToDateError('');
    
    // Validate required fields
    let hasError = false;
    
    if (!exportFromDate) {
      setExportFromDateError('From date is required');
      hasError = true;
    }
    
    if (!exportToDate) {
      setExportToDateError('To date is required');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    // Filter procurements and payments within date range
    const fromDateObj = new Date(exportFromDate);
    const toDateObj = new Date(exportToDate);
    
    const procurementsInRange = MOCK_PROCUREMENTS.filter(proc => {
      const procDate = new Date(proc.date);
      return procDate >= fromDateObj && procDate <= toDateObj;
    });
    
    const paymentsInRange = MOCK_PAYMENTS.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= fromDateObj && paymentDate <= toDateObj;
    });
    
    // Check if transactions exist
    if (procurementsInRange.length === 0 && paymentsInRange.length === 0) {
      setShowExportModal(false);
      setShowNoTransactionsPopup(true);
      return;
    }
    
    // Simulate export generation
    try {
      // Calculate totals
      const totalProcurementAmount = procurementsInRange.reduce((sum, proc) => sum + proc.amount, 0);
      const totalPaymentAmount = paymentsInRange.reduce((sum, payment) => sum + payment.amount, 0);
      const closingBalance = outstandingBalance;
      
      // In a real app, this would generate a PDF or Image file
      console.log('Exporting vendor ledger:', {
        vendorName: MOCK_VENDOR.name,
        vendorPhone: MOCK_VENDOR.phoneNumber,
        materialsSupplied: MOCK_VENDOR.materialsSupplied,
        dateRange: `${exportFromDate} to ${exportToDate}`,
        openingBalance: outstandingBalance,
        procurements: procurementsInRange,
        payments: paymentsInRange,
        totalProcurementAmount,
        totalPaymentAmount,
        closingBalance,
        format: exportFormat
      });
      
      // Simulate successful download
      setSuccessMessage(`Vendor ledger exported successfully as ${exportFormat}`);
      setShowExportModal(false);
      setShowSuccessPopup(true);
    } catch (error) {
      setShowExportModal(false);
      setShowExportErrorPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('vendors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Vendors
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Vendor Ledger</h1>
              <p className="text-gray-600 mt-1">Transaction history for {MOCK_VENDOR.name}</p>
            </div>
            <button
              onClick={handleOpenExportModal}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Export
            </button>
          </div>
        </div>

        {/* Vendor Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Vendor Name</p>
              <p className="text-gray-900">{MOCK_VENDOR.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="text-gray-900">{MOCK_VENDOR.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Materials Supplied</p>
              <p className="text-gray-900">{MOCK_VENDOR.materialsSupplied.join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">GST Number</p>
              <p className="text-gray-900">{MOCK_VENDOR.gstNumber || '-'}</p>
            </div>
          </div>
        </div>

        {/* Summary Card with Add Payment Button */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              <div>
                <p className="text-gray-600 text-sm">Total Purchase</p>
                <p className="text-gray-900">
                  {totalPurchase === 0 ? 'No Purchase.' : `₹${totalPurchase.toLocaleString()}`}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Payment</p>
                <p className="text-gray-900">
                  {totalPayment === 0 ? 'No Payment.' : `₹${totalPayment.toLocaleString()}`}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Current Outstanding Balance</p>
                <p className={`${outstandingBalance === 0 ? 'text-gray-900' : outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {outstandingBalance === 0 ? 'No pending balance.' : `₹${outstandingBalance.toLocaleString()}`}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => onNavigate('vendor-payment')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab('procurements');
                  setDisplayCount(20);
                }}
                className={`flex-1 px-6 py-4 text-center transition-colors ${
                  activeTab === 'procurements'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Procurements
              </button>
              <button
                onClick={() => {
                  setActiveTab('payments');
                  setDisplayCount(20);
                }}
                className={`flex-1 px-6 py-4 text-center transition-colors ${
                  activeTab === 'payments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Payments
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setDisplayCount(20);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setDisplayCount(20);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Sort Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {currentData.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-600">
                  {displayedData.length === 0 && fromDate && toDate 
                    ? 'No transactions found for the selected date range.' 
                    : 'No transactions recorded for this vendor.'}
                </p>
              </div>
            ) : (
              <>
                {activeTab === 'procurements' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left text-gray-700">Procurement ID</th>
                          <th className="px-4 py-3 text-left text-gray-700">Material</th>
                          <th className="px-4 py-3 text-left text-gray-700">Quantity</th>
                          <th className="px-4 py-3 text-left text-gray-700">Rate</th>
                          <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                          <th className="px-4 py-3 text-left text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-gray-700">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {displayedData.map((proc: any) => (
                          <tr key={proc.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-gray-900">{formatDate(proc.date)}</td>
                            <td className="px-4 py-4 text-gray-900">{proc.id}</td>
                            <td className="px-4 py-4 text-gray-900">{proc.material}</td>
                            <td className="px-4 py-4 text-gray-900">{proc.quantityValue.toLocaleString()} {proc.quantityUnit}</td>
                            <td className="px-4 py-4 text-gray-900">₹{proc.rate}</td>
                            <td className="px-4 py-4 text-gray-900">₹{proc.amount.toLocaleString()}</td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {proc.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-gray-900">{proc.notes || '-'}</td>
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
                          <th className="px-4 py-3 text-left text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                          <th className="px-4 py-3 text-left text-gray-700">Mode of Payment</th>
                          <th className="px-4 py-3 text-left text-gray-700">SAI</th>
                          <th className="px-4 py-3 text-left text-gray-700">RAI</th>
                          <th className="px-4 py-3 text-left text-gray-700">Notes</th>
                          <th className="px-4 py-3 text-left text-gray-700">Created At</th>
                          <th className="px-4 py-3 text-left text-gray-700">Created By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {displayedData.map((pay: any) => (
                          <tr key={pay.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-gray-900">{formatDate(pay.date)}</td>
                            <td className="px-4 py-4 text-gray-900">₹{pay.amount.toLocaleString()}</td>
                            <td className="px-4 py-4 text-gray-900">{pay.modeOfPayment}</td>
                            <td className="px-4 py-4 text-gray-900">{pay.sai}</td>
                            <td className="px-4 py-4 text-gray-900">{pay.rai}</td>
                            <td className="px-4 py-4 text-gray-900">{pay.notes || '-'}</td>
                            <td className="px-4 py-4 text-gray-900">{pay.createdAt}</td>
                            <td className="px-4 py-4 text-gray-900">{pay.createdBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setDisplayCount(displayCount + 20)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

      {/* Popup */}
      {showPopup && (
        <Popup
          title="Error"
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          type="error"
        />
      )}
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Icon */}
            <button
              onClick={handleCloseExportModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-gray-900 mb-6">Export Vendor Ledger</h2>

            <div className="space-y-4">
              {/* From Date */}
              <div>
                <label htmlFor="exportFromDate" className="block text-gray-700 mb-2">
                  From Date <span className="text-red-600">*</span>
                </label>
                <input
                  id="exportFromDate"
                  type="date"
                  value={exportFromDate}
                  onChange={(e) => setExportFromDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {exportFromDateError && (
                  <p className="text-red-600 text-sm mt-1">{exportFromDateError}</p>
                )}
              </div>

              {/* To Date */}
              <div>
                <label htmlFor="exportToDate" className="block text-gray-700 mb-2">
                  To Date <span className="text-red-600">*</span>
                </label>
                <input
                  id="exportToDate"
                  type="date"
                  value={exportToDate}
                  onChange={(e) => setExportToDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {exportToDateError && (
                  <p className="text-red-600 text-sm mt-1">{exportToDateError}</p>
                )}
              </div>

              {/* Export Format */}
              <div>
                <label htmlFor="exportFormat" className="block text-gray-700 mb-2">
                  Export Format <span className="text-red-600">*</span>
                </label>
                <select
                  id="exportFormat"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'PDF' | 'Image')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="PDF">PDF</option>
                  <option value="Image">Image</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  onClick={handleCloseExportModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadExport}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download
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
          message={successMessage}
          onClose={() => setShowSuccessPopup(false)}
          type="success"
        />
      )}
      
      {/* No Transactions Popup */}
      {showNoTransactionsPopup && (
        <Popup
          title="No Transactions Found"
          message="No transactions found for the selected date range."
          onClose={() => setShowNoTransactionsPopup(false)}
        />
      )}
      
      {/* Export Error Popup */}
      {showExportErrorPopup && (
        <Popup
          title="Export Failed"
          message="Unable to export vendor ledger. Please try again."
          onClose={() => setShowExportErrorPopup(false)}
        />
      )}
    </div>
  );
}