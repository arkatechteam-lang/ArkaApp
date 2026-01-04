import React, { useState } from 'react';
import { AdminScreen, Role } from '../../AdminApp';
import { ArrowLeft, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

interface RoleSalarySetupScreenProps {
  onNavigate: (screen: AdminScreen) => void;
  onRoleEdit: (role: Role) => void;
}

type TabType = 'Active' | 'Inactive';

const MOCK_ROLES: Role[] = [
  { id: 'ROL-001', name: 'DW', category: 'Daily Wages', salaryType: 'Per Day Wage', salaryValue: 800, isActive: true },
  { id: 'ROL-002', name: 'FX-MM', category: 'Fixed Salary', salaryType: 'Monthly Salary', salaryValue: 35000, isActive: true },
  { id: 'ROL-003', name: 'FX-OP', category: 'Fixed Salary', salaryType: 'Monthly Salary', salaryValue: 30000, isActive: true },
  { id: 'ROL-004', name: 'FX-L', category: 'Loadmen', salaryType: 'Rate Per Load', salaryValue: 500, isActive: true },
  { id: 'ROL-005', name: 'FX-L-W', category: 'Loadmen', salaryType: 'Rate Per Load', salaryValue: 450, isActive: true },
  { id: 'ROL-006', name: 'FX-L-W-C', category: 'Loadmen', salaryType: 'Rate Per Load', salaryValue: 550, isActive: true },
  { id: 'ROL-007', name: 'DW-D', category: 'Daily Wages', salaryType: 'Per Day Wage', salaryValue: 900, isActive: true },
  { id: 'ROL-008', name: 'Helper', category: 'Daily Wages', salaryType: 'Per Day Wage', salaryValue: 600, isActive: false },
  { id: 'ROL-009', name: 'Quality Checker', category: 'Daily Wages', salaryType: 'Per Day Wage', salaryValue: 700, isActive: false },
];

export function RoleSalarySetupScreen({ onNavigate, onRoleEdit }: RoleSalarySetupScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Active');
  const [displayCount, setDisplayCount] = useState(10);
  const [showTogglePopup, setShowTogglePopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleToggleClick = (role: Role) => {
    setSelectedRole(role);
    setShowTogglePopup(true);
  };

  const handleToggleConfirm = () => {
    // In real app, this would update the role status
    console.log('Toggle role:', selectedRole?.id);
    setShowTogglePopup(false);
    setSelectedRole(null);
  };

  const handleToggleCancel = () => {
    setShowTogglePopup(false);
    setSelectedRole(null);
  };

  const filteredRoles = MOCK_ROLES.filter(role => {
    if (activeTab === 'Active') {
      return role.isActive;
    } else {
      return !role.isActive;
    }
  });

  const displayedRoles = filteredRoles.slice(0, displayCount);
  const hasMore = displayCount < filteredRoles.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('employees')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Employee Management
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Role & Salary Setup</h1>
              <p className="text-gray-600 mt-1">Configure employee roles and salary structure</p>
            </div>
            <button
              onClick={() => onNavigate('create-role')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Role
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab('Active');
                  setDisplayCount(10);
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'Active'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setActiveTab('Inactive');
                  setDisplayCount(10);
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'Inactive'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Roles List */}
          <div className="p-6">
            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Role Name</th>
                    <th className="px-4 py-3 text-left text-gray-700">Employee Category</th>
                    <th className="px-4 py-3 text-left text-gray-700">Salary Type</th>
                    <th className="px-4 py-3 text-left text-gray-700">Current Salary Value</th>
                    <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedRoles.map((role) => (
                    <tr 
                      key={role.id} 
                      className={`${
                        activeTab === 'Inactive' 
                          ? 'opacity-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-4 text-gray-900">{role.name}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          role.category === 'Daily Wages' ? 'bg-purple-100 text-purple-800' :
                          role.category === 'Fixed Salary' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {role.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{role.salaryType}</td>
                      <td className="px-4 py-4 text-gray-900">₹{role.salaryValue.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {activeTab === 'Active' ? (
                            <>
                              <button
                                onClick={() => onRoleEdit(role)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleClick(role)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Set Inactive"
                              >
                                <ToggleRight className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleToggleClick(role)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Set Active"
                            >
                              <ToggleLeft className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden space-y-4">
              {displayedRoles.map((role) => (
                <div 
                  key={role.id} 
                  className={`bg-white border border-gray-200 rounded-lg p-4 ${
                    activeTab === 'Inactive' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-gray-900">{role.name}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-sm ${
                        role.category === 'Daily Wages' ? 'bg-purple-100 text-purple-800' :
                        role.category === 'Fixed Salary' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {role.category}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {activeTab === 'Active' ? (
                        <>
                          <button
                            onClick={() => onRoleEdit(role)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleClick(role)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <ToggleRight className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleClick(role)}
                          className="text-green-600 hover:text-green-800 p-2"
                        >
                          <ToggleLeft className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{role.salaryType}</p>
                    <p className="text-gray-900">₹{role.salaryValue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* No Roles Message */}
            {displayedRoles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab.toLowerCase()} roles found.</p>
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setDisplayCount(displayCount + 10)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Confirmation Popup */}
      {showTogglePopup && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">
              {selectedRole.isActive ? 'Set Role Inactive' : 'Activate Role'}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedRole.isActive 
                ? 'Do you want to set this role as inactive?' 
                : 'Do you want to activate this role?'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleToggleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleToggleConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
