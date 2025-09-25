import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import DynamicForm from '../../../../components/generic-form';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from 'react-router-dom';
import useBaseStore from '../../../../store/baseStore';
import useCourseStore, { createCoursePayload } from "../../../../store/courseStores";
import Popup from '../../../../components/modal';
import SmartField from '../../../../components/SmartField';

const CourseForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const baseStore = useBaseStore();
  const courseStore = useCourseStore();
  const [baseData, setBaseData] = useState({ dept: [], courseCat: [], courseSubCat: [] });
  const { id } = useParams<{ id: string }>();
  const [editValues, setEditValues] = useState({});
  const [isCatPopOpen, setIsCatPopOpen] = useState(false);
  const [oCourseCat, setOCourseCat] = useState({ catId: '', catNm: '', _id: '' });
  const [isSubCatPopOpen, setIsSubCatPopOpen] = useState(false);
  const [oCourseSubCat, setOCourseSubCat] = useState({ catId: '', subCatId: '', subCatNm: '', _id: '' });
  const [subCatList, setSubCatList] = useState([]);
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

  // Open popup for add/edit course category
  const handleAddEditCatClick = async (cat, isEdit) => {
    if (isEdit) {
      const catData = baseData?.courseCat?.find(c => c._id === cat);
      setOCourseCat(catData);
    } else {
      setOCourseCat({ catId: '', catNm: '', _id: '' });
    }
    setIsCatPopOpen(true);
  };

  // Open popup for add/edit course sub-category
  const handleAddEditSubCatClick = async (values, isEdit) => {
    if (isEdit) {
      const subCatData = baseData?.courseSubCat?.find(c => c._id === values?.subCat);
      setOCourseSubCat(subCatData);
    } else {
      setOCourseSubCat({ catId: values?.category, subCatId: '', subCatNm: '', _id: '' });
    }
    setIsSubCatPopOpen(true);
  };

  // Handle function for category change
  const handleCatChange = (cat) => {
    if(cat){
      const subCatDataList = baseData?.courseSubCat?.filter(c => c.catId === cat + "");
      setSubCatList(subCatDataList || []);
    }else{
      setSubCatList([]);
    }
  }

  // Course form schema design
  const schema = {
    fields: {
      General: [
        {
          name: 'insId',
          label: 'Institution name',
          type: 'select',
          validation: Yup.string().required('Institution Name is required'),
          isRequired: true,
          isDisabled: true
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
          labelKey: 'catNm',
          valueKey: '_id',
          options: baseData?.courseCat ?? [],
          showAdd: true,
          onChange: (fieldname, val, formik) => handleCatChange(val, formik),
          addClick: (values) => handleAddEditCatClick(values.category, false),
          addDisabled: false,
          showEdit: true,
          editClick: (values) => handleAddEditCatClick(values.category, true),
          editDisabled: (values) => values.category ? false : true
        },
        {
          name: 'subCat',
          label: t('SUB_CATEGORY'),
          type: 'select',
          labelKey: 'subCatNm',
          valueKey: '_id',
          options: subCatList ?? [],
          showAdd: true,
          addClick: (values) => handleAddEditSubCatClick(values, false),
          addDisabled: (values) => values.category ? false : true,
          showEdit: true,
          editClick: (values) => handleAddEditSubCatClick(values, true),
          editDisabled: (values) => {
            return ((values.category ? false : true) || (values.subCat ? false : true))
          }
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

  // Popup actions for course category model
  const popupActions = [
    {
      label: oCourseCat?._id ? t("UPDATE") : t('CREATE'),
      onClick: () => handleSubmitCat(),
      disabled: !oCourseCat?.catId || !oCourseCat?.catNm
    },
    {
      label: t("CANCEL"),
      onClick: () => setIsCatPopOpen(false),
      secondary: true
    }
  ]

  // Function for submit course form
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
          const aReq = ['departments', 'courseCat', 'courseSubCat'];
          const oBaseData = await baseStore.getBaseData(aReq);
          setBaseData(oBaseData);
        })();
      }
    } catch (err) {
      console.error(err)
    }
  }, [baseStore]);

  // UseEffect function for get edit course details
  useEffect(() => {
    (async () => {
      if (id) {
        const oCourse = await courseStore.getCourseById(id)
        setEditValues(oCourse);
      }
    })()
  }, [id])

  // Function for submit course category form
  const handleSubmitCat = async () => {
    try {
      if (!oCourseCat?._id) {
        const ONewCrsObj = { ...oCourseCat };
        delete ONewCrsObj['_id'];
        await courseStore.createCourseCat(ONewCrsObj);
      } else {
        await courseStore.updateCourseCat(oCourseCat);
      }
      const aReq = ['courseCat'];
      const oBaseData = await baseStore.getBaseData(aReq);
      setBaseData({ ...baseData, courseCat: oBaseData.courseCat });
      setIsCatPopOpen(false);
    } catch (error) {
      console.error(error)
    }
  }

  // Popup action for course sub category model
  const popupActionsSubCat = [
    {
      label: oCourseCat?._id ? t("UPDATE") : t('CREATE'),
      onClick: () => handleSubmitSubCat(),
      disabled: !oCourseSubCat?.subCatId || !oCourseSubCat?.subCatNm
    },
    {
      label: t("CANCEL"),
      onClick: () => setIsSubCatPopOpen(false),
      secondary: true
    }
  ]

  // Function for submit course sub category form
  const handleSubmitSubCat = async () => {
    try {
      if (!oCourseSubCat?._id) {
        const oNewSubCat = { ...oCourseSubCat };
        delete oNewSubCat['_id'];
        await courseStore.createCourseSubCat(oNewSubCat);
      } else {
        await courseStore.updateCourseSubCat(oCourseSubCat);
      }
      const aReq = ['courseSubCat'];
      const oBaseData = await baseStore.getBaseData(aReq);
      setBaseData({...baseData, courseSubCat: oBaseData.courseSubCat})
      const filterByCatId = oCourseSubCat?.catId ? oBaseData.courseSubCat.filter(sc => sc.catId === oCourseSubCat.catId) : oBaseData.courseSubCat;
      setSubCatList(filterByCatId);
      setIsSubCatPopOpen(false);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Popup
        open={isCatPopOpen}
        onClose={() => setIsCatPopOpen(false)}
        title={oCourseCat?._id ? t('EDIT_CATEGORY') : t('ADD_CATEGORY')}
        actions={popupActions}
      >
        <div className='row g-1'>
          <div className='col-6'>
            <SmartField field={{
              name: 'catId',
              label: t('CATEGORY_ID'),
              type: 'text',
              isRequired: true
            }}
              value={oCourseCat?.catId}
              onChange={(fieldname, val) => {
                setOCourseCat({ ...oCourseCat, catId: val })
              }}
              error={oCourseCat?.catId ? '' : t('CATEGORY_ID_IS_REQUIRED')}
            />
          </div>
          <div className='col-6'>
            <SmartField field={{
              name: 'catNm',
              label: t('CATEGORY_NAME'),
              type: 'text',
              isRequired: true
            }}
              value={oCourseCat?.catNm}
              onChange={(fieldNm, val) => setOCourseCat({ ...oCourseCat, catNm: val })}
              error={oCourseCat?.catNm ? '' : t('CATEGORY_NAME_IS_REQUIRED')}
            />
          </div>
        </div>
      </Popup>
      <Popup
        open={isSubCatPopOpen}
        onClose={() => setIsSubCatPopOpen(false)}
        title={oCourseSubCat?._id ? t('EDIT_SUB_CATEGORY') : t('ADD_SUB_CATEGORY')}
        actions={popupActionsSubCat}
      >
        <div className='row g-1'>
          <div className='col-6'>
            <SmartField field={{
              name: 'subCatId',
              label: t('SUB_CATEGORY_ID'),
              type: 'text',
              isRequired: true
            }}
              value={oCourseSubCat?.subCatId}
              onChange={(fieldname, val) => {
                setOCourseSubCat({ ...oCourseSubCat, subCatId: val })
              }}
              error={oCourseSubCat?.subCatId ? '' : t('SUB_CATEGORY_ID_IS_REQUIRED')}
            />
          </div>
          <div className='col-6'>
            <SmartField field={{
              name: 'subCatNm',
              label: t('SUB_CATEGORY_NAME'),
              type: 'text',
              isRequired: true
            }}
              value={oCourseSubCat?.subCatNm}
              onChange={(fieldNm, val) => setOCourseSubCat({ ...oCourseSubCat, subCatNm: val })}
              error={oCourseSubCat?.subCatNm ? '' : t('SUB_CATEGORY_NAME_IS_REQUIRED')}
            />
          </div>
        </div>
      </Popup>
      <DynamicForm
        schema={schema}
        pageTitle={t("COURSE")}
        onSubmit={handleFormSubmit}
        isEditPerm={true}
        oInitialValues={id ? editValues : oInitialValues}
        // isSmartField={true}
      />
    </>
  );
};

export default CourseForm;
