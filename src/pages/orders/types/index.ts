export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CreateOrderDTO {
  customerName: string;
  totalAmount: number;
}
