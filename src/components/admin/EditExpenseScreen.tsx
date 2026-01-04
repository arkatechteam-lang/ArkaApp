import React, { useState } from 'react';
import { AdminScreen, Expense } from '../../AdminApp';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Popup } from '../Popup';
import { CreateExpenseTypePopup } from './CreateExpenseTypePopup';

interface EditExpenseScreenProps {
  expense: Expense;
  onNavigate: (screen: AdminScreen) => void;
  expenseTypes: string[];
  expenseSubtypes: Record<string, string[]>;
  onTypeCreated: (typeName: string) => void;
  onSubtypeCreated: (type: string, subtype: string) => void;
}

// Mock account numbers from Cash Flow Management
const MOCK_ACCOUNTS = [
  { id: 'ACC-001', accountNumber: '3455332' },
  { id: 'ACC-002', accountNumber: '7894561' },
];

export function EditExpenseScreen({ 
  expense, 
  onNavigate, 
  expenseTypes, 
  expenseSubtypes, 
  onTypeCreated,
  onSubtypeCreated 
}: EditExpenseScreenProps) {
  const [formData, setFormData] = useState({
    date: expense.date,
    type: expense.type,
    subtype: expense.subtype || '',
    amount: expense.amount.toString(),
    comments: expense.comments,
    modeOfPayment: expense.modeOfPayment,
    sai: expense.sai || '',
    rai: expense.rai || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateTypePopup, setShowCreateTypePopup] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.subtype) newErrors.subtype = 'Subtype is required';
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.comments.trim()) newErrors.comments = 'Comments are required';
    if (formData.comments.length > 100) {
      newErrors.comments = 'Comments cannot exceed 100 characters';
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
      setPopupMessage(success ? 'Expense successfully edited!' : 'Failed to edit expense. Please try again.');
      setShowPopup(true);
    }
  };

  const handleDelete = () => {
    const success = Math.random() > 0.1;
    setPopupStatus(success ? 'success' : 'error');
    setPopupMessage(success ? 'Expense deleted successfully!' : 'Failed to delete expense. Please try again.');
    setShowDeleteConfirm(false);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupStatus === 'success') {
      onNavigate('accounts');
    }
  };

  const handleTypeChange = (newType: string) => {
    setFormData({ ...formData, type: newType, subtype: '' });
    setErrors({ ...errors, type: '' });
  };

  const handleTypeCreatedFromPopup = (typeName: string) => {
    onTypeCreated(typeName);
    setFormData({ ...formData, type: typeName, subtype: '' });
  };

  // Get subtypes for selected type
  const availableSubtypes = formData.type ? (expenseSubtypes[formData.type] || []) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('accounts')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Accounts
          </button>
          <h1 className="text-gray-900">Edit Expense</h1>
          <p className="text-gray-600 mt-1">Update expense details</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-gray-700 mb-2">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ colorScheme: 'light' }}
              />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700">
                  Expense Type <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCreateTypePopup(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Create Type
                </button>
              </div>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Type</option>
                {expenseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* Subtype */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700">
                  Subtype <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('create-expense-subtype')}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Create Subtype
                </button>
              </div>
              <select
                value={formData.subtype}
                onChange={(e) => {
                  setFormData({ ...formData, subtype: e.target.value });
                  setErrors({ ...errors, subtype: '' });
                }}
                disabled={!formData.type}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subtype ? 'border-red-500' : 'border-gray-300'
                } ${!formData.type ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {formData.type ? 'Select Subtype' : 'Select a type first'}
                </option>
                {availableSubtypes.map((subtype) => (
                  <option key={subtype} value={subtype}>
                    {subtype}
                  </option>
                ))}
              </select>
              {errors.subtype && <p className="text-red-600 text-sm mt-1">{errors.subtype}</p>}
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
                }`}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Comments */}
            <div>
              <label className="block text-gray-700 mb-2">
                Comments <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.comments ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Enter comments (max 100 characters)"
                maxLength={100}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.comments && <p className="text-red-600 text-sm">{errors.comments}</p>}
                <p className="text-gray-500 text-sm ml-auto">{formData.comments.length}/100</p>
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Create Type Popup */}
      {showCreateTypePopup && (
        <CreateExpenseTypePopup
          onClose={() => setShowCreateTypePopup(false)}
          onTypeCreated={handleTypeCreatedFromPopup}
          existingTypes={expenseTypes}
        />
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="flex flex-col items-center text-center">
              <Trash2 className="w-16 h-16 text-red-600 mb-4" />
              <h2 className="text-gray-900 mb-3">Delete Expense?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this expense? This action cannot be undone.
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Popup */}
      {showPopup && (
        <Popup
          title={popupStatus === 'success' ? 'Success' : 'Error'}
          message={popupMessage}
          onClose={handlePopupClose}
          type={popupStatus}
        />
      )}
    </div>
  );
}
