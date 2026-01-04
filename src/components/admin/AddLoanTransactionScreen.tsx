import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft } from 'lucide-react';
import { Popup } from '../Popup';

interface AddLoanTransactionScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

export function AddLoanTransactionScreen({ onNavigate }: AddLoanTransactionScreenProps) {
  const [transactionType, setTransactionType] = useState<'Disbursement' | 'Repayment' | 'Interest Payment'>('Repayment');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [modeOfPayment, setModeOfPayment] = useState('Bank Transfer');
  const [sai, setSai] = useState('');
  const [rai, setRai] = useState('');
  const [notes, setNotes] = useState('');

  const [amountError, setAmountError] = useState('');
  const [dateError, setDateError] = useState('');
  const [saiError, setSaiError] = useState('');
  const [raiError, setRaiError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Get max date (today)
  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    let isValid = true;
    setAmountError('');
    setDateError('');
    setSaiError('');
    setRaiError('');

    if (!amount.trim()) {
      setAmountError('Amount is required');
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Amount must be a valid positive number');
      isValid = false;
    }

    if (!date) {
      setDateError('Date is required');
      isValid = false;
    }

    // SAI and RAI are mandatory when mode of payment is not Cash
    if (modeOfPayment !== 'Cash') {
      if (!sai.trim()) {
        setSaiError('Sender Account Info is required when payment mode is not Cash');
        isValid = false;
      }
      if (!rai.trim()) {
        setRaiError('Receiver Account Info is required when payment mode is not Cash');
        isValid = false;
      }
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
    onNavigate('loan-ledger');
  };

  const getTransactionDescription = () => {
    switch (transactionType) {
      case 'Disbursement':
        return 'Cash In increases, Loan outstanding balance increases, Does not affect Profit';
      case 'Repayment':
        return 'Cash Out increases, Loan outstanding balance decreases';
      case 'Interest Payment':
        return 'Cash Out increases, Recorded as Expense';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('loan-ledger')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Loan Ledger
          </button>

          <h1 className="text-gray-900">Add Loan Transaction</h1>
          <p className="text-gray-600 mt-1">Record a new loan transaction</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div>
              <label htmlFor="transactionType" className="block text-gray-700 mb-2">
                Transaction Type <span className="text-red-600">*</span>
              </label>
              <select
                id="transactionType"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as 'Disbursement' | 'Repayment' | 'Interest Payment')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Disbursement">Disbursement</option>
                <option value="Repayment">Repayment</option>
                <option value="Interest Payment">Interest Payment</option>
              </select>
              <p className="text-blue-600 text-sm mt-2">{getTransactionDescription()}</p>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-gray-700 mb-2">
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter amount"
              />
              {amountError && (
                <p className="text-red-600 text-sm mt-1">{amountError}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                id="date"
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {dateError && (
                <p className="text-red-600 text-sm mt-1">{dateError}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">Future dates are disabled</p>
            </div>

            {/* Mode of Payment */}
            <div>
              <label htmlFor="modeOfPayment" className="block text-gray-700 mb-2">
                Mode of Payment <span className="text-red-600">*</span>
              </label>
              <select
                id="modeOfPayment"
                value={modeOfPayment}
                onChange={(e) => setModeOfPayment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {/* Sender Account Info (SAI) */}
            <div>
              <label htmlFor="sai" className="block text-gray-700 mb-2">
                Sender Account Info (SAI) {modeOfPayment !== 'Cash' && <span className="text-red-600">*</span>}
              </label>
              <select
                id="sai"
                value={sai}
                onChange={(e) => setSai(e.target.value)}
                disabled={modeOfPayment === 'Cash'}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  modeOfPayment === 'Cash' ? 'bg-gray-100 text-gray-500' : ''
                }`}
              >
                <option value="">Select account</option>
                <option value="3455332">#3455332</option>
                <option value="7894561">#7894561</option>
              </select>
              {saiError && (
                <p className="text-red-600 text-sm mt-1">{saiError}</p>
              )}
              {modeOfPayment === 'Cash' && (
                <p className="text-gray-500 text-sm mt-1">Not required for cash payments</p>
              )}
            </div>

            {/* Receiver Account Info (RAI) */}
            <div>
              <label htmlFor="rai" className="block text-gray-700 mb-2">
                Receiver Account Info (RAI) {modeOfPayment !== 'Cash' && <span className="text-red-600">*</span>}
              </label>
              <input
                id="rai"
                type="text"
                value={rai}
                onChange={(e) => setRai(e.target.value)}
                disabled={modeOfPayment === 'Cash'}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  modeOfPayment === 'Cash' ? 'bg-gray-100 text-gray-500' : ''
                }`}
                placeholder="Enter receiver account info"
              />
              {raiError && (
                <p className="text-red-600 text-sm mt-1">{raiError}</p>
              )}
              {modeOfPayment === 'Cash' && (
                <p className="text-gray-500 text-sm mt-1">Not required for cash payments</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-gray-700 mb-2">
                Notes <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="Enter any additional notes"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onNavigate('loan-ledger')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Success"
          message="Loan transaction recorded successfully."
          onClose={handleSuccessClose}
          type="success"
        />
      )}
    </div>
  );
}
