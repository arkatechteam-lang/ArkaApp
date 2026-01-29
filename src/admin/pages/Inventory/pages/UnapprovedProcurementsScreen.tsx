import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

import { Popup } from '../../../../components/Popup';
import { useAdminNavigation } from '../../../hooks/useAdminNavigation';


interface UnapprovedProcurement {
  id: string;
  material: string;
  date: string;
  vendor: string;
  quantityValue: number;
  quantityUnit: string;
}

const UNAPPROVED_PROCUREMENTS: UnapprovedProcurement[] = [
  { id: 'UP-001', material: 'Wet Ash', date: '2025-12-09', vendor: 'ABC Suppliers', quantityValue: 4, quantityUnit: 'tons' },
  { id: 'UP-002', material: 'Marble Powder', date: '2025-12-09', vendor: 'Stone Suppliers', quantityValue: 2, quantityUnit: 'tons' },
  { id: 'UP-003', material: 'Fly Ash', date: '2025-12-08', vendor: 'XYZ Materials', quantityValue: 3.5, quantityUnit: 'tons' },
];

export function UnapprovedProcurementsScreen() {
  const {goBack,goTo} = useAdminNavigation();
  const [selectedProcurement, setSelectedProcurement] = useState<UnapprovedProcurement | null>(null);
  const [rate, setRate] = useState('');
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');

  const handleToggleClick = (procurement: UnapprovedProcurement) => {
    setSelectedProcurement(procurement);
    setRate(''); // Reset rate when opening modal
  };

  const handleCloseModal = () => {
    setSelectedProcurement(null);
    setRate('');
  };

  const handleApprove = () => {
    if (selectedProcurement && rate) {
      setApprovalMessage(`Procurement ${selectedProcurement.id} has been approved successfully.`);
      setShowApprovalPopup(true);
      setSelectedProcurement(null);
      setRate('');
    }
  };

  const handleReject = () => {
    if (selectedProcurement) {
      setApprovalMessage(`Procurement ${selectedProcurement.id} has been rejected and removed.`);
      setShowRejectionPopup(true);
      setSelectedProcurement(null);
      setRate('');
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedProcurement || !rate) return '0.00';
    
    const rateValue = parseFloat(rate);
    
    if (isNaN(rateValue)) return '0.00';
    
    return (selectedProcurement.quantityValue * rateValue).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goBack('inventory')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Inventory Management
          </button>

          <div>
            <h1 className="text-gray-900">Unapproved Procurements</h1>
            <p className="text-gray-600 mt-1">Review and approve pending procurement requests</p>
          </div>
        </div>

        {/* Procurement List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="space-y-4">
              {UNAPPROVED_PROCUREMENTS.map((procurement) => (
                <div
                  key={procurement.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="text-gray-500 text-sm">Material</p>
                        <p className="text-gray-900">{procurement.material}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Date</p>
                        <p className="text-gray-900">{new Date(procurement.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Vendor</p>
                        <p className="text-gray-900">{procurement.vendor}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Quantity</p>
                        <p className="text-gray-900">{procurement.quantityValue} {procurement.quantityUnit}</p>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggleClick(procurement)}
                      className="relative inline-flex items-center h-6 w-11 rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
                      aria-label="Approve procurement"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {selectedProcurement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Icon */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-gray-900 mb-6">Approve Procurement</h2>

            <div className="space-y-4">
              {/* Material - Pre-populated */}
              <div>
                <label className="block text-gray-700 mb-2">Material</label>
                <input
                  type="text"
                  value={selectedProcurement.material}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Date - Pre-populated */}
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  value={new Date(selectedProcurement.date).toLocaleDateString()}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Vendor - Pre-populated */}
              <div>
                <label className="block text-gray-700 mb-2">Vendor</label>
                <input
                  type="text"
                  value={selectedProcurement.vendor}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Quantity - Pre-populated */}
              <div>
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  value={`${selectedProcurement.quantityValue} ${selectedProcurement.quantityUnit}`}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Rate - Input field */}
              <div>
                <label htmlFor="rate" className="block text-gray-700 mb-2">
                  Rate (per unit) <span className="text-red-600">*</span>
                </label>
                <input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="Enter rate per unit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  step="0.01"
                  min="0.01"
                />
              </div>

              {/* Total Price - Calculated */}
              <div>
                <label className="block text-gray-700 mb-2">Total Price</label>
                <input
                  type="text"
                  value={`₹${parseFloat(calculateTotalPrice()).toLocaleString()}`}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!rate}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    rate
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Success Popup */}
      {showApprovalPopup && (
        <Popup
          title="Procurement Approved"
          message={approvalMessage}
          onClose={() => setShowApprovalPopup(false)}
          type="success"
        />
      )}

      {/* Rejection Success Popup */}
      {showRejectionPopup && (
        <Popup
          title="Procurement Rejected"
          message={approvalMessage}
          onClose={() => setShowRejectionPopup(false)}
          type="error"
        />
      )}
    </div>
  );
}