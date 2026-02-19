import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Popup } from '../../../../components/Popup';
import { useEditVendor } from '../../../hooks/useEditVendor';

export function EditVendorScreen() {
  const { vendor, vendorId, loading, goBack } = useEditVendor();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternate_phone: '',
    address: '',
    gst_number: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        phone: vendor.phone || '',
        alternate_phone: vendor.alternate_phone || '',
        address: vendor.address || '',
        gst_number: vendor.gst_number || '',
        notes: vendor.notes || '',
      });
    }
  }, [vendor]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Vendor name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (formData.alternate_phone && !/^[0-9]{10}$/.test(formData.alternate_phone)) {
      newErrors.alternate_phone = 'Alternate phone must be 10 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Implement update vendor API call
      // const success = await updateVendor(vendorId, formData);
      const success = Math.random() > 0.1;
      setPopupStatus(success ? 'success' : 'error');
      setPopupMessage(success ? 'Vendor details updated successfully.' : 'Failed to update vendor. Please try again.');
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (popupStatus === 'success') {
      goBack('/admin/vendors');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goBack('/admin/vendors')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Vendors
          </button>
          <h1 className="text-gray-900">Edit Vendor</h1>
          <p className="text-gray-600 mt-1">Update vendor information - {vendorId}</p>
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
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={10}
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Alternate Phone</label>
                <input
                  type="tel"
                  value={formData.alternate_phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setFormData({ ...formData, alternate_phone: value });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.alternate_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={10}
                />
                {errors.alternate_phone && <p className="text-red-600 text-sm mt-1">{errors.alternate_phone}</p>}
              </div>
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
              />
              <p className="text-gray-500 text-xs mt-1">{formData.address.length}/200 characters</p>
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-gray-700 mb-2">GST / Tax Registration Number</label>
              <input
                type="text"
                value={formData.gst_number}
                onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              />
              <p className="text-gray-500 text-xs mt-1">{formData.notes.length}/100 characters</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handlePopupClose}
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
          message={popupMessage}
          onClose={handlePopupClose}
          type={popupStatus}
        />
      )}
    </div>
  );
}