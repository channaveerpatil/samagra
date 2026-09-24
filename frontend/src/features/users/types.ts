import type { Role } from '@/lib/auth/roles';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string;
  company?: string;
  createdAt: string;
}

export type UserInput = Omit<User, 'id' | 'createdAt'>;
