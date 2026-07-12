# Product Requirement Document (PRD) - Tagda Tech Dynamic Portfolio Platform

## 1. Project Overview

### 1.1 Purpose & Vision

Tagda Tech is an elite tech community dedicated to individuals interested in Web/Software Development, E-Sports, Hackathons, and general technology. The platform serves as a modern, high-performance portal to display the community's ecosystem, facilitate participation in competitive events, distribute free high-quality educational programming notes, and drive ecosystem growth (WhatsApp, Instagram, LinkedIn).

Following the community's core ethos: **"Average is the enemy. Ship it or step aside."** the platform must deliver an ultra-premium, dark cyber-aesthetic user experience with fast loading speeds, seamless admin controls, and precise user interaction tracking.

### 1.2 Target Audience

- Tech Students & Aspiring Developers looking for resources, guidance, and hackathons.
- Gamers & E-Sports enthusiasts seeking structured competitive tournaments.
- Tech Community Members looking for real-time announcements and networking channels.

### 1.3 Technology Stack

- **Frontend:** React.js (Vite build system), Tailwind CSS, Framer Motion (for modern smooth animations), Axios.
- **Backend:** Node.js with Express.js framework.
- **Database:** MongoDB (using Mongoose ODM).
- **Hosting Target:** Frontend via Cloudflare Pages (`tagdatech.pages.dev`), Backend via Render/Railway, Database via MongoDB Atlas.

---

## 2. Brand Identity & Visual Guidelines

Based on the official Tagda Tech flyer design, the web application must rigidly adhere to the following visual language:

- **Background Palette:** Ultra-dark deep violet/black (`#0B0116` to `#06010D`).
- **Primary Accents:** Vivid neon purple/magenta (`#9D4EDD`, `#C77DFF`, `#E0AAFF`) with glowing gradient elements and abstract spherical glassmorphism.
- **Typography:** Bold, clean, futuristic sans-serif headers (e.g., Orbitron, Rajdhani, or custom geometric fallbacks) paired with clean, ultra-readable body text (Inter/Roboto).
- **Thematic Elements:** High contrast white headings, glowing borders, custom hover states simulating active terminal grids, and interactive cyber-cards.

---

## 3. Architecture & System Structure

### 3.1 Page Breakdown (Public Site)

1. **Home Page (Landing):**
   - Hero section featuring the Tagda Tech logo, tagline, and prominent Call-to-Action (CTA) buttons: *Join WhatsApp Group*, *Follow Instagram*, *Connect on LinkedIn*.
   - Latest Announcements ticker/banner.
   - Core pillars grid (Tech, E-Sports, Hackathons, Notes).
2. **Events Page (ESports & Hackathons):**
   - Active, upcoming, and past event cards.
   - Details view including date, registration link, description, and an interactive "Join/Register" action that tracks participation.
3. **Notes Page:**
   - Free programming documentation/notes catalog sorted by subject/language.
   - Individual note cards displaying topic, tags, and a "Download/View" CTA.
4. **About Us Page:**
   - Origin story, core philosophy, and mission statement.
   - Core community management details.
5. **Contact Page:**
   - Interactive feedback/inquiry message form.
   - Direct community channel access buttons.
6. **Announcements Page:**
   - Dedicated timeline of time-bound updates, alerts, and priority event results.

### 3.2 Admin System (Protected Route `/admin`)

- **Single-User Authentication:** Restrictive access given strictly to accounts matching `role === 'admin'` via JWT (JSON Web Tokens) or a dedicated single-admin secure hardcoded token/credential config system.
- **Admin Dashboard Overview:** Analytical visualization counting metrics (Total Note Downloads, Total Event Joins, Message Form Submissions).
- **Content Management Systems (CMS):**
  - *Create/Delete Event*: Fields for title, image URL/upload, category (Hackathon/E-Sports), rules, registration link, date.
  - *Create/Delete Note*: Fields for title, subject, file URL, metadata tags.
  - *Create/Delete Announcement*: Title, details, priority tag, expiration date.

---

## 4. Detailed Feature & Functional Requirements

### 4.1 Global Navigation & Footer

- **Navbar:** Sticky, transparent glassmorphism layout with links to Home, Events, Notes, About, Contact. Includes a glowing "Join Community" button redirecting to WhatsApp.
- **Footer:** Copyright, standard social handles (`www.tagdatech.pages.dev` attribution), and quick links.

### 4.2 Home Page Landing Section

- High-impact cyber-themed landing block containing the official slogan: *"Average is the enemy. Ship it or step aside."*
- Inline SVG icons with neon glow for community targets (WhatsApp, Instagram, LinkedIn).

### 4.3 Interactive Analytics Tracking (Crucial Backend Integration)

Every time a public user interacts with specific elements, the frontend triggers an API request to increment counter fields in MongoDB:

- **`clickEventJoin(eventId)`**: Increments `interactionCount.joins` for that event object.
- **`clickDownloadNote(noteId)`**: Increments `interactionCount.downloads` for that note object.

### 4.4 Form Submissions

- Contact form fields: `Name`, `Email`, `Subject`, `Message`.
- Submissions must sanitize input, validate email formatting, and save directly to the `messages` collection in MongoDB for admin review.

---

## 5. Database Schema Specifications (MongoDB)

### 5.1 Event Schema (`events`)

```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Hackathon', 'ESports'], required: true },
  date: { type: Date, required: true },
  registrationLink: { type: String, required: true },
  imageUrl: { type: String },
  interactions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### 5.2 Notes Schema (`notes`)

```javascript
{
  title: { type: String, required: true },
  subject: { type: String, required: true },
  fileUrl: { type: String, required: true },
  tags: [{ type: String }],
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### 5.3 Announcement Schema (`announcements`)

```javascript
{
  title: { type: String, required: true },
  content: { type: String, required: true },
  isTimeBound: { type: Boolean, default: false },
  expiryDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now }
}
```

### 5.4 Message Schema (`messages`)

```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 6. Non-Functional & Performance Requirements

- **Performance:** Optimized bundle sizing via Vite code splitting; assets compressed to prevent loading lags on core background effects.
- **Security:** Hashed passwords for admin auth using bcryptjs; API routing guards blocking all mutations without valid admin JWT verification.
- **Responsiveness:** Perfect adaptive layouts tailored for ultra-wide desktop systems, standard laptops, and mobile smartphones.
