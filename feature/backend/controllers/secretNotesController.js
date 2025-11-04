import { SecretNote } from "../models/SecretNote.js";
import { getUserFromToken } from "../utils/authUtils.js";

export const secretNotesController = {
  // Get secret notes for a specific user
  getSecretNotes: async (req, res) => {
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
  },

  createSecretNote: async (req, res) => {
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
  },

  getSecretNoteById: async (req, res) => {
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
  },

  updateSecretNote: async (req, res) => {
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
  },

  deleteSecretNote: async (req, res) => {
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
  }
};