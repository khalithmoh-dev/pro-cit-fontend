import { useEffect, useState } from 'react';
import style from './fee-category.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../../store/toastStore.ts';
import FeeCategoryTableComponent from './fee-category-table/index.tsx';
import useFeeCategoryStore from "../../../../src/store/feeCategoryStore.ts";
import { FaFilter } from 'react-icons/fa';
import useFeeStructuresStore from '../../../store/addFeeStructure.ts';

const FeeCategoryListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('5');
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const { getFeeStructures } = useFeeCategoryStore();
  const { getAllFeeStructure } = useFeeStructuresStore()
  const { showToast } = useToastStore();

  useEffect(() => {
    getAllFeeStructure('', searchTerm, filterType)
  }, [filterType, getAllFeeStructure, searchTerm])

  const onRefresh = async () => {
    const res = await getFeeStructures();
    if (res) {
      setShowCacheMessage(false);
      showToast('success', 'FeeCategorys refreshed successfully');
    } else {
      showToast('error', 'Failed to refresh feeCategorys');
    }
  };


  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: any) => {
    setFilterType(e.target.value);
  };

  return (
    <div className={style.container}>
      <TableControlBox tableName="Fees Structure" children={undefined} >

      </TableControlBox>
      <div style={{ gap: '20px', display: "flex", marginBottom: "5px", alignItems: "center", justifyContent: "space-between" }} className={style.feeheader}>
        <div style={{ display: "flex", gap: '20px', alignItems: "center" }} className={style.feeheader}>
          <button style={{ padding: "8px", backgroundColor: "#1a81c1", color: "white", border: "none" }}>Action</button>
          <div style={{ gap: '10px', display: "flex", alignItems: "center" }} className={style.feeheader}>
            Show<select><option value="10">10</option>
              <option value="25">25</option>
              <option value="40">40</option>
              <option value="100">100</option>
              <option value="250">250</option>
            </select>
            entries
          </div>
          <input
            placeholder='Enter fee structure title'
            type='text'
            style={{ padding: "8px" }}
            value={searchTerm}
            onChange={handleSearchChange}
            className={style.feeinput} />

          <select value={filterType} onChange={handleFilterChange} style={{ padding: "8px" }} className={style.feeinput}>
            <option value="">Select Facility</option>
            <option value="Academic">Academic Fee</option>
            <option value="Transport">Transport Fee</option>
            <option value="Hostel">Hostel Fee</option>
            <option value="Other">Other</option>
          </select>
          <FaFilter />
        </div>
        <div>
          <TableControlBox tableName="" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
            <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

            <Button onClick={() => navigate('/feescategory/create')} startIcon={<PlusIcon fill="white" />} className={style.FeeCategory}>
              <span className={style.FeeCategory}> Create&nbsp;Fee Structure</span>
            </Button>
          </TableControlBox>
        </div>
      </div>

      <div className={style.tableContainer}>
        <FeeCategoryTableComponent />
      </div>
      {/* <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      /> */}
    </div>
  );
};

export default FeeCategoryListPage;

const options = ['1', '2', '3', '4', '5', '8', '10', '12', '15', '20'];
