import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Popup } from '../../../../components/Popup';
import { useLoanManagement } from '../../../hooks/useLoanManagement';

export function LoanManagementScreen() {
  const {
    loans,
    loading,
    showFailurePopup,
    errorMessage,
    getStatusLabel,
    getStatusColor,
    getLoanTypeLabel,
    getLoanTypeColor,
    handleBackToHome,
    handleCreateLoan,
    handleOpenLedger,
    handleFailureClose,
  } = useLoanManagement();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Loan Management</h1>
              <p className="text-gray-600 mt-1">Manage borrowed funds and repayments</p>
            </div>
            <button
              onClick={handleCreateLoan}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Loan
            </button>
          </div>
        </div>

        {/* Loan Cards Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Loading loans...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No loans found. Create a new loan to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${getLoanTypeColor(loan.loan_type)} p-4`}>
                  <h3 className="text-white">{loan.lender_name}</h3>
                  <p className="text-white text-sm opacity-90 mt-1">{getLoanTypeLabel(loan.loan_type)}</p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">Principal Amount</p>
                      <p className="text-gray-900 text-xl">₹{loan.principal_amount.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Outstanding Balance</p>
                      <p className={`text-xl ${loan.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{loan.outstanding_balance.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-2">Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(loan.status)}`}>
                        {getStatusLabel(loan.status)}
                      </span>
                    </div>
                  </div>

                  {/* Open Ledger Button */}
                  <button
                    onClick={() => handleOpenLedger(loan.id)}
                    className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Ledger
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Failure Popup */}
      {showFailurePopup && (
        <Popup
          title="Failed to load loans"
          message={errorMessage || 'Failed to load loans. Please try again.'}
          onClose={handleFailureClose}
          type="error"
        />
      )}
    </div>
  );
}
