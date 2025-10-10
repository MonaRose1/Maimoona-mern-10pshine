import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you are looking for doesn't exist.</p>
      <Link to="/home" className="btn-primary">Go Home</Link>
    </div>
  );
};

export default NotFound;
