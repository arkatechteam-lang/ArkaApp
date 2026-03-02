import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSalarySetupScreen } from '../../../../components/admin/RoleSalarySetupScreen';
import type { AdminScreen, Role } from '../../../../AdminApp';

export function RoleSetupScreen() {
  const navigate = useNavigate();

  const handleNavigate = (screen: AdminScreen) => {
    switch (screen) {
      case 'employees':
        navigate('/admin/employees');
        break;
      case 'create-role':
        navigate('/admin/employees/role-setup/create', {
          state: { from: '/admin/employees/role-setup' },
        });
        break;
      default:
        navigate('/admin/employees');
    }
  };

  const handleRoleEdit = (role: Role) => {
    navigate(`/admin/employees/role-setup/${role.id}/edit`, {
      state: { from: '/admin/employees/role-setup' },
    });
  };

  return (
    <RoleSalarySetupScreen
      onNavigate={handleNavigate}
      onRoleEdit={handleRoleEdit}
    />
  );
}
