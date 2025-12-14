import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useEmployeeStore, { createEmployeePayloadIF } from '../../../store/employeeStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import useDesignationStore from '../../../store/designationStore';
import useRoleStore from '../../../store/roleStore';
import StepperComponet from '../../../components/Stepper/Stepper';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

interface PropsIF {
  update?: boolean;
}

const CreateEmployeePage: React.FC<PropsIF> = ({ update }) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(0);
  const StepperData = [
    {
      stepName: 'Personal',
      formSchema: {
        fields: {
          GENERAL: [
            {
              name: 'insName',
              label: t('INSTITUTION_NAME'),
              type: 'text',
              validation: Yup.string().required(t('INSTITUTION_NAME_REQUIRED')),
              isRequired: true,
            },
            {
              name: 'insCode',
              label: t('INSTITUTION_CODE'),
              type: 'text',
              validation: Yup.string().required(t('INSTITUTION_CODE_IS_REQUIRED')),
              isRequired: true,
            },
            {
              name: 'isOrg',
              validation: Yup.boolean(),
              label: `${t('IS_ORGANISATION')}?`,
              type: 'checkbox',
              removeHeader: true,
            },
            {
              name: 'acrtdBy',
              label: t('ACCREDITED_BY'),
              type: 'text',
            },
            {
              name: 'insDesc',
              label: t('INSTITUTION_DESCRIPTION'),
              type: 'Textarea',
            },
            { name: 'insLogo', label: t('INSTITUTION_LOGO'), type: 'file', size: '', format: 'image' },
          ],
          INSTITUTION_CONTACT: [
            {
              name: 'addr1',
              label: `${t('ADDRESS_LINE')} 1`,
              type: 'text',
            },
            {
              name: 'addr2',
              label: `${t('ADDRESS_LINE')} 2`,
              type: 'text',
            },
            {
              name: 'addr3',
              label: `${t('ADDRESS_LINE')} 3`,
              type: 'text',
            },
            {
              name: 'pnCd',
              label: t('PINCODE'),
              type: 'number',
            },
            {
              name: 'cntctNum',
              label: t('CONTACT_NUMBER'),
              type: 'number',
            },
            {
              name: t('EMAIL'),
              label: t('EMAIL'),
              type: 'text',
            },
            {
              name: 'webSt',
              label: t('WEBSITE'),
              type: 'text',
            },
          ],
          BILLING_DEPARTMENT_CONTACT: [
            {
              name: 'billCntctNm',
              label: t('CONTACT_PERSON_NAME'),
              type: 'text',
            },
            {
              name: 'billCntctNum',
              label: t('PHONE_NUMBER'),
              type: 'text',
            },
            {
              name: 'billCntctMail',
              label: t('EMAIL'),
              type: 'text',
            },
          ],
          ADMISSION_DEPARTMENT_CONTACT: [
            {
              name: 'admCntctNm',
              label: t('CONTACT_PERSON_NAME'),
              type: 'text',
            },
            {
              name: 'admCntctNum',
              label: t('PHONE_NUMBER'),
              type: 'text',
            },
            {
              name: 'admCntctMail',
              label: t('EMAIL'),
              type: 'text',
            },
          ],
          EXAMINATION_DEPARTMENT_CONTACT: [
            {
              name: 'xmCntctNm',
              label: t('CONTACT_PERSON_NAME'),
              type: 'text',
            },
            {
              name: 'xmCntctNum',
              label: t('PHONE_NUMBER'),
              type: 'text',
            },
            {
              name: 'xmCntctMail',
              label: t('EMAIL'),
              type: 'text',
            },
          ],
          GENERAL_ENQUIRY: [
            {
              name: 'gnCntctNm',
              label: t('CONTACT_PERSON_NAME'),
              type: 'text',
            },
            {
              name: 'gnCntctNum',
              label: t('PHONE_NUMBER'),
              type: 'text',
            },
            {
              name: 'gnCntctMail',
              label: t('EMAIL'),
              type: 'text',
            },
          ],
          WORKING_DAYS: [
            {
              name: 'wrkDys',
              isMulti: true,
              type: 'checkbox',
              data: [
                { label: t('SUNDAY'), value: 'SUNDAY' },
                { label: t('MONDAY'), value: 'MONDAY' },
                { label: t('TUESDAY'), value: 'TUESDAY' },
                { label: t('WEDNESDAY'), value: 'WEDNESDAY' },
                { label: t('THURSDAY'), value: 'THURSDAY' },
                { label: t('FRIDAY'), value: 'FRIDAY' },
                { label: t('SATURDAY'), value: 'SATURDAY' },
              ],
            },
          ],
          SMS_CONFIGURATION: [
            {
              name: 'smsUrl',
              label: t('URL'),
              type: 'text',
            },
            {
              name: 'smsPwd',
              label: t('PASSWORD'),
              type: 'text',
            },
            {
              name: 'smsUsrId',
              label: t('USER_ID'),
              type: 'text',
            },
            {
              name: 'smsSndrId',
              label: t('SENDER_ID'),
              type: 'text',
            },
            {
              name: 'smsApiKey',
              label: t('API_KEY'),
              type: 'text',
            },
          ],
          ABSENT_NOTIFICATION: [
            {
              name: 'isAbsNtf',
              validation: Yup.boolean(),
              label: t('CAN_SEND_ABSENT_NOTIFICATION'),
              type: 'checkbox',
              removeHeader: true,
            },
            {
              name: 'absntTmplt',
              label: t('ABSENT_NOTIFICATION_TEMPLATE'),
              type: 'Textarea',
              showWhen: {
                field: 'isAbsNtf',
                value: true,
              },
              validation: Yup.string().when('isAbsNtf', {
                is: true,
                then: () => Yup.string().required(t('ABSENT_NOTIFICATION_TEMPLATE_IS_REQUIRED')),
                otherwise: () => Yup.string(),
              }),
              isRequired: true,
            },
          ],
          BIRTHDAY_MESSAGE: [
            {
              name: 'isBdayMsg',
              label: t('CAN_SEND_BIRTHDAY_MESSAGE'),
              type: 'checkbox',
              removeHeader: true,
            },
            {
              name: 'bDayTmplt',
              label: t('BIRTHDAY_MESSAGE_TEMPLATE'),
              type: 'Textarea',
              showWhen: {
                field: 'isBdayMsg',
                value: true,
              },
              validation: Yup.string().when('isBdayMsg', {
                is: true,
                then: () => Yup.string().required(t('BIRTHDAY_MESSAGE_TEMPLATE_IS_REQUIRED')),
                otherwise: () => Yup.string(),
              }),
              isRequired: true,
            },
          ],
        },
        buttons: [
          {
            name: t('Next'),
            variant: 'contained',
            nature: 'primary',

            onClick: () => {
              setActiveKey((prev) => prev + 1);
            },
          },
        ],
      },
    },
    {
      stepName: 'Contact',
      formSchema: {
        fields: {
          '': [
            {
              name: 'selectedCourse',
              label: t('COURSE'),
              type: 'select',
              labelKey: 'parsedData',
              valueKey: '_id',
              isApi: true, // Flag for API-based search
              // inputValue: searchInputValue,
              // setInputValue: handleSearchFieldChange,
              //onChange: handleCourseSelection,
              //options: courseOptions ?? [],
              //isLoading: isLoading,
            },
            {
              name: 'capacity',
              label: t('CAPACITY'),
              type: 'number',
            },
          ],
        },
        buttons: [
          {
            name: t('Previous'),
            variant: 'outlined',
            nature: 'secondary',
            isDisabled: false,
            onClick: () => {
              setActiveKey((prev) => prev - 1);
            },
          },
          {
            name: t('Next'),
            variant: 'contained',
            nature: 'primary',
            onClick: () => {
              setActiveKey((prev) => prev + 1);
            },
          },
        ],
      },
    },
    {
      stepName: 'Employment',
      formSchema: {
        fields: {
          General: [
            {
              name: 'insId',
              label: t('INSTITUTION_NAME'),
              type: 'select',
              validation: Yup.string().required(t('INSTITUTION_NAME_IS_REQUIRED')),
              isRequired: true,
              isDisabled: true,
            },
            {
              name: 'deptCd',
              label: t('DEPARTMENT_CODE'),
              type: 'text',
              validation: Yup.string().required(t('DEPARTMENT_CODE_IS_REQUIRED')),
              isRequired: true,
            },
            {
              name: 'deptNm',
              label: t('DEPARTMENT_NAME'),
              type: 'text',
              validation: Yup.string().required(t('DEPARTMENT_NAME_IS_REQUIRED')),
              isRequired: true,
            },
            {
              name: 'desc',
              label: t('DESCRIPTION'),
              type: 'text',
            },
            {
              name: 'maxmStgth',
              label: t('MAXIMUM_STRENGTH'),
              type: 'number',
            },
            {
              name: 'hod',
              label: t('HEAD_OF_THE_DEPARTMENT'),
              type: 'select',
              labelKey: 'empName',
              valueKey: '_id',
              isMulti: true,
              isApi: true,
              // inputValue: stfInptVal,
              //setInputValue: handleInputChange,
              // options: baseData?.employee ?? [],
              // isLoading: isLoading,
            },
          ],
        },
        buttons: [
          {
            name: t('Previous'),
            variant: 'outlined',
            nature: 'warning',
            isDisabled: false,
            onClick: () => {
              setActiveKey((prev) => prev - 1);
            },
          },
          {
            name: t('Submit'),
            variant: 'contained',
            nature: 'primary',
            type: 'submit',
          },
        ],
      },
    },
  ];
  return (
    <>
      <StepperComponet StepperData={StepperData} activeStep={activeKey} onFormSubmit={() => {}}></StepperComponet>
    </>
  );

  return <>WTF</>;
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartments, departmentOptions } = useDepartmentStore();
  const { updateEmployee, createEmployee, employee, getEmployee, getEmployees, loading } = useEmployeeStore();
  const { getDesignations, designationOptions } = useDesignationStore();
  const { getRoles, roleOptions } = useRoleStore();

  useEffect(() => {
    if (!id) return;
    getEmployee(id);
  }, [id]);

  useEffect(() => {
    if (!departmentOptions.length) getDepartments();
    if (!designationOptions.length) getDesignations();
    if (!roleOptions.length) getRoles();
  }, []);

  const onSubmit = async (values: createEmployeePayloadIF) => {
    if (values.permanentSameAsPresent) values.permanentAddress = values.presentAddress;
    const res = id && update ? await updateEmployee(values, id) : await createEmployee(values);
    if (res) {
      getEmployees();
      navigate(-1);
    }
  };
  const onChangeInputHandler = (fields: FieldIF[]) => {
    // ============ Address Hide Logic =============
    const permanentSameAsPresentField = fields.filter((field) => field.keyName === 'permanentSameAsPresent');
    const permanentAddressField = fields.filter((field) => field.keyName === 'permanentAddress');
    permanentAddressField[0].hide = permanentSameAsPresentField[0].value;
    permanentAddressField[0].settings[0].value = !permanentSameAsPresentField[0].value;
    // =============================================
  };

  return (
    <RenderFormbuilderForm
      formName="Create Employee Form"
      formHeader={`${update ? 'Update' : 'Create'} Employee Form`}
      existingForm={update ? employee : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      dynamicOptions={[departmentOptions, designationOptions, roleOptions, departmentOptions]}
      onChange={onChangeInputHandler}
      extraLarge
      loading={loading}
    />
  );
};

export default CreateEmployeePage;
