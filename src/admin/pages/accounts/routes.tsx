import { Routes, Route, Navigate } from "react-router-dom";
import { AccountsManagementScreen } from "./pages/AccountsManagementScreen";
import { CreateExpenseScreen } from "./pages/CreateExpenseScreen";
import { EditExpenseScreen } from "./pages/EditExpenseScreen";

export function AccountsRoutes() {
  return (
    <Routes>
      <Route index element={<AccountsManagementScreen />} />

      <Route path="expense" element={<CreateExpenseScreen />} />
      <Route path="expense/:expenseId" element={<EditExpenseScreen />} />
      <Route path="expense-subtype" element={<CreateExpenseScreen />} />
      <Route path="*" element={<Navigate to="." replace />} />
      
    </Routes>
  );
}
