import React, { useEffect, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import { FaRupeeSign } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import Button from '../../../components/button';
import { StudentQuickCollect } from '../../../store/quickCollectStore';
import CloseIcon from '../../../icon-components/CloseIcon';
import useDepartmentStore from '../../../store/quickcollectsettingStore';

interface PropsIF {
    academicDialogOpen: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setacademicDialogOpen?: any;
    selectedStudent?: StudentQuickCollect;
    totalHeadAmounts?: number | null;
    totalPaid?: number | null;
    totalBalance?: number | null;
}
interface FeePaymentData {
    mode: string;
    BankAccount: string;
    PaymentDate: string;
    InstrumentDate: string;
    TransactionId: string;
    ReceiptSeries: string;
    ReceiptNo: string;
    Amount: string | number;
    previousexcess: string;
}

const Transportdialog: React.FC<PropsIF> = ({ academicDialogOpen, setacademicDialogOpen, totalBalance }) => {
    const { getReceiptSeries, ReceiptSeries }: any = useDepartmentStore();
    const [totalAmounts, setTotalAmounts] = useState<number>();
    const defaultPaymentData = {
        mode: "cash",
        BankAccount: "",
        PaymentDate: "",
        InstrumentDate: "",
        TransactionId: "",
        ReceiptSeries: "",
        ReceiptNo: "",
        Amount: "",
        previousexcess: ""
    };
    const [PaymentData, setPaymentData] = useState<FeePaymentData>(defaultPaymentData)
    console.log(PaymentData, "PaymentData");

    const [errors, setErrors] = useState({
        mode: "",
        PaymentDate: "",
        ReceiptSeries: "",
        ReceiptNo: "",
        Amount: "",
    });


    useEffect(() => {
        const fetchParentHeads = async () => {
            try {
                await getReceiptSeries('');
            } catch (error) {
                console.error("Error fetching receipt series", error);
            }
        };
        fetchParentHeads();
    }, [getReceiptSeries]);

    const Datachangehandel = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPaymentData(prevdata => ({
            ...prevdata, [name]: value
        }))
        setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    }
    const difference = (totalAmounts || 0) - (totalBalance || 0);



    const SubmitHandel = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };
        if (!PaymentData.mode) {
            formIsValid = false;
            newErrors.mode = "Mode is required.";
        }
        if (!PaymentData.PaymentDate) {
            formIsValid = false;
            newErrors.PaymentDate = "PaymentDate is required.";
        } if (!PaymentData.ReceiptSeries) {
            formIsValid = false;
            newErrors.ReceiptSeries = "ReceiptSeries is required.";
        } if (!PaymentData.ReceiptNo) {
            formIsValid = false;
            newErrors.ReceiptNo = "ReceiptNo is required.";
        } if (!PaymentData.Amount) {
            formIsValid = false;
            newErrors.Amount = "Amount is required.";
        }
        setErrors(newErrors);
        if (formIsValid) {
            console.log(PaymentData, "PaymentDataaa");
        }
    }



    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;
        const parsedValue = parseFloat(newValue);

        if (parsedValue <= 0 || isNaN(parsedValue)) {
            newValue = "";
        }
        setTotalAmounts(parsedValue);
        setPaymentData(prevData => ({
            ...prevData,
            Amount: JSON.stringify(parsedValue > 0 ? parsedValue : "")
        }));
    };




    const handleDialogClose = () => {
        setacademicDialogOpen(false);
        setPaymentData(defaultPaymentData);
    };
    return (
        <div>
            <Dialog isOpen={academicDialogOpen} onClose={() => setacademicDialogOpen(false)} small={true} wide={true} medium={false} fullHeight={true} className={style?.dialogScroll}>
                {/* <Dialog isOpen={academicDialogOpen} onClose={() => setacademicDialogOpen(false)} > */}
                {/* <DialogTitle onClose={handleDialogClose}>Fee Payment</DialogTitle> */}
                <div className={style.GenerateChallanheader}>
                    Fee Payment
                    <span onClick={handleDialogClose}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <form onSubmit={SubmitHandel}>
                            <div className={style.studentDetails}>
                                <div style={{ fontSize: '14px' }}><span style={{ marginRight: '10px' }}><FaUser /></span>Student Details</div>
                                <table className={style.studentDetailsTable}>
                                    <tbody>
                                        <tr style={{ fontSize: '14px' }}>
                                            <td>Name- <strong>ABIN REJI</strong></td>
                                            <td>Mobile- <strong>9663949282</strong></td>
                                            <td>Category- <strong>3B</strong></td>
                                            <td>Admission Type- <strong></strong></td>
                                            <td>Total Fees- <strong>40320.00</strong></td>
                                            <td>Balance Fees- <strong>0.00</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={style.studentDetails}>
                                <div style={{ fontSize: '14px' }}><span style={{ marginRight: '10px' }}><FaRupeeSign /></span>Payment Details</div>
                                <div className={style.studentInfoGrid}>
                                    <div>
                                        <label>Mode <span style={{ color: "red" }}>*</span></label>
                                        <div className={style?.inputError}>
                                            <select className={style.academySelect} name='mode' value={PaymentData.mode} onChange={Datachangehandel}>
                                                <option value="cash" selected>Cash</option>
                                                <option value="online">Online</option>
                                            </select>
                                            {errors.mode && <p style={{ color: "red" }}>{errors.mode}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Bank Account</label>
                                        <div className={style?.inputError}>
                                            <select className={style.academySelect} name='BankAccount' value={PaymentData.BankAccount} onChange={Datachangehandel} >
                                                <option value="" selected>Select Bank Account</option>
                                                <option value="PRINCIPAL CIT 5504">PRINCIPAL CIT 5504</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Payment Date <span style={{ color: "red" }}>*</span></label>
                                        <div className={style?.inputError}>
                                            <input type="date" className={style.academySelect} placeholder='Date of Payment' name='PaymentDate' value={PaymentData.PaymentDate} onChange={Datachangehandel} />
                                            {errors.PaymentDate && <span className={style?.fieldError}>{errors.PaymentDate}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Instrument Date</label>
                                        <div className={style?.inputError}>
                                            <input type="date" className={style.academySelect} placeholder='Instrument Date of Payment' name='InstrumentDate' value={PaymentData.InstrumentDate} onChange={Datachangehandel} />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Transaction Id / Cheque No. / DD No</label>
                                        <div className={style?.inputError}>
                                            <input type="text" className={style.academySelect} placeholder='Transaction/Reference Number' name='TransactionId' value={PaymentData.TransactionId} onChange={Datachangehandel} />
                                        </div>
                                    </div>
                                    <div></div>
                                    <div>
                                        <label>Receipt Series <span style={{ color: "red" }}>*</span></label>
                                        <div className={style?.inputError}>
                                            <select className={style.academySelect} name='ReceiptSeries' value={PaymentData.ReceiptSeries} onChange={Datachangehandel}>
                                                <option value="" selected>Select Receipt Series</option>
                                                {ReceiptSeries?.map((row: any, index: number) => (
                                                    <option value={row?.series_preview} key={index}>{row.series_preview}</option>
                                                ))}
                                            </select>
                                            {errors.ReceiptSeries && <span className={style?.fieldError}>{errors.ReceiptSeries}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Receipt No <span style={{ color: "red" }}>*</span></label>
                                        <div className={style?.inputError}>
                                            <input type="number" className={style.academySelect} placeholder='Receipt Number' name='ReceiptNo' value={PaymentData.ReceiptNo} onChange={Datachangehandel} />
                                            {errors.ReceiptNo && <span className={style?.fieldError}>{errors.ReceiptNo}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Balance Amount</label>
                                        <label>
                                            <span>{totalBalance || 0}</span>
                                            <div style={{ fontSize: '12px' }}>(Fee: {totalBalance || 0} | Scholarship: 0 )</div>
                                        </label>
                                    </div>
                                    <div>
                                        <label>Previous excess Amount</label>
                                        <label>
                                            <span>0</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label>Amount <span style={{ color: "red" }}>*</span> </label>
                                        <div className={style?.inputError}>
                                            <input type="number" className={style.academySelect} placeholder='Amount' value={totalAmounts} onChange={(e) => handleAmountChange(e)}
                                            />
                                            {PaymentData.Amount === "" && errors.Amount && <span className={style?.fieldError} >{errors.Amount}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Amount from previous excess</label>
                                        <div className={style?.inputError}>
                                            <input type="number" className={style.academySelect} placeholder='Amount From Previous Excess' name='previousexcess' value={PaymentData.previousexcess} onChange={Datachangehandel} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.studentDetails}>
                                <div style={{ fontSize: "14px", fontWeight: 600 }}>Payment Structure</div>
                                <div >No fee structure assigned.
                                </div>
                            </div>

                            <div className={style.studentDetails}>
                                <div className={style.studentInfoGrid}>
                                    <div>
                                        <label>Excess Amount</label>
                                        <input type="number" min={0} className={style.academySelect} placeholder='Excess Amount' value={difference < 0 ? 0 : difference}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={style.studentDetails}>
                                <div>
                                    <label><strong>Remarks(If Any)</strong></label>
                                    <input type="text" className={style.academySelect} placeholder='Amount From Previous Excess' />
                                </div>
                            </div>
                            <div className={style.studentDetails} style={{ display: 'flex', gap: '16px' }}>
                                <Button submit={true}>
                                    Pay Now
                                </Button>
                                <Button secondary onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default Transportdialog;