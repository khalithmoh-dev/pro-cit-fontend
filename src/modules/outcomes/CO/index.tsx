import { useCallback, useEffect, useState } from "react";
import styles from "./CO.module.css";
import useCOStore from "../../../store/co.store";
import useSubjectStore, { SubjectIF } from "../../../store/subjectStore";
import TableControlBox from "../../../components/table-control-box";
import { generateYearRanges } from "../../../utils/functions/year-ranges";
import BuSelect from "../../../components/bu-select";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../../../icon-components/PlusIcon";
import COTable from "./CO-table";
import useDepartmentStore, { DepartmentIF } from "../../../store/departmentStore";

const CO: React.FC = (): JSX.Element => {
    const [yearRanges, setYearRanges] = useState([]);
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });
    const { getCO, setSelectedSubject, selectedSubject } = useCOStore();
    const { getSubjects, subjects } = useSubjectStore();
    const [subjectOptions, setSubjectOptions] = useState([]);
    const navigate = useNavigate();
    const { departments, getDepartments } = useDepartmentStore();
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    const filterDateClickHandler = useCallback((year) => {
        const { label } = year;
        const startYear = label.split("-")[1].trim();
        const endYear = label.split("-")[0].trim();
        setSelectedYearRange(Object.assign({}, {
            startYear: Number(startYear),
            endYear: Number(endYear)
        }))
    }, []);

    const filterSubjectClickHandler = useCallback((subject) => {
        const { value, label } = subject;
        const subjectPayload = {
            _id: value,
            name: label
        } as SubjectIF;
        setSelectedSubject(subjectPayload);
        getCO(value);
    }, [getCO, setSelectedSubject]);

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
        const _yearRanges = generateYearRanges(2024, 2015);
        setYearRanges(Object.assign([], _yearRanges));
        getDepartments();
    }, [getDepartments]);

    useEffect(() => {
        if (selectedYearRange.startYear && selectedYearRange.endYear) {
            getSubjects();
        }
    }, [getSubjects, selectedYearRange]);

    useEffect(() => {
        if (subjects.length === 0) return;

        const _subjectOptions = subjects.map((subject) => {
            return {
                label: subject.name,
                value: subject._id
            }
        });
        setSubjectOptions(Object.assign([], _subjectOptions));
    }, [subjects]);

    const filterDepartmentClickHandler = useCallback((department) => {
        const { label, value } = department;
        setSelectedDepartment(value);
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            getSubjects({ department: selectedDepartment });
        }
    }, [getSubjects, selectedDepartment]);

    useEffect(() => {
        setSelectedSubject(null);
    }, []);

    console.log("select", selectedSubject);
    return (
        <div className={styles.container}>
            <TableControlBox tableName="Course Outcomes">
                {/* <BuSelect options={yearRanges} update={() => null} label="Session" onChange={(year) => filterDateClickHandler(year)} clearFilter={() => null} /> */}
                <BuSelect options={departmentOptions} update={() => null} label="Department" onChange={(department) => filterDepartmentClickHandler(department)} clearFilter={() => null} />
                <BuSelect options={subjectOptions} update={() => null} label="Subject" onChange={(subject) => filterSubjectClickHandler(subject)} clearFilter={() => setSelectedSubject(null)} />
                <Button disabled={selectedSubject ? false : true} onClick={() => navigate(`/course-outcome/mapping/${selectedSubject?._id}`)} startIcon={<PlusIcon fill="white" />}>
                    PO/PSO Mapping
                </Button>
                <Button onClick={() => navigate(`/course-outcome/create/${selectedSubject?._id}`)} startIcon={<PlusIcon fill="white" />}>
                    Add CO
                </Button>
            </TableControlBox>
            <COTable />
        </div>
    )
};

export default CO;