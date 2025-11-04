import { User } from "../models/User.js";
import { getUserFromToken } from "../utils/authUtils.js";

export const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      res.json({
        name: user.name,
        email: user.email,
        id: user._id,
        hasSecretPin: !!user.secretPin,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Check if user has secret PIN
  checkSecretPin: async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      res.json({ hasPin: !!user.secretPin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Set secret PIN
  setSecretPin: async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { pin } = req.body;
      if (!pin || pin.length < 4) {
        return res.status(400).json({ message: "PIN must be at least 4 characters" });
      }

      user.secretPin = pin;
      await user.save();

      res.json({ message: "PIN set successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Verify secret PIN
  verifySecretPin: async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { pin } = req.body;
      if (user.secretPin === pin) {
        res.json({ valid: true, message: "PIN verified" });
      } else {
        res.status(401).json({ valid: false, message: "Invalid PIN" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};