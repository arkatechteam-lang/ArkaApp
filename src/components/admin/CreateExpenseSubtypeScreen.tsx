import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Save } from 'lucide-react';
import { Popup } from '../Popup';
import { CreateExpenseTypePopup } from './CreateExpenseTypePopup';

interface CreateExpenseSubtypeScreenProps {
  onNavigate: (screen: AdminScreen) => void;
  expenseTypes: string[];
  expenseSubtypes: Record<string, string[]>;
  onTypeCreated: (typeName: string) => void;
  onSubtypeCreated: (type: string, subtype: string) => void;
}

export function CreateExpenseSubtypeScreen({ 
  onNavigate, 
  expenseTypes, 
  expenseSubtypes, 
  onTypeCreated,
  onSubtypeCreated 
}: CreateExpenseSubtypeScreenProps) {
  const [formData, setFormData] = useState({
    type: '',
    subtypeName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');
  const [showCreateTypePopup, setShowCreateTypePopup] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.subtypeName.trim()) {
      newErrors.subtypeName = 'Subtype name is required';
    } else if (formData.type && expenseSubtypes[formData.type]) {
      // Check for duplicate subtype
      const existingSubtypes = expenseSubtypes[formData.type].map(s => s.toLowerCase());
      if (existingSubtypes.includes(formData.subtypeName.trim().toLowerCase())) {
        newErrors.subtypeName = 'This subtype already exists for the selected type';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubtypeCreated(formData.type, formData.subtypeName.trim());
      setPopupStatus('success');
      setPopupMessage('Expense subtype created successfully!');
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupStatus === 'success') {
      onNavigate('create-expense');
    }
  };

  const handleTypeCreated = (typeName: string) => {
    onTypeCreated(typeName);
    setFormData({ ...formData, type: typeName });
  };

  // Get existing subtypes for selected type
  const existingSubtypes = formData.type ? (expenseSubtypes[formData.type] || []) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('create-expense')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Create Expense
          </button>
          <h1 className="text-gray-900">Create Expense Subtype</h1>
          <p className="text-gray-600 mt-1">Add a new expense subtype</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700">
                  Type <span className="text-red-600">*</span>
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
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value });
                  setErrors({ ...errors, type: '' });
                }}
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

            {/* Subtype Name */}
            <div>
              <label className="block text-gray-700 mb-2">
                Subtype Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.subtypeName}
                onChange={(e) => {
                  setFormData({ ...formData, subtypeName: e.target.value });
                  setErrors({ ...errors, subtypeName: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subtypeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter subtype name"
              />
              {errors.subtypeName && <p className="text-red-600 text-sm mt-1">{errors.subtypeName}</p>}
            </div>

            {/* Existing Subtypes */}
            {formData.type && existingSubtypes.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-gray-900 mb-3">Existing Subtypes for "{formData.type}"</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {existingSubtypes.map((subtype, index) => (
                      <li key={index} className="text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        {subtype}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => onNavigate('create-expense')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Create Type Popup */}
      {showCreateTypePopup && (
        <CreateExpenseTypePopup
          onClose={() => setShowCreateTypePopup(false)}
          onTypeCreated={handleTypeCreated}
          existingTypes={expenseTypes}
        />
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
