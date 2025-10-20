import { useNavigate, useParams } from 'react-router-dom';
import useCourseScheduleStore, { srchCrsSchdlPyldIF } from './../../store/course-scheduleStore';
import EnterpriseFilterForm from "./../../components/enterprisefilter";
import ElectiveGroup from './GroupComponent';
import * as Yup from "yup";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import useBaseStore from '../../store/baseStore';
import { Box } from '@mui/material';
import Button from '../../components/Button';
import { useLayout } from '../../modules/layout/LayoutContext'
import Switch from '../../components/switch';

const CourseSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const baseStore = useBaseStore();
  const [editValues, setEditValues] = useState({
    _id: '',
    insId: '',
    degId: '',
    prgId: '',
    deptId: '',
    semId: '', mandatoryCourses: [], electiveCourses: []
  });
  const [mandatoryCourses, setMandatoryCourses] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const { searchCourseSchedule, createCourseSchedule, updateCourseSchedule } = useCourseScheduleStore();
  const [baseData, setBaseData] = useState({ degree: [], program: [], department: [], semester: [] });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [update, setUpdate] = useState(false);
  const { setRouteNm, setActionFields } = useLayout();
  const [editPerm, setEditPerm] = useState(true);

  //to get the initial base data eg: program data and degree data
  useEffect(() => {
    try {
      if (baseStore) {
        (async () => {
          const aReq = ['degree', 'program', 'department', 'semester'];
          const oBaseData = await baseStore.getBaseData(aReq);
          setBaseData(oBaseData);
        })();
      }
    } catch (err) {
      console.error(err);
    }
  }, [baseStore]);

  useEffect(() => {
    if (location.pathname) {
      setRouteNm(location.pathname);
      setActionFields([<Switch checked={editPerm} onChange={() => {
        setEditPerm(prevEditPerm => {
          return !prevEditPerm;
        });
      }} label="Edit mode" />])
    }
  }, [location.pathname]);

  const handleReset = () => {
    setIsDataFetched(false);
    setEditValues({
      _id: '',
      insId: '',
      degId: '',
      prgId: '',
      deptId: '',
      semId: '', mandatoryCourses: [], electiveCourses: []
    });
    setMandatoryCourses([]);
    setElectiveCourses([]);
    setUpdate(false);
  }

  const schema = {
    fields: {
      COURSE_SCHEDULE: [
        {
          name: "insId",
          label: t("INSTITUITION_NAME"),
          type: "select",
          validation: Yup.string().required(t("INSTITUITION_NAME_IS_REQUIRED")),
          isRequired: true,
          isDisabled: true
        },
        {
          name: "degId",
          label: t("DEGREE"),
          type: "select",
          labelKey: "degNm",
          valueKey: "_id",
          validation: Yup.string().required(t("DEGREE_IS_REQUIRED")),
          isRequired: true,
          options: baseData?.degree ?? []
        }, {
          name: "prgId",
          label: t("PROGRAM"),
          type: "select",
          labelKey: "prgNm",
          valueKey: "_id",
          validation: Yup.string().required(t("PROGRAM_IS_REQUIRED")),
          isRequired: true,
          options: baseData?.program ?? []
        },
        {
          name: "deptId",
          label: t("DEPARTMENT"),
          type: "select",
          labelKey: "deptNm",
          valueKey: "_id",
          validation: Yup.string().required(t("DEPARTMENT_IS_REQUIRED")),
          isRequired: true,
          options: baseData?.department ?? []
        },
        {
          name: "semId",
          label: t("SEMESTER"),
          type: "select",
          labelKey: "semNm",
          valueKey: "_id",
          validation: Yup.string().required(t("SEMESTER_IS_REQUIRED")),
          isRequired: true,
          options: baseData?.semester ?? []
        }
      ]
    },
    buttons: [
      {
        name: t("RESET"), variant: "outlined", nature: "warning", onClick: handleReset
      }, {
        name: t("SEARCH"), variant: "contained", nature: "primary", type: "submit"
      }
    ]
  };

  const handleCrsSchlSrch = async (values: srchCrsSchdlPyldIF) => {
    try {
      handleReset();
      const res = await searchCourseSchedule(values);
      setIsDataFetched(true);
      if (Array.isArray(res) && res.length) {
        setUpdate(true);
        setEditValues(res[0]);
        setMandatoryCourses(res[0]?.mandatoryCrs ?? []);
        setElectiveCourses(res[0]?.electiveCrs ?? []);
      } else {
        setUpdate(false);
        setEditValues(values);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCrsSchl = async () => {
    try {
      const payload = {
        ...editValues,
        mandatoryCrs: mandatoryCourses?.map(crs => ({ crsId: crs._id, capacity: crs?.capacity, isDeleted: crs?.isDeleted })) ?? [],
        electiveCrs: electiveCourses?.map(crs => ({ crsId: crs._id, capacity: crs?.capacity, isDeleted: crs?.isDeleted })) ?? []
      };
      const res = update ? await updateCourseSchedule(payload, editValues?._id) : await createCourseSchedule(payload);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <EnterpriseFilterForm
        schema={schema}
        onSubmit={handleCrsSchlSrch}
        isSmartField={false}
      />
      {isDataFetched &&
        <>
          <ElectiveGroup
            title={t("MANDATORY")}
            coursesList={mandatoryCourses?.length ? mandatoryCourses : []}
            setCoursesList={setMandatoryCourses}
            checkDuplicate={electiveCourses?.length ? electiveCourses : []}
            isEditPerm={editPerm}
          />
          <ElectiveGroup
            title={t("ELECTIVE")}
            coursesList={electiveCourses?.length ? electiveCourses : []}
            setCoursesList={setElectiveCourses}
            checkDuplicate={mandatoryCourses?.length ? mandatoryCourses : []}
            isEditPerm={editPerm}
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mr={4}>
            <Button
              color='secondary'
              size="medium"
              onClick={() => navigate(-1)}
              type='button'
              disabled={false}
              variantType='cancel'
            >
              {t("CANCEL")}
            </Button>
            <Button
              color='primary'
              size="medium"
              onClick={handleSaveCrsSchl}
              type='button'
              disabled={
                !editPerm ||
                (mandatoryCourses.filter(c => !c.isDeleted).length === 0 &&
                electiveCourses.filter(c => !c.isDeleted).length === 0)
              }
              variantType="primary"
            >
              {update ? t('UPDATE') : t("SAVE")}
            </Button>
            {console.log('mandatoryCourses',mandatoryCourses,electiveCourses)}
          </Box>
        </>
      }
    </>
  );
};

export default CourseSchedulePage;
