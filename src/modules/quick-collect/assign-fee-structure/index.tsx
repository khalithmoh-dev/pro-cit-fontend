/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { ReactNode, useEffect, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import useQuickCollectStore, { StudentQuickCollect } from '../../../store/quickCollectStore';
import Button from '../../../components/button';

// Define types for `selectedStudent` and `selectedFeeStructure`
interface FeeStructure {
    academicYear: ReactNode;
    _id: string;
    fee_structure_title: string;
    fees: {
        fee_head_type: string;
        category_name: string;
        amount: number;
    }[];
}

interface Student {
    _id: string;
    display_name: string;
    facility: string;
    feeStructures: FeeStructure[];
}

interface PropsIF {
    UpdateChallanDialogOpen: boolean;
    setConcessionDialogOpen?: any;
    selectedStudent: Student; // Now typed as Student object
}

const Assignfeestructure: React.FC<PropsIF> = ({ UpdateChallanDialogOpen, setConcessionDialogOpen, selectedStudent }) => {
    const { students, getfeesrurture, getStudentFeeStructure, assignFeeStructureToStudent, selectedFeeStructure, getDepartment, Department, ParentHead, getParentHead }: any = useQuickCollectStore();

    const [isFeeStructureModalOpen, setIsFeeStructureModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId]: any = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | number>(''); // Track selected academic year

    useEffect(() => {
        getfeesrurture();
        getParentHead()
        getDepartment()
    }, [getfeesrurture, getDepartment, getParentHead]);

    const handleFeeStructureModalClose = () => {
        setIsFeeStructureModalOpen(false);
    };

    const handleRadioButtonChange = (_id: string) => {
        setSelectedStudentId(_id); // Set the selected student ID
    };

    const FeeTypes = ['CET FREE',
        'CET PAYMENT',
        'Mgmt KOD A',
        'Mgmt KOD B',
        'Mgmt KOD C',
        'Mgmt KOD D',
        'Mgmt KOD E',
        'Mgmt KOD F',
        'Mgmt KOD G',
        'Mgmt KOD H',
        'Mgmt KOD I',
        'Mgmt KOD J',
        'Mgmt KAR A',
        'Mgmt KAR B',
        'Mgmt KAR C',
        'Mgmt KAR D',
        'Mgmt NKA A',
        'Mgmt NKA B',
        'Mgmt NKA C',
        'Diploma Mgt A',
        'Mgmt KAR J',
        'DIPLOMA CET',
        'Mgmt KAR A - CV',
        'Mgmt KAR I',
        'Mgmt KAR A - ME',
        'Mgmt KOD A - ME',
        'Mgmt KOD B - ME',
        'Mgmt KAR A - CS',
        'Mgmt KOD E - ME',
        'Mgmt KAR B - CS',
        'Mgmt KAR J - CS',
        'Mgmt KOD A - CS',
        'Mgmt KOD B - CS',
        'Mgmt KOD C - CS',
        'Mgmt KOD E - CS',
        'Mgmt KOD G - CS',
        'Mgmt NKA A - CS',
        'Mgmt NKA B - CS',
        'Mgmt NKA C - CS',
        'Diploma(PYMT)',
        'Mgmt KAR E CS',
        'Mgmt KAR E',
        'Mgmt KAR F',
        'Mgmt NKA D',
        'Hostel', 'Transport', 'Hostel', 'Other'];

    const handleSetFeeStructure = async () => {
        if (!selectedStudentId) {
            return;
        }
        setLoading(true);

        try {
            const res: any = await getStudentFeeStructure(selectedStudentId);
            handleFeeStructureModalClose();
            // window.location.reload()
            if (res && res.data) {
                // You can update the state with fee structure data here
                setIsFeeStructureModalOpen(false); // Close the modal after fetching data
            }
        } catch (error) {
            console.error('Error fetching fee structure:', error);
            alert('Error fetching fee structure.');
        } finally {
            setLoading(false);
        }
    };

    const generateAcademicYears = () => {
        const academicYears: string[] = [];
        for (let year = 2001; year <= 2029; year++) {
            academicYears.push(`${year}-${year + 1}`);
        }
        return academicYears;
    };

    const handleAssignFeeStructure = async () => {
        if (!selectedStudentId || !selectedFeeStructure || !selectedAcademicYear) {
            alert('Please select a student, fee structure, and academic year.');
            return;
        }
        setLoading(true);
        try {
            await assignFeeStructureToStudent(
                selectedStudent._id,
                selectedFeeStructure._id,
                selectedAcademicYear // Pass the selected academic year
            );

            alert('Fee structure assigned successfully!');
            window.location.reload()
            setConcessionDialogOpen && setConcessionDialogOpen(false);
        } catch (error) {
            console.error('Error assigning fee structure:', error);
            alert('Error assigning fee structure.');
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {

        setConcessionDialogOpen(false); // Safe call if `setConcessionDialogOpen` is defined
    };

    return (
        <div>
            <Dialog isOpen={UpdateChallanDialogOpen} onClose={handleDialogClose} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Assign Fee Structure
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form>
                            <div className={style.studentDetails}>
                                <div className={style.UpdateChallanDetails}>
                                    <div>
                                        <label style={{ marginTop: '10px', fontWeight: "600" }}>Academic Year <span style={{ color: "red" }}></span></label>
                                        <div>{selectedStudent.feeStructures[0]?.academicYear}</div>
                                    </div>
                                    <div>
                                        <label style={{ marginTop: '10px', fontWeight: "600" }}>Group and Department  <span style={{ color: "red" }}>*</span></label>
                                        <div className={style?.inputError}>
                                            <select className={style?.selectAction} defaultValue="">
                                                <option value="" selected>Select Action</option>
                                                {Department?.map((head) => (
                                                        <option>{head.name}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ marginTop: '10px', fontWeight: "600" }}>Fee Structure  <span style={{ color: "red" }}>*</span></label>
                                    <div onClick={() => setIsFeeStructureModalOpen(true)} style={{ borderBottom: "1px solid " }}>
                                        {selectedFeeStructure?.fee_structure_title || 'Select Fee Structure'}
                                        {/* <select
                                            className={style?.assignfeeslatect}
                                            defaultValue=""
                                            onClick={() => setIsFeeStructureModalOpen(true)}
                                        >
                                            <option value="" selected></option>
                                        </select> */}
                                    </div>
                                </div>
                                {selectedFeeStructure?.fees?.length > 0 && (
                                    <>
                                        <div style={{ marginTop: '20px' }}>
                                            <table className={style.detailTable}>
                                                <thead>
                                                    <tr >
                                                        <th style={{ marginTop: '10px', fontWeight: "600" }}>Sr. No.</th>
                                                        <th style={{ marginTop: '10px', fontWeight: "600" }}>Fee Head Type</th>
                                                        <th style={{ marginTop: '10px', fontWeight: "600" }}>Fee Head Name</th>
                                                        <th style={{ marginTop: '10px', fontWeight: "600" }}>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedFeeStructure?.fees?.map((fee: any, index: number) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{fee.fee_head_type}</td>
                                                            <td>{fee.category_name}</td>
                                                            <td>{fee.amount}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Calculate the total amount */}
                                            <div style={{ marginTop: '10px', fontWeight: "600" }}>
                                                Total:
                                                {selectedFeeStructure?.fees?.reduce((total: number, fee: any) => total + fee.amount, 0).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className={style?.Generatebtn}>
                                            <Button onClick={handleAssignFeeStructure}>
                                                Assign
                                            </Button>
                                            <button className={style.Generatebtncancel} onClick={handleDialogClose}>Cancel</button>
                                        </div>
                                    </>
                                )}

                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>

            {/* Fee Structure Modal */}
            <Dialog isOpen={isFeeStructureModalOpen} onClose={handleFeeStructureModalClose} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Select Fee Structure
                    <span onClick={handleFeeStructureModalClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form>
                            <div className={style.academicYears}>
                                <div className={style.academicDetails}>
                                    <div>
                                        <label className={style?.parentGroup}>Academic Year</label>
                                        <div className={style?.inputError}>
                                            <select
                                                className="selectAction"
                                                defaultValue=""
                                                style={{ width: "183px" }}
                                                onChange={(e) => setSelectedAcademicYear(e.target.value)} // Update the state on selection change
                                            >
                                                <option value="">Select Academic Year</option>
                                                {generateAcademicYears().map((year, index) => (
                                                    <option key={index} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.academicYears} style={{ gap: "6px" }}>
                                    <div className={style.academicDetails}>
                                        <div>
                                            <label className={style?.parentGroup}>Deparment</label>
                                            <div className={style?.inputError}>
                                                <select defaultValue="" style={{ width: "183px" }}>
                                                    <option value="">Select Department</option>
                                                    {Department?.map((head) => (
                                                        <option>{head.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.academicDetails}>
                                        <div>
                                            <label className={style?.parentGroup}>Parent Group</label>
                                            <div className={style?.inputError}>
                                                <select defaultValue="" style={{ width: "183px" }}>
                                                    <option value="">Select Parent Group</option>
                                                    <option value="Computer">FIRST YEAR</option>
                                                    <option value="Electronics">SECOND YEAR</option>
                                                    <option value="Mechanical">THIRD YEAR</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.academicDetails}>
                                        <div>
                                            <label className={style?.parentGroup}>Payment Category</label>
                                            <div className={style?.inputError}>
                                                <select defaultValue="" style={{ width: "183px" }}>
                                                    <option value="">Select Payment Category</option>
                                                    <option value="Computer">CET FREE</option>
                                                    {FeeTypes?.map((head) => (
                                                        <option>{head}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.academicDetails}>
                                        <div>
                                            <label className={style?.parentGroup}>Facility </label>
                                            <div className={style?.inputError}>
                                                <select defaultValue="" style={{ width: "183px" }}>
                                                    <option value="">Select Facility</option>
                                                    <option value="Computer">Academic</option>
                                                    <option value="Electronics">Transport</option>
                                                    <option value="Mechanical">Hostel</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={style.AssignFeecancel}>Clear</button>
                                </div>
                            </div>


                        </form>
                    </div>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form>
                            <table className={style.detailTable}>
                                <thead>
                                    <tr>
                                        <td colSpan={12}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: "14px", fontWeight: 600 }}>Installments</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className={style?.tableHeadingDetail}>
                                        <th></th>
                                        <th>Facility</th>
                                        <th>Structure Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students?.map((student: StudentQuickCollect, index: number) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="radio"
                                                    onChange={() => handleRadioButtonChange(student._id as string)}
                                                    checked={selectedStudentId === student._id}
                                                />
                                            </td>
                                            <td>{student.facility}</td>
                                            <td>{student.display_name}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                            <div className={style?.Generatebtn}>
                                <Button onClick={handleSetFeeStructure} disabled={loading}>
                                    {loading ? 'Loading...' : 'Set Fee Structure'}
                                </Button>
                                <button className={style.Generatebtncancel} onClick={handleFeeStructureModalClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default Assignfeestructure;
