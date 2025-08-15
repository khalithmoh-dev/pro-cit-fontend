import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useConcessionStore from '../../../store/concessionReportStore';
import useDepartmentStore from '../../../store/dailyCollectionReportStore';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import * as XLSX from 'xlsx';


interface PropsIF {
    concessionReport: boolean;
    setConcessionReport?: (open: boolean) => void;
    selectedStudent: any; // Ideally, replace `any` with more specific types if possible
    selectedFeeStructureId: any;
    selectedFeeId: any;
}



const ConcessionReport: React.FC<PropsIF> = ({ setConcessionReport, concessionReport, selectedStudent }) => {

  

    const { Department, getDepartment }: any = useDepartmentStore();
    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                await getDepartment()
            } catch (error) {
                console.error("Error fetching concessions", error);
            }
        };
        fetchParentHeads();
    }, [getDepartment]);
    const departments = Department.filter((dept: { totalSemesters: number; }) => [2, 4, 6, 8, 10].includes(dept.totalSemesters));

    // Handler to toggle all checkboxes in a given category
 
    const { getConcessionReport, reportData }: any = useConcessionStore();

    // State to track if date fields are active or dropdown fields are active
    const [isDateActive, setIsDateActive] = useState(false); // False by default
    const [isDropdownActive, setIsDropdownActive] = useState(false); // False by default

    const [startDate, setStartDate]:any = useState('');
    // console.log(startDate, "startDatestartDate")
    const [endDate, setEndDate] = useState('');

    // Handler for start date change
    const handleStartDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setStartDate(e.target.value);
        setIsDateActive(true); // Disable dropdown fields
        setIsDropdownActive(false);
    };

    // Handler for end date change
    const handleEndDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEndDate(e.target.value);
        setIsDateActive(true); // Disable dropdown fields
        setIsDropdownActive(false);
    };

    const [selectedInstitute, setSelectedInstitute] = useState('');

    // Handler for change in academic year selection
    const handleInstituteChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedInstitute(e.target.value);
        setIsDropdownActive(true); // Disable date fields
        setIsDateActive(false);
    };

    const [selectedYear, setSelectedYear]:any = useState('');

    // Handler for change in academic year selection
    const handleYearChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedYear(e.target.value);
        setIsDropdownActive(true); // Disable date fields
        setIsDateActive(false);
    };

    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Handler for change in academic Department selection
    const handleDepartmentChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedDepartment(e.target.value);
        setIsDropdownActive(true); // Disable date fields
        setIsDateActive(false);
    };

    const [selectedParentGroup, setSelectedParentGroup] = useState('');

    // Handler for change in academic ParentGroup selection
    const handleParentGroupChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedParentGroup(e.target.value);
        setIsDropdownActive(true); // Disable date fields
        setIsDateActive(false);
    };

    const handleFilterClickclose = () => {
        setDropdownOpen(false); // Toggle dropdown visibility
    };

    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown

    const handleDialogClose = () => {
        if (setConcessionReport) {
            setConcessionReport(false);
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

    const handleApplyClick = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission

        // Call the getReportData API with the selected parameters
        if ((startDate && endDate) || (selectedYear && selectedDepartment)) {
            const result = await getConcessionReport(startDate, endDate, selectedYear, selectedDepartment, false);
            handleFilterClickclose()
            // Handle API result (whether successful or failed)
            if (result) {
                console.log('Report data fetched successfully:', reportData); // Do something with reportData (e.g., display it)
            }
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
        if (reportData.length > 0) {
            setIsTableReady(true); // Set flag when data is ready
        }
    }, [reportData]);


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
                isOpen={concessionReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Concession Report
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
                            <>
                                <div
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
                                    <div style={{ display: "flex", gap: "16px" }}>
                                        <div>
                                            <label>From Date</label>
                                            <input
                                                disabled={selectedYear}
                                                type="date"
                                                placeholder='End Date'
                                                className={style.academySelect}
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                                name="PaymentDate" />
                                        </div>
                                        <div>
                                            <label>To Date {startDate && <span style={{ color: "red" }}>*</span>}</label>
                                            <input
                                                disabled={!startDate}
                                                type="date"
                                                placeholder='End Date'
                                                className={style.academySelect}
                                                value={endDate}
                                                onChange={handleEndDateChange}
                                                name="PaymentDate" />
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }} > <div style={{ borderBottom: "1px solid", width: "100%" }}></div>
                                        OR
                                        <div style={{ borderBottom: "1px solid", width: "100%" }}></div></div>
                                    <div className={style?.inputError}>
                                        <div>

                                            <div style={{ display: "flex", gap: "30px" }}>
                                                <div style={{width:"100%"}}>
                                                    <label style={{ fontSize: "14px", fontWeight: "500" }}>Institute</label>

                                                    <select
                                                        className={style.academySelect}
                                                        name="ConcessionType"
                                                        value={selectedInstitute} // Bind the value to state
                                                        onChange={handleInstituteChange}
                                                    >
                                                        <option value="">Select Institute</option>
                                                        <option>CIT</option>
                                                    </select>
                                                </div>
                                                <div style={{width:"100%"}}>
                                                    <label style={{ fontSize: "14px", fontWeight: "500" }}>Academic Year <span style={{ color: 'red' }}>*</span></label>

                                                    <select disabled={startDate} className={style.academySelect} name="ConcessionType" value={selectedYear} onChange={handleYearChange}>
                                                        <option value="">Select Academic Year</option>
                                                        <option value="2001-02" id="acaYr29">2001-02</option>
                                                        <option value="2002-03" id="acaYr28">2002-03</option>
                                                        <option value="2003-04" id="acaYr27">2003-04</option>
                                                        <option value="2004-05" id="acaYr26">2004-05</option>
                                                        <option value="2005-06" id="acaYr25">2005-06</option>
                                                        <option value="2006-07" id="acaYr24">2006-07</option>
                                                        <option value="2007-08" id="acaYr16">2007-08</option>
                                                        <option value="2008-09" id="acaYr17">2008-09</option>
                                                        <option value="2009-10" id="acaYr18">2009-10</option>
                                                        <option value="2010-11" id="acaYr19">2010-11</option>
                                                        <option value="2011-12" id="acaYr20">2011-12</option>
                                                        <option value="2012-13" id="acaYr21">2012-13</option>
                                                        <option value="2013-14" id="acaYr22">2013-14</option>
                                                        <option value="2014-15" id="acaYr23">2014-15</option>
                                                        <option value="2015-16" id="acaYr1">2015-16</option>
                                                        <option value="2016-17" id="acaYr2">2016-17</option>
                                                        <option value="2017-18" id="acaYr3">2017-18</option>
                                                        <option value="2018-19" id="acaYr4">2018-19</option>
                                                        <option value="2019-20" id="acaYr5">2019-20</option>
                                                        <option value="2020-21" id="acaYr6">2020-21</option>
                                                        <option value="2021-22" id="acaYr7">2021-22</option>
                                                        <option value="2022-23" id="acaYr8">2022-23</option>
                                                        <option value="2023-24" id="acaYr9">2023-24</option>
                                                        <option value="2024-25" id="acaYr10">2024-25</option>
                                                        <option value="2025-26" id="acaYr11">2025-26</option>
                                                        <option value="2026-27" id="acaYr12">2026-27</option>
                                                        <option value="2027-28" id="acaYr13">2027-28</option>
                                                        <option value="2028-29" id="acaYr14">2028-29</option>
                                                        <option value="2029-30" id="acaYr15">2029-30</option>
                                                    </select>
                                                </div>

                                                <div style={{width:"100%"}}>
                                                    <label style={{ fontSize: "14px", fontWeight: "500" }}>Department <span style={{ color: 'red' }}>*</span></label>
                                                    <select disabled={!selectedYear} className={style.academySelect} name="" id="" value={selectedDepartment} onChange={handleDepartmentChange}>
                                                        <option value="">Select Department </option>
                                                        {departments.map((department: any) => (
                                                            <option value={department?.name}>{department?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div style={{width:"100%"}}>
                                                    <label style={{ fontSize: "14px", fontWeight: "500" }}>Parent Group</label>
                                                    <select
                                                        disabled={!selectedDepartment}
                                                        className={style.academySelect}
                                                        name="ConcessionType"
                                                        value={selectedParentGroup}
                                                        onChange={handleParentGroupChange}
                                                    >
                                                        <option value="">Select Parent Group</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div style={{ padding: "9px", justifyContent: "end", display: "flex" }}>

                                        <div style={{ gap: "10px", display: "flex" }}>
                                            <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} onClick={handleApplyClick} >Apply</button>
                                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>

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

                    {reportData.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
                            Report data not available as per filter.
                        </div>
                    ) : (
                        <div style={{ padding: '20px', backgroundColor: 'white' }} ref={pdfRef}>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Coorg Institute of Technology</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Concession Report</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Start Date : {startDate} | End Date : {endDate} | Academic Year : {selectedYear} </div>
                            <div style={{ overflowX: "scroll" }}>
                                <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>
                                   
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Sr. No.	</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>ERP Id</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>GRN</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>PRN</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Admission Number</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>First Name</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Last Name</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Father Name</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Category</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Institute</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Academic Year</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Department</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Semester/Group</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Head</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Assigned Head</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Concession Type</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Concession Amount</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Attachments</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Added By</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Added On</th>
                                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((data: any, index: any) => {

                                            const feeAmounts = data.fee_structure_id.fees.map((fee: { amount: any; }) => fee.amount);

                                            // Calculate the sum of the fee amounts
                                            const totalFeeAmount = feeAmounts.reduce((sum: any, amount: any) => sum + amount, 0);

                                            // Get the total fee from the structure
                                            const totalFee = data.fee_structure_id.total_fee;

                                            // Calculate the final total amount (sum of all fees + total_fee)
                                            const finalAmount = totalFee + totalFeeAmount;
                                            return (
                                                <tr key={index}>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{index + 1}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.student_id?.usnNumber}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.student_id?.admissionNumber}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.student_id?.firstName}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.student_id?.lastName}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.student_id?.fatherFullName}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.fee_structure_id?.payment_category}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.fee_structure_id?.academic_year}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.student_id?.semester}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.concession[0]?.concession_type}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.concession[0]?.amount}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.attachments}</td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.remark}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* <p>Click on  to apply filter to view report data.</p> */}
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default ConcessionReport;
