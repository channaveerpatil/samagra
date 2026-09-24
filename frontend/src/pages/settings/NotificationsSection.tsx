import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import SectionCard from '@/components/common/SectionCard';
import useNotificationPreferences from '@/features/notifications/hooks/useNotificationPreferences';
import type { NotificationPreferenceKey } from '@/features/notifications/types';

const PREFERENCE_FIELDS: { key: NotificationPreferenceKey; label: string }[] = [
  { key: 'approvalRequests', label: 'Approval requests' },
  { key: 'reportNotifications', label: 'Report notifications' },
  { key: 'securityAlerts', label: 'Security alerts' },
  { key: 'systemNotifications', label: 'System notifications' },
];

export default function NotificationsSection() {
  const { preferences, isLoading, updatePreferences, isUpdating } = useNotificationPreferences();

  if (isLoading || !preferences) {
    return (
      <SectionCard title="Notifications" description="Choose what you want to be notified about.">
        <Typography variant="body2" color="text.secondary">
          Loading preferences…
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Notifications" description="Choose what you want to be notified about.">
      <Stack
        spacing={1.5}
        divider={<Stack sx={{ borderTop: '1px solid', borderColor: 'divider' }} />}
      >
        {PREFERENCE_FIELDS.map((field) => (
          <Stack
            key={field.key}
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}
          >
            <Typography variant="body2">{field.label}</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences[field.key]}
                  disabled={isUpdating}
                  onChange={(event) =>
                    void updatePreferences({ [field.key]: event.target.checked })
                  }
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
}
