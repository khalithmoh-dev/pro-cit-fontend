import { useNavigate } from 'react-router-dom';
import UsersIcon from '../../../../icon-components/UsersIcon';
import style from '../view-employee.module.css';
import { employeeIF } from '../../../../store/employeeStore';
import Spinner from '../../../../components/spinner';

interface PropsIF {
  menuItems: string[];
  selectedMenu: number;
  employee: employeeIF | null;
  imageSrc: any;
  setSelectedMenu: (state: number) => void;
}

const MenuContainer: React.FC<PropsIF> = ({ menuItems, selectedMenu, setSelectedMenu, employee, imageSrc }) => {
  const navigate = useNavigate();

  const onClickhandler = (item: string, index: number) => {
    if (item === 'Calendar Events') navigate(`/calendar/view/${employee?._id}`);
    if (item === 'Attendance Details') navigate(`/attendance/list/${employee?._id}`);
    if (item === 'Change Password') navigate(`/user/change-password`);
    setSelectedMenu(index);
  };

  return (
    <div className={style.menuBox}>
      <div className={style.profileBox}>
        <div className={style.userImage}>
          {imageSrc ? <img src={imageSrc} alt="Employee Profile" className={style.image} /> : <Spinner />}
        </div>
        <div className={style.userName}>{employee ? `${employee?.firstName} ${employee?.lastName}` : ''}</div>
      </div>
      <div className={style.menuItemContainer}>
        {menuItems.map((item, index) => (
          <div
            className={`${style.menuItemBox} ${index === selectedMenu ? style.activeMenuBox : ''}`}
            key={index}
            onClick={() => onClickhandler(item, index)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuContainer;
