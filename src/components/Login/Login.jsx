// src/Login.jsx
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "./firebase";
import { auth, googleProvider } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Email & Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert(`Login successful! Welcome ${user.email}`);
      console.log("User:", user);
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert(`Google Login successful! Welcome ${user.displayName}`);
      console.log("User:", user);
    } catch (error) {
      console.error("Google Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        🔑 Secure Login
      </h2>

      <form
        onSubmit={handleEmailLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700"
      >
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@google.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 w-full rounded-lg transition duration-200 mb-4"
        >
          {loading ? "Logging in..." : "Login with Email & Password"}
        </button>

        {/* OR Separator */}
        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold py-3 w-full rounded-lg hover:shadow-md transition duration-200"
        >
          <FaGoogle className="mr-3 text-red-500" size={20} />
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default Login;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC9XW0U_ZhmscTXeeUfpztMlRQ4dnuf2Y0",
//   authDomain: "trafficlightsim.firebaseapp.com",
//   projectId: "trafficlightsim",
//   storageBucket: "trafficlightsim.firebasestorage.app",
//   messagingSenderId: "43342606859",
//   appId: "1:43342606859:web:7b50e371f27c1d98184d0e"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
