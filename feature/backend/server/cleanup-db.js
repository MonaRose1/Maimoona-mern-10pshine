// cleanup-db.js - Script to clean up seeded sample data from MongoDB
import { connectDB, userDbConnection, notesDbConnection } from "./db.js";
import { User } from "./models/User.js";
import { Note } from "./models/Note.js";

const cleanupDatabases = async () => {
  try {
    console.log("🧹 Starting database cleanup...\n");
    
    // Connect to databases
    await connectDB();
    
    // Get counts before cleanup
    const userCountBefore = await User.countDocuments();
    const noteCountBefore = await Note.countDocuments();
    
    console.log(`📊 Before cleanup:`);
    console.log(`   - Users: ${userCountBefore}`);
    console.log(`   - Notes: ${noteCountBefore}\n`);
    
    // Delete all users
    const userResult = await User.deleteMany({});
    console.log(`🗑️  Deleted ${userResult.deletedCount} users`);
    
    // Delete all notes
    const noteResult = await Note.deleteMany({});
    console.log(`🗑️  Deleted ${noteResult.deletedCount} notes\n`);
    
    // Get counts after cleanup
    const userCountAfter = await User.countDocuments();
    const noteCountAfter = await Note.countDocuments();
    
    console.log(`📊 After cleanup:`);
    console.log(`   - Users: ${userCountAfter}`);
    console.log(`   - Notes: ${noteCountAfter}\n`);
    
    console.log("✅ Database cleanup completed successfully!");
    
    // Close connections
    await userDbConnection.close();
    await notesDbConnection.close();
    console.log("📴 Database connections closed");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
};

// Run cleanup
cleanupDatabases();
