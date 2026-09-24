# 🚀 Enterprise React Starter Kit

A scalable, production ready React + Vite + TypeScript starter kit designed for enterprise applications.

## Vision

Build a reusable enterprise foundation that can be cloned and used to rapidly develop new business applications.

**Technology Stack**

- React
- Vite
- TypeScript
- React Router
- Enterprise Architecture

---

# Milestone 1. Foundation

## Goal

Create a clean, scalable project foundation.

### Deliverables

- React + Vite + TypeScript
- Folder structure
- React Router
- Responsive Layout
  - Header
  - Sidebar
  - Footer
  - Content Area
- Breadcrumbs
- Dashboard Landing Page
- Theme Support
- Common UI Components
- 404 Page
- Environment Configuration
- Path Aliases
- ESLint
- Prettier

### Out of Scope

- Authentication
- RBAC
- Feature Flags
- CRUD
- API Integration
- State Management

### Exit Criteria

A clean, production ready application shell that can be reused across projects.

---

# Milestone 2. Enterprise Core

## Goal

Build the reusable enterprise framework.

### Deliverables

## Authentication

- Login
- Logout
- Protected Routes
- Session Management

## Authorization

- RBAC
- Roles
- Permissions
- Permission Guards
- Role Based Navigation

## Feature Flags

- Environment Based Flags
- Feature Service
- Feature Guards

## Configuration

- Typed Config
- Environment Loader

## API

- Axios Client
- Request Interceptors
- Response Interceptors
- Error Handling

## Logging

- Logger Service
- Error Boundary

### File Map (Milestone 2 — Core Infrastructure)

Where each deliverable lives when implemented. Business/feature code must go through these, never around them.

| Deliverable              | Location                                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| Configuration Management | `src/config/env.ts`, `src/config/app.config.ts`, `.env.example`                                           |
| API Client               | `src/core/api/http-client.ts`, `src/core/api/api-error.ts`, `src/types/api.types.ts`                      |
| Logger Service           | `src/core/logger/logger.ts`                                                                               |
| Constants                | `src/constants/routes.constants.ts`, `storage.constants.ts`, `api.constants.ts`                           |
| Utility Functions        | `src/utils/date.utils.ts`, `string.utils.ts`, `number.utils.ts`, `object.utils.ts`, `validation.utils.ts` |
| Custom Hooks             | `src/hooks/useLocalStorage.ts`, `useDebounce.ts`, `useMediaQuery.ts`, `useThemeMode.ts`                   |
| Error Handling           | `src/components/common/ErrorBoundary.tsx`                                                                 |
| Notification Service     | `src/core/notifications/notifications.types.ts`, `NotificationsProvider.tsx`, `useNotifications.ts`       |

`src/core/auth/`, `src/core/rbac/`, `src/core/feature-flags/` are intentionally not created yet — they land when Authentication/RBAC/Feature Flags are actually implemented later in this milestone, not as empty placeholders now.

### Exit Criteria

The application supports enterprise authentication, authorization and centralized API communication.

---

# Milestone 3. CRUD Framework

## Goal

Develop reusable CRUD components.

### Deliverables

## Generic Table

- Pagination
- Sorting
- Filtering
- Search
- Export
- Row Selection
- Bulk Actions

## Forms

- Text Input
- Dropdown
- Checkbox
- Radio
- Date Picker
- Validation

## Dialogs

- Confirmation
- Delete
- Success
- Error

## Notifications

- Toast
- Alerts

## Generic Services

- CRUD Base Service
- Audit Information

### Exit Criteria

New business modules can be created with minimal boilerplate.

---

# Milestone 4. Advanced Features

## Goal

Improve developer productivity and user experience.

### Deliverables

- Dashboard Widgets
- Charts
- Global Search
- File Upload
- Theme Switch
- User Preferences
- Internationalization
- Utility Hooks
- Common Helpers
- TanStack Query
- Zustand
- Mock API Support

### Exit Criteria

The starter kit supports most enterprise application requirements.

---

# Milestone 5. Production Ready

## Goal

Prepare the platform for long term enterprise use.

### Deliverables

## Testing

- Unit Tests
- Component Tests
- Integration Tests

## Performance

- Lazy Loading
- Code Splitting
- Bundle Optimization

## Security

- Secure Routing
- Permission Validation
- Environment Validation

## Documentation

- Setup Guide
- Folder Structure
- Coding Standards
- Architecture Guide

## Sample Modules

- Dashboard
- Users
- Roles
- Products
- Settings

### Exit Criteria

The project is production ready and reusable for multiple enterprise applications.

---

# Architecture

```
src
│
├── app
├── assets
├── components
├── config              (Milestone 2 — env + typed app config)
├── constants           (Milestone 2 — routes, storage keys, api placeholders)
├── core
│   ├── api              (Milestone 2 — axios client)
│   ├── auth             (Milestone 3 — not created yet)
│   ├── feature-flags    (Milestone 3 — not created yet)
│   ├── logger           (Milestone 2 — logging service)
│   ├── notifications    (Milestone 2 — wraps MUI Snackbar)
│   ├── rbac             (Milestone 3 — not created yet)
│   └── routing
│
├── hooks               (Milestone 2 — useLocalStorage, useDebounce, useMediaQuery, useThemeMode)
├── layouts
├── modules
├── services
├── shared
├── styles
├── types                (Milestone 2 — shared API types)
├── utils                (Milestone 2 — date/string/number/object/validation helpers)
└── main.tsx
```

---

# Development Principles

- Keep business logic separate from UI.
- Keep modules independent.
- Prefer composition over duplication.
- Build reusable components.
- Avoid unnecessary dependencies.
- Use TypeScript throughout.
- Write clean, readable code.
- Follow a consistent folder structure.
- Keep features modular.
- Optimize for long term maintainability.

---

# Project Goal

This is **not** an admin template.

This is an **Enterprise React Starter Kit** that provides a reusable foundation for building scalable business applications.

Implementation order (one deliverable at a time)
Configuration — config/env.ts (typed ImportMetaEnv augmentation + validated reads) + config/app.config.ts (typed appConfig object: name, environment, apiBaseUrl, version, feature placeholder). Add .env.example.
Constants — constants/routes.constants.ts, constants/storage.constants.ts, constants/api.constants.ts.
Logger — core/logger/logger.ts: Logger interface + console-backed singleton, swappable later.
Utils — utils/date.utils.ts, string.utils.ts, number.utils.ts, object.utils.ts, validation.utils.ts (all pure, dependency-free, using Intl for formatting rather than pulling in dayjs).
Hooks — hooks/useLocalStorage.ts, useDebounce.ts, useMediaQuery.ts (matchMedia-based, no MUI dependency), useThemeMode.ts (wraps MUI's useColorScheme); then the two small refactors of ThemeSwitcher.tsx/Sidebar.tsx/MainLayout.tsx to consume them.
API client — core/api/http-client.ts (single Axios instance, config-driven baseURL/timeout, request/response interceptors, typed get/post/put/patch/del helpers), core/api/api-error.ts (normalized error shape), types/api.types.ts. No real endpoints called.
Error boundary — components/common/ErrorBoundary.tsx (class component, friendly fallback UI styled via theme, logs via the logger service), wired into app/App.tsx.
Notification service — core/notifications/notifications.types.ts, NotificationsProvider.tsx (owns MUI Snackbar/Alert internally), useNotifications.ts (success/error/warning/info), wired into app/App.tsx.
