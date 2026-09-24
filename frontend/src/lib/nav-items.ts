import * as React from 'react';
import type { Permission } from '@/lib/auth/permissions';

export interface NavItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  href: string;
  requiredPermission?: Permission;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

function filterNavItems(items: NavItem[], can: (permission: Permission) => boolean): NavItem[] {
  return items.reduce<NavItem[]>((visibleItems, item) => {
    if (item.requiredPermission && !can(item.requiredPermission)) {
      return visibleItems;
    }

    const children = item.children ? filterNavItems(item.children, can) : undefined;

    if (item.children && children?.length === 0) {
      return visibleItems;
    }

    visibleItems.push(children ? { ...item, children } : item);
    return visibleItems;
  }, []);
}

export function filterNavSectionsByPermission(
  sections: NavSection[],
  can: (permission: Permission) => boolean,
): NavSection[] {
  return sections.reduce<NavSection[]>((visibleSections, section) => {
    const items = filterNavItems(section.items, can);
    if (items.length > 0) {
      visibleSections.push({ ...section, items });
    }
    return visibleSections;
  }, []);
}
