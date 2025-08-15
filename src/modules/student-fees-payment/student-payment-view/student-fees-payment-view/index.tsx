import React, { useEffect, useState } from 'react'
import Table from '../../../../components/table';
import TableHead from '../../../../components/table/tableHead';
import useFeePaymentStore, { createFeePay, FeeCategory, PaymentInput, StudentData } from '../../../../store/feePaymentStore';
import convertDateFormat from '../../../../utils/functions/convert-date-format';
import TableBody from '../../../../components/table/tableBody';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Dialog from '../../../../components/dialog';
import DialogTitle from '../../../../components/dialog/dialog-title';
import DialogBody from '../../../../components/dialog/dialog-body';
import DialogAction from '../../../../components/dialog/dialog-action';
import Button from '../../../../components/button';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import TextField from '../../../../components/textfield';
import style from "../../../../components/textfield/textfield.module.css";
import feestyle from "../student-fees-pay.module.css";
import useFeeStructuresStore from '../../../../store/feeCategoryStore';
import { AiOutlineClose } from "react-icons/ai";



const StudentPaymentTableComponent: React.FC = () => {
    const { id } = useParams();
    // const { categories, getAllCategories, deleteCategory , loading} = useCategoriesStore();   
    const { getFeePayHistory, feePayHistory, createFeePayment, loading } = useFeePaymentStore();
    const { getFeeStructureByStudent, feeStructureStudent } = useFeeStructuresStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFeeCategory, setSelectedFeeCategory] = useState<FeeCategory | null>(null);
    const [selectedFeePayment, setSelectedFeePayment] = useState<FeeCategory | null>(null);
    const [paymentInputs, setPaymentInputs] = useState<PaymentInput[]>([]);
    const [paymentAmount, setPaymentAmount] = useState<PaymentInput[]>([]);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [updatedFees, setUpdatedFees] = useState(selectedFeeCategory?.feeStructure?.fees || []);
    const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
    const [receiptModal, setReceiptModal] = useState(false);
    const [receiptData, setReceiptData] = useState<PaymentInput[]>([]);
    const [studentData, setStudentData] = useState<StudentData>();

    const fullNameStudent = `${studentData?.firstName} ${studentData?.middleName} ${studentData?.lastName}`.trim();


    useEffect(() => {
        if (selectedFeeCategory?.feeStructure?.fees && selectedFeeCategory?.feeStructure?.fees?.length > 0) {
            setUpdatedFees(selectedFeeCategory?.feeStructure?.fees)
        }
    }, [selectedFeeCategory?.feeStructure?.fees])

    const handleRemoveCategory = (categoryName: string) => {
        const filteredFees = selectedFeeCategory?.feeStructure?.fees.filter(fee => fee.category_name !== categoryName) || [];
        setUpdatedFees(filteredFees);

    };

    function getSelectedStudentData(feePayHistory: any, studentId: string) {
        for (const record of feePayHistory) {
            if (record.student._id === studentId) {
                setStudentData(record.student)
                return {
                    student: record.student,
                    feeStructures: record.feeStructures
                };
            }
        }
        return null; // Return null if no match is found
    }


    useEffect(() => {
        if (feePayHistory && id) {
            getSelectedStudentData(feePayHistory, id);

        }
    }, [feePayHistory, id])

    useEffect(() => {
        if (id) {
            getFeeStructureByStudent({ studentId: id });
        }
    }, [id])

    const handleInputChange = (categoryName: string, value: string) => {
        let numericValue = parseFloat(value.replace(/[+-]/g, ''));

        numericValue = isNaN(numericValue) || numericValue < 0 ? 0 : numericValue;

        setPaymentInputs((prevState) => {
            const existingValues = prevState.find(item => item.categoryName === categoryName);
            return existingValues
                ? prevState.map(item =>
                    item.categoryName === categoryName
                        ? { ...item, amount: numericValue }
                        : item
                )
                : [...prevState, { categoryName, amount: numericValue }];
        });
        setPaymentAmount((prevState) => {
            const existingValues = prevState.find(item => item.categoryName === categoryName);
            return existingValues
                ? prevState.map(item =>
                    item.categoryName === categoryName
                        ? { ...item, amount: numericValue }
                        : item
                )
                : [...prevState, { categoryName, amount: numericValue }];
        });
        setValidationErrors(prevErrors => {
            const { [categoryName]: _, ...remainingErrors } = prevErrors;
            return remainingErrors;
        });
    };

    const validateInputs = () => {
        const errors: { [key: string]: string } = {};

        updatedFees?.forEach((fee) => {
            const paymentHistory = selectedFeeCategory?.paymentHistories?.find(
                history => history.category_name === fee.category_name
            );

            const remainingBalance = paymentHistory?.remaining_balance ?? fee.amount;

            // Only validate if remaining_balance is greater than 0
            if (remainingBalance > 0) {
                const input = paymentInputs.find(input => input.categoryName === fee.category_name);
                if (!input || input.amount <= 0) {
                    errors[fee.category_name] = 'This field is required and must be greater than 0';
                }
            }
        });

        setValidationErrors(errors);

        // Return true if no errors, otherwise false
        return Object.keys(errors).length === 0;
    };


    const totalAmount = paymentInputs.reduce((total, item) => total + item.amount, 0);
    const totalAmountReceip = receiptData.reduce((total, item) => total + item.amount, 0);
    const totalAmountPayment = Array.isArray(selectedFeePayment?.paymentHistories) && selectedFeePayment?.paymentHistories.reduce((total, item) => total + item.amount_paid, 0);

    
    const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null); // State to manage expanded row

    useEffect(() => {
        getFeePayHistory();
    }, []);


    const tableHead: string[] = [
        "SL NO.",
        "FEES STRUCTURE NAME",
        "FEE DETAILS",
        "TOTAL FEE",
        "CREATED AT",
        "PAYMENT",
        "RECEIPT",
    ];
    const tableHeadReceip: string[] = [
        "SL NO.",
        "CATEGORY NAME",
        "AMOUNT",

    ];

    const hasPaymentHistories = Array.isArray(feeStructureStudent) && feeStructureStudent?.some(
        (feeCategory: FeeCategory) => Array.isArray(feeCategory.paymentHistories) && feeCategory.paymentHistories.length > 0
    );

    if (hasPaymentHistories) {
        tableHead.push("");
    }

    const handlePaymentClick = (feeCategory: FeeCategory) => {
        setSelectedFeeCategory(feeCategory);
        setDialogOpen(true);
    };
    const handleReceipModal = (feeCategory: FeeCategory) => {
        setSelectedFeePayment(feeCategory);
    };

    const closeDialog = () => {

        setDialogOpen(false);
        setSelectedFeeCategory(null);
        setPaymentInputs([])

    };



    const handleSelectFeeStructure = (feeCategory: FeeCategory, feeStructureId: string) => {
        setSelectedFeePayment(feeCategory)
        setExpandedStudentId(expandedStudentId === feeStructureId ? null : feeStructureId); // Toggle expanded state
    };

    const onSubmit = async () => {
        if (!selectedFeeCategory) return;
        if (!validateInputs()) return;

        const values: createFeePay = {
            feeStructureId: selectedFeeCategory?.feeStructure?._id,
            studentId: String(id),
            payments: paymentInputs || []
        };

        const res = await createFeePayment(values);

        if (res) {
            await getFeePayHistory();
            await getFeeStructureByStudent({ studentId: id });
            setDialogOpen(false);
            setPaymentInputs([])
            setReceiptData(paymentAmount);
            setReceiptDialogOpen(true);
        }
    };



    const tableBody = Array.isArray(feeStructureStudent) && feeStructureStudent?.map((feeCategory: FeeCategory, index: number) => {
        const isExpanded = expandedStudentId === feeCategory?.feeStructure?._id;

        return (
            <>
                {/* <tr key={index} onClick={() => handleSelectFeeStructure(feeCategory, feeCategory?.feeStructure?._id)}> */}
                <tr key={index} >
                    <td>{index + 1}</td>

                    <td>{feeCategory?.feeStructure?.fee_structure_name}</td>
                    <td>
                        <ul style={{ paddingLeft: "20px" }}>
                            {feeCategory?.feeStructure?.fees?.map((fee, feeIndex) => (
                                <li key={feeIndex}>
                                    <strong>{fee?.category_name}</strong>: {fee?.amount} ({fee?.duration_type})
                                    <br />
                                    Mandatory: {fee?.is_mandatory ? "Yes" : "No"}
                                    <br />
                                    Applicable Year: {fee?.applicable_semesters?.join(", ")}
                                </li>
                            ))}
                        </ul>
                    </td>
                    <td>{feeCategory?.feeStructure?.total_fee}</td>

                    <td>{convertDateFormat(feeCategory?.feeStructure?.createdAt)}</td>
                    <td>
                        {feeCategory?.status?.toLowerCase() === "paid" ?

                            <span>Payment Done</span>
                            :

                            <Button onClick={() => handlePaymentClick(feeCategory)}>Payment</Button>
                        }
                    </td>
                    <td>
                        <Button onClick={() => {

                            handleReceipModal(feeCategory)
                            setReceiptModal(true);
                            setReceiptDialogOpen(true)
                        }}> Receipt </Button>
                    </td>
                    {feeCategory?.paymentHistories && feeCategory?.paymentHistories?.length > 0 &&
                        <td onClick={() => handleSelectFeeStructure(feeCategory, feeCategory?.feeStructure?._id)}>

                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </td>
                    }
                </tr>
                {isExpanded && selectedFeePayment?.paymentHistories && (
                    <tr>
                        <td colSpan={6}>
                            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th>SL NO.</th>
                                        <th>Category Name</th>
                                        <th>Amount Paid</th>
                                        <th>Remain Amount</th>
                                        <th>Payment Date</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedFeePayment?.paymentHistories.map((payment: any, index: number) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>

                                            <td>{payment?.category_name}</td>
                                            <td>{payment?.amount_paid}</td>
                                            <td>{payment?.remaining_balance}</td>
                                            <td>{convertDateFormat(payment?.payment_date)}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                )}
            </>
        )
    });
    const tableBodyReceip = Array.isArray(receiptData) && receiptData?.map((payment: any, index: number) => {
        return (
            <>

                <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{payment?.categoryName}</td>
                    <td>{payment?.amount}</td>

                </tr>

            </>
        )
    })

    const tableBodyPaymentHistory = Array.isArray(selectedFeePayment?.paymentHistories) && selectedFeePayment?.paymentHistories.map((payment: any, index: number) => {

        return (
            <>

                <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{payment?.category_name}</td>
                    <td>{payment?.amount_paid}</td>


                </tr>

            </>
        )
    })




    return (
        <div>
            {/* <Table loading={loading}> */}
            <Table loading={loading}>
                <TableHead tableHead={tableHead} />
                <TableBody tableBody={tableBody} />
            </Table>
            <Dialog isOpen={dialogOpen} onClose={closeDialog}>
                <DialogTitle onClose={closeDialog}>Payment Confirmation</DialogTitle>
                <DialogBody>
                    {selectedFeeCategory ? (
                        <div>
                            <p className={`${feestyle?.paymentDetails}`}><strong>Fee Structure:</strong> {selectedFeeCategory?.feeStructure?.fee_structure_name}</p>
                            <p className={`${feestyle?.paymentDetails}`}><strong>Total Fee:</strong> {selectedFeeCategory?.feeStructure?.total_fee}</p>
                            <p className={`${feestyle?.paymentDetails}`}><strong>Created At:</strong> {convertDateFormat(selectedFeeCategory?.feeStructure?.createdAt)}</p>

                            {updatedFees?.map((datafee, index) => {
                                const paymentHistory = selectedFeeCategory?.paymentHistories?.find(
                                    history => history.category_name === datafee.category_name
                                );

                                const displayAmount = paymentHistory?.remaining_balance !== undefined
                                    ? paymentHistory.remaining_balance
                                    : datafee.amount;

                                if (paymentHistory?.remaining_balance === 0) {
                                    return null;
                                }

                                return (
                                    <div className={`${feestyle?.formCategory}`} key={index}>
                                        <p style={{ textTransform: "capitalize" }}><strong>{datafee.category_name}</strong>: {displayAmount}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                                            <div >
                                                <input
                                                    type="number"
                                                    min="0"
                                                    onChange={(e) => handleInputChange(datafee.category_name, e.target.value)}
                                                    value={paymentInputs.find(input => input.categoryName === datafee.category_name)?.amount || ''}
                                                    placeholder="Enter payment amount"
                                                    className={`${style.textInput}`}
                                                />
                                                {validationErrors[datafee.category_name] && (
                                                    <p style={{ color: 'red', fontSize: '12px' }}>
                                                        {validationErrors[datafee.category_name]}
                                                    </p>
                                                )}
                                            </div>
                                            <div onClick={() => handleRemoveCategory(datafee.category_name)} style={{ marginLeft: '10px' }}>
                                                <AiOutlineClose />


                                            </div>
                                        </div>

                                    </div>
                                );
                            })}


                            <div style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'right' }}>
                                Total: {totalAmount}
                            </div>
                        </div>
                    ) : null}
                </DialogBody>
                <DialogAction>
                    <Button secondary onClick={closeDialog}>Close</Button>
                    <Button onClick={() => onSubmit()}>
                        {/* <Button> */}
                        Proceed to Payment
                    </Button>
                </DialogAction>
            </Dialog>
            <Dialog isOpen={receiptDialogOpen} onClose={() => {
                setReceiptModal(false);
                setReceiptDialogOpen(false)
            }}>
                <DialogTitle onClose={() => {
                    setReceiptModal(false);

                    setReceiptDialogOpen(false)
                }}>Payment Receipt</DialogTitle>
                <DialogBody>

                    <div className={`${feestyle?.studentInfoContainer}`}>
                        <h2 className={`${feestyle?.studentInfoTitle}`}>Student Information</h2>
                        <div className={`${feestyle?.studentInfoGrid}`}>
                            <div>
                                <strong>Student Name:</strong> {fullNameStudent}
                            </div>
                            <div>
                                <strong>Student ID:</strong> {studentData?.admissionNumber}
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date().toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Program:</strong> {studentData?.department?.name}
                            </div>
                            <div>
                                <strong>Father's Name:</strong> {studentData?.fatherFullName}
                            </div>
                            <div>
                                <strong>FeeStructure Category:</strong> {studentData?.feeStructure}
                            </div>
                            <div>
                                <strong>Email:</strong> {studentData?.email}
                            </div>
                            <div>
                                <strong>Contact Number:</strong> {studentData?.contactNumber}
                            </div>
                            <div>
                                <strong>Admission Semester:</strong> {studentData?.admissionSemester}
                            </div>
                            <div>
                                <strong>Admission Status:</strong> {studentData?.admissionStatus}
                            </div>
                            <div>
                                <strong>Admission Type:</strong> {studentData?.admissionType}
                            </div>

                            <div>
                                <strong>Caste:</strong> {studentData?.caste}
                            </div>
                            <div>
                                <strong>Gender:</strong> {studentData?.gender}
                            </div>
                        </div>
                    </div>
                    <div style={{ margin: "16px 0" }}>

                        <h3 style={{ marginBottom: "8px" }}>Student Fee Details</h3>

                        <Table loading={loading}>
                            <TableHead tableHead={tableHeadReceip} />
                            <TableBody tableBody={receiptModal ? tableBodyPaymentHistory : tableBodyReceip} />
                        </Table>
                    </div>


                    <div style={{ marginTop: "16px", display: 'flex', justifyContent: 'end' }}>
                        <div>
                            <div style={{ marginBottom: "8px" }}>
                                <label>Grand Total:</label> {' '}
                                <span>{receiptModal ? totalAmountPayment : totalAmountReceip}</span>
                            </div>
                            <div>
                                <label>Outstanding Amount:</label> {' '}
                                <span>{receiptModal ? totalAmountPayment : totalAmountReceip}</span>
                            </div>
                        </div>
                    </div>

                </DialogBody>
                <DialogAction>
                    <Button secondary onClick={() => {
                        setReceiptModal(false);
                        setReceiptDialogOpen(false)
                    }}>Close</Button>

                    <Button onClick={() => setReceiptDialogOpen(false)}>Download Receipt</Button>
                </DialogAction>
            </Dialog>
        </div>
    )
}

export default StudentPaymentTableComponent