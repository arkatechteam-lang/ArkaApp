import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Popup } from '../Popup';

interface CreateProcurementRequestScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

const MATERIALS = [
  'Wet Ash',
  'Crusher Powder',
  'Fly Ash',
  'Cement',
  'Sand',
  'Stone Chips',
  'Other'
];

const VENDORS = [
  { id: 'V001', name: 'ABC Suppliers' },
  { id: 'V002', name: 'XYZ Materials' },
  { id: 'V003', name: 'DEF Industries' },
  { id: 'V004', name: 'PQR Traders' },
];

export function CreateProcurementRequestScreen({ onNavigate }: CreateProcurementRequestScreenProps) {
  const [material, setMaterial] = useState('');
  const [otherMaterial, setOtherMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Kg');
  const [vendorId, setVendorId] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [requiredByDate, setRequiredByDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!material) {
      newErrors.material = 'Please select a material';
    }

    if (material === 'Other' && !otherMaterial.trim()) {
      newErrors.otherMaterial = 'Please specify the material name';
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity greater than 0';
    }

    if (!vendorId) {
      newErrors.vendorId = 'Please select a vendor';
    }

    if (estimatedCost && parseFloat(estimatedCost) < 0) {
      newErrors.estimatedCost = 'Estimated cost cannot be negative';
    }

    if (!requiredByDate) {
      newErrors.requiredByDate = 'Please select required by date';
    } else {
      const selectedDate = new Date(requiredByDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.requiredByDate = 'Required by date cannot be in the past';
      }
    }

    if (notes.length > 200) {
      newErrors.notes = 'Notes cannot exceed 200 characters';
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
      setPopupMessage('Procurement request submitted successfully. Awaiting admin approval.');
      setShowPopup(true);
      
      // Reset form
      setTimeout(() => {
        setShowPopup(false);
        onNavigate('inventory');
      }, 2000);
    } else {
      setPopupType('error');
      setPopupMessage('Failed to submit procurement request. Please try again.');
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('inventory')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Inventory Management
          </button>
          
          <h1 className="text-gray-900">Create Procurement Request</h1>
          <p className="text-gray-600 mt-1">Submit a new material procurement request</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Material Selection */}
            <div>
              <label className="block text-gray-700 mb-2">
                Material <span className="text-red-500">*</span>
              </label>
              <select
                value={material}
                onChange={(e) => {
                  setMaterial(e.target.value);
                  if (errors.material) setErrors({...errors, material: ''});
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.material ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Material</option>
                {MATERIALS.map((mat) => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
              {errors.material && (
                <p className="text-red-500 text-sm mt-1">{errors.material}</p>
              )}
            </div>

            {/* Other Material Name (conditional) */}
            {material === 'Other' && (
              <div>
                <label className="block text-gray-700 mb-2">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otherMaterial}
                  onChange={(e) => {
                    setOtherMaterial(e.target.value);
                    if (errors.otherMaterial) setErrors({...errors, otherMaterial: ''});
                  }}
                  placeholder="Enter material name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.otherMaterial ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.otherMaterial && (
                  <p className="text-red-500 text-sm mt-1">{errors.otherMaterial}</p>
                )}
              </div>
            )}

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    if (errors.quantity) setErrors({...errors, quantity: ''});
                  }}
                  placeholder="Enter quantity"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Kg">Kg</option>
                  <option value="Tons">Tons</option>
                  <option value="Bags">Bags</option>
                  <option value="Cubic Meter">Cubic Meter</option>
                </select>
              </div>
            </div>

            {/* Vendor Selection */}
            <div>
              <label className="block text-gray-700 mb-2">
                Preferred Vendor <span className="text-red-500">*</span>
              </label>
              <select
                value={vendorId}
                onChange={(e) => {
                  setVendorId(e.target.value);
                  if (errors.vendorId) setErrors({...errors, vendorId: ''});
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.vendorId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Vendor</option>
                {VENDORS.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.id})
                  </option>
                ))}
              </select>
              {errors.vendorId && (
                <p className="text-red-500 text-sm mt-1">{errors.vendorId}</p>
              )}
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-gray-700 mb-2">
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => {
                  setEstimatedCost(e.target.value);
                  if (errors.estimatedCost) setErrors({...errors, estimatedCost: ''});
                }}
                placeholder="Enter estimated cost (optional)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.estimatedCost ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.estimatedCost && (
                <p className="text-red-500 text-sm mt-1">{errors.estimatedCost}</p>
              )}
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-gray-700 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={urgency === level}
                      onChange={(e) => setUrgency(e.target.value as 'Low' | 'Medium' | 'High')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      level === 'Low' ? 'bg-green-100 text-green-800' :
                      level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Required By Date */}
            <div>
              <label className="block text-gray-700 mb-2">
                Required By Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={requiredByDate}
                onChange={(e) => {
                  setRequiredByDate(e.target.value);
                  if (errors.requiredByDate) setErrors({...errors, requiredByDate: ''});
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.requiredByDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.requiredByDate && (
                <p className="text-red-500 text-sm mt-1">{errors.requiredByDate}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-2">
                Notes / Additional Information
              </label>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (errors.notes) setErrors({...errors, notes: ''});
                }}
                placeholder="Enter any additional notes or specifications"
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes ? (
                  <p className="text-red-500 text-sm">{errors.notes}</p>
                ) : (
                  <p className="text-gray-500 text-sm">Optional</p>
                )}
                <p className={`text-sm ${notes.length > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                  {notes.length}/200
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 text-sm">
                  This request will be sent to the admin for approval. You will be notified once the request is reviewed.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onNavigate('inventory')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Request
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
          onClose={() => setShowPopup(false)}
          type={popupType}
        />
      )}
    </div>
  );
}
