/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import style from '../quick-collect-list/quick.module.css';
import Dialog from '../../../components/dialog';
import DialogBody from '../../../components/dialog/dialog-body';
import CloseIcon from '../../../icon-components/CloseIcon';
import useQuickCollectStore from '../../../store/paymentfeestore';
import "./receipt.module.css"
import { FaPrint } from 'react-icons/fa';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PropsIF {
    UpdateChallanDialogOpen: boolean;
    setConcessionDialogOpen?: any;
    selectedFeeStructureId: any
    students: any
    selectedStudent: any
    selectedRefundId: any
}

const RefundReceipt: React.FC<PropsIF> = ({ UpdateChallanDialogOpen, setConcessionDialogOpen, selectedRefundId }) => {
    const { getRefundReceipt, selectedFeeReceipt }: any = useQuickCollectStore();
    const pdfRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                await getRefundReceipt(selectedRefundId);

                console.log('All API calls were successful');
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setLoading(false); // Set loading to false once all APIs are called
            }
        };

        fetchData();
    }, [selectedRefundId]);


    const totalBalanceAmount = selectedFeeReceipt?.payment?.reduce((total: number, item: { refund_amount: any; }) => {
        return total + parseFloat(item?.refund_amount || 0);
    }, 0).toFixed(2);


    const numberToWords = (num: number) => {
        const ones = [
            '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
            'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
            'seventeen', 'eighteen', 'nineteen'
        ];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const thousands = ['', 'thousand', 'million', 'billion'];
        if (num === 0) return 'zero';
        const convert = (n: number) => {
            if (n === 0) return '';
            let str = '';
            if (n >= 100) {
                str += ones[Math.floor(n / 100)] + ' hundred';
                n %= 100;
                if (n > 0) str += ' and ';
            }
            if (n >= 20) {
                str += tens[Math.floor(n / 10)];
                n %= 10;
                if (n > 0) str += '-';
            }
            if (n > 0) {
                str += ones[n];
            }
            return str.trim();
        };

        let integerPart = Math.floor(num);
        const decimalPart = Math.round((num - integerPart) * 100);

        let result = '';
        let index = 0;

        while (integerPart > 0) {
            if (integerPart % 1000 !== 0) {
                result = convert(integerPart % 1000) + (thousands[index] ? ' ' + thousands[index] : '') + ' ' + result;
            }
            integerPart = Math.floor(integerPart / 1000);
            index++;
        }

        if (decimalPart > 0) {
            result += ' and ' + convert(decimalPart) + ' cents';
        }

        return result.trim();
    };

    const amountInWords = numberToWords(totalBalanceAmount);

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';
        return `${date.toLocaleString('default', { weekday: 'short' })}, ${day}${suffix} ${month}, ${year}`;
    };

    const handleDownload = async () => {
        const element = pdfRef.current;

        if (element) {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape", "mm", "a4"); // Use landscape mode to accommodate two forms in a row
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("fee_receipts.pdf");
        }
    };

    return (
        <div>
            <Dialog
                isOpen={UpdateChallanDialogOpen}
                onClose={() => setConcessionDialogOpen(false)}
                small={true}
                wide={true}
                medium={false}
                fullHeight={true}
                className={style?.dialogScroll}>
                <div className={style.GenerateChallanheader}>
                    Fee Receipt
                    <span onClick={() => setConcessionDialogOpen(false)}>
                        <CloseIcon />
                    </span>
                </div>
                <DialogBody>
                    <div className={`academyInfoContainer ${style?.paddingModal}`}>
                        <div style={{ gap: "12px", display: "flex", alignItems: "baseline", justifyContent: "end", marginRight: "7px" }}>
                            <button onClick={handleDownload} style={{ padding: "8px", color: "#4285f4", backgroundColor: "white", border: "2px solid #4285f4", alignItems:"center", display:"flex", gap:"6px" }}>  <FaPrint />
                                Print
                            </button>
                        </div>
                        <div ref={pdfRef} style={{ display: "flex", gap: "57px" }}>
                            <form>
                                {selectedFeeReceipt && (
                                    <div className="receipt-container">
                                        <table className="receipt-table">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '50%' }}>
                                                        <table className="receipt-header" style={{ border: "2px solid" }}>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: '100%', verticalAlign: 'top', padding: "7px" }}>
                                                                        <table className="receipt-header-content">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="receipt-logo-cell">
                                                                                        <img
                                                                                            src="https://s3.ap-south-1.amazonaws.com/vmedulife-s3/dp/DhaneshwariShende-63a14d63cf8aa.jpeg"
                                                                                            alt="Logo"
                                                                                            width="75"
                                                                                            height="60"
                                                                                        />
                                                                                    </td>
                                                                                    <td className="receipt-info">
                                                                                        <strong className="receipt-institute-name" style={{ marginLeft: "55px" }}>COORG INSTITUTE OF TECHNOLOGY</strong>
                                                                                        <br />
                                                                                        <span style={{ fontSize: "10.5px", fontWeight: "700", width: "331px", display: "flex", marginLeft: "55px" }}>
                                                                                            HALLIGATTU, PONNAMPET, KODAGU, KARNATAKA- 571216
                                                                                        </span>

                                                                                        <span style={{ fontSize: "10.5px", fontWeight: "700", width: "331px", display: "flex", marginLeft: "95px" }}>
                                                                                            + 91 96111737241 www.citcoorg.edu.in
                                                                                        </span>
                                                                                    </td>
                                                                                    <td style={{ width: '4.5%' }}></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <hr className="receipt-line" />
                                                                        <table className="receipt-title-table" style={{ justifyContent: "center", display: "flex" }}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="receipt-title " >
                                                                                        <span style={{ fontSize: "13.5px", fontWeight: "600", border: "2px dashed", padding: "6px" }}>COLLEGE FEE RECEIPT- Office Copy</span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}><div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>Receipt No. : {selectedFeeReceipt?.receipt_no}</span>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Name :  {selectedFeeReceipt?.student_id?.firstName}</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Degree : BE</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Branch : Electronics & Engineering </div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Admission Number : {selectedFeeReceipt?.student_id?.admissionNumber}</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Date : {selectedFeeReceipt?.payment_date ? formatDate(selectedFeeReceipt?.payment_date) : 'N/A'}</div>
                                                                        </div>

                                                                            <div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>	Academic Year : {selectedFeeReceipt?.fee_structure_id?.academic_year}</span>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Fee for the Year  {selectedFeeReceipt?.firstName}</div>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Admitted Year :  {selectedFeeReceipt?.fee_structure_id?.admission_year}</div>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>	Semester  : {selectedFeeReceipt?.student_id?.semester} </div>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Mode of Admission : </div>
                                                                            </div>
                                                                        </div>
                                                                        <table className={style.detailTable} style={{ width: "100%" }}>
                                                                            <thead>
                                                                                <tr className={style?.tableHeadingDetail}>
                                                                                    <th >Sr. No.</th>
                                                                                    <th>Head</th>
                                                                                    <th>Total</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>

                                                                                {selectedFeeReceipt?.payment?.map((item: any, index: any) => (
                                                                                    <tr key={index}>
                                                                                        <td>{index + 1}</td> {/* Display index+1 for row number */}
                                                                                        <td>{item?.fee_head_type}</td> {/* Display fee head type */}
                                                                                        <td>{item?.refund_amount}</td> {/* Display balance amount */}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                        <div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>Grand Total : {totalBalanceAmount} </span>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Grand Total in Words :	{amountInWords} Only</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Payment Mode Information : {selectedFeeReceipt?.mode}</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>CASH : 0 Amount : {totalBalanceAmount} Dated : {selectedFeeReceipt?.payment_date ? formatDate(selectedFeeReceipt?.payment_date) : 'N/A'}
                                                                            </div>
                                                                        </div>

                                                                        <div> <span style={{ fontSize: "13.5px", fontWeight: "600", marginTop: "40px", display: "flex" }}>
                                                                            Cashier </span>
                                                                            <div> <span style={{ fontSize: "13.5px", fontWeight: "600", display: "flex", width: "525px" }}>
                                                                                P . N  1. Parents are requested to preserve this receipt future clarification in respect of the fee paid by them. </span>
                                                                            </div>
                                                                            <div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>2. Fee once paid will not be refunded or transferred.</span></div> </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </form>
                            <form>
                                {selectedFeeReceipt && (
                                    <div className="receipt-container">
                                        <table className="receipt-table">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '50%' }}>
                                                        <table className="receipt-header" style={{ border: "2px solid" }}>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: '100%', verticalAlign: 'top', padding: "7px" }}>
                                                                        <table className="receipt-header-content">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="receipt-logo-cell">
                                                                                        <img
                                                                                            src="https://s3.ap-south-1.amazonaws.com/vmedulife-s3/dp/DhaneshwariShende-63a14d63cf8aa.jpeg"
                                                                                            alt="Logo"
                                                                                            width="75"
                                                                                            height="60"
                                                                                        />
                                                                                    </td>
                                                                                    <td className="receipt-info">
                                                                                        <strong className="receipt-institute-name" style={{ marginLeft: "55px" }}>COORG INSTITUTE OF TECHNOLOGY</strong>
                                                                                        <br />
                                                                                        <span style={{ fontSize: "10.5px", fontWeight: "700", width: "331px", display: "flex", marginLeft: "55px" }}>
                                                                                            HALLIGATTU, PONNAMPET, KODAGU, KARNATAKA- 571216
                                                                                        </span>

                                                                                        <span style={{ fontSize: "10.5px", fontWeight: "700", width: "331px", display: "flex", marginLeft: "95px" }}>
                                                                                            + 91 96111737241 www.citcoorg.edu.in
                                                                                        </span>
                                                                                    </td>
                                                                                    <td style={{ width: '4.5%' }}></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <hr className="receipt-line" />
                                                                        <table className="receipt-title-table" style={{ justifyContent: "center", display: "flex" }}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="receipt-title " >
                                                                                        <span style={{ fontSize: "13.5px", fontWeight: "600", border: "2px dashed", padding: "6px" }}>COLLEGE FEE RECEIPT- Office Copy</span>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}><div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>Receipt No. : {selectedFeeReceipt?.receipt_no}</span>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Name :  {selectedFeeReceipt?.student_id?.firstName}</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Degree : BE</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Branch : Electronics & Engineering </div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Admission Number : {selectedFeeReceipt?.student_id?.admissionNumber}</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Date : {selectedFeeReceipt?.payment_date ? formatDate(selectedFeeReceipt?.payment_date) : 'N/A'}</div>
                                                                        </div>

                                                                            <div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>	Academic Year : {selectedFeeReceipt?.fee_structure_id?.academic_year}</span>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Fee for the Year  {selectedFeeReceipt?.firstName}</div>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Admitted Year :  {selectedFeeReceipt?.fee_structure_id?.admission_year}</div>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>	Semester  : {selectedFeeReceipt?.student_id?.semester} </div>
                                                                                <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Mode of Admission : </div>
                                                                            </div>
                                                                        </div>
                                                                        <table className={style.detailTable} style={{ width: "100%" }}>
                                                                            <thead>
                                                                                <tr className={style?.tableHeadingDetail}>
                                                                                    <th >Sr. No.</th>
                                                                                    <th>Head</th>
                                                                                    <th>Total</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>

                                                                                {selectedFeeReceipt?.payment?.map((item: any, index: any) => (
                                                                                    <tr key={index}>
                                                                                        <td>{index + 1}</td> {/* Display index+1 for row number */}
                                                                                        <td>{item?.fee_head_type}</td> {/* Display fee head type */}
                                                                                        <td>{item?.refund_amount}</td> {/* Display balance amount */}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                        <div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>Grand Total : {totalBalanceAmount} </span>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Grand Total in Words :	{amountInWords} Only</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>Payment Mode Information : {selectedFeeReceipt?.mode}</div>
                                                                            <div style={{ fontSize: "13.5px", fontWeight: "600" }}>CASH : 0 Amount : {totalBalanceAmount} Dated : {selectedFeeReceipt?.payment_date ? formatDate(selectedFeeReceipt?.payment_date) : 'N/A'}
                                                                            </div>
                                                                        </div>

                                                                        <div> <span style={{ fontSize: "13.5px", fontWeight: "600", marginTop: "40px", display: "flex" }}>
                                                                            Cashier </span>
                                                                            <div> <span style={{ fontSize: "13.5px", fontWeight: "600", display: "flex", width: "525px" }}>
                                                                                P . N  1. Parents are requested to preserve this receipt future clarification in respect of the fee paid by them. </span>
                                                                            </div>
                                                                            <div><span style={{ fontSize: "13.5px", fontWeight: "600" }}>2. Fee once paid will not be refunded or transferred.</span></div> </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default RefundReceipt;
