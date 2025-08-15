import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';

interface PropsIF {
    benefitedScholarshipReport: boolean;
    setBenefitedScholarshipReport?: (open: boolean) => void;
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

const BenefitedInstitutionScholarshipReportModal: React.FC<PropsIF> = ({ benefitedScholarshipReport, setBenefitedScholarshipReport, selectedStudent }) => {



    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown

    const handleDialogClose = () => {
        if (setBenefitedScholarshipReport) {
            setBenefitedScholarshipReport(false);
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



    const [selectedYears, setSelectedYears]: any = useState({});
    const { getReceiptSeries, Department, getDepartment, PaymentMode, getPaymentMode, getFeeHead, FeeHead, getHeadwiseDaily, HeadwiseDaily }: any = useDepartmentStore();

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

    return (
        <div>
            <Dialog
                isOpen={benefitedScholarshipReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Student(s) benefited by Institution Scholarship & Freeship Report
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
                                                                    <label htmlFor={`${department._id}-select-all`} style={{ fontWeight: "600", marginLeft: "5px" }}>{department.name}</label>
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
                                                                            <label htmlFor={`${department._id}-${year}`} style={{ fontWeight: "600", marginLeft: "5px" }}>{year}</label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}



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

export default BenefitedInstitutionScholarshipReportModal;
