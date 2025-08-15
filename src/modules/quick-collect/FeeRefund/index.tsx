/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import Button from '../../../components/button';
import { FaRupeeSign, FaUser } from 'react-icons/fa';
import paymentfeestore from '../../../store/paymentfeestore';
import useQuickCollectStore from '../../../store/quickCollectStore';
import Toast from '../../../components/toast';
import { useToastStore } from '../../../store/toastStore';
import useDepartmentStore from '../../../store/quickcollectsettingStore';

interface PropsIF {
    UpdateChallanDialogOpen: boolean;
    setConcessionDialogOpen?: any;
    selectedFeeStructureId: any
    students: any
    selectedStudent: any
    selectedId: any
    selectedrefund: any;
    selectedFeeStructure: any
}

const FeeRefund: React.FC<PropsIF> = ({ UpdateChallanDialogOpen, setConcessionDialogOpen, selectedStudent, selectedFeeStructureId, students, selectedrefund, selectedFeeStructure }) => {
    const { getFeeReceipt, selectedFeeReceipt }: any = useQuickCollectStore();
    const { getReceiptSeries, ReceiptSeries }: any = useDepartmentStore();
    const [refundPayment, setRefundPayment] = useState(selectedFeeReceipt)

    const [refundMethod, setRefundMethod] = useState('');
    const [totalAmounts, setTotalAmounts]: any = useState<number | undefined>(undefined);
    const [PaymentData, setPaymentData] = useState({
        mode: 'cash',
        BankAccount: '',
        PaymentDate: '',
        TransactionId: '',
        ReceiptSeries: '',
        ReceiptNo: '',
        Amount: '',
        Remark: "",
        previousexcess: '',
    });
    const [errors, setErrors] = useState({
        mode: '',
        PaymentDate: '',
        ReceiptSeries: '',
        ReceiptNo: '',
        Remark: "",
        Amount: '',
    });
    const [apiError, setApiError] = useState<string>(''); // For storing error messages from the API
    const noRefundData = selectedFeeStructure?.filter((item: any) =>
        item?.refund?.some((data: any) => data?.remaining_refund !== 0)
    );

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


    const handleRefundMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRefundMethod(e.target.value);
    };

    const Datachangehandel = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPaymentData((prevdata: any) => ({
            ...prevdata,
            [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };



    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;
        const parsedValue = parseFloat(newValue);

        // If the value is invalid, reset it
        if (parsedValue <= 0 || isNaN(parsedValue)) {
            setTotalAmounts(0);
            setPaymentData((prevData: any) => ({
                ...prevData,
                Amount: '',
            }));
            return;
        }

        // Calculate the total paid amount
        const totalPaidAmount = (selectedFeeReceipt?.refund?.length > 0 ? selectedFeeReceipt?.refund : selectedFeeReceipt?.payment)?.reduce(
            (acc: number, item: any) => acc + (item.paid_amount || item?.remaining_refund),
            0
        );

        // Check if entered amount exceeds total paid amount
        if (parsedValue > totalPaidAmount) {
            useToastStore.getState().showToast('warning', 'Amount cannot be greater than total paid amount.');
            setTotalAmounts(totalPaidAmount);
            setPaymentData((prevData: any) => ({
                ...prevData,
                Amount: JSON.stringify(totalPaidAmount),
            }));
            const updatedRefundFees = (selectedFeeReceipt?.refund?.length > 0 ? selectedFeeReceipt?.refund : selectedFeeReceipt?.payment)?.map((item: any) => ({
                ...item,
                total_amount: (item.paid_amount || item?.remaining_refund), // Set full amount as it matches totalPaidAmount
            }));
            setRefundPayment(updatedRefundFees);
            return;
        }

        setTotalAmounts(parsedValue);
        setPaymentData((prevData: any) => ({
            ...prevData,
            Amount: JSON.stringify(parsedValue),
        }));

        // Update the `refundPayment.payment` array
        let remainingAmount = parsedValue;

        const updatedRefundFees = (selectedFeeReceipt?.refund?.length > 0 ? selectedFeeReceipt?.refund : selectedFeeReceipt?.payment)?.map((item: any) => {
            let total_amount = 0;
            const feeAmount = (item.paid_amount || item?.remaining_refund)
            if (remainingAmount > 0) {
                if (remainingAmount >= feeAmount) {
                    total_amount = feeAmount;
                    remainingAmount -= feeAmount;
                } else if (parsedValue > totalPaidAmount) {
                    total_amount = feeAmount;
                    remainingAmount = 0;
                }
                else {
                    total_amount = remainingAmount;
                    remainingAmount = 0;
                }
            }

            return {
                ...item,
                total_amount,
            };
        });


        // If needed, update the state with the modified array
        setRefundPayment(updatedRefundFees);
    };

    const { createRefundPayment, getFeePayment }: any = paymentfeestore();
    const [selectreciept, setSelectreciept] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {

            try {
                await getFeeReceipt(selectreciept);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setLoading(false); // Set loading to false once all APIs are called
            }
        };

        if (selectreciept !== null || selectreciept !== undefined) {
            fetchData();
        }
    }, [getFeeReceipt, selectreciept]);

    const handlesetselectrecieptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectreciept(e.target.value);
    };
    const studentId = selectedStudent?._id
    const feeStructureId = selectedrefund

    useEffect(() => {
        if (studentId._id && feeStructureId) {

            getFeePayment(studentId, feeStructureId);
        }
    }, [feeStructureId, getFeePayment, studentId]);
    const handleRefundClick = async () => {
        // Step 1: Validate selected student
        if (!selectedStudent || !selectedStudent._id) {
            setApiError('Selected student is not valid. Please try again.');
            return;
        }

        // Step 2: Prepare refund data
        let dynamicFeePaymentId = '';
        students?.forEach((student: any) => {
            student?.feeStructures?.forEach((feeStructure: { feeStructureId: { _id: string; }; feeBalanceId: { balance: string | any[]; }; }) => {
                if (feeStructure?.feeStructureId?._id === selectedFeeStructureId && feeStructure?.feeBalanceId?.balance?.length > 0) {
                    dynamicFeePaymentId = feeStructure?.feeBalanceId.balance[0]?._id || ''; // Use the first balance's ID
                }
            });
        });

        // Prepare payment data
        const payment = (selectedFeeReceipt?.refund?.length > 0 ? selectedFeeReceipt?.refund : selectedFeeReceipt?.payment)
            ?.filter((item: any) => (item?.paid_amount || item?.remaining_refund) !== 0) // Filter out items with paid_amount === 0
            ?.map((item: any) => {
                // Find matching refund data based on category_name
                const matchingRefund = refundPayment?.find(
                    (refund: any) => refund?.category_name === item?.category_name && refund?.paid_amount !== 0
                );

                return {
                    category_name: item?.category_name,
                    fee_head_type: item?.fee_head_type,
                    paid_amount: item?.paid_amount || item?.remaining_refund,
                    refund_amount: matchingRefund ? matchingRefund?.total_amount : 0, // Set refund amount or fallback to 0
                };
            });

        // Construct refund data object
        const refundData = {
            fee_structure_id: selectedrefund,
            fee_payment_id: dynamicFeePaymentId,
            student_id: studentId, // Ensure selectedStudent._id exists
            mode: PaymentData?.mode,
            bank_account: PaymentData.BankAccount,
            payment_date: PaymentData?.PaymentDate,
            transaction: PaymentData?.TransactionId,
            receipt_series: PaymentData?.ReceiptSeries,
            receipt_no: PaymentData?.ReceiptNo,
            refund_amount: totalAmounts,
            payment: payment,
            remark: PaymentData?.Remark,
        };


        // Step 3: Validate refund amount
        // if (isNaN(totalAmounts) || totalAmounts <= 0) {
        //     setApiError('Invalid refund amount.');
        //     return;
        // }

        try {
            await createRefundPayment(refundData, studentId, feeStructureId);
            setConcessionDialogOpen(false);
        } catch (error) {
            setApiError('Refund submission failed. Please try again.');
            console.error('Error during refund API call:', error);
        }
    };

    return (
        <div>
            <Dialog
                isOpen={UpdateChallanDialogOpen}
                onClose={() => setConcessionDialogOpen(false)}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style?.dialogScroll}
            >
                <div className={style.GenerateChallanheader}>
                    Fee Refund
                    <span onClick={() => setConcessionDialogOpen(false)}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form>
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

                            <div>
                                <div className={style.studentInfoGrid}>
                                    <label>Select Refund Method - </label>
                                    <div className={style?.inputError}>
                                        <select
                                            className={style.academySelect}
                                            name="ReceiptSeries"
                                            value={refundMethod}
                                            onChange={handleRefundMethodChange}
                                        >
                                            <option value="">Select Refund Method</option>
                                            <option value="headWiseRefund">Head Wise Refund</option>
                                            <option value="refundAdvanceExcess">Refund Advance/Excess Amount</option>
                                        </select>
                                    </div>
                                </div>
                                {refundMethod === 'headWiseRefund' && (
                                    <>

                                        <div className={style.studentInfoGrid}>
                                            <label>Select Receipt - <span style={{ color: "red" }}>*</span></label>
                                            <div className={style?.inputError}>
                                                <select
                                                    className={style.academySelect}
                                                    name="ReceiptSeries"
                                                    value={selectreciept}
                                                    onChange={handlesetselectrecieptChange}
                                                >
                                                    <option value="">Select Receipt</option>
                                                    {
                                                        (noRefundData?.length > 0 ? noRefundData : selectedFeeStructure)?.map((student: { receipt_no: ReactNode; isCancelled: any; _id: any }, index: number) => {
                                                            return (
                                                                <option key={student._id || index} value={student._id} >
                                                                    {student.receipt_no}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </select>

                                                {errors.ReceiptSeries && <span className={style?.fieldError}>{errors.ReceiptSeries}</span>}
                                            </div>
                                        </div>

                                    </>
                                )}
                                {selectreciept && (
                                    <>
                                        <div className={style.studentDetails}>
                                            <div style={{ fontSize: '14px' }}>
                                                <span style={{ marginRight: '10px' }}>
                                                    <FaRupeeSign />
                                                </span>
                                                Payment Details
                                            </div>
                                            <div className={style.studentInfoGrid}>
                                                <div>
                                                    <label>Mode</label>
                                                    <select
                                                        className={style.academySelect}
                                                        name="mode"
                                                        value={PaymentData.mode}
                                                        onChange={Datachangehandel}
                                                    >
                                                        <option value="cash">Cash</option>
                                                        <option value="online">Online</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Bank Account</label>
                                                    <select
                                                        className={style.academySelect}
                                                        name="BankAccount"
                                                        value={PaymentData.BankAccount}
                                                        onChange={Datachangehandel}
                                                    >
                                                        <option value="">Select Bank Account</option>
                                                        <option value="PRINCIPAL CIT 5504">PRINCIPAL CIT 5504</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Payment Date</label>
                                                    <input
                                                        type="date"
                                                        className={style.academySelect}
                                                        name="PaymentDate"
                                                        value={PaymentData.PaymentDate}
                                                        onChange={Datachangehandel}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Transaction Id / Cheque No. / DD No</label>
                                                    <input
                                                        type="text"
                                                        className={style.academySelect}
                                                        name="TransactionId"
                                                        value={PaymentData.TransactionId}
                                                        onChange={Datachangehandel}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Receipt Series</label>
                                                    <select
                                                        className={style.academySelect}
                                                        name="ReceiptSeries"
                                                        value={PaymentData.ReceiptSeries}
                                                        onChange={Datachangehandel}
                                                    >
                                                        <option value="">Select Receipt Series</option>
                                                        {ReceiptSeries?.map((row: any, index: number) => (
                                                            <option value={row?.series_preview} key={index}>{row.series_preview}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Receipt No</label>
                                                    <input
                                                        type="number"
                                                        className={style.academySelect}
                                                        name="ReceiptNo"
                                                        value={PaymentData.ReceiptNo}
                                                        onChange={Datachangehandel}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Refund Amount</label>
                                                    <input
                                                        type="number"
                                                        className={style.academySelect}
                                                        value={totalAmounts}
                                                        onChange={handleAmountChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label>Remarks(If Any)</label>
                                                    <input
                                                        className={style.academySelect}
                                                        name="Remark"
                                                        value={PaymentData.Remark}
                                                        onChange={Datachangehandel}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        {selectedFeeReceipt && (
                                            <table className="receipt-header" style={{ width: "100%" }}>
                                                <tbody>
                                                    <tr>
                                                        <table className={style.detailTable} style={{ width: "100%" }}>
                                                            <thead>
                                                                <tr className={style?.tableHeadingDetail}>
                                                                    <th>Sr. No.</th>
                                                                    <th>Category</th>
                                                                    <th>Head</th>
                                                                    <th>Paid Amount</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(selectedFeeReceipt?.refund?.length > 0 || selectedFeeReceipt?.payment?.length > 0) &&
                                                                    (selectedFeeReceipt?.refund?.length > 0
                                                                        ? selectedFeeReceipt?.refund
                                                                        : selectedFeeReceipt?.payment
                                                                    )
                                                                        ?.filter((item: any) => {
                                                                            // Exclude rows where both remaining_refund and paid_amount are 0
                                                                            return item?.remaining_refund !== 0 || item?.paid_amount !== 0;
                                                                        })
                                                                        .map((data: any, dataIndex: any) => {
                                                                            return (
                                                                                <tr key={dataIndex}>
                                                                                    <td>{dataIndex + 1}</td>
                                                                                    <td>{data?.category_name}</td>
                                                                                    <td>{data?.fee_head_type}</td>
                                                                                    <td>{data?.paid_amount || data?.remaining_refund}</td>
                                                                                    <td>
                                                                                        {refundPayment?.length > 0
                                                                                            ? refundPayment
                                                                                                ?.filter((fee: any) => fee?.paid_amount !== 0)
                                                                                                .map((datas: any) => {
                                                                                                    return (
                                                                                                        <div>
                                                                                                            <p>
                                                                                                                {datas?.category_name ===
                                                                                                                    data?.category_name
                                                                                                                    ? datas?.total_amount
                                                                                                                    : ""}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    );
                                                                                                })
                                                                                            : "0"}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}

                                                            </tbody>
                                                        </table>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        )}
                                    </>


                                )}


                                {refundMethod === 'refundAdvanceExcess' && (
                                    <div className={style.studentDetails}>
                                        <div style={{ fontSize: '14px' }}>
                                            <span style={{ marginRight: '10px' }}>
                                                <FaRupeeSign />
                                            </span>
                                            Payment Details
                                        </div>
                                        <div className={style.studentInfoGrid}>
                                            <div>
                                                <label>Mode</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="mode"
                                                    value={PaymentData.mode}
                                                    onChange={Datachangehandel}
                                                >
                                                    <option value="cash">Cash</option>
                                                    <option value="online">Online</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label>Bank Account</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="BankAccount"
                                                    value={PaymentData.BankAccount}
                                                    onChange={Datachangehandel}
                                                >
                                                    <option value="">Select Bank Account</option>
                                                    <option value="PRINCIPAL CIT 5504">PRINCIPAL CIT 5504</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label>Payment Date</label>
                                                <input
                                                    type="date"
                                                    className={style.academySelect}
                                                    name="PaymentDate"
                                                    value={PaymentData.PaymentDate}
                                                    onChange={Datachangehandel}
                                                />
                                            </div>
                                            <div>
                                                <label>Transaction Id / Cheque No. / DD No</label>
                                                <input
                                                    type="text"
                                                    className={style.academySelect}
                                                    name="TransactionId"
                                                    value={PaymentData.TransactionId}
                                                    onChange={Datachangehandel}
                                                />
                                            </div>
                                            <div>
                                                <label>Receipt Series</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ReceiptSeries"
                                                    value={PaymentData.ReceiptSeries}
                                                    onChange={Datachangehandel}
                                                >
                                                    <option value="">Select Receipt Series</option>
                                                    {ReceiptSeries?.map((row: any, index: number) => (
                                                        <option value={row?.series_preview} key={index}>{row.series_preview}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label>Receipt No</label>
                                                <input
                                                    type="number"
                                                    className={style.academySelect}
                                                    name="ReceiptNo"
                                                    value={PaymentData.ReceiptNo}
                                                    onChange={Datachangehandel}
                                                />
                                            </div>
                                            <div>
                                                <label>Refund Amount</label>
                                                <input
                                                    type="number"
                                                    className={style.academySelect}
                                                    value={totalAmounts}
                                                    onChange={handleAmountChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Remarks(If Any)</label>
                                                <input
                                                    className={style.academySelect}
                                                    name="Remark"
                                                    value={PaymentData.Remark}
                                                    onChange={Datachangehandel}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {apiError && (
                                    <div className="error-message">
                                        <p>{apiError}</p>
                                    </div>
                                )}

                                <div className="mt-3 text-center">
                                    <Button className="button button-primary" onClick={handleRefundClick}>Submit</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </DialogBody >
            </Dialog >
        </div >
    );
};

export default FeeRefund;
