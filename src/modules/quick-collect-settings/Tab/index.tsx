import React from 'react';
import '../fee-head-settings/quick-collect-settings.css';

// Define the types for the props
interface TabProps {
  label: string;         // The label text for the tab
  isActive: boolean;     // Whether the tab is active
  onClick: () => void;   // Click handler function for the tab
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <div 
      className={`tab ${isActive ? 'active' : ''}`} 
      onClick={onClick}
      style={{ fontSize: "16px", fontWeight: "300", margin:"8px" }}
    >
      {label}
    </div>
  );
};

export default Tab;
