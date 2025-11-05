# Feature Branch: secret-notes

## 📝 Secret Notes Management Module

This branch contains the frontend components and pages for managing secret notes with PIN protection.

---

## 📂 Files in This Branch

```
frontend/notes-app/src/
├── components/
│   ├── SecretSafe.jsx           (0.6 KB) - Note card component
│   └── SecretSearchBar.jsx      (0.7 KB) - Search/PIN entry bar
│
└── pages/
    └── secret-safe/
        └── SecretSafe.jsx       (11.4 KB) - Main page component
```

---

## 🎯 Component Overview

### 1️⃣ `pages/secret-safe/SecretSafe.jsx` (Main Page - 11.4 KB)

The primary interface for managing secret notes with full CRUD functionality.

#### Features:
- ✅ **Full CRUD Operations**
  - Create new secret notes
  - Read/view secret notes
  - Update existing notes
  - Delete notes
  
- ✅ **Organization Features**
  - Folder management (Secret Work, Secret Personal)
  - Pin/unpin important notes
  - Show all notes or filter by folder
  - View only pinned notes
  
- ✅ **Search & Discovery**
  - Full-text search across titles, content, and tags
  - Real-time search results (max 10)
  - Search dialog integration
  
- ✅ **UI Components**
  - Sidebar with folder navigation
  - Note list view
  - Rich text editor integration
  - Search and folder creation dialogs
  
- ✅ **Visual Design**
  - Purple-to-indigo gradient theme
  - Glassmorphism effects (backdrop-blur)
  - Loading states with spinner
  - Error states with helpful messages
  - Empty state with call-to-action

#### API Endpoints:
```javascript
GET    /api/secret/notes          // Fetch all secret notes
POST   /api/secret/notes          // Create new secret note
PUT    /api/secret/notes/:id      // Update secret note
DELETE /api/secret/notes/:id      // Delete secret note
```

#### State Management:
```javascript
- notes: []                 // All secret notes
- selectedNoteId: ""        // Currently selected note
- selectedFolderId: ""      // Active folder filter
- showPinned: false         // Pinned notes filter
- showAllNotes: true        // Show all vs filtered
- searchQuery: ""           // Search term
- folders: []               // Folder list
```

#### Props/Usage:
```jsx
import SecretSafe from '@/pages/secret-safe/SecretSafe';

// Route setup
<Route path="/secret-safe" element={<SecretSafe />} />
```

---

### 2️⃣ `components/SecretSafe.jsx` (Card Component - 0.6 KB)

Simple display component for showing secret notes in a grid layout.

#### Features:
- ✅ Grid layout for note cards
- ✅ Dangerously set inner HTML for rich content
- ✅ Fallback message for empty state
- ✅ Border and shadow styling

#### Props:
```javascript
{
  notes: Array  // Array of note objects
}
```

#### Usage:
```jsx
import SecretSafe from '@/components/SecretSafe';

<SecretSafe notes={secretNotes} />
```

#### Example:
```jsx
<SecretSafe 
  notes={[
    { id: '1', title: 'Secret Meeting', content: '<p>Details...</p>' },
    { id: '2', title: 'Passwords', content: '<p>Secure info...</p>' }
  ]} 
/>
```

---

### 3️⃣ `components/SecretSearchBar.jsx` (Search Bar - 0.7 KB)

Dual-purpose search component that handles both note searching and PIN entry.

#### Features:
- ✅ **Standard Search:** Filter notes by keyword
- ✅ **PIN Unlock:** Auto-unlock when secret PIN entered
- ✅ **Clear Function:** Reset search state
- ✅ **Real-time Input:** Live onChange handling

#### Props:
```javascript
{
  value: string,           // Current search value
  onChange: function,      // Search input handler
  onClearSearch: function, // Clear button handler
  onSecretUnlock: function,// PIN unlock callback
  secretPin: string        // Secret PIN to match
}
```

#### Usage:
```jsx
import SecretSearchBar from '@/components/SecretSearchBar';

<SecretSearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  onClearSearch={() => setSearchTerm('')}
  onSecretUnlock={handleUnlock}
  secretPin="1234"
/>
```

#### Logic Flow:
```javascript
1. User types in search bar
2. onChange triggered → Check if input matches secretPin
3. If match → Call onSecretUnlock()
4. If no match → Continue normal search
5. Clear button → Reset search
```

---

## 🎨 Design System

### Color Palette:
```css
Primary: Purple (#8b5cf6, #a855f7)
Secondary: Indigo (#4f46e5, #6366f1)
Accent: Pink (#ec4899)

Gradients:
- Main BG: from-purple-900 via-purple-800 to-indigo-900
- Buttons: from-purple-600 to-indigo-600
- Borders: border-purple-700
```

### Theme Features:
- **Glassmorphism:** `bg-purple-900/60 backdrop-blur-md`
- **Loading:** Spinning border animation
- **Icons:** Lock, Search, ArrowLeft (Lucide React)
- **Layout:** Sidebar + List + Editor (3-column)

---

## 🔗 Dependencies

### UI Components:
- `AppSidebar` - Folder navigation
- `NoteList` - Note list view
- `NoteEditorComponent` - Rich text editor
- `SearchDialog` - Search modal
- `FolderDialog` - Create folder modal
- `ThemeToggle` - Dark/light mode
- `SidebarProvider`, `SidebarTrigger` - Sidebar state

### Libraries:
- React Router (`useNavigate`)
- Lucide React (icons)
- Custom utils (`apiRequest`)

---

## 📱 Page Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Header: Back | Sidebar Toggle | Title | Search | Theme │
├─────────────┬──────────────┬──────────────────────────┤
│             │              │                          │
│  Sidebar    │  Note List   │    Note Editor          │
│             │              │                          │
│  Folders:   │  Note 1      │  [Rich Text Editor]     │
│  □ All      │  Note 2      │                          │
│  □ Work     │  Note 3      │  Title: _________        │
│  □ Personal │  ...         │  Tags: ___________       │
│  □ Pinned   │              │  Content: [Editor]       │
│             │              │                          │
│  + New Note │  + New Note  │  [Save] [Delete] [Pin]   │
│  + Folder   │              │                          │
└─────────────┴──────────────┴──────────────────────────┘
```

---

## 🧪 Testing Checklist

### CRUD Operations:
- [ ] Create new secret note
- [ ] View secret note details
- [ ] Edit note title, content, tags
- [ ] Delete secret note
- [ ] Auto-save functionality

### Organization:
- [ ] Create new folder
- [ ] Assign note to folder
- [ ] Filter notes by folder
- [ ] Pin/unpin notes
- [ ] View only pinned notes
- [ ] Show all notes

### Search:
- [ ] Search by title
- [ ] Search by content
- [ ] Search by tags
- [ ] Clear search
- [ ] Search results display

### UI/UX:
- [ ] Loading state display
- [ ] Error state display
- [ ] Empty state display
- [ ] Sidebar toggle
- [ ] Back navigation
- [ ] Theme toggle
- [ ] Responsive layout

---

## 🚀 Integration Points

This module integrates with:

1. **Home Page:** Access via double-click or secret button
2. **Profile Page:** PIN setup and management
3. **Secret PIN Dialog:** Authentication before access
4. **Backend API:** `/api/secret/*` endpoints
5. **Shared Components:** Editor, sidebar, dialogs

---

## 📝 Development Guidelines

### When working on this branch:

1. **Scope:** Only secret notes UI/functionality
2. **Backend:** Assumes `/api/secret/*` endpoints exist
3. **Styling:** Maintain purple gradient theme
4. **Security:** Always verify PIN before access
5. **State:** Use React hooks for state management

### Code Style:
```javascript
// Use functional components
export default function SecretSafe() { ... }

// Destructure state clearly
const [notes, setNotes] = useState([]);

// Handle errors gracefully
try {
  // API call
} catch (err) {
  setError(err.message || "Failed to ...");
}

// Use semantic HTML
<header>, <main>, <section>
```

### Best Practices:
- Always show loading states during API calls
- Provide clear error messages
- Use optimistic UI updates when possible
- Maintain consistent spacing and styling
- Keep components focused and modular

---

## 🔄 Git Workflow

```bash
# Work on this branch
git checkout feature/frontend/secret-notes

# Make changes to secret notes components
# ... edit files ...

# Stage changes
git add frontend/notes-app/src/components/SecretSafe.jsx
git add frontend/notes-app/src/components/SecretSearchBar.jsx
git add frontend/notes-app/src/pages/secret-safe/SecretSafe.jsx

# Commit with descriptive message
git commit -m "feat(secret-notes): <your changes>"

# Push to remote
git push origin feature/frontend/secret-notes

# Merge to integration (when ready and tested)
git checkout local/integration
git merge feature/frontend/secret-notes
```

---

## 📊 Branch Status

- **Current Commit:** `a7170ab - Add SecretSafe page component for secret notes management`
- **Status:** 1 commit ahead of `origin/feature/frontend/secret-notes`
- **Base Branch:** Branched from `local/integration`
- **Conflicts:** None (independent scope)

---

## 🎯 Future Enhancements

Potential improvements:
- [ ] Note templates for secret notes
- [ ] Export/import encrypted notes
- [ ] Share secret notes securely
- [ ] Note versioning/history
- [ ] Advanced search filters
- [ ] Bulk operations (move, delete)
- [ ] Custom folder colors/icons
- [ ] Note attachments (encrypted)
- [ ] Collaboration features
- [ ] Auto-lock after inactivity

---

## 🔐 Security Considerations

1. **Access Control:**
   - Always verify PIN before loading notes
   - Clear notes on logout
   - Auto-lock after timeout

2. **Data Protection:**
   - Separate database (`secret-notes.db`)
   - Never log note content
   - Clear clipboard after copy

3. **User Privacy:**
   - No note preview in search results
   - Obfuscate titles in UI logs
   - Secure API communication

---

## 📚 Related Documentation

- [Branch README: secret-pin](./BRANCH_README_secret-pin.md)
- [Secret Safe Quick Reference](./SECRET_SAFE_QUICK_REF.md)
- [Secret Safe Branches Status](./SECRET_SAFE_BRANCHES_STATUS.md)
- [Secret Safe Implementation Guide](./SECRET_SAFE_IMPLEMENTATION.md)

---

**Branch Owner:** Frontend Team  
**Feature:** Secret Notes Management  
**Status:** ✅ Active Development  
**Last Updated:** 2025-10-15
