// pages/vendors/VendorsRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CreateVendorScreen } from "./pages/CreateVendorScreen";
import { VendorManagementScreen } from "./pages/VendorManagementScreen";

export function VendorsRoutes() {
  return (
    <Routes>
      <Route index element={<VendorManagementScreen />} />
      <Route path="create" element={<CreateVendorScreen />} />
      
      <Route path="*" element={<Navigate to="/admin/vendors" replace />} />
    </Routes>
  );
}
