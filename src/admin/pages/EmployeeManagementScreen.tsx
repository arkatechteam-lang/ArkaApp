import React, { useState } from 'react';
import { AdminScreen, Employee } from '../../AdminApp';
import { ArrowLeft, Calendar, UserCog, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Popup } from '../../components/Popup';
import { useNavigate } from 'react-router-dom';

interface EmployeeManagementScreenProps {
  onNavigate: (screen: AdminScreen) => void;
  onEmployeeEdit: (employee: Employee) => void;
}

type TabType = 'Active' | 'Inactive';

const MOCK_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Ramesh Kumar', phoneNumber: '9876543210', bloodGroup: 'O+', aadharNumber: '123456789012', permanentAddress: '123 Village Road, Bihar', localAddress: '45 Worker Colony, Bangalore', role: 'DW', category: 'Daily Wages', isActive: true, emergencyContactName: 'Sunita Kumar', emergencyContactNumber: '9876543220' },
  { id: 'EMP-002', name: 'Suresh Patel', phoneNumber: '9876543211', bloodGroup: 'B+', aadharNumber: '234567890123', permanentAddress: '456 Town Street, UP', localAddress: '', role: 'FX-MM', category: 'Fixed Salary', isActive: true, emergencyContactName: 'Raj Patel', emergencyContactNumber: '9876543221' },
  { id: 'EMP-003', name: 'Raju Singh', phoneNumber: '9876543212', bloodGroup: 'A+', aadharNumber: '345678901234', permanentAddress: '789 City Lane, MP', localAddress: '', role: 'FX-L', category: 'Loadmen', isActive: true, emergencyContactName: 'Priya Singh', emergencyContactNumber: '9876543222' },
  { id: 'EMP-004', name: 'Mohan Yadav', phoneNumber: '9876543213', bloodGroup: 'AB+', aadharNumber: '456789012345', permanentAddress: '321 Rural Road, Rajasthan', localAddress: '', role: 'DW', category: 'Daily Wages', isActive: true, emergencyContactName: 'Geeta Yadav', emergencyContactNumber: '9876543223' },
  { id: 'EMP-005', name: 'Rakesh Singh', phoneNumber: '9876543214', bloodGroup: 'O-', aadharNumber: '567890123456', permanentAddress: '654 District Road, WB', localAddress: '', role: 'FX-OP', category: 'Fixed Salary', isActive: true, emergencyContactName: 'Meera Singh', emergencyContactNumber: '9876543224' },
  { id: 'EMP-006', name: 'Vijay Kumar', phoneNumber: '9876543215', bloodGroup: 'A-', aadharNumber: '678901234567', permanentAddress: '987 Block Street, Odisha', localAddress: '', role: 'FX-L-W', category: 'Loadmen', isActive: false, emergencyContactName: 'Lakshmi Kumar', emergencyContactNumber: '9876543225' },
  { id: 'EMP-007', name: 'Anil Sharma', phoneNumber: '9876543216', bloodGroup: 'B-', aadharNumber: '789012345678', permanentAddress: '111 Main Road, Gujarat', localAddress: '', role: 'DW', category: 'Daily Wages', isActive: false, emergencyContactName: 'Sita Sharma', emergencyContactNumber: '9876543226' },
  { id: 'EMP-008', name: 'Santosh Gupta', phoneNumber: '9876543217', bloodGroup: 'AB-', aadharNumber: '890123456789', permanentAddress: '222 East Street, Bihar', localAddress: '', role: 'FX-MM', category: 'Fixed Salary', isActive: true, emergencyContactName: 'Anjali Gupta', emergencyContactNumber: '9876543227' },
  { id: 'EMP-009', name: 'Dinesh Rao', phoneNumber: '9876543218', bloodGroup: 'O+', aadharNumber: '901234567890', permanentAddress: '333 West Avenue, Karnataka', localAddress: '', role: 'DW-D', category: 'Daily Wages', isActive: true, emergencyContactName: 'Radha Rao', emergencyContactNumber: '9876543228' },
  { id: 'EMP-010', name: 'Prakash Jain', phoneNumber: '9876543219', bloodGroup: 'A+', aadharNumber: '012345678901', permanentAddress: '444 South Road, Maharashtra', localAddress: '', role: 'FX-L-W-C', category: 'Loadmen', isActive: true, emergencyContactName: 'Kavita Jain', emergencyContactNumber: '9876543229' },
];

export function EmployeeManagementScreen({ onNavigate, onEmployeeEdit }: EmployeeManagementScreenProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Active');
  const [displayCount, setDisplayCount] = useState(10);
  const [showTogglePopup, setShowTogglePopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleToggleClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowTogglePopup(true);
  };

  const handleToggleConfirm = () => {
    // In real app, this would update the employee status
    console.log('Toggle employee:', selectedEmployee?.id);
    setShowTogglePopup(false);
    setSelectedEmployee(null);
  };

  const handleToggleCancel = () => {
    setShowTogglePopup(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = MOCK_EMPLOYEES.filter(employee => {
    if (activeTab === 'Active') {
      return employee.isActive;
    } else {
      return !employee.isActive;
    }
  });

  const displayedEmployees = filteredEmployees.slice(0, displayCount);
  const hasMore = displayCount < filteredEmployees.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Employee Management</h1>
              <p className="text-gray-600 mt-1">Manage employee records and information</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('role-setup')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                <UserCog className="w-5 h-5" />
                Role & Salary Setup
              </button>
              <button
                onClick={() => onNavigate('attendance')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <Calendar className="w-5 h-5" />
                Attendance
              </button>
              <button
                onClick={() => onNavigate('create-employee')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Create Employee
              </button>
            </div>
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

          {/* Employees List */}
          <div className="p-6">
            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left text-gray-700">Phone Number</th>
                    <th className="px-4 py-3 text-left text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className={`${
                        activeTab === 'Inactive' 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-4 text-gray-900">{employee.name}</td>
                      <td className="px-4 py-4 text-gray-600">{employee.id}</td>
                      <td className="px-4 py-4 text-gray-600">{employee.phoneNumber}</td>
                      <td className="px-4 py-4 text-gray-600">{employee.role}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          employee.category === 'Daily Wages' ? 'bg-purple-100 text-purple-800' :
                          employee.category === 'Fixed Salary' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {employee.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {activeTab === 'Active' ? (
                            <>
                              <button
                                onClick={() => onEmployeeEdit(employee)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleClick(employee)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Set Inactive"
                              >
                                <ToggleRight className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleToggleClick(employee)}
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
              {displayedEmployees.map((employee) => (
                <div 
                  key={employee.id} 
                  className={`bg-white border border-gray-200 rounded-lg p-4 ${
                    activeTab === 'Inactive' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-gray-900">{employee.name}</p>
                      <p className="text-gray-600 text-sm">{employee.id}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {activeTab === 'Active' ? (
                        <>
                          <button
                            onClick={() => onEmployeeEdit(employee)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleClick(employee)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <ToggleRight className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleClick(employee)}
                          className="text-green-600 hover:text-green-800 p-2"
                        >
                          <ToggleLeft className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{employee.phoneNumber}</p>
                    <p className="text-gray-600">Role: {employee.role}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      employee.category === 'Daily Wages' ? 'bg-purple-100 text-purple-800' :
                      employee.category === 'Fixed Salary' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {employee.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* No Employees Message */}
            {displayedEmployees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab.toLowerCase()} employees found.</p>
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
      {showTogglePopup && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">
              {selectedEmployee.isActive ? 'Set Employee Inactive' : 'Activate Employee'}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedEmployee.isActive 
                ? 'Are you sure you want to set this employee as inactive?' 
                : 'Do you want to activate this employee?'}
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