import React, { useState } from 'react';
import { AdminScreen } from '../../AdminApp';
import { ArrowLeft, Save } from 'lucide-react';
import { Popup } from '../Popup';

interface EmployeeAttendanceScreenProps {
  onNavigate: (screen: AdminScreen) => void;
}

interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  phoneNumber: string;
  role: string;
  category: 'Daily Wages' | 'Fixed Salary' | 'Loadmen';
  attendance: 'Present' | 'Absent' | 'Half Day' | 'Leave' | '';
}

const MOCK_EMPLOYEES: AttendanceRecord[] = [
  { employeeId: 'EMP-001', employeeName: 'Ramesh Kumar', phoneNumber: '9876543210', role: 'DW', category: 'Daily Wages', attendance: '' },
  { employeeId: 'EMP-002', employeeName: 'Suresh Patel', phoneNumber: '9876543211', role: 'FX-MM', category: 'Fixed Salary', attendance: '' },
  { employeeId: 'EMP-004', employeeName: 'Mohan Yadav', phoneNumber: '9876543213', role: 'DW', category: 'Daily Wages', attendance: '' },
  { employeeId: 'EMP-005', employeeName: 'Rakesh Singh', phoneNumber: '9876543214', role: 'FX-OP', category: 'Fixed Salary', attendance: '' },
  { employeeId: 'EMP-008', employeeName: 'Santosh Gupta', phoneNumber: '9876543217', role: 'FX-MM', category: 'Fixed Salary', attendance: '' },
  { employeeId: 'EMP-009', employeeName: 'Dinesh Rao', phoneNumber: '9876543218', role: 'DW-D', category: 'Daily Wages', attendance: '' },
  { employeeId: 'EMP-011', employeeName: 'Manoj Tiwari', phoneNumber: '9876543220', role: 'DW', category: 'Daily Wages', attendance: '' },
];

export function EmployeeAttendanceScreen({ onNavigate }: EmployeeAttendanceScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_EMPLOYEES);
  const [hasValidationError, setHasValidationError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showBulkConfirmation, setShowBulkConfirmation] = useState(false);
  const [bulkAction, setBulkAction] = useState<'Present' | 'Leave'>('Present');

  // Check if the date allows editing
  const canEditAttendance = () => {
    const selected = new Date(selectedDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    return selected.getTime() === today.getTime() || selected.getTime() === yesterday.getTime();
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setHasValidationError(false);
    // In a real app, you would fetch attendance records for this date
    // For now, we'll reset or pre-fill based on whether data exists
  };

  const handleAttendanceChange = (employeeId: string, attendance: 'Present' | 'Absent' | 'Half Day' | 'Leave') => {
    if (!canEditAttendance()) return;
    
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.employeeId === employeeId
          ? { ...record, attendance }
          : record
      )
    );
    setHasValidationError(false);
  };

  const handleMarkAllClick = (type: 'Present' | 'Leave') => {
    if (!canEditAttendance()) return;
    setBulkAction(type);
    setShowBulkConfirmation(true);
  };

  const handleBulkConfirm = () => {
    setAttendanceRecords(prev =>
      prev.map(record => ({ ...record, attendance: bulkAction }))
    );
    setShowBulkConfirmation(false);
    setHasValidationError(false);
  };

  const handleBulkCancel = () => {
    setShowBulkConfirmation(false);
  };

  const validateAndSave = () => {
    let hasError = false;

    attendanceRecords.forEach(record => {
      if ((record.category === 'Daily Wages' || record.category === 'Fixed Salary') && !record.attendance) {
        hasError = true;
      }
    });

    if (hasError) {
      setHasValidationError(true);
      return;
    }

    setHasValidationError(false);
    setPopupMessage('Attendance saved successfully!');
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const isViewOnly = !canEditAttendance();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('employees')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Employee Management
          </button>
          <h1 className="text-gray-900">Employee Attendance</h1>
          <p className="text-gray-600 mt-1">Mark daily attendance for employees</p>
        </div>

        {/* Date Selector and Bulk Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ colorScheme: 'light' }}
              />
              {isViewOnly && (
                <p className="text-orange-600 text-sm mt-2">
                  View only mode - Attendance can only be edited for today and yesterday
                </p>
              )}
            </div>
            
            {!isViewOnly && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAllClick('Present')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAllClick('Leave')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  Mark All Leave
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error Banner */}
        {hasValidationError && (
          <div className="bg-red-50 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-600">Attendance is required for daily wage and fixed salary employees.</p>
          </div>
        )}

        {/* Attendance Records */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No active employees found. Please add employees from Employee Management.</p>
              </div>
            ) : (
              attendanceRecords.map((record) => {
                const needsAttendance = record.category === 'Daily Wages' || record.category === 'Fixed Salary';
                const hasError = hasValidationError && needsAttendance && !record.attendance;

                return (
                  <div 
                    key={record.employeeId} 
                    className={`border rounded-lg p-4 ${
                      hasError ? 'border-red-500' : 'border-gray-200'
                    } ${isViewOnly ? 'bg-gray-50' : ''}`}
                  >
                    {/* Employee Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Employee Name</p>
                        <p className="text-gray-900">{record.employeeName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Employee ID</p>
                        <p className="text-gray-900">{record.employeeId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone Number</p>
                        <p className="text-gray-900">{record.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Role</p>
                        <p className="text-gray-900">{record.role}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Category</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                          record.category === 'Daily Wages' ? 'bg-purple-100 text-purple-800' :
                          record.category === 'Fixed Salary' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {record.category}
                        </span>
                      </div>
                    </div>

                    {/* Attendance Selector */}
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Attendance Input {needsAttendance && <span className="text-red-600">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Present', 'Absent', 'Half Day', 'Leave'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleAttendanceChange(record.employeeId, status as any)}
                            disabled={isViewOnly}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              record.attendance === status
                                ? status === 'Present' ? 'bg-green-600 text-white border-green-600' :
                                  status === 'Absent' ? 'bg-red-600 text-white border-red-600' :
                                  status === 'Half Day' ? 'bg-yellow-600 text-white border-yellow-600' :
                                  'bg-orange-600 text-white border-orange-600'
                                : isViewOnly 
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Save Button - Only show if can edit */}
        {attendanceRecords.length > 0 && !isViewOnly && (
          <div className="flex justify-end">
            <button
              onClick={validateAndSave}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Attendance
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Confirmation Popup */}
      {showBulkConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">Confirm Bulk Action</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to apply this to all employees?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleBulkCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && (
        <Popup
          title="Success"
          message={popupMessage}
          onClose={handlePopupClose}
          type="success"
        />
      )}
    </div>
  );
}
