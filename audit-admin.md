# Admin Audit — Villa Tiara Sarangan

## Summary

The admin area is currently a client-side prototype rather than a protected, shared booking system. The most urgent risks are that anyone can open admin routes, booking and guest data is stored only in the current browser, and booking submission does not enforce room selection or availability. Several dashboard and room-status values can consequently be wrong even during ordinary use.

## Scope and Method

Reviewed the App Router admin pages and layouts, admin template/navigation, login form, dashboard, booking/check-in/history/guest/room components, and package/API structure. Findings below are based on source inspection. No production environment, database, deployment configuration, or live user session was available; no runtime security test was performed. `server.js` was not inspected or modified.

## Findings

### P0 — Admin routes have no authentication or authorization

The login form accepts any non-empty username and password and immediately navigates to the dashboard. The dashboard layout adds no server-side guard, and all admin routes can be opened directly. The “not a robot” checkbox is only a required form field, not authentication. The sidebar's “Keluar” link only returns to the same login form.

Evidence: [FormLogin.jsx](app/components/(Admin)/FormLogin.jsx), [app/admin/(dashboard)/layout.jsx](app/admin/(dashboard)/layout.jsx), [app/admin/page.jsx](app/admin/page.jsx), [SidebarAdmin.jsx](app/components/(Admin)/SidebarAdmin.jsx).

Impact: booking, guest, and room information is exposed and editable by any visitor. UI-only hiding would not fix this; access checks must be enforced server-side for every protected route and data operation.

### P1 — Admin records exist only in browser localStorage

Booking, check-in, history, guest, and room data are read and written directly to `localStorage`; the only API route found is for articles. There is no shared persistence or server-side validation for admin operations.

Evidence: [TambahBooking.jsx](app/components/(Admin)/TambahBooking.jsx), [DaftarBooking.jsx](app/components/(Admin)/DaftarBooking.jsx), [DaftarCheckIn.jsx](app/components/(Admin)/DaftarCheckIn.jsx), [DaftarTamu.jsx](app/components/(Admin)/DaftarTamu.jsx), [DaftarKamar.jsx](app/components/(Admin)/DaftarKamar.jsx), [Dashboard.jsx](app/components/(Admin)/Dashboard.jsx).

Impact: different devices/browsers do not share records; clearing browser data loses them; multiple staff members can overwrite or act on stale state; anyone with browser access can alter records. This is unsuitable as the system of record for live reservations.

### P1 — Booking submission permits missing or unavailable rooms

The form initializes the room ID to `000`, but does not require a room selection. Room tiles remain clickable when marked booked/checked, and the submit handler appends a booking without validating room identity, availability, or positive stay length. The date overlap checks also treat checkout as an occupied day (`<=`/`>=`), which rejects a new stay beginning on the prior guest's checkout date.

Evidence: [TambahBooking.jsx](app/components/(Admin)/TambahBooking.jsx), [DaftarBooking.jsx](app/components/(Admin)/DaftarBooking.jsx).

Impact: zero-price/unassigned bookings and double bookings can be saved; valid same-day turnover can be blocked. Client-side checks alone are not sufficient once persistence is moved server-side.

### P1 — Room status ignores reservation dates

The “real-time” status page marks a room booked or occupied if any record exists for that room, without comparing the reservation/check-in dates to today or a selected date. A past booking that was not converted to check-in can therefore keep a room marked reserved indefinitely; an overdue check-in remains occupied until manually checked out.

Evidence: [StatusKamar.jsx](app/components/(Admin)/StatusKamar.jsx).

Impact: staff are shown stale availability and can make incorrect operational decisions.

### P1 — Dashboard guest count uses a field that is never populated

The dashboard filters guest records using `tamu.tanggal`, while manual guest entry and booking check-in create records with `tanggalWaktu`. The date comparison therefore evaluates false for these records and the dashboard guest count is incorrect (typically zero).

Evidence: [Dashboard.jsx](app/components/(Admin)/Dashboard.jsx), [TambahTamu.jsx](app/components/(Admin)/TambahTamu.jsx), [DaftarBooking.jsx](app/components/(Admin)/DaftarBooking.jsx).

### P2 — Direct entry can crash on an uninitialized room list

`TambahBooking` and `DaftarBooking` parse `kamarList` and immediately read `VillaTiara1`/`VillaTiara2`. The default room list is seeded by the dashboard component, not by a shared initializer. A fresh browser opening either route directly can parse `null` and throw before the page renders.

Evidence: [TambahBooking.jsx](app/components/(Admin)/TambahBooking.jsx), [DaftarBooking.jsx](app/components/(Admin)/DaftarBooking.jsx), [Dashboard.jsx](app/components/(Admin)/Dashboard.jsx).

### P2 — Room catalogue contains Villa Tiara 1 codes under Villa Tiara 2

The `VillaTiara2` seed data includes room codes `VT1-0314` and `VT1-0215`. They are rendered and counted as Villa Tiara 2 rooms despite their Villa Tiara 1 prefixes.

Evidence: [TambahKamar.jsx](app/components/(Admin)/TambahKamar.jsx).

Impact: staff can refer to rooms by inconsistent villa/location identifiers; confirm the intended room codes against the actual inventory before correcting data.

### P2 — Room rates accept arbitrary text

The room editor uses a text input for `hargaKamar`, with no numeric or non-negative validation. This value feeds price calculations and currency formatting.

Evidence: [DaftarKamar.jsx](app/components/(Admin)/DaftarKamar.jsx).

### P3 — Admin navigation includes non-functional controls

The navbar search has no state or search behavior, the notification indicator is decorative, and the “Laporan” menu contains placeholder `?` entries. These controls imply functionality staff cannot use.

Evidence: [NavbarAdmin.jsx](app/components/(Admin)/NavbarAdmin.jsx), [SidebarAdmin.jsx](app/components/(Admin)/SidebarAdmin.jsx).

## Remediation Plan

### Phase 0 — Close access exposure

- [ ] Decide the identity provider and admin roles; do not add production credentials to client code.
- [ ] Implement server-validated sign-in and a secure, HttpOnly, SameSite session cookie.
- [ ] Protect every `/admin` route except the login route and protect every admin data/API operation; redirect unauthenticated users server-side.
- [ ] Implement real sign-out that invalidates the session; remove the fake CAPTCHA checkbox unless an actual CAPTCHA service is integrated.
- [ ] Add tests for anonymous direct route access, failed login, successful login, and session invalidation.

### Phase 1 — Establish reliable shared records

- [ ] Choose the production database and define validated schemas for rooms, bookings, check-ins, guests, and reservation history.
- [ ] Move reads/writes from `localStorage` to authenticated server actions or API routes; enforce authorization and validation on the server.
- [ ] Define a one-time migration/import plan for existing browser data, including conflict handling and a backup/export before cutover.
- [ ] Add persistence tests for multiple sessions and failure/error handling; document backup and recovery expectations.

### Phase 2 — Make booking and room state correct

- [ ] Centralize availability calculation and use half-open stays `[check-in, check-out)` so checkout-day turnover works.
- [ ] Reject missing rooms, invalid or zero-night dates, invalid rates, and overlapping bookings on the server; repeat availability validation atomically when saving.
- [ ] Derive room status from dated bookings/check-ins and a defined date/time-zone policy instead of a date-independent “any record” check.
- [ ] Confirm and correct the two Villa Tiara 2 room codes with the property inventory owner.
- [ ] Add tests for overlapping stays, same-day turnover, expired reservations, overdue check-ins, and concurrent booking attempts.

### Phase 3 — Align reporting and operator workflows

- [ ] Define one canonical guest/booking timestamp field and update dashboard counts and guest creation to use it consistently.
- [ ] Add a shared room-data initializer or server-backed catalogue so every route handles a fresh/empty data store safely.
- [ ] Validate room prices as non-negative numbers and show actionable form errors rather than accepting malformed values.
- [ ] Implement or remove the navbar search, notifications, and report placeholders; verify mobile navigation and keyboard accessibility.
- [ ] Add focused end-to-end coverage for create booking → check in → check out → history and dashboard totals.

## Suggested Acceptance Criteria

- Anonymous users cannot render admin pages or read/write admin data, including by direct URL/API access.
- Authorized staff see the same persisted records across browsers and sessions, with a documented recovery path.
- Invalid and overlapping bookings are rejected; same-day checkout/check-in turnover is allowed under the chosen policy.
- Room status, guest counts, and revenue reports match the canonical stored records and test fixtures.
- Fresh-browser direct navigation to every admin route renders a safe empty/loading state rather than throwing.

## Implementation Progress — 2026-09-27

Implemented locally:

- Added Prisma 6.19 models for users, sessions, rooms, reservations, and guest logs; generated and applied the initial MariaDB migration to `villa_tiara_admin`.
- Added the shared room catalogue and an idempotent database seed; 24 room records seeded successfully.
- Replaced the placeholder login with bcrypt verification and opaque, hashed database sessions; protected admin pages and admin APIs server-side.
- Added superuser-only user management, including staff creation, profile/role updates, password reset, and session-revoking deactivation.
- Added authenticated APIs for room availability/updates, reservation lifecycle, guest logs, and dashboard data; migrated admin screens away from record `localStorage`.
- Added local setup instructions in [docs/admin-database.md](docs/admin-database.md).

Still to verify or complete:

- Create the initial superuser with `npm run admin:create` from an interactive terminal; credentials are deliberately not committed or generated with a known default.
- Run the initial superuser bootstrap and manually exercise the screens in a browser. The production build and API smoke test passed; the API smoke test covered login/session, staff denial of user management, room seed, overlap rejection, same-day turnover, check-in, check-out, and history.
- Confirm the two `VT1-` room identifiers currently grouped under Villa Tiara 2 against the real inventory.
- cPanel staging/deployment checks remain deferred by request.
- `npm audit --omit=dev` reports 29 production dependency advisories (2 critical, 14 high, 11 moderate, 2 low), including critical findings in the existing Next.js and Swiper dependency tree. No broad or major-version dependency upgrades were applied during this database migration; review and patch these before public production deployment.