import React, { useEffect, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import { StudentQuickCollect } from '../../../store/quickCollectStore';
import { IoClose } from 'react-icons/io5';
import Button from '../../../components/button';
import CloseIcon from '../../../icon-components/CloseIcon';

interface PropsIF {
    feeStructureDialogOpen: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFeeStructureDialogOpen?: any; // Updated the type for the setter function
    selectedStudent?: StudentQuickCollect;
    totalHeadAmounts?: number | null;
    totalPaid?: number | null;
    totalBalance?: number | null;
}

interface Fee {
    headType: string;
    headName: string;
    totalAmount: string | number;
}

const ModifyfeeStructureDialog: React.FC<PropsIF> = ({ feeStructureDialogOpen, setFeeStructureDialogOpen
    // , selectedStudent 
}) => {
    // const [amounts, setAmounts] = useState<{ [key: number]: number }>({}); // changed from string to number
    const [totalAmounts, setTotalAmounts] = useState<number>(0);
    const [newRows, setNewRows] = useState<{ headType: string, headName: string, amount: string }[]>([]);
    const [selectHead, setSelectedHead] = useState<string>(''); // kept as string

    // Ensuring selectedStudentFeesPayment is typed correctly
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
        if (setFeeStructureDialogOpen) {
            setFeeStructureDialogOpen(false); // Check if setter exists before calling it
        }
    };

    // const handleTableInputChange = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    //     feeIndex: number,
    // ) => {
    //     let enteredValue = e.target.value;
    //     const parsedValue = parseFloat(enteredValue);

    //     if (isNaN(parsedValue) || parsedValue <= 0) {
    //         enteredValue = "";
    //     } else {
    //         enteredValue = parsedValue.toString();
    //     }

    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     setAmounts((prevAmounts:any) => {
    //         const updatedAmounts = { ...prevAmounts, [feeIndex]: enteredValue };

    //         const newTotalAmount = selectedStudentFeesPayment?.reduce((acc, fee, index) => {
    //             const feeAmount = typeof fee.totalAmount === 'string' ? parseFloat(fee.totalAmount) : fee.totalAmount;
    //             const amountPaid = updatedAmounts[index] ? parseFloat(updatedAmounts[index].toString()) : 0;
    //             return acc + (isNaN(feeAmount) ? 0 : feeAmount) + (isNaN(amountPaid) ? 0 : amountPaid);
    //         }, 0) || 0;

    //         setTotalAmounts(newTotalAmount);
    //         return updatedAmounts;
    //     });
    // };

    const handleAddRow = () => {
        setNewRows([...newRows, { headType: '', headName: '', amount: '' }]);
    };

    const handleNewRowChange = (index: number, field: keyof typeof newRows[0], value: string) => {
        const updatedRows = [...newRows];
        updatedRows[index][field] = value;
        setNewRows(updatedRows);
    };

    const removeFiled = () => {
        setNewRows([]);
    };

    // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedFeeType = e.target.value;
    //     if (selectedFeeType) {
    //         const newFee: Fee = {
    //             headType: 'fee',
    //             headName: selectedFeeType,
    //             totalAmount: "0",
    //         };
    //         setSelectedStudentFeesPayment((prevFees) => [...prevFees, newFee]);
    //         setNewRows([]); // Reset new rows after adding a new fee type
    //     }
    // };

    return (
        <div>
            <Dialog isOpen={feeStructureDialogOpen} onClose={handleDialogClose} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Update Fee Structure
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <b>Note :-</b>
                        <p style={{ marginTop: "20px", textAlign: "left" }}>If the existing paid amount for a particular head is more than the updated assigned amount, the difference will be considered in the Excess amount.</p>
                        <p style={{ textAlign: "left" }}>For eg. if the assigned Tuition fee was Rs. 25000 and the student has already paid Rs. 20000, and now the assigned amount is changed to Rs. 15000. The difference amount i.e. Rs. 5000 will be considered as an Excess amount.</p>
                    </div>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <table className={style.academyTable}>
                            <thead>
                                <tr className={style?.tableHeadingDetail}>
                                    <th>Sr. No.</th>
                                    <th>Fee Head Type</th>
                                    <th>Fee Head Name</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* {selectedStudentFeesPayment && selectedStudentFeesPayment.length > 0 ? (
    selectedStudentFeesPayment.map((fee, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{fee.headType}</td>
            <td>{fee.headName}</td>

            <td>
                {fee.totalAmount && (
                    <input
                        type="number"
                        min={0}
                        max={fee.totalAmount as number}
                        value={amounts[index] || fee.totalAmount}
                        onChange={(e) => handleTableInputChange(e, index)}
                        placeholder="Enter Paid Amount"
                        style={{
                            width: '100%',
                            border: "none",
                            borderBottom: "1px solid #ccc",
                            outline: "none",
                            background: "transparent",
                        }}
                    />
                )}
            </td>
        </tr>
    ))
) : (
    <tr>
        <td colSpan={4} style={{ textAlign: 'center', color: 'gray' }}>Data not found</td>
    </tr>
)} */}

                                {newRows?.length > 0 ? (
                                    newRows.map((row, index) => (
                                        <tr key={`new-row-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <select className={style.academySelect} name="headType" id="headType" onChange={(e) => setSelectedHead(e.target.value)}>
                                                    <option value="">Select Head Type</option>
                                                    <option value="Fee">Fee</option>
                                                    <option value="Fine">Fine</option>
                                                    <option value="Scholarship">Scholarship</option>
                                                </select>
                                                <button className={style.closeFieldButton} onClick={removeFiled}>
                                                    <IoClose />
                                                </button>
                                            </td>
                                            <td>
                                                {/* {selectHead === "Fee" && (
                                                    <select
                                                        className={style?.academySelect}
                                                        name="headType"
                                                        id="headType"
                                                        onChange={handleSelectChange}
                                                        value={selectHead}
                                                    >
                                                        <option value="">Select Head</option>
                                                        <option value="INSURANCE">INSURANCE</option>
                                                        <option value="TUITION FEES AND OTHERS">TUITION FEES AND OTHERS</option>
                                                    </select>
                                                )} */}
                                                {selectHead === "Fine" && (
                                                    <select className={style.academySelect} name="headType" id="headType">
                                                        <option value="">Select Fine</option>
                                                    </select>
                                                )}
                                                {selectHead === "Scholarship" && (
                                                    <select className={style.academySelect} name="headType" id="headType">
                                                        <option value="">Select Head</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={row.amount}
                                                    onChange={(e) => handleNewRowChange(index, 'amount', e.target.value)}
                                                    placeholder="Amount"
                                                    style={{
                                                        width: '100%',
                                                        border: "none",
                                                        borderBottom: "1px solid #ccc",
                                                        outline: "none",
                                                        background: "transparent",
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td></td>
                                        <td style={{ textAlign: "right" }}>
                                            <button className={style.addMorebutton} onClick={handleAddRow} style={{ marginTop: '10px' }}>+ Add More Fee Head Type</button>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <b>Total : {totalAmounts}.00</b>
                    </div>
                    <div className={style.addbtnConcession} style={{ display: 'flex', gap: '10px', marginTop: "10px" }}>
                        <Button submit={true}>Update</Button>
                        <Button secondary onClick={handleDialogClose}>Cancel</Button>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default ModifyfeeStructureDialog;
