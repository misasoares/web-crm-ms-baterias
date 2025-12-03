
import { useState, useEffect } from 'react';
import { httpClient } from '../../../kernel/http/axios-client';
import { type Order, OrderType } from '../types';

export const useOrderListHook = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    fetchOrders();
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

  return { orders, loading, deleteOrder };
};
