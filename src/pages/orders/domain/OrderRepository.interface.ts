import type { Order } from './Order.entity';


export interface OrderRepository {
  getOrders(): Promise<Order[]>;
  deleteOrder(id: string): Promise<boolean>;
  updateOrder(id: string, data: Partial<Order>): Promise<boolean>;
}
