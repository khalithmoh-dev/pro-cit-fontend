import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useEmployeeStore, { createEmployeePayloadIF } from '../../../store/employeeStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import useDesignationStore from '../../../store/designationStore';
import useRoleStore from '../../../store/roleStore';

interface PropsIF {
  update?: boolean;
}

const CreateEmployeePage: React.FC<PropsIF> = ({ update }) => {
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
