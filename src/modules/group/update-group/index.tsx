import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useGroupStore, { createGroupPayloadIF } from '../../../store/groupStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import useStudentStore from '../../../store/studentStore';
import useSubjectStore from '../../../store/subjectStore';
import useEmployeeStore from '../../../store/employeeStore';

const UpdateGroupPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFilteredStudents, studentOptions, emptyStudentOptions } = useStudentStore();
  const { updateGroup, group, getGroup, loading } = useGroupStore();
  const { getAllTeacherList, allTeacherOptions } = useEmployeeStore();

  useEffect(() => {
    getAllTeacherList();
  }, []);
  useEffect(() => {
    if (!id) return;

    getGroup(id);
  }, [id]);

  useEffect(() => {
    if (!group?.department) {
      emptyStudentOptions();
      return;
    }
    getFilteredStudents({ department: group?.department, semester: group?.semester });
  }, [group]);

  const updateFormSubmit = async (values: createGroupPayloadIF) => {
    const res = id ? await updateGroup(values, id) : null;
    if (res) {
      navigate(-1);
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Update Group Form"
      formHeader="Update Group Form"
      existingForm={group}
      goBack={() => navigate(-1)}
      onSubmit={updateFormSubmit}
      dynamicOptions={[studentOptions, allTeacherOptions]}
      onChange={() => {}}
      loading={loading}
      small
    />
  );
};

export default UpdateGroupPage;
