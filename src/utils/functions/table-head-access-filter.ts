import { ModulePermissions } from '../../store/moduleStore';

const tableHeadAccessFilter = (tableHead: string[], permission: ModulePermissions | null | undefined) => {
  if (!permission?.update && !permission?.delete) {
    return tableHead.slice(0, -1); // Return a new array without the last element
  } else {
    return tableHead;
  }
};
export default tableHeadAccessFilter;
