import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const StudentCategoryListPage = lazy(() => import("../modules/student-categories/student-category-list"));
const StudentCreateCategoryPage = lazy(() => import("../modules/student-categories/student-create-category"));

const StudentCategoryRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/list" element={<StudentCategoryListPage />} />
        <Route path="/create" element={<StudentCreateCategoryPage />} />
        <Route path="/update/:id" element={<StudentCreateCategoryPage update />} />
      </Routes>
    </Suspense>
  );
};

export default StudentCategoryRoutes;
