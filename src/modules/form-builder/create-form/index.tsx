import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DraggableFieldContainer from './components/draggable-field-container';
import style from './create-form.module.css';
import CreateFormDialog from './components/dialogs/create-form';
import { FieldIF } from '../../../interface/component.interface';
import httpRequest from '../../../utils/functions/http-request';
import ArrowLeftIcon from '../../../icon-components/ArrowLeftIcon';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import iconTypes from './components/IconTypes';
import { capitalizeFirstLetter } from './components/capitalizeFirstLetter';
import { lowerCaseFirstLetter } from './components/lowerCaseFirstLetter';
import SettingsIcon from '../../../icon-components/SettingsIcon';
import DeleteIcon from '../../../icon-components/DeleteIcon';
import FieldSettingsComponent from './components/field-settings';
import useFormStore from '../../../store/formStore';
import GripIcon from '../../../icon-components/GripIcon';
import inputTypes from './components/inputTypes';

interface PropsIF {
  update?: boolean;
}

export interface CreateFormStateIF {
  showInputType: boolean;
  createDialog: boolean;
  showSettings: number;
  fields: FieldIF[];
  formName: string;
  existingForm: any;
  description: string;
}

export const initialValue: CreateFormStateIF = {
  showInputType: false,
  createDialog: false,
  showSettings: -1,
  fields: [],
  formName: '',
  existingForm: null,
  description: '',
};

const CreateFormPage: React.FC<PropsIF> = ({ update }) => {
  const [state, setState] = useState<CreateFormStateIF>(initialValue);
  const dragItem = useRef<number>(0);
  const dragOverItem = useRef<number>(0);
  const navigate = useNavigate();
  const { formId } = useParams();
  const { getForms } = useFormStore();

  useEffect(() => {
    const getForm = async (id: string) => {
      try {
        const res = await httpRequest('GET', `${import.meta.env.VITE_API_URL}/form/${id}`, {});
        setState({
          ...state,
          existingForm: res.data,
          fields: res.data?.form,
        });
      } catch (error: any) {
        console.error('Error: Error in data fetch ');
      }
    };

    if (formId && update) {
      getForm(formId);
    }
  }, [formId]);

  const deleteField = (index: number) => {
    const data = state.fields.filter((_, i: number) => i !== index);
    setState({ ...state, fields: data });
  };

  const onSubmitHandler = async () => {
    const formData = {
      name: state.formName,
      form: state.fields,
      description: state.description,
      riskAssessmentId: '',
    };

    try {
      const res = await httpRequest(
        `${update ? 'PATCH' : 'POST'}`,
        `${import.meta.env.VITE_API_URL}/form/${update ? `update/${formId}` : 'create'}`,
        formData,
      );
      if (res.success) {
        setState({ ...state, fields: [], formName: '', createDialog: false });
        getForms();
        navigate(`/formbuilder/list`);
      } else {
        console.error(`Failed to create form`);
      }
    } catch (error: any) {
      console.error(`Failed to create form`);
      setState({ ...state, fields: [], formName: '', createDialog: false });
      navigate(`/formbuilder/list`);
    }
  };

  const copyDownField = (field: FieldIF, index: number) => {
    const array = state.fields;
    array.splice(index + 1, 0, field);
    setState({ ...state, fields: array });
  };

  return (
    <div className={style.container}>
      <div className={style.actionContainer}>
        <div className={style.left}>
          <div className={style.iconButton} onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </div>
          <div className={style.pageName}>{`${update ? state.existingForm?.name : 'Create Form'} `}</div>
        </div>
        <div className={style.right}>
          {state?.fields?.length > 0 && (
            <>
              <Button
                onClick={() =>
                  setState({
                    ...state,
                    createDialog: true,
                    formName: update ? state.existingForm?.name : '',
                    description: update ? state.existingForm.description : '',
                  })
                }
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
      <div className={style.formContainer}>
        <Button secondary onClick={() => setState({ ...state, showInputType: !state.showInputType, showSettings: -1 })}>
          <PlusIcon />
          Add New Field
        </Button>
        {state.showInputType && (
          <div className={style.inputTypeContainer}>
            {inputTypes.map((inputType: FieldIF, index: number) => {
              const IconComponent = iconTypes.get(inputType.icon);
              return (
                <Button
                  key={index}
                  secondary
                  onClick={() => setState({ ...state, fields: [...state.fields, inputType], showInputType: false })}
                >
                  {IconComponent}
                  {inputType.name}
                </Button>
              );
            })}
          </div>
        )}
        <div className={style.fieldContainer}>
          {state.fields?.map((field: FieldIF, index) => {
            const data: FieldIF[] = JSON.parse(JSON.stringify(state.fields)); // Create a shallow copy of fields
            const handleOnchangeLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
              data[index].inputLabel = capitalizeFirstLetter(e.target.value);
              setState({ ...state, fields: data });
            };
            const handleOnchangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
              data[index].keyName = lowerCaseFirstLetter(e.target.value).replace(/\s+/g, '');
              setState({ ...state, fields: data });
            };
            return (
              <DraggableFieldContainer
                key={`${field.type}_${index}`}
                dragItem={dragItem}
                dragOverItem={dragOverItem}
                index={index}
                state={state}
                setState={setState}
              >
                <div className={`${style.innerFieldBox} ${field.type === 'sectionHeader' ? style.sectionHeader : ''}`}>
                  {/* <img src={gripIcon} alt="Grip Icon" /> */}
                  <GripIcon />
                  <div className={style.field}>
                    <div className={style.inputType}>
                      <SettingsIcon />
                      {field.name}
                    </div>
                    <input
                      type="text"
                      placeholder="Label"
                      value={state.fields[index].inputLabel}
                      onChange={handleOnchangeLabel}
                    />
                    <input
                      type="text"
                      placeholder="Key"
                      value={state.fields[index].keyName}
                      onChange={handleOnchangeKey}
                    />
                    <div className={style.fieldAction}>
                      <span
                        onClick={() => setState({ ...state, showSettings: index === state.showSettings ? -1 : index })}
                      >
                        <SettingsIcon />
                      </span>
                      <span style={{ fontSize: 12 }} onClick={() => copyDownField(field, index)}>
                        Copy
                      </span>
                      <span onClick={() => deleteField(index)}>
                        <DeleteIcon />
                      </span>
                    </div>
                  </div>
                </div>
                {state.showSettings === index && (
                  <FieldSettingsComponent field={field} index={index} state={state} setState={setState} />
                )}
              </DraggableFieldContainer>
            );
          })}
        </div>
      </div>
      {/* ====================================== Dialog ====================================== */}
      <CreateFormDialog state={state} setState={setState} update={Boolean(update)} onSubmitHandler={onSubmitHandler} />
    </div>
  );
};

export default CreateFormPage;
