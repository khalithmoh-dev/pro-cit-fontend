import React, { useState, useEffect } from 'react';
import style from './quick.module.css';
import { FaPrint, FaUserCheck } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import CollectAcademicDialog from '../collect-academic-dialog';
import { StudentQuickCollect } from '../../../store/quickCollectStore';
import ConcessionDialog from '../add-concession-dialog';
import { MdModeEditOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import UpdateChallanDialog from '../update-challan-dialog';
import useFeeCategoryStore from "../../../store/feeCategoryStore";
import Generatechallandialog from '../generate-challan-dialog';
import FeeRefund from '../FeeRefund';
import Transportdialog from '../transport-dialog';
import ModifydeparmentStructureDialog from '../modify-deparment-dialog';
import useQuickCollectStore from "../../../store/quickCollectStore"
import Assignfeestructure from '../assign-fee-structure';
import ModifyfeeStructureDialog from '../modify-fee-structure';
import paymentfeestore from '../../../store/paymentfeestore';
import { FcCancel } from "react-icons/fc";
import FeeReceipt from '../feeReceipt';
import RefundReceipt from '../refundReceipt';





const QuickCollectListPage: React.FC = () => {
    const [showTable, setShowTable] = useState(false);
    const [selectedStudent, setSelectedStudent]: any = useState<StudentQuickCollect | null>(null);
    const { getFeeStructures } = useFeeCategoryStore();
    const { students, getallstudent }: any = useQuickCollectStore();

    const [academicYears, setAcademicYears] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>(''); // Store the selected option
    const [selectedFees, setSelectedFees] = useState()
    useEffect(() => {
        const allAcademicYears = students?.map((student: any) => {
            return student.feeStructures?.map((feeStructure: any) => feeStructure?.academicYear);
        }).flat();  // Flattening the array if needed

        setAcademicYears(allAcademicYears);
    }, [students]);

    useEffect(() => {
        getFeeStructures();
    }, []);



    // const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === 'Enter') {
    //         setShowTable(true);
    //     }
    // };

    const openDetails = (student: StudentQuickCollect) => {
        setSelectedStudent(student);
        setShowTable(false);
    };

    const closeDetails = () => {
        setSelectedStudent(null);
        setShowTable(true);
    };


    // const [academicDialogOpen, setacademicDialogOpen] = useState(false);
    // const [ConcessionDialogOpen, setConcessionDialogOpen] = useState(false);
    // const [selectedValue, setSelectedValue] = useState("");
    const [activeDialog, setActiveDialog] = useState<string>("");

    const openDialogs = ["academic", "facilities", "transport", "hostel", "other"];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail]: any = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [admissionNumber, setAddmissionNumber] = useState('');
    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            getallstudent({
                firstName,
                lastName,
                email,
                contactNumber,
                admissionNumber

            });
            setShowTable(true);
        }
    };

    const [selectedRefundId, setSelectedRefundId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedrefund, setSelectedrefund]: any = useState(null);
    const [selectedFeeStructureId, setSelectedFeeStructureId]: any = useState(null);
    const [selectedFeeId, setSelectedFeeId]: any = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);


    const handleAddConcession = (feeStructureId: any, _id: any) => {
        setSelectedFeeStructureId(feeStructureId);
        setSelectedFeeId(_id);
        setActiveDialog("concession"); // Show the concession dialog
    };

    const handleAddChallan = (feeStructureId: any, _id: any) => {
        setSelectedFeeStructureId(feeStructureId);
        setSelectedFeeId(_id);
        setActiveDialog("Generatechallan"); // Show the concession dialog
    };

    const handleUpdateChallan = (feeStructureId: any, _id: any) => {
        setSelectedFeeStructureId(feeStructureId);
        setSelectedFeeId(_id);
        setActiveDialog("UpdateChallan"); // Show the concession dialog
    };
    const handleRefundfee = (_id: any) => {

        setSelectedrefund(_id);
        setActiveDialog("FeeRefund"); // Show the concession dialog
    };


    const handleReceiptChallan = (_id: any) => {
        setSelectedId(_id);
        setActiveDialog("FeeReceipt"); // Show the concession dialog
    };

    const handleRefundChallan = (_id: any) => {
        setSelectedRefundId(_id);
        setActiveDialog("RefundReceipt"); // Show the concession dialog
    };
    const handleSelectChange =
        (fees: any, id: string, _id: any, date: any) =>
            (event: React.ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;

                setSelectedFees(fees); // Sets the selected fees.
                setActiveDialog(value); // Updates the active dialog type.
                setSelectedFeeStructureId(id);
                setSelectedYear(date) // Updates the selected fee structure ID.
            };
    const [studentId, setStudentId]: any = useState(null);
    const [feeStructureId, setFeeStructureId]: any = useState(null);
    const { getFeePayment, selectedFeeStructure, selectedRedundStructure, getRedundPayment, getChallanData, challanData }: any = paymentfeestore.getState();
    useEffect(() => {
        const fetchData = async () => {

            try {
                if (studentId && feeStructureId) {
                    await getFeePayment(studentId, feeStructureId);
                }
                await getRedundPayment(studentId, feeStructureId);
                await getChallanData(studentId, feeStructureId);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setLoading(false); // Set loading to false once all APIs are called
            }
        };

        fetchData();
    }, [studentId, feeStructureId, getFeePayment, getRedundPayment, getChallanData]);
    useEffect(() => {
        if (students && students.length > 0) {
            const student = students[0];
            const feeStructure = student?.feeStructures?.[0];

            if (feeStructure) {
                setFeeStructureId(feeStructure?.feeStructureId?._id);
            }

            setStudentId(student._id);
        }
    }, [students]);

    useEffect(() => {
        if (studentId && feeStructureId && selectedFeeStructureId) {
            // selectedFeeStructure()
            getRedundPayment(studentId)

            getChallanData(studentId, selectedFeeStructureId);

            getFeePayment(studentId, feeStructureId);
        }
    }, [studentId, feeStructureId, selectedFeeStructureId]);

    const handleDelete = async (paymentId: string) => {
        const success = await paymentfeestore.getState().deleteFeePayment(paymentId, studentId, feeStructureId);
        if (success) {
            console.log("Payment deleted successfully!");
        } else {
            console.log("Failed to delete payment.");
        }
    };

    const handleRefundDelete = async (studentId: string) => {
        const success = await paymentfeestore.getState().deleteFeeRefund(studentId);
        if (success) {
            console.log("Payment deleted successfully!");
        } else {
            console.log("Failed to delete payment.");
        }
    };

    const handlechallenDelete = async (paymentId: string) => {
        const success = await paymentfeestore.getState().deleteChallen(paymentId, studentId, feeStructureId);
        if (success) {
            console.log("Payment deleted successfully!");
        } else {
            console.log("Failed to delete payment.");
        }
    };


    const filteredStudents = students.filter((student: StudentQuickCollect) => {
        const admissionNumberStr = student.admissionNumber ? student.admissionNumber.toString().toLowerCase() : '';
        const contactNumberStr = student.contactNumber ? student.contactNumber.toString() : '';
        return (
            (firstName === '' || student.firstName?.toLowerCase().includes(firstName.toLowerCase())) &&
            (lastName === '' || student.lastName?.toLowerCase().includes(lastName.toLowerCase())) &&
            (email === '' || student.email?.toLowerCase().includes(email.toLowerCase())) &&
            (contactNumber === '' || contactNumberStr?.toLowerCase().includes(contactNumber)) &&
            (admissionNumber === '' || admissionNumberStr?.toLowerCase().includes(admissionNumber.toLowerCase()))
        );
    });

    const findExcessAmount = selectedFeeStructure?.find((item: any) => item?.student_id?._id === studentId)

    return (
        <div className={style.container}>
            <div className={style.tableName}>Quick Collect</div>

            <div className={style.mainContainer}>
                <select className={style.select}>
                    <option value="Coorg Institute of Technology" selected>Coorg Institute of Technology</option>
                </select>

                <div
                // style={{ display: "flex", flexDirection:'column' , gap: '4px' , width:'100vh'}}
                >
                    <div className={style?.studentData} >
                        <input type="text" onKeyPress={handleKeyPress} className={style.formInput} placeholder='Student ERP Id' />
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="First Name"
                            className={style.formInput}
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Last Name"
                            className={style.formInput}
                        />
                        <input
                            type="text"
                            className={style.formInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Contact Number"
                            className={style.formInput}
                        />
                    </div>

                    <div className={style?.studentData2}>
                        <select className={style.select} style={{ width: '100%' }}>
                            <option value="" selected>Select GRN Series</option>
                            <option value="355">23UGME20163</option>
                        </select>
                        <input type="text" onKeyPress={handleKeyPress} className={style.formInput} placeholder='Student GRN Number' />
                        <select className={style.select}>
                            <option value="" selected>Select Admission Series</option>
                        </select>
                        <input value={admissionNumber}
                            onChange={(e) => setAddmissionNumber(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className={style.formInput} placeholder='Admission Number' />

                        <input type="text" onKeyPress={handleKeyPress} className={style.formInput} placeholder='PRN / University Number' />
                    </div>
                </div>
            </div>

            {!showTable && !selectedStudent && <p>Enter student details in search field and press <b>ENTER</b> to view student payment details</p>}

            {showTable && (
                <div className={style.tableContainer}>
                    <table className={style.table}>
                        <thead>
                            <tr style={{ fontSize: "14px" }}>
                                <th>Student ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Father Name</th>
                                <th>Mother Name</th>
                                <th>Stream</th>
                                <th>Group</th>
                                <th>Admission Number</th>
                                <th>Contact</th>

                                <th>(USN) Number</th>
                                <th>Access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student: StudentQuickCollect, index: React.Key | null | undefined) => (
                                <tr key={index} style={{ fontSize: "14px" }}>
                                    <td>{student?.usnNumber}</td>
                                    <td>{student?.firstName}</td>
                                    <td>{student?.lastName}</td>
                                    <td>{student?.fatherFullName}</td>
                                    <td>{student?.motherName}</td>
                                    <td>{student?.department?.name}</td>
                                    <td>{student?.semester}</td>
                                    <td>{student?.admissionNumber}</td>
                                    <td>{student?.contactNumber}</td>
                                    <td>{student?.usnNumber}</td>
                                    <td>
                                        <span
                                            className={style.openLink}
                                            onClick={() => openDetails(student)}
                                        >
                                            Open
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>Click on student to get its payment details.</p>
                </div>
            )}

            {selectedStudent && (
                <div className={style.detailContainer}>
                    <button onClick={closeDetails} className={style.closeButton}>Close</button>

                    <div className={style.studentDetails}>
                        <h3>Details for {selectedStudent?.firstName} {selectedStudent?.lastName}</h3>
                        <table className={style.studentDetailsTable}>
                            <tbody>
                                <tr style={{ fontSize: "14px" }}>
                                    <td>Student ID <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.id}</span></td>
                                    <td>Name <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.firstName?.toUpperCase()} {selectedStudent?.lastName.toUpperCase()}</span></td>
                                    <td>Father Name <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.fatherFullName?.toUpperCase()}</span></td>
                                    <td>Mother Name <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.motherName.toUpperCase()}</span></td>
                                    <td>Admission Category <span></span></td>
                                    <td>Payment Category <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.balanceAmount}</span></td>
                                </tr>
                                <tr style={{ fontSize: "14px" }}>
                                    <td>Admission Type <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.admissionType}</span></td>
                                    <td>Admission Year <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.yearOfAdmission} | 2024 </span></td>
                                    <td>GRN <span></span></td>
                                    <td>PRN <span></span></td>
                                    <td>Admission Number <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.admissionNumber}</span></td>
                                    <td>Contact <span className={style?.year} style={{ fontWeight: "600" }}>{selectedStudent?.contactNumber} | {selectedStudent?.email}</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ padding: "12px 0px" }}>


                            <div style={{ display: "flex", flexWrap: "wrap", margin: "15px 0px" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", margin: "15px 0px" }}>
                                    {selectedStudent?.feeStructures?.length > 0 ? (
                                        selectedStudent?.feeStructures?.flatMap((item: any, fsIndex: any) => {
                                            const totalPaid = item?.feeBalanceId?.balance?.reduce((sum: any, fee: any) => sum + (fee?.paid_amount || 0), 0) || 0;
                                            const totalAmount = item?.feeStructureId?.fees?.reduce((sum: any, fee: any) => sum + (fee?.amount || 0), 0) || 0;

                                            return (
                                                <React.Fragment key={fsIndex}>
                                                    <div className={style?.yearTotalamout}>
                                                        <span className={style?.year}>
                                                            {item?.academicYear} :-
                                                            <span style={{ fontWeight: "normal" }}>
                                                                {totalPaid}/{totalAmount}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        ""
                                    )}

                                </div>
                            </div>
                            <div style={{ display: "flex", marginTop: "20px" }}>
                                {/* Calculate the total balance amount once */}
                                <div className={style?.yearTotalamout}>
                                    <span className={style?.year}>
                                        Total Balance Amount :-
                                        <span style={{ fontWeight: "normal" }}>
                                            {students?.reduce((total: number, student: { feeStructures: any[] }, index: number) => {
                                                return total + (Array.isArray(student?.feeStructures)
                                                    ? student?.feeStructures.reduce((subTotal: number, feeStructure: { feeStructureId: { fees: any[] } }) => {
                                                        return subTotal + (feeStructure?.feeStructureId?.fees
                                                            ? feeStructure?.feeStructureId?.fees.reduce((feeTotal: number, fee: { amount: string }) => feeTotal + parseFloat(fee.amount), 0)
                                                            : 0);
                                                    }, 0)
                                                    : 0);
                                            }, 0).toFixed(2)}
                                        </span>
                                    </span>
                                </div>
                                <div className={style?.yearTotalamout}>
                                    <span className={style?.year}>
                                        Total Excess Amount :- {findExcessAmount?.excess_amount}

                                        {/* {students.map((student: StudentQuickCollect, index: React.Key | null | undefined) => (
                                            <div>
                                                <span style={{ fontWeight: "normal" }}> {student?.excess_amount}</span>
                                            </div>
                                        ))} */}
                                    </span>
                                </div>
                                <div style={{ marginLeft: "10px" }}>
                                    {selectedStudent?.feeStructures?.length === 0 ? (
                                        <button
                                            className={style.AssignFeeStructure}
                                            onClick={() => setActiveDialog('AssignFeeStructure')}
                                        >
                                            <FaUserCheck size={16} /> Assign Fee Structure
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                        </div>
                        {/* {students?.map((student: { feeStructures: any[]; }, index: React.Key | null | undefined) => ( */}
                        <React.Fragment>
                            {Array.isArray(selectedStudent?.feeStructures) &&
                                selectedStudent?.feeStructures.map((feeStructure: any, fsIndex: any) => {

                                    return (
                                        <div>
                                            <h4 className={style.yearHead}>
                                                Academic Year  {feeStructure?.academicYear}
                                                <button className={style.AssignFeeStructure} onClick={() => setActiveDialog('AssignFeeStructure')}><FaUserCheck size={16} /> Assign Fee Structure </button>
                                            </h4>
                                            <>
                                                <table className={style.detailTable}>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={6}>
                                                                | 2023-24-Computer Science & Engineering--Mgmt KOD A-2022-23(REGULAR) (Computer Science & Engineering - SEM V) (academic)
                                                            </th>
                                                            <th>
                                                                <select className={style?.selectAction} defaultValue=""
                                                                    onChange={handleSelectChange(
                                                                        feeStructure?.feeStructureId?.fees,
                                                                        feeStructure?.feeStructureId?._id,
                                                                        feeStructure?.feeStructureId,
                                                                        feeStructure?.academicYear
                                                                    )}
                                                                >
                                                                    <option value="" selected>Select Action</option>
                                                                    <option value="modify_department">Modify Department/Semester</option>
                                                                    <option value="modifyFeeStructure">Modify Assigned Fee Structure</option>
                                                                </select>
                                                            </th>
                                                        </tr>
                                                        <tr className={style?.tableHeadingDetail}>
                                                            <th>Head Type</th>
                                                            <th>Facility</th>
                                                            <th>Head Name</th>
                                                            <th>Total Amount</th>
                                                            <th>Concession (In Rs.)</th>
                                                            <th>Paid Amount</th>
                                                            <th>Balance Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <React.Fragment key={fsIndex}>

                                                            {Array.isArray(feeStructure?.feeStructureId?.fees) &&
                                                                feeStructure?.feeStructureId?.fees.map((fee: { fee_head_type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; category_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; _id: any; }, feeIndex: React.Key | null | undefined) => (

                                                                    <tr key={feeIndex}>
                                                                        <td>{fee.fee_head_type}</td>
                                                                        <td>{feeStructure?.feeStructureId?.facility}</td>
                                                                        <td>{fee.category_name}</td>
                                                                        <td>{fee.amount}</td>
                                                                        <td>
                                                                            {feeStructure?.concessionId && feeStructure?.concessionId.length > 0 ? (
                                                                                feeStructure?.concessionId
                                                                                    .filter((concession: { fee_category_id: any; }) => concession.fee_category_id === fee._id)
                                                                                    .length > 0 ? (
                                                                                    feeStructure?.concessionId
                                                                                        .filter((concession: { fee_category_id: any; }) => concession.fee_category_id === fee._id)
                                                                                        .map((concession: { total_concession_amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, idx: React.Key | null | undefined) => (
                                                                                            <div key={idx}>
                                                                                                <p>{concession.total_concession_amount}</p>
                                                                                            </div>
                                                                                        ))
                                                                                ) : (

                                                                                    <button
                                                                                        className={style?.addConcession}
                                                                                        onClick={() => handleAddConcession(feeStructure?.feeStructureId?._id, fee?._id)}
                                                                                    >
                                                                                        Add Concession
                                                                                    </button>

                                                                                )
                                                                            ) : (

                                                                                <button
                                                                                    className={style?.addConcession}
                                                                                    onClick={() => handleAddConcession(feeStructure?.feeStructureId?._id, fee?._id)}
                                                                                >
                                                                                    Add Concession
                                                                                </button>

                                                                            )}

                                                                        </td>
                                                                        <td>
                                                                            {feeStructure?.feeBalanceId?.balance?.length > 0 ? (
                                                                                feeStructure?.feeBalanceId?.balance.some((data: any) => data?.category_name === fee?.category_name) ? (
                                                                                    feeStructure?.feeBalanceId?.balance
                                                                                        .filter((data: any) => data?.category_name === fee?.category_name)
                                                                                        .map((data: any, dataIndex: number) => {
                                                                                            return (
                                                                                                <div>
                                                                                                    <p>{data?.paid_amount}</p>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                ) : (
                                                                                    <div>
                                                                                        <p>0</p> {/* Default value for missing category */}
                                                                                    </div>
                                                                                )
                                                                            ) : (
                                                                                <div>
                                                                                    <p>{0}</p>
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {feeStructure?.feeBalanceId?.balance?.length > 0 ? (
                                                                                feeStructure?.feeBalanceId?.balance.some((data: any) => data?.category_name === fee?.category_name) ? (
                                                                                    feeStructure?.feeBalanceId?.balance
                                                                                        .filter((data: any) => data?.category_name === fee?.category_name)
                                                                                        .map((data: any, dataIndex: number) => (
                                                                                            <div key={dataIndex}>
                                                                                                <p>{data?.remaining_amount ?? fee?.amount}</p>
                                                                                            </div>
                                                                                        ))
                                                                                ) : (
                                                                                    <div>
                                                                                        <p>{fee?.amount ?? "0"}</p> {/* Default value for missing category */}
                                                                                    </div>
                                                                                )
                                                                            ) : (
                                                                                <div>
                                                                                    <p>{fee?.amount ?? "0"}</p>
                                                                                </div>
                                                                            )}

                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </React.Fragment>

                                                    </tbody>
                                                </table>
                                                <>
                                                    <table className={style.detailTable}>
                                                        <thead>
                                                            <tr>
                                                                <td colSpan={9}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ fontSize: "14px", fontWeight: 600 }}>Fee Collect</span>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <select
                                                                                style={{ fontSize: "14px", color: "#0465ac", fontWeight: 600 }}
                                                                                onChange={handleSelectChange(feeStructure?.feeStructureId?.fees, feeStructure?.feeStructureId?._id, feeStructure?.feeStructureId, feeStructure?.academicYear)}
                                                                                value={selectedOption}
                                                                                defaultValue=""
                                                                            >
                                                                                <option value="">Collect Payment</option>
                                                                                <option value="facilities">For All Facilities</option>
                                                                                <option value="academic">Academic</option>
                                                                                <option value="transport">Transport</option>
                                                                                <option value="hostel">Hostel</option>
                                                                                <option value="other">Other</option>
                                                                            </select>
                                                                            <span style={{ color: '#0465ac', marginLeft: '10px' }}>|</span>
                                                                            <div style={{ fontSize: "14px", fontWeight: 600, color: '#0465ac' }} onClick={() => handleRefundfee(feeStructure?.feeStructureId?._id,)}>
                                                                                <IoIosAdd /> Refund Payment
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td></td>
                                                                <td colSpan={5}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ fontSize: "14px", fontWeight: 600 }}>Fee Challan</span>
                                                                        <div className={style?.feeUpdate}>
                                                                            {Array.isArray(feeStructure?.feeStructureId?.fees) && feeStructure?.feeStructureId?.fees.length > 0 && (
                                                                                <tr key={feeStructure?.feeStructureId?._id}>
                                                                                    <span onClick={() => handleUpdateChallan(feeStructure?.feeStructureId?._id, feeStructure?.feeStructureId?.fees[0]?._id)}>
                                                                                        <MdModeEditOutline size={16} /> Update Challan
                                                                                    </span>
                                                                                    <span onClick={() => handleAddChallan(feeStructure?.feeStructureId?._id, feeStructure?.feeStructureId?.fees[0]?._id)}>
                                                                                        <FaPlus size={16} /> Generate Challan
                                                                                    </span>
                                                                                </tr>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr className={style?.tableHeadingDetail}>
                                                                <th>Receipt Number</th>
                                                                <th>Payment Date</th>
                                                                <th>Receipt Amount</th>
                                                                <th>Fee/Scholarship Amount</th>
                                                                <th>Excess/Advance</th>
                                                                <th>Refund</th>
                                                                <th>Previous Consumed</th>
                                                                <th>Fine Amount</th>
                                                                <th>Action</th>
                                                                <th></th>
                                                                <tr>
                                                                    <th>Challan Number</th>
                                                                    <th>Challan Date</th>
                                                                    <th>Amount</th>
                                                                    <th>Status</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {selectedFeeStructure
                                                                ?.filter((item: any) => item?.student_id?._id === studentId)
                                                                ?.filter((item: any) => item?.fee_structure_id?._id === feeStructureId)
                                                                ?.map((student: any) => {
                                                                    const isCancelled = student?.isCancelled;
                                                                    if (isCancelled) return null;  // Skip canceled records

                                                                    const paymentDate = new Date(student?.payment_date);
                                                                    const getDayWithSuffix = (day: number) => {
                                                                        const suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
                                                                            (day === 2 || day === 22) ? 'nd' :
                                                                                (day === 3 || day === 23) ? 'rd' : 'th';
                                                                        return day + suffix;
                                                                    };

                                                                    const formattedDate = paymentDate && !isNaN(paymentDate.getTime())
                                                                        ? `${paymentDate.toLocaleString('en-US', { weekday: 'short' })}, ${getDayWithSuffix(paymentDate.getDate())} ${paymentDate.toLocaleString('en-US', { month: 'short' })}, ${paymentDate.getFullYear()}`
                                                                        : "NA";

                                                                    // Ensure student.amount and student.receipt_no are valid
                                                                    const amount = student?.amount ?? 'NA';
                                                                    const receiptNo = student?.receipt_no ?? 'NA';

                                                                    return (
                                                                        !isCancelled && (
                                                                            <React.Fragment key={student._id}>
                                                                                <tr>
                                                                                    <td>
                                                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                            <span>{receiptNo}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                            <span style={{ width: "125px" }}>{formattedDate ?? "NA"}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>{JSON.stringify(amount)}</td>
                                                                                    <td>{JSON.stringify(amount)}</td>
                                                                                    <td>{JSON.stringify(student?.excess_amount) ?? 'NA'}</td>
                                                                                    <td>0</td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td>
                                                                                        <span style={{ gap: "15px", display: "flex", fontSize: "19px" }}>
                                                                                            <FaPrint onClick={() => handleReceiptChallan(student._id)} />
                                                                                            <span onClick={() => handleDelete(student._id)}><FcCancel /></span>
                                                                                        </span>
                                                                                    </td>
                                                                                    <td></td>
                                                                                    {challanData?.map((challanItem: any, index: number) => {
                                                                                        if (challanItem?.isCancelled) return null;
                                                                                        const challanDate = new Date(challanItem?.challan_generation_date);
                                                                                        const formattedChallanDate = challanDate && !isNaN(challanDate.getTime())
                                                                                            ? `${challanDate.toLocaleString('en-US', { weekday: 'short' })}, ${getDayWithSuffix(challanDate.getDate())} ${challanDate.toLocaleString('en-US', { month: 'short' })}, ${challanDate.getFullYear()}`
                                                                                            : "NA";
                                                                                        return (
                                                                                            !challanItem?.isCancelled && (
                                                                                                <React.Fragment key={challanItem._id}>
                                                                                                    <tr>
                                                                                                        <td>{challanItem?.challan_number ?? 'NA'}</td>
                                                                                                        <td><span style={{ width: "78px", display: "flex" }}>{formattedChallanDate}</span></td>
                                                                                                        <td>{JSON.stringify(challanItem?.amount) ?? 'NA'}</td>
                                                                                                        <td>
                                                                                                            <span style={{ color: challanItem?.isVerified ? 'green' : 'red' }}>
                                                                                                                {challanItem?.isVerified ? 'Verified' : 'Not Verified'}
                                                                                                            </span>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <span style={{ gap: "15px", display: "flex", fontSize: "19px" }}>
                                                                                                                <FaPrint />
                                                                                                                <span onClick={() => handlechallenDelete(challanItem?._id)}><FcCancel /></span>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </React.Fragment>
                                                                                            )
                                                                                        );
                                                                                    })}
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colSpan={7}>
                                                                                        <div style={{ paddingLeft: "20px", color: "gray" }}>
                                                                                            <strong>Remark:</strong> {student?.remark ?? 'NA'}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                {selectedRedundStructure
                                                                                    ?.filter((item: any) => item?.student_id === studentId)
                                                                                    ?.filter((item: any) => item?.fee_structure_id === feeStructureId)
                                                                                    ?.map((redundItem: any) => {
                                                                                        if (redundItem?.isCancelled) return null;

                                                                                        const redundPaymentDate = new Date(redundItem?.payment_date);
                                                                                        const formattedRedundDate = redundPaymentDate && !isNaN(redundPaymentDate.getTime())
                                                                                            ? `${redundPaymentDate.toLocaleString('en-US', { weekday: 'short' })}, ${getDayWithSuffix(redundPaymentDate.getDate())} ${redundPaymentDate.toLocaleString('en-US', { month: 'short' })}, ${redundPaymentDate.getFullYear()}`
                                                                                            : "NA";

                                                                                        return (
                                                                                            !redundItem?.isCancelled && (
                                                                                                <React.Fragment key={redundItem._id}>
                                                                                                    <tr>
                                                                                                        <td>{redundItem?.receipt_no ?? 'NA'}</td>
                                                                                                        <td>{formattedRedundDate ?? "NA"}</td>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td>{JSON.stringify(redundItem?.refund_amount) ?? 'NA'}</td>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                        <td>
                                                                                                            <span style={{ gap: "15px", display: "flex", fontSize: "19px" }}>
                                                                                                                <FaPrint onClick={() => handleRefundChallan(redundItem._id)} />
                                                                                                                <span onClick={() => handleRefundDelete(redundItem._id)}><FcCancel /></span>
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td colSpan={7}>
                                                                                                            <div style={{ paddingLeft: "20px", color: "gray" }}>
                                                                                                                <strong>Remark:</strong> {redundItem?.remark ?? 'NA'}
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </React.Fragment>
                                                                                            )
                                                                                        );
                                                                                    })}
                                                                            </React.Fragment>
                                                                        )
                                                                    );
                                                                })}

                                                        </tbody>

                                                    </table>

                                                </>
                                                <div>
                                                    <table className={style.detailTable}>
                                                        <thead>
                                                            <tr>
                                                                <td colSpan={12}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ fontSize: "14px", fontWeight: 600 }}>Installments</span>

                                                                    </div>
                                                                </td>

                                                            </tr>
                                                            <tr className={style?.tableHeadingDetail}>
                                                                <th >Sr. No.</th>
                                                                <th>Facility</th>
                                                                <th>To be paid by</th>
                                                                <th>Amount to be paid</th>
                                                                <th>Applicable fine</th>
                                                                <th>Paid amount</th>
                                                                <th>Balance amount</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>

                                        </div>
                                    )
                                })}
                        </React.Fragment>
                        {/* ))} */}
                        <div style={{ display: 'flex' }}>
                            {/* {openDialogs.includes(activeDialog) && (
                                <CollectAcademicDialog
                                    academicDialogOpen={openDialogs.includes(activeDialog)}
                                    setacademicDialogOpen={setActiveDialog}
                                    selectedStudent={selectedStudent}
                                    totalHeadAmounts={totalHeadAmounts}
                                    totalPaid={totalPaid}
                                    totalBalance={totalBalance}
                                />
                            )} */}
                            {(activeDialog === "facilities" || activeDialog === "academic") && (
                                <CollectAcademicDialog
                                    firstName={firstName}
                                    academicDialogOpen={openDialogs.includes(activeDialog)}
                                    setacademicDialogOpen={setActiveDialog}
                                    selectedStudent={selectedStudent}
                                    setSelectedStudent={setSelectedStudent}
                                    students={students}
                                    selectedFeeStructureId={selectedFeeStructureId} totalPaid={0} totalBalance={0}
                                    selectedFees={selectedFees}
                                    selectedYear={selectedYear}
                                // totalHeadAmounts={totalHeadAmounts}
                                // totalPaid={totalPaid}
                                // totalBalance={totalBalance}
                                />
                            )}

                            {(activeDialog === "transport" || activeDialog === "hostel") && (
                                <Transportdialog
                                    academicDialogOpen={openDialogs.includes(activeDialog)}
                                    setacademicDialogOpen={setActiveDialog}
                                    selectedStudent={selectedStudent}
                                // totalHeadAmounts={totalHeadAmounts}
                                // totalPaid={totalPaid}
                                // totalBalance={totalBalance}
                                />
                            )}

                            {activeDialog === "concession" && (
                                <ConcessionDialog
                                    ConcessionDialogOpen={activeDialog === "concession"}
                                    setConcessionDialogOpen={setActiveDialog}
                                    selectedStudent={selectedStudent}
                                    selectedFeeStructureId={selectedFeeStructureId}
                                    selectedFeeId={selectedFeeId}

                                />
                            )}
                            {
                                activeDialog === "UpdateChallan" && (
                                    <UpdateChallanDialog studentId={studentId} feeStructureId={feeStructureId} UpdateChallanDialogOpen={activeDialog === "UpdateChallan"} setConcessionDialogOpen={setActiveDialog} />
                                )
                            }
                            {
                                activeDialog === "FeeRefund" && (
                                    <FeeRefund UpdateChallanDialogOpen={activeDialog === "FeeRefund"} setConcessionDialogOpen={setActiveDialog}
                                        selectedFeeStructureId={selectedFeeStructureId} students={students} selectedStudent={selectedStudent}
                                        selectedrefund={selectedrefund}
                                        selectedFeeStructure={selectedFeeStructure} selectedId={selectedId}
                                    />
                                )
                            }
                            {
                                activeDialog === "FeeReceipt" && (
                                    <FeeReceipt UpdateChallanDialogOpen={activeDialog === "FeeReceipt"} setConcessionDialogOpen={setActiveDialog}
                                        selectedFeeStructureId={selectedFeeStructureId} selectedId={selectedId} students={students} selectedStudent={selectedStudent}

                                    />
                                )
                            }

                            {
                                activeDialog === "RefundReceipt" && (
                                    <RefundReceipt UpdateChallanDialogOpen={activeDialog === "RefundReceipt"} setConcessionDialogOpen={setActiveDialog}
                                        selectedFeeStructureId={selectedFeeStructureId} selectedRefundId={selectedRefundId} students={students} selectedStudent={selectedStudent}

                                    />
                                )
                            }
                            {
                                activeDialog === "Generatechallan" && (
                                    <Generatechallandialog feeStructureId={feeStructureId} selectedStudent={selectedStudent} selectedFeeStructureId={selectedFeeStructureId} UpdateChallanDialogOpen={activeDialog === "Generatechallan"} students={students} setConcessionDialogOpen={setActiveDialog} />
                                )
                            }
                            {
                                activeDialog === "modifyFeeStructure" && (
                                    <ModifyfeeStructureDialog feeStructureDialogOpen={activeDialog === "modifyFeeStructure"} setFeeStructureDialogOpen={setActiveDialog} selectedStudent={selectedStudent}
                                    // totalHeadAmounts={totalHeadAmounts}
                                    // totalPaid={totalPaid}
                                    // totalBalance={totalBalance}
                                    />
                                )
                            }
                            {
                                activeDialog === "AssignFeeStructure" && (
                                    <Assignfeestructure UpdateChallanDialogOpen={activeDialog === "AssignFeeStructure"}
                                        selectedStudent={selectedStudent}
                                        setConcessionDialogOpen={setActiveDialog}
                                    // totalHeadAmounts={totalHeadAmounts}
                                    // totalPaid={totalPaid}
                                    // totalBalance={totalBalance}
                                    />
                                )
                            }
                            {
                                activeDialog === "modify_department" && (
                                    <ModifydeparmentStructureDialog feeStructureDialogOpen={activeDialog === "modify_department"} setFeeStructureDialogOpen={setActiveDialog} selectedStudent={selectedStudent}
                                    // totalHeadAmounts={totalHeadAmounts}
                                    // totalPaid={totalPaid}
                                    // totalBalance={totalBalance}
                                    />
                                )
                            }
                            {/* <CollectAcademicDialog academicDialogOpen={academicDialogOpen} setacademicDialogOpen={setacademicDialogOpen} selectedStudent={selectedStudent} totalHeadAmounts={totalHeadAmounts} totalPaid={totalPaid} totalBalance={totalBalance}/> */}
                            {/* <ConcessionDialog ConcessionDialogOpen={ConcessionDialogOpen} setConcessionDialogOpen={setConcessionDialogOpen} /> */}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default QuickCollectListPage;


