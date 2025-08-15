import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const QuickCollectListPage = lazy(() => import("../modules/quick-collect/quick-collect-list"));


const QuickCollectRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/list" element={<QuickCollectListPage />} />
            </Routes>
        </Suspense>
    )
}

export default QuickCollectRoutes
