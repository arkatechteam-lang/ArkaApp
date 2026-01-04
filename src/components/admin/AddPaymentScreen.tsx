import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Save } from 'lucide-react';
import { Popup } from '../Popup';

interface AddPaymentScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

// Mock account numbers from Cash Flow Management
const MOCK_ACCOUNTS = [
  { id: 'ACC-001', accountNumber: '3455332' },
  { id: 'ACC-002', accountNumber: '7894561' },
];

export function AddPaymentScreen({ onNavigate }: AddPaymentScreenProps) {
  // Mock employee data
  const employee = {
    name: 'Ramesh Kumar',
    id: 'EMP-001',
    role: 'Production Supervisor',
    category: 'Fixed Salary',
    runningBalance: 15000,
    lastTransactionDate: '2024-12-10',
  };

  const [formData, setFormData] = useState({
    entryType: '' as 'Advance Payment' | 'Weekly Payment' | 'Emergency Payment' | 'Daily / Ad-hoc Payment' | 'Partial Settlement' | 'Full Settlement' | '',
    amount: '',
    dateTime: new Date().toISOString().slice(0, 16),
    notes: '',
    modeOfPayment: 'UPI' as 'UPI' | 'Bank Transfer' | 'Cheque' | 'Cash',
    sai: '',
    rai: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');

  const handleEntryTypeChange = (type: typeof formData.entryType) => {
    if (type === 'Full Settlement') {
      setFormData({
        ...formData,
        entryType: type,
        amount: employee.runningBalance.toString(),
      });
    } else {
      setFormData({
        ...formData,
        entryType: type,
        amount: formData.entryType === 'Full Settlement' ? '' : formData.amount,
      });
    }
    // Clear amount error when type changes
    const newErrors = { ...errors };
    delete newErrors.amount;
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.entryType) newErrors.entryType = 'Entry type is required';
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    // Check for partial settlement amount exceeding running balance
    if (formData.entryType === 'Partial Settlement' && Number(formData.amount) > employee.runningBalance) {
      newErrors.amount = 'Settlement amount cannot exceed pending balance';
    }

    // Check if full settlement when balance is 0
    if (formData.entryType === 'Full Settlement' && employee.runningBalance === 0) {
      newErrors.entryType = 'No pending balance available for settlement';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Date and time is required';
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate > now) {
        newErrors.dateTime = 'Date cannot be in the future';
      }
    }
    
    if (!formData.modeOfPayment) newErrors.modeOfPayment = 'Mode of Payment is required';
    
    // SAI and RAI are only required when mode is not Cash
    if (formData.modeOfPayment !== 'Cash') {
      if (!formData.sai) newErrors.sai = 'SAI is required';
      if (!formData.rai.trim()) newErrors.rai = 'RAI is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = Math.random() > 0.1;
      setPopupStatus(success ? 'success' : 'error');
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupStatus === 'success') {
      onNavigate('salary-ledger-detail');
    }
  };

  const getButtonLabel = () => {
    if (formData.entryType === 'Partial Settlement' || formData.entryType === 'Full Settlement') {
      return 'Confirm Settlement';
    }
    return 'Confirm Payment';
  };

  const isAmountDisabled = formData.entryType === 'Full Settlement';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('salary-ledger-detail')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Ledger
          </button>
          <h1 className="text-gray-900">Add Payment / Settlement</h1>
          <p className="text-gray-600 mt-1">Record a payment or settlement entry</p>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Employee Information</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div>
              <p className="text-gray-600 text-sm">Current Balance</p>
              <p className="text-gray-900">₹{employee.runningBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Last Transaction</p>
              <p className="text-gray-900">{new Date(employee.lastTransactionDate).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Entry Type */}
            <div>
              <label className="block text-gray-700 mb-2">
                Type of Entry <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.entryType}
                onChange={(e) => handleEntryTypeChange(e.target.value as any)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.entryType ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={employee.runningBalance === 0}
              >
                <option value="">Select entry type</option>
                <option value="Advance Payment">Advance Payment</option>
                <option value="Weekly Payment">Weekly Payment</option>
                <option value="Emergency Payment">Emergency Payment</option>
                <option value="Daily / Ad-hoc Payment">Daily / Ad-hoc Payment</option>
                <option value="Partial Settlement">Partial Settlement</option>
                <option value="Full Settlement">Full Settlement</option>
              </select>
              {errors.entryType && <p className="text-red-600 text-sm mt-1">{errors.entryType}</p>}
              {employee.runningBalance === 0 && (
                <p className="text-red-600 text-sm mt-1">No pending balance available for settlement</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-gray-700 mb-2">
                Amount (₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                onWheel={(e) => e.currentTarget.blur()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                } ${isAmountDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                disabled={isAmountDisabled}
              />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
              {formData.entryType === 'Full Settlement' && (
                <p className="text-gray-600 text-sm mt-1">Amount auto-filled to match current running balance</p>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-gray-700 mb-2">
                Date & Time <span className="text-red-600">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                max={new Date().toISOString().slice(0, 16)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateTime && <p className="text-red-600 text-sm mt-1">{errors.dateTime}</p>}
              <p className="text-gray-600 text-sm mt-1">You can backdate an entry if needed</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-2">Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Going to native, Medical need, Weekly payout (max 80 characters)"
                maxLength={80}
              />
              <div className="flex justify-end mt-1">
                <p className="text-gray-500 text-sm">{formData.notes.length}/80</p>
              </div>
            </div>

            {/* Mode of Payment */}
            <div>
              <label className="block text-gray-700 mb-2">
                Mode of Payment <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.modeOfPayment}
                onChange={(e) => setFormData({ ...formData, modeOfPayment: e.target.value as any, sai: '', rai: '' })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.modeOfPayment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
              {errors.modeOfPayment && <p className="text-red-600 text-sm mt-1">{errors.modeOfPayment}</p>}
            </div>

            {/* SAI - Only show if mode is not Cash */}
            {formData.modeOfPayment !== 'Cash' && (
              <div>
                <label className="block text-gray-700 mb-2">
                  SAI <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.sai}
                  onChange={(e) => setFormData({ ...formData, sai: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.sai ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Account Number</option>
                  {MOCK_ACCOUNTS.map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountNumber}
                    </option>
                  ))}
                </select>
                {errors.sai && <p className="text-red-600 text-sm mt-1">{errors.sai}</p>}
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
                  value={formData.rai}
                  onChange={(e) => setFormData({ ...formData, rai: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.rai ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter RAI"
                />
                {errors.rai && <p className="text-red-600 text-sm mt-1">{errors.rai}</p>}
              </div>
            )}

            {/* Info Box */}
            {formData.entryType && (
              <div className={`p-4 rounded-lg ${
                formData.entryType.includes('Settlement') ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className="text-sm text-gray-700">
                  {formData.entryType.includes('Settlement') 
                    ? `This settlement will ${formData.entryType === 'Full Settlement' ? 'clear the entire' : 'reduce the'} running balance.`
                    : 'This payment will be deducted from the running balance.'}
                </p>
                {formData.amount && (
                  <p className="text-sm text-gray-700 mt-1">
                    New balance after this transaction: ₹{(employee.runningBalance - Number(formData.amount)).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={employee.runningBalance === 0 && formData.entryType === 'Full Settlement'}
              >
                <Save className="w-5 h-5" />
                {getButtonLabel()}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('salary-ledger-detail')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <Popup
          title={popupStatus === 'success' ? 'Success' : 'Error'}
          message={
            popupStatus === 'success'
              ? 'Entry added successfully!'
              : 'Unable to save entry. Please try again.'
          }
          onClose={handlePopupClose}
          type={popupStatus}
        />
      )}
    </div>
  );
}