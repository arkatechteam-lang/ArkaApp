import React, { useState } from 'react';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import {  AdminOrder } from '../../../AdminApp';
import { Popup } from '../../../components/Popup';
import { Calendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { format } from 'date-fns';
import { cn } from '../../../components/ui/utils';
import { useParams,useNavigate,useLocation } from 'react-router-dom';


type PaymentStatus = 'Not Paid' | 'Partially Paid' | 'Fully Paid';

const LOAD_MEN = ['Raju Kumar', 'Suresh Yadav', 'Mohan Singh', 'Ramesh Patel', 'Gopal Reddy'];

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

export function OrderDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const {orderId} = useParams<{ orderId: string }>();
  console.log('Order ID:', orderId);
  const order = MOCK_ORDERS.find((o) => o.id == orderId);

  if (!order) {
    return <div>Order not found</div>;
  }

  const [brickQuantity, setBrickQuantity] = useState(order.quantity.toString());
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(new Date(order.deliveryDate));
  const [pricePerBrick, setPricePerBrick] = useState(order.pricePerBrick.toString());
  const [deliveryLocation, setDeliveryLocation] = useState(order.location);
  const [finalPrice, setFinalPrice] = useState(order.finalPrice.toString());
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [amountPaid, setAmountPaid] = useState(order.amountPaid?.toString() || '');
  const [selectedLoadMen, setSelectedLoadMen] = useState<string[]>(order.loadMen || []);
  const [gstNumber, setGstNumber] = useState(order.gstNumber || '');
  const [deliveryChallanNumber, setDeliveryChallanNumber] = useState(order.deliveryChallanNumber || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Calculate paper price automatically
  const paperPrice = brickQuantity && pricePerBrick 
    ? (parseFloat(brickQuantity) * parseFloat(pricePerBrick)).toFixed(2)
    : '';

  const handleLoadManToggle = (loadMan: string) => {
    setSelectedLoadMen((prev) =>
      prev.includes(loadMan) ? prev.filter((m) => m !== loadMan) : [...prev, loadMan]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!brickQuantity) {
      newErrors.brickQuantity = 'Brick quantity is required';
    }
    
    if (!deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }

    if (!pricePerBrick) {
      newErrors.pricePerBrick = 'Price per brick is required';
    } else if (parseFloat(pricePerBrick) <= 0) {
      newErrors.pricePerBrick = 'Price per brick must be greater than 0';
    }

    if (!deliveryLocation) newErrors.deliveryLocation = 'Delivery location is required';
    if (!finalPrice) newErrors.finalPrice = 'Final price is required';

    if (paymentStatus === 'Partially Paid') {
      if (!amountPaid) {
        newErrors.amountPaid = 'Amount paid is required';
      } else {
        const paidValue = parseFloat(amountPaid);
        const finalValue = parseFloat(finalPrice);
        if (paidValue <= 0) {
          newErrors.amountPaid = 'Amount paid must be greater than 0';
        } else if (paidValue >= finalValue) {
          newErrors.amountPaid = 'Amount paid must be less than final price';
        }
      }
    }

    // Validate GST Number - if entered, must be exactly 15 characters
    if (gstNumber && gstNumber.length !== 15) {
      newErrors.gstNumber = 'Enter valid GST Number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      setShowSuccessPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/admin/orders', { replace: true });
  };

  const handleBack = () => {
  if (location.state?.from) {
    navigate(location.state.from);
  } else {
    navigate('/admin/orders', { replace: true });
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <h1 className="text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Edit order information - {order.id}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Customer Info - Read Only */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700 mb-1">Customer: {order.customerName}</p>
              <p className="text-gray-600 text-sm">Phone: {order.customerNumber}</p>
              <p className="text-gray-600 text-sm">Order Date: {new Date(order.date).toLocaleDateString()}</p>
              {order.isDelivered && (
                <p className="text-gray-600 text-sm mt-2">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Delivered
                  </span>
                </p>
              )}
            </div>

            {/* Brick Quantity */}
            <div>
              <label htmlFor="brickQuantity" className="block text-gray-700 mb-2">
                Brick Quantity <span className="text-red-600">*</span>
              </label>
              <input
                id="brickQuantity"
                type="number"
                value={brickQuantity}
                onChange={(e) => setBrickQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="1"
              />
              {errors.brickQuantity && <p className="text-red-600 text-sm mt-1">{errors.brickQuantity}</p>}
            </div>

            {/* Delivery Date - Editable with Date Picker */}
            <div>
              <label htmlFor="deliveryDate" className="block text-gray-700 mb-2">
                Delivery Date <span className="text-red-600">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-left",
                      !deliveryDate && "text-gray-400"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {deliveryDate ? format(deliveryDate, 'PPP') : 'Select delivery date'}
                      </span>
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.deliveryDate && <p className="text-red-600 text-sm mt-1">{errors.deliveryDate}</p>}
            </div>

            {/* Price Per Brick */}
            <div>
              <label htmlFor="pricePerBrick" className="block text-gray-700 mb-2">
                Price Per Brick <span className="text-red-600">*</span>
              </label>
              <input
                id="pricePerBrick"
                type="number"
                value={pricePerBrick}
                onChange={(e) => setPricePerBrick(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                step="0.01"
                min="0.01"
              />
              {errors.pricePerBrick && <p className="text-red-600 text-sm mt-1">{errors.pricePerBrick}</p>}
            </div>

            {/* Paper Price - Auto-calculated and disabled */}
            <div>
              <label htmlFor="paperPrice" className="block text-gray-700 mb-2">
                Paper Price
              </label>
              <input
                id="paperPrice"
                type="text"
                value={paperPrice ? `₹${parseFloat(paperPrice).toLocaleString()}` : ''}
                disabled
                placeholder="Calculated automatically"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              <p className="text-gray-500 text-sm mt-1">
                Auto-calculated: Brick Quantity × Price Per Brick
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-700 mb-2">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {errors.deliveryLocation && <p className="text-red-600 text-sm mt-1">{errors.deliveryLocation}</p>}
            </div>

            {/* Final Price */}
            <div>
              <label htmlFor="finalPrice" className="block text-gray-700 mb-2">
                Final Price <span className="text-red-600">*</span>
              </label>
              <input
                id="finalPrice"
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="0.01"
                step="0.01"
              />
              {finalPrice && brickQuantity && (
                <p className="text-red-600 text-sm mt-1">
                  Price per brick: ₹{(parseFloat(finalPrice) / parseFloat(brickQuantity)).toFixed(2)}
                </p>
              )}
              {errors.finalPrice && <p className="text-red-600 text-sm mt-1">{errors.finalPrice}</p>}
            </div>

            {/* Payment Status */}
            <div>
              <label htmlFor="paymentStatus" className="block text-gray-700 mb-2">
                Payment Status <span className="text-red-600">*</span>
              </label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Not Paid">Not Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Fully Paid">Fully Paid</option>
              </select>
            </div>

            {/* Amount Paid - Conditional */}
            {paymentStatus === 'Partially Paid' && (
              <div>
                <label htmlFor="amountPaid" className="block text-gray-700 mb-2">
                  Amount Paid <span className="text-red-600">*</span>
                </label>
                <input
                  id="amountPaid"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0.01"
                  step="0.01"
                />
                {errors.amountPaid && <p className="text-red-600 text-sm mt-1">{errors.amountPaid}</p>}
              </div>
            )}

            {/* GST Number */}
            <div>
              <label htmlFor="gstNumber" className="block text-gray-700 mb-2">
                GST Number
              </label>
              <input
                id="gstNumber"
                type="text"
                value={gstNumber}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  if (value.length <= 15) {
                    setGstNumber(value);
                  }
                }}
                placeholder="Enter GST Number"
                maxLength={15}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.gstNumber ? 'border-red-600' : 'border-gray-300'
                }`}
              />
              {errors.gstNumber && <p className="text-red-600 text-sm mt-1">{errors.gstNumber}</p>}
            </div>

            {/* Delivery Challan Number */}
            <div>
              <label htmlFor="deliveryChallanNumber" className="block text-gray-700 mb-2">
                Delivery Challan Number
              </label>
              <input
                id="deliveryChallanNumber"
                type="number"
                value={deliveryChallanNumber}
                onChange={(e) => setDeliveryChallanNumber(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter Delivery Challan Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Load Men */}
            <div>
              <label className="block text-gray-700 mb-2">Load Men</label>
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="space-y-2">
                  {LOAD_MEN.map((loadMan) => (
                    <label
                      key={loadMan}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLoadMen.includes(loadMan)}
                        onChange={() => handleLoadManToggle(loadMan)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900">{loadMan}</span>
                    </label>
                  ))}
                </div>
              </div>
              {selectedLoadMen.length > 0 && (
                <p className="text-gray-600 text-sm mt-2">
                  Selected: {selectedLoadMen.join(', ')}
                </p>
              )}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Order Edited Successfully"
          message="The order has been updated successfully."
          onClose={handlePopupClose}
          type="success"
        />
      )}
    </div>
  );
}