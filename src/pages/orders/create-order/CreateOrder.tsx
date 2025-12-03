import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { useCreateOrderHook } from './useCreateOrderHook';
import { OrderType, type Customer } from '../types';
import { IMaskInput } from 'react-imask';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function PhoneMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+{55} (00) 9 0000-0000"
        lazy={false}
        inputRef={ref as React.RefCallback<HTMLInputElement>}
        onAccept={(value: string) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  },
);
export const CreateOrder: React.FC = () => {
  const { createOrder, loading, searchCustomers, customers } =
    useCreateOrderHook();
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    type: '' as OrderType | '',
    vehicle: '',
    product: '',
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerChange = (
    _: React.SyntheticEvent,
    newValue: string | Customer | null,
  ) => {
    if (typeof newValue === 'string') {
      // User typed a new name
      setSelectedCustomer(null);
      setFormData({
        ...formData,
        customerId: '',
        customerName: newValue,
        customerPhone: '', // Reset phone for new customer
      });
    } else if (newValue && typeof newValue === 'object') {
      // User selected an existing customer
      setSelectedCustomer(newValue);
      setFormData({
        ...formData,
        customerId: newValue.id,
        customerName: newValue.name,
        customerPhone: newValue.phone || '',
      });
    } else {
      // Cleared
      setSelectedCustomer(null);
      setFormData({
        ...formData,
        customerId: '',
        customerName: '',
        customerPhone: '',
      });
    }
  };

  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    searchCustomers(newInputValue);
    if (!selectedCustomer) {
      setFormData((prev) => ({ ...prev, customerName: newInputValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type && formData.vehicle && formData.product) {
      // If customerId is present, we use it. If not, we need name and phone.
      if (
        formData.customerId ||
        (formData.customerName && formData.customerPhone)
      ) {
        await createOrder({
          customerId: formData.customerId || undefined,
          customerName: formData.customerId ? undefined : formData.customerName,
          customerPhone: formData.customerId
            ? undefined
            : formData.customerPhone,
          type: formData.type as OrderType,
          vehicle: formData.vehicle,
          product: formData.product,
        });
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Criar Pedido
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Autocomplete
          freeSolo
          options={customers}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.name
          }
          filterOptions={(x) => x}
          value={selectedCustomer}
          onChange={handleCustomerChange}
          onInputChange={handleInputChange}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente"
              required={!formData.customerName}
              disabled={loading}
            />
          )}
        />

        <TextField
          label="Telefone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          required
          disabled={loading || !!formData.customerId}
          InputProps={{
            inputComponent: PhoneMaskCustom as never,
          }}
        />

        <TextField
          select
          label="Tipo de Pedido"
          name="type"
          value={formData.type}
          onChange={handleSelectChange}
          required
          disabled={loading}
          SelectProps={{
            native: true,
          }}
        >
          <option value=""></option>
          <option value={OrderType.BATTERY}>Bateria</option>
          <option value={OrderType.OIL}>Óleo</option>
        </TextField>

        <TextField
          label="Veículo"
          name="vehicle"
          value={formData.vehicle}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Ex: Toyota Corolla"
        />

        <TextField
          label="Produto"
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Ex: Bateria Moura 60Ah"
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Criar'}
        </Button>
      </Box>
    </Container>
  );
};
