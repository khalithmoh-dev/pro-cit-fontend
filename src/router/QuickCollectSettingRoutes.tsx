import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'


const QuickCollectSettingsListPage = lazy(() => import("../modules/quick-collect-settings/fee-head-settings"));

const QuickCollectSettingRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/list" element={<QuickCollectSettingsListPage />} />
            </Routes>
        </Suspense>
    )
}

export default QuickCollectSettingRoutes
