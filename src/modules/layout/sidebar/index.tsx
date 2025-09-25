// import style from './sidebar.module.css';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useRef } from 'react';
// import { Nav, Button, Collapse, Form } from 'react-bootstrap';
// import useAuthStore from '../../../store/authStore';
// import useInstituteStore from '../../../store/instituteStore';
// import Icon from '../../../components/Icons';
// import { createPortal } from 'react-dom';
// import Switch from '@mui/material/Switch';
// import { useMediaQuery } from '@mui/material';
// import { Weight } from 'lucide-react';

// interface SidebarProps {
//   theme: 'light' | 'dark';
//   toggleTheme: () => void;
// }

// /**
//  * The screen will contain only update No creation
//  */
// export const AppSidebar = ({ theme, toggleTheme }: SidebarProps) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [aNavBar, setANavBar] = useState<Record<string, { icon?: string; children: any[] }>>({});
//   const { user, logout } = useAuthStore();
//   const { getInstitute } = useInstituteStore();

//   const [openMenu, setOpenMenu] = useState<string | null>(null);
//   const [collapsed, setCollapsed] = useState(true);
//   const [activePopoverMenu, setActivePopoverMenu] = useState<string | null>(null);
//   const [popoverPos, setPopoverPos] = useState<{ top: number; left: number }>({
//     top: 0,
//     left: 0,
//   });
//   const popoverRef = useRef<HTMLDivElement | null>(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [instData, setInstData] = useState({});

//   // Fetch institute code
//   useEffect(() => {
//     if (user && getInstitute) {
//       (async () => {
//         const oInstituteDtls = await getInstitute(user?.user?.insId);
//         if (oInstituteDtls && Object.keys(oInstituteDtls).length) {
//           setInstData(oInstituteDtls);
//         }
//       })();
//     }
//   }, [user, getInstitute]);

//   // 🔍 Search filter
//   useEffect(() => {
//     if (!searchTerm) {
//       setSearchResults([]);
//       return;
//     }
//     const results: any[] = [];
//     Object.keys(aNavBar).forEach((menu) => {
//       aNavBar[menu].children.forEach((sub) => {
//         if (sub.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//           results.push(sub);
//         }
//       });
//     });
//     setSearchResults(results);
//   }, [searchTerm, aNavBar]);

//   // Build side menu data
//   useEffect(() => {
//     if (user?.role?.modules) {
//       const mainMenus = user?.role?.modules.filter(
//         (item) => item.menuType === 'mainMenu' && !item.deleted && item.permissions.read,
//       );

//       const oNavData: Record<string, { icon?: string; children: any[] }> = {};

//       mainMenus.forEach((mainMenu) => {
//         const subMenus = user?.role?.modules.filter(
//           (item) =>
//             item.menuType === 'subMenu' && item.mainMenu === mainMenu.key && !item.deleted && item.permissions.read,
//         );

//         if (!oNavData[mainMenu.name]) {
//           oNavData[mainMenu.name] = {
//             children: [],
//             icon: mainMenu.icon,
//           };
//         }

//         oNavData[mainMenu.name].children = subMenus.map((subMenu) => ({
//           key: subMenu.key,
//           name: subMenu.name,
//           path: subMenu.path,
//           icon: subMenu.icon,
//         }));
//       });

//       setANavBar(oNavData);
//     }
//   }, [user?.role?.modules]);

//   //to set current menu
//   const toggleMenu = (menuKey: string) => {
//     setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
//   };

//   //handle main menu click -> opening submenu in collapsed
//   const handleMainMenuClick = (menuKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
//     if (activePopoverMenu) {
//       closePopover();
//       return;
//     }
//     const rect = e.currentTarget.getBoundingClientRect();
//     setPopoverPos({ top: rect.top, left: rect.right });
//     setActivePopoverMenu((prev) => (prev === menuKey ? null : menuKey));
//   };

//   const closePopover = () => setActivePopoverMenu(null);

//   // Outside click close
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
//         setActivePopoverMenu(null);
//       }
//     };
//     if (activePopoverMenu) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [activePopoverMenu]);

//   //apply selected menu highlight css
//   const navLinkClass = (path: string) =>
//     `d-flex align-items-center gap-2 px-3 py-2 me-2 rounded text-decoration-none ${
//       location.pathname === path ? `${style.activeLink} bg-light text-success !important` : ''
//     }`;

//   return (
//     <aside
//       className="d-flex flex-column"
//       style={{
//         width: 'fit-content',
//         height: '98vh', // Slightly shorter than 100vh
//         margin: '10px', // Push it inward so radius is visible
//         borderRadius: '30px', // Rounded corners
//         color: 'var(--sidebar-text)',
//         backgroundColor: 'var(--sidebar-bg)',
//         boxShadow: '13px 13px 15px rgba(0, 0, 0, 0.15)',
//         overflow: 'hidden', // Ensures inner content respects radius
//       }}
//     >
//       {/* Logo Row */}
//       <div
//         className="p-3 d-flex align-items-center justify-content-between border-bottom"
//         style={{ backgroundColor: 'var(--logout-button)' }}
//       >
//         <div
//           className="fs-4 d-flex flex-column justify-content-center"
//           style={{
//             cursor: 'pointer',
//             color: theme === 'dark' ? 'var(--logo-color)' : '#198754',
//           }}
//           onClick={() => navigate('/dashboard')}
//         >
//           <span>{'CIT' || instData.insCode}</span>
//           {!collapsed && <span style={{ fontSize: '14px' }}>{instData.insname}</span>}
//         </div>

//         <Button variant="link" className="p-0" onClick={() => setCollapsed(!collapsed)}>
//           <Icon
//             name={collapsed ? 'ChevronRight' : 'ChevronLeft'}
//             size={20}
//             style={{ transition: 'transform 0.2s' }}
//             color="var(--sidebar-text)"
//           />
//         </Button>
//       </div>

//       {/* 🌙 Theme Switcher */}
//       <div
//         className={`px-3 py-2 border-bottom d-flex align-items-center ${collapsed ? 'justify-content-center' : ''}`}
//         style={{ backgroundColor: 'var(--sidebar-bg)' }}
//       >
//         <Switch checked={theme === 'dark'} onChange={toggleTheme} />
//         <span className="ms-2">{!collapsed && (theme === 'dark' ? 'Dark Mode' : 'Light Mode')}</span>
//       </div>

//       {/* 🔍 Search Bar */}
//       {!collapsed && (
//         <div className="px-3 pb-2 pt-2" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
//           <Form.Control
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       )}

//       {/* Menu Section */}
//       {searchTerm ? (
//         <Nav className="flex-column">
//           {searchResults.length > 0 ? (
//             searchResults.map((sub, idx) => (
//               <Link key={idx} to={sub.path || '#'} className={navLinkClass(sub.path || '#')}>
//                 <Icon name={sub.icon} size={16} color="var(--sidebar-text)" />
//                 {sub.name}
//               </Link>
//             ))
//           ) : (
//             <div className="px-3">No matches found</div>
//           )}
//         </Nav>
//       ) : (
//         <div
//           style={{
//             overflowY: 'auto',
//             flex: 1,
//             backgroundColor: 'var(--sidebar-bg)',
//           }}
//         >
//           <Nav className="flex-column">
//             {Object.keys(aNavBar).map((eachNav) => {
//               const menu = aNavBar[eachNav];

//               if (collapsed) {
//                 return (
//                   <div key={eachNav} className="position-relative">
//                     <Button
//                       variant="link"
//                       className="d-flex align-items-center justify-content-center py-3 w-100 text-decoration-none"
//                       onClick={(e) => handleMainMenuClick(eachNav, e)}
//                     >
//                       <Icon name={menu.icon} size={20} color="var(--sidebar-text)" />
//                     </Button>
//                   </div>
//                 );
//               }

//               return (
//                 <div key={eachNav} style={{ backgroundColor: 'var(--sidebar-bg)', padding: '0.2rem' }}>
//                   <Button
//                     variant="link"
//                     className="d-flex align-items-center justify-content-between gap-5 px-3 py-2 w-100 text-start text-decoration-none"
//                     style={{ color: 'var(--sidebar-text)' }}
//                     onClick={() => toggleMenu(eachNav)}
//                   >
//                     <span className="d-flex align-items-center gap-3 fw-semibold">
//                       <Icon name={menu.icon} size={20} color="var(--sidebar-text)" />
//                       {eachNav}
//                     </span>
//                     <Icon
//                       name={openMenu === eachNav ? 'ChevronUp' : 'ChevronDown'}
//                       size={16}
//                       style={{ transition: 'transform 0.2s' }}
//                       color="var(--sidebar-text)"
//                     />
//                   </Button>

//                   <Collapse in={openMenu === eachNav}>
//                     <div className="ms-4">
//                       {menu.children.map((sub, i) => (
//                         <Link
//                           key={i}
//                           to={sub.path || '#'}
//                           className={navLinkClass(sub.path || '#')}
//                           style={{ color: 'var(--sidebar-text)', padding: '0.5rem' }}
//                         >
//                           <Icon name={sub.icon} size={16} color="var(--sidebar-text)" />
//                           <span>{sub.name}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   </Collapse>
//                 </div>
//               );
//             })}
//           </Nav>
//         </div>
//       )}

//       {/* Profile Section */}
//       {!collapsed ? (
//         <div className="p-3 border-top" style={{ flexShrink: 0, backgroundColor: 'var(--sidebar-bg)' }}>
//           <div className="d-flex align-items-center gap-2">
//             <div className={style.profileText}>
//               {user?.user?.firstName?.[0]}
//               {user?.user?.lastName?.[0]}
//             </div>
//             <div>
//               <div className="fw-medium">{`${user?.user?.firstName || ''} ${user?.user?.lastName || ''}`}</div>
//               <div style={{ fontSize: '0.9rem' }}>{user?.user?.email}</div>
//             </div>
//           </div>
//           <Button
//             variant="outline-secondary"
//             className="w-100 mt-3"
//             style={{
//               backgroundColor: 'var(--logout-button)',
//               color: 'var(--logout-text)',
//             }}
//             onClick={logout}
//           >
//             Log out
//           </Button>
//         </div>
//       ) : (
//         <div className="p-2 border-top d-flex justify-content-center" style={{ flexShrink: 0 }}>
//           <Button
//             onClick={logout}
//             className="d-flex align-items-center justify-content-center rounded-circle"
//             style={{
//               width: '40px',
//               height: '40px',
//               backgroundColor: 'var(--logout-button)',
//               color: 'var(--logout-text)',
//               boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//             }}
//           >
//             <Icon name="LogOut" size={18} color={'var(--logout-text)'} />
//           </Button>
//         </div>
//       )}

//       {/* Floating Popover (collapsed mode only) */}
//       {activePopoverMenu &&
//         collapsed &&
//         createPortal(
//           <div
//             ref={popoverRef}
//             className="position-fixed border rounded shadow p-2"
//             style={{
//               top: `${popoverPos.top}px`,
//               left: `${popoverPos.left}px`,
//               minWidth: '220px',
//               zIndex: 1050,
//               backgroundColor: 'var(--sidebar-bg)',
//             }}
//           >
//             <div
//               className="mb-2 rounded p-1"
//               style={{
//                 color: 'var(--sidebar-text)',
//                 backgroundColor: 'var(--sidebar-bg)',
//                 fontWeight: 'bold',
//               }}
//             >
//               {activePopoverMenu}
//             </div>
//             <hr
//               style={{
//                 color: 'var(--sidebar-text)',
//                 backgroundColor: 'var(--sidebar-bg)',
//                 fontWeight: 'bold',
//                 padding: 0,
//               }}
//             ></hr>
//             {aNavBar[activePopoverMenu].children.map((sub, i) => (
//               <Link
//                 key={i}
//                 to={sub.path || '#'}
//                 className="d-flex align-items-center gap-2 text-decoration-none mb-2"
//                 onClick={closePopover}
//                 style={{
//                   color: 'var(--sidebar-text)',
//                 }}
//               >
//                 <Icon name={sub.icon} size={16} color='var(--sidebar-text)' />
//                 {sub.name}
//               </Link>
//             ))}
//           </div>,
//           document.body,
//         )}
//     </aside>
//   );
// }
// Example usage component

import React, { useEffect, useState, useRef } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarTrigger,
  SidebarProvider,
  useSidebar
} from '../../../components/SideBarContents';
import useAuthStore from '../../../store/authStore';
import Icon from '../../../components/Icons';
import { Link } from 'react-router-dom';

export const AppSidebar: React.FC = () => {
  const { collapsed } = useSidebar();
  const { user, logout } = useAuthStore();
  const [showText, setShowText] = useState(!collapsed);
  const [oNavBar, setoNavBar] = useState({})
  useEffect(() => {
    if (user?.role?.modules) {
      const mainMenus = user?.role?.modules.filter(
        (item) => item.menuType === 'mainMenu' && !item.deleted && item.permissions.read,
      );

      const oNavData: Record<string, { icon?: string; children: any[] }> = {};

      mainMenus.forEach((mainMenu) => {
        const subMenus = user?.role?.modules.filter(
          (item) =>
            item.menuType === 'subMenu' && item.mainMenu === mainMenu.key && !item.deleted && item.permissions.read,
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

      setoNavBar(oNavData);
    }
  }, [user?.role?.modules]);


  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (collapsed) {
      // hide immediately when collapsing
      setShowText(false);
    } else {
      // delay showing until width transition finishes (0.3s) -> for smooth effect
      timer = setTimeout(() => setShowText(true), 300);
    }
    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <Sidebar>
      <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }} className='d-flex'>
        <div className="profileText">
          {user.user.institutes?.insname[0]}
        </div>
        {!collapsed && showText && <div className='d-flex flex-column' style={{ fontSize: "14px", fontWeight: "600" }}>
          <span className='ps-2'>{"MKIT"}</span>
          <span className='ps-2' style={{ fontSize: "12px", fontWeight: "400" }}>{user?.user?.institutes?.insname || ""}</span>
        </div>}
      </div>

      <SidebarContent>
        {Object.entries(oNavBar).map(([groupName, group]) => {
          return (
            <SidebarGroup key={groupName} label={showText ? groupName : ""} collapsible defaultOpen={false} icon={<Icon name={group.icon || ""} />}>
              {!collapsed && group.children && group.children.length > 0 ? (
                <div className="sidebar-children-wrapper" style={{ position: "relative" }}>
                  {group.children.map((item) => {
                    return (
                      <SidebarItem key={item.key} to={item.path} icon={<Icon name={item.icon || ""} />}>
                        {item.name}
                      </SidebarItem>
                    );
                  })}
                </div>
              ) : (
                <SidebarItem to="#" icon={<Icon name={group?.icon || ""} />}>
                  {groupName}
                </SidebarItem>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

    </Sidebar>
  );
};

// const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { collapsed } = useSidebar();
  
//   return (
//     <div 
//       className="flex-grow-1 d-flex flex-column"
//       style={{
//         marginLeft: collapsed ? '56px' : '240px',
//         transition: 'margin-left 0.3s ease',
//         width: 'fit-content',
//         height: '98vh', // Slightly shorter than 100vh
//         margin: '10px', // Push it inward so radius is visible
//         borderRadius: '30px', // Rounded corners
//         color: 'var(--sidebar-text)',
//         backgroundColor: 'var(--sidebar-bg)',
//         boxShadow: '13px 13px 15px rgba(0, 0, 0, 0.15)',
//         overflow: 'hidden', // Ensures inner content respects radius
//       }}
//     >
//       <header className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between shadow-sm">
//         <div className="d-flex align-items-center gap-3">
//           <SidebarTrigger />
//           <h4 className="mb-0 fw-semibold">My Application</h4>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <span className="badge bg-primary">Pro</span>
//         </div>
//       </header>
      
//       <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
//         {children}
//       </main>
//     </div>
//   );
// };
