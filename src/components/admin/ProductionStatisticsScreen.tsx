import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AdminScreen } from '../../AdminApp';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductionStatisticsScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

interface ProductionEntry {
  date: string;
  bricks: number;
  round: number;
  wetAshKg: number;
  marblePowderKg: number;
  crusherPowderKg: number;
  flyAshKg: number;
  cementKg: number;
}

// Mock production data for this month's graph (December 2025)
const MONTHLY_PRODUCTION_DATA = [
  { date: 'Dec 1', bricks: 15000 },
  { date: 'Dec 2', bricks: 18000 },
  { date: 'Dec 3', bricks: 16500 },
  { date: 'Dec 4', bricks: 19000 },
  { date: 'Dec 5', bricks: 17500 },
  { date: 'Dec 6', bricks: 20000 },
  { date: 'Dec 7', bricks: 18500 },
  { date: 'Dec 8', bricks: 21000 },
  { date: 'Dec 9', bricks: 19800 },
  { date: 'Dec 10', bricks: 22000 },
  { date: 'Dec 11', bricks: 20500 },
  { date: 'Dec 12', bricks: 21500 },
  { date: 'Dec 13', bricks: 19200 },
  { date: 'Dec 14', bricks: 20800 },
  { date: 'Dec 15', bricks: 22500 },
  { date: 'Dec 16', bricks: 21800 },
  { date: 'Dec 17', bricks: 20300 },
  { date: 'Dec 18', bricks: 23000 },
  { date: 'Dec 19', bricks: 21200 },
  { date: 'Dec 20', bricks: 22800 },
  { date: 'Dec 21', bricks: 20900 },
  { date: 'Dec 22', bricks: 24000 },
  { date: 'Dec 23', bricks: 22300 },
  { date: 'Dec 24', bricks: 21700 },
  { date: 'Dec 25', bricks: 19500 },
  { date: 'Dec 26', bricks: 23500 },
  { date: 'Dec 27', bricks: 22100 },
];

// Yesterday's production (Dec 27, 2025)
const YESTERDAY_PRODUCTION = {
  bricks: 22100,
  round: 6,
  wetAshKg: 3000,
  marblePowderKg: 1800,
  crusherPowderKg: 2200,
  flyAshKg: 2700,
  cementKg: 900,
};

// Mock production entries (in kg for raw materials)
const PRODUCTION_ENTRIES: ProductionEntry[] = [
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
  { date: '2025-12-15', bricks: 22500, round: 6, wetAshKg: 3080, marblePowderKg: 1840, crusherPowderKg: 2200, flyAshKg: 2780, cementKg: 925 },
  { date: '2025-12-14', bricks: 20800, round: 5, wetAshKg: 2820, marblePowderKg: 1710, crusherPowderKg: 2060, flyAshKg: 2580, cementKg: 860 },
  { date: '2025-12-13', bricks: 19200, round: 5, wetAshKg: 2580, marblePowderKg: 1580, crusherPowderKg: 1880, flyAshKg: 2380, cementKg: 790 },
  { date: '2025-12-12', bricks: 21500, round: 6, wetAshKg: 2920, marblePowderKg: 1760, crusherPowderKg: 2120, flyAshKg: 2650, cementKg: 880 },
  { date: '2025-12-11', bricks: 20500, round: 5, wetAshKg: 2780, marblePowderKg: 1680, crusherPowderKg: 2020, flyAshKg: 2520, cementKg: 840 },
  { date: '2025-12-10', bricks: 22000, round: 6, wetAshKg: 3000, marblePowderKg: 1800, crusherPowderKg: 2160, flyAshKg: 2720, cementKg: 905 },
  { date: '2025-12-09', bricks: 19800, round: 5, wetAshKg: 2680, marblePowderKg: 1620, crusherPowderKg: 1950, flyAshKg: 2450, cementKg: 815 },
  { date: '2025-12-08', bricks: 21000, round: 5, wetAshKg: 2850, marblePowderKg: 1720, crusherPowderKg: 2070, flyAshKg: 2600, cementKg: 865 },
  { date: '2025-12-07', bricks: 18500, round: 5, wetAshKg: 2500, marblePowderKg: 1500, crusherPowderKg: 1800, flyAshKg: 2200, cementKg: 730 },
  { date: '2025-12-06', bricks: 20000, round: 5, wetAshKg: 2700, marblePowderKg: 1630, crusherPowderKg: 1960, flyAshKg: 2450, cementKg: 820 },
  { date: '2025-12-05', bricks: 17500, round: 4, wetAshKg: 2380, marblePowderKg: 1450, crusherPowderKg: 1730, flyAshKg: 2150, cementKg: 720 },
  { date: '2025-12-04', bricks: 19000, round: 5, wetAshKg: 2580, marblePowderKg: 1560, crusherPowderKg: 1870, flyAshKg: 2330, cementKg: 775 },
  { date: '2025-12-03', bricks: 16500, round: 4, wetAshKg: 2250, marblePowderKg: 1380, crusherPowderKg: 1650, flyAshKg: 2050, cementKg: 680 },
  { date: '2025-12-02', bricks: 18000, round: 5, wetAshKg: 2450, marblePowderKg: 1480, crusherPowderKg: 1780, flyAshKg: 2220, cementKg: 740 },
  { date: '2025-12-01', bricks: 15000, round: 4, wetAshKg: 2050, marblePowderKg: 1250, crusherPowderKg: 1500, flyAshKg: 1850, cementKg: 620 },
];

export function ProductionStatisticsScreen({ onNavigate }: ProductionStatisticsScreenProps) {
  const [displayCount, setDisplayCount] = useState(10);

  const displayedEntries = PRODUCTION_ENTRIES.slice(0, displayCount);
  const hasMore = displayCount < PRODUCTION_ENTRIES.length;

  // Helper functions for conversions
  const convertToTons = (round: number, kgs: number): number => {
    return (round * kgs) / 1000;
  };

  const convertToBags = (round: number, kgs: number): number => {
    return (round * kgs) / 50;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
          <h1 className="text-gray-900">Production Statistics</h1>
          <p className="text-gray-600 mt-1">View production metrics and performance</p>
        </div>

        {/* Top Section - Graph and Yesterday's Production */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Production Graph - This Month */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-gray-900 mb-4">This Month's Production</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MONTHLY_PRODUCTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bricks" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  name="Bricks Produced" 
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Yesterday's Production with Progress Circle */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-gray-900 mb-6">Yesterday's Production</h2>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Animated Progress Circle */}
              <div className="flex-shrink-0">
                <div className="relative w-40 h-40">
                  {/* Static progress ring */}
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#10B981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray="440"
                      strokeDashoffset="110"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-900 text-2xl">{YESTERDAY_PRODUCTION.bricks.toLocaleString()}</p>
                      <p className="text-gray-600 text-sm">Bricks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Materials List */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full">
                    <span className="text-gray-700">Round:</span>
                    <span className="text-gray-900">{YESTERDAY_PRODUCTION.round}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full">
                    <span className="text-gray-700">Wet Ash:</span>
                    <span className="text-gray-900">
                      {convertToTons(YESTERDAY_PRODUCTION.round, YESTERDAY_PRODUCTION.wetAshKg).toFixed(2)} Tons
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full">
                    <span className="text-gray-700">Marble Powder:</span>
                    <span className="text-gray-900">
                      {convertToTons(YESTERDAY_PRODUCTION.round, YESTERDAY_PRODUCTION.marblePowderKg).toFixed(2)} Tons
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full">
                    <span className="text-gray-700">Crusher Powder:</span>
                    <span className="text-gray-900">
                      {convertToTons(YESTERDAY_PRODUCTION.round, YESTERDAY_PRODUCTION.crusherPowderKg).toFixed(2)} Tons
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full">
                    <span className="text-gray-700">Fly Ash:</span>
                    <span className="text-gray-900">
                      {convertToTons(YESTERDAY_PRODUCTION.round, YESTERDAY_PRODUCTION.flyAshKg).toFixed(2)} Tons
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full">
                    <span className="text-gray-700">Cement:</span>
                    <span className="text-gray-900">
                      {convertToBags(YESTERDAY_PRODUCTION.round, YESTERDAY_PRODUCTION.cementKg).toFixed(0)} Bags
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Entries Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Production History</h2>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-gray-700">No of Bricks</th>
                    <th className="px-4 py-3 text-left text-gray-700">Round</th>
                    <th className="px-4 py-3 text-left text-gray-700">Wet Ash (Tons)</th>
                    <th className="px-4 py-3 text-left text-gray-700">Marble Powder (Tons)</th>
                    <th className="px-4 py-3 text-left text-gray-700">Crusher Powder (Tons)</th>
                    <th className="px-4 py-3 text-left text-gray-700">Fly Ash (Tons)</th>
                    <th className="px-4 py-3 text-left text-gray-700">Cement (Bags)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedEntries.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-gray-900">{formatDate(entry.date)}</td>
                      <td className="px-4 py-4 text-gray-900">{entry.bricks.toLocaleString()}</td>
                      <td className="px-4 py-4 text-gray-900">{entry.round}</td>
                      <td className="px-4 py-4 text-gray-900">
                        {convertToTons(entry.round, entry.wetAshKg).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-gray-900">
                        {convertToTons(entry.round, entry.marblePowderKg).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-gray-900">
                        {convertToTons(entry.round, entry.crusherPowderKg).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-gray-900">
                        {convertToTons(entry.round, entry.flyAshKg).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-gray-900">
                        {convertToBags(entry.round, entry.cementKg).toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-6">
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
    </div>
  );
}