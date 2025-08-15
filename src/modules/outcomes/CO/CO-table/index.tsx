import { useNavigate, useParams } from "react-router-dom";
import Table from "../../../../components/table";
import TableBody from "../../../../components/table/tableBody";
import TableHead from "../../../../components/table/tableHead";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import { useCallback } from "react";
import useCOStore from "../../../../store/co.store";
import DeleteIcon from "../../../../icon-components/DeleteIcon";

const tableHead = ["SL NO.", "ID", "CO", "ACTION"];

const COTable: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { COs, selectedSubject, deleteCO } = useCOStore();

    const handleEditClick = useCallback((selectedSubject: any, id: string) => {
        navigate(`/course-outcome/update/${selectedSubject?._id}/${id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((id: string) => {
        const userChoice = confirm("Are you sure you want to delete this CO?");
        if (userChoice) {
            deleteCO(id, selectedSubject?._id as string);
        }
    }, [deleteCO, selectedSubject?._id]);

    const tableBody = COs.map((CO, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td>
                {CO.co_id}
            </td>
            <td>{CO.description}</td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", display: "flex", gap: "5px" }}>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => handleEditClick(selectedSubject, CO._id as string)}>
                    <RichEditorIcon />
                </span>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => handleDeleteClick(CO._id)}>
                    <DeleteIcon />
                </span>
            </td>
        </tr>
    ));

    return (
        <div>
            <Table>
                <TableHead tableHead={tableHead} />
                <TableBody tableBody={tableBody} />
            </Table>
        </div>
    );
}

export default COTable;