import React, { useState } from "react";
import { Package, Factory, Truck, LogOut } from "lucide-react";
import { Screen } from "./EmployeeApp";
import { Popup } from "../../components/Popup";
import { useNavigate } from "react-router-dom";

export function HomeScreen() {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState<"success" | "error" | null>(
    null
  );
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
    setLogoutStatus(success ? "success" : "error");
    setShowLogoutPopup(true);
  };

  const onLogout = () => {
    navigate("/employee");
  };

  const handlePopupClose = () => {
    setShowLogoutPopup(false);
    if (logoutStatus === "success") {
      onLogout();
    }
    setLogoutStatus(null);
  };

  const handleSessionExpiredClose = () => {
    setShowSessionExpiredPopup(false);
    onLogout();
  };

  const cards = [
    {
      title: "Material Purchase Entry",
      icon: Package,
      color: "bg-blue-600",
      path: "/employee/material-entry",
    },
    {
      title: "Production Entry",
      icon: Factory,
      color: "bg-green-600",
      path: "/employee/production-entry",
    },
    {
      title: "Delivery Entry",
      icon: Truck,
      color: "bg-orange-600",
      path: "/employee/orders",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Select an option to continue
            </p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-left group"
              >
                <div
                  className={`${card.color} p-4 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600">
                  Click to enter {card.title.toLowerCase()}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <Popup
          title={
            logoutStatus === "success"
              ? "Logout Successful"
              : "Something Went Wrong"
          }
          message={
            logoutStatus === "success"
              ? "You have been logged out successfully."
              : "Unable to logout. Please try again."
          }
          onClose={handlePopupClose}
          type={logoutStatus === "success" ? "success" : "error"}
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
