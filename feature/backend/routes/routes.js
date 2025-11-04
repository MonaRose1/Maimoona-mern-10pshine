import { createServer } from "http";
import { User } from "../models/User.js";
import { Note } from "../models/Note.js";
import { SecretNote } from "../models/SecretNote.js";

export async function registerRoutes(app) {
  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
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
  });

  app.post("/api/auth/login", async (req, res) => {
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
  });

  // Helper function to get user from token (mock implementation)
  const getUserFromToken = async (req) => {
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

  // Notes routes - Get notes for a specific user
  app.get("/api/notes", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const notes = await Note.find({ userId: user._id }).sort({ updatedAt: -1 });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = new Note({
        ...req.body,
        userId: user._id
      });
      await note.save();
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = await Note.findOne({ _id: req.params.id, userId: user._id });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: user._id }, 
        { ...req.body, updatedAt: new Date() }, 
        { new: true }
      );
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = await Note.findOneAndDelete({ _id: req.params.id, userId: user._id });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // User profile route
  app.get("/api/me", async (req, res) => {
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
  });

  // Secret Safe PIN routes
  app.post("/api/secret/check-pin", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      res.json({ hasPin: !!user.secretPin });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/secret/set-pin", async (req, res) => {
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
  });

  app.post("/api/secret/verify-pin", async (req, res) => {
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
  });

  // Secret Notes routes
  app.get("/api/secret/notes", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const notes = await SecretNote.find({ userId: user._id }).sort({ updatedAt: -1 });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/secret/notes", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = new SecretNote({
        ...req.body,
        userId: user._id
      });
      await note.save();
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/secret/notes/:id", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = await SecretNote.findOne({ _id: req.params.id, userId: user._id });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/secret/notes/:id", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = await SecretNote.findOneAndUpdate(
        { _id: req.params.id, userId: user._id }, 
        { ...req.body, updatedAt: new Date() }, 
        { new: true }
      );
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/secret/notes/:id", async (req, res) => {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const note = await SecretNote.findOneAndDelete({ _id: req.params.id, userId: user._id });
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}