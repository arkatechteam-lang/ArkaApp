import { Routes, Route, Navigate } from "react-router-dom";
import { LoanManagementScreen } from "./pages/LoanManagementScreen";
import { CreateLoanScreen } from "./pages/CreateLoanScreen";

export function LoansRoutes() {
  return (
    <Routes>
      <Route index element={<LoanManagementScreen />} />

      <Route path="/create" element={<CreateLoanScreen />} />

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
