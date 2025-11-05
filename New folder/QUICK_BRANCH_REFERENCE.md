# 🎯 Quick Reference: Branch → Files Mapping

## 📌 Use this guide to quickly know what files go where!

---

## Branch 1: `feature/frontend/app` 
**📦 Purpose:** App configuration & routing  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/App.jsx`
- ✅ `frontend/notes-app/src/App.css`
- ✅ `frontend/notes-app/src/index.css`
- ✅ `frontend/notes-app/index.html`
- ✅ `frontend/notes-app/vite.config.js`
- ✅ `frontend/notes-app/tailwind.config.js`
- ✅ `frontend/notes-app/postcss.config.js`
- ✅ `frontend/notes-app/package.json`

**🔗 Merge Order:** #1 (FIRST - Foundation)

---

## Branch 2: `feature/frontend/auth-login`
**📦 Purpose:** Login page  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/pages/login/Login.jsx`
- ✅ `frontend/notes-app/src/pages/login/Login.css` (if exists)
- ✅ `frontend/notes-app/src/shared/schema.js` (login validation part)

**🔗 Merge Order:** #8 (After utils & ui-states-styles)

---

## Branch 3: `feature/frontend/auth-signup`
**📦 Purpose:** Signup page  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/pages/signup/Signup.jsx`
- ✅ `frontend/notes-app/src/pages/signup/Signup.css` (if exists)
- ✅ `frontend/notes-app/src/shared/schema.js` (signup validation part)

**🔗 Merge Order:** #9 (After utils & ui-states-styles)

---

## Branch 4: `feature/frontend/components/Note`
**📦 Purpose:** Note components  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/components/NoteEditorComponent.jsx`
- ✅ `frontend/notes-app/src/components/note-list.jsx`
- ✅ `frontend/notes-app/src/components/note-card.jsx`
- ✅ `frontend/notes-app/src/components/note-editor.jsx` (if exists)

**🔗 Merge Order:** #7 (After utils & ui-states-styles)

---

## Branch 5: `feature/frontend/components/input`
**📦 Purpose:** Input components  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/components/ui/input.jsx`
- ✅ `frontend/notes-app/src/components/ui/textarea.jsx`
- ✅ `frontend/notes-app/src/components/ui/label.jsx`
- ✅ `frontend/notes-app/src/components/ui/form.jsx`

**🔗 Merge Order:** #5 (After ui-states-styles)

---

## Branch 6: `feature/frontend/components/navbar`
**📦 Purpose:** Navigation & sidebar  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/components/app-sidebar.jsx`
- ✅ `frontend/notes-app/src/components/sidebar-menu.jsx` (if exists)
- ✅ `frontend/notes-app/src/components/ui/sidebar.jsx`

**🔗 Merge Order:** #6 (After ui-states-styles)

---

## Branch 7: `feature/frontend/home`
**📦 Purpose:** Home/dashboard page  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/pages/home/Home.jsx`
- ✅ `frontend/notes-app/src/pages/home/Home.css`

**🔗 Merge Order:** #14 (After all components)

---

## Branch 8: `feature/frontend/index`
**📦 Purpose:** App entry point  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/main.jsx`

**🔗 Merge Order:** #4 (After app)

---

## Branch 9: `feature/frontend/landingpage`
**📦 Purpose:** Landing page  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/pages/landing/Landing.jsx`
- ✅ `frontend/notes-app/src/pages/landing/Landing.css` (if exists)

**🔗 Merge Order:** #10 (After ui-states-styles)

---

## Branch 10: `feature/frontend/profile`
**📦 Purpose:** User profile page  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/pages/profile/Profile.jsx`
- ✅ `frontend/notes-app/src/pages/profile/Profile.css` (if exists)

**🔗 Merge Order:** #11 (After utils & ui-states-styles)

---

## Branch 11: `feature/frontend/secret-notes`
**📦 Purpose:** Secret notes dashboard  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/pages/secret-safe/SecretSafe.jsx`
- ✅ `frontend/notes-app/src/pages/secret-safe/SecretSafe.css` (if exists)

**🔗 Merge Order:** #13 (After secret-pin & components)

---

## Branch 12: `feature/frontend/secret-pin`
**📦 Purpose:** PIN dialog  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/components/secret-pin-dialog.jsx`

**🔗 Merge Order:** #12 (After utils & ui-states-styles)

---

## Branch 13: `feature/frontend/tests-jest`
**📦 Purpose:** Frontend tests  
**✅ Add these files:**
- ✅ `frontend/notes-app/test/pages/Login.test.jsx`
- ✅ `frontend/notes-app/test/pages/Signup.test.jsx`
- ✅ `frontend/notes-app/test/utils/helper.test.js`
- ✅ `frontend/notes-app/test/setupTests.js`
- ✅ `frontend/notes-app/test/test-utils.jsx`
- ✅ `frontend/notes-app/jest.config.js`
- ✅ `frontend/notes-app/babel.config.cjs`

**🔗 Merge Order:** #15 (LAST - After all features)

---

## Branch 14: `feature/frontend/ui-states-styles`
**📦 Purpose:** UI components & theme  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/components/ui/button.jsx`
- ✅ `frontend/notes-app/src/components/ui/card.jsx`
- ✅ `frontend/notes-app/src/components/ui/dialog.jsx`
- ✅ `frontend/notes-app/src/components/ui/separator.jsx`
- ✅ `frontend/notes-app/src/components/ui/avatar.jsx`
- ✅ `frontend/notes-app/src/components/ui/...` (all other UI components)
- ✅ `frontend/notes-app/src/components/theme-provider.jsx`
- ✅ `frontend/notes-app/src/components/theme-toggle.jsx`
- ✅ `frontend/notes-app/src/lib/utils.js`

**🔗 Merge Order:** #2 (EARLY - Foundation)

---

## Branch 15: `feature/frontend/utils`
**📦 Purpose:** Utility functions  
**✅ Add these files:**
- ✅ `frontend/notes-app/src/utils/helper.js`

**🔗 Merge Order:** #3 (EARLY - Foundation)

---

## 📊 Merge Order Summary

```
Phase 1: Foundation (Merge First)
  1. app
  2. ui-states-styles
  3. utils
  4. index

Phase 2: Components (Merge Second)
  5. components/input
  6. components/navbar
  7. components/Note

Phase 3: Pages (Merge Third)
  8. auth-login
  9. auth-signup
  10. landingpage
  11. profile

Phase 4: Advanced Features (Merge Fourth)
  12. secret-pin
  13. secret-notes
  14. home

Phase 5: Testing (Merge Last)
  15. tests-jest
```

---

## 🎯 Quick Commands

### Create Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/frontend/branch-name
```

### Add Files
```bash
# Add ONLY files that belong to this branch
git add src/pages/login/Login.jsx
git commit -m "feat: add login page"
```

### Push Branch
```bash
git push -u origin feature/frontend/branch-name
```

### Merge (After PR Approval)
```bash
git checkout develop
git merge --no-ff feature/frontend/branch-name
git push origin develop
```

---

## ⚠️ Important Rules

1. **Only add files listed for your branch**
2. **Don't edit files from other branches**
3. **Sync with develop regularly**
4. **Follow the merge order**
5. **Test before creating PR**

---

## 🆘 Need Help?

- **Conflicts?** See GIT_BRANCHING_STRATEGY.md Section: "Conflict Prevention"
- **Wrong files added?** Use `git reset HEAD <file>` to unstage
- **Questions?** Ask your team lead

---

**Quick Tip:** Bookmark this file for easy reference! 📑
