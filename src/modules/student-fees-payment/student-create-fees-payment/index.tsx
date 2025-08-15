import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useStudentStore from '../../../store/studentStore';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';




interface PropsIF {
    update?: boolean;
}

const CreateStudentFeesPaymentPage : React.FC<PropsIF> = ({ update }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // const { createInstallment, updateInstallment, getInstallmentFeesStructure, installmentData, loading } = useInstallmentStore();
    // const { feeStructuresOptions } = useFeeStructuresStore();
    // const { getFeeStructures } = useFeeCategoryStore();
    const { getStudents, studentOptions } = useStudentStore();


    useEffect(() => {
        getStudents()
    }, [])



    // useEffect(() => {
    //     getInstallmentFeesStructure();
    // }, [getInstallmentFeesStructure]);





    const onSubmit = async () => {

        // const updatedValues: any = {
        //     fee_structure_id: values?.fee_structure_id,
        //     student_id: values?.student_id,
        //     installment_amount: Number(values?.installment_amount),
        //     due_date: values?.due_date
        // };

        // const res =
        //     id && update
        //         ? await updateInstallment(updatedValues, id)
        //         : await createInstallment(updatedValues);

        // if (res) {
        //     navigate(-1);
        // }
    };
    return (
        <RenderFormbuilderForm
            formName="Create Student Payment Form"
            formHeader={`${update ? "Update" : "Create"} Student Payment Form`}
            // existingForm={update ? installmentData : null}
            goBack={() => navigate(-1)}
            onSubmit={onSubmit}
            large
            // loading={loading}
            dynamicOptions={[studentOptions]}
        />
    )
}

export default CreateStudentFeesPaymentPage