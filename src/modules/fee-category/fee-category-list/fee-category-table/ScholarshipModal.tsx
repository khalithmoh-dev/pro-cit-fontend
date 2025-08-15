import React, { useEffect, useState } from 'react';
import style from "../fee-category.module.css";
import RichEditorIcon from '../../../../icon-components/RichEditor';
import DeleteIcon from '../../../../icon-components/DeleteIcon';
import { Link } from 'react-router-dom';
import { IoChevronBackCircle } from 'react-icons/io5';
import addFeeStructure from '../../../../store/addFeeStructure';
import CloseIcon from '../../../../icon-components/CloseIcon';

const feeCategories = [
    'INSURANCE', 'TUITION FEES AND OTHERS', 'COLLEGE REGISTRATION FEES',
    'E LEARNING FEES', 'ELIGIBILITY FEES', 'ERP', 'STUDENTS BUS PASS',
    'STUDENTS BANK LOAN', 'TEACHERS DAY STAMP', 'UNIVERSITY REGISTRATION FEES',
    'VTU FEES', 'APPLICATION FEES', 'MEMBERSHIP FEES', 'STUDENT SPORTS FEE',
    'STUDENT SPORTS DEVELOPMENT', 'CG&C Fee', 'UNIVERSITY DEVELOPMENT FEE',
    'PICA FEE', 'TEACHERS DEVELOPMENT FEE', 'STUDENT DEVELOPMENT FEE',
    'INDIAN RED CROSS', 'WOMEN CELL', 'NSS FEE'
];

interface ScholarshipModalProps {
    scholarshipData: any;
    onClose: () => void;
}

const ScholarshipModal: React.FC<ScholarshipModalProps> = ({ scholarshipData, onClose }) => {
    const [isModalOpen, setIsModalOpen]: any = useState(false);
    const [isModalOpenEdit, setisModalOpenEdit]: any = useState(false);
    const [amounts, setAmounts]: any = useState<{ [key: string]: string }>({});
    const [feesList, setFeesList]: any = useState<{ feeName: string, amount: string }[]>([]);
    const [modalData, setModalData]: any = useState<{ categoryName: string, amount: string }>({ categoryName: '', amount: '' });
    const [errorMessage, setErrorMessage]: any = useState<string | null>(null);
    const [successMessage, setSuccessMessage]: any = useState<string | null>(null);


    console.log(scholarshipData, "scholarshipDatascholarshipData");

    // Handle the change in amount input for each category
    const handleAmountChange = (category: string, value: string) => {
        setAmounts((prevAmounts: any) => ({
            ...prevAmounts,
            [category]: value,
        }));
    };
    const { createFeeAddStructure, deleteFeeCategory, createFeeCategoryUpdate, getAllFeeStructure, studentfeestructure } = addFeeStructure();
    const abcStudent = studentfeestructure?.find((item) => item?._id === scholarshipData?._id)
    console.log("abcStudentabcStudentabcStudent", abcStudent);

    useEffect(() => {
        const fetchData = async () => {
            getAllFeeStructure('','','')
        };
        fetchData();
    }, [getAllFeeStructure]);
    console.log(studentfeestructure, "studentfeestructure")
    const handleAdd = async (category: string) => {
        const amount = amounts[category];
        if (amount && !isNaN(parseFloat(amount))) {
            const feeCategoryData = {
                category_name: category,
                amount: Number(parseFloat(amount).toFixed(2)),
            };

            const feeStructureId = abcStudent._id;
            const success = await createFeeAddStructure(feeStructureId, feeCategoryData);

            if (success) {
                closeModal();
                setAmounts((prevAmounts: any) => ({
                    ...prevAmounts,
                    [category]: '',
                }));
                setFeesList((prevFees: any) => [...prevFees, { feeName: category, amount: feeCategoryData.amount.toString() }]);
            } else {
                getAllFeeStructure('','','')
                studentfeestructure()
                closeModal();
            }
        }
    };

    const openEditModal = (categoryName: string, amount: string) => {
        setModalData({ categoryName, amount });
        setisModalOpenEdit(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setisModalOpenEdit(false);
    };

    const closeStructureModal = () => {
        onClose();
    };


    const handleDeleteClick = async (_id: string, categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete the fee category: ${categoryName}?`)) {
            await deleteFeeCategory(_id, categoryName);
        }
    };

    const handleUpdateClick = async () => {
        if (modalData.amount && !isNaN(modalData.amount)) {
            const data = { amount: modalData.amount };
            const isUpdated = await createFeeCategoryUpdate(abcStudent._id, modalData.categoryName, data);

            if (isUpdated) {
                setSuccessMessage('Fee category updated successfully!');
                setisModalOpenEdit(false);
                // Optionally refresh fee structure or perform other necessary updates
            } else {
                setErrorMessage('Failed to update fee category. Please try again.');
            }
        } else {
            setErrorMessage('Please enter a valid amount.');
        }
    };

    const selectedCategories = abcStudent?.fees.map(fee => fee.category_name);

    const availableCategories = feeCategories.filter(category => !selectedCategories.includes(category));

    return (
        <div className={style.modalBackdrop}>
            <div className={style.modal}>
                <div>
                    <span style={{ alignItems: "center", display: "flex", gap: "6px", fontSize: "24px" }}>
                        <span style={{ marginTop: "8px" }} onClick={closeStructureModal}><IoChevronBackCircle /></span>
                        Configure Fee Structure - {abcStudent?.admission_year}-{abcStudent?.fee_structure_title} (PYMT)-{abcStudent?.academic_year}(REGULAR)
                    </span>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: 'white', padding: "8px" }}>
                        <button style={{ padding: "8px", backgroundColor: "#1a81c1", color: "white", border: "none" }}>Action</button>
                        <Link onClick={openModal} to={''}>Configure Fee Type</Link>
                    </div>
                    <table className={style.detailTable}>
                        <thead>
                            <tr>
                                <td colSpan={6}></td>
                            </tr>
                            <tr className={style?.tableHeadingDetail}>
                                <th>Sr.No</th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Gateway Bank Account</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {abcStudent.fees.map((fee: { category_name: any; amount: any }, index: React.Key | null | undefined) => (
                                <tr key={index}>
                                    <td className={style?.tableHeadingDetail}>{(index as number) + 1}</td>
                                    <td className={style.feetable}>{fee.category_name}</td>
                                    <td className={style.feetable}>{fee?.amount}</td>
                                    <td></td>
                                    <td>
                                        <span onClick={() => openEditModal(fee.category_name, fee.amount)}>
                                            <RichEditorIcon />
                                        </span>
                                        <span onClick={() => handleDeleteClick(abcStudent._id, fee.category_name)}>
                                            <DeleteIcon />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <span>Scholarship List</span>
                <table className={style.detailTable}>
                    <thead>
                        <tr>


                        </tr>
                        <tr className={style?.tableHeadingDetail}>
                            <th><input
                                type='checkbox' /></th>
                            <th>Sr. No</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Gateway Bank Account</th>
                            <th>Action</th>

                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>No data available.</td>
                            <td>
                            </td>
                            <td></td>
                            <td>
                            </td>
                            <td></td>
                            <td></td></tr>
                    </tbody>
                </table>

                <span>Fine List</span>
                <table className={style.detailTable}>
                    <thead>
                        <tr>


                        </tr>
                        <tr className={style?.tableHeadingDetail}>
                            <th><input
                                type='checkbox' /></th>
                            <th>Sr. No</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Gateway Bank Account</th>
                            <th>Action</th>

                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>No data available.</td>
                            <td>
                            </td>
                            <td></td>
                            <td>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td></tr>
                    </tbody>
                </table>

                {isModalOpen && (
                    <div className={style.modalBackdrop}>
                        <div className={style.modalsecond}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0465ac", color: 'white', padding: "8px" }}>
                                <h2 onClick={openModal}>Configure Fee Type</h2>
                                <span onClick={closeModal}><CloseIcon /></span>
                            </div>
                            <form style={{ padding: "20px" }}>
                                <table className={style.detailTable}>
                                    <thead>
                                        <tr>
                                            <th>Fee Category</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availableCategories.map((category) => (
                                            <tr key={category}>
                                                <td>{category}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={amounts[category] || ''}
                                                        onChange={(e) => handleAmountChange(category, e.target.value)}
                                                        placeholder="Enter amount"
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAdd(category)}
                                                        style={{ padding: '5px 10px', backgroundColor: '#1a81c1', color: 'white', border: 'none' }}
                                                    >
                                                        Add
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
                            <button style={{ padding: "8px", backgroundColor: "#1a81c1", color: "white", border: "none", marginTop: '20px' }} onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}

                {isModalOpenEdit && (
                    <div className={style.modalBackdrop}>
                        <div className={style.modalsecond}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0465ac", color: 'white', padding: "8px" }}>
                                <h2>Edit Fee Category</h2>
                                <span onClick={closeEditModal}><CloseIcon /></span>
                            </div>
                            <form style={{ padding: "20px" }}>
                                <table className={style.detailTable}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>{modalData.categoryName}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={modalData.amount || 0}
                                                    onChange={(e) => setModalData({ ...modalData, amount: Number(parseFloat(e.target.value)) })}
                                                    placeholder="Enter amount"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={handleUpdateClick}
                                                    style={{ padding: '5px 10px', backgroundColor: '#1a81c1', color: 'white', border: 'none' }}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



export default ScholarshipModal;
