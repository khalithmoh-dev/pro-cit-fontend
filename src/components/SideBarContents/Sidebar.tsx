import React from 'react';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  const { collapsed } = useSidebar();
  return (
    <div
      className={`sidebar d-flex flex-column h-100 sidebar-text-content ${
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      } ${className}`}
      style={{ zIndex: 1050 }}
    >
      {children}
    </div>
  );
};