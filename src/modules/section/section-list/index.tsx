import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";
import useSectionStore from '../../../store/sectionStore';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/Icons';
 
const SectionList = () => {
  const navigate = useNavigate();
  const { getSections,sections } = useSectionStore();
  const [sectionsData, setSectionsData] = useState([]);
  const { t } = useTranslation();
  
  useEffect(() => {
    if (getSections) {
      (async () => {
        try {
          const aSectionList = await getSections();
          if (Array.isArray(aSectionList) && aSectionList.length) {
            setSectionsData(aSectionList);
          }
        } catch (error) {
          console.error("Failed to fetch sections:", error);
        }
      })();
    }
  }, [getSections]);


  useEffect(() => {
    if (sections.length > 0) {
      setSectionsData(sections);
    }
  }, [sections]);
 
  // Column configuration
  const columns = [
    { 
      field: 'insname', 
      headerName: t("INSTITUITION_NAME"),
      sortable: false
    },
    { 
      field: 'secCd', 
      headerName: t("SECTION_CODE"),
      sortable: true      
    },
    { 
      field: 'secNm', 
      headerName: t("SECTION_NAME"),
      sortable: true,
    },
    { 
      field: 'desc', 
      headerName: t("DESCRIPTION"),
      sortable: true
    },
  ];

  // Action buttons
  const actions = [
    {
      label: t("VIEW_DETAILS"),
      icon: <Icon name="Eye" size={18} />,
      onClick: (row) => {
        navigate(`/section/form/${row._id}`)
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        data={sectionsData}
        columns={columns}
        addRoute = {'/section/form'}
        title= {t("SECTION")}
        actions={actions}
      />
    </Box>
  );
};

export default SectionList;