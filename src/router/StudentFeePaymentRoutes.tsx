import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const StudentFeesPaymentListPage = lazy(() => import("../modules/student-fees-payment/student-fees-payment-list"));
const CreateStudentFeesPaymentPage = lazy(() => import("../modules/student-fees-payment/student-create-fees-payment"));
const StudentFeesPaymentViewPage = lazy(() => import("../modules/student-fees-payment/student-payment-view"));

const StudentFeePaymentRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/list" element={<StudentFeesPaymentListPage />} />
                <Route path="/create" element={<CreateStudentFeesPaymentPage />} />
                {/* <Route path="/view" element={<StudentFeesPaymentViewPage />} /> */}
                <Route path="/view/:id" element={<StudentFeesPaymentViewPage />} />
                <Route path="/update/:id" element={<CreateStudentFeesPaymentPage />} />
            </Routes>
        </Suspense>
    );
};

export default StudentFeePaymentRoutes;
