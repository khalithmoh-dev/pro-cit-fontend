// contexts/NavigationContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import useAuthStore, { User } from '../../store/authStore';

/**
 * Navigation context type definition
 * @property {Record<string, any>} oNavBar - Organized navigation data structure with main menus as keys
 * @property {User['user']} userDtls - User details from authentication store
 */
interface NavigationContextType {
  oNavBar: Record<string, any>;
  userDtls: User['user']
}

/**
 * React context for providing navigation data throughout the application
 * Contains organized navigation structure and user details for menu rendering
 */
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Navigation Provider Component
 * 
 * Provides navigation context to the entire application by:
 * - Organizing user modules into a hierarchical navigation structure
 * - Filtering and grouping main menus with their respective sub-menus
 * - Making user details available for role-based UI rendering
 * 
 * @param {React.ReactNode} children - Child components that will consume the navigation context
 * @returns {JSX.Element} Context provider wrapper component
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  
  /**
   * Organizes user modules into a structured navigation object
   * 
   * Transforms flat modules array into hierarchical navigation structure:
   * - Filters main menus and their corresponding sub-menus
   * - Groups sub-menus under their respective main menus
   * - Only includes modules with read permissions that are not deleted
   * 
   * Structure:
   * {
   *   "Main Menu Name": {
   *     icon: "menu-icon",
   *     children: [
   *       { key: "sub-key", name: "Sub Menu", path: "/path", icon: "sub-icon" }
   *     ]
   *   }
   * }
   * 
   * @returns {Record<string, any>} Organized navigation data object
   */
  const oNavBar = useMemo(() => {
    // Return empty object if no user modules available
    if (!user?.user?.modules) return {};

    // Filter main menus that are active and have read permissions
    const mainMenus = (user?.user?.modules ?? []).filter(
      (item) => item.menuType === 'mainMenu' && !item.deleted && item.permissions.read,
    );

    // Initialize navigation data structure
    const oNavData: Record<string, { icon?: string; children: any[] }> = {};

    // Process each main menu to find and group its sub-menus
    mainMenus.forEach((mainMenu) => {
      // Filter sub-menus belonging to current main menu
      const subMenus = (user?.user?.modules ?? []).filter(
        (item) =>
          item.menuType === 'subMenu' &&
          item.mainMenu === mainMenu.key &&
          !item.deleted &&
          item.permissions.read,
      );

      // Initialize main menu entry if it doesn't exist
      if (!oNavData[mainMenu.name]) {
        oNavData[mainMenu.name] = {
          children: [],
          icon: mainMenu.icon,
        };
      }

      // Map sub-menus to navigation items
      oNavData[mainMenu.name].children = subMenus.map((subMenu) => ({
        key: subMenu.key,
        name: subMenu.name,
        path: subMenu.path,
        icon: subMenu.icon,
      }));
    });

    return oNavData;
  }, [user?.user?.modules]); // Recompute when user modules change

  return (
    <NavigationContext.Provider value={{ oNavBar, userDtls: user?.user }}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Custom hook to access navigation context
 * 
 * Provides easy access to:
 * - Organized navigation structure (oNavBar) for rendering menus
 * - User details (userDtls) for role-based UI logic
 * 
 * @returns {NavigationContextType} Navigation context value
 * @throws {Error} If used outside of NavigationProvider
 * 
 * @example
 * const { oNavBar, userDtls } = useNavigationData();
 * const instituteName = userDtls?.institutes?.insName?.[0];
 */
export const useNavigationData = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationData must be used within a NavigationProvider');
  }
  return context;
};