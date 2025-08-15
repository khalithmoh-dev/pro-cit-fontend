import { useNavigate } from "react-router-dom";
import Table from "../../../../../components/table";
import TableBody from "../../../../../components/table/tableBody";
import TableHead from "../../../../../components/table/tableHead";
import { useQuery } from "../../../../../hooks";
import DeleteIcon from "../../../../../icon-components/DeleteIcon";
import RichEditorIcon from "../../../../../icon-components/RichEditor";
import useOutcomeStore from "../../../../../store/outcomeStore";
import { useCallback } from "react";

const tableHead = ["SL NO.", "TYPE", "ID", "PROGRAM OUTCOMES", "ACTION"];

const PEOTable: React.FC = (): JSX.Element => {
    const { PEO, deletePEO } = useOutcomeStore();
    const navigate = useNavigate();
    console.log("PEO", PEO);
    const query = useQuery();
    const deleteClickHandler = (id: string) => {
        const userResponse = confirm("Are you sure you want to delete this PEO?");
        if (userResponse && query && query.get("department_id")) {
            deletePEO(id, query.get("department_id") as string);
        }
    }

    const editClickHandler = useCallback((id: string) => {
        navigate(`/outcome/PEO/update/${id}?department_id=${query?.get("department_id")}`);
    }, [navigate, query])

    const tableBody = PEO.map((PEOItem, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td style={{ textTransform: "capitalize" }}>
                PEO
            </td>
            <td>{PEOItem.ID}</td>
            <td>{PEOItem.objective}</td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", display: "flex", gap: "5px" }}>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => editClickHandler(PEOItem._id)}>
                    <RichEditorIcon />
                </span>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => deleteClickHandler(PEOItem._id)}>
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

export default PEOTable;