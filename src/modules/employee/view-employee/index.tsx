import { useEffect, useState } from 'react';
import style from './view-employee.module.css';
import useEmployeeStore from '../../../store/employeeStore';
import { useNavigate, useParams } from 'react-router-dom';
import TableControlBox from '../../../components/table-control-box';
import ArrowLeftIcon from '../../../icon-components/ArrowLeftIcon';
import UsersIcon from '../../../icon-components/UsersIcon';
import MenuContainer from './menu-container';
import httpRequest from '../../../utils/functions/http-request';
import convertDateFormat from '../../../utils/functions/convert-date-format';
import Spinner from '../../../components/spinner';

const menuItems = [
  'Personal Details',
  'Employment Details',
  'Address Details',
  'System Details',
  'Bank Details',
  'Calendar Events',
  'Attendance Details',
  'Change Password',
];
interface KeyValueIF {
  key: string;
  value: any;
}
interface PropsIF {
  employeeId: string;
  setEmployeeId: (id: string) => void;
}

const ViewEmployeePage: React.FC<PropsIF> = ({ employeeId, setEmployeeId }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const { employee, getEmployeeWithPopulate } = useEmployeeStore();
  // const { id } = useParams();
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState(null);

  // Function to fetch and display the image
  const getFile = async () => {
    if (!employee?.profilePhoto) return;
    try {
      const res = await httpRequest('POST', `${import.meta.env.VITE_API_URL}/form/get/file`, {
        fileName: employee.profilePhoto,
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

  // Call getFile when the component mounts or `employee` changes
  useEffect(() => {
    if (employee) {
      getFile();
    }
  }, [employee]);

  useEffect(() => {
    if (!employeeId) return;
    getEmployeeWithPopulate(employeeId);
  }, [employeeId]);

  const personalDetails = [
    {
      key: 'Employee Code',
      value: employee?.employeeCode,
    },
    {
      key: 'Name',
      value: employee
        ? `${employee?.salutation} ${employee?.firstName} ${employee?.middleName} ${employee?.lastName}`
        : '',
    },
    {
      key: 'Designation',
      value: employee?.designation.name,
    },
    {
      key: 'Role',
      value: employee?.role.name,
    },
    {
      key: 'Contact Number',
      value: employee?.contactNumber,
    },
    {
      key: 'Email',
      value: employee?.email,
    },
    {
      key: 'Blood Group',
      value: employee?.bloodGroup,
    },
    {
      key: 'Biometric ID',
      value: employee?.biometricId,
    },
    {
      key: 'Emergency Contact Number',
      value: employee?.emergencyContactNumber,
    },
  ];

  const employmentDetails = [
    {
      key: 'Department',
      value: employee?.department.name,
    },
    {
      key: 'Other Departments',
      value: employee?.otherDepartments.map((item) => `${item.departmentCode}, `),
    },
    {
      key: 'Department Code',
      value: employee?.department?.departmentCode,
    },
    {
      key: 'Employment Type',
      value: employee?.employmentType,
    },
    {
      key: 'Qualification',
      value: employee?.qualification,
    },
    {
      key: 'Date of Joining',
      value: employee?.dateOfJoin,
    },
    {
      key: 'Date of Relieving',
      value: employee?.dateOfRelieve,
    },
    {
      key: 'Terms and Conditions',
      value: employee?.termsAndConditions ? 'Accepted' : 'Not Accepted',
    },
  ];

  const addressDetails = [
    { key: 'Present Address', value: employee?.presentAddress?.address },
    { key: 'Present Country', value: employee?.presentAddress?.country },
    { key: 'Present State', value: employee?.presentAddress?.state },
    { key: 'Present District', value: employee?.presentAddress?.district },
    { key: 'Present Taluk', value: employee?.presentAddress?.taluk },
    { key: 'Present City', value: employee?.presentAddress?.city },
    { key: 'Present Pincode', value: employee?.presentAddress?.pincode },

    { key: 'Permanent Address', value: employee?.permanentAddress?.address },
    { key: 'Permanent Country', value: employee?.permanentAddress?.country },
    { key: 'Permanent State', value: employee?.permanentAddress?.state },
    { key: 'Permanent District', value: employee?.permanentAddress?.district },
    { key: 'Permanent Taluk', value: employee?.permanentAddress?.taluk },
    { key: 'Permanent City', value: employee?.permanentAddress?.city },
    { key: 'Permanent Pincode', value: employee?.permanentAddress?.pincode },
  ];

  const systemDetails = [
    {
      key: 'Last Login',
      value: convertDateFormat(`${employee?.lastLogin}`),
    },
    {
      key: 'Created At',
      value: convertDateFormat(`${employee?.createdAt}`),
    },
    {
      key: 'Updated At',
      value: convertDateFormat(`${employee?.updatedAt}`),
    },
    {
      key: 'Version',
      value: employee?.__v,
    },
  ];
  const bankDetails = [
    { key: 'Aadhar Number', value: employee?.aadharNumber },
    { key: 'PAN Number', value: employee?.panNumber },
    { key: 'Bank Name', value: employee?.bankDetails?.bankName },
    { key: 'Branch Address', value: employee?.bankDetails?.branchAddress },
    { key: 'Branch Code', value: employee?.bankDetails?.branchCode },
    { key: 'Account Holder Name', value: employee?.bankDetails?.accountHolderName },
    { key: 'Account Number', value: employee?.bankDetails?.accountNumber },
  ];

  const renderArray: KeyValueIF[] = (() => {
    switch (selectedMenu) {
      case 0:
        return personalDetails;
      case 1:
        return employmentDetails;
      case 2:
        return addressDetails;
      case 3:
        return systemDetails;
      case 4:
        return bankDetails;
      default:
        return [];
    }
  })();

  return (
    <>
      <div className={style.pageName}>
        <span className={style.backButton} onClick={() => setEmployeeId('')}>
          <ArrowLeftIcon />
        </span>
        Employee Details
      </div>
      <div className={style.container}>
        <MenuContainer
          imageSrc={imageSrc}
          employee={employee}
          menuItems={menuItems}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <div className={style.contentBox}>
          {employee ? (
            <div className={style.tableContainer}>
              {renderArray.map((item, index) => (
                <div className={style.tableRow} key={index}>
                  <div className={style.tableLeft}>{item.key}</div>
                  <div className={style.tableRight}>{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={style.loaderBox}>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewEmployeePage;
