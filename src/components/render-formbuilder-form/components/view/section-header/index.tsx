import { FieldIF } from '../../../../../interface/component.interface';
import style from './section-header.module.css';

interface SectionHeaderPropsIF {
  form: FieldIF[];
  setForm: (fields: FieldIF[]) => void;
  index: number;
}

const SectionHeader: React.FC<SectionHeaderPropsIF> = ({ form, index }) => {
  return <div className={style.container}>{form[index].inputLabel}</div>;
};

export default SectionHeader;
