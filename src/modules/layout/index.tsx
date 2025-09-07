import { useState, useEffect } from 'react';
import SidebarComponent from './sidebar';
import { Outlet } from 'react-router-dom';

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
    <div className="ps-2" style={{ display: 'flex', height: '100vh', overflow: 'hidden'}}>
      <>
      <SidebarComponent theme={theme} toggleTheme={toggleTheme}/>
      <main style={{ flex: 1, overflowY: 'auto', margin: '10px', borderRadius:'10px', color: 'var(--main-text)'}}>
        <Outlet />
      </main>
 </>
    </div>
  );
};

export default Layout;
