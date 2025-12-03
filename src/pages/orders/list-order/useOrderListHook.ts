
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
        // Mock data for demo
        setOrders([
          { 
            id: '1', 
            type: OrderType.BATTERY,
            vehicle: 'Toyota Corolla',
            product: 'Moura 60Ah',
            customerId: '1',
            customer: { id: '1', name: 'John Doe', phone: '123456789' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          { 
            id: '2', 
            type: OrderType.OIL,
            vehicle: 'Honda Civic',
            product: 'Óleo 5W30',
            customerId: '2',
            customer: { id: '2', name: 'Jane Smith', phone: '987654321' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
        ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading };
};
