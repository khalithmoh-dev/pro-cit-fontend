import Table from "../../../../components/table";
import TableHead from "../../../../components/table/tableHead";
import TableBody from "../../../../components/table/tableBody";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import DeleteIcon from "../../../../icon-components/DeleteIcon";
import { useEffect } from "react";
import convertDateFormat from "../../../../utils/functions/convert-date-format";
import { useNavigate } from "react-router-dom";
import useDiscountStore from "../../../../store/discountCategoryStore";

const DiscountCategoryTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { discountStructures, getDiscounts, deleteDiscount, loading } = useDiscountStore();

  useEffect(() => {
    getDiscounts();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteDiscount(id);
    if (res) {
      getDiscounts();
    }
  };

  const tableHead = [
    "SL NO.",
    "DISCOUNT",
    "DISCOUNT TYPE",
    "AMOUNT",
    "CREATED AT",
    "ACTION"
  ];

  const tableBody = discountStructures.map((discountCategory, index) => (
    
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: "capitalize" }}>{discountCategory.discount_name}</td>
      <td style={{ textTransform: "capitalize" }}>{discountCategory.discount_type}</td>
      <td>
        {discountCategory.value}
      </td>

      <td>{convertDateFormat(discountCategory.createdAt)}</td>
      <td style={{ cursor: "pointer", margin: "0 auto", gap: "5px" }}>
        <span onClick={() => navigate(`/discount/update/${discountCategory._id}`)}>
          <RichEditorIcon />
        </span>
        <span style={{ marginLeft: "5px" }} onClick={() => deleteHandler(discountCategory._id)}>
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

export default DiscountCategoryTableComponent;
