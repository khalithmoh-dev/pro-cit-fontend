import React from 'react';
import style from "./render-formbuilder.module.css";

interface FeeFieldProps {
  index: number;
  group: {
    category_name: string;
    amount: number;
    duration_type: string;
    is_mandatory: boolean;
    applicable_semesters: number[];
    applicable_year: number[];
  };
  onChange: (index: number, field: string, value: any) => void;
}

const durationTypes = ["One-Time", "Per Year"]; // Add more types if needed
const totalSemesters = [1, 2, 3]; // Adjust based on your requirements

const FeeFieldComponent: React.FC<FeeFieldProps> = ({ index, group, onChange }) => {
  return (
    <div >
      <div className={style.cetory}>
        <label>
          Category Namedg:
          <input
            type="text"
            value={group.category_name}
            onChange={(e) => onChange(index, "category_name", e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={group.amount}
            onChange={(e) => onChange(index, "amount", Number(e.target.value))}
            required
          />
        </label>
        <label>
          Duration Type:
          <select
            value={group.duration_type}
            onChange={(e) => onChange(index, "duration_type", e.target.value)}
            required
          >
            {durationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Is Mandatory:
        <input
          type="checkbox"
          checked={group.is_mandatory}
          onChange={(e) => onChange(index, "is_mandatory", e.target.checked)}
        />
      </label>
      <label>
        Applicable Year:
        {totalSemesters.map((semester) => (
          <div key={semester}>
            <input
              type="checkbox"
              checked={group.applicable_semesters?.includes(semester)}
              onChange={(e) => {
                const updatedSemesters = e.target.checked
                  ? [...group.applicable_semesters, semester]
                  : group.applicable_semesters?.filter(s => s !== semester);
                onChange(index, "applicable_semesters", updatedSemesters);
              }}
            />
            Year {semester}
          </div>
        ))}
      </label>
    </div>
  );
};

export default FeeFieldComponent;
