import * as React from 'react';
import type { AuthUser } from '@/lib/auth/authUser';
import type { RegisterInput } from '@/lib/auth/authApi';
import type { Permission } from '@/lib/auth/permissions';

export interface AuthContextValue {
  user: AuthUser | null;
  loginAsSuperAdmin: () => void;
  loginAsAdmin: () => void;
  loginAsManager: () => void;
  loginAsUser: () => void;
  loginAsViewer: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  can: (permission: Permission) => boolean;
  updateProfile: (
    updates: Partial<Pick<AuthUser, 'name' | 'phone' | 'company' | 'website'>>,
  ) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export default AuthContext;
