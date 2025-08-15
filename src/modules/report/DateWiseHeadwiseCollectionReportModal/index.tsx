import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';
import moment from 'moment';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';


interface PropsIF {
    collectionReport: boolean;
    setcollectionReport?: (open: boolean) => void;
    selectedStudent: any; // Ideally, replace `any` with more specific types if possible
    selectedFeeStructureId: any;
    selectedFeeId: any;
}

interface Selections {
    csAndEng: boolean[];
    ece: boolean[];
    mechanical: boolean[];
    civil: boolean[];
    aiMl: boolean[];
    aiDs: boolean[];
    basicScience: boolean[];
    administrative: boolean[];
    csCyberSecurity: boolean[];
}

const DateWiseHeadwiseCollectionReport: React.FC<PropsIF> = ({ collectionReport, setcollectionReport, selectedStudent }) => {




    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown
    const [errorMessage, setErrorMessage] = useState<string>('');
    const handleDialogClose = () => {
        if (setcollectionReport) {
            setcollectionReport(false);
        }
    };

    const handleFilterClick = () => {
        setDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false); // Close the dropdown if clicked outside
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    const { getReceiptSeries, ReceiptSeriesget, Department, getDepartment, PaymentMode, getPaymentMode, getFeeHead, FeeHead, getDateWiseHeadwise, DateWiseHeadwise }: any = useDepartmentStore();
    console.log(DateWiseHeadwise, "DateWiseHeadwise")
    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                await getReceiptSeries('');
                await getDepartment()
                await getFeeHead()
                await getPaymentMode('') // Fetch concessions on component load
            } catch (error) {
                console.error("Error fetching concessions", error);
            }
        };
        fetchParentHeads();
    }, [getReceiptSeries, getDepartment, getPaymentMode, getFeeHead]);

    const handleFilterClickclose = () => {
        setDropdownOpen(false); // Toggle dropdown visibility
    };
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value; // Get selected date
        setSelectedDate(date); // Update selectedDate state
        if (date) {
            const selectedDateObj = new Date(date);
            const month = selectedDateObj.getMonth() + 1; // Get 1-indexed month
            const year = selectedDateObj.getFullYear(); // Get full year (YYYY)
            getDateWiseHeadwise(month.toString().padStart(2, '0'), year.toString());
        }
    };

    const handleApplyClick = async (e: React.FormEvent) => {
        e.preventDefault(); 

        setErrorMessage('');
        if (!selectedDate) {
            setErrorMessage("month and year");
            return;
        }

        // Optional: Check if From Date is later than To Date
       
        
        // Prevent form submission
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            const month = selectedDateObj.getMonth() + 1;
            const year = selectedDateObj.getFullYear();
            const result = await getDateWiseHeadwise(month.toString().padStart(2, '0'), year.toString(), false);
            handleFilterClickclose()
            console.log("resultresultresult", result, DateWiseHeadwise);

            if (result) {
                console.log('Report data fetched successfully:');
            }
        } else {
            console.log('Please select a date first.');
        }
    };




    const renderTable = (payments: any[]) => {
        return payments.map((payment, index) => (
            <tr key={index}>
                <td>{payment.student_id.firstName}</td>
                <td>{payment.student_id.lastName}</td>
                <td>{payment.student_id.email}</td>
                <td>{payment.fee_structure_id.fee_structure_title}</td>
                {payment.payment.map((fee: { category_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; paid_amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; balance_amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, idx: React.Key | null | undefined) => (
                    <td key={idx}>
                        {fee.category_name}: {fee.paid_amount} (Balance: {fee.balance_amount})
                    </td>
                ))}
                <td>{payment.payment_date}</td>
                <td>{payment.receipt_no}</td>
                <td>{payment.transaction}</td>
                <td>{payment.isCancelled ? "Cancelled" : "Completed"}</td>
            </tr>
        ));
    };
   
    const pdfRef = useRef(null);
    const handleDownload = async () => {
        const element = pdfRef.current;

        if (element) {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape", "mm", "a4"); // Use landscape mode to accommodate two forms in a row
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("fee_receipts.pdf");
        }
    };

    const [isTableReady, setIsTableReady] = useState(false);

    const [aggregatedData, setAggregatedData] = useState<any[]>([]);
    const [totalPaidAmountSum, setTotalPaidAmountSum] = useState<number>(0);
    useEffect(() => {
        if (DateWiseHeadwise && Object.keys(DateWiseHeadwise).length > 0) {
            const processedData = Object.keys(DateWiseHeadwise).map((date) => {
                const payments = DateWiseHeadwise[date];

                const groupedData = payments.reduce((acc: any, data: any) => {
                    if (!acc[data.mode]) {
                        acc[data.mode] = {
                            mode: data.mode,
                            totalFee: 0,
                            totalPaidAmount: 0,
                        };
                    }

                    const feeAmounts = data.payment.map((fee: { paid_amount: any; }) => fee.paid_amount);
                    const totalFeeAmount = feeAmounts.reduce((sum: any, paid_amount: any) => sum + paid_amount, 0);

                    acc[data.mode].totalPaidAmount += totalFeeAmount;

                    if (data.fee_structure_id && data.fee_structure_id.total_fee) {
                        acc[data.mode].totalFee += data.fee_structure_id.total_fee;
                    }

                    return acc;
                }, {});

                const aggregatedData = Object.values(groupedData);
                const totalPaidAmountSum: any = aggregatedData.reduce((sum: any, data: any) => sum + data.totalPaidAmount, 0);

                return { aggregatedData, totalPaidAmountSum };
            });

            const aggregatedData = processedData.flatMap((item) => item.aggregatedData);
            const totalPaidAmountSum = processedData.reduce((sum, item) => sum + item.totalPaidAmountSum, 0);

            setAggregatedData(aggregatedData);
            setTotalPaidAmountSum(totalPaidAmountSum);

            setIsTableReady(true); // Set the flag to render the table after data is processed
        }
    }, [DateWiseHeadwise]);



    const exportToExcel = () => {
        if (!isTableReady || !pdfRef.current) {
            console.error("Table or data is not ready.");
            return;
        }

        const ws = XLSX.utils.table_to_sheet(pdfRef.current);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, "daily_collection_report.xlsx");
    };

    return (
        <div>
            <Dialog
                isOpen={collectionReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Date-Wise Headwise Collection Report
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div style={{ display: "flex", gap: "10px", padding: "20px", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button style={{ padding: "10px", backgroundColor: "#4285f4", color: "white", border: "none" }} onClick={handleFilterClick} // Toggle filter dropdown
                            >  <FaFilter />Filter </button>
                            <div style={{ gap: '10px', display: "flex", alignItems: "center" }}>
                                Show<select>
                                    <option>Select</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="40">40</option>
                                    <option value="100">100</option>
                                    <option value="250">250</option>
                                </select>
                                entries
                            </div>
                        </div>
                        {dropdownOpen && (
                            <><div
                                ref={dropdownRef} // Attach ref to the dropdown
                                style={{
                                    position: "absolute",
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                    padding: "10px",
                                    marginTop: "50px",
                                    height: "65%",
                                    overflow: "scroll",
                                    width: "71%"
                                }}
                            >
                                <div className={style?.inputError}>
                                    <div>

                                        <div style={{ display: "flex", gap: "50px" }}>
                                            <div style={{ width: "100%" }}><label style={{ fontSize: "14px", fontWeight: "500" }}>Select month and year <span style={{ color: 'red' }}>*</span></label>

                                                <input
                                                    type="date"
                                                    placeholder='Start Date'
                                                    className={style.academySelect}
                                                    name="PaymentDate"
                                                    value={selectedDate}
                                                    onChange={handleDateChange} // Trigger handleDateChange on date change
                                                />
                                            </div>



                                            <div style={{ width: "100%" }}>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Academic Year</label>

                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Academic Year</option>
                                                    <option value="29" id="acaYr29">2001-02</option><option value="28" id="acaYr28">2002-03</option><option value="27" id="acaYr27">2003-04</option><option value="26" id="acaYr26">2004-05</option><option value="25" id="acaYr25">2005-06</option><option value="24" id="acaYr24">2006-07</option><option value="16" id="acaYr16">2007-08</option><option value="17" id="acaYr17">2008-09</option><option value="18" id="acaYr18">2009-10</option><option value="19" id="acaYr19">2010-11</option><option value="20" id="acaYr20">2011-12</option><option value="21" id="acaYr21">2012-13</option><option value="22" id="acaYr22">2013-14</option><option value="23" id="acaYr23">2014-15</option><option value="1" id="acaYr1">2015-16</option><option value="2" id="acaYr2">2016-17</option><option value="3" id="acaYr3">2017-18</option><option value="4" id="acaYr4">2018-19</option><option value="5" id="acaYr5">2019-20</option><option value="6" id="acaYr6">2020-21</option><option value="7" id="acaYr7">2021-22</option><option value="8" id="acaYr8">2022-23</option><option value="9" id="acaYr9">2023-24</option><option value="10" id="acaYr10">2024-25</option><option value="11" id="acaYr11">2025-26</option><option value="12" id="acaYr12">2026-27</option><option value="13" id="acaYr13">2027-28</option><option value="14" id="acaYr14">2028-29</option><option value="15" id="acaYr15">2029-30</option>
                                                </select>
                                            </div>
                                            <div style={{ width: "100%" }}>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Deparment</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Deparment</option>
                                                    {Department?.map((Head: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                                                        <option>
                                                            {Head?.name}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className={style?.inputError}>
                                    <div>

                                        <div style={{ display: "flex", gap: "50px" }}>
                                            <div style={{ width: "100%" }}>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Payment Mode</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Payment Mode</option>
                                                </select>
                                            </div>
                                            <div style={{ width: "100%" }}>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Fee Heads</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Fee Heads</option>
                                                    <option value="insurance">INSURANCE</option>
                                                    <option value="tuitionFees">TUITION FEES AND OTHERS</option>
                                                    <option value="collegeRegistrationFees">COLLEGE REGISTRATION FEES</option>
                                                    <option value="eLearningFees">E LEARNING FEES</option>
                                                    <option value="eligibilityFees">ELIGIBILITY FEES</option>
                                                    <option value="erp">ERP</option>
                                                    <option value="others">OTHERS</option>
                                                    <option value="studentsBankLoan">STUDENTS BANK LOAN</option>
                                                    <option value="studentsBusPass">STUDENTS BUS PASS</option>
                                                    <option value="teachersDayStamp">TEACHERS DAY STAMP</option>
                                                    <option value="universityRegistrationFees">UNIVERSITY REGISTRATION FEES</option>
                                                    <option value="vidyaVikasFund">VIDYA VIKAS FUND</option>
                                                    <option value="vtuFees">VTU FEES</option>
                                                    <option value="applicationFees">APPLICATION FEES</option>
                                                    <option value="membershipFees">MEMBERSHIP FEES</option>
                                                    <option value="skillDevelopmentFees">SKILL DEVELOPMENT FEES</option>
                                                    <option value="messBill">Mess Bill</option>
                                                    <option value="roomRent">Room Rent</option>
                                                    <option value="hostelDeposit">Hostel Deposit</option>
                                                    <option value="eConsortium">E CONSORTIUM</option>
                                                    <option value="studentSportsFee">STUDENT SPORTS FEE</option>
                                                    <option value="studentSportsDevelopment">STUDENT SPORTS DEVELOPMENT</option>
                                                </select>
                                            </div>


                                            <div style={{ width: "100%" }}>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Scholarship Heads</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Scholarship </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ gap: "10px", display: "flex", justifyContent: "end" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} onClick={handleApplyClick}>Apply</button>
                                        <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                {errorMessage && (
                                        <div style={{ color: 'red', marginTop: '10px' }}>
                                            {errorMessage}
                                        </div>
                                    )}

                            </div>
                            </>

                        )}


                        <div style={{ gap: "12px", display: "flex", alignItems: "baseline" }}>
                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }} onClick={exportToExcel}>
                                <FaFileExport />Export
                            </button>
                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }} onClick={handleDownload}>
                                <FaPrint />
                                Print
                            </button>
                            <RiSettings5Fill />
                        </div>
                    </div>


                    {Array.isArray(DateWiseHeadwise) && DateWiseHeadwise?.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>

                        </div>
                    ) : (
                        <div style={{ padding: '20px', backgroundColor: 'white' }}  ref={pdfRef}>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Coorg Institute of Technology</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Daily Collection Report</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Year-Month : 2024-12 | Academic Year : 2024-25 | Payment Mode : cheque | Fee Heads : COLLEGE REGISTRATION FEES</div>
                            <div>
                                {Object.keys(DateWiseHeadwise).map((date, index) => {
                                    const payments = DateWiseHeadwise[date];

                                    const groupedData = payments.reduce((acc: any, data: any) => {
                                        if (!acc[data.mode]) {
                                            acc[data.mode] = {
                                                mode: data.mode,
                                                totalFee: 0,
                                                totalPaidAmount: 0,
                                            };
                                        }

                                        const feeAmounts = data.payment.map((fee: { paid_amount: any; }) => fee.paid_amount);
                                        const totalFeeAmount = feeAmounts.reduce((sum: any, paid_amount: any) => sum + paid_amount, 0);

                                        acc[data.mode].totalPaidAmount += totalFeeAmount;

                                        if (data.fee_structure_id && data.fee_structure_id.total_fee) {
                                            acc[data.mode].totalFee += data.fee_structure_id.total_fee;
                                        }

                                        return acc;
                                    }, {});
                                    const aggregatedData = Object.values(groupedData);
                                    const totalPaidAmountSum: any = aggregatedData.reduce((sum: any, data: any) => sum + data.totalPaidAmount, 0);
                                   


                                    return payments.map((payment: any, paymentIndex: number) => {
                                        const feeAmounts = payment.fee_structure_id?.fees?.map((fee: any) => fee.amount) || [];
                                        const totalFeeAmount = feeAmounts.reduce((sum: number, amount: number) => sum + amount, 0);
                                        const totalFee = payment.fee_structure_id?.total_fee || 0;
                                        const finalAmount = totalFee + totalFeeAmount;

                                        const formatDate = (date: any) => {
                                            const day = moment(date).format('Do');
                                            const month = moment(date).format('MMM');
                                            const year = moment(date).format('YYYY');

                                            return `${day} ${month}, ${year}`;
                                        };

                                        return (
                                            <div >
                                                <p>Date: {formatDate(payment?.payment_date)}</p>
                                                <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Fees</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Scholarship</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Fine</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>

                                                        </tr>
                                                    </thead>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Sr. No.	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Date</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Receipt Number	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Roll No.	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>ERP ID	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Student Name</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Father Name</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Mother Name	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Academic Year</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Department</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Mode	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Category	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Check Details / Transaction Id</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Bank Account</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Advance Amount</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Refund Amount</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Opening Balance	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Current Paid	</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Closing Balance</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Opening Balance</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Current Paid</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Closing Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        <tr key={paymentIndex}>
                                                            {/* Row 1 */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{index + 1}</td>

                                                            {/* Empty Columns */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{formatDate(payment?.payment_date)}</td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>

                                                            {/* Student Details */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>

                                                            </td>

                                                            {/* Empty Columns */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>   {payment.student_id?.firstName}</td>

                                                            {/* USN Number */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.student_id?.fatherFullName}
                                                            </td>


                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.student_id?.motherName}
                                                            </td>

                                                            {/* Parent's Details */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.fee_structure_id?.academic_year}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.student_id?.motherName}
                                                            </td>

                                                            {/* Fee Structure */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.mode}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.fee_structure_id?.student_type}
                                                            </td>

                                                            {/* Duplicate Academic Year */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {/* {payment.fee_structure_id?.academic_year} */}
                                                            </td>

                                                            {/* Empty Columns */}

                                                            {/* Department Year Group */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.fee_structure_id?.department?.yearGroup}
                                                            </td>

                                                            {/* Empty Columns */}

                                                            {/* Fee Details */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {totalFee}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {totalFee}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {totalFee}
                                                            </td>

                                                            {/* Empty Columns */}

                                                            {/* Mode and Payment Category */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.mode}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.fee_structure_id?.payment_category}
                                                            </td>

                                                            {/* Bank Account and Transaction */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.bank_account}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.transaction}
                                                            </td>

                                                            {/* Refund and Excess Amounts */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.refund?.refunded_amount}
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.excess_amount}
                                                            </td>

                                                            {/* Remarks */}
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {payment.remark}
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                                <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Mode</th>
                                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total Paid Amount (Grand Total)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {aggregatedData.map((data: any, index: any) => {
                                                            // Calculate final amount for this mode (sum of totalFee + totalPaidAmount)
                                                            const finalAmount = data.totalFee + data.totalPaidAmount;

                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>
                                                                        {data.mode}  {/* Display the payment mode */}
                                                                    </td>
                                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                        {data.totalPaidAmount}  {/* Display the total paid amount for this mode */}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>
                                                                Total
                                                            </td>
                                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                                {/* Total Paid Amount Sum */}
                                                                {totalPaidAmountSum}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    });
                                })}
                            </div>
                            {/* <div style={{ padding: '20px', backgroundColor: 'white' }}>


                                {Array.isArray(DateWiseHeadwise) && DateWiseHeadwise?.length === 0 ? (
                                    <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
                                        Report data not available as per the applied filters.
                                    </div>
                                ) : (
                                    <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>

                                        <thead>
                                            <tr>

                                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Mode</th>
                                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total Paid Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(DateWiseHeadwise) && DateWiseHeadwise?.map((data: qny, index: any) => {

                                                const feeAmounts = data.fee_structure_id.fees.map(fee => fee.amount);

                                                const totalFeeAmount = feeAmounts.reduce((sum, amount) => sum + amount, 0);

                                                const totalFee = data.fee_structure_id.total_fee;

                                                const finalAmount = totalFee + totalFeeAmount;
                                                return (

                                                    <tr key={index}>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{data?.mode}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                            {totalFee}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div> */}
                        </div>
                    )}

                </DialogBody>
            </Dialog>
        </div>
    );
};

export default DateWiseHeadwiseCollectionReport;
