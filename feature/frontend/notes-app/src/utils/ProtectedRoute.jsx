import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or however you store it
  return token ? children : <Navigate to="/login" replace />;
};