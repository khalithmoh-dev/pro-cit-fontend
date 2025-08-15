import Spinner from '../../../../components/spinner';
import style from '../view-student.module.css';

interface PropsIF {
  menuItems: string[];
  selectedMenu: number;
  name: string;
  imageSrc: any;
  setSelectedMenu: (state: number) => void;
}

const MenuContainer: React.FC<PropsIF> = ({ menuItems, selectedMenu, setSelectedMenu, name, imageSrc }) => {
  return (
    <div className={style.menuBox}>
      <div className={style.profileBox}>
        <div className={style.userImage}>
          {imageSrc ? <img src={imageSrc} alt="Photo" className={style.image} /> : <Spinner />}
        </div>
        <div className={style.userName}>{name}</div>
      </div>
      <div className={style.menuItemContainer}>
        {menuItems.map((item, index) => (
          <div
            className={`${style.menuItemBox} ${index === selectedMenu ? style.activeMenuBox : ''}`}
            key={index}
            onClick={() => setSelectedMenu(index)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuContainer;
