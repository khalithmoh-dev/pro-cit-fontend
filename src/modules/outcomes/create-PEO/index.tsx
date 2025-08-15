import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form"
import useOutcomeStore, { CreatePEOPayload } from "../../../store/outcomeStore"
import { useQuery } from "../../../hooks";
import { useEffect, useState } from "react";

interface CreateOutcomePageProps {
    update?: true
}

const CreatePEOPage: React.FC<CreateOutcomePageProps> = ({ update }: CreateOutcomePageProps): JSX.Element => {
    const { id } = useParams();
    const query = useQuery();
    const [modifiedPEO, setModifiedPEO] = useState<any>(null);
    const { createPEO, getPEOById, selectedPEO, updatePEO } = useOutcomeStore();
    const navigate = useNavigate();
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const onSubmit = async (values: CreatePEOPayload) => {
        values.ID = values.id as string;
        delete values.id;
        const payload = {
            ...values,
            department: departmentId,
            orderNumber: Number(values.orderNumber)
        };
        if(update) {
            updatePEO(payload, id as string, departmentId as string);
        } else {
            createPEO(payload, departmentId as string);
        }
        navigate(-1);
    }

    useEffect(() => {
        if (query && query.get("department_id")) {
            setDepartmentId(query.get("department_id"));
            if(update) {
                getPEOById(id as string);
            }
        }
    }, [query, id, getPEOById]);

    useEffect(() => {
        if(selectedPEO) {
            setModifiedPEO(Object.assign({}, selectedPEO, {
                id: selectedPEO.ID
            }))
        }
    }, [selectedPEO]);

    console.log("modifiedPEO", modifiedPEO);

    return (
        <RenderFormbuilderForm
            formName="ADD PEO FORM"
            small
            formHeader={`${update ? "Update" : "Create"} PEO Form`}
            existingForm={update ? modifiedPEO  : null}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            dynamicOptions={[]}
        />
    )
};

export default CreatePEOPage;