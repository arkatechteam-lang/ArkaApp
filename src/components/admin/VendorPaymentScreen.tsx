import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft } from 'lucide-react';
import { Popup } from '../Popup';

interface VendorPaymentScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

// Mock vendor data
const MOCK_VENDOR = {
  id: 'VEN-001',
  name: 'ABC Suppliers',
  phoneNumber: '9876543210',
  outstandingBalance: 55000,
  lastTransactionDate: '2025-12-15',
};

// Mock account numbers from Cash Flow Management
const MOCK_ACCOUNTS = [
  { id: 'ACC-001', accountNumber: '3455332' },
  { id: 'ACC-002', accountNumber: '7894561' },
];

export function VendorPaymentScreen({ onNavigate }: VendorPaymentScreenProps) {
  const [formData, setFormData] = useState({
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    modeOfPayment: 'UPI',
    senderAccountInfo: '',
    receiverAccountInfo: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Payment Amount validation
    const amount = parseFloat(formData.paymentAmount);
    if (!formData.paymentAmount || isNaN(amount)) {
      newErrors.paymentAmount = 'Please enter a valid amount.';
    } else if (amount <= 0) {
      newErrors.paymentAmount = 'Please enter a valid amount.';
    } else if (amount < 0) {
      newErrors.paymentAmount = 'Please enter a valid amount.';
    } else if (amount > MOCK_VENDOR.outstandingBalance) {
      newErrors.paymentAmount = 'Please enter a valid amount.';
    }

    // Payment Date validation
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required.';
    } else {
      const selectedDate = new Date(formData.paymentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        newErrors.paymentDate = 'Date cannot be in the future.';
      }
    }

    // Mode of Payment validation
    if (!formData.modeOfPayment) {
      newErrors.modeOfPayment = 'Please select a payment mode.';
    }

    // SAI and RAI are only required when mode is not Cash
    if (formData.modeOfPayment !== 'Cash') {
      // Sender Account Info validation
      if (!formData.senderAccountInfo.trim()) {
        newErrors.senderAccountInfo = 'SAI is required.';
      }

      // Receiver Account Info validation
      if (!formData.receiverAccountInfo.trim()) {
        newErrors.receiverAccountInfo = 'RAI is required.';
      }
    }

    // Notes validation
    if (formData.notes.length > 80) {
      newErrors.notes = 'Notes cannot exceed 80 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Simulate API call
    const success = Math.random() > 0.1;
    
    if (success) {
      setPopupType('success');
      setPopupMessage('Vendor payment recorded successfully.');
      setShowPopup(true);
    } else {
      setPopupType('error');
      setPopupMessage('Unable to save payment. Please try again.');
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupType === 'success') {
      onNavigate('vendor-ledger');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('vendor-ledger')}
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
              <p className="text-gray-900">{MOCK_VENDOR.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone Number</p>
              <p className="text-gray-900">{MOCK_VENDOR.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Current Outstanding Balance</p>
              <p className="text-red-600">₹{MOCK_VENDOR.outstandingBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Last Transaction Date</p>
              <p className="text-gray-900">
                {MOCK_VENDOR.lastTransactionDate 
                  ? new Date(MOCK_VENDOR.lastTransactionDate).toLocaleDateString('en-GB', {
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
                onChange={(e) => {
                  setFormData({ ...formData, paymentAmount: e.target.value });
                  if (errors.paymentAmount) {
                    setErrors({ ...errors, paymentAmount: '' });
                  }
                }}
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
                onChange={(e) => {
                  setFormData({ ...formData, paymentDate: e.target.value });
                  if (errors.paymentDate) {
                    setErrors({ ...errors, paymentDate: '' });
                  }
                }}
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
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    modeOfPayment: e.target.value,
                    senderAccountInfo: '',
                    receiverAccountInfo: ''
                  });
                  if (errors.modeOfPayment) {
                    setErrors({ ...errors, modeOfPayment: '' });
                  }
                }}
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

            {/* SAI - Only show if mode is not Cash */}
            {formData.modeOfPayment !== 'Cash' && (
              <div>
                <label className="block text-gray-700 mb-2">
                  SAI <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.senderAccountInfo}
                  onChange={(e) => {
                    setFormData({ ...formData, senderAccountInfo: e.target.value });
                    if (errors.senderAccountInfo) {
                      setErrors({ ...errors, senderAccountInfo: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.senderAccountInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Account Number</option>
                  {MOCK_ACCOUNTS.map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountNumber}
                    </option>
                  ))}
                </select>
                {errors.senderAccountInfo && (
                  <p className="text-red-600 text-sm mt-1">{errors.senderAccountInfo}</p>
                )}
              </div>
            )}

            {/* RAI - Only show if mode is not Cash */}
            {formData.modeOfPayment !== 'Cash' && (
              <div>
                <label className="block text-gray-700 mb-2">
                  RAI <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.receiverAccountInfo}
                  onChange={(e) => {
                    setFormData({ ...formData, receiverAccountInfo: e.target.value });
                    if (errors.receiverAccountInfo) {
                      setErrors({ ...errors, receiverAccountInfo: '' });
                    }
                  }}
                  placeholder="Enter RAI"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.receiverAccountInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.receiverAccountInfo && (
                  <p className="text-red-600 text-sm mt-1">{errors.receiverAccountInfo}</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => {
                  setFormData({ ...formData, notes: e.target.value });
                  if (errors.notes) {
                    setErrors({ ...errors, notes: '' });
                  }
                }}
                placeholder="Enter any additional notes (optional)"
                rows={3}
                maxLength={80}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes ? (
                  <p className="text-red-600 text-sm">{errors.notes}</p>
                ) : (
                  <p className="text-gray-500 text-sm">Optional</p>
                )}
                <p className={`text-sm ${formData.notes.length > 80 ? 'text-red-600' : 'text-gray-500'}`}>
                  {formData.notes.length}/80
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate('vendor-ledger')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Payment
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