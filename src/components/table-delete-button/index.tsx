import { useState } from 'react';
import DeleteIcon from '../../icon-components/DeleteIcon';
import Dialog from '../dialog';
import DialogBody from '../dialog/dialog-body';
import Spinner from '../spinner';
import DialogAction from '../dialog/dialog-action';
import Button from '../button';

interface PropsIF {
  id: string;
  deleting: string;
  onClick: (id: string) => void;
  name?: string;
  hide?: boolean;
}

const TableDeleteButton: React.FC<PropsIF> = ({ onClick, id, deleting, name, hide }) => {
  const [clicked, setClicked] = useState(false);
  const onClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setClicked(true);
  };

  if (hide) return <></>;

  return (
    <span onClick={onClickHandler}>
      {deleting === id ? <Spinner /> : <DeleteIcon />}
      <Dialog onClose={() => setClicked(false)} isOpen={clicked}>
        <DialogBody>
          <div style={{ paddingBottom: 20, fontSize: 16 }}>
            Are you sure you want to delete <strong>{name}</strong>?
          </div>
        </DialogBody>
        <DialogAction>
          <Button secondary onClick={() => setClicked(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClick(id);
              setClicked(false);
            }}
          >
            Yes
          </Button>
        </DialogAction>
      </Dialog>
    </span>
  );
};

export default TableDeleteButton;
