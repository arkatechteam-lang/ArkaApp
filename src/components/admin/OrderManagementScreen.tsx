import React, { useState } from 'react';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { AdminScreen, AdminOrder } from '../../AdminApp';

interface OrderManagementScreenProps {
  onNavigate: (screen: AdminScreen) => void;
  onOrderSelect: (order: AdminOrder) => void;
}

type OrderTab = 'Today' | 'Undelivered' | 'Delivered' | 'Unpaid';

// Mock orders data
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
    paymentStatus: 'Not Paid',
    loadMen: ['Raju Kumar', 'Suresh Yadav'],
    deliveryToday: true,
    isDelivered: false,
  },
  {
    id: 'ORD-002',
    date: '2025-12-07',
    deliveryDate: '2025-12-05',
    customerName: 'Priya Sharma',
    customerNumber: '9876543211',
    customerId: 'CUST-002',
    quantity: 3000,
    pricePerBrick: 10.5,
    paperPrice: 31500,
    location: '456 Brigade Road, Bangalore',
    finalPrice: 31500,
    paymentStatus: 'Partially Paid',
    amountPaid: 15000,
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
  {
    id: 'ORD-003',
    date: '2025-12-06',
    deliveryDate: '2025-12-07',
    customerName: 'Amit Patel',
    customerNumber: '9876543212',
    customerId: 'CUST-003',
    quantity: 7500,
    pricePerBrick: 9.8,
    paperPrice: 73500,
    location: '789 Koramangala, Bangalore',
    finalPrice: 73500,
    paymentStatus: 'Fully Paid',
    amountPaid: 73500,
    loadMen: ['Mohan Singh'],
    deliveryToday: false,
    isDelivered: true,
    deliveryChallanNumber: 'DC20251207001',
    gstNumber: '29ABCDE1234F1Z5',
  },
  {
    id: 'ORD-004',
    date: '2025-12-05',
    deliveryDate: '2025-12-09',
    customerName: 'Sunita Reddy',
    customerNumber: '9876543213',
    customerId: 'CUST-004',
    quantity: 4000,
    pricePerBrick: 10.2,
    paperPrice: 40800,
    location: '321 Indiranagar, Bangalore',
    finalPrice: 40800,
    paymentStatus: 'Partially Paid',
    amountPaid: 20000,
    loadMen: [],
    deliveryToday: false,
    isDelivered: true,
    deliveryChallanNumber: 'DC20251209001',
  },
  {
    id: 'ORD-005',
    date: '2025-12-04',
    deliveryDate: '2025-12-10',
    customerName: 'Vijay Singh',
    customerNumber: '9876543214',
    customerId: 'CUST-005',
    quantity: 6000,
    pricePerBrick: 10,
    paperPrice: 60000,
    location: '654 Whitefield, Bangalore',
    finalPrice: 60000,
    paymentStatus: 'Not Paid',
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
  {
    id: 'ORD-006',
    date: '2025-12-03',
    deliveryDate: '2025-12-11',
    customerName: 'Lakshmi Rao',
    customerNumber: '9876543215',
    customerId: 'CUST-006',
    quantity: 8000,
    pricePerBrick: 9.5,
    paperPrice: 76000,
    location: '789 Electronic City, Bangalore',
    finalPrice: 76000,
    paymentStatus: 'Partially Paid',
    amountPaid: 40000,
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
  {
    id: 'ORD-007',
    date: '2025-12-02',
    deliveryDate: '2025-12-08',
    customerName: 'Karthik Menon',
    customerNumber: '9876543216',
    customerId: 'CUST-007',
    quantity: 4500,
    pricePerBrick: 10.3,
    paperPrice: 46350,
    location: '123 Jayanagar, Bangalore',
    finalPrice: 46350,
    paymentStatus: 'Fully Paid',
    amountPaid: 46350,
    loadMen: ['Ramesh Patel'],
    deliveryToday: false,
    isDelivered: true,
    deliveryChallanNumber: 'DC20251208002',
  },
  {
    id: 'ORD-008',
    date: '2025-12-01',
    deliveryDate: '2025-12-12',
    customerName: 'Anita Desai',
    customerNumber: '9876543217',
    customerId: 'CUST-008',
    quantity: 5500,
    pricePerBrick: 9.9,
    paperPrice: 54450,
    location: '456 HSR Layout, Bangalore',
    finalPrice: 54450,
    paymentStatus: 'Not Paid',
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
  {
    id: 'ORD-009',
    date: '2025-11-30',
    deliveryDate: '2025-12-13',
    customerName: 'Ramesh Iyer',
    customerNumber: '9876543218',
    customerId: 'CUST-009',
    quantity: 7000,
    pricePerBrick: 10.1,
    paperPrice: 70700,
    location: '789 BTM Layout, Bangalore',
    finalPrice: 70700,
    paymentStatus: 'Partially Paid',
    amountPaid: 35000,
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
  {
    id: 'ORD-010',
    date: '2025-11-29',
    deliveryDate: '2025-12-14',
    customerName: 'Deepa Nair',
    customerNumber: '9876543219',
    customerId: 'CUST-010',
    quantity: 6500,
    pricePerBrick: 9.7,
    paperPrice: 63050,
    location: '321 Marathahalli, Bangalore',
    finalPrice: 63050,
    paymentStatus: 'Fully Paid',
    amountPaid: 63050,
    loadMen: ['Gopal Reddy'],
    deliveryToday: false,
    isDelivered: true,
    deliveryChallanNumber: 'DC20251214001',
  },
  {
    id: 'ORD-011',
    date: '2025-11-28',
    deliveryDate: '2025-12-15',
    customerName: 'Arun Kumar',
    customerNumber: '9876543220',
    customerId: 'CUST-011',
    quantity: 5200,
    pricePerBrick: 10.4,
    paperPrice: 54080,
    location: '654 Rajajinagar, Bangalore',
    finalPrice: 54080,
    paymentStatus: 'Not Paid',
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
  {
    id: 'ORD-012',
    date: '2025-11-27',
    deliveryDate: '2025-12-16',
    customerName: 'Meena Krishnan',
    customerNumber: '9876543221',
    customerId: 'CUST-012',
    quantity: 4800,
    pricePerBrick: 9.6,
    paperPrice: 46080,
    location: '789 Malleshwaram, Bangalore',
    finalPrice: 46080,
    paymentStatus: 'Partially Paid',
    amountPaid: 25000,
    loadMen: [],
    deliveryToday: false,
    isDelivered: false,
  },
];

export function OrderManagementScreen({ onNavigate, onOrderSelect }: OrderManagementScreenProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('Today');
  const [displayCount, setDisplayCount] = useState(10);

  const getFilteredOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'Today':
        return MOCK_ORDERS.filter(order => !order.isDelivered && order.deliveryDate === today);
      case 'Undelivered':
        return MOCK_ORDERS.filter(order => !order.isDelivered);
      case 'Delivered':
        return MOCK_ORDERS.filter(order => order.isDelivered);
      case 'Unpaid':
        return MOCK_ORDERS.filter(
          order => order.isDelivered && (order.paymentStatus === 'Not Paid' || order.paymentStatus === 'Partially Paid')
        );
      default:
        return MOCK_ORDERS;
    }
  };

  const filteredOrders = getFilteredOrders();
  const displayedOrders = filteredOrders.slice(0, displayCount);
  const hasMore = displayCount < filteredOrders.length;

  const isOrderOverdue = (order: AdminOrder) => {
    const today = new Date().toISOString().split('T')[0];
    return !order.isDelivered && order.deliveryDate < today;
  };

  const handleToggleDeliveryToday = (orderId: string) => {
    // In a real app, this would update the order
    console.log('Toggle delivery today for order:', orderId);
  };

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
              <h1 className="text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-1">Manage all customer orders</p>
            </div>
            <button
              onClick={() => onNavigate('create-order')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Order
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {(['Today', 'Undelivered', 'Delivered', 'Unpaid'] as OrderTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setDisplayCount(10);
                  }}
                  className={`px-6 py-4 whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {displayedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No orders at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View - Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-gray-700">Delivery Date</th>
                        <th className="px-4 py-3 text-left text-gray-700">Customer</th>
                        <th className="px-4 py-3 text-left text-gray-700">Phone</th>
                        <th className="px-4 py-3 text-left text-gray-700">Quantity</th>
                        <th className="px-4 py-3 text-left text-gray-700">Final Price</th>
                        <th className="px-4 py-3 text-left text-gray-700">Payment</th>
                        {activeTab === 'Delivered' && (
                          <th className="px-4 py-3 text-left text-gray-700">DC No</th>
                        )}
                        {activeTab === 'Undelivered' && (
                          <th className="px-4 py-3 text-left text-gray-700">Delivery Today</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedOrders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => onOrderSelect(order)}
                          className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                            isOrderOverdue(order) ? 'text-red-600' : ''
                          }`}
                        >
                          <td className="px-4 py-4">{order.id}</td>
                          <td className="px-4 py-4">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="px-4 py-4">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                          <td className="px-4 py-4">{order.customerName}</td>
                          <td className="px-4 py-4">{order.customerNumber}</td>
                          <td className="px-4 py-4">{order.quantity.toLocaleString()}</td>
                          <td className="px-4 py-4">₹{order.finalPrice.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-sm ${
                                order.paymentStatus === 'Fully Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : order.paymentStatus === 'Partially Paid'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          {activeTab === 'Delivered' && (
                            <td className="px-4 py-4">{order.deliveryChallanNumber || '-'}</td>
                          )}
                          {activeTab === 'Undelivered' && (
                            <td className="px-4 py-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={order.deliveryToday}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleToggleDeliveryToday(order.id);
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="lg:hidden space-y-4">
                  {displayedOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => onOrderSelect(order)}
                      className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                        isOrderOverdue(order) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className={`${isOrderOverdue(order) ? 'text-red-900' : 'text-gray-900'}`}>
                            {order.id}
                          </p>
                          <p className="text-gray-600 text-sm">{order.customerName}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            order.paymentStatus === 'Fully Paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'Partially Paid'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Delivery Date</p>
                          <p className={isOrderOverdue(order) ? 'text-red-700' : 'text-gray-900'}>
                            {new Date(order.deliveryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className={isOrderOverdue(order) ? 'text-red-700' : 'text-gray-900'}>
                            {order.quantity.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Final Price</p>
                          <p className={isOrderOverdue(order) ? 'text-red-700' : 'text-gray-900'}>
                            ₹{order.finalPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className={isOrderOverdue(order) ? 'text-red-700' : 'text-gray-900'}>
                            {order.customerNumber}
                          </p>
                        </div>
                        {activeTab === 'Delivered' && order.deliveryChallanNumber && (
                          <div className="col-span-2">
                            <p className="text-gray-500">DC No</p>
                            <p className="text-gray-900">{order.deliveryChallanNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}