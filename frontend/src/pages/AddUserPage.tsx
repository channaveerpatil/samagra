import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import AddUserForm, { type UserFormValues } from '@/features/users/components/AddUserForm';
import UserAccessPreview from '@/features/users/components/UserAccessPreview';
import useUsers from '@/features/users/hooks/useUsers';
import { ROLES } from '@/lib/auth/roles';
import type { UserInput } from '@/features/users/types';

const EMPTY_PREVIEW_VALUES: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: ROLES.USER,
  phone: '',
  company: '',
};

export default function AddUserPage() {
  const navigate = useNavigate();
  const { createUser } = useUsers();
  const [previewValues, setPreviewValues] = React.useState<UserFormValues>(EMPTY_PREVIEW_VALUES);

  const handleSubmit = async (input: UserInput) => {
    await createUser(input);
    navigate('/rbac');
  };

  const handleCancel = () => {
    navigate('/rbac');
  };

  return (
    <PageContainer
      title="Add User"
      description="Create a new user and assign their role."
      breadcrumbs={[{ title: 'Users', path: '/rbac' }, { title: 'Add User' }]}
    >
      <SectionCard title="New user">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto 280px' },
            gap: 3,
            maxWidth: 1200,
          }}
        >
          <AddUserForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onChange={setPreviewValues}
          />
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          <UserAccessPreview values={previewValues} />
        </Box>
      </SectionCard>
    </PageContainer>
  );
}
