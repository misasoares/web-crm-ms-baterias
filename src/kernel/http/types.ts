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
