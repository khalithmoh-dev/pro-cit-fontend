import React from 'react';
// import { Menu } from 'lucide-react';
import { IconButton } from '@mui/material';
import { useSidebar } from './SidebarContext';
import Icon from '../Icons';

interface SidebarTriggerProps {
  className?: string;
  position?: string;
}

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className = '', position="left" }) => {
  const { toggle } = useSidebar();
  
  return (
    <IconButton
      onClick={toggle}
      className={className}
      size="small"
      sx={{
        color: 'hsl(var(--foreground))',
        '&:hover': {
          backgroundColor: 'hsl(var(--muted))',
        },
      }}
    >
      {position === 'left' ? <Icon name="PanelLeftDashed" /> : <Icon name="PanelRightDashed" />}
    </IconButton>
  );
};