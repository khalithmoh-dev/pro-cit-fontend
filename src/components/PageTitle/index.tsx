import React from "react";
import Typography from '@mui/material/Typography'

const PageTitle = ({
    title
}:{
    title: string
}) => {
    return (
        <Typography
            variant="h6" component="h2"
        >
            {title}
        </Typography>
    )
}
export default PageTitle;