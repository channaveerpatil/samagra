import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useDebounce from '@/hooks/useDebounce';
import useNotification from '@/hooks/useNotification';
import { logger } from '@/lib/logger';
import { customersApi, customersQueryKeys } from '../api/customersApi';
import type { Customer, CustomerInput } from '../types';

export default function useCustomers() {
  const { notify } = useNotification();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  const {
    data: customers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: customersQueryKeys.lists(),
    queryFn: customersApi.list,
  });

  React.useEffect(() => {
    if (error) {
      logger.error('[useCustomers] Failed to load customers', error);
      notify({ message: 'Failed to load customers', severity: 'error' });
    }
  }, [error, notify]);

  const filteredCustomers = React.useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.company].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  }, [customers, debouncedSearchTerm]);

  const invalidateCustomers = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() }),
    [queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (input: CustomerInput) => customersApi.create(input),
    onSuccess: async (created) => {
      await invalidateCustomers();
      notify({ message: `${created.name} was added`, severity: 'success' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) =>
      customersApi.update(id, input),
    onSuccess: async (updated) => {
      await invalidateCustomers();
      notify({ message: `${updated.name} was updated`, severity: 'success' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (customer: Customer) => customersApi.remove(customer.id),
    onSuccess: async (_result, customer) => {
      await invalidateCustomers();
      notify({ message: `${customer.name} was deleted`, severity: 'info' });
    },
  });

  const createCustomer = React.useCallback(
    (input: CustomerInput) => createMutation.mutateAsync(input),
    [createMutation],
  );

  const updateCustomer = React.useCallback(
    (id: string, input: CustomerInput) => updateMutation.mutateAsync({ id, input }),
    [updateMutation],
  );

  const deleteCustomer = React.useCallback(
    (customer: Customer) => deleteMutation.mutateAsync(customer),
    [deleteMutation],
  );

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    isLoading,
    searchTerm,
    setSearchTerm,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refresh: refetch,
  };
}
