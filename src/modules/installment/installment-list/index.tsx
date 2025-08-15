import { useEffect, useState } from "react";
import style from "./installment.module.css";
import TableControlBox from "../../../components/table-control-box";
import TableRow from "../../../components/table-row";
import Button from "../../../components/button";
import PlusIcon from "../../../icon-components/PlusIcon";
import Pagination from "../../../components/pagination/index.tsx";
import { useNavigate } from "react-router-dom";
import useFeeCategoryStore from "../../../store/feeCategoryStore";
import { useToastStore } from "../../../store/toastStore.ts";
import InstallMentTableComponent from "./intallment-table/index.tsx";
import useInstallmentStore from "../../../store/installmentStore.ts";
import BuSelect from "../../../components/bu-select/index.tsx";
import useStudentStore from "../../../store/studentStore.ts";

const InstallmentListPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [tableRows, setTableRows] = useState("5");
    const { getFeeStructures, feeStructuresOptions } = useFeeCategoryStore()
    const { getStudents, studentOptions } = useStudentStore();

    const { getInstallmentFeesStructure } = useInstallmentStore()
    const [showCacheMessage, setShowCacheMessage] = useState(true);
    const { showToast } = useToastStore();

    const [feesStructure, setSelectFeesStructure] = useState("");
    const [selectedStudent, setSelectStudent] = useState("");

    useEffect(() => {
        getInstallmentFeesStructure({
            fee_structure_id: feesStructure,
            student_id: selectedStudent,
        })
    }, [tableRows, currentPage, feesStructure, selectedStudent]);

    useEffect(() => {
        if (feeStructuresOptions.length) return;
        getFeeStructures();
    }, []);
    useEffect(() => {
        if (studentOptions.length) return;
        getStudents();
    }, []);



    const onRefresh = async () => {
        const res = await getFeeStructures();
        if (res) {
            setShowCacheMessage(false);
            showToast("success", "StudentCategorys refreshed successfully");
        } else {
            showToast("error", "Failed to refresh StudentCategorys");
        }
    };

    return (
        <div className={style.container}>
            <TableControlBox tableName="Installment" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
                <BuSelect
                    options={feeStructuresOptions}
                    update={(feesStructure) => setSelectFeesStructure(feesStructure)}
                    clearFilter={() => setSelectFeesStructure("")}
                    label="Fees Structure"
                />
                <BuSelect
                    options={studentOptions}
                    update={(student) => setSelectStudent(student)}
                    clearFilter={() => setSelectStudent("")}
                    label="Select Student"
                />
                <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />
                <Button onClick={() => navigate("/installment/create")} startIcon={<PlusIcon fill="white" />}>
                    Create&nbsp;Installment
                </Button>
            </TableControlBox>
            <div className={style.tableContainer}>
                <InstallMentTableComponent />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(1)}
                onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
        </div>
    );
};

export default InstallmentListPage;

const options = ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20"];
