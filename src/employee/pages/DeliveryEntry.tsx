import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Order } from "../types";
import { Popup } from "../../components/Popup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDelivery } from "../hooks/useDelivery";
import { useLoadMen } from "../hooks/useLoadMen";
import { validateDelivery } from "../validators/delivery.validator";
import { DeliveryInput, PaymentStatus } from "../types";
import { TIME_SLOTS } from "../constants/timeSlots";

export function DeliveryEntry() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId } = useParams(); // used later for API fetching
  const { submitDelivery, loading, error } = useDelivery();
  const {
    loadMen,
    loading: loadMenLoading,
    error: loadMenError,
  } = useLoadMen();
  const order = state as Order | null;

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [quantity, setQuantity] = useState(order ? String(order.quantity) : "");
  const [payment, setPayment] = useState<PaymentStatus>("Pending");
  const [paidAmount, setPaidAmount] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [deliveryChallanNumber, setDeliveryChallanNumber] = useState("");
  const [selectedLoadMen, setSelectedLoadMen] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split("T")[0];

  const handleLoadManToggle = (loadMan: string) => {
    setSelectedLoadMen((prev) =>
      prev.includes(loadMan)
        ? prev.filter((m) => m !== loadMan)
        : [...prev, loadMan]
    );
  };
  if (!order) {
    return <div>Order not found</div>;
  }

  const safeOrder = order;

  const handleSubmit = async () => {
    const payload: DeliveryInput = {
      orderId: safeOrder.id,
      date,
      time,
      quantity: Number(quantity),
      paymentStatus: payment,
      paidAmount: paidAmount ? Number(paidAmount) : undefined,
      gstNumber,
      deliveryChallanNumber,
      loadMen: selectedLoadMen,
    };

    const validationErrors = validateDelivery(payload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await submitDelivery(payload);
      setShowSuccessPopup(true);
    } catch {
      setShowFailurePopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    navigate("/employee/home");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/employee/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <h1 className="text-gray-900">Delivery Entry</h1>
          <p className="text-gray-600 mt-1">Enter the delivery details</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Order ID */}
            <div>
              <label htmlFor="orderId" className="block text-gray-700 mb-2">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={order?.id}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Customer Number */}
            <div>
              <label
                htmlFor="customerNumber"
                className="block text-gray-700 mb-2"
              >
                Customer Number
              </label>
              <input
                id="customerNumber"
                type="text"
                value={order?.customerNumber}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-gray-700 mb-2"
              >
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                value={order?.customerName}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
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
                max={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-gray-700 mb-2">
                Time <span className="text-red-600">*</span>
              </label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select Time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-red-600 text-sm mt-1">{errors.time}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 mb-2">
                Quantity (bricks) <span className="text-red-600">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="0"
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-700 mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={order?.location}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Actual Amount */}
            <div>
              <label
                htmlFor="actualAmount"
                className="block text-gray-700 mb-2"
              >
                Actual Amount
              </label>
              <input
                id="actualAmount"
                type="text"
                value={`₹${order?.amount.toLocaleString()}`}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Payment */}
            <div>
              <label htmlFor="payment" className="block text-gray-700 mb-2">
                Payment <span className="text-red-600">*</span>
              </label>
              <select
                id="payment"
                value={payment}
                onChange={(e) => setPayment(e.target.value as PaymentStatus)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Partially paid">Partially paid</option>
                <option value="Fully paid">Fully paid</option>
              </select>
            </div>

            {/* Paid Amount - Conditional */}
            {payment === "Partially paid" && (
              <div>
                <label
                  htmlFor="paidAmount"
                  className="block text-gray-700 mb-2"
                >
                  Paid Amount <span className="text-red-600">*</span>
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="Enter paid amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0.01"
                  step="0.01"
                />
                {errors.paidAmount && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.paidAmount}
                  </p>
                )}
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
                  const value = e.target.value;
                  // Only allow alphanumeric characters (GST format)
                  if (/^[A-Za-z0-9]*$/.test(value)) {
                    setGstNumber(value.toUpperCase());
                  }
                }}
                placeholder="Enter GST number (optional)"
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Delivery Challan Number */}
            <div>
              <label
                htmlFor="deliveryChallanNumber"
                className="block text-gray-700 mb-2"
              >
                Delivery Challan Number <span className="text-red-600">*</span>
              </label>
              <input
                id="deliveryChallanNumber"
                type="number"
                value={deliveryChallanNumber}
                onChange={(e) => setDeliveryChallanNumber(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Enter delivery challan number"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.deliveryChallanNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.deliveryChallanNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.deliveryChallanNumber}
                </p>
              )}
            </div>

            {/* Load Man - Multi-select */}
            <div>
              <label className="block text-gray-700 mb-2">
                Load Man <span className="text-red-600">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="space-y-2">
                  {loadMen.map((loadMan) => (
                    <label
                      key={loadMan.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLoadMen.includes(loadMan.id)}
                        onChange={() => handleLoadManToggle(loadMan.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900">{loadMan.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {errors.loadMen && (
                <p className="text-red-600 text-sm mt-1">{errors.loadMen}</p>
              )}
              {selectedLoadMen.length > 0 && (
                <p className="text-gray-600 text-sm mt-2">
                  Selected: {selectedLoadMen.join(", ")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg transition-colors
             hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400
             disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Delivery Entry Successful"
          message="Delivery details have been recorded successfully."
          onClose={handlePopupClose}
          type="success"
        />
      )}

      {showFailurePopup && (
        <Popup
          title="Delivery Entry Failed"
          message={error}
          onClose={() => setShowFailurePopup(false)}
          type="error"
        />
      )}
    </div>
  );
}
