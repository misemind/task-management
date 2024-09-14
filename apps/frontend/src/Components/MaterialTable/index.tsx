import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Paper, TextField, IconButton, TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface CustomTableProps<T> {
  data: T[];
  actionsHeader?: React.ReactNode; // Custom action for header only
}

export const CustomTable = <T extends {}>({ data, actionsHeader }: CustomTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | string>('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const lowerCaseSearch = event.target.value.toLowerCase();
    const filtered = data.filter(row =>
      Object.values(row).some(value => String(value).toLowerCase().includes(lowerCaseSearch))
    );
    setFilteredData(filtered);
  };

  const handleSort = (property: keyof T | string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[property as keyof T] || '';
      const bValue = b[property as keyof T] || '';
      return (aValue > bValue ? 1 : -1) * (isAsc ? 1 : -1);
    });

    setFilteredData(sortedData);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headers = Object.keys(data[0] || {});

  return (
    <Paper>
      <div style={{ padding: 16,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <TextField
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        {actionsHeader && <div style={{ marginTop: '16px' }}>{actionsHeader}</div>}
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>
                  <TableSortLabel
                    active={orderBy === header}
                    direction={orderBy === header ? order : 'asc'}
                    onClick={() => handleSort(header)}
                  >
                    {header?.toLocaleUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {String(row[header as keyof T])}
                  </TableCell>
                ))}
                {/* No actions cell in body */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
