export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  company?: string;
  website?: string;
  createdAt: string;
}

export type UserInput = Omit<User, 'id' | 'createdAt'>;

export type UserProfileUpdate = Partial<
  Pick<User, 'firstName' | 'lastName' | 'phone' | 'company' | 'website'>
>;
