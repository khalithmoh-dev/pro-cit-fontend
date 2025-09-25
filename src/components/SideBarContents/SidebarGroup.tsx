import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface SidebarGroupProps {
  children: React.ReactNode;
  label?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
  icon?: React.ReactNode
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  children,
  label,
  collapsible = false,
  defaultOpen = true,
  className = '',
  icon
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { collapsed } = useSidebar();

  const handleToggle = () => {
    if (collapsible && !collapsed) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`mb-3 ${className}`}>
        <div
          className={`sidebar-group-label d-flex align-items-center justify-content-between ${(collapsible && !collapsed) ? 'cursor-pointer' : ''
            }`}
          onClick={handleToggle}
          style={{ cursor: (collapsible && !collapsed) ? 'pointer' : 'default' }}
        >
          <div className='d-flex align-items-center'>
            {icon && (
              <span className="d-flex align-items-center justify-content-center" style={{ minWidth: '20px' }}>
                {icon}
              </span>
            )}
            {!collapsed && <span className='px-3'>{label}</span>}
         </div>
          {collapsible && !collapsed && (
            <span style={{ fontSize: '12px' }}>
              {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          )}
        </div>
      {(!collapsible || isOpen) && (
        <div className="sidebar-group-content">
          {children}
        </div>
      )}
    </div>
  );
};