import TableControlBox from "../../../../components/table-control-box";
import Button from "../../../../components/button";
import PlusIcon from "../../../../icon-components/PlusIcon";
import PEOTable from "./PEO-table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../../hooks";
import { useEffect, useState } from "react";

const PEODetails: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const query = useQuery();
    const [departmentId, setDepartmentId] = useState<string | null>(null);

    useEffect(() => {
        if (query && query.get("department_id")) {
            setDepartmentId(query.get("department_id") as string);
        }
    }, [query]);

    return (
        <div>
            <TableControlBox tableName="Outcomes">
                <Button onClick={() => navigate(`/outcome/PEO/create?department_id=${departmentId}`)} startIcon={<PlusIcon fill="white" />}>
                    Add PEO
                </Button>
            </TableControlBox>
            <PEOTable />
        </div>
    );
};

export default PEODetails;