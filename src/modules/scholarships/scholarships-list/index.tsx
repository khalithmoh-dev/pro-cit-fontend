import React, { useState } from 'react'
import style from "./scholarships.module.css"
import TableControlBox from '../../../components/table-control-box'
import TableRow from '../../../components/table-row'
import Button from '../../../components/button'
import ScholarshipsTableComoponent from './scholarships-table'
import Pagination from '../../../components/pagination'
import { useNavigate } from 'react-router-dom'
import { useToastStore } from '../../../store/toastStore'
import PlusIcon from '../../../icon-components/PlusIcon'

const ScholarshipsListPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [tableRows, setTableRows] = useState("5");
    const [showCacheMessage, setShowCacheMessage] = useState(true);
    const { showToast } = useToastStore();

    const onRefresh = async () => {
        let res

        // const res = await getPrograms();
        if (res) {

            setShowCacheMessage(false);
            showToast("success", "Programs refreshed successfully");
        } else {
            showToast("error", "Failed to refresh programs");
        }
    };
    return (
        <div className={style.container}>
            <TableControlBox tableName="Scholarship" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
                <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

                <Button onClick={() => navigate("/scholarships/create")} startIcon={<PlusIcon fill="white" />}>
                    Create&nbsp;Program
                </Button>
            </TableControlBox>
            <div className={style.tableContainer}>
                <ScholarshipsTableComoponent />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(1)}
                onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
        </div>
    )
}

export default ScholarshipsListPage

const options = ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20"];
