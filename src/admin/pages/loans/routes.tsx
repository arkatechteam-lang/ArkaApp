import { Routes, Route, Navigate } from "react-router-dom";
import { LoanManagementScreen } from "./pages/LoanManagementScreen";
import { CreateLoanScreen } from "./pages/CreateLoanScreen";
import { LoanLedgerScreen } from "./pages/LoanLedgerScreen";
import { AddLoanTransactionScreen } from "./pages/AddLoanTransactionScreen";

export function LoansRoutes() {
  return (
    <Routes>
      <Route index element={<LoanManagementScreen />} />

      <Route path="/create" element={<CreateLoanScreen />} />

      <Route path="/ledger" element={<LoanLedgerScreen />} />

      <Route path="/ledger/add-transaction" element={<AddLoanTransactionScreen />} />

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
