# Antigravity OS 1.0 - Technical Specification (TZ)
**Author:** Roma Artikov
**Role:** Senior Software Architect / Lead Full-Stack Engineer

## 🚀 Overview
Antigravity OS 1.0 is a premium, enterprise-grade portfolio and blog engine designed with a high-end minimalist dark corporate theme. It strictly adheres to Clean Architecture, SOLID, and DRY principles.

---

## 🏗 Backend Architecture (Node.js + Express + TypeScript + PostgreSQL)
The backend is structured using the **Repository-Service-Controller Pattern**.

### 1. Authentication Module
- **Admin Only:** No public registration.
- **Double-Layered Security:**
  - JWT Tokens (Access & Refresh) stored securely in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
  - Two-Factor Authentication (TOTP) powered by `otplib` and `qrcode` for Google Authenticator integration.
  
### 2. Database Layer (Native PostgreSQL & Redis)
- **Driver:** Native `pg` driver (no ORM) utilizing raw SQL queries and connection pooling.
- **Multi-Language Content:** Utilized native PostgreSQL `JSONB` to store localized content (EN, UZ, RU) for Projects and Blogs.
- **Caching:** `ioredis` is integrated to cache high-traffic routes (`/projects`, `/blogs`). Cache is automatically invalidated upon Create/Update/Delete operations.

### 3. Telegram Webhook & Notifications
- Integrated `telegraf` to serve as an instant notification layer.
- Automatically sends structured Markdown alerts directly to the Admin's Telegram when a contact form is submitted (including IP, location, and message details).
- Provides an internal `/stats` command pulling live metrics from Redis/DB.

### 4. Real-Time Analytics (WebSockets)
- Integrated `socket.io` directly into the HTTP server.
- Tracks `active_users` incrementally in Redis and broadcasts updates globally.
- Instantly alerts the Admin Dashboard on new events without page reloads.

### 5. Middleware & Security
- `helmet`: Enforces strict HTTP headers.
- `express-rate-limit`: Prevents brute-force attacks globally and specifically on Auth routes.
- `cors`: Strict origin setup targeting the frontend application.
- `winston` & `morgan`: Enterprise-grade rotational daily logging (`combined.log` and `error.log`).
- **Global Error Handler:** Catches operational errors and formats responses cleanly to prevent stack-trace leaks in production.

---

## 🎨 Frontend Engine (React 19 + TypeScript + Vite + Tailwind CSS)
The frontend utilizes a feature-based atomic structure with absolute imports (`@/*`).

### 1. Design System & Core Assets
- **Antigravity Theme:** Deep dark background (`#0B0F19`), vibrant primary accents (`#2563EB`), and sleek borders (`#1E293B`).
- **Components:** Created `Button` and `Skeleton` atoms using Tailwind variants, glassmorphism (`backdrop-blur-md`), and micro-interactions.
- **i18n Context:** Lightweight, custom React Context built from scratch to seamlessly toggle UI dictionary languages (EN, UZ, RU).

### 2. Interactive UI (Framer Motion)
- **Command Palette:** Built a global `CMD+K / CTRL+K` interactive modal intercepting keyboard events for instant navigation.
- **3D Parallax Hero:** Implemented a custom `useMousePosition` hook controlling Framer Motion properties to shift layers based on mouse coordinates, providing a high-fidelity depth illusion.

### 3. Data Synchronization (TanStack Query)
- **React Query v5:** Handles all server-state caching, synchronization, and complex loading states natively.
- **Axios Interceptors:** Fully configured API client that silently catches `401 Unauthorized` responses to attempt automated token refreshing seamlessly.
- **Dynamic Skeletons:** Implemented pulsing Skeleton layouts natively tied to TanStack Query's `isLoading` state.

### 4. Admin Dashboard
- Protected React Router dom routing.
- **Recharts Integration:** Renders fluid area charts depicting historical traffic.
- Live WebSockets hook mapping incoming connections to dashboard animated digits.

---

## 🛠 Usage
### Backend
```bash
cd backend
npm run dev # Starts Nodemon + ts-node
```

### Frontend
```bash
cd frontend
npm run dev # Starts Vite Server
```
