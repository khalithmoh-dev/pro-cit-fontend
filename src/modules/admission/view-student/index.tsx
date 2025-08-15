import { useEffect, useState } from 'react';
import style from './view-student.module.css';
import useInvitedStudentStore from '../../../store/invitedStudentStore';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '../../../icon-components/ArrowLeftIcon';
import MenuContainer from './menu-container';
import httpRequest from '../../../utils/functions/http-request';
import Button from '../../../components/button';
import ViewDocumentDialog from './view-document-dialog';

const menuItems = [
  'Personal Details',
  'Address Details',
  'Academic Details',
  'Admission Details',
  'Bank Details',
  'Fees Details',
  'Documents',
];
interface KeyValueIF {
  key: string;
  value: any;
  isDocument?: boolean;
}

const ViewInvitedStudentPage = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const { invitedStudent, getInvitedStudent } = useInvitedStudentStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [dialog, setDialog] = useState('');

  const getFile = async () => {
    if (!invitedStudent?.profilePhoto) return;
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/get/file`, {
        fileName: invitedStudent.profilePhoto,
        purpose: 'download',
      });

      if (res?.data) {
        setImageSrc(res.data); // Store the image data or URL in state
      } else {
        console.error('Invalid file data returned from API');
      }
    } catch (error) {
      console.error('File download error:', error);
    }
  };

  // Call getFile when the component mounts or `invitedStudent` changes
  useEffect(() => {
    if (invitedStudent) {
      getFile();
    }
  }, [invitedStudent]);

  useEffect(() => {
    if (!id) return;
    getInvitedStudent(id);
  }, [id]);

  const personalDetails = [
    { key: 'USN Number', value: invitedStudent?.usnNumber },
    { key: 'Admission Number', value: invitedStudent?.admissionNumber },
    { key: 'Name', value: `${invitedStudent?.firstName} ${invitedStudent?.middleName} ${invitedStudent?.lastName}` },
    { key: 'Email', value: invitedStudent?.email },
    { key: 'Gender', value: invitedStudent?.gender },
    { key: 'Contact Number', value: invitedStudent?.contactNumber },
    { key: 'Blood Group', value: invitedStudent?.bloodGroup },
    { key: 'Place of Birth', value: invitedStudent?.placeOfBirth },
    { key: "Father's Full Name", value: invitedStudent?.fatherFullName },
    { key: "Mother's Name", value: invitedStudent?.motherName },
    { key: 'Parent Contact Number', value: invitedStudent?.parentContactNumber },
    { key: 'Parent Email', value: invitedStudent?.parentEmail },
    { key: 'Guardian Name', value: invitedStudent?.guardianName },
    { key: 'Guardian Contact Number', value: invitedStudent?.guardianContactNumber },
    { key: 'Caste', value: invitedStudent?.caste },
    { key: 'Religion', value: invitedStudent?.religion },
    { key: 'Nationality', value: invitedStudent?.nationality },
    { key: 'Category', value: invitedStudent?.category },
    { key: 'Rural/Urban Status', value: invitedStudent?.ruralUrbanStatus },
    { key: 'Physically Challenged', value: invitedStudent?.physicallyChallenged ? 'Yes' : 'No' },
    { key: 'Date of Join', value: invitedStudent?.dateOfJoin },
  ];

  const addressDetails = [
    { key: 'Present Address', value: invitedStudent?.presentAddress?.address },
    { key: 'Present Country', value: invitedStudent?.presentAddress?.country },
    { key: 'Present State', value: invitedStudent?.presentAddress?.state },
    { key: 'Present District', value: invitedStudent?.presentAddress?.district },
    { key: 'Present Taluk', value: invitedStudent?.presentAddress?.taluk },
    { key: 'Present City', value: invitedStudent?.presentAddress?.city },
    { key: 'Present Pincode', value: invitedStudent?.presentAddress?.pincode },

    { key: 'Permanent Address', value: invitedStudent?.permanentAddress?.address },
    { key: 'Permanent Country', value: invitedStudent?.permanentAddress?.country },
    { key: 'Permanent State', value: invitedStudent?.permanentAddress?.state },
    { key: 'Permanent District', value: invitedStudent?.permanentAddress?.district },
    { key: 'Permanent Taluk', value: invitedStudent?.permanentAddress?.taluk },
    { key: 'Permanent City', value: invitedStudent?.permanentAddress?.city },
    { key: 'Permanent Pincode', value: invitedStudent?.permanentAddress?.pincode },
  ];

  const academicDetails = [
    { key: 'Entrance Test Marks', value: invitedStudent?.entranceTestMarks },
    { key: 'CET Ranking', value: invitedStudent?.cetRanking },
    { key: 'Current Semester', value: invitedStudent?.semester },
    { key: '12th/PU Physics Marks', value: invitedStudent?.puOr12thMarks?.physics },
    { key: '12th/PU Mathematics Marks', value: invitedStudent?.puOr12thMarks?.mathematics },
    { key: '12th/PU Biology Marks', value: invitedStudent?.puOr12thMarks?.biology },
    { key: '12th/PU Computer Science Marks', value: invitedStudent?.puOr12thMarks?.computerScience },
    { key: '12th/PU Electronics Marks', value: invitedStudent?.puOr12thMarks?.electronics },
    { key: 'Department Name', value: invitedStudent?.department?.name },
    { key: 'Department Code', value: invitedStudent?.department?.departmentCode },
  ];

  const admissionDetails = [
    { key: 'Admission Number', value: invitedStudent?.admissionNumber },
    { key: 'Year of Admission', value: invitedStudent?.yearOfAdmission },
    { key: 'Admission Status', value: invitedStudent?.admissionStatus },
    { key: 'Seat Type', value: invitedStudent?.seatType },
    { key: 'Admission Type', value: invitedStudent?.admissionType },
    { key: 'Admission Semester', value: invitedStudent?.admissionSemester },
  ];

  const bankDetails = [
    { key: 'Aadhar Number', value: invitedStudent?.aadharNumber },
    { key: 'PAN Number', value: invitedStudent?.panNumber },
    { key: 'Bank Name', value: invitedStudent?.bankDetails?.bankName },
    { key: 'Branch Address', value: invitedStudent?.bankDetails?.branchAddress },
    { key: 'Branch Code', value: invitedStudent?.bankDetails?.branchCode },
    { key: 'Account Holder Name', value: invitedStudent?.bankDetails?.accountHolderName },
    { key: 'Account Number', value: invitedStudent?.bankDetails?.accountNumber },
    { key: 'IFSC Code', value: invitedStudent?.bankDetails?.ifscCode },
    { key: 'MICR Code', value: invitedStudent?.bankDetails?.micrCode },
  ];

  const hostelDetails = [
    { key: 'Hostel Required', value: invitedStudent?.hostelRequired ? 'Yes' : 'No' },
    { key: 'Transport Required', value: invitedStudent?.transportRequired ? 'Yes' : 'No' },
  ];

  const documentsDetails = [
    { key: 'SSLC Marks Card', value: invitedStudent?.documents?.sslcMarksCard, isDocument: true },
    { key: 'Transfer Certificate', value: invitedStudent?.documents?.transferCertificate, isDocument: true },
    { key: 'Study Certificate', value: invitedStudent?.documents?.studyCertificate, isDocument: true },
    { key: 'Aadhar Card', value: invitedStudent?.documents?.aadharCard, isDocument: true },
    { key: 'Caste & Income Certificate', value: invitedStudent?.documents?.casteIncomeCertificate, isDocument: true },
    {
      key: 'Birth Certificate / Ration Card',
      value: invitedStudent?.documents?.birthCertificateOrRationCard,
      isDocument: true,
    },
    { key: 'Rural Certificate', value: invitedStudent?.documents?.ruralCertificate, isDocument: true },
    { key: 'Kannada Medium Certificate', value: invitedStudent?.documents?.kannadaMediumCertificate, isDocument: true },
    { key: 'Character Certificate', value: invitedStudent?.documents?.characterCertificate, isDocument: true },
    { key: 'Migration Certificate', value: invitedStudent?.documents?.migrationCertificate, isDocument: true },
    { key: 'Bank Account Details', value: invitedStudent?.documents?.accountDetails, isDocument: true },
    { key: 'Undertaking by Parent', value: invitedStudent?.documents?.undertakingByParent, isDocument: true },
    { key: 'Other Documents', value: invitedStudent?.documents?.other, isDocument: true },
  ];

  const renderArray: KeyValueIF[] = (() => {
    switch (selectedMenu) {
      case 0:
        return personalDetails;
      case 1:
        return addressDetails;
      case 2:
        return academicDetails;
      case 3:
        return admissionDetails;
      case 4:
        return bankDetails;
      case 5:
        return hostelDetails;
      case 6:
        return documentsDetails;
      default:
        return [];
    }
  })();

  return (
    <>
      <div className={style.pageName}>
        <span className={style.backButton} onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </span>
        InvitedStudent Details
      </div>
      <div className={style.container}>
        <MenuContainer
          imageSrc={imageSrc}
          name={`${invitedStudent?.firstName} ${invitedStudent?.lastName}`}
          menuItems={menuItems}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <div className={style.contentBox}>
          <div className={style.tableContainer}>
            {renderArray.map((item, index) => (
              <div className={style.tableRow} key={index}>
                <div className={style.tableLeft}>{item.key}</div>
                <div className={style.tableRight}>
                  {item.value}
                  {item.isDocument && item.value && (
                    <button onClick={() => setDialog(item.value)} className={style.viewButton}>
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ViewDocumentDialog dialog={dialog} onClose={() => setDialog('')} />
      </div>
    </>
  );
};

export default ViewInvitedStudentPage;
