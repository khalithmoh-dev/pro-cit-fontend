import { useNavigate } from 'react-router-dom';
import useCourseScheduleStore, { srchCrsSchdlPyldIF } from '../../../store/course-scheduleStore';
import EnterpriseFilterForm from "../../../components/enterprisefilter";
import ElectiveGroup from './GroupComponent';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Box } from '@mui/material';
import Button from '../../../components/ButtonMui';
import { useLayout } from '../../layout/LayoutContext'
import Switch from '../../../components/switch';

/**
 * CourseSchedulePage Component
 *
 * Manages course schedules for semesters, allowing users to:
 * - Search for existing course schedules by institute, degree, program, department, and semester
 * - Create new course schedules with mandatory and elective courses
 * - Update existing course schedules
 * - Manage course capacity and deletion status
 *
 * Features:
 * - Enterprise filter for selecting academic hierarchy
 * - Mandatory and elective course grouping
 * - Edit mode toggle for controlled editing
 * - Duplicate course detection across groups
 *
 * @component
 */
const CourseSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [editValues, setEditValues] = useState<srchCrsSchdlPyldIF>({
    insId: '',
    degId: '',
    prgId: '',
    deptId: '',
    semCd: '', mandatoryCourses: [], electiveCourses: []
  });
  const [mandatoryCourses, setMandatoryCourses] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const { searchCourseSchedule, createCourseSchedule, updateCourseSchedule } = useCourseScheduleStore();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [update, setUpdate] = useState(false);
  const { setRouteNm, setActionFields } = useLayout();
  const [editPerm, setEditPerm] = useState(true);

  /**
   * Set up route name and edit mode switch in layout header
   */
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

  /**
   * Resets the course schedule form and clears all course data
   */
  const handleReset = () => {
    setIsDataFetched(false);
    setEditValues({
      insId: '',
      degId: '',
      prgId: '',
      deptId: '',
      semCd: '', mandatoryCourses: [], electiveCourses: []
    });
    setMandatoryCourses([]);
    setElectiveCourses([]);
    setUpdate(false);
  }

  /**
   * Handles course schedule search
   * Fetches existing schedule or prepares for new schedule creation
   *
   * @param {srchCrsSchdlPyldIF} values - Search filters (insId, degId, prgId, deptId, semCd)
   */
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
      // Error during course schedule search
    }
  };

  /**
   * Saves or updates the course schedule
   * Creates new schedule or updates existing one based on update flag
   */
  const handleSaveCrsSchl = async () => {
    try {
      const payload = {
        ...editValues,
        mandatoryCrs: mandatoryCourses?.map(crs => ({ crsId: crs._id, capacity: crs?.capacity, isDeleted: crs?.isDeleted })) ?? [],
        electiveCrs: electiveCourses?.map(crs => ({ crsId: crs._id, capacity: crs?.capacity, isDeleted: crs?.isDeleted })) ?? []
      };
      const res = update ? await updateCourseSchedule(payload, editValues?._id) : await createCourseSchedule(payload);

    } catch (err) {
      // Error during course schedule save/update
    }
  }

  return (
    <>
      <EnterpriseFilterForm
        autoFieldSchema={{
          institutes: {
            label: t("INSTITUTION_NAME"),
            type: 'select',
            required: true,
          },
          degree: {
            label: t("DEGREE"),
            type: "select",
            required: true,
          },
          program: {
            label: t("PROGRAM"),
            type: "select",
            required: true,
          },
          department: {
            label: t("DEPARTMENT"),
            type: "select",
            required: true,
          },
          semester: {
            label: t("SEMESTER"),
            type: "select",
            required: true,
          }
        }}
        schema={{
          buttons: [
            {
              name: t("RESET"),
              nature: "reset",
              onClick: handleReset
            },
            {
              name: t("SEARCH"),
              type: "submit",
              nature: "primary"
            }
          ]
        }}
        onSubmit={handleCrsSchlSrch}
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
          </Box>
        </>
      }
    </>
  );
};

export default CourseSchedulePage;
