import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../../../kernel/http/axios-client';
import type { Customer } from '../../../kernel/http/types';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export const useCustomerListHook = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await httpClient.doGet<Customer[]>('/customers', {
        query: { search: debouncedSearch },
      });
      if (response.success) {
        setCustomers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    search,
    setSearch,
    refreshCustomers: fetchCustomers,
  };
};
