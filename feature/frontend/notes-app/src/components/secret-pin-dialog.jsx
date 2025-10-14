import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/utils/helper";

export function SecretPinDialog({
  open,
  onOpenChange,
  onSuccess,
  isFirstTime = false,
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isFirstTime) {
      // Setting up PIN for the first time
      if (pin.length < 4) {
        setError("PIN must be at least 4 characters");
        return;
      }
      if (pin !== confirmPin) {
        setError("PINs do not match");
        return;
      }

      setLoading(true);
      try {
        await apiRequest("/api/secret/set-pin", {
          method: "POST",
          body: JSON.stringify({ pin })
        });

        onSuccess();
        setPin("");
        setConfirmPin("");
      } catch (err) {
        setError(err.message || "Failed to set PIN");
      } finally {
        setLoading(false);
      }
    } else {
      // Verifying existing PIN
      if (!pin) {
        setError("Please enter your PIN");
        return;
      }

      setLoading(true);
      try {
        const data = await apiRequest("/api/secret/verify-pin", {
          method: "POST",
          body: JSON.stringify({ pin })
        });

        if (!data.valid) {
          throw new Error(data.message || "Invalid PIN");
        }

        onSuccess();
        setPin("");
      } catch (err) {
        setError(err.message || "Invalid PIN");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setPin("");
    setConfirmPin("");
    setError("");
    setShowPin(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-purple-100 rounded-full">
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {isFirstTime ? "Create Secret PIN" : "Enter Secret PIN"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isFirstTime
              ? "Set up a PIN to protect your secret notes"
              : "Enter your PIN to access secret notes"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isFirstTime ? "Create PIN" : "PIN"}
            </label>
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (min 4 characters)"
                className="pr-10"
                autoFocus
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isFirstTime && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm PIN</label>
              <Input
                type={showPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm your PIN"
                dir="ltr"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? "Please wait..." : isFirstTime ? "Create PIN" : "Unlock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
