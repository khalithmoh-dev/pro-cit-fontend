import React, { useEffect, useState } from 'react';
import '../fee-head-settings/quick-collect-settings.css';
import { AiOutlineCheck } from "react-icons/ai";
import { BsXLg } from 'react-icons/bs';
import useDepartmentStore from '../../../store/quickcollectsettingStore';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const ConcessionType = () => {
    const [isAddFeeHeadClicked, setIsAddFeeHeadClicked] = useState(false);
    const [editConcessionId, setEditConcessionId] = useState<string | null>(null); // To track which concession to edit
    const [parentHeadName, setParentHeadName] = useState('');
    const [description, setDescription] = useState('');
    const [amountType, setAmountType] = useState('');
    const [amount, setAmount] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const { createconcession, concessionget, getconcession, updateConcessiion, deleteConsessionType }: any = useDepartmentStore();

    const fetchParentHeads = async () => {
        try {
            await getconcession(filterStatus); // Fetch concessions on component load
        } catch (error) {
            console.error("Error fetching concessions", error);
        }
    };
    useEffect(() => {
        fetchParentHeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, getconcession]);
    
    const filteredConcessionget = concessionget?.filter((head: any) => {
        if (filterStatus === "Active") {
            return head.status === "Active";  // Only show active status
        } else if (filterStatus === "Inactive") {
            return head.status === "Inactive";  // Only show Inactive status
        }
        return true;  
    });


    const handleAddFeeHeadClick = () => {
        setIsAddFeeHeadClicked(true);
        setEditConcessionId(null); // Reset edit state
        setParentHeadName('');
        setDescription('');
        setAmountType('');
        setAmount('');
    };

    const handleCancelClick = () => {
        setIsAddFeeHeadClicked(false);
        setEditConcessionId(null); // Reset edit state
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // Ensure the value is a valid positive number
        if (newValue === '' || (parseFloat(newValue) >= 0 && !isNaN(parseFloat(newValue)))) {
            setAmount(newValue);
        }
    };

    const handleEditClick = (head: any) => {
        setIsAddFeeHeadClicked(true);
        setEditConcessionId(head._id); // Set the ID of the concession to edit
        setParentHeadName(head.name);
        setDescription(head.description);
        setAmountType(head.amount_type);
        setAmount(head.amount);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        // Directly prevent form submission from refreshing the page
        event.preventDefault();

        // Parse the amount (assuming it's a string or a number)
        const parsedAmount = parseFloat(amount);

        const payload = {
            name: parentHeadName,
            description: description,
            amount_type: amountType,
            amount: parsedAmount, // Amount will be sent as a number or string, without additional validation
            status: "Active", // Default status set to Active
        };

        try {
            let result;

            if (editConcessionId) {
                // If editing an existing concession
                result = await updateConcessiion(editConcessionId, payload); // Pass the ID and payload to the update API
                if (result) {
                    console.log("Concession updated successfully");
                } else {
                    console.error("Error updating concession");
                }
            } else {
                // If creating a new concession
                result = await createconcession(payload); // Pass the payload to the create API
                if (result) {
                    console.log("Concession created successfully");
                } else {
                    console.error("Error creating concession");
                }
            }

            // Reset form state after success
            if (result) {
                setParentHeadName('');  // Reset parent head name field
                setDescription('');  // Reset description field
                setAmount('');  // Reset amount field
                setAmountType('');  // Reset amount type field
                setEditConcessionId(null);  // Reset the editConcessionId for future creations
            }

            // Close the form or perform any additional cleanup after a successful API call
            handleCancelClick(); // Reset or close the form

        } catch (error) {
            console.error("API call failed", error);
            // Handle error state here if necessary
        }
    };

    const handleDelete = (head: any) => {
        // Show confirmation or directly delete


        deleteConsessionType(head._id); // Make sure row has an id to delete

    };



    return (
        <div style={{ padding: "29px" }}>
            {!isAddFeeHeadClicked && (
                <div style={{ margin: '0 3rem' }}>
                    <div style={{ fontSize: "20px", fontWeight: "300", marginBottom: "10px" }}>Concession Type</div>
                    <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center"  }}>
                        <select className='academySelect' style={{ width: 'max-content' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value=''>Select Action</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>InActive</option>
                        </select>
                        <span onClick={handleAddFeeHeadClick} style={{ cursor: "pointer", width: "185", display: "flex", color: "#0d6efd", fontSize: "16px", fontWeight: "300" }}>
                            + Add Concession Type
                        </span>
                    </div>
                    {filteredConcessionget.map((head: any) => (
                        <div key={head._id} className="grid-container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyContent: "space-between", marginTop: "30px", alignItems: "center", padding: "8px" }}>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: "600" }}> {head.name}</div>
                                <div style={{ fontSize: "13px", fontWeight: "300", marginTop: "5px" }}>  {head.description}</div>
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: "300" }}>
                                <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "10px" }}>Amount</div>
                                <span style={{ marginTop: "5px", display: "flex" }}> {head.amount}</span>
                            </div>
                            <div style={{ fontSize: "14px", textAlign: "end", fontWeight: "300", marginTop: "30px" }}>
                                <FaPen style={{ cursor: 'pointer' }} onClick={() => handleEditClick(head)} />
                                <MdDelete size={16} onClick={() => handleDelete(head)} style={{ marginLeft: '10px', cursor: 'pointer', color: "red" }} />

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAddFeeHeadClicked && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", gap: '8px' }}>
                            <div>
                                <label className="parentGroup"> Name<span style={{ color: "red" }}>*</span></label>
                                <input className='academySelect'
                                    id="name"
                                    value={parentHeadName}
                                    onChange={(e) => setParentHeadName(e.target.value)}
                                    required placeholder='Enter Name' />
                                <div><span style={{ fontSize: "12px" }}>Maximum 300 characters are allowed.</span></div>
                            </div>

                            <div>
                                <label className="parentGroup"> Description<span style={{ color: "red" }}>*</span></label>
                                <input className='academySelect'
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required placeholder='Enter Description' />
                                <div><span style={{ fontSize: "12px" }}>Maximum 50 characters are allowed.</span></div>
                            </div>

                            <div>
                                <label className="parentGroup"> Amount Type<span style={{ color: "red" }}>*</span></label>
                                <select className='academySelect' value={amountType} onChange={(e) => setAmountType(e.target.value)}>
                                    <option value="">Select Amount Type</option>
                                    <option value="Percentage">Percentage</option>
                                </select>
                            </div>

                            <div>
                                <label className="parentGroup"> Amount<span style={{ color: "red" }}>*</span></label>
                                <input
                                    className="academySelect"
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={handleAmountChange} // Prevents entering a negative number
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
                                <span onClick={handleSubmit}><AiOutlineCheck style={{ color: 'green', fontSize: '14px', cursor: "pointer" }} size={20} /></span>
                                <BsXLg style={{ color: 'red', fontSize: '14px', cursor: "pointer" }} size={20} onClick={handleCancelClick} />
                            </div>
                        </div>
                    </form>

                    <div style={{ fontSize: "12px", alignItems: "center", display: "flex", gap: "5px" }}>
                        <input type='checkbox' /> Allow the faculty to modify the concession amount while assigning it to the student
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConcessionType;
