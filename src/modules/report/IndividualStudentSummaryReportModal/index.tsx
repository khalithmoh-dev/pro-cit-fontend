import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';

interface PropsIF {
    individualSummaryReport: boolean;
    setIndividualSummaryReport?: (open: boolean) => void;
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

const IndividualStudentSummaryReportModal: React.FC<PropsIF> = ({ setIndividualSummaryReport, individualSummaryReport, selectedStudent }) => {


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

    const { Department, getDepartment, Individualstudents, getIndividualstudents }: any = useDepartmentStore();
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

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectgroup, SetselectedGroup] = useState("")
    console.log(selectedYear, "selectgroupselectgroup")// State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown
    const handleYearChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedYear(e.target.value);
    };
    const handleDialogClose = () => {
        if (setIndividualSummaryReport) {
            setIndividualSummaryReport(false);
        }
    };
    const handleDepartmentChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedDepartment(e.target.value);

    };
    const handleselectedGroup = (e: any) => {
        SetselectedGroup(e.target.value)
    }

    const handleFilterClick = () => {
        setDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
    };

    const reportData = [
        { parentHead: '674', amount: '5678545', name: "Ram", },

    ];

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

    console.log(selectedYear,"selectedYearselectedYear")

    const handleFilterClickclose = () => {
        setDropdownOpen(false); 
    };
    const handleApplyClick = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Ensure you are passing the parameters in the correct order
        const result = await getIndividualstudents(selectedYear, selectedDepartment, selectgroup, false);
        
        handleFilterClickclose();
    
        if (result) {
            console.log('Report data fetched successfully:', selectgroup); // Do something with the report data (e.g., display it)
        }
    };

    return (
        <div>
            <Dialog
                isOpen={individualSummaryReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll}
            // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Individual Student Summary Report
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div style={{ display: "flex", gap: "10px", padding: "20px", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                            <div style={{width:"100%"}}><label style={{ fontSize: "14px", fontWeight: "500" }}>Select Academic Year <span style={{ color: 'red' }}>*</span></label>

                                <select
                                    className={style.academySelect}
                                    name="ConcessionType"
                                    value={selectedYear}
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

                            <div style={{width:"100%"}}><label style={{ fontSize: "14px", fontWeight: "500" }}>Select Stream <span style={{ color: 'red' }}>*</span></label>

                                <select className={style.academySelect} name="" id="" value={selectedDepartment} onChange={handleDepartmentChange}>
                                    <option value="">Select stream</option>
                                    {departments.map((department: any) => (
                                        <option value={department?.name}>{department?.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{width:"100%"}}>
                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Select Group <span style={{ color: 'red' }}>*</span></label>

                                <select
                                    className={style.academySelect}
                                    name="ConcessionType"
                                    value={selectgroup}
                                    onChange={handleselectedGroup}
                                >
                                    <option value="">Select Group</option>
                                    <option value="First Year">First Semester</option>
                                    <option value="Second Year">Second Semester</option>
                                    <option value="Third year">Third Semester</option>
                                    <option value="Fourth year">Forth Semester</option>
                                </select>
                            </div>
                            <div style={{ gap: "10px", display: "flex", height: "40px",width:"100%" }}> <button style={{ backgroundColor: "#0465ac", marginTop: "4px", color: "white", padding: "8px", border: "none" }} onClick={handleApplyClick}>View Students</button>

                            </div>
                        </div>


                    </div>
                    <div style={{ padding: '20px', backgroundColor: 'white' }}>
                        {Individualstudents?.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
                                Report data not available as per the applied filters.
                            </div>
                        ) : (
                            <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }} >
                                <thead>
                                    <tr>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Sr.No.</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Roll No</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Name</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>User Id </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Individualstudents?.map((data:any, index:any) => (
                                        <tr key={index}>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>1</td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{data.parentHead}</td>

                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{data?.student_id?.firstName}</td>

                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                {/* {data.amount} */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default IndividualStudentSummaryReportModal;
