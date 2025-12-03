export interface ResponseAPI<T = unknown> {
  success: boolean;
  code: number;
  message?: string;
  invalidFields?: unknown[];
  data?: T;
}

export interface ResponseFile {
  data: Blob;
  fileName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  vehicle: string;
  product: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer?: Customer;
}

export type ReminderStatus = 'PENDING' | 'SENT' | 'CANCELLED' | 'FAILED';

export const ReminderStatus = {
  PENDING: 'PENDING' as ReminderStatus,
  SENT: 'SENT' as ReminderStatus,
  CANCELLED: 'CANCELLED' as ReminderStatus,
  FAILED: 'FAILED' as ReminderStatus,
};

export interface OilChangeReminder {
  id: string;
  orderId: string;
  scheduledFor: string;
  status: ReminderStatus;
  sentAt: string | null;
  messageId: string | null;
  cancelledAt: string | null;
  attempts: number;
  lastAttemptAt: string | null;
  createdAt: string;
  updatedAt: string;
  order?: Order;
}
