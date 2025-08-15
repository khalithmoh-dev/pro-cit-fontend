import React, { useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const BankAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // State to track if we're editing
    const [editingBankAccount, setEditingBankAccount]: any = useState(null); // Store the data of the row being edited
    const [parentHeadName, setParentHeadName] = useState('');
    const [parentHeadNameId, setParentHeadNameId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [HeadNameId, setHeadNameId] = useState('');
    const [nameBank, setNamebank] = useState('');
    const [descriptionBank, setDescriptionBank]: any = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const { createBankAccount, getBankAccount, BankAccount, updateBankAccount, deleteBankAccount }: any = useDepartmentStore();

    const [errors, setErrors] = useState({
        accountName: '',
        bankName: '',
        branchAddress: '',
        ifscCode: '',
        accountNumber: '',
        micrCode: '',
        branchCode: '',
    });

    const openModal = (row: any) => {
        setIsModalOpen(true);
        if (row) {
            // Populate the modal with the selected row data
            setEditingBankAccount(row);
            setParentHeadName(row.accountName);
            setParentHeadNameId(row.branchCode);
            setName(row.bankName);
            setDescription(row.branchAddress);
            setHeadNameId(row.ifscCode);
            setNamebank(row.accountNumber);
            setDescriptionBank(row.micrCode);
        } else {
            // Reset state for new entry
            setParentHeadName('');
            setParentHeadNameId('');
            setName('');
            setDescription('');
            setHeadNameId('');
            setNamebank('');
            setDescriptionBank('');
        }
        setIsEditing(!!row); // Set isEditing to true if we are editing
    };

    const closeModal = () => {
        // Reset errors and close the modal
        setErrors({
            accountName: '',
            bankName: '',
            branchAddress: '',
            ifscCode: '',
            accountNumber: '',
            micrCode: '',
            branchCode: ''
        });
        setIsModalOpen(false);
    };

    const fetchParentHeads = async () => {
        try {
            getBankAccount(filterStatus); // Fetch the parent heads from the API
        } catch (error) {
            // Handle error here if necessary (e.g., show toast)
        }
    };
    useEffect(() => {
        fetchParentHeads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    const filteredBankAccount = BankAccount?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;
    });

    // Validation logic
    const validateForm = () => {
        let valid = true;
        const validationErrors = {
            accountName: '',
            bankName: '',
            branchAddress: '',
            ifscCode: '',
            accountNumber: '',
            micrCode: '',
            branchCode: '',
        };

        if (!parentHeadName) {
            validationErrors.accountName = 'Account Name is required';
            valid = false;
        }

        if (!name) {
            validationErrors.bankName = 'Bank Name is required';
            valid = false;
        }

        if (!description) {
            validationErrors.branchAddress = 'Branch Address is required';
            valid = false;
        }

        if (!HeadNameId || HeadNameId.length !== 11) {
            validationErrors.ifscCode = 'IFSC Code must be 11 characters';
            valid = false;
        }

        if (!nameBank || nameBank.length < 9 || nameBank.length > 18) {
            validationErrors.accountNumber = 'Account Number must be between 9 and 18 digits';
            valid = false;
        }

        if (!descriptionBank || descriptionBank.length !== 9) {
            validationErrors.micrCode = 'MICR Code must be 9 digits';
            valid = false;
        }

        if (!parentHeadNameId || parentHeadNameId.length < 2 || parentHeadNameId.length > 6) {
            validationErrors.branchCode = 'Branch Code must be between 2 and 6 digits';
            valid = false;
        }

        setErrors(validationErrors);
        return valid;
    };

    const handleNamebank = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // Ensure the value is a valid positive number
        if (newValue === '' || (parseFloat(newValue) >= 0 && !isNaN(parseFloat(newValue)))) {
            setNamebank(newValue);
        }
    };


    const handleDescriptionBank = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === '' || (parseFloat(newValue) >= 0 && !isNaN(parseFloat(newValue)))) {
            setDescriptionBank(newValue);
        }
    };


    const handleParentHeadNameId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === '' || (parseFloat(newValue) >= 0 && !isNaN(parseFloat(newValue)))) {
            setParentHeadNameId(newValue);
        }
    };
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!validateForm()) {
            return; // Don't submit the form if validation fails
        }
        const payload = {
            accountName: parentHeadName,
            bankName: name,
            branchAddress: description,
            ifscCode: HeadNameId,
            accountNumber: nameBank,
            micrCode: descriptionBank,
            branchCode: parentHeadNameId,
            status: "Active"
        };
        if (isEditing && editingBankAccount) {
            const result = await updateBankAccount(editingBankAccount._id, payload); // Pass the ID for update
            if (result) {
                closeModal();
            }
        } else {
            const result = await createBankAccount(payload);
            if (result) {
                closeModal();
            }
        }
    };

    const handleDelete = (row: any) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the account ${row.accountName}?`);
        if (confirmDelete) {
            deleteBankAccount(row._id); // Make sure row has an id to delete
        }
    };

    return (
        <div>
            <div style={{ margin: '0 3rem' }}>
                <div style={{ fontSize: "20px", fontWeight: "300" }}>Bank Account</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <select
                        className='academySelect'
                        style={{ width: 'max-content' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value=''>Select Status</option>
                        <option value='Active'>Active</option>
                        <option value='Inactive'>InActive</option>
                    </select>
                    <span onClick={() => openModal(null)} className='add' style={{ cursor: "pointer", width: "185", display: "flex", fontSize: "16px", fontWeight: "300" }}>
                        + Add Bank Account
                    </span>
                </div>
                <div>
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <p style={{ backgroundColor: "#0465ac", padding: "14px", color: "white", display: "flex", justifyContent: "space-between" }}>
                                    {isEditing ? 'Edit Bank Account' : 'Add Bank Account'} <span onClick={closeModal}>X</span>
                                </p>
                                <div style={{ padding: "16px", overflow: "scroll", height: "600px" }}>
                                    {/* Account Name */}
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> Account Name<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter Account Name' id="parent_head_name"
                                            value={parentHeadName}
                                            onChange={(e) => setParentHeadName(e.target.value)} />
                                        {errors.accountName && <span style={{ color: 'red' }}>{errors.accountName}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>Maximum 100 characters are allowed.</span>
                                    </div>

                                    {/* Bank Name */}
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> Bank Name<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter Bank Name'
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)} />
                                        {errors.bankName && <span style={{ color: 'red' }}>{errors.bankName}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>Maximum 50 characters are allowed.</span>
                                    </div>

                                    {/* Branch Address */}
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> Branch Address<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter Branch Address'
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)} />
                                        {errors.branchAddress && <span style={{ color: 'red' }}>{errors.branchAddress}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>Maximum 100 characters are allowed.</span>
                                    </div>
                                    {/* IFSC Code */}
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> IFSC Code<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter IFSC Code'
                                            id="HeadNameId"
                                            value={HeadNameId}
                                            onChange={(e) => setHeadNameId(e.target.value)} />
                                        {errors.ifscCode && <span style={{ color: 'red' }}>{errors.ifscCode}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>(Only 11 characters are allowed.)</span>
                                    </div>
                                    {/* Account Number */}
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> Account Number<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter Account Number'
                                            id="nameBank"
                                            value={nameBank}
                                            type='number'
                                            // onChange={(e) => setNamebank(e.target.value)} 
                                            onChange={handleNamebank}
                                            required

                                            min="0" />
                                        {errors.accountNumber && <span style={{ color: 'red' }}>{errors.accountNumber}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>(Minimum 9 and maximum 18 digits are allowed.)</span>
                                    </div>
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> MICR Code<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter MICR Code'
                                            id="descriptionBank"
                                            value={descriptionBank}
                                            type='number'
                                            onChange={handleDescriptionBank}
                                            required
                                            min="0" />
                                        {errors.micrCode && <span style={{ color: 'red' }}>{errors.micrCode}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>(Only 9 digits are allowed.)</span>
                                    </div>
                                    <div>
                                        <label className="parentGroup" style={{ fontWeight: "600", marginTop: "15px" }}> Branch Code<span style={{ color: "red" }}>*</span></label>
                                        <input className='academySelect' placeholder='Enter Branch Code'
                                            id="parentHeadNameId"
                                            value={parentHeadNameId}
                                            type='number'
                                            onChange={handleParentHeadNameId}
                                            required
                                            min="0" />
                                        {errors.branchCode && <span style={{ color: 'red' }}>{errors.branchCode}</span>}
                                    </div>
                                    <div> <span style={{ fontSize: "12px", alignItems: "center", display: "flex", marginTop: "6px" }}>(Minimum 2 and maximum 6 digits are allowed.)</span>
                                    </div>

                                    <div className='buttonnote'>
                                        <button className="cancel" onClick={closeModal}>Cancel</button>
                                        <button className="add" onClick={handleSubmit}>Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <table style={{ width: '100%', marginTop: '20px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ fontSize: "13px", fontWeight: "400", backgroundColor: "#f5f7fb" }}>
                            <th></th>
                            <th>Sr.No</th>
                            <th>Account Name</th>
                            <th>Bank Name</th>
                            <th>Account Number</th>
                            <th>Branch Code</th>
                            <th>IFSC Code</th>
                            <th>MICR Code</th>
                            <th>Branch Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBankAccount?.map((row: any, index: any) => (
                            <tr key={index} style={{ fontSize: "13px", fontWeight: "300" }}>
                                <td><input type='checkbox' /></td>
                                <td>{index + 1}</td>
                                <td>{row.accountName}</td>
                                <td>{row.bankName}</td>
                                <td>{row.accountNumber}</td>
                                <td>{row.branchCode}</td>
                                <td>{row.ifscCode}</td>
                                <td>{row.micrCode}</td>
                                <td>{row.branchAddress}</td>
                                <td>
                                    <FaPen style={{ cursor: 'pointer' }} onClick={() => openModal(row)} />

                                    <MdDelete size={16} onClick={() => handleDelete(row)} style={{ marginLeft: '10px', cursor: 'pointer', color: "red" }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BankAccount;
