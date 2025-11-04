import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requirePin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      // Check for basic user authentication
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        navigate('/login');
        return;
      }

      // If PIN verification is not required, allow access
      if (!requirePin) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check for PIN verification
      const pinToken = localStorage.getItem('secretPinToken');
      if (!pinToken) {
        // No PIN token, redirect to verification
        navigate('/verify-pin?returnUrl=' + encodeURIComponent(location.pathname));
        setIsLoading(false);
        return;
      }

      // In a real implementation, you would verify the token with the backend
      // For now, we'll just check if it exists
      try {
        // Simple check - in production, verify JWT token
        setIsAuthorized(true);
      } catch (err) {
        // Token invalid, redirect to PIN verification
        localStorage.removeItem('secretPinToken');
        navigate('/verify-pin?returnUrl=' + encodeURIComponent(location.pathname));
      }
      
      setIsLoading(false);
    };

    checkAuthorization();
  }, [navigate, requirePin, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-purple-500">
        <div className="text-center">
          <div className="relative inline-flex mb-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;