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
