import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../../../kernel/http/axios-client';
import { type Order } from '../types';

export const useOrderListHook = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await httpClient.doGet<Order[]>('/orders');
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.warn('Backend not found, using mock data', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteOrder = async (id: string) => {
    try {
      const response = await httpClient.doDelete(`/orders/${id}`);
      if (response.success) {
        await fetchOrders();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  };

  const updateOrder = async (
    id: string,
    data: { vehicle: string; product: string },
  ) => {
    try {
      const response = await httpClient.doPatch<Order>(`/orders/${id}`, data);
      if (response.success) {
        await fetchOrders();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  };

  return { orders, loading, deleteOrder, updateOrder };
};
