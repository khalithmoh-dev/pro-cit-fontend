import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './create-role.module.css';
import Button from '../../../components/button';
import TextField from '../../../components/textfield';
import Table from '../../../components/table';
import TableHead from '../../../components/table/tableHead';
import TableBody from '../../../components/table/tableBody';
import ArrowLeftIcon from '../../../icon-components/ArrowLeftIcon';
import useModuleStore, { ModuleIF, ModulePermissions } from '../../../store/moduleStore';
import useRoleStore from '../../../store/roleStore';

interface PropsIF {
  update?: boolean;
}
interface InputErrorIF {
  roleName: string;
  description: string;
}

const CreateRolePage: React.FC<PropsIF> = ({ update }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tableHead = ['MODULE ACCESS', 'SELECT ALL', 'CREATE', 'READ', 'UPDATE', 'DELETE'];
  const [moduleList, setModuleList] = useState<ModuleIF[]>([]);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<InputErrorIF>({
    roleName: '',
    description: '',
  });
  const { createRole, getRole, role, updateRole , loading } = useRoleStore();
  const { getModules, modules } = useModuleStore();

  useEffect(() => {
    setModuleList(modules);
  }, [modules]);

  useEffect(() => {
    if (modules.length && role && update) {
      const updatedModules = mergeArray(modules, role.modules);
      setModuleList(updatedModules);
      setRoleName(role.name);
      setDescription(role.description);
    }
  }, [modules, role]);

  useEffect(() => {
    getModules();
  }, []);
  useEffect(() => {
    if (id && update) {
      getRole(id);
    }
  }, [id]);

  const onChangeHandler = (index: number, type: keyof ModulePermissions) => {
    const modulesCopy = [...moduleList];
    modulesCopy[index].permissions[type] = !modulesCopy[index].permissions[type];
    setModuleList(modulesCopy);
  };

  const selectAllHandler = (index: number, state: boolean) => {
    const modulesCopy = [...moduleList];
    modulesCopy[index].permissions['create'] = state;
    modulesCopy[index].permissions['read'] = state;
    modulesCopy[index].permissions['update'] = state;
    modulesCopy[index].permissions['delete'] = state;
    setModuleList(modulesCopy);
  };

  const validateInput = () => {
    if (!roleName) {
      setError({ ...error, roleName: 'Role name is required' });
      return false;
    }
    if (!description) {
      setError({ roleName: '', description: 'Role description is required' });
      return false;
    }
    setError({ roleName: '', description: '' });
    return true;
  };

  const onSubmitHandler = async () => {
    if (update && !id) return;
    const validation = validateInput();
    if (!validation) return;
    const reqBody = {
      name: roleName,
      description,
      modules: moduleList,
    };
    const res = update ? await updateRole(reqBody, id || '') : await createRole(reqBody);
    if (res) {
      navigate('/role/list');
    }
  };

  const tableBody = moduleList.map((module, index) => (
    <tr key={index} className={style.tableBody}>
      <td>{module.name}</td>
      <td>
        <input
          className={style.checkboxInput}
          onChange={(e) => selectAllHandler(index, e.target.checked)}
          type="checkbox"
          checked={!Object.values(module.permissions).some((value) => value === false)}
        />
      </td>
      <td>
        <input
          className={style.checkboxInput}
          onChange={() => onChangeHandler(index, 'create')}
          type="checkbox"
          checked={module.permissions.create}
        />
      </td>
      <td>
        <input
          className={style.checkboxInput}
          onChange={() => onChangeHandler(index, 'read')}
          type="checkbox"
          checked={module.permissions.read}
        />
      </td>
      <td>
        <input
          className={style.checkboxInput}
          onChange={() => onChangeHandler(index, 'update')}
          type="checkbox"
          checked={module.permissions.update}
        />
      </td>
      <td>
        <input
          className={style.checkboxInput}
          onChange={() => onChangeHandler(index, 'delete')}
          type="checkbox"
          checked={module.permissions.delete}
        />
      </td>
    </tr>
  ));

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <div className={style.left}>
          <div className={style.iconButton} onClick={() => navigate(-1)}>
            <ArrowLeftIcon height={16} width={16} />
          </div>
          {update ? 'Update' : 'Create'} Role
        </div>

        <div className={style.right}>
          {
            <Button onClick={onSubmitHandler} secondary>
              Save
            </Button>
          }
        </div>
      </div>
      <div className={style.contentBox}>
        <div className={style.inputBox}>
          <TextField
            error={error.roleName}
            label="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className={style.fieldContainer}
          />
          <TextField
            error={error.description}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={style.fieldContainer}
          />
        </div>
        <div className={style.tableContainer}>
          <Table loading={loading}>
            <TableHead tableHead={tableHead} />
            <TableBody tableBody={tableBody} />
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CreateRolePage;

const mergeArray = (originalArray: ModuleIF[], newArray: ModuleIF[]) => {
  const mergedArray: ModuleIF[] = [];

  originalArray?.forEach((item) => {
    const foundItem = newArray.find((newItem) => newItem._id === item._id);

    if (foundItem) {
      mergedArray.push({
        ...item,
        permissions: { ...item.permissions, ...foundItem.permissions },
      });
    } else {
      mergedArray.push(item);
    }
  });

  return mergedArray;
};
