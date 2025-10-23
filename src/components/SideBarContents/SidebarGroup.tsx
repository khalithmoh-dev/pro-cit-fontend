import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import "./sidebar.css"
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

  // Count the number of children for the connecting line
  const childrenArray = React.Children.toArray(children);
  const childrenCount = childrenArray.length;

  return (
    <div 
      className={`sidebar-group ${className}`} 
      style={{
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        ...style
      }}
    >
      {/* Connecting line container */}
      {!collapsed && childrenCount > 0 && (
        <div 
          style={{
            position: 'absolute',
            left: '28px', // Align with the center of the icon
            top: '48px', // Start below the group label
            bottom: '8px', // End before next group
            width: '2px',
            backgroundColor: '#e5e7eb',
            transition: 'all 0.3s ease-in-out',
            opacity: isOpen ? 1 : 0,
            transform: `scaleY(${isOpen ? 1 : 0})`,
            transformOrigin: 'top',
            zIndex: 0,
            borderRadius: '1px'
          }}
        />
      )}
      
      <div
        onClick={handleToggle}
        className={`sidebar-group-label color-primary_text d-flex align-items-center justify-content-between sidebar-group fsd-2 fwd-1
          ${collapsible ? 'collapsible' : ''}
          ${collapsed ? 'collapsed' : ''}
          ${collapsible && !collapsed ? 'cursor-pointer' : ''}`} 
        onMouseEnter={(e) => {
          if (collapsible && !collapsed) {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (collapsible && !collapsed) {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-bg)';
          }
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
                flexShrink: 0,
                position: 'relative',
                zIndex: 2
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
              pointerEvents: collapsed ? 'none' : 'auto',
              textTransform: 'none'
            }}
          >
            {label}
          </span>
        </div>
        {collapsible && !collapsed && (
          <span 
            style={{ 
              transition: 'all 0.3s ease-in-out',
              opacity: collapsed ? 0 : 1,
              flexShrink: 0,
              marginLeft: '0.25rem',
              transform: `rotate(${isOpen ? '0deg' : '-90deg'})`
            }}
          >
            <ChevronDown size={12} />
          </span>
        )}
      </div>
      
      <div 
        className="sidebar-group-content"
        style={{
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            transform: `translateY(${isOpen ? '0' : '-10px'})`
          }}
        >
          {((!collapsible || isOpen) && React.isValidElement(childrenArray[0]) && childrenArray[0].props?.children) && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {childrenArray[0].props.children.map((child, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  {child}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};