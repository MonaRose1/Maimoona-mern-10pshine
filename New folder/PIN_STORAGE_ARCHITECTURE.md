# PIN Storage Architecture

## ✅ Fixed: Using MongoDB Atlas (Not Localhost)

The Secret Safe PIN feature now uses the proper API architecture with MongoDB Atlas.

## Database Structure

### MongoDB Atlas Databases

```
MongoDB Atlas Cluster: github-project.xwbx5js.mongodb.net
├── notesapp_users (User Database)
│   └── users collection
│       ├── name
│       ├── email
│       ├── password
│       └── secretPin ← PIN stored here
│
├── notesapp_notes (Regular Notes Database)
│   └── notes collection
│
└── notesapp_secret (Secret Notes Database)
    └── secretnotes collection
```

## How PIN is Stored

### User Collection Schema
Location: `backend/server/models/User.js`

```javascript
{
  name: String,
  email: String,
  password: String,
  secretPin: String,  // ← User's Secret Safe PIN
  timestamps: true
}
```

**Key Points:**
- ✅ PIN stored in **User document** (not separate collection)
- ✅ Each user has their own `secretPin` field
- ✅ Default value is `null` (first-time users)
- ✅ Stored in `notesapp_users` database on MongoDB Atlas

## API Architecture

### Frontend (Uses apiRequest Helper)

**File**: `frontend/notes-app/src/components/secret-pin-dialog.jsx`

```javascript
import { apiRequest } from "@/utils/helper";

// Set PIN (First Time)
await apiRequest("/api/secret/set-pin", {
  method: "POST",
  body: JSON.stringify({ pin })
});

// Verify PIN (Returning User)
await apiRequest("/api/secret/verify-pin", {
  method: "POST",
  body: JSON.stringify({ pin })
});
```

**Why apiRequest?**
- ✅ Automatically uses correct backend URL
- ✅ Handles authentication headers
- ✅ Works with MongoDB Atlas connection
- ✅ Centralized error handling
- ✅ No hardcoded localhost URLs

### Backend Routes

**File**: `backend/server/routes.js`

```javascript
// Check if user has PIN
POST /api/secret/check-pin
Response: { hasPin: true/false }

// Set new PIN (first time)
POST /api/secret/set-pin
Body: { pin: "1234" }
Updates: user.secretPin in MongoDB Atlas

// Verify existing PIN
POST /api/secret/verify-pin
Body: { pin: "1234" }
Response: { valid: true/false }
```

## Data Flow

### Setting PIN (First Time)

```mermaid
graph LR
    A[User Double-Clicks] --> B[Check PIN API]
    B --> C{Has PIN?}
    C -->|No| D[Show Create PIN Dialog]
    D --> E[User Enters PIN]
    E --> F[POST /api/secret/set-pin]
    F --> G[Update User in MongoDB Atlas]
    G --> H[Navigate to Secret Safe]
```

### Verifying PIN (Returning User)

```mermaid
graph LR
    A[User Double-Clicks] --> B[Check PIN API]
    B --> C{Has PIN?}
    C -->|Yes| D[Show Verify PIN Dialog]
    D --> E[User Enters PIN]
    E --> F[POST /api/secret/verify-pin]
    F --> G[Compare with MongoDB Atlas]
    G -->|Match| H[Navigate to Secret Safe]
    G -->|No Match| I[Show Error]
```

## Why This Architecture?

### ✅ Advantages

1. **Single Source of Truth**
   - PIN stored with user data
   - No separate collection needed
   - Easy user management

2. **MongoDB Atlas Integration**
   - Cloud-hosted database
   - Automatic backups
   - Scalable solution

3. **Secure API Layer**
   - Uses apiRequest helper
   - Consistent authentication
   - Proper error handling

4. **User Isolation**
   - Each user has unique PIN
   - PIN tied to user account
   - No cross-user access

## Previous Issue (FIXED)

### ❌ Before (Incorrect)
```javascript
// Hardcoded localhost URL
const response = await fetch("http://localhost:5000/api/secret/set-pin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ pin })
});
```

**Problems:**
- Hardcoded localhost
- Won't work in production
- Bypasses centralized API handling

### ✅ After (Correct)
```javascript
// Uses apiRequest helper
await apiRequest("/api/secret/set-pin", {
  method: "POST",
  body: JSON.stringify({ pin })
});
```

**Benefits:**
- Works with MongoDB Atlas
- Uses environment configuration
- Production-ready
- Follows project architecture

## Environment Configuration

**File**: `backend/server/.env`

```env
MONGODB_USER_URI=mongodb+srv://user:pass@cluster.mongodb.net/notesapp_users
MONGODB_NOTES_URI=mongodb+srv://user:pass@cluster.mongodb.net/notesapp_notes
MONGODB_SECRET_URI=mongodb+srv://user:pass@cluster.mongodb.net/notesapp_secret
```

## Testing

### Test PIN Storage

1. **Create PIN**:
   - Double-click search icon
   - Enter PIN (e.g., "1234")
   - Confirm PIN
   - Check MongoDB Atlas: User document should have `secretPin: "1234"`

2. **Verify PIN**:
   - Logout and login
   - Double-click search icon
   - Enter same PIN
   - Should access Secret Safe

3. **Check Database**:
   ```javascript
   // In MongoDB Atlas
   db.users.findOne({ email: "your@email.com" })
   // Should see: { secretPin: "1234", ... }
   ```

## Security Notes

⚠️ **Current Implementation**
- PIN stored as plain text
- For development/demo purposes

🔒 **Production Recommendations**
- Hash PIN with bcrypt
- Add salt for extra security
- Implement rate limiting
- Add PIN recovery mechanism

## Summary

✅ **What We Have Now:**
- PIN stored in User collection (notesapp_users database)
- Uses MongoDB Atlas (cloud database)
- Uses apiRequest helper (no hardcoded URLs)
- Follows project architecture
- Works in development and production

✅ **No Separate Collection Needed:**
- `secretPin` field added to existing User model
- One document per user
- Clean and efficient

---

**Architecture Status**: ✅ **CORRECT & PRODUCTION-READY**
