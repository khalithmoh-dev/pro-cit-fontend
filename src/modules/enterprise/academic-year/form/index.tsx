import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import DynamicForm from '../../../../components/generic-form';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from 'react-router-dom';
import useAcademicYearStore, { CreateAcademicYearPayload } from "../../../../store/academicYearStore";
import { sanitizePayload } from '../../../../utils';
import { useToastStore } from "../../../../store/toastStore";

const AcademicYearForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const academicYearStore = useAcademicYearStore();
  const { id } = useParams<{ id: string }>();
  const [editValues, setEditValues] = useState({});
  const showToast = useToastStore((state) => state.showToast);

  // Academic Year form schema design
  const schema = {
    fields: {
      General: [
        {
          name: 'insId',
          label: t("INSTITUTION_NAME"),
          type: 'select',
          validation: Yup.string().required(t("INSTITUTION_NAME_IS_REQUIRED")),
          isRequired: true,
        },
        {
          name: 'academicYearCode',
          label: t("ACADEMIC_YEAR_CODE"),
          type: 'text',
          validation: Yup.string().required(t("ACADEMIC_YEAR_CODE_IS_REQUIRED")),
          isRequired: true,
        },
        {
          name: 'academicYearNm',
          label: t("ACADEMIC_YEAR_NAME"),
          type: 'text',
          validation: Yup.string().required(t("ACADEMIC_YEAR_NAME_IS_REQUIRED")),
          isRequired: true,
        },
        {
          name: 'startDate',
          label: t("START_DATE"),
          type: 'date',
          validation: Yup.date().required(t("START_DATE_IS_REQUIRED")),
          isRequired: true,
        },
        {
          name: 'endDate',
          label: t("END_DATE"),
          type: 'date',
          validation: Yup.date()
            .required(t("END_DATE_IS_REQUIRED"))
            .min(Yup.ref('startDate'), t("END_DATE_MUST_BE_AFTER_START_DATE")),
          isRequired: true,
        },
        {
          name: 'desc',
          label: t("DESCRIPTION"),
          type: 'text',
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

  // Function for submit academic year form
  const handleFormSubmit = async (values: CreateAcademicYearPayload): Promise<void> => {
    if (!id) {
      try {
        const result = await academicYearStore.createAcademicYear(sanitizePayload(values) as CreateAcademicYearPayload);
        if (result.success) {
          showToast('success', `${t('ACADEMIC_YEAR')} ${t("CREATED_SUCCESSFULLY")}`);
          navigate(-1);
        } else {
          // Check if error message is a translation key
          const errorMessage = result.error && t(result.error) !== result.error
            ? t(result.error)
            : result.error || `${t("FAILED_TO_CREATE")} ${t('ACADEMIC_YEAR')}`;
          showToast('error', errorMessage);
        }
      } catch (err) {
        showToast('error', `${t("FAILED_TO_CREATE")} ${t('ACADEMIC_YEAR')}`);
      }
    } else {
      try {
        const oUpdtPayload = {
          ...values,
          _id: id
        }
        const result = await academicYearStore.updateAcademicYear(sanitizePayload(oUpdtPayload) as CreateAcademicYearPayload);
        if (result.success) {
          showToast('success', `${t('ACADEMIC_YEAR')} ${t("UPDATED_SUCCESSFULLY")}`);
          navigate(-1);
        } else {
          // Check if error message is a translation key
          const errorMessage = result.error && t(result.error) !== result.error
            ? t(result.error)
            : result.error || `${t("FAILED_TO_UPDATE")} ${t('ACADEMIC_YEAR')}`;
          showToast('error', errorMessage);
        }
      } catch (err) {
        showToast('error', `${t("FAILED_TO_UPDATE")} ${t('ACADEMIC_YEAR')}`);
      }
    }
  };

  // Load edit academic year details
  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const oAcademicYear = await academicYearStore.getAcademicYearById(id);
          if (oAcademicYear && typeof oAcademicYear === 'object') {
            setEditValues(oAcademicYear);
          }
        } catch (err) {
          showToast('error', `${t("FAILED_TO_FETCH")} ${t('ACADEMIC_YEAR')} ${t('DETAILS')}`);
        }
      }
    })()
  }, [id])

  return (
    <DynamicForm
      schema={schema}
      pageTitle={t("ACADEMIC_YEAR")}
      onSubmit={handleFormSubmit}
      isEditPerm={true}
      oInitialValues={id ? editValues : ""}
    />
  );
};

export default AcademicYearForm;