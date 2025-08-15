import React, { useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import { AiOutlineCheck } from "react-icons/ai";
import { BsXLg } from 'react-icons/bs';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const PaymentMode = () => {
    const [isAddFeeHeadClicked, setIsAddFeeHeadClicked] = useState(false); // state to toggle visibility
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // state to handle edit modal visibility
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<any>(null); // state to store selected payment mode data
    const [parentHeadName, setParentHeadName] = useState(''); // state to store payment mode name for both add and edit

    const { createPaymentMode, getPaymentMode, PaymentMode, updatePaymentMode, deletePaymentMode }: any = useDepartmentStore();
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                getPaymentMode(filterStatus); // Fetch the payment modes from the API
            } catch (error) {
                // Handle error here if necessary (e.g., show toast)
            }
        };

        fetchParentHeads();
    }, [getPaymentMode,filterStatus]);

    const filteredPaymentMode = PaymentMode?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;  
    });

    const handleAddFeeHeadClick = () => {
        setIsAddFeeHeadClicked(true); // set the state to true when "Add Fee Head" is clicked
    };

    const handleCancelClick = () => {
        setIsAddFeeHeadClicked(false); // Hide the input form and show the initial content
        setIsEditModalOpen(false); // Close edit modal if open
        setParentHeadName(''); // Reset the name field
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const payload = {
            modeName: parentHeadName,
            status: "Active",
        };

        if (selectedPaymentMode) {
            // If editing, update the payment mode
            await updatePaymentMode(selectedPaymentMode._id, payload);
            handleCancelClick()
        } else {
            // If adding, create a new payment mode
            await createPaymentMode(payload);
        }

        handleCancelClick(); // Close the form or modal
    };

    const handleEditClick = (paymentMode: any) => {
        setSelectedPaymentMode(paymentMode); // Set the selected payment mode to be edited
        setParentHeadName(paymentMode.modeName); // Set the mode name in the input field
        setIsEditModalOpen(true); // Open the edit modal
    };


    const handleDelete = (head: any) => {
        // Show confirmation or directly delete


        deletePaymentMode(head._id); // Make sure row has an id to delete

    };

    return (
        <div>
            {!isAddFeeHeadClicked && !isEditModalOpen && (
                <div style={{ margin: '0 3rem' }}>
                    <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Manage Payment Mode</div>
                    <div style={{ display: "flex", justifyContent: "space-between" ,alignItems:"center" }}>
                        <select
                            className='academySelect'
                            style={{ width: 'max-content' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value=''>Select Action</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>InActive</option>
                        </select>
                        <span onClick={handleAddFeeHeadClick} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
                            + Add Payment Mode
                        </span>
                    </div>

                    {filteredPaymentMode?.map((head: any) => (
                        <div key={head._id} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "space-between", marginTop: "30px", alignItems: "center" }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: "600" }}>{head.modeName}</div>
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
                </div>
            )}

            {(isAddFeeHeadClicked || isEditModalOpen) && (
                <div style={{ display: "flex", gap: '8px', alignItems: "end", justifyContent: "space-between", padding: "29px" }}>
                    <div>
                        <label className="parentGroup"> Payment Mode<span style={{ color: "red" }}>*</span></label>
                        <div>
                            <input
                                className='academySelect'
                                placeholder='Enter Payment Mode'
                                id="parent_head_name"
                                value={parentHeadName}
                                onChange={(e) => setParentHeadName(e.target.value)}
                            />
                        </div>
                        <div>
                            <span style={{ fontSize: "12px" }}>Maximum 100 characters are allowed.</span>
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

export default PaymentMode;
