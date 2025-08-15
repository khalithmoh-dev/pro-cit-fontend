import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import TableBody from '../../../../components/table/tableBody';
import useEmployeeStore from '../../../../store/employeeStore';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import { useNavigate } from 'react-router-dom';
import TableActionTD from '../../../../components/table-action-td';
import useAuthStore from '../../../../store/authStore';
import tableHeadAccessFilter from '../../../../utils/functions/table-head-access-filter';

interface PropsIF {
  startIndex: number;
  setEmployeeId: (id: string) => void;
}

const EmployeeTableComponent: React.FC<PropsIF> = ({ startIndex, setEmployeeId }) => {
  const navigate = useNavigate();
  const { permissions } = useAuthStore();
  const { employees, getEmployees, deleteEmployee, initialLoading, deleting } = useEmployeeStore();

  const deleteHandler = async (id: string) => {
    const res = await deleteEmployee(id);
    if (res) getEmployees();
  };

  const rowClickHandler = (e: React.MouseEvent<HTMLSpanElement>, id: string) => {
    e.stopPropagation();
    setEmployeeId(id);
  };
  const tableHead = ['SL NO.', 'FIRST NAME', 'DEPARTMENT', 'DESIGNATION', 'ROLE', 'CREATED AT', 'ACTION'];

  const tableBody = employees.map((employee, index) => (
    <tr key={index} onClick={(e) => rowClickHandler(e, employee._id)}>
      <td>{index + startIndex + 1}</td>
      <td style={{ textTransform: 'capitalize' }}>
        {employee?.salutation}&nbsp;{employee.firstName}&nbsp;{employee?.lastName}
      </td>
      <td>{employee?.department?.departmentCode}</td>
      <td>{employee?.designation?.name}</td>
      <td style={{ textTransform: 'capitalize' }}>{employee?.role.name}</td>
      <td>{convertDateFormat(employee.createdAt)}</td>
      <TableActionTD
        permission={permissions?.employee}
        deleting={deleting}
        id={employee._id}
        name="Employee"
        deleteHandler={deleteHandler}
        updateHandler={(id) => navigate(`/employee/update/${id}`)}
      />
    </tr>
  ));

  return (
    <div>
      <Table loading={initialLoading}>
        <TableHead tableHead={tableHeadAccessFilter(tableHead, permissions?.employee)} />
        <TableBody tableBody={tableBody} />
      </Table>
    </div>
  );
};

export default EmployeeTableComponent;
