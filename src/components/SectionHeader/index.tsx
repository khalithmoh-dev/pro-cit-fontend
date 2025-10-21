import React from 'react'
import Typography from '@mui/material/Typography'
import './index.css'
import { useTranslation } from 'react-i18next';
interface SectionHeaderProps {
  sectionName: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ sectionName }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography className='section-header'>
        {t(sectionName)}
      </Typography>
      <hr className='m-0 p-0' style={{ color: 'black' }} />
    </>
  )
}

export default SectionHeader;
