import React from "react";
import { ArrowLeft, MapPin, Phone, Package } from "lucide-react";
import { Order } from "./EmployeeApp";
import { useNavigate } from "react-router-dom";

// Mock undelivered orders
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customerName: "Rajesh Kumar",
    customerNumber: "9876543210",
    location: "123 MG Road, Bangalore",
    quantity: 5000,
    amount: 50000,
  },
  {
    id: "ORD-002",
    customerName: "Priya Sharma",
    customerNumber: "9876543211",
    location: "456 Brigade Road, Bangalore",
    quantity: 3000,
    amount: 30000,
  },
  {
    id: "ORD-003",
    customerName: "Amit Patel",
    customerNumber: "9876543212",
    location: "789 Koramangala, Bangalore",
    quantity: 7500,
    amount: 75000,
  },
  {
    id: "ORD-004",
    customerName: "Sunita Reddy",
    customerNumber: "9876543213",
    location: "321 Indiranagar, Bangalore",
    quantity: 4000,
    amount: 40000,
  },
  {
    id: "ORD-005",
    customerName: "Vijay Singh",
    customerNumber: "9876543214",
    location: "654 Whitefield, Bangalore",
    quantity: 6000,
    amount: 60000,
  },
];

export function OrdersScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/employee/home")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <h1 className="text-gray-900">Undelivered Orders</h1>
          <p className="text-gray-600 mt-1">
            Select an order to enter delivery details
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => (
            <button
              key={order.id}
              onClick={() =>
                navigate(`/employee/orders/${order.id}/delivery`, {
                  state: order,
                })
              }
              className="w-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{order.customerName}</h3>
                  <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    Pending Delivery
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone Number</p>
                    <p className="text-gray-900">{order.customerNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Quantity</p>
                    <p className="text-gray-900">
                      {order.quantity.toLocaleString()} bricks
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-900 truncate">{order.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Order Amount</p>
                  <p className="text-gray-900">
                    ₹{order.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  Select Order →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
