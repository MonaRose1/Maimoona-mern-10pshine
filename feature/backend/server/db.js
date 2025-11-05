// db.js - MongoDB connections
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
  throw new Error("MONGODB_URI must be set in .env file");
}

// Create separate connections for users, notes, and secret notes
// All using the same database but different collections
export const userDbConnection = mongoose.createConnection();
export const notesDbConnection = mongoose.createConnection();
export const secretDbConnection = mongoose.createConnection();

export const connectDB = async () => {
  try {
    // Connect to User Database
    await userDbConnection.openUri(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ User Database connected (NotesApp users)");

    // Connect to Notes Database
    await notesDbConnection.openUri(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Notes Database connected (NotesApp notes)");

    // Connect to Secret Notes Database
    await secretDbConnection.openUri(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Secret Notes Database connected (NotesApp secret)");
  } catch (err) {
    console.error("❌ MongoDB connection error: ", err);
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