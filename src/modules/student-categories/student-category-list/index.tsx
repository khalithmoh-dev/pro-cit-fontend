import { useState } from "react";
import style from "./student-category.module.css";
import TableControlBox from "../../../components/table-control-box";
import TableRow from "../../../components/table-row";
import Button from "../../../components/button";
import PlusIcon from "../../../icon-components/PlusIcon";
import Pagination from "../../../components/pagination/index.tsx";
import { useNavigate } from "react-router-dom";
import useFeeCategoryStore from "../../../store/feeCategoryStore";
import { useToastStore } from "../../../store/toastStore.ts";
import StudentCategoryTableComponent from "./student-category-table/index.tsx";

const StudentCategoryListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState("5");
  const { getFeeStructures } = useFeeCategoryStore()
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const { showToast } = useToastStore();

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
      <TableControlBox tableName="Student Category" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
        <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

        <Button onClick={() => navigate("/studentcategory/create")} startIcon={<PlusIcon fill="white" />}>
          Create&nbsp;Category
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <StudentCategoryTableComponent />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default StudentCategoryListPage;

const options = ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20"];
