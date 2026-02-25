import { ArrowLeft } from 'lucide-react';
import { Popup } from '../../../../components/Popup';
import { useVendorPayment } from '../../../hooks/useVendorPayment';

export function VendorPaymentScreen() {
  const {
    vendorId,
    vendor,
    financials,
    accounts,
    cashAccount,
    lastTransactionDate,
    loading,
    formData,
    errors,
    submitting,
    showPopup,
    popupType,
    popupMessage,
    updateField,
    handleSubmit,
    handlePopupClose,
    goBack,
  } = useVendorPayment();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading vendor details...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Vendor not found</p>
      </div>
    );
  }

  const outstandingBalance = financials?.outstanding_balance ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goBack(`/admin/vendors/${vendorId}/ledger`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Vendor Ledger
          </button>
          
          <h1 className="text-gray-900">Add Vendor Payment</h1>
          <p className="text-gray-600 mt-1">Record payment for vendor</p>
        </div>

        {/* Vendor Details */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Vendor Name</p>
              <p className="text-gray-900">{vendor.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="text-gray-900">{vendor.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Current Outstanding Balance</p>
              <p className={outstandingBalance > 0 ? 'text-red-600' : 'text-gray-900'}>
                {outstandingBalance === 0
                  ? 'No pending balance.'
                  : `₹${outstandingBalance.toLocaleString()}`}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Last Transaction Date</p>
              <p className="text-gray-900">
                {lastTransactionDate
                  ? new Date(lastTransactionDate + 'T00:00:00').toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).replace(/ /g, '-')
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Payment Amount */}
            <div>
              <label className="block text-gray-700 mb-2">
                Payment Amount (₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={formData.paymentAmount}
                onChange={(e) => updateField('paymentAmount', e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter amount"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.paymentAmount && (
                <p className="text-red-600 text-sm mt-1">{errors.paymentAmount}</p>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-gray-700 mb-2">
                Payment Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => updateField('paymentDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.paymentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.paymentDate && (
                <p className="text-red-600 text-sm mt-1">{errors.paymentDate}</p>
              )}
            </div>

            {/* Mode of Payment */}
            <div>
              <label className="block text-gray-700 mb-2">
                Mode of Payment <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.modeOfPayment}
                onChange={(e) => updateField('modeOfPayment', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.modeOfPayment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
              {errors.modeOfPayment && (
                <p className="text-red-600 text-sm mt-1">{errors.modeOfPayment}</p>
              )}
            </div>

            {/* SAI — Sender Account */}
            <div>
              <label className="block text-gray-700 mb-2">
                SAI (Sender Account) <span className="text-red-600">*</span>
              </label>
              {formData.modeOfPayment === 'Cash' ? (
                <select
                  value={cashAccount?.id ?? ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option value={cashAccount?.id ?? ''}>
                    {cashAccount?.account_number ?? 'Cash'}
                  </option>
                </select>
              ) : (
                <select
                  value={formData.senderAccountId}
                  onChange={(e) => updateField('senderAccountId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.senderAccountId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_number}
                    </option>
                  ))}
                </select>
              )}
              {errors.senderAccountId && (
                <p className="text-red-600 text-sm mt-1">{errors.senderAccountId}</p>
              )}
            </div>

            {/* RAI — Receiver Account Info (only for non-Cash) */}
            {formData.modeOfPayment !== 'Cash' && (
              <div>
                <label className="block text-gray-700 mb-2">
                  RAI (Receiver Account Info) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receiverAccountInfo}
                  onChange={(e) => updateField('receiverAccountInfo', e.target.value)}
                  placeholder="Enter receiver account info"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.receiverAccountInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.receiverAccountInfo && (
                  <p className="text-red-600 text-sm mt-1">{errors.receiverAccountInfo}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => goBack(`/admin/vendors/${vendorId}/ledger`)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Popup
          title={popupType === 'success' ? 'Success' : 'Error'}
          message={popupMessage}
          onClose={handlePopupClose}
          type={popupType}
        />
      )}
    </div>
  );
}