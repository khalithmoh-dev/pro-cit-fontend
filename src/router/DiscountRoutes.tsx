import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DiscountCategoryListPage = lazy(() => import("../modules/discount-category/discount-category-list"));
const CreateDiscountCategoryPage = lazy(() => import("../modules/discount-category/create-discount-category"));

const DiscountRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/list" element={<DiscountCategoryListPage />} />
        <Route path="/create" element={<CreateDiscountCategoryPage />} />
        <Route path="/update/:id" element={<CreateDiscountCategoryPage update />} />
      </Routes>
    </Suspense>
  );
};

export default DiscountRoutes;
