import useAuthStore from '../../store/authStore';
import LogoIcon from '../../icon-components/LogoIcon';
import style from './layout.module.css';
import { useEffect, useState } from 'react';
import SidebarComponent from './sidebar';
// import HeaderComponent from './header';

interface PropsIF {
  children?: JSX.Element[] | JSX.Element;
}

const Layout: React.FC<PropsIF> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated)
    return (
      <div className={style.container}>
        <SidebarComponent />
        <div className={style.headerContainer}>
          {/* <HeaderComponent /> */}
          <div className={style.contentContainer}>{children}</div>
        </div>
      </div>
    );
  else
    return (
      <div className={style.container}>
        <div className={style.contentContainer}>{children}</div>
      </div>
    );
};

export default Layout;
