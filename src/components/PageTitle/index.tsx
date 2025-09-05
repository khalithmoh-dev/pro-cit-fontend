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
import {Activity} from "lucide-react";

export default function PageTitle({
  color = "var(--bg-color)", // Material Yellow
  title = "Your Label",
  className=''
}) {
  return (
    <div className={`d-flex align-items-center ${className}`} style={{ width: "fit-content" }}>
      {/* Left colored block */}
      <div
        style={{
          backgroundColor: color,
          padding: "16px",
          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)", // diagonal cut
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Activity color="var(--main-div)" />
      </div>

      {/* Right white box */}
      <Card
        className="shadow-sm"
        style={{
          borderRadius: 0,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent style={{ padding: "12px 20px", backgroundColor: "var(--main-div)" }}>
          <span style={{ fontWeight: 500, color: "var(--bg-color)" }}>{title}</span>
        </CardContent>
      </Card>
    </div>
  );
}
