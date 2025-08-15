import style from './sidebar.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLayoutStore from '../../../store/layoutStore';
import useAuthStore from '../../../store/authStore';
import DropdownMenu from '../../../components/dropdown';

// Icons
import TemplatesIcon from '../../../icon-components/TemplatesIcon';
import DashboardIcon from '../../../icon-components/DashboardIcon';
import SettingsIcon from '../../../icon-components/SettingsIcon';

// Types
import FeeIcon from "../../../icon-components/FeeIcon";
import useRoleStore from "../../../store/roleStore";
import UsersIcon from "../../../icon-components/UsersIcon";
import { ModuleIF } from '../../../store/moduleStore';
import StarIcon from '../../../icon-components/StartIcon';
import FormIcon from '../../../icon-components/FormIcon';

// Define type for main menu items
interface MainMenuItem {
  key: string;
  name: string;
  path: string;
  subMenuItems: {
    key: string;
    name: string;
    path: string;
  }[];
}

const SidebarComponent: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebar, setSidebar } = useLayoutStore();
  const { getUserRole, userRole, sidebarNavItems } = useRoleStore();


  const [activeMainMenu, setActiveMainMenu] = useState<string | null>(null);
  const [modules, setModules] = useState<ModuleIF[]>([]);
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => {
    if (user?.user.role._id) {
      getUserRole(user.user.role._id);
    }
  }, [user, getUserRole]);

  useEffect(() => {
    if (userRole) {
      setModules(userRole.modules);
    }
  }, [userRole]);

  // Determine current path
  const currentPath = location.pathname;


  useEffect(() => {
    if (currentPath === "/dashboard") {
      setActiveMainMenu("dashboard");
    } else {
    
      modules?.map((mainMenu) => {
        
        if (mainMenu.menuType === "mainMenu" && currentPath.startsWith(mainMenu.path)) {
          setExpand(true);
          setActiveMainMenu(mainMenu.key);
        }
        if (mainMenu.menuType === 'subMenu' && currentPath.startsWith(`/${mainMenu.key}`)) {
          setExpand(true);
          setActiveMainMenu(mainMenu.mainMenu);
        }
      });
    }
  }, [currentPath , modules]);

  // Handle menu item navigation
  const handleNavigation = (navigatePath: string, mainMenuKey: string | null = null, subMenuItems: boolean) => {
    sidebarNavItems.forEach((item) => {
      if (item.path === navigatePath && item.subMenuItems[0]?.path) {
        navigatePath = item.subMenuItems[0].path;
      }
    });
    navigate(navigatePath);
    if (mainMenuKey) {
      if (mainMenuKey === activeMainMenu) {
        setExpand(!expand);
        setActiveMainMenu(mainMenuKey);
      } else {
        setExpand(true);
        setActiveMainMenu(mainMenuKey);
      }
    }
    if (!subMenuItems) setSidebar(!sidebar);
  };

  // Handle dropdown menu options
  const dropdownHandler = (option: string) => {
    if (option === 'Logout') logout();
    if (option === 'Account') window.location.replace(`/employee/view/${user?.user._id}`);
  };

  return (
    <div className={`${style.container} ${sidebar ? '' : style.hideSidebar}`}>
      <div className={style.innerContainerLeft}>
        <div onClick={() => handleNavigation('/dashboard', null, false)} className={style.orgLogo}>
          Coorg Institute of Technology
        </div>
        <div className={style.profileBox}>
          <div className={style.profileDetails}>
            <div className={style.userName}>
              {user?.user?.firstName} {user?.user?.lastName}
            </div>
            <div className={style.userRole}>{user?.user?.role.name}</div>
          </div>
          <DropdownMenu onChange={dropdownHandler} options={['Account', 'Logout']}>
            <div className={style.profileText}>
              {user?.user?.firstName[0]}
              {user?.user?.lastName[0]}
            </div>
          </DropdownMenu>
        </div>
        <div className={style.navContainer}>
          {sidebarNavItems.map((mainMenu) => {            
            const isActiveMainMenu = activeMainMenu === mainMenu.key;


            return (
              <div key={mainMenu.key}>
                <div
                  onClick={() => handleNavigation(mainMenu.path, mainMenu.key, Boolean(mainMenu.subMenuItems.length))}
                  className={`${style.navBoxWide} ${isActiveMainMenu ? style.selectedMainMenuNavBox : ''}`}
                >
                  {getMenuIcon(mainMenu.key)}
                  <div className={`${style.navText} ${isActiveMainMenu ? style.selectedMainMenu : ''}`}>
                    {mainMenu.name}
                  </div>
                </div>
                {isActiveMainMenu &&
                  expand &&
                  mainMenu.subMenuItems.map((subMenu) => {                    
                    const isSelectedSubMenu = currentPath.startsWith(`/${subMenu.key}`);
                    return (
                      <div
                        key={subMenu.key}
                        onClick={() => handleNavigation(subMenu.path, null, false)}
                        className={`${style.subMenuItem} ${isSelectedSubMenu ? style.selectedSubMenuItem : ''}`}
                      >
                        {getMenuIcon(subMenu.key)}
                        <div className={style.subMenuText}>{subMenu.name}</div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.innerContainerRight} onClick={() => setSidebar(false)} />
    </div>
  );
};

export default SidebarComponent;

export const transformNavData = (data: ModuleIF[]): MainMenuItem[] => {
  const mainMenuItems: MainMenuItem[] = [];

  const mainMenus = data.filter((item) => item.menuType === 'mainMenu' && !item.deleted && item.permissions.read);

  mainMenus.forEach((mainMenu) => {
    const subMenus = data.filter(
      (item) => item.menuType === 'subMenu' && item.mainMenu === mainMenu.key && !item.deleted && item.permissions.read,
    );

    mainMenuItems.push({
      key: mainMenu.key,
      name: mainMenu.name,
      path: mainMenu.path,
      subMenuItems: subMenus.map((subMenu) => ({
        key: subMenu.key,
        name: subMenu.name,
        path: subMenu.path,
      })),
    });
  });

  return mainMenuItems;
};

// Helper function to get the correct icon based on the menu key
const getMenuIcon = (key: string) => {
  switch (key) {
    case 'dashboard':
      return <DashboardIcon fill="white" />;
    case "user":
    case "employee":
    case "student":
    case "group":
      return <UsersIcon fill="white" />;
    case 'setting':
      return <SettingsIcon fill="white" />;
    case 'role':
      return <StarIcon fill="white" />;
    case "feesCategory":
      return <FeeIcon fill="white" />
    case 'formbuilder':
    case 'timetable':
    case 'calendar':
      return <FormIcon fill="white" />;
    default:
      return <TemplatesIcon fill="white" />;
  }
};
