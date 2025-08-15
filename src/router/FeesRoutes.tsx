import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const FeeCategoryListPage = lazy(() => import("../modules/fee-category/fee-category-list"));
const CreateFeeCategoryPage = lazy(() => import("../modules/fee-category/create-fee-category"));

const FeesRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/list" element={<FeeCategoryListPage />} />
        <Route path="/create" element={<CreateFeeCategoryPage />} />
        <Route path="/update/:id" element={<CreateFeeCategoryPage update />} />
      </Routes>
    </Suspense>
  );
};

export default FeesRoutes;
