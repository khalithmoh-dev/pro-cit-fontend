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
    paymentCollectionReport: boolean;
    setPaymentCollectionReport?: (open: boolean) => void;
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

const PaymentModewiseCollectionReport: React.FC<PropsIF> = ({ paymentCollectionReport, setPaymentCollectionReport, selectedStudent }) => {

    const { Department, PaymentModewise, FeeHead, getPaymentModewise }: any = useDepartmentStore();

    const [selections, setSelections] = useState<Selections>({
        csAndEng: [false, false, false, false],
        ece: [false, false, false, false],
        mechanical: [false, false, false],
        civil: [false, false, false],
        aiMl: [false, false, false],
        aiDs: [false, false, false],
        basicScience: [false],
        administrative: [false],
        csCyberSecurity: [false, false]
    });

    // Handler to toggle all checkboxes in a given category
    const toggleAll = (category: keyof Selections): void => {
        const updatedSelections = { ...selections };
        const allChecked = updatedSelections[category].every(value => value); // Check if all are selected
        updatedSelections[category] = updatedSelections[category].map(() => !allChecked); // Toggle all based on current state
        setSelections(updatedSelections);
    };

    // Handler to handle individual checkbox changes
    const handleChange = (category: keyof Selections, index: number): void => {
        const updatedSelections = { ...selections };
        updatedSelections[category][index] = !updatedSelections[category][index];
        setSelections(updatedSelections);
    };



    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown

    const handleDialogClose = () => {
        if (setPaymentCollectionReport) {
            setPaymentCollectionReport(false);
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


    const [selectedFeeHeadModes, setSelectedFeeHeadModes]: any = useState([]);
    const [selectedYears, setSelectedYears]: any = useState({});
    const [selectedYear, setSelectedYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const handleStartDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setStartDate(e.target.value);
    };

    // Handler for end date change
    const handleEndDateChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEndDate(e.target.value);
    };

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


    const departments = Department.filter((dept: { totalSemesters: number; }) => [2, 4, 8].includes(dept.totalSemesters));

    // State to hold the selected years for each department



    // Handler for change in academic year selection
    const handleYearChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedYear(e.target.value);
    };

    const getYears = (totalSemesters: number): string[] => {
        if (totalSemesters === 2) return ['First Year'];
        if (totalSemesters === 4) return ['First Year', 'Second Year'];
        if (totalSemesters === 8) return ['First Year', 'Second Year', 'Third year', 'Fourth year'];
        return [];
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
    const handleFilterClickclose = () => {
        setDropdownOpen(false); // Toggle dropdown visibility
    };


    const handleApplyClick = async (e: React.FormEvent) => {
        e.preventDefault();


        const result = await getPaymentModewise(selectedFeeHeadModes, startDate, endDate, false);
        handleFilterClickclose()
        // Handle API result (whether successful or failed)
        if (result) {
            console.log('Report data fetched successfully:', selectedFeeHeadModes); // Do something with reportData (e.g., display it)
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
        if (PaymentModewise.length > 0) {
            setIsTableReady(true); // Set flag when data is ready
        }
    }, [PaymentModewise]);


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
                isOpen={paymentCollectionReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Payment Modewise Fee Headwise Collection Report


                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div style={{ fontWeight: "600", marginLeft: "20px" }}><span style={{ color: "red", fontWeight: "600" }}>Note:</span> Payment entries will be available only against those heads for which the payment is made on the respective date.</div>

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

                                        <div style={{ display: "flex", gap: "77px" }}>
                                            <div>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Academic Year</label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Year</option>
                                                    <option value="29" id="acaYr29">2001-02</option><option value="28" id="acaYr28">2002-03</option><option value="27" id="acaYr27">2003-04</option><option value="26" id="acaYr26">2004-05</option><option value="25" id="acaYr25">2005-06</option><option value="24" id="acaYr24">2006-07</option><option value="16" id="acaYr16">2007-08</option><option value="17" id="acaYr17">2008-09</option><option value="18" id="acaYr18">2009-10</option><option value="19" id="acaYr19">2010-11</option><option value="20" id="acaYr20">2011-12</option><option value="21" id="acaYr21">2012-13</option><option value="22" id="acaYr22">2013-14</option><option value="23" id="acaYr23">2014-15</option><option value="1" id="acaYr1">2015-16</option><option value="2" id="acaYr2">2016-17</option><option value="3" id="acaYr3">2017-18</option><option value="4" id="acaYr4">2018-19</option><option value="5" id="acaYr5">2019-20</option><option value="6" id="acaYr6">2020-21</option><option value="7" id="acaYr7">2021-22</option><option value="8" id="acaYr8">2022-23</option><option value="9" id="acaYr9">2023-24</option><option value="10" id="acaYr10">2024-25</option><option value="11" id="acaYr11">2025-26</option><option value="12" id="acaYr12">2026-27</option><option value="13" id="acaYr13">2027-28</option><option value="14" id="acaYr14">2028-29</option><option value="15" id="acaYr15">2029-30</option>
                                                </select>
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
                                            <div className={style.collection3}>
                                                <div>
                                                    <p>Branch</p>

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

                                                <div style={{ padding: "9px" }}>
                                                    <p>Fee Heads</p>

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


                                            </div>


                                        </div>
                                    </div>

                                </div>

                                <div style={{ padding: "9px", justifyContent: "end", display: "flex" }}>

                                    <div style={{ gap: "10px", display: "flex" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} onClick={handleApplyClick}>Apply</button>
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

                    {PaymentModewise?.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>

                        </div>
                    ) : (
                        <div style={{ padding: '20px', backgroundColor: 'white' }}  ref={pdfRef}>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Coorg Institute of Technology</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment ModeWise Fee HeadWise Collection Report</div>
                            <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Start Date : {startDate} | End Date : {endDate} | Branch: Civil Engineering </div>
                            <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>

                                <thead>
                                    <tr>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Debit Card</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>cash</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Credit Card</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>cheque</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>pos</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>neft</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>wallet</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Intermission</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>SCC</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	J V</th>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>	PREVIOUS SOFTWORE(DHI)</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>GJGHHJHK</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>KEA</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>NEW ADM 2023-24	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>NEW ADM 2024-25	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>



                                    {PaymentModewise?.length > 0 ? PaymentModewise?.map((data: any, dataindex: any) => (
                                        <tr>

                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}> {data?.feeHead}</td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}></td>

                                            {data.modes.map((mode: any, modeIndex: any) => {
                                                console.log(mode.payment, "modemode")
                                                return (

                                                    // <tr key={modeIndex}>
                                                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                        {mode?.payment}
                                                    </td>
                                                    // </tr>
                                                )
                                            })}
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

                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>{data?.payment}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={17} style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>No Data Found</td>
                                        </tr>
                                    )}


                                </tbody>
                            </table>
                            <div>
                            </div>
                        </div>
                    )
                    }

                    {/* <p>Click on  to apply filter to view report data.</p> */}
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default PaymentModewiseCollectionReport;
