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
    Open: boolean;
    setlogOpen?: (open: boolean) => void;
    selectedStudent: any; // Ideally, replace `any` with more specific types if possible
    selectedFeeStructureId: any;
    selectedFeeId: any;
}



const DailyCollectionReportModal: React.FC<PropsIF> = ({ Open, setlogOpen, selectedStudent }) => {

    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedYears, setSelectedYears]: any = useState({});
    const [selectedFeeHeadModes, setSelectedFeeHeadModes]: any = useState([]);
    const [selectedModes, setSelectedModes]: any = useState([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleDialogClose = () => {
        if (setlogOpen) {
            setlogOpen(false);
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


    const { getReceiptSeries, Department, getDepartment, PaymentMode, getPaymentMode, getFeeHead, FeeHead, getHeadwiseDaily, HeadwiseDaily }: any = useDepartmentStore();
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



    const handleFeeHeadChange = (e: { target: { value: any; checked: any; }; }) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedFeeHeadModes((prevModes: any) => [...prevModes, value]);
        } else {
            setSelectedFeeHeadModes((prevModes: any[]) =>
                prevModes.filter((mode) => mode !== value)
            );
        }
    };


    const handlePaymentModeChange = (e: { target: { value: any; checked: any; }; }) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedModes((prevModes: any) => [...prevModes, value]);
        } else {
            setSelectedModes((prevModes: any[]) =>
                prevModes.filter((mode) => mode !== value)
            );
        }
    };


    const departments = Department.filter((dept: { totalSemesters: number; }) => [2, 4, 8].includes(dept.totalSemesters));

    const handleCheckboxChange = (deptId: string, year: string) => {
        setSelectedYears((prev: any) => {
            const updated = { ...prev };
            if (!updated[deptId]) updated[deptId] = [];

            if (updated[deptId].includes(year)) {
                updated[deptId] = updated[deptId].filter((y: string) => y !== year); // Deselect the year
            } else {
                updated[deptId].push(year); // Select the year
            }

            return updated;
        });
    };

    const handleSelectAllChange = (deptId: string, totalSemesters: number) => {
        setSelectedYears((prev: any) => {
            const updated = { ...prev };
            const years = getYears(totalSemesters);

            updated[deptId] = updated[deptId]?.length === years.length ? [] : years;

            return updated;
        });
    };

    const getYears = (totalSemesters: number): string[] => {
        if (totalSemesters === 2) return ['FIRST YEAR'];
        if (totalSemesters === 4) return ['FIRST YEAR', 'SECOND YEAR'];
        if (totalSemesters === 8) return ['FIRST YEAR', 'SECOND YEAR', 'THIRD YEAR', 'FOURTH YEAR'];
        return [];
    };

    const isAllSelected = (deptId: string, totalSemesters: number) => {
        const years = getYears(totalSemesters);
        return selectedYears[deptId]?.length === years.length;
    };
    const handleFilterClickclose = () => {
        setDropdownOpen(false); // Toggle dropdown visibility
    };

    const handleStartDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEndDate(e.target.value);
    };

    const handleApplyClick = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission
        setErrorMessage('');
        if (!startDate || !endDate) {
            setErrorMessage("Both From Date and To Date are required.");
            return;
        }

        // Optional: Check if From Date is later than To Date
        if (new Date(startDate) > new Date(endDate)) {
            setErrorMessage("From Date cannot be later than To Date.");
            return;
        }

        const result = await getHeadwiseDaily(startDate, endDate, selectedModes, false);
        handleFilterClickclose()
        if (result) {
            console.log('Report data fetched successfully:'); // Do something with reportData (e.g., display it)
        }

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

    useEffect(() => {
        if (HeadwiseDaily.length > 0) {
            setIsTableReady(true); // Set flag when data is ready
        }
    }, [HeadwiseDaily]);


    const exportToExcel = () => {
        if (!isTableReady || !pdfRef.current) {
            console.error("Table or data is not ready.");
            return;
        }

        const ws = XLSX.utils.table_to_sheet(pdfRef.current); // Generate the sheet from the table
        const wb = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(wb, ws, "Report"); // Append the sheet to the workbook

        XLSX.writeFile(wb, "daily_collection_report.xlsx");
    };

    return (
        <div>
            <Dialog
                isOpen={Open}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Headwise Daily Collection Report
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
                                    height: "50%",
                                    overflow: "scroll",
                                    width: "71%"
                                }}
                            >


                                <div className={style.collection}>
                                    <div>

                                        <div style={{ fontSize: "14px", marginTop: "11px" }}>
                                            <div>
                                                <label>Start date <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="date"
                                                    placeholder='Start Date'
                                                    className={style.academySelect}
                                                    name="PaymentDate"
                                                    value={startDate}
                                                    onChange={handleStartDateChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Academic Year</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Year</option>
                                                    <option value="29" id="acaYr29">2001-02</option><option value="28" id="acaYr28">2002-03</option><option value="27" id="acaYr27">2003-04</option><option value="26" id="acaYr26">2004-05</option><option value="25" id="acaYr25">2005-06</option><option value="24" id="acaYr24">2006-07</option><option value="16" id="acaYr16">2007-08</option><option value="17" id="acaYr17">2008-09</option><option value="18" id="acaYr18">2009-10</option><option value="19" id="acaYr19">2010-11</option><option value="20" id="acaYr20">2011-12</option><option value="21" id="acaYr21">2012-13</option><option value="22" id="acaYr22">2013-14</option><option value="23" id="acaYr23">2014-15</option><option value="1" id="acaYr1">2015-16</option><option value="2" id="acaYr2">2016-17</option><option value="3" id="acaYr3">2017-18</option><option value="4" id="acaYr4">2018-19</option><option value="5" id="acaYr5">2019-20</option><option value="6" id="acaYr6">2020-21</option><option value="7" id="acaYr7">2021-22</option><option value="8" id="acaYr8">2022-23</option><option value="9" id="acaYr9">2023-24</option><option value="10" id="acaYr10">2024-25</option><option value="11" id="acaYr11">2025-26</option><option value="12" id="acaYr12">2026-27</option><option value="13" id="acaYr13">2027-28</option><option value="14" id="acaYr14">2028-29</option><option value="15" id="acaYr15">2029-30</option>
                                                </select>
                                            </div>


                                        </div>
                                    </div>

                                    <div style={{ padding: '8px' }}>
                                        <div>
                                            <label>End date <span style={{ color: 'red' }}>*</span></label>
                                            <input
                                                type="date"
                                                placeholder='Start Date'
                                                className={style.academySelect}
                                                name="PaymentDate"
                                                value={endDate}
                                                onChange={handleEndDateChange} />
                                        </div>
                                        <div>
                                            <p>Department</p>

                                            <div className={style.collectionColumn} style={{ fontSize: "14px", width: "400px" }}>
                                                {departments.map((department: any) => (
                                                    <div key={department._id} className="department">
                                                        <div>
                                                            <input
                                                                type="checkbox"
                                                                id={`${department._id}-select-all`}
                                                                checked={isAllSelected(department._id, department.totalSemesters)}
                                                                onChange={() => handleSelectAllChange(department._id, department.totalSemesters)}
                                                            />
                                                            <label htmlFor={`${department._id}-select-all`} style={{ fontWeight: "600", marginLeft: "5px" }}>{department.name}</label>
                                                        </div>

                                                        {/* <div className="years">
                {getYears(department.totalSemesters).map((year, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`${department._id}-${year}`}
                            checked={selectedYears[department._id]?.includes(year)}
                            onChange={() => handleCheckboxChange(department._id, year)}
                        />
                        <label htmlFor={`${department._id}-${year}`} style={{ fontWeight: "600", marginLeft: "5px" }}>{year}</label>
                    </div>
                ))}
            </div> */}
                                                    </div>
                                                ))}




                                            </div>
                                        </div>

                                    </div>

                                    <div style={{ padding: "9px" }}>
                                        <p>Payment Mode</p>

                                        <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                            <div style={{ fontSize: "14px" }}>

                                                {PaymentMode.map((mode: any) => (
                                                    <div key={mode._id}>
                                                        <input
                                                            type="checkbox"
                                                            id={mode._id}
                                                            value={mode.modeName}
                                                            checked={selectedModes.includes(mode.modeName)}
                                                            onChange={handlePaymentModeChange}
                                                        />
                                                        <label htmlFor={mode._id} style={{ fontWeight: "600", marginLeft: "5px" }}>{mode.modeName}</label>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                    <div style={{ padding: "9px" }}>
                                        <p>Fee Heads</p>

                                        <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                            {FeeHead.map((mode: any) => (
                                                <div key={mode._id}>
                                                    <input
                                                        type="checkbox"
                                                        id={mode._id}
                                                        value={mode.head_group_name}
                                                        checked={selectedFeeHeadModes.includes(mode.head_group_name)}
                                                        onChange={handleFeeHeadChange}
                                                    />
                                                    <label htmlFor={mode._id} style={{ fontWeight: "600", marginLeft: "5px" }}>{mode.head_group_name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ padding: "9px" }}>
                                        <p>Scholarship Heads</p>

                                        <div className={style.collectionColumn} style={{ fontSize: "14px" }}>

                                        </div>
                                        <div style={{ gap: "10px", display: "flex" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px" }} onClick={handleApplyClick} >Apply</button>
                                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>Cancel</button></div>
                                    </div>

                                    {errorMessage && (
                                        <div style={{ color: 'red', marginTop: '10px' }}>
                                            {errorMessage}
                                        </div>
                                    )}

                                </div>
                            </div>
                            </>

                        )}

                        <div style={{ gap: "12px", display: "flex", alignItems: "baseline" }}> <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }} onClick={exportToExcel}> <FaFileExport />Export </button>
                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }} onClick={handleDownload}>  <FaPrint />
                                Print </button> <RiSettings5Fill />
                        </div>
                    </div>
                    {HeadwiseDaily.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>

                        </div>
                    ) : (
                        <div style={{ padding: '20px', backgroundColor: 'white' }}>

                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Coorg Institute of Technology</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Daily Collection Report</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Start Date : 2024-12-12 | End Date : 2024-12-19 | Payment Mode : cash | Academic Year : 2024-25 | Stream Name : Computer Science & Engineering | Fee Heads: INSURANCE</div>


                            <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}  ref={pdfRef}>

                                <thead>
                                    <tr>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Sr. No.	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Date</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Instrument Date</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Receipt Number</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Roll No</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>ERP Id</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Student</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>PRN/University Number	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>GRN</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Admission Number</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Father Name	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Mother Name	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Admission Year</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Student Type</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Academic Year</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Department</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Parent Group</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Group</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Mode</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Category		</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	Cheque Details / Transaction Id	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Bank Name	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Remarks</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Advance Amount	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Opening Balance	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Current Paid	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Closing Balance
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {HeadwiseDaily.map((data: any, index: any) => {

                                        const feeAmounts = data.fee_structure_id?.fees?.map((fee: { amount: any; }) => fee.amount);

                                        // Calculate the sum of the fee amounts
                                        const totalFeeAmount = feeAmounts?.reduce((sum: any, amount: any) => sum + amount, 0);

                                        // Get the total fee from the structure
                                        const totalFee = data?.fee_structure_id?.total_fee;

                                        // Calculate the final total amount (sum of all fees + total_fee)
                                        const finalAmount = totalFee + totalFeeAmount;
                                        const formatDate = (date: any) => {
                                            const day = moment(date).format('Do'); // 'Do' will add the correct suffix (st, nd, rd, th)
                                            const month = moment(date).format('MMM'); // Abbreviated month name
                                            const year = moment(date).format('YYYY'); // Full year

                                            return `${day} ${month}, ${year}`;
                                        };
                                        return (
                                            <tr key={index}>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{index + 1}</td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {formatDate(data?.payment_date)}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>

                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.receipt_no}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.student_id?.usnNumber}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.student_id?.admissionNumber}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.student_id?.fatherFullName}
                                                </td> <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.student_id?.motherName}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.fee_structure_id?.academic_year}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.fee_structure_id?.student_type}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.fee_structure_id?.academic_year}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.fee_structure_id?.department?.yearGroup}
                                                </td>

                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {totalFee}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.mode}
                                                </td>

                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {/* {totalFee} */}
                                                </td>

                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {/* {data?.mode} */}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.student_id?.bankDetails?.bankName}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {data?.remark}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {/* {data?.transaction} */}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                </td>

                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {/* {data?.refund?.refunded_amount} */}
                                                </td>

                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {/* {data?.excess_amount} */}
                                                </td>
                                                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                    {/* {data?.remark} */}
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                        </div>
                    )}
                    {/* <p>Click on  to apply filter to view report data.</p> */}
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default DailyCollectionReportModal;
