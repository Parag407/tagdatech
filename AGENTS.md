# 1. System Persona & Principles

You are an advanced full-stack software engineer agent group. Build a clean, modular, and performance-optimized architecture. Always use production-ready code patterns:

- Do not use mock inline state components where database connections are specified.
- Secure all backend route controllers with structural error-handling try/catch wraps.
- Implement explicit CORS configurations matching `*.pages.dev` origins.

# 2. Frontend Development Framework Instructions (React + Vite + Tailwind)

**Base Theme Integration:** Initialize `tailwind.config.js` to support custom deep violet/cyber themes:

```javascript
theme: {
  extend: {
    colors: {
      cyberDark: '#0B0116',
      cyberDeep: '#06010D',
      neonPurple: '#9D4EDD',
      neonMagenta: '#C77DFF',
    }
  }
}
```

**Directory Structure:** Organically arrange your workflow directory tree exactly as follows:

```plaintext
src/
├── components/     # Reusable components (Navbar, Footer, EventCard, TrackedButton)
├── pages/          # Home, Events, Notes, About, Contact, Announcements, AdminDashboard
├── context/        # Admin Authentication Context
├── api/            # Centralized Axios service layers
└── App.jsx
```

# 3. Backend Implementation Instructions (Node.js + Express + Mongoose)

Build a standardized Express server with independent router modules for `/api/events`, `/api/notes`, `/api/announcements`, `/api/messages`, and `/api/auth`.

**Interaction Counting Logic:** Create specialized patch endpoints for increments:

- `PATCH /api/events/:id/join` -> `$inc: { interactions: 1 }`
- `PATCH /api/notes/:id/download` -> `$inc: { downloads: 1 }`

**Admin Middleware Security Wrapper:** Create a validation checker intercepting requests:

```javascript
const adminVerify = (req, res, next) => {
  // Check Authorization headers for valid admin JWT token
};
```

# 4. Phase-by-Phase Execution Task Matrix

## Phase 1: Environment Setup & Scaffolding
- Generate backend structure with dependency configs (`express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`).
- Initialize frontend using Vite template and inject Tailwind configurations.

## Phase 2: Core Public View Assembly
- Assemble the UI layout for Home, Events, Notes, and Contact pages using high-contrast typography, interactive buttons, and dark aesthetics matching the source flyer.
- Embed analytical event dispatching on clicks.

## Phase 3: Administrative UI & Metric Aggregation
- Construct the `/admin` login route and connect it to a state-controlled admin dashboard.
- Create form modals for resource creations (Events, Notes, Announcements).
- Display a dynamic metric scoreboard reading total user data interaction parameters directly from database lookups.

## Phase 4: Integration & Full Deployment Preparation
- Wire frontend Axios configurations directly to the backend system.
- Implement responsive verification testing across mobile views.
