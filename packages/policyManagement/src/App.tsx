import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// Mock Data
const initialRows = [
  { id: 1, name: 'Alice Smith', age: 30, city: 'New York', occupation: 'Software Engineer', email: 'alice@example.com' },
  { id: 2, name: 'Bob Johnson', age: 24, city: 'London', occupation: 'UX Designer', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', age: 35, city: 'Paris', occupation: 'Product Manager', email: 'charlie@example.com' },
  { id: 4, name: 'Diana Prince', age: 28, city: 'Tokyo', occupation: 'Data Scientist', email: 'diana@example.com' },
  { id: 5, name: 'Eve Adams', age: 42, city: 'Berlin', occupation: 'Marketing Specialist', email: 'eve@example.com' },
  { id: 6, name: 'Frank White', age: 50, city: 'Sydney', occupation: 'CEO', email: 'frank@example.com' },
  { id: 7, name: 'Grace Lee', age: 22, city: 'Seoul', occupation: 'Student', email: 'grace@example.com' },
  { id: 8, name: 'Henry Ford', age: 45, city: 'Detroit', occupation: 'Mechanical Engineer', email: 'henry@example.com' },
  { id: 9, name: 'Ivy Green', age: 31, city: 'San Francisco', occupation: 'Frontend Developer', email: 'ivy@example.com' },
  { id: 10, name: 'Jack Black', age: 38, city: 'Los Angeles', occupation: 'Actor', email: 'jack@example.com' },
  { id: 11, name: 'Karen Kim', age: 29, city: 'Vancouver', occupation: 'Architect', email: 'karen@example.com' },
  { id: 12, name: 'Liam Hall', age: 27, city: 'Dublin', occupation: 'Graphic Designer', email: 'liam@example.com' },
  { id: 13, name: 'Mia King', age: 33, city: 'Rome', occupation: 'Chef', email: 'mia@example.com' },
  { id: 14, name: 'Noah Young', age: 26, city: 'Amsterdam', occupation: 'Software Developer', email: 'noah@example.com' },
  { id: 15, name: 'Olivia Scott', age: 40, city: 'Madrid', occupation: 'HR Manager', email: 'olivia@example.com' },
  { id: 16, name: 'Peter Jones', age: 37, city: 'Washington D.C.', occupation: 'Policy Analyst', email: 'peter@example.com' },
  { id: 17, name: 'Quinn Miller', age: 23, city: 'Chicago', occupation: 'Journalist', email: 'quinn@example.com' },
  { id: 18, name: 'Rachel Davis', age: 32, city: 'Boston', occupation: 'Biologist', email: 'rachel@example.com' },
  { id: 19, name: 'Sam Wilson', age: 25, city: 'Austin', occupation: 'Musician', email: 'sam@example.com' },
  { id: 20, name: 'Tina Moore', age: 48, city: 'Miami', occupation: 'Real Estate Agent', email: 'tina@example.com' },
];

// Initial Column definitions (now managed by state in App component)
const defaultColumns = [
  { id: 'id', label: 'ID', numeric: true, minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'age', label: 'Age', numeric: true, minWidth: 80 },
  { id: 'city', label: 'City', minWidth: 120 },
  { id: 'occupation', label: 'Occupation', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
];

// Draggable Table Row Component
const SortableTableRow = ({ row, columns, isItemSelected, labelId, handleClick, onDragHandleProps, totalHeaderColumns }) => {
  // useSortable should be on the primary, visible row
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const [expanded, setExpanded] = useState(false);

  // Style for the draggable row
  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1300 : 'auto',
    position: 'relative',
    boxShadow: isDragging ? '0px 8px 16px rgba(0,0,0,0.2)' : 'none',
    backgroundColor: isItemSelected ? 'rgb(229 231 235)' : 'white', // Apply selection background here
    borderRadius: '8px', // Apply rounding to the row directly
  };

  // Handle row click to toggle accordion for the *entire row*
  const handleRowClick = (event) => {
    // Prevent accordion from toggling when clicking the drag handle, checkbox, or the explicit expand button
    if (event.target.closest('.drag-handle') || event.target.closest('.checkbox-cell') || event.target.closest('.expand-button') || isDragging) {
      return;
    }
    setExpanded((prev) => !prev);
  };

  // Handle click specifically for the expand icon button
  const handleAccordionIconClick = (event) => {
    event.stopPropagation(); // Prevent the TableRow's onClick from firing
    setExpanded((prev) => !prev);
  };

  return (
    // React.Fragment to group the two table rows (summary and details)
    <React.Fragment>
      {/* Primary draggable row (summary) */}
      <TableRow
        ref={setNodeRef}
        style={rowStyle}
        hover={!isDragging} // Only show hover when not dragging
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
        className={`rounded-lg ${isDragging ? 'opacity-70' : ''}`}
        onClick={handleRowClick} // Click to toggle accordion for the row area
        sx={{ cursor: isDragging ? 'grabbing' : 'pointer', '&.MuiTableRow-root': { '&:hover': { backgroundColor: isDragging ? 'inherit' : (isItemSelected ? 'rgb(229 231 235)' : '#f5f5f5') } } }} // Ensure hover doesn't interfere during drag
      >
        {/* Drag handle */}
        <TableCell className="w-12 px-2 text-center drag-handle" {...onDragHandleProps} {...listeners} {...attributes}>
          <DragIndicatorIcon className="text-gray-500 cursor-grab" />
        </TableCell>
        {/* Checkbox */}
        <TableCell padding="checkbox" className="checkbox-cell" sx={{ width: '48px' }}>
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={(event) => {
              event.stopPropagation(); // Prevent row click from firing
              handleClick(event, row.id);
            }}
            className="rounded-md"
          />
        </TableCell>
        {/* Visible data cells */}
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            className="py-3 px-4 text-gray-800"
            sx={{ minWidth: column.minWidth }}
          >
            {row[column.id]}
          </TableCell>
        ))}
        {/* Expansion indicator */}
        <TableCell sx={{ width: '40px', textAlign: 'center' }}>
          <IconButton
            size="small"
            onClick={handleAccordionIconClick} // Use dedicated handler for the icon
            aria-expanded={expanded}
            aria-label="expand row"
            className="expand-button" // Add a class for identification in parent click handler
          >
            <ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Accordion Details row (conditionally rendered) */}
      {expanded && (
        <TableRow className="bg-gray-50">
          <TableCell colSpan={totalHeaderColumns} sx={{ padding: 0, borderBottom: 'none' }}>
            {/* Using a dummy Accordion component here just to wrap AccordionDetails for styling/structure */}
            <Accordion expanded={true} disableGutters sx={{ boxShadow: 'none', '&:before': { display: 'none' }, borderRadius: '0 0 8px 8px' }}>
                <AccordionDetails className="p-4 rounded-b-lg">
                <Typography variant="body2" className="text-gray-700 font-semibold mb-2">
                    Detailed Information:
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(row).map(([key, value]) => (
                    <div key={key} className="flex">
                        <span className="font-medium capitalize mr-2">{key}:</span>
                        <span>{String(value)}</span>
                    </div>
                    ))}
                </div>
                </AccordionDetails>
            </Accordion>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

// Sortable Column Header Component
const SortableColumnHeader = ({ column, orderBy, order, handleRequestSort, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1300 : 'auto',
    position: 'relative',
    whiteSpace: 'nowrap', // Prevent text wrapping in header
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      align={column.numeric ? 'right' : 'left'}
      sortDirection={orderBy === column.id ? order : false}
      className={`cursor-pointer py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => handleRequestSort(column.id)}
      sx={{ minWidth: column.minWidth }}
      {...attributes} // Apply attributes and listeners directly for drag
      {...listeners}
    >
      {column.label}
      {orderBy === column.id ? (
        <Box component="span" sx={visuallyHidden}>
          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
        </Box>
      ) : null}
      {orderBy === column.id && (
        order === 'asc' ? <ArrowUpwardIcon className="inline-block ml-1" /> : <ArrowDownwardIcon className="inline-block ml-1" />
      )}
    </TableCell>
  );
};


// Main App Component
export const PolicyManagement = ()=>  {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');
  const [rows, setRows] = useState(initialRows);
  const [allColumns, setAllColumns] = useState(defaultColumns); // State for all columns, including order
  const [visibleColumnIds, setVisibleColumnIds] = useState(defaultColumns.map(col => col.id)); // State for visible column IDs
  const [columnMenuAnchorEl, setColumnMenuAnchorEl] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // State to track if row dragging is active
  const [isColumnDragging, setIsColumnDragging] = useState(false); // State to track if column dragging is active


  const handleColumnMenuClick = (event) => {
    setColumnMenuAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchorEl(null);
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumnIds((prevVisibleColumnIds) =>
      prevVisibleColumnIds.includes(columnId)
        ? prevVisibleColumnIds.filter((id) => id !== columnId)
        : [...prevVisibleColumnIds, columnId]
    );
  };

  const handleRequestSort = (property) => {
    if (isDragging || isColumnDragging) return; // Prevent sorting while dragging rows or columns
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredAndSortedRows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Filtered and Sorted Rows
  const filteredAndSortedRows = useMemo(() => {
    let currentRows = [...rows]; // Always start with the current order of 'rows' state

    // Apply Filter
    if (filterText) {
      const lowerCaseFilter = filterText.toLowerCase();
      currentRows = currentRows.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(lowerCaseFilter)
        )
      );
    }

    // Apply Sort IF orderBy is set (i.e., not null) and not dragging
    if (!isDragging && !isColumnDragging && orderBy) {
        currentRows.sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            return order === 'asc' ? aValue - bValue : bValue - aValue;
        });
    }

    return currentRows;
  }, [rows, filterText, order, orderBy, isDragging, isColumnDragging]);


  // Dnd-kit sensors for rows
  const rowSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Dnd-kit sensors for columns (can be the same or separate if needed)
  const columnSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start for rows
  const handleRowDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle drag end for rows
  const handleRowDragEnd = useCallback((event) => {
    setIsDragging(false);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setRows((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });

    // Reset sorting state after drag-and-drop to ensure the new order persists visually
    setOrderBy(null);
    setOrder('asc');

  }, []);

  // Handle drag start for columns
  const handleColumnDragStart = useCallback(() => {
    setIsColumnDragging(true);
  }, []);

  // Handle drag end for columns
  const handleColumnDragEnd = useCallback((event) => {
    setIsColumnDragging(false);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setAllColumns((currentColumns) => {
      const oldIndex = currentColumns.findIndex((col) => col.id === active.id);
      const newIndex = currentColumns.findIndex((col) => col.id === over.id);
      const newOrderedColumns = arrayMove(currentColumns, oldIndex, newIndex);

      // Update visibleColumnIds based on the new order of allColumns
      setVisibleColumnIds(newOrderedColumns.filter(col => visibleColumnIds.includes(col.id)).map(col => col.id));
      return newOrderedColumns;
    });

    // Optionally reset sorting after column reorder if it makes sense for your UX
    setOrderBy(null);
    setOrder('asc');

  }, [visibleColumnIds]); // Add visibleColumnIds to dependencies


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredAndSortedRows.length) : 0;

  const displayedRows = useMemo(() => {
    return filteredAndSortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredAndSortedRows, page, rowsPerPage]);

  // Derive activeVisibleColumns based on the current order of allColumns
  const activeVisibleColumns = useMemo(() => {
    return allColumns.filter(col => visibleColumnIds.includes(col.id));
  }, [allColumns, visibleColumnIds]);

  // Calculate total columns for colSpan in TableCell
  // +1 for drag handle, +1 for checkbox, +1 for expand icon
  const totalHeaderColumns = activeVisibleColumns.length + 3;

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-inter">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Advanced Data Table
      </h1>

      <Paper className="w-full mb-8 rounded-lg shadow-lg">
        {/* Toolbar for search and column customization */}
        <Toolbar className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white border-b border-gray-200 rounded-t-lg">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-500" />
                </InputAdornment>
              ),
            }}
            className="mb-4 sm:mb-0 sm:w-1/3 w-full rounded-md"
          />
          <Box className="flex items-center">
            <Tooltip title="Filter list">
              <IconButton className="ml-2 rounded-full p-2">
                <FilterListIcon className="text-gray-600" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Customize columns">
              <IconButton onClick={handleColumnMenuClick} className="ml-2 rounded-full p-2">
                <ViewColumnIcon className="text-gray-600" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={columnMenuAnchorEl}
              open={Boolean(columnMenuAnchorEl)}
              onClose={handleColumnMenuClose}
              PaperProps={{
                className: "rounded-lg shadow-xl"
              }}
            >
              <Typography variant="subtitle2" className="px-4 py-2 font-semibold text-gray-700">
                Visible Columns
              </Typography>
              {allColumns.map((column) => ( // Use allColumns to ensure consistent order in menu
                <MenuItem key={column.id} onClick={() => handleToggleColumn(column.id)} className="rounded-md mx-2 my-1">
                  <ListItemIcon>
                    <Checkbox
                      checked={visibleColumnIds.includes(column.id)}
                      color="primary"
                      className="rounded-md"
                    />
                  </ListItemIcon>
                  <ListItemText primary={column.label} />
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>

        {/* Table Container */}
        <TableContainer component={Paper} className="rounded-b-lg overflow-x-auto">
          <DndContext
            sensors={rowSensors} // Use row sensors for table body
            collisionDetection={closestCenter}
            onDragStart={handleRowDragStart}
            onDragEnd={handleRowDragEnd}
          >
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              className="min-w-full divide-y divide-gray-200"
            >
              <DndContext
                sensors={columnSensors} // Use column sensors for table header
                collisionDetection={closestCenter}
                onDragStart={handleColumnDragStart}
                onDragEnd={handleColumnDragEnd}
              >
                <TableHead className="bg-gray-50 rounded-t-lg">
                  <TableRow className="rounded-t-lg">
                    {/* Non-draggable cells */}
                    <TableCell className="w-12"></TableCell>
                    <TableCell padding="checkbox" sx={{ width: '48px' }}>
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < filteredAndSortedRows.length}
                        checked={selected.length === filteredAndSortedRows.length && filteredAndSortedRows.length > 0}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                        className="rounded-md"
                      />
                    </TableCell>
                    {/* Sortable Column Headers */}
                    <SortableContext items={allColumns.map(col => col.id)} strategy={verticalListSortingStrategy}> {/* Use allColumns for sortable items */}
                      {activeVisibleColumns.map((column) => (
                        <SortableColumnHeader
                          key={column.id}
                          column={column}
                          orderBy={orderBy}
                          order={order}
                          handleRequestSort={handleRequestSort}
                          isDragging={isColumnDragging} // Pass column dragging state
                        />
                      ))}
                    </SortableContext>
                    {/* Header for the expand icon column */}
                    <TableCell sx={{ width: '40px', textAlign: 'center' }}></TableCell>
                  </TableRow>
                </TableHead>
              </DndContext> {/* Close DndContext for column reordering */}
              <SortableContext items={rows.map(row => row.id)} strategy={verticalListSortingStrategy}>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {displayedRows.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${row.id}`;

                    return (
                      <SortableTableRow
                          key={row.id}
                          row={row}
                          columns={activeVisibleColumns}
                          isItemSelected={isItemSelected}
                          labelId={labelId}
                          handleClick={handleClick}
                          onDragHandleProps={{ style: { cursor: 'grab' } }}
                          totalHeaderColumns={totalHeaderColumns}
                      />
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={totalHeaderColumns} />
                    </TableRow>
                  )}
                  {filteredAndSortedRows.length === 0 && !filterText && (
                    <TableRow>
                      <TableCell colSpan={totalHeaderColumns} className="text-center py-4 text-gray-500">
                        No data available.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredAndSortedRows.length === 0 && filterText && (
                    <TableRow>
                      <TableCell colSpan={totalHeaderColumns} className="text-center py-4 text-gray-500">
                        No results found for "{filterText}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="bg-white rounded-b-lg p-4"
        />
      </Paper>
    </div>
  );
}

