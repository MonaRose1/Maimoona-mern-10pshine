import { Note } from "../models/Note.js";
import { getUserFromToken } from "../utils/authUtils.js";

export const notesController = {
  // Get notes for a specific user
  getNotes: async (req, res) => {
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
  },

  createNote: async (req, res) => {
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
  },

  getNoteById: async (req, res) => {
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
  },

  updateNote: async (req, res) => {
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
  },

  deleteNote: async (req, res) => {
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
  }
};