import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Search
} from 'lucide-react';
import { useLayout } from "../../../modules/layout/LayoutContext"
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { useTranslation } from 'react-i18next';

interface DataTableI {
  data?: object[]
  columns?: object[]
  selectable?: Boolean
  onSelect?: Function
  pagination?: Boolean
  searchable?: Boolean
  title?: string
  actions?: object[]
  apiService?: string[];
  serverSide?: boolean;
}
const DataTable = ({
  data,
  columns,
  selectable = false,
  onSelect = () => { },
  pagination = true,
  searchable = true,
  title = "Data Table",
  actions = [],
  headerAction = [{ actionName: "", onClick: () => { } }],
  addRoute = '',
  apiService = (page?: number, rowsPerPage?: number, searchTerm?: string) => { },
  serverSide = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState<any[]>(serverSide ? [] : data);
  const [filteredData, setFilteredData] = useState<any[]>(tableData);
  const [paginatedData, setPaginatedData] = useState<any[]>(tableData);
  const [total, setTotal] = useState(0);
  const { setRouteNm, setActionFields } = useLayout();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.pathname) {
      setRouteNm(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (addRoute) {
      const aHeaderBtns = (headerAction ?? [])
        .filter(action => action.actionName) // only keep actions with a name
        .map(action => (
          <Button
            key={action.actionName} // always add a key in lists
            variantType="upload"
            size="md"
            onClick={action.onClick}
          >
            {action.actionName}
          </Button>
        ));

      // Add the "Add New" button if addRoute is defined
      aHeaderBtns.push(
        <Button
          className={`btn-primary btn-small`}
          key="add-new"
          variantType="submit"
          onClick={() => navigate(addRoute)}
        >
          {t("ADD_NEW")}
        </Button>
      );

      setActionFields(aHeaderBtns);
    } else {
      setActionFields([]);
    }
  }, [addRoute, navigate, t]);

  useEffect(() => {
    if (serverSide && apiService) {
      const fetchData = async () => {
        try {

          const tblData = await apiService(page, rowsPerPage, searchTerm);

          setTableData(tblData?.data || []);
          setTotal(tblData?.total || 0);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };

      const delayDebounce = setTimeout(fetchData, 400); // debounce search
      return () => clearTimeout(delayDebounce);
    } else {
      // fallback for static data
      setTableData(data);
      setTotal(data.length);
    }
  }, [page, rowsPerPage, searchTerm, apiService, serverSide, data?.length]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle row selection
  const handleSelect = (id) => {
    if (selectable) {
      let newSelected = [...selected];
      if (newSelected.includes(id)) {
        newSelected = newSelected.filter(item => item !== id);
      } else {
        newSelected.push(id);
      }
      setSelected(newSelected);
      if (onSelect) onSelect(newSelected);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectable) {
      if (selected.length === filteredData.length) {
        setSelected([]);
        if (onSelect) onSelect([]);
      } else {
        const allIds = filteredData.map(item => item.id);
        setSelected(allIds);
        if (onSelect) onSelect(allIds);
      }
    }
  };

  useEffect(() => {
    let data = [...tableData];

    // Apply search
    if (searchTerm) {
      data = data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        data = data.filter(item => item[key] === value);
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(data);
  }, [tableData, searchTerm, filters, sortConfig]);


  // Pagination
  useEffect(() => {
    if (pagination && !serverSide) {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      setPaginatedData(filteredData.slice(start, end));
    } else {
      setPaginatedData(filteredData);
    }
  }, [filteredData, page, rowsPerPage, pagination]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 2, px: 2, border: '1px solid rgba(224, 224, 224, 1)', borderRadius: 3 }}>
      {/* Header with title and search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'fit-content', backgroundColor: "white", borderBottom: '1px solid rgba(224, 224, 224, 1)', borderRadius: "16px 16px 0 0" }}>
        <div className='mt-3 mx-2'>
          <p className='fw-semibold fsd-0'>{title}</p>
          <p style={{ color: 'slategrey' }}>{`Showing ${paginatedData?.length} of ${total}`}</p>
        </div>
        {searchable && (
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300, marginRight: "12px" }}
            size="small"
          />
        )}
      </Box>
      {/* Table */}

      <TableContainer component={Paper} elevation={0} sx={{ overflow: 'auto', border: '1px solid rgba(224, 224, 224, 1)', mt: 2, borderRadius: 4 }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'collapse', }} aria-label="data table">
          <TableHead style={{ background: 'aliceblue' }} sx={{ '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={selected.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}

              {columns.map(col => (
                <TableCell key={col.field} className='fwd-1'>
                  {/* {col.sortable ? (
                    <TableSortLabel
                      active={sortConfig.key === col.field}
                      direction={sortConfig.key === col.field ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(col.field)}
                      IconComponent={sortConfig.key === col.field ? 
                        (sortConfig.direction === 'asc' ? ChevronUp : ChevronDown) : 
                        undefined
                      }
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )} */}
                  {col.headerName}
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell align="center" className='fwd-1'>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  selected={selected.includes(row.id)}
                  onClick={() => handleSelect(row.id)}
                  sx={{
                    cursor: selectable ? 'pointer' : 'default', '& .MuiTableCell-root': {
                      textTransform: 'none',
                    }
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(row.id)} />
                    </TableCell>
                  )}

                  {columns.map(col => (
                    <TableCell key={col.field}>
                      {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </TableCell>
                  ))}

                  {actions.length > 0 && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {actions.map(action => (
                          <Tooltip key={action.label} title={action.label}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              color={action.color || 'default'}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      No data found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className='d-flex justify-content-center align-items-center bg-white' style={{ borderRadius: "0 0 10px 10px" }}>
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-toolbar': {
                padding: 0,
                minHeight: 'auto',
              },
              '.MuiTablePagination-spacer': {
                display: 'none',
              },
              '.MuiTablePagination-selectLabel': {
                margin: 0,
              },
              '.MuiTablePagination-displayedRows': {
                margin: 0,
              },
            }}
          />
        )}
      </div>
    </Box>
  );
};

export default DataTable;