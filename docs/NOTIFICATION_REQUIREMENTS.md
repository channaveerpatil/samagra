# Notification Center Feature Requirements

## Objective

Implement a small but production oriented Notification Center feature in the existing frontend.

This is a FRONTEND ONLY implementation for now.

Do NOT implement backend APIs, authentication, PostgreSQL, or any database.

The implementation must use mock data while keeping the API layer ready to be replaced by a real backend later.

The goal is to demonstrate:

React
TanStack Query
Mock API
API abstraction
Feature Flag
Reusable components
Read and Unread state
Clean architecture

---

## 1. Existing Application

First inspect the existing frontend architecture.

Do not rewrite or restructure the existing application unnecessarily.

Follow the existing project conventions.

The application already has:

React
TypeScript
Vite
TanStack Query
Authentication and RBAC
Header
Sidebar
Feature flag patterns

Reuse existing components, hooks, utilities, styling conventions, and architecture wherever appropriate.

Do not introduce a new state management library.

---

## 2. Feature Flag

Add a feature flag:

VITE_FEATURE_NOTIFICATIONS=true

When enabled:

Show the Notification Bell in the application header.

When disabled:

The Notification Bell and Notification Center must not be rendered.

Do not scatter feature flag checks throughout components.

Create a clean feature flag abstraction if one does not already exist.

---

## 3. Notification Data Model

Create a strongly typed Notification model.

Example:

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

Notification types:

APPROVAL
REPORT
SECURITY
SYSTEM

Use TypeScript types.

Do not use `any`.

---

## 4. Mock Data

Create realistic mock notifications.

Include at least:

1. Approval notification

"Purchase request requires your approval"

2. Report notification

"Monthly report is ready"

3. Security notification

"User permissions were updated"

4. System notification

"Scheduled maintenance completed"

Include both read and unread notifications.

Use realistic timestamps.

Keep mock data separate from UI components.

Do not place mock arrays directly inside React components.

---

## 5. API Abstraction

Create a notification API abstraction.

The component must NOT directly access mock data.

Use this architecture:

Component
    ↓
TanStack Query Hook
    ↓
Notification API
    ↓
Mock API implementation

For example:

useNotifications()

The hook should internally call something like:

getNotifications()

Do not make the component aware that the data is currently mocked.

---

## 6. Future Backend Contract

Design the API abstraction so the mock implementation can later be replaced with HTTP calls.

Future API contract:

GET /api/notifications

GET /api/notifications/:id

PATCH /api/notifications/:id/read

POST /api/notifications/read-all

GET /api/notification-preferences

PATCH /api/notification-preferences

Do NOT implement these backend endpoints now.

Only prepare the frontend API abstraction.

The future backend implementation should be replaceable without changing the React components.

---

## 7. TanStack Query

Use TanStack Query for server state.

Create appropriate hooks such as:

useNotifications()

useMarkNotificationRead()

useMarkAllNotificationsRead()

Do not use useState as the primary source of truth for notification data.

Use appropriate query keys.

Example:

['notifications']

Keep query and mutation logic outside the UI components.

---

## 8. Header Notification Bell

Add a reusable NotificationBell component to the existing header.

Example:

🔔 3

The number represents unread notifications.

Do not hardcode the number.

Calculate it from the notification data.

When there are no unread notifications:

Show the bell without an unread count.

---

## 9. Notification Dropdown

Clicking the notification bell should open a dropdown/popover.

The dropdown should contain:

Header:

Notifications

Actions:

Mark all as read

Notification list

Each notification should show:

Type
Title
Message
Relative timestamp
Read or unread state

Example:

Notifications

3 unread

Approval
Purchase request requires your approval
5 minutes ago

Report
Monthly report is ready
20 minutes ago

Security
User permissions were updated
1 hour ago

---

## 10. Read and Unread Behavior

Unread notifications must be visually distinguishable.

When a user clicks an unread notification:

Call the appropriate mutation:

markNotificationAsRead()

After success:

The notification becomes read.

The unread count updates automatically.

Do not manually duplicate notification state in multiple components.

Use TanStack Query cache updates or invalidation appropriately.

---

## 11. Mark All as Read

Add:

Mark all as read

When clicked:

All unread notifications should become read.

The notification badge should immediately update.

The dropdown should reflect the new state.

Handle the empty state appropriately.

---

## 12. Empty State

When there are no notifications:

Show:

"No notifications"

When there are notifications but all are read:

Show:

"You're all caught up"

Keep the empty state visually consistent with the existing application.

---

## 13. Notification Preferences

Create a small Notification Preferences section.

It can be accessible from the notification dropdown or an appropriate Settings area.

Preferences:

Approval requests
Report notifications
Security alerts
System notifications

Example:

☑ Approval requests
☑ Report notifications
☑ Security alerts
☐ System notifications

For this phase, preferences can use mock data.

Do not implement backend persistence.

Keep the API abstraction ready for:

GET /api/notification-preferences

PATCH /api/notification-preferences

---

## 14. Component Structure

Follow the existing frontend architecture.

A possible structure:

src/
├── features/
│   └── notifications/
│       ├── components/
│       │   ├── NotificationBell.tsx
│       │   ├── NotificationDropdown.tsx
│       │   ├── NotificationItem.tsx
│       │   └── NotificationEmptyState.tsx
│       │
│       ├── hooks/
│       │   ├── useNotifications.ts
│       │   └── useNotificationPreferences.ts
│       │
│       ├── api/
│       │   └── notificationsApi.ts
│       │
│       ├── mocks/
│       │   └── notificationMocks.ts
│       │
│       └── types/
│           └── notification.ts

Adapt this structure to the existing project conventions rather than blindly creating duplicate architectural layers.

---

## 15. Styling

Follow the existing styling architecture.

Do not introduce inline styles.

Do not introduce a new CSS framework.

Reuse existing design system components where available.

The Notification Center should visually match the existing application.

Do not redesign the entire header.

Only add the required notification functionality.

---

## 16. Loading State

Handle the loading state gracefully.

Example:

Loading notifications...

Do not make the application appear broken while notification data is loading.

---

## 17. Error State

Handle mock API errors gracefully.

Show an appropriate error state.

Do not expose technical error details to the user.

Use existing application error handling patterns where available.

---

## 18. Accessibility

The Notification Bell must be keyboard accessible.

Provide an appropriate accessible label.

The dropdown must be usable with keyboard navigation where supported by the existing UI component library.

Do not rely only on color to distinguish read and unread notifications.

---

## 19. Responsive Behavior

The notification dropdown should work on:

Desktop
Tablet
Mobile

Do not redesign the entire responsive layout.

Only ensure the notification component behaves correctly within the existing header.

---

## 20. Testing

At minimum verify:

Notification list loads.

Unread count is correct.

Notification dropdown opens.

Notification dropdown closes.

Unread notification can be marked as read.

Unread count decreases correctly.

Mark all as read works.

Empty state works.

Feature flag ON displays the notification bell.

Feature flag OFF hides the notification bell.

Existing RBAC functionality continues to work.

Existing application functionality is not broken.

---

## 21. Build Verification

Run:

npm run build

npm run lint

Run the existing test suite if available.

Fix all TypeScript and lint errors introduced by this feature.

Do not leave warnings or errors without explanation.

---

## 22. Important Constraints

Do NOT:

Create backend APIs.

Add PostgreSQL.

Add Prisma.

Add authentication.

Modify existing RBAC architecture.

Introduce Redux or another state management library.

Introduce unnecessary dependencies.

Rewrite the existing header.

Rewrite the existing application architecture.

Put mock data directly inside components.

Couple React components directly to mock data.

Use `any`.

Overengineer the feature.

---

## 23. Architecture Goal

The final architecture should look like:

Frontend Component
        ↓
TanStack Query Hook
        ↓
Notification API
        ↓
Mock Implementation

Later this must be replaceable with:

Frontend Component
        ↓
TanStack Query Hook
        ↓
Notification API
        ↓
HTTP Client
        ↓
Backend API
        ↓
Service
        ↓
Repository
        ↓
PostgreSQL

The React components should not need to change when the mock API is replaced with the real backend.

---

## 24. Definition of Done

The feature is complete when:

Notification Bell exists in the header.

Feature flag controls its visibility.

Notification data comes from mock API abstraction.

TanStack Query manages notification server state.

Unread count is dynamic.

Notification dropdown works.

Read and unread behavior works.

Mark all as read works.

Empty state works.

Notification preferences UI exists.

No backend dependency exists.

Existing RBAC remains functional.

TypeScript build passes.

ESLint passes.

The implementation follows the existing project architecture.

---

## 25. Final Implementation Report

After completing the implementation, provide:

1. Files created
2. Files modified
3. Architecture implemented
4. TanStack Query hooks created
5. API abstraction created
6. Feature flag implementation
7. Mock data implementation
8. Verification performed
9. Any limitations
10. Recommended next feature

Do not implement anything outside this requirement.



Branding 

Reuse the visual language across your other demo screens — the ink-navy + marigold palette, Fraunces/IBM Plex type pairing, and the hexagonal "module assembly" motif from the pricing page could carry over into your actual dashboard (replacing the generic "Starter Kit" template look we talked about). That would make the pricing page and the product feel like one coherent brand instead of two different things.
Turn the hex assembly graphic into a small logo mark — it's distinctive enough to work as a favicon/app icon, not just a hero graphic.
Send the pricing page link directly to leads before a demo — since it's polished, it sets expectations up front and lets them come to the call already primed on tiers, rather than you walking through pricing live.

