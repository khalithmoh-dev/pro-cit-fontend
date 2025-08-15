import { useState } from "react";
import style from "./discount-category.module.css";
import TableControlBox from "../../../components/table-control-box";
import TableRow from "../../../components/table-row";
import Button from "../../../components/button";
import PlusIcon from "../../../icon-components/PlusIcon";
import Pagination from "../../../components/pagination/index.tsx";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../../store/toastStore.ts";
import DiscountCategoryTableComponent from "./discount-category-table/index.tsx";
import useDiscountStore from "../../../store/discountCategoryStore.ts";

const DiscountCategoryListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState("5");
  const { getDiscounts } = useDiscountStore()
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const { showToast } = useToastStore();

  const onRefresh = async () => {
    const res = await getDiscounts();
    if (res) {
      setShowCacheMessage(false);
      showToast("success", "discountCategorys refreshed successfully");
    } else {
      showToast("error", "Failed to refresh discountCategorys");
    }
  };

  return (
    <div className={style.container}>
      <TableControlBox tableName="Discount" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
        <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

        <Button onClick={() => navigate("/discount/create")} startIcon={<PlusIcon fill="white" />}>
          Create&nbsp;Discount
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <DiscountCategoryTableComponent />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default DiscountCategoryListPage;

const options = ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20"];
