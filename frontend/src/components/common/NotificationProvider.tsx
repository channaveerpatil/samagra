import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NotificationContext, { type NotifyOptions } from '@/context/NotificationContext';
import { subscribeToApiErrors } from '@/lib/apiErrorBus';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const DEFAULT_AUTO_HIDE_DURATION = 6000;

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const [current, setCurrent] = React.useState<Required<NotifyOptions> | null>(null);
  const [open, setOpen] = React.useState(false);

  const notify = React.useCallback((options: NotifyOptions) => {
    setCurrent({
      message: options.message,
      severity: options.severity ?? 'info',
      autoHideDuration: options.autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION,
    });
    setOpen(true);
  }, []);

  React.useEffect(() => {
    return subscribeToApiErrors((error) => {
      notify({ message: error.message, severity: 'error' });
    });
  }, [notify]);

  const handleClose = React.useCallback((_event: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const contextValue = React.useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={current?.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {current ? (
          <Alert onClose={handleClose} severity={current.severity} variant="filled">
            {current.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotificationContext.Provider>
  );
}
