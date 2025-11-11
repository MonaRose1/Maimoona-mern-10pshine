import { getUserFromToken } from "../utils/authUtils.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};