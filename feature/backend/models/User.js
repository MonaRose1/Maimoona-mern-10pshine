import mongoose from "mongoose";
import { userDbConnection } from "../database/db.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  secretPin: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export const User = userDbConnection.model("User", userSchema);