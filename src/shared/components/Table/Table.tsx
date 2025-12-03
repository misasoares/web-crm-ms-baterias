import React, { useState } from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Typography,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  onSelect?: (selectedRows: T[]) => void;
  actions?: (row: T) => React.ReactNode;
  title?: string;
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  onSort,
  onSelect,
  actions,
  title,
}: TableProps<T>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => String(n.id));
      setSelected(newSelected);
      if (onSelect) onSelect(data);
      return;
    }
    setSelected([]);
    if (onSelect) onSelect([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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
    if (onSelect) {
      const selectedRows = data.filter((row) =>
        newSelected.includes(String(row.id)),
      );
      onSelect(selectedRows);
    }
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || typeof column.accessor !== 'string') return;

    const key = column.accessor as keyof T;
    const isAsc = sortConfig?.key === key && sortConfig.direction === 'asc';
    const direction = isAsc ? 'desc' : 'asc';

    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Box className="w-full">
      {title && (
        <Typography
          variant="h6"
          component="div"
          className="p-4 font-bold text-gray-800 dark:text-white"
        >
          {title}
        </Typography>
      )}
      <TableContainer
        component={Paper}
        className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg-gray-50 dark:bg-gray-900/50">
            <TableRow>
              <TableCell
                padding="checkbox"
                className="border-b border-gray-100 dark:border-gray-700"
              >
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < data.length
                  }
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAll}
                  className="text-gray-400 dark:text-gray-500"
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align || 'left'}
                  className="border-b border-gray-100 dark:border-gray-700 py-4"
                >
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${column.sortable ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200' : ''}`}
                    onClick={() => handleSort(column)}
                  >
                    {column.header}
                    {column.sortable &&
                      sortConfig?.key === column.accessor &&
                      (sortConfig.direction === 'asc' ? (
                        <ArrowUpward fontSize="small" className="w-4 h-4" />
                      ) : (
                        <ArrowDownward fontSize="small" className="w-4 h-4" />
                      ))}
                    {column.sortable && sortConfig?.key !== column.accessor && (
                      <div className="w-4 h-4 opacity-0 group-hover:opacity-50">
                        <ArrowUpward fontSize="small" className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  align="right"
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </span>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isItemSelected = isSelected(String(row.id));
              return (
                <TableRow
                  hover
                  onClick={() => handleClick(String(row.id))}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  className={`cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isItemSelected ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                >
                  <TableCell
                    padding="checkbox"
                    className="border-b border-gray-100 dark:border-gray-700"
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      className={`text-gray-300 dark:text-gray-600 ${isItemSelected ? 'text-red-600 dark:text-red-500' : ''}`}
                    />
                  </TableCell>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.align || 'left'}
                      className="border-b border-gray-100 dark:border-gray-700 py-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {column.render
                        ? column.render(row)
                        : typeof column.accessor === 'function'
                          ? column.accessor(row)
                          : (row[column.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell
                      align="right"
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex justify-end gap-2">
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
}
