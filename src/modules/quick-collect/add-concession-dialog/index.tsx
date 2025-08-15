import React, { useRef, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import Button from '../../../components/button';
import { TiPlus } from "react-icons/ti";
import { IoCloseSharp } from "react-icons/io5";
import CloseIcon from '../../../icon-components/CloseIcon';
import useQuickCollectStore from '../../../store/quickCollectStore'; // Import the zustand store

interface PropsIF {
    ConcessionDialogOpen: boolean;
    setConcessionDialogOpen?: any;
    selectedStudent: any;
    selectedFeeStructureId: any
    selectedFeeId: any
}

interface ConcessionType {
    ConcessionType: string;
    Amount: string | number;
    remarks: string;
    Files: FileList | null;
}

interface ConcessionError {
    ConcessionType?: string;
    Amount?: string;
}

const ConcessionDialog: React.FC<PropsIF> = ({ ConcessionDialogOpen, setConcessionDialogOpen, selectedStudent, selectedFeeStructureId, selectedFeeId }) => {
    const defaultConcessionData: ConcessionType = {
        ConcessionType: '',
        Amount: '',
        remarks: '',
        Files: null,
    };

    const defaultConcessions = {
        ConcessionType: '',
        Amount: '',
    };

    const [ConcessionData, setConcessionData] = useState<ConcessionType>(defaultConcessionData);
    const [errors, setErrors] = useState<{ [index: number]: ConcessionError }>({});
    const [concessions, setConcessions] = useState<{ ConcessionType: string; Amount: string | number }[]>([defaultConcessions]);
    console.log(selectedFeeStructureId, "concessionsconcessions")
    // Add new concession
    const handleAddMore = () => {
        setConcessions([...concessions, { ConcessionType: '', Amount: '' }]);
    };

    // Delete a specific concession
    const handleDelete = (index: number) => {
        if (index === 0) return; // Prevent deleting the first item
        const updatedConcessions = concessions.filter((_, i) => i !== index);
        setConcessions(updatedConcessions);
    };

    const handleChange = (index: number | null, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const safeIndex = index ?? 0; // Default to index 0 if null
        const parsedValue = name === "Amount" ? (value ? parseFloat(value) : "") : value;
        // If it's the main ConcessionData (the first one)
        if (index === 0 || index === null) {
            setConcessionData((prevData) => {
                const updatedData = { ...prevData, [name]: parsedValue };
                setConcessions((prevConcessions) => {
                    const updatedConcessions = [...prevConcessions];
                    updatedConcessions[0] = updatedData; // Ensure the first concession is updated
                    return updatedConcessions;
                });
                return updatedData;
            });
        } else {
            const updatedConcessions = [...concessions];
            updatedConcessions[safeIndex] = {
                ...updatedConcessions[safeIndex],
                [name]: parsedValue,
            };
            setConcessions(updatedConcessions);
        }

        // Clear errors when the user updates a field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [safeIndex]: {
                ...prevErrors[safeIndex],
                [name]: "",
            },
        }));
    };

    const { createConcession } = useQuickCollectStore(); // Using the zustand store to access the createConcession action

    const SubmitHandel = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors: { [index: number]: ConcessionError } = {};


        if (!ConcessionData.ConcessionType) {
            formIsValid = false;
            newErrors[0] = { ...newErrors[0], ConcessionType: "Concession Type is not selected." };
        }
        if (!ConcessionData.Amount) {
            formIsValid = false;
            newErrors[0] = { ...newErrors[0], Amount: "Amount is required." };
        }


        concessions.forEach((concession, index) => {
            if (index !== 0) {
                const errorsForIndex: ConcessionError = {};
                if (!concession.ConcessionType) {
                    formIsValid = false;
                    errorsForIndex.ConcessionType = "Concession Type is not selected.";
                }
                if (!concession.Amount) {
                    formIsValid = false;
                    errorsForIndex.Amount = "Amount is required.";
                }
                if (Object.keys(errorsForIndex).length > 0) {
                    newErrors[index] = errorsForIndex;
                }
            }
        });


        setErrors(newErrors);

        if (formIsValid) {
            const concessionBody = {
                fee_structure_id: selectedFeeStructureId,  // Replace with actual fee structure ID
                fee_category_id: selectedFeeId,  // Replace with actual fee category ID
                student_id: selectedStudent._id,              // Replace with actual student ID
                concession: concessions.map((item) => ({
                    concession_type: item.ConcessionType,
                    amount: item.Amount,
                })),
                remark: ConcessionData.remarks,
                attachments: ConcessionData.Files ? Array.from(ConcessionData.Files).map((file) => file.name) : [],
            };

            try {
                // Call the store action to create the concession
                await createConcession(
                    concessionBody.fee_structure_id,
                    concessionBody.fee_category_id,
                    concessionBody.student_id,
                    concessionBody.concession,
                    concessionBody.remark,
                    concessionBody.attachments
                );
                handleDialogClose();
                window.location.reload();
                // Close the dialog after successful submission
            } catch (error) {
                console.error("Error creating concession:", error);
            }
        }
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileNames, setFileNames] = useState<string[]>([]);

    // Handle file selection
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const names = Array.from(files).map((file) => file.name);
            setConcessionData((prevdata) => ({
                ...prevdata,
                Files: files,
            }));
            setFileNames(names);
        }
    };

    // Close the dialog and reset states
    const handleDialogClose = () => {
        if (setConcessionDialogOpen) {
            setConcessionDialogOpen(false);
        }
        setConcessionData(defaultConcessionData);
        setConcessions([defaultConcessions]);
    };

    return (
        <div>
            <Dialog isOpen={ConcessionDialogOpen} onClose={handleDialogClose} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Add Concession
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form onSubmit={SubmitHandel}>
                            <div className={style.studentDetails}>
                                {concessions.map((concession, index) => (
                                    <div key={index} className={style?.concessions}>
                                        <div className={style.ConcessionDetails}>
                                            <div>
                                                <label><strong>Concession Type</strong></label>
                                                <div className={style?.inputError}>
                                                    <select
                                                        className={style.academySelect}
                                                        name="ConcessionType"
                                                        value={index === 0 ? ConcessionData.ConcessionType : concession.ConcessionType}
                                                        onChange={(e) => handleChange(index, e)}
                                                    >
                                                        <option value="">Select Concession</option>
                                                        <option value="Poor Background">POOR BACK GROUND</option>
                                                        <option value="KEA">KEA</option>
                                                        <option value="Incorrect Payment Category">Incorrect Payment Category</option>
                                                        <option value="Others">OTHERS</option>
                                                    </select>
                                                    {errors[index]?.ConcessionType && (
                                                        <span className={style?.fieldError}>{errors[index]?.ConcessionType}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label><strong>Amount</strong></label>
                                                <div className={style?.inputError}>
                                                    <input
                                                        type="number"
                                                        className={style.academySelect}
                                                        placeholder="0"
                                                        name="Amount"
                                                        value={index === 0 ? ConcessionData.Amount : concession.Amount}
                                                        onChange={(e) => handleChange(index, e)}
                                                    />
                                                    {errors[index]?.Amount && (
                                                        <span className={style?.fieldError}>{errors[index]?.Amount}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {index > 0 && (
                                                <IoCloseSharp size={25} onClick={() => handleDelete(index)} style={{ cursor: "pointer" }} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={style?.addmore}>
                                <Button startIcon={<TiPlus size={18} />} onClick={handleAddMore}>Add more</Button>
                            </div>
                            <div className={style?.RemarksDiv}>
                                <label style={{ fontSize: "14px" }}><strong>Remarks</strong></label>
                                <input type="text" className={style.academySelect} name="remarks" value={ConcessionData.remarks} onChange={(e) => handleChange(null, e)} />
                                <label style={{ fontSize: "14px" }}><strong>Attachments</strong></label>
                            </div>
                            <div className={style.filehandel}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    multiple
                                    name="Files"
                                />
                                <Button onClick={handleButtonClick}>Choose Files</Button>
                                {fileNames.length > 0 && (
                                    <div>
                                        {fileNames.map((name, index) => (
                                            <span key={index}>{name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={style.addbtnConcession} style={{ display: 'flex', gap: '16px' }}>
                                <Button submit={true}>Add</Button>
                                <Button secondary onClick={handleDialogClose}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default ConcessionDialog;
