# RBAC Implementation Requirements

## 1. Objective

Implement a simple but extensible Role Based Access Control system in the existing application.

The first version should mimic authentication and demonstrate two types of users:

1. SuperAdmin
2. Normal User

The architecture must be designed so that more roles, permissions, menus, and access rules can be added later without major architectural changes.

Do not overengineer the first version.

## 2. Important Implementation Rule

This document is the source of truth for the RBAC implementation.

Before making changes:

1. Inspect the existing application architecture.
2. Understand the current routing, layout, Header, Sidebar, styling, state management, and existing components.
3. Reuse existing patterns wherever possible.
4. Do not introduce new libraries unless absolutely necessary.
5. Do not modify unrelated functionality.
6. Do not replace the existing architecture.
7. Implement the requirements incrementally.
8. After each phase, verify that the application still builds and runs.

Do not only describe what should be implemented.

Actually create and modify the required files.

## 3. Phase 1, Mock Login

Create a Login page.

The Login page should visually represent a real application login page, but authentication will be mocked for now.

Display two clearly visible options:

```text
Login as Admin
Login as User
```

The buttons must be clickable.

### Admin Login

When the user clicks:

```text
Login as Admin
```

Set the current application user as:

```text
Role: SUPER_ADMIN
```

Then navigate to the main application.

### User Login

When the user clicks:

```text
Login as User
```

Set the current application user as:

```text
Role: USER
```

Then navigate to the main application.

Do not implement username, password, JWT, OAuth, or real authentication yet.

The purpose of this phase is to establish the application user context.

## 4. User Context

Create a centralized authentication or user context.

The application should be able to determine:

```text
Who is the current user?
What role does the current user have?
What permissions does the current user have?
```

Do not spread role checks throughout individual components.

Avoid code such as:

```typescript
if (user.role === "SUPER_ADMIN")
```

inside many unrelated components.

Create a centralized authorization mechanism instead.

## 5. Initial Roles

Create the following roles:

```text
SUPER_ADMIN
USER
```

### SUPER_ADMIN

The SuperAdmin has full access to the application, including RBAC Management.

### USER

The Normal User has access only to the menus and pages assigned to the User role.

The Normal User must not have access to RBAC Management.

## 6. Initial Application Menus

Create or use the following logical menus.

```text
Dashboard
Customers
Reports
RBAC Management
```

The exact visual implementation should follow the existing application's Sidebar and navigation architecture.

## 7. Initial Permissions

Define permissions separately from menus.

Initial permissions:

```text
DASHBOARD_VIEW
CUSTOMER_VIEW
REPORT_VIEW
RBAC_MANAGE
```

Do not directly couple roles to React components.

The intended relationship is:

```text
User
  ↓
Role
  ↓
Permissions
  ↓
Menu / Route / Action
```

## 8. Initial Permission Mapping

SuperAdmin:

```text
DASHBOARD_VIEW
CUSTOMER_VIEW
REPORT_VIEW
RBAC_MANAGE
```

Normal User:

```text
DASHBOARD_VIEW
CUSTOMER_VIEW
REPORT_VIEW
```

Therefore:

```text
SuperAdmin
    Dashboard       ✓
    Customers       ✓
    Reports         ✓
    RBAC Management ✓

Normal User
    Dashboard       ✓
    Customers       ✓
    Reports         ✓
    RBAC Management ✗
```

## 9. Dynamic Sidebar

The Sidebar should be generated based on the current user's permissions.

Do not hardcode separate Sidebar implementations for Admin and User.

Use a centralized menu configuration.

Conceptually:

```typescript
Menu {
    label
    route
    requiredPermission
}
```

Example:

```text
Dashboard
    requiredPermission: DASHBOARD_VIEW

Customers
    requiredPermission: CUSTOMER_VIEW

Reports
    requiredPermission: REPORT_VIEW

RBAC Management
    requiredPermission: RBAC_MANAGE
```

The Sidebar should only display menus for which the current user has permission.

## 10. Route Protection

Hiding a menu is not sufficient authorization.

The application must also protect restricted routes.

For example, if a Normal User manually navigates to:

```text
/rbac
```

the application must not display the RBAC Management page.

Instead, redirect the user to an appropriate page such as Dashboard or show an Access Denied page.

Create a reusable authorization mechanism such as:

```text
ProtectedRoute
```

or an equivalent pattern consistent with the existing architecture.

## 11. Permission Guard

Create a reusable permission checking mechanism.

Conceptually:

```typescript
hasPermission("RBAC_MANAGE")
```

It should be possible to use the same authorization mechanism for:

1. Sidebar menu visibility
2. Route protection
3. Future button visibility
4. Future action authorization

Do not implement separate permission logic for each use case.

## 12. RBAC Management Menu

Only users with:

```text
RBAC_MANAGE
```

can see and access:

```text
RBAC Management
```

Initially, only SuperAdmin has this permission.

The RBAC Management page is the foundation for future user permission management.

## 13. RBAC Management Page

Create an initial RBAC Management page.

For the first version, display a list of users.

Example:

```text
RBAC Management

User             Role             Actions

Admin User       SuperAdmin       Edit

Normal User      User             Edit
```

The page does not need to implement every possible RBAC feature yet.

The primary objective is to establish the structure that will later allow SuperAdmin to manage user access.

## 14. User Management

Create mock users for demonstration.

At minimum:

```text
Admin User
Normal User
```

Example conceptual model:

```typescript
User {
    id
    name
    role
}
```

The Admin User should have:

```text
SUPER_ADMIN
```

The Normal User should have:

```text
USER
```

## 15. Future RBAC Design

The architecture must allow the following future requirements without major restructuring:

```text
Multiple roles

Custom permissions

User specific permissions

Menu level permissions

Page level permissions

Button level permissions

CRUD permissions

Create
Read
Update
Delete

API authorization

Role management

User management
```

Do not implement all of these now.

Only create clean extension points.

## 16. Role Based Architecture

The intended architecture is:

```text
                    User
                      |
                      v
                    Role
                      |
                      v
                 Permissions
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        Menus       Routes      Actions
```

The frontend should use permissions to determine what the user can see and access.

The backend, when introduced or already available, must ultimately enforce authorization for protected APIs.

Frontend authorization must never be considered sufficient security by itself.

## 17. Separation of Concerns

Keep these concepts separate:

```text
Authentication
    Who is the user?

Authorization
    What can the user access?

Role
    What group does the user belong to?

Permission
    What specific capability does the user have?

Menu
    What navigation item should be displayed?
```

Do not combine all of these into a single object or component.

## 18. Persistence

For this first mock implementation, the current user may be persisted using the application's existing client side state approach.

If localStorage is used, keep it minimal.

Example conceptual state:

```text
currentUser
currentRole
```

When the browser is refreshed, the selected mock user should remain available if practical within the existing architecture.

Do not implement real authentication persistence yet.

## 19. Logout

Add a basic Logout capability in the existing Header or user menu.

Logout should:

1. Clear the current mock user
2. Clear the relevant client side authentication state
3. Navigate back to Login

## 20. Access Denied

Create a simple Access Denied page or reusable component.

Example:

```text
Access Denied

You do not have permission to access this page.

Back to Dashboard
```

Use it when a user attempts to access a protected route without the required permission.

## 21. UI Requirements

Follow the existing application's design system.

Do not introduce a new UI framework.

Reuse existing:

```text
Buttons
Cards
Typography
Forms
Modal
Dropdown
Layout
Colors
Spacing
Icons
```

Follow the existing CSS architecture.

Do not introduce inline CSS if the project already follows a CSS Module or centralized styling approach.

The RBAC UI should look like a natural part of the existing application.

## 22. TypeScript Requirements

Use strict TypeScript patterns consistent with the existing project.

Avoid:

```typescript
any
```

unless there is a genuine technical reason.

Use typed definitions for:

```text
User
Role
Permission
Menu
Authorization state
```

Keep permission values centralized.

Avoid duplicating permission strings throughout the application.

## 23. Suggested Project Structure

Do not blindly create this exact structure.

First inspect the existing application and adapt it to the existing architecture.

A conceptual structure could be:

```text
src/

  auth/
      AuthContext
      auth.types
      auth.service

  rbac/
      roles
      permissions
      rbac.types
      authorization
      PermissionGuard
      ProtectedRoute

  features/
      rbac/
          pages/
              RBACManagement

  pages/
      Login
      AccessDenied

  layout/
      Header
      Sidebar
      MainLayout
```

The existing project's conventions take priority.

## 24. Implementation Phases

Implement the feature in the following order.

### Phase 1

Create Login page.

Add:

```text
Login as Admin
Login as User
```

Verify both buttons work.

### Phase 2

Create centralized current user context.

Verify that the application knows whether the current user is:

```text
SUPER_ADMIN
```

or:

```text
USER
```

### Phase 3

Create roles and permissions.

Implement:

```text
SUPER_ADMIN
USER

DASHBOARD_VIEW
CUSTOMER_VIEW
REPORT_VIEW
RBAC_MANAGE
```

### Phase 4

Create centralized menu configuration.

Generate Sidebar based on permissions.

### Phase 5

Implement route protection.

Normal User must not be able to access RBAC Management directly through the URL.

### Phase 6

Create RBAC Management page.

Only SuperAdmin can access it.

### Phase 7

Create mock user list.

Display Admin User and Normal User.

### Phase 8

Add Logout.

Logout should return the user to Login.

### Phase 9

Verify the complete flow.

Test:

```text
Login as Admin
    ↓
Admin Dashboard
    ↓
Admin menus visible
    ↓
RBAC Management visible
    ↓
RBAC Management accessible
```

Test:

```text
Login as User
    ↓
User Dashboard
    ↓
User menus visible
    ↓
RBAC Management hidden
    ↓
Direct RBAC URL access denied
```

## 25. Acceptance Criteria

The implementation is complete when all of the following are true.

### Login

Admin and User buttons are visible and functional.

### Admin

Admin can access all initial menus.

Admin can access RBAC Management.

### User

User can access only permitted menus.

User cannot see RBAC Management.

User cannot access RBAC Management by manually entering the route.

### Authorization

Permission checking is centralized.

Menu visibility is based on permissions.

Route protection is based on permissions.

### Architecture

Roles are separate from permissions.

Permissions are separate from menus.

Authentication state is centralized.

Authorization logic is reusable.

### Code Quality

Existing architecture is respected.

Existing styling conventions are respected.

No unnecessary dependencies are introduced.

No unrelated functionality is changed.

TypeScript remains clean.

The application builds successfully.

Existing tests, if present, continue to pass.

## 26. Important Instruction to Claude

Do not implement future requirements unless explicitly requested.

Do not overengineer the RBAC system.

Do not introduce a complex authorization framework.

Build the smallest clean implementation that satisfies this document.

Before changing code, inspect the existing application.

After implementation, run the appropriate build, lint, and test commands.

If you encounter an architectural conflict, explain the conflict and choose the solution that best preserves the existing application architecture.

At the end, provide a concise summary of:

1. Files changed
2. Features implemented
3. How Admin login works
4. How User login works
5. How permissions are enforced
6. Verification performed
7. Any remaining limitations
