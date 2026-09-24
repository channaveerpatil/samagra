import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GridViewIcon from '@mui/icons-material/GridView';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import type { NavItem, NavSection } from '@/lib/nav-items';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { featureFlags } from '@/config/featureFlags';

const approvalsNavItem: NavItem[] = featureFlags.approvals
  ? [
      {
        id: 'approvals',
        title: 'Approvals',
        icon: <FactCheckIcon />,
        href: '/approvals',
        requiredPermission: PERMISSIONS.APPROVAL_VIEW,
      },
    ]
  : [];

const reportsNavItem: NavItem[] = featureFlags.reporting
  ? [
      {
        id: 'reports',
        title: 'Reports',
        icon: <AssessmentIcon />,
        href: '/reports',
        requiredPermission: PERMISSIONS.REPORT_VIEW,
      },
    ]
  : [];

const auditNavItem: NavItem[] = featureFlags.audit
  ? [
      {
        id: 'audit',
        title: 'Audit & Activity',
        icon: <HistoryIcon />,
        href: '/audit',
        requiredPermission: PERMISSIONS.AUDIT_VIEW,
      },
    ]
  : [];

export const mainNavSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
        href: '/',
        requiredPermission: PERMISSIONS.DASHBOARD_VIEW,
      },
      ...approvalsNavItem,
    ],
  },
  {
    title: 'Reports',
    items: [...reportsNavItem, ...auditNavItem],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'customers',
        title: 'Customers',
        icon: <GroupIcon />,
        href: '/customers',
        requiredPermission: PERMISSIONS.CUSTOMER_VIEW,
      },
      {
        id: 'documents',
        title: 'Documents',
        icon: <UploadFileOutlinedIcon />,
        href: '/documents',
      },
      {
        id: 'rbac',
        title: 'Users',
        icon: <AdminPanelSettingsIcon />,
        href: '/rbac',
        requiredPermission: PERMISSIONS.RBAC_MANAGE,
      },
      {
        id: 'role-matrix',
        title: 'Role Matrix',
        icon: <GridViewIcon />,
        href: '/rbac/role-matrix',
        requiredPermission: PERMISSIONS.RBAC_MANAGE,
      },
      {
        id: 'add-user',
        title: 'Add User',
        icon: <PersonAddAlt1Icon />,
        href: '/rbac/add-user',
        requiredPermission: PERMISSIONS.RBAC_MANAGE,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'settings',
        title: 'Settings',
        icon: <SettingsIcon />,
        href: '/settings/general',
        requiredPermission: PERMISSIONS.SETTINGS_VIEW,
        children: [
          {
            id: 'settings-general',
            title: 'General',
            icon: <TuneIcon />,
            href: '/settings/general',
          },
          {
            id: 'settings-appearance',
            title: 'Appearance',
            icon: <PaletteIcon />,
            href: '/settings/appearance',
          },
          {
            id: 'settings-notifications',
            title: 'Notifications',
            icon: <NotificationsIcon />,
            href: '/settings/notifications',
          },
        ],
      },
      { id: 'profile', title: 'Profile', icon: <PersonIcon />, href: '/profile' },
    ],
  },
];
