import { useNavigate } from "react-router-dom";
import Table from "../../../../components/table";
import TableBody from "../../../../components/table/tableBody";
import TableHead from "../../../../components/table/tableHead";
import RichEditorIcon from "../../../../icon-components/RichEditor";
import SelectIcon from "../../../../icon-components/SelectIcon";
import useOutcomeStore from "../../../../store/outcomeStore";
import { useCallback } from "react";

const tableHead = ["SL NO.", "DEPARTMENT", "PO", "PSO", "PEO", "ACTION"];

const OutcomeTable: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const { outcomeCount } = useOutcomeStore();

    const handleViewClick = useCallback((id: string) => {
        navigate(`/outcome?department_id=${id}`);
    }, [navigate]);

    const tableBody = outcomeCount.map((outcomeItem, index) => (
        <tr key={index} style={{ cursor: "default" }}>
            <td style={{ paddingLeft: 30 }}>{index + 1}</td>
            <td style={{ textTransform: "capitalize" }}>
                {outcomeItem.department.name}
            </td>
            <td>{outcomeItem.PO}</td>
            <td>{outcomeItem.PSO}</td>
            <td>{outcomeItem.PEO}</td>
            <td style={{ paddingLeft: "25px", cursor: "pointer", display: "flex", gap: "5px" }}>
                <span onClick={(e: React.MouseEvent<HTMLTableRowElement>) => handleViewClick(outcomeItem.department._id)}>
                    <SelectIcon />
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

export default OutcomeTable;