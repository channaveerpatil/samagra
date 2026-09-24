import { Navigate, Outlet, useLocation } from 'react-router';
import useAuth from '@/hooks/useAuth';
import type { Permission } from '@/lib/auth/permissions';

export interface ProtectedRouteProps {
  requiredPermission?: Permission;
}

export default function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { user, can } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
