import React, { useState } from 'react';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { Popup } from '../../../../components/Popup';
import { CustomerCreationModal } from '../../../../components/admin/CustomerCreationModal';
import { Calendar } from '../../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { format } from 'date-fns';
import { cn } from '../../../../components/ui/utils';
import { useAdminNavigation } from '../../../hooks/useAdminNavigation';

type PaymentStatus = 'Not Paid' | 'Partially Paid' | 'Fully Paid';

const LOAD_MEN = ['Raju Kumar', 'Suresh Yadav', 'Mohan Singh', 'Ramesh Patel', 'Gopal Reddy'];

const MOCK_CUSTOMERS = [
  { id: 'CUST-001', name: 'Rajesh Kumar', phone: '9876543210', gstNumber: '29ABCDE1234F1Z5' },
  { id: 'CUST-002', name: 'Priya Sharma', phone: '9876543211' },
  { id: 'CUST-003', name: 'Amit Patel', phone: '9876543212', gstNumber: '27WXYZ56789A1B2' },
];

export function CreateOrderScreen() {
  const { goBack } = useAdminNavigation();
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [brickQuantity, setBrickQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [pricePerBrick, setPricePerBrick] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Not Paid');
  const [amountPaid, setAmountPaid] = useState('');
  const [selectedLoadMen, setSelectedLoadMen] = useState<string[]>([]);
  const [gstNumber, setGstNumber] = useState('');
  const [deliveryChallanNumber, setDeliveryChallanNumber] = useState('');
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

    if (!selectedCustomer) newErrors.customer = 'Customer is required';
    if (!brickQuantity) {
      newErrors.brickQuantity = 'Brick quantity is required';
    }
    if (!deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    
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

  const handleCreate = () => {
    if (validateForm()) {
      setShowSuccessPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    goBack('/admin/orders');
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.phone.includes(customerSearch) ||
      c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => goBack('/admin/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <h1 className="text-gray-900">Create Order</h1>
          <p className="text-gray-600 mt-1">Create a new customer order</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Customer Search */}
            <div>
              <label htmlFor="customer" className="block text-gray-700 mb-2">
                Customer <span className="text-red-600">*</span>
              </label>
              <input
                id="customer"
                type="text"
                value={selectedCustomer ? `${selectedCustomer.phone}, ${selectedCustomer.name}` : customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setSelectedCustomer(null);
                }}
                placeholder="Search by phone number or name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {customerSearch && !selectedCustomer && filteredCustomers.length > 0 && (
                <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch('');
                        // Prefill GST number if customer has one
                        if (customer.gstNumber) {
                          setGstNumber(customer.gstNumber);
                        }
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      {customer.phone}, {customer.name}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-gray-600 text-sm mt-2">
                Need to add customer?{' '}
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="text-blue-600 hover:underline"
                >
                  Go to create customer
                </button>
              </p>
              {errors.customer && <p className="text-red-600 text-sm mt-1">{errors.customer}</p>}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed outline-none"
              />
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
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter quantity"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="1"
              />
              {errors.brickQuantity && <p className="text-red-600 text-sm mt-1">{errors.brickQuantity}</p>}
            </div>

            {/* Delivery Date */}
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
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter price per brick"
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
                placeholder="Enter delivery location"
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
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter final price"
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
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="Enter amount paid"
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

            {/* Load Men - Multi-select */}
            <div>
              <label className="block text-gray-700 mb-2">Load Men (Optional)</label>
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

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Order Placed Successfully"
          message="The order has been created successfully."
          onClose={handlePopupClose}
          type="success"
        />
      )}

      {/* Customer Creation Modal */}
      {showCustomerModal && (
        <CustomerCreationModal onClose={() => setShowCustomerModal(false)} />
      )}
    </div>
  );
}