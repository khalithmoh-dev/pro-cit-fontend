import React, { useEffect, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import { FaRupeeSign } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import paymentfeestore from '../../../store/paymentfeestore';
import useDepartmentStore from '../../../store/quickcollectsettingStore';

interface FeePaymentData {
    mode: string;
    bank_account: string;
    payment_date: string;
    transaction: string;
    receipt_series: string;
    receipt_no: string;
    amount: string;
    excess_amount: string;
    remark: string;
    payment: Array<{
        category_name: string;
        fee_head_type: string;
        paid_amount: number;
        balance_amount: number;
    }>;
}

interface PropsIF {
    firstName: string,
    academicDialogOpen: boolean;
    setacademicDialogOpen: any;
    selectedStudent: any;
    setSelectedStudent: any
    totalPaid: number;
    totalBalance: number;
    students: any
    selectedFeeStructureId: any
    selectedFees: any
    selectedYear: any
}

const CollectAcademicDialog: React.FC<PropsIF> = ({ firstName, academicDialogOpen, setacademicDialogOpen, totalBalance, selectedFeeStructureId, students, selectedStudent, setSelectedStudent, selectedFees: initialSelectedFees, selectedYear }) => {

    const [selectedFees, setSelectedFees] = useState(initialSelectedFees);

    const [localStudents, setLocalStudents] = useState(students);

    const [totalAmounts, setTotalAmounts]: any = useState<number>();

    const defaultPaymentData = {
        mode: "online",
        bank_account: "",
        payment_date: "",
        transaction: "",
        receipt_series: "",
        receipt_no: "",
        amount: '',
        excess_amount: "",
        remark: "",
        payment: [
            {
                category_name: "Tuition Fee",
                fee_head_type: "Regular",
                paid_amount: 0,
                balance_amount: 0
            }
        ]
    };
    const [PaymentData, setPaymentData] = useState<FeePaymentData>(defaultPaymentData);

    const [errors, setErrors] = useState({
        mode: "",
        payment_date: "",
        receipt_series: "",
        receipt_no: "",
        amount: "",
        excess_amount: '',
        remark: ""
    });

    const { createFeePayment, getFeePayment, getallstudent }: any = paymentfeestore();
    const { getReceiptSeries, ReceiptSeries }: any = useDepartmentStore();

    const Datachangehandel = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPaymentData(prevdata => ({
            ...prevdata, [name]: value
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    };
    const studentId = selectedStudent._id
    const feeStructureId = selectedFeeStructureId
    useEffect(() => {
        if (selectedStudent._id && selectedFeeStructureId) {

            getFeePayment(studentId, feeStructureId);
        }
    }, [selectedStudent._id, selectedFeeStructureId]);

    const SubmitHandel = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };

        if (!PaymentData.mode) {
            formIsValid = false;
            newErrors.mode = "Mode is required.";
        }
        if (!PaymentData.payment_date) {
            formIsValid = false;
            newErrors.payment_date = "Payment date is required.";
        }
        if (!PaymentData.receipt_series) {
            formIsValid = false;
            newErrors.receipt_series = "Receipt series is required.";
        }
        if (!PaymentData.receipt_no) {
            formIsValid = false;
            newErrors.receipt_no = "Receipt number is required.";
        }
        if (!PaymentData.remark) {
            formIsValid = false;
            newErrors.remark = "Remark is required.";
        }
        if (!PaymentData.amount) {
            formIsValid = false;
            newErrors.amount = "Amount is required.";
        }
        // if (PaymentData.excess_amount && parseFloat(PaymentData.excess_amount.toString()) > totalBalance) {
        //     formIsValid = false;
        //     newErrors.excess_amount = "Excess amount cannot exceed the remaining balance.";
        // }

        setErrors(newErrors);

        if (formIsValid) {
            if (totalAmounts > totalBalance) {

                newErrors.amount = "Paid amount exceeds remaining balance for category Tuition Fee.";
                setErrors(newErrors);
                return;
            }
            const totalPaidAmount = students?.reduce((total: number, student: { feeStructures: any[] }) => {

                if (Array.isArray(student?.feeStructures)) {
                    student.feeStructures?.forEach(feeStructure => {
                        if (Array.isArray(feeStructure?.feeBalanceId?.balance)) {
                            feeStructure.feeBalanceId.balance.forEach((balance: { paid_amount: any }) => {
                                total += balance?.paid_amount || 0;
                            });
                        }
                    });
                }
                return total;
            }, 0);

            const totalBalanceAmount = students?.reduce((total: number, student: { feeStructures: any[] }) => {
                student.feeStructures?.forEach((feeStructure) => {
                    if (feeStructure?.feeBalanceId?.balance) {
                        feeStructure.feeBalanceId.balance.forEach((balance: { remaining_amount: any }) => {
                            total += balance.remaining_amount || 0;
                        });
                    }
                    else if (feeStructure?.fees?.length > 0) {
                        feeStructure.fees.forEach((fee: { amount: any }) => {
                            total += fee.amount || 0;
                        });
                    }
                });
                return total;
            }, 0);

            const finalAmount = totalBalanceAmount > 0
                ? {
                    amount: totalBalanceAmount,  // If totalBalanceAmount is greater than 0, use it
                    category_name: selectedFees?.[0]?.category_name || 'N/A',  // Pass the category_name from selectedFees, or default to 'N/A'
                    fee_head_type: selectedFees?.[0]?.fee_head_type || 'N/A',  // Pass the fee_head_type from selectedFees, or default to 'N/A'
                }
                : selectedFees?.reduce(
                    (acc: any, fee: { amount: any, category_name: string, fee_head_type: string }) => {
                        return {
                            amount: acc.amount + (fee.amount || 0),  // Sum up the amount
                            category_name: fee.category_name || 'N/A',  // Get the category_name
                            fee_head_type: fee.fee_head_type || 'N/A',  // Get the fee_head_type
                        };
                    },
                    { amount: 0, category_name: 'N/A', fee_head_type: 'N/A' }
                );

            const payment = students?.flatMap((student: { feeStructures: any[] }) =>
                student.feeStructures?.map((feeStructure) => {
                    const balanceData = feeStructure?.feeBalanceId?.balance?.[0]; // Get the first balance item
                    const category_name = balanceData?.category_name || selectedFees?.[0]?.category_name || "N/A";
                    const fee_head_type = balanceData?.fee_head_type || selectedFees?.[0]?.fee_head_type || "N/A";
                    const paid_amount = finalAmount?.amount || totalPaidAmount || 0;
                    const balance_amount = finalAmount?.amount || totalBalanceAmount || 0;
                    return {
                        category_name,
                        fee_head_type,
                        paid_amount,
                        balance_amount,
                    };
                })
            );
            const paymentDataToSend = {
                // ...PaymentData,
                student_id: selectedStudent._id,  // Example student_id
                fee_structure_id: selectedFeeStructureId,
                mode: PaymentData.mode,
                bank_account: PaymentData.bank_account,
                payment_date: PaymentData.payment_date,
                transaction: PaymentData.transaction,
                receipt_series: PaymentData.receipt_series,
                receipt_no: PaymentData.receipt_no,
                amount: Number(PaymentData.amount), // Total payment amount
                excess_amount: Number(PaymentData.excess_amount),
                remark: PaymentData.remark,
                // payment: 
                payment: selectedFees.filter((item: any) => item?.paid_amount !== 0)
                    ?.map((fee: any) => {
                        return {
                            category_name: fee.category_name,
                            fee_head_type: fee.fee_head_type,
                            paid_amount: fee?.paid_amount,
                            balance_amount: fee?.remainingamount || 0
                        }
                    })
            };

            const paymentSuccess = await createFeePayment(paymentDataToSend, studentId, feeStructureId);
            await getallstudent({
                firstName: firstName,
                lastName: '',
                email: '',
                contactNumber: '',
                admissionNumber: ''
            });
            // const paymentSuccess = await paymentfeestore.getState().createFeePayment(paymentDataToSend,studentId, feeStructureId);
            if (paymentSuccess) {
                handleDialogClose();
            }
        }
    };

    useEffect(() => {
        getallstudent({
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            admissionNumber: ''
        })
    }, [selectedStudent])

    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                await getReceiptSeries('');
            } catch (error) {
                console.error("Error fetching receipt series", error);
            }
        };
        fetchParentHeads();
    }, [getReceiptSeries]);

    // const handleAmountChange = (
    //     event: React.ChangeEvent<HTMLInputElement>,
    //     balanceIndex?: number,
    //     fsIndex?: any,
    //     isSelectedFee?: boolean
    // ) => {
    //     const newValue = event.target.value;
    //     const parsedValue = parseFloat(newValue);

    //     if (isNaN(parsedValue) || parsedValue <= 0) {
    //         setPaymentData((prevData) => ({
    //             ...prevData,
    //             amount: "",
    //         }));
    //         return;
    //     }

    //     if (isSelectedFee) {
    //         const totalBalance = selectedFees.reduce(
    //             (total: any, fee: { remaining_amount: any }) => total + (fee.remaining_amount || 0),
    //             0
    //         );

    //         if (totalBalance <= 0) return;

    //         let remainingAmount = parsedValue;

    //         const updatedFees = selectedFees.map((fee: { remaining_amount: number; paid_amount: any }) => {
    //             const remainingBalance = fee.remaining_amount || 0;

    //             if (remainingAmount <= 0 || remainingBalance === 0) {
    //                 return { ...fee, remain_amount: Math.max(0, Number(fee.paid_amount) || 0) };
    //             }

    //             const allocation = Math.min(
    //                 remainingBalance,
    //                 (remainingBalance / totalBalance) * remainingAmount
    //             );
    //             remainingAmount -= allocation;

    //             return {
    //                 ...fee,
    //                 remain_amount: Math.max(0, allocation),  // Ensure no negative values
    //                 remaining_amount: Math.max(0, remainingBalance - allocation),  // Ensure no negative values
    //             };
    //         });

    //         setSelectedFees(updatedFees);
    //     } else if (students && typeof fsIndex !== "undefined" && typeof balanceIndex !== "undefined") {
    //         const updatedStudents = [...students];
    //         const feeStructure = updatedStudents[fsIndex].feeStructures[0];
    //         const balance = feeStructure.feeBalanceId.balance[balanceIndex];

    //         // Ensure valid remaining_amount is used
    //         const remainingAmount = Math.max(0, balance.remaining_amount || 0);
    //         const allocatedAmount = Math.min(parsedValue, remainingAmount);

    //         balance.remain_amount = Number(allocatedAmount); // Ensure it's a valid number

    //         setLocalStudents(updatedStudents);
    //     } else {
    //         let remainingAmount = parsedValue;

    //         const updatedStudents = [...students];
    //         updatedStudents.forEach((student) => {
    //             student.feeStructures.forEach((feeStructure: { feeBalanceId: { balance: any[]; }; }) => {
    //                 feeStructure.feeBalanceId.balance.forEach((balance) => {

    //                     if (remainingAmount <= 0) return; // Exit if no amount remains

    //                     const remainingBalance = Math.max(0, balance.remaining_amount || 0);
    //                     const allocation = Math.min(remainingAmount, remainingBalance);

    //                     balance.remain_amount = (balance.remain_amount || 0) + allocation;

    //                     // Reduce the remainingAmount by the allocated amount
    //                     remainingAmount -= allocation;
    //                 });
    //             });
    //         });

    //         setLocalStudents(updatedStudents);
    //     }

    //     setPaymentData((prevData) => ({
    //         ...prevData,
    //         amount: newValue,
    //     }));
    // };


    // const renderLastColumn = (fee: { paid_amount: number }) => {
    //     return fee.paid_amount || 0;
    // };


    const handleDialogClose = () => {
        setacademicDialogOpen(false);
        setPaymentData(defaultPaymentData);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredAmount: any = parseFloat(e.target.value) || '';
        if (isNaN(enteredAmount)) return;

        // Update the state with the entered amount
        setPaymentData((prevData: any) => ({
            ...prevData,
            amount: enteredAmount,
        }));

        let remainingAmount = enteredAmount;
        const findacademicYear = selectedStudent?.feeStructures?.filter((item: any) => item?.academicYear == selectedYear)

        const updatedSelectedStudent = selectedFees.map((fee: any) => {
            let paid_amount = 0;
            let balanceAmount = fee.amount;

            // Find a matching balance for the fee
            findacademicYear.forEach((item: any) => {
                const balances = item?.feeBalanceId?.balance || [];

                balances.forEach((balance: any) => {
                    if (balance?.category_name === fee.category_name) {
                        balanceAmount = balance.remaining_amount || fee.amount;
                    }
                });
            });

            if (remainingAmount > balanceAmount) {
                paid_amount = balanceAmount;
                remainingAmount -= balanceAmount;
            } else {
                paid_amount = remainingAmount;
                remainingAmount = 0;
            }

            return {
                ...fee,
                paid_amount,
                remainingamount: balanceAmount
            };
        });

        setSelectedFees(updatedSelectedStudent);
        setPaymentData(prevdata => ({
            ...prevdata,
            excess_amount: remainingAmount
        }));
    };

    const handleChangeTotalAmount = (e: React.ChangeEvent<HTMLInputElement>, index: number, fieldName: string) => {
        const totalValue = Number(e.target.value)
        const updateTotalAmount = [...selectedFees];
        updateTotalAmount[index][fieldName] = Number(e.target.value)
        setSelectedFees(updateTotalAmount)

        const feeAmount = selectedFees?.reduce((sum: any, fee: any) => sum + (fee?.paid_amount || 0), 0)
        let remainingAmount = totalValue - feeAmount;
        remainingAmount = remainingAmount < 0 ? 0 : remainingAmount;

        setPaymentData({
            ...PaymentData,
            amount: feeAmount,
            excess_amount: String(remainingAmount)
        })
    }

    const getBalanceAmount = (fees: any, name: string, i: any) => {
        const feeStructure = selectedStudent?.feeStructures?.find(
            (item: any) => item.academicYear === selectedYear
        );

        if (!feeStructure) return 0;

        const matchingBalance = feeStructure?.feeBalanceId?.balance?.find(
            (data: any) => data.category_name === fees?.category_name
        );

        const matchingTotalBalance = selectedFees?.find(
            (data: any, index: any) => data.category_name === name && index == i
        );

        return matchingBalance?.remaining_amount ? matchingBalance?.remaining_amount : matchingTotalBalance?.amount;
    };


    return (
        <div>
            <Dialog isOpen={academicDialogOpen} onClose={() => setacademicDialogOpen(false)} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Fee Payment
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form onSubmit={SubmitHandel}>
                            <div className={style.studentDetails}>
                                <div style={{ fontSize: '14px' }}><span style={{ marginRight: '10px' }}><FaUser /></span>Student Details</div>
                                <table className={style.studentDetailsTable}>
                                    <tbody>
                                        <tr style={{ fontSize: '14px' }}>
                                            <td>Name- <span style={{ fontWeight: "600" }}>{selectedStudent?.firstName.toUpperCase()} {selectedStudent?.lastName?.toUpperCase() ?? "NA"}</span></td>
                                            <td>Mobile- <span style={{ fontWeight: "600" }}> {selectedStudent?.contactNumber ?? "NA"}</span></td>
                                            <td>Category- <span style={{ fontWeight: "600" }}>{selectedStudent?.category ?? "NA"?.toUpperCase()}</span></td>
                                            <td>Admission Type- <span style={{ fontWeight: "600" }}>{selectedStudent?.admissionType?.toUpperCase() ?? "NA"}</span></td>
                                            <td>Total Fees- <span style={{ fontWeight: "600" }}>{selectedStudent?.feeStructures[0]?.feeStructureId?.total_fee ?? "NA"}</span></td>
                                            {/* <td>Balance Fees- <span style={{ fontWeight: "600" }}>{selectedStudent?.feeStructures[0]?.feeBalanceId.balance[0]?.total_fee ?? "NA"}</span></td> */}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={style.studentDetails}>
                                <div style={{ fontSize: '14px' }}><span style={{ marginRight: '10px' }}><FaRupeeSign /></span>Payment Details</div>
                                <div className={style.studentInfoGrid}>
                                    <div>
                                        <label>Mode <span style={{ color: "red" }}>*</span></label>
                                        <div className={style?.inputError}>
                                            <select className={style.academySelect} name='mode' value={PaymentData.mode} onChange={Datachangehandel}>
                                                <option value="online">Online</option>
                                                <option value="cash">Cash</option>
                                            </select>
                                            {errors.mode && <p style={{ color: "red" }}>{errors.mode}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Transaction Id / Cheque No. / DD No.</label>
                                        <input type="text" className={style.academySelect} name="transaction" value={PaymentData.transaction} onChange={Datachangehandel} />
                                    </div>
                                    <div>
                                        <label>Bank Account</label>
                                        <input type="text" className={style.academySelect} name="bank_account" value={PaymentData.bank_account} onChange={Datachangehandel} />
                                    </div>
                                    <div>
                                        <label>Payment Date <span style={{ color: "red" }}>*</span></label>
                                        <input type="date" className={style.academySelect} name="payment_date" value={PaymentData.payment_date} onChange={Datachangehandel} />
                                    </div>
                                    <div>
                                        <label>Receipt Series <span style={{ color: "red" }}>*</span></label>
                                        {/* <input type="text" className={style.academySelect} name="receipt_series" value={PaymentData.receipt_series} onChange={Datachangehandel} /> */}
                                        <select
                                            className={style.academySelect}
                                            name="default_receipt_series"
                                            onChange={Datachangehandel}
                                            value={PaymentData.receipt_series}
                                        >
                                            <option value="" selected> 
                                                Select Receipt Series
                                            </option>    
                                            {ReceiptSeries?.map((row: any, index: number) => (
                                                <option value={row?.series_preview} key={index}>{row.series_preview}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Excess Amount <span style={{ color: "red" }}>*</span></label>
                                        <input type="text" className={style.academySelect} name="excess_amount" value={PaymentData.excess_amount} disabled />
                                    </div>
                                    <div>
                                        <label>Receipt Number <span style={{ color: "red" }}>*</span></label>
                                        <input type="text" className={style.academySelect} name="receipt_no" value={PaymentData.receipt_no} onChange={Datachangehandel} />
                                    </div>
                                    <div>
                                        <label>Amount <span style={{ color: "red" }}>*</span></label>
                                        <input type="number" className={style.academySelect} name="amount" value={PaymentData.amount || ""} onChange={handleAmountChange} />
                                    </div>

                                </div>
                            </div>
                            <table className={style.detailTable}>
                                <thead>
                                    <tr>
                                        <th>Head Type</th>
                                        <th>Facility</th>
                                        <th>Head Name</th>
                                        <th>Total Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Balance Amount</th>
                                        <th>Total amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* Show selectedFees only once when no fee balance data */}
                                    {selectedFees?.length > 0 &&
                                        selectedFees.map((fees: any, sfIndex: any) => {
                                            // Find the matching fee structure based on the fee ID
                                            const matchingFeeStructure = localStudents
                                                .flatMap((student: { feeStructures: any; }) => student.feeStructures)
                                                .find((feeStructure: { feeStructureId: { fees: any[]; }; }) =>
                                                    fees?.academicYear === selectedYear &&
                                                    feeStructure?.feeStructureId?.fees?.some(fee => fee._id === fees._id)
                                                );

                                            const facility = matchingFeeStructure ? matchingFeeStructure.feeStructureId.facility : "N/A";

                                            return (
                                                <tr key={sfIndex}>
                                                    <td>{fees?.fee_head_type || "N/A"}</td>
                                                    <td>{facility}</td>
                                                    <td>{fees?.category_name || "0"}</td>
                                                    <td>{fees?.amount || "0"}</td>
                                                    <td>
                                                        {selectedStudent?.feeStructures?.length > 0 ? (
                                                            selectedStudent?.feeStructures.map((item: any) => {
                                                                if (item?.academicYear === selectedYear) {
                                                                    const matchingBalances = item?.feeBalanceId?.balance?.filter(
                                                                        (data: any) => data?.category_name === fees?.category_name
                                                                    );

                                                                    return matchingBalances?.length > 0 ? (
                                                                        matchingBalances.map((data: any, dataIndex: number) => (
                                                                            <div key={dataIndex}>
                                                                                <p>{data?.paid_amount ?? "0"}</p>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div>
                                                                            <p>0</p>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null; // Return nothing if no match
                                                            })
                                                        ) : (
                                                            <p>0</p>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {selectedStudent?.feeStructures?.length > 0 ? (
                                                            selectedStudent?.feeStructures.map((item: any) => {
                                                                if (item?.academicYear === selectedYear) {
                                                                    const matchingBalances = item?.feeBalanceId?.balance?.filter(
                                                                        (data: any) => data?.category_name === fees?.category_name
                                                                    );

                                                                    return matchingBalances?.length > 0 ? (
                                                                        matchingBalances.map((data: any, dataIndex: number) => (
                                                                            <div key={dataIndex}>
                                                                                <p>{data?.remaining_amount ?? "0"}</p>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div>
                                                                            <p>{fees?.amount}</p>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null; // Return nothing if no match
                                                            })
                                                        ) : (
                                                            <p>0</p>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            value={fees?.paid_amount}
                                                            // onChange={(e) => handleChangeTotalAmount(e, sfIndex, "paid_amount")}
                                                            className={style.academySelect}
                                                            // readOnly={fees?.paid_amount === parseFloat(getBalanceAmount(fees))}
                                                            onChange={(e) => {
                                                                const inputValue = e.target.value;

                                                                // Allow empty string for clearing input
                                                                if (inputValue === "") {
                                                                    handleChangeTotalAmount(e, sfIndex, "paid_amount");
                                                                    return;
                                                                }

                                                                const parsedValue = parseFloat(inputValue);
                                                                const balanceAmount = parseFloat(getBalanceAmount(fees, fees?.category_name, sfIndex));

                                                                // Validate the value only if it's a valid number
                                                                if (!isNaN(parsedValue) && parsedValue <= balanceAmount) {
                                                                    handleChangeTotalAmount(e, sfIndex, "paid_amount");
                                                                }
                                                            }}

                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                </tbody>

                            </table>
                            <div>
                                <label>Remark <span style={{ color: "red" }}>*</span></label>
                                <input type="text" className={style.academySelect} name="remark" value={PaymentData.remark} onChange={Datachangehandel} />
                            </div>
                            <div style={{ gap: "8px", display: "flex" }}>
                                <button style={{ backgroundColor: "#0465ac", padding: "8px", color: "white", border: "none" }}>Submit</button>
                                <button style={{ padding: "6px", border: "2px solid  #0465ac" }} onClick={handleDialogClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default CollectAcademicDialog;
