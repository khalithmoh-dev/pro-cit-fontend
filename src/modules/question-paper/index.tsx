import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useExamStore from "../../store/examStore";
import useSubjectStore from "../../store/subjectStore";
import useDepartmentStore from "../../store/departmentStore";
import { SelectOptionIF } from "../../interface/component.interface";
import { generateYearRanges } from "../../utils/functions/year-ranges";
import BuSelect from "../../components/bu-select";
import Button from "../../components/button";
import TableControlBox from "../../components/table-control-box";
import styles from "./question-paper.module.css";
import QuestionPaperTable from "./question-paper-table";
import PlusIcon from "../../icon-components/PlusIcon";
import useQuestionPaperStore from "../../store/questionPaperStore";

const QuestionPaperList: React.FC = (): JSX.Element => {
    const [yearRanges, setYearRanges] = useState([]);
    const navigate = useNavigate();
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });
    const [examOptions, setExamOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const { getExams, exams } = useExamStore();
    const { getSubjects, subjects } = useSubjectStore();
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const { getDepartments, departments } = useDepartmentStore();
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const { getQuestionPapers } = useQuestionPaperStore();

    const filterDepartmentClickHandler = useCallback((department: SelectOptionIF) => {
        setSelectedDepartment(department.value);
    }, []);

    const filterSubjectClickHandler = useCallback((subject: SelectOptionIF) => {
        setSelectedSubject(subject.value);
    }, []);

    const filterExamClickHandler = useCallback((exam: SelectOptionIF) => {
        setSelectedExam(exam.value);
        getQuestionPapers({ exam: exam.value });
    }, [getQuestionPapers]);

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
        const _exams = exams.map((exam) => {
            return {
                label: exam.name,
                value: exam._id
            }
        });
        setExamOptions(Object.assign([], _exams));
    }, [exams])

    useEffect(() => {
        if (selectedSubject) {
            const query = {
                startYear: selectedYearRange.startYear,
                endYear: selectedYearRange.endYear,
                subject: selectedSubject,
            }
            getExams(query);
        }
    }, [getExams, selectedSubject, selectedYearRange?.endYear, selectedYearRange?.startYear]);

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
            <TableControlBox tableName="Question Paper">
                <BuSelect options={yearRanges} update={() => null} label="Session" onChange={(year) => filterDateClickHandler(year)} clearFilter={() => null} />
                <BuSelect options={departmentOptions} update={() => null} label="Department" onChange={(department) => filterDepartmentClickHandler(department)} clearFilter={() => null} />
                <BuSelect options={subjectOptions} update={() => null} label="Subject" onChange={(subject) => filterSubjectClickHandler(subject)} clearFilter={() => null} />
                <BuSelect options={examOptions} update={() => null} label="Exam" onChange={(exam) => filterExamClickHandler(exam)} clearFilter={() => null} />

                <Button onClick={() => navigate(`/question-paper/create?examId=${selectedExam}&&startYear=${selectedYearRange.startYear}&&endYear=${selectedYearRange.endYear}`)} startIcon={<PlusIcon fill="white" />}>
                    Question Paper
                </Button>
            </TableControlBox>
            {selectedExam && <QuestionPaperTable selectedExam={selectedExam} selectedYearRange={selectedYearRange} />}
        </div>
    )
};

export default QuestionPaperList;