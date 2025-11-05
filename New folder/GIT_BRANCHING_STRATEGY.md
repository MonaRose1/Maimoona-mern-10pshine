# 🌳 Git Branching Strategy & File Organization Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Branch Structure](#branch-structure)
3. [File Assignment by Branch](#file-assignment-by-branch)
4. [Branching Workflow](#branching-workflow)
5. [Merge Strategy](#merge-strategy)
6. [Conflict Prevention](#conflict-prevention)
7. [Best Practices](#best-practices)
8. [Commands Reference](#commands-reference)

---

## 🎯 Overview

This document outlines the Git branching strategy for the Notes Application project. It provides clear guidance on which files belong to which branch and how to avoid merge conflicts.

### Branch Hierarchy

```
main (production-ready code)
  └── develop (integration branch)
      └── feature/* (feature branches)
          ├── feature/frontend/* (frontend features)
          ├── feature/backend/* (backend features)
          └── feature/testing/* (testing features)
```

---

## 🌿 Branch Structure

### Current Frontend Branches

```
feature/frontend/
├── app                          # Main app configuration
├── auth-login                   # Login page and logic
├── auth-signup                  # Signup page and logic
├── components/Note              # Note-related components
├── components/input             # Input components
├── components/navbar            # Navigation components
├── home                         # Home page
├── index                        # App entry point
├── landingpage                  # Landing page
├── profile                      # User profile page
├── secret-notes                 # Secret notes feature
├── secret-pin                   # PIN dialog and logic
├── tests-jest                   # Frontend tests
├── ui-states-styles             # UI components and styles
└── utils                        # Utility functions
```

---

## 📁 File Assignment by Branch

### 0. `feature/frontend/shared-base` ⭐ **NEW - FOUNDATIONAL BRANCH**

**Purpose:** Shared/common files that multiple branches need

**Files to Include:**
```
frontend/notes-app/
├── src/
│   ├── App.jsx                  # Main app with ALL routes
│   ├── App.css                  # App-level styles
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── package.json                 # ALL dependencies
├── package-lock.json            # Lock file
├── vite.config.js               # Vite configuration
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript config
├── jsconfig.json                # JavaScript config
└── components.json              # shadcn/ui config
```

**Why This Branch Exists:**
- Contains the "complete, working version" from `local/integration`
- Serves as the source of truth for shared configuration files
- Prevents conflicts when multiple branches need the same dependencies
- Can be used as a base for all other feature branches

**How to Use:**
1. **Option A (Recommended):** Branch from `shared-base` instead of `develop`
   ```bash
   git checkout feature/frontend/shared-base
   git checkout -b feature/frontend/your-feature
   ```

2. **Option B:** Merge `shared-base` into your feature branch
   ```bash
   git checkout feature/frontend/your-feature
   git merge feature/frontend/shared-base
   ```

3. **Option C:** Cherry-pick specific commits you need
   ```bash
   git cherry-pick <commit-hash>
   ```

**Dependencies:**
- No direct dependencies
- This is the MOST foundational branch

**Merge Order:** Merge FIRST (before all other branches)

**⚠️ Important Rules:**
- DO NOT edit files in `shared-base` from other branches
- If you need to add a dependency, add it to `shared-base` first, then merge/pull
- Keep this branch updated with the latest working integration

---

### 1. `feature/frontend/app`

**Purpose:** Main application configuration and routing

**Files to Include:**
```
frontend/notes-app/
├── src/
│   ├── App.jsx                  # Main app component with routes
│   ├── App.css                  # App-level styles
│   └── index.css                # Global styles
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies and scripts
```

**Dependencies:**
- No direct dependencies on other branches
- This is a foundational branch

**Merge Order:** Merge FIRST (base for other branches)

---

### 2. `feature/frontend/auth-login`

**Purpose:** Login page and authentication logic

**Files to Include:**
```
frontend/notes-app/src/
├── pages/
│   └── login/
│       ├── Login.jsx            # Login page component
│       └── Login.css            # Login page styles (if any)
└── shared/
    └── schema.js                # Login validation schema (if separate)
```

**Dependencies:**
- `feature/frontend/utils` (for apiRequest, validation)
- `feature/frontend/ui-states-styles` (for UI components)

**Merge Order:** Merge AFTER utils and ui-states-styles

---

### 3. `feature/frontend/auth-signup`

**Purpose:** Signup page and registration logic

**Files to Include:**
```
frontend/notes-app/src/
├── pages/
│   └── signup/
│       ├── Signup.jsx           # Signup page component
│       └── Signup.css           # Signup page styles (if any)
└── shared/
    └── schema.js                # Signup validation schema (if separate)
```

**Dependencies:**
- `feature/frontend/utils` (for apiRequest, validation)
- `feature/frontend/ui-states-styles` (for UI components)

**Merge Order:** Merge AFTER utils and ui-states-styles

---

### 4. `feature/frontend/components/Note`

**Purpose:** Note-related components (editor, list, card)

**Files to Include:**
```
frontend/notes-app/src/
└── components/
    ├── NoteEditorComponent.jsx  # Note editor
    ├── note-list.jsx            # Note list component
    ├── note-card.jsx            # Individual note card
    └── note-editor.jsx          # Alternative note editor (if exists)
```

**Dependencies:**
- `feature/frontend/utils` (for helper functions)
- `feature/frontend/ui-states-styles` (for UI components)

**Merge Order:** Merge AFTER utils and ui-states-styles

---

### 5. `feature/frontend/components/input`

**Purpose:** Reusable input components

**Files to Include:**
```
frontend/notes-app/src/components/ui/
├── input.jsx                    # Input component
├── textarea.jsx                 # Textarea component
├── label.jsx                    # Label component
└── form.jsx                     # Form component
```

**Dependencies:**
- `feature/frontend/ui-states-styles` (for base UI setup)

**Merge Order:** Merge with or after ui-states-styles

---

### 6. `feature/frontend/components/navbar`

**Purpose:** Navigation and sidebar components

**Files to Include:**
```
frontend/notes-app/src/
└── components/
    ├── app-sidebar.jsx          # Main sidebar component
    ├── sidebar-menu.jsx         # Sidebar menu (if separate)
    └── navigation.jsx           # Navigation component (if exists)
```

**Dependencies:**
- `feature/frontend/ui-states-styles` (for UI components)
- `feature/frontend/utils` (for navigation helpers)

**Merge Order:** Merge AFTER ui-states-styles

---

### 7. `feature/frontend/home`

**Purpose:** Home page with notes dashboard

**Files to Include:**
```
frontend/notes-app/src/
└── pages/
    └── home/
        ├── Home.jsx             # Home page component
        ├── Home.css             # Home page styles
        └── HomeUtils.js         # Home page utilities (if any)
```

**Dependencies:**
- `feature/frontend/components/Note` (for note components)
- `feature/frontend/components/navbar` (for navigation)
- `feature/frontend/utils` (for API calls)

**Merge Order:** Merge AFTER components and utils

---

### 8. `feature/frontend/index`

**Purpose:** Application entry point

**Files to Include:**
```
frontend/notes-app/src/
└── main.jsx                     # React DOM render entry point
```

**Dependencies:**
- `feature/frontend/app` (imports App.jsx)

**Merge Order:** Merge AFTER app branch

---

### 9. `feature/frontend/landingpage`

**Purpose:** Landing/welcome page for non-authenticated users

**Files to Include:**
```
frontend/notes-app/src/
└── pages/
    └── landing/
        ├── Landing.jsx          # Landing page component
        └── Landing.css          # Landing page styles
```

**Dependencies:**
- `feature/frontend/ui-states-styles` (for UI components)

**Merge Order:** Merge AFTER ui-states-styles

---

### 10. `feature/frontend/profile`

**Purpose:** User profile page

**Files to Include:**
```
frontend/notes-app/src/
└── pages/
    └── profile/
        ├── Profile.jsx          # Profile page component
        └── Profile.css          # Profile page styles (if any)
```

**Dependencies:**
- `feature/frontend/utils` (for API calls)
- `feature/frontend/ui-states-styles` (for UI components)

**Merge Order:** Merge AFTER utils and ui-states-styles

---

### 11. `feature/frontend/secret-notes`

**Purpose:** Secret notes dashboard and components

**Files to Include:**
```
frontend/notes-app/src/
└── pages/
    └── secret-safe/
        ├── SecretSafe.jsx       # Secret notes dashboard
        └── SecretSafe.css       # Secret notes styles (if any)
```

**Dependencies:**
- `feature/frontend/components/Note` (for note components)
- `feature/frontend/secret-pin` (for PIN verification)
- `feature/frontend/utils` (for API calls)

**Merge Order:** Merge AFTER components, secret-pin, and utils

---

### 12. `feature/frontend/secret-pin`

**Purpose:** PIN dialog and verification logic

**Files to Include:**
```
frontend/notes-app/src/
└── components/
    └── secret-pin-dialog.jsx    # PIN dialog component
```

**Dependencies:**
- `feature/frontend/utils` (for API calls)
- `feature/frontend/ui-states-styles` (for UI components)

**Merge Order:** Merge AFTER utils and ui-states-styles

---

### 13. `feature/frontend/tests-jest`

**Purpose:** Frontend testing setup and test files

**Files to Include:**
```
frontend/notes-app/
├── test/
│   ├── pages/
│   │   ├── Login.test.jsx       # Login tests
│   │   └── Signup.test.jsx      # Signup tests
│   ├── utils/
│   │   └── helper.test.js       # Utility tests
│   ├── setupTests.js            # Test setup
│   └── test-utils.jsx           # Test utilities
├── jest.config.js               # Jest configuration
└── babel.config.cjs             # Babel configuration for tests
```

**Dependencies:**
- ALL other frontend branches (tests depend on implementation)

**Merge Order:** Merge LAST (after all features are merged)

---

### 14. `feature/frontend/ui-states-styles`

**Purpose:** Shared UI components, theme, and styling

**Files to Include:**
```
frontend/notes-app/src/
├── components/
│   ├── ui/
│   │   ├── button.jsx           # Button component
│   │   ├── card.jsx             # Card component
│   │   ├── dialog.jsx           # Dialog component
│   │   ├── separator.jsx        # Separator component
│   │   ├── avatar.jsx           # Avatar component
│   │   └── ...                  # All other UI components
│   ├── theme-provider.jsx       # Theme context provider
│   └── theme-toggle.jsx         # Theme toggle component
└── lib/
    └── utils.js                 # cn() utility for class names
```

**Dependencies:**
- No dependencies on other feature branches
- This is a foundational branch

**Merge Order:** Merge EARLY (second after app, or alongside app)

---

### 15. `feature/frontend/utils`

**Purpose:** Utility functions and helpers

**Files to Include:**
```
frontend/notes-app/src/
└── utils/
    └── helper.js                # All utility functions
                                 # (apiRequest, validation, etc.)
```

**Dependencies:**
- No dependencies on other feature branches
- This is a foundational branch

**Merge Order:** Merge EARLY (alongside ui-states-styles)

---

## 🔄 Branching Workflow

### Step-by-Step Process

#### 1. **Create Feature Branch**

```bash
# Always branch from develop (or main if no develop)
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/frontend/component-name
```

#### 2. **Work on Your Branch**

```bash
# Add only the files that belong to this branch
git add <specific-files>

# Commit with descriptive message
git commit -m "feat: add login page component"

# Push to remote
git push -u origin feature/frontend/component-name
```

#### 3. **Keep Branch Updated**

```bash
# Regularly sync with develop
git checkout develop
git pull origin develop

git checkout feature/frontend/component-name
git rebase develop
# OR
git merge develop
```

#### 4. **Create Pull Request**

```bash
# Push your latest changes
git push origin feature/frontend/component-name

# Create PR on GitHub/GitLab
# Target: develop branch
# Reviewers: Team members
```

---

## 🔀 Merge Strategy

### Recommended Merge Order

To avoid conflicts, merge branches in this specific order:

#### **Phase 0: Shared Base** (Merge FIRST - Foundation for all)
0. `feature/frontend/shared-base` - **Complete working version with all routes, dependencies, and configs**

#### **Phase 1: Foundation** (Merge second)
1. `feature/frontend/app` - App configuration
2. `feature/frontend/ui-states-styles` - UI components
3. `feature/frontend/utils` - Utility functions
4. `feature/frontend/index` - Entry point

#### **Phase 2: Components** (Merge second)
5. `feature/frontend/components/input` - Input components
6. `feature/frontend/components/navbar` - Navigation
7. `feature/frontend/components/Note` - Note components

#### **Phase 3: Pages** (Merge third)
8. `feature/frontend/auth-login` - Login page
9. `feature/frontend/auth-signup` - Signup page
10. `feature/frontend/landingpage` - Landing page
11. `feature/frontend/profile` - Profile page

#### **Phase 4: Advanced Features** (Merge fourth)
12. `feature/frontend/secret-pin` - PIN dialog
13. `feature/frontend/secret-notes` - Secret notes
14. `feature/frontend/home` - Home page (uses most components)

#### **Phase 5: Testing** (Merge last)
15. `feature/frontend/tests-jest` - All tests

### Merge Command Examples

```bash
# Switch to develop branch
git checkout develop

# Merge feature branch (no fast-forward for cleaner history)
git merge --no-ff feature/frontend/app

# Push to remote
git push origin develop

# Delete merged branch (optional)
git branch -d feature/frontend/app
git push origin --delete feature/frontend/app
```

---

## 🛡️ Conflict Prevention

### 1. **File Ownership**

Each branch should "own" specific files. Never edit the same file in multiple branches simultaneously.

**Example:**
- ❌ BAD: Edit `App.jsx` in both `feature/frontend/app` AND `feature/frontend/home`
- ✅ GOOD: Edit `App.jsx` only in `feature/frontend/app`, edit `Home.jsx` in `feature/frontend/home`

### 2. **Shared Files Strategy**

Some files might be needed by multiple branches (e.g., `package.json`, `App.jsx` for routing).

**Solution:**
- Merge foundational branches FIRST
- Pull latest develop before working
- Communicate with team about shared file changes

### 3. **Import Statements**

When adding imports, be specific about which branch owns which file:

```javascript
// In feature/frontend/home branch
import { apiRequest } from '@/utils/helper';  // Owned by utils branch
import { NoteCard } from '@/components/note-card';  // Owned by components/Note
```

**Rule:** Import from already-merged branches or plan merge order accordingly.

### 4. **Configuration Files**

Files like `package.json`, `vite.config.js`, `tailwind.config.js` can cause conflicts.

**Solution:**
```bash
# Before making changes to shared config
git checkout develop
git pull origin develop
git checkout your-branch
git merge develop

# Make your changes
# Test thoroughly
# Commit and push
```

### 5. **Regular Synchronization**

```bash
# Daily sync with develop
git checkout develop
git pull origin develop

git checkout your-feature-branch
git rebase develop  # or git merge develop
```

---

## ✅ Best Practices

### 1. **Branch Naming Convention**

```
feature/frontend/<feature-name>
feature/backend/<feature-name>
feature/testing/<test-type>
bugfix/<bug-description>
hotfix/<critical-issue>
```

**Examples:**
- ✅ `feature/frontend/auth-login`
- ✅ `feature/backend/note-api`
- ✅ `bugfix/login-validation-error`
- ❌ `my-branch`
- ❌ `test`

### 2. **Commit Messages**

Follow conventional commits:

```bash
feat: add login page component
fix: resolve password validation issue
docs: update README with API examples
style: format code with prettier
refactor: extract validation logic to utils
test: add unit tests for login component
```

### 3. **Small, Focused Commits**

```bash
# ❌ BAD: One huge commit
git commit -m "add everything"

# ✅ GOOD: Multiple focused commits
git commit -m "feat: add login form UI"
git commit -m "feat: add login validation logic"
git commit -m "feat: integrate login API"
```

### 4. **Branch Lifecycle**

```bash
# 1. Create branch
git checkout -b feature/frontend/profile

# 2. Work and commit
git add src/pages/profile/Profile.jsx
git commit -m "feat: add profile page"

# 3. Push to remote
git push -u origin feature/frontend/profile

# 4. Create Pull Request
# (Do this on GitHub/GitLab)

# 5. After merge, delete branch
git checkout develop
git branch -d feature/frontend/profile
git push origin --delete feature/frontend/profile
```

### 5. **Code Review Checklist**

Before creating PR:
- [ ] Code follows project conventions
- [ ] No console.log statements
- [ ] Imports are clean and organized
- [ ] No merge conflicts
- [ ] Tests are passing (if applicable)
- [ ] Documentation updated
- [ ] Only relevant files included

---

## 📝 Commands Reference

### Essential Git Commands

#### Branch Management

```bash
# List all branches
git branch -a

# Create new branch
git checkout -b branch-name

# Switch to branch
git checkout branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename branch
git branch -m old-name new-name
```

#### Synchronization

```bash
# Pull latest changes
git pull origin branch-name

# Fetch all branches
git fetch --all

# Merge branch
git merge branch-name

# Rebase (cleaner history)
git rebase branch-name
```

#### Committing

```bash
# Stage specific files
git add file1.jsx file2.jsx

# Stage all changes
git add .

# Commit with message
git commit -m "commit message"

# Amend last commit
git commit --amend

# Push to remote
git push origin branch-name
```

#### Conflict Resolution

```bash
# If conflicts occur during merge
git status  # See conflicted files

# Edit conflicted files manually
# Look for <<<<<<< HEAD markers

# After resolving
git add resolved-file.jsx
git commit -m "fix: resolve merge conflict"
git push origin branch-name
```

#### Viewing History

```bash
# View commit history
git log --oneline --graph --all

# View changes
git diff

# View changes in staged files
git diff --staged
```

---

## 🔑 Quick Reference Table

| Branch | Main Files | Dependencies | Merge Order |
|--------|-----------|--------------|-------------|
| `shared-base` | **ALL shared files** | None | **0 (FIRST)** |
| `app` | App.jsx, config files | shared-base | 1 |
| `ui-states-styles` | UI components, theme | None | 2 |
| `utils` | helper.js | None | 3 |
| `index` | main.jsx | app | 4 |
| `components/input` | Input components | ui-states-styles | 5 |
| `components/navbar` | Sidebar, navigation | ui-states-styles | 6 |
| `components/Note` | Note components | utils, ui-states-styles | 7 |
| `auth-login` | Login.jsx | utils, ui-states-styles | 8 |
| `auth-signup` | Signup.jsx | utils, ui-states-styles | 9 |
| `landingpage` | Landing.jsx | ui-states-styles | 10 |
| `profile` | Profile.jsx | utils, ui-states-styles | 11 |
| `secret-pin` | secret-pin-dialog.jsx | utils, ui-states-styles | 12 |
| `secret-notes` | SecretSafe.jsx | components, secret-pin | 13 |
| `home` | Home.jsx | All components | 14 |
| `tests-jest` | Test files, config | All features | 15 (Last) |

---

## 📖 Example Workflow

### Scenario: Adding Login Page

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/frontend/auth-login

# 3. Add login files only
git add src/pages/login/Login.jsx

# 4. Commit
git commit -m "feat: add login page component"

# 5. Add validation
git add src/shared/schema.js  # If login-specific
git commit -m "feat: add login validation schema"

# 6. Push to remote
git push -u origin feature/frontend/auth-login

# 7. Create Pull Request on GitHub
# Title: "Add Login Page Component"
# Description: "Implements login page with form validation"
# Target: develop branch

# 8. After PR approval and merge
git checkout develop
git pull origin develop
git branch -d feature/frontend/auth-login
```

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Editing Same File in Multiple Branches

**Problem:**
```
Branch A: Edit App.jsx to add route
Branch B: Edit App.jsx to add different route
→ CONFLICT when merging!
```

**Solution:**
- Merge Branch A first
- Pull latest develop into Branch B
- Resolve conflicts before continuing

### Pitfall 2: Forgetting to Pull Before Starting

**Problem:**
```
Your branch is based on old code
→ Many conflicts when merging
```

**Solution:**
```bash
# Always start with latest code
git checkout develop
git pull origin develop
git checkout -b new-branch
```

### Pitfall 3: Adding Unrelated Files

**Problem:**
```
feature/frontend/auth-login contains:
- Login.jsx ✅
- Profile.jsx ❌ (belongs to profile branch)
- helper.js ❌ (belongs to utils branch)
```

**Solution:**
- Only commit files that belong to your branch
- Use `git add <specific-file>` instead of `git add .`

### Pitfall 4: Not Testing Before Merge

**Problem:**
```
Merge breaks the application
→ Develop branch is broken
```

**Solution:**
```bash
# Before creating PR
npm install
npm run dev  # Test locally
npm run test  # Run tests
```

---

## 📚 Additional Resources

### Git Best Practices
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Merge Conflict Resolution
- [Git Merge Conflicts](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)
- [Visual Studio Code Git Integration](https://code.visualstudio.com/docs/sourcecontrol/overview)

---

## 🎓 Summary

### Key Takeaways

1. **Each branch owns specific files** - Don't edit the same file in multiple branches
2. **Merge in order** - Foundation → Components → Pages → Features → Tests
3. **Sync regularly** - Pull from develop daily to avoid large conflicts
4. **Commit small** - Focused commits are easier to review and merge
5. **Communicate** - Tell team when editing shared files

### Quick Checklist Before Merge

- [ ] All files in this branch are related to its purpose
- [ ] No files from other branches included
- [ ] Latest develop branch pulled and merged
- [ ] Code tested locally
- [ ] No console.log or debug code
- [ ] Commit messages are clear
- [ ] No merge conflicts

---

**Last Updated:** 2025-10-14  
**Author:** Development Team  
**Status:** ✅ ACTIVE GUIDE

**Questions?** Contact your team lead or refer to project documentation.

**Happy Branching!** 🌿
