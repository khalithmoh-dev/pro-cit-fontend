import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";
import useSectionStore from '../../../store/sectionStore';
import { useTranslation } from 'react-i18next';
 
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
      field: 'institutionName', 
      headerName: t("INSTITUITION_NAME"),
      sortable: false
    },
    { 
      field: 'sectionCode', 
      headerName: t("SECTION_CODE"),
      sortable: true      
    },
    { 
      field: 'sectionName', 
      headerName: t("SECTION_NAME"),
      sortable: true,
    },
    { 
      field: 'description', 
      headerName: t("DESCRIPTION"),
      sortable: true
    },
  ];

  // Action buttons
  const actions = [
    {
      label: t("VIEW_DETAILS"),
      icon: <Eye size={18} />,
      onClick: (row) => {
        navigate('/section/create')
      }
    }
  ];

  // Handle selection
  const handleSelection = (selectedIds) => {
    console.log('Selected IDs:', selectedIds);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageTitle title={t("SECTION_LIST")}/>
      <DataTable
        data={sectionsData}
        columns={columns}
        onSelect={handleSelection}
        title= {t("SECTION")}
        actions={actions}
      />
    </Box>
  );
};

export default SectionList;