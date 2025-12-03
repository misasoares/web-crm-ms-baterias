export interface ResponseAPI<T = any> {
  success: boolean;
  code?: number;
  message?: string;
  invalidFields?: any[];
  data?: T;
}

export interface ResponseFile {
  data: Blob;
  fileName?: string;
}
