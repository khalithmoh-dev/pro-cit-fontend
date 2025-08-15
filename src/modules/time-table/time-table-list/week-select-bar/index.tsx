import { useEffect, useState } from 'react';
import SingleSelect from '../../../../components/single-select';
import style from './week-select.module.css';
import useDepartmentStore from '../../../../store/departmentStore';
import { SelectOptionIF } from '../../../../interface/component.interface';
import { useToastStore } from '../../../../store/toastStore';
import { useTimeTableLocalStore } from '../../timeTableLocalStore';
import useAuthStore from '../../../../store/authStore';

const weekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const InputContainer: React.FC = () => {
  const { getDepartments, departments } = useDepartmentStore();
  const { showToast } = useToastStore();
  const { user } = useAuthStore();

  const { setDepartment, setSemester, setWeekName, weekName } = useTimeTableLocalStore();
  const [activeWeek, setActiveWeek] = useState(weekName);

  const [departmentList, setDepartmentList] = useState<SelectOptionIF[]>([]);
  const [semesterList, setSemesterList] = useState<SelectOptionIF[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<SelectOptionIF | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SelectOptionIF | null>(null);

  useEffect(() => {
    if (departments.length) return;
    getDepartments();
  }, []);

  const onChangeDepartmentHandler = (option: SelectOptionIF) => {
    let totalSemesters = 0;
    setSelectedDepartment(option);
    setDepartment(option.value);
    departments?.forEach((field) => {
      if (field._id === option.value) {
        totalSemesters = field.totalSemesters;
        if (Number(selectedSemester?.value) > field.totalSemesters) {
          setSelectedSemester(null);
          setSemester('');
        }
      }
    });
    setSemesterList(semesterSampleList.filter((item) => Number(item.value) <= totalSemesters));
  };

  useEffect(() => {
    if (departments.length === 0) return;
    const options = departments.map((department) => {
      return {
        label: department.departmentCode,
        value: department._id,
      };
    });
    if (user?.user?.role?.name !== 'admin' && user?.user?.role.name !== 'superadmin') {
      setDepartmentList([
        {
          label: `${user?.user?.department?.departmentCode}`,
          value: `${user?.user?.department?._id}`,
        },
      ]);
    } else {
      setDepartmentList(options);
    }
  }, [departments]);

  const onChangeDepartment = (option: SelectOptionIF) => {
    setSelectedSemester(option);
    setSemester(option.value);
  };

  const weekClickHandler = (weekName: string) => {
    if (!selectedDepartment) {
      showToast('warning', 'Please select a Department');
      return;
    } else if (!selectedSemester) {
      showToast('warning', 'Please select a Semester');
      return;
    }
    setActiveWeek(weekName);
    setWeekName(weekName);
  };
  return (
    <div className={style.container}>
      <div className={style.fieldsContainer}>
        <SingleSelect
          className={style.singleSelect}
          label="Select Department"
          options={departmentList}
          onChange={onChangeDepartmentHandler}
          selectedValue={selectedDepartment?.value}
        />
        <SingleSelect
          className={style.singleSelect}
          label="Select Semester"
          options={semesterList}
          onChange={onChangeDepartment}
          selectedValue={selectedSemester?.value}
        />
      </div>
      <div className={style.weekContainer}>
        {weekNames.map((weekName: string, index: number) => (
          <div
            key={index}
            onClick={() => weekClickHandler(weekName)}
            className={`${style.weekName} ${activeWeek === weekName ? style.activeWeekName : ''}`}
          >
            {weekName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputContainer;

const semesterSampleList = [
  {
    label: '1st Semester',
    value: '1',
  },
  {
    label: '2nd Semester',
    value: '2',
  },
  {
    label: '3rd Semester',
    value: '3',
  },
  {
    label: '4th Semester',
    value: '4',
  },
  {
    label: '5th Semester',
    value: '5',
  },
  {
    label: '6th Semester',
    value: '6',
  },
  {
    label: '7th Semester',
    value: '7',
  },
  {
    label: '8th Semester',
    value: '8',
  },
  {
    label: '9th Semester',
    value: '9',
  },
  {
    label: '10th Semester',
    value: '10',
  },
];
