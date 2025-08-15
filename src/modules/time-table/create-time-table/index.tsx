import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useTimeTableStore, { TimeTableIF } from '../../../store/timeTableStore';
import { useEffect, useState } from 'react';
import useEmployeeStore from '../../../store/employeeStore';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';
import useGroupStore from '../../../store/groupStore';
import { useTimeTableLocalStore } from '../timeTableLocalStore';

const CreateTimeTableDialog: React.FC = () => {
  const { department, semester, weekName, showDialog, setShowDialog, timeTableId } = useTimeTableLocalStore();
  const { getFilteredEmployees, filteredEmployees } = useEmployeeStore();
  const { getFilteredGroups, filteredGroups } = useGroupStore();
  const { getTimeTables, getTimeTable, updateTimeTable, createTimeTable, timeTable, loading } = useTimeTableStore();

  const [groupList, setGroupList] = useState<SelectOptionIF[]>([]);
  const [employeeList, setEmployeeList] = useState<SelectOptionIF[]>([]);

  const update = showDialog === 'update';

  useEffect(() => {
    if (!department || !semester || !timeTableId) return;
    getTimeTable(timeTableId);
  }, [timeTableId]);
  useEffect(() => {
    getFilteredEmployees({ pageNumber: 1, pageSize: 100 });
  }, []);

  useEffect(() => {
    if (department && semester) getFilteredGroups({ department, semester });
  }, [department, semester]);

  useEffect(() => {
    const options = filteredGroups.map((filteredGroup) => {
      return {
        label: filteredGroup.name,
        value: filteredGroup._id,
      };
    });
    setGroupList(options);
  }, [filteredGroups]);

  const onSubmit = async (values: TimeTableIF) => {
    const wholeGroupData = filteredGroups.find((item) => item._id === values.group);

    const reqBody = {
      department,
      semester,
      batch: timeTable?.group?.batch || '',
      subject: `${wholeGroupData?.subject._id}`,
      week: timeTable?.week || '',
      startTime: timeTable?.startTime || '',
      endTime: timeTable?.endTime || '',
      group: timeTable?.group._id || '',
      teacher: timeTable?.teacher._id || '',
    };

    values.subject = `${wholeGroupData?.subject._id}`;

    values.department = department;
    values.semester = Number(semester);
    const res =
      timeTableId && update
        ? await updateTimeTable({ updatedValue: values, oldValue: reqBody })
        : await createTimeTable(values);
    if (res) {
      getTimeTables({ department, semester, week: weekName });
      setShowDialog('');
    }
  };

  const onChangeInputHandler = (fields: FieldIF[]) => {
    const index = getFieldIndex(fields); // Ensure this returns a valid number

    if (typeof index !== 'number' || index < 0 || index >= fields.length) {
      console.error("Invalid index returned from getFieldIndex");
      return;
    }

    const group = filteredGroups.find((item) => item._id === fields[index].value);

    if (group) {
      const result = group.teachers.map((teacher) => ({
        label: `${teacher.firstName} ${teacher.lastName}`,
        value: teacher._id,
      }));
      setEmployeeList(result);
    }
    if (index === 3) {
      fields[index + 1].value = '';
    }
  };

  if (Boolean(showDialog) && department && semester) {
    return (
      <RenderFormbuilderForm
        formName="Create Time Table Form"
        formHeader={`${update ? 'Update' : 'Create'} TimeTable Form`}
        existingForm={update ? timeTable : null}
        goBack={() => setShowDialog('')}
        onSubmit={onSubmit}
        dynamicOptions={[groupList, employeeList, [], [], []]}
        onChange={onChangeInputHandler}
        large
        loading={loading}
      />
    );
  } else {
    return <></>;
  }
};

export default CreateTimeTableDialog;

// Implementing getFieldIndex function
function getFieldIndex(fields: FieldIF[]): number {
  // Assuming you are looking for a specific condition for the index, for example, you want to find a specific value
  const fieldValue = "someValue"; // Replace with the actual value you're looking for
  const index = fields.findIndex(field => field.value === fieldValue);
  
  // If not found, -1 will be returned. You can change this condition if needed.
  return index;
}
