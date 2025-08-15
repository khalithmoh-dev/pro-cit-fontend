import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import useFeeHeadStore from '../../../../store/feeHeadStore';
import { useEffect, useState } from 'react';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';

const FeeHeadTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { feeHeads, getFeeHeads, deleteFeeHead , loading} = useFeeHeadStore();

  useEffect(() => {
    getFeeHeads();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteFeeHead(id);
    if (res) {
      getFeeHeads();
    }
  };

  const tableHead = ['SL NO.', 'FEEHEAD NAME', 'UPDATED AT', 'ACTION'];

  const tableBody = feeHeads.map((feeHead, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{feeHead.name}</td>
      <td>{convertDateFormat(feeHead.createdAt)}</td>
      <td style={{ cursor: 'pointer', display: 'flex', gap: '5px' }}>
        <span onClick={() => navigate(`/feeHead/update/${feeHead._id}`)}>
          <RichEditorIcon />
        </span>
        <span onClick={() => deleteHandler(feeHead._id)}>
          <DeleteIcon />
        </span>
      </td>
    </tr>
  ));

  return (
    <div>
      <Table loading={loading}>
        <TableHead tableHead={tableHead} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default FeeHeadTableComponent;
