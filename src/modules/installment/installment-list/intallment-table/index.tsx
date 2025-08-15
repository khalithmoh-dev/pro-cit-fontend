import Table from "../../../../components/table";
import TableHead from "../../../../components/table/tableHead";
import TableBody from "../../../../components/table/tableBody";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import DeleteIcon from "../../../../icon-components/DeleteIcon";
import { useEffect } from "react";
import convertDateFormat from "../../../../utils/functions/convert-date-format";
import { useNavigate } from "react-router-dom";
import useInstallmentStore from "../../../../store/installmentStore";

const InstallMentTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const {getInstallmentFeesStructure,deleteInstallment, installmentData, loading } = useInstallmentStore();  

  
  useEffect(() => {
    getInstallmentFeesStructure();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteInstallment(id);
    if (res) {
        getInstallmentFeesStructure();
    }
  };

  const tableHead = [
    "SL NO.",
    "FEES STRUCTURE NAME",
    "STUDENT NAME",
    "TOTAL AMOUNT",
    "INSTALLMENT AMOUNT",
    "STATUS",
    "DUE DATE",
    "CREATED DATE",
    "PAYMENT DATE",
    "ACTION"
  ];

  const tableBody = installmentData?.map((installment, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: "capitalize" }}>{installment?.fee_structure_id?.fee_structure_name}</td>
      <td style={{ textTransform: "capitalize" }}>
      {installment?.student_id?.firstName || installment?.student_id?.middleName || installment?.student_id?.lastName
    ? `${installment?.student_id?.firstName || ''} ${installment?.student_id?.middleName || ''} ${installment?.student_id?.lastName || ''}`
    : '-'}  

      </td>
      <td style={{ textTransform: "capitalize" }}>{installment?.total_amount}</td>
      <td style={{ textTransform: "capitalize" }}>{installment?.installment_amount}</td>
      <td style={{ textTransform: "capitalize" }}>{installment?.status}</td>
      <td style={{ textTransform: "capitalize" }}>{installment?.due_date}</td>
     
      <td>{convertDateFormat(installment.createdAt)}</td>
      <td>{installment.payment_date ? convertDateFormat(installment.payment_date) : '-'}</td>
      <td style={{ cursor: "pointer", margin: "0 auto", gap: "5px" }}>
        <span onClick={() => navigate(`/installment/update/${installment._id}`)}>
          <RichEditorIcon />
        </span>
        <span style={{ marginLeft: "5px" }} onClick={() => deleteHandler(installment._id)}>
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

export default InstallMentTableComponent;
