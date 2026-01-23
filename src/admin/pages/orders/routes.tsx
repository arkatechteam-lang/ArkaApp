import { Routes, Route } from "react-router-dom";
import { OrderManagementScreen } from "./pages/OrderManagementScreen";
import { CreateOrderScreen } from "./pages/CreateOrderScreen";
import { OrderDetailsScreen } from "./pages/OrderDetailsScreen";

export function OrdersRoutes() {
    
  return (
    <Routes>
      <Route index element={<OrderManagementScreen />} />
      <Route path="create" element={<CreateOrderScreen />} />
      <Route path=":orderId" element={<OrderDetailsScreen />} />
    </Routes>
  );
}