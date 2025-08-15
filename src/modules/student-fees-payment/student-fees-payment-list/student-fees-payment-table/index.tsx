import React, { useEffect } from 'react'
import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import useFeePaymentStore from '../../../../store/feePaymentStore';
import TableBody from '../../../../components/table/tableBody';
import { useNavigate } from 'react-router-dom';


const StudentFeesPaymentTableComponent: React.FC = () => {
    const navigate = useNavigate();
    const { getFeePayHistory, feePayHistory } = useFeePaymentStore();

    useEffect(() => {
        getFeePayHistory();
    }, []);



    const tableHead = [
        "SL NO.",
        "DEPARTMENT NAME",
        "STUDENT NAME",
        "STUDENT EMAIL",
        "GENDER",
        "CONTACT NUMBER",
        "COURSE NAME",
    ];

   


    const handleSelectStudent = (studentId: string) => {
        navigate(`/feepayment/view/${studentId}`);

    };
    


    const tableBody = feePayHistory?.map((feeCategory, index) => {
        const fullName = `${feeCategory?.student?.firstName} ${feeCategory?.student?.middleName} ${feeCategory?.student?.lastName}`.trim();

        return (
            <>
                <tr key={index} onClick={() => handleSelectStudent( feeCategory?.student?._id)}>
                    <td>{index + 1}</td>
                    <td style={{ textTransform: "capitalize" }}>
                        {feeCategory?.student?.department?.name}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                        {fullName}
                    </td>


                    <td >{feeCategory?.student?.email}</td>
                    <td style={{ textTransform: "capitalize" }}>{feeCategory?.student?.gender}</td>
                    <td>{feeCategory?.student?.contactNumber}</td>
                    <td >{feeCategory?.student?.course?.course_name || '-'}</td>

                </tr>

            </>
        )
    });


    return (
        <div>
            <Table>
                <TableHead tableHead={tableHead} />
                <TableBody tableBody={tableBody} />
            </Table>

        </div>
    )
}

export default StudentFeesPaymentTableComponent