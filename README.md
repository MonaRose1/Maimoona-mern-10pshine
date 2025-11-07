## 📒 Note-Taking Application

A full-stack note-taking application built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.
The app provides secure note handling, including a Secret Safe for sensitive notes protected by a PIN.

# 🚀 Project Overview

This application follows a client–server architecture:

Frontend → React, Vite, Tailwind CSS, React Query

Backend → Node.js, Express.js, MongoDB (Mongoose)

Databases → Separate MongoDB connections for:

Users

Regular Notes

Secret Notes

# 📁 Project Structure
root/

 ├── frontend/      # React + Vite app
 
 └── backend/       # Node.js + Express server

# 🎨 Frontend (React + Vite)
✅ Tech Stack

React + Vite

React Router

Tailwind CSS

React Query (@tanstack/react-query)

react-hook-form + Zod (form validation)

lucide-react (icons)

✅ Key Features

Component-based architecture

Fast data fetching with caching

Responsive UI with Tailwind CSS

Theme support (dark/light)

File attachments (PDF, images)

Rich text editor

Tag-based organization

# 🛠 Backend (Node.js + Express)
✅ Technologies

Express.js

MongoDB (Mongoose ODM)

CORS enabled

Token-based authentication (mock tokens)

Separate DB connections:

Users

Regular Notes

Secret Notes

✅ Security Layer

Protected routes

PIN-based Secret Safe

Isolated DB for secret notes

Server-side validation

# ✨ Core Features
1️⃣ User Authentication

Signup / Login

Token-based authentication

User Profile management

2️⃣ Regular Notes

Create, Read, Update, Delete (CRUD)

Rich text editor

Tags + Search

Pin notes

Color-coded notes

Folders support (folderId)

3️⃣ Secret Safe (Secure Notes)

Separate database

PIN protection

PIN verification before access

CRUD operations for secret notes

4️⃣ UI/UX Enhancements

Responsive layout

Dark/Light theme toggle

Smooth animations

Search & filters

File attachments

🧩 Data Models
User Model

Fields:

name

email

password

secretPin

Uses separate DB connection.

Note Model (Regular Notes)

Fields:

title

content

tags

isPinned

color

folderId

userId

Stored in regular notes DB.

SecretNote Model

Same structure as Note Model, but stored in a separate secure DB.

# 🔌 API Endpoints
🔐 Authentication

Method	Endpoint	Description

POST	/api/auth/signup	Register a new user

POST	/api/auth/login	Login user

👤 User Profile

Method	Endpoint

GET	/api/me

📝 Regular Notes

Method	Endpoint

GET	/api/notes

POST	/api/notes

GET	/api/notes/:id

PUT	/api/notes/:id

DELETE	/api/notes/:id

🔒 Secret Safe (PIN + Notes)

Method	Endpoint

POST	/api/secret/check-pin

POST	/api/secret/set-pin

POST	/api/secret/verify-pin

GET	/api/secret/notes

POST	/api/secret/notes

GET	/api/secret/notes/:id

PUT	/api/secret/notes/:id

DELETE	/api/secret/notes/:id

# 🎨 Frontend Pages & Components
Pages

Landing Page

Login / Signup

Home (all notes)

Note Editor

Profile Page

Secret Safe Page

PIN Setup & Verification

Key Components

NoteEditorComponent — rich text editor

NoteCard — card display for notes

SearchBar / SecretSearchBar

ThemeProvider — handles light/dark mode

# 🔐 Security Considerations
✅ Authentication

Token-based

Protected frontend routes

Server-side validation

✅ Secret Safe

PIN verified before access

Sensitive data in separate DB

Strict API route separation

✅ Validation

Frontend: Zod schemas

Backend: Mongoose + Express validation

🧪 Testing

Jest → Unit tests

React Testing Library → Component tests

Integration test setup

🔧 Development Tools

Vite (fast bundler)

ESLint (code quality)

Concurrently (run frontend + backend together)

# ⚙️ Environment Setup
Ports

Frontend → 5173

Backend → 5003

Configuration

Separate MongoDB connections

CORS for cross-origin communication

# 🏗 Build Process
Frontend
npm run build

Backend

Standard Node.js:

node server.js

Run both (dev)
npm run dev


✅ Summary

This full-stack Note-Taking Application delivers a modern UI, smooth UX, and robust backend with strong security features including a PIN-protected Secret Safe.

It's designed for efficiency, privacy, and scalability — ideal for personal use or as a portfolio-ready project.

## 👥 Collaborators

- Muhammad Noman
  [nomanyousuf-10P]
## 📒 Note-Taking Application

A full-stack note-taking application built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.
The app provides secure note handling, including a Secret Safe for sensitive notes protected by a PIN.

# 🚀 Project Overview

This application follows a client–server architecture:

Frontend → React, Vite, Tailwind CSS, React Query

Backend → Node.js, Express.js, MongoDB (Mongoose)

Databases → Separate MongoDB connections for:

Users

Regular Notes

Secret Notes

# 📁 Project Structure
root/

 ├── frontend/      # React + Vite app
 
 └── backend/       # Node.js + Express server

# 🎨 Frontend (React + Vite)
✅ Tech Stack

React + Vite

React Router

Tailwind CSS

React Query (@tanstack/react-query)

react-hook-form + Zod (form validation)

lucide-react (icons)

✅ Key Features

Component-based architecture

Fast data fetching with caching

Responsive UI with Tailwind CSS

Theme support (dark/light)

File attachments (PDF, images)

Rich text editor

Tag-based organization

# 🛠 Backend (Node.js + Express)
✅ Technologies

Express.js

MongoDB (Mongoose ODM)

CORS enabled

Token-based authentication (mock tokens)

Separate DB connections:

Users

Regular Notes

Secret Notes

✅ Security Layer

Protected routes

PIN-based Secret Safe

Isolated DB for secret notes

Server-side validation

# ✨ Core Features
1️⃣ User Authentication

Signup / Login

Token-based authentication

User Profile management

2️⃣ Regular Notes

Create, Read, Update, Delete (CRUD)

Rich text editor

Tags + Search

Pin notes

Color-coded notes

Folders support (folderId)

3️⃣ Secret Safe (Secure Notes)

Separate database

PIN protection

PIN verification before access

CRUD operations for secret notes

4️⃣ UI/UX Enhancements

Responsive layout

Dark/Light theme toggle

Smooth animations

Search & filters

File attachments

🧩 Data Models
User Model

Fields:

name

email

password

secretPin

Uses separate DB connection.

Note Model (Regular Notes)

Fields:

title

content

tags

isPinned

color

folderId

userId

Stored in regular notes DB.

SecretNote Model

Same structure as Note Model, but stored in a separate secure DB.

# 🔌 API Endpoints
🔐 Authentication

Method	Endpoint	Description

POST	/api/auth/signup	Register a new user

POST	/api/auth/login	Login user

👤 User Profile

Method	Endpoint

GET	/api/me

📝 Regular Notes

Method	Endpoint

GET	/api/notes

POST	/api/notes

GET	/api/notes/:id

PUT	/api/notes/:id

DELETE	/api/notes/:id

🔒 Secret Safe (PIN + Notes)

Method	Endpoint

POST	/api/secret/check-pin

POST	/api/secret/set-pin

POST	/api/secret/verify-pin

GET	/api/secret/notes

POST	/api/secret/notes

GET	/api/secret/notes/:id

PUT	/api/secret/notes/:id

DELETE	/api/secret/notes/:id

# 🎨 Frontend Pages & Components
Pages

Landing Page

Login / Signup

Home (all notes)

Note Editor

Profile Page

Secret Safe Page

PIN Setup & Verification

Key Components

NoteEditorComponent — rich text editor

NoteCard — card display for notes

SearchBar / SecretSearchBar

ThemeProvider — handles light/dark mode

# 🔐 Security Considerations
✅ Authentication

Token-based

Protected frontend routes

Server-side validation

✅ Secret Safe

PIN verified before access

Sensitive data in separate DB

Strict API route separation

✅ Validation

Frontend: Zod schemas

Backend: Mongoose + Express validation

🧪 Testing

Jest → Unit tests

React Testing Library → Component tests

Integration test setup

🔧 Development Tools

Vite (fast bundler)

ESLint (code quality)

Concurrently (run frontend + backend together)

# ⚙️ Environment Setup
Ports

Frontend → 5173

Backend → 5003

Configuration

Separate MongoDB connections

CORS for cross-origin communication

# 🏗 Build Process
Frontend
npm run build

Backend

Standard Node.js:

node server.js

Run both (dev)
npm run dev


✅ Summary

This full-stack Note-Taking Application delivers a modern UI, smooth UX, and robust backend with strong security features including a PIN-protected Secret Safe.

It's designed for efficiency, privacy, and scalability — ideal for personal use or as a portfolio-ready project.

## 👥 Collaborators

- Muhammad Noman
  [nomanyousuf-10P]
