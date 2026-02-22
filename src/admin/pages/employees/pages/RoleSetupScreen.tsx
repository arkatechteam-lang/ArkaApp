import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSalarySetupScreen } from '../../../../components/admin/RoleSalarySetupScreen';
import { CreateRoleScreen } from '../../../../components/admin/CreateRoleScreen';
import { EditRoleScreen } from '../../../../components/admin/EditRoleScreen';
import type { AdminScreen, Role } from '../../../../AdminApp';

type LocalScreen = 'list' | 'create' | 'edit';

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
        setLocalScreen('create');
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

  if (localScreen === 'create') {
    return <CreateRoleScreen onNavigate={handleNavigate} />;
  }

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
