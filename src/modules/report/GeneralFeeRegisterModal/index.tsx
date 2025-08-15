import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';

interface PropsIF {
    generalFeeModal: boolean;
    setGeneralFeeModal?: (open: boolean) => void;
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

const GeneralFeeRegisterModal: React.FC<PropsIF> = ({ generalFeeModal, setGeneralFeeModal, selectedStudent }) => {

    const { getReceiptSeries, Department, getDepartment, PaymentMode, getPaymentMode, getFeeHead, FeeHead, getHeadwiseDaily, HeadwiseDaily }: any = useDepartmentStore();

    console.log(Department, "DepartmentDepartment-----------")
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown

    const handleDialogClose = () => {
        if (setGeneralFeeModal) {
            setGeneralFeeModal(false);
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

    return (
        <div>
            <Dialog
                isOpen={generalFeeModal}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    General Fee Register Reportsss
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
                                        <div style={{ display: "flex", gap: "10px" }}>

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
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Select Year</label>

                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Year</option>
                                                    <option value="29" id="acaYr29">2001-02</option><option value="28" id="acaYr28">2002-03</option><option value="27" id="acaYr27">2003-04</option><option value="26" id="acaYr26">2004-05</option><option value="25" id="acaYr25">2005-06</option><option value="24" id="acaYr24">2006-07</option><option value="16" id="acaYr16">2007-08</option><option value="17" id="acaYr17">2008-09</option><option value="18" id="acaYr18">2009-10</option><option value="19" id="acaYr19">2010-11</option><option value="20" id="acaYr20">2011-12</option><option value="21" id="acaYr21">2012-13</option><option value="22" id="acaYr22">2013-14</option><option value="23" id="acaYr23">2014-15</option><option value="1" id="acaYr1">2015-16</option><option value="2" id="acaYr2">2016-17</option><option value="3" id="acaYr3">2017-18</option><option value="4" id="acaYr4">2018-19</option><option value="5" id="acaYr5">2019-20</option><option value="6" id="acaYr6">2020-21</option><option value="7" id="acaYr7">2021-22</option><option value="8" id="acaYr8">2022-23</option><option value="9" id="acaYr9">2023-24</option><option value="10" id="acaYr10">2024-25</option><option value="11" id="acaYr11">2025-26</option><option value="12" id="acaYr12">2026-27</option><option value="13" id="acaYr13">2027-28</option><option value="14" id="acaYr14">2028-29</option><option value="15" id="acaYr15">2029-30</option>
                                                </select>
                                            </div>



                                            <div style={{ width: "100%" }}>
                                                <label style={{ fontSize: "14px", fontWeight: "500" }}>Department </label>
                                                <select
                                                    className={style.academySelect}
                                                    name="ConcessionType"
                                                >
                                                    <option value="">Select Department</option>
                                                    {Department.map((department: any) => (
                                                        <option value={department?.departmentCode}>{department?.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                    <div style={{ padding: "9px", justifyContent: "end", display: "flex" }}>

                                        <div style={{ gap: "10px", display: "flex" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px" }} >Apply</button>
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

export default GeneralFeeRegisterModal;
