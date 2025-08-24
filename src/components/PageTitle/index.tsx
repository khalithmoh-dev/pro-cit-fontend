import React from "react";
import Typography from '@mui/material/Typography'

const PageTitle = ({
    title
}:{
    title: string
}) => {
    return (
        <Typography
            mb={3}
            className="page-header"
        >
            {title}
        </Typography>
    )
}
export default PageTitle;