import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(208,214,36,1)_0%,rgba(250,0,17,1)_0%,rgba(219,40,19,1)_9%,rgba(203,20,182,1)_51%,rgba(78,154,24,1)_100%,rgba(181,184,37,1)_100%,rgba(59,121,9,1)_51%,rgba(87,138,8,1)_51%,rgba(206,212,2,1)_88%,rgba(237,231,1,1)_95%,rgba(255,242,0,1)_100%,rgba(62,69,21,1)_100%,rgba(0,212,255,1)_96%)]">
 
      <h1 className="text-2xl font-bold text-black">TrafficLight</h1>

      <div className="flex items-center space-x-6">
       
        <nav className="flex space-x-6 ">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/Scann" className="hover:text-blue-400">Scaner</Link>
          <Link to="/register" className="hover:text-blue-400">Registration</Link>
          <Link to="/login" className="hover:text-blue-400">Login</Link>
        </nav>

        {/* 🌞 / 🌜 Theme Toggle Button (Rightmost corner) */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-all"
        >
          {theme === "dark" ? "🌞" : "🌜"}
        </button>
      </div>
    </header>
  );
};

export default Header;

