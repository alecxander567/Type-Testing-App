import React, { useState } from "react";
import { FaKeyboard, FaBolt, FaRocket } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Interfaces
interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
  };
}

function Landingpage() {
  const navigate = useNavigate();

  // Modal Visibility
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // States
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Alerts
  const [signupAlert, setSignupAlert] = useState<string | null>(null);
  const [loginAlert, setLoginAlert] = useState<string | null>(null);

  // Sign up handler
  const handleSignup = async () => {
    if (signupPassword !== signupConfirmPassword) {
      setSignupMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
        username: signupUsername,
        password: signupPassword,
      });

      setSignupAlert("User created successfully!");

      setTimeout(() => setSignupAlert(null), 3000);

      setSignupMessage("");
      setSignupUsername("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setShowSignup(false);
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        setSignupMessage(
          data.username ? data.username[0] : "Error creating user"
        );
      } else {
        setSignupMessage("Network error");
      }
    }
  };

  // Login handler
  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      setLoginAlert("Please fill in all fields");
      setTimeout(() => setLoginAlert(null), 3000);
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
        "http://127.0.0.1:8000/api/login/",
        {
          username: loginUsername,
          password: loginPassword,
        }
      );

      localStorage.setItem("username", response.data.user.username);

      setLoginAlert("Login successful!");
      setTimeout(() => setLoginAlert(null), 1500);

      setLoginUsername("");
      setLoginPassword("");
      setShowLogin(false);

      navigate("/home");
    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        setLoginAlert(data.detail || "Invalid username or password");
      } else {
        setLoginAlert("Network error");
      }
      setTimeout(() => setLoginAlert(null), 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      <FaKeyboard
        className="absolute top-10 left-5 text-blue-400 opacity-30 animate-bounce-slow"
        size={40}
      />
      <FaBolt
        className="absolute top-1/3 right-10 text-blue-500 opacity-25 animate-pulse-slow"
        size={50}
      />
      <FaRocket
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-blue-400 opacity-20 animate-bounce-slow"
        size={60}
      />

      <h1 className="text-6xl font-extrabold text-blue-400 mb-6">TypeMaster</h1>

      <p className="text-xl text-blue-300 mb-8">
        Test your typing speed. Improve your skills. Track your progress.
      </p>

      <div className="flex space-x-4">
        <button
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black font-semibold rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
          onClick={() => setShowLogin(true)}>
          Login
        </button>

        <button
          className="px-6 py-3 border border-blue-500 text-blue-500 hover:text-black hover:bg-blue-500 font-semibold rounded-lg transition duration-300"
          onClick={() => setShowSignup(true)}>
          Sign Up
        </button>
      </div>

      <p className="text-blue-400 mt-12 text-sm">
        © 2025 TypeMaster. All rights reserved.
      </p>

      {showLogin && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-black p-8 rounded-xl border border-blue-500 w-96 max-w-full transform scale-90 transition-transform duration-300 animate-scaleUp relative">
            {loginAlert && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
                {loginAlert}
              </div>
            )}

            <h2 className="text-3xl text-blue-400 mb-6">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full mb-4 p-3 rounded border border-blue-500 bg-black text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full mb-6 p-3 rounded border border-blue-500 bg-black text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black rounded-lg shadow-lg transition duration-300"
                onClick={handleLogin}>
                Login
              </button>
              <button
                className="px-6 py-3 border border-blue-500 text-blue-500 hover:text-black hover:bg-blue-500 rounded-lg transition duration-300"
                onClick={() => setShowLogin(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 transition-opacity duration-500 animate-fadeIn">
          <div className="bg-black p-8 rounded-xl border border-blue-500 w-96 max-w-full transform scale-90 transition-transform duration-300 animate-scaleUp">
            <h2 className="text-3xl text-blue-400 mb-6">Sign Up</h2>

            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              className="w-full mb-4 p-3 rounded border border-blue-500 bg-black text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full mb-4 p-3 rounded border border-blue-500 bg-black text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              className="w-full mb-6 p-3 rounded border border-blue-500 bg-black text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {signupMessage && (
              <p className="text-red-500 mb-4">{signupMessage}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black rounded-lg shadow-lg transition duration-300"
                onClick={handleSignup}>
                Sign Up
              </button>
              <button
                className="px-6 py-3 border border-blue-500 text-blue-500 hover:text-black hover:bg-blue-500 rounded-lg transition duration-300"
                onClick={() => setShowSignup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {signupAlert && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-blue-500 text-black px-8 py-4 rounded-xl shadow-2xl border border-blue-400 
                  text-lg font-semibold z-50 animate-fadeIn transition-all duration-500">
          {signupAlert}
        </div>
      )}

      {loginAlert && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               bg-blue-500 text-black px-8 py-4 rounded-xl shadow-2xl border border-blue-400 
               text-lg font-semibold z-50 animate-fadeIn transition-all duration-500">
          {loginAlert}
        </div>
      )}
    </div>
  );
}

export default Landingpage;
