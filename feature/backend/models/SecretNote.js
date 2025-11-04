import mongoose from "mongoose";
import { secretDbConnection } from "../database/db.js";

const secretNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ""
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: "#3b82f6"
  },
  folderId: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export const SecretNote = secretDbConnection.model("SecretNote", secretNoteSchema);