import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";

interface PropsIF {
    ReportNewVersion: boolean;
    setReportNewVersion?: (open: boolean) => void;
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

const DailyCollectionReportNewVersionModal: React.FC<PropsIF> = ({ setReportNewVersion, ReportNewVersion, selectedStudent }) => {


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
        if (setReportNewVersion) {
            setReportNewVersion(false);
        }
    };

    const handleFilterClick = () => {
        setDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
    };

    const reportData = [
        { parentHead: 'Tuition Fees', amount: '₹50,000' },
        { parentHead: 'Library Fees', amount: '₹5,000' },
        { parentHead: 'Sports Fees', amount: '₹2,000' }
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

    return (
        <div>
            <Dialog
                isOpen={ReportNewVersion}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll}
            // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Daily Collection Report (New Version)
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div style={{ display: "flex", gap: "10px", padding: "20px", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                            <div><label style={{ fontSize: "14px", fontWeight: "500" }}>Order By</label>

                                <select
                                    className={style.academySelect}
                                    name="ConcessionType"
                                >
                                    <option value="">Select Academic Year</option><option value="29" id="acaYr29">2001-02</option><option value="28" id="acaYr28">2002-03</option><option value="27" id="acaYr27">2003-04</option><option value="26" id="acaYr26">2004-05</option><option value="25" id="acaYr25">2005-06</option><option value="24" id="acaYr24">2006-07</option><option value="16" id="acaYr16">2007-08</option><option value="17" id="acaYr17">2008-09</option><option value="18" id="acaYr18">2009-10</option><option value="19" id="acaYr19">2010-11</option><option value="20" id="acaYr20">2011-12</option><option value="21" id="acaYr21">2012-13</option><option value="22" id="acaYr22">2013-14</option><option value="23" id="acaYr23">2014-15</option><option value="1" id="acaYr1">2015-16</option><option value="2" id="acaYr2">2016-17</option><option value="3" id="acaYr3">2017-18</option><option value="4" id="acaYr4">2018-19</option><option value="5" id="acaYr5">2019-20</option><option value="6" id="acaYr6">2020-21</option><option value="7" id="acaYr7">2021-22</option><option value="8" id="acaYr8">2022-23</option><option value="9" id="acaYr9">2023-24</option><option value="10" id="acaYr10">2024-25</option><option value="11" id="acaYr11">2025-26</option><option value="12" id="acaYr12">2026-27</option><option value="13" id="acaYr13">2027-28</option><option value="14" id="acaYr14">2028-29</option><option value="15" id="acaYr15">2029-30</option>
                                </select>
                            </div>
                            <div>
                                <label>from Date</label>
                                <input
                                    type="date"
                                    placeholder='End Date'
                                    className={style.academySelect}
                                    name="PaymentDate" />
                            </div>
                            <div>
                                <label>To Date</label>
                                <input
                                    type="date"
                                    placeholder='End Date'
                                    className={style.academySelect}
                                    name="PaymentDate" />
                            </div>
                            <div>
                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Parent Head</label>

                                <select
                                    className={style.academySelect}
                                    name="ConcessionType"
                                >
                                    <option value="">Select Parent Head</option>
                                </select>
                            </div>

                            <div style={{ gap: "10px", display: "flex", height: "40px" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} >Apply</button>
                                <button style={{ border: "2px solid #0465ac", height: "40px", color: "#0465ac", padding: "8px" }}>
                                    Cancel
                                </button>
                            </div>
                        </div>

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
                    <div style={{ padding: '20px', backgroundColor: 'white' }}>
                       
<div style={{padding: '7px', border: '1px solid #ddd',display:"flex", justifyContent: 'center', fontSize:"13px" ,fontWeight:"600",backgroundColor:"#f5f7fb"}}>Coorg Institute of Technology</div>
<div style={{padding: '7px', border: '1px solid #ddd',display:"flex", justifyContent: 'center', fontSize:"13px" ,fontWeight:"600",backgroundColor:"#f5f7fb"}}>Parent Head Wise Collection Report5</div>
<div style={{padding: '7px', border: '1px solid #ddd',display:"flex", justifyContent: 'center', fontSize:"13px" ,fontWeight:"600",backgroundColor:"#f5f7fb"}}>Academic Year: 2024-25</div>

                        {reportData.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
                                Report data not available as per the applied filters.
                            </div>
                        ) : (
                            <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>
                                
                                <thead>
                                    <tr>
                                        
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left',fontSize:"13px", fontWeight:"600", backgroundColor:"#f5f7fb" }}>Parent Head</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right',fontSize:"13px", fontWeight:"600",backgroundColor:"#f5f7fb" }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((data, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '8px', border: '1px solid #ddd',fontSize:"13px" }}>{data.parentHead}</td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right',fontSize:"13px" }}>
                                                {data.amount}
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

export default DailyCollectionReportNewVersionModal;
