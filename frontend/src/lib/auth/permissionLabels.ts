import { PERMISSIONS, type Permission } from './permissions';

export const PERMISSION_LABELS: Record<Permission, string> = {
  [PERMISSIONS.DASHBOARD_VIEW]: 'Dashboard View',
  [PERMISSIONS.CUSTOMER_VIEW]: 'Customer View',
  [PERMISSIONS.CUSTOMER_CREATE]: 'Customer Create',
  [PERMISSIONS.REPORT_VIEW]: 'Report View',
  [PERMISSIONS.REPORT_GENERATE]: 'Report Generate',
  [PERMISSIONS.REPORT_DOWNLOAD]: 'Report Download',
  [PERMISSIONS.SETTINGS_VIEW]: 'Settings View',
  [PERMISSIONS.USER_VIEW]: 'User View',
  [PERMISSIONS.USER_FIELD]: 'User Field',
  [PERMISSIONS.USER_CREATE]: 'User Create',
  [PERMISSIONS.USER_UPDATE]: 'User Update',
  [PERMISSIONS.RBAC_MANAGE]: 'RBAC Manage',
  [PERMISSIONS.APPROVAL_VIEW]: 'Approval View',
  [PERMISSIONS.APPROVAL_CREATE]: 'Approval Create',
  [PERMISSIONS.APPROVAL_APPROVE]: 'Approval Approve',
  [PERMISSIONS.APPROVAL_REJECT]: 'Approval Reject',
  [PERMISSIONS.AUDIT_VIEW]: 'Audit View',
};
