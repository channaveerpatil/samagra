import { apiClient } from '@/lib/apiClient';
import type { Customer, CustomerInput } from '../types';

const BASE_PATH = '/customers';

export const customersApi = {
  list(): Promise<Customer[]> {
    return apiClient.get<Customer[]>(BASE_PATH);
  },

  get(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`${BASE_PATH}/${id}`);
  },

  create(input: CustomerInput): Promise<Customer> {
    return apiClient.post<Customer>(BASE_PATH, input);
  },

  update(id: string, input: CustomerInput): Promise<Customer> {
    return apiClient.put<Customer>(`${BASE_PATH}/${id}`, input);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },
};

export const customersQueryKeys = {
  all: ['customers'] as const,
  lists: () => [...customersQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...customersQueryKeys.all, 'detail', id] as const,
};
