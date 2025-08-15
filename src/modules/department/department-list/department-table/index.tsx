import Table from "../../../../components/table";
import TableHead from "../../../../components/table/tableHead";
import TableBody from "../../../../components/table/tableBody";
import useDepartmentStore from "../../../../store/departmentStore";
import { useEffect } from "react";
import convertDateFormat from "../../../../utils/functions/convert-date-format";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../store/authStore";
import TableActionTD from "../../../../components/table-action-td";
import tableHeadAccessFilter from "../../../../utils/functions/table-head-access-filter";

const DepartmentTableComponent: React.FC = () => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { departments, getDepartments, deleteDepartment, initialLoading, deleting } = useDepartmentStore();

  useEffect(() => {
    if (departments.length) return;
    getDepartments();
  }, []);

  const deleteHandler = async (id: string) => {
    const res = await deleteDepartment(id);
    if (res) getDepartments();
  };

  const tableHead: string[] = ['SL NO.', 'DEPARTMENT NAME', 'DEPARTMENT CODE', 'SEMESTERS', 'UPDATED AT', 'ACTION'];

  const tableBody = departments.map((department, index) => (
    <tr key={index} >
      <td>{index + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>{department.name}</td>
      <td>{department.departmentCode}</td>
      <td>{department.totalSemesters}</td>
      <td>{convertDateFormat(department.createdAt)}</td>
      <TableActionTD
        permission={permissions?.department}
        deleting={deleting}
        id={department._id}
        name="Department"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/department/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={initialLoading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.department)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default DepartmentTableComponent;
