import type { OrderRepository } from '../domain/OrderRepository.interface';
import type { Order } from '../domain/Order.entity';
import { httpClient } from '../../../kernel/http/axios-client';

export class HttpOrderRepository implements OrderRepository {
  async getOrders(): Promise<Order[]> {
    const response = await httpClient.doGet<Order[]>('/orders');
    if (response.success && response.data) {
      return response.data;
    }
    // Return empty array or throw error if fetch failed? 
    // The previous hook just ignored error (logged warning) and loading false.
    // Clean Architecture Repo usually returns promise.
    // If error, maybe throw? Or return empty.
    // Using empty to be safe with existing UI expecting array.
    return [];
  }

  async deleteOrder(id: string): Promise<boolean> {
    const response = await httpClient.doDelete(`/orders/${id}`);
    return response.success ?? false;
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<boolean> {
    // Note: Previous hook expected { vehicle: string; product: string } specifically,
    // but the Interface is Partial<Order>.
    // httpClient doPatch generic type <Order> or <any>?
    // The hook used <Order> for return type but passed data.
    const response = await httpClient.doPatch<Order>(`/orders/${id}`, data);
    return response.success ?? false;
  }
}
