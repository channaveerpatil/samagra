# Starter Kit Backend

Node.js + TypeScript + Express backend foundation for the Enterprise Starter Kit, backed by
PostgreSQL, with real session-based authentication for the Users/Customers modules.

## Getting started

```bash
npm install
cp .env.example .env
# start a local Postgres however you like (docker-compose up -d, or an existing install)
npm run migrate      # creates tables + seeds Customers/Users
npm run seed:auth     # sets a demo password for any user without one
npm run dev
```

The server starts on `http://localhost:3000` by default (see `.env`).

A local Postgres via Docker is provided in `docker-compose.yml` (`docker-compose up -d`), or point
`DATABASE_URL` at any Postgres instance you already have running.

`npm run seed:auth` prints the demo password it assigned — use it with any seeded user's email
(e.g. `admin@starterkit.dev`) to log in via `POST /api/auth/login`.

## Scripts

| Script             | Description                                              |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`       | Start the server in watch mode using `tsx`.                |
| `npm run build`     | Type-check and compile TypeScript to `dist/`.               |
| `npm start`         | Run the compiled server from `dist/` (run build first).    |
| `npm run migrate`   | Apply pending SQL migrations in `db/migrations/`.           |
| `npm run seed:auth` | Set a demo password for any user missing `password_hash`.  |
| `npm run lint`      | Run ESLint.                                                |

## Project structure

```text
db/
  migrations/   Plain SQL migration files, applied in order by src/db/migrate.ts
src/
  config/       Environment configuration
  controllers/  Request handlers (parse request, call service, send response)
  db/           Connection pool, migration runner, auth password seed script
  middleware/   Express middleware (logging, auth, 404, error handling)
  routes/       Route definitions, mapped to controllers
  services/     Business logic
  repositories/ Data access (SQL against Postgres)
  models/       Shared domain types
  utils/        Shared utilities (logger, AppError, password hashing, cookies)
  app.ts        Express application setup (middleware + routes)
  server.ts     Entry point — starts the HTTP server
```

## API

### `GET /api/health`

Returns the service health status.

### Customers — `/api/customers`

Standard CRUD: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.

### Users — `/api/users`

`GET /`, `POST /`, `PUT /:id`. `PATCH /users/me` (requires an active session) updates the
logged-in user's own profile (`firstName`, `lastName`, `phone`, `company`, `website`).

### Approvals — `/api/approvals`

All routes require an active session. `GET /`, `GET /:id`, `POST /` are available to any
authenticated role except VIEWER; `POST /:id/approve` and `POST /:id/reject` are restricted to
SUPER_ADMIN/ADMIN/MANAGER (mirrors `rolePermissions.ts` on the frontend). `requestedBy` is always
the authenticated user, not whatever the client sends. `approver` in responses is always a shared
placeholder — any eligible role can act on any pending request, there's no per-request assignment
(see the roadmap's approver_id decision).

### Auth — `/api/auth`

- `POST /login` — body `{ email, password }`. Sets an httpOnly session cookie, returns the user.
- `POST /logout` — clears the session cookie.
- `GET /me` — returns the current user from the session cookie, or `null`.

### Audit & Activity — `/api/audit`

`GET /` and `GET /:id` require an active session with role SUPER_ADMIN/ADMIN/MANAGER (mirrors the
frontend's `AUDIT_VIEW` permission). `POST /` requires only an active session — it exists as a
thin client-side convenience for UI-only events with no natural backend hook.

The authoritative audit trail is written server-side: `userService`, `customerService`, and
`approvalService` call `auditLogService.record()` after a real mutation (user created, user role
changed, customer created, approval approved/rejected) rather than trusting a client-supplied
payload for those events. `record()` is fire-and-forget — a failed audit insert is logged and
never blocks or rolls back the action it's describing, and if there's no authenticated actor on
the request, the event is silently skipped rather than written with a fake actor.

Sessions are opaque random tokens stored server-side in the `sessions` table (no JWTs). Passwords
are hashed with Node's built-in `scrypt` — no extra dependency for this.

### Reports — `/api/reports`

`GET /` (report catalog) and `GET /:id` (job status) require only an active session. `POST /`
(generate) and `GET /:id/download` are restricted to everyone except VIEWER (mirrors
`REPORT_GENERATE`/`REPORT_DOWNLOAD`). `GET /reports/jobs` powers Report History.

Generation is synchronous — by the time `POST /reports` returns, the job is already `COMPLETED` or
`FAILED`. This is a deliberate simplification (see the roadmap): the async queue/worker/object-
storage architecture sketched in the reporting requirements doc is an explicit non-goal here.
Generated `.xlsx` files are written to `backend/storage/reports/` (git-ignored) using the same
`xlsx` library the frontend already uses for its mock/offline report generation; the "User Report"
reads from the real `users` table, not a mock array, which the frontend's client-side equivalent
still does.

### Notifications — `/api/notifications`, `/api/notification-preferences`

All routes require an active session and are scoped to the caller (`req.user.id`) — every query
filters by `user_id`, so there's no cross-user leakage. `GET /`, `GET /:id`, `POST /`,
`PATCH /:id/read`, `POST /read-all`, plus `GET`/`PATCH /notification-preferences`
(`notification_preferences` rows are created lazily with defaults on first read).

`POST /notifications` is a thin client-side convenience, same as Audit — but for the one event
that actually needs correct per-user targeting (an approval decision), `approvalService` calls
`notificationService.notify()` directly, addressed to the original requester rather than whoever
is currently logged in. The frontend's own post-hoc `notificationsApi.create()` call in
`useApproveApproval`/`useRejectApproval` would target the wrong person once notifications are
scoped (it notifies the approver, not the requester), so it's now gated to mock mode only — see
those two hooks.

## Configuration

Configuration is read from environment variables (see `.env.example`):

| Variable      | Description                                          | Default                                                    |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `PORT`        | Port the HTTP server listens on.                       | `3000`                                                       |
| `NODE_ENV`    | `development`, `production`, or `test`.                 | `development`                                                |
| `DATABASE_URL`| Postgres connection string.                             | `postgres://starterkit:starterkit@localhost:5432/starterkit` |
| `CORS_ORIGIN` | Origin allowed to send credentialed requests (the frontend dev server). | `http://localhost:5173` |

Never commit a real `.env` file — only `.env.example` is tracked.
