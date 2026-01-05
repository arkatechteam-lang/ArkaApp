import React, { useState } from "react";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Screen } from "./EmployeeApp";
import { Popup } from "../../components/Popup";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
import { cn } from "../../components/ui/utils";
import { useNavigate } from "react-router-dom";

type Material =
  | "Wet Ash"
  | "Marble Powder"
  | "Crusher Powder"
  | "Fly Ash Powder"
  | "Cement";

const MATERIALS: Material[] = [
  "Wet Ash",
  "Marble Powder",
  "Crusher Powder",
  "Fly Ash Powder",
  "Cement",
];

const MATERIAL_UNITS: Record<Material, string> = {
  "Wet Ash": "tons",
  "Marble Powder": "tons",
  "Crusher Powder": "units",
  "Fly Ash Powder": "tons",
  Cement: "bags",
};

const VENDORS = [
  "ABC Suppliers",
  "XYZ Materials",
  "Prime Vendors",
  "Best Quality Co.",
  "Reliable Suppliers",
];

export function MaterialPurchaseEntry() {
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | "">("");
  const [vendor, setVendor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!material) newErrors.material = "Material is required";
    if (!vendor) newErrors.vendor = "Vendor is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowSuccessPopup(true);
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
            onClick={() => navigate("/employee/home")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-gray-900">Material Purchase Entry</h1>
          <p className="text-gray-600 mt-1">
            Enter the details of material purchase
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {/* Material */}
            <div>
              <label htmlFor="material" className="block text-gray-700 mb-2">
                Material <span className="text-red-600">*</span>
              </label>
              <select
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value as Material)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select Material</option>
                {MATERIALS.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
              {errors.material && (
                <p className="text-red-600 text-sm mt-1">{errors.material}</p>
              )}
            </div>

            {/* Vendor */}
            <div>
              <label htmlFor="vendor" className="block text-gray-700 mb-2">
                Vendor <span className="text-red-600">*</span>
              </label>
              <select
                id="vendor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select Vendor</option>
                {VENDORS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {errors.vendor && (
                <p className="text-red-600 text-sm mt-1">{errors.vendor}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 mb-2">
                Quantity {material && `(${MATERIAL_UNITS[material]})`}{" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder={`Enter quantity${
                  material ? ` in ${MATERIAL_UNITS[material]}` : ""
                }`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min="0"
                step="0.01"
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2">
                Date <span className="text-red-600">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-left",
                      !date && "text-gray-400"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {date ? format(date, "PPP") : "Select a date"}
                      </span>
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Purchase Successful"
          message="Material purchase entry has been recorded successfully."
          onClose={handlePopupClose}
          type="purchase"
        />
      )}
    </div>
  );
}
