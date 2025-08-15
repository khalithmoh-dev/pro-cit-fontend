import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form"
import useOutcomeStore, { CreatePOPayload, PO } from "../../../store/outcomeStore"
import { getCurrentAcademicYear } from "../../../utils/functions/current-academic-year";
import { useQuery } from "../../../hooks";
import { useEffect, useState } from "react";
import { generateYearRangeOptions, generateYearRanges } from "../../../utils/functions/year-ranges";

interface CreateOutcomePageProps {
    update?: true
}

const CreateOutcomePage: React.FC<CreateOutcomePageProps> = ({ update }: CreateOutcomePageProps): JSX.Element => {
    const { id } = useParams();
    const query = useQuery();
    const { PO, createPO, updatePO, selectedPO, getPOById } = useOutcomeStore();
    const [modifiedSelectedPO, setModifiedSelectedPO] = useState<any>(null);
    const navigate = useNavigate();
    const [yearRanges, setYearRanges] = useState([]);
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const onSubmit = async (values: CreatePOPayload & { academicYear?: string; }) => {
        
        console.log(values);
        values.ID = values.id as string;
        if(!update) {
            delete values.id;
        }
        const startYear = Number(values.academicYear.split(" - ")[1]);
        const endYear = Number(values.academicYear.split(" - ")[0]);
        delete values.academicYear;
        const payload = {
            ...values,
            startYear,
            endYear,
            department: departmentId,
            orderNumber: Number(values.orderNumber)
        };
        if (update) {
            updatePO(payload, id as string, departmentId as string, startYear, endYear);
        } else {
            createPO(payload, departmentId as string, startYear, endYear);
        }
        navigate(-1);
    }

    useEffect(() => {
        if (query && query.get("department_id")) {
            setDepartmentId(query.get("department_id"))
            if(update) {
                getPOById(id as string);
            }
        }
    }, [getPOById, id, query, update]);

    useEffect(() => {
        if(update && selectedPO) {
            const academicYear = `${selectedPO.endYear} - ${selectedPO.startYear}`;
            
            setModifiedSelectedPO(Object.assign({}, selectedPO, {
                academicYear,
                id: selectedPO.ID
            }));
        }
    }, [selectedPO]);

    useEffect(() => {
        const _yearRanges = generateYearRangeOptions(2024, 2015);
        setYearRanges(Object.assign([], _yearRanges));
    }, []);

    console.log("newModifiedPo", modifiedSelectedPO)
    return (
        <RenderFormbuilderForm
            formName="ADD PO / PSO"
            small
            formHeader={`${update ? "Update" : "Create"} PO Form`}
            existingForm={update ? modifiedSelectedPO : null}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            dynamicOptions={[yearRanges, []]}
        />
    )
};

export default CreateOutcomePage;