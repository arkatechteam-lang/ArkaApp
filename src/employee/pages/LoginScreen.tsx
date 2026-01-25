import React, { useState, useEffect } from "react";
import { LogIn, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login, validateSession } from "../../services/middleware.service";

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    async function checkSession() {
      try {
        const user = await validateSession();
        if (user) {
          navigate("/employee/home");
        }
      } catch (error) {
        console.log("Session validation failed:", error);
      }
    }

    checkSession();
  }, [])

  useEffect(() => {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length > 0 && !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(email.length > 0 && password.length > 0 && emailRegex.test(email));
    }
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const result = await login(
        email,
        password
      );

      console.log("Login successful:", result);
      navigate("/employee/home");
    } catch (error) {
      setError(
        "Incorrect credentials. Please check your email and password."
      );
      setIsValid(false);
      console.log("Login failed:", error);

      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to App Selection
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900">Employee Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your credentials to continue
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
