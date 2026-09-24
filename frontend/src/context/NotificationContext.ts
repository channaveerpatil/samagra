import * as React from 'react';
import type { AlertColor } from '@mui/material/Alert';

export interface NotifyOptions {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

export interface NotificationContextValue {
  notify: (options: NotifyOptions) => void;
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export default NotificationContext;
