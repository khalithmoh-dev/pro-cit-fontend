import React from 'react'
import Typography from '@mui/material/Typography'

interface SectionHeaderProps {
  sectionName: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ sectionName }) => {
  return (
    <>
        <Typography className='section-header'>
        {sectionName}
        </Typography>
        <hr className='m-0 p-0' style={{color: 'black'}}/>
    </>
  )
}

export default SectionHeader;
