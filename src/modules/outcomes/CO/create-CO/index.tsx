import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../../components/render-formbuilder-form";
import useCOStore, { createCOPayloadIF } from "../../../../store/co.store";
import { useCallback, useEffect, useState } from "react";
import { generateYearRangeOptions } from "../../../../utils/functions/year-ranges";
import useDepartmentStore from "../../../../store/departmentStore";
import useSubjectStore from "../../../../store/subjectStore";
import { FieldIF } from "../../../../interface/component.interface";

const CreateCO: React.FC<{ update?: boolean }> = ({ update }: { update?: boolean }) => {
    const { subject_id, id } = useParams();
    const { COs, createCO, updateCO, getCOById, selectedCO } = useCOStore();
    const { getDepartments, departments } = useDepartmentStore();
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const { getSubjects, subjects } = useSubjectStore();
    const navigate = useNavigate();
    const [yearRanges, setYearRanges] = useState([]);
    const [modifiedCO, setNewModifiedCO] = useState<any>(null);
    const onSubmit = useCallback(async (values: any) => {
        console.log("values", values);
        const createCOPayload: createCOPayloadIF = {
            ...values
        };
        if (update) {
            await updateCO(id as string, createCOPayload, values.subject as string);
        } else {
            await createCO(createCOPayload, values.subject as string);
        }
        navigate(-1);
        // await createCO(createCOPayload, subject_id as string);
    }, [createCO, id, navigate, subject_id, update, updateCO]);

    const onChangeHandler = useCallback((fields: FieldIF[]) => {
        const departmentId = fields[1].value;
        getSubjects({ department: departmentId });
    }, []);

    useEffect(() => {
        const newSubjectOptions = subjects.map((subject) => ({ label: subject.name, value: subject._id }));
        setSubjectOptions(Object.assign([], newSubjectOptions));
    }, [subjects]);

    useEffect(() => {
        if (update && id) {
            getCOById(id);
        }
    }, [getCOById, id, update]);

    useEffect(() => {
        const newYearRanges = generateYearRangeOptions(2024, 2015);
        setYearRanges(Object.assign([], newYearRanges));
        getDepartments();
        getSubjects();
    }, []); 

    useEffect(() => {
        if(update && selectedCO) {
            const selectedSubject = subjects.find((subject) => subject._id === selectedCO.subject);
            setNewModifiedCO(Object.assign({}, selectedCO, {
                subject: selectedCO.subject,
                department: selectedSubject.department._id
            }));
        }
    }, [selectedCO, departments]);
    

    useEffect(() => {
        const newDepartmentOptions = departments.map((department) => ({ label: department.name, value: department._id }));
        setDepartmentOptions(Object.assign([], newDepartmentOptions));
    }, [departments]);

    console.log("modifiedCO", modifiedCO);
    return (
        <RenderFormbuilderForm
            formName="Create CO form"
            small
            formHeader={`${update ? "Update" : "Create"} CO Form`}
            existingForm={update ? modifiedCO : null}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            onChange={onChangeHandler}
            dynamicOptions={[[], departmentOptions, subjectOptions]}    
        />
    );
}

export default CreateCO;