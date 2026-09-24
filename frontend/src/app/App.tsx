import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import AppTheme from '@/theme/AppTheme';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import NotificationProvider from '@/components/common/NotificationProvider';
import AuthProvider from '@/components/common/AuthProvider';
import I18nProvider from '@/components/common/I18nProvider';
import { queryClient } from '@/lib/queryClient';
import { router } from './router';

export default function App() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ErrorBoundary>
        <I18nProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <NotificationProvider>
                <RouterProvider router={router} />
              </NotificationProvider>
            </AuthProvider>
          </QueryClientProvider>
        </I18nProvider>
      </ErrorBoundary>
    </AppTheme>
  );
}
