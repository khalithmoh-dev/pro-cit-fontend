import React, { useState } from 'react'
import style from './report.module.css';
import DailyCollectionReportNewVersionModal from '../DailyCollectionReportNewVersionModal';
import YearwiseFeeHeadwiseReportModal from '../YearwiseFeeHeadwiseReportModal';
import DateWiseHeadwiseCollectionReport from '../DateWiseHeadwiseCollectionReportModal';
import DailyCollectionReportModal from '../dailyCollectionReportModal';
import ExcessRefundAmountReport from '../ExcessRefundAmountReportModal';
import HeadwiseRefundReportModal from '../HeadwiseRefundReportModal';
import AcademicYearwiseFeeAnalysisReport from '../AcademicYearwiseFeeAnalysisReportModal';
import YearwiseStudentFeeReportModal from '../YearwiseStudentFeeReportModal';
import FeeHeadwiseReportModal from '../FeeHeadwiseReportModal';
import YearScholarshipHeadwiseReportModal from '../YearScholarshipHeadwiseReportModal';
import StudentPaymentFeeReportModal from '../StudentPaymentFeeReportModal';
import StudentCategorywiseScholarshipReportModal from '../StudentCategorywiseScholarshipReportModal';
import PaymentModewiseCollectionReport from '../PaymentModewiseCollectionReport';
import PaymentModewiseReport from '../PaymentModewiseReport';
import FacilitywiseBalanceReportModal from '../FacilitywiseBalanceReportModal';
import FeesCollectionSummaryReportModal from '../FeesCollectionSummaryReportModal';
import GeneralFeeRegisterModal from '../GeneralFeeRegisterModal';
import ConcessionReport from '../ConcessionReportModal';
import IndividualStudentSummaryReportModal from '../IndividualStudentSummaryReportModal';
import NumberGovernmentScholarshipFreeshipReportModal from '../NumberGovernmentScholarshipFreeshipReportModal';
import NumberScholarshipFreeshipReportModal from '../NumberScholarshipFreeshipReportModal';
import StudentScholarshipFreeshipReportModal from '../StudentScholarshipFreeshipReportModal';
import BenefitedInstitutionScholarshipReportModal from '../BenefitedInstitutionScholarshipReportModal';
import DailyReceiptReportModal from '../DailyReceiptReportModal';
import PaymentModewisePurposeReportModal from '../PaymentModewisePurposeReportModal';
import DiscrepancyReportModal from '../DiscrepancyReportModal';
import InstallmentFineReportModal from '../InstallmentFineReportModal';


const ReportListPage: React.FC = () => {


  const [ConcessionDialogOpen, setConcessionDialogOpen] = useState(false);

  const handleOpenModal = () => {
    setConcessionDialogOpen(true);
  };

  const [Open, setlogOpen] = useState(false);
  const [ReportNewVersion, setReportNewVersion] = useState(false)
  const [collectionReport, setcollectionReport] = useState(false)
  const [amountReport, setAmountReport] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [feeAnalysisReport, setFeeAnalysisReport] = useState(false)
  const [FeeReportModal, setFeeReportModal] = useState(false)
  const [ReportModal, setWiseReportModal] = useState(false)
  const [yearHeadwiseReport, setYearHeadwiseReport] = useState(false)
  const [studentReportModal, setStudentReportModal] = useState(false)
  const [StudentReportModal, setStudentScholarshipModal] = useState(false)
  const [paymentCollectionReport, setPaymentCollectionReport] = useState(false)
  const [paymentReport, setPaymentReport] = useState(false)
  const [facilityReportModal, setFacilityReportModal] = useState(false)
  const [feesReportModal, setFeesReportModal] = useState(false)
  const [generalFeeModal, setGeneralFeeModal] = useState(false)
  const [concessionReport, setConcessionReport] = useState(false)
  const [ individualSummaryReport, setIndividualSummaryReport] = useState(false)
  const [scholarshipFreeshipReport, setScholarshipFreeshipReport] = useState(false)
  const [freeshipReport, setfFreeshipReport] = useState(false)
  const [studentScholarshipReport, setStudentScholarshipReport] = useState(false)
  const [ benefitedScholarshipReport , setBenefitedScholarshipReport] = useState(false)
  const [ dailyReceiptReport, setDailyReceiptReport] = useState(false)
  const [purposeReportModal, setPurposeReportModal] = useState(false)
  const [discrepancyReport,setDiscrepancyReport] = useState(false)
  const [installmentFineReport, setInstallmentFineReport] = useState(false)

  const handleOpenlogModal = () => {
    setlogOpen(true);
  };
  const handleNewVersionModal = () => {
    setReportNewVersion(true);
  };
  const handleCollectionReport = () => {
    setcollectionReport(true)
  }
  const handleFeeHeadwiseReportModal = () => {
    setWiseReportModal(true)
  }
  const handleAmountReport = () => {
    setAmountReport(true)
  }
  const handleReportModal = () => {
    setReportModal(true)
  }
  const handleFeeAnalysisReport = () => {
    setFeeAnalysisReport(true)
  }
  const handleFeeReportModal = () => {
    setFeeReportModal(true)
  }

  const handleYearHeadwiseReport = () => {
    setYearHeadwiseReport(true)
  }
  const handleStudentReportModal = () => {
    setStudentReportModal(true)
  }

  const handleStudentScholarshipModal = () => {
    setStudentScholarshipModal(true)
  }

  const handlePaymentCollectionReport = () => {
    setPaymentCollectionReport(true)
  }

  const handlePaymentReport = () => {
    setPaymentReport(true)
  }

  const handleFacilityReportModal = () => {
    setFacilityReportModal(true)
  }

  const handleFeesReportModal = () => {
    setFeesReportModal(true)
  }

  const handleGeneralFeeModal = () => {
    setGeneralFeeModal(true)
  }

  const handleConcessionReport = () => {
    setConcessionReport(true)
  }

  const handleIndividualSummaryReport = () => {
    setIndividualSummaryReport(true)
  }
  const handleScholarshipFreeshipReport = () => {
    setScholarshipFreeshipReport(true)
    
  }

  const handleFreeshipReport = () => {
    setfFreeshipReport(true)
  }

  const handleStudentScholarshipReport = () => {
    setStudentScholarshipReport(true)
  }

  const handleBenefitedScholarshipReport = ()  => {
    setBenefitedScholarshipReport(true)
  }

  const handleDailyReceiptReport = () => {
    setDailyReceiptReport(true)
  }

  const handlePurposeReportModal = () => {
    setPurposeReportModal(true)
  }

  const handleDiscrepancyReport = () => {
    setDiscrepancyReport(true)
  }

  const handleInstallmentFineReport = () => {
    setInstallmentFineReport(true)
  }
  return (
    <><div style={{ backgroundColor: "white", padding: "12px", }}>
      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Daily Collection Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleOpenModal}>Daily Collection Report</p>
        {/* <p className={style.year}>Daily Collection Report (New Version)</p> */}
      </div>
      <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}><p className={style.year} onClick={handleOpenlogModal}>Headwise Daily Collection Report</p>
        {/* <p className={style.year} >Headwise Daily Collection Report (New Version)</p> */}
      </div>
      <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}><p className={style.year} onClick={handleCollectionReport}>Date-Wise Headwise Collection Report</p> <p className={style.year} onClick={handleNewVersionModal}>Parent Headwise Collection Report</p></div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Excess/Refund Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleAmountReport}>Excess / Refund Amount Report</p> <p className={style.year} onClick={handleReportModal}>Headwise Refund Report</p></div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Summary Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleFeeAnalysisReport}>Academic Yearwise Fee Analysis Report</p> <p className={style.year} onClick={handleFeeReportModal}>Yearwise Student(s) Previous and Current Balance Fee Report</p></div>
      <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}><p className={style.year} onClick={handleFeeHeadwiseReportModal}>Yearwise Fee Headwise Report</p> <p className={style.year} onClick={handleYearHeadwiseReport}>Yearwise Scholarship Headwise Report</p></div>
      <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}><p className={style.year} onClick={handleStudentReportModal}>Student Payment Categorywise Yearwise Fee Report</p> <p className={style.year} onClick={handleStudentScholarshipModal}>Student Payment Categorywise Yearwise Scholarship Report</p></div>
      <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}><p className={style.year} onClick={handlePaymentCollectionReport}>Payment Modewise Fee Headwise Collection Report</p> <p className={style.year} onClick={handlePaymentReport}>Payment Modewise Scholarship Headwise Collection Report</p></div>
      <div style={{ display: "flex", gap: "15px", marginTop: "12px" }}><p className={style.year} onClick={handleFacilityReportModal}>Facilitywise Balance Report</p> <p className={style.year} onClick={handleFeesReportModal}>Fees Collection Summary Report</p></div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Fee Register Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleGeneralFeeModal}>General Fee Register Report</p> <p className={style.year} onClick={handleConcessionReport}>Concession Report</p></div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Individual Student Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleIndividualSummaryReport}>Individual Student's Fee Summary Report</p> </div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Scholarship Benefit Report</span></div>
      <div style={{ display: "flex", gap: "15px", marginBottom: "12px" }}><p className={style.year} onClick={handleScholarshipFreeshipReport}>Number of Student(s) benefited by Government Scholarship & Freeship Report</p> <p className={style.year} onClick={handleFreeshipReport}>Number of Student(s) benefited by Institution Scholarship & Freeship Report</p></div>
      <div style={{ display: "flex", gap: "15px" }} ><p className={style.year} onClick={handleStudentScholarshipReport}>Student(s) benefited by Government Scholarship & Freeship Report</p> <p className={style.year} onClick={handleBenefitedScholarshipReport}>Student(s) benefited by Institution Scholarship & Freeship Report</p></div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>General Receipt Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleDailyReceiptReport}>Daily Collection via General Receipt Report</p> <p className={style.year} onClick={handlePurposeReportModal}>Payment Modewise Fee Headwise Purpose Report</p></div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>General Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleDiscrepancyReport}>Discrepancy Report</p> </div>

      <div style={{ backgroundColor: "#f7f7fa", marginTop: "60px", padding: "8px", marginBottom: "12px" }}><span>Installment  Report</span></div>
      <div style={{ display: "flex", gap: "15px" }}><p className={style.year} onClick={handleInstallmentFineReport}>Installment Fine Report</p> </div>

    </div><DailyCollectionReportModal
        ConcessionDialogOpen={ConcessionDialogOpen}
        setConcessionDialogOpen={setConcessionDialogOpen}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101}

      />
      <YearwiseFeeHeadwiseReportModal
        Open={Open}
        setlogOpen={setlogOpen}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <DailyCollectionReportNewVersionModal
        ReportNewVersion={ReportNewVersion}
        setReportNewVersion={setReportNewVersion}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />

      <DateWiseHeadwiseCollectionReport
        collectionReport={collectionReport}
        setcollectionReport={setcollectionReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <ExcessRefundAmountReport
        amountReport={amountReport}
        setAmountReport={setAmountReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <HeadwiseRefundReportModal
        reportModal={reportModal}
        setReportModal={setReportModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <AcademicYearwiseFeeAnalysisReport
        feeAnalysisReport={feeAnalysisReport}
        setFeeAnalysisReport={setFeeAnalysisReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <YearwiseStudentFeeReportModal
        FeeReportModal={FeeReportModal}
        setFeeReportModal={setFeeReportModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <FeeHeadwiseReportModal
        ReportModal={ReportModal}
        setWiseReportModal={setWiseReportModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101}
      />
      <YearScholarshipHeadwiseReportModal
        yearHeadwiseReport={yearHeadwiseReport}
        setYearHeadwiseReport={setYearHeadwiseReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101}
      />
      <StudentPaymentFeeReportModal
        studentReportModal={studentReportModal}
        setStudentReportModal={setStudentReportModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101}
      />
      <StudentCategorywiseScholarshipReportModal
        StudentReportModal={StudentReportModal}
        setStudentScholarshipModal={setStudentScholarshipModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <PaymentModewiseCollectionReport
        paymentCollectionReport={paymentCollectionReport}
        setPaymentCollectionReport={setPaymentCollectionReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <PaymentModewiseReport
        paymentReport={paymentReport}
        setPaymentReport={setPaymentReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <FacilitywiseBalanceReportModal
        facilityReportModal={facilityReportModal}
        setFacilityReportModal={setFacilityReportModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101}
      />
      <FeesCollectionSummaryReportModal
        feesReportModal={feesReportModal}
        setFeesReportModal={setFeesReportModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <GeneralFeeRegisterModal
        generalFeeModal={generalFeeModal}
        setGeneralFeeModal={setGeneralFeeModal}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101} />
      <ConcessionReport 
      concessionReport={concessionReport}
      setConcessionReport={setConcessionReport}
      selectedStudent={{ name: "John Doe" }}
      selectedFeeStructureId={1}
      selectedFeeId={101}/>
      <IndividualStudentSummaryReportModal
       individualSummaryReport={individualSummaryReport}
       setIndividualSummaryReport={setIndividualSummaryReport}
       selectedStudent={{ name: "John Doe" }}
       selectedFeeStructureId={1}
       selectedFeeId={101}/>
       <NumberGovernmentScholarshipFreeshipReportModal
        scholarshipFreeshipReport={scholarshipFreeshipReport}
        setScholarshipFreeshipReport={setScholarshipFreeshipReport}
        selectedStudent={{ name: "John Doe" }}
        selectedFeeStructureId={1}
        selectedFeeId={101}/>
        <NumberScholarshipFreeshipReportModal
         freeshipReport={freeshipReport}
         setfFreeshipReport={setfFreeshipReport}
         selectedStudent={{ name: "John Doe" }}
         selectedFeeStructureId={1}
         selectedFeeId={101}/>
        <StudentScholarshipFreeshipReportModal
         studentScholarshipReport={studentScholarshipReport}
         setStudentScholarshipReport={setStudentScholarshipReport}
         selectedStudent={{ name: "John Doe" }}
         selectedFeeStructureId={1}
         selectedFeeId={101}/>
         <BenefitedInstitutionScholarshipReportModal
         benefitedScholarshipReport={benefitedScholarshipReport}
         setBenefitedScholarshipReport={setBenefitedScholarshipReport}
         selectedStudent={{ name: "John Doe" }}
         selectedFeeStructureId={1}
         selectedFeeId={101}
         
         />
         <DailyReceiptReportModal
         dailyReceiptReport={dailyReceiptReport}
         setDailyReceiptReport={setDailyReceiptReport}
         selectedStudent={{ name: "John Doe" }}
         selectedFeeStructureId={1}
         selectedFeeId={101}/>
         <PaymentModewisePurposeReportModal
         purposeReportModal={purposeReportModal}
         setPurposeReportModal={setPurposeReportModal}
         selectedStudent={{ name: "John Doe" }}
         selectedFeeStructureId={1}
         selectedFeeId={101}/>

         <DiscrepancyReportModal
         discrepancyReport={discrepancyReport}
         setDiscrepancyReport={setDiscrepancyReport}
         selectedStudent={{ name: "John Doe" }}
         selectedFeeStructureId={1}
         selectedFeeId={101}
         />
         <InstallmentFineReportModal
          installmentFineReport={installmentFineReport}
          setInstallmentFineReport={setInstallmentFineReport}
          selectedStudent={{ name: "John Doe" }}
          selectedFeeStructureId={1}
          selectedFeeId={101}/>
    </>
  )
}

export default ReportListPage
