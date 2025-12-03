import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../kernel/http/axios-client';
import type { CreateOrderDTO, Customer } from '../types';
import { debounce } from '@mui/material/utils';

export const useCreateOrderHook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const searchCustomers = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setCustomers([]);
          return;
        }
        try {
          const response = await httpClient.doGet<Customer[]>(
            `/customers?search=${query}`,
          );

          if (response.success && response.data) {
            setCustomers(response.data);
          }
        } catch (error) {
          console.warn('Failed to fetch customers', error);
        }
      }, 300),
    [],
  );

  const createOrder = async (data: CreateOrderDTO) => {
    setLoading(true);
    try {
      const response = await httpClient.doPost('/orders', data);
      if (response.success) {
        navigate('/orders');
      }
    } catch (error) {
      console.warn('Backend error', error);
    }
    setLoading(false);
  };

  return { createOrder, loading, customers, searchCustomers };
};
