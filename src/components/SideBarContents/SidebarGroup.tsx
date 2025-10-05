import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface SidebarGroupProps {
  children: React.ReactNode;
  label?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  children,
  label,
  collapsible = false,
  defaultOpen = true,
  className = '',
  icon,
  style
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { collapsed } = useSidebar();

  const handleToggle = () => {
    if (collapsible && !collapsed) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      className={`sidebar-group ${className}`} 
      style={{
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease-in-out',
        ...style
      }}
    >
      <div
        className={`sidebar-group-label d-flex align-items-center justify-content-between ${
          (collapsible && !collapsed) ? 'cursor-pointer' : ''
        }`}
        onClick={handleToggle}
        style={{ 
          cursor: (collapsible && !collapsed) ? 'pointer' : 'default',
          padding: '0.5rem 0.75rem',
          transition: 'all 0.3s ease-in-out',
          borderRadius: '0.375rem',
          margin: '0 0.25rem'
        }}
      >
        <div className='d-flex align-items-center' style={{ overflow: 'hidden', flex: 1 }}>
          {icon && (
            <span 
              className="d-flex align-items-center justify-content-center" 
              style={{ 
                minWidth: '20px',
                transition: 'all 0.3s ease-in-out',
                transform: collapsed ? 'scale(0.9)' : 'scale(1)',
                flexShrink: 0
              }}
            >
              {icon}
            </span>
          )}
          <span
            style={{
              transition: 'all 0.3s ease-in-out',
              opacity: collapsed ? 0 : 1,
              transform: `translateX(${collapsed ? '-5px' : '0'})`,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              flex: collapsed ? '0 1 0px' : '1 1 auto',
              width: collapsed ? '0' : 'auto',
              marginLeft: collapsed ? '0' : '0.5rem',
              pointerEvents: collapsed ? 'none' : 'auto'
            }}
          >
            {label}
          </span>
        </div>
        {collapsible && !collapsed && (
          <span 
            style={{ 
              fontSize: '12px',
              transition: 'all 0.3s ease-in-out',
              opacity: collapsed ? 0 : 1,
              flexShrink: 0,
              marginLeft: '0.25rem'
            }}
          >
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
      </div>
      
      <div 
        className="sidebar-group-content"
        style={{
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden'
        }}
      >
        {(!collapsible || isOpen) && children}
      </div>
    </div>
  );
};