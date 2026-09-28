# Admin Database Setup

## Local XAMPP

The admin application uses Prisma 6.19 with XAMPP's MySQL-compatible database. The local `.env` is ignored by Git and points at `127.0.0.1:3306` using XAMPP's default root account with no password, as requested. Do not reuse those development credentials in deployment.

For a fresh checkout:

1. Start the XAMPP MySQL service and copy `.env.example` to `.env`.
2. Create the database once in phpMyAdmin or the MySQL console:

   ```sql
   CREATE DATABASE villa_tiara_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Install dependencies and apply the committed migrations:

   ```powershell
   npm install
   npm run db:migrate
   npm run db:seed
   ```

4. Create the first superuser in an interactive terminal. The password is hidden while typing and is stored only as a bcrypt hash:

   ```powershell
   npm run admin:create
   ```

5. Start the application and sign in at `/admin/login`:

   ```powershell
   npm run dev
   ```

`npm run db:seed` safely inserts the room catalogue without replacing existing room details. The catalogue currently has two `VT1-` codes grouped under Villa Tiara 2; verify those identifiers against the property inventory before relying on them.

## Schema Changes

After changing `prisma/schema.prisma`, run `npm run db:migrate` locally and commit the generated migration directory. `npm run build` generates Prisma Client before building Next.js. Migration application is a separate step; it is not run automatically by `npm run start`.

For initial account setup, run `npm run admin:create` once after applying migrations. Later account creation, role changes, password resets, and deactivation are available to superusers in Admin → Users. Deactivation preserves reservation attribution and revokes that account's sessions.

## Deployment Configuration

cPanel setup and deployment have not been verified in this implementation pass. Supply the deployment database URL through cPanel's environment settings; do not connect the hosted application to the XAMPP instance on this PC. Generate/build the application for the target environment and apply database migrations explicitly before starting the app. Verify host-specific Node process support and database connectivity before a production release.