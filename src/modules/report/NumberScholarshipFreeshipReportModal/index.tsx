import React, { useState, useEffect, useRef } from 'react';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import style from "../reporting-list/report.module.css"
import { FaFileExport, FaFilter, FaPrint } from 'react-icons/fa';
import { RiSettings5Fill } from "react-icons/ri";

interface PropsIF {
    freeshipReport: boolean;
    setfFreeshipReport?: (open: boolean) => void;
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

const NumberScholarshipFreeshipReportModal: React.FC<PropsIF> = ({ setfFreeshipReport, freeshipReport, selectedStudent }) => {


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
        if (setfFreeshipReport) {
            setfFreeshipReport(false);
        }
    };

    const handleFilterClick = () => {
        setDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
    };

    const reportData = [
        { parentHead: '674', },

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
                isOpen={freeshipReport}
                onClose={handleDialogClose}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style.dialogScroll}
            // Remove optional chaining here
            >
                <div className={style.GenerateChallanheader}>
                Number of Student(s) benefited by Institution Scholarship & Freeship Report
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div style={{ display: "flex", gap: "10px", padding: "20px", justifyContent: "end", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>



                            <div style={{ gap: "12px", display: "flex", alignItems: "baseline", justifyContent: "end" }}>
                                <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                    <FaFileExport />Export
                                </button>
                                <button style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>
                                    <FaPrint />
                                    Print
                                </button>
                            </div>



                        </div>


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

                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Academic Year	</th>
                                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: "13px", fontWeight: "600", backgroundColor: "#f5f7fb" }}>Number of students
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((data, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>2024</td>
                                            <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: "13px" }}>{data.parentHead}</td>



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

export default NumberScholarshipFreeshipReportModal;
