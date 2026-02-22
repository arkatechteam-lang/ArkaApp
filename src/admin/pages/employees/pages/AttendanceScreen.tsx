import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeAttendanceScreen } from '../../../../components/admin/EmployeeAttendanceScreen';
import type { AdminScreen } from '../../../../AdminApp';

export function AttendanceScreen() {
  const navigate = useNavigate();

  const handleNavigate = (screen: AdminScreen) => {
    switch (screen) {
      case 'employees':
        navigate('/admin/employees');
        break;
      default:
        navigate('/admin/employees');
    }
  };

  return <EmployeeAttendanceScreen onNavigate={handleNavigate} />;
}
