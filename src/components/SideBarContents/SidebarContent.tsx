import React from 'react';

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex-grow-1 overflow-auto pt-2 ${className}`}>
      {children}
    </div>
  );
};