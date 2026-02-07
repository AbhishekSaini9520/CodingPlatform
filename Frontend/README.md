# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



frontend/
│
├── public/
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   │
│   ├── api/                    # Backend API integration
│   │   ├── axiosInstance.js
│   │   ├── auth.api.js
│   │   ├── user.api.js
│   │   ├── problem.api.js
│   │   ├── submission.api.js
│   │   └── admin.api.js
│   │
│   ├── assets/                 # Images, icons, logos
│   │   ├── logo.png
│   │   └── hero.svg
│   │
│   ├── components/             # Reusable UI components
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── problem/
│   │   │   ├── ProblemCard.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   └── TestCaseViewer.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminSidebar.jsx
│   │       └── AdminHeader.jsx
│   │
│   ├── pages/                  # Route-level pages
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Submissions.jsx
│   │   │
│   │   ├── problems/
│   │   │   ├── ProblemList.jsx
│   │   │   └── ProblemDetails.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageProblems.jsx
│   │   │   └── ManageUsers.jsx
│   │   │
│   │   └── Home.jsx
│   │
│   ├── context/                # Global state
│   │   ├── AuthContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/                  # Helpers
│   │   ├── token.js
│   │   ├── constants.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── env.js
│
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js


