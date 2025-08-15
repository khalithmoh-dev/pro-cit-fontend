import { useNavigate, useParams } from 'react-router-dom';
import RenderFormbuilderForm from '../../../components/render-formbuilder-form';
import useModuleStore, { createModulePayloadIF } from '../../../store/moduleStore';
import { useEffect, useState } from 'react';
import { FieldIF, SelectOptionIF } from '../../../interface/component.interface';

interface PropsIF {
  update?: boolean;
}

const CreateModulePage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateModule, createModule, module, modules, getModule, getModules } = useModuleStore();
  console.log("🚀 ~ createModule:", createModule)
  console.log("🚀 ~ modules:", modules)
  console.log("🚀 ~ module:", module)
  const [moduleList, setModuleList] = useState<SelectOptionIF[]>([]);

  useEffect(() => {
    if (!id) return;
    getModule(id);
  }, [id]);

  useEffect(() => {
    getModules({ menuType: 'mainMenu' });
  }, []);

  useEffect(() => {
    const options = modules.map((module) => {
      return {
        label: module.name,
        value: module.key,
      };
    });
    setModuleList(options);
  }, [modules]);

  const onSubmit = async (values: createModulePayloadIF) => {
    const res = id && update ? await updateModule(values, id) : await createModule(values);
    if (res) {
      navigate(-1);
    }
  };
  const onChangeHandler = (fields: FieldIF[]) => {
    if (fields[2].value === 'mainMenu') {
      fields[3].hide = true;
      fields[3].settings[0].value = false;
      fields[3].value = 'mainMenu';
    }
    if (fields[2].value === 'subMenu') {
      fields[3].hide = false;
      fields[3].settings[0].value = true;
    }
  };

  return (
    <RenderFormbuilderForm
      formName="Create Module Form"
      formHeader={`${update ? 'Update' : 'Create'} Module Form`}
      existingForm={update ? module : null}
      goBack={() => navigate(-1)}
      onSubmit={onSubmit}
      onChange={onChangeHandler}
      dynamicOptions={[menuTypes, moduleList, []]}
      large
    />
  );
};

export default CreateModulePage;

const menuTypes = [
  {
    label: 'Main Menu',
    value: 'mainMenu',
  },
  {
    label: 'Sub Menu',
    value: 'subMenu',
  },
  {
    label: 'Hidden',
    value: 'hidden',
  },
];
