import React, { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { HomeScreen } from "./components/HomeScreen";
import { MaterialPurchaseEntry } from "./components/MaterialPurchaseEntry";
import { ProductionEntry } from "./components/ProductionEntry";
import { OrdersScreen } from "./components/OrdersScreen";
import { DeliveryEntry } from "./components/DeliveryEntry";

export type Screen =
  | "login"
  | "home"
  | "material"
  | "production"
  | "orders"
  | "delivery";

export interface Order {
  id: string;
  customerName: string;
  customerNumber: string;
  location: string;
  quantity: number;
  amount: number;
}

interface EmployeeAppProps {
  onBack?: () => void;
}

export default function EmployeeApp({
  onBack,
}: EmployeeAppProps) {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("login");
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentScreen("delivery");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === "login" && (
        <LoginScreen onLogin={handleLogin} onBack={onBack} />
      )}
      {currentScreen === "home" && (
        <HomeScreen
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "material" && (
        <MaterialPurchaseEntry onNavigate={handleNavigate} />
      )}
      {currentScreen === "production" && (
        <ProductionEntry onNavigate={handleNavigate} />
      )}
      {currentScreen === "orders" && (
        <OrdersScreen
          onOrderSelect={handleOrderSelect}
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === "delivery" && selectedOrder && (
        <DeliveryEntry
          order={selectedOrder}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}