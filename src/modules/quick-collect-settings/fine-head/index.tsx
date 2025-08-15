import React, { ReactNode, useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import { AiOutlineCheck } from "react-icons/ai";
import { BsXLg } from 'react-icons/bs';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const FeeHead = () => {
    const [parentHeadName, setParentHeadName] = useState('');          // Stores selected head group ID
    const [parentHeadNameId, setParentHeadNameId] = useState('');      // Stores selected parent head ID
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isAddFeeHeadClicked, setIsAddFeeHeadClicked] = useState(false); // State to toggle visibility
    const [isEditMode, setIsEditMode] = useState(false); // State to toggle between add and edit modes
    const [editFeeHeadId, setEditFeeHeadId] = useState<string>(''); // Stores the ID of the fee head being edited
    const [filterStatus, setFilterStatus] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        parentHeadName: '',
        parentHeadNameId: ''
    }); // Stores error messages for validation
    const { getHeadGroup, departments, getParentHead, ParentHead, getfeefine, feefine, deleteFineHead, createFeeHead, updateFineHead }: any = useDepartmentStore();

    console.log(feefine, "feefine");

    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                await getHeadGroup('');
                await getParentHead('');
                await getfeefine(filterStatus); // Fetch the parent heads from the API
            } catch (error) {
                // Handle error here if necessary (e.g., show toast)
            }
        };
        fetchParentHeads();
    }, [filterStatus, getHeadGroup, getParentHead, getfeefine]);

    const filteredFeefine = feefine?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;  
    });


    // Handle form validation
    const validateForm = () => {
        let valid = true;
        let validationErrors = {
            name: '',
            description: '',
            parentHeadName: '',
            parentHeadNameId: ''
        };

        if (!name) {
            validationErrors.name = 'Name is required';
            valid = false;
        }

        if (!description) {
            validationErrors.description = 'Description is required';
            valid = false;
        }

        if (!parentHeadName) {
            validationErrors.parentHeadName = 'Head Group is required';
            valid = false;
        }

        if (!parentHeadNameId) {
            validationErrors.parentHeadNameId = 'Parent Head is required';
            valid = false;
        }

        setErrors(validationErrors);
        return valid;
    };

    // Handle form submission (add or update)
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // Don't submit the form if validation fails
        }

        // Prepare the payload
        const payload = {
            name: name,
            description: description,
            fee_head_groupId: parentHeadName,  // Pass the selected head group ID
            fee_parent_headId: parentHeadNameId,  // Pass the selected parent head ID
            status: "Active",  // You can adjust this based on the form data
        };

        console.log(payload, "payload"); // Log payload for debugging

        if (isEditMode) {
            // If in edit mode, update the Fee Head
            const result = await updateFineHead(editFeeHeadId, payload);
            if (result) {
                handleCancelClick(); // Close the form after successful update
            }
        } else {
            // If in add mode, create a new Fee Head
            const result = await createFeeHead(payload);
            if (result) {
                handleCancelClick(); // Close the form after successful creation
            }
        }
    };

    // Handle the click to show the Add Fee Head form
    const handleAddFeeHeadClick = () => {
        setIsAddFeeHeadClicked(true);
        setIsEditMode(false); // Set to "Add" mode
        setName('');
        setDescription('');
        setParentHeadName('');
        setParentHeadNameId('');
    };

    // Handle the click to cancel the Add Fee Head form
    const handleCancelClick = () => {
        setIsAddFeeHeadClicked(false); // Hide the form when canceled
    };

    // Handle the click to edit an existing Fee Head
    const handleEditClick = (head: { _id: string; name: string; description: string; fee_head_groupId: string; fee_parent_headId: string; }) => {
        setIsAddFeeHeadClicked(true);
        setIsEditMode(true); // Set to "Edit" mode
        setEditFeeHeadId(head._id); // Set the ID of the fee head to be edited
        setName(head.name);
        setDescription(head.description);
        setParentHeadName(head.fee_head_groupId);
        setParentHeadNameId(head.fee_parent_headId);
    };


    const handleDelete = (head: any) => {
        // Show confirmation or directly delete


        deleteFineHead(head._id); // Make sure row has an id to delete

    };

    return (
        <div style={{ padding: "29px" }}>
            {/* Display the main interface or "Add Fee Head" form */}
            {!isAddFeeHeadClicked && (
                <div style={{ margin: '0 3rem' }}>
                    <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Fine Head</div>
                    <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center" }}>
                        <select className='academySelect' style={{ width: 'max-content' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value=''>Select Action</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>InActive</option>
                        </select>
                        <span onClick={handleAddFeeHeadClick} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
                            + Add Fine Head
                        </span>
                    </div>
                    {filteredFeefine.map((head: any) => (
                        <div key={head._id} style={{ display: "flex", justifyContent: "space-between", marginTop: "30px",alignItems:"center" }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: "600" }}>{head.name}</div>
                                <div style={{ fontSize: "13px", fontWeight: "300", marginTop: "5px" }}>{head.description}</div>
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: "300" }}>
                                <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "10px" }}></div>
                                {head.amount}
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: "300" }}>
                                <FaPen style={{cursor: 'pointer'}} onClick={() => handleEditClick(head)} />
                                <MdDelete size={16} onClick={() => handleDelete(head)} style={{ marginLeft: '10px', cursor: 'pointer', color: "red" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Fee Head Form */}
            {isAddFeeHeadClicked && (
                <div style={{ display: "flex", gap: '8px' }}>
                    {/* Name input */}
                    <div>
                        <label className="parentGroup"> Name<span style={{ color: "red" }}>*</span></label>
                        <div>
                            <input className='academySelect'
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter Name' />
                        </div>
                        {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
                        <div><span style={{ fontSize: "12px" }}>Maximum 300 characters are allowed.</span></div>
                    </div>

                    {/* Description input */}
                    <div>
                        <label className="parentGroup"> Description<span style={{ color: "red" }}>*</span></label>
                        <div>
                            <input className='academySelect'
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Enter Description' />
                        </div>
                        {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
                        <div><span style={{ fontSize: "12px" }}>Maximum 300 characters are allowed.</span></div>
                    </div>

                    {/* Head Group selection */}
                    <div>
                        <label className="parentGroup"> Head Group<span style={{ color: "red" }}>*</span></label>
                        <select className='academySelect' value={parentHeadName} onChange={(e) => setParentHeadName(e.target.value)}>
                            <option value="">Select Head Group</option>
                            {departments?.map((head: { _id: any; head_group_name: string }) => (
                                <option key={head._id} value={head._id}>{head.head_group_name}</option>
                            ))}
                        </select>
                        {errors.parentHeadName && <div style={{ color: 'red', fontSize: '12px' }}>{errors.parentHeadName}</div>}
                    </div>

                    {/* Parent Head selection */}
                    <div>
                        <label className="parentGroup">
                            Parent Head<span style={{ color: "red" }}>*</span></label>
                        <select className='academySelect' value={parentHeadNameId} onChange={(e) => setParentHeadNameId(e.target.value)}>
                            <option value="">Select Parent Head</option>
                            {ParentHead?.map((head: { _id: string; parent_head_name: ReactNode }) => (
                                <option key={head._id} value={head._id}>{head.parent_head_name}</option>
                            ))}
                        </select>
                        {errors.parentHeadNameId && <div style={{ color: 'red', fontSize: '12px' }}>{errors.parentHeadNameId}</div>}
                    </div>

                    {/* Save/Cancel buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap:"10px"}}>
                        <span onClick={handleSubmit}><AiOutlineCheck style={{ color: 'green', fontSize: '14px', cursor: "pointer" }} size={20} /></span>
                        <span onClick={handleCancelClick}><BsXLg style={{ color: 'red', fontSize: '14px', cursor: "pointer" }} size={20} /></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeHead;
