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
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCustomerListHook } from './useCustomerListHook';
import { CustomerDetailsDialog } from '../components/CustomerDetailsDialog';
import type { Customer } from '../../../kernel/http/types';

export const CustomerList: React.FC = () => {
  const { customers, loading, search, setSearch, refreshCustomers } =
    useCustomerListHook();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
    refreshCustomers();
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Clientes</Typography>
        <TextField
          placeholder="Buscar cliente..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Criação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                hover
                onClick={() => handleCustomerClick(customer)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCustomer && (
        <CustomerDetailsDialog
          open={!!selectedCustomer}
          customerId={selectedCustomer.id}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
};
