import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCOConfigStore, { createCOConfigPayloadIF } from "../../../../store/coConfigStore";
import RenderFormbuilderForm from "../../../../components/render-formbuilder-form";
import { RenderFormbuilderFormIF } from "../../../../interface/component.interface";
import { CreateAttendancePayloadIF } from "../../../../store/attendanceStore";
import { SubjectIF } from "../../../../store/subjectStore";

const CreateCoConfig: React.FC = (): JSX.Element => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const { coConfig, getCOConfig, createCOConfig, updateCOConfig } = useCOConfigStore();

    const onSubmit = useCallback((values: createCOConfigPayloadIF) => {
        if (!subjectId) return;
        const createCOConfigPayload: createCOConfigPayloadIF = {
            ...values,
            subject: subjectId as unknown as SubjectIF,
            level1Attainment: Number(values.level1Attainment),
            level2Attainment: Number(values.level2Attainment),
            level3Attainment: Number(values.level3Attainment),
        }
        if (coConfig?._id) {
            updateCOConfig(coConfig._id, createCOConfigPayload);
        } else {
            createCOConfig(createCOConfigPayload);
        }
    }, [coConfig?._id, createCOConfig, subjectId, updateCOConfig]);

    useEffect(() => {
        if (subjectId) {
            getCOConfig(subjectId);
        }
    }, [getCOConfig, subjectId]);

    return (
        <RenderFormbuilderForm
            formName="Create CO Config Form"
            small
            formHeader={`${coConfig?._id ? "Update" : "Create CO Form"}`}
            existingForm={coConfig ? coConfig : null}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            dynamicOptions={[]}
        />
    );
};

export default CreateCoConfig;