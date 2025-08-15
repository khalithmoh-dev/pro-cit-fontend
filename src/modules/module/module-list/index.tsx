import { useState } from 'react';
import style from './module.module.css';
import TableControlBox from '../../../components/table-control-box';
import TableRow from '../../../components/table-row';
import Button from '../../../components/button';
import PlusIcon from '../../../icon-components/PlusIcon';
import Pagination from '../../../components/pagination/index.tsx';
import { useNavigate } from 'react-router-dom';
import ModuleTableComponent from './module-table/index.tsx';
import TableSelect from '../../../components/bu-select/index.tsx';
import { SelectOptionIF } from '../../../interface/component.interface.ts';
import useModuleStore from '../../../store/moduleStore.ts';
import { tableRowOptions } from '../../../utils/static-data/index.ts';

const ModuleListPage = () => {
  const navigate = useNavigate();
  const { getModules } = useModuleStore();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={style.container}>
      <TableControlBox tableName="Modules">
        <TableSelect
          label="Menu Type"
          options={menuTypes}
          update={(menuType) => getModules({ menuType })}
          clearFilter={() => getModules()}
        />
        <Button onClick={() => navigate('/module/create')} startIcon={<PlusIcon fill="white" />}>
          Create&nbsp;Module
        </Button>
      </TableControlBox>
      <div className={style.tableContainer}>
        <ModuleTableComponent />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(1)}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default ModuleListPage;

const menuTypes: SelectOptionIF[] = [
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
