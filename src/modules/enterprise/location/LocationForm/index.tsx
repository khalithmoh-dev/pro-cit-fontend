import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import DynamicForm from '../../../../components/generic-form';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from 'react-router-dom';
import useLocationStore, { CreateLocationPayload } from "../../../../store/locationStore";
import { sanitizePayload } from '../../../../utils';
import { useToastStore } from "../../../../store/toastStore";

const LocationForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locationStore = useLocationStore();
  const [campusList, setCampusList] = useState<any[]>([]);
  const [facilityList, setFacilityList] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const [editValues, setEditValues] = useState({});
  const showToast = useToastStore((state) => state.showToast);

  // Handle campus change - load facilities for selected campus
  const handleCampusChange = async (campusId: string, formik: any) => {
    if (campusId) {
      try {
        const aFacilityRes = await locationStore.getFacilitiesByCampusId(campusId);
        if (Array.isArray(aFacilityRes?.data)) {
          setFacilityList(aFacilityRes.data);
        }
      } catch (err) {
        showToast('error', `${t("FAILED_TO_FETCH")} ${t('FACILITIES')}`);
      }
    } else {
      setFacilityList([]);
    }
    formik.setFieldValue('facilityId', '');
  };

  // Handle inline campus add - save directly with name only
  const handleAddCampus = async (newCampusName: string) => {
    if (!newCampusName.trim()) return;

    try {
      const result = await locationStore.createCampus({
        campusNm: newCampusName.trim()
      });

      if (result.success) {
        showToast('success', `${t('CAMPUS')} ${t("CREATED_SUCCESSFULLY")}`);
        // Refresh campus list
        const aCampusRes = await locationStore.getCampuses();
        if (Array.isArray(aCampusRes?.data)) {
          setCampusList(aCampusRes.data);
        }
      } else {
        // Show the specific error message from backend
        const errorMessage = result.error === 'CAMPUS_EXISTS'
          ? t('CAMPUS_EXISTS')
          : result.error || `${t("FAILED_TO_CREATE")} ${t('CAMPUS')}`;
        showToast('error', errorMessage);
      }
    } catch (error) {
      showToast('error', `${t("FAILED_TO_CREATE")} ${t('CAMPUS')}`);
    }
  };

  // Handle inline facility add - save directly with name only
  const handleAddFacility = async (values: any) => {
    const newFacilityName = values.newFacilityName;
    const campusId = values.campusId;

    if (!newFacilityName?.trim() || !campusId) return;

    try {
      const result = await locationStore.createFacility({
        campusId,
        facilityNm: newFacilityName.trim()
      });

      if (result.success) {
        showToast('success', `${t('FACILITY')} ${t("CREATED_SUCCESSFULLY")}`);
        // Refresh facility list for selected campus
        const aFacilityRes = await locationStore.getFacilitiesByCampusId(campusId);
        if (Array.isArray(aFacilityRes?.data)) {
          setFacilityList(aFacilityRes.data);
        }
      } else {
        // Show the specific error message from backend
        const errorMessage = result.error === 'FACILITY_EXISTS'
          ? t('FACILITY_EXISTS')
          : result.error || `${t("FAILED_TO_CREATE")} ${t('FACILITY')}`;
        showToast('error', errorMessage);
      }
    } catch (error) {
      showToast('error', `${t("FAILED_TO_CREATE")} ${t('FACILITY')}`);
    }
  };

  // Location form schema design
  const schema = {
    fields: {
      General: [
        {
          name: 'insId',
          label: t('INSTITUTION_NAME'),
          type: 'select',
          validation: Yup.string().required(t('INSTITUTION_NAME_IS_REQUIRED')),
          isRequired: true,
        },
        {
          name: 'campusId',
          label: t('CAMPUS'),
          type: 'select',
          options: campusList ?? [],
          labelKey: "campusNm",
          valueKey: "_id",
          validation: Yup.string().required(t("CAMPUS_IS_REQUIRED")),
          isRequired: true,
          showAdd: true,
          onChange: (fieldname: string, val: string, formik: any) => {
            handleCampusChange(val, formik);
          },
          addClick: async (values: any) => {
            // values.newValue contains the text entered in the inline input
            await handleAddCampus(values.newValue);
          },
          addDisabled: false
        },
        {
          name: 'facilityId',
          label: t('FACILITY'),
          type: 'select',
          options: facilityList ?? [],
          labelKey: "facilityNm",
          valueKey: "_id",
          validation: Yup.string().required(t("FACILITY_IS_REQUIRED")),
          isRequired: true,
          showAdd: true,
          addClick: async (values: any) => {
            await handleAddFacility({
              newFacilityName: values.newValue,
              campusId: values.campusId
            });
          },
          addDisabled: (values: any) => !values.campusId
        },
        {
          name: 'locationNm',
          label: t("LOCATION_NAME"),
          type: 'text',
          validation: Yup.string().required(t("LOCATION_NAME_IS_REQUIRED")),
          isRequired: true,
        },
        {
          name: 'locationType',
          label: t('LOCATION_TYPE'),
          type: 'select',
          options: [
            { value: 'Classroom', label: t("CLASSROOM") },
            { value: 'Lab', label: t("LAB") },
            { value: 'Office', label: t("OFFICE") },
            { value: 'Library', label: t("LIBRARY") },
            { value: 'Auditorium', label: t("AUDITORIUM") },
            { value: 'Other', label: t("OTHER") },
          ],
        },
        {
          name: 'capacity',
          label: t("CAPACITY"),
          type: 'number',
        }
      ]
    },
    buttons: [
      {
        name: 'Cancel',
        variant: 'outlined',
        nature: 'secondary',
        onClick: () => {
          navigate(-1);
        },
      },
      {
        name: id ? 'UPDATE' : 'SUBMIT',
        variant: 'contained',
        nature: 'primary',
        type: 'submit',
      },
    ],
  };

  // Function for submit location form
  const handleFormSubmit = async (values: CreateLocationPayload): Promise<void> => {
    if (!id) {
      try {
        const result = await locationStore.createLocation(sanitizePayload(values) as CreateLocationPayload);
        if (result.success) {
          showToast('success', `${t('LOCATION')} ${t("CREATED_SUCCESSFULLY")}`);
          navigate(-1);
        } else {
          // Show the specific error message from backend
          const errorMessage = result.error === 'LOCATION_EXISTS'
            ? t('LOCATION_EXISTS')
            : result.error || `${t("FAILED_TO_CREATE")} ${t('LOCATION')}`;
          showToast('error', errorMessage);
        }
      } catch (err) {
        showToast('error', `${t("FAILED_TO_CREATE")} ${t('LOCATION')}`);
      }
    } else {
      try {
        const oUpdtPayload = {
          ...values,
          _id: id
        }
        const result = await locationStore.updateLocation(sanitizePayload(oUpdtPayload) as CreateLocationPayload);
        if (result.success) {
          showToast('success', `${t('LOCATION')} ${t("UPDATED_SUCCESSFULLY")}`);
          navigate(-1);
        } else {
          // Show the specific error message from backend
          const errorMessage = result.error === 'LOCATION_EXISTS'
            ? t('LOCATION_EXISTS')
            : result.error || `${t("FAILED_TO_UPDATE")} ${t('LOCATION')}`;
          showToast('error', errorMessage);
        }
      } catch (err) {
        showToast('error', `${t("FAILED_TO_UPDATE")} ${t('LOCATION')}`);
      }
    }
  };

  // Load initial campus list
  useEffect(() => {
    try {
      (async () => {
        const aCampusRes = await locationStore.getCampuses();
        if (Array.isArray(aCampusRes?.data)) {
          setCampusList(aCampusRes.data);
        }
      })();
    } catch (err) {
      showToast('error', `${t("FAILED_TO_FETCH")} ${t('CAMPUSES')}`);
    }
  }, [locationStore]);

  // Load edit location details
  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const oLocation = await locationStore.getLocationById(id);
          if (oLocation && typeof oLocation === 'object') {
            setEditValues(oLocation);
            // Load facilities for the selected campus
            if (oLocation.campusId) {
              const aFacilityRes = await locationStore.getFacilitiesByCampusId(oLocation.campusId);
              if (Array.isArray(aFacilityRes?.data)) {
                setFacilityList(aFacilityRes.data);
              }
            }
          }
        } catch (err) {
          showToast('error', `${t("FAILED_TO_FETCH")} ${t('LOCATION')} ${t('DETAILS')}`);
        }
      }
    })()
  }, [id])

  return (
    <DynamicForm
      schema={schema}
      pageTitle={t("LOCATION")}
      onSubmit={handleFormSubmit}
      isEditPerm={true}
      oInitialValues={id ? editValues : ""}
    />
  );
};

export default LocationForm;
