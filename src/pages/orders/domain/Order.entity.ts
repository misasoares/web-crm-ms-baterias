export const OrderType = {
  BATTERY: 'BATTERY',
  OIL: 'OIL',
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  type: OrderType;
  vehicle: string;
  product: string;
  customerId: string;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
  reminder?: {
    status: 'PENDING' | 'SENT' | 'CANCELLED' | 'FAILED';
  };
}
