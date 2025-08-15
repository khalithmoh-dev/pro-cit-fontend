import { ChangeEvent, useEffect, useState } from 'react';
import Button from '../../components/button';
import Table from '../../components/table';
import TableControlBox from '../../components/table-control-box';
import TableHead from '../../components/table/tableHead';
import style from './swap.module.css';
import { useNavigate } from 'react-router-dom';
import useSwapStore from '../../store/swapStore';
import TableBody from '../../components/table/tableBody';
import convertDateFormat from '../../utils/functions/convert-date-format';
import DeleteIcon from '../../icon-components/DeleteIcon';
import { swap } from 'formik';
import useAuthStore from '../../store/authStore';
import convertToAmPm from '../../utils/functions/convert-time-to-am-pm';
import TableDeleteButton from '../../components/table-delete-button';
import SelectSubjectDialog from './select-subject';

const SwapList = () => {
  const tableHead = [
    'SL NO.',
    'DATE',
    'START TIME',
    'END TIME',
    'REQUEST BY',
    'REQUEST TO',
    'CREATED AT',
    'STATUS',
    'ACTION',
  ];
  const navigate = useNavigate();
  const { getSwaps, swaps, updateSwap, deleteSwap, deleting,loading } = useSwapStore();
  const { user } = useAuthStore();
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [requestedSubjectId, setRequestedSubjectId] = useState('');

  const getAllSwaps = () => {
    getSwaps({
      requestBy: user?.user?._id,
      requestTo: user?.user?._id,
    });
  };

  useEffect(() => getAllSwaps(), []);

  const handleDeleteSwap = async (id: string) => {
    const res = await deleteSwap(id);
    if (res) getAllSwaps();
  };

  const onChangeStatus = async (e: ChangeEvent<HTMLInputElement>, swap: any) => {
    e.stopPropagation();
    setRequestedSubjectId(swap?.subject?._id);
    setSelectedRequestId(swap?._id);
  };

  const tableBody = swaps.map((swap, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{swap.swappingDate.split('T')[0]}</td>
      <td>{convertToAmPm(swap.startTime)}</td>
      <td>{convertToAmPm(swap.endTime)}</td>
      <td>
        {swap?.requestBy?._id === user?.user?._id
          ? 'You'
          : `${swap?.requestBy?.firstName} (${swap?.requestBy?.employeeCode})`}
      </td>
      <td>
        {swap?.requestTo?._id === user?.user?._id
          ? 'You'
          : `${swap?.requestTo?.firstName} (${swap?.requestTo?.employeeCode})`}
      </td>

      <td>{convertDateFormat(swap.createdAt)}</td>
      <td>
        <input
          disabled={swap.accepted}
          onChange={swap?.requestBy?._id === user?.user?._id ? () => {} : (e) => onChangeStatus(e, swap)}
          className={style.checkboxInput}
          checked={swap.accepted}
          type="checkbox"
        />
      </td>
      <td>
        <TableDeleteButton
          hide={swap.accepted || swap?.requestTo?._id === user?.user?._id}
          name="request"
          id={swap?._id}
          onClick={handleDeleteSwap}
          deleting={deleting}
        />
      </td>
    </tr>
  ));

  return (
    <div className={style.container}>
      <TableControlBox tableName="Time Table Requests" showBackButton>
        <Button secondary onClick={() => navigate('/calendar/view')}>
          Open Calendar
        </Button>
      </TableControlBox>
      <Table loading={loading}>
        <TableHead tableHead={tableHead} />
        <TableBody tableBody={tableBody} />
      </Table>
      <SelectSubjectDialog
        selectedRequestId={selectedRequestId}
        requestedSubjectId={requestedSubjectId}
        closeDialog={() => setSelectedRequestId('')}
        getAllSwaps={getAllSwaps}
      />
    </div>
  );
};

export default SwapList;
