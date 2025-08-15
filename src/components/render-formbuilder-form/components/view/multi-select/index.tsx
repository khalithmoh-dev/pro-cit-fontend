import React, { useEffect, useState } from 'react';
import { FieldIF } from '../../../../../interface/component.interface';
import styles from './MultiSelectView.module.css'; // Importing module CSS
import SelectOptionDialog from './options-dialog';

interface MultiSelectPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
  dynamicOptions: SelectOptionIF[][];
}

export interface SelectOptionIF {
  label: string;
  value: string;
}

const MultiSelectView: React.FC<MultiSelectPropsIF> = ({ index, form, setForm, dynamicOptions = [[]] }) => {
  const data: FieldIF[] = [...form];
  const field = data[index];
  const [isModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectOptionIF[]>([]);

  // Determine the correct options based on the dynamic settings
  const options: SelectOptionIF[] =
    dynamicOptions[field.settings[3]?.value]?.length > 0 ? dynamicOptions[field.settings[3].value] : [];

  // Sync selected options with the form's value on initial load
  useEffect(() => {
    const updated = options.filter((item) => field.value.includes(item.value));
    setSelectedOptions(updated);
  }, [options.length, field.value]);

  // Toggle modal visibility
  const handleModalToggle = () => {
    // setIsModalOpen(!isModalOpen);
    setOpen(!open);
  };

  // Handle option selection
  const handleOptionChange = (option: SelectOptionIF) => {
    let updatedSelectedOptions: SelectOptionIF[];

    const alreadySelected = selectedOptions.find((selected) => selected.value === option.value);
    if (alreadySelected) {
      // Remove option if already selected
      updatedSelectedOptions = selectedOptions.filter((selected) => selected.value !== option.value);
    } else {
      // Add option if not selected
      updatedSelectedOptions = [...selectedOptions, option];
    }

    setSelectedOptions(updatedSelectedOptions);

    // Update form state with newly selected options
    const updatedForm = [...form];
    updatedForm[index].value = updatedSelectedOptions.map((opt) => opt.value);
    setForm(updatedForm);
  };
  const error = field.errorMessage;
  return (
    <div className={styles.multiSelectContainer}>
      <div className={`${styles.fieldContainer}`}>
        <div className={styles.fieldLabel}>{`${form[index].inputLabel} ${field.settings[0].value ? ' *' : ''}`}</div>
        <input
          type="text"
          readOnly
          onClick={handleModalToggle}
          value={selectedOptions.map((opt) => opt.label).join(', ')}
          placeholder="Select options"
          className={`${styles.textInput} ${error && styles.inputFieldError}`}
        />
        {error && <div className={styles.fieldError}>{error}</div>}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalToggle}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalContent}>
              <ul className={styles.optionsList}>
                {options.map((option) => (
                  <li key={option.value} className={styles.optionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedOptions.some((selected) => selected.value === option.value)}
                        onChange={() => handleOptionChange(option)}
                      />
                      {option.label}
                    </label>
                  </li>
                ))}
              </ul>
              <button className={styles.closeButton} onClick={handleModalToggle}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <SelectOptionDialog
        options={options}
        selectedOptions={selectedOptions}
        handleOptionChange={handleOptionChange}
        dialogOpen={open}
        closeDialog={() => setOpen(false)}
      />
    </div>
  );
};

export default MultiSelectView;
