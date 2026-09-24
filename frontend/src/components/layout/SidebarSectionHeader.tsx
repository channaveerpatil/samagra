import * as React from 'react';
import { styled } from '@mui/material/styles';
import ListSubheader from '@mui/material/ListSubheader';
import type {} from '@mui/material/themeCssVarsAugmentation';
import SidebarContext from '@/context/SidebarContext';
import { DRAWER_WIDTH } from '@/lib/constants';
import getDrawerSxTransitionMixin from '@/lib/mixins';

interface StyledSectionHeaderProps {
  mini: boolean;
  fullyExpanded: boolean;
  hasDrawerTransitions: boolean;
}

const StyledSectionHeader = styled(ListSubheader, {
  shouldForwardProp: (prop) =>
    prop !== 'mini' && prop !== 'fullyExpanded' && prop !== 'hasDrawerTransitions',
})<StyledSectionHeaderProps>(({ theme, mini, fullyExpanded, hasDrawerTransitions }) => ({
  fontSize: 12,
  fontWeight: 600,
  height: mini ? 0 : 36,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: 0,
  paddingBottom: 0,
  minWidth: DRAWER_WIDTH,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  zIndex: 2,
  ...(hasDrawerTransitions ? getDrawerSxTransitionMixin(fullyExpanded, 'height')(theme) : null),
}));

export interface SidebarSectionHeaderProps {
  children?: React.ReactNode;
}

export default function SidebarSectionHeader({ children }: SidebarSectionHeaderProps) {
  const sidebarContext = React.useContext(SidebarContext);
  if (!sidebarContext) {
    throw new Error('Sidebar context was used without a provider.');
  }
  const { mini = false, fullyExpanded = true, hasDrawerTransitions = false } = sidebarContext;

  return (
    <StyledSectionHeader
      mini={mini}
      fullyExpanded={fullyExpanded}
      hasDrawerTransitions={hasDrawerTransitions}
    >
      {children}
    </StyledSectionHeader>
  );
}
