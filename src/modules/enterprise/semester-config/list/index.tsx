import React, { useEffect, useState } from 'react';
import DataTable from '../../../common/generic-table';
import { Box } from '@mui/material';
import { t } from 'i18next';
import Icon from '../../../../components/Icons';
import EnterpriseFilterForm from '../../../../components/enterprisefilter';
import useSemesterConfigStore, { SemesterConfigIF } from '../../../../store/semesterConfigStore';
import Popup from '../../../../components/modal';
import InputFields from '../../../../components/inputFields';
import FormLabel from '../../../../components/Label';
import { useLayout } from '../../../layout/LayoutContext';

interface SemesterConfigSearchIF {
  insId: string;
  degId: string;
  prgId: string;
  acYr: string;
}

interface SemesterConfigFormData {
  startDate: string;
  endDate: string;
  applyToAllSemesters: boolean;
}

const SemesterConfigList: React.FC = () => {
  const { getSemesterConfigurations, createSemesterConfig, updateSemesterConfig, createOrUpdateSemConfig } =
    useSemesterConfigStore();
  const [semesterConfigList, setSemesterConfigList] = useState<SemesterConfigIF[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SemesterConfigIF | null>(null);
  const { setRouteNm } = useLayout();

  useEffect(() => {
    if (location?.pathname) {
      setRouteNm(location?.pathname);
    }
  }, [location?.pathname]);

  const [formData, setFormData] = useState<SemesterConfigFormData>({
    startDate: '',
    endDate: '',
    applyToAllSemesters: false,
  });

  // Column configuration
  const columns = [
    {
      field: 'insName',
      headerName: t('INSTITUTION_NAME'),
      sortable: true,
    },
    {
      field: 'degreeNm',
      headerName: t('DEGREE'),
      sortable: true,
    },
    {
      field: 'programNm',
      headerName: t('PROGRAM'),
      sortable: true,
    },
    {
      field: 'semesterNm',
      headerName: t('SEMESTER'),
      sortable: true,
    },
    {
      field: 'semesterCode',
      headerName: t('SEMESTER_ID'),
      sortable: true,
    },
    {
      field: 'startDate',
      headerName: t('START_DATE'),
      sortable: true,
      renderCell: (row: any) => {
        return row.startDate ? new Date(row.startDate).toLocaleDateString() : '';
      },
    },
    {
      field: 'endDate',
      headerName: t('END_DATE'),
      sortable: true,
      renderCell: (row: any) => {
        return row.endDate ? new Date(row.endDate).toLocaleDateString() : '';
      },
    },
  ];

  // Action buttons
  const actions = [
    {
      label: t('VIEW_DETAILS'),
      icon: <Icon size={18} name="Eye" />,
      onClick: (row: SemesterConfigIF) => {
        setSelectedRow(row);
        setFormData({
          startDate: row.startDate ? new Date(row.startDate).toISOString().split('T')[0] : '',
          endDate: row.endDate ? new Date(row.endDate).toISOString().split('T')[0] : '',
          applyToAllSemesters: false,
        });
        setIsModalOpen(true);
      },
    },
  ];

  /**
   * Handles semester configuration search
   * Fetches existing semester config based on filters
   */
  const handleSemesterConfigSearch = async (values: SemesterConfigSearchIF) => {
    try {
      const response = await getSemesterConfigurations(values);
      if (response?.data?.length) {
        setSemesterConfigList(response.data);
      } else {
        setSemesterConfigList([]);
      }
      setIsDataFetched(true);
    } catch (err) {
      console.error('Failed to fetch semester configurations:', err);
    }
  };

  /**
   * Resets the semester config search form and clears all data
   */
  const handleReset = () => {
    setIsDataFetched(false);
    setSemesterConfigList([]);
  };

  /**
   * Handles modal close
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setFormData({
      startDate: '',
      endDate: '',
      applyToAllSemesters: false,
    });
  };

  /**
   * Handles form field changes
   */
  const handleFieldChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    try {
      if (!selectedRow) return;
      let aplyAllPayload;

      const payload = {
        _id: selectedRow._id,
        insId: selectedRow.insId,
        degId: selectedRow.degId,
        prgId: selectedRow.prgId,
        acYr: selectedRow.acYr,
        semId: selectedRow.semId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        desc: selectedRow.desc,
      };

      if (formData?.applyToAllSemesters) {
        aplyAllPayload = semesterConfigList.map((item) => ({
          _id: item._id,
          insId: item.insId,
          degId: item.degId,
          prgId: item.prgId,
          acYr: item.acYr,
          semId: item.semId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          desc: item.desc,
        }));
      }

      const result = formData?.applyToAllSemesters
        ? await createOrUpdateSemConfig(aplyAllPayload)
        : payload?._id
          ? await updateSemesterConfig(payload)
          : await createSemesterConfig(payload);

      if (result.success) {
        // Refresh the list
        const response = await getSemesterConfigurations({
          insId: selectedRow.insId,
          degId: selectedRow.degId,
          prgId: selectedRow.prgId,
          acYr: selectedRow.acYr,
        });
        if (response?.data?.length) {
          setSemesterConfigList(response.data);
        }
        handleModalClose();
      }
    } catch (err) {
      console.error('Failed to update semester configuration:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <EnterpriseFilterForm
        autoFieldSchema={{
          institutes: {
            label: t('INSTITUTION_NAME'),
            type: 'select',
            required: true,
          },
          degree: {
            label: t('DEGREE'),
            type: 'select',
            required: true,
          },
          program: {
            label: t('PROGRAM'),
            type: 'select',
            required: true,
          },
          academicyears: {
            label: t('ACADEMIC_YEAR'),
            type: 'select',
            required: true,
          },
        }}
        schema={{
          buttons: [
            {
              name: t('RESET'),
              nature: 'reset',
              onClick: handleReset,
            },
            {
              name: t('SEARCH'),
              type: 'submit',
              nature: 'primary',
            },
          ],
        }}
        onSubmit={handleSemesterConfigSearch}
      />
      {isDataFetched && (
        <DataTable
          data={semesterConfigList}
          columns={columns}
          addRoute={'/semester-config/form'}
          title={t('SEMESTER_CONFIGURATION')}
          actions={actions}
          key={JSON.stringify(semesterConfigList)} // Force re-render when data changes
        />
      )}

      <Popup
        open={isModalOpen}
        onClose={handleModalClose}
        title={t('UPDATE_SEMESTER_CONFIGURATION')}
        maxWidth="sm"
        actions={[
          {
            label: t('CANCEL'),
            onClick: handleModalClose,
            variant: 'cancel',
          },
          {
            label: t('SUBMIT'),
            onClick: handleSubmit,
            variant: 'submit',
          },
        ]}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, px: 1 }}>
          <Box>
            <FormLabel labelName={t('START_DATE')} className="rm-modal-label" />
            <InputFields
              field={{
                name: 'startDate',
                type: 'date',
                label: t('START_DATE'),
                placeholder: t('START_DATE'),
              }}
              value={formData.startDate}
              onChange={handleFieldChange}
              editPerm={true}
            />
          </Box>
          <Box>
            <FormLabel labelName={t('END_DATE')} className="rm-modal-label" />
            <InputFields
              field={{
                name: 'endDate',
                type: 'date',
                label: t('END_DATE'),
                placeholder: t('END_DATE'),
              }}
              value={formData.endDate}
              onChange={handleFieldChange}
              editPerm={true}
            />
          </Box>
          <Box
            sx={{
              '& .MuiFormControlLabel-root': {
                marginLeft: 0,
                marginTop: '8px',
                alignItems: 'center',
              },
              '& .MuiCheckbox-root': {
                transform: 'scale(1.3)',
                marginRight: '1px',
              },
              '& .MuiTypography-root': {
                fontSize: '16px',
                height: 'auto',
              },
            }}
          >
            <InputFields
              field={{
                name: 'applyToAllSemesters',
                type: 'checkbox',
                label: t('APPLY_TO_ALL_SEMESTERS'),
              }}
              value={formData.applyToAllSemesters}
              onChange={handleFieldChange}
              editPerm={true}
            />
          </Box>
        </Box>
      </Popup>
    </Box>
  );
};

export default SemesterConfigList;
