import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useCreateOrderHook } from './useCreateOrderHook';

export const CreateOrder: React.FC = () => {
  const { createOrder, loading } = useCreateOrderHook();
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder({
      customerName,
      totalAmount: Number(totalAmount),
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Create Order</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          disabled={loading}
        />
        <TextField
          label="Total Amount"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </Box>
    </Container>
  );
};
