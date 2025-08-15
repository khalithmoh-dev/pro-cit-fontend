import { useNavigate, useParams } from "react-router-dom";
import RenderFormbuilderForm from "../../../components/render-formbuilder-form";
import { useEffect, useState } from "react";
import useFeeCategoryStore from "../../../store/feeCategoryStore";
import useStudentStore from "../../../store/studentStore";
import useInstallmentStore, { createInstallmentPayloadIF } from "../../../store/installmentStore";
import useFeeStructuresStore from "../../../store/feeCategoryStore";
import { FieldIF } from "../../../interface/component.interface";

interface PropsIF {
    update?: boolean;
}

const InstallmentCreateCategoryPage: React.FC<PropsIF> = ({ update }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { createInstallment, updateInstallment, getInstallmentFeesStructure, installmentData , loading} = useInstallmentStore();
    const { feeStructuresOptions } = useFeeStructuresStore();
    const {  getFeeStructures } = useFeeCategoryStore();
    const { getStudents, studentOptions } = useStudentStore();


    useEffect(() => {
        getFeeStructures()
        getStudents()
    }, [])



    useEffect(() => {
        getInstallmentFeesStructure();
    }, [getInstallmentFeesStructure]);





    const onSubmit = async (values: createInstallmentPayloadIF) => {

        const updatedValues: any = {
            fee_structure_id: values?.fee_structure_id,
            student_id: values?.student_id,
            installment_amount: Number(values?.installment_amount),
            due_date: values?.due_date
        };

        const res =
            id && update
                ? await updateInstallment(updatedValues, id)
                : await createInstallment(updatedValues);

        if (res) {
            navigate(-1);
        }
    };


    return (
        <RenderFormbuilderForm
            formName="Create Installment Form"
            formHeader={`${update ? "Update" : "Create"} Installment Form`}
            existingForm={update ? installmentData : null}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            large
            loading={loading}
            dynamicOptions={[feeStructuresOptions, studentOptions]}
        />
    );
};

export default InstallmentCreateCategoryPage;
