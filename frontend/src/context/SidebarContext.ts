import * as React from 'react';

interface SidebarContextValue {
  onPageItemClick: (id: string, hasNestedNavigation: boolean) => void;
  mini: boolean;
  fullyExpanded: boolean;
  fullyCollapsed: boolean;
  hasDrawerTransitions: boolean;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export default SidebarContext;
