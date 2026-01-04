import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Save } from 'lucide-react';
import { Popup } from '../Popup';

interface CreateVendorScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

export function CreateVendorScreen({ onNavigate }: CreateVendorScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alternatePhone: '',
    materialsSupplied: [] as string[],
    address: '',
    gstNumber: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');

  const materialOptions = ['Wet Ash', 'Granite Powder', 'Crusher Powder', 'Fly Ash Powder', 'Cement'];

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materialsSupplied: prev.materialsSupplied.includes(material)
        ? prev.materialsSupplied.filter(m => m !== material)
        : [...prev.materialsSupplied, material]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Vendor name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (formData.alternatePhone && !/^[0-9]{10}$/.test(formData.alternatePhone)) {
      newErrors.alternatePhone = 'Alternate phone must be 10 digits';
    }
    if (formData.materialsSupplied.length === 0) {
      newErrors.materialsSupplied = 'Select at least one material';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

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
      onNavigate('vendors');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('vendors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Vendors
          </button>
          <h1 className="text-gray-900">Create Vendor</h1>
          <p className="text-gray-600 mt-1">Create a new vendor record</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendor Name */}
            <div>
              <label className="block text-gray-700 mb-2">
                Vendor Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow letters and spaces
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    setFormData({ ...formData, name: value });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setFormData({ ...formData, phoneNumber: value });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Alternate Phone</label>
                <input
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setFormData({ ...formData, alternatePhone: value });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.alternatePhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.alternatePhone && <p className="text-red-600 text-sm mt-1">{errors.alternatePhone}</p>}
              </div>
            </div>

            {/* Materials Supplied */}
            <div>
              <label className="block text-gray-700 mb-2">
                Materials Supplied <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {materialOptions.map(material => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.materialsSupplied.includes(material)}
                      onChange={() => handleMaterialToggle(material)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
              {errors.materialsSupplied && <p className="text-red-600 text-sm mt-1">{errors.materialsSupplied}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 mb-2">
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                maxLength={200}
                placeholder="Enter full address (max 200 characters)"
              />
              <p className="text-gray-500 text-xs mt-1">{formData.address.length}/200 characters</p>
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-gray-700 mb-2">GST / Tax Registration Number</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter GST / Tax number (optional)"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                maxLength={100}
                placeholder="Add any internal remarks (max 100 characters, optional)"
              />
              <p className="text-gray-500 text-xs mt-1">{formData.notes.length}/100 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => onNavigate('vendors')}
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
              ? 'Vendor created successfully!'
              : 'Failed to create vendor. Please try again.'
          }
          onClose={handlePopupClose}
          type={popupStatus}
        />
      )}
    </div>
  );
}