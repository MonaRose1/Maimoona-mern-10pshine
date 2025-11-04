import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SecretPinDialog } from "@/components/secret-pin-dialog";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Shield } from "lucide-react";

const SetupPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Get the return URL from query parameters
  const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/secret-safe';

  const handleSuccess = () => {
    // Close the dialog and navigate to the secret safe
    setIsOpen(false);
    // Show a success message before navigating
    setTimeout(() => {
      navigate('/secret-safe');
    }, 500);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/home');
  };

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
          <Shield className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Set Up Secret PIN</h1>
        <p className="text-purple-200 mb-8">
          Create a PIN to protect your secret notes
        </p>
        
        <SecretPinDialog
          open={isOpen}
          onOpenChange={handleClose}
          onSuccess={handleSuccess}
          isFirstTime={true}
        />
        
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="text-purple-300 hover:text-white"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupPin;