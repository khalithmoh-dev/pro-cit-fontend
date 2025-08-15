import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'


const ReportListPage = lazy(() => import("../modules/report/reporting-list"));

const ReportRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/list" element={<ReportListPage />} />
            </Routes>
        </Suspense>
    )
}

export default ReportRoutes
