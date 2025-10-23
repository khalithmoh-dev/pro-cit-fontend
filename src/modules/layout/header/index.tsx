import style from './header.module.css';
import useAuthStore from '../../../store/authStore';
import DropdownMenu from '../../../components/dropdown';
import useLayoutStore from '../../../store/layoutStore';
import HamburgerMenuIcon from '../../../icon-components/HamburgerMenuIcon';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import ArrowDownIcon from '../../../icon-components/ArrowDownIcon';
import { PRIMARY_SHADE } from '../../../theme/color';

const HeaderComponent: React.FC = () => {
  const { user, logout, setAcademicYear, academicYear } = useAuthStore();
  const { sidebar, setSidebar } = useLayoutStore();
  const { innerWidth } = window;
  const navigate = useNavigate();

  useEffect(() => {
    if (innerWidth < 770) {
      setSidebar(false);
    }
  }, [innerWidth]);

  const dropdownHandler = (option: string) => {
    if (option === 'Logout') {
      navigate('/dashboard');
      logout();
    }

    if (option === 'Account' && user?.user?.role?.name !== 'superadmin') {
      window.location.replace(`/employee/view/${user?.user?._id}`);
    }
  };

  return (
    <div className={style.container}>
      <div>
        <div onClick={() => navigate('/dashboard')} className={style.orgLogo}>
          Coorg Institute of Technology
        </div>
      </div>
      <div className={style.rightBox}>
        <FaBell color="lightgrey" size={20} />
        <DropdownMenu onChange={setAcademicYear} options={['2021-2022', '2022-2023', '2023-2024', '2024-2025']}>
          <div className={style.academicYear}>
            {academicYear} <ArrowDownIcon fill={PRIMARY_SHADE} width={20} />
          </div>
        </DropdownMenu>
        <div className={style.profileBox}>
          <div className={style.profileDetails}>
            <div className={style.userName}>
              {user?.user?.firstName}&nbsp;{user?.user?.lastName}
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
        <span onClick={() => setSidebar(!sidebar)} className={style.hamburgerMenuIcon}>
          <HamburgerMenuIcon />
        </span>
      </div>
    </div>
  );
};

export default HeaderComponent;
