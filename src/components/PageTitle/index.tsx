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


import React from "react";
import { Card, CardContent } from "@mui/material";
import Icon from "../Icons";

interface PageTitleI {
  color?: string
  title?: string
  className?: string
  iconName?: string
  children?: string
}

export default function PageTitle({
  color = "var(--logout-button)",
  title = "Your Label",
  className = "",
  iconName = "",
  children
}: PageTitleI) {


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
            <Icon color="var(--sidebar-text)" name={iconName} />
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

