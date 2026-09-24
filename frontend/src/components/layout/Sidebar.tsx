import * as React from 'react';
import { useTheme, type Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { matchPath, useLocation } from 'react-router';
import SidebarContext from '@/context/SidebarContext';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/lib/constants';
import type { NavSection } from '@/lib/nav-items';
import getDrawerSxTransitionMixin from '@/lib/mixins';
import SidebarNavItem from './SidebarNavItem';
import SidebarSectionHeader from './SidebarSectionHeader';
import SidebarDivider from './SidebarDivider';

export interface SidebarProps {
  expanded?: boolean;
  setExpanded: (expanded: boolean) => void;
  disableCollapsibleSidebar?: boolean;
  container?: Element;
  navSections: NavSection[];
}

export default function Sidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
  navSections,
}: SidebarProps) {
  const theme = useTheme();

  const { pathname } = useLocation();

  const [expandedItemIds, setExpandedItemIds] = React.useState<string[]>([]);

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up('sm'));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shouldReduceDrawerMotion =
    theme.motion.reducedMotion === 'always' ||
    (theme.motion.reducedMotion === 'system' && prefersReducedMotion);
  const drawerEnteringDuration = shouldReduceDrawerMotion
    ? 0
    : theme.transitions.duration.enteringScreen;
  const drawerLeavingDuration = shouldReduceDrawerMotion
    ? 0
    : theme.transitions.duration.leavingScreen;

  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    const timeout = setTimeout(
      () => setIsFullyExpanded(expanded),
      expanded ? drawerEnteringDuration : 0,
    );
    return () => clearTimeout(timeout);
  }, [drawerEnteringDuration, expanded]);

  React.useEffect(() => {
    const timeout = setTimeout(
      () => setIsFullyCollapsed(!expanded),
      expanded ? 0 : drawerLeavingDuration,
    );
    return () => clearTimeout(timeout);
  }, [drawerLeavingDuration, expanded]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded: boolean) => () => {
      setExpanded(newExpanded);
    },
    [setExpanded],
  );

  const handlePageItemClick = React.useCallback(
    (itemId: string, hasNestedNavigation: boolean) => {
      if (hasNestedNavigation && !mini) {
        setExpandedItemIds((previousValue) =>
          previousValue.includes(itemId)
            ? previousValue.filter((previousValueItemId) => previousValueItemId !== itemId)
            : [...previousValue, itemId],
        );
      } else if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [mini, setExpanded, isOverSmViewport],
  );

  const hasDrawerTransitions = isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const isItemActive = (item: NavSection['items'][number]): boolean =>
    !!matchPath(item.href, pathname) ||
    (item.href === '/' && pathname === '/') ||
    !!item.children?.some((child) => isItemActive(child));

  const renderNavItem = (item: NavSection['items'][number]): React.ReactNode => (
    <SidebarNavItem
      key={item.id}
      id={item.id}
      title={item.title}
      icon={item.icon}
      href={item.href}
      selected={isItemActive(item)}
      defaultExpanded={isItemActive(item)}
      expanded={expandedItemIds.includes(item.id)}
      nestedNavigation={
        item.children ? (
          <List dense sx={{ padding: 0, my: 1, pl: mini ? 0 : 1, minWidth: 240 }}>
            {item.children.map((child) => renderNavItem(child))}
          </List>
        ) : undefined
      }
    />
  );

  const getDrawerContent = (viewport: 'phone' | 'tablet' | 'desktop') => (
    <React.Fragment>
      <Toolbar />
      <Box
        component="nav"
        aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
        sx={[
          {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'auto',
            scrollbarGutter: mini ? 'stable' : 'auto',
            overflowX: 'hidden',
            pt: !mini ? 0 : 2,
          },
          hasDrawerTransitions ? getDrawerSxTransitionMixin(isFullyExpanded, 'padding') : null,
        ]}
      >
        <List
          dense
          sx={{
            padding: mini ? 0 : 0.5,
            mb: 4,
            width: mini ? MINI_DRAWER_WIDTH : 'auto',
          }}
        >
          {navSections.map((section, index) => (
            <React.Fragment key={section.title ?? index}>
              {index > 0 ? <SidebarDivider /> : null}
              {section.title ? <SidebarSectionHeader>{section.title}</SidebarSectionHeader> : null}
              {section.items.map((item) => renderNavItem(item))}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </React.Fragment>
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary: boolean) => (drawerTheme: Theme) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;
      const widthTransitionStyles = getDrawerSxTransitionMixin(expanded, 'width')(drawerTheme);

      return {
        displayPrint: 'none',
        width: drawerWidth,
        flexShrink: 0,
        ...widthTransitionStyles,
        overflowX: 'hidden',
        ...(isTemporary ? { position: 'absolute' } : {}),
        [`& .MuiDrawer-paper`]: {
          position: 'absolute',
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundImage: 'none',
          ...widthTransitionStyles,
          overflowX: 'hidden',
        },
      };
    },
    [expanded, mini],
  );

  const sidebarContextValue = React.useMemo(
    () => ({
      onPageItemClick: handlePageItemClick,
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions,
    }),
    [handlePageItemClick, mini, isFullyExpanded, isFullyCollapsed, hasDrawerTransitions],
  );

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        ModalProps={{ keepMounted: true }}
        sx={[
          {
            display: {
              xs: 'block',
              sm: disableCollapsibleSidebar ? 'block' : 'none',
              md: 'none',
            },
          },
          getDrawerSharedSx(true),
        ]}
      >
        {getDrawerContent('phone')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={[
          {
            display: {
              xs: 'none',
              sm: disableCollapsibleSidebar ? 'none' : 'block',
              md: 'none',
            },
          },
          getDrawerSharedSx(false),
        ]}
      >
        {getDrawerContent('tablet')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={[{ display: { xs: 'none', md: 'block' } }, getDrawerSharedSx(false)]}
      >
        {getDrawerContent('desktop')}
      </Drawer>
    </SidebarContext.Provider>
  );
}
