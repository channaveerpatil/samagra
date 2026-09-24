import * as React from 'react';
import AuthContext from '@/context/AuthContext';
import useLocalStorage from '@/hooks/useLocalStorage';
import { appConfig } from '@/config/appConfig';
import { authApi } from '@/lib/auth/authApi';
import type { RegisterInput } from '@/lib/auth/authApi';
import { MOCK_USERS } from '@/lib/auth/mockUsers';
import { ROLES } from '@/lib/auth/roles';
import { hasPermission } from '@/lib/auth/authorization';
import type { Permission } from '@/lib/auth/permissions';
import type { AuthUser } from '@/lib/auth/authUser';

interface AuthProviderProps {
  children: React.ReactNode;
}

const SUPER_ADMIN_USER = MOCK_USERS.find((user) => user.role === ROLES.SUPER_ADMIN)!;
const ADMIN_USER = MOCK_USERS.find((user) => user.role === ROLES.ADMIN)!;
const MANAGER_USER = MOCK_USERS.find((user) => user.role === ROLES.MANAGER)!;
const NORMAL_USER = MOCK_USERS.find((user) => user.role === ROLES.USER)!;
const VIEWER_USER = MOCK_USERS.find((user) => user.role === ROLES.VIEWER)!;

const useMockApi = appConfig.features.useMockApi;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [userId, setUserId] = useLocalStorage<string | null>('auth.userId', null);
  const [profileOverrides, setProfileOverrides] = useLocalStorage<
    Record<string, Partial<AuthUser>>
  >('auth.profileOverrides', {});

  // Only used in real mode — mock mode derives `user` from `userId` below.
  const [realUser, setRealUser] = React.useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = React.useState(!useMockApi);

  React.useEffect(() => {
    if (useMockApi) return;
    authApi
      .me()
      .then(setRealUser)
      .finally(() => setIsHydrating(false));
  }, []);

  const mockUser = React.useMemo(() => {
    const base = MOCK_USERS.find((candidate) => candidate.id === userId) ?? null;
    if (!base) return null;
    return { ...base, ...profileOverrides[base.id] };
  }, [userId, profileOverrides]);

  const user = useMockApi ? mockUser : realUser;

  const loginAsSuperAdmin = React.useCallback(() => {
    setUserId(SUPER_ADMIN_USER.id);
  }, [setUserId]);

  const loginAsAdmin = React.useCallback(() => {
    setUserId(ADMIN_USER.id);
  }, [setUserId]);

  const loginAsManager = React.useCallback(() => {
    setUserId(MANAGER_USER.id);
  }, [setUserId]);

  const loginAsUser = React.useCallback(() => {
    setUserId(NORMAL_USER.id);
  }, [setUserId]);

  const loginAsViewer = React.useCallback(() => {
    setUserId(VIEWER_USER.id);
  }, [setUserId]);

  const login = React.useCallback(
    async (email: string, password: string) => {
      const loggedInUser = await authApi.login(email, password);
      if (useMockApi) {
        setUserId(loggedInUser.id);
      } else {
        setRealUser(loggedInUser);
      }
    },
    [setUserId],
  );

  const register = React.useCallback(
    async (input: RegisterInput) => {
      if (useMockApi) {
        // Mock mode only knows the fixed MOCK_USERS roster, so "signing up"
        // logs the demo in as the normal user with the entered details layered
        // on top, the same way updateProfile overrides a mock user's fields.
        setProfileOverrides((previous) => ({
          ...previous,
          [NORMAL_USER.id]: {
            ...previous[NORMAL_USER.id],
            name: `${input.firstName} ${input.lastName}`.trim(),
            email: input.email,
            company: input.company ?? '',
          },
        }));
        setUserId(NORMAL_USER.id);
        return;
      }
      const newUser = await authApi.register(input);
      setRealUser(newUser);
    },
    [setUserId, setProfileOverrides],
  );

  const logout = React.useCallback(() => {
    if (useMockApi) {
      setUserId(null);
      return;
    }
    void authApi.logout().finally(() => setRealUser(null));
  }, [setUserId]);

  const can = React.useCallback(
    (permission: Permission) => hasPermission(user, permission),
    [user],
  );

  const updateProfile = React.useCallback(
    (updates: Partial<Pick<AuthUser, 'name' | 'phone' | 'company' | 'website'>>) => {
      if (useMockApi) {
        if (!userId) return;
        setProfileOverrides((previous) => ({
          ...previous,
          [userId]: { ...previous[userId], ...updates },
        }));
        return;
      }
      void authApi.updateProfile(updates).then(setRealUser);
    },
    [userId, setProfileOverrides],
  );

  const contextValue = React.useMemo(
    () => ({
      user,
      loginAsSuperAdmin,
      loginAsAdmin,
      loginAsManager,
      loginAsUser,
      loginAsViewer,
      login,
      register,
      logout,
      can,
      updateProfile,
    }),
    [
      user,
      loginAsSuperAdmin,
      loginAsAdmin,
      loginAsManager,
      loginAsUser,
      loginAsViewer,
      login,
      register,
      logout,
      can,
      updateProfile,
    ],
  );

  if (isHydrating) {
    return null;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
