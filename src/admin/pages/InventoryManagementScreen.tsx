import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Droplets, Mountain, Sparkles, Hammer, Wind, Boxes } from 'lucide-react';
import { Popup } from '../../components/Popup';
import { useNavigate } from 'react-router-dom';

interface InventoryManagementScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

type FilterType = 'Last month' | 'Last year' | 'Custom range';
type TabType = 'Procurement' | 'Usage' | 'Adjustments';
type MaterialFilter = 'All' | 'Wet Ash' | 'Marble Powder' | 'Crusher Powder' | 'Fly Ash' | 'Cement';

interface ProcurementEntry {
  material: string;
  date: string;
  vendor: string;
  quantityValue: number;
  quantityUnit: string;
  finalPrice: number;
}

interface UsageEntry {
  date: string;
  bricks: number;
  round: number;
  wetAshKg: number;
  marblePowderKg: number;
  crusherPowderKg: number;
  flyAshKg: number;
  cementKg: number;
}

interface AdjustmentEntry {
  date: string;
  bricks: { actual: number; adjustment: number };
  wetAshKg: { actual: number; adjustment: number };
  marblePowderKg: { actual: number; adjustment: number };
  crusherPowderKg: { actual: number; adjustment: number };
  flyAshKg: { actual: number; adjustment: number };
  cementKg: { actual: number; adjustment: number };
}

// Mock data
const PROCUREMENT_DATA: ProcurementEntry[] = [
  { material: 'Wet Ash', date: '2025-12-27', vendor: 'ABC Suppliers', quantityValue: 5, quantityUnit: 'tons', finalPrice: 15000 },
  { material: 'Fly Ash', date: '2025-12-26', vendor: 'XYZ Materials', quantityValue: 3.5, quantityUnit: 'tons', finalPrice: 12000 },
  { material: 'Cement', date: '2025-12-26', vendor: 'DEF Industries', quantityValue: 40, quantityUnit: 'bags', finalPrice: 20000 },
  { material: 'Crusher Powder', date: '2025-12-25', vendor: 'ABC Suppliers', quantityValue: 450, quantityUnit: 'units', finalPrice: 18000 },
  { material: 'Marble Powder', date: '2025-12-25', vendor: 'Stone Suppliers', quantityValue: 2.5, quantityUnit: 'tons', finalPrice: 16000 },
  { material: 'Wet Ash', date: '2025-12-24', vendor: 'ABC Suppliers', quantityValue: 6, quantityUnit: 'tons', finalPrice: 16500 },
  { material: 'Fly Ash', date: '2025-12-23', vendor: 'XYZ Materials', quantityValue: 4, quantityUnit: 'tons', finalPrice: 13500 },
  { material: 'Cement', date: '2025-12-22', vendor: 'DEF Industries', quantityValue: 36, quantityUnit: 'bags', finalPrice: 18000 },
  { material: 'Crusher Powder', date: '2025-12-22', vendor: 'Stone Suppliers', quantityValue: 500, quantityUnit: 'units', finalPrice: 20000 },
  { material: 'Marble Powder', date: '2025-12-21', vendor: 'Stone Suppliers', quantityValue: 2.8, quantityUnit: 'tons', finalPrice: 17000 },
  { material: 'Wet Ash', date: '2025-12-20', vendor: 'ABC Suppliers', quantityValue: 5.5, quantityUnit: 'tons', finalPrice: 17000 },
  { material: 'Fly Ash', date: '2025-12-19', vendor: 'XYZ Materials', quantityValue: 3.8, quantityUnit: 'tons', finalPrice: 12800 },
  { material: 'Cement', date: '2025-12-18', vendor: 'DEF Industries', quantityValue: 45, quantityUnit: 'bags', finalPrice: 22500 },
  { material: 'Crusher Powder', date: '2025-12-17', vendor: 'ABC Suppliers', quantityValue: 480, quantityUnit: 'units', finalPrice: 19200 },
  { material: 'Marble Powder', date: '2025-12-16', vendor: 'Stone Suppliers', quantityValue: 3, quantityUnit: 'tons', finalPrice: 18000 },
];

const USAGE_DATA: UsageEntry[] = [
  { date: '2025-12-27', bricks: 22100, round: 6, wetAshKg: 3000, marblePowderKg: 1800, crusherPowderKg: 2200, flyAshKg: 2700, cementKg: 900 },
  { date: '2025-12-26', bricks: 23500, round: 6, wetAshKg: 3200, marblePowderKg: 1900, crusherPowderKg: 2300, flyAshKg: 2900, cementKg: 950 },
  { date: '2025-12-25', bricks: 19500, round: 5, wetAshKg: 2600, marblePowderKg: 1600, crusherPowderKg: 1900, flyAshKg: 2400, cementKg: 800 },
  { date: '2025-12-24', bricks: 21700, round: 6, wetAshKg: 2900, marblePowderKg: 1750, crusherPowderKg: 2100, flyAshKg: 2650, cementKg: 880 },
  { date: '2025-12-23', bricks: 22300, round: 6, wetAshKg: 3050, marblePowderKg: 1820, crusherPowderKg: 2180, flyAshKg: 2750, cementKg: 920 },
  { date: '2025-12-22', bricks: 24000, round: 6, wetAshKg: 3300, marblePowderKg: 1950, crusherPowderKg: 2350, flyAshKg: 2950, cementKg: 980 },
  { date: '2025-12-21', bricks: 20900, round: 5, wetAshKg: 2800, marblePowderKg: 1700, crusherPowderKg: 2050, flyAshKg: 2550, cementKg: 850 },
  { date: '2025-12-20', bricks: 22800, round: 6, wetAshKg: 3100, marblePowderKg: 1850, crusherPowderKg: 2220, flyAshKg: 2800, cementKg: 930 },
  { date: '2025-12-19', bricks: 21200, round: 5, wetAshKg: 2850, marblePowderKg: 1720, crusherPowderKg: 2080, flyAshKg: 2600, cementKg: 870 },
  { date: '2025-12-18', bricks: 23000, round: 6, wetAshKg: 3150, marblePowderKg: 1880, crusherPowderKg: 2250, flyAshKg: 2850, cementKg: 950 },
  { date: '2025-12-17', bricks: 20300, round: 5, wetAshKg: 2750, marblePowderKg: 1650, crusherPowderKg: 1980, flyAshKg: 2500, cementKg: 830 },
  { date: '2025-12-16', bricks: 21800, round: 6, wetAshKg: 2950, marblePowderKg: 1780, crusherPowderKg: 2150, flyAshKg: 2680, cementKg: 890 },
];

const ADJUSTMENT_DATA: AdjustmentEntry[] = [
  { 
    date: '2025-12-20', 
    bricks: { actual: 52000, adjustment: -500 }, 
    wetAshKg: { actual: 15000, adjustment: -200 }, 
    marblePowderKg: { actual: 8500, adjustment: -150 }, 
    crusherPowderKg: { actual: 10200, adjustment: -180 }, 
    flyAshKg: { actual: 12500, adjustment: -250 }, 
    cementKg: { actual: 4800, adjustment: -100 } 
  },
  { 
    date: '2025-12-15', 
    bricks: { actual: 48000, adjustment: -450 }, 
    wetAshKg: { actual: 14000, adjustment: -180 }, 
    marblePowderKg: { actual: 8000, adjustment: -120 }, 
    crusherPowderKg: { actual: 9600, adjustment: -150 }, 
    flyAshKg: { actual: 11800, adjustment: -200 }, 
    cementKg: { actual: 4500, adjustment: -80 } 
  },
  { 
    date: '2025-12-10', 
    bricks: { actual: 50000, adjustment: 300 }, 
    wetAshKg: { actual: 14500, adjustment: 100 }, 
    marblePowderKg: { actual: 8200, adjustment: 80 }, 
    crusherPowderKg: { actual: 9800, adjustment: 90 }, 
    flyAshKg: { actual: 12000, adjustment: 120 }, 
    cementKg: { actual: 4600, adjustment: 50 } 
  },
];

// Current inventory metrics
const INVENTORY_METRICS = {
  bricksReady: 52000,
  wetAshKg: 15000,
  marblePowderKg: 8500,
  crusherPowderKg: 10200,
  flyAshKg: 12500,
  cementKg: 4800,
};

export function InventoryManagementScreen({ onNavigate }: InventoryManagementScreenProps) {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<FilterType>('Last month');
  const [showCustomRangeModal, setShowCustomRangeModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('Procurement');
  const [materialFilter, setMaterialFilter] = useState<MaterialFilter>('All');
  const [displayCount, setDisplayCount] = useState(10);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Adjustment form state
  const [adjBricksReady, setAdjBricksReady] = useState('');
  const [adjWetAsh, setAdjWetAsh] = useState('');
  const [adjMarblePowder, setAdjMarblePowder] = useState('');
  const [adjCrusherPowder, setAdjCrusherPowder] = useState('');
  const [adjFlyAsh, setAdjFlyAsh] = useState('');
  const [adjCement, setAdjCement] = useState('');

  const handleFilterChange = (value: FilterType) => {
    if (value === 'Custom range') {
      setShowCustomRangeModal(true);
    } else {
      setFilterType(value);
    }
  };

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setFilterType('Custom range');
      setShowCustomRangeModal(false);
    }
  };

  const handleCancelCustomRange = () => {
    setShowCustomRangeModal(false);
  };

  const handleOpenAdjustmentModal = () => {
    // Pre-fill with current values - fresh on every click
    setAdjBricksReady(INVENTORY_METRICS.bricksReady.toString());
    setAdjWetAsh(INVENTORY_METRICS.wetAshKg.toString());
    setAdjMarblePowder(INVENTORY_METRICS.marblePowderKg.toString());
    setAdjCrusherPowder(INVENTORY_METRICS.crusherPowderKg.toString());
    setAdjFlyAsh(INVENTORY_METRICS.flyAshKg.toString());
    setAdjCement(INVENTORY_METRICS.cementKg.toString());
    setShowAdjustmentModal(true);
  };

  const handleSubmitAdjustment = () => {
    setShowAdjustmentModal(false);
    setShowSuccessPopup(true);
  };

  const handleCancelAdjustment = () => {
    setShowAdjustmentModal(false);
  };

  // Filter procurement data based on selected material
  const getFilteredProcurementData = () => {
    if (materialFilter === 'All') {
      return PROCUREMENT_DATA;
    }
    return PROCUREMENT_DATA.filter(entry => entry.material === materialFilter);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'Procurement':
        return getFilteredProcurementData();
      case 'Usage':
        return USAGE_DATA;
      case 'Adjustments':
        return ADJUSTMENT_DATA;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const hasMoreData = displayCount < currentData.length;

  // Helper functions for conversions
  const convertToTons = (kgs: number): number => {
    return kgs / 1000;
  };

  const convertToBags = (kgs: number): number => {
    return kgs / 50;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAdjustmentValue = (actual: number, adjustment: number): string => {
    if (adjustment >= 0) {
      return `${actual.toLocaleString()}(+${adjustment})`;
    } else {
      return `${actual.toLocaleString()}(${adjustment})`;
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
              <h1 className="text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Track stock, production, and raw material usage</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value as FilterType)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Last month">Last month</option>
                <option value="Last year">Last year</option>
                <option value="Custom range">Custom range</option>
              </select>

              {/* Unapproved Procurements Button */}
              <button
                onClick={() => onNavigate('unapproved-procurements' as AdminScreen)}
                className="relative px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Unapproved procurements
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Make Adjustments Button */}
              <button
                onClick={handleOpenAdjustmentModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Make adjustments
              </button>
            </div>
          </div>
        </div>

        {/* Top Half - Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bricks Ready */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center justify-center">
              <Boxes className="w-16 h-16 text-blue-600 mb-4" />
              <h3 className="text-gray-700 mb-2">Bricks Ready</h3>
              <p className="text-gray-900 mb-6">{INVENTORY_METRICS.bricksReady.toLocaleString()}</p>
              
              {/* Divider */}
              <div className="w-full border-t border-gray-200 my-4"></div>
              
              {/* Production Capacity */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Potential Production Capacity</p>
                <p className="text-blue-600">28,500 Bricks</p>
                <p className="text-gray-500 text-xs mt-1">Based on current raw materials</p>
              </div>
            </div>
          </div>

          {/* Raw Materials */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-900 mb-4">Raw Material Stock</h3>
            <div className="space-y-4">
              {/* Wet Ash */}
              <div className="flex items-center gap-3">
                <Droplets className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">Wet Ash</p>
                  <p className="text-gray-900">
                    {INVENTORY_METRICS.wetAshKg.toLocaleString()} Kg ({convertToTons(INVENTORY_METRICS.wetAshKg).toFixed(2)} Tons)
                  </p>
                </div>
              </div>

              {/* Marble Powder */}
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-pink-600" />
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">Marble Powder</p>
                  <p className="text-gray-900">
                    {INVENTORY_METRICS.marblePowderKg.toLocaleString()} Kg ({convertToTons(INVENTORY_METRICS.marblePowderKg).toFixed(2)} Tons)
                  </p>
                </div>
              </div>

              {/* Crusher Powder */}
              <div className="flex items-center gap-3">
                <Hammer className="w-8 h-8 text-orange-600" />
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">Crusher Powder</p>
                  <p className="text-gray-900">
                    {INVENTORY_METRICS.crusherPowderKg.toLocaleString()} Kg ({convertToTons(INVENTORY_METRICS.crusherPowderKg).toFixed(2)} Tons)
                  </p>
                </div>
              </div>

              {/* Fly Ash */}
              <div className="flex items-center gap-3">
                <Wind className="w-8 h-8 text-gray-600" />
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">Fly Ash</p>
                  <p className="text-gray-900">
                    {INVENTORY_METRICS.flyAshKg.toLocaleString()} Kg ({convertToTons(INVENTORY_METRICS.flyAshKg).toFixed(2)} Tons)
                  </p>
                </div>
              </div>

              {/* Cement */}
              <div className="flex items-center gap-3">
                <Mountain className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">Cement</p>
                  <p className="text-gray-900">
                    {INVENTORY_METRICS.cementKg.toLocaleString()} Kg ({convertToBags(INVENTORY_METRICS.cementKg).toFixed(0)} Bags)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Half - Tabs and Data */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab('Procurement');
                  setDisplayCount(10);
                  setMaterialFilter('All');
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'Procurement'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Procurement
              </button>
              <button
                onClick={() => {
                  setActiveTab('Usage');
                  setDisplayCount(10);
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'Usage'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Usage
              </button>
              <button
                onClick={() => {
                  setActiveTab('Adjustments');
                  setDisplayCount(10);
                }}
                className={`px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === 'Adjustments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Adjustments
              </button>
            </div>
          </div>

          {/* Material Filter Tabs (only for Procurement) */}
          {activeTab === 'Procurement' && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setMaterialFilter('All');
                    setDisplayCount(10);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    materialFilter === 'All'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setMaterialFilter('Wet Ash');
                    setDisplayCount(10);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    materialFilter === 'Wet Ash'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Wet Ash
                </button>
                <button
                  onClick={() => {
                    setMaterialFilter('Marble Powder');
                    setDisplayCount(10);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    materialFilter === 'Marble Powder'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Marble Powder
                </button>
                <button
                  onClick={() => {
                    setMaterialFilter('Crusher Powder');
                    setDisplayCount(10);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    materialFilter === 'Crusher Powder'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Crusher Powder
                </button>
                <button
                  onClick={() => {
                    setMaterialFilter('Fly Ash');
                    setDisplayCount(10);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    materialFilter === 'Fly Ash'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Fly Ash
                </button>
                <button
                  onClick={() => {
                    setMaterialFilter('Cement');
                    setDisplayCount(10);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    materialFilter === 'Cement'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cement
                </button>
              </div>
            </div>
          )}

          {/* Data List */}
          <div className="p-6">
            {/* Procurement Tab */}
            {activeTab === 'Procurement' && (
              <div className="space-y-4">
                {getFilteredProcurementData().slice(0, displayCount).map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Material</p>
                        <p className="text-gray-900">{entry.material}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Date</p>
                        <p className="text-gray-900">{formatDate(entry.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Vendor</p>
                        <p className="text-gray-900">{entry.vendor}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Quantity</p>
                        <p className="text-gray-900">{entry.quantityValue} {entry.quantityUnit}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Final Price</p>
                        <p className="text-gray-900">₹{entry.finalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'Usage' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">No of Bricks</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Round</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Wet Ash</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Marble Powder</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Crusher Powder</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Fly Ash</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Cement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {USAGE_DATA.slice(0, displayCount).map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{formatDate(entry.date)}</td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{entry.bricks.toLocaleString()}</td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{entry.round}</td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {entry.wetAshKg.toLocaleString()} Kg ({convertToTons(entry.wetAshKg).toFixed(2)} Tons)
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {entry.marblePowderKg.toLocaleString()} Kg ({convertToTons(entry.marblePowderKg).toFixed(2)} Tons)
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {entry.crusherPowderKg.toLocaleString()} Kg ({convertToTons(entry.crusherPowderKg).toFixed(2)} Tons)
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {entry.flyAshKg.toLocaleString()} Kg ({convertToTons(entry.flyAshKg).toFixed(2)} Tons)
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {entry.cementKg.toLocaleString()} Kg ({convertToBags(entry.cementKg).toFixed(0)} Bags)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Adjustments Tab */}
            {activeTab === 'Adjustments' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">No of Bricks</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Wet Ash (Kg)</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Marble Powder (Kg)</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Crusher Powder (Kg)</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Fly Ash (Kg)</th>
                      <th className="px-4 py-3 text-left text-gray-700 whitespace-nowrap">Cement (Kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ADJUSTMENT_DATA.slice(0, displayCount).map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{formatDate(entry.date)}</td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {formatAdjustmentValue(entry.bricks.actual, entry.bricks.adjustment)}
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {formatAdjustmentValue(entry.wetAshKg.actual, entry.wetAshKg.adjustment)}
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {formatAdjustmentValue(entry.marblePowderKg.actual, entry.marblePowderKg.adjustment)}
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {formatAdjustmentValue(entry.crusherPowderKg.actual, entry.crusherPowderKg.adjustment)}
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {formatAdjustmentValue(entry.flyAshKg.actual, entry.flyAshKg.adjustment)}
                        </td>
                        <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                          {formatAdjustmentValue(entry.cementKg.actual, entry.cementKg.adjustment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Load More Button */}
            {hasMoreData && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setDisplayCount(displayCount + 10)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Range Modal */}
      {showCustomRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">Custom Date Range</h2>
            
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
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancelCustomRange}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomRange}
                  disabled={!customStartDate || !customEndDate}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    customStartDate && customEndDate
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Make Adjustments Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-gray-900 mb-4">Make Adjustments</h2>
            
            <div className="space-y-4">
              {/* Bricks Ready */}
              <div>
                <label htmlFor="adjBricksReady" className="block text-gray-700 mb-2">
                  Bricks Ready
                </label>
                <input
                  id="adjBricksReady"
                  type="number"
                  value={adjBricksReady}
                  onChange={(e) => setAdjBricksReady(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Wet Ash */}
              <div>
                <label htmlFor="adjWetAsh" className="block text-gray-700 mb-2">
                  Wet Ash (Kg)
                </label>
                <input
                  id="adjWetAsh"
                  type="number"
                  value={adjWetAsh}
                  onChange={(e) => setAdjWetAsh(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Marble Powder */}
              <div>
                <label htmlFor="adjMarblePowder" className="block text-gray-700 mb-2">
                  Marble Powder (Kg)
                </label>
                <input
                  id="adjMarblePowder"
                  type="number"
                  value={adjMarblePowder}
                  onChange={(e) => setAdjMarblePowder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Crusher Powder */}
              <div>
                <label htmlFor="adjCrusherPowder" className="block text-gray-700 mb-2">
                  Crusher Powder (Kg)
                </label>
                <input
                  id="adjCrusherPowder"
                  type="number"
                  value={adjCrusherPowder}
                  onChange={(e) => setAdjCrusherPowder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Fly Ash */}
              <div>
                <label htmlFor="adjFlyAsh" className="block text-gray-700 mb-2">
                  Fly Ash (Kg)
                </label>
                <input
                  id="adjFlyAsh"
                  type="number"
                  value={adjFlyAsh}
                  onChange={(e) => setAdjFlyAsh(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Cement */}
              <div>
                <label htmlFor="adjCement" className="block text-gray-700 mb-2">
                  Cement (Kg)
                </label>
                <input
                  id="adjCement"
                  type="number"
                  value={adjCement}
                  onChange={(e) => setAdjCement(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 justify-end">
                <button
                  onClick={handleCancelAdjustment}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAdjustment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <Popup
          title="Adjustment Submitted"
          message="The inventory adjustment has been recorded successfully."
          onClose={() => setShowSuccessPopup(false)}
          type="success"
        />
      )}
    </div>
  );
}