import { User } from "../models/User.js";

// Helper function to get user from token (mock implementation)
export const getUserFromToken = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return null;
  }

  // Extract user ID from mock token format: mock-token-{userId}-{timestamp}
  if (token.startsWith('mock-token-')) {
    const parts = token.split('-');
    if (parts.length >= 3) {
      const userId = parts[2]; // Extract the user ID
      const user = await User.findById(userId);
      if (user) {
        return user;
      }
    }
  }

  // Fallback: try to find any user (for backward compatibility)
  return await User.findOne();
};