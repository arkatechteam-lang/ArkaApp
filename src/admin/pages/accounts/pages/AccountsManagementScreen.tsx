import React, { useState } from 'react';
import { AdminScreen, Expense, AdminOrder } from '../../../../AdminApp';
import { ArrowLeft, Plus, Wallet, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAdminNavigation } from '../../../hooks/useAdminNavigation';
import { useAccountsIncome } from '../../../hooks/useAccountsIncome';


const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', date: '2025-12-08', type: 'Procurement', subtype: 'Fly Ash', amount: 50000, comments: 'Fly Ash purchase from ABC Suppliers', status: 'Paid', modeOfPayment: 'Bank Transfer', sai: '3455332', rai: 'ABC Suppliers - 9876543210' },
  { id: 'EXP-002', date: '2025-12-08', type: 'Salary', subtype: 'Production Workers', amount: 35000, comments: 'Weekly salary for production workers', status: 'Paid', modeOfPayment: 'UPI', sai: '7894561', rai: 'Employees Salary Fund' },
  { id: 'EXP-003', date: '2025-12-07', type: 'Equipment Service', subtype: 'Machine Maintenance', amount: 15000, comments: 'Brick making machine maintenance', status: 'Pending', modeOfPayment: 'Cheque', sai: '3455332', rai: 'Service Center - 1234567890' },
  { id: 'EXP-004', date: '2025-12-07', type: 'Fuel', subtype: 'Diesel', amount: 8000, comments: 'Diesel for generator and vehicles', status: 'Paid', modeOfPayment: 'Cash' },
  { id: 'EXP-005', date: '2025-12-06', type: 'Procurement', subtype: 'Crusher Powder', amount: 80000, comments: 'Crusher Powder from XYZ Materials', status: 'Paid', modeOfPayment: 'Bank Transfer', sai: '7894561', rai: 'XYZ Materials - 8765432109' },
  { id: 'EXP-006', date: '2025-12-06', type: 'Others', subtype: 'Office Supplies', amount: 5000, comments: 'Office supplies and miscellaneous', status: 'Paid', modeOfPayment: 'Cash' },
  { id: 'EXP-007', date: '2025-12-05', type: 'Salary', subtype: 'Production Workers', amount: 35000, comments: 'Weekly salary for production workers', status: 'Paid', modeOfPayment: 'UPI', sai: '3455332', rai: 'Employees Salary Fund' },
  { id: 'EXP-008', date: '2025-12-05', type: 'Fuel', subtype: 'Diesel', amount: 7500, comments: 'Diesel and petrol for vehicles', status: 'Paid', modeOfPayment: 'Cash' },
];

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-001',
    date: '2025-12-08',
    deliveryDate: '2025-12-08',
    customerName: 'Rajesh Kumar',
    customerNumber: '9876543210',
    customerId: 'CUST-001',
    quantity: 5000,
    pricePerBrick: 10,
    paperPrice: 50000,
    location: '123 MG Road, Bangalore',
    finalPrice: 50000,
    paymentStatus: 'Fully Paid',
    amountPaid: 50000,
    loadMen: ['Raju Kumar', 'Suresh Yadav'],
    deliveryToday: true,
    isDelivered: true,
  },
  {
    id: 'ORD-002',
    date: '2025-12-07',
    deliveryDate: '2025-12-08',
    customerName: 'Priya Sharma',
    customerNumber: '9876543211',
    customerId: 'CUST-002',
    quantity: 3000,
    pricePerBrick: 10,
    paperPrice: 30000,
    location: '456 Brigade Road, Bangalore',
    finalPrice: 30000,
    paymentStatus: 'Partially Paid',
    amountPaid: 15000,
    loadMen: ['Mohan Singh'],
    deliveryToday: false,
    isDelivered: true,
  },
  {
    id: 'ORD-003',
    date: '2025-12-06',
    deliveryDate: '2025-12-09',
    customerName: 'Amit Patel',
    customerNumber: '9876543212',
    customerId: 'CUST-003',
    quantity: 7000,
    pricePerBrick: 9.5,
    paperPrice: 66500,
    location: '789 Koramangala, Bangalore',
    finalPrice: 66500,
    paymentStatus: 'Fully Paid',
    amountPaid: 66500,
    loadMen: ['Raju Kumar'],
    deliveryToday: false,
    isDelivered: true,
  },
];

type FilterType = 'Current Month' | 'Last month' | 'Last year' | 'Custom range';

export function AccountsManagementScreen() {
  const { goBack, goTo } = useAdminNavigation();
  const [filterType, setFilterType] = useState<FilterType>('Current Month');
  const [showCustomRangeModal, setShowCustomRangeModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('Overall');

  // Fetch income data based on filter
  const { orders, loading: incomeLoading, error: incomeError, totalIncome, showError, closeError } = useAccountsIncome(
    filterType,
    filterType === 'Custom range' ? customStartDate : undefined,
    filterType === 'Custom range' ? customEndDate : undefined
  );

  // Get unique expense types from expenses
  const expenseTypes = ['Overall', ...Array.from(new Set(MOCK_EXPENSES.map(e => e.type)))];

  // Filter expenses by selected type
  const filteredExpenses = selectedExpenseType === 'Overall' 
    ? MOCK_EXPENSES 
    : MOCK_EXPENSES.filter(e => e.type === selectedExpenseType);

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalIncome - totalExpenses;

  // Prepare pie chart data
  // If "Overall" is selected, group by type
  // If specific type is selected, group by subtype
  let pieChartData;
  if (selectedExpenseType === 'Overall') {
    const expenseByType = filteredExpenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    pieChartData = Object.entries(expenseByType).map(([name, value]) => ({
      name,
      value,
    }));
  } else {
    // Group by subtype for the selected type
    const expenseBySubtype = filteredExpenses.reduce((acc, expense) => {
      const subtype = expense.subtype || 'Uncategorized';
      acc[subtype] = (acc[subtype] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    pieChartData = Object.entries(expenseBySubtype).map(([name, value]) => ({
      name,
      value,
    }));
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const handleFilterChange = (value: FilterType) => {
    if (value === 'Custom range') {
      setShowCustomRangeModal(true);
    } else {
      setFilterType(value);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setFilterType('Custom range');
      setShowCustomRangeModal(false);
    }
  };

  const handleCloseCustomRangeModal = () => {
    setShowCustomRangeModal(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goBack('/admin/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">Accounts Management</h1>
              <p className="text-gray-600 mt-1">Track income, expenses, and business finances</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <select
                value={filterType === 'Custom range' ? 'Custom range' : filterType}
                onChange={(e) => handleFilterChange(e.target.value as FilterType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Current Month">Current Month</option>
                <option value="Last month">Last month</option>
                <option value="Last year">Last year</option>
                <option value="Custom range">Custom range</option>
              </select>
              
              {/* Add Expense Button */}
              <button
                onClick={() => goTo('/admin/accounts/expense')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Profit Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Profit</p>
              <p className={`${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(profit).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Income and Expenses Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
          {/* Income Section */}
          <div className="bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-gray-900">Income</h2>
            </div>
            
            {/* Income Top Half - Total Income with Icon */}
            <div className="p-6 border-b border-gray-200 bg-green-50 flex-shrink-0">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Wallet className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-700 mb-2">Total Income</p>
                {incomeLoading ? (
                  <p className="text-green-600 text-lg">Loading...</p>
                ) : (
                  <p className="text-green-600 text-lg">₹{totalIncome.toLocaleString()}</p>
                )}
              </div>
            </div>

            {/* Income Bottom Half - Orders List */}
            <div className="p-6 flex flex-col flex-grow overflow-hidden">
              {incomeLoading ? (
                <div className="flex justify-center items-center flex-grow">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex justify-center items-center flex-grow">
                  <p className="text-gray-500">No orders found for this period</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-grow">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => goTo(`/admin/orders/${order.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0"
                    >
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Name</p>
                          <p className="text-gray-900">{order.customers?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Bricks</p>
                          <p className="text-gray-900">{order.brick_quantity.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Revenue</p>
                          <p className="text-gray-900">₹{(order.final_price || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Status</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            order.payment_status === 'FULLY_PAID'
                              ? 'bg-green-100 text-green-800'
                              : order.payment_status === 'PARTIALLY_PAID'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.payment_status === 'FULLY_PAID' ? 'Fully Paid' : order.payment_status === 'PARTIALLY_PAID' ? 'Partially Paid' : 'Not Paid'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expenses Section */}
          <div className="bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-gray-900">Expenses</h2>
            </div>

            {/* Expense Type Filter */}
            <div className="px-6 pt-4 pb-2 bg-red-50 border-b border-gray-200 flex-shrink-0">
              <label className="block text-gray-700 text-sm mb-2">Filter by Expense Type</label>
              <select
                value={selectedExpenseType}
                onChange={(e) => {
                  setSelectedExpenseType(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {expenseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Expenses Top Half - Pie Chart */}
            <div className="p-6 border-b border-gray-200 bg-red-50 flex-shrink-0">
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-gray-700 mt-4 mb-2">Total Expenses</p>
                <p className="text-red-600">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>

            {/* Expenses Bottom Half - Expenses List */}
            <div className="p-6 flex flex-col flex-grow overflow-hidden">
              <div className="space-y-3 overflow-y-auto flex-grow">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    onClick={() => goTo(`/admin/accounts/expense/${expense.id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0"
                  >
                    <div className="grid grid-cols-5 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Type</p>
                        <p className="text-gray-900 truncate">{expense.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Subtype</p>
                        <p className="text-gray-900 truncate">{expense.subtype || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Comments</p>
                        <p className="text-gray-900 truncate">{expense.comments}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Amount</p>
                        <p className="text-gray-900">₹{expense.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          expense.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {expense.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Popup */}
      {showError && incomeError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeError}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close error"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Income Data</h3>
                <p className="text-gray-600 text-sm mb-4">{incomeError}</p>
                <button
                  onClick={closeError}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Range Modal */}
      {showCustomRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Icon */}
            <button
              onClick={handleCloseCustomRangeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-gray-900 mb-6">Custom Date Range</h2>

            <div className="space-y-4">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-gray-700 mb-2">
                  Start <span className="text-red-600">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  style={{ colorScheme: 'light' }}
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-gray-700 mb-2">
                  End <span className="text-red-600">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  style={{ colorScheme: 'light' }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  onClick={handleCloseCustomRangeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomRange}
                  disabled={!customStartDate || !customEndDate}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    customStartDate && customEndDate
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}