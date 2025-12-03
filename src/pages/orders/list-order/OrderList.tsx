import React from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useOrderListHook } from './useOrderListHook';

export const OrderList: React.FC = () => {
  const { orders, loading } = useOrderListHook();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Pedidos</Typography>
        <Button variant="contained" component={Link} to="create">Criar Pedido</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.vehicle}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
