import { useState, useEffect } from 'react';
import { httpClient } from '../../../kernel/http/axios-client';
import type { Order } from '../types';

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
      const mockOrders: Order[] = [
        { id: '1', customerName: 'John Doe', totalAmount: 100, status: 'pending', createdAt: new Date().toISOString() },
        { id: '2', customerName: 'Jane Smith', totalAmount: 200, status: 'completed', createdAt: new Date().toISOString() },
      ];
      setOrders(mockOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading };
};
