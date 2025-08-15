import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const CourseListPage = lazy(() => import("../modules/courses/course-list"));
const CreateCoursePage = lazy(() => import("../modules/courses/create-course"));

const CoursesRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/list" element={<CourseListPage />} />
        <Route path="/create" element={<CreateCoursePage />} />
        <Route path="/update/:id" element={<CreateCoursePage update />} />
      </Routes>
    </Suspense>
  );
};

export default CoursesRoutes;
