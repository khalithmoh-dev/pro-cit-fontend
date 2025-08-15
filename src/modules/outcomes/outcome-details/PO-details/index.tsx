import { useCallback, useEffect, useState } from "react";
import TableControlBox from "../../../../components/table-control-box";
import useOutcomeStore from "../../../../store/outcomeStore";
import { generateYearRanges } from "../../../../utils/functions/year-ranges";
import BuSelect from "../../../../components/bu-select";
import POTable from "./PO-table";
import { useQuery } from "../../../../hooks";
import { SelectOptionIF } from "../../../../interface/component.interface";
import Button from "../../../../components/button";
import PlusIcon from "../../../../icon-components/PlusIcon";
import { useNavigate } from "react-router-dom";
import useDepartmentStore from "../../../../store/departmentStore";

const PODetails: React.FC = (): JSX.Element => {
    const [yearRanges, setYearRanges] = useState([]);
    const { getPO } = useOutcomeStore();
    const query = useQuery();
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const navigate = useNavigate();
    const [departmentId, setDepartmentId] = useState<string | null>();
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });
    const { getDepartments, departments } = useDepartmentStore();

    const filterDateClickHandler = (year: SelectOptionIF) => {
        const { label } = year;
        const startYear = label.split("-")[1].trim();
        const endYear = label.split("-")[0].trim();
        setSelectedYearRange(Object.assign({}, {
            startYear: Number(startYear),
            endYear: Number(endYear)
        }))
        getPO(departmentId as string, Number(startYear), Number(endYear));
    }

    const filterDepartmentClickHandler = useCallback((department) => {
        const { label, value } = department;
        setDepartmentId(value);
    }, []);

    useEffect(() => {
        const _yearRanges = generateYearRanges(2024, 2015);
        setYearRanges(Object.assign([], _yearRanges));
        const { label } = _yearRanges[0];
        const startYear = label.split("-")[1].trim();
        const endYear = label.split("-")[0].trim();
        setSelectedYearRange(Object.assign({}, {
            startYear: Number(startYear),
            endYear: Number(endYear)
        }));
        getDepartments();
    }, [getDepartments]);

    useEffect(() => {
        const _departments = departments.map((department) => {
            return {
                label: department.name,
                value: department._id
            }
        });
        setDepartmentOptions(Object.assign([], _departments));
    }, [departments]);

    useEffect(() => {
        if (query && query.get("department_id")) {
            const departmentId = query.get("department_id") as string;
            setDepartmentId(departmentId as string);
        }
    }, [query]);

    return (
        <div>
            <TableControlBox tableName="Outcomes">
                <BuSelect options={yearRanges} update={() => null} label="Year" onChange={(year) => filterDateClickHandler(year)} clearFilter={() => null} />
                {/* <BuSelect options={departmentOptions} update={() => null} label="Department" onChange={(department) => filterDepartmentClickHandler(department)} clearFilter={() => null} /> */}
                <Button onClick={() => navigate(`/outcome/create?department_id=${departmentId}`)} startIcon={<PlusIcon fill="white" />}>
                    Add PO / PSO
                </Button>
            </TableControlBox>
            <POTable selectedYearRange={selectedYearRange} />
        </div>
    );
};

export default PODetails;