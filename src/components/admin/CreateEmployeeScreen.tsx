import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Save } from 'lucide-react';
import { Popup } from '../Popup';

interface CreateEmployeeScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

const MOCK_ROLES = [
  { code: 'DW', name: 'Daily Wages - General', category: 'Daily Wages' },
  { code: 'FX-MM', name: 'Fixed - Machine Operator', category: 'Fixed Salary' },
  { code: 'FX-OP', name: 'Fixed - Operator', category: 'Fixed Salary' },
  { code: 'FX-L', name: 'Fixed - Loadman', category: 'Fixed Salary' },
  { code: 'FX-L-W', name: 'Fixed - Loadman Worker', category: 'Fixed Salary' },
  { code: 'FX-L-W-C', name: 'Fixed - Loadman Worker Contractor', category: 'Fixed Salary' },
  { code: 'DW-D', name: 'Daily Wages - Driver', category: 'Daily Wages' },
];

export function CreateEmployeeScreen({ onNavigate }: CreateEmployeeScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alternatePhone: '',
    bloodGroup: '',
    aadharNumber: '',
    permanentAddress: '',
    localAddress: '',
    role: '',
    category: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');

  const handleRoleChange = (roleCode: string) => {
    const selectedRole = MOCK_ROLES.find(r => r.code === roleCode);
    setFormData({
      ...formData,
      role: roleCode,
      category: selectedRole?.category || '',
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Employee name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.bloodGroup.trim()) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^[0-9]{12}$/.test(formData.aadharNumber.replace(/[-\s]/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = 'Permanent address is required';
    if (!formData.role) newErrors.role = 'Employee role is required';

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
      onNavigate('employees');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('employees')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Employees
          </button>
          <h1 className="text-gray-900">Add New Employee</h1>
          <p className="text-gray-600 mt-1">Create a new employee record</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Name */}
            <div>
              <label className="block text-gray-700 mb-2">
                Employee Name <span className="text-red-600">*</span>
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
                placeholder="Enter employee name"
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

            {/* Blood Group */}
            <div>
              <label className="block text-gray-700 mb-2">
                Blood Group <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodGroup && <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-gray-700 mb-2">
                Aadhar Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="12-digit Aadhar number"
                maxLength={12}
              />
              {errors.aadharNumber && <p className="text-red-600 text-sm mt-1">{errors.aadharNumber}</p>}
            </div>

            {/* Permanent Address */}
            <div>
              <label className="block text-gray-700 mb-2">
                Permanent Address <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.permanentAddress}
                onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.permanentAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Enter permanent address"
              />
              {errors.permanentAddress && <p className="text-red-600 text-sm mt-1">{errors.permanentAddress}</p>}
            </div>

            {/* Local Address */}
            <div>
              <label className="block text-gray-700 mb-2">Local Address</label>
              <textarea
                value={formData.localAddress}
                onChange={(e) => setFormData({ ...formData, localAddress: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter local address (optional)"
              />
            </div>

            {/* Employee Role */}
            <div>
              <label className="block text-gray-700 mb-2">
                Employee Role <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select role</option>
                  {MOCK_ROLES.map(role => (
                    <option key={role.code} value={role.code}>{role.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onNavigate('role-setup')}
                  className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap underline"
                >
                  Create New Role
                </button>
              </div>
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Category (Auto-filled) */}
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
                placeholder="Auto-filled based on role"
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Emergency Contact Number</label>
                <input
                  type="tel"
                  value={formData.emergencyContactNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow digits and limit to 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setFormData({ ...formData, emergencyContactNumber: value });
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Create Employee
              </button>
              <button
                type="button"
                onClick={() => onNavigate('employees')}
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
              ? 'Employee created successfully!'
              : 'Failed to create employee. Please try again.'
          }
          onClose={handlePopupClose}
          type={popupStatus}
        />
      )}
    </div>
  );
}