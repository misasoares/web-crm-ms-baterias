import { describe, it, expect, vi } from 'vitest';
import { GetOrdersUseCase } from './GetOrdersUseCase';
import { type Order, OrderType } from '../domain/Order.entity';
import type { OrderRepository } from '../domain/OrderRepository.interface';

describe('GetOrdersUseCase', () => {
  it('should return only active orders (not cancelled)', async () => {
    // 1. Mock Repository
    const mockOrders: Order[] = [
      {
        id: '1',
        type: OrderType.BATTERY,
        vehicle: 'A',
        product: 'B',
        customerId: 'c1',
        createdAt: '',
        updatedAt: '',
        reminder: { status: 'PENDING' },
      },
      {
        id: '2',
        type: OrderType.OIL,
        vehicle: 'C',
        product: 'D',
        customerId: 'c2',
        createdAt: '',
        updatedAt: '',
        reminder: { status: 'CANCELLED' },
      },
      {
        id: '3',
        type: OrderType.BATTERY,
        vehicle: 'E',
        product: 'F',
        customerId: 'c3',
        createdAt: '',
        updatedAt: '',
      },
    ];

    const mockRepo: OrderRepository = {
      getOrders: vi.fn().mockResolvedValue(mockOrders),
      deleteOrder: vi.fn(),
      updateOrder: vi.fn(),
    };

    // 2. Execute UseCase
    const useCase = new GetOrdersUseCase(mockRepo);
    const result = await useCase.execute();

    // 3. Assertions
    expect(result).toHaveLength(2);
    expect(result.find((o: Order) => o.id === '1')).toBeDefined();
    expect(result.find((o: Order) => o.id === '3')).toBeDefined();
    expect(result.find((o: Order) => o.id === '2')).toBeUndefined();
    expect(mockRepo.getOrders).toHaveBeenCalledTimes(1);
  });
});
