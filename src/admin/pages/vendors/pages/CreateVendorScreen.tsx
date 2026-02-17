import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Popup } from '../../../../components/Popup';
import { useCreateVendor } from '../../../hooks/useCreateVendor';

export function CreateVendorScreen() {
  const {
    createVendorInput,
    updateCreateVendorInput,
    selectedMaterialIds,
    materials,
    materialsLoading,
    handleMaterialToggle,
    errors,
    showSuccessPopup,
    showFailurePopup,
    loading,
    handleCreate,
    handleSuccessClose,
    handleFailureClose,
    goBack,
  } = useCreateVendor();

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
          <h1 className="text-gray-900">Create Vendor</h1>
          <p className="text-gray-600 mt-1">Create a new vendor record</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Vendor Name */}
            <div>
              <label htmlFor="vendorName" className="block text-gray-700 mb-2">
                Vendor Name <span className="text-red-600">*</span>
              </label>
              <input
                id="vendorName"
                type="text"
                value={createVendorInput.name}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow letters and spaces
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    updateCreateVendorInput('name', value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter vendor name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={createVendorInput.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      updateCreateVendorInput('phone', value);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="alternatePhone" className="block text-gray-700 mb-2">
                  Alternate Phone <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <input
                  id="alternatePhone"
                  type="tel"
                  value={createVendorInput.alternate_phone || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      updateCreateVendorInput('alternate_phone', value || null);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.alternate_phone && <p className="text-red-600 text-sm mt-1">{errors.alternate_phone}</p>}
              </div>
            </div>

            {/* Materials Supplied */}
            <div>
              <label className="block text-gray-700 mb-2">
                Materials Supplied <span className="text-red-600">*</span>
              </label>
              {materialsLoading ? (
                <p className="text-gray-500 text-sm">Loading materials...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {materials.map(material => (
                    <label key={material.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMaterialIds.includes(material.id)}
                        onChange={() => handleMaterialToggle(material.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{material.name}</span>
                    </label>
                  ))}
                </div>
              )}
              {errors.material_ids && <p className="text-red-600 text-sm mt-1">{errors.material_ids}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-2">
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="address"
                value={createVendorInput.address}
                onChange={(e) => updateCreateVendorInput('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                maxLength={200}
                placeholder="Enter full address (max 200 characters)"
              />
              <p className="text-gray-500 text-xs mt-1">{createVendorInput.address.length}/200 characters</p>
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* GST Number */}
            <div>
              <label htmlFor="gstNumber" className="block text-gray-700 mb-2">
                GST / Tax Registration Number <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <input
                id="gstNumber"
                type="text"
                value={createVendorInput.gst_number || ''}
                onChange={(e) => updateCreateVendorInput('gst_number', e.target.value || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter GST / Tax number"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-gray-700 mb-2">
                Notes <span className="text-gray-500 text-sm">(Optional, max 100 characters)</span>
              </label>
              <textarea
                id="notes"
                value={createVendorInput.notes || ''}
                onChange={(e) => updateCreateVendorInput('notes', e.target.value.slice(0, 100))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={2}
                maxLength={100}
                placeholder="Add any internal remarks"
              />
              <p className="text-gray-500 text-xs mt-1">{(createVendorInput.notes || '').length}/100 characters</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => goBack('/admin/vendors')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Vendor Created Successfully"
          message="The vendor has been created successfully."
          onClose={handleSuccessClose}
          type="success"
        />
      )}

      {/* Failure Popup */}
      {showFailurePopup && (
        <Popup
          title="Creation Failed"
          message={errors.form || 'Failed to create vendor. Please try again.'}
          onClose={handleFailureClose}
          type="error"
        />
      )}
    </div>
  );
}