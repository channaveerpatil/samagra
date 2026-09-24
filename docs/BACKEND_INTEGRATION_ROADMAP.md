# Backend Integration Roadmap

**Status:** Planning document. No application code was changed to produce this.
**Source of truth for:** migrating the app from mock data to a real Node/Express + PostgreSQL backend, feature by feature, without redesigning the existing frontend architecture.

This document is written from a full inspection of the current repo (`frontend/`, `backend/`, `docs/`) as it exists today — not from aspiration. Every claim below was verified against the actual source.

---

## 0. TL;DR

- The backend already exists (`backend/`, Express + TypeScript) and already serves **two real, working REST endpoints** — **Customers** and **Users** — using an in-memory (non-persistent) repository layer. No PostgreSQL exists yet anywhere in the repo.
- Every other feature (**Approvals, Audit & Activity, Reports, Notifications**) runs entirely on frontend mock data behind a `mockXApi` / `realXApi` switch that already exists per-feature and is controlled by one flag: `VITE_USE_MOCK_API` → `appConfig.features.useMockApi`.
- **Authentication is 100% mocked** client-side (pick-a-role buttons, `localStorage`). There is no login endpoint, no session, no password, and the backend enforces **no authorization at all** on any route today. This is the single biggest gap and the correct place to invest before deeply wiring more features to the backend.
- The migration strategy in this document is: **fix a few contract inconsistencies → add Postgres under what's already real (Customers/Users) → introduce real auth → then unlock Approvals → Audit → Reports → Notifications in that dependency order**, because each of those needs a real, identifiable user.
- The `mockXApi`/`realXApi` switch pattern is good and should be **kept and extended**, not replaced — including retrofitting it onto Customers/Users, which currently bypass it entirely (a real inconsistency, see §3).

---

## 1. Current frontend features and their data sources

| Feature | Route(s) | Data source today | Mock/Real switch present? |
|---|---|---|---|
| Dashboard | `/` | Aggregates Customers, Approvals, Reports, Users, Audit client-side (no data of its own) | N/A (derived) |
| Customers | `/customers` | **Real HTTP** → `backend` `/api/customers` (in-memory repo, no DB) | **No** — `customersApi.ts` calls `apiClient` unconditionally |
| Users / RBAC Management | `/rbac`, `/rbac/add-user`, `/rbac/role-matrix` | **Real HTTP** → `backend` `/api/users` (in-memory repo, no DB) | **No** — `usersApi.ts` calls `apiClient` unconditionally |
| Login / current user (RBAC identity) | `/login` | 100% mock — `MOCK_USERS` static array in `lib/auth/mockUsers.ts`, selected user id persisted in `localStorage` (`auth.userId`) via `AuthProvider` | N/A — no backend concept exists |
| Profile | `/profile` | Same mock user, edits persisted as a `localStorage` overlay (`auth.profileOverrides`) merged onto the mock user in `AuthProvider` | N/A |
| Approvals | `/approvals`, `/approvals/request` | Mock — `approvalsApi.ts`, in-memory array seeded with `MOCK_APPROVALS` | **Yes** — `mockApprovalsApi` / `realApprovalsApi` |
| Audit & Activity | `/audit` | Mock — `auditApi.ts`, in-memory array seeded with `MOCK_AUDIT_LOGS`. **`auditService.log()` has zero real callers today** — no other feature writes to it; it only shows its own seed data | **Yes** — `mockAuditApi` / `realAuditApi` |
| Reports | `/reports` | Mock async job simulation — `reportsApi.ts`. **Customer Report** pulls from the real `customersApi.list()`. **User & Access Report** pulls from the static `MOCK_USERS` array (**not** the real `/users` backend, and **not** `usersApi`) — an existing inconsistency, see §3 | **Yes** — `mockReportsApi` / `realReportsApi` |
| Notifications | Header bell + `/settings/notifications` | Mock, global in-memory array — **not scoped per user at all** (`NotificationItem` has no `userId`); every logged-in mock user currently sees the same notification list | **Yes** — `mockNotificationsApi` / `realNotificationsApi` |
| RBAC (roles/permissions) | Everywhere (nav gating, `ProtectedRoute`, `can()`) | 100% static, client-side only (`permissions.ts`, `roles.ts`, `rolePermissions.ts`) | N/A — has no server-side counterpart at all |
| i18n | Settings → General | Fully real, client-side (`en`/`kn` dictionaries), no backend dependency by design | N/A |
| Feature flags | `VITE_FEATURE_*` env vars | Fully real, build-time | N/A |

---

## 2. Which features still use mock data

**Fully mock (no backend exists for them at all):**
- Approvals
- Audit & Activity
- Reports (report generation, job status, history)
- Notifications (+ notification preferences)
- Authentication / session / "who am I"
- RBAC permission enforcement (client-only; nothing server-side checks anything)

**Already real, but incomplete/inconsistent:**
- Customers — real, CRUD-complete, but in-memory (lost on backend restart) and doesn't honor `useMockApi`.
- Users — real, but **partial CRUD** (no `GET /users/:id`, no `DELETE /users/:id`; frontend never asks for either today, so it's not a blocking gap, just worth knowing), in-memory, doesn't honor `useMockApi`, and is **not** the data source the Reports feature uses for its "User Report" (see §3).

---

## 3. Existing API contracts and gaps

### 3.1 What's documented

- `docs/API_CONTRACT.html` — an interactive contract viewer. It documents **Customers** (matches the real backend exactly) and **Approvals** (documents the *intended future* contract; **no backend route exists for it yet**). It does **not** cover Users, Audit, Reports, or Notifications.
- Each feature's original requirements doc (`docs/APPROVAL_REQUIREMENTS.md`, `docs/NOTIFICATION_REQUIREMENTS.md`, `docs/REPORTING_REQUIREMENTS.md`) already contains a "Future API contract" section written when that feature was built. These are consistent with what the frontend's `realXApi` implementations already assume. Audit has no such doc (it was built ad hoc); its contract is inferred directly from `auditApi.ts`.

### 3.2 Consolidated "future contract" the frontend already assumes

| Feature | Method & Path | Notes |
|---|---|---|
| Approvals | `GET /api/approvals` | List |
| | `GET /api/approvals/:id` | Detail |
| | `POST /api/approvals` | **Not in the original doc, but already coded** in `realApprovalsApi.createApprovalRequest` — needed for the "Request Approval" feature added after the original spec |
| | `POST /api/approvals/:id/approve` | Body: `{ comment? }` |
| | `POST /api/approvals/:id/reject` | Body: `{ comment? }` |
| Audit | `GET /api/audit` | List |
| | `GET /api/audit/:id` | Detail |
| | `POST /api/audit` | Create one entry (used by `auditService.log()`) |
| Reports | `GET /api/reports` | Report *definitions* (catalog), not jobs |
| | `POST /api/reports` | Body: `{ reportType }` → creates a job |
| | `GET /api/reports/:id` | Job status/progress |
| | `GET /api/reports/:id/download` | Binary (not JSON) — `realReportsApi` already fetches this outside `apiClient` for that reason |
| | `GET /api/reports/jobs` | **Not in the original doc** — added later to power Report History; needed for parity |
| Notifications | `GET /api/notifications` | List |
| | `GET /api/notifications/:id` | Detail |
| | `PATCH /api/notifications/:id/read` | Mark one read |
| | `POST /api/notifications/read-all` | Mark all read |
| | `GET /api/notification-preferences` | |
| | `PATCH /api/notification-preferences` | |

### 3.3 Concrete gaps and mismatches to resolve *before* wiring more features

1. **Error-shape mismatch (affects every future integration).** The backend's `errorHandler` returns `{ "error": { "message": "..." } }`. `docs/API_CONTRACT.html` documents error bodies as a flat `{ "message": "..." }`. **Neither matches what the frontend actually reads**: `apiClient.ts` parses the response body into `ApiError.data` but never reads a message out of it — every failed request surfaces the generic string `"Request failed with status {code}"` to the user via the toast bus. Today's real backend already returns rich, useful messages (e.g. `"email" is required`, `Customer "x" was not found"`) that are silently discarded. **Fix this in Phase 0** — pick one envelope shape and make `apiClient` surface `body.error.message` (or `body.message`) as the `ApiError` message.
2. **Customers/Users bypass the mock switch.** Every other feature can be developed/demoed with zero backend running. Customers and Users cannot — if the backend isn't up, those two pages simply fail. This is inconsistent with the rest of the app's architecture and should be fixed (add `mockCustomersApi`/`mockUsersApi`, gate on `appConfig.features.useMockApi`) rather than left as a permanent exception.
3. **Reports' "User Report" reads the wrong data source.** `generateUserReportExcel.ts` imports `MOCK_USERS` from `lib/auth/mockUsers.ts` (the login-simulation array) instead of the real `usersApi`/`useUsers()` that RBAC Management already uses. This means the User Report is already stale/wrong relative to real data, independent of any backend migration. Cheap, independent fix.
4. **Notifications have no user scoping.** `NotificationItem` has no `userId`. This isn't just a migration gap — it's a correctness gap today (every mock user shares one global inbox). It must be designed in from the start when Notifications gets a real backend, not bolted on later.
5. **Audit writes are 100% client-trusted today** (and, in practice, never triggered — see §1). `auditService.log()` just POSTs whatever the caller passes. That's acceptable for a mock, but if kept as-is against a real backend, any client could fabricate audit history. When Audit goes real, the backend should **write its own audit rows from the service layer** on real mutations, not trust a client-supplied audit payload. This is a deliberate, justified deviation from "just flip the switch" — call it out explicitly in Phase-by-phase notes below.
6. **Notification creation is similarly client-initiated** (`useApproveApproval`, `useReportJobs` call `notificationsApi.create()` after their own action succeeds). Lower severity than audit spoofing (worst case is a fake toast for yourself), but the same category — should eventually move server-side once Notifications is real.
7. **CORS is wide open** (`app.use(cors())`, no options) and there is **no auth middleware on any route**. Fine for local dev today; must not go beyond `localhost` like this.
8. **No pagination/filtering/sorting** on any real endpoint (`GET /customers`, `GET /users` return the full table). All filtering today happens client-side (debounced search in `useCustomers`, tab/status filters in Approvals/Audit). Not a blocker at current data volumes; flag as a follow-up once real data grows.
9. **IDs are backend-generated human-readable strings** (`cus_xxxxx`, `user_xxxxx`, `apr_xxxxx`, `aud_xxxxx`), not UUIDs. This is a schema decision to make consciously (§5), not an accident to "fix."

---

## 4. Backend APIs required for each remaining feature

Building on §3.2, each remaining feature needs a real Express router/controller/service/repository stack **mirroring the exact structure already used for Customers** (`backend/src/{routes,controllers,services,repositories,models}`). None of this needs new architectural patterns — just repeating the existing one.

| Feature | New backend modules needed | Depends on |
|---|---|---|
| Auth | `routes/authRoutes.ts`, `controllers/authController.ts`, `services/authService.ts`, `models/Session`/`AuthCredential`, password hashing util | Users table existing (already true) |
| Approvals | `approvalRoutes/Controller/Service/Repository`, `models/Approval.ts` | Auth (for real `requestedBy`) |
| Audit | `auditRoutes/Controller/Service/Repository`, `models/AuditLog.ts` — **plus** hooks from Users/Customers/Approvals/Reports services to write audit rows | Auth, and ideally after Users/Customers/Approvals are real (nothing meaningful to audit otherwise) |
| Reports | `reportRoutes/Controller/Service/Repository`, `models/ReportJob.ts`, move the existing `xlsx` generation code (already written, just client-side today in `features/reports/utils/generate*Excel.ts`) into the backend service | Auth (for `requestedBy`), Customers/Users (for report content) |
| Notifications | `notificationRoutes/Controller/Service/Repository`, `models/Notification.ts`, `models/NotificationPreference.ts` | Auth (for per-user scoping); ideally after Approvals/Reports so their real events can create notifications server-side |

Also required, cutting across all of them:
- Auth middleware (session/JWT verification) applied to every route from Phase 2 onward.
- A permission-check middleware/helper on the backend that mirrors `rolePermissions.ts` (see §9) — e.g. `requirePermission('APPROVAL_APPROVE')`.

---

## 5. PostgreSQL entities, relationships, and suggested schema

No database exists yet at all — this is a fresh design, but shaped tightly around the frontend's existing TypeScript models so the mapping is mechanical.

```
users
  id            text PK            -- keep the existing "user_xxx" id style, or switch to uuid — decide once, see note below
  first_name    text NOT NULL
  last_name     text NOT NULL
  email         text NOT NULL UNIQUE
  role          text NOT NULL      -- 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER'
  phone         text
  company       text
  website       text               -- currently only on the mock AuthUser/Profile page, not backend User — needs adding
  password_hash text               -- NULL until Phase 2 (auth) lands; not present in current backend User model
  created_at    timestamptz NOT NULL DEFAULT now()
  updated_at    timestamptz NOT NULL DEFAULT now()

customers
  id          text PK              -- "cus_xxx"
  name        text NOT NULL
  email       text NOT NULL
  phone       text NOT NULL
  company     text NOT NULL
  status      text NOT NULL        -- 'active' | 'inactive' | 'lead'
  created_at  timestamptz NOT NULL DEFAULT now()

approval_requests
  id              text PK          -- "apr_xxx"
  title           text NOT NULL
  description     text NOT NULL
  type            text NOT NULL    -- 'PURCHASE' | 'ACCESS' | 'CUSTOMER_CHANGE' | 'PROJECT' | 'OTHER'
  requested_by_id text NOT NULL REFERENCES users(id)
  approver_id     text NULL REFERENCES users(id)   -- see decision note below
  amount          numeric(14,2)
  status          text NOT NULL    -- 'PENDING' | 'APPROVED' | 'REJECTED'
  comment         text
  created_at      timestamptz NOT NULL DEFAULT now()
  updated_at      timestamptz NOT NULL DEFAULT now()

audit_logs
  id            text PK            -- "aud_xxx"
  action        text NOT NULL      -- 'USER_CREATED' | 'USER_ROLE_CHANGED' | 'CUSTOMER_CREATED' | 'APPROVAL_APPROVED' | 'APPROVAL_REJECTED' | 'REPORT_GENERATED' | 'REPORT_DOWNLOADED'
  module        text NOT NULL      -- 'USERS' | 'CUSTOMERS' | 'APPROVALS' | 'REPORTS'
  actor_id      text NOT NULL REFERENCES users(id)
  target        text NOT NULL
  description   text
  previous_value text
  new_value     text
  created_at    timestamptz NOT NULL DEFAULT now()

report_jobs
  id             text PK           -- "job_xxx"
  report_type    text NOT NULL     -- 'CUSTOMER' | 'USER' | ...
  report_name    text NOT NULL
  status         text NOT NULL     -- 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress       int
  requested_by_id text NOT NULL REFERENCES users(id)   -- new column; not tracked at all today
  file_name      text
  file_path      text              -- or an object-storage key; see §12 risk about scope creep here
  error_message  text
  created_at     timestamptz NOT NULL DEFAULT now()
  completed_at   timestamptz

notifications
  id           text PK             -- "ntf_xxx"
  user_id      text NOT NULL REFERENCES users(id)   -- new column; does not exist today, see §3.3 #4
  type         text NOT NULL       -- 'APPROVAL' | 'REPORT' | 'SECURITY' | 'SYSTEM'
  title        text NOT NULL
  message      text NOT NULL
  action_type  text                -- 'DOWNLOAD_REPORT'
  metadata     jsonb
  is_read      boolean NOT NULL DEFAULT false
  created_at   timestamptz NOT NULL DEFAULT now()

notification_preferences
  user_id                text PK REFERENCES users(id)
  approval_requests      boolean NOT NULL DEFAULT true
  report_notifications   boolean NOT NULL DEFAULT true
  security_alerts        boolean NOT NULL DEFAULT true
  system_notifications   boolean NOT NULL DEFAULT false
```

**Decisions to make explicitly before writing migrations** (do not silently pick one):

1. **`id` strategy** — keep human-readable prefixed text ids (`cus_xxx`) to match existing seed data and every frontend mock, or move to `uuid`. Recommendation: **keep text ids** for Phase 1 (Customers/Users) since real seed data and all existing frontend code already assumes this exact format; revisit only if a real reason (e.g. an ORM that assumes UUID PKs) forces it.
2. **`approval_requests.approver_id`** — today the frontend has no real "approver," it fills a synthetic placeholder (`APPROVAL_REVIEWER_GROUP`, id `approval-reviewers`) because *any* Super Admin/Admin/Manager can act on any pending request. Two options: (a) leave `approver_id` nullable and keep resolving "who can act" at query/UI time via role, matching current behavior exactly — **recommended**, zero frontend change; or (b) assign a real approver at creation time (round-robin/least-busy), which is a **feature change**, not a migration, and should be scoped separately if wanted.
3. **Report file storage** — Postgres alone does not solve file storage. `file_path` above assumes local disk for simplicity in early phases; object storage (S3-compatible) is a later, separate infrastructure decision, not required to satisfy this document's scope.

No `roles`/`permissions` tables are proposed. Keeping RBAC's role→permission mapping in `rolePermissions.ts` (frontend) and mirrored manually in a backend constant (§9) is a deliberate choice — see §12 (do not turn this into a dynamic permission system unless asked).

---

## 6. Migration order, feature by feature

Numbered phases, each independently shippable and each preserving "the mock switch still works" as a hard exit criterion.

### Phase 0 — Contract & infra hygiene (no new features, fixes drift)
- Reconcile the error-envelope mismatch (§3.3 #1): pick `{ error: { message } }` (matches the backend's actual `errorHandler` already) and update `apiClient.ts` to surface it.
- Fix Reports' User Report to read from `usersApi`/`useUsers()` instead of `MOCK_USERS` (§3.3 #3) — independent, zero-risk, ships immediately.
- Retrofit `mockCustomersApi`/`mockUsersApi` so Customers/Users honor `useMockApi` like every other feature (§3.3 #2).
- Add PostgreSQL to `backend/` (driver + a migration tool — see §8) with **no behavior change yet**: stand up the DB, run health checks, but keep repositories in-memory until Phase 1.

### Phase 1 — Persist what's already real: Customers, Users
- Swap `customerRepository.ts` / `userRepository.ts` from in-memory arrays to real SQL queries against the new tables. **Controllers/services/routes do not change** — only the repository implementation, which is exactly why that layer exists.
- Add `website`/`password_hash` columns to `users` now (Profile page and future auth need them) even though nothing writes to `password_hash` yet.
- Seed the DB with the same records currently hardcoded in the in-memory repos, so behavior is visually identical.
- **This phase touches zero frontend code.** It's the safest possible proof that the DB plumbing works.

### Phase 2 — Real authentication
- Add `authRoutes`/`authService` (login, logout, "who am I") backed by the now-real `users` table.
- Replace `AuthProvider`'s `localStorage`-only mock login with real calls **behind the exact same `AuthContextValue` interface** (`user`, `can`, `logout`, `updateProfile`, plus new `login`) so `useAuth()` consumers (every page) don't change.
- `updateProfile` moves from a `localStorage` overlay to a real `PATCH /api/users/me` (or reuse `PUT /api/users/:id`).
- This is the **hard prerequisite** for everything below — Approvals/Audit/Reports/Notifications all need a real, server-known "current user."

### Phase 3 — Approvals
- Implement the backend using the contract in §3.2/§4, resolve the `approver_id` decision (§5.2).
- Flip `VITE_USE_MOCK_API=false` for this feature (or per-feature flag if that granularity is added, see §12) — `realApprovalsApi` already exists and matches the contract; verify it against the real backend and adjust only where the contract needed extension (the `POST /api/approvals` create endpoint the original doc omitted).

### Phase 4 — Audit & Activity
- Implement the backend audit table/service.
- **Deliberately change the write path**: instead of (or in addition to) the frontend's `auditService.log()` POSTing arbitrary payloads, the backend's User/Customer/Approval services write their own audit rows when they perform real mutations (§3.3 #5). Keep `auditService.log()` as a thin client-side convenience for any UI-only event that has no natural backend hook, but audit-worthy backend mutations should be authoritative from the server.
- This phase is intentionally *after* Users/Customers/Approvals are real — auditing mock data isn't meaningful.

### Phase 5 — Reports
- Move the existing `xlsx` generation logic (already written, in `features/reports/utils/generate*Excel.ts`) into a backend service that runs on `POST /api/reports`.
- Start **synchronous** generation server-side (simplest real implementation preserving today's UX) before considering the queue/worker/object-storage architecture sketched in `REPORTING_REQUIREMENTS.md` §27 — that's explicitly a stretch goal, not required to "go real."
- Wire `realReportsApi` (already coded, including the binary-download special case) against it.

### Phase 6 — Notifications
- Add the `user_id` column/scoping (§3.3 #4) as part of building this, not after.
- Prefer server-side notification creation triggered by the now-real Approval/Report services, rather than the frontend calling `notificationsApi.create()` post-hoc (§3.3 #6) — same reasoning as Audit.

### Cross-cutting, from Phase 2 onward
- Every new backend route must enforce permissions server-side (§9) — this is not a phase, it's a standing requirement applied to Phases 2–6.

---

## 7. Dependencies between features

```
Users, Customers  (already real — no dependencies)
        │
        ▼
   Real Auth (Phase 2)
        │
   ┌────┼─────────────┬───────────────┐
   ▼    ▼             ▼               ▼
Approvals          Reports       Notifications
   │                  │               ▲
   └──────────┬────────┘               │
              ▼                        │
           Audit  ───────── (Approval/Report events can notify) 
```

- **Auth blocks everything else.** Approvals need a real `requestedBy`; Audit needs a real `actor`; Reports need a real requester; Notifications need a real recipient. None of these can be meaningfully "real" against mock users.
- **Audit depends on** Users, Customers, and Approvals being real first (nothing worth auditing otherwise) — see the 7 seed action types, all of which are mutations on those three features.
- **Reports' Customer Report** already depends on Customers (satisfied). **Reports' User Report** should depend on Users via `usersApi`, not `MOCK_USERS` (Phase 0 fix, independent of the DB work).
- **Notifications** naturally depends on Approvals/Reports if server-side notification creation (§3.3 #6, Phase 6) is adopted, since those are the events worth notifying about.
- **RBAC permission enforcement** (§9) is a horizontal dependency of every phase from 2 onward, not a feature with its own phase.

---

## 8. Changes required in frontend, backend, and database

### Frontend
- `lib/apiClient.ts` — read the real error message out of the response body (Phase 0).
- `features/customers/api/customersApi.ts`, `features/users/api/usersApi.ts` — add mock variants + `useMockApi` gating (Phase 0).
- `features/reports/utils/generateUserReportExcel.ts` — read from `useUsers()`/`usersApi` instead of `MOCK_USERS` (Phase 0).
- `components/common/AuthProvider.tsx` — replace the `localStorage`-only implementation with real `login`/session calls behind the same `AuthContextValue` shape (Phase 2). `ProtectedRoute`, `useAuth`, and every page consuming `can()`/`user` need **no changes**.
- Per feature in Phases 3–6: no component/hook changes are expected — only flipping `VITE_USE_MOCK_API` (or a future per-feature flag, §12) and validating the already-written `realXApi` implementation against the real backend, patching only where the contract needed a small extension (e.g. the create-approval endpoint, the report-jobs-list endpoint — both already flagged inline in the source as extensions beyond the original docs).
- `features/notifications/types.ts` — add `userId` (Phase 6); this is the one place a type shape genuinely needs to grow, not just a repository swap.

### Backend
- Add `pg` (or a thin query builder — see §12 on not over-choosing tooling) + a migration tool.
- Add `db/` (or similar) for the connection pool + migrations, following the existing `config/` conventions (`env.ts`-style typed config for `DATABASE_URL`).
- Swap `customerRepository.ts`/`userRepository.ts` to SQL (Phase 1).
- Add `authRoutes/Controller/Service` + password hashing + session/JWT issuance (Phase 2).
- Add Approval/Audit/Report/Notification routes/controllers/services/repositories/models, each mirroring the existing Customer module's shape exactly (Phases 3–6).
- Add auth + permission-check middleware, applied from Phase 2 onward (§9).
- Tighten `cors()` to an explicit allowlist once anything leaves `localhost`.

### Database
- Stand up PostgreSQL (local: docker-compose; see §12 on not overreaching into managed-cloud specifics here).
- Migrations for `users`, `customers` (Phase 1); `approval_requests` (Phase 3); `audit_logs` (Phase 4); `report_jobs` (Phase 5); `notifications`, `notification_preferences` (Phase 6). Schema per §5.

---

## 9. Authentication and authorization considerations

- **Today:** authentication is a UI convenience (pick a role, persisted in `localStorage`). Authorization (`can()`, `ProtectedRoute`, nav filtering) is 100% client-side and, by the existing `loginRequirement.md`'s own words, *"frontend authorization must never be considered sufficient security by itself"* — and today nothing enforces it server-side at all. This is the most important gap to close, not the most complex.
- **Session strategy:** prefer an httpOnly, `SameSite` cookie–based session (or short-lived JWT in an httpOnly cookie) over `localStorage` for the real implementation — `localStorage` is fine for a mock-only prototype but is XSS-exposed for anything real. This is a change in *mechanism*, not in the `AuthContextValue` interface the rest of the app depends on.
- **Where role data lives:** the backend returns `role` on login (and on `GET /api/users/me`); the frontend keeps using its existing `rolePermissions.ts` to derive permissions client-side for UX (nav, buttons). The backend independently re-derives the same permission check per request using its own mirror of that mapping (see below) — the two are not the same code, so they can drift; treat `rolePermissions.ts` as the frontend's copy and add an equivalent backend constant, reviewed together whenever either changes. Introducing a shared package to guarantee they never drift is explicitly **out of scope** unless asked (see §12).
- **Route-level enforcement:** every backend route added from Phase 2 onward should run through a `requirePermission('X')` middleware analogous to `ProtectedRoute`, using the same permission string constants conceptually (`APPROVAL_APPROVE`, `AUDIT_VIEW`, etc.) so the two systems stay legible against each other even though they're separately maintained.
- **Approval-eligible reviewers:** since "any Super Admin/Admin/Manager can act on any pending approval" is already the frontend's model (no per-request assignment), the backend's approve/reject endpoints should check *role*, not a specific `approver_id` match — consistent with §5's recommendation to leave `approver_id` nullable/informational.
- **Scope explicitly out for this migration:** SSO, OAuth, MFA, password reset flows, rate limiting, refresh-token rotation. Start with the simplest real credential check that is a drop-in replacement for "click a role button," and layer real-world auth hardening later as its own effort.

---

## 10. Preserving the mock API switch

This is the single most important invariant to protect through every phase:

- `VITE_USE_MOCK_API` → `appConfig.features.useMockApi` must continue to work for **every** feature, including Customers/Users once Phase 0 retrofits them. A developer with no backend/DB running must still be able to `npm run dev` the frontend and get a fully functional app.
- Each feature's `xApi.ts` file keeps its current three-part shape unchanged: `mockXApi` (in-memory, seeded, latency-simulated) / `realXApi` (thin `apiClient` calls matching the contract) / `export const xApi = appConfig.features.useMockApi ? mockXApi : realXApi`. Migrating a feature to a real backend means **making `realXApi` correct**, never deleting `mockXApi`.
- Do **not** collapse this into a single global flag flip being the only lever if finer control turns out to be useful (e.g. real Customers/Users but still-mock Approvals during Phase 2–3) — `appConfig.features` already has room to grow into **per-feature** mock flags (`VITE_USE_MOCK_APPROVALS_API`, etc.) if/when that's actually needed; don't build that until a real need for mixed mode shows up mid-migration (it likely will, since phases land one at a time while `VITE_USE_MOCK_API` is currently all-or-nothing).
- CI/tests should run the mock-mode build/lint/typecheck path unconditionally (it already requires no external services) and add a **separate** real-mode pipeline once a phase's backend work lands (§11), rather than ever making the mock path a second-class citizen.

---

## 11. E2E verification strategy

**Current state:** there is no test framework anywhere in the repo today (`frontend/package.json` and `backend/package.json` both have zero test tooling/scripts). This has to be introduced, not just "used."

Recommended approach, scoped to fit this repo's actual tooling (Vite + Express, no monorepo test runner yet):

1. **Add Playwright** at the repo root (or under `frontend/`) — it's the natural fit for a Vite-built React SPA, can drive a `vite preview` build, and can be pointed at either mock mode or a real backend via env var, without needing separate test code paths.
2. **Two run configurations, same test suite where possible:**
   - *Mock mode*: `VITE_USE_MOCK_API=true`, no backend/DB needed — this is what CI runs on every PR, fast and hermetic.
   - *Real mode*: spin up Postgres + backend (docker-compose) + frontend built with `VITE_USE_MOCK_API=false`, pointed at it — run on a schedule or on backend/DB-touching PRs, to catch contract drift the mock can't.
   - The point of running (where possible) the *same* Playwright specs against both is proving the architecture's central promise: **the UI must behave identically regardless of which mode is active.** A spec that only passes in one mode is a signal something leaked the implementation detail into the UI.
3. **Per-phase acceptance checklist** — every requirements doc in this repo already ends with a "Definition of Done" checklist (`APPROVAL_REQUIREMENTS.md` §30, `NOTIFICATION_REQUIREMENTS.md` §24, `REPORTING_REQUIREMENTS.md` §32). Continue that convention for each migration phase in this document: a short DoD list (e.g. "Phase 3 done when: `POST /api/approvals` persists to Postgres; approve/reject enforce role server-side; `apr_*` ids survive a backend restart; mock mode still works untouched; existing Approvals Playwright spec passes in both modes").
4. **Backend integration tests** (lighter-weight than E2E, faster feedback) — once Postgres is real, add a minimal `supertest`-style suite per route module (`customerRoutes`, then each new one), run against a disposable test database, verifying the exact response shapes documented in §3.2/§4.
5. **Contract regression guard** — since `docs/API_CONTRACT.html` already exists as documentation, keep it updated alongside each phase and consider a cheap smoke check (even a script asserting the documented example responses still round-trip) so documentation drift (§3.3 #1 already happened once) doesn't silently recur.

---

## 12. Risks and things that should NOT be changed unnecessarily

- **Do not replace the `mockXApi`/`realXApi` + `useMockApi` pattern.** It already does exactly what this migration needs. Extend it (per-feature flags if needed, retrofit onto Customers/Users) — don't introduce a different abstraction (e.g. MSW, a generic adapter layer) to solve the same problem a second way.
- **Do not restructure the feature-folder convention** (`types.ts` / `api/xApi.ts` / `hooks/` / `components/`) to accommodate the backend. Every new backend-conscious change should fit the existing mold, exactly as Audit and the Approval "request" flow already did earlier this project.
- **Do not touch `ApprovalRequest`'s public shape** (`approver: UserReference` etc.) even when `approver_id` becomes real/nullable in Postgres — keep the API response shape identical so `ApprovalTable`/`ApprovalDetailsDialog` need zero changes. Resolve the "who can approve" question server-side (role check), not by reshaping the response.
- **Do not remove the mock implementations once a feature "goes real."** They remain the offline/demo/CI-fast-path mode indefinitely — this is explicit in every one of this repo's own requirements docs ("React components must not require modification when the mock API is replaced by the real backend API").
- **Do not build a dynamic, DB-backed permission system.** `rolePermissions.ts` stays a static, versioned frontend file; the backend gets an equivalent static mirror (§9). Turning RBAC into data (role/permission tables, an admin UI to edit them) is a real, larger feature — explicitly not part of this migration.
- **Do not let audit logging become a hard dependency.** `auditService.log()` already swallows its own errors today (fire-and-forget) so a broken audit write never blocks the primary action (approving a request, creating a user). Preserve that resilience when the write path moves server-side (Phase 4) — a failed audit insert should log and move on, not roll back or fail the parent request.
- **Do not prematurely build the Reports queue/worker/object-storage architecture** sketched in `REPORTING_REQUIREMENTS.md` §27. Phase 5 above deliberately scopes to "synchronous generation on the real backend" first — the async architecture is a legitimate future step, not a prerequisite for "Reports is real."
- **Do not ship the current `cors()` (wide open) or unauthenticated routes past `localhost`.** Harmless today because nothing is deployed; becomes a real vulnerability the moment a shared environment exists. Tie this explicitly to Phase 2, not an afterthought.
- **Watch for silent double-sources-of-truth**, the same class of bug as the Reports/`MOCK_USERS` gap (§3.3 #3) — as each feature goes real, grep for any other place still importing the old mock arrays directly (`MOCK_USERS`, `MOCK_APPROVALS`, etc.) instead of going through the feature's `xApi`/hook, and fix those alongside the phase that makes that data real.
- **Don't over-select backend tooling this document didn't ask for.** An ORM/query-builder choice (Prisma, Drizzle, Knex, or raw `pg`), a migration tool, and a hosting/deployment story for Postgres are all real decisions but are implementation details of Phase 0/1, not something this roadmap should lock in prematurely — pick the lightest tool that fits the existing backend's plain, dependency-light style (it currently has exactly 3 runtime dependencies: `express`, `cors`, `dotenv`) when Phase 0 actually starts.
