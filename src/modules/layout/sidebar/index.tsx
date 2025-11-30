import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  useSidebar
} from '../../../components/SideBarContents';
import useAuthStore from '../../../store/authStore';
import Icon from '../../../components/Icons';
import {useNavigationData} from '../../../components/NavigationContext'
import { useNavigate } from 'react-router-dom';

export const AppSidebar: React.FC = () => {
  const { collapsed } = useSidebar();
  const { oNavBar, userDtls } = useNavigationData();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      {/* Institute Section */}
      <div 
        style={{ 
          padding: '1rem 0.75rem', 
          borderBottom: '1px solid #e5e7eb', 
          cursor: "pointer",
          transition: 'all 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          minHeight: '73px',
          margin: '0 0.5rem',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem'
        }} 
        onClick={() => { navigate('/institute/form') }}
      >
        <div 
          className="profileText"
          style={{
            transition: 'all 0.3s ease-in-out',
            flexShrink: 0,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
          }}
        >
          {userDtls?.institutes?.insName?.[0]}
        </div>
        <div 
          className='d-flex flex-column'
          style={{
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            opacity: collapsed ? 0 : 1,
            transform: `translateX(${collapsed ? '-8px' : '0'})`,
            marginLeft: collapsed ? '0' : '0.75rem',
            width: collapsed ? '0' : '100%',
            flex: collapsed ? '0 1 0px' : '1 1 auto'
          }}
        >
          <span style={{ 
            fontSize: "14px", 
            fontWeight: "600",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#1f2937'
          }}>
            {userDtls?.institutes?.insCode || ""}
          </span>
          <span style={{ 
            fontSize: "12px", 
            fontWeight: "400",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#6b7280',
            textTransform: 'none'
          }}>
            {userDtls?.institutes?.insName || ""}
          </span>
        </div>
      </div>

      <SidebarContent >
        {Object.entries(oNavBar).map(([groupName, group]) => {
          return (
            <SidebarGroup 
              key={groupName} 
              label={groupName}
              collapsible 
              defaultOpen={false} 
              icon={
                <Icon 
                  name={group.icon || ""} 
                />
              }
            >
              {group.children && group.children.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column'}} >
                  {group.children.map((item) => (
                    <SidebarItem 
                      key={item.key} 
                      to={item.path} 
                      icon={<Icon name={item.icon || ""} />}
                    >
                      {item.name}
                    </SidebarItem>
                  ))}
                </div>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* User Profile Section */}
      <div 
        style={{ 
          padding: '1rem 0.75rem', 
          borderBottom: '1px solid #e5e7eb',
          borderTop: '1px solid #e5e7eb',
          transition: 'all 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          minHeight: '64px',
          margin: '0 0.5rem',
          marginBottom: '0.5rem',
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc'
        }} 
      >
        <div 
          className="profileText"
          style={{
            transition: 'all 0.3s ease-in-out',
            flexShrink: 0,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            backgroundColor: '#10b981',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
          }}
        >
          {user?.user?.firstName?.[0]}
          {user?.user?.lastName?.[0]}
        </div>
        <div 
          className='d-flex flex-column'
          style={{
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            opacity: collapsed ? 0 : 1,
            transform: `translateX(${collapsed ? '-8px' : '0'})`,
            marginLeft: collapsed ? '0' : '0.75rem',
            width: collapsed ? '0' : '100%',
            flex: collapsed ? '0 1 0px' : '1 1 auto'
          }}
        >
          <div 
            className="fw-medium"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '14px',
              color: '#1f2937',
              textTransform: 'none'
            }}
          >
            {`${user?.user?.firstName || ''} ${user?.user?.lastName || ''}`}
          </div>
          <div 
            style={{ 
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#6b7280',
              textTransform: 'none'
            }}
          >
            {user?.user?.email}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div 
        style={{ 
          padding: '0.75rem',
          margin: '0 0.5rem',
          marginBottom: '1rem',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
          }}
        >
          <div
            style={{
              transition: 'all 0.3s ease-in-out',
              transform: collapsed ? 'scale(1.1)' : 'scale(1)',
              flexShrink: 0
            }}
          >
            <Icon name="LogOut" color="white" />
          </div>
          {!collapsed && (
            <span
              style={{
                transition: 'all 0.3s ease-in-out',
                opacity: collapsed ? 0 : 1,
                transform: `translateX(${collapsed ? '-5px' : '0'})`,
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              Logout
            </span>
          )}
          {collapsed && (
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'white',
                color: '#ef4444',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                opacity: 0,
                transition: 'all 0.3s ease-in-out'
              }}
              className="logout-tooltip"
            >
              <Icon name="LogOut"/>
            </div>
          )}
        </button>        
      </div>
    </Sidebar>
  );
};