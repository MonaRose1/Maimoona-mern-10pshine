# 🚀 Quick Reference Card

## Start the App

```bash
# Terminal 1 - Backend
cd "d:\10Pearls internship\note-taking-app\feature"
npm run server

# Terminal 2 - Frontend
cd "d:\10Pearls internship\note-taking-app\feature\frontend\notes-app"
npm run dev
```

## Database Info

**User Database**: `notesapp_users`
- Users, authentication

**Notes Database**: `notesapp_notes`  
- Notes, tags, folders

**Clean Database**:
```bash
npm run cleanup-db
```

## Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Purple | `#6D5BD0` | Primary buttons, accents |
| Blue | `#93C5FD` | Secondary, gradients |
| Green | `#6EE7B7` | Success states |
| Background | `#F3F0FF → #FFF` | Gradient background |

## What's Fixed

✅ Separate databases (users/notes)  
✅ Fixed "select note to view"  
✅ Beautiful empty states  
✅ Landing page purple theme  
✅ Enhanced UI/UX  
✅ Cleanup script  

## Key Files

**Backend**:
- `db.js` - Database connections
- `routes.js` - API endpoints
- `.env` - Database URIs

**Frontend**:
- `Home.jsx` - Main app page
- `index.css` - Theme system
- `empty-state.jsx` - Empty UI

## Test It

1. Sign up / Login
2. Create a note
3. See it in the list
4. Click to edit
5. Toggle theme
6. Enjoy! 🎉

**App URL**: http://localhost:5173  
**API URL**: http://localhost:5000

---

Everything works! 💜✨
