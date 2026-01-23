// pages/customers/CustomersRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CustomerManagementScreen } from "./pages/CustomerManagementScreen";
import { CustomerDetailsScreen } from "./pages/CustomerDetailsScreen";

export function CustomersRoutes() {
  return (
    <Routes>
      <Route index element={<CustomerManagementScreen />} />
      <Route path=":customerId" element={<CustomerDetailsScreen />} />

      <Route path="*" element={<Navigate to="/admin/customers" replace />} />
    </Routes>
  );
}
