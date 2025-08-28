import React, { useState } from 'react';
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
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
// import PageTitle from '../../../components/PageTitle'
// Define the table component
const DataTable = ({
  data,
  columns,
  selectable = false,
  onSelect,
  pagination = true,
  searchable = true,
  title = "Data Table",
  actions = [],
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({});

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

  // Apply search and filters
  const filteredData = data
    .filter(item => {
      // Apply search
      if (searchTerm) {
        const matchesSearch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!matchesSearch) return false;
      }

      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && item[key] !== value) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Pagination
  const paginatedData = pagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData;

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
    <Box sx={{ width: '100%' }}>
      {/* Header with title and search */}
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 2 }}>
        {/* <Typography variant="h6" component="h2">
          {}
        </Typography> */}
        {/* <PageTitle title={title}/> */}
        
        {searchable && (
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
            size="small"
          />
        )}
      </Box>

      {/* Filters */}
      {/* <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {columns
          .filter(col => col.filterable)
          .map(col => (
            <FormControl key={col.field} size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{col.headerName}</InputLabel>
              <Select
                value={filters[col.field] || ''}
                label={col.headerName}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(data.map(item => item[col.field]))].map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        
        {(Object.values(filters).some(Boolean) || searchTerm) && (
          <Tooltip title="Clear filters">
            <IconButton onClick={clearFilters} size="small">
              <Filter size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Box> */}

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead style={{'backgroundColor': 'aliceblue'}}>
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
                <TableCell key={col.field}>
                  {col.sortable ? (
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
                  )}
                </TableCell>
              ))}
              
              {actions.length > 0 && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map(row => (
                <TableRow
                  key={row.id}
                  hover
                  selected={selected.includes(row.id)}
                  onClick={() => handleSelect(row.id)}
                  sx={{ cursor: selectable ? 'pointer' : 'default' }}
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
      <div className='d-flex justify-content-center align-items-center'>
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
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