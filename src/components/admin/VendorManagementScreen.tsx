import React, { useState } from 'react';
import { AdminScreen, Vendor } from '../../AdminApp';
import { ArrowLeft, Plus, Search, Store, Edit2, Book } from 'lucide-react';

interface VendorManagementScreenProps {
  onNavigate: (screen: AdminScreen) => void;
  onVendorEdit: (vendor: Vendor) => void;
}

const MOCK_VENDORS: Vendor[] = [
  { id: 'VEN-001', name: 'ABC Suppliers', phoneNumber: '9876501234', alternatePhone: '9876501235', materialsSupplied: ['Wet Ash', 'Crusher Powder'], address: '123 Industrial Area, Phase 2, Bangalore, Karnataka - 560001', gstNumber: 'GST123456', notes: 'Reliable supplier, payment on delivery', isActive: true },
  { id: 'VEN-002', name: 'XYZ Materials', phoneNumber: '9876502234', materialsSupplied: ['Crusher Powder', 'Cement'], address: '456 Factory Road, Industrial Estate, Bangalore, Karnataka - 560002', gstNumber: 'GST234567', isActive: true },
  { id: 'VEN-003', name: 'DEF Industries', phoneNumber: '9876503234', alternatePhone: '9876503235', materialsSupplied: ['Cement', 'Fly Ash Powder'], address: '789 Market Street, Commercial Hub, Bangalore, Karnataka - 560003', notes: 'Credit available up to 30 days', isActive: true },
  { id: 'VEN-004', name: 'GHI Traders', phoneNumber: '9876504234', materialsSupplied: ['Wet Ash', 'Granite Powder'], address: '321 Commerce Lane, Business District, Bangalore, Karnataka - 560004', gstNumber: 'GST345678', isActive: true },
  { id: 'VEN-005', name: 'JKL Enterprises', phoneNumber: '9876505234', materialsSupplied: ['Wet Ash', 'Fly Ash Powder', 'Cement'], address: '654 Business Park, Technology Zone, Bangalore, Karnataka - 560005', gstNumber: 'GST456789', notes: 'Best prices for bulk orders', isActive: true },
];

export function VendorManagementScreen({ onNavigate, onVendorEdit }: VendorManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(10);

  const filteredVendors = MOCK_VENDORS.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.phoneNumber.includes(searchQuery) ||
      vendor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.materialsSupplied.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const displayedVendors = filteredVendors.slice(0, displayCount);
  const hasMore = displayCount < filteredVendors.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Vendor Management</h1>
              <p className="text-gray-600 mt-1">Manage vendor information and ledgers</p>
            </div>
            <button
              onClick={() => onNavigate('create-vendor')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Vendor
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, phone, materials, or vendor ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Vendors</p>
                <p className="text-gray-900 mt-1">{MOCK_VENDORS.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Search Results</p>
                <p className="text-gray-900 mt-1">{filteredVendors.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Store className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="space-y-4">
              {filteredVendors.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-600">No vendors found matching your search criteria.</p>
                </div>
              ) : (
                <>
                  {/* Desktop View - Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700">Vendor Name</th>
                          <th className="px-4 py-3 text-left text-gray-700">Materials Supplied</th>
                          <th className="px-4 py-3 text-left text-gray-700">Phone Number</th>
                          <th className="px-4 py-3 text-left text-gray-700">Address</th>
                          <th className="px-4 py-3 text-left text-gray-700">GST / Tax Number</th>
                          <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {displayedVendors.map((vendor) => (
                          <tr key={vendor.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-gray-900">{vendor.name}</td>
                            <td className="px-4 py-4 text-gray-900 text-sm">{vendor.materialsSupplied.join(', ')}</td>
                            <td className="px-4 py-4 text-gray-900">{vendor.phoneNumber}</td>
                            <td className="px-4 py-4 text-gray-900 text-sm truncate max-w-xs" title={vendor.address}>{vendor.address}</td>
                            <td className="px-4 py-4 text-gray-900">{vendor.gstNumber || '-'}</td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => onVendorEdit(vendor)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit Vendor"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onNavigate('vendor-ledger')}
                                  className="text-green-600 hover:text-green-800"
                                  title="Open Ledger"
                                >
                                  <Book className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View - Cards */}
                  <div className="lg:hidden space-y-4">
                    {displayedVendors.map((vendor) => (
                      <div key={vendor.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-600 text-sm">Vendor Name</p>
                            <p className="text-gray-900">{vendor.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Materials Supplied</p>
                            <p className="text-gray-900 text-sm">{vendor.materialsSupplied.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Phone Number</p>
                            <p className="text-gray-900">{vendor.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Address</p>
                            <p className="text-gray-900 text-sm">{vendor.address}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">GST / Tax Number</p>
                            <p className="text-gray-900">{vendor.gstNumber || '-'}</p>
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-gray-200">
                            <button
                              onClick={() => onVendorEdit(vendor)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => onNavigate('vendor-ledger')}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Book className="w-4 h-4" />
                              Open Ledger
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setDisplayCount(displayCount + 10)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}