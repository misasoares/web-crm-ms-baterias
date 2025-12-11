import React from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { useOrderListHook } from './useOrderListHook';
import type { Order } from '../types';

export const OrderList: React.FC = () => {
  const { orders, loading, deleteOrder, updateOrder } = useOrderListHook();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<{
    id: string;
    customerName: string;
    type: string;
    vehicle: string;
    product: string;
  } | null>(null);

  const [editForm, setEditForm] = React.useState({
    vehicle: '',
    product: '',
  });

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      await deleteOrder(orderToDelete);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder({
      id: order.id,
      customerName: order.customer?.name || 'N/A',
      type: order.type,
      vehicle: order.vehicle,
      product: order.product,
    });
    setEditForm({
      vehicle: order.vehicle,
      product: order.product,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleEditSave = async () => {
    if (selectedOrder) {
      const success = await updateOrder(selectedOrder.id, editForm);
      if (success) {
        handleEditClose();
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Pedidos</Typography>
        <Button variant="contained" component={Link} to="create">
          Criar Pedido
        </Button>
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
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.customer?.name || 'N/A'}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.vehicle}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(order)}
                    color="warning"
                    disabled={
                      order.type === 'OIL' &&
                      order.reminder?.status !== 'PENDING'
                    }
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(order.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este pedido? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="primary"
            autoFocus
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Pedido</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Cliente"
              value={selectedOrder?.customerName || ''}
              disabled
              fullWidth
            />
            <TextField
              label="Tipo"
              value={selectedOrder?.type || ''}
              disabled
              fullWidth
            />
            <TextField
              label="Veículo"
              value={editForm.vehicle}
              onChange={(e) =>
                setEditForm({ ...editForm, vehicle: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Produto"
              value={editForm.product}
              onChange={(e) =>
                setEditForm({ ...editForm, product: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
