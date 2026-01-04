import React, { useState } from 'react';
import {
  ShoppingCart,
  BarChart3,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  UserCog,
  Settings,
  Wallet,
  Store,
  LogOut,
  Coins,
  CreditCard,
} from 'lucide-react';
import { AdminScreen } from '../../AdminApp';
import { Popup } from '../Popup';

interface AdminHomeScreenProps {
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
}

export function AdminHomeScreen({ onNavigate, onLogout }: AdminHomeScreenProps) {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState<'success' | 'error' | null>(null);
  const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);

  // Simulate session expiration check (for demo purposes)
  React.useEffect(() => {
    // Simulate random session expiration after some time (for demo)
    const sessionCheck = setTimeout(() => {
      const isSessionExpired = Math.random() > 0.95; // 5% chance
      if (isSessionExpired) {
        setShowSessionExpiredPopup(true);
      }
    }, 10000); // Check after 10 seconds

    return () => clearTimeout(sessionCheck);
  }, []);

  const handleLogoutClick = () => {
    // Simulate logout
    const success = Math.random() > 0.1; // 90% success rate
    setLogoutStatus(success ? 'success' : 'error');
    setShowLogoutPopup(true);
  };

  const handlePopupClose = () => {
    setShowLogoutPopup(false);
    if (logoutStatus === 'success') {
      onLogout();
    }
    setLogoutStatus(null);
  };

  const handleSessionExpiredClose = () => {
    setShowSessionExpiredPopup(false);
    onLogout();
  };

  const menuCards = [
    {
      title: 'Order Management',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      screen: 'orders' as AdminScreen,
      description: 'Manage all orders and deliveries',
    },
    {
      title: 'Production Statistics',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      screen: 'production' as AdminScreen,
      description: 'View production metrics and data',
    },
    {
      title: 'Inventory Management',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      screen: 'inventory' as AdminScreen,
      description: 'Track stock and materials',
    },
    {
      title: 'Customer Management',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      screen: 'customers' as AdminScreen,
      description: 'Manage customer information',
    },
    {
      title: 'Accounts Management',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      screen: 'accounts' as AdminScreen,
      description: 'Track income and expenses',
    },
    {
      title: 'Metrics',
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      screen: 'metrics' as AdminScreen,
      description: 'Business performance metrics',
    },
    {
      title: 'Employee Management',
      icon: UserCog,
      color: 'from-indigo-500 to-indigo-600',
      screen: 'employees' as AdminScreen,
      description: 'Manage employee records',
    },
    {
      title: 'Salary Ledger',
      icon: Wallet,
      color: 'from-amber-500 to-amber-600',
      screen: 'salary-ledger' as AdminScreen,
      description: 'Employee salary records',
    },
    {
      title: 'Vendor Management',
      icon: Store,
      color: 'from-rose-500 to-rose-600',
      screen: 'vendors' as AdminScreen,
      description: 'Manage vendor information',
    },
    {
      title: 'Cash Flow',
      icon: Coins,
      color: 'from-teal-500 to-teal-600',
      screen: 'cash-flow' as AdminScreen,
      description: 'Track cash and account balances',
    },
    {
      title: 'Loan Management',
      icon: CreditCard,
      color: 'from-pink-500 to-pink-600',
      screen: 'loan-management' as AdminScreen,
      description: 'Manage borrowed funds',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome! Select a module to continue</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.screen}
                onClick={() => onNavigate(card.screen)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
              >
                <div className={`bg-gradient-to-br ${card.color} p-4 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <Popup
          title={logoutStatus === 'success' ? 'Logout Successful' : 'Something Went Wrong'}
          message={
            logoutStatus === 'success'
              ? 'You have been logged out successfully.'
              : 'Unable to logout. Please try again.'
          }
          onClose={handlePopupClose}
          type={logoutStatus === 'success' ? 'success' : 'error'}
        />
      )}

      {/* Session Expired Popup */}
      {showSessionExpiredPopup && (
        <Popup
          title="Session Expired"
          message="Your session has expired. Please login again."
          onClose={handleSessionExpiredClose}
          type="warning"
        />
      )}
    </div>
  );
}