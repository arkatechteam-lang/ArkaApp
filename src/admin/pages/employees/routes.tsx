// pages/employees/EmployeesRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { CreateEmployeeScreen } from "./pages/CreateEmployeeScreen";
import { EmployeeManagementScreen } from "./pages/EmployeeManagementScreen";
import { EditEmployeeScreen } from "./pages/EditEmployeeScreen";
import { RoleSetupScreen } from "./pages/RoleSetupScreen";
import { AttendanceScreen } from "./pages/AttendanceScreen";

export function EmployeesRoutes() {
  return (
    <Routes>
      <Route index element={<EmployeeManagementScreen />} />
      <Route path="create" element={<CreateEmployeeScreen />} />
      <Route path=":id/edit" element={<EditEmployeeScreen />} />
      <Route path="role-setup" element={<RoleSetupScreen />} />
      <Route path="attendance" element={<AttendanceScreen />} />

      <Route path="*" element={<Navigate to="/admin/employees" replace />} />
    </Routes>
  );
}
