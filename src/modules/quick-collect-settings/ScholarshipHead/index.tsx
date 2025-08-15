import React, { ReactNode, useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import { AiOutlineCheck } from "react-icons/ai";
import { BsXLg } from 'react-icons/bs';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';

const ScholarshipHead = () => {
    const [isAddFeeHeadClicked, setIsAddFeeHeadClicked] = useState(false);
    const [parentHeadName, setParentHeadName] = useState('');  // Stores selected head group ID
    const [parentHeadNameId, setParentHeadNameId] = useState(''); // Stores selected parent head ID
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState(''); // Stores the selected radio button value
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        parentHeadName: '',
        parentHeadNameId: ''
    }); // Stores error messages for validation
    const [isEditMode, setIsEditMode] = useState(false); // State to toggle between "Add" and "Edit" modes
    const [editHeadId, setEditHeadId] = useState(''); // Store the ID of the scholarship head being edited
    const [filterStatus, setFilterStatus] = useState('');
    const { createScholarshipHead, getHeadGroup, departments, getParentHead, ParentHead, getScholarshipHead, ScholarshipHead, updateScholarshipHead }: any = useDepartmentStore();

    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                await getHeadGroup('');
                await getParentHead('');
                await getScholarshipHead(filterStatus); // Fetch the parent heads from the API
            } catch (error) {
                // Handle error here if necessary (e.g., show toast)
            }
        };
        fetchParentHeads();
    }, [getHeadGroup, getParentHead, filterStatus, getScholarshipHead]);

    const filteredScholarshipHead = ScholarshipHead?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;
    });

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

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return; // Don't submit the form if validation fails
        }

        // Create payload based on form data
        const payload = {
            name: name,
            description: description,
            fee_head_groupId: parentHeadName,  // Pass the selected head group ID
            fee_parent_headId: parentHeadNameId,  // Pass the selected parent head ID
            type: selectedType,  // Pass the selected radio value (Government or Institutional)
            status: "Active",  // You can adjust this based on the form data
        };

        try {
            let result;

            // Check if we're in edit mode and perform the corresponding API call
            if (isEditMode) {
                result = await updateScholarshipHead(editHeadId, payload); // Use the ID to update the existing scholarship head
            } else {
                result = await createScholarshipHead(payload); // Create new scholarship head
            }

            // If the API call was successful, reset the form state
            if (result) {
                // Reset the form state to blank (or default) values
                setName('');  // Reset name
                setDescription('');  // Reset description
                setParentHeadName('');  // Reset head group name
                setParentHeadNameId('');  // Reset parent head ID
                setSelectedType('');  // Reset selected type (radio button)
                setIsEditMode(false);  // Reset edit mode if required
                setEditHeadId(null);  // Reset the edit ID if needed
            }

            handleCancelClick(); // Close the form if submission was successful

        } catch (error) {
            console.error("Error during submission:", error);
            // Handle error state here if needed
        }
    };

    const handleAddFeeHeadClick = () => {
        setIsAddFeeHeadClicked(true); // Set the state to true when "Add Fee Head" is clicked
        setIsEditMode(false); // Reset to "Add" mode
    };

    const handleCancelClick = () => {
        setIsAddFeeHeadClicked(false);
        setErrors({
            name: '',
            description: '',
            parentHeadName: '',
            parentHeadNameId: ''
        }); // Hide the input form and show the initial content
        setIsEditMode(false); // Reset to "Add" mode
    };

    const handleEditClick = (head: { _id: string, name: string, description: string, fee_head_groupId: string, fee_parent_headId: string, type: string }) => {
        setIsAddFeeHeadClicked(true);
        setIsEditMode(true); // Set to "Edit" mode
        setEditHeadId(head._id); // Set the ID of the head to be edited
        setName(head.name);
        setDescription(head.description);
        setParentHeadName(head.fee_head_groupId);
        setParentHeadNameId(head.fee_parent_headId);
        setSelectedType(head.type);
    };




    return (
        <div style={{ padding: "29px" }}>
            {!isAddFeeHeadClicked && (
                <div style={{ margin: '0 3rem' }}>
                    <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Scholarship Head</div>
                    <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center"  }}>
                        <select className='academySelect' style={{ width: 'max-content' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value=''>Select Action</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>InActive</option>
                        </select>
                        <span onClick={handleAddFeeHeadClick} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
                            + Add Scholarship Head
                        </span>
                    </div>
                    {filteredScholarshipHead?.map((head: any) => (
                        <div key={head._id} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "space-between", marginTop: "30px" }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: "600" }}> {head.name}</div>
                                <div style={{ fontSize: "13px", fontWeight: "300", marginTop: "5px" }}>  {head.description}</div>
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: "300" }}>
                                <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "10px" }}></div>
                                {head.type}
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: "300", marginTop: "30px", textAlign: "end" }}>
                                <FaPen style={{ cursor: 'pointer' }} onClick={() => handleEditClick(head)} />
                            </div>
                        </div>
                    ))}
                </div >
            )}

            {isAddFeeHeadClicked && (
                <div style={{ display: "flex", gap: '8px' }}>
                    <div>
                        <label className="parentGroup"> Name<span style={{ color: "red" }}>*</span></label>
                        <input className='academySelect' id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} placeholder='Enter Name' />
                        {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
                        <span style={{ fontSize: "12px" }}>Maximum 300 characters are allowed.</span>
                    </div>

                    <div>
                        <label className="parentGroup"> Description<span style={{ color: "red" }}>*</span></label>
                        <input className='academySelect' id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} placeholder='Enter Description' />
                        {errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>}
                        <span style={{ fontSize: "12px" }}>Maximum 300 characters are allowed.</span>
                    </div>

                    <div>
                        <label className="parentGroup"> Head Group<span style={{ color: "red" }}>*</span></label>
                        <select className='academySelect' value={parentHeadName} onChange={(e) => setParentHeadName(e.target.value)}>
                            <option value="">Select Head Group</option>
                            {departments?.map((head: any) => (
                                <option key={head._id} value={head._id}>{head.head_group_name}</option>
                            ))}
                        </select>
                        {errors.parentHeadName && <div style={{ color: 'red', fontSize: '12px' }}>{errors.parentHeadName}</div>}
                    </div>

                    <div>
                        <label className="parentGroup"> Parent Head<span style={{ color: "red" }}>*</span></label>
                        <select className='academySelect' value={parentHeadNameId} onChange={(e) => setParentHeadNameId(e.target.value)}>
                            <option value="">Select Parent Head</option>
                            {ParentHead?.map((head: any) => (
                                <option key={head._id} value={head._id}>{head.parent_head_name}</option>
                            ))}
                        </select>
                        {errors.parentHeadNameId && <div style={{ color: 'red', fontSize: '12px' }}>{errors.parentHeadNameId}</div>}
                    </div>

                    <div style={{ display: "flex", gap: "5px" }}>
                        <span className="parentGroup">Government</span>
                        <div>
                            <input
                                type='radio'
                                name="scholarshipType"
                                value="Government"
                                checked={selectedType === "Government"}
                                onChange={() => setSelectedType("Government")}
                            />
                        </div>
                        <span className="parentGroup">Institutional</span>
                        <div>
                            <input
                                type='radio'
                                name="scholarshipType"
                                value="Institutional"
                                checked={selectedType === "Institutional"}
                                onChange={() => setSelectedType("Institutional")}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
                        <span onClick={handleSubmit}>
                            <AiOutlineCheck style={{ color: 'green', fontSize: '14px', cursor: "pointer" }} size={20} />
                        </span>
                        <span onClick={handleCancelClick}>
                            <BsXLg style={{ color: 'red', fontSize: '14px', cursor: "pointer" }} size={20} />
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScholarshipHead;
