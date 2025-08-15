import { useEffect, useState } from 'react';
import style from './view-student.module.css';
import useStudentStore from '../../../store/studentStore';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '../../../icon-components/ArrowLeftIcon';
import MenuContainer from './menu-container';
import httpRequest from '../../../utils/functions/http-request';
import ViewDocumentDialog from './view-document-dialog';
import convertDateFormat from '../../../utils/functions/convert-date-format';
import Spinner from '../../../components/spinner';

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
interface PropsIF {
  studentId: string;
  setStudentId: (id: string) => void;
}
const ViewStudentPage: React.FC<PropsIF> = ({ studentId, setStudentId }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const { student, getStudentDetails } = useStudentStore();
  // const { id } = useParams();
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [dialog, setDialog] = useState('');

  const getFile = async () => {
    if (!student?.profilePhoto) return;
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/get/file`, {
        fileName: student.profilePhoto,
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

  // Call getFile when the component mounts or `student` changes
  useEffect(() => {
    if (student) {
      getFile();
    }
  }, [student]);

  useEffect(() => {
    if (!studentId) return;
    getStudentDetails(studentId);
  }, [studentId]);

  const personalDetails = [
    { key: 'USN Number', value: student?.usnNumber },
    { key: 'Admission Number', value: student?.admissionNumber },
    { key: 'Name', value: `${student?.firstName} ${student?.middleName} ${student?.lastName}` },
    { key: 'Email', value: student?.email },
    { key: 'Gender', value: student?.gender },
    { key: 'Contact Number', value: student?.contactNumber },
    { key: 'Blood Group', value: student?.bloodGroup },
    { key: 'Place of Birth', value: student?.placeOfBirth },
    { key: "Father's Full Name", value: student?.fatherFullName },
    { key: "Mother's Name", value: student?.motherName },
    { key: 'Parent Contact Number', value: student?.parentContactNumber },
    { key: 'Parent Email', value: student?.parentEmail },
    { key: 'Guardian Name', value: student?.guardianName },
    { key: 'Guardian Contact Number', value: student?.guardianContactNumber },
    { key: 'Caste', value: student?.caste },
    { key: 'Religion', value: student?.religion },
    { key: 'Nationality', value: student?.nationality },
    { key: 'Category', value: student?.category },
    { key: 'Rural/Urban Status', value: student?.ruralUrbanStatus },
    { key: 'Physically Challenged', value: student?.physicallyChallenged ? 'Yes' : 'No' },
    { key: 'Date of Join', value: convertDateFormat(`${student?.dateOfJoin}`) },
    { key: 'Identification Mark', value: student?.identificationMark },
    { key: 'Annual Income', value: student?.annualIncome },
    { key: 'Mother Tongue', value: student?.motherTongue },
  ];

  const addressDetails = [
    { key: 'Present Address', value: student?.presentAddress?.address },
    { key: 'Present Country', value: student?.presentAddress?.country },
    { key: 'Present State', value: student?.presentAddress?.state },
    { key: 'Present District', value: student?.presentAddress?.district },
    { key: 'Present Taluk', value: student?.presentAddress?.taluk },
    { key: 'Present City', value: student?.presentAddress?.city },
    { key: 'Present Pincode', value: student?.presentAddress?.pincode },

    { key: 'Permanent Address', value: student?.permanentAddress?.address },
    { key: 'Permanent Country', value: student?.permanentAddress?.country },
    { key: 'Permanent State', value: student?.permanentAddress?.state },
    { key: 'Permanent District', value: student?.permanentAddress?.district },
    { key: 'Permanent Taluk', value: student?.permanentAddress?.taluk },
    { key: 'Permanent City', value: student?.permanentAddress?.city },
    { key: 'Permanent Pincode', value: student?.permanentAddress?.pincode },
  ];

  const academicDetails = [
    { key: 'Entrance Test Marks', value: student?.entranceTestMarks },
    { key: 'CET Ranking', value: student?.cetRanking },
    { key: 'Current Semester', value: student?.semester },
    { key: '12th/PU Physics Marks', value: student?.puOr12thMarks?.physics },
    { key: '12th/PU Mathematics Marks', value: student?.puOr12thMarks?.mathematics },
    { key: '12th/PU Biology Marks', value: student?.puOr12thMarks?.biology },
    { key: '12th/PU Computer Science Marks', value: student?.puOr12thMarks?.computerScience },
    { key: '12th/PU Electronics Marks', value: student?.puOr12thMarks?.electronics },
    { key: 'Diploma Marks', value: student?.diplomaMarks },
    { key: 'Department Name', value: student?.department?.name },
    { key: 'Department Code', value: student?.department?.departmentCode },
  ];

  const admissionDetails = [
    { key: 'Admission Number', value: student?.admissionNumber },
    { key: 'Year of Admission', value: student?.yearOfAdmission },
    { key: 'Admission Status', value: student?.admissionStatus },
    { key: 'Seat Type', value: student?.seatType },
    { key: 'Admission Type', value: student?.admissionType },
    { key: 'Admission Semester', value: student?.admissionSemester },
  ];

  const bankDetails = [
    { key: 'Aadhar Number', value: student?.aadharNumber },
    { key: 'PAN Number', value: student?.panNumber },
    { key: 'Bank Name', value: student?.bankDetails?.bankName },
    { key: 'Branch Address', value: student?.bankDetails?.branchAddress },
    { key: 'Branch Code', value: student?.bankDetails?.branchCode },
    { key: 'Account Holder Name', value: student?.bankDetails?.accountHolderName },
    { key: 'Account Number', value: student?.bankDetails?.accountNumber },
    { key: 'IFSC Code', value: student?.bankDetails?.ifscCode },
    { key: 'MICR Code', value: student?.bankDetails?.micrCode },
  ];

  const hostelDetails = [
    { key: 'Hostel Required', value: student?.hostelRequired ? 'Yes' : 'No' },
    { key: 'Transport Required', value: student?.transportRequired ? 'Yes' : 'No' },
  ];

  const documentsDetails = [
    { key: 'SSLC Marks Card', value: student?.documents?.sslcMarksCard, isDocument: true },
    { key: 'Transfer Certificate', value: student?.documents?.transferCertificate, isDocument: true },
    { key: 'Study Certificate', value: student?.documents?.studyCertificate, isDocument: true },
    { key: 'Aadhar Card', value: student?.documents?.aadharCard, isDocument: true },
    { key: 'Caste & Income Certificate', value: student?.documents?.casteIncomeCertificate, isDocument: true },
    {
      key: 'Birth Certificate / Ration Card',
      value: student?.documents?.birthCertificateOrRationCard,
      isDocument: true,
    },
    { key: 'Rural Certificate', value: student?.documents?.ruralCertificate, isDocument: true },
    { key: 'Kannada Medium Certificate', value: student?.documents?.kannadaMediumCertificate, isDocument: true },
    { key: 'Character Certificate', value: student?.documents?.characterCertificate, isDocument: true },
    { key: 'Migration Certificate', value: student?.documents?.migrationCertificate, isDocument: true },
    { key: 'Bank Account Details', value: student?.documents?.accountDetails, isDocument: true },
    { key: 'Undertaking by Student', value: student?.documents?.undertakingByStudent, isDocument: true },
    { key: 'Undertaking by Parent', value: student?.documents?.undertakingByParent, isDocument: true },
    { key: 'Other Documents', value: student?.documents?.other, isDocument: true },
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
        <span className={style.backButton} onClick={() => setStudentId('')}>
          <ArrowLeftIcon />
        </span>
        Student Details
      </div>
      <div className={style.container}>
        <MenuContainer
          imageSrc={imageSrc}
          name={student?.firstName ? `${student?.firstName} ${student?.lastName}` : ''}
          menuItems={menuItems}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <div className={style.contentBox}>
          {student ? (
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
          ) : (
            <div className={style.loaderBox}>
              <Spinner />
            </div>
          )}
        </div>
        <ViewDocumentDialog dialog={dialog} onClose={() => setDialog('')} />
      </div>
    </>
  );
};

export default ViewStudentPage;
