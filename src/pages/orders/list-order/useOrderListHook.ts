import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetOrdersUseCase } from '../application/GetOrdersUseCase';
import { HttpOrderRepository } from '../infra/HttpOrderRepository';
import { type Order } from '../domain/Order.entity';

export const useOrderListHook = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Instantiate dependencies (could be moved to a DI container or Context)
  const repository = useMemo(() => new HttpOrderRepository(), []);
  const getOrdersUseCase = useMemo(() => new GetOrdersUseCase(repository), [repository]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrdersUseCase.execute();
      setOrders(data);
    } catch (error) {
      console.warn('Error fetching orders', error);
      // Optional: setOrders([]) or handle error
    }
    setLoading(false);
  }, [getOrdersUseCase]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteOrder = async (id: string) => {
    try {
      const success = await repository.deleteOrder(id);
      if (success) {
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
      // Mapping the partial update data to the domain entity shape if needed,
      // but repo accepts Partial<Order>.
      // The hook input `data` matches Partial<Order> subset.
      const success = await repository.updateOrder(id, data);
      if (success) {
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
