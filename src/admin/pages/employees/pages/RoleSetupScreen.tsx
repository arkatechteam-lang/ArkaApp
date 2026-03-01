import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSalarySetupScreen } from '../../../../components/admin/RoleSalarySetupScreen';
import { EditRoleScreen } from '../../../../components/admin/EditRoleScreen';
import type { AdminScreen, Role } from '../../../../AdminApp';

type LocalScreen = 'list' | 'edit';

export function RoleSetupScreen() {
  const navigate = useNavigate();
  const [localScreen, setLocalScreen] = useState<LocalScreen>('list');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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
      case 'role-setup':
        setLocalScreen('list');
        setSelectedRole(null);
        break;
      default:
        navigate('/admin/employees');
    }
  };

  const handleRoleEdit = (role: Role) => {
    setSelectedRole(role);
    setLocalScreen('edit');
  };

  if (localScreen === 'edit' && selectedRole) {
    return <EditRoleScreen role={selectedRole} onNavigate={handleNavigate} />;
  }

  return (
    <RoleSalarySetupScreen
      onNavigate={handleNavigate}
      onRoleEdit={handleRoleEdit}
    />
  );
}
