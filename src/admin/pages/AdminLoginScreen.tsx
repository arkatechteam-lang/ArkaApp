import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";


// Mock admin credentials
const MOCK_ADMINS = [
  { phone: '9999999999', password: 'admin123' },
  { phone: '9999999998', password: 'admin@2024' },
];

export function AdminLoginScreen() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate phone number
    if (phoneNumber.length > 0 && phoneNumber.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      setIsValid(false);
    } else if (phoneNumber.length > 0 && !/^\d+$/.test(phoneNumber)) {
      setError('Phone number must contain only digits');
      setIsValid(false);
    } else {
      setError('');
      setIsValid(phoneNumber.length === 10 && password.length > 0);
    }
  }, [phoneNumber, password]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  const handleLogin = () => {
    // Check if credentials match
    const admin = MOCK_ADMINS.find(
      (adm) => adm.phone === phoneNumber && adm.password === password
    );

    if (!admin) {
      setError('Incorrect credentials. Please check your phone number and password.');
      console.log("Login failed");
      setIsValid(false);
    } else {
      navigate("/admin/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to App Selection
          </button>
      
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter credentials to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                maxLength={10}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Login
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">Demo Credentials:</p>
            <p className="text-gray-700 text-sm">Phone: 9999999999</p>
            <p className="text-gray-700 text-sm">Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}