import React, { useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import { AiOutlineCheck } from "react-icons/ai";
import { BsXLg } from 'react-icons/bs';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const HeadGroup = () => {
    const [parentHeadName, setParentHeadName] = useState('');
    const [isAddFeeHeadClicked, setIsAddFeeHeadClicked] = useState(false); // state to toggle visibility
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // state to handle edit modal visibility
    const [selectedHeadGroup, setSelectedHeadGroup] = useState<any>(null); // state to store selected head group for editing
    const [filterStatus, setFilterStatus] = useState('');
    const { createHeadGroup, getHeadGroup, departments, updateFeeHead, deleteFeeHead }: any = useDepartmentStore();

    useEffect(() => {
        const fetchHeadGroups = async () => {
            try {
                getHeadGroup(filterStatus); // Fetch the head groups from the API
            } catch (error) {
                // Handle error here if necessary (e.g., show toast)
            }
        };

        fetchHeadGroups();
    }, [filterStatus, getHeadGroup]);

    const filteredDepartments = departments?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;  
    });

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const payload = {
            head_group_name: parentHeadName,
            status: "Active",
        };

        if (selectedHeadGroup) {
            // If editing, update the head group
            await updateFeeHead(selectedHeadGroup._id, payload);
        } else {
            // If adding, create a new head group
            await createHeadGroup(payload);
        }

        handleCancelClick(); // Close the modal or form
    };

    const handleAddFeeHeadClick = () => {
        setIsAddFeeHeadClicked(true); // Show the add head group form
    };

    const handleCancelClick = () => {
        setIsAddFeeHeadClicked(false); // Hide the input form
        setIsEditModalOpen(false); // Close the edit modal
        setParentHeadName(''); // Reset the input field
        setSelectedHeadGroup(null); // Clear the selected head group
    };

    const handleEditClick = (headGroup: any) => {
        setSelectedHeadGroup(headGroup); // Set the selected head group for editing
        setParentHeadName(headGroup.head_group_name); // Pre-fill the input field with current data
        setIsEditModalOpen(true); // Open the edit modal
    };

    const handleDelete = (head: any) => {
        // Show confirmation or directly delete


        deleteFeeHead(head._id); // Make sure row has an id to delete

    };



    return (
        <div>
            {/* If not adding or editing, show the list of head groups */}
            {!isAddFeeHeadClicked && !isEditModalOpen && (
                <div style={{ margin: '0 3rem' }}>
                    <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Manage Head Groups</div>
                    <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center"  }}>
                        <select
                            className='academySelect'
                            style={{ width: 'max-content' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value=''>Select Status</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>InActive</option>
                        </select>
                        <span onClick={handleAddFeeHeadClick} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
                            + Add Parent Head
                        </span>
                    </div>
                    {departments.length > 0 ? (
                        <ul>
                            {filteredDepartments.map((head: any) => (
                                <div key={head._id} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "space-between", marginTop: "30px" }}>
                                    <div>
                                        <div style={{ fontSize: "16px", fontWeight: "600" }}>{head.head_group_name}</div>
                                    </div>
                                    <div style={{ fontSize: "14px", fontWeight: "300" }}>
                                        <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "10px" }}></div>
                                        {head.status}
                                    </div>
                                    <div style={{ fontSize: "14px", fontWeight: "300", marginTop: "30px",textAlign:"end", }}>
                                        <FaPen style={{cursor: 'pointer'}} onClick={() => handleEditClick(head)} />
                                             <MdDelete size={16} onClick={() => handleDelete(head)} style={{ marginLeft: '10px', cursor: 'pointer', color:"red" }} />
                                    </div>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p>No parent heads found.</p>
                    )}
                </div>
            )}

            {/* Show input for adding or editing head group */}
            {(isAddFeeHeadClicked || isEditModalOpen) && (
                <div style={{ display: "flex", gap: '8px', alignItems: "end", justifyContent: "space-between", padding: "29px" }}>
                    <div>
                        <label className="parentGroup"> Head Groups<span style={{ color: "red" }}>*</span></label>
                        <div>
                            <input
                                className='academySelect'
                                id="parent_head_name"
                                value={parentHeadName}
                                onChange={(e) => setParentHeadName(e.target.value)}
                                placeholder='Enter Head Groups'
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

export default HeadGroup;
