import { apiClient } from '@/lib/apiClient';
import type { User, UserInput } from '../types';

const BASE_PATH = '/users';

export const usersApi = {
  list(): Promise<User[]> {
    return apiClient.get<User[]>(BASE_PATH);
  },

  create(input: UserInput): Promise<User> {
    return apiClient.post<User>(BASE_PATH, input);
  },

  update(id: string, input: UserInput): Promise<User> {
    return apiClient.put<User>(`${BASE_PATH}/${id}`, input);
  },
};

export const usersQueryKeys = {
  all: ['users'] as const,
  lists: () => [...usersQueryKeys.all, 'list'] as const,
};
