import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';


interface PropsIF {
    feeAnalysisReport: boolean;
    setFeeAnalysisReport?: (open: boolean) => void;
    selectedStudent: any; // Ideally, replace `any` with more specific types if possible
    selectedFeeStructureId: any;
    selectedFeeId: any;
}



const AcademicYearwiseFeeAnalysisReport: React.FC<PropsIF> = ({ feeAnalysisReport, setFeeAnalysisReport, selectedStudent }) => {
    const { getAcademicYearWiseFee, Department, PaymentMode, FeeHead, AcademicYearWise }: any = useDepartmentStore();


    const [selectedYears, setSelectedYears]: any = useState({});
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedModes, setSelectedModes]: any = useState([]);
    const [selectedFeeHeadModes, setSelectedFeeHeadModes]: any = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Handler to toggle all checkboxes in a given category
   

    const handleDialogClose = () => {
        if (setFeeAnalysisReport) {
            setFeeAnalysisReport(false);
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

    const departments = Department.filter((dept: { totalSemesters: number; }) => [2, 4, 8].includes(dept.totalSemesters));

    // State to hold the selected years for each department



    // Handler for change in academic year selection
    const handleYearChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedYear(e.target.value);
    };

    // Handle checkbox change for selecting individual years
    const isAllSelected = (deptId: string, totalSemesters: number) => {
        const years = getYears(totalSemesters);
        return selectedYears[deptId]?.length === years.length;
    };

    const handleSelectAllChange = (deptId: string, totalSemesters: number) => {
        setSelectedYears((prev: any) => {
            const updated = { ...prev };
            const years = getYears(totalSemesters);

            // If all years are selected, deselect all; otherwise, select all
            updated[deptId] = updated[deptId]?.length === years.length ? [] : [...years];

            return updated;
        });
    };

    const handleCheckboxChange = (deptId: string, year: string) => {
        setSelectedYears((prev: any) => {
            const updated = { ...prev };
            const currentSelection = updated[deptId] || [];

            // Add or remove the year from the selection
            if (currentSelection.includes(year)) {
                updated[deptId] = currentSelection.filter((y: string) => y !== year);
            } else {
                updated[deptId] = [...currentSelection, year];
            }

            return updated;
        });
    };

    const handlePaymentModeChange = (e: { target: { value: any; checked: any; }; }) => {
        const { value, checked } = e.target;

        // Update selectedModes array based on checkbox selection
        if (checked) {
            setSelectedModes((prevModes: any) => [...prevModes, value]);
        } else {
            setSelectedModes((prevModes: any[]) =>
                prevModes.filter((mode) => mode !== value)
            );
        }
    };



    // Handle checkbox change
    const handleFeeHeadChange = (e: { target: { value: any; checked: any; }; }) => {
        const { value, checked } = e.target;

        // Update selectedModes array based on checkbox selection
        if (checked) {
            setSelectedFeeHeadModes((prevModes: any) => [...prevModes, value]);
        } else {
            setSelectedFeeHeadModes((prevModes: any[]) =>
                prevModes.filter((mode) => mode !== value)
            );
        }
    };

    // Handler for start date change
    const handleStartDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setStartDate(e.target.value);
    };

    // Handler for end date change
    const handleEndDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEndDate(e.target.value);
    };

    // Generate years based on totalSemesters
    const getYears = (totalSemesters: number): string[] => {
        if (totalSemesters === 2) return ['First Year'];
        if (totalSemesters === 4) return ['First Year', 'Second Year'];
        if (totalSemesters === 8) return ['First Year', 'Second Year', 'Third year', 'Fourth year'];
        return [];
    };

    const handleFilterClickclose = () => {
        setDropdownOpen(false); // Toggle dropdown visibility
    };

    const handleApplyClick = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission
        const feeHead = selectedFeeHeadModes.join(',');
        const mode = selectedModes.join(',');

        const result = await getAcademicYearWiseFee(selectedYear, startDate, endDate, feeHead, mode, false);
        handleFilterClickclose()
        if (result) {
            console.log('Report data fetched successfully:', selectedYear); // Do something with reportData (e.g., display it)
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
        if (AcademicYearWise.length > 0) {
            setIsTableReady(true); // Set flag when data is ready
        }
    }, [AcademicYearWise]);


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
                isOpen={feeAnalysisReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Academic Yearwise Fee Analysis Report
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
                                   <div style={{display:"flex", gap:"166px"}}> <div>Academic Year  <span style={{ color: 'red' }}>*</span></div>
                                    <div>Branch</div>
                                    <div>Payment Mode</div>
                                    <div>Fee Heads</div>
                                    <div>Scholarship Heads</div></div>
                                        <div style={{ display: "flex",gap:"10px" }}>
                                            <div style={{width:"26%"}}>

                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                    value={selectedYear} // Bind the value to state
                                                    onChange={handleYearChange}
                                                >
                                                    <option value="">Select Year</option>
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

                                            <div className={style.collection10}>
                                                <div>

                                                    <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                                        {departments.map((department: any) => (
                                                            <div key={department._id} className="department">
                                                                <div>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`${department._id}-select-all`}
                                                                        checked={isAllSelected(department._id, department.totalSemesters)}
                                                                        onChange={() => handleSelectAllChange(department._id, department.totalSemesters)}
                                                                    />
                                                                    <label htmlFor={`${department._id}-select-all`} style={{ fontWeight: "600", marginLeft: "5px" }}>
                                                                        {department.name}
                                                                    </label>
                                                                </div>

                                                                <div className="years">
                                                                    {getYears(department.totalSemesters).map((year, index) => (
                                                                        <div key={index}>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`${department._id}-${year}`}
                                                                                checked={selectedYears[department._id]?.includes(year)}
                                                                                onChange={() => handleCheckboxChange(department._id, year)}
                                                                            />
                                                                            <label htmlFor={`${department._id}-${year}`} style={{ fontWeight: "600", marginLeft: "5px", textTransform: "uppercase" }}>
                                                                                {year}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ padding: "9px" }}>

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

                                                    <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                                        <div style={{ fontSize: "14px" }}>

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
                                                </div>
                                                <div style={{ padding: "9px" }}>
                                                    <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div style={{ display: "flex", gap: "15px" }}> <div>
                                    <label>Form Date</label>
                                    <div> <input
                                        type="date"
                                        placeholder='Start Date'
                                        className={style.academySelect}
                                        style={{ width: "140px" }}
                                        name="PaymentDate"
                                        value={startDate}
                                        onChange={handleStartDateChange} /></div>
                                </div>
                                    <div>
                                        <label>To Date</label>
                                        <div> <input
                                            type="date"
                                            placeholder='End Date'
                                            className={style.academySelect}
                                            style={{ width: "140px" }}
                                            name="PaymentDate"
                                            value={endDate}
                                            onChange={handleEndDateChange} /></div>
                                    </div>
                                </div>
                                <div style={{ padding: "9px", justifyContent: "end", display: "flex" }}>

                                    <div style={{ gap: "10px", display: "flex" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} onClick={handleApplyClick} >Apply</button>
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

                    {AcademicYearWise?.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>

                        </div>
                    ) : (
                        <div style={{ padding: '20px', backgroundColor: 'white' }}  ref={pdfRef}>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Coorg Institute of Technology</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Academic Year wise Fee Analysis</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>{selectedYear}</div>
                            <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Sr. No.</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Year</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Student Count</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Concession</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Paid</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Balance</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Paid</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Balance</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Paid</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Balance</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Paid</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AcademicYearWise?.length > 0 && AcademicYearWise?.map((item: any, index: any) => {
                                        return (
                                            <>
                                                <tr style={{ fontSize: "13px" }}>
                                                    <td colSpan={17}>
                                                        {item?.departmentName}
                                                    </td>
                                                </tr>

                                                {item?.yearGroup?.length > 0 ? item?.yearGroup?.map((data: any, dataindex: any) => (
                                                    <tr>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{dataindex + 1}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}> {data?.year}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.studentCount}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fees?.total}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fees?.Concession}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fees?.Paid}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fees?.Balance}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Scholarship?.total}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Scholarship?.Paid}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Scholarship?.Balance}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fine?.total}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fine?.Paid}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Fine?.Balance}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Total}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Paid}</td>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.Balance}</td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={17} style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>No Data Found</td>
                                                    </tr>
                                                )}

                                            </>
                                        )
                                    })}
                                </tbody>                              
                            </table>
                            <div>
                            </div>
                        </div>
                    )
                    }
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default AcademicYearwiseFeeAnalysisReport;