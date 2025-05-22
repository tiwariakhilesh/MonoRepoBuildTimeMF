// src/components/MaterialUITable.tsx

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper, TableSortLabel } from '@mui/material';

// Define the type for each row data
interface RowData {
  id: number;
  name: string;
  age: number;
  city: string;
}

// Sample data for the table
const rows: RowData[] = [
  { id: 1, name: 'Case 1', age: 28, city: 'New York' },
  { id: 2, name: 'Case 2', age: 34, city: 'Los Angeles' },
  { id: 3, name: 'Case 3', age: 45, city: 'Chicago' },
  { id: 4, name: 'Case 4', age: 23, city: 'Houston' },
  { id: 5, name: 'Case 5', age: 38, city: 'Miami' },
  { id: 6, name: 'Case 6', age: 32, city: 'San Francisco' },
  { id: 7, name: 'Case 7', age: 40, city: 'Boston' },
  { id: 8, name: 'Case 8', age: 29, city: 'Dallas' },
  { id: 9, name: 'Case 9', age: 26, city: 'Austin' },
  { id: 10, name: 'Case 10', age: 36, city: 'Seattle' }
];

// Define column types
interface Column {
  id: keyof RowData; // This ensures the column IDs match with the keys of RowData
  label: string;
}

const columns: Column[] = [
  { id: 'name', label: 'Case' },
  { id: 'age', label: 'id' },
  { id: 'city', label: 'Location' }
];

export const CaseManagement: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof RowData>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle sorting logic
  const handleRequestSort = (property: keyof RowData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort the data
  const sortedRows = rows.sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (orderBy === 'age') {
      return order === 'asc' ? a.age - b.age : b.age - a.age;
    }
    if (orderBy === 'city') {
      return order === 'asc' ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city);
    }
    return 0;
  });

  // Handle page changes
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Reset to page 0 when rows per page changes
  };

  return (
    <section style={{width:"60vw"}}>
    <h1>Incidents Table</h1>
   
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow hover key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.city}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
    </section>
  );
};

