import style from './table-search.module.css';

interface PropsIF {
  searchText: string;
  setSearchText: (value: string) => void; // Removed unnecessary parentheses
}

const TableSearch: React.FC<PropsIF> = ({ searchText, setSearchText }) => {
  return (
    <div className={style.tableSearch}>
      <input placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      {/* <img src={searchIconImage} alt="Search Icon" /> */}
    </div>
  );
};

export default TableSearch;
