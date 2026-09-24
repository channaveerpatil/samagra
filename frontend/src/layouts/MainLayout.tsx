import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Outlet } from 'react-router';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { mainNavSections } from '@/lib/nav-config';
import { filterNavSectionsByPermission } from '@/lib/nav-items';
import useAuth from '@/hooks/useAuth';

export default function MainLayout() {
  const theme = useTheme();
  const { can } = useAuth();

  const visibleNavSections = React.useMemo(
    () => filterNavSectionsByPermission(mainNavSections, can),
    [can],
  );

  const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] = React.useState(true);
  const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] = React.useState(false);

  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

  const isNavigationExpanded = isOverMdViewport
    ? isDesktopNavigationExpanded
    : isMobileNavigationExpanded;

  const setIsNavigationExpanded = React.useCallback(
    (newExpanded: boolean) => {
      if (isOverMdViewport) {
        setIsDesktopNavigationExpanded(newExpanded);
      } else {
        setIsMobileNavigationExpanded(newExpanded);
      }
    },
    [isOverMdViewport],
  );

  const handleToggleHeaderMenu = React.useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded);
    },
    [setIsNavigationExpanded],
  );

  const [layoutContainer, setLayoutContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <Box
      ref={setLayoutContainer}
      sx={{
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
      }}
    >
      <Header
        title="Samagra समग्र"
        menuOpen={isNavigationExpanded}
        onToggleMenu={handleToggleHeaderMenu}
      />
      <Sidebar
        expanded={isNavigationExpanded}
        setExpanded={setIsNavigationExpanded}
        container={layoutContainer ?? undefined}
        navSections={visibleNavSections}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Toolbar sx={{ displayPrint: 'none' }} />
        <Box
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
