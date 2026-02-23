import { Routes, Route, Navigate } from "react-router-dom";
import { InventoryManagementScreen } from "./pages/InventoryManagementScreen";
import { UnapprovedProcurementsScreen } from "./pages/UnapprovedProcurementsScreen";
import { RawMaterialStockScreen } from "./pages/RawMaterialStockScreen";

export function InventoryRoutes() {
  return (
    <Routes>
      <Route index element={<InventoryManagementScreen />} />

      <Route path="/unapproved-procurements" element={<UnapprovedProcurementsScreen />} />

      <Route path="/raw-material-stock" element={<RawMaterialStockScreen />} />

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
