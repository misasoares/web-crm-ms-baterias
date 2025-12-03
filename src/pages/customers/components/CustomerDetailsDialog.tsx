import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { httpClient } from '../../../kernel/http/axios-client';
import type { Customer, Order } from '../../../kernel/http/types';
import { PhoneMaskCustom } from '../../orders/create-order/CreateOrder';

interface CustomerDetailsDialogProps {
  open: boolean;
  customerId: string;
  onClose: () => void;
}

interface CustomerWithOrders extends Customer {
  orders: Order[];
}

export const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
  open,
  customerId,
  onClose,
}) => {
  const [customer, setCustomer] = useState<CustomerWithOrders | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      try {
        const response = await httpClient.doGet<CustomerWithOrders>(
          `/customers/${customerId}`,
        );
        if (response.success && response.data) {
          setCustomer(response.data);
          setName(response.data.name);
          setPhone(response.data.phone);
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && customerId) {
      fetchCustomerDetails();
    }
  }, [open, customerId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await httpClient.doPatch(`/customers/${customerId}`, {
        name,
        phone: phone.replace(/\D/g, ''),
      });
      if (response.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    customer && (name !== customer.name || phone !== customer.phone);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalhes do Cliente</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nome"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Telefone"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputProps={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  inputComponent: PhoneMaskCustom as any,
                }}
              />
            </Box>

            <Divider />

            <Typography variant="h6">Pedidos</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Veículo</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customer?.orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.vehicle}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!customer?.orders || customer.orders.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!hasChanges || saving}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
