import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext';

interface SidebarItemProps {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  children,
  className = '',
}) => {
  const location = useLocation();
  const { collapsed } = useSidebar();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`sidebar-item ${isActive ? 'active' : ''} ${className}`}
      title={collapsed ? children?.toString() : undefined}
    >
      {icon && (
        <span className="d-flex align-items-center justify-content-center" style={{ minWidth: '20px' }}>
          {icon}
        </span>
      )}
      {!collapsed && <span style={{fontSize: "0.9rem", padding:"0"}}>{children}</span>}
    </Link>
  );
};