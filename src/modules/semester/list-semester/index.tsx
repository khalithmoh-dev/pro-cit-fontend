import React, { useEffect, useState } from 'react';
import DataTable from '../../common/generic-table';
import { Chip,Box } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "../../../components/PageTitle";
import useDegreeStore from '../../../store/degreeStore';
import useSemesterStore from '../../../store/semesterStore';
import TitleButton from '../../../components/TitleButton';
import { useTranslation } from 'react-i18next';

const SemesterList = () => {
  const navigate = useNavigate();
  const { getDegrees,degrees } = useDegreeStore();
  const { getSemester } = useSemesterStore();
  const [semesterData, setSemesterData] = useState([]);
  const {t} = useTranslation();
  useEffect(() => {
    if (getSemester) {
      (async () => {
        try {
          const aSemesterList = await getSemester();
          if (Array.isArray(aSemesterList) && aSemesterList.length) {
            setSemesterData(aSemesterList);
          }
        } catch (error) {
          console.error("Failed to fetch degrees:", error);
        }
      })();
    }
  }, [getSemester]);

  useEffect(() => {
    if (degrees.length > 0) {
      setSemesterData(degrees);
    }
  }, [degrees]);
 
  // Column configuration
  const columns = [
    { 
      field: 'insname', 
      headerName: 'Institution Name', 
      sortable: false
    },
    { 
      field: 'semNm', 
      headerName: 'Semester Name', 
      sortable: true,
    },
    { 
      field: 'semId', 
      headerName: 'Semester Id', 
      sortable: true,
    },
    { 
      field: 'degreeName', 
      headerName: 'Degree', 
      sortable: true      
    }
  ];

  // Action buttons
  const actions = [
    {
      label: 'View Details',
      icon: <Eye size={18} />,
      onClick: (row) => {
        navigate(`/semester/update/${row?._id}`);
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageTitle title={'Semester list'}>
        <TitleButton Btnname={t("ADD")} onClick={()=>navigate('/semester/create')} />
      </PageTitle>
      <DataTable
        data={semesterData}
        columns={columns}
        title="Semester"
        actions={actions}
      />
    </Box>
  );
};

export default SemesterList;