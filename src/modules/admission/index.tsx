import { useNavigate } from 'react-router-dom';
import style from './admission.module.css';

const AdmissionPage = () => {
  const navigate = useNavigate();
  return (
    <div className={style.container}>
      <div className={style.pageHeader}>Student Admission</div>
      <div className={style.cardsContainer}>
        <div className={style.cardContainer}>
          <div className={style.card} onClick={() => navigate('/admission/student/list')}>
            Invited Students
          </div>
        </div>
        <div className={style.cardContainer}>
          <div className={style.card} onClick={() => navigate('/admission/invite')}>
            Invite Student
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;
