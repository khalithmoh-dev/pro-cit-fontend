import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "../../../../hooks";
import useExamStore, { CreateExamPayloadIF } from "../../../../store/examStore";
import RenderFormbuilderForm from "../../../../components/render-formbuilder-form";
import { generateYearRangeOptions } from "../../../../utils/functions/year-ranges";
import useDepartmentStore from "../../../../store/departmentStore";
import useSubjectStore from "../../../../store/subjectStore";
import { FieldIF } from "../../../../interface/component.interface";

interface CreateExamProps {
    update?: boolean
}

const CreateExam: React.FC<CreateExamProps> = ({ update }: CreateExamProps): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const query = useQuery();
    const { getDepartments, departments } = useDepartmentStore();
    const { getSubjects, subjects } = useSubjectStore();
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [modifiedExam, setModifiedExam] = useState<any>(null);
    const [yearRanges, setYearRanges] = useState([]);
    const { updateExam, createExam, getExam, exam } = useExamStore();
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedYearRange, setSelectedYearRange] = useState<{
        startYear: null | number;
        endYear: null | number;
    }>({
        startYear: null,
        endYear: null
    });

    const onChangeHandler = useCallback((fields: FieldIF[]) => {
        const departmentId = fields[1].value;
        getSubjects({ department: departmentId });
    }, []);


    const onSubmit = useCallback((value: any) => {
        const startYear = value.academicYear.split(" - ")[1];
        const endYear = value.academicYear.split(" - ")[0];
        delete value.department;
        delete value.academicYear;
        const payload: CreateExamPayloadIF = {
            ...value,
            startYear: Number(startYear),
            endYear: Number(endYear)
        }
        if (update) {
            updateExam(id as string, payload);
        } else {
            createExam(payload);
        }
        navigate(-1);
    }, [createExam, id, navigate, selectedSubject, selectedYearRange.endYear, selectedYearRange.startYear, update, updateExam]);

    useEffect(() => {
        if (query && query.get("startYear") && query.get("endYear") && query.get("subjectId")) {
            setSelectedYearRange(Object.assign({
                startYear: Number(query.get("startYear")),
                endYear: Number(query.get("endYear"))
            }));
            setSelectedSubject(query.get("subjectId"));
        }
        if (update && id) {
            getExam(id);
        }
    }, [getExam, id, query, update]);

    useEffect(() => {
        const newDepartmentOptions = departments.map((department) => ({ label: department.name, value: department._id }));
        setDepartmentOptions(Object.assign([], newDepartmentOptions));
    }, [departments]);

    useEffect(() => {
        const newSubjectOptions = subjects.map((subject) => ({ label: subject.name, value: subject._id }));
        setSubjectOptions(Object.assign([], newSubjectOptions));
    }, [subjects]);

    useEffect(() => {
        const newYearRanges = generateYearRangeOptions(2024, 2015);
        setYearRanges(Object.assign([], newYearRanges));
        getDepartments();
        getSubjects();
    }, []); 
    console.log("exam", exam);
    useEffect(() => {
        if(update && exam) {
            console.log("exam 1", exam);
            console.log("exam 1 1", subjects);  
            const selectedSubject = subjects.find((subject) => subject._id === exam.subject as unknown as string);
            console.log("Selected", selectedSubject)
            setModifiedExam(Object.assign({}, exam, {
                department: selectedSubject.department._id,
                academicYear: `${exam.endYear} - ${exam.startYear}`
            }))
        }
    }, []);

    console.log("modifiedExam", modifiedExam);

    return (
        <div className="">
            <RenderFormbuilderForm
                formName="Create Exam Form"
                small
                formHeader={`${update ? "Update" : "Create"} Exam Form`}
                existingForm={update ? modifiedExam : null}
                goBack={() => navigate(-1)}
                onSubmit={onSubmit}
                onChange={onChangeHandler}
                dynamicOptions={[yearRanges, departmentOptions, subjectOptions]}
            />
        </div>
    )
}

export default CreateExam;