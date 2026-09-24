import { apiClient } from '@/lib/apiClient';
import { appConfig } from '@/config/appConfig';
import { MOCK_USERS } from './mockUsers';
import type { AuthUser } from './authUser';

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
}

export interface AuthApi {
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  logout: () => Promise<void>;
  me: () => Promise<AuthUser | null>;
  updateProfile: (
    updates: Partial<Pick<AuthUser, 'name' | 'phone' | 'company' | 'website'>>,
  ) => Promise<AuthUser>;
}

// ---------------------------------------------------------------------------
// Mock implementation. Matches by email only (password is not checked) so the
// demo experience stays a one-field shortcut while still exercising the same
// AuthContext code path the real backend uses.
// ---------------------------------------------------------------------------

const mockAuthApi: AuthApi = {
  async login(email) {
    const user = MOCK_USERS.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error(`No mock user found for "${email}"`);
    }
    return { ...user };
  },

  async register(input) {
    const existing = MOCK_USERS.find(
      (candidate) => candidate.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (existing) {
      throw new Error('An account with this email already exists');
    }
    return {
      id: `mock_${Date.now()}`,
      name: `${input.firstName} ${input.lastName}`.trim(),
      email: input.email,
      role: 'USER',
      phone: '',
      company: input.company ?? '',
      website: '',
    };
  },

  async logout() {
    // No server session in mock mode; AuthProvider clears local state itself.
  },

  async resetPassword(input) {
    const user = MOCK_USERS.find(
      (candidate) => candidate.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (!user) {
      throw new Error(`No account found with "${input.email}"`);
    }
    // Mock users don't have a real password store, and mock login doesn't
    // check one, so there's nothing further to persist here.
  },

  async me() {
    return null;
  },

  async updateProfile(updates) {
    return { ...MOCK_USERS[0], ...updates };
  },
};

// ---------------------------------------------------------------------------
// Real implementation. The backend returns the User shape (firstName/lastName,
// no `website` split), so map to/from AuthUser's single `name` field here.
// ---------------------------------------------------------------------------

interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AuthUser['role'];
  phone?: string;
  company?: string;
  website?: string;
}

function toAuthUser(user: BackendUser): AuthUser {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: user.role,
    phone: user.phone ?? '',
    company: user.company ?? '',
    website: user.website ?? '',
  };
}

function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return { firstName: firstName ?? '', lastName: rest.join(' ') };
}

const realAuthApi: AuthApi = {
  async login(email, password) {
    const user = await apiClient.post<BackendUser>('/auth/login', { email, password });
    return toAuthUser(user);
  },

  async register(input) {
    const user = await apiClient.post<BackendUser>('/auth/register', { ...input });
    return toAuthUser(user);
  },

  async resetPassword(input) {
    await apiClient.post<void>('/auth/forgot-password', { ...input });
  },

  async logout() {
    await apiClient.post<void>('/auth/logout');
  },

  async me() {
    const user = await apiClient.get<BackendUser | null>('/auth/me');
    return user ? toAuthUser(user) : null;
  },

  async updateProfile(updates) {
    const { name, ...rest } = updates;
    const payload = { ...rest, ...(name !== undefined ? splitName(name) : {}) };
    const user = await apiClient.patch<BackendUser>('/users/me', payload);
    return toAuthUser(user);
  },
};

export const authApi: AuthApi = appConfig.features.useMockApi ? mockAuthApi : realAuthApi;
