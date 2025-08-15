import { useState } from 'react';
import style from './fee-head.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import useFeeHeadStore from '../../../store/feeHeadStore';
import { useToastStore } from '../../../store/toastStore.ts';
import FeeHeadTableComponent from './fee-head-table/index.tsx';

const FeeHeadListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState('5');
  const { getFeeHeads } = useFeeHeadStore();
  const [showCacheMessage, setShowCacheMessage] = useState(true);
  const { showToast } = useToastStore();

  const onRefresh = async () => {
    const res = await getFeeHeads();
    if (res) {
      setShowCacheMessage(false);
      showToast('success', 'FeeHeads refreshed successfully');
    } else {
      showToast('error', 'Failed to refresh feeHeads');
    }
  };

  return (
    <div className={style.container}>
      <TableControlBox tableName="FeeHeads" onRefresh={onRefresh} showCacheMessage={showCacheMessage}>
        <TableRow options={options} row={`${tableRows}`} setRow={(size) => setTableRows(size)} />

        <Button onClick={() => navigate('/feeHead/create')} startIcon={<PlusIcon fill="white" />}>
          Create&nbsp;FeeHead
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <FeeHeadTableComponent />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default FeeHeadListPage;

const options = ['1', '2', '3', '4', '5', '8', '10', '12', '15', '20'];
