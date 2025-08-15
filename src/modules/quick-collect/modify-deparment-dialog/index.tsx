import React, {  useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import { StudentQuickCollect } from '../../../store/quickCollectStore';
import Button from '../../../components/button';

interface PropsIF {
    feeStructureDialogOpen: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFeeStructureDialogOpen?: any; // Correct type for dialog state setter
    selectedStudent?: StudentQuickCollect;
    totalHeadAmounts?: number | null;
    totalPaid?: number | null;
    totalBalance?: number | null;
}

// interface Fee {
//     headType: string;
//     headName: string;
//     totalAmount: string | number;
// }

const ModifydeparmentStructureDialog: React.FC<PropsIF> = ({ feeStructureDialogOpen, setFeeStructureDialogOpen }) => {
    // const [totalAmounts, setTotalAmounts] = useState<number>(0);


    // const [selectedStudentFeesPayment, setSelectedStudentFeesPayment] = useState<Fee[]>(selectedStudent?.paymentDetails?.academicYears[0]?.fees || []);

    // useEffect(() => {
    //     if (selectedStudentFeesPayment) {
    //         const total = selectedStudentFeesPayment.reduce((acc, fee) => {
    //             const feeAmount = typeof fee.totalAmount === 'string' ? parseFloat(fee.totalAmount) : fee.totalAmount;
    //             return acc + (isNaN(feeAmount) ? 0 : feeAmount);
    //         }, 0);
    //         setTotalAmounts(total);
    //     }
    // }, [selectedStudentFeesPayment]);

    const handleDialogClose = () => {

        setFeeStructureDialogOpen(false);

    };





    const [academicYear, setAcademicYear] = useState('');
    const [showDepartment, setShowDepartment] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAcademicYearChange = (event: { target: { value: any; }; }) => {
        const selectedYear = event.target.value;
        setAcademicYear(selectedYear);

        // If a valid year is selected, show the department select
        if (selectedYear !== '') {
            setShowDepartment(true);
        } else {
            setShowDepartment(false);
        }
    };

    return (
        <div>
            <Dialog isOpen={feeStructureDialogOpen} onClose={handleDialogClose} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>

                <DialogBody>

                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <div style={{ display: "flex", gap: "18px" }}>
                            <div>
                                <label>Select Academic Year</label>
                                <div className={style?.inputError}>
                                    <select
                                        className={style.academySelect}
                                        name="AcademicYear"
                                        value={academicYear}
                                        onChange={handleAcademicYearChange}
                                    >
                                        <option value="" selected>Select Year</option>
                                        <option value="2001-02">2001-02</option>
                                        <option value="2002-03">2002-03</option>
                                        <option value="2003-04">2003-04</option>
                                        <option value="2004-05">2004-05</option>
                                        <option value="2005-06">2005-06</option>
                                        <option value="2006-07">2006-07</option>
                                        <option value="2007-08">2007-08</option>
                                        <option value="2008-09">2008-09</option>
                                    </select>
                                </div>
                            </div>

                            {/* Conditionally render the department select dropdown */}
                            {showDepartment && (
                                <div>
                                    <label>Select Group and Department</label>
                                    <div className={style?.inputError}>
                                        <select className={style.academySelect} name="Department">
                                            <option value="" selected>Select Department</option>
                                            {/* Add department options here */}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={style.addbtnConcession} style={{ display: 'flex', gap: '10px', marginTop: "10px" }}>
                            <Button onClick={handleDialogClose} secondary>Cancel</Button>
                        </div>
                    </div>

                </DialogBody>
            </Dialog>
        </div>
    );
};

export default ModifydeparmentStructureDialog;
