import { User } from "../models/User.js";

export const authController = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Create token with user ID encoded
      const token = `mock-token-${user._id}-${Date.now()}`;
      res.json({
        message: "Signup successful",
        token: token,
        user: { name: user.name, email: user.email, id: user._id }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create token with user ID encoded
      const token = `mock-token-${user._id}-${Date.now()}`;
      res.json({
        message: "Login successful",
        token: token,
        user: { name: user.name, email: user.email, id: user._id }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};