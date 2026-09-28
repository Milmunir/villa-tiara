# Audit & Technical Analysis Document — Villa Tiara Sarangan

## 1. Executive Summary & Tech Stack Overview

- **Project Name**: Villa Tiara Sarangan (`villa-tiara-sarangan`)
- **Version**: `0.1.0`
- **Framework**: Next.js `15.0.3` (App Router `app/`)
- **React Runtime**: React `18.3.1` / React DOM `18.3.1` (*Note: Next.js 15 targets React 19; peer dependency mismatch present in `package.json`*)
- **Database & ORM**: Prisma ORM `6.19.0` with MySQL datasource (`schema.prisma`), singleton client (`lib/prisma.js`)
- **Authentication & Validation**: Bcrypt.js `3.0.3`, Zod `4.6.5`, SHA-256 Hashed HTTP-Only Session Cookies (`lib/admin-auth.js`)
- **Styling Framework**: Tailwind CSS `3.4.1`, PostCSS `8`, custom Geist fonts (`GeistVF.woff`, `GeistMonoVF.woff`), `tailwind-scrollbar-hide`, `tailwindcss-textshadow`
- **UI Components & Icons**: `react-icons` `5.3.0`, SweetAlert2 (`sweetalert2` `11.14.5`, `sweetalert2-react-content` `5.0.7`), Framer Motion (`framer-motion` `11.13.1`), `react-photo-view` `1.2.6`
- **Redundant Slider Engines**:
  - `@glidejs/glide` `3.6.2` (used in `Testimoni.jsx`)
  - `react-slick` `0.30.2` / `slick-carousel` `1.8.1` (used in `Fasilitas.jsx`)
  - `swiper` `11.1.15` (used in `Tentang.jsx`)
- **Export & Utility Tools**: `exceljs` `4.4.0`, `file-saver` `2.0.5`, `sharp` `0.33.5`, `gray-matter` `4.0.3`, `react-markdown` `10.1.0`
- **Server-Level Config**: `next.config.mjs` handles static image host patterns and server-side redirects (`/` -> `/Beranda`, legacy `/Dashboard` -> `/admin/Dashboard`, etc.)
- **Custom Node Server**: `server.js` (Custom HTTP server wrapping Next.js — **FROZEN / NO TOUCH**)

---

## 2. Architecture & Application Flow

### 2.1 Routing & Navigation Structure

```mermaid
flowchart TD
    Client[Browser Client] --> MW[Next.js App Router]
    MW -->|Public Routes| UserApp[User App Route Group app/(user)]
    UserApp --> Beranda[/beranda]
    UserApp --> TipeKamar[/tipekamar]
    UserApp --> Artikel[/artikel & /artikel/:id]
    UserApp --> Galeri[/galeri]
    UserApp --> FAQ[/faq]
    
    MW -->|Admin Routes| AdminApp[Admin Workspace app/admin]
    AdminApp --> Login[/admin/login]
    AdminApp --> DashboardLayout[Admin Dashboard Layout app/admin/(dashboard)]
    DashboardLayout -->|Auth Check| AdminAuth[getCurrentAdmin Check]
    AdminAuth -->|Valid Session| Dashboard[/admin/dashboard]
    AdminAuth -->|Valid Session| Bookings[/admin/daftarbooking & /admin/tambahbooking]
    AdminAuth -->|Valid Session| Rooms[/admin/daftarkamar & /admin/statuskamar]
    AdminAuth -->|Valid Session| Guests[/admin/daftartamu & /admin/tambahtamu]
    AdminAuth -->|Superuser Only| Users[/admin/users]
    AdminAuth -->|No Session| LoginRedirect[Redirect to /admin/login]
    
    AdminApp --> API[App Router API Routes /api/admin/*]
    API --> ZodValidation[Zod Input Validation]
    ZodValidation --> PrismaTransactions[Prisma Serializable Transactions]
    PrismaTransactions --> Database[(MySQL Database)]
```

### 2.2 Template & Component Mounting Status

1. **App Router Layout Migration — [RESOLVED]**:
   - Routes are organized into native route groups `app/(user)` and `app/admin/(dashboard)`.
   - Layout wrapping occurs natively in `app/(user)/layout.jsx` and `app/admin/(dashboard)/layout.jsx`. Shared state and context stay intact across page transitions.
2. **Elimination of Duplicate Sidebar DOM Mounting — [RESOLVED]**:
   - `<SidebarAdmin />` was removed from `NavbarAdmin.jsx`.
   - Mobile sidebar state (`isMobileSidebarOpen`) is managed in `AdminTemplate.jsx`, passing toggle controls to `NavbarAdmin` and drawer state to `SidebarAdmin` with a backdrop overlay.
3. **Unification of Navigation Headers — [RESOLVED]**:
   - `Navbar.jsx` dynamically inspects `usePathname()`. On `/` or `/Beranda`, anchor hash links (`#jumbotron`, `#tentang`, `#galeri`, etc.) are used; on subpages, path routes (`/Tentang`, `/Galeri`, etc.) are generated automatically.
4. **Dead / Orphaned Artifacts — [NEW FINDING]**:
   - `app/(templates)/(User)/UserTemplate.jsx` and `UserTemplate2.jsx` are no longer imported or used.
   - `app/components/(User)/Navbar2.jsx` is no longer imported or used.
   - These files remain in the codebase as obsolete artifacts and can be cleaned up.

---

## 3. Security & Authentication Audit

### 3.1 Authentication & Session Management — [RESOLVED]

- **Implementation**: `lib/admin-auth.js` and `/api/admin/auth/login`
- **Details**:
  - Passwords hashed with `bcryptjs`.
  - Sessions issued with cryptographic 256-bit random tokens (`randomBytes(32)`), stored in DB as SHA-256 hashes (`tokenHash`).
  - Session tokens stored in HTTP-Only, SameSite Lax, secure cookies (`villa-tiara-admin-session`) with 8-hour expiry.
  - Revocation on sign-out deletes session records from database and clears cookies.
  - Server-side access control in `app/admin/(dashboard)/layout.jsx` redirects unauthenticated visitors to `/admin/login`.

### 3.2 Role-Based Access Control (RBAC) — [RESOLVED]

- **Implementation**: `authorizeAdmin(superuserOnly)` in `lib/admin-api.js` and `app/admin/(dashboard)/users/page.jsx`
- **Details**:
  - Distinguishes between `SUPERUSER` and `STAFF` roles.
  - User management endpoints (`/api/admin/users`) enforce `SUPERUSER` permissions.

### 3.3 Security Recommendations — [OUTSTANDING / MEDIUM]

- **Missing Edge-Level Middleware Guard**:
  - *Current State*: Session validation occurs inside server layouts and individual route handlers.
  - *Recommendation*: Add a root `middleware.js` to intercept unauthorized requests before layout execution and static segment prefetching.
- **Login Rate Limiting**:
  - *Current State*: `/api/admin/auth/login` has no rate limit.
  - *Recommendation*: Implement IP-based sliding window rate limiting to mitigate brute-force attempts.

---

## 4. Data Layer & Business Logic Audit

### 4.1 Database Schema & Prisma ORM — [RESOLVED]

- **Provider**: MySQL database connected via Prisma ORM (`prisma/schema.prisma`).
- **Models**:
  - `User`: Admin accounts with unique username, bcrypt password hash, role enum (`SUPERUSER`, `STAFF`), and active status.
  - `Session`: Hashed session tokens with user reference and expiry timestamp.
  - `Room`: Villa rooms with unique code (`VT1-0314`, `VT2-0112`), villa identifier, bed info, and price per night.
  - `Reservation`: Booking records with room relation, guest details, check-in/out dates, status enum (`BOOKED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`), rates, and timestamps.
  - `GuestLog`: Visitor log entries linked optionally to reservations.
- **Singleton Client**: `lib/prisma.js` prevents connection exhaustion during Next.js hot-reloads.

### 4.2 Booking Concurrency & Availability Logic — [RESOLVED]

- **Implementation**: `lib/admin-data.js` (`createReservation`, `updateReservation`)
- **Concurrency Protection**: Uses Prisma `$transaction` with `isolationLevel: "Serializable"` and raw row locking (`SELECT id FROM Room WHERE id = ... FOR UPDATE`).
- **Date Range Overlap Check**:
  - Uses half-open interval `[checkIn, checkOut)` query: `checkIn: { lt: checkOut }, checkOut: { gt: checkIn }`.
  - Correctly allows same-day turnover (a new guest checking in on the day a previous guest checks out).
- **Timezone Normalization**: Normalizes dates to `Asia/Jakarta` using `Intl.DateTimeFormat` to avoid UTC offset discrepancies.

---

## 5. Performance, Bundle Size & Dependencies Audit

### 5.1 Heavy Eager Imports — [OUTSTANDING / MEDIUM]

- **Location**: `app/components/(Admin)/DaftarRiwayat.jsx`
- **Issue**: Eager top-level import of `exceljs` (`import ExcelJS from "exceljs"`).
- **Impact**: `/admin/daftarriwayat` bundle size is **257 kB** (First Load JS: **381 kB**).
- **Remediation**: Use dynamic import inside `exportToExcel`:
  ```javascript
  const exportToExcel = async () => {
    const ExcelJS = (await import("exceljs")).default;
    // generate spreadsheet...
  };
  ```
  This reduces initial JS payload for `/admin/daftarriwayat` by **~98%**.

### 5.2 Redundant Carousel Libraries — [OUTSTANDING / LOW]

- **Issue**: Package configuration includes 3 separate carousel engines:
  - `@glidejs/glide` (`Testimoni.jsx`)
  - `react-slick` & `slick-carousel` (`Fasilitas.jsx`)
  - `swiper` (`Tentang.jsx`)
- **Remediation**: Consolidate all sliders onto `swiper` and remove `@glidejs/glide` and `react-slick`.

---

## 6. Actionable Remediation Roadmap

### Priority 0: Critical Security & Core Persistence
- [x] **Database Migration & Backend API**: Replaced client-side `localStorage` with Prisma ORM, MySQL, and Zod-validated API routes.
- [x] **Secure Authentication & RBAC**: Implemented bcrypt password verification, SHA-256 hashed session cookies, and superuser role enforcement.
- [x] **Serializable Concurrency Locking**: Implemented raw row locking (`FOR UPDATE`) and serializable transactions for reservation creation/updates.
- [x] **Correct Half-Open Stay Intervals**: Enforced `checkIn < existingCheckOut` and `checkOut > existingCheckIn` for accurate same-day room turnover.
- [x] **XSS-Free Markdown Articles**: Migrated articles to file-based `.md` rendered via `react-markdown` and `remark-gfm`.

### Priority 1: Architecture & Performance Optimization
- [ ] **Implement Root Edge Middleware**: Add `middleware.js` to guard `/admin/*` subroutes before layout execution.
- [ ] **Dynamic Import for `exceljs`**: Refactor `DaftarRiwayat.jsx` to lazily import `exceljs`, optimizing the 257 kB bundle.
- [ ] **Clean Up Dead Artifacts**: Delete unused legacy components (`UserTemplate.jsx`, `UserTemplate2.jsx`, `Navbar2.jsx`).

### Priority 2: Security Hardening & Dependency Cleanup
- [ ] **Login Rate Limiting**: Add IP rate limiting on `/api/admin/auth/login`.
- [ ] **Carousel Dependency Consolidation**: Standardize on `swiper` and remove `@glidejs/glide` and `react-slick`.
- [ ] **Prisma 7 Config Migration**: Migrate `package.json#prisma` to `prisma.config.ts`.



