import style from '.';
import { SelectOptionIF } from '../../../../../../interface/component.interface';
import Button from '../../../../../button';
import Dialog from '../../../../../dialog';
import DialogAction from '../../../../../dialog/dialog-action';
import DialogBody from '../../../../../dialog/dialog-body';
import DialogTitle from '../../../../../dialog/dialog-title';
import styles from '../MultiSelectView.module.css';

interface PropsIF {
  closeDialog: () => void;
  dialogOpen: boolean;
  options: SelectOptionIF[];
  selectedOptions: SelectOptionIF[];
  handleOptionChange: (options: SelectOptionIF) => void;
}

const SelectOptionDialog: React.FC<PropsIF> = ({
  closeDialog,
  dialogOpen,
  options,
  selectedOptions,
  handleOptionChange,
}) => {
  return (
    <Dialog isOpen={dialogOpen} onClose={closeDialog}>
      <DialogTitle onClose={closeDialog}>Multiple Selection</DialogTitle>
      <DialogBody>
        <ul className={styles.optionsList}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.listOption} ${
                selectedOptions.some((selected) => selected.value === option.value) ? styles.activeOption : ''
              }`}
              onClick={() => handleOptionChange(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </DialogBody>
      <DialogAction>
        <Button secondary onClick={closeDialog}>
          Close
        </Button>
      </DialogAction>
    </Dialog>
  );
};

export default SelectOptionDialog;
