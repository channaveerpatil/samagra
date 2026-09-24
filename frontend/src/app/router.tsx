import { createBrowserRouter } from 'react-router';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import CustomersPage from '@/pages/CustomersPage';
import ReportsPage from '@/pages/ReportsPage';
import DocumentsPage from '@/pages/DocumentsPage';
import ApprovalsPage from '@/pages/ApprovalsPage';
import RequestApprovalPage from '@/pages/RequestApprovalPage';
import AuditPage from '@/pages/AuditPage';
import RbacManagementPage from '@/pages/RbacManagementPage';
import RoleMatrixPage from '@/pages/RoleMatrixPage';
import AddUserPage from '@/pages/AddUserPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import AccessDeniedPage from '@/pages/AccessDeniedPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { PERMISSIONS } from '@/lib/auth/permissions';

export const router = createBrowserRouter([
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignupPage },
  { path: '/forgot-password', Component: ForgotPasswordPage },
  { path: '/access-denied', Component: AccessDeniedPage },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: MainLayout,
        children: [
          { path: '/', Component: DashboardPage },
          { path: '/customers', Component: CustomersPage },
          { path: '/documents', Component: DocumentsPage },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.REPORT_VIEW} />,
            children: [{ path: '/reports', Component: ReportsPage }],
          },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.APPROVAL_VIEW} />,
            children: [{ path: '/approvals', Component: ApprovalsPage }],
          },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.APPROVAL_CREATE} />,
            children: [{ path: '/approvals/request', Component: RequestApprovalPage }],
          },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.AUDIT_VIEW} />,
            children: [{ path: '/audit', Component: AuditPage }],
          },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.RBAC_MANAGE} />,
            children: [
              { path: '/rbac', Component: RbacManagementPage },
              { path: '/rbac/role-matrix', Component: RoleMatrixPage },
              { path: '/rbac/add-user', Component: AddUserPage },
            ],
          },
          {
            element: <ProtectedRoute requiredPermission={PERMISSIONS.SETTINGS_VIEW} />,
            children: [{ path: '/settings/:section?', Component: SettingsPage }],
          },
          { path: '/profile', Component: ProfilePage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]);
