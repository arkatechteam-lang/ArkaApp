import { Routes, Route, Navigate } from "react-router-dom";
import { InventoryManagementScreen } from "./pages/InventoryManagementScreen";
import { UnapprovedProcurementsScreen } from "./pages/UnapprovedProcurementsScreen";

export function InventoryRoutes() {
  return (
    <Routes>
      <Route index element={<InventoryManagementScreen />} />

      <Route path="/unapproved-procurements" element={<UnapprovedProcurementsScreen />} />

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
