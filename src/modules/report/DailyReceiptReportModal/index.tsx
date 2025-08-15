import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';

interface PropsIF {
    dailyReceiptReport: boolean;
    setDailyReceiptReport?: (open: boolean) => void;
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

const DailyReceiptReportModal: React.FC<PropsIF> = ({ setDailyReceiptReport, dailyReceiptReport, selectedStudent }) => {

    const { PaymentMode,ReceiptSeriesget }: any = useDepartmentStore();

    const [selectedModes, setSelectedModes]: any = useState([]);
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
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown

    const handleDialogClose = () => {
        if (setDailyReceiptReport) {
            setDailyReceiptReport(false);
        }
    };

    const handleFilterClick = () => {
        setDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
    };

    const reportData = [
        { parentHead: 'Tuition Fees', amount: '₹50,000', no: "1" },
        { parentHead: 'Library Fees', amount: '₹5,000', no: "2" },
        { parentHead: 'Sports Fees', amount: '₹2,000', no: "3" }
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
                isOpen={dailyReceiptReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll}
            // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Daily Collection via General Receipt Report
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div style={{ display: "flex", gap: "10px", padding: "20px", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                            <div><label style={{ fontSize: "14px", fontWeight: "500" }}>User Role</label>

                                <select
                                    className={style.academySelect}
                                    name="ConcessionType"
                                >
                                    <option value="">Select User Role</option>
                                    <option>Student</option>
                                    <option>Employee</option>
                                    <option>External</option>
                                </select>
                            </div>

                            {/* <div style={{ gap: "10px", display: "flex", height: "40px" }}> <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px", border: "none" }} >Apply</button>
                                <button style={{ border: "2px solid #0465ac", height: "40px", color: "#0465ac", padding: "8px" }}>
                                    Cancel
                                </button>
                            </div> */}
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


                    <div style={{ display: "flex", gap: "30px", marginLeft: "21px" }}>
                        <div style={{ width: "50%" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500" }}>Purpose</label>

                            <select className={style.academySelect} id="filterPurpose" name="purpose" ><option value="">Select Purpose</option><option value="271">STUDENT BUS PASS</option><option value="272">BUS TICKET</option><option value="273">EXAM FEES</option><option value="274">RE VALUATION</option><option value="294">TUITION FEE PREVIOUS YEAR</option><option value="297">OTHER FEE</option><option value="298">INTERNSHIP FEE</option><option value="310">PLACEMENT FEE</option><option value="315">STUDENT BANK LOAN</option><option value="321">DONATION</option><option value="327">OTHERS</option><option value="356">COLLEGE FEE</option><option value="359">SKILL DEVELOPMENT FEES</option><option value="389">NEW ADMISSION  2023/24</option><option value="396">MESS BILL</option><option value="397">ROOM RENT</option><option value="398">AMD</option><option value="402">TUITION AND COLLEGE OTHER FEE</option><option value="409">MAGAZIINE ADVERTISEMENT SUBSCRIPTION</option><option value="418">CONVOCATION FEES </option><option value="464">Guest House</option><option value="465">SEMINAR/WORKSHOP</option><option value="484">COLLEGE UNIFORM</option><option value="585">KRISHI MELA</option><option value="633">NEW ADMISSION  2024/25</option><option value="645">BOOKS</option><option value="665">ALUMNI DONATION</option><option value="672">INTERNSHIP FEES</option><option value="787">Vidhya Vikas Fund</option><option value="805">SILVER JUBILEE</option><option value="845">International Conference</option><option value="855">Cultural and Technical Fest</option><option value="994">NEW ADMISSION  2025/26</option><option value="1020">Building Fund</option></select>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "100%" }}>
                                <label>Payment Date</label>
                                <input
                                    type="date"
                                    placeholder='End Date'
                                    className={style.academySelect}
                                    name="PaymentDate" />
                            </div>
                            <div style={{ marginTop: "25px", width: "100%" }}>
                                <label></label>
                                <input
                                    type="date"
                                    placeholder='End Date'
                                    className={style.academySelect}
                                    name="PaymentDate" />
                            </div>
                        </div>

                    </div>




                    <div style={{ display: "flex", gap: "30px", marginLeft: "21px" }}>
                        <div style={{ width: "50%" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500" }}>Series</label>

                            <select className={style.academySelect} id="filterSeries" name="filter_series" ><option value="">Select Series</option><option value="479">CIT</option><option value="485">CIT-STU-GR</option><option value="486">CIT-FAC-GR</option><option value="487">CIT-EXT-GR</option><option value="837">CIT STUDENT HOSTEL</option></select>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "100%" }}>
                                <label>Series Number</label>
                                <input
                                    type="text"
                                    placeholder=''
                                    className={style.academySelect}
                                    name="PaymentDate" />
                            </div>

                        </div>

                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ marginLeft: "12px", }}>
                            <div style={{ padding: "9px" }}>
                                <p style={{ fontWeight: "600" }}>Payment Mode</p>

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
                        <div style={{ width: "40%", marginLeft: "63px" }}>
                            <label style={{ fontSize: "14px", fontWeight: "500" }}>Series</label>

                            <select className={style.academySelect} id="filterBank" name="filter_bank" ><option value="">Select Bank Account</option>
                            {ReceiptSeriesget?.map((name: any) => (
                                                        <option>{name?.series_preview}</option>
                                                    ))}
                            </select>                                              </div>
                    </div>

                    <div style={{ padding: '20px', backgroundColor: 'white' }}>

                        <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Coorg Institute of Technology</div>
                        <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Daily Collection via General Receipt</div>
                        <div style={{ padding: '7px', border: '1px solid #ddd', display: "flex", justifyContent: 'center', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}></div>

                        {reportData.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
                                Report data not available as per the applied filters.
                            </div>
                        ) : (
                            <table className={style.reportTable} style={{ width: '100%', borderCollapse: 'collapse',overflow:"scroll", display:"block" }}>

                                <thead>
                                    <tr>

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Sr. No.	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Receipt Number</th>


                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>User Role</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>ERP ID</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>User Name</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>PRN</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>GRN</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Admission Number	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Purpose</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Amount</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Total</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Mode</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Payment Date</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Transaction Id</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Bank Name</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Remarks</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((data, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{data.no}</td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                CIT-STU-GR-109477453
                                            </td>


                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                Student
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                STCIT23288
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                YUSHI CHONDAMMA B S
                                                2024-25 | Computer Science and Cyber Security Engineering | SEM II
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                4CI21CS047
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>

                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                5131
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                EXAM FEES
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                1680
                                            </td>

                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                1680
                                            </td> <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                Online
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                13th Dec, 2024
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                471466367274
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                PRINCIPAL CIT 5504
                                            </td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                College bus fee from Hunsur, FP.
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div style={{ padding: '20px', backgroundColor: 'white' }}>


                        {reportData.length === 0 ? (
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
                                    {reportData.map((data, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>ONLINE</td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px" }}>
                                                39314901
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

export default DailyReceiptReportModal;
