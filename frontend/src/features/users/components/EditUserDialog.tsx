import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AppDialogHeader from '@/components/common/AppDialogHeader';
import AddUserForm from './AddUserForm';
import type { User, UserInput } from '../types';

export interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (id: string, input: UserInput) => Promise<void>;
}

export default function EditUserDialog({ user, onClose, onSubmit }: EditUserDialogProps) {
  const open = !!user;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {user ? (
        <>
          <AppDialogHeader
            icon={<EditOutlinedIcon />}
            title="Edit user"
            subtitle={`Update details and role for ${user.firstName} ${user.lastName}.`}
            onClose={onClose}
          />
          <DialogContent>
            <AddUserForm
              key={user.id}
              user={user}
              onCancel={onClose}
              onSubmit={(input) => onSubmit(user.id, input)}
            />
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}
