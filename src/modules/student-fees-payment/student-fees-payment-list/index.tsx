import { useState } from "react";
import style from "./student-fees-payement.module.css";
import TableControlBox from "../../../components/table-control-box";
import TableRow from "../../../components/table-row";
import Button from "../../../components/button";
import PlusIcon from "../../../icon-components/PlusIcon";
import Pagination from "../../../components/pagination/index.tsx";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../../store/toastStore.ts";
import StudentFeesPaymentTableComponent from "./student-fees-payment-table/index.tsx";

const StudentFeesPaymentListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState("5");
  //   const { getFeeStructures } = useFeeCategoryStore()
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const { showToast } = useToastStore();

  const onRefresh = async () => {
    // const res = await getFeeStructures();
    // if (res) {
    //   setShowCacheMessage(false);
    //   showToast("success", "StudentCategorys refreshed successfully");
    // } else {
    //   showToast("error", "Failed to refresh StudentCategorys");
    // }
  };

  return (
    <div className={style.container}>
      <TableControlBox tableName="Student Fee Payment History" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
        <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

        <Button onClick={() => navigate("/feepayment/create")} startIcon={<PlusIcon fill="white" />}>
          Create&nbsp;Student Payment
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <StudentFeesPaymentTableComponent />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default StudentFeesPaymentListPage;

const options = ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20"];
