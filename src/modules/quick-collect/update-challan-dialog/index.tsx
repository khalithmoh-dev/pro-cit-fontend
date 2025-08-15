import React, { useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import Button from '../../../components/button';
import CloseIcon from '../../../icon-components/CloseIcon';
import ChallanData from "../../../store/paymentfeestore";  // Importing from the store

interface PropsIF {
    UpdateChallanDialogOpen: boolean;
    setConcessionDialogOpen?: any;
    studentId: string, 
    feeStructureId:any
}

const UpdateChallanDialog: React.FC<PropsIF> = ({ UpdateChallanDialogOpen, setConcessionDialogOpen, studentId, feeStructureId }) => {
    const [challanNumber, setChallanNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const { updateChallanData, challanData }: any = ChallanData();  // Accessing store data

    // Handle form data change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'challanNumber') {
            setChallanNumber(value);
        }
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setConcessionDialogOpen(false);
    };

    const handleVerifyChallan = async () => {
        setLoading(true);
        try {
            const currentChallan = challanData.find((challan: any) => challan.challan_number === challanNumber);
            if (currentChallan) {
                const updatedData = {
                    isVerified: !currentChallan.isVerified,  // Toggle the isVerified status
                };
                const success = await updateChallanData(challanNumber, updatedData,studentId, feeStructureId);  // Call the update API from the store
                if (success) {
                    alert(`Challan ${updatedData.isVerified ? 'verified' : 'unverified'} successfully`);
                    handleDialogClose();  // Close the dialog on success
                } 
            } 
        } catch (error) {
            console.error('Error verifying the challan:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog isOpen={UpdateChallanDialogOpen} onClose={handleDialogClose} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Update Challan
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
                                        <label><strong>Challan Series <span style={{ color: "red" }}>*</span></strong></label>
                                        <div>
                                            Kindly add challan series from "Challan Series" button.
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Challan Number <span style={{ color: "red" }}>*</span></strong></label>
                                        <div className={style?.inputError}>
                                            <input
                                                type="number"
                                                className={style.academySelect}
                                                placeholder='Enter Challan Number'
                                                name='challanNumber'
                                                value={challanNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className={style?.Verifybtn}>
                                        <Button onClick={handleVerifyChallan} disabled={loading}>
                                            {loading ? 'Verifying...' : 'Verify Challan'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default UpdateChallanDialog;
