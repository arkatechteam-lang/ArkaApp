import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoanManagementScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

interface Loan {
  id: string;
  lenderName: string;
  loanType: 'Owner Loan' | 'Bank Loan' | 'Short-term Borrowing';
  principalAmount: number;
  outstandingBalance: number;
  status: 'Active' | 'Closed';
}

// Mock data
const MOCK_LOANS: Loan[] = [
  {
    id: 'LOAN-001',
    lenderName: 'ABC Bank',
    loanType: 'Bank Loan',
    principalAmount: 1000000,
    outstandingBalance: 500000,
    status: 'Active',
  },
  {
    id: 'LOAN-002',
    lenderName: 'Owner - John Doe',
    loanType: 'Owner Loan',
    principalAmount: 500000,
    outstandingBalance: 0,
    status: 'Closed',
  },
  {
    id: 'LOAN-003',
    lenderName: 'XYZ Finance',
    loanType: 'Short-term Borrowing',
    principalAmount: 300000,
    outstandingBalance: 150000,
    status: 'Active',
  },
];

export function LoanManagementScreen({ onNavigate }: LoanManagementScreenProps) {
  const navigate = useNavigate();
  const [loans] = useState<Loan[]>(MOCK_LOANS);

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'Owner Loan':
        return 'from-blue-500 to-blue-600';
      case 'Bank Loan':
        return 'from-purple-500 to-purple-600';
      case 'Short-term Borrowing':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Loan Management</h1>
              <p className="text-gray-600 mt-1">Manage borrowed funds and repayments</p>
            </div>
            <button
              onClick={() => onNavigate('create-loan')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Loan
            </button>
          </div>
        </div>

        {/* Loan Cards Grid */}
        {loans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No loans found. Create a new loan to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${getLoanTypeColor(loan.loanType)} p-4`}>
                  <h3 className="text-white">{loan.lenderName}</h3>
                  <p className="text-white text-sm opacity-90 mt-1">{loan.loanType}</p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">Principal Amount</p>
                      <p className="text-gray-900 text-xl">₹{loan.principalAmount.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Outstanding Balance</p>
                      <p className={`text-xl ${loan.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{loan.outstandingBalance.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm mb-2">Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                  </div>

                  {/* Open Ledger Button */}
                  <button
                    onClick={() => onNavigate('loan-ledger')}
                    className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Ledger
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
