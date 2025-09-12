// import React from "react";
// import Typography from '@mui/material/Typography'

// const PageTitle = ({
//     title
// }:{
//     title: string
// }) => {
//     return (
//         <Typography
//             variant="h6" component="h2"
//         >
//             {title}
//         </Typography>
//     )
// }
// export default PageTitle;


import React,{useEffect, useState} from "react";
import { Card, CardContent } from "@mui/material";
import Icon from "../Icons";
import useAuthStore from '../../store/authStore'
import { useLocation } from 'react-router-dom';

export default function PageTitle({
  color = "var(--logout-button)",
  title = "Your Label",
  className = "",
  iconName = "",
  children
}) {
  const authStore = useAuthStore();
  const location = useLocation();
  const [routeNm, setRouteNm] = useState('');
  
  // to set the page header icon as per data in DB
  useEffect(()=>{
    if(location.pathname) setRouteNm(location.pathname.split('/').filter(Boolean)[0] || '')
  }, [location.pathname])

  return (
<div className="d-flex justify-content-between">
    <div
      className={`d-flex align-items-center ${className}`}
      style={{ width: "fit-content" }}
    >
      {/* Left colored block */}
      {
      <div
        style={{
          backgroundColor: color,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20px 0 0 20px", // Rounded only on the left
        }}
      >
        <Icon color="var(--sidebar-text)" name={iconName || authStore.routeInfo[routeNm]?.icon}/>
      </div>}

      {/* Right white box */}
      <Card
        className="shadow-sm"
        style={{
          borderRadius: "0 20px 20px 0", // Rounded only on the right
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent
          style={{
            padding: "12px 20px",
            backgroundColor: "var(--main-div)",
            color: "var(--main-text)",
          }}
        >
          <span style={{ fontWeight: 500, color: "var(--main-text)" }}>
            {title}
          </span>
        </CardContent>
      </Card>
    </div>
      {children}
</div>
  );
}

