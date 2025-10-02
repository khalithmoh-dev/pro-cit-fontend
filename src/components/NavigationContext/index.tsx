// contexts/NavigationContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import useAuthStore from '../../store/authStore';

interface NavigationContextType {
  oNavBar: Record<string, any>;
  userDtls: object
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();

  const oNavBar = useMemo(() => {
    if (!user?.role?.modules) return {};

    const mainMenus = user.role.modules.filter(
      (item) => item.menuType === 'mainMenu' && !item.deleted && item.permissions.read,
    );

    const oNavData: Record<string, { icon?: string; children: any[] }> = {};

    mainMenus.forEach((mainMenu) => {
      const subMenus = user.role.modules.filter(
        (item) =>
          item.menuType === 'subMenu' && 
          item.mainMenu === mainMenu.key && 
          !item.deleted && 
          item.permissions.read,
      );

      if (!oNavData[mainMenu.name]) {
        oNavData[mainMenu.name] = {
          children: [],
          icon: mainMenu.icon,
        };
      }

      oNavData[mainMenu.name].children = subMenus.map((subMenu) => ({
        key: subMenu.key,
        name: subMenu.name,
        path: subMenu.path,
        icon: subMenu.icon,
      }));
    });

    return oNavData;
  }, [user?.role?.modules]);

  return (
    <NavigationContext.Provider value={{ oNavBar, userDtls: user?.user }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationData = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationData must be used within a NavigationProvider');
  }
  return context;
};