// import style from './sidebar.module.css';
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import useLayoutStore from '../../../store/layoutStore';
// import useAuthStore from '../../../store/authStore';
// import DropdownMenu from '../../../components/dropdown';

// // Icons
// import TemplatesIcon from '../../../icon-components/TemplatesIcon';
// import DashboardIcon from '../../../icon-components/DashboardIcon';
// import SettingsIcon from '../../../icon-components/SettingsIcon';

// // Types
// import FeeIcon from "../../../icon-components/FeeIcon";
// import useRoleStore from "../../../store/roleStore";
// import UsersIcon from "../../../icon-components/UsersIcon";
// import { ModuleIF } from '../../../store/moduleStore';
// import StarIcon from '../../../icon-components/StartIcon';
// import FormIcon from '../../../icon-components/FormIcon';

// // Define type for main menu items
// interface MainMenuItem {
//   key: string;
//   name: string;
//   path: string;
//   subMenuItems: {
//     key: string;
//     name: string;
//     path: string;
//   }[];
// }

// const SidebarComponent: React.FC = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { sidebar, setSidebar } = useLayoutStore();
//   const { getUserRole, userRole, sidebarNavItems } = useRoleStore();


//   const [activeMainMenu, setActiveMainMenu] = useState<string | null>(null);
//   const [modules, setModules] = useState<ModuleIF[]>([]);
//   const [expand, setExpand] = useState<boolean>(false);

//   useEffect(() => {
//     if (user?.user.role._id) {
//       getUserRole(user.user.role._id);
//     }
//   }, [user, getUserRole]);

//   useEffect(() => {
//     if (userRole) {
//       setModules(userRole.modules);
//     }
//   }, [userRole]);

//   // Determine current path
//   const currentPath = location.pathname;


//   useEffect(() => {
//     if (currentPath === "/dashboard") {
//       setActiveMainMenu("dashboard");
//     } else {
    
//       modules?.map((mainMenu) => {
        
//         if (mainMenu.menuType === "mainMenu" && currentPath.startsWith(mainMenu.path)) {
//           setExpand(true);
//           setActiveMainMenu(mainMenu.key);
//         }
//         if (mainMenu.menuType === 'subMenu' && currentPath.startsWith(`/${mainMenu.key}`)) {
//           setExpand(true);
//           setActiveMainMenu(mainMenu.mainMenu);
//         }
//       });
//     }
//   }, [currentPath , modules]);

//   // Handle menu item navigation
//   const handleNavigation = (navigatePath: string, mainMenuKey: string | null = null, subMenuItems: boolean) => {
//     sidebarNavItems.forEach((item) => {
//       if (item.path === navigatePath && item.subMenuItems[0]?.path) {
//         navigatePath = item.subMenuItems[0].path;
//       }
//     });
//     navigate(navigatePath);
//     if (mainMenuKey) {
//       if (mainMenuKey === activeMainMenu) {
//         setExpand(!expand);
//         setActiveMainMenu(mainMenuKey);
//       } else {
//         setExpand(true);
//         setActiveMainMenu(mainMenuKey);
//       }
//     }
//     if (!subMenuItems) setSidebar(!sidebar);
//   };

//   // Handle dropdown menu options
//   const dropdownHandler = (option: string) => {
//     if (option === 'Logout') logout();
//     if (option === 'Account') window.location.replace(`/employee/view/${user?.user._id}`);
//   };

//   return (
//     <div className={`${style.container} ${sidebar ? '' : style.hideSidebar}`}>
//       <div className={style.innerContainerLeft}>
//         <div onClick={() => handleNavigation('/dashboard', null, false)} className={style.orgLogo}>
//           Coorg Institute of Technology
//         </div>
//         <div className={style.profileBox}>
//           <div className={style.profileDetails}>
//             <div className={style.userName}>
//               {user?.user?.firstName} {user?.user?.lastName}
//             </div>
//             <div className={style.userRole}>{user?.user?.role.name}</div>
//           </div>
//           <DropdownMenu onChange={dropdownHandler} options={['Account', 'Logout']}>
//             <div className={style.profileText}>
//               {user?.user?.firstName[0]}
//               {user?.user?.lastName[0]}
//             </div>
//           </DropdownMenu>
//         </div>
//         <div className={style.navContainer}>
//           {sidebarNavItems.map((mainMenu) => {            
//             const isActiveMainMenu = activeMainMenu === mainMenu.key;


//             return (
//               <div key={mainMenu.key}>
//                 <div
//                   onClick={() => handleNavigation(mainMenu.path, mainMenu.key, Boolean(mainMenu.subMenuItems.length))}
//                   className={`${style.navBoxWide} ${isActiveMainMenu ? style.selectedMainMenuNavBox : ''}`}
//                 >
//                   {getMenuIcon(mainMenu.key)}
//                   <div className={`${style.navText} ${isActiveMainMenu ? style.selectedMainMenu : ''}`}>
//                     {mainMenu.name}
//                   </div>
//                 </div>
//                 {isActiveMainMenu &&
//                   expand &&
//                   mainMenu.subMenuItems.map((subMenu) => {                    
//                     const isSelectedSubMenu = currentPath.startsWith(`/${subMenu.key}`);
//                     return (
//                       <div
//                         key={subMenu.key}
//                         onClick={() => handleNavigation(subMenu.path, null, false)}
//                         className={`${style.subMenuItem} ${isSelectedSubMenu ? style.selectedSubMenuItem : ''}`}
//                       >
//                         {getMenuIcon(subMenu.key)}
//                         <div className={style.subMenuText}>{subMenu.name}</div>
//                       </div>
//                     );
//                   })}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div className={style.innerContainerRight} onClick={() => setSidebar(false)} />
//     </div>
//   );
// };

// export default SidebarComponent;

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
console.log('mainMenuItems',mainMenuItems)
  return mainMenuItems;
};

// // Helper function to get the correct icon based on the menu key
// const getMenuIcon = (key: string) => {
//   switch (key) {
//     case 'dashboard':
//       return <DashboardIcon fill="white" />;
//     case "user":
//     case "employee":
//     case "student":
//     case "group":
//       return <UsersIcon fill="white" />;
//     case 'setting':
//       return <SettingsIcon fill="white" />;
//     case 'role':
//       return <StarIcon fill="white" />;
//     case "feesCategory":
//       return <FeeIcon fill="white" />
//     case 'formbuilder':
//     case 'timetable':
//     case 'calendar':
//       return <FormIcon fill="white" />;
//     default:
//       return <TemplatesIcon fill="white" />;
//   }
// };


import style from "./sidebar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Nav, Button, Collapse, Form } from "react-bootstrap";
import useAuthStore from "../../../store/authStore";
import useInstituteStore from "../../../store/instituteStore";
import Icon from "../../../components/Icons";
import { createPortal } from "react-dom";
import Switch from "@mui/material/Switch";
import { useMediaQuery } from "@mui/material";

interface SidebarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function SidebarComponent({ theme, toggleTheme }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [aNavBar, setANavBar] = useState<
    Record<string, { icon?: string; children: any[] }>
  >({});
  const { user, logout } = useAuthStore();
  const { getInstitute } = useInstituteStore();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [activePopoverMenu, setActivePopoverMenu] = useState<string | null>(
    null
  );
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [insCode, setInsCode] = useState("");

  //default side nav collapsed on tablet
  // const isTabletOrLess = useMediaQuery("(max-width:900px)");

  // // Collapse sidebar based on screen size
  // useEffect(() => {
  //   setCollapsed(isTabletOrLess);
  // }, [isTabletOrLess]);

  // Fetch institute code
  useEffect(() => {
    if (user && getInstitute) {
      (async () => {
        const oInstituteDtls = await getInstitute(user?.user?.insId);
        if (oInstituteDtls && Object.keys(oInstituteDtls).length) {
          setInsCode(oInstituteDtls?.insCode);
        }
      })();
    }
  }, [user, getInstitute]);

  // 🔍 Search filter
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const results: any[] = [];
    Object.keys(aNavBar).forEach((menu) => {
      aNavBar[menu].children.forEach((sub) => {
        if (sub.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(sub);
        }
      });
    });
    setSearchResults(results);
  }, [searchTerm, aNavBar]);

  // Build menu data
  useEffect(() => {
    if (user?.role?.modules) {
      const mainMenus = user?.role?.modules.filter(
        (item) =>
          item.menuType === "mainMenu" &&
          !item.deleted &&
          item.permissions.read
      );

      const oNavData: Record<string, { icon?: string; children: any[] }> = {};

      mainMenus.forEach((mainMenu) => {
        const subMenus = user?.role?.modules.filter(
          (item) =>
            item.menuType === "subMenu" &&
            item.mainMenu === mainMenu.key &&
            !item.deleted &&
            item.permissions.read
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

      setANavBar(oNavData);
    }
  }, [user?.role?.modules]);

  const toggleMenu = (menuKey: string) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleMainMenuClick = (
    menuKey: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (activePopoverMenu) {
      closePopover();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({ top: rect.top, left: rect.right });
    setActivePopoverMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const closePopover = () => setActivePopoverMenu(null);

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopoverMenu(null);
      }
    };
    if (activePopoverMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopoverMenu]);

  const navLinkClass = (path: string) =>
    `d-flex align-items-center gap-2 px-3 py-2 me-2 rounded text-decoration-none ${
      location.pathname === path
        ? `${style.activeLink} bg-light text-success !important`
        : ""
    }`;

  return (
    <aside
      className="d-flex flex-column"
      style={{
    width: "fit-content",
    height: "98vh",                // Slightly shorter than 100vh
    margin: "10px",                // Push it inward so radius is visible
    borderRadius: "12px",          // Rounded corners
    color: "var(--sidebar-text)",
    backgroundColor: "var(--sidebar-bg)",
    boxShadow: "13px 13px 15px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",            // Ensures inner content respects radius
  }}
    >
      {/* Logo Row */}
      <div
        className="p-3 d-flex align-items-center justify-content-between border-bottom"
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <div
          className="fs-4"
          style={{
            cursor: "pointer",
            color: theme === "dark" ? "#0f0" : "#198754",
          }}
          onClick={() => navigate("/dashboard")}
        >
          {insCode}
        </div>

        <Button
          variant="link"
          className="p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Icon
            name={collapsed ? "ChevronRight" : "ChevronLeft"}
            size={20}
            style={{ transition: "transform 0.2s" }}
            color= "var(--sidebar-text)"
          />
        </Button>
      </div>

      {/* 🌙 Theme Switcher */}
      <div
        className={`px-3 py-2 border-bottom d-flex align-items-center ${
          collapsed ? "justify-content-center" : ""
        }`}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <Switch checked={theme === "dark"} onChange={toggleTheme} />
        <span className="ms-2">
          {!collapsed && (theme === "dark" ? "Dark Mode" : "Light Mode")}
        </span>
      </div>

      {/* 🔍 Search Bar */}
      {!collapsed && (
        <div
          className="px-3 pb-2 pt-2"
          style={{ backgroundColor: "var(--sidebar-bg)" }}
        >
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Menu Section */}
      {searchTerm ? (
        <Nav className="flex-column">
          {searchResults.length > 0 ? (
            searchResults.map((sub, idx) => (
              <Link
                key={idx}
                to={sub.path || "#"}
                className={navLinkClass(sub.path || "#")}
              >
                <Icon name={sub.icon} size={16} color= "var(--sidebar-text)"/>
                {sub.name}
              </Link>
            ))
          ) : (
            <div className="px-3">No matches found</div>
          )}
        </Nav>
      ) : (
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            backgroundColor: "var(--sidebar-bg)",
          }}
        >
          <Nav className="flex-column">
            {Object.keys(aNavBar).map((eachNav) => {
              const menu = aNavBar[eachNav];

              if (collapsed) {
                return (
                  <div key={eachNav} className="position-relative">
                    <Button
                      variant="link"
                      className="d-flex align-items-center justify-content-center py-3 w-100 text-decoration-none"
                      onClick={(e) => handleMainMenuClick(eachNav, e)}
                    >
                      <Icon name={menu.icon} size={20} color= "var(--sidebar-text)"/>
                    </Button>
                  </div>
                );
              }

              return (
                <div key={eachNav} style={{ backgroundColor: "var(--sidebar-bg)" }}>
                  <Button
                    variant="link"
                    className="d-flex align-items-center justify-content-between gap-5 px-3 py-2 w-100 text-start text-decoration-none"
                    style={{ color: "var(--sidebar-text)" }}
                    onClick={() => toggleMenu(eachNav)}
                  >
                    <span className="d-flex align-items-center gap-3">
                      <Icon name={menu.icon} size={20} color= "var(--sidebar-text)"/>
                      {eachNav}
                    </span>
                    <Icon
                      name={openMenu === eachNav ? "ChevronUp" : "ChevronDown"}
                      size={16}
                      style={{ transition: "transform 0.2s" }}
                      color= "var(--sidebar-text)"
                    />
                  </Button>

                  <Collapse in={openMenu === eachNav}>
                    <div className="ms-4">
                      {menu.children.map((sub, i) => (
                        <Link
                          key={i}
                          to={sub.path || "#"}
                          className={navLinkClass(sub.path || "#")}
                          style={{ color: "var(--sidebar-text)" }}
                        >
                          <Icon name={sub.icon} size={16} color= "var(--sidebar-text)"/>
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </Nav>
        </div>
      )}

      {/* Profile Section */}
      {!collapsed ? (
        <div
          className="p-3 border-top"
          style={{ flexShrink: 0, backgroundColor: "var(--sidebar-bg)" }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className={style.profileText}>
              {user?.user?.firstName?.[0]}
              {user?.user?.lastName?.[0]}
            </div>
            <div>
              <div className="fw-medium">
                {`${user?.user?.firstName || ""} ${user?.user?.lastName || ""}`}
              </div>
              <div style={{ fontSize: "0.9rem" }}>{user?.user?.email}</div>
            </div>
          </div>
          <Button
            variant="outline-secondary"
            className="w-100 mt-3"
            style={{
              backgroundColor: "var(--logout-button)",
              color: "var(--logout-text)",
            }}
            onClick={logout}
          >
            Log out
          </Button>
        </div>
      ) : (
        <div
          className="p-2 border-top d-flex justify-content-center"
          style={{ flexShrink: 0 }}
        >
        <Button onClick={logout} 
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
              width: "40px",
              height: "40px",
              backgroundColor: "var(--logout-button)",
              color: "var(--logout-text)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}>
            <Icon name="LogOut" size={18} color= {"var(--logout-text)"}/>
            </Button>
          </div>
      )}

      {/* Floating Popover (collapsed mode only) */}
      {activePopoverMenu &&
        collapsed &&
        createPortal(
          <div
            ref={popoverRef}
            className="position-fixed border rounded shadow p-2"
            style={{
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
              minWidth: "220px",
              zIndex: 1050,
              backgroundColor: "var(--sidebar-bg)",
            }}
          >
            <div
              className="mb-2 rounded p-1"
              style={{
                color: "var(--sidebar-text)",
                backgroundColor: "var(--sidebar-bg)",
                fontWeight: "bold"
              }}
            >
              {activePopoverMenu}
            </div>
            <hr 
            style={{
                color: "var(--sidebar-text)",
                backgroundColor: "var(--sidebar-bg)",
                fontWeight: "bold",
                padding:0
              }}></hr>
            {aNavBar[activePopoverMenu].children.map((sub, i) => (
              <Link
                key={i}
                to={sub.path || "#"}
                className="d-flex align-items-center gap-2 text-decoration-none mb-2"
                onClick={closePopover}
                style={{
                  color: "var(--sidebar-text)",
                }}
              >
                <Icon name={sub.icon} size={16} color={"var(--logout-text)"}/>
                {sub.name}
              </Link>
            ))}
          </div>,
          document.body
        )}
    </aside>
  );
}





