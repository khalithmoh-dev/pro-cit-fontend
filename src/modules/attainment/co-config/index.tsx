import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSubjectStore from "../../../store/subjectStore";
import useDepartmentStore from "../../../store/departmentStore";
import { SelectOptionIF } from "../../../interface/component.interface";
import { generateYearRanges } from "../../../utils/functions/year-ranges";
import styles from "./co-config.module.css";
import Button from "../../../components/button";
import BuSelect from "../../../components/bu-select";
import TableControlBox from "../../../components/table-control-box";
import PlusIcon from "../../../icon-components/PlusIcon";
import CreateCoConfig from "./create-co-config";

const COConfig: React.FC = (): JSX.Element => {
    const [yearRanges, setYearRanges] = useState([]);
    const navigate = useNavigate();
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const { getSubjects, subjects } = useSubjectStore();
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const { getDepartments, departments } = useDepartmentStore();

    const filterDepartmentClickHandler = useCallback((department: SelectOptionIF) => {
        setSelectedDepartment(department.value);
    }, []);

    const filterSubjectClickHandler = useCallback((subject: SelectOptionIF) => {
        setSelectedSubject(subject.value);
    }, []);


    const filterDateClickHandler = useCallback((year: SelectOptionIF) => {
        const { label } = year;
        const startYear = label.split("-")[1].trim();
        const endYear = label.split("-")[0].trim();
        setSelectedYearRange(Object.assign({}, {
            startYear: Number(startYear),
            endYear: Number(endYear)
        }))
    }, []);


    useEffect(() => {
        if (selectedSubject) {
            const query = {
                startYear: selectedYearRange.startYear,
                endYear: selectedYearRange.endYear,
                subject: selectedSubject,
            }
            //
        }
    }, [selectedSubject, selectedYearRange?.endYear, selectedYearRange?.startYear]);

    useEffect(() => {
        if (departments.length === 0) return;

        const _departmentOptions = departments.map((department) => {
            return {
                label: department.name,
                value: department._id
            }
        });
        setDepartmentOptions(Object.assign([], _departmentOptions));
    }, [departments]);

    useEffect(() => {
        const _subjectOptions = subjects.map((subject) => {
            return {
                label: subject.name,
                value: subject._id
            }
        });
        setSubjectOptions(Object.assign([], _subjectOptions));
    }, [subjects])

    useEffect(() => {
        if (selectedYearRange.startYear && selectedYearRange.endYear && selectedDepartment) {
            getSubjects({ department: selectedDepartment });
        }
    }, [getSubjects, selectedDepartment, selectedYearRange]);

    useEffect(() => {
        const _yearRanges = generateYearRanges(2024, 2015);
        setYearRanges(Object.assign([], _yearRanges));
        getDepartments();
    }, [getDepartments]);

    return (
        <div className={styles.container}>
            <TableControlBox tableName="CO Config">
                <BuSelect options={yearRanges} update={() => null} label="Session" onChange={(year) => filterDateClickHandler(year)} clearFilter={() => null} />
                <BuSelect options={departmentOptions} update={() => null} label="Department" onChange={(department) => filterDepartmentClickHandler(department)} clearFilter={() => null} />
                <BuSelect options={subjectOptions} update={() => null} label="Subject" onChange={(subject) => filterSubjectClickHandler(subject)} clearFilter={() => null} />
                <Button onClick={() => navigate(`/attainment/config/${selectedSubject}`)} startIcon={<PlusIcon fill="white" />}>
                    Configure
                </Button>
            </TableControlBox>
        </div>
    )
};

export default COConfig;