import { ROLES } from './roles';
import type { AuthUser } from './authUser';

export const MOCK_USERS: AuthUser[] = [
  {
    id: 'user-admin',
    name: 'Channaveer Patil',
    email: 'admin@starterkit.dev',
    role: ROLES.SUPER_ADMIN,
    phone: '555-010-1000',
    company: 'Samagra Inc.',
    website: 'www.starterkit.dev',
  },
  {
    id: 'user-admin-2',
    name: 'Morgan Blake',
    email: 'admin2@starterkit.dev',
    role: ROLES.ADMIN,
    phone: '555-010-1500',
    company: 'Samagra Inc.',
    website: 'www.starterkit.dev',
  },
  {
    id: 'user-manager',
    name: 'Taylor Reyes',
    email: 'manager@starterkit.dev',
    role: ROLES.MANAGER,
    phone: '555-010-1800',
    company: 'Samagra Inc.',
    website: 'www.starterkit.dev',
  },
  {
    id: 'user-normal',
    name: 'Normal User',
    email: 'user@starterkit.dev',
    role: ROLES.USER,
    phone: '555-010-2000',
    company: 'Samagra Inc.',
    website: 'www.starterkit.dev',
  },
  {
    id: 'user-viewer',
    name: 'Jamie Rivera',
    email: 'jamie.rivera@starterkit.dev',
    role: ROLES.VIEWER,
    phone: '555-010-3000',
    company: 'Samagra Inc.',
    website: 'www.starterkit.dev',
  },
];
