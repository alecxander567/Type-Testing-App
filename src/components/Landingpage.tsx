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

      <h1 className="text-6xl font-extrabold text-blue-400 mb-6">
        TypeTesting App
      </h1>

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLogin(false)}>
          <div
            className="relative w-full max-w-md rounded-2xl border border-blue-500 bg-black p-8 shadow-2xl 
             animate-fadeIn animate-scaleUp text-blue-300"
            onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition"
              onClick={() => setShowLogin(false)}
              aria-label="Close login modal">
              ✕
            </button>

            {loginAlert && (
              <div className="mb-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-black animate-fadeIn">
                {loginAlert}
              </div>
            )}

            <h2 className="mb-6 text-center text-3xl font-bold text-blue-400">
              Welcome Back
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full rounded-lg border border-blue-500 bg-black p-3 
                     text-blue-300 placeholder-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-blue-500 bg-black p-3 
                     text-blue-300 placeholder-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 rounded-lg bg-blue-500 py-3 font-semibold text-black
                     hover:bg-blue-400 transition shadow-lg">
                Login
              </button>

              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 rounded-lg border border-blue-500 py-3 font-semibold
                     text-blue-400 hover:bg-blue-500 hover:text-black transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowSignup(false)}>
          <div
            className="relative w-full max-w-md rounded-2xl border border-blue-500 bg-black p-8
                 text-blue-300 shadow-2xl animate-[fadeInScale_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition"
              onClick={() => setShowSignup(false)}
              aria-label="Close signup modal">
              ✕
            </button>

            <h2 className="mb-6 text-center text-3xl font-bold text-blue-400">
              Create Account
            </h2>

            {signupMessage && (
              <div className="mb-4 rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-black animate-fadeIn">
                {signupMessage}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="w-full rounded-lg border border-blue-500 bg-black p-3
                     text-blue-300 placeholder-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full rounded-lg border border-blue-500 bg-black p-3
                     text-blue-300 placeholder-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-blue-500 bg-black p-3
                     text-blue-300 placeholder-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSignup}
                className="flex-1 rounded-lg bg-blue-500 py-3 font-semibold text-black
                     hover:bg-blue-400 transition shadow-lg">
                Sign Up
              </button>

              <button
                onClick={() => setShowSignup(false)}
                className="flex-1 rounded-lg border border-blue-500 py-3 font-semibold
                     text-blue-400 hover:bg-blue-500 hover:text-black transition">
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
