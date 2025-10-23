// import dashboardCards from './dashboardCards';
// import style from './dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    // <div className={style.container}>
    //   <div className={style.contentBox}>
    //     <div className={style.orgName}>Coorg Institute of Technology</div>
    //     <div className={style.orgSubText}>
    //       This platform is intended for all professionals who have devoted their careers to promoting learning
    //       innovations, exchanging knowledge across borders, embracing diversity, and advancing student development to
    //       improve the overall quality of life worldwide.
    //     </div>
    //   </div>
    //   {dashboardCards.map((category, index) => {
    //     return (
    //       <div key={index} className={style.contentBox}>
    //         <div className={style.categoryName}>{category.name}</div>
    //         <div className={style.categorySubName}>({category.subName})</div>
    //         <div className={style.cardsContainer}>
    //           {category.cards.map((card, index) => (
    //             <div
    //               onClick={card.path ? () => navigate(`${card.path}`) : () => {}}
    //               className={style.dashboardCard}
    //               key={index}
    //             >
    //               {card.name}
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
    <h1>This is dashboard</h1>
  );
};

export default DashboardPage;
