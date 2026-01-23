import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLoginScreen } from "./pages/AdminLoginScreen";
import { AdminHomeScreen } from "./pages/AdminHomeScreen";
import { ProductionStatisticsScreen } from "./pages/ProductionStatisticsScreen";
import { InventoryManagementScreen } from "./pages/InventoryManagementScreen";
import { AccountsManagementScreen } from "./pages/AccountsManagementScreen";
import { MetricsScreen } from "./pages/MetricsScreen";
import { EmployeeManagementScreen } from "./pages/EmployeeManagementScreen";
import { SalaryLedgerScreen } from "./pages/SalaryLedgerScreen";
import { VendorManagementScreen } from "./pages/VendorManagementScreen";
import { CashFlowScreen } from "./pages/CashFlowScreen";
import { LoanManagementScreen } from "./pages/LoanManagementScreen";
import { OrdersRoutes } from "./pages/orders/routes";
import { CustomersRoutes } from "./pages/customers/routes";

export function AdminRoutes() {
  return (
     <Routes>
      {/* Default admin entry → login */}
      <Route path="/" element={<Navigate to="login" replace />} />

      {/* Login */}
      <Route path="login" element={<AdminLoginScreen />} />

      {/* Home */}
      <Route path="home" element={<AdminHomeScreen />} />

      {/* Other Admin Routes */}
      <Route path="orders/*" element={<OrdersRoutes />} />
      <Route path="production" element={<ProductionStatisticsScreen />} />
       <Route path="inventory" element={<InventoryManagementScreen />} />
     <Route path="customers/*" element={<CustomersRoutes />} />
      <Route path="accounts" element={<AccountsManagementScreen />} />
      <Route path="metrics" element={<MetricsScreen />} />
      <Route path="employees" element={<EmployeeManagementScreen />} />
      <Route path="salarys" element={<SalaryLedgerScreen />} />
     <Route path="vendors" element={<VendorManagementScreen />} />
    <Route path="cashFlow" element={<CashFlowScreen />} />
      <Route path="loans" element={<LoanManagementScreen />} />

      {/* Safety fallback */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}