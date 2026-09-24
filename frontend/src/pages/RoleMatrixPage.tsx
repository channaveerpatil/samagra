import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { alpha, useTheme, type Theme } from '@mui/material/styles';
import PageContainer from '@/components/layout/PageContainer';
import { ROLES, type Role } from '@/lib/auth/roles';
import { PERMISSIONS, type Permission } from '@/lib/auth/permissions';
import { PERMISSION_LABELS } from '@/lib/auth/permissionLabels';
import { ROLE_PERMISSIONS } from '@/lib/auth/rolePermissions';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';
import { generateRoleMatrixExcel } from '@/features/reports/utils/generateRoleMatrixExcel';
import { saveBlobAsFile } from '@/features/reports/utils/saveBlobAsFile';

const ROLE_ORDER: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.USER,
  ROLES.VIEWER,
];

const ROLE_ACCENT: Record<Role, (theme: Theme) => string> = {
  [ROLES.SUPER_ADMIN]: (theme) => theme.palette.primary.main,
  [ROLES.ADMIN]: (theme) => theme.palette.info.main,
  [ROLES.MANAGER]: (theme) => theme.palette.warning.main,
  [ROLES.USER]: (theme) => theme.palette.success.main,
  [ROLES.VIEWER]: (theme) => theme.palette.grey[500],
};

interface PermissionCategory {
  label: string;
  permissions: Permission[];
}

function groupByCategory(permissions: Permission[]): PermissionCategory[] {
  const labels: Record<string, string> = {
    DASHBOARD: 'General',
    CUSTOMER: 'Customers',
    REPORT: 'Reports',
    SETTINGS: 'Settings',
    USER: 'User Management',
    RBAC: 'RBAC',
    APPROVAL: 'Approvals',
  };
  const order: string[] = [];
  const groups = new Map<string, Permission[]>();

  permissions.forEach((permission) => {
    const prefix = permission.split('_')[0];
    if (!groups.has(prefix)) {
      groups.set(prefix, []);
      order.push(prefix);
    }
    groups.get(prefix)!.push(permission);
  });

  return order.map((prefix) => ({
    label: labels[prefix] ?? prefix,
    permissions: groups.get(prefix)!,
  }));
}

const PERMISSION_CATEGORIES = groupByCategory(Object.values(PERMISSIONS));
const TOTAL_PERMISSIONS = Object.values(PERMISSIONS).length;

export default function RoleMatrixPage() {
  const theme = useTheme();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { blob, fileName } = await generateRoleMatrixExcel();
      saveBlobAsFile(blob, fileName);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageContainer
      title="Role Matrix"
      description="See exactly which permissions each role grants."
      breadcrumbs={[{ title: 'Users', path: '/rbac' }, { title: 'Role Matrix' }]}
      actions={
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={handleExport}
          loading={isExporting}
        >
          Export to Excel
        </Button>
      }
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: `repeat(${ROLE_ORDER.length}, 1fr)`,
            },
            gap: 2,
          }}
        >
          {ROLE_ORDER.map((role) => {
            const accent = ROLE_ACCENT[role](theme);
            const granted = ROLE_PERMISSIONS[role].length;
            return (
              <Paper
                key={role}
                variant="outlined"
                sx={{
                  p: 2.25,
                  borderTop: 3,
                  borderTopColor: accent,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {ROLE_ACCESS_INFO[role].label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                  {ROLE_ACCESS_INFO[role].summary}
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline', mt: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: accent }}>
                    {granted}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    / {TOTAL_PERMISSIONS} permissions
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    bgcolor: alpha(accent, 0.15),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(granted / TOTAL_PERMISSIONS) * 100}%`,
                      bgcolor: accent,
                    }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>

        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 640 }}>
            <Table
              stickyHeader
              size="small"
              sx={{
                '& .MuiTableCell-root': {
                  borderColor: 'divider',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      bgcolor: 'background.paper',
                      position: 'sticky',
                      left: 0,
                      top: 0,
                      zIndex: 3,
                      borderBottom: 2,
                      borderBottomColor: 'divider',
                      boxShadow: (t) => `0 2px 4px -2px ${alpha(t.palette.common.black, 0.2)}`,
                    }}
                  >
                    Permission
                  </TableCell>
                  {ROLE_ORDER.map((role) => (
                    <TableCell
                      key={role}
                      align="center"
                      sx={{
                        bgcolor: 'background.paper',
                        borderBottom: 2,
                        borderBottomColor: 'divider',
                        boxShadow: (t) => `0 2px 4px -2px ${alpha(t.palette.common.black, 0.2)}`,
                      }}
                    >
                      <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: ROLE_ACCENT[role](theme),
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {ROLE_ACCESS_INFO[role].label}
                        </Typography>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {PERMISSION_CATEGORIES.map((category) => (
                  <React.Fragment key={category.label}>
                    <TableRow>
                      <TableCell
                        colSpan={ROLE_ORDER.length + 1}
                        sx={{
                          bgcolor: 'action.hover',
                          py: 0.75,
                          position: 'sticky',
                          left: 0,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            textTransform: 'uppercase',
                            color: 'text.secondary',
                          }}
                        >
                          {category.label}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {category.permissions.map((permission) => (
                      <TableRow key={permission} hover>
                        <TableCell
                          sx={{
                            bgcolor: 'background.paper',
                            position: 'sticky',
                            left: 0,
                          }}
                        >
                          <Typography variant="body2">{PERMISSION_LABELS[permission]}</Typography>
                        </TableCell>
                        {ROLE_ORDER.map((role) => {
                          const grantedPermission = ROLE_PERMISSIONS[role].includes(permission);
                          return (
                            <TableCell key={role} align="center">
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  bgcolor: grantedPermission ? 'success.main' : 'transparent',
                                  border: grantedPermission ? 'none' : 1,
                                  borderColor: 'divider',
                                }}
                              >
                                {grantedPermission ? (
                                  <CheckRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                                ) : (
                                  <CloseRoundedIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                                )}
                              </Box>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </PageContainer>
  );
}
