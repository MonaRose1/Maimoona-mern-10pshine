// db.js - Separate database connections for users and notes
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const userDbUri = process.env.MONGODB_USER_URI;
const notesDbUri = process.env.MONGODB_NOTES_URI;
const secretDbUri = process.env.MONGODB_SECRET_URI || notesDbUri.replace('notesapp_notes', 'notesapp_secret');

if (!userDbUri || !notesDbUri) {
  throw new Error("MONGODB_USER_URI and MONGODB_NOTES_URI must be set in .env file");
}

// Create separate connections for users, notes, and secret notes
export const userDbConnection = mongoose.createConnection();
export const notesDbConnection = mongoose.createConnection();
export const secretDbConnection = mongoose.createConnection();

export const connectDB = async () => {
  try {
    // Connect to User Database
    await userDbConnection.openUri(userDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ User Database connected (notesapp_users)");

    // Connect to Notes Database
    await notesDbConnection.openUri(notesDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Notes Database connected (notesapp_notes)");

    // Connect to Secret Notes Database
    await secretDbConnection.openUri(secretDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Secret Notes Database connected (notesapp_secret)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await userDbConnection.close();
    await notesDbConnection.close();
    await secretDbConnection.close();
    console.log('\n📴 Database connections closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database connections:', err);
    process.exit(1);
  }
});
