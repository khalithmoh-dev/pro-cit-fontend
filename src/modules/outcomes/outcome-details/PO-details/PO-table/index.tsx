import { useCallback } from "react";
import Table from "../../../../../components/table";
import TableBody from "../../../../../components/table/tableBody";
import TableHead from "../../../../../components/table/tableHead";
import { useQuery } from "../../../../../hooks";
import DeleteIcon from "../../../../../icon-components/DeleteIcon";
import RichEditorIcon from "../../../../../icon-components/RichEditor";
import useOutcomeStore from "../../../../../store/outcomeStore";
import { useNavigate } from "react-router-dom";

const tableHead = ["SL NO.", "TYPE", "ID", "PROGRAM OUTCOMES", "ACTION"];

const POTable: React.FC<{ selectedYearRange: { startYear: number | null; endYear: number | null; } }> = ({ selectedYearRange }: { selectedYearRange: { startYear: number | null; endYear: number | null; } }): JSX.Element => {
    const navigate = useNavigate();
    const { PO, deletePO } = useOutcomeStore();
    const query = useQuery();
    console.log("PO", PO);
    const deleteClickHandler = (id: string) => {
        const userResponse = confirm("Are you sure you want to delete this PO / PSO?");
        if (userResponse && query && query.get("department_id")) {

            deletePO(id, query.get("department_id") as string, selectedYearRange.startYear as number, selectedYearRange.endYear as number);
        }
    }

    const editClickHandler = useCallback((id: string) => {
        navigate(`/outcome/update/${id}?department_id=${query?.get("department_id")}`);
    }, [navigate, query])

    const tableBody = PO.map((POItem, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td style={{ textTransform: "capitalize" }}>
                {POItem.isPSO ? "PSO" : "PO"}
            </td>
            <td>{POItem.ID}</td>
            <td>{POItem.outcome}</td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", display: "flex", gap: "5px" }}>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => editClickHandler(POItem._id)}>
                    <RichEditorIcon />
                </span>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => deleteClickHandler(POItem._id)}>
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

export default POTable;