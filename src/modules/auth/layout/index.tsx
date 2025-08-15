import { Outlet } from 'react-router-dom';
import style from './layout.module.css';
import { ReactNode } from 'react';
import bg from '../../../assets/images/bg.jpg';

interface PropsIF {
  children: ReactNode;
}

const AuthLayout: React.FC<PropsIF> = ({ children }) => {
  return (
    <div className={style.container}>
      <div className={style.orgLogo}>Coorg Institute of Technology</div>
      <div className={style.leftBox}>
        <img src={bg} alt="img" className={style.image} />
      </div>
      <div className={style.rightBox}>{children}</div>
    </div>
  );
};

export default AuthLayout;
