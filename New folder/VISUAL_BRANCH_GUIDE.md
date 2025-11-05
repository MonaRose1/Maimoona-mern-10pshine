# 🎨 Visual Git Branching Guide

## 📊 Branch Dependency Diagram

```
                                    main (production)
                                       |
                                       |
                                    develop
                                       |
        ┌──────────────────────────────┴────────────────────────────────┐
        |                                                                 |
   PHASE 1: Foundation (Merge First)                              PHASE 5: Testing (Merge Last)
        |                                                                 |
        ├─ 1. feature/frontend/app ───────────────────────────────►  15. feature/frontend/tests-jest
        ├─ 2. feature/frontend/ui-states-styles ─────────────────►      (depends on ALL)
        ├─ 3. feature/frontend/utils ────────────────────────────►
        └─ 4. feature/frontend/index ────────────────────────────►
                    │                    │
                    │                    │
                    ▼                    ▼
        ┌───────────────────────┐   ┌──────────────────────────┐
        │  PHASE 2: Components  │   │   PHASE 3: Pages         │
        │  (Merge Second)       │   │   (Merge Third)          │
        └───────────────────────┘   └──────────────────────────┘
                    │                           │
        ┌───────────┼───────────┐   ┌──────────┼──────────────┐
        │           │           │   │          │              │
        ▼           ▼           ▼   ▼          ▼              ▼
   5. input    6. navbar   7. Note  8. login  9. signup  10. landing
                                              11. profile
                    │
                    │
                    ▼
        ┌───────────────────────┐
        │ PHASE 4: Advanced     │
        │ (Merge Fourth)        │
        └───────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  12. secret-pin  13. secret-notes  14. home
                                   (uses everything)
```

---

## 🔄 File Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION FLOW                        │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   main.jsx (index)     │  ◄── Branch: index
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   App.jsx (app)        │  ◄── Branch: app
                    │   • Routes             │
                    │   • Global Config      │
                    └────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   Landing   │  │    Login    │  │   Signup    │
       │ (landingpage)│  │(auth-login) │  │(auth-signup)│
       └─────────────┘  └─────────────┘  └─────────────┘
                │                │                │
                └────────────────┴────────────────┘
                                 │
                    Authentication Success
                                 │
                                 ▼
                       ┌──────────────────┐
                       │   Home.jsx       │  ◄── Branch: home
                       │   (Dashboard)    │
                       └──────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   Profile   │  │ Secret Notes│  │   Regular   │
       │  (profile)  │  │(secret-notes)│  │    Notes    │
       └─────────────┘  └─────────────┘  │ (components)│
                                │         └─────────────┘
                                │
                                ▼
                      ┌─────────────────┐
                      │  PIN Dialog     │  ◄── Branch: secret-pin
                      │ (secret-pin)    │
                      └─────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    SHARED ACROSS ALL PAGES                        │
└──────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │  UI Components│  │    Utils      │  │   Navbar      │
    │(ui-states-   │  │    (utils)    │  │(components/   │
    │  styles)     │  │  • apiRequest │  │  navbar)      │
    │  • Button    │  │  • validation │  │  • Sidebar    │
    │  • Card      │  │  • helpers    │  │  • Menu       │
    │  • Dialog    │  └───────────────┘  └───────────────┘
    │  • Theme     │
    └───────────────┘
```

---

## 📦 Component Dependency Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEPENDENCIES                             │
└─────────────────────────────────────────────────────────────────┘

Home Page
  └─► Depends on:
      ├─► components/Note (note-list, note-card, note-editor)
      ├─► components/navbar (app-sidebar)
      ├─► components/input (input, textarea)
      ├─► utils (apiRequest, validation)
      └─► ui-states-styles (Button, Card, Dialog, Theme)

Login Page
  └─► Depends on:
      ├─► utils (apiRequest, validateEmail, validatePassword)
      └─► ui-states-styles (Button, Input, Card, ThemeToggle)

Signup Page
  └─► Depends on:
      ├─► utils (apiRequest, validation functions)
      └─► ui-states-styles (Button, Input, Card, ThemeToggle)

Profile Page
  └─► Depends on:
      ├─► utils (apiRequest)
      └─► ui-states-styles (Button, Card, Avatar, Separator, Theme)

Secret Notes
  └─► Depends on:
      ├─► components/Note (note components)
      ├─► secret-pin (PIN dialog)
      ├─► utils (apiRequest)
      └─► ui-states-styles (UI components)

Secret PIN
  └─► Depends on:
      ├─► utils (apiRequest)
      └─► ui-states-styles (Dialog, Button, Input)

Note Components
  └─► Depends on:
      ├─► utils (helpers)
      └─► ui-states-styles (UI components)

Navbar Components
  └─► Depends on:
      ├─► utils (navigation helpers)
      └─► ui-states-styles (UI components)

Input Components
  └─► Depends on:
      └─► ui-states-styles (base UI)

FOUNDATION (No Dependencies):
  ├─► app (standalone)
  ├─► ui-states-styles (standalone)
  └─► utils (standalone)
```

---

## 🎯 Merge Timeline Visualization

```
Week 1: Foundation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 1-2: ├─► app
Day 2-3: ├─► ui-states-styles
Day 3-4: ├─► utils
Day 4:   └─► index

Week 2: Components
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 5:   ├─► components/input
Day 6:   ├─► components/navbar
Day 7:   └─► components/Note

Week 3: Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 8:   ├─► auth-login
Day 9:   ├─► auth-signup
Day 10:  ├─► landingpage
Day 11:  └─► profile

Week 4: Advanced Features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 12:  ├─► secret-pin
Day 13:  ├─► secret-notes
Day 14:  └─► home

Week 5: Testing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 15:  └─► tests-jest

✅ ALL BRANCHES MERGED!
```

---

## 🌿 Branch Isolation Example

```
GOOD PRACTICE ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

develop
  │
  ├─► feature/frontend/auth-login
  │     └─► ONLY edits:
  │           • src/pages/login/Login.jsx
  │           • src/shared/schema.js (login part)
  │
  ├─► feature/frontend/auth-signup
  │     └─► ONLY edits:
  │           • src/pages/signup/Signup.jsx
  │           • src/shared/schema.js (signup part)
  │
  └─► feature/frontend/utils
        └─► ONLY edits:
              • src/utils/helper.js

NO CONFLICTS! ✅
Each branch touches different files.


BAD PRACTICE ❌
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

develop
  │
  ├─► feature/frontend/auth-login
  │     └─► Edits:
  │           • src/pages/login/Login.jsx
  │           • src/utils/helper.js  ❌
  │           • src/App.jsx  ❌
  │
  └─► feature/frontend/auth-signup
        └─► Edits:
              • src/pages/signup/Signup.jsx
              • src/utils/helper.js  ❌ CONFLICT!
              • src/App.jsx  ❌ CONFLICT!

CONFLICTS! ❌
Multiple branches editing same files.
```

---

## 🔀 Conflict Resolution Visual

```
SCENARIO: Two Branches Edit Same File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      develop (App.jsx has route for Landing)
         │
         ├────────────────────┐
         │                    │
         ▼                    ▼
   Branch A              Branch B
   (auth-login)         (auth-signup)
         │                    │
    Adds route           Adds route
    for Login            for Signup
         │                    │
    MERGE FIRST ──────► develop
         │                    │
         │                    │
         │              Pull develop
         │              Resolve conflict
         │                    │
         │              MERGE SECOND
         └────────────────────┘
                   │
                   ▼
      develop (has all 3 routes)
      ✅ No conflicts in final result


SOLUTION STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Merge Branch A first
   git checkout develop
   git merge feature/frontend/auth-login

2. Branch B pulls latest develop
   git checkout feature/frontend/auth-signup
   git pull origin develop

3. Resolve conflicts in App.jsx
   <<<<<<< HEAD (Branch B)
   <Route path="/signup" element={<Signup />} />
   =======
   <Route path="/login" element={<Login />} />
   >>>>>>> develop

   KEEP BOTH:
   <Route path="/login" element={<Login />} />
   <Route path="/signup" element={<Signup />} />

4. Commit and merge Branch B
   git add App.jsx
   git commit -m "fix: resolve merge conflict"
   git checkout develop
   git merge feature/frontend/auth-signup

✅ DONE!
```

---

## 📊 File Ownership Chart

```
┌─────────────────────────────────────────────────────────────────┐
│ FILE                          │ OWNER BRANCH                     │
├─────────────────────────────────────────────────────────────────┤
│ App.jsx                       │ app                              │
│ main.jsx                      │ index                            │
│ Login.jsx                     │ auth-login                       │
│ Signup.jsx                    │ auth-signup                      │
│ Home.jsx                      │ home                             │
│ Profile.jsx                   │ profile                          │
│ Landing.jsx                   │ landingpage                      │
│ SecretSafe.jsx                │ secret-notes                     │
│ secret-pin-dialog.jsx         │ secret-pin                       │
│ NoteEditorComponent.jsx       │ components/Note                  │
│ note-list.jsx                 │ components/Note                  │
│ app-sidebar.jsx               │ components/navbar                │
│ helper.js                     │ utils                            │
│ button.jsx                    │ ui-states-styles                 │
│ card.jsx                      │ ui-states-styles                 │
│ theme-provider.jsx            │ ui-states-styles                 │
│ input.jsx                     │ components/input                 │
│ *.test.jsx                    │ tests-jest                       │
│ jest.config.js                │ tests-jest                       │
└─────────────────────────────────────────────────────────────────┘

RULE: Only edit files YOUR branch owns! 📝
```

---

## 🎓 Summary Checklist

### Before Starting Work
- [ ] Pull latest develop
- [ ] Create feature branch
- [ ] Know which files belong to this branch

### During Development
- [ ] Only edit files owned by this branch
- [ ] Make small, focused commits
- [ ] Sync with develop regularly

### Before Merging
- [ ] Pull latest develop into your branch
- [ ] Resolve any conflicts
- [ ] Test locally
- [ ] Create Pull Request

### After Merge
- [ ] Delete feature branch
- [ ] Move to next branch in order

---

**Tip:** Print this page and keep it near your workspace! 🖨️

**Questions?** Refer to GIT_BRANCHING_STRATEGY.md for detailed explanations.
