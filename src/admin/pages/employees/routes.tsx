// pages/employees/EmployeesRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CreateEmployeeScreen } from "./pages/CreateEmployeeScreen";
import { EmployeeManagementScreen } from "./pages/EmployeeManagementScreen";
import { EditEmployeeScreen } from "./pages/EditEmployeeScreen";

export function EmployeesRoutes() {
  return (
    <Routes>
      <Route index element={<EmployeeManagementScreen />} />
      <Route path="create" element={<CreateEmployeeScreen />} />
      <Route path=":id/edit" element={<EditEmployeeScreen />} />
      
      <Route path="*" element={<Navigate to="/admin/employees" replace />} />
    </Routes>
  );
}
