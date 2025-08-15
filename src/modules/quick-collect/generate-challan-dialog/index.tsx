import React, { ReactNode, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import paymentfeestore from '../../../store/paymentfeestore';

interface PropsIF {
    UpdateChallanDialogOpen: boolean;
    setConcessionDialogOpen?: any;
    students: any;
    selectedStudent: any,
    selectedFeeStructureId: any
    feeStructureId: any
}

const Generatechallandialog: React.FC<PropsIF> = ({ UpdateChallanDialogOpen, feeStructureId, setConcessionDialogOpen, students, selectedStudent, selectedFeeStructureId }) => {
    console.log("🚀 ~ selectedFeeStructureId:", selectedFeeStructureId)
    console.log("🚀 ~ feeStructureId:", feeStructureId)
    const [formData, setFormData] = useState({
        student_id: selectedStudent._id,
        fee_structure_id: selectedFeeStructureId,
        challan_series: '',
        bank_account: '',
        amount: "",  // Set default value as number
        challan_generation_date: '',
        transaction: '',
        excess_amount: "",  // Set default value as number
        note: '',
        payment: [],
    });

    const { createChallenPayment }: any = paymentfeestore();
    const [loading, setLoading] = useState(false);

    // Calculate the total paid amount
    const totalPaidAmount = students?.reduce((total: number, student: { feeStructures: any[]; }) => {
        student.feeStructures?.forEach((feeStructure) => {
            feeStructure?.feeBalanceId?.balance?.forEach((balance: { paid_amount: number; }) => {
                total += balance.paid_amount || 0;
            });
        });
        return total;
    }, 0);

    const totalBalanceAmount = students?.reduce((total: number, student: { feeStructures: any[]; }) => {
        student.feeStructures?.forEach((feeStructure) => {
            feeStructure?.feeBalanceId?.balance?.forEach((balance: { remaining_amount: number; }) => {
                total += balance.remaining_amount || 0;
            });
        });
        return total;
    }, 0);

    const paymentdata = students?.reduce((acc: any[], student: { feeStructures: any[] }) => {
      
        student.feeStructures?.forEach((feeStructure) => {
            feeStructure?.feeBalanceId?.balance?.forEach((balance: { category_name: string; fee_head_type: string; paid_amount: number; remaining_amount: number }) => {
                const paidAmount = balance.paid_amount || 0;
                const remainingAmount = balance.remaining_amount || 0;

                const existingCategory = acc.find((item) => item.category_name === balance.category_name && item.fee_head_type === balance.fee_head_type);

                if (existingCategory) {
                    existingCategory.paid_amount += paidAmount;
                    existingCategory.remaining_amount += remainingAmount;
                } else {
                    acc.push({
                        category_name: balance.category_name,
                        fee_head_type: balance.fee_head_type,
                        paid_amount: paidAmount,
                        remaining_amount: remainingAmount,
                    });
                }
            });
        });
        return acc;
    }, []);

    console.log("🚀 ~ paymentdata ~ paymentdata:", paymentdata)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedValue = (name === 'amount' || name === 'excess_amount') ? Number(value) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue, // Update the form data based on the field name
        }));
    };

    const handleDialogClose = () => {
        if (setConcessionDialogOpen) setConcessionDialogOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Constructing the payment details from paymentdata
        const payment = paymentdata.map((fee: { category_name: any; fee_head_type: any; paid_amount: any; balance_amount: any; }) => ({
            category_name: fee.category_name,
            fee_head_type: fee.fee_head_type,
            total_amount: fee.paid_amount,
            balance_amount: totalBalanceAmount,
        }));

        // Construct the final payload with all required fields
        const finalData = {
            ...formData,
            payment,
            excess_amount: Number(formData?.excess_amount),
            amount: Number(formData?.amount),
            challan_generation_date: new Date().toISOString(),
        };

        try {
            const studentId = selectedStudent._id;  // Replace with actual studentId
            const feeStructureIds = selectedFeeStructureId;  // Replace with actual feeStructureId
            const result = await createChallenPayment(finalData, studentId, feeStructureIds);
            if (result) {
                console.log('Challan payment created successfully');
                handleDialogClose();
            } else {
                console.error('Failed to create challan payment');
            }
        } catch (error) {
            console.error('Error creating challan payment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog
                isOpen={UpdateChallanDialogOpen}
                onClose={handleDialogClose}
                small
                wide
                medium={false}
                fullHeight
                className={style?.dialogScroll}
            >
                <div className={style.GenerateChallanheader}>
                    Generate Challan
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form onSubmit={handleSubmit}>
                            <div className={style.studentDetails}>
                                <div style={{ marginBottom: "10px" }}>
                                    <tr style={{ fontSize: '14px', display: "flex", justifyContent: "space-between" }}>
                                        <td>Name - <span style={{ fontWeight: "600" }}>{selectedStudent?.firstName.toUpperCase()} {selectedStudent?.lastName?.toUpperCase() ?? "NA"}</span></td>
                                        <td>Email - <span style={{ fontWeight: "600", marginRight: "19px" }}> {selectedStudent?.email ?? "NA"}</span></td>
                                        <td>Mobile No - <span style={{ fontWeight: "600", marginRight: "23px" }}> {selectedStudent?.contactNumber ?? "NA"}</span></td>
                                    </tr>
                                    <tr style={{ fontSize: '14px', display: "flex", justifyContent: "space-between" }}>
                                        <td>Father First Name - <span style={{ fontWeight: "600" }}>{selectedStudent?.fatherFullName ?? "NA"?.toUpperCase()}</span></td>
                                        <td>Mother First Name - <span style={{ fontWeight: "600" }}>{selectedStudent?.motherName?.toUpperCase() ?? "NA"}</span></td>
                                        <td>Academic Year - <span style={{ fontWeight: "600" }}>{selectedStudent?.feeStructures[0]?.academicYear ?? "NA"}</span></td>
                                    </tr>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between",width:"100%", gap:"15px" }}>
                                    <div style={{width:"100%"}}><label className={style.generatetext}> Excess Amount <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="number"
                                            name="excess_amount"
                                            placeholder="Excess Amount"
                                            className={style.academySelect}
                                            value={formData.excess_amount}
                                            onChange={handleInputChange}
                                        />
                                        <div className={style?.inputError}></div>
                                    </div>
                                    <div style={{ width:"100%" }}><label className={style.generatetext}> Transaction <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            name="transaction"
                                            placeholder="Transaction"
                                            className={style.academySelect}
                                            value={formData.transaction}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div  style={{ width:"100%"  }}><label className={style.generatetext}> Challan Series <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            name="challan_series"
                                            placeholder="Challan Series"
                                            className={style.academySelect}
                                            value={formData.challan_series}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "15px" }}>
                                    <div style={{width:"100%"}}><label className={style.generatetext}> Bank Account <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            name="bank_account"
                                            placeholder="Bank Account"
                                            className={style.academySelect}
                                            value={formData.bank_account}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div style={{width:"100%"}}><label className={style.generatetext}> Amount <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Amount"
                                            className={style.academySelect}
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div style={{width:"100%"}}><label className={style.generatetext} > Challan Generation Date
                                        <span style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="date"
                                            name="challan_generation_date"
                                            placeholder="Challan Generation Date "
                                            className={style.dateSelect}
                                            value={formData.challan_generation_date}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <label className={style.generatetext}> Note <span style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    name="note"
                                    placeholder="Note"
                                    className={style.academySelect}
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                />
                                <p className={style.maxigenerate}>(Maximum 100 characters are allowed)</p>

                            </div>
                            <table className={style.detailTable}>
                                <thead>
                                    <tr>
                                        <th>Head Type</th>
                                        <th>Template / Fee Head Name</th>
                                        <th>Total Amount (In Rs.)</th>
                                        <th>Balance Amount (In Rs.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentdata.map((fee: {
                                        total_fee: ReactNode; fee_head_type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; category_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; paid_amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; balance_amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
                                    }, index: React.Key | null | undefined) => (
                                        <tr key={index}>
                                            <td>{fee.fee_head_type}</td>
                                            <td>{fee.category_name}</td>
                                            <td>{fee.paid_amount}</td>
                                            <td>{fee.total_fee}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={style?.Generatebtn}>
                                <button style={{ backgroundColor: "#0465ac", color: "white", padding: "8px" }} type="submit" disabled={loading}>
                                    {loading ? 'Generating...' : 'Generate Challan'}
                                </button>
                                <button type="button" className={style.Generatebtncancel} onClick={handleDialogClose}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default Generatechallandialog;
