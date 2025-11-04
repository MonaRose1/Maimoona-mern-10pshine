import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SecretPinDialog } from "@/components/secret-pin-dialog";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";

const VerifyPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Get the return URL from query parameters
  const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/home';

  const handleSuccess = () => {
    // Close the dialog and navigate to the return URL
    setIsOpen(false);
    navigate(returnUrl);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/home');
  };

  // If user accesses this page directly without a returnUrl, redirect to home
  useEffect(() => {
    if (!returnUrl || returnUrl === '/verify-pin') {
      // Check if user has a PIN set
      // In a real implementation, you would check with the backend
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }
  }, [returnUrl, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="text-purple-100 hover:text-white hover:bg-purple-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="text-center max-w-md w-full">
        <div className="rounded-full bg-gradient-to-br from-purple-700 to-indigo-700 p-6 mb-6 inline-flex">
          <Lock className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Secret Safe Access</h1>
        <p className="text-purple-200 mb-8">
          Enter your PIN to access your secret notes
        </p>
        
        <SecretPinDialog
          open={isOpen}
          onOpenChange={handleClose}
          onSuccess={handleSuccess}
          isFirstTime={false}
        />
        
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="text-purple-300 hover:text-white"
          >
            Cancel and return to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPin;