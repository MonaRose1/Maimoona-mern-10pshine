import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home.jsx"; 
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Profile from "./pages/profile/Profile.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import Landing from "./pages/landing/Landing.jsx";
import NotFound from "./pages/not-found/not-found.jsx";
import SecretSafe from "./pages/secret-safe/SecretSafe.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";
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
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/note/:id" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
    <Route path="/secret-safe" element={<ProtectedRoute><SecretSafe /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);


const App = () => {
  return (
    <ThemeProvider>
      {routes}
    </ThemeProvider>
  );
};

export default App;