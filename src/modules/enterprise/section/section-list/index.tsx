import React, { useEffect, useState } from 'react';
import DataTable from '../../../common/generic-table';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useSectionStore from '../../../../store/sectionStore';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../components/Icons';
import { useToastStore } from "../../../../store/toastStore";

const SectionList = () => {
  const navigate = useNavigate();
  const { getSections } = useSectionStore();
  const [sectionsData, setSectionsData] = useState([]);
  const { t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);

  // to get data for listing
  useEffect(() => {
    if (getSections) {
      (async () => {
        try {
          const aSectionList = await getSections();
          if (Array.isArray(aSectionList) && aSectionList.length) {
            setSectionsData(aSectionList);
          }

        } catch (error) {
          showToast("error", t("UNKNOWN_ERROR_OCCURRED"));
        }
      })();
    }
  }, [getSections]);

  // Column configuration
  const columns = [
    {
      field: 'insName',
      headerName: t("INSTITUTION_NAME"),
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
        addRoute={'/section/form'}
        title={t("SECTION")}
        actions={actions}
      />
    </Box>
  );
};

export default SectionList;