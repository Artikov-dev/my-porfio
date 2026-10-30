# 🚀 Roma Artikov - Senior Full-Stack Engineer Portfolio

Welcome to the repository of my personal portfolio and interactive digital resume. This project is engineered from the ground up to showcase my skills in building high-performance, secure, and visually stunning web applications.

![Portfolio Banner](./frontend/public/og_banner.jpg)

> **Note:** This project serves as my personal portfolio. It is designed not just to display information, but to demonstrate complex architectural concepts, real-time communication, and advanced UI/UX engineering.

## ✨ Core Features

This portfolio goes beyond a static HTML page. It includes enterprise-grade features:

- 🧊 **3D WebGL Hero Section:** An interactive, floating geometric core built with `Three.js` (`@react-three/fiber`) that reacts to mouse movements.
- 👨‍💻 **Hidden Hacker Terminal:** Press `` ` `` or `~` anywhere on the site to drop down a custom-built Linux-style terminal. Execute commands like `whoami`, `projects`, and `skills` directly in the browser!
- 💬 **Two-Way Real-Time Live Chat:** A fully functional, session-based customer support chat widget using **Socket.io**. Visitors can chat with me in real-time, and I can reply instantly from a secured Admin Dashboard.
- 🌍 **Deep i18n Localization:** The public site is fully localized in English, Uzbek, and Russian via a Context API dictionary (the private admin panel is English-only).
- 🔐 **Secure Admin Dashboard:** A protected admin panel (password + TOTP 2FA, revocable sessions) with full CRUD operations for managing projects, reading contact messages, and replying to live chats.
- 🚀 **Dynamic SEO & Open Graph:** Fully optimized for social sharing with dynamic meta tags via `react-helmet-async` and custom Open Graph banners.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript (Vite)
- **Styling:** Tailwind CSS v4 + Framer Motion (for smooth micro-animations)
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **State Management:** React Context API & Custom Hooks
- **Icons:** Lucide React & Custom SVGs

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (with `pg` module)
- **Real-Time:** Socket.io
- **Security:** Helmet, CORS, Rate Limiting (express-rate-limit)

---

## 💻 Local Development Setup

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Artikov-dev/my-porfio.git
cd my-porfio
```

### 2. Setup the Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Copy `backend/.env.example` to `backend/.env` and fill it in. The main variables:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
CLIENT_URL=http://localhost:5173
JWT_SECRET=...            # 32+ random characters (the server refuses to start otherwise)
REFRESH_TOKEN_SECRET=...  # a different 32+ character random string
IP_HASH_SALT=...          # random string used to hash visitor IPs in analytics
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=...   # npm run hash-password -- "your-password"
```
Redis and Telegram are optional — see `.env.example`.
Run the backend server:
```bash
npm run dev
```
Checks (also run in CI):
```bash
npm run typecheck
npm test
```
`backend/dist` is committed because Render runs it directly — run `npm run build` after changing `src` (CI fails if `dist` is stale).

If analytics data was collected before IPs were hashed, run `npm run db:hash-ips` once.

The database schema (tables + indexes) is applied automatically on every server start; `npm run db:init` does the same by hand and never deletes data. `db:seed` / `db:seed-blog` **replace** all projects / posts and refuse to run without `-- --force`.

Optional backend settings: `TRUST_PROXY` (number of proxies in front of the API — check `GET /api/system/client-ip` as admin), `VISIT_RETENTION_DAYS` (default 365).

### 3. Setup the Frontend
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Run the development server:
```bash
npm run dev
```
Lint with `npm run lint`.

On Vercel, `api/blog-share.js` gives shared blog links their own preview (title / image) and `api/sitemap.js` serves `/sitemap.xml` including blog posts. A Content-Security-Policy runs in **report-only** mode (see `vercel.json`): once the browser console shows no CSP reports, rename the header to `Content-Security-Policy` to enforce it.

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

---

## 📬 Contact & Connect

If you're interested in discussing system architecture, clean code, or potential collaborations:

- **LinkedIn:** [Roma Artikov](https://www.linkedin.com/in/artikovdev/)
- **Telegram:** [@artikov_06_tt](https://t.me/artikov_06_tt)
- **Email:** artikovrozik52@gmail.com
- **Instagram:** [@artikovv_r](https://instagram.com/artikovv_r)

*Engineered with precision and art.* ☕
