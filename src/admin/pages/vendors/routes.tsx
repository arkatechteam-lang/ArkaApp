// pages/vendors/VendorsRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CreateVendorScreen } from "./pages/CreateVendorScreen";
import { VendorManagementScreen } from "./pages/VendorManagementScreen";
import { EditVendorScreen } from "./pages/EditVendorScreen";
import { VendorLedgerScreen } from "./pages/VendorLedgerScreen";
import { VendorPaymentScreen } from "./pages/VendorPaymentScreen";

export function VendorsRoutes() {
  return (
    <Routes>
      <Route index element={<VendorManagementScreen />} />
      <Route path="create" element={<CreateVendorScreen />} />
      <Route path=":vendorId/edit" element={<EditVendorScreen />} />
      <Route path=":vendorId/ledger" element={<VendorLedgerScreen />} />
      <Route path=":vendorId/payment" element={<VendorPaymentScreen />} />
      <Route path="*" element={<Navigate to="/admin/vendors" replace />} />
    </Routes>
  );
}
