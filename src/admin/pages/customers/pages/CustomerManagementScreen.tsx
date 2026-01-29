import React, { useState } from "react";
import { AdminScreen, Customer } from "../../../../AdminApp";
import {
  ArrowLeft,
  Plus,
  Search,
  Phone,
  MapPin,
  DollarSign,
  X,
} from "lucide-react";
import { Popup } from "../../../../components/Popup";
import {useAdminNavigation} from "../../../hooks/useAdminNavigation";

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "Rajesh Kumar",
    phoneNumber: "9876543210",
    address: "123 MG Road, Bangalore",
    unpaidAmount: 15000,
    totalSales: 250000,
  },
  {
    id: "CUST-002",
    name: "Priya Sharma",
    phoneNumber: "9876543211",
    address: "456 Brigade Road, Bangalore",
    unpaidAmount: 0,
    totalSales: 180000,
  },
  {
    id: "CUST-003",
    name: "Amit Patel",
    phoneNumber: "9876543212",
    address: "789 Koramangala, Bangalore",
    unpaidAmount: 25000,
    totalSales: 320000,
  },
  {
    id: "CUST-004",
    name: "Sunita Reddy",
    phoneNumber: "9876543213",
    address: "321 Indiranagar, Bangalore",
    unpaidAmount: 8000,
    totalSales: 145000,
  },
  {
    id: "CUST-005",
    name: "Mohan Singh",
    phoneNumber: "9876543214",
    address: "654 Whitefield, Bangalore",
    unpaidAmount: 0,
    totalSales: 95000,
  },
  {
    id: "CUST-006",
    name: "Lakshmi Iyer",
    phoneNumber: "9876543215",
    address: "987 Jayanagar, Bangalore",
    unpaidAmount: 12000,
    totalSales: 210000,
  },
  {
    id: "CUST-007",
    name: "Ramesh Gupta",
    phoneNumber: "9876543216",
    address: "147 BTM Layout, Bangalore",
    unpaidAmount: 0,
    totalSales: 165000,
  },
  {
    id: "CUST-008",
    name: "Anita Desai",
    phoneNumber: "9876543217",
    address: "258 HSR Layout, Bangalore",
    unpaidAmount: 18000,
    totalSales: 275000,
  },
];

export function CustomerManagementScreen() {
  const { goBack, goTo } = useAdminNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(10);
  const [activeTab, setActiveTab] = useState<"All" | "Unpaid">("All");
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Add Customer Form States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerGstNumber, setCustomerGstNumber] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [gstError, setGstError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setGstError("");

    if (!customerName.trim()) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!customerPhone.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(customerPhone.trim())) {
      setPhoneError("Phone number must be 10 digits");
      isValid = false;
    }

    if (!customerAddress.trim()) {
      setAddressError("Address is required");
      isValid = false;
    }

    // Validate GST Number - if entered, must be exactly 15 characters
    if (customerGstNumber.trim() && customerGstNumber.trim().length !== 15) {
      setGstError("Enter valid GST Number");
      isValid = false;
    }

    return isValid;
  };

  const handleOpenAddCustomerModal = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerGstNumber("");
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setGstError("");
    setShowAddCustomerModal(true);
  };

  const handleCloseAddCustomerModal = () => {
    setShowAddCustomerModal(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerGstNumber("");
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setGstError("");
  };

  const handleSubmitCustomer = () => {
    if (validateForm()) {
      // In a real app, this would save the customer
      setShowAddCustomerModal(false);
      setShowSuccessPopup(true);
      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerGstNumber("");
      setNameError("");
      setPhoneError("");
      setAddressError("");
      setGstError("");
    }
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Unpaid" && customer.unpaidAmount > 0);

    return matchesSearch && matchesTab;
  });

  const displayedCustomers = filteredCustomers.slice(0, displayCount);
  const hasMore = displayCount < filteredCustomers.length;

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
              <h1 className="text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">
                Manage customer information and history
              </p>
            </div>
            <button
              onClick={handleOpenAddCustomerModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, phone, or customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-gray-900 mt-1">{MOCK_CUSTOMERS.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="text-gray-900 mt-1">
                  ₹
                  {MOCK_CUSTOMERS.reduce(
                    (sum, c) => sum + c.totalSales,
                    0,
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Outstanding Amount</p>
                <p className="text-gray-900 mt-1">
                  ₹
                  {MOCK_CUSTOMERS.reduce(
                    (sum, c) => sum + c.unpaidAmount,
                    0,
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("All");
                  setDisplayCount(10);
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === "All"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setActiveTab("Unpaid");
                  setDisplayCount(10);
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === "Unpaid"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Unpaid
              </button>
            </div>
          </div>

          <div className="p-6">
            {displayedCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No customers found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop View - Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">
                          Customer ID
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700">
                          Phone Number
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700">
                          Address
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700">
                          Total Sales
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700">
                          Unpaid Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          onClick={() => goTo(`/admin/customers/${customer.id}`)}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-gray-900">
                            {customer.id}
                          </td>
                          <td className="px-4 py-4 text-gray-900">
                            {customer.name}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {customer.phoneNumber}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {customer.address}
                          </td>
                          <td className="px-4 py-4 text-gray-900">
                            ₹{customer.totalSales.toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                customer.unpaidAmount > 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {customer.unpaidAmount > 0
                                ? `₹${customer.unpaidAmount.toLocaleString()}`
                                : "Paid"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="lg:hidden space-y-4">
                  {displayedCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => goTo(`/admin/customers/${customer.id}`)}
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-gray-900">{customer.name}</p>
                          <p className="text-gray-600 text-sm">{customer.id}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            customer.unpaidAmount > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {customer.unpaidAmount > 0
                            ? `₹${customer.unpaidAmount.toLocaleString()}`
                            : "Paid"}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.phoneNumber}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {customer.address}
                        </div>
                        <div className="flex items-center gap-2 text-gray-900">
                          <DollarSign className="w-4 h-4" />
                          Total Sales: ₹{customer.totalSales.toLocaleString()}
                        </div>
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

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-900">Add Customer</h2>
              <button
                onClick={handleCloseAddCustomerModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      nameError ? "border-red-500" : ""
                    }`}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      phoneError ? "border-red-500" : ""
                    }`}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      addressError ? "border-red-500" : ""
                    }`}
                  />
                  {addressError && (
                    <p className="text-red-500 text-sm mt-1">{addressError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerGstNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (value.length <= 15) {
                        setCustomerGstNumber(value);
                      }
                    }}
                    placeholder="Enter 15-character GST Number"
                    maxLength={15}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      gstError ? "border-red-500" : ""
                    }`}
                  />
                  {gstError && (
                    <p className="text-red-500 text-sm mt-1">{gstError}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseAddCustomerModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCustomer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Customer Added Successfully"
          message="The customer has been added to the system."
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}
