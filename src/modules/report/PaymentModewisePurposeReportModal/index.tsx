import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";
import useDepartmentStore from '../../../store/dailyCollectionReportStore';

interface PropsIF {
    purposeReportModal: boolean;
    setPurposeReportModal?: (open: boolean) => void;
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

const PaymentModewisePurposeReportModal: React.FC<PropsIF> = ({ purposeReportModal, setPurposeReportModal, selectedStudent }) => {



    const { PaymentMode, ReceiptSeriesget }: any = useDepartmentStore();

    const [selectedModes, setSelectedModes]: any = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for controlling dropdown visibility
    const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref to detect clicks outside the dropdown

    const handleDialogClose = () => {
        if (setPurposeReportModal) {
            setPurposeReportModal(false);
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
    return (
        <div>
            <Dialog
                isOpen={purposeReportModal}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll} // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                    Payment Modewise Fee Headwise Purpose Report
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

                                            <div style={{ display: "flex", gap: "15px" }}> <div>
                                                <label>Start Date *</label>
                                                <div> <input
                                                    type="date"
                                                    placeholder='Start Date'
                                                    className={style.academySelect}
                                                    style={{ width: "140px" }}
                                                    name="PaymentDate" /></div>
                                            </div>
                                                <div>
                                                    <label>End Date *</label>
                                                    <div> <input
                                                        type="date"
                                                        placeholder='Start Date'
                                                        className={style.academySelect}
                                                        style={{ width: "140px" }}
                                                        name="PaymentDate" /></div>
                                                </div>
                                            </div>
                                            <div className={style.collection2}>
                                                <div style={{ padding: "9px" }}>
                                                    <p>Payment Mode</p>

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


                                                <div style={{ padding: "9px" }}>

                                                    <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                                        <div style={{ fontSize: "14px" }}>

                                                            <div>
                                                                <label>Receipt Series</label>
                                                                <select
                                                                    className={style.academySelect}
                                                                    name="ReceiptSeries"
                                                                >
                                                                    <option value="">Select Receipt Series</option>
                                                                    {ReceiptSeriesget?.map((name: any) => (
                                                                        <option>{name?.series_preview}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>




                                                    </div>
                                                </div>

                                                <div style={{ padding: "9px" }}>
                                                    <p>Purpose</p>
                                                    <div className={style.collectionColumn} style={{ fontSize: "14px" }}>
                                                        <div style={{ fontSize: "14px" }}>
                                                            <div>
                                                            </div>
                                                        </div>
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

export default PaymentModewisePurposeReportModal;
