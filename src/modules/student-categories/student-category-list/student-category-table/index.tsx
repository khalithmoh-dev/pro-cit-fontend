import Table from "../../../../components/table";
import TableHead from "../../../../components/table/tableHead";
import TableBody from "../../../../components/table/tableBody";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import DeleteIcon from "../../../../icon-components/DeleteIcon";
import { useEffect } from "react";
import convertDateFormat from "../../../../utils/functions/convert-date-format";
import { useNavigate } from "react-router-dom";
import useCategoriesStore from "../../../../store/categoriesStore";

const StudentCategoryTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { categories, getAllCategories, deleteCategory , loading} = useCategoriesStore();   

  useEffect(() => {
    getAllCategories();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteCategory(id);
    if (res) {
      getAllCategories();
    }
  };

  const tableHead = [
    "SL NO.",
    "CATEGORY NAME",
    "DESCRIPTION",
    "CREATED AT",
    "ACTION"
  ];

  const tableBody = categories.map((feeCategory, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td style={{ textTransform: "capitalize" }}>{feeCategory?.name}</td>
      <td style={{ textTransform: "capitalize" }}>{feeCategory?.description}</td>
     

      <td>{convertDateFormat(feeCategory.createdAt)}</td>
      <td style={{ cursor: "pointer", margin: "0 auto", gap: "5px" }}>
        <span onClick={() => navigate(`/studentcategory/update/${feeCategory._id}`)}>
          <RichEditorIcon />
        </span>
        <span style={{ marginLeft: "5px" }} onClick={() => deleteHandler(feeCategory._id)}>
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

export default StudentCategoryTableComponent;
