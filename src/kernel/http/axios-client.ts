/* eslint-disable @typescript-eslint/no-explicit-any */
import _axios, { isAxiosError } from 'axios';

import { env } from '../../envs';
import type { ResponseAPI, ResponseFile } from './types';

export const REQUEST_CANCELED = 'ERR_CANCELED';
export const CODE_REQUEST_CANCELED = -1;

function customAxios() {
  const axios = _axios.create();

  axios.defaults.baseURL = env.REACT_APP_API_URL;
  axios.interceptors.request.use(config => {
    const userToken = localStorage.getItem('ACCESS_TOKEN'); // Changed from 'jwt_access_token' to match previous step or I should update token.storage
    const token = userToken ? `Bearer ${userToken}` : '';
    config.headers.authorization = token;
    return config;
  });
  return {
    async doGet<T = any>(
      url: string,
      options?: {
        params?: Record<string, string>;
        query?: Record<string, string> | URLSearchParams;
        headers?: Record<string, boolean | string>;
        abortController?: AbortController;
      }
    ): Promise<ResponseAPI<T>> {
      try {
        const queries = new URLSearchParams(options?.query as any).toString();

        const response = await axios.get(`${url}${queries ? `?${queries}` : ''}`, {
          ...options?.params,
          headers: options?.headers as any,
          signal: options?.abortController?.signal
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            code: error.response.status,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }

        // se foi cancelado
        if (error.code === REQUEST_CANCELED) {
          return {
            success: false,
            code: CODE_REQUEST_CANCELED,
            message: 'A solicitação foi cancelada.',
            invalidFields: []
          };
        }

        return {
          code: 500,
          success: false,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    },

    doPost: async <T = any>(
      url: string,
      data: any,
      options?: { abortController?: AbortController }
    ): Promise<ResponseAPI<T>> => {
      try {
        const response = await axios.post(url, data, { signal: options?.abortController?.signal });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            code: error.response.status,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }

        // se foi cancelado
        if (error.code === REQUEST_CANCELED) {
          return {
            success: false,
            code: CODE_REQUEST_CANCELED,
            message: 'A solicitação foi cancelada.',
            invalidFields: []
          };
        }

        return {
          success: false,
          code: 500,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    },

    doPut: async <T = any>(
      url: string,
      data?: any,
      options?: {
        params?: Record<string, string>;
        query?: Record<string, string> | URLSearchParams;
        headers?: Record<string, boolean | string>;
        abortController?: AbortController;
      }
    ): Promise<ResponseAPI<T>> => {
      try {
        const response = await axios.put(url, data, {
          ...options?.params,
          headers: options?.headers as any,
          signal: options?.abortController?.signal
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            code: error.response.status,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }

        // se foi cancelado
        if (error.code === REQUEST_CANCELED) {
          return {
            success: false,
            code: CODE_REQUEST_CANCELED,
            message: 'A solicitação foi cancelada.',
            invalidFields: []
          };
        }

        return {
          success: false,
          code: 500,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    },

    doPatch: async <T = any>(
      url: string,
      data?: any,
      options?: {
        params?: Record<string, string>;
        query?: Record<string, string> | URLSearchParams;
        headers?: Record<string, boolean | string>;
        abortController?: AbortController;
      }
    ): Promise<ResponseAPI<T>> => {
      try {
        const response = await axios.patch(url, data, {
          ...options?.params,
          headers: options?.headers as any,
          signal: options?.abortController?.signal
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            code: error.response.status,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }

        // se foi cancelado
        if (error.code === REQUEST_CANCELED) {
          return {
            success: false,
            code: CODE_REQUEST_CANCELED,
            message: 'A solicitação foi cancelada.',
            invalidFields: []
          };
        }

        return {
          success: false,
          code: 500,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    },

    doDelete: async <T = any>(url: string, params?: any): Promise<ResponseAPI<any>> => {
      try {
        const response = await axios.delete(url, { params });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }
        return {
          success: false,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    },

    async doGetFile<T = any>(
      url: string,
      options?: {
        params?: Record<string, string>;
        query?: Record<string, string> | URLSearchParams;
        headers?: Record<string, boolean | string>;
      }
    ): Promise<ResponseFile> {
      try {
        const queries = new URLSearchParams(options?.query as any).toString();

        const response = await axios.get(`${url}${queries ? `?${queries}` : ''}`, {
          ...options?.params,
          headers: options?.headers as any
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            data: new Blob(),
            // success: false, // ResponseFile doesn't have success
            // code: error.response.status,
            // message: error.response.data.message,
            // invalidFields: error.response.data.invalidFields
          };
        }
        return {
          data: new Blob(),
          // code: 500,
          // success: false,
          // message: 'Erro inesperado, tente novamente mais tarde.',
          // invalidFields: []
        };
      }
    },

    async doGetXlsx(
      url: string,
      options?: {
        params?: Record<string, string>;
        query?: Record<string, string> | URLSearchParams;
        headers?: Record<string, boolean | string>;
        abortController?: AbortController;
      }
    ): Promise<Blob> {
      try {
        const queries = new URLSearchParams(options?.query as any).toString();

        const response = await axios.get(`${url}${queries ? `?${queries}` : ''}`, {
          params: options?.params,
          headers: options?.headers as any,
          signal: options?.abortController?.signal,
          responseType: 'blob'
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<any>, Error>(error) && error.response && !error.response.data.success) {
          throw new Error(
            JSON.stringify({
              success: false,
              code: error.response.status,
              message: error.response.data.message,
              invalidFields: error.response.data.invalidFields
            })
          );
        }

        if (error.code === REQUEST_CANCELED) {
          throw new Error(
            JSON.stringify({
              success: false,
              code: CODE_REQUEST_CANCELED,
              message: 'A solicitação foi cancelada.',
              invalidFields: []
            })
          );
        }

        throw new Error(
          JSON.stringify({
            success: false,
            code: 500,
            message: 'Erro inesperado, tente novamente mais tarde.',
            invalidFields: []
          })
        );
      }
    },

    doUpload: async <T = any>(url: string, data: any): Promise<ResponseAPI<any>> => {
      try {
        const response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }
        return {
          success: false,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    },

    async doGetPdf(
      url: string,
      options?: {
        params?: Record<string, string>;
        query?: Record<string, string> | URLSearchParams;
        headers?: Record<string, boolean | string>;
        abortController?: AbortController;
      }
    ): Promise<any> {
      try {
        const queries = new URLSearchParams(options?.query as any).toString();

        const response = await axios.get(`${url}${queries ? `?${queries}` : ''}`, {
          params: options?.params,
          headers: options?.headers as any,
          signal: options?.abortController?.signal,
          responseType: 'blob'
        });

        return response.data;
      } catch (error: any) {
        if (isAxiosError<ResponseAPI<any>, Error>(error) && error.response && !error.response.data.success) {
          return {
            success: false,
            code: error.response.status,
            message: error.response.data.message,
            invalidFields: error.response.data.invalidFields
          };
        }

        // Se a requisição foi cancelada
        if (error.code === REQUEST_CANCELED) {
          return {
            success: false,
            code: CODE_REQUEST_CANCELED,
            message: 'A solicitação foi cancelada.',
            invalidFields: []
          };
        }

        return {
          success: false,
          code: 500,
          message: 'Erro inesperado, tente novamente mais tarde.',
          invalidFields: []
        };
      }
    }
  };
}

export const httpClient = customAxios();
