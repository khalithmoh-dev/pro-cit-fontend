import { CreateFormStateIF } from '../..';
import style from '../../create-form.module.css';
import { MutableRefObject, ReactNode } from 'react';

interface PropsIF {
  index: number;
  setState: (state: CreateFormStateIF) => void;
  dragItem: MutableRefObject<number>;
  dragOverItem: MutableRefObject<number>;
  children: ReactNode;
  state: CreateFormStateIF;
}

const DraggableFieldContainer: React.FC<PropsIF> = ({ index, setState, dragItem, dragOverItem, children, state }) => {
  const handleSort = () => {
    const allFields = [...state.fields];
    const draggedItemContent = allFields.splice(dragItem.current, 1)[0];
    allFields.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = 0;
    dragOverItem.current = 0;
    setState({ ...state, fields: allFields });
  };
  return (
    <div
      className={style.fieldBox}
      key={index}
      draggable
      onDragStart={() => (dragItem.current = index)}
      onDragEnter={() => (dragOverItem.current = index)}
      onDragEnd={handleSort}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};
export default DraggableFieldContainer;
