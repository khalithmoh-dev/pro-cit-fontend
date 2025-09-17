import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import DynamicForm from '../../../../components/generic-form';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from 'react-router-dom';
import useBaseStore from '../../../../store/baseStore';
import useCourseStore, { createCoursePayload } from "../../../../store/courseStores";

const CourseForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const baseStore = useBaseStore();
  const courseStore = useCourseStore();
  const [baseData, setBaseData] = useState({ dept: [] });
  const { id } = useParams<{ id: string }>();
  const [editValues, setEditValues] = useState({});
  const oInitialValues: object = {
    crsId: '',
    crsNm: '',
    offDept: '',
    crsType: '',
    isSplit: false,
    crdt: undefined,
    tCrdt: undefined,
    pCrdt: undefined,
    category: '',
    subCat: '',
    isExamCrs: false
  };
  const schema = {
    fields: {
      General: [
        {
          name: 'insName',
          label: 'Institution name',
          type: 'text',
          validation: Yup.string().required('Institution Name is required'),
          isRequired: true,
          isDisabled: true,
        },
        {
          name: 'crsId',
          label: t('COURSE_ID'),
          type: 'text',
          validation: Yup.string().required(t("COURSE_ID_IS_REQUIRED")),
          isRequired: true
        },
        {
          name: 'crsNm',
          label: t("COURSE_NAME"),
          type: 'text',
          validation: Yup.string().required(t("COURSE_NAME_IS_REQUIRED")),
          isRequired: true,
        },
        {
          name: 'offDept',
          label: t('OFFERING_DEPARTMENT'),
          type: 'select',
          options: baseData?.dept ?? [],
        },
        {
          name: 'crsType',
          label: t('COURSE_TYPE'),
          type: 'select',
          options: [
            { value: 'THEORY', label: t("THEORY") },
            { value: 'PRAC', label: t("PRACTICAL") },
            { value: 'BOTH', label: t("BOTH") },
          ]
        },
        {
          name: 'isSplit',
          removeHeader: true,
          showWhen: {
            field: "crsType",
            value: "BOTH",
          },
          className: 'mt-3',
          label: t('SPLIT_CREDIT'),
          type: 'checkbox',
        },
        {
          name: 'tCrdt',
          label: t("THEORY_CREDIT"),
          type: 'number',
          showWhen: {
            field: "isSplit",
            value: true,
          },
          validation: Yup.string().when('isSplit', {
            is: true,
            then: () => Yup.string().required(t("THEORY_CREDIT_IS_REQUIRED")),
            otherwise: () => Yup.number(),
          }),
          isRequired: true,
        },
        {
          name: 'pCrdt',
          label: t("PRACTICAL_CREDIT"),
          type: 'number',
          showWhen: {
            field: "isSplit",
            value: true,
          },
          validation: Yup.string().when('isSplit', {
            is: true,
            then: () => Yup.string().required(t("PRACTICAL_CREDIT_IS_REQUIRED")),
            otherwise: () => Yup.number(),
          }),
          isRequired: true,
        },
        {
          name: 'category',
          label: t('CATEGORY'),
          type: 'select',
          options: [
            { value: 'EXAM', label: t("EXAM") },
            { value: 'ASSIGNMENT', label: t("ASSIGNMENT") },
            { value: 'CS', label: t("CASE_STUDY") },
          ]
        },
        {
          name: 'subCat',
          label: t('SUB_CATEGORY'),
          type: 'select',
          options: [
            { value: 'EXAM', label: t("EXAM") },
            { value: 'ASSIGNMENT', label: t("ASSIGNMENT") },
            { value: 'CS', label: t("CASE_STUDY") },
          ]
        },
        {
          name: 'isExamCrs',
          removeHeader: true,
          label: t('IS_EXAM_SUBJECT'),
          type: 'checkbox',
          className: 'mt-3',
        }
      ]
    },
    buttons: [
      {
        name: 'Cancel',
        variant: 'outlined',
        color: 'secondary',
        onClick: () => {
          navigate(-1);
        },
      },
      {
        name: id ? 'UPDATE' : 'SUBMIT',
        variant: 'contained',
        color: 'primary',
        type: 'submit',
      },
    ],
  };

  const handleFormSubmit = async (values: createCoursePayload): Promise<void> => {
    if (!id) {
      await courseStore.createCourse(values);
    } else {
      const oUpdtPayload = {
        ...values,
        _id: id
      }
      await courseStore.updateCourse(oUpdtPayload);
    }
    navigate(-1)
  };

  //to get the initial base data eg: program data and degree data
  useEffect(() => {
    try {
      if (baseStore) {
        (async () => {
          const aReq = ['departments'];
          setBaseData(await baseStore.getBaseData(aReq));
        })();
      }
    } catch (err) {
      console.error(err)
    }
  }, [baseStore]);

  useEffect(() => {
    (async () => {
      if (id) {
        const oCourse = await courseStore.getCourseById(id)
        setEditValues(oCourse);
      }
    })()
  }, [id])

  return (
    <>
      <DynamicForm
        schema={schema}
        pageTitle={t("COURSE")}
        onSubmit={handleFormSubmit}
        isEditPerm={true}
        oInitialValues={id ? editValues : oInitialValues}
        isSmartField={true}
      />
    </>
  );
};

export default CourseForm;
