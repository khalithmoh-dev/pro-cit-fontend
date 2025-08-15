import React, { useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import { AiOutlineCheck } from "react-icons/ai";
import { BsXLg } from 'react-icons/bs';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const ParentHead = () => {
    const [isAddFeeHeadClicked, setIsAddFeeHeadClicked] = useState(false);  // state for adding new parent head
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // state for handling edit modal visibility
    const [parentHeadName, setParentHeadName] = useState('');  // state for the name of the parent head
    const [selectedParentHead, setSelectedParentHead] = useState<any>(null);  // state to store the selected parent head for editing
    const [filterStatus, setFilterStatus] = useState('');
    const { createParentHead, getParentHead, ParentHead, updateParentHead, deleteParentHead }: any = useDepartmentStore();

    const fetchParentHeads = async () => {
        try {
          await getParentHead(filterStatus); // Fetch data based on selected filter
        } catch (error) {
          console.error("Error fetching parent heads:", error);
        }
      };
    
      useEffect(() => {
        fetchParentHeads();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [filterStatus]);

    const filteredParentHeads = ParentHead?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;  
    });

    // Submit function for creating or updating the parent head
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const payload = {
            parent_head_name: parentHeadName,
            status: "Active",
        };

        if (selectedParentHead) {
            // If editing, update the existing parent head
            await updateParentHead(selectedParentHead._id, payload);
        } else {
            // If adding, create a new parent head
            await createParentHead(payload);
        }

        handleCancelClick();  // Reset and close the modal
    };

    // Show the input form for adding new parent head
    const handleAddFeeHeadClick = () => {
        setIsAddFeeHeadClicked(true);
    };

    // Close the add/edit form
    const handleCancelClick = () => {
        setIsAddFeeHeadClicked(false);
        setIsEditModalOpen(false);
        setParentHeadName('');
        setSelectedParentHead(null);  // Reset the selected parent head
    };

    // Open the edit modal and pre-fill the fields with the existing data
    const handleEditClick = (head: any) => {
        setSelectedParentHead(head);  // Set the selected parent head for editing
        setParentHeadName(head.parent_head_name);  // Pre-fill the input field with the existing name
        setIsEditModalOpen(true);  // Open the edit modal
    };



    const handleDelete = (head: any) => {
        // Show confirmation or directly delete


        deleteParentHead(head._id); // Make sure row has an id to delete

    };



    return (
        <div>
            {/* Show the list of parent heads or the "Add" button */}
            {!isAddFeeHeadClicked && !isEditModalOpen && (
                <div style={{ margin: '0 3rem' }}>
                    <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Manage Parent Head</div>
                    <div style={{ display: "flex", justifyContent: "space-between" ,alignItems:"center" }}>
                        <select className='academySelect' style={{ width: 'max-content' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value=''>Select Action</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </select>
                        <span onClick={handleAddFeeHeadClick} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
                            + Add Parent Head
                        </span>
                    </div>
                    {filteredParentHeads?.length > 0 ? (
            <ul>
                {filteredParentHeads.map((head: any) => (
                    <div key={head._id} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "space-between", marginTop: "30px" }}>
                        <div>
                            <div style={{ fontSize: "16px", fontWeight: "600" }}>{head.parent_head_name}</div>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "300" }}>
                            <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "10px" }}></div>
                            {head.status}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "300", marginTop: "30px", textAlign: "end" }}>
                            <FaPen style={{ cursor: 'pointer' }} onClick={() => handleEditClick(head)} />
                            <MdDelete size={16} onClick={() => handleDelete(head)} style={{ marginLeft: '10px', cursor: 'pointer', color: "red" }} />
                        </div>
                    </div>
                ))}
            </ul>
        ) : (
            <p>No parent heads found.</p>
        )}
                </div>
            )}

            {/* Show the input form for adding or editing parent head */}
            {(isAddFeeHeadClicked || isEditModalOpen) && (
                <div style={{ display: "flex", gap: '8px', alignItems: "end", justifyContent: "space-between", padding: "29px" }}>
                    <div>
                        <label className="parentGroup">Parent Head<span style={{ color: "red" }}>*</span></label>
                        <input
                            className='academySelect'
                            type="text"
                            id="parent_head_name"
                            value={parentHeadName}
                            onChange={(e) => setParentHeadName(e.target.value)}
                            required
                            placeholder='Enter Parent Head'
                        />
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

export default ParentHead;
