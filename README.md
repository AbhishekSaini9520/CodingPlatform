# 🚀 Full-Stack Coding Platform

A comprehensive, full-stack platform built for coding practice, competitive programming, and developer discussions. It features a rich code editor, real-time discussions, AI-powered assistance, an automatic judging system, and user leaderboards.

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **Routing:** React Router v7
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Forms & Validation:** React Hook Form, Zod
- **Real-time & AI:** Socket.io-client, React Markdown
- **Auth:** Google OAuth (`@react-oauth/google`)
- **Layout:** React Resizable Panels

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB (Mongoose)
- **Caching & Rate Limiting:** Redis
- **Real-Time Communication:** Socket.io
- **AI Integration:** Google Generative AI (Gemini)
- **Authentication:** JWT (JSON Web Tokens), bcrypt, Google Auth Library
- **Cloud Storage:** Cloudinary & Multer (for media uploads)

## ✨ Key Features
- **Interactive Code Editor:** Embedded Monaco editor with customizable environments.
- **Problem Solving:** Categorized coding problems with integrated JSON-based test cases.
- **Automated Judging:** Secure and scalable code submission and validation system.
- **AI Assistant:** Integrated Chat AI to help solve doubts and explain editorials.
- **Real-time Discussions:** WebSockets powered discussion forums and comments.
- **Leaderboards & User Stats:** Dynamic ranking system, GitHub-style heatmaps, and user profiles.
- **Admin Dashboard:** Tools to manage, create, and moderate problems and posts.

## 📂 Complete Project Structure

### 1. Backend (`/Backend`)
```text
Backend/
├── package.json
├── problemsJSON/            # Static JSON files defining test cases and problem constraints
│   ├── binarySearch.json
│   └── ...
└── src/
    ├── config/              # Configuration (MongoDB, Redis, Cloudinary)
    ├── controllers/         # Core business logic (Auth, Submissions, Leaderboard, etc.)
    ├── middleware/          # Express middlewares (Admin, JWT Auth, Multer upload)
    ├── models/              # Mongoose schemas (User, Problem, Submission, Post, Comment)
    ├── routes/              # API endpoints routing
    │   ├── aiChatting.js    # Routes connecting to Google Generative AI
    │   ├── problemCreator.js
    │   ├── submit.js
    │   └── ...
    ├── services/            # Background services and Socket event handlers
    ├── utils/               # Validation and problem utility functions
    └── index.js             # Main application entry point
```

### 2. Frontend (`/Frontend`)
```text
Frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── api/                 # Axios instances and API call methods
    ├── components/          # Reusable UI components (Navbar, CommentSection, Tabs)
    ├── context/             # React context providers (AuthContext, ThemeContext)
    ├── InnerComponents/     # Admin-specific panels and problem management tools
    ├── pages/               # Main application pages
    │   ├── auth/            # Login, Register
    │   ├── problems/        # Detailed problem interface
    │   │   └── components/  # Editor, TestPanel, ChatAi, Editorial tabs
    │   ├── profileComponent/# User heatmaps, stats, and recent activity
    │   ├── Dashboard.jsx
    │   ├── Discuss.jsx
    │   ├── Leaderboard.jsx
    │   └── ...
    ├── socket/              # Socket.io client setup
    └── main.jsx             # React entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Redis instance running
- Environment variables configured (Cloudinary, JWT Secret, Google Auth, DB connections)

### Backend Setup
```bash
cd Backend
npm install
npm run dev
# OR node src/index.js depending on your scripts setup
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## 🔒 Environment Variables Reference
Ensure the following are defined in your backend `.env` file for full functionality:
- `MONGO_URI`
- `REDIS_URL` or Host/Port
- `JWT_SECRET`
- `GEMINI_API_KEY` (For AI Chat feature)
- `CLOUDINARY_URL` / Credentials
- `GOOGLE_CLIENT_ID` (For OAuth)
