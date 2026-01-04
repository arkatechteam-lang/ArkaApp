import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft } from 'lucide-react';
import { Popup } from '../Popup';

interface CreateLoanScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

export function CreateLoanScreen({ onNavigate }: CreateLoanScreenProps) {
  const [lenderName, setLenderName] = useState('');
  const [loanType, setLoanType] = useState<'Owner Loan' | 'Bank Loan' | 'Short-term Borrowing'>('Bank Loan');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [disbursementAccount, setDisbursementAccount] = useState('Cash');
  const [loanStartDate, setLoanStartDate] = useState('');
  const [notes, setNotes] = useState('');

  const [lenderNameError, setLenderNameError] = useState('');
  const [principalAmountError, setPrincipalAmountError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setLenderNameError('');
    setPrincipalAmountError('');

    if (!lenderName.trim()) {
      setLenderNameError('Lender name is required');
      isValid = false;
    }

    if (!principalAmount.trim()) {
      setPrincipalAmountError('Principal amount is required');
      isValid = false;
    } else if (isNaN(Number(principalAmount)) || Number(principalAmount) <= 0) {
      setPrincipalAmountError('Principal amount must be a valid positive number');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSuccessPopup(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    onNavigate('loan-management');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('loan-management')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Loan Management
          </button>

          <h1 className="text-gray-900">Create Loan</h1>
          <p className="text-gray-600 mt-1">Add a new loan record</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lender Name */}
            <div>
              <label htmlFor="lenderName" className="block text-gray-700 mb-2">
                Lender Name <span className="text-red-600">*</span>
              </label>
              <input
                id="lenderName"
                type="text"
                value={lenderName}
                onChange={(e) => setLenderName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter lender name"
              />
              {lenderNameError && (
                <p className="text-red-600 text-sm mt-1">{lenderNameError}</p>
              )}
            </div>

            {/* Loan Type */}
            <div>
              <label htmlFor="loanType" className="block text-gray-700 mb-2">
                Loan Type <span className="text-red-600">*</span>
              </label>
              <select
                id="loanType"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as 'Owner Loan' | 'Bank Loan' | 'Short-term Borrowing')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Owner Loan">Owner Loan</option>
                <option value="Bank Loan">Bank Loan</option>
                <option value="Short-term Borrowing">Short-term Borrowing</option>
              </select>
            </div>

            {/* Principal Amount */}
            <div>
              <label htmlFor="principalAmount" className="block text-gray-700 mb-2">
                Principal Amount <span className="text-red-600">*</span>
              </label>
              <input
                id="principalAmount"
                type="number"
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter principal amount"
              />
              {principalAmountError && (
                <p className="text-red-600 text-sm mt-1">{principalAmountError}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div>
              <label htmlFor="interestRate" className="block text-gray-700 mb-2">
                Interest Rate (%) <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <input
                id="interestRate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter interest rate"
              />
            </div>

            {/* Disbursement Account */}
            <div>
              <label htmlFor="disbursementAccount" className="block text-gray-700 mb-2">
                Disbursement Account <span className="text-red-600">*</span>
              </label>
              <select
                id="disbursementAccount"
                value={disbursementAccount}
                onChange={(e) => setDisbursementAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="3455332">#3455332</option>
                <option value="7894561">#7894561</option>
              </select>
            </div>

            {/* Loan Start Date */}
            <div>
              <label htmlFor="loanStartDate" className="block text-gray-700 mb-2">
                Loan Start Date <span className="text-red-600">*</span>
              </label>
              <input
                id="loanStartDate"
                type="date"
                value={loanStartDate}
                onChange={(e) => setLoanStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-gray-700 mb-2">
                Notes <span className="text-gray-500 text-sm">(Optional, max 100 characters)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 100))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                maxLength={100}
                placeholder="Enter any additional notes"
              />
              <p className="text-gray-500 text-sm mt-1">{notes.length}/100 characters</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onNavigate('loan-management')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Success"
          message="Loan created successfully"
          onClose={handleSuccessClose}
          type="success"
        />
      )}
    </div>
  );
}
