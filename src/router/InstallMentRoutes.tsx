import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const InstallmentListPage = lazy(() => import("../modules/installment/installment-list"));
const InstallmentCreateCategoryPage = lazy(() => import("../modules/installment/installment-create"));

const InstallMentRoutesRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/list" element={<InstallmentListPage />} />
        <Route path="/create" element={<InstallmentCreateCategoryPage />} />
        <Route path="/update/:id" element={<InstallmentCreateCategoryPage update />} />
      </Routes>
    </Suspense>
  );
};

export default InstallMentRoutesRoutes;
