import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import useUsers from '@/features/users/hooks/useUsers';
import EditUserDialog from '@/features/users/components/EditUserDialog';
import type { User, UserInput } from '@/features/users/types';
import useAuth from '@/hooks/useAuth';
import { ROLES, type Role } from '@/lib/auth/roles';
import { ROLE_ACCESS_INFO } from '@/lib/auth/roleAccessInfo';
import { PERMISSIONS } from '@/lib/auth/permissions';

const COLUMNS = ['User', 'Email', 'Role', ''];

const ROLE_FILTER_OPTIONS: Array<{ value: Role | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All roles' },
  { value: ROLES.SUPER_ADMIN, label: ROLE_ACCESS_INFO[ROLES.SUPER_ADMIN].label },
  { value: ROLES.ADMIN, label: ROLE_ACCESS_INFO[ROLES.ADMIN].label },
  { value: ROLES.MANAGER, label: ROLE_ACCESS_INFO[ROLES.MANAGER].label },
  { value: ROLES.USER, label: ROLE_ACCESS_INFO[ROLES.USER].label },
  { value: ROLES.VIEWER, label: ROLE_ACCESS_INFO[ROLES.VIEWER].label },
];

export default function RbacManagementPage() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const { users, isLoading, updateUser } = useUsers();
  const [roleFilter, setRoleFilter] = React.useState<Role | 'ALL'>('ALL');
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const canCreateUser = can(PERMISSIONS.RBAC_MANAGE);

  const filteredUsers = React.useMemo(
    () => (roleFilter === 'ALL' ? users : users.filter((user) => user.role === roleFilter)),
    [users, roleFilter],
  );

  const handleUpdateUser = async (id: string, input: UserInput) => {
    await updateUser(id, input);
    setEditingUser(null);
  };

  return (
    <PageContainer
      title="Users"
      description="Manage users and their assigned roles."
      breadcrumbs={[{ title: 'Users' }]}
    >
      <SectionCard
        title="Users"
        description="Users and the role currently assigned to them. Filter by role to review who has access to what."
        headerActions={
          canCreateUser ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/rbac/add-user')}
            >
              Add User
            </Button>
          ) : null
        }
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {ROLE_FILTER_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setRoleFilter(option.value)}
                color={roleFilter === option.value ? 'primary' : 'default'}
                variant={roleFilter === option.value ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table
              sx={{
                '& .MuiTableCell-root': {
                  borderColor: 'divider',
                },
              }}
            >
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column} sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ROLE_ACCESS_INFO[user.role].label}
                        color={
                          user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN
                            ? 'primary'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => setEditingUser(user)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMNS.length}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No users match this role.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </SectionCard>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleUpdateUser}
      />
    </PageContainer>
  );
}
