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
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
  Checkbox,
} from '@mui/material';
import { Search } from 'lucide-react';
import { useLayout } from '../../../modules/layout/LayoutContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ButtonMui';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../store/authStore';
import CustomPagination from './customPagination';
import UploadProgressNotice from '../../../components/InfoMesssage';
import InputFields from '../../../components/inputFields';

/**
 * DataTable Component
 * ----------------------------------
 * A reusable, feature-rich table with optional:
 *  - Pagination
 *  - Search
 *  - Sorting
 *  - Row selection
 *  - Server-side data fetching
 *  - Custom actions and header buttons
 *
 * Props:
 * - data: array of data objects (for client-side)
 * - columns: column definition array [{ field, headerName, renderCell? }]
 * - selectable: enable row selection
 * - onSelect: callback for selected rows
 * - pagination: enable pagination
 * - searchable: enable search bar
 * - title: table title
 * - actions: per-row action buttons [{ label, icon, color, onClick }]
 * - headerAction: additional header buttons
 * - addRoute: route path for “Add New” button
 * - apiService: async fetch function for server-side data
 * - serverSide: enable server-side data mode
 */

interface ApiServiceI {
  data?: any[]
  total?: number
  [key: string]: any
}

const DataTable = ({
  data = [],
  columns = [],
  selectable = false,
  onSelect = (any) => { },
  pagination = true,
  searchable = true,
  title = 'Data Table',
  actions = [],
  headerAction = [{ actionName: '', onClick: () => { }, disabled: false }],
  addRoute = '',
  apiService = (page = 0, limit = 0, searchTerm = ''): ApiServiceI => { return { data: [], total: 0 } },
  serverSide = false,
  showKey = false,
  infoMessage = ''
}) => {
  // === State variables ===
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState(serverSide ? [] : data);
  const [filteredData, setFilteredData] = useState(tableData);
  const [paginatedData, setPaginatedData] = useState(tableData);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // === Hooks ===
  const { setRouteNm, setActionFields } = useLayout();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const authStore = useAuthStore();

  // === Sync route name in layout ===
  useEffect(() => {
    if (location.pathname) setRouteNm(location.pathname);
  }, [location.pathname]);

  // === Build header actions and "Add New" button ===
  useEffect(() => {
    const headerButtons = [];

    (headerAction ?? [])
      .filter((action) => action.actionName)
      .forEach((action) => {
        headerButtons.push(
          <Button
            key={action.actionName}
            variantType="primary"
            size="medium"
            disabled={action.disabled}
            onClick={action.onClick}
          >
            {action.actionName}
          </Button>
        );
      });

    if (addRoute && authStore?.permissions?.[location.pathname]?.create) {
      headerButtons.push(
        <Button
          key="add-new"
          variantType="submit"
          onClick={() => navigate(addRoute)}
        >
          {t('ADD_NEW')}
        </Button>
      );
    }

    if (setActionFields) {
      setActionFields(headerButtons);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addRoute, location.pathname, authStore?.permissions?.[location.pathname]?.create]);


  // === Fetch or set table data ===
  useEffect(() => {
    if (serverSide && apiService) {
      const fetchServerData = async () => {
        setIsLoading(true);
        try {
          const response = await apiService(page, rowsPerPage, searchTerm);
          setTableData(response?.data || []);
          setTotalRecords(response?.total || 0);
        } catch (err) {
          // Error fetching data
        } finally {
          setIsLoading(false);
        }
      };

      const debounceFetch = setTimeout(fetchServerData, 400); // debounce search
      return () => clearTimeout(debounceFetch);
    } else {
      // Client-side mode
      setTableData(data);
      setTotalRecords(data.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, serverSide, data?.length]);

  // === Sorting handler ===
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // === Single row selection handler ===
  const handleSelectRow = (id) => {
    if (!selectable) return;
    let updatedSelection = [...selectedRows];

    if (updatedSelection.includes(id)) {
      updatedSelection = updatedSelection.filter((item) => item !== id);
    } else {
      updatedSelection.push(id);
    }

    setSelectedRows(updatedSelection);
    onSelect(updatedSelection);
  };

  // === Select all rows handler ===
  const handleSelectAllRows = () => {
    if (!selectable) return;

    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
      onSelect([]);
    } else {
      const allIds = filteredData.map((item) => item.id);
      setSelectedRows(allIds);
      onSelect(allIds);
    }
  };

  // === Filter, search & sort data (client-side only) ===
  useEffect(() => {
    let updatedData = [...tableData];

    // Apply search
    if (searchTerm) {
      updatedData = updatedData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        updatedData = updatedData.filter((item) => item[key] === value);
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      updatedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(updatedData);
  }, [tableData, searchTerm, filters, sortConfig]);
  // === Pagination logic (client-side only) ===
  useEffect(() => {
    if (pagination && !serverSide) {
      const startIdx = page * rowsPerPage;
      const endIdx = startIdx + rowsPerPage;
      setPaginatedData(filteredData.slice(startIdx, endIdx));
    } else {
      setPaginatedData(filteredData);
    }
  }, [filteredData, page, rowsPerPage, pagination]);

  // === Pagination controls ===
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // === Filters ===
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  // === Render ===
  return (
    <>
      {showKey && <UploadProgressNotice message={t(infoMessage)} showKey={showKey} />}
      <Box
        sx={{
          width: 'calc(100% - 40px)',
          mt: 2,
          mb: 2,
          marginLeft: '30px',
          marginRight: '10px',
          px: 2,
          border: '1px solid rgba(224, 224, 224, 1)',
          borderRadius: 3,
          position: 'relative',
        }}
      >
        {/* Loading Overlay with Blur */}
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  border: '4px solid rgba(25, 118, 210, 0.2)',
                  borderTop: '4px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography variant="body2" color="primary" fontWeight={500}>
                {t('LOADING') || 'Loading...'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* ==== Header Section ==== */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <div className="mt-3 mx-2">
            <p className="fw-semibold fsd-0">{title}</p>
            <p style={{ color: 'slategrey' }}>
              {`Showing ${paginatedData?.length} of ${totalRecords}`}
            </p>
          </div>

          {searchable && (
            <Box sx={{ width: '220px', marginRight: '12px' }}>
              <InputFields
                field={{
                  name: 'search',
                  type: 'text',
                  placeholder: 'Search...',
                }}
                value={searchTerm}
                onChange={(name, value) => {
                  setSearchTerm(value);
                  setPage(0);
                }}
                editPerm={true}
              />
            </Box>
          )}
        </Box>

        {/* ==== Table ==== */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            overflow: 'auto',
            border: '1px solid rgba(224, 224, 224, 1)',
            mt: 2,
            borderRadius: 4,
          }}
        >
          <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }}>
            {/* ==== Table Header ==== */}
            <TableHead
              style={{ background: 'aliceblue' }}
              sx={{ '& .MuiTableCell-root': { py: 1.5, px: 1.5 } }}
            >
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < filteredData.length
                      }
                      checked={
                        selectedRows.length === filteredData.length &&
                        filteredData.length > 0
                      }
                      onChange={handleSelectAllRows}
                    />
                  </TableCell>
                )}

                {columns.map((col) => (
                  <TableCell key={col.field} className="fwd-1">
                    {col.headerName}
                  </TableCell>
                ))}

                {actions.length > 0 && (
                  <TableCell align="center" className="fwd-1">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            {/* ==== Table Body ==== */}
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    selected={selectedRows.includes(row.id)}
                    onClick={() => handleSelectRow(row.id)}
                    sx={{
                      cursor: selectable ? 'pointer' : 'default',
                      '& .MuiTableCell-root': {
                        textTransform: 'none',
                      },
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedRows.includes(row.id)} />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell key={col.field}>
                        {col.renderCell ? col.renderCell(row) : row[col.field]}
                      </TableCell>
                    ))}

                    {actions.length > 0 && (
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          {actions.map((action) => (
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
                  <TableCell
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (actions.length > 0 ? 1 : 0)
                    }
                    align="center"
                  >
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

        {/* ==== Pagination ==== */}
        {/* {pagination && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 1, // vertical padding
            px: 2, // horizontal padding
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-toolbar': {
                padding: 0,
                minHeight: 'auto',
              },
              '.MuiTablePagination-selectLabel': {
                margin: 0,
                fontWeight: 500,
              },
              '.MuiTablePagination-displayedRows': {
                margin: 0,
                fontSize: '0.875rem',
                color: '#555',
              },
              '.MuiTablePagination-actions': {
                '& button': {
                  color: '#1976d2', // theme primary color for arrows
                },
              },
              '.MuiTablePagination-select': {
                '& select': {
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                },
              },
            }}
          />
        </Box>
      )} */}

        {pagination && (
          <Box
            sx={{

              bottom: 0,
              backgroundColor: '#fff',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 1,
            }}

          >
            <CustomPagination
              page={page + 1} // 1-based
              totalPages={Math.ceil(totalRecords / rowsPerPage)}
              rowsPerPage={rowsPerPage}
              onPageChange={(newPage) => setPage(newPage - 1)} // convert to 0-based
              onRowsPerPageChange={(newRows) => {
                setRowsPerPage(newRows);
                setPage(0); // reset to first page
              }}
            />
          </Box>
        )}

      </Box>
    </>
  );
};

export default DataTable;
