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
    (! collapsed && <div style={{ position: 'relative', padding: '0.125rem 0' }}>
      {/* Connecting dot */}
      {!collapsed && (
        <div
          style={{
            position: 'absolute',
            left: '22px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            backgroundColor: isActive ? '#3b82f6' : '#9ca3af',
            borderRadius: '50%',
            transition: 'all 0.2s ease-in-out',
            zIndex: 1,
            boxShadow: isActive ? '0 0 0 1px rgba(59, 130, 246, 0.2)' : 'none'
          }}
        />
      )}
      
      <Link
        to={to}
        className={`sidebar-item ${isActive ? 'active' : ''} ${className}`}
        title={collapsed ? children?.toString() : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.375rem 0.5rem 0.375rem 2rem',
          textDecoration: 'none',
          color: 'var(--sidebar-text)',
          borderRadius: '0.25rem',
          margin: '0 0.125rem',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          zIndex: 2,
          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          border: isActive ? '1px solid rgba(59, 130, 246, 0.15)' : '1px solid transparent',
          transform: `translateX(${isActive ? '2px' : '0'})`,
          minHeight: '32px'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
            e.currentTarget.style.transform = 'translateX(1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }
        }}
      >
        {icon && (
          <span 
            className="d-flex align-items-center justify-content-center" 
            style={{ 
              minWidth: '16px',
              width: '16px',
              height: '16px',
              transition: 'all 0.2s ease-in-out',
              transform: `scale(${isActive ? '1.05' : '1'})`,
              color: isActive ? '#3b82f6' : 'var(--sidebar-text)',
              fontSize: '14px'
            }}
          >
            {icon}
          </span>
        )}
        {!collapsed && (
          <span 
            style={{
              fontSize: "0.8rem", 
              padding: "0",
              marginLeft: '0.375rem',
              transition: 'all 0.2s ease-in-out',
              fontWeight: isActive ? '500' : '400',
              color: isActive ? '#3b82f6' : 'var(--sidebar-text)',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {children}
          </span>
        )}
      </Link>
    </div>)
  );
};