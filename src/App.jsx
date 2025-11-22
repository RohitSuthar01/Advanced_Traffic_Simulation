import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Header from "./components/Header/header";
import Home from "./components/Home/Home";
import Scann from "./components/scann/Scann";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register"
import Index from "./Pages/Index";



function App() {
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen transition-colors duration-300 dark:bg-pink-400 dark:text-black">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Scann" element={<Scann />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/index" element={<Index />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
