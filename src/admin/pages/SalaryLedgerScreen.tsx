import React, { useState } from 'react';
import { AdminScreen, Employee } from '../../AdminApp';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SalaryLedgerScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

const MOCK_EMPLOYEES: (Employee & { runningBalance: number })[] = [
  { id: 'EMP-001', name: 'Ramesh Kumar', phoneNumber: '9876543210', bloodGroup: 'O+', aadharNumber: '1234-5678-9012', permanentAddress: '123 Village Road, Bihar', role: 'Production Supervisor', category: 'Fixed Salary', isActive: true, runningBalance: 15000 },
  { id: 'EMP-002', name: 'Suresh Patel', phoneNumber: '9876543211', bloodGroup: 'B+', aadharNumber: '2345-6789-0123', permanentAddress: '456 Town Street, UP', role: 'Machine Operator', category: 'Daily Wages', isActive: true, runningBalance: 8500 },
  { id: 'EMP-003', name: 'Raju Singh', phoneNumber: '9876543212', bloodGroup: 'A+', aadharNumber: '3456-7890-1234', permanentAddress: '789 City Lane, MP', role: 'Load Man', category: 'Loadmen', isActive: true, runningBalance: 12000 },
  { id: 'EMP-004', name: 'Mohan Yadav', phoneNumber: '9876543213', bloodGroup: 'AB+', aadharNumber: '4567-8901-2345', permanentAddress: '321 Rural Road, Rajasthan', role: 'Helper', category: 'Daily Wages', isActive: true, runningBalance: 0 },
  { id: 'EMP-005', name: 'Rakesh Singh', phoneNumber: '9876543214', bloodGroup: 'O-', aadharNumber: '5678-9012-3456', permanentAddress: '654 District Road, WB', role: 'Accountant', category: 'Fixed Salary', isActive: true, runningBalance: 25000 },
];

export function SalaryLedgerScreen({ onNavigate }: SalaryLedgerScreenProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(10);

  const filteredEmployees = MOCK_EMPLOYEES.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.phoneNumber.includes(searchQuery)
  );

  const displayedEmployees = filteredEmployees.slice(0, displayCount);
  const hasMore = displayCount < filteredEmployees.length;

  const handleOpenLedger = (employeeId: string) => {
    // In a real app, this would pass the employee data
    onNavigate('salary-ledger-detail');
  };

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
          <h1 className="text-gray-900">Employee Salary Ledger</h1>
          <p className="text-gray-600 mt-1">View and manage employee salary records</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, employee ID, or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Employee Cards */}
        <div className="space-y-4">
          {displayedEmployees.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No employees found</p>
            </div>
          ) : (
            displayedEmployees.map((employee) => (
              <div key={employee.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Employee Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-gray-600 text-sm">Name</p>
                      <p className="text-gray-900">{employee.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">ID</p>
                      <p className="text-gray-900">{employee.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Role</p>
                      <p className="text-gray-900">{employee.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Category</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                        employee.category === 'Daily Wages' ? 'bg-purple-100 text-purple-800' :
                        employee.category === 'Fixed Salary' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {employee.category}
                      </span>
                    </div>
                  </div>

                  {/* Running Balance & Action */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Running Balance</p>
                      <p className={`text-lg ${employee.runningBalance > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        ₹{employee.runningBalance.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenLedger(employee.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <BookOpen className="w-4 h-4" />
                      Open Ledger
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

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
        </div>
      </div>
    </div>
  );
}
