import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageLoader from '../../components/page-loader';
import Layout from '../../modules/layout';

// Lazy loaded route modules
const DashboardRoutes = lazy(() => import('./DashboardRoutes'));
const AdmissionRoutes = lazy(() => import('./AdmissionRoutes'));
const AttendanceRoutes = lazy(() => import('./AttendanceRoutes'));
const CalendarRoutes = lazy(() => import('./CalendarRoutes'));
const TimeTableRoutes = lazy(() => import('./TimeTableRoutes'));
const DepartmentRoutes = lazy(() => import('./DepartmentRoutes'));
const DegreeRoutes = lazy(() => import('./DegreeRoutes'));
const DesignationRoutes = lazy(() => import('./DesignationRoutes'));
const EmployeeRoutes = lazy(() => import('./EmployeeRoutes'));
const FeeHeadRoutes = lazy(() => import('./FeeHeadRoutes'));
const FormbuilderRoutes = lazy(() => import('./FormbuilderRoutes'));
const BaseConfigRoutes = lazy(() => import('./BaseConfigRoutes'));
const GroupRoutes = lazy(() => import('./GroupRoutes'));
const ModuleRoutes = lazy(() => import('./ModuleRoutes'));
const RoleRoutes = lazy(() => import('./RoleRoutes'));
const StudentRoutes = lazy(() => import('./StudentRoutes'));
const SubjectRoutes = lazy(() => import('./SubjectRoutes'));
const SwapRoutes = lazy(() => import('./SwapRoutes'));
const QuickCollectSettingRoutes = lazy(() => import('../QuickCollectSettingRoutes'));
const UserRoutes = lazy(() => import('./UserRoutes'));
const FeesRoutes = lazy(() => import('../FeesRoutes'));
const CoursesRoutes = lazy(() => import('../CoursesRoutes'));
const DiscountRoutes = lazy(() => import('../DiscountRoutes'));
const StudentCategoryRoutes = lazy(() => import('../StudentCategoryRoutes'));
const InstallMentRoutesRoutes = lazy(() => import('../InstallMentRoutes'));
const StudentFeePaymentRoutes = lazy(() => import('../StudentFeePaymentRoutes'));
const QuickCollectRoutes = lazy(() => import('../QuickCollectRoutes'));
const ReportRoutes = lazy(() => import('../ReportRoutes'));
const InstituteRoutes = (lazy(() => import ('./InstituteRoutes')))
const SemesterRoutes = (lazy(() => import ('./SemesterRoutes')))

// Direct imports (not lazy)
import OutcomeListPage from '../../modules/outcomes/outcome-list';
import OutcomeDetails from '../../modules/outcomes/outcome-details';
import CreateOutcomePage from '../../modules/outcomes/create-PO';
import CreatePEOPage from '../../modules/outcomes/create-PEO';
import CO from '../../modules/outcomes/CO';
import CreateCO from '../../modules/outcomes/CO/create-CO';
import COPOPSOMapping from '../../modules/outcomes/CO-PO-PSO-mapping';
import ExamList from '../../modules/exam/exam-list';
import CreateExam from '../../modules/exam/exam-list/create-exam';
import QuestionPaperList from '../../modules/question-paper';
import CreateQuestionPaperV2 from '../../modules/question-paper/create-question-paper';
import MarksUploadForm from '../../modules/question-paper/marks-upload-form';
import Attainment from '../../modules/attainment';
import CreateCoConfig from '../../modules/attainment/co-config/create-co-config';

const AuthenticatedRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Parent route with Layout */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes */}
          <Route path="dashboard/*" element={<DashboardRoutes />} />
          <Route path="admission/*" element={<AdmissionRoutes />} />
          <Route path="attendance/*" element={<AttendanceRoutes />} />
          <Route path="calendar/*" element={<CalendarRoutes />} />
          <Route path="department/*" element={<DepartmentRoutes />} />
          <Route path="degree/*" element={<DegreeRoutes />} />
          <Route path="institute/*" element={<InstituteRoutes /> } />
          <Route path="designation/*" element={<DesignationRoutes />} />
          <Route path="employee/*" element={<EmployeeRoutes />} />
          <Route path="feeHead/*" element={<FeeHeadRoutes />} />
          <Route path="formbuilder/*" element={<FormbuilderRoutes />} />
          <Route path="group/*" element={<GroupRoutes />} />
          <Route path="module/*" element={<ModuleRoutes />} />
          <Route path="role/*" element={<RoleRoutes />} />
          <Route path="student/*" element={<StudentRoutes />} />
          <Route path="subject/*" element={<SubjectRoutes />} />
          <Route path="swap/*" element={<SwapRoutes />} />
          <Route path="timetable/*" element={<TimeTableRoutes />} />
          <Route path="user/*" element={<UserRoutes />} />
          <Route path="feescategory/*" element={<FeesRoutes />} />
          <Route path="courses/*" element={<CoursesRoutes />} />
          <Route path="discount/*" element={<DiscountRoutes />} />
          <Route path="studentcategory/*" element={<StudentCategoryRoutes />} />
          <Route path="installment/*" element={<InstallMentRoutesRoutes />} />
          <Route path="feepayment/*" element={<StudentFeePaymentRoutes />} />
          <Route path="quick-collect/*" element={<QuickCollectRoutes />} />
          <Route path="quicksettings/*" element={<QuickCollectSettingRoutes />} />
          <Route path="report/*" element={<ReportRoutes />} />
          <Route path="configuration/*" element={<BaseConfigRoutes />} />
          <Route path='semester/*' element={<SemesterRoutes/>} />

          {/* Direct routes */}
          <Route index element={<DashboardRoutes />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          {/* Outcomes */}
          <Route path="outcomes" element={<OutcomeListPage />} />
          <Route path="outcome" element={<OutcomeDetails />} />
          <Route path="outcome/create" element={<CreateOutcomePage />} />
          <Route path="outcome/update/:id" element={<CreateOutcomePage update />} />
          <Route path="outcome/PEO/create" element={<CreatePEOPage />} />
          <Route path="outcome/PEO/update/:id" element={<CreatePEOPage update />} />

          {/* CO & Mapping */}
          <Route path="course-outcomes" element={<CO />} />
          <Route path="course-outcome/create/:subject_id" element={<CreateCO />} />
          <Route path="course-outcome/update/:subject_id/:id" element={<CreateCO update />} />
          <Route path="course-outcome/mapping/:subject_id" element={<COPOPSOMapping />} />

          {/* Exams */}
          <Route path="exams" element={<ExamList />} />
          <Route path="exam/create" element={<CreateExam />} />
          <Route path="exam/edit/:id" element={<CreateExam update />} />

          {/* Question Paper */}
          <Route path="question-papers" element={<QuestionPaperList />} />
          <Route path="question-paper/create" element={<CreateQuestionPaperV2 />} />
          <Route path="question-paper/edit/:id" element={<CreateQuestionPaperV2 update />} />
          <Route path="question-paper/marks-upload/:id" element={<MarksUploadForm />} />

          {/* Attainment */}
          <Route path="attainment" element={<Attainment />} />
          <Route path="attainment/config/:subjectId" element={<CreateCoConfig />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AuthenticatedRoutes;
