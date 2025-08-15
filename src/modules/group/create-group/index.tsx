import { useNavigate } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useGroupStore, { createGroupPayloadIF } from '../../../store/groupStore';
import { useEffect, useState } from 'react';
import useDepartmentStore from '../../../store/departmentStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import useStudentStore from '../../../store/studentStore';
import useSubjectStore from '../../../store/subjectStore';
import useEmployeeStore from '../../../store/employeeStore';
import { semesterSampleList } from '../../../utils/static-data';

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { getDepartments, departmentOptions, departments } = useDepartmentStore();
  const { getFilteredSubjects, filteredSubjects, subjectOptions } = useSubjectStore();
  const { getFilteredStudents, studentOptions, emptyStudentOptions } = useStudentStore();
  const { createGroup, loading } = useGroupStore();
  const { getAllTeacherList, allTeacherOptions } = useEmployeeStore();
  const [semesterList, setSemesterList] = useState<SelectOptionIF[]>([]);
  const [batchList, setBatchList] = useState<SelectOptionIF[]>([]);

  useEffect(() => {
    if (!departmentOptions.length) getDepartments();
    getAllTeacherList();
    emptyStudentOptions();
  }, []);

  const onSubmitHandler = async (values: createGroupPayloadIF) => {
    const res = await createGroup(values);
    if (res) {
      navigate(-1);
    }
  };

  const onChangeInputHandler = (fields: FieldIF[]) => {
    if (!fields[2] || typeof fields[2].value !== 'number') return; // Ensure that fields[2] exists and is a number
    if (!fields[3] || typeof fields[3].value !== 'number') return; // Same for fields[3]
    
    let totalSemesters = 0;
    departments?.forEach((field) => {
      if (field._id === fields[2].value) {
        totalSemesters = field.totalSemesters;
        if (fields[3].value > field.totalSemesters) {
          fields[3].value = 0;
        }
      }
    });
  
    // Ensure fields[2] and fields[3] have valid values before using them
    if (fields[2].value && fields[3].value) {
      getFilteredSubjects({ department: fields[2].value, semester: fields[3].value });
    }
  
    // Ensure all fields are valid numbers before comparing
    if (fields[2].value && fields[3].value && fields[4].value && fields[5].value) {
      getFilteredStudents({ department: fields[2].value, semester: fields[3].value });
    }
  
    setSemesterList(semesterSampleList.filter((item) => Number(item.value) <= totalSemesters));
  
    if (!fields[4] || typeof fields[4].value !== 'number') return; // Ensure fields[4] exists and is a number
    let totalBatches = 0;
    filteredSubjects?.forEach((field) => {
      if (field._id === fields[4].value) {
        totalBatches = field.totalBatches;
        if (fields[5].value > field.totalBatches) {
          fields[5].value = 0;
        }
      }
    });
  
    setBatchList(batchSampleList.filter((item) => Number(item.value) <= totalBatches));
  };
  return (
    <RenderFormbuilderForm
      formName="Create Group Form"
      formHeader="Create Group Form"
      existingForm={null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmitHandler}
      dynamicOptions={[departmentOptions, semesterList, subjectOptions, batchList, studentOptions, allTeacherOptions]}
      onChange={onChangeInputHandler}
      loading={loading}
      large
    />
  );
};

export default CreateGroupPage;

const batchSampleList = [
  {
    label: 'First batch',
    value: '1',
  },
  {
    label: 'Second batch',
    value: '2',
  },
  {
    label: 'Third batch',
    value: '3',
  },
  {
    label: 'Forth batch',
    value: '4',
  },
  {
    label: 'Fifth batch',
    value: '5',
  },
];


