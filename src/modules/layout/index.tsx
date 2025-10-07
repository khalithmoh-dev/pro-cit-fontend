import { useState, useEffect } from 'react';
import { AppSidebar } from './sidebar';
import { SidebarProvider, SidebarTrigger, useSidebar } from '../../components/SideBarContents'
import { NavigationProvider } from '../../components/NavigationContext'
import { LayoutProvider, useLayout } from './LayoutContext'
import Separator from '../../components/Seperator';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const LayoutInner = () => {
  const { routeNm, actionFields } = useLayout();
  const {permissions} = useAuthStore();
  console.log('permissions',permissions)
  return (
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          backgroundColor: "white",
          transition: 'margin-left 0.3s ease',
          overflowY: "scroll"
        }}
      >
        <div style={{position: "sticky", top:0, zIndex: 1000}}>
          <header className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between shadow-sm" style={{ height: '73px' }}>
            {/* Remove the justify-content-between from this div */}
            <div className='d-flex align-items-center' style={{ gap: '12px' }}>
              <SidebarTrigger />
              <Separator orientation="vertical" />
              <h4 className="mb-0 fw-semibold">{routeNm}</h4>
            </div>

            {/* Action fields container */}
            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              {(actionFields ?? []).map((eachAction, index) => (
                <div key={index}>
                  {eachAction}
                </div>
              ))}
            </div>
          </header>
        </div>

        <div>
          <main style={{ flex: 1, margin: '10px', borderRadius: '10px', color: 'var(--main-text)' }}>
            <Outlet />
          </main>
        </div>
      </div>
  );
};

const Layout = () => {

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: "hidden" }}>
      <LayoutProvider>
        <SidebarProvider>
          <NavigationProvider>
            <AppSidebar />
            <LayoutInner />
          </NavigationProvider>
        </SidebarProvider>
      </LayoutProvider>
    </div>
  );
};

export default Layout;
