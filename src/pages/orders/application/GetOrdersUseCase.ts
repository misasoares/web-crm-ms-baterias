import type { Order } from '../domain/Order.entity';
import type { OrderRepository } from '../domain/OrderRepository.interface';

export class GetOrdersUseCase {
  private readonly orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(): Promise<Order[]> {
    const orders = await this.orderRepository.getOrders();
    // Filter out cancelled orders (Active Orders)
    // Assuming 'Active' implies not cancelled.
    return orders.filter(
      (order) => order.reminder?.status !== 'CANCELLED',
    );
  }
}
