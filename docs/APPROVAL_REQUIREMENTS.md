# Approval Workflow Requirements

## 1. Objective

Implement a frontend only Approval Workflow feature in the existing application.

This is Phase 1 of the Approval capability.

The feature must use mock data and TanStack Query, following the same architecture already established by the Customers and Notifications features.

Do NOT implement backend APIs, PostgreSQL, Prisma, authentication, or a real workflow engine.

The purpose of this phase is to establish:

1. Approval UI
2. Approval domain model
3. Mock API
4. TanStack Query integration
5. API abstraction
6. Feature flag
7. Approve and Reject actions
8. Architecture ready for future backend integration

The feature should be designed so that the mock implementation can later be replaced by a real backend without changing the React components.

---

# 2. Existing Architecture

Before making changes, inspect the existing frontend.

The application already contains:

1. React
2. TypeScript
3. Vite
4. TanStack Query
5. RBAC
6. Customers feature
7. Notification Center
8. Feature flag infrastructure
9. API abstraction
10. Mock API implementations

Follow the existing architecture.

Do not introduce a new architectural pattern for Approvals.

The Approval feature should follow the same pattern already established by Notifications and Customers.

---

# 3. Feature Flag

Add:

VITE_FEATURE_APPROVALS=true

Expose it through the existing application configuration and feature flag abstraction.

Expected usage:

featureFlags.approvals

When enabled:

The Approval feature is visible.

When disabled:

The Approval feature must not be exposed through the application navigation.

Do not scatter feature flag checks throughout the feature.

---

# 4. Approval Domain Model

Create a strongly typed Approval model.

Example:

interface ApprovalRequest {
    id: string;
    title: string;
    description: string;
    type: ApprovalType;
    requestedBy: UserReference;
    approver: UserReference;
    amount?: number;
    status: ApprovalStatus;
    createdAt: string;
    updatedAt: string;
}

Approval types:

PURCHASE
ACCESS
CUSTOMER_CHANGE
PROJECT
OTHER

Approval statuses:

PENDING
APPROVED
REJECTED

Create appropriate TypeScript types.

Do not use any.

---

# 5. User Reference

Do not duplicate complete user objects inside Approval data.

Create a lightweight user reference.

Example:

interface UserReference {
    id: string;
    name: string;
}

Use this for:

requestedBy

approver

---

# 6. Mock Data

Create realistic approval requests.

Include at least:

1. Pending purchase approval
2. Pending access approval
3. Approved customer change
4. Rejected project request

Example:

Purchase Request

Title:
Laptop Purchase Request

Description:
Request for a development laptop.

Amount:
85000

Requested by:
John

Approver:
Sarah

Status:
PENDING

Create enough mock data to demonstrate filtering and different states.

Keep mock data outside React components.

---

# 7. API Abstraction

Create an Approval API interface.

Expected methods:

getApprovals()

getApproval(id)

approveApproval(id, comment?)

rejectApproval(id, comment?)

Future API contract:

GET /api/approvals

GET /api/approvals/:id

POST /api/approvals/:id/approve

POST /api/approvals/:id/reject

Do not implement backend endpoints.

The frontend API abstraction must hide whether the implementation is mock or real.

Expected architecture:

Component

↓

TanStack Query Hook

↓

Approvals API

↓

Mock API

Later:

Component

↓

TanStack Query Hook

↓

Approvals API

↓

HTTP API

↓

Backend

---

# 8. API Implementation

Create:

mockApprovalsApi

and

realApprovalsApi

The real API implementation should be a placeholder following the future API contract.

Do not make real network calls while mock API mode is enabled.

Reuse the application's existing API client.

Do not create another HTTP client.

---

# 9. API Switcher

Create or extend the existing API switcher pattern.

The implementation should use the existing:

appConfig.features.useMockApi

or the application's established equivalent.

Do not introduce another mock API configuration mechanism.

Expected:

approvalsApi

↓

mockApprovalsApi OR realApprovalsApi

Components should import only:

approvalsApi

They must never import:

mockApprovalsApi

directly.

---

# 10. TanStack Query

Create hooks such as:

useApprovals()

useApproval(id)

useApproveApproval()

useRejectApproval()

Use TanStack Query for server state.

Recommended query keys:

['approvals', 'list']

['approvals', 'detail', id]

Keep query and mutation logic outside React presentation components.

---

# 11. Approval Navigation

Add an Approval entry to the existing application navigation.

Example:

Approvals

The navigation item must respect:

1. Feature flag
2. Existing RBAC permission mechanism

Do not create a separate authorization system.

For now use an appropriate existing permission or introduce:

APPROVAL_VIEW

only if necessary and consistent with the existing RBAC architecture.

If a new permission is introduced, ensure it follows the existing permission definitions and does not break current users.

---

# 12. Approval List Page

Create:

ApprovalsPage

The page should display approval requests.

Recommended columns:

Request

Type

Requested By

Approver

Amount

Status

Created

Actions

Example:

| Request | Type | Requested By | Approver | Amount | Status |
|---------|------|--------------|----------|--------|--------|
| Laptop Purchase | Purchase | John | Sarah | ₹85,000 | Pending |
| Database Access | Access | Mike | Sarah | | Pending |
| Customer Change | Customer | John | Sarah | | Approved |

Use existing table components if available.

Do not introduce a new table library.

---

# 13. Status Display

Use clear visual status indicators.

Pending

Approved

Rejected

Do not rely only on color.

Status should also contain readable text.

Follow the existing design system.

---

# 14. Filtering

Add simple filters.

Minimum:

Status

Type

The following statuses must be supported:

All

Pending

Approved

Rejected

The following types must be supported:

All

Purchase

Access

Customer Change

Project

Other

Filtering should be performed through the existing query or derived UI state appropriately.

Do not add unnecessary advanced filtering.

---

# 15. Approval Details

Clicking an approval request should open a details view.

This can be:

A separate route

or

A drawer/dialog

Choose whichever matches the existing application patterns.

Display:

Title

Description

Type

Requested By

Approver

Amount

Status

Created Date

Updated Date

---

# 16. Approve Action

For a PENDING approval:

Show:

Approve

When clicked:

Call:

approveApproval(id)

The mutation should update the approval status to:

APPROVED

The UI should refresh using TanStack Query.

Do not maintain a second manually synchronized approval state.

---

# 17. Reject Action

For a PENDING approval:

Show:

Reject

When clicked:

rejectApproval(id)

The user should be given an opportunity to enter an optional rejection comment.

Example:

Reason for rejection:

Budget is not available this quarter.

After rejection:

Status becomes:

REJECTED

The UI should update using TanStack Query.

---

# 18. Approval Comment

Support an optional comment for Approve and Reject actions.

Example:

Approved:

"Approved for this quarter."

Rejected:

"Budget is not available."

Add a comment field to the action dialog.

Do not build a full comments system yet.

This is only a simple approval decision comment.

---

# 19. Permission Behavior

Approval actions must respect the existing authorization mechanism.

Only users with the appropriate permission should be able to approve or reject.

Do not use:

if role === 'SUPER_ADMIN'

Do not hardcode roles inside Approval components.

Use the existing permission based authorization mechanism.

For example:

can('APPROVAL_APPROVE')

and

can('APPROVAL_REJECT')

Only introduce these permissions if they fit the existing RBAC design.

---

# 20. Notification Integration

Integrate the existing Notification Center where appropriate.

When an approval is approved or rejected:

Create a mock notification event using the existing notification architecture.

Example:

Approval approved:

"Your Laptop Purchase Request was approved."

Approval rejected:

"Your Database Access Request was rejected."

Do not directly modify notification component state.

Use the existing notification API abstraction.

The goal is to demonstrate that Approval and Notification are independent platform capabilities that can communicate through a defined abstraction.

If direct event integration would require significant architectural changes, keep the integration minimal and document the limitation.

Do not overengineer an event bus in this phase.

---

# 21. Loading State

Handle:

Approval list loading

Approval details loading

Approval mutation loading

Use the application's existing loading patterns.

Disable Approve and Reject actions while the corresponding mutation is running.

---

# 22. Error Handling

Handle:

List loading failure

Details loading failure

Approve failure

Reject failure

Use existing application error handling patterns.

Do not expose technical errors directly to the user.

---

# 23. Empty State

When there are no approval requests:

Show:

No approval requests found.

When filters return no results:

Show:

No approvals match the selected filters.

Keep the empty state consistent with the existing application.

---

# 24. Responsive Behavior

The Approval page should work reasonably on:

Desktop

Tablet

Mobile

Do not redesign the existing application layout.

Use existing responsive patterns.

---

# 25. Accessibility

Approval actions must be keyboard accessible.

Dialogs must have appropriate labels.

Status must not rely only on color.

Buttons must have meaningful accessible labels.

Follow the accessibility patterns already used in the project.

---

# 26. Suggested Feature Structure

Follow the existing project conventions.

A possible structure:

src/features/approvals/

    types.ts

    api/
        approvalsApi.types.ts
        mockApprovals.ts
        mockApprovalsApi.ts
        realApprovalsApi.ts
        approvalsApi.ts
        queryKeys.ts

    hooks/
        useApprovals.ts
        useApproval.ts
        useApproveApproval.ts
        useRejectApproval.ts

    components/
        ApprovalTable.tsx
        ApprovalStatus.tsx
        ApprovalFilters.tsx
        ApprovalDetails.tsx
        ApprovalActionDialog.tsx
        ApprovalEmptyState.tsx

Adapt this structure to the existing application.

Do not blindly create files that duplicate existing patterns.

---

# 27. Styling

Use the existing styling system.

Do not introduce:

Inline CSS

New CSS framework

New component library

New design system

Reuse existing components and patterns.

The Approval feature should visually feel like part of the existing application.

---

# 28. Important Constraints

Do NOT implement:

Backend APIs

PostgreSQL

Prisma

MongoDB

Authentication

Real workflow engine

Multi-level approvals

Approval delegation

Escalation

Approval SLA

Scheduled approvals

Workflow designer

Dynamic rules engine

Email integration

External integrations

Do not overengineer this feature.

This is Approval V1.

---

# 29. Architecture Goal

The final frontend architecture should be:

Approval UI

↓

TanStack Query

↓

Approvals API

↓

Mock Approvals API

The future architecture should become:

Approval UI

↓

TanStack Query

↓

Approvals API

↓

HTTP Client

↓

Backend Approval Service

↓

Approval Repository

↓

PostgreSQL

React components must not require modification when the mock API is replaced by the real backend API.

---

# 30. Definition of Done

The feature is complete when:

Approval feature flag exists.

Approval navigation exists.

Approval list page exists.

Approval details exist.

Mock approval data exists.

TanStack Query integration exists.

Filtering works.

Pending status works.

Approve works.

Reject works.

Optional approval/rejection comments work.

Permission based action visibility works.

Notification integration is implemented using the existing notification abstraction where practical.

Loading states work.

Error states work.

Empty states work.

Existing RBAC continues to work.

Existing Customers functionality continues to work.

Existing Notifications functionality continues to work.

TypeScript build passes.

ESLint passes.

No backend dependency exists.

---

# 31. Verification

Run:

npm run build

npm run lint

Run the existing test suite if available.

Manually verify:

1. Approval feature enabled
2. Approval feature disabled
3. Approval list loads
4. Filters work
5. Approval details open
6. Pending approval can be approved
7. Pending approval can be rejected
8. Rejection comment works
9. Approval comment works
10. Approved request cannot be approved again
11. Rejected request cannot be rejected again
12. Permission restricted users cannot approve or reject
13. Notification integration works
14. Existing RBAC works
15. Existing Customers works
16. Existing Notification Center works

---

# 32. Final Implementation Report

After implementation provide:

1. Files created
2. Files modified
3. Architecture implemented
4. API contract
5. TanStack Query hooks
6. Mock data
7. Feature flag
8. RBAC permissions
9. Notification integration
10. Verification performed
11. Limitations
12. Recommended next step

Do not implement anything outside this requirement.