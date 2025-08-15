import style from './user-profile.module.css';
import Button from '../../../components/button';
import useAuthStore from '../../../store/authStore';
const UserProfilePage = () => {
  interface User {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      email: string;
      mobileNumber: string;
      designation: string;
      department: string[];
    };
  }

  const { user, logout } = useAuthStore();

  const detailCards = [
    {
      cardHead: 'First Name',
      cardText: user?.user.firstName,
    },
    {
      cardHead: 'Last Name',
      cardText: user?.user.lastName,
    },
    {
      cardHead: 'Email',
      cardText: user?.user.email,
    },
    {
      cardHead: 'Mobile Number',
      cardText: user?.user.mobileNumber,
    },
    {
      cardHead: 'role',
      cardText: user?.user?.role?.name,
    },
  ];

  return (
    <div className={style.container}>
      <div className={style.profileBox}>
        <div className={style.nameContainer}>
          <div className={style.profilePhotoCircle}>
            {user?.user.firstName.charAt(0)}
            {user?.user.lastName.charAt(0)}
          </div>
          <div className={style.userName}>
            {user?.user.firstName}&nbsp;{user?.user.lastName}
          </div>
        </div>
        <div className={style.detailsCardContainer}>
          {detailCards.map((card, index) => (
            <div key={index} className={style.detailsCard}>
              <div className={style.cardHead}>{card.cardHead}</div>
              <div className={style.cardText}>{card.cardText}</div>
            </div>
          ))}
        </div>
        <div className={style.buttonContainer}>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
