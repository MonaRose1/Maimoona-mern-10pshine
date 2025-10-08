import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home.jsx"; 
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import "./App.css";
const ProtectedRoute = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const routes = (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  </Routes>
);

const App = () => {
  return (
    <div>
      {routes}
    
    </div>
  );
};

export default App;
