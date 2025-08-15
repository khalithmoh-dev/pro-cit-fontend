import { useEffect, useState } from 'react';
import { CreateFormStateIF } from '../../..';
import Dialog from '../../../../../../components/dialog';
import DialogTitle from '../../../../../../components/dialog/dialog-title';
import DialogBody from '../../../../../../components/dialog/dialog-body';
import TextField from '../../../../../../components/textfield';
import DialogAction from '../../../../../../components/dialog/dialog-action';
import Button from '../../../../../../components/button';

interface PropsIF {
  state: CreateFormStateIF;
  setState: (state: CreateFormStateIF) => void;
  update: boolean;
  onSubmitHandler: () => void;
}
const CreateFormDialog: React.FC<PropsIF> = ({ state, setState, update, onSubmitHandler }) => {
  return (
    <Dialog
      isOpen={state.createDialog}
      onClose={() => {
        setState({
          ...state,
          createDialog: false,
          formName: '',
        });
      }}
    >
      <DialogTitle
        onClose={() => {
          setState({
            ...state,
            createDialog: false,
            formName: '',
          });
        }}
      >{`${update ? 'Update' : 'Create'} Form`}</DialogTitle>
      <DialogBody>
        <TextField
          label={`Enter Form Name`}
          value={state.formName}
          onChange={(e) => setState({ ...state, formName: e.target.value })}
        />
        <TextField
          label={`Enter Form Description`}
          value={state.description}
          onChange={(e) => setState({ ...state, description: e.target.value })}
        />
      </DialogBody>
      <DialogAction>
        <Button
          secondary
          onClick={() => {
            setState({ ...state, createDialog: false, formName: '' });
          }}
        >
          Cancel
        </Button>
        {state.formName && <Button onClick={onSubmitHandler}>Save</Button>}
      </DialogAction>
    </Dialog>
  );
};

export default CreateFormDialog;
