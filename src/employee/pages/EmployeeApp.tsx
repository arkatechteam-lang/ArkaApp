import React from "react";
import { LoginScreen } from "./LoginScreen";
import { HomeScreen } from "./HomeScreen";
import { MaterialPurchaseEntry } from "./MaterialPurchaseEntry";
import { ProductionEntry } from "./ProductionEntry";
import { OrdersScreen } from "./OrdersScreen";
import { DeliveryEntry } from "./DeliveryEntry";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

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

export default function EmployeeApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="login" replace />} />

        <Route path="login" element={<LoginScreen />} />
        <Route path="home" element={<HomeScreen />} />
        <Route path="material-entry" element={<MaterialPurchaseEntry />} />
        <Route path="production-entry" element={<ProductionEntry />} />
        <Route path="orders" element={<OrdersScreen />} />
        <Route path="orders/:orderId/delivery" element={<DeliveryEntry />} />

        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
}
