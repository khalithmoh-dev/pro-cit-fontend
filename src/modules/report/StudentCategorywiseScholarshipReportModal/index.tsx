import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';

interface PropsIF {
    StudentReportModal: boolean;
    setStudentScholarshipModal?: (open: boolean) => void;
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

const StudentCategorywiseScholarshipReportModal: React.FC<PropsIF> = ({ StudentReportModal, setStudentScholarshipModal, selectedStudent }) => {


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
        if (setStudentScholarshipModal) {
            setStudentScholarshipModal(false);
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

    const {  Department, PaymentMode, FeeHead, yearwisefeeheadwise }: any = useDepartmentStore();


    const [selectedYears, setSelectedYears]: any = useState({});
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedModes, setSelectedModes]: any = useState([]);
    const departments = Department.filter((dept: { totalSemesters: number; }) => [2, 4, 8].includes(dept.totalSemesters));

    // State to hold the selected years for each department

    const getYears = (totalSemesters: number): string[] => {
        if (totalSemesters === 2) return ['First Year'];
        if (totalSemesters === 4) return ['First Year', 'Second Year'];
        if (totalSemesters === 8) return ['First Year', 'Second Year', 'Third year', 'Fourth year'];
        return [];
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


    return (
        <div>
            <Dialog
                isOpen={StudentReportModal}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                Student Payment Categorywise Yearwise Scholarship Report


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
                                                    name="PaymentDate" /></div>
                                            </div>
                                                <div>
                                                    <label>To Date</label>
                                                    <div> <input
                                                        type="date"
                                                        placeholder='Start Date'
                                                        className={style.academySelect}
                                                        style={{ width: "140px" }}
                                                        name="PaymentDate" /></div>
                                                </div>
                                            </div>
                                            <div className={style.collection3}>
                                                <div>
                                                    <p>Branch</p>

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
                                                    <p>Payment Category</p>
                                                    <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
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


                                        </div>
                                    </div>

                                </div>

                                <div style={{ padding: "9px", justifyContent: "end", display: "flex" }}>

                                    <div style={{ gap: "10px", display: "flex" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} >Apply</button>
                                        <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>

                            </>

                        )}


                        <div style={{ gap: "12px", display: "flex", alignItems: "baseline" }}>
                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                <FaFileExport />Export
                            </button>
                            <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                <FaPrint />
                                Print
                            </button>
                            <RiSettings5Fill />
                        </div>
                    </div>

                    {/* <p>Click on  to apply filter to view report data.</p> */}
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default StudentCategorywiseScholarshipReportModal;
