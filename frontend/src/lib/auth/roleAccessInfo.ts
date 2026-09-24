import { ROLES, type Role } from './roles';

export interface RoleAccessInfo {
  label: string;
  summary: string;
  capabilities: string[];
}

export const ROLE_ACCESS_INFO: Record<Role, RoleAccessInfo> = {
  [ROLES.SUPER_ADMIN]: {
    label: 'Super Admin',
    summary: 'Full administrative access across the platform, including managing other users.',
    capabilities: [
      'Manage users and roles',
      'View, create and manage customers',
      'Generate and download reports',
      'Review, approve and reject approval requests',
      'View and change system settings',
      'View the dashboard',
    ],
  },
  [ROLES.ADMIN]: {
    label: 'Admin',
    summary: 'User and operational administration, but cannot modify RBAC.',
    capabilities: [
      'Manage users (create and update)',
      'View, create and manage customers',
      'Generate and download reports',
      'Review, approve and reject approval requests',
      'View and change system settings',
      'View the dashboard',
    ],
  },
  [ROLES.MANAGER]: {
    label: 'Manager',
    summary: 'Business management and approval responsibilities.',
    capabilities: [
      'View the dashboard',
      'View, create and manage customers',
      'Generate and download reports',
      'Review, approve and reject approval requests',
      'View system settings',
    ],
  },
  [ROLES.USER]: {
    label: 'User',
    summary: 'Normal business user with access to operational features.',
    capabilities: [
      'View the dashboard',
      'View and search customers',
      'Generate and download reports',
      'Submit and view approval requests',
      'View system settings',
    ],
  },
  [ROLES.VIEWER]: {
    label: 'Viewer',
    summary: 'Read only access to basic business information and reports.',
    capabilities: ['View the dashboard', 'View customers', 'View reports'],
  },
};
