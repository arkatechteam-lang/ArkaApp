import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Popup } from '../Popup';

interface CreateExpenseTypePopupProps {
  onClose: () => void;
  onTypeCreated: (typeName: string) => void;
  existingTypes: string[];
}

export function CreateExpenseTypePopup({ onClose, onTypeCreated, existingTypes }: CreateExpenseTypePopupProps) {
  const [typeName, setTypeName] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleCreate = () => {
    // Validation
    if (!typeName.trim()) {
      setError('Type name is required');
      return;
    }

    // Check for duplicate
    if (existingTypes.some(type => type.toLowerCase() === typeName.trim().toLowerCase())) {
      setError('This expense type already exists');
      return;
    }

    // Success
    setShowSuccessPopup(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    onTypeCreated(typeName.trim());
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-gray-900 mb-6">Create Expense Type</h2>

          <div className="space-y-4">
            {/* Type Name */}
            <div>
              <label className="block text-gray-700 mb-2">
                Type Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => {
                  setTypeName(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter expense type name"
              />
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>

            {/* Create Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Success"
          message="Expense type created successfully!"
          onClose={handleSuccessClose}
          type="success"
        />
      )}
    </>
  );
}
